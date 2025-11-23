from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, Query, status
from sqlalchemy import Column, String
from sqlalchemy.exc import IntegrityError
from sqlmodel import SQLModel, Field, Session, create_engine, select


# ---------- Models ----------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # email único
    email: str = Field(
        sa_column=Column(
            "email", String, unique=True, index=True, nullable=False
        )
    )
    full_name: str


class UserCreate(SQLModel):
    email: str
    full_name: str


class UserRead(SQLModel):
    id: int
    email: str
    full_name: str


class UserUpdate(SQLModel):
    email: str
    full_name: str


# ---------- DB ----------
DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# ---------- CRUD ----------
# CREATE
@app.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, session: Session = Depends(get_session)):
    user = User.model_validate(user_in)
    session.add(user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")
    session.refresh(user)
    return UserRead.model_validate(user)


# READ (one)
@app.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead.model_validate(user)


# LIST
@app.get("/users", response_model=List[UserRead])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    session: Session = Depends(get_session)
):
    stmt = select(User).offset(skip).limit(limit)
    users = session.exec(stmt).all()
    return [UserRead.model_validate(u) for u in users]


# UPDATE
@app.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, data: UserUpdate, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email = data.email
    user.full_name = data.full_name

    try:
        session.add(user)
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")

    session.refresh(user)
    return UserRead.model_validate(user)


# DELETE
@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)
    session.commit()
    return None
