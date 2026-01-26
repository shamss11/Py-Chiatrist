# Py-Chiatrist Implementation Plan

This document outlines the phased approach to building the **Py-Chiatrist** mental health journaling application.

## 🏗 Project Structure
```text
Py-Chiatrist/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database configuration
│   ├── safety.py            # Safety interceptor and crisis detection
│   ├── ingest_data.py       # Script to populate the vector database
│   ├── vector_service.py    # Vector search logic (ChromaDB)
│   ├── rag_service.py       # AI generation logic with clinical context
│   └── requirements.txt     # Python dependencies
├── frontend/                # React application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/      # UI components (JournalInterface, MoodDashboard)
│   │   ├── App.jsx
│   │   └── index.css        # Tailwind styles and custom glassmorphism
│   └── package.json
└── knowledge_base/          # PDF/Text clinical research papers
```

## 📅 Roadmap

### Phase 1: Knowledge Base Setup (Current)
- [ ] Initialize Python environment.
- [ ] Create `ingest_data.py` for chunking and embedding.
- [ ] Set up ChromaDB and store clinical research chunks.
- [ ] Implement `get_relevant_context` in `vector_service.py`.

### Phase 2: RAG Pipeline & Therapist Logic
- [ ] Set up FastAPI with `/journal/submit` endpoint.
- [ ] Implement AI API integration (OpenAI).
- [ ] Create the RAG prompt template using retrieved clinical context.

### Phase 3: Database & Mood Analytics
- [ ] Define SQLAlchemy models: `User`, `Entry`, `Sentiment`.
- [ ] Implement sentimental analysis (using AI or a lightweight library).
- [ ] Write the 7-day average mood calculation function.

### Phase 4: Premium "Calm" UI
- [ ] Bootstrap React app with Vite and Tailwind CSS.
- [ ] Design a high-feel glassmorphism interface.
- [ ] Implement `JournalInterface` with "Typing..." status.
- [ ] Build `MoodDashboard` with Recharts for visual progress.
- [ ] Add the floating Crisis Button.

### Phase 5: Safety & Ethics
- [ ] Implement regex/keyword-based Safety Interceptor.
- [ ] Ensure any high-risk detection bypasses AI for immediate resource links.
- [ ] Add mandatory clinical disclaimer to UI footer.

## 🛡 Safety Guardrails
- **Crisis Detection**: Keywords like "hurt myself", "suicide", "emergency" trigger immediate bypass.
- **Medical Disclaimer**: Clearly state that the app is an AI research tool, not therapy.
- **Data Privacy**: Hashed passwords and secure entry storage.
