from fastapi import FastAPI, Response, Request
from pydantic import BaseModel

app = FastAPI()

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
        samesite="lax"
    )

    response.headers["X-Logged-In"] = "true"

    return {"message": f"Welcome, {form.username}!"}

@app.get("/me")
def me(request: Request):
    session = request.cookies.get("session_id")
    if session:
        return {"logged_in": True, "session_id": session}
    return {"logged_in": False, "session_id": None}
