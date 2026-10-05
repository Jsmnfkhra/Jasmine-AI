# Jasmine AI Backend

Backend untuk Jasmine AI menggunakan **Python + FastAPI + MySQL + SQLAlchemy + Google Gemini**.

## Tech Stack

- Python 3.14
- FastAPI
- Uvicorn
- SQLAlchemy (ORM)
- MySQL + PyMySQL
- python-dotenv / pydantic-settings
- Google GenAI SDK (Gemini)
- JWT (python-jose) + bcrypt
- python-multipart (upload file)

## Struktur

```
backend/
├── app/
│   ├── main.py              # entry point aplikasi
│   ├── core/
│   │   ├── config.py        # baca .env
│   │   └── security.py      # hash password + JWT
│   ├── database/
│   │   ├── connection.py    # engine & session MySQL
│   │   └── base.py          # Base SQLAlchemy
│   ├── models/
│   │   ├── user.py
│   │   ├── conversation.py
│   │   └── message.py
│   ├── schemas/             # Pydantic schemas
│   ├── routes/
│   │   ├── health.py
│   │   ├── auth.py
│   │   ├── conversations.py
│   │   ├── chat.py
│   │   └── image.py
│   ├── services/
│   │   ├── gemini.py        # chat & streaming Gemini
│   │   └── image.py         # image generation
│   ├── scripts/
│   │   ├── create_db.py     # buat database
│   │   └── init_db.py       # buat tabel
├── .env                     # kredensial (jangan di-commit)
├── .env.example
└── requirements.txt
```

## Setup

1. **Buat virtual environment** (sudah ada di `venv/`)

2. **Install dependencies**
```bash
cd backend
venv\Scripts\python -m pip install -r requirements.txt
```

3. **Buat file `.env`** (salin dari `.env.example`) lalu isi:
```
DATABASE_URL=mysql+pymysql://USER:PASSWORD@localhost:3306/jasmine_ai
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=random_long_string
```

4. **Siapkan MySQL**
```bash
# Buat database (jika belum ada)
venv\Scripts\python -m app.scripts.create_db

# Buat tabel
venv\Scripts\python -m app.scripts.init_db
```

5. **Jalankan server**
```bash
venv\Scripts\python -m uvicorn app.main:app --reload
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Info backend |
| GET | `/health` | Health check |
| GET | `/api/db-check` | Cek koneksi database |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Ambil user yang login |
| GET | `/api/conversations` | List conversation user |
| POST | `/api/conversations` | Buat conversation |
| GET | `/api/conversations/{id}` | Pesan dalam conversation |
| PATCH | `/api/conversations/{id}` | Rename conversation |
| DELETE | `/api/conversations/{id}` | Hapus conversation |
| POST | `/api/chat` | Chat non-streaming |
| POST | `/api/chat/stream` | Chat streaming (bisa upload gambar) |
| POST | `/api/image/generate` | Generate gambar dari prompt |
| GET | `/api/stock/photos?query=udang` | Cari foto stok gratis (Wikimedia Commons) |

## Catatan

- **API key Gemini hanya di backend** (`.env`), tidak pernah ke frontend.
- Image generation (`/api/image/generate`) butuh API key dengan akses billing ke model image (Imagen). Tanpa billing akan error 429/quota.
- Password user di-hash dengan bcrypt, tidak disimpan plain text.
- Setiap user hanya bisa akses conversation miliknya sendiri (dicek via JWT + user_id).

## Swagger

Dokumentasi API otomatis: `http://127.0.0.1:8000/docs`
