import time
import jwt
from jwt import PyJWTError
from datetime import datetime, timedelta
from fastapi import FastAPI, BackgroundTasks, Request, Response, Header, HTTPException

from pydantic import BaseModel

app = FastAPI()

# 16) Middleware: X-Process-Time
@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    response.headers["X-Process-Time"] = str(duration)
    return response

@app.get("/ping")
def ping():
    return {"ok": True}

# 15) /notify con BackgroundTasks
LOG_FILE = "notify.log"

def write_to_log(msg: str):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

@app.post("/notify")
def notify(message: str, background: BackgroundTasks):
    background.add_task(write_to_log, message)
    return {"status": "queued"}

# 18) /login + /me (cookies)
class LoginForm(BaseModel):
    username: str
    password: str | None = None

@app.post("/login")
def login(form: LoginForm, response: Response):
    session_id = f"session-{form.username}"

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        samesite="lax",
    )

    response.headers["X-Logged-In"] = "true"

    return {"message": f"Welcome, {form.username}!"}

@app.get("/me")
def me(request: Request):
    session = request.cookies.get("session_id")
    if session:
        return {
            "logged_in": True,
            "session_id": session
        }
    return {"logged_in": False, "session_id": None}

# 14) /token + /protected (JWT sin OAuth2)
SECRET_KEY = "secret"
ALGORITHM = "HS256"

@app.post("/token")
def get_token(username: str, password: str):
    # Crear un JWT simple
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

def verify_token(auth: str | None):
    if not auth:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    token = auth.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/protected")
def protected_route(authorization: str | None = Header(None)):
    user = verify_token(authorization)
    return {"user": user}
