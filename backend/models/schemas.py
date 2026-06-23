"""Pydantic request / response schemas for the CareerOS AI API."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


# ─── Auth ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class ForgotPasswordRequest(BaseModel):
    email: str

class AuthResponse(BaseModel):
    token: str
    user: UserProfile

class MessageResponse(BaseModel):
    message: str


# ─── User Profile ───────────────────────────────────────────────────

class UserProfile(BaseModel):
    id: str = "usr_demo_001"
    full_name: str = "Alex Johnson"
    email: str = "alex@careeros.ai"
    college: str = "Stanford University"
    degree: str = "B.S. Computer Science"
    graduation_year: int = 2025
    skills: list[str] = Field(default_factory=lambda: ["Python", "React", "Machine Learning", "SQL", "TypeScript"])
    interests: list[str] = Field(default_factory=lambda: ["AI/ML", "Full-Stack", "Cloud"])
    career_goal: str = "AI Engineer"
    experience_level: str = "Mid-Level"
    avatar_url: str = ""

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[list[str]] = None
    interests: Optional[list[str]] = None
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None


# ─── Resume ─────────────────────────────────────────────────────────

class ResumeCategory(BaseModel):
    name: str
    score: int
    suggestions: list[str]

class ResumeAnalysis(BaseModel):
    id: str
    file_name: str
    ats_score: int
    categories: list[ResumeCategory]
    keywords_found: list[str]
    keywords_missing: list[str]
    summary: str
    created_at: str

class ResumeHistoryResponse(BaseModel):
    analyses: list[ResumeAnalysis]


# ─── Skill Gap ──────────────────────────────────────────────────────

class SkillItem(BaseModel):
    name: str
    level: int  # 0-100
    category: str = "core"

class SkillGapResponse(BaseModel):
    role: str
    your_skills: list[SkillItem]
    required_skills: list[SkillItem]
    missing_skills: list[str]
    readiness_percent: int
    recommendations: list[str]


# ─── Learning Roadmap ───────────────────────────────────────────────

class RoadmapResource(BaseModel):
    title: str
    url: str
    type: str  # video, article, course, documentation
    platform: str = "Official"

class RoadmapTask(BaseModel):
    id: str
    title: str
    completed: bool = False
    type: str  # learn, practice, project, certification

class RoadmapMilestone(BaseModel):
    id: str
    title: str
    description: str
    week: int
    duration: str
    completed: bool = False
    tasks: list[RoadmapTask] = Field(default_factory=list)
    resources: list[RoadmapResource] = Field(default_factory=list)

class RoadmapResponse(BaseModel):
    id: Optional[str] = None
    userId: Optional[str] = None
    careerGoal: str
    progress: int = 0
    totalDuration: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    milestones: list[RoadmapMilestone]

class RoadmapGenerateRequest(BaseModel):
    goal: str
    current_skills: list[str] = Field(default_factory=list)
    experience_level: str = "beginner"
    hours_per_week: int = 10

class RoadmapProgressUpdate(BaseModel):
    milestone_id: str
    completed: bool


# ─── Mock Interview ─────────────────────────────────────────────────

class InterviewQuestion(BaseModel):
    id: str
    question: str
    category: str
    difficulty: str

class InterviewStartRequest(BaseModel):
    type: str  # technical, hr, behavioral
    role: str
    difficulty: str

class InterviewStartResponse(BaseModel):
    session_id: str
    questions: list[InterviewQuestion]

class InterviewAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer: str
    target_role: Optional[str] = "Software Engineer"  # Help the evaluator customize feedback

class InterviewFeedback(BaseModel):
    score: int
    strengths: list[str]
    weaknesses: list[str]
    improvements: list[str]
    suggested_answer: str

class InterviewAnswerResponse(BaseModel):
    feedback: InterviewFeedback


class InterviewHistoryItem(BaseModel):
    session_id: str
    type: str
    role: str
    overall_score: int
    created_at: str

class InterviewHistoryResponse(BaseModel):
    sessions: list[InterviewHistoryItem]


# ─── Chat ────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # user | assistant
    content: str
    timestamp: Optional[str] = None

class ChatMessageRequest(BaseModel):
    message: str
    session_type: str = "mentor"  # mentor | chatbot

class ChatMessageResponse(BaseModel):
    reply: str
    suggestions: list[str] = Field(default_factory=list)

class ChatHistoryResponse(BaseModel):
    messages: list[ChatMessage]


# ─── Project Recommender ────────────────────────────────────────────

class RecommendedProject(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    tech_stack: list[str]
    learning_outcomes: list[str]
    estimated_hours: int
    career_goal: str

class ProjectRecommendResponse(BaseModel):
    projects: list[RecommendedProject]


# ─── Dashboard ──────────────────────────────────────────────────────

class DashboardMetrics(BaseModel):
    resume_score: int
    skills_progress: int
    roadmap_progress: int
    interview_readiness: int
    projects_completed: int
    learning_streak: int
    overall_readiness: int

class DashboardResponse(BaseModel):
    metrics: DashboardMetrics
    ai_tip: str
    recent_activity: list[dict[str, Any]]


# Fix forward reference for AuthResponse
AuthResponse.model_rebuild()
