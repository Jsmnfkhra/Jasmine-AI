"""Koneksi dan session SQLAlchemy ke MySQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# Buat engine database dari DATABASE_URL di .env
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)

# SessionLocal dipakai untuk membuat session ke database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """Dependency FastAPI: membuka session dan menutupnya setelah request selesai."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
