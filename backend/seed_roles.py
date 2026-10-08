"""
One-off script to seed the `roles` table.
Run once: python seed_roles.py
Safe to re-run — skips roles that already exist.
"""
from dotenv import load_dotenv
load_dotenv()

from app.db.session import SessionLocal
from app.models.user import Role

ROLE_NAMES = ["farmer", "cooperative", "agribusiness", "government", "admin"]

def seed_roles():
    db = SessionLocal()
    try:
        existing = {r.role_name for r in db.query(Role).all()}
        added = []
        for name in ROLE_NAMES:
            if name not in existing:
                db.add(Role(role_name=name))
                added.append(name)
        db.commit()
        print(f"Added roles: {added}" if added else "All roles already exist — nothing to do.")
        print("Current roles:", [r.role_name for r in db.query(Role).all()])
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()