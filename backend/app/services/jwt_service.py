"""
Authentication service layer: registration and login business logic.
File: backend/app/services/jwt_service.py

DB-backed version (Milestone-3): replaces the earlier in-memory
_FAKE_USER_DB stand-in with real SQLAlchemy queries against the
users/roles tables.
"""

from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User, Role
from app.schemas.auth import RegisterRequest, TokenResponse


def register_user(payload: RegisterRequest, db: Session) -> dict:
    """Create a new user, hashing the password before storage."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    role = db.query(Role).filter(Role.role_name == payload.role).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown role: {payload.role}",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role_id=role.role_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "user_id": str(user.user_id),
        "full_name": user.full_name,
        "email": user.email,
        "role": role.role_name,
    }


def authenticate_user(email: str, password: str, db: Session) -> Optional[dict]:
    """Validate credentials; return the user record if valid, else None."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return {
        "user_id": str(user.user_id),
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.role_name,
    }


def login_user(email: str, password: str, db: Session) -> TokenResponse:
    """Authenticate and issue a JWT access token."""
    user_record = authenticate_user(email, password, db)
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    token = create_access_token(
        data={"sub": user_record["user_id"], "role": user_record["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=token,
        role=user_record["role"],
        expires_in_minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
    )