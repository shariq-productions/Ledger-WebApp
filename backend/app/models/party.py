"""
Party model - represents a business party/customer
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Party(Base):
    """Party model"""
    __tablename__ = "parties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)  # Mandatory
    billing_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to transactions
    transactions = relationship("Transaction", back_populates="party", cascade="all, delete-orphan")
