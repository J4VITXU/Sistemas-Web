from fastapi import FastAPI, Depends

app = FastAPI()

def recurso():
    print("resource: open")
    try:
        yield {"conn": "fake"}
    finally:
        print("resource: close")

@app.get("/ping")
def ping(_r = Depends(recurso)):
    return {"ok": True}

@app.get("/items/{item_id}")
def read_item(item_id: int, _r = Depends(recurso)):
    return {"item_id": item_id}
