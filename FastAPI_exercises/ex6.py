from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/pages/{n}")
async def read_page(n: int = Path(ge=1, le=100)):
    return {"page": n}
