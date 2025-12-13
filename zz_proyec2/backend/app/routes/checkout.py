# backend/app/routes/checkout.py
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.products import Product

router = APIRouter(prefix="/checkout", tags=["checkout"])


# ----- Input -----
class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CheckoutValidateIn(BaseModel):
    items: List[CartItemIn]
    currency: Optional[str] = "USD"


# ----- Output -----
class ValidatedItem(BaseModel):
    product_id: int
    title: str
    unit_price_cents: int
    quantity: int
    subtotal_cents: int
    stock_available: int
    currency: str


class InvalidItem(BaseModel):
    product_id: int
    quantity: int
    reason: str  # "not_found", "insufficient_stock"


class CheckoutValidateOut(BaseModel):
    currency: str
    items: List[ValidatedItem]
    invalid_items: List[InvalidItem]
    total_cents: int


@router.post("/validate", response_model=CheckoutValidateOut)
def validate_checkout(payload: CheckoutValidateIn, session: SessionDep):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    validated: List[ValidatedItem] = []
    invalid: List[InvalidItem] = []
    total_cents = 0

    # Para evitar N queries, podríamos cargar todos los ids a la vez,
    # pero para este proyecto va perfecto así.
    for item in payload.items:
        product = session.get(Product, item.product_id)
        if not product:
            invalid.append(
                InvalidItem(product_id=item.product_id, quantity=item.quantity, reason="not_found")
            )
            continue

        if item.quantity > product.stock:
            invalid.append(
                InvalidItem(
                    product_id=product.id,
                    quantity=item.quantity,
                    reason="insufficient_stock",
                )
            )
            continue

        unit = product.price_cents
        subtotal = unit * item.quantity
        total_cents += subtotal

        validated.append(
            ValidatedItem(
                product_id=product.id,
                title=product.title,
                unit_price_cents=unit,
                quantity=item.quantity,
                subtotal_cents=subtotal,
                stock_available=product.stock,
                currency=product.currency,
            )
        )

    # Si quieres obligar a que todo sea válido para continuar:
    # if invalid:
    #     raise HTTPException(status_code=400, detail="Some items are invalid")

    currency = payload.currency or "USD"
    return CheckoutValidateOut(
        currency=currency,
        items=validated,
        invalid_items=invalid,
        total_cents=total_cents,
    )
