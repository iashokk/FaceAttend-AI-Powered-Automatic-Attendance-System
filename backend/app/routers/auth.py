# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, create_access_token
from ..services.auth_service import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/register", response_model=schemas.UserOut)
# def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
#     # Check if email already exists
#     existing = db.query(models.User).filter(models.User.email == user_in.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     user = models.User(
#         name=user_in.name,
#         email=user_in.email,
#         hashed_password=hash_password(user_in.password),
#         role=user_in.role,
#     )
#     db.add(user)
#     db.commit()
#     db.refresh(user)
#     return user

@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=user_in.password,  # no hashing, for test only
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# @router.post("/login", response_model=schemas.Token)
# def login(
#     data: schemas.LoginRequest,
#     db: Session = Depends(get_db),
# ):
#     # Find user by email
#     user = db.query(models.User).filter(models.User.email == data.email).first()
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid credentials",
#         )

#     # Verify password
#     if not verify_password(data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid credentials",
#         )

#     # Create JWT
#     token = create_access_token({"sub": user.id})
#     return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login(
    data: schemas.LoginRequest,
    db: Session = Depends(get_db),
):
    # Find user by email
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if data.password != user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}
