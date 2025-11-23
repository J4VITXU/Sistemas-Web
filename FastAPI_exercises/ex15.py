from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

LOG_FILE = "notify.log"

def write_to_log(message: str):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(message + "\n")

@app.post("/notify")
def notify(message: str, background: BackgroundTasks):
    background.add_task(write_to_log, message)
    return {"status": "queued"}
