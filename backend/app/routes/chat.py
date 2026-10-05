"""Route untuk chat dengan Gemini.

Mendukung:
- Chat teks biasa
- Chat dengan gambar (multipart/form-data)
- Response streaming
"""

import base64
import io
import json

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.core.security import get_current_user
from app.services import gemini, stock as stock_service
from app.services.image_intent import detect_image_request
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.message import MessageOut

router = APIRouter(prefix="/api/chat", tags=["chat"])

# MIME type gambar yang diizinkan
ALLOWED_IMAGE_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
}

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


def _make_title_from_message(text: str) -> str:
    """Buat judul conversation dari pesan pertama user."""
    clean = text.strip()
    if not clean:
        return "New Chat"
    return clean[:30] + ("..." if len(clean) > 30 else "")


def _load_history(db: Session, conversation_id: int) -> list[dict]:
    """Ambil riwayat percakapan untuk dikirim sebagai konteks ke Gemini."""
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    history = []
    for m in messages:
        if m.sender in ("user", "ai"):
            history.append({"sender": m.sender, "text": m.text})
    return history


def _save_message(db: Session, conversation_id: int, sender: str, text: str, image_data=None) -> Message:
    """Simpan pesan ke database."""
    msg = Message(
        conversation_id=conversation_id,
        sender=sender,
        text=text,
        image_data=image_data,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def _image_urls_to_data(urls: list[str]) -> str | None:
    """Simpan daftar URL gambar AI sebagai JSON di kolom image_data."""
    if not urls:
        return None
    return json.dumps(urls)


def _get_owned_conversation(db: Session, conversation_id: int, user_id: int) -> Conversation:
    """Ambil conversation milik user, atau buat baru jika belum ada."""
    if conversation_id:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
            .first()
        )
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation tidak ditemukan")
        return conversation

    # Buat conversation baru
    conversation = Conversation(
        user_id=user_id,
        title="New Chat",
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Chat teks biasa (non-streaming)."""
    conversation = _get_owned_conversation(db, req.conversation_id, current_user.id)

    # Update judul jika masih New Chat & ini pesan pertama
    has_user_message = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id,
            Message.sender == "user",
        )
        .first()
    )
    if not has_user_message:
        conversation.title = _make_title_from_message(req.message)
        db.commit()

    # Simpan pesan user
    user_msg = _save_message(db, conversation.id, "user", req.message)

    # Ambil riwayat (termasuk pesan user barusan) untuk konteks
    history = _load_history(db, conversation.id)

    try:
        ai_text = gemini.chat(history=history, user_text=req.message)
    except Exception:
        db.delete(user_msg)
        db.commit()
        raise HTTPException(status_code=502, detail="Gagal mendapatkan respons dari Gemini")

    if not ai_text.strip():
        db.delete(user_msg)
        db.commit()
        raise HTTPException(status_code=502, detail="Gemini mengembalikan respons kosong")

    # Simpan pesan AI
    ai_msg = _save_message(db, conversation.id, "ai", ai_text.strip())

    return ChatResponse(message=MessageOut.model_validate(ai_msg))


@router.post("/stream")
def chat_stream(
    message: str = Form(...),
    conversation_id: int | None = Form(None),
    image: UploadFile | None = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Chat dengan response streaming. Bisa disertai gambar (multipart/form-data)."""
    conversation = _get_owned_conversation(db, conversation_id, current_user.id)

    # Proses gambar jika ada
    image_payload = None
    image_b64_for_db = None

    if image is not None:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Tipe gambar tidak didukung")

        data = image.file.read()
        if len(data) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Ukuran gambar melebihi 10 MB")

        image_payload = {
            "mime_type": image.content_type,
            "data": data,
        }
        # Simpan sebagai base64 supaya bisa dirender ulang
        image_b64_for_db = base64.b64encode(data).decode("utf-8")

    # Update judul jika pesan pertama
    has_user_message = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id,
            Message.sender == "user",
        )
        .first()
    )
    if not has_user_message:
        conversation.title = _make_title_from_message(message)
        db.commit()

    # Simpan pesan user
    _save_message(db, conversation.id, "user", message, image_b64_for_db)

    # Ambil riwayat untuk konteks
    history = _load_history(db, conversation.id)

    def event_stream():
        collected = []

        # Deteksi permintaan foto/gambar
        image_urls = []
        image_subject = detect_image_request(message) if not image_payload else None
        if image_subject:
            image_urls = stock_service.search_photos(image_subject)

        try:
            for chunk in gemini.chat_stream(
                history=history,
                user_text=message,
                image=image_payload,
            ):
                collected.append(chunk)
                yield f"data: {chunk}\n\n"

            # Streaming selesai, simpan respons AI ke database
            full_text = "".join(collected).strip()

            # Simpan menggunakan session baru (karena db di thread utama)
            from app.database.connection import SessionLocal
            session = SessionLocal()
            try:
                _save_message(
                    session,
                    conversation.id,
                    "ai",
                    full_text,
                    _image_urls_to_data(image_urls),
                )
            finally:
                session.close()

            # Kirim event khusus berisi URL gambar (jika ada)
            if image_urls:
                yield f"data: [IMAGES] {json.dumps(image_urls)}\n\n"

            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
