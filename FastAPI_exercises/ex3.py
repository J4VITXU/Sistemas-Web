from fastapi import FastAPI

app = FastAPI()

items_db={"item_id1": "BAR1", "item_id2": "BAR2"}

@app.get("/items/")
async def read_item(skip: int | None=None, limit: int = 10):

    return items_db