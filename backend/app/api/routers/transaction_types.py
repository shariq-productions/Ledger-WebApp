"""
API router for Transaction Type operations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.api.deps import get_current_admin_id
from app.schemas.transaction_type import TransactionTypeCreate, TransactionTypeUpdate, TransactionTypeResponse
from app.services.transaction_type_service import TransactionTypeService

router = APIRouter(prefix="/transaction-types", tags=["transaction-types"])


@router.post("/", response_model=TransactionTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction_type(
    transaction_type: TransactionTypeCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Create a new transaction type"""
    try:
        db_transaction_type = TransactionTypeService.create_transaction_type(db, transaction_type)
        return db_transaction_type
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=List[TransactionTypeResponse])
def get_all_transaction_types(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get all transaction types"""
    return TransactionTypeService.get_all_transaction_types(db)


@router.get("/{type_id}", response_model=TransactionTypeResponse)
def get_transaction_type(
    type_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get a transaction type by ID"""
    db_transaction_type = TransactionTypeService.get_transaction_type(db, type_id)
    if not db_transaction_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction type not found"
        )
    return db_transaction_type


@router.put("/{type_id}", response_model=TransactionTypeResponse)
async def update_transaction_type(
    type_id: int,
    type_update: TransactionTypeUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Update a transaction type (cascades to related transactions)"""
    db_transaction_type = TransactionTypeService.update_transaction_type(db, type_id, type_update)
    if not db_transaction_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction type not found"
        )
    return db_transaction_type


@router.delete("/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction_type(
    type_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Delete a transaction type"""
    success = TransactionTypeService.delete_transaction_type(db, type_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction type not found"
        )
    return None
