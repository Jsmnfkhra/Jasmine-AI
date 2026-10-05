"""Schema untuk Message."""

from datetime import datetime

from pydantic import BaseModel


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender: str
    text: str
    image_data: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
