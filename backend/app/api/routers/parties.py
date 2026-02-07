"""
API router for Party operations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.api.deps import get_current_admin_id
from app.schemas.party import PartyCreate, PartyUpdate, PartyResponse
from app.services.party_service import PartyService

router = APIRouter(prefix="/parties", tags=["parties"])


@router.post("/", response_model=PartyResponse, status_code=status.HTTP_201_CREATED)
async def create_party(
    party: PartyCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Create a new party"""
    try:
        db_party = PartyService.create_party(db, party)
        return db_party
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=List[PartyResponse])
def get_all_parties(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get all parties"""
    return PartyService.get_all_parties(db)


@router.get("/{party_id}", response_model=PartyResponse)
def get_party(
    party_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Get a party by ID"""
    db_party = PartyService.get_party(db, party_id)
    if not db_party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    return db_party


@router.put("/{party_id}", response_model=PartyResponse)
async def update_party(
    party_id: int,
    party_update: PartyUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Update a party (cascades to related transactions)"""
    db_party = PartyService.update_party(db, party_id, party_update)
    if not db_party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    return db_party


@router.delete("/{party_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_party(
    party_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Delete a party"""
    success = PartyService.delete_party(db, party_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    return None


@router.get("/search/{search_term}", response_model=List[PartyResponse])
def search_parties(
    search_term: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin_id)
):
    """Search parties by name"""
    return PartyService.search_parties(db, search_term)
