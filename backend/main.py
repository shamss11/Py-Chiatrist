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
    system_prompt = (
        "You are an AI mental health guide. Use the following clinical research to guide the user: "
        f"[{context_str}]. "
        "Do not give physical medical advice. Be empathetic, non-judgmental, and supportive. "
        "Also, analyze the sentiment of the entry and return it in a specific format at the end."
    )

    try:
        # 4. Get AI Response from Gemini
        prompt = f"System: {system_prompt}\nUser: {submission.content}"
        response = model.generate_content(prompt)
        ai_msg = response.text

        # 5. Extract Sentiment (simplified for demonstration)
        # In a real app, you might do a second call or use a regex to parse a structured response
        # For this task, let's assume a basic analysis
        primary_emotion = "Neutral"
        intensity = 5.0
        if "anxious" in submission.content.lower():
            primary_emotion = "Anxiety"
            intensity = 8.0
        elif "happy" in submission.content.lower():
            primary_emotion = "Happiness"
            intensity = 3.0

        # 6. Store in Database
        new_entry = Entry(user_id=submission.user_id, content=submission.content, ai_response=ai_msg)
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)

        sentiment = Sentiment(
            entry_id=new_entry.id,
            primary_emotion=primary_emotion,
            intensity_score=intensity,
            triggers="Unknown"
        )
        db.add(sentiment)
        db.commit()

        return {
            "response": ai_msg,
            "sentiment": {
                "emotion": primary_emotion,
                "intensity": intensity
            },
            "disclaimer": DISCLAIMER
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/{user_id}/mood-stats")
async def get_mood_stats(user_id: int, db: Session = Depends(get_db)):
    avg_mood = calculate_average_mood(db, user_id)
    return {"average_mood_7d": avg_mood}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
