from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter() # marca de inicio
    response = await call_next(request)  # ejecuta la petición
    process_time = time.perf_counter() - start  # tiempo transcurrido
    response.headers["X-Process-Time"] = str(round(process_time, 6))
    return response

@app.get("/ping")
def ping():
    return {"ok": True}
