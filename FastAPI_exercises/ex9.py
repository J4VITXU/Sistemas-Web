
from fastapi import FastAPI, Body, UploadFile, File, Form
from pydantic import BaseModel, Field

app = FastAPI()

class ProductIn(BaseModel):
    name: str
    cost_price: float = Field(..., ge=0)
    sale_price: float = Field(..., ge=0)

class ProductOut(BaseModel):
    id: int
    name: str
    sale_price: float

fake_db_id = 0  # contador simple para simular IDs

@app.post("/products", response_model=ProductOut)
def create_product(product: ProductIn):
    global fake_db_id
    fake_db_id += 1

    # Simulación de almacenamiento interno con cost_price (no se filtra fuera)
    internal_record = {
        "id": fake_db_id,
        "name": product.name,
        "cost_price": product.cost_price,  # interno
        "sale_price": product.sale_price,
    }

    # Devolvemos solo el esquema público (ProductOut)
    return {
        "id": internal_record["id"],
        "name": internal_record["name"],
        "sale_price": internal_record["sale_price"],
    }
