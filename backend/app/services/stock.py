"""Service untuk mencari foto dari sumber stok gratis (tanpa API key).

Menggunakan API Wikimedia Commons: gratis, tanpa API key, dan berisi
foto-foto asli (termasuk makanan, hewan, dll).
"""

import requests

from app.core.config import settings

IMAGES_PER_PAGE = 6

WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"

HEADERS = {
    "User-Agent": f"JasmineAI/1.0 (contact: {settings.JWT_ALGORITHM})",
}


def _extract_image_urls(thumb, original=None):
    """Ambil URL gambar dari struktur thumbnail Wikimedia."""
    if thumb and "thumburl" in thumb:
        return thumb["thumburl"]
    return original


def search_photos(query: str, per_page: int = IMAGES_PER_PAGE) -> list[str]:
    """Cari foto stok untuk keyword tertentu.

    Mengembalikan daftar URL gambar.
    """
    query = (query or "").strip()
    if not query:
        return []

    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",  # berkas/gambar
        "gsrlimit": str(per_page),
        "prop": "imageinfo",
        "iiprop": "url|size",
        "iiurlwidth": "800",
        "format": "json",
    }

    try:
        resp = requests.get(
            WIKIMEDIA_API,
            params=params,
            headers=HEADERS,
            timeout=15,
        )
        resp.raise_for_status()
    except Exception:
        return []

    data = resp.json()
    pages = data.get("query", {}).get("pages", {})

    urls = []
    for page in pages.values():
        imageinfo = page.get("imageinfo", [])
        if not imageinfo:
            continue

        # Lewati gambar non-gambar (mis. dokumen, tidak ada thumburl)
        mime = imageinfo[0].get("mime", "")
        if mime and not mime.startswith("image/"):
            continue

        url = _extract_image_urls(
            imageinfo[0].get("thumb", {}),
            imageinfo[0].get("url"),
        )

        if url:
            urls.append(url)

    return urls[:per_page]
