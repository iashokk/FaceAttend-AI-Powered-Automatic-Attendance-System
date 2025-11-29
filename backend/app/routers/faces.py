# app/routers/faces.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os

import numpy as np

from .. import models
from ..deps import get_db
from ..services.face_service_local import extract_face_encodings

router = APIRouter(prefix="/faces", tags=["faces"])

UPLOAD_DIR = "uploads/faces"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/students/{student_id}")
async def upload_student_face(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # 1. Check student exists
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Read image bytes
    image_bytes = await file.read()

    # (optional) save file to disk
    file_path = os.path.join(UPLOAD_DIR, f"student_{student_id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(image_bytes)

    # 3. Extract face encodings
    try:
        encodings = extract_face_encodings(image_bytes)
    except Exception as ex:
        # Any unexpected error from face_recognition will come here
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {ex}",
        )

    if not encodings:
        raise HTTPException(status_code=400, detail="No face detected in image")

    # 4. Use first face encoding
    encoding = encodings[0]

    # Convert numpy array → list[float] so SQLite JSON can store it
    encoding_list = encoding.tolist()

    face_emb = models.FaceEmbedding(
        student_id=student.id,
        encoding=encoding_list,
    )
    db.add(face_emb)
    db.commit()

    return {
        "message": "Face encoding saved",
        "student_id": student.id,
        "embedding_length": len(encoding_list),
    }
