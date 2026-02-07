"""
Security utilities - JWT and password hashing
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(admin_id: int) -> str:
    """Create JWT access token with admin_id, valid for 8 hours"""
    expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRE_HOURS)
    to_encode = {"sub": str(admin_id), "exp": expire}
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> Optional[int]:
    """Decode and verify JWT token, return admin_id or None"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        admin_id = payload.get("sub")
        if admin_id is None:
            return None
        return int(admin_id)
    except JWTError:
        return None
