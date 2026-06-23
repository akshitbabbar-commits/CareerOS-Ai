"""Profile API router — get and update user profile."""

from fastapi import APIRouter

from models.schemas import UserProfile, ProfileUpdateRequest
from services.mock_service import mock_profile

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("")
async def get_profile():
    """Retrieve the current user's profile."""
    return mock_profile()


@router.put("")
async def update_profile(body: ProfileUpdateRequest):
    """Update the current user's profile."""
    profile = mock_profile()
    update_data = body.model_dump(exclude_unset=True)
    profile.update(update_data)
    return profile
