from fastapi import FastAPI, Header, HTTPException, status, Depends

app = FastAPI()

def get_current_user(x_user: str | None = Header(None)):
    if x_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User"
        )
    return {"username": x_user}

@app.get("/me")
def read_me(current_user: dict = Depends(get_current_user)):
    return current_user
