from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.users import User, UserCreate, UserPublic
from app.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic, status_code=201)
def create_user(user: UserCreate, session: SessionDep):
    # 1) comprobar email único
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2) crear User con password_hash
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=get_password_hash(user.password),
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
