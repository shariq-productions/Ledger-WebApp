"""
Auth router - login endpoint (no auth required)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with login_id and password.
    Returns JWT bearer token valid for 8 hours.
    """
    result = AuthService.authenticate_admin(
        db, credentials.login_id, credentials.password
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login ID or password"
        )
    admin, token = result
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in_hours=settings.JWT_EXPIRE_HOURS
    )
