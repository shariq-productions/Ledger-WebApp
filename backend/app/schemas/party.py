"""
Pydantic schemas for Party
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PartyBase(BaseModel):
    """Base party schema"""
    name: str = Field(..., min_length=1, description="Party name (mandatory)")
    billing_name: Optional[str] = None
    location: Optional[str] = None


class PartyCreate(PartyBase):
    """Schema for creating a party"""
    pass


class PartyUpdate(BaseModel):
    """Schema for updating a party"""
    name: Optional[str] = Field(None, min_length=1)
    billing_name: Optional[str] = None
    location: Optional[str] = None


class PartyResponse(PartyBase):
    """Schema for party response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
