"""
LLM Service Layer — configurable provider for AI-powered features.

Supports:
  - "mock"   → returns pre-written realistic responses (default)
  - "openai" → uses OpenAI-compatible API (GPT-4, etc.)
  - "gemini" → uses Google Gemini REST API

Configured via environment variables:
  LLM_PROVIDER, LLM_API_KEY, LLM_MODEL, LLM_BASE_URL, GEMINI_API_KEY, GEMINI_MODEL
"""

from __future__ import annotations

import json
from typing import Optional

import httpx
import traceback

from config import settings
from services.mock_service import (
    mock_chat_reply,
    mock_interview_feedback,
    mock_resume_analysis,
    mock_skill_gap,
    mock_roadmap,
    mock_project_recommendations,
    generate_mock_analysis,
    mock_interview_start,
)


async def _call_gemini(system_prompt: str, user_message: str) -> str:
    """Make an API call to the Gemini REST API."""
    import asyncio
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    # Log the URL being called and model name (excluding API key from logs)
    print(f"[llm_service] Calling Gemini API URL: https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent")
    print(f"[llm_service] Using model: {settings.GEMINI_MODEL}")
    
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": user_message}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_prompt}
            ]
        },
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 4096
        }
    }
    
    # Enable native JSON mode for Gemini when structured formatting is required
    if "json" in system_prompt.lower() or "json" in user_message.lower():
        payload["generationConfig"]["responseMimeType"] = "application/json"

    max_retries = 3
    backoff = 1.0  # seconds
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except httpx.HTTPStatusError as e:
            if e.response.status_code in {429, 502, 503, 504} and attempt < max_retries - 1:
                print(f"[llm_service] Transient status {e.response.status_code} on attempt {attempt + 1}. Retrying in {backoff}s...")
                await asyncio.sleep(backoff)
                backoff *= 2.0
                continue
            
            status_code = e.response.status_code
            error_msg = f"Gemini API returned status {status_code}: {e.response.text}"
            print(f"[llm_service] HTTP Status Error from Gemini API: {status_code}")
            print(f"[llm_service] Response Body: {e.response.text}")
            traceback.print_exc()
            raise ValueError(error_msg)
        except (httpx.RequestError, asyncio.TimeoutError) as e:
            if attempt < max_retries - 1:
                print(f"[llm_service] Network error '{type(e).__name__}' on attempt {attempt + 1}. Retrying in {backoff}s...")
                await asyncio.sleep(backoff)
                backoff *= 2.0
                continue
            
            error_msg = f"Network timeout/connectivity issue calling Gemini API: {str(e)}"
            print(f"[llm_service] Network Exception in _call_gemini: {e}")
            traceback.print_exc()
            raise ValueError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error calling Gemini API: {str(e)}"
            print(f"[llm_service] Unexpected Exception in _call_gemini: {e}")
            traceback.print_exc()
            raise ValueError(error_msg)


async def generate_chat_response(message: str, session_type: str = "mentor") -> dict:
    """Generate an AI mentor / chatbot reply."""
    print(f"[llm_service] generate_chat_response triggered. Selected LLM_PROVIDER: {settings.LLM_PROVIDER}")
    try:
        if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
        elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
            raise ValueError("LLM_API_KEY is not configured in environment variables.")

        if settings.LLM_PROVIDER == "mock":
            print("[llm_service] generate_chat_response falling back to mock_chat_reply")
            return mock_chat_reply(message, session_type)

        system_prompt = _get_system_prompt(session_type)
        if settings.LLM_PROVIDER == "gemini":
            reply = await _call_gemini(system_prompt, message)
        else:
            reply = await _call_llm(system_prompt, message)
        return {
            "reply": reply,
            "suggestions": [
                "Tell me more about this topic",
                "How do I get started?",
                "What resources do you recommend?",
            ],
        }
    except Exception as e:
        print(f"[llm_service] Exception in generate_chat_response: {e}")
        traceback.print_exc()
        raise e


async def generate_resume_feedback(file_name: str, file_content: str = "", target_role: str = "Software Engineer") -> dict:
    """Analyze a resume and return ATS score + category breakdown matching Frontend type."""
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        return generate_mock_analysis(file_name, target_role)

    prompt = f"""Analyze this resume file named '{file_name}' for the target career role: '{target_role}'.
Return a JSON object matching exactly the following format (ensure camelCase for all top-level keys):
{{
  "atsScore": 75,
  "formatting": {{
    "score": 85,
    "maxScore": 100,
    "label": "Formatting & Structure",
    "details": ["Good margins", "Clear headings", "Needs more white space"]
  }},
  "keywords": {{
    "score": 60,
    "maxScore": 100,
    "label": "Keywords & Skills",
    "details": ["Found key programming languages", "Missing role-specific keywords"]
  }},
  "grammar": {{
    "score": 90,
    "maxScore": 100,
    "label": "Grammar & Style",
    "details": ["No typos found", "Avoid passive voice"]
  }},
  "impact": {{
    "score": 65,
    "maxScore": 100,
    "label": "Work Impact & Metrics",
    "details": ["Add numbers to experience", "Strengthen action verbs"]
  }},
  "suggestions": [
    {{
      "id": "sug_1",
      "category": "keywords",
      "severity": "high",
      "title": "Add Missing Technical Keywords",
      "description": "Your resume is missing critical keywords.",
      "original": "Worked on ML algorithms",
      "suggested": "Engineered and optimized custom ML classification pipelines using PyTorch"
    }}
  ],
  "missingSkills": ["MLOps", "Model Deployment", "Docker"]
}}

Resume content:
{file_content[:4000]}"""

    system_prompt = "You are an expert ATS resume analyzer. Always respond with valid JSON matching the exact TypeScript schema specified."
    
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        result = json.loads(reply)
        result["id"] = f"res_live_{hash(file_name) % 10000:04d}"
        result["fileName"] = file_name
        return result
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error: {e}.")
        raise ValueError(f"Failed to parse AI resume feedback: {e}")


async def generate_skill_gap_analysis(role: str, current_skills: list[str] = None) -> dict:
    """Generate a skill gap analysis for a target role."""
    if current_skills is None:
        current_skills = []
        
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        return mock_skill_gap(role, current_skills)

    prompt = f"""Analyze the skill gap for someone targeting the role of '{role}' who currently knows these skills: {', '.join(current_skills)}.
Return a JSON object matching exactly this format (ensure camelCase for all top-level keys):
{{
  "targetRole": "{role}",
  "matchPercentage": 65,
  "readinessLevel": "getting-there",
  "currentSkills": [
    {{ "name": "Python", "category": "Programming", "level": "advanced", "priority": "high" }}
  ],
  "requiredSkills": [
    {{ "name": "Python", "category": "Programming", "level": "advanced", "priority": "high", "description": "..." }}
  ],
  "missingSkills": [
    {{ "name": "TensorFlow", "category": "ML Frameworks", "level": "advanced", "priority": "high", "description": "..." }}
  ]
}}
Ensure the readinessLevel is one of: "not-ready", "getting-there", "almost-ready", "ready". Match percentage should be between 0 and 100. Category must be one of: Programming, AI/ML, ML Frameworks, Data, DevOps, Cloud, Frontend, Mathematics, Tools, Architecture, Computer Science, Quality. Level must be one of: beginner, intermediate, advanced, expert. Priority must be one of: high, medium, low.
Only return valid JSON."""

    system_prompt = "You are a career skills analyst. Always respond with valid JSON matching the exact schema specified."
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        return json.loads(reply)
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error in skill gap: {e}.")
        raise ValueError(f"Failed to generate skill gap analysis using AI: {e}")


async def generate_roadmap(
    goal: str,
    current_skills: list[str] = None,
    experience_level: str = "beginner",
    hours_per_week: int = 10
) -> dict:
    """Generate a personalized learning roadmap."""
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        return mock_roadmap(goal)

    skills_str = ", ".join(current_skills) if current_skills else "None (starting from scratch)"
    prompt = f"""Create a highly personalized learning roadmap for someone aiming to become a '{goal}'.
Candidate details:
- Current skills already mastered: {skills_str}
- Experience level: {experience_level}
- Dedication time: {hours_per_week} hours per week

Instructions:
1. Generate a structured learning path with distinct phases/milestones (at least 5 milestones).
2. Skip or minimize topics related to the current skills already mastered.
3. Scale the duration and difficulty of the milestones based on the candidate's experience level and hours per week.
4. For each milestone, provide:
   - A unique ID like 'ms_1', 'ms_2', etc.
   - Title and description.
   - Starting week number (week) and estimated duration (duration, e.g., '3 weeks').
   - A checklist of tasks. Each task must have a unique ID (e.g., 't_1', 't_2', etc.), a title, and a type. Task types MUST be strictly one of: 'learn', 'practice', 'project', 'certification'.
   - Recommended resources. Each resource must have a title, URL (a realistic URL or '#'), a type (strictly one of: 'video', 'article', 'course', 'documentation'), and a platform (e.g., 'YouTube', 'Coursera', 'Official').
5. Respond with a JSON object matching exactly this structure (ensure camelCase for all keys):
{{
  "careerGoal": "{goal}",
  "totalDuration": "Estimated total duration (e.g., '12 weeks')",
  "milestones": [
    {{
      "id": "ms_1",
      "title": "Milestone Title",
      "description": "Short description of what to master in this milestone",
      "week": 1,
      "duration": "2 weeks",
      "completed": false,
      "tasks": [
        {{ "id": "t_1", "title": "Task title...", "completed": false, "type": "learn" }}
      ],
      "resources": [
        {{ "title": "Resource title...", "url": "https://...", "type": "video", "platform": "YouTube" }}
      ]
    }}
  ]
}}
Only return valid JSON."""

    system_prompt = "You are a career roadmap planner. Always respond with valid JSON matching the exact schema specified."
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        return json.loads(reply)
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error in roadmap: {e}.")
        raise ValueError(f"Failed to generate roadmap using AI: {e}")


async def generate_interview_feedback(question_id: str, answer: str, target_role: str = "Software Engineer") -> dict:
    """Score an interview answer."""
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        from services.mock_service import mock_interview_feedback as mock_eval
        return mock_eval(question_id, answer, target_role)

    prompt = f"""Score this mock interview answer for the target career role '{target_role}'.
Question ID: {question_id}
User's Answer: "{answer[:2000]}"

Return a JSON object matching exactly this format:
{{
  "score": 8,
  "strengths": ["Clear explanation of components", "Logical flow"],
  "weaknesses": ["Lacks runtime scaling details"],
  "improvements": ["Explain how caching solves latency issues"],
  "suggested_answer": "A strong model answer would be..."
}}
Make the score (0-10) and feedback reflect the actual quality of the answer. Short/empty answers should receive low scores (e.g. 1-3) and critical feedback.
Only return valid JSON."""

    system_prompt = "You are a senior technical interviewer. Always respond with valid JSON matching the exact schema specified."
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        return {"feedback": json.loads(reply)}
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error in interview feedback: {e}.")
        raise ValueError(f"Failed to evaluate answer using AI: {e}")


async def generate_interview_questions(interview_type: str, role: str, difficulty: str) -> dict:
    """Generate 10 custom interview questions using AI."""
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        return mock_interview_start(interview_type, role, difficulty)

    prompt = f"""Generate exactly 10 interview questions for a candidate practicing for the target role of '{role}'.
Interview Type: {interview_type} (e.g. Technical, HR, Mixed)
Difficulty Level: {difficulty} (e.g. Easy, Medium, Hard)

Return a JSON object containing a "questions" key with an array of objects matching this exact format:
{{
  "questions": [
    {{
      "id": "q_1",
      "question": "The actual question text here...",
      "category": "The specific skill or category tested (e.g. System Design, Recursion, Culture Fit)",
      "difficulty": "{difficulty}"
    }}
  ]
}}
Ensure the 'id' fields are distinct values like 'q_1', 'q_2', ..., 'q_10'. Only return valid JSON."""

    system_prompt = "You are an expert technical recruiter and interviewer. Always respond with valid JSON matching the exact schema specified."
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        data = json.loads(reply)
        import uuid
        data["session_id"] = f"sess_{uuid.uuid4().hex[:8]}"
        return data
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error in question generation: {e}.")
        raise ValueError(f"Failed to generate questions using AI: {e}")


async def generate_project_recommendations(goal: str, level: str) -> list[dict]:
    """Recommend projects based on career goal and skill level."""
    if settings.LLM_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
    elif settings.LLM_PROVIDER == "openai" and not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is not configured in environment variables.")

    if settings.LLM_PROVIDER == "mock":
        return mock_project_recommendations(goal, level)

    prompt = f"Recommend 6 coding projects for someone at '{level}' level aiming to become a '{goal}'. Return a JSON array."
    system_prompt = "You are a project mentor. Respond with a valid JSON array matching the TypeScript schema."
    if settings.LLM_PROVIDER == "gemini":
        reply = await _call_gemini(system_prompt, prompt)
    else:
        reply = await _call_llm(system_prompt, prompt)
        
    try:
        return json.loads(reply)
    except Exception as e:
        print(f"[llm_service] JSON parse or LLM error in project recommend: {e}.")
        raise ValueError(f"Failed to generate project recommendations using AI: {e}")


# ─── Private helpers ─────────────────────────────────────────────────

def _get_system_prompt(session_type: str) -> str:
    """Return the system prompt for the given session type."""
    prompts = {
        "mentor": (
            "You are CareerOS AI Mentor — an expert career advisor for tech professionals. "
            "Provide actionable, specific advice based on the user's career goals. "
            "Use markdown formatting. Be encouraging but honest."
        ),
        "chatbot": (
            "You are CareerOS AI Assistant — a helpful chatbot that answers career-related "
            "questions concisely. Keep responses under 200 words unless more detail is needed."
        ),
    }
    return prompts.get(session_type, prompts["chatbot"])


async def _call_llm(system_prompt: str, user_message: str) -> str:
    """Make an API call to the configured LLM provider."""
    import asyncio
    headers = {
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.LLM_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.7,
        "max_tokens": 1500,
    }

    max_retries = 3
    backoff = 1.0  # seconds
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{settings.LLM_BASE_URL}/chat/completions",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            if e.response.status_code in {429, 502, 503, 504} and attempt < max_retries - 1:
                print(f"[llm_service] Transient status {e.response.status_code} from LLM provider on attempt {attempt + 1}. Retrying in {backoff}s...")
                await asyncio.sleep(backoff)
                backoff *= 2.0
                continue
            
            status_code = e.response.status_code
            error_msg = f"LLM provider API returned status {status_code}: {e.response.text}"
            print(f"[llm_service] HTTP Status Error from LLM API: {status_code}")
            print(f"[llm_service] Response Body: {e.response.text}")
            traceback.print_exc()
            raise ValueError(error_msg)
        except (httpx.RequestError, asyncio.TimeoutError) as e:
            if attempt < max_retries - 1:
                print(f"[llm_service] Network error '{type(e).__name__}' from LLM provider on attempt {attempt + 1}. Retrying in {backoff}s...")
                await asyncio.sleep(backoff)
                backoff *= 2.0
                continue
            
            error_msg = f"Network timeout/connectivity issue calling LLM provider: {str(e)}"
            print(f"[llm_service] Network Exception in _call_llm: {e}")
            traceback.print_exc()
            raise ValueError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error calling LLM provider API: {str(e)}"
            print(f"[llm_service] Unexpected Exception in _call_llm: {e}")
            traceback.print_exc()
            raise ValueError(error_msg)
