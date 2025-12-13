# backend/app/models/orders.py

from datetime import datetime
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


# ---------- Order (tabla) ----------

class OrderBase(SQLModel):
    status: str = Field(default="pending")  # "pending", "paid", "cancelled"
    total_cents: int = Field(default=0, ge=0)
    currency: str = Field(default="USD")


class Order(OrderBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relaciones
    items: List["OrderItem"] = Relationship(back_populates="order")


# ---------- OrderItem (tabla) ----------

class OrderItemBase(SQLModel):
    unit_price_cents: int = Field(ge=0)
    quantity: int = Field(ge=1)


class OrderItem(OrderItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    order_id: int = Field(foreign_key="order.id", index=True)
    product_id: int = Field(foreign_key="product.id", index=True)

    # Relaciones
    order: Optional[Order] = Relationship(back_populates="items")


# ---------- Schemas (no tabla) para requests/responses ----------

class OrderItemCreate(SQLModel):
    product_id: int
    quantity: int = Field(ge=1)


class OrderCreate(SQLModel):
    # Lo normal: crear pedido desde carrito validado
    items: List[OrderItemCreate]
    currency: str = Field(default="USD")


class OrderItemPublic(SQLModel):
    id: int
    product_id: int
    unit_price_cents: int
    quantity: int


class OrderPublic(SQLModel):
    id: int
    user_id: int
    status: str
    total_cents: int
    currency: str
    created_at: datetime
    items: List[OrderItemPublic] = Field(default_factory=list)
