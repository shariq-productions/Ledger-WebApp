from app.db.database import SessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash

db = SessionLocal()
admin = db.query(Admin).filter(Admin.login_id == "admin1").first()
admin.hashed_password = get_password_hash("Shariq123")
db.commit()
db.close()