"""
Pydantic schemas for Transaction
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date as DateType, datetime
from typing import Optional


class TransactionBase(BaseModel):
    """Base transaction schema"""
    date: DateType = Field(..., description="Transaction date")
    party_id: int = Field(..., description="Party ID")
    transaction_note: Optional[str] = None
    type_id: int = Field(..., description="Transaction type ID")
    amount: int = Field(..., gt=0, description="Amount (positive integer only)")
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """Ensure amount is positive"""
        if v <= 0:
            raise ValueError('Amount must be a positive integer')
        return v


class TransactionCreate(TransactionBase):
    """Schema for creating a transaction"""
    pass


class TransactionUpdate(BaseModel):
    """Schema for updating a transaction"""
    date: Optional[DateType] = None
    party_id: Optional[int] = None
    transaction_note: Optional[str] = None
    type_id: Optional[int] = None
    amount: Optional[int] = Field(None, gt=0)
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """Ensure amount is positive if provided"""
        if v is not None and v <= 0:
            raise ValueError('Amount must be a positive integer')
        return v


class TransactionResponse(TransactionBase):
    """Schema for transaction response"""
    id: int
    serial_number: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TransactionWithRelations(TransactionResponse):
    """Transaction response with related party and transaction type details"""
    party: Optional[dict] = None
    transaction_type: Optional[dict] = None
