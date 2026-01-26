<div align="center">
  <br />
  <h1>🧠 P Y - C H I A T R I S T</h1>
  <h3>AI-Powered Behavioral Health & Clinical Journaling</h3>
  
  <p>
    <a href="https://www.python.org"><img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" /></a>
    <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.100+-05998B?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" /></a>
    <a href="https://www.langchain.com/"><img src="https://img.shields.io/badge/RAG-LangChain-white?style=for-the-badge&logo=chainlink" alt="RAG" /></a>
  </p>

  <p><i>Evidence-based mental health guidance fueled by academic research.</i></p>
  
  <br />
</div>

<hr />

## 🌟 Overview

**Py-Chiatrist** is an intelligent journaling platform designed to bridge the gap between personal reflection and clinical psychology. By utilizing **Retrieval-Augmented Generation (RAG)**, Py-Chiatrist grounds every conversation in verified behavioral health data sourced from prestigious institutions like **Harvard** and **Oxford**.

The app acts as a digital confidant that focuses exclusively on the mental aspect of well-being. It provides users with a safe space to "vent" through journaling while receiving guidance rooted in behavioral psychology and clinical research—ensuring a more effective and informed support experience.

---

## 🚀 Key Features

### 📚 **Clinical Knowledge Retrieval**
- **Academic RAG**: Intelligently queries a vector database of peer-reviewed papers to provide contextually relevant psychological insights.
- **Fact-Based Guidance**: Explains the "why" behind emotions using established behavioral science rather than generic AI responses.

### ✍️ **Intelligent Journaling Interface**
- **Conversational "Doctor"**: A seamless chat experience that uses Socratic questioning to help users explore their thoughts.
- **Strictly Mental Health**: Engineered to identify and deflect physical health queries, maintaining a clear focus on psychological support.

### 📊 **Behavioral Pattern Analysis**
- **Sentiment Tracking**: Analyzes journal entries to detect primary emotions, intensity, and potential triggers.
- **Mood Visualization**: Offers users a clear look at their mental health trajectory over time through interactive dashboards.

### 🛡️ **Safety & Ethics Layer**
- **Crisis Interceptor**: Real-time scanning for high-risk keywords with immediate redirection to professional emergency resources.
- **Privacy First**: Sensitive journal data is handled with local-first logic and secure storage practices.

---

## 🛠️ Technology Stack

**Frontend**
* **Framework**: React 19
* **Styling**: Tailwind CSS & Minimalist "Calm" Design
* **Visualization**: Recharts for emotional trend analysis
* **State**: React Hooks & Context API

**Backend & AI**
* **Language**: Python 3.10+
* **API Framework**: FastAPI
* **Orchestration**: LangChain (RAG Pipeline)
* **Vector DB**: ChromaDB or FAISS
* **AI Model**: Google Gemini 1.5 Pro / GPT-4o Integration

**Infrastructure**
* **Database**: SQLite/PostgreSQL (via SQLAlchemy)
* **Embedding Model**: Sentence-Transformers (all-MiniLM-L6-v2)
* **Version Control**: Git / GitHub

---

## ⚡ Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/shamss11/Py-Chiatrist.git
    cd py-chiatrist
    ```

2.  **Environment Setup**
    Create a `.env` file in the `/backend` directory:
    ```env
    LLM_API_KEY="your_api_key_here"
    DATABASE_URL="sqlite:///./therapy.db"
    ```

3.  **Install & Run Backend**
    ```bash
    cd backend
    pip install -r requirements.txt
    python main.py
    ```

4.  **Install & Run Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 🗺️ Roadmap

| Phase | Status | Description |
| :--- | :---: | :--- |
| **Phase 1** | ✅ | **Core Architecture**: Foundation of FastAPI, React, and ChromaDB setup. |
| **Phase 2** | 🔄 | **RAG & Behavioral Logic**: Mapping clinical context to AI personas via Gemini. |
| **Phase 3** | 📅 | **Persistence Layer**: Formalizing SQLAlchemy models and Sentiment schemas. |
| **Phase 4** | 📅 | **Emotional Visualization**: Implementing Recharts for 7-day mood mapping. |
| **Phase 5** | 📅 | **Safety Guardrails**: Keyphrase crisis detection and emergency routing. |
| **Phase 6** | � | **Security & Privacy**: E2E encryption for journal entries and metadata. |

---

## 🤝 Contribution Workflow

We utilize a structured Git strategy to maintain code integrity.

* `master`: **Production**. Stable releases only.
* `dev-backend`: Feature development for RAG, API, and DB logic.
* `dev-frontend`: UI/UX enhancements and dashboard visualization.

---

<div align="center">
  <p>Built with 🐍 and <a href="https://react.dev">React</a> for a healthier mind.</p>
</div>