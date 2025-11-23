from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI()

class User(BaseModel):
    id: int
    name: str

users_db = [
    User(id=1, name="Ana"),
    User(id=2, name="Luis"),
    User(id=3, name="Carmen"),
]

@app.get("/users", response_model=List[User])
def list_users():
    return users_db


# ----- STATIC FILES -----
app.mount("/static", StaticFiles(directory="static"), name="static")

