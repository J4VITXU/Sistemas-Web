from fastapi import FastAPI, Depends, Header, HTTPException, status

API_KEY = "secret-key-123"

def require_api_key(x_api_key: str | None = Header(None)):
    if x_api_key is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing X-API-Key")
    if x_api_key != API_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid X-API-Key")

# La aplicamos a TODA la app:
app = FastAPI(dependencies=[Depends(require_api_key)])

@app.get("/ping")
def ping():
    return {"ok": True}
