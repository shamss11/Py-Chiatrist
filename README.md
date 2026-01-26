<div align="center">
  <img src="./logo.png" width="200" alt="Py-Chiatrist Logo" />
  
  <h1>🧠 PY-CHIATRIST</h1>
  <p><b>AI-Powered Behavioral Health & Clinical Journaling</b></p>

  <p>
    <img src="https://img.shields.io/badge/PYTHON-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FASTAPI-05998B?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/JAVASCRIPT_(JSX)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JS" />
    <img src="https://img.shields.io/badge/TAILWIND_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="CSS" />
    <img src="https://img.shields.io/badge/GEMINI_2.0-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini" />
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/SQLITE-SQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQL" />
    <img src="https://img.shields.io/badge/RAG_ENGINE-ACTIVE-blue?style=for-the-badge" alt="Engine" />
    <img src="https://img.shields.io/badge/LICENSE-MIT-gray?style=for-the-badge" alt="License" />
  </p>

  <br />

  <p><i>Building the future of personal mental wellness through academic context and clinical intelligence.</i></p>
</div>

<hr />

## 📖 Table of Contents
- [🔭 The Vision](#-the-vision)
- [🏗️ System Architecture](#-system-architecture)
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📅 Project Roadmap](#-project-roadmap)
- [⚡ Getting Started](#-getting-started)

<hr />

## 🔭 The Vision
**Py-Chiatrist** is an intelligent journaling platform designed to bridge the gap between personal reflection and clinical psychology. By utilizing **Retrieval-Augmented Generation (RAG)**, Py-Chiatrist grounds every conversation in verified behavioral health data sourced from prestigious institutions like **Harvard** and **Oxford**.

---

## 🏗️ System Architecture
The application is built on a high-performance **Python/FastAPI** backbone, utilizing **ChromaDB** for vector storage and **Google Gemini 2.0 Flash** for sophisticated empathetic reasoning.

- **Vector Engine**: Locally indexed clinical research papers (Python).
- **Core Logic**: FastAPI handling RAG injection and safety filters (Python).
- **UI Layer**: Interactive dashboard built with JavaScript (React/JSX) and styled with Tailwind CSS.

---

## 🚀 Key Features

### 📚 Clinical Knowledge Retrieval
Intelligently queries a vector database of peer-reviewed papers to provide contextually relevant psychological insights.

### ✍️ Intelligent Journaling Interface
A seamless, glassmorphism-styled environment that uses empathetic analysis to help users explorer their thoughts.

### 📊 Behavioral Pattern Analysis
Analyzes journal entries to detect primary emotions, intensity, and potential triggers with interactive visualization.

### 🛡️ Safety & Ethics Layer
Real-time scanning for high-risk keywords with immediate redirection to professional emergency resources.

---

## 🛠️ Tech Stack

**Languages**
- **Python**: Backend API, AI orchestration, and database logic.
- **JavaScript (JSX)**: Frontend components and state management.
- **CSS (Tailwind)**: Modern, responsive glassmorphism design.
- **SQL (SQLite)**: Local persistence for user entries and sentiment stats.

**Frameworks & Libraries**
- **FastAPI**: High-performance Python web framework.
- **React 19**: Modern UI library for the journaling interface.
- **Google Generative AI**: Gemini 2.0 Flash engine.
- **ChromaDB**: Native vector database.
- **Recharts**: Data visualization for mood tracking.

---

## 📅 Project Roadmap

| Phase | Status | Description |
| :--- | :---: | :--- |
| **Phase 1** | ✅ | **Core Architecture**: Foundation of FastAPI, React, and ChromaDB setup. |
| **Phase 2** | ✅ | **RAG & Behavioral Logic**: Mapping clinical context to AI personas via Gemini. |
| **Phase 3** | ✅ | **Persistence Layer**: Formalizing SQLAlchemy models and Sentiment schemas. |
| **Phase 4** | 🔄 | **Emotional Visualization**: Implementing Recharts for 7-day mood mapping. |
| **Phase 5** | 📅 | **Safety Guardrails**: Keyphrase crisis detection and emergency routing. |
| **Phase 6** | 📅 | **Security & Privacy**: E2E encryption for journal entries and metadata. |

---

## ⚡ Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shamss11/Py-Chiatrist.git
   cd py-chiatrist
   ```

2. **Environment Setup**
   Create a `.env` file in the `/backend` directory:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. **Install & Run**
   ```bash
   # Backend
   cd backend && python3 -m uvicorn main:app --reload

   # Frontend
   cd ../frontend && npm install && npm run dev
   ```

---

<div align="center">
  <p>Built with 🐍 and ⚛️ for a healthier mind.</p>
</div>