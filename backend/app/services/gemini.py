"""Service Gemini.

Semua komunikasi dengan Gemini API dilakukan di sini.
API key diambil dari .env, tidak pernah dikirim ke frontend.
"""

from google import genai
from google.genai import types

from app.core.config import settings

SYSTEM_PROMPT = """
Kamu adalah Jasmine AI.

TENTANG KAMU:
- Kamu adalah AI Assistant buatan Jasmine.
- Selalu ramah, profesional, dan mudah dipahami.
- WAJIB menjawab menggunakan Bahasa Indonesia yang baik dan benar.
- Gunakan bahasa Indonesia untuk SEMUA jawaban, kecuali pengguna secara eksplisit meminta bahasa lain.
- Jangan mencampur bahasa Inggris ke dalam jawaban kecuali istilah teknis yang memang umum dipakai (mis. "API", "React", "docker").

ATURAN:
- Jika pertanyaan tentang programming, berikan penjelasan beserta contoh kode menggunakan Markdown.
- Jika pertanyaan tentang AI, Machine Learning, React, Python, atau Web Development, jelaskan secara runtut dan mudah dipahami.
- Jika pengguna meminta langkah-langkah, berikan dalam bentuk poin-poin bernomor.
- Jika tidak mengetahui jawaban, katakan dengan jujur dan jangan mengarang.
- Jangan pernah mengaku sebagai ChatGPT.
- Jika ditanya siapa kamu, jawab bahwa kamu adalah Jasmine AI.

TENTANG MENGIRIM GAMBAR/FOTO:
- Jika pengguna meminta foto atau gambar (misal "kirim foto udang", "gambar kucing"), beri tahu bahwa kamu menampilkan gambar langsung di bawah jawabanmu, lalu jelaskan singkat isi foto-foto tersebut dalam Bahasa Indonesia. Jangan memberi petunjuk untuk membuka browser/pencarian kecuali ditanya.
- Tetap jawab dalam Bahasa Indonesia.
"""

# Nama model chat (text/multimodal)
CHAT_MODEL = "gemini-3.6-flash"

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def _build_contents(
    history: list[dict],
    user_text: str,
    image: dict | None = None,
):
    """Bangun list contents untuk Gemini.

    history: daftar {"sender": "user"|"ai", "text": "..."}
    user_text: pesan terbaru dari user
    image: optional {"mime_type": ..., "data": <base64>}
    """
    contents = []

    # Masukkan riwayat percakapan agar AI punya konteks
    for msg in history:
        role = "user" if msg["sender"] == "user" else "model"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part(text=msg["text"])],
            )
        )

    # Pesan terbaru user (bisa disertai gambar)
    parts = []

    if image:
        parts.append(
            types.Part(
                inline_data=types.Blob(
                    mime_type=image["mime_type"],
                    data=image["data"],
                )
            )
        )

    if user_text:
        parts.append(types.Part(text=user_text))

    contents.append(
        types.Content(
            role="user",
            parts=parts,
        )
    )

    return contents


def chat(history: list[dict], user_text: str, image: dict | None = None) -> str:
    """Kirim percakapan ke Gemini dan kembalikan jawaban lengkap."""
    contents = _build_contents(history, user_text, image)

    response = client.models.generate_content(
        model=CHAT_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
        ),
    )

    return response.text or ""


def chat_stream(history: list[dict], user_text: str, image: dict | None = None):
    """Kirim percakapan ke Gemini dan yield teks secara streaming."""
    contents = _build_contents(history, user_text, image)

    response = client.models.generate_content_stream(
        model=CHAT_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
        ),
    )

    for chunk in response:
        if chunk.text:
            yield chunk.text
