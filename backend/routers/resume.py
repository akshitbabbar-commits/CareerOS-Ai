"""Resume API router — upload and analyze resumes."""

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.resume_service import analyze_resume, get_resume_history

router = APIRouter(prefix="/api/resume", tags=["Resume Analyzer"])


@router.post("/analyze")
async def analyze(file: UploadFile = File(...), target_role: str = "Software Engineer"):
    """Upload a resume file and receive ATS analysis."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    file_bytes = await file.read()
    try:
        result = await analyze_resume(file.filename, file_bytes, target_role)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/history")
async def history():
    """Retrieve past resume analyses."""
    return {"analyses": get_resume_history()}
