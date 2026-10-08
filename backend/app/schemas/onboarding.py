"""
Pydantic request/response schemas for the combined onboarding endpoint.
File: backend/app/schemas/onboarding.py
"""

from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.auth import Role

Crop = Literal["Rice", "Cotton", "Wheat", "Maize"]
BusinessType = Literal["Input Supplier", "Crop Buyer", "Processor", "Other"]
JurisdictionLevel = Literal["District", "State", "National"]


class OnboardingRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Role
    state: str = Field(..., min_length=2)
    district: str = Field(..., min_length=2)
    # Role-dependent fields — validated loosely here; the frontend enforces
    # which combination is required per role (see useOnboarding.ts isStepValid).
    crops: Optional[List[Crop]] = None
    organization_name: Optional[str] = None
    business_type: Optional[BusinessType] = None
    jurisdiction_level: Optional[JurisdictionLevel] = None


class OnboardingResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role
    farm_id: str
    expires_in_minutes: int