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
    context_str = "\n".join([f"Source: {c['source']}\nContent: {c['content']}" for c in clinical_context])

    # 3. Construct RAG Prompt
    system_prompt = (
        "You are an AI mental health guide. Use the following clinical research to guide the user:\n"
        f"{context_str}\n\n"
        "Do not give physical medical advice. Be empathetic, non-judgmental, and supportive. "
        "IMPORTANT: When referencing research, mention the specific source (e.g., 'According to the Harvard Study...'). "
        "\n\nCRITICAL: At the very end of your response, provide a JSON-formatted block for sentiment analysis like this: "
        "SENTIMENT_DATA: {\"emotion\": \"string\", \"intensity\": float_1_to_10, \"triggers\": \"1-2 words only, comma separated\"}"
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
            "sources": [c['source'] for c in clinical_context],
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
    
    from sqlalchemy import func
    
    # Group by date to avoid label clutter
    # Use SQLite date function
    trend = db.query(
        func.date(Entry.created_at).label('date'),
        func.avg(Sentiment.intensity_score).label('avg_score'),
        func.max(Sentiment.primary_emotion).label('top_emotion') # Just take one emotion for the day
    )\
    .join(Sentiment, Entry.id == Sentiment.entry_id)\
    .filter(Entry.user_id == user_id)\
    .filter(Entry.created_at >= seven_days_ago)\
    .group_by(func.date(Entry.created_at))\
    .order_by('date')\
    .all()
    
    return [
        {
            "day": datetime.strptime(t[0], "%Y-%m-%d").strftime("%a"), 
            "score": round(t[1], 1), 
            "emotion": t[2],
            "full_date": t[0]
        } for t in trend
    ]

@app.get("/user/{user_id}/history")
async def get_journal_history(user_id: int, db: Session = Depends(get_db)):
    """Returns all journal entries with their sentiment data."""
    entries = db.query(Entry)\
        .outerjoin(Sentiment, Entry.id == Sentiment.entry_id)\
        .filter(Entry.user_id == user_id)\
        .order_by(Entry.created_at.desc())\
        .all()
    
    return [
        {
            "id": e.id,
            "content": e.content,
            "ai_response": e.ai_response,
            "created_at": e.created_at.isoformat(),
            "sentiment": {
                "emotion": e.sentiment.primary_emotion if e.sentiment else "Unknown",
                "intensity": e.sentiment.intensity_score if e.sentiment else 0,
                "triggers": e.sentiment.triggers if e.sentiment else ""
            }
        } for e in entries
    ]

@app.get("/user/{user_id}/mood-stats")
async def get_mood_stats(user_id: int, db: Session = Depends(get_db)):
    avg_mood = calculate_average_mood(db, user_id)
    return {"average_mood_7d": avg_mood}

@app.get("/user/{user_id}/insights")
async def get_advanced_insights(user_id: int, db: Session = Depends(get_db)):
    """Returns dynamic behavioral insights based on history."""
    from datetime import datetime, timedelta
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    entries = db.query(Sentiment, Entry)\
        .join(Entry, Sentiment.entry_id == Entry.id)\
        .filter(Entry.user_id == user_id)\
        .filter(Entry.created_at >= seven_days_ago)\
        .all()
    
    if not entries:
        return {
            "top_emotion": "Neutral",
            "stability": "Pending",
            "trigger_summary": "Not enough data yet.",
            "insight_message": "Document your first few days to see behavioral patterns."
        }

    # Calculate Top Emotion
    emotions = [e[0].primary_emotion for e in entries]
    top_emotion = max(set(emotions), key=emotions.count)
    
    # Calculate Stability
    intensities = [e[0].intensity_score for e in entries]
    avg_intensity = sum(intensities) / len(intensities)
    variance = sum((x - avg_intensity) ** 2 for x in intensities) / len(intensities)
    
    stability = "High" if variance < 1 else "Moderate" if variance < 4 else "Low"
    
    # Trigger Summary (just combining recent triggers)
    all_triggers = []
    for e in entries:
        if e[0].triggers and e[0].triggers != "Unknown":
            # Clean and truncate
            ts = [t.strip().title() for t in e[0].triggers.split(",")]
            all_triggers.extend(ts)
    
    unique_triggers = list(set(all_triggers))
    trigger_summary = ", ".join([t[:15] + ".." if len(t) > 17 else t for t in unique_triggers[:3]]) if unique_triggers else "None identified"

    return {
        "top_emotion": top_emotion,
        "stability": stability,
        "trigger_summary": trigger_summary,
        "insight_message": f"Your emotional landscape is currently dominated by {top_emotion.lower()} states with {stability.lower()} stability."
    }

@app.get("/user/{user_id}/trigger-distribution")
async def get_trigger_distribution(user_id: int, db: Session = Depends(get_db)):
    """Returns frequency of different emotional triggers."""
    from datetime import datetime, timedelta
    from collections import Counter
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    sentiments = db.query(Sentiment)\
        .join(Entry, Sentiment.entry_id == Entry.id)\
        .filter(Entry.user_id == user_id)\
        .filter(Entry.created_at >= seven_days_ago)\
        .all()
    
    triggers = []
    for s in sentiments:
        if s.triggers and s.triggers != "Unknown":
            # Split by comma in case of multiple triggers
            ts = [t.strip().title() for t in s.triggers.split(",")]
            triggers.extend(ts)
            
    counts = Counter(triggers)
    # Only return top 10 triggers to avoid clutter
    return [{"name": name, "value": count} for name, count in counts.most_common(10)]

@app.get("/user/{user_id}/suggested-prompts")
async def get_suggested_prompts(user_id: int, db: Session = Depends(get_db)):
    """Generates personalized reflection prompts using AI based on history."""
    from datetime import datetime, timedelta
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Get recent entries for context
    recent_entries = db.query(Entry)\
        .filter(Entry.user_id == user_id)\
        .order_by(Entry.created_at.desc())\
        .limit(5)\
        .all()
    
    if not recent_entries:
        return [
            "What is one thing you're looking forward to this week?",
            "Describe a moment today that made you feel peaceful."
        ]

    # Build a context string from recent entries
    history_context = "\n---\n".join([e.content for e in recent_entries])
    
    prompt = (
        "You are a clinical journaling assistant. Below are a user's recent journal entries:\n\n"
        f"{history_context}\n\n"
        "Based on these 'answers', generate 3 highly personalized 'Suggested Focus' items. "
        "For each item, provide:\n"
        "1. A focus question (under 15 words)\n"
        "2. A 'starter' sentence that helps them begin writing (e.g., 'Looking back at that moment, I realize...')\n\n"
        "Format: Return a JSON list of objects with keys 'prompt' and 'starter'. No other text."
    )

    try:
        response = model.generate_content(prompt)
        # Clean up in case Gemini wraps in ```json
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        import json
        return json.loads(text)[:3]
    except Exception as e:
        print(f"AI Prompt generation failed: {e}")
        return [
            {"prompt": "What's on your mind today?", "starter": "Right now, I'm thinking about..."},
            {"prompt": "How are you feeling?", "starter": "Today has felt..."},
        ]

@app.get("/user/{user_id}/mood-prediction")
async def get_mood_prediction(user_id: int, db: Session = Depends(get_db)):
    """Predicts next 3 days of mood based on history."""
    entries = db.query(Entry)\
        .join(Sentiment, Entry.id == Sentiment.entry_id)\
        .filter(Entry.user_id == user_id)\
        .order_by(Entry.created_at.asc())\
        .limit(14)\
        .all()
    
    if len(entries) < 3:
        return {"prediction": "Insufficient data for clinical prediction. Keep journaling!", "status": "accumulating"}

    history = []
    for e in entries:
        s = db.query(Sentiment).filter(Sentiment.entry_id == e.id).first()
        history.append(f"Date: {e.created_at.date()}, Emotion: {s.primary_emotion}, Intensity: {s.intensity_score}")

    history_str = "\n".join(history)
    prompt = (
        "You are a clinical predictive assistant. Based on the following user sentiment history:\n\n"
        f"{history_str}\n\n"
        "1. Predict the user's emotional trajectory for the next 3 days with a concise clinical rationale (max 60 words).\n"
        "2. Provide 3 specific, actionable clinical advice bullet points for the user to maintain or improve their wellbeing based on their patterns.\n\n"
        "Format your response EXACTLY as a JSON object with this structure:\n"
        '{"prediction": "...", "advice": ["...", "...", "..."]}'
    )

    try:
        response = model.generate_content(prompt)
        import json
        # Clean up possible markdown code blocks from response
        text = response.text.strip().replace('```json', '').replace('```', '')
        data = json.loads(text)
        return {"prediction": data.get("prediction"), "advice": data.get("advice", []), "status": "ready"}
    except Exception as e:
        print(f"Prediction failed: {e}")
        return {
            "prediction": "Predictive engine warming up. Check back soon.", 
            "advice": ["Maintain consistent journaling", "Monitor sleep patterns", "Engage in light physical activity"],
            "status": "fallback"
        }

@app.get("/clinical/deep-dive")
async def clinical_deep_dive(topic: str):
    """Performs an academic deep dive into a specific psychological topic."""
    clinical_context = get_relevant_context(topic, n_results=5)
    context_str = "\n".join([f"Source: {c['source']}\nContent: {c['content']}" for c in clinical_context])

    prompt = (
        "You are a clinical research synthesist. A user is asking for a deep dive into the following topic: "
        f"'{topic}'.\n\n"
        "Use the following academic research chunks to provide a detailed, structured, and informative analysis:\n"
        f"{context_str}\n\n"
        "Structure your response with:\n"
        "1. Overview of the topic\n"
        "2. Key Clinical Findings (cite sources)\n"
        "3. Practical Applications (if applicable)\n"
        "4. Limitations/Further Research\n\n"
        "Maintain a high academic tone but remain accessible. Do not provide medical diagnoses."
    )

    try:
        response = model.generate_content(prompt)
        return {"analysis": response.text.strip(), "sources": [c['source'] for c in clinical_context]}
    except Exception as e:
        print(f"Deep dive failed: {e}")
        raise HTTPException(status_code=500, detail="Synthesis engine busy. Try again shortly.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
