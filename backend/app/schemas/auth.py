"""
Pydantic request/response schemas for authentication endpoints.
File: backend/app/schemas/auth.py
"""

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

# 5 roles matching database/schema.sql `roles` table.
# farmer / cooperative / agribusiness / government are selectable at onboarding.
# admin is reserved for internal platform operations (not exposed in onboarding UI).
Role = Literal["farmer", "cooperative", "agribusiness", "government", "admin"]


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120, examples=["Ramesh Kumar"])
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    role: Role = "farmer"


class RegisterResponse(BaseModel):
    user_id: UUID
    full_name: str
    email: EmailStr
    role: Role


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role
    expires_in_minutes: int


class CurrentUserResponse(BaseModel):
    user_id: UUID
    role: Role