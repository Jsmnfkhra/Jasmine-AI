"""Konfigurasi aplikasi.

Membaca environment variable dari file .env
menggunakan pydantic-settings.
"""

import os

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Muat file .env dari folder backend (satu tingkat di atas app/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))


class Settings(BaseSettings):
    """Pengaturan global aplikasi yang diambil dari .env."""

    # Koneksi database MySQL
    DATABASE_URL: str = (
        "mysql+pymysql://root:password@localhost:3306/jasmine_ai"
    )

    # API key Gemini (dipakai pada Phase 5)
    GEMINI_API_KEY: str = ""

    # Secret untuk JWT (dipakai pada Phase 9)
    JWT_SECRET: str = "jasmine-ai-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = os.path.join(BASE_DIR, ".env")
        env_file_encoding = "utf-8"


settings = Settings()
