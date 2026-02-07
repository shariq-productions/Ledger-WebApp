"""
Transaction model - represents individual ledger transactions
"""
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Transaction(Base):
    """Transaction model"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(Integer, nullable=False, unique=True, index=True)  # Continuous numbering
    date = Column(Date, nullable=False, index=True)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=False, index=True)
    transaction_note = Column(String, nullable=True)
    type_id = Column(Integer, ForeignKey("transaction_types.id"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)  # Positive integers only
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    party = relationship("Party", back_populates="transactions")
    transaction_type = relationship("TransactionType", back_populates="transactions")
