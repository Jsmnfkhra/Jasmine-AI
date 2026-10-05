"""Schema untuk Chat."""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversation_id: int | None = None
    message: str


class ChatResponse(BaseModel):
    message: "MessageOut"

    class Config:
        from_attributes = True


from app.schemas.message import MessageOut  # noqa: E402

ChatResponse.model_rebuild()
