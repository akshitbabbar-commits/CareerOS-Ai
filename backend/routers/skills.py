"""Skill Gap API router — analyze gaps for target roles."""

from typing import Optional
from fastapi import APIRouter, Query

from services.llm_service import generate_skill_gap_analysis

router = APIRouter(prefix="/api/skills", tags=["Skill Gap Analyzer"])


@router.get("/gap")
async def skill_gap(
    role: str = Query("AI Engineer", description="Target role to analyze against"),
    current_skills: Optional[str] = Query(None, description="Comma-separated list of user's current skills")
):
    """Analyze skill gaps for a specific target role."""
    skills_list = []
    if current_skills:
        skills_list = [s.strip() for s in current_skills.split(",") if s.strip()]
        
    try:
        result = await generate_skill_gap_analysis(role, skills_list)
        return result
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))
