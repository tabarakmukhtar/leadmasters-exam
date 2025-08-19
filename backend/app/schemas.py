from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class QuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

class AnswerIn(BaseModel):
    question_id: int
    selected_option: str

class ExamSubmitIn(BaseModel):
    answers: List[AnswerIn]
    start_time: str

class ExamResultOut(BaseModel):
    id: int
    score: int
    total: int
    submitted_at: str
