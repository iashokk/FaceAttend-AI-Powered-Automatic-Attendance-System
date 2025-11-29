# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List

# from .. import models, schemas
# from ..deps import get_db, require_teacher_or_admin

# router = APIRouter(prefix="/sessions", tags=["sessions"])

# @router.post("", response_model=schemas.SessionOut)
# def create_session(
#     session_in: schemas.SessionCreate,
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     cls = db.query(models.Class).filter(models.Class.id == session_in.class_id).first()
#     if not cls:
#         raise HTTPException(status_code=404, detail="Class not found")

#     s = models.Session(
#         class_id=session_in.class_id,
#         title=session_in.title,
#         date=session_in.date,
#     )
#     db.add(s)
#     db.commit()
#     db.refresh(s)
#     return s

# @router.get("/by-class/{class_id}", response_model=List[schemas.SessionOut])
# def list_sessions_by_class(
#     class_id: int,
#     db: Session = Depends(get_db),
#     user: models.User = Depends(require_teacher_or_admin),
# ):
#     return db.query(models.Session).filter(models.Session.class_id == class_id).all()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=schemas.SessionOut)
def create_session(
    session_in: schemas.SessionCreate,
    db: Session = Depends(get_db),
):
    # optional: check class exists
    cls = db.query(models.Class).filter(models.Class.id == session_in.class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    s = models.Session(
        class_id=session_in.class_id,
        title=session_in.title,
        date=session_in.date,
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.get("/by-class/{class_id}", response_model=List[schemas.SessionOut])
def list_sessions_by_class(
    class_id: int,
    db: Session = Depends(get_db),
):
    return db.query(models.Session).filter(models.Session.class_id == class_id).all()
