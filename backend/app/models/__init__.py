"""Daftarkan semua model di sini.

Import model lengkap supaya SQLAlchemy mendaftarkan tabelnya
sebelum create_all() dijalankan.
"""

from app.database.base import Base
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message

__all__ = ["Base", "User", "Conversation", "Message"]
