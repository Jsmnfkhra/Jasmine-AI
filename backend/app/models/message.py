"""Model Message."""

from datetime import datetime

from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("conversations.id", ondelete="CASCADE"),
        index=True,
    )

    # "user" atau "ai"
    sender: Mapped[str] = mapped_column(String(20))

    # Isi pesan
    text: Mapped[str] = mapped_column(Text, default="")

    # Menyimpan data gambar (jika ada) - base64 atau URL
    image_data: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Waktu dibuat
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    # Relasi balik ke Conversation
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
