"""Buat database MySQL `jasmine_ai` jika belum ada.

Membaca kredensial dari DATABASE_URL di .env.
Jalankan:  python -m app.scripts.create_db
"""

import os

import pymysql
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Contoh: mysql+pymysql://root:password@localhost:3306/jasmine_ai
# Ambil bagian user, password, host, port, dan nama database
prefix = "mysql+pymysql://"
if not DATABASE_URL.startswith(prefix):
    raise SystemExit("DATABASE_URL tidak valid di .env")


def parse_url(url: str):
    rest = url[len(prefix):]
    credentials, hostpart = rest.rsplit("@", 1)
    user, password = credentials.split(":", 1)
    hostport, dbname = hostpart.rsplit("/", 1)
    if ":" in hostport:
        host, port = hostport.split(":", 1)
    else:
        host, port = hostport, "3306"
    return user, password, host, int(port), dbname


def main():
    user, password, host, port, dbname = parse_url(DATABASE_URL)

    # Connect tanpa memilih database, supaya bisa CREATE DATABASE
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        charset="utf8mb4",
    )

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{dbname}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        conn.commit()
        print(f"Database '{dbname}' siap.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
