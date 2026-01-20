from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


# Base
class UserBase(SQLModel):
    first_name: str
    last_name: str
    email: str = Field(index=True, unique=True)
    is_admin: bool = Field(default=False)


# Tabla
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Schemas
class UserPublic(UserBase):
    id: int
    created_at: datetime


class UserCreate(SQLModel):
    first_name: str
    last_name: str
    email: str
    password: str
