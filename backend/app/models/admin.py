"""
Admin model - stores admin login credentials
"""
from sqlalchemy import Column, Integer, String
from app.db.database import Base


class Admin(Base):
    """Admin model for authentication"""
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    login_id = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
