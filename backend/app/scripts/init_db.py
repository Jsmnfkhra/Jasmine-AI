"""Inisialisasi database: buat semua tabel.

Jalankan:  python -m app.scripts.init_db
"""

from app.database.base import Base
from app.database.connection import engine
from app import models  # noqa: F401  - memastikan semua model terdaftar


def main():
    Base.metadata.create_all(bind=engine)
    print("Semua tabel berhasil dibuat.")


if __name__ == "__main__":
    main()
