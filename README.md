# 🚀 CareerOS AI

> **Your AI-Powered Career Operating System.**

CareerOS AI is a comprehensive, production-quality web application that helps students and job seekers manage their entire career journey — from discovering career paths to becoming job-ready — all powered by AI.

![CareerOS AI](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Career Mentor** | Full-screen chat with an AI career advisor — get personalized, actionable guidance |
| 📄 **Resume Analyzer** | Drag-and-drop resume upload with ATS scoring, keyword analysis, and improvement suggestions |
| 📊 **Skill Gap Analyzer** | Compare your skills against target roles with radar chart visualization |
| 🗺️ **Learning Roadmap** | AI-generated 12-week learning plans with milestones, resources, and progress tracking |
| 🎤 **AI Mock Interview** | Practice technical, behavioral, and HR interviews with AI-powered feedback scoring |
| 💼 **Job Preparation Hub** | Interactive checklists for resume, portfolio, GitHub, LinkedIn, and certifications |
| 🛠️ **Project Recommender** | Curated project ideas filtered by difficulty, tech stack, and career goal |
| 💬 **Floating AI Chatbot** | Persistent chatbot widget accessible from any page |
| 📈 **Career Readiness Dashboard** | Unified score combining all career signals with visual metrics |
| ⚙️ **Settings & Profile** | Theme toggle, profile management, notification preferences |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────┐
│            Frontend (Next.js 16)              │
│   App Router • React 19 • TypeScript • TW v4  │
├───────────────────────────────────────────────┤
│            Backend (FastAPI)                   │
│   REST API • Pydantic v2 • Async • CORS       │
├───────────────────────────────────────────────┤
│     LLM Service Layer (Configurable)          │
│   OpenAI API ←→ Mock Provider (fallback)      │
├───────────────────────────────────────────────┤
│     Data Layer (Supabase-ready)               │
│   PostgreSQL • Auth • Storage                  │
└───────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **npm** (comes with Node.js)

### 1. Clone & Install Frontend

```bash
git clone <your-repo-url>
cd career

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your settings (optional — works with mock data by default)
```

### 3. Start the Frontend

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 4. Start the Backend (Optional)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at **http://localhost:8000/docs**

---

## 🗂️ Project Structure

```
career/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/             # Auth pages (login, signup, forgot-password)
│   │   ├── dashboard/          # Main dashboard
│   │   ├── ai-mentor/          # AI career mentor chat
│   │   ├── resume-analyzer/    # Resume upload & analysis
│   │   ├── skill-gap/          # Skill gap analyzer
│   │   ├── roadmap/            # Learning roadmap
│   │   ├── mock-interview/     # AI mock interview
│   │   ├── job-prep/           # Job preparation hub
│   │   ├── projects/           # Project recommender
│   │   ├── profile/            # User profile
│   │   └── settings/           # App settings
│   ├── components/
│   │   ├── ui/                 # Button, Card, Input, Badge, Modal, etc.
│   │   ├── layout/             # Navbar, Sidebar, Footer, DashboardLayout
│   │   └── chat/               # FloatingChatbot widget
│   ├── context/                # AuthContext, ThemeContext
│   ├── data/                   # Mock data for demo mode
│   ├── lib/                    # Utilities (API client, constants)
│   └── types/                  # TypeScript type definitions
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Environment configuration
│   ├── requirements.txt        # Python dependencies
│   ├── routers/                # API route handlers
│   │   ├── auth.py             # POST /api/auth/login, signup, forgot-password
│   │   ├── profile.py          # GET/PUT /api/profile
│   │   ├── resume.py           # POST /api/resume/analyze, GET /history
│   │   ├── skills.py           # GET /api/skills/gap
│   │   ├── roadmap.py          # GET /api/roadmap, PUT /progress
│   │   ├── interview.py        # POST /api/interview/start, /answer, GET /history
│   │   └── chat.py             # POST /api/chat/message, GET /history
│   ├── services/               # Business logic
│   │   ├── llm_service.py      # LLM provider abstraction
│   │   ├── mock_service.py     # Mock data for all features
│   │   └── resume_service.py   # Resume validation & analysis
│   └── models/                 # Data models
│       ├── schemas.py          # Pydantic request/response schemas
│       └── database.py         # SQL schema (Supabase-ready)
├── .env.example                # Environment variables template
├── .env.local                  # Local environment (gitignored)
└── package.json                # Node.js dependencies
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/signup` | User registration |
| `POST` | `/api/auth/forgot-password` | Password reset |
| `GET` | `/api/profile` | Get user profile |
| `PUT` | `/api/profile` | Update user profile |
| `POST` | `/api/resume/analyze` | Upload & analyze resume |
| `GET` | `/api/resume/history` | Resume analysis history |
| `GET` | `/api/skills/gap?role=` | Skill gap analysis |
| `GET` | `/api/roadmap?goal=` | Learning roadmap |
| `PUT` | `/api/roadmap/progress` | Update milestone |
| `POST` | `/api/interview/start` | Start mock interview |
| `POST` | `/api/interview/answer` | Submit interview answer |
| `GET` | `/api/interview/history` | Interview history |
| `POST` | `/api/chat/message` | Send chat message |
| `GET` | `/api/chat/history` | Chat history |
| `GET` | `/api/dashboard` | Dashboard metrics |
| `GET` | `/api/projects/recommend` | Project recommendations |

---

## 🎨 Design System

- **Primary**: Indigo/Violet gradient (`#6366f1` → `#8b5cf6`)
- **Accent**: Teal (`#14b8a6`)
- **Typography**: Inter (body) + Space Grotesk (headings)
- **Dark Mode**: Full dark/light theme support
- **Glassmorphism**: Frosted-glass cards with backdrop blur
- **Animations**: Smooth transitions, fade-ins, shimmer loaders

---

## 🤖 AI Configuration

CareerOS AI supports configurable LLM providers. By default, it uses **mock data** so the app works without any API keys.

To enable live AI:

```env
# .env.local
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-key-here
LLM_MODEL=gpt-4
LLM_BASE_URL=https://api.openai.com/v1
```

Any OpenAI-compatible API works (OpenAI, Azure OpenAI, Anthropic via proxy, local models via Ollama, etc.)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| File Upload | React Dropzone |
| Markdown | React Markdown |
| Backend | FastAPI (Python) |
| Validation | Pydantic v2 |
| Database | Supabase PostgreSQL (planned) |
| Auth | Supabase Auth (planned) |
| LLM | OpenAI-compatible API |

---

## 🧪 Testing

```bash
# Frontend build check
npm run build

# Backend syntax check
cd backend && python -c "from main import app; print('✓ Backend imports OK')"
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy automatically on push
```

### Backend (Railway / Render / Fly.io)
```bash
# Deploy the backend/ directory as a Python service
# Set environment variables
# Use: uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ for the future of career development.
</p>
