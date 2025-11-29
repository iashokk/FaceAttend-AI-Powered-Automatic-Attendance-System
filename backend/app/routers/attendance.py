# from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from datetime import datetime
# import os
# import numpy as np

# from .. import models, schemas
# from ..deps import get_db
# from ..services.face_service_local import extract_face_encodings, find_best_match

# router = APIRouter(prefix="/attendance", tags=["attendance"])

# UPLOAD_DIR = "uploads/group_photos"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# @router.post("/sessions/{session_id}/photo")
# async def upload_group_photo(
#     session_id: int,
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db),
# ):
#     # 1. ensure session exists
#     session = db.query(models.Session).filter(models.Session.id == session_id).first()
#     if not session:
#         raise HTTPException(status_code=404, detail="Session not found")

#     # 2. read file
#     image_bytes = await file.read()

#     # optional: save to disk
#     file_path = os.path.join(UPLOAD_DIR, f"session_{session_id}_{file.filename}")
#     with open(file_path, "wb") as f:
#         f.write(image_bytes)

#     photo = models.Photo(session_id=session.id, image_path=file_path)
#     db.add(photo)
#     db.commit()
#     db.refresh(photo)

#     # 3. get encodings from group photo
#     try:
#         group_encodings = extract_face_encodings(image_bytes)
#     except Exception as ex:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {ex}")

#     if not group_encodings:
#         return {"message": "No faces detected in group photo"}

#     # 4. load all face embeddings
#     face_embs = db.query(models.FaceEmbedding).all()
#     if not face_embs:
#         raise HTTPException(status_code=400, detail="No registered face embeddings found")

#     known_encodings = [np.array(fe.encoding) for fe in face_embs]
#     student_ids = [fe.student_id for fe in face_embs]

#     # 5. match each face to a student
#     marked_names: List[str] = []
#     marked_ids: set[int] = set()

#     for enc in group_encodings:
#         best_idx, dist = find_best_match(enc, known_encodings, tolerance=0.5)
#         if best_idx is None:
#             continue

#         sid = student_ids[best_idx]
#         if sid in marked_ids:
#             continue

#         student = db.query(models.Student).filter(models.Student.id == sid).first()
#         if not student:
#             continue

#         # check if already recorded
#         existing = (
#             db.query(models.AttendanceRecord)
#             .filter(
#                 models.AttendanceRecord.session_id == session.id,
#                 models.AttendanceRecord.student_id == student.id,
#             )
#             .first()
#         )
#         if existing:
#             continue

#         ar = models.AttendanceRecord(
#             session_id=session.id,
#             student_id=student.id,
#             status=models.AttendanceStatus.present,
#             marked_at=datetime.utcnow(),
#             source="PhotoLocal",
#         )
#         db.add(ar)
#         marked_ids.add(student.id)
#         marked_names.append(student.name)

#     photo.processed = True
#     db.commit()

#     return {
#         "message": "Attendance updated from photo",
#         "faces_detected": len(group_encodings),
#         "students_marked_count": len(marked_names),
#         "marked_present": marked_names,
#     }


# @router.get("/sessions/{session_id}", response_model=List[schemas.AttendanceRecordOut])
# def get_attendance_for_session(
#     session_id: int,
#     db: Session = Depends(get_db),
# ):
#     records = (
#         db.query(models.AttendanceRecord)
#         .filter(models.AttendanceRecord.session_id == session_id)
#         .all()
#     )
#     return records

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import os
import numpy as np

from .. import models, schemas
from ..deps import get_db
from ..services.face_service_local import extract_face_encodings, find_best_match

router = APIRouter(prefix="/attendance", tags=["attendance"])

UPLOAD_DIR = "uploads/group_photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/sessions/{session_id}/photo")
async def upload_group_photo(
    session_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # 1. ensure session exists
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. read file
    image_bytes = await file.read()

    # save to disk (optional but nice)
    file_path = os.path.join(UPLOAD_DIR, f"session_{session_id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(image_bytes)

    photo = models.Photo(session_id=session.id, image_path=file_path)
    db.add(photo)
    db.commit()
    db.refresh(photo)

    # 3. get encodings from group photo
    try:
        group_encodings = extract_face_encodings(image_bytes)
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error processing image: {ex}")

    if not group_encodings:
        return {"message": "No faces detected in group photo"}

    # 4. load all face embeddings
    face_embs = db.query(models.FaceEmbedding).all()
    if not face_embs:
        raise HTTPException(status_code=400, detail="No registered face embeddings found")

    known_encodings = [np.array(fe.encoding) for fe in face_embs]
    student_ids_for_embeddings = [fe.student_id for fe in face_embs]

    # 5. find which students are present in this photo
    matched_present_ids: set[int] = set()
    matched_present_names: List[str] = []

    for enc in group_encodings:
        best_idx, dist = find_best_match(enc, known_encodings, tolerance=0.5)
        if best_idx is None:
            continue

        sid = student_ids_for_embeddings[best_idx]
        if sid in matched_present_ids:
            continue

        student = db.query(models.Student).filter(models.Student.id == sid).first()
        if not student:
            continue

        matched_present_ids.add(student.id)
        matched_present_names.append(student.name)

    # 6. get all students in this class (for this session)
    class_students = (
        db.query(models.Student)
        .filter(models.Student.class_id == session.class_id)
        .all()
    )

    # 7. for each student in that class → set present/absent for this session
    for student in class_students:
        desired_status = (
            models.AttendanceStatus.present
            if student.id in matched_present_ids
            else models.AttendanceStatus.absent
        )

        existing = (
            db.query(models.AttendanceRecord)
            .filter(
                models.AttendanceRecord.session_id == session.id,
                models.AttendanceRecord.student_id == student.id,
            )
            .first()
        )

        now = datetime.utcnow()

        if existing:
            # update if status changed (for re-uploads)
            if existing.status != desired_status:
                existing.status = desired_status
                existing.marked_at = now
                existing.source = "PhotoLocal"
        else:
            # create new record
            ar = models.AttendanceRecord(
                session_id=session.id,
                student_id=student.id,
                status=desired_status,
                marked_at=now,
                source="PhotoLocal",
            )
            db.add(ar)

    photo.processed = True
    db.commit()

    # 8. Response summary
    total_students = len(class_students)
    present_count = len(matched_present_ids)
    absent_count = total_students - present_count

    return {
        "message": "Attendance updated from photo (present & absent marked)",
        "faces_detected": len(group_encodings),
        "students_in_class": total_students,
        "present_count": present_count,
        "absent_count": absent_count,
        "marked_present": matched_present_names,
    }

@router.get("/sessions/{session_id}", response_model=List[schemas.AttendanceRecordOut])
def get_attendance_for_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    records = (
        db.query(models.AttendanceRecord)
        .filter(models.AttendanceRecord.session_id == session_id)
        .all()
    )
    return records
