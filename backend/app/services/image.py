"""Service Image Generation.

Menggunakan model image generation Gemini (via generate_content).
Terpisah dari model chat biasa.
"""

import base64

from google import genai
from google.genai import types

from app.core.config import settings

# Model khusus image generation
IMAGE_MODEL = "gemini-3.1-flash-image"

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_image(prompt: str) -> tuple[str, str]:
    """Generate gambar dari prompt.

    Mengembalikan (base64_data, mime_type).
    """
    response = client.models.generate_content(
        model=IMAGE_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            return (
                base64.b64encode(part.inline_data.data).decode("utf-8"),
                part.inline_data.mime_type,
            )

    raise RuntimeError("Gambar tidak dihasilkan oleh model")
