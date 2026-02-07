"""
API router for Transaction operations
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.database import get_db
from app.api.deps import get_current_admin_id
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Create a new transaction"""
    try:
        db_transaction = TransactionService.create_transaction(db, transaction)
        return db_transaction
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=List[TransactionResponse])
def get_all_transactions(
    party_filter: Optional[str] = Query(None, description="Filter by party name"),
    date_start: Optional[date] = Query(None, description="Start date for date range filter"),
    date_end: Optional[date] = Query(None, description="Till date - show transactions up to this date"),
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get all transactions with optional filters"""
    return TransactionService.get_all_transactions(db, party_filter, date_start, date_end)


@router.get("/outstanding/total")
def get_outstanding_total(
    party_filter: Optional[str] = Query(None, description="Filter by party name"),
    date_end: Optional[date] = Query(None, description="Till date - include transactions up to this date"),
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get outstanding amount for (optionally) filtered transactions."""
    total = TransactionService.calculate_outstanding_total(db, party_filter, date_end)
    return {"total": total}


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get a transaction by ID"""
    db_transaction = TransactionService.get_transaction(db, transaction_id)
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return db_transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Update a transaction"""
    db_transaction = TransactionService.update_transaction(db, transaction_id, transaction_update)
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return db_transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Delete a transaction"""
    success = TransactionService.delete_transaction(db, transaction_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return None
