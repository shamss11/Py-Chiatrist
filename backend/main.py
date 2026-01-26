import os
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import google.generativeai as genai

from fastapi.middleware.cors import CORSMiddleware

from database import get_db, init_db, calculate_average_mood
from models import Entry, Sentiment, User
from vector_service import get_relevant_context
from safety import safety_interceptor, DISCLAIMER

load_dotenv()

app = FastAPI(title="Py-Chiatrist API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

@app.get("/")
async def root():
    return {"status": "ok", "message": "Py-Chiatrist API is running"}

class JournalSubmission(BaseModel):
    user_id: int
    content: str

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/journal/submit")
async def submit_journal(submission: JournalSubmission, db: Session = Depends(get_db)):
    print(f"Received submission: {submission.content[:50]}...")
    # 1. Safety Check
    is_crisis, crisis_msg = safety_interceptor(submission.content)
    if is_crisis:
        print("Crisis detected!")
        return {"response": crisis_msg, "is_crisis": True}

    # 2. Retrieve Clinical Context
    clinical_context = get_relevant_context(submission.content)
    context_str = "\n".join(clinical_context)

    # 3. Construct RAG Prompt
    # We'll ask Gemini to return a structured response for sentiment
    system_prompt = (
        "You are an AI mental health guide. Use the following clinical research to guide the user: "
        f"[{context_str}]. "
        "Do not give physical medical advice. Be empathetic, non-judgmental, and supportive. "
        "\n\nCRITICAL: At the very end of your response, provide a JSON-formatted block for sentiment analysis like this: "
        "SENTIMENT_DATA: {\"emotion\": \"string\", \"intensity\": float_1_to_10, \"triggers\": \"string\"}"
    )

    try:
        # 4. Get AI Response from Gemini
        prompt = f"System: {system_prompt}\nUser: {submission.content}"
        response = model.generate_content(prompt)
        full_text = response.text

        # 5. Extract Sentiment Data using regex
        import json
        import re
        ai_msg = full_text
        primary_emotion = "Neutral"
        intensity = 5.0
        triggers = "Unknown"

        match = re.search(r"SENTIMENT_DATA: (\{.*\})", full_text)
        if match:
            try:
                sentiment_json = json.loads(match.group(1))
                primary_emotion = sentiment_json.get("emotion", "Neutral")
                intensity = float(sentiment_json.get("intensity", 5.0))
                triggers = sentiment_json.get("triggers", "Unknown")
                # Clean the response text of the metadata
                ai_msg = full_text.split("SENTIMENT_DATA:")[0].strip()
            except:
                pass

        # 6. Store in Database
        new_entry = Entry(user_id=submission.user_id, content=submission.content, ai_response=ai_msg)
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)

        sentiment = Sentiment(
            entry_id=new_entry.id,
            primary_emotion=primary_emotion,
            intensity_score=intensity,
            triggers=triggers
        )
        db.add(sentiment)
        db.commit()

        return {
            "response": ai_msg,
            "sentiment": {
                "emotion": primary_emotion,
                "intensity": intensity,
                "triggers": triggers
            },
            "disclaimer": DISCLAIMER
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/{user_id}/mood-trend")
async def get_mood_trend(user_id: int, db: Session = Depends(get_db)):
    """Returns the last 7 days of mood scores for graphing."""
    from datetime import datetime, timedelta
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    trend = db.query(Entry.created_at, Sentiment.intensity_score, Sentiment.primary_emotion)\
        .join(Sentiment, Entry.id == Sentiment.entry_id)\
        .filter(Entry.user_id == user_id)\
        .filter(Entry.created_at >= seven_days_ago)\
        .order_by(Entry.created_at.asc())\
        .all()
    
    return [
        {
            "day": t[0].strftime("%a"), 
            "score": t[1], 
            "emotion": t[2],
            "full_date": t[0].isoformat()
        } for t in trend
    ]

@app.get("/user/{user_id}/mood-stats")
async def get_mood_stats(user_id: int, db: Session = Depends(get_db)):
    avg_mood = calculate_average_mood(db, user_id)
    return {"average_mood_7d": avg_mood}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
