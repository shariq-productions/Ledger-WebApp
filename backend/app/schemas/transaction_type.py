"""
Pydantic schemas for Transaction Type
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional


class TransactionTypeBase(BaseModel):
    """Base transaction type schema"""
    note: str = Field(..., min_length=1, description="Transaction note template")
    type: Literal["add", "reduce"] = Field(..., description="Transaction type (mandatory)")


class TransactionTypeCreate(TransactionTypeBase):
    """Schema for creating a transaction type"""
    pass


class TransactionTypeUpdate(BaseModel):
    """Schema for updating a transaction type"""
    note: Optional[str] = Field(None, min_length=1)
    type: Optional[Literal["add", "reduce"]] = None


class TransactionTypeResponse(TransactionTypeBase):
    """Schema for transaction type response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
