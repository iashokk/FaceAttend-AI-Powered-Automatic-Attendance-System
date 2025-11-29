# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List

# from .. import models, schemas
# from ..deps import get_db, require_teacher_or_admin

# router = APIRouter(prefix="/classes", tags=["classes"])

# @router.post("", response_model=schemas.ClassOut)
# def create_class(
#     class_in: schemas.ClassCreate,
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     cls = models.Class(
#         name=class_in.name,
#         description=class_in.description,
#         owner_id=user.id,
#     )
#     db.add(cls)
#     db.commit()
#     db.refresh(cls)
#     return cls

# @router.get("", response_model=List[schemas.ClassOut])
# def list_classes(
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     return db.query(models.Class).filter(models.Class.owner_id == user.id).all()

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/classes", tags=["classes"])

@router.post("", response_model=schemas.ClassOut)
def create_class(
    class_in: schemas.ClassCreate,
    db: Session = Depends(get_db),
):
    cls = models.Class(
        name=class_in.name,
        description=class_in.description,
    )
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return cls

@router.get("", response_model=List[schemas.ClassOut])
def list_classes(
    db: Session = Depends(get_db),
):
    return db.query(models.Class).all()
