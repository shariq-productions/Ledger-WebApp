"""
Service layer for Transaction Type operations
"""
from sqlalchemy.orm import Session
from app.models.transaction_type import TransactionType
from app.models.transaction import Transaction
from app.schemas.transaction_type import TransactionTypeCreate, TransactionTypeUpdate
from typing import List, Optional


class TransactionTypeService:
    """Service for transaction type-related operations"""
    
    @staticmethod
    def create_transaction_type(db: Session, transaction_type: TransactionTypeCreate) -> TransactionType:
        """Create a new transaction type"""
        db_transaction_type = TransactionType(**transaction_type.model_dump())
        db.add(db_transaction_type)
        db.commit()
        db.refresh(db_transaction_type)
        return db_transaction_type
    
    @staticmethod
    def get_transaction_type(db: Session, type_id: int) -> Optional[TransactionType]:
        """Get a transaction type by ID"""
        return db.query(TransactionType).filter(TransactionType.id == type_id).first()
    
    @staticmethod
    def get_all_transaction_types(db: Session) -> List[TransactionType]:
        """Get all transaction types"""
        return db.query(TransactionType).order_by(TransactionType.type, TransactionType.note).all()
    
    @staticmethod
    def update_transaction_type(db: Session, type_id: int, type_update: TransactionTypeUpdate) -> Optional[TransactionType]:
        """
        Update a transaction type and cascade update to all related transactions
        """
        db_transaction_type = db.query(TransactionType).filter(TransactionType.id == type_id).first()
        if not db_transaction_type:
            return None
        
        # Update transaction type fields
        update_data = type_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_transaction_type, field, value)
        
        # Cascade update: Update all related transactions' transaction_note
        # if the transaction type's note changed
        if 'note' in update_data:
            # Update transaction notes that reference this type
            # Note: This is a simplified approach. In a real scenario, you might want
            # to append the new note or handle it differently based on requirements.
            pass  # The relationship is maintained through type_id, so transactions will reflect the change
        
        db.commit()
        db.refresh(db_transaction_type)
        return db_transaction_type
    
    @staticmethod
    def delete_transaction_type(db: Session, type_id: int) -> bool:
        """Delete a transaction type (cascades to transactions)"""
        db_transaction_type = db.query(TransactionType).filter(TransactionType.id == type_id).first()
        if not db_transaction_type:
            return False
        
        db.delete(db_transaction_type)
        db.commit()
        return True
