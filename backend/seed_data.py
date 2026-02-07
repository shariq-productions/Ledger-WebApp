"""
Seed data script for populating initial data
"""
from app.db.database import SessionLocal, engine
from app.models.party import Party
from app.models.transaction_type import TransactionType
from app.models.transaction import Transaction
from app.models.admin import Admin
from app.db.database import Base
from app.core.security import get_password_hash
from datetime import date, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Create 2 admins if they don't exist
    if db.query(Admin).count() == 0:
        admins = [
            Admin(login_id="admin1", hashed_password=get_password_hash("Shariq123")),
            Admin(login_id="admin2", hashed_password=get_password_hash("admin456")),
        ]
        for admin in admins:
            db.add(admin)
        db.commit()
        print("✅ Created 2 admins: admin1/admin123, admin2/admin456")

    # Clear existing data (optional - comment out if you want to keep existing data)
    db.query(Transaction).delete()
    db.query(Party).delete()
    db.query(TransactionType).delete()
    db.commit()

    # Create Parties
    parties = [
        Party(name="ABC Corporation", billing_name="ABC Corp", location="Mumbai"),
        Party(name="XYZ Industries", billing_name="XYZ Ind", location="Delhi"),
        Party(name="Tech Solutions Ltd", billing_name="Tech Solutions", location="Bangalore"),
        Party(name="Global Traders", billing_name="Global Traders Pvt Ltd", location="Chennai"),
    ]
    for party in parties:
        db.add(party)
    db.commit()

    # Refresh to get IDs
    for party in parties:
        db.refresh(party)

    # Create Transaction Types
    transaction_types = [
        TransactionType(note="Payment Received", type="add"),
        TransactionType(note="Invoice Payment", type="add"),
        TransactionType(note="Advance Payment", type="add"),
        TransactionType(note="Expense Paid", type="reduce"),
        TransactionType(note="Refund Issued", type="reduce"),
        TransactionType(note="Service Charge", type="reduce"),
    ]
    for trans_type in transaction_types:
        db.add(trans_type)
    db.commit()

    # Refresh to get IDs
    for trans_type in transaction_types:
        db.refresh(trans_type)

    # Create Transactions
    today = date.today()
    transactions = [
        Transaction(
            serial_number=1,
            date=today - timedelta(days=10),
            party_id=parties[0].id,
            transaction_note="Monthly payment",
            type_id=transaction_types[0].id,
            amount=50000,
        ),
        Transaction(
            serial_number=2,
            date=today - timedelta(days=8),
            party_id=parties[1].id,
            transaction_note="Invoice #1234",
            type_id=transaction_types[1].id,
            amount=75000,
        ),
        Transaction(
            serial_number=3,
            date=today - timedelta(days=5),
            party_id=parties[2].id,
            transaction_note="Office rent",
            type_id=transaction_types[3].id,
            amount=30000,
        ),
        Transaction(
            serial_number=4,
            date=today - timedelta(days=3),
            party_id=parties[0].id,
            transaction_note="Advance for project",
            type_id=transaction_types[2].id,
            amount=100000,
        ),
        Transaction(
            serial_number=5,
            date=today - timedelta(days=1),
            party_id=parties[3].id,
            transaction_note="Service charge",
            type_id=transaction_types[5].id,
            amount=5000,
        ),
    ]
    for transaction in transactions:
        db.add(transaction)
    db.commit()

    print("✅ Seed data created successfully!")
    print(f"   - {len(parties)} parties")
    print(f"   - {len(transaction_types)} transaction types")
    print(f"   - {len(transactions)} transactions")

except Exception as e:
    print(f"❌ Error creating seed data: {e}")
    db.rollback()
finally:
    db.close()
