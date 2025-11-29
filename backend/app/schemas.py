from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List
from .models import UserRole, AttendanceStatus

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.teacher

class UserOut(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ClassBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClassCreate(ClassBase):
    pass

class ClassOut(ClassBase):
    id: int
    # owner_id: int
    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    name: str
    roll_number: str

class StudentCreate(StudentBase):
    class_id: int

class StudentOut(StudentBase):
    id: int
    class_id: int
    is_active: bool
    class Config:
        orm_mode = True

class SessionCreate(BaseModel):
    class_id: int
    title: str
    date: date

class SessionOut(SessionCreate):
    id: int
    class Config:
        orm_mode = True

class AttendanceRecordOut(BaseModel):
    id: int
    session_id: int
    student_id: int
    status: AttendanceStatus
    marked_at: datetime
    source: str

    class Config:
        orm_mode = True
        
class LoginRequest(BaseModel):
    email: EmailStr
    password: str