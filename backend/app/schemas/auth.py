"""
Pydantic schemas for authentication
"""
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Login request schema"""
    login_id: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in_hours: int
