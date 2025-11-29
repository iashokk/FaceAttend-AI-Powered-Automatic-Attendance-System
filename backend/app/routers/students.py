# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List

# from .. import models, schemas
# from ..deps import get_db, require_teacher_or_admin

# router = APIRouter(prefix="/students", tags=["students"])

# @router.post("", response_model=schemas.StudentOut)
# def create_student(
#     student_in: schemas.StudentCreate,
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     cls = db.query(models.Class).filter(models.Class.id == student_in.class_id).first()
#     if not cls:
#         raise HTTPException(status_code=404, detail="Class not found")

#     student = models.Student(
#         name=student_in.name,
#         roll_number=student_in.roll_number,
#         class_id=student_in.class_id,
#     )
#     db.add(student)
#     db.commit()
#     db.refresh(student)
#     return student

# @router.get("/by-class/{class_id}", response_model=List[schemas.StudentOut])
# def list_students_by_class(
#     class_id: int,
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     return db.query(models.Student).filter(models.Student.class_id == class_id).all()

# app/routers/students.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/students", tags=["students"])

@router.post("", response_model=schemas.StudentOut)
def create_student(
    student_in: schemas.StudentCreate,
    db: Session = Depends(get_db),
):
    # Make sure class exists (optional but safe)
    cls = db.query(models.Class).filter(models.Class.id == student_in.class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    student = models.Student(
        name=student_in.name,
        roll_number=student_in.roll_number,
        class_id=student_in.class_id,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/by-class/{class_id}", response_model=List[schemas.StudentOut])
def list_students_by_class(
    class_id: int,
    db: Session = Depends(get_db),
):
    return db.query(models.Student).filter(models.Student.class_id == class_id).all()
