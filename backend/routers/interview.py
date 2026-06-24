"""Interview API router — start sessions, submit answers, view history."""

from fastapi import APIRouter, HTTPException

from config import settings
from models.schemas import (
    InterviewStartRequest,
    InterviewAnswerRequest,
)
from services.mock_service import mock_interview_start, mock_interview_history
from services.llm_service import generate_interview_feedback, generate_interview_questions

router = APIRouter(prefix="/api/interview", tags=["Mock Interview"])


@router.post("/start")
async def start_interview(body: InterviewStartRequest):
    """Start a new mock interview session with generated questions."""
    try:
        result = await generate_interview_questions(body.type, body.role, body.difficulty)
        return result
    except Exception as e:
        if settings.LLM_PROVIDER == "mock":
            return mock_interview_start(body.type, body.role, body.difficulty)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/answer")
async def submit_answer(body: InterviewAnswerRequest):
    """Submit an answer and receive AI-powered feedback."""
    try:
        result = await generate_interview_feedback(body.question_id, body.answer, body.target_role)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/history")
async def interview_history():
    """Retrieve past interview session summaries."""
    return {"sessions": mock_interview_history()}
