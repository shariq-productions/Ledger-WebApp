"""
API dependencies - authentication
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import decode_access_token
from app.services.auth_service import AuthService

# Use HTTPBearer for token in Authorization header
security = HTTPBearer(auto_error=False)


async def get_current_admin_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> int:
    """
    Extract and validate bearer token, return admin_id.
    Raises 401 if token is missing or invalid.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    admin_id = decode_access_token(token)
    
    if admin_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify admin still exists
    admin = AuthService.get_admin_by_id(db, admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return admin_id
