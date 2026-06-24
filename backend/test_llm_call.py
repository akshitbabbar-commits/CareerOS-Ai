import asyncio
import sys
import os

# Add parent path to sys.path so config and services are importable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import settings
from services.llm_service import generate_resume_feedback, generate_skill_gap_analysis

async def test_resume():
    print("--- Test LLM Resume Analysis ---")
    print(f"Active Provider: {settings.LLM_PROVIDER}")
    print(f"Active Model: {settings.GEMINI_MODEL}")
    
    test_content = (
        "John Doe\n"
        "Email: john.doe@example.com\n"
        "Phone: 123-456-7890\n\n"
        "Professional Experience:\n"
        "Software Engineer at TechCorp (2022 - Present)\n"
        "- Developed web applications using Python, FastAPI, and Docker.\n"
        "- Managed SQL databases and set up CI/CD pipelines.\n"
        "- Collaborated with frontend developers to build responsive interfaces."
    )
    
    try:
        res = await generate_resume_feedback("resume.txt", test_content, "Software Engineer")
        print("\nSUCCESS! Received Response:")
        import json
        print(json.dumps(res, indent=2))
    except Exception as e:
        print("\nFAILED with Exception:")
        print(e)

async def test_skills():
    print("\n--- Test LLM Skill Gap Analysis ---")
    try:
        res = await generate_skill_gap_analysis("AI Engineer", ["Python", "FastAPI", "Docker"])
        print("\nSUCCESS! Received Response:")
        import json
        print(json.dumps(res, indent=2))
    except Exception as e:
        print("\nFAILED with Exception:")
        print(e)

if __name__ == "__main__":
    asyncio.run(test_resume())
    asyncio.run(test_skills())
