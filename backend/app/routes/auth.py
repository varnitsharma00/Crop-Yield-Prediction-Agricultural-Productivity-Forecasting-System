"""
Authentication routes: register, login, current-user.
File: backend/app/routes/auth.py
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_role
from app.db.session import get_db
from app.schemas.auth import (
    CurrentUserResponse,
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.services.jwt_service import login_user, register_user

router = APIRouter()


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new account directly (without the bundled farm profile — see /api/v1/onboarding for that)."""
    user_record = register_user(payload, db)
    return RegisterResponse(
        user_id=user_record["user_id"],
        full_name=user_record["full_name"],
        email=user_record["email"],
        role=user_record["role"],
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT access token."""
    return login_user(payload.email, payload.password, db)


@router.get("/me", response_model=CurrentUserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's identity and role."""
    return CurrentUserResponse(user_id=current_user["user_id"], role=current_user["role"])


@router.get("/admin-check")
def admin_check(current_user: dict = Depends(require_role("admin"))):
    """Example RBAC-protected route — accessible only to 'admin' role."""
    return {"message": "You have admin access.", "user_id": current_user["user_id"]}