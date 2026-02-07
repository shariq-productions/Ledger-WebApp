"""
Service layer for authentication
"""
from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.core.security import verify_password, create_access_token
from typing import Optional, Tuple


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def authenticate_admin(db: Session, login_id: str, password: str) -> Optional[Tuple[Admin, str]]:
        """
        Authenticate admin by login_id and password.
        Returns (admin, access_token) if valid, None otherwise.
        """
        admin = db.query(Admin).filter(Admin.login_id == login_id).first()
        if not admin:
            return None
        if not verify_password(password, admin.hashed_password):
            return None
        token = create_access_token(admin.id)
        return (admin, token)
    
    @staticmethod
    def get_admin_by_id(db: Session, admin_id: int) -> Optional[Admin]:
        """Get admin by ID"""
        return db.query(Admin).filter(Admin.id == admin_id).first()
