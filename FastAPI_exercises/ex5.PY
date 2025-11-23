from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/search")
async def search(q: str = Query(None, min_length=3)):
    return {"q": q}
