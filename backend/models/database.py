"""
Database models placeholder.

This module contains the SQL schema definitions for Supabase PostgreSQL.
In the current MVP, all data is served via mock services. When Supabase is
connected, these models will be used with an async ORM or raw SQL queries.
"""

# SQL schema reference (for Supabase migration files)
SCHEMA_SQL = """
-- Users (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    email TEXT UNIQUE,
    college TEXT,
    degree TEXT,
    graduation_year INTEGER,
    skills TEXT[],
    interests TEXT[],
    career_goal TEXT,
    experience_level TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    file_url TEXT,
    file_name TEXT,
    ats_score INTEGER,
    analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    career_goal TEXT,
    milestones JSONB,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    type TEXT,
    role TEXT,
    questions JSONB,
    answers JSONB,
    scores JSONB,
    overall_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    session_type TEXT,
    messages JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    resume_score INTEGER,
    skills_score INTEGER,
    interview_score INTEGER,
    projects_score INTEGER,
    learning_score INTEGER,
    overall_score INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    category TEXT,
    action TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""
