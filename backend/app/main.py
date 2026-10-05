from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.routes import health, auth, conversations, chat, image, stock


def create_application() -> FastAPI:
    application = FastAPI(
        title="Jasmine AI Backend",
        version="1.0.0",
    )

    # CORS - izinkan frontend dev
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routers
    application.include_router(health.router)
    application.include_router(auth.router)
    application.include_router(conversations.router)
    application.include_router(chat.router)
    application.include_router(image.router)
    application.include_router(stock.router)

    return application


app = create_application()


@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Jasmine AI Backend is running",
    }


@app.get("/api/db-check")
def db_check():
    """Cek apakah koneksi ke MySQL berhasil."""
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            value = result.scalar()
        return {
            "status": "success",
            "database": "connected",
            "query_result": value,
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "detail": str(e),
        }
