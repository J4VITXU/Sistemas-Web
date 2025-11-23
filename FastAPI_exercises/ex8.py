from fastapi import FastAPI, Body, UploadFile, File, Form
from pydantic import BaseModel, Field

app = FastAPI()

class User(BaseModel):
    name: str
    age: int = Field(..., ge=0)

# (a) Ejemplo simple en /users_simple
@app.post("/users_simple")
def create_user_simple(
    user: User = Body(
        ...,
        example={"name": "Alice", "age": 30}  # ejemplo sencillo
    )
):
    return user

# (b) Varios ejemplos en /users (multi-examples)
@app.post("/users")
def create_user_multi(
    user: User = Body(
        ...,
        examples={
            "simple": {
                "summary": "Usuario básico",
                "value": {"name": "Bob", "age": 22}
            },
            "edge_case": {
                "summary": "Caso límite (edad 0)",
                "value": {"name": "Baby", "age": 0}
            },
            "unicode": {
                "summary": "Con acentos y eñes",
                "value": {"name": "María-José Ñúñez", "age": 45}
            },
        },
    )
):
    return user
