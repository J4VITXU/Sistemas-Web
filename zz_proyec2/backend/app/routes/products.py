from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.products import Product, ProductCreate, ProductPublic, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[ProductPublic])
def list_products(
    session: SessionDep,
    q: Optional[str] = Query(default=None, description="Search by title/description"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Product)

    if q:
        # Búsqueda simple en title/description
        stmt = stmt.where(
            (Product.title.contains(q)) | (Product.description.contains(q))
        )

    stmt = stmt.offset(offset).limit(limit)
    products = session.exec(stmt).all()
    return products


@router.get("/{product_id}", response_model=ProductPublic)
def get_product(product_id: int, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/slug/{slug}", response_model=ProductPublic)
def get_product_by_slug(slug: str, session: SessionDep):
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# crear productos
@router.post("/", response_model=ProductPublic, status_code=201)
def create_product(product_in: ProductCreate, session: SessionDep):
    existing = session.exec(select(Product).where(Product.slug == product_in.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    product = Product.model_validate(product_in)
    product.created_at = datetime.utcnow()
    product.updated_at = datetime.utcnow()

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


# actualizar producto
@router.patch("/{product_id}", response_model=ProductPublic)
def update_product(product_id: int, product_in: ProductUpdate, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    data = product_in.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(product, k, v)

    product.updated_at = datetime.utcnow()

    session.add(product)
    session.commit()
    session.refresh(product)
    return product
