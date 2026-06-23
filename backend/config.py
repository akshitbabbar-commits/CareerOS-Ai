"""Application configuration loaded from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env, parent .env, or parent .env.local
base_dir = Path(__file__).resolve().parent
dotenv_paths = [
    base_dir / ".env",
    base_dir.parent / ".env",
    base_dir.parent / ".env.local"
]
for path in dotenv_paths:
    if path.exists():
        print(f"[config] Found and loading environment from: {path.resolve()}")
        # Force override to ensure active process variables match .env declarations
        load_dotenv(dotenv_path=path, override=True)


class Settings:
    """Central configuration from .env or environment."""

    HOST: str
    PORT: int
    DEBUG: bool
    ALLOWED_ORIGINS: list[str]
    LLM_PROVIDER: str
    LLM_API_KEY: str
    LLM_MODEL: str
    LLM_BASE_URL: str
    GEMINI_API_KEY: str
    GEMINI_MODEL: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    def __init__(self):
        # Server
        self.HOST = os.getenv("HOST", "0.0.0.0")
        self.PORT = int(os.getenv("PORT", "8000"))
        self.DEBUG = os.getenv("DEBUG", "true").lower() == "true"

        # CORS – allowed origins for the Next.js frontend
        self.ALLOWED_ORIGINS = os.getenv(
            "ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")

        # LLM provider settings
        self.LLM_PROVIDER = os.getenv("LLM_PROVIDER", "mock")       # "openai" | "gemini" | "mock"
        self.LLM_API_KEY = os.getenv("LLM_API_KEY", "")
        self.LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4")
        self.LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        self.GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

        # Supabase (for future integration)
        self.SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        self.SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
        self.SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    @property
    def use_live_llm(self) -> bool:
        """Whether a real LLM provider is configured."""
        if self.LLM_PROVIDER == "gemini":
            return bool(self.GEMINI_API_KEY)
        return self.LLM_PROVIDER != "mock" and bool(self.LLM_API_KEY)


settings = Settings()

print("[config] Active settings values:")
print(f"  - LLM_PROVIDER: {settings.LLM_PROVIDER}")
print(f"  - GEMINI_API_KEY set: {bool(settings.GEMINI_API_KEY)}")
print(f"  - GEMINI_MODEL: {settings.GEMINI_MODEL}")
print(f"  - LLM_API_KEY set: {bool(settings.LLM_API_KEY)}")
print(f"  - LLM_MODEL: {settings.LLM_MODEL}")
