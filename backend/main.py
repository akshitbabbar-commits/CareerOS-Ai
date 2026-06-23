"""
CareerOS AI — FastAPI Backend Application

Entry point for the backend API server.
All endpoints return mock data by default. When LLM_PROVIDER is set to
"openai" and LLM_API_KEY is provided, AI-powered features use the
configured LLM provider.

Run:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import auth, profile, resume, skills, roadmap, interview, chat
from services.mock_service import mock_dashboard, mock_project_recommendations

# ─── Application ─────────────────────────────────────────────────────

app = FastAPI(
    title="CareerOS AI API",
    description="Backend API for the CareerOS AI career operating system. "
                "Provides endpoints for resume analysis, skill gap detection, "
                "learning roadmaps, mock interviews, AI chat, and more.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS Middleware ─────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ───────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(resume.router)
app.include_router(skills.router)
app.include_router(roadmap.router)
app.include_router(interview.router)
app.include_router(chat.router)


# ─── Standalone Endpoints ───────────────────────────────────────────

@app.get("/")
async def root():
    """Health check / welcome endpoint."""
    return {
        "name": "CareerOS AI API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "llm_provider": settings.LLM_PROVIDER,
    }


@app.get("/api/dashboard")
async def get_dashboard():
    """Retrieve dashboard metrics and AI tip."""
    return mock_dashboard()


@app.get("/api/projects/recommend")
async def recommend_projects(goal: str = "AI Engineer", level: str = "intermediate"):
    """Get personalized project recommendations."""
    projects = mock_project_recommendations(goal, level)
    return {"projects": projects}


# ─── Run with uvicorn ────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
