"""
Service layer for Transaction operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.models.transaction import Transaction
from app.models.party import Party
from app.models.transaction_type import TransactionType
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from datetime import date
from typing import List, Optional, Tuple


class TransactionService:
    """Service for transaction-related operations"""
    
    @staticmethod
    def get_next_serial_number(db: Session) -> int:
        """Get the next serial number for a new transaction (continuous numbering)"""
        max_serial = db.query(func.max(Transaction.serial_number)).scalar()
        return (max_serial or 0) + 1
    
    @staticmethod
    def create_transaction(db: Session, transaction: TransactionCreate) -> Transaction:
        """Create a new transaction"""
        serial_number = TransactionService.get_next_serial_number(db)
        db_transaction = Transaction(
            serial_number=serial_number,
            **transaction.model_dump()
        )
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    @staticmethod
    def get_transaction(db: Session, transaction_id: int) -> Optional[Transaction]:
        """Get a transaction by ID with relations"""
        return db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    @staticmethod
    def get_all_transactions(db: Session, party_filter: Optional[str] = None, 
                            date_start: Optional[date] = None, 
                            date_end: Optional[date] = None) -> List[Transaction]:
        """
        Get all transactions with optional filters
        """
        query = db.query(Transaction)
        
        # Filter by party name (partial match)
        if party_filter:
            query = query.join(Party).filter(Party.name.ilike(f"%{party_filter}%"))
        
        # Filter by date range
        if date_start:
            query = query.filter(Transaction.date >= date_start)
        if date_end:
            query = query.filter(Transaction.date <= date_end)
        
        return query.order_by(Transaction.date.desc(), Transaction.serial_number.desc()).all()
    
    @staticmethod
    def update_transaction(db: Session, transaction_id: int, transaction_update: TransactionUpdate) -> Optional[Transaction]:
        """Update a transaction"""
        db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
        if not db_transaction:
            return None
        
        update_data = transaction_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_transaction, field, value)
        
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    @staticmethod
    def delete_transaction(db: Session, transaction_id: int) -> bool:
        """Delete a transaction"""
        db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
        if not db_transaction:
            return False
        
        db.delete(db_transaction)
        db.commit()
        return True
    
    @staticmethod
    def calculate_outstanding_total(
        db: Session,
        party_filter: Optional[str] = None,
        date_end: Optional[date] = None,
    ) -> int:
        """
        Calculate outstanding amount for (optionally) filtered transactions.
        Logic: Sum of 'add' amounts minus sum of 'reduce' amounts.
        When filters are provided, only transactions matching those filters are included.
        """
        def filtered_query():
            q = db.query(Transaction).join(TransactionType)
            if party_filter:
                q = q.join(Party).filter(Party.name.ilike(f"%{party_filter}%"))
            if date_end is not None:
                q = q.filter(Transaction.date <= date_end)
            return q

        add_total = (
            filtered_query()
            .filter(TransactionType.type == "add")
            .with_entities(func.coalesce(func.sum(Transaction.amount), 0))
            .scalar()
            or 0
        )
        reduce_total = (
            filtered_query()
            .filter(TransactionType.type == "reduce")
            .with_entities(func.coalesce(func.sum(Transaction.amount), 0))
            .scalar()
            or 0
        )
        return int(add_total - reduce_total)
