from fastapi import FastAPI, Body, UploadFile, File, Form
from pydantic import BaseModel, Field

app = FastAPI()

@app.post("/upload")
async def upload_file(
    description: str = Form(...),
    file: UploadFile = File(...),
):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "description": description,
    }
