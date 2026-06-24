"""Roadmap API router — generate and track learning roadmaps."""

from fastapi import APIRouter, Query, HTTPException

from models.schemas import RoadmapProgressUpdate, RoadmapGenerateRequest, RoadmapResponse
from services.llm_service import generate_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["Learning Roadmap"])


@router.get("")
async def get_roadmap(goal: str = Query("AI Engineer", description="Career goal for the roadmap")):
    """Generate a personalized learning roadmap."""
    try:
        result = await generate_roadmap(goal)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/generate", response_model=RoadmapResponse)
async def generate_user_roadmap(body: RoadmapGenerateRequest):
    """Generate a personalized learning roadmap."""
    try:
        result = await generate_roadmap(
            goal=body.goal,
            current_skills=body.current_skills,
            experience_level=body.experience_level,
            hours_per_week=body.hours_per_week
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/progress")
async def update_progress(body: RoadmapProgressUpdate):
    """Update milestone completion status."""
    return {
        "message": f"Milestone '{body.milestone_id}' marked as {'completed' if body.completed else 'incomplete'}.",
        "milestone_id": body.milestone_id,
        "completed": body.completed,
    }
