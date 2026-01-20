from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


# Tabla Product

class ProductBase(SQLModel):
    title: str = Field(min_length=1)
    slug: str = Field(index=True, unique=True)  # URL-friendly
    description: str = Field(default="")
    price_cents: int = Field(ge=0)  # int para evitar floats
    currency: str = Field(default="USD")
    stock: int = Field(default=0, ge=0)


class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Schemas (no tabla)

class ProductCreate(ProductBase):
    pass


class ProductUpdate(SQLModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price_cents: Optional[int] = Field(default=None, ge=0)
    currency: Optional[str] = None
    stock: Optional[int] = Field(default=None, ge=0)


class ProductPublic(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
