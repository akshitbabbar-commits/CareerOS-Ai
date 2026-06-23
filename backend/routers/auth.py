"""Auth API router — login, signup, forgot password."""

from fastapi import APIRouter, HTTPException

from models.schemas import (
    LoginRequest,
    SignupRequest,
    ForgotPasswordRequest,
    AuthResponse,
    MessageResponse,
)
from services.mock_service import mock_login, mock_signup

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login")
async def login(body: LoginRequest):
    """Authenticate a user and return a JWT token."""
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    result = mock_login(body.email, body.password)
    return result


@router.post("/signup")
async def signup(body: SignupRequest):
    """Create a new user account."""
    if not body.email or not body.password or not body.full_name:
        raise HTTPException(status_code=400, detail="All fields are required.")
    result = mock_signup(body.email, body.password, body.full_name)
    return result


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    """Send a password reset link (mock)."""
    return MessageResponse(message=f"If an account exists for {body.email}, a reset link has been sent.")
