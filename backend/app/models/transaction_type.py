"""
Transaction Type model - reusable transaction type templates
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class TransactionType(Base):
    """Transaction Type model"""
    __tablename__ = "transaction_types"
    
    id = Column(Integer, primary_key=True, index=True)
    note = Column(String, nullable=False)  # Transaction note template
    type = Column(String, nullable=False)  # "add" or "reduce" (mandatory)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to transactions
    transactions = relationship("Transaction", back_populates="transaction_type", cascade="all, delete-orphan")
