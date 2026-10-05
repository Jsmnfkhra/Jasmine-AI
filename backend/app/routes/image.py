"""Route untuk image generation."""

from fastapi import APIRouter, HTTPException, Depends

from app.models.user import User
from app.core.security import get_current_user
from app.services import image as image_service
from app.schemas.image import ImageGenerateRequest, ImageGenerateResponse

router = APIRouter(prefix="/api/image", tags=["image"])


@router.post("/generate", response_model=ImageGenerateResponse)
def generate_image(
    req: ImageGenerateRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate gambar dari prompt menggunakan model image Gemini."""
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt tidak boleh kosong")

    try:
        image_b64, mime_type = image_service.generate_image(req.prompt)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Gagal menghasilkan gambar. Pastikan API key punya akses image generation (billing).",
        )

    return ImageGenerateResponse(image_base64=image_b64, mime_type=mime_type)
