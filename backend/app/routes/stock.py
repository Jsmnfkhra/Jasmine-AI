"""Route untuk mencari foto stok gratis."""

from fastapi import APIRouter, Query

from app.services import stock as stock_service

router = APIRouter(prefix="/api/stock", tags=["stock"])


@router.get("/photos")
def get_stock_photos(
    query: str = Query(..., min_length=1),
    per_page: int = Query(6, ge=1, le=12),
):
    """Cari foto stok gratis berdasarkan keyword."""
    urls = stock_service.search_photos(query, per_page=per_page)
    return {
        "query": query,
        "images": urls,
    }
