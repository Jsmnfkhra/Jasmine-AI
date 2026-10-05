"""Deteksi permintaan foto/gambar pada pesan user dan ekstrak subjeknya."""

import re

# Kata kunci yang menandakan user ingin sebuah foto/gambar
PHOTO_KEYWORDS = [
    "foto",
    "gambar",
    "photo",
    "picture",
    "pic",
    "image of",
    "gambar dari",
    "foto dari",
    "show me",
    "tampilkan foto",
    "kirim foto",
    "kirim gambar",
    "generate image",
    "buatkan gambar",
    "buat gambar",
    "cari foto",
    "cari gambar",
]

# Pola: "kirim foto <subjek>", "foto <subjek>", "gambar <subjek>", dll.
_SUBJECT_PATTERNS = [
    r"(?:kirim|tampilkan|buatkan|buat|cari|tolong\s+kirim|tolong\s+tampilkan)?\s*(?:foto|gambar)\s+(?:dari\s+|tentang\s+)?(.+?)\s*[?.!]?$",
    r"(?:foto|gambar|picture|photo|image)\s+(?:of\s+)?(.+?)\s*[?.!]?$",
    r"ember\s+me\s+(?:a\s+)?(?:photo|picture|image)\s+(?:of\s+)?(.+?)\s*[?.!]?$",
    r"generate\s+(?:an?\s+)?(?:image|picture|photo)\s+(?:of\s+)?(.+?)\s*[?.!]?$",
]

_TRIM_WORDS = ["tolong", "ya", "kk", "kak", "bantu", "bisa", "minta", "saya", "aku"]


def _extract_subject(text: str) -> str | None:
    """Coba ekstrak subjek gambar dari pesan."""
    low = text.lower().strip()
    low = low.rstrip("?.!,")

    # Cari via pola
    for pattern in _SUBJECT_PATTERNS:
        m = re.search(pattern, low)
        if m:
            subject = m.group(1).strip()
            # Bersihkan kata-kata pengantar yang tersisa
            for w in _TRIM_WORDS:
                subject = re.sub(rf"^{w}\s+", "", subject)
            if subject:
                return subject

    return None


def detect_image_request(text: str) -> str | None:
    """Deteksi apakah user meminta sebuah gambar/foto.

    Mengembalikan subjek (keyword pencarian) jika terdeteksi,
    atau None jika pesan bukan permintaan gambar.
    """
    low = text.lower().strip()

    # Harus mengandung minimal salah satu kata kunci foto
    if not any(k in low for k in PHOTO_KEYWORDS):
        return None

    subject = _extract_subject(text)
    if not subject:
        return None

    # Jangan salah tangkap kalimat seperti "jelaskan gambaran" atau pertanyaan umum
    blocker = ["gambaran", "bayangkan", "imajinasikan", "berapakah", "apakah"]
    if any(b in subject for b in blocker):
        return None

    return subject
