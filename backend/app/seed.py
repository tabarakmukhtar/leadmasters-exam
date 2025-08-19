from .database import SessionLocal, engine
from .models import Base, Question

# Create tables
Base.metadata.create_all(bind=engine)

def seed_questions():
    db = SessionLocal()
    if db.query(Question).count() == 0:
        questions = [
            Question(question_text="What is the capital of France?", option_a="Paris", option_b="London", option_c="Berlin", option_d="Rome", correct_option="A"),
            Question(question_text="2 + 2 = ?", option_a="3", option_b="4", option_c="5", option_d="6", correct_option="B"),
            Question(question_text="Which is a mammal?", option_a="Shark", option_b="Frog", option_c="Whale", option_d="Eagle", correct_option="C"),
            Question(question_text="Fastest land animal?", option_a="Lion", option_b="Cheetah", option_c="Horse", option_d="Tiger", correct_option="B"),
            Question(question_text="H2O is?", option_a="Oxygen", option_b="Hydrogen", option_c="Water", option_d="Salt", correct_option="C"),
            Question(question_text="Sun rises in?", option_a="West", option_b="North", option_c="East", option_d="South", correct_option="C"),
            Question(question_text="Largest planet?", option_a="Earth", option_b="Mars", option_c="Jupiter", option_d="Venus", correct_option="C"),
            Question(question_text="HTML stands for?", option_a="Hyper Trainer Marking Language", option_b="Hyper Text Markup Language", option_c="Hyper Text Marketing Language", option_d="Hyper Text Markup Leveler", correct_option="B"),
            Question(question_text="Which is a prime number?", option_a="4", option_b="6", option_c="9", option_d="7", correct_option="D"),
            Question(question_text="Python is a?", option_a="Snake", option_b="Programming Language", option_c="Car", option_d="Fruit", correct_option="B"),
        ]
        db.add_all(questions)
        db.commit()
    db.close()

if __name__ == "__main__":
    seed_questions()
