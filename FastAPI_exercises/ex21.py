from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

# --------- Modelos ---------
class User(BaseModel):
    id: int
    name: str
    age: int = 0
    email: str | None = None
    is_active: bool = True

# PUT: reemplazo completo (los que falten -> defaults del modelo)
class UserUpdate(BaseModel):
    name: str = "anonymous"
    age: int = Field(0, ge=0)
    email: str | None = None
    is_active: bool = True

# PATCH: todos opcionales; solo se aplican los presentes
class UserPatch(BaseModel):
    name: str | None = None
    age: int | None = Field(None, ge=0)
    email: str | None = None
    is_active: bool | None = None

# (Opcional) para crear usuarios de prueba
class UserCreate(BaseModel):
    name: str
    age: int = Field(0, ge=0)
    email: str | None = None
    is_active: bool = True

# --------- "DB" en memoria ---------
USERS: dict[int, User] = {}
_next_id = 1

# Endpoints auxiliares (crear y ver) para probar PUT/PATCH
@app.post("/users", response_model=User)
def create_user(payload: UserCreate):
    global _next_id
    user = User(id=_next_id, **payload.model_dump())
    USERS[user.id] = user
    _next_id += 1
    return user

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    user = USERS.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --------- Ejercicio 21 ---------
@app.put("/users/{user_id}", response_model=User)
def put_user(user_id: int, payload: UserUpdate):
    """
    Reemplaza COMPLETAMENTE al usuario:
    - Si faltan campos en el body, se rellenan con DEFAULTS de UserUpdate.
    - Si no existe, se crea.
    """
    data = payload.model_dump()  # incluye defaults
    user = User(id=user_id, **data)
    USERS[user_id] = user
    return user

@app.patch("/users/{user_id}", response_model=User)
def patch_user(user_id: int, patch: UserPatch):
    """
    Aplica SOLO los campos proporcionados:
    - Campos no enviados permanecen sin cambios.
    """
    existing = USERS.get(user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    changes = patch.model_dump(exclude_unset=True)  # solo lo enviado
    updated = existing.model_copy(update=changes)
    USERS[user_id] = updated
    return updated
 