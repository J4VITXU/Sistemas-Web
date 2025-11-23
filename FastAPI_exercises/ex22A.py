from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, List

app = FastAPI()

# -------- 1. Data Model --------
class Hero(BaseModel):
    id: int
    name: str
    age: Optional[int] = None
    secret_name: str


class HeroCreate(BaseModel):
    name: str
    age: Optional[int] = None
    secret_name: str


class HeroUpdate(BaseModel):
    name: str
    age: Optional[int] = None
    secret_name: str


# -------- 2. In-Memory "DB" --------
heroes_db: Dict[int, Hero] = {}
next_id: int = 1


# -------- 3. CRUD Endpoints --------

# CREATE — POST /heroes/
@app.post("/heroes/", response_model=Hero, status_code=status.HTTP_201_CREATED)
def create_hero(payload: HeroCreate):
    global next_id
    hero = Hero(id=next_id, **payload.dict())
    heroes_db[next_id] = hero
    next_id += 1
    return hero


# READ — GET /heroes/{hero_id}
@app.get("/heroes/{hero_id}", response_model=Hero)
def read_hero(hero_id: int):
    hero = heroes_db.get(hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


# LIST — GET /heroes/
@app.get("/heroes/", response_model=List[Hero])
def list_heroes():
    return list(heroes_db.values())


# UPDATE — PUT /heroes/{hero_id}
@app.put("/heroes/{hero_id}", response_model=Hero)
def update_hero(hero_id: int, payload: HeroUpdate):
    hero = heroes_db.get(hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    updated = Hero(id=hero_id, **payload.dict())
    heroes_db[hero_id] = updated
    return updated


# DELETE — DELETE /heroes/{hero_id}
@app.delete("/heroes/{hero_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero(hero_id: int):
    hero = heroes_db.get(hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    del heroes_db[hero_id]
    return None
