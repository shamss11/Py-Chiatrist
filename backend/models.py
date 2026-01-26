from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    entries = relationship("Entry", back_populates="user")

class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    ai_response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="entries")
    sentiment = relationship("Sentiment", back_populates="entry", uselist=False)

class Sentiment(Base):
    __tablename__ = "sentiments"
    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("entries.id"))
    primary_emotion = Column(String)
    intensity_score = Column(Float)  # 1-10
    triggers = Column(String)  # Comma-separated list like 'Work, Family'
    
    entry = relationship("Entry", back_populates="sentiment")
