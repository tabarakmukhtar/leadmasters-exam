from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)
    exams = relationship("ExamSubmission", back_populates="user")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String(255), nullable=False)
    option_a = Column(String(100), nullable=False)
    option_b = Column(String(100), nullable=False)
    option_c = Column(String(100), nullable=False)
    option_d = Column(String(100), nullable=False)
    correct_option = Column(String(1), nullable=False)  # 'A', 'B', 'C', 'D'

class ExamSubmission(Base):
    __tablename__ = "exam_submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    score = Column(Integer, nullable=True)
    user = relationship("User", back_populates="exams")
    answers = relationship("ExamQuestion", back_populates="submission")

class ExamQuestion(Base):
    __tablename__ = "exam_questions"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("exam_submissions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option = Column(String(1), nullable=True)
    submission = relationship("ExamSubmission", back_populates="answers")
