"""
Onboarding route: single-step account + farm profile creation.
File: backend/app/routes/onboarding.py
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.onboarding import OnboardingRequest, OnboardingResponse
from app.services.onboarding_service import submit_onboarding

router = APIRouter()


@router.post("/", response_model=OnboardingResponse, status_code=201)
def onboard(payload: OnboardingRequest, db: Session = Depends(get_db)):
    """Create the user's account and farm profile, and return a JWT — used by the onboarding wizard's final step."""
    return submit_onboarding(payload, db)