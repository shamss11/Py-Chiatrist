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

### Phase 1: Knowledge Base Setup
- [X] Initialize Python environment.
- [X] Create `ingest_data.py` for chunking and embedding.
- [X] Set up ChromaDB and store clinical research chunks.
- [X] Implement `get_relevant_context` in `vector_service.py`.

### Phase 2: RAG Pipeline & Therapist Logic
- [X] Set up FastAPI with `/journal/submit` endpoint.
- [X] Implement AI API integration (Gemini 2.0).
- [X] Create the RAG prompt template using retrieved clinical context.

### Phase 3: Database & Mood Analytics
- [X] Define SQLAlchemy models: `User`, `Entry`, `Sentiment`.
- [X] Implement sentimental analysis (using Gemini 2.0).
- [X] Write the 7-day average mood calculation function.

### Phase 4: Premium "Calm" UI
- [X] Bootstrap React app with Vite and Tailwind CSS.
- [X] Design a high-feel glassmorphism interface.
- [X] Implement `JournalInterface` with "Typing..." status.
- [X] Build `MoodDashboard` with Recharts for visual progress.
- [X] Add the floating Crisis Button.

### Phase 5: Safety & Ethics
- [X] Implement regex/keyword-based Safety Interceptor.
- [X] Ensure any high-risk detection bypasses AI for immediate resource links.
- [X] Add mandatory clinical disclaimer to UI footer.

### Phase 6: Advanced Analytics & Deep RAG
- [X] Implement dynamic "Key Insights" based on database sentiment history.
- [X] Create detailed "Trigger Analysis" visualization.
- [X] Expand Knowledge Base with multi-source academic papers.
- [X] Implement AI-driven "Writing Prompts" based on week's emotional trend.

### Phase 7: Clinical Hardening & Multi-Source Synthesis
- [X] Implement metadata-based filtering for RAG (source-specific insights).
- [X] Add "Deep Dive" mode for specific research topics.
- [X] Implement "Mood Prediction" based on historical patterns.
- [X] Add PDF export for clinical journaling summaries.

### Phase 8: Final Polish & Ethics
- [ ] Implement full WCAG 2.1 accessibility compliance.
- [ ] Add dark mode support with clinical-safe color palettes.
- [ ] Conduct final security audit on data persistence.
- [ ] Prepare documentation for clinical researchers.

## 🛡 Safety Guardrails
- **Crisis Detection**: Keywords like "hurt myself", "suicide", "emergency" trigger immediate bypass.
- **Medical Disclaimer**: Clearly state that the app is an AI research tool, not therapy.
- **Data Privacy**: Hashed passwords and secure entry storage.
