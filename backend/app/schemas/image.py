"""Schema untuk Image Generation."""

from pydantic import BaseModel


class ImageGenerateRequest(BaseModel):
    prompt: str


class ImageGenerateResponse(BaseModel):
    image_base64: str
    mime_type: str = "image/png"
