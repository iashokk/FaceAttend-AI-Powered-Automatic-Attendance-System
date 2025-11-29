from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, DateTime,
    Enum, Boolean
)
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"

class AttendanceStatus(str, enum.Enum):
    present = "Present"
    absent = "Absent"
    late = "Late"
    excused = "Excused"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.teacher)
    created_at = Column(DateTime, default=datetime.utcnow)

    #classes = relationship("Class", back_populates="owner")

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    # owner_id = Column(Integer, ForeignKey("users.id"))

    # owner = relationship("User", back_populates="classes")
    students = relationship("Student", back_populates="class_")
    sessions = relationship("Session", back_populates="class_")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"))
    is_active = Column(Boolean, default=True)

    class_ = relationship("Class", back_populates="students")
    face_embeddings = relationship("FaceEmbedding", back_populates="student")
    attendance_records = relationship("AttendanceRecord", back_populates="student")

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    encoding = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="face_embeddings")

# class Session(Base):
#     __tablename__ = "sessions"
#     id = Column(Integer, primary_key=True, index=True)
#     class_id = Column(Integer, ForeignKey("classes.id"))
#     title = Column(String, nullable=False)
#     date = Column(Date, nullable=False)

#     class_ = relationship("Class", back_populates="sessions")
#     photos = relationship("Photo", back_populates="session")
#     attendance_records = relationship("AttendanceRecord", back_populates="session")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False)

    class_ = relationship("Class", back_populates="sessions")
    photos = relationship("Photo", back_populates="session")
    attendance_records = relationship("AttendanceRecord", back_populates="session")

# class Photo(Base):
#     __tablename__ = "photos"
#     id = Column(Integer, primary_key=True, index=True)
#     session_id = Column(Integer, ForeignKey("sessions.id"))
#     image_path = Column(String, nullable=False)
#     uploaded_at = Column(DateTime, default=datetime.utcnow)
#     processed = Column(Boolean, default=False)

#     session = relationship("Session", back_populates="photos")

# class AttendanceRecord(Base):
#     __tablename__ = "attendance_records"
#     id = Column(Integer, primary_key=True, index=True)
#     session_id = Column(Integer, ForeignKey("sessions.id"))
#     student_id = Column(Integer, ForeignKey("students.id"))
#     status = Column(Enum(AttendanceStatus), default=AttendanceStatus.present)
#     marked_at = Column(DateTime, default=datetime.utcnow)
#     source = Column(String, default="PhotoLocal")

#     session = relationship("Session", back_populates="attendance_records")
#     student = relationship("Student", back_populates="attendance_records")

class Photo(Base):
    __tablename__ = "photos"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    image_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)

    session = relationship("Session", back_populates="photos")


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.present)
    marked_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String, default="PhotoLocal")

    session = relationship("Session", back_populates="attendance_records")
    student = relationship("Student", back_populates="attendance_records")
