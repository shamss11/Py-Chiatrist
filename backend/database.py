from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import os
from models import Base, Entry, Sentiment

DATABASE_URL = "sqlite:///./backend/pychiatrist.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_average_mood(db, user_id: int):
    """Calculates a user's 'Average Mood' (intensity score) over the last 7 days."""
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Query for intensities within the last 7 days for the user
    avg_score = db.query(func.avg(Sentiment.intensity_score))\
        .join(Entry, Sentiment.entry_id == Entry.id)\
        .filter(Entry.user_id == user_id)\
        .filter(Entry.created_at >= seven_days_ago)\
        .scalar()
    
    return round(avg_score, 2) if avg_score else 0.0
