from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, classes, students, faces, sessions, attendance

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Face Attendance System")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(classes.router)
app.include_router(students.router)
app.include_router(faces.router)
app.include_router(sessions.router)
app.include_router(attendance.router)

@app.get("/")
def root():
    return {"status": "ok"}
