from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import auth, exam

app = FastAPI(title="Leadmasters Exam API")

# Allow frontend (Vite) to access backend
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # Or ["http://localhost:5173"] for stricter security
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(exam.router, prefix="/exam", tags=["exam"])
