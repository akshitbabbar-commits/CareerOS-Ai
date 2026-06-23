"""Chat API router — AI mentor and chatbot conversations."""

import traceback
from fastapi import APIRouter, HTTPException

from models.schemas import ChatMessageRequest
from services.llm_service import generate_chat_response
from services.mock_service import mock_chat_history

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])


@router.post("/message")
async def send_message(body: ChatMessageRequest):
    """Send a message and receive an AI-generated reply."""
    try:
        result = await generate_chat_response(body.message, body.session_type)
        return result
    except Exception as e:
        print(f"[chat_router] Exception in send_message: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "type": type(e).__name__,
                "message": "The AI Mentor backend failed to generate a response. Refer to backend console logs for details."
            }
        )


@router.get("/history")
async def chat_history():
    """Retrieve chat message history."""
    return {"messages": mock_chat_history()}
