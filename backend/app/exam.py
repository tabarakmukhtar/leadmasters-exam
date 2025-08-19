from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from . import models, schemas, database
from .auth import get_current_user
import random

router = APIRouter()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/start", response_model=List[schemas.QuestionOut])
def start_exam(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    questions = db.query(models.Question).all()
    selected = random.sample(questions, min(10, len(questions)))  # 10 random questions
    return [schemas.QuestionOut(
        id=q.id,
        question_text=q.question_text,
        option_a=q.option_a,
        option_b=q.option_b,
        option_c=q.option_c,
        option_d=q.option_d
    ) for q in selected]

@router.post("/submit", response_model=schemas.ExamResultOut)
def submit_exam(submit: schemas.ExamSubmitIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Validate time (frontend should send start_time)
    # Accept ISO strings with 'Z' (UTC) from frontend
    from datetime import timezone
    start_str = submit.start_time
    if start_str.endswith('Z'):
        start_str = start_str.replace('Z', '+00:00')
    start_time = datetime.fromisoformat(start_str)
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds() / 60
    if duration > 31:  # 30 min + 1 min grace
        raise HTTPException(status_code=400, detail="Exam time exceeded")
    # Create submission
    submission = models.ExamSubmission(user_id=current_user.id, start_time=start_time, end_time=end_time)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    # Save answers and calculate score
    score = 0
    for ans in submit.answers:
        q = db.query(models.Question).filter(models.Question.id == ans.question_id).first()
        if not q:
            continue
        is_correct = (ans.selected_option.upper() == q.correct_option.upper())
        if is_correct:
            score += 1
        db.add(models.ExamQuestion(submission_id=submission.id, question_id=q.id, selected_option=ans.selected_option))
    submission.score = score
    db.commit()
    return schemas.ExamResultOut(id=submission.id, score=score, total=len(submit.answers), submitted_at=end_time.isoformat())

@router.get("/result/{submission_id}", response_model=schemas.ExamResultOut)
def get_result(submission_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    submission = db.query(models.ExamSubmission).filter(models.ExamSubmission.id == submission_id, models.ExamSubmission.user_id == current_user.id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Result not found")
    return schemas.ExamResultOut(
        id=submission.id,
        score=submission.score,
        total=len(submission.answers),
        submitted_at=submission.end_time.isoformat() if submission.end_time else ""
    )
