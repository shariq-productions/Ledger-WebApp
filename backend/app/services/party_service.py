"""
Service layer for Party operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import update
from app.models.party import Party
from app.models.transaction import Transaction
from app.schemas.party import PartyCreate, PartyUpdate
from typing import List, Optional


class PartyService:
    """Service for party-related operations"""
    
    @staticmethod
    def create_party(db: Session, party: PartyCreate) -> Party:
        """Create a new party"""
        db_party = Party(**party.model_dump())
        db.add(db_party)
        db.commit()
        db.refresh(db_party)
        return db_party
    
    @staticmethod
    def get_party(db: Session, party_id: int) -> Optional[Party]:
        """Get a party by ID"""
        return db.query(Party).filter(Party.id == party_id).first()
    
    @staticmethod
    def get_all_parties(db: Session) -> List[Party]:
        """Get all parties"""
        return db.query(Party).order_by(Party.name).all()
    
    @staticmethod
    def update_party(db: Session, party_id: int, party_update: PartyUpdate) -> Optional[Party]:
        """
        Update a party and cascade update to all related transactions
        """
        db_party = db.query(Party).filter(Party.id == party_id).first()
        if not db_party:
            return None
        
        # Update party fields
        update_data = party_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_party, field, value)
        
        # Cascade update: If party name changed, update all related transactions
        # Note: Since transactions reference party_id, we update the party object
        # and SQLAlchemy will handle the relationship. For transaction notes that
        # reference party name, we'd need to update those separately if needed.
        # For now, we're updating the party object which will reflect in relationships.
        
        db.commit()
        db.refresh(db_party)
        return db_party
    
    @staticmethod
    def delete_party(db: Session, party_id: int) -> bool:
        """Delete a party (cascades to transactions)"""
        db_party = db.query(Party).filter(Party.id == party_id).first()
        if not db_party:
            return False
        
        db.delete(db_party)
        db.commit()
        return True
    
    @staticmethod
    def search_parties(db: Session, search_term: str) -> List[Party]:
        """Search parties by name (partial match, case-insensitive)"""
        return db.query(Party).filter(
            Party.name.ilike(f"%{search_term}%")
        ).order_by(Party.name).all()
