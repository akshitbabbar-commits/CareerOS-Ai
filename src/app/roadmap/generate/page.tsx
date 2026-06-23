'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CAREER_ROLES } from '@/lib/constants';
import { type RoadmapInput } from '@/lib/roadmapGenerator';
import { saveRoadmap } from '@/lib/roadmaps';
import {
  ArrowLeft, Sparkles, Briefcase, Clock, Zap,
  GraduationCap, X, Rocket, Target, Brain
} from 'lucide-react';
import Link from 'next/link';

type ExperienceLevel = RoadmapInput['experienceLevel'];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'beginner', label: 'Beginner', description: '0–1 years of experience', icon: <GraduationCap size={18} /> },
  { value: 'intermediate', label: 'Intermediate', description: '1–3 years of experience', icon: <Target size={18} /> },
  { value: 'advanced', label: 'Advanced', description: '3+ years of experience', icon: <Brain size={18} /> },
];

export default function GenerateRoadmapPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [dreamRole, setDreamRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  // ---- Skill tag handlers ----
  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim();
      if (!skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // ---- Generate ----
  const handleGenerate = async () => {
    setErrorMsg('');

    if (!dreamRole) {
      setErrorMsg('Please select a dream role.');
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Generate roadmap using the Gemini-powered backend API
      const urls = [
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/roadmap/generate`,
        `http://localhost:8000/api/roadmap/generate`
      ];

      let response = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log(`[roadmap] Requesting roadmap from: ${url}`);
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              goal: dreamRole,
              current_skills: skills,
              experience_level: experienceLevel,
              hours_per_week: hoursPerWeek,
            }),
          });
          if (res.ok) {
            response = res;
            break;
          }
          const text = await res.text();
          lastError = new Error(text || `Status code ${res.status}`);
        } catch (e: any) {
          console.warn(`[roadmap] Endpoint failed: ${url}`, e);
          lastError = e;
        }
      }

      if (!response) {
        throw lastError || new Error('Could not communicate with the roadmap generation service.');
      }

      const generatedData = await response.json();

      // Form full roadmap object to save
      const roadmap = {
        ...generatedData,
        id: generatedData.id || `roadmap_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`,
        userId: user!.id,
        createdAt: generatedData.createdAt || new Date().toISOString(),
        updatedAt: generatedData.updatedAt || new Date().toISOString(),
        progress: generatedData.progress || 0,
      };

      // 2. Persist to Supabase
      const saved = await saveRoadmap(user!.id, roadmap);
      if (!saved) {
        throw new Error('Could not save roadmap to database. Please try again.');
      }

      // 3. Navigate to the roadmap viewer
      router.push('/roadmap');
    } catch (err: any) {
      console.error('[generate] Failed:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/roadmap">
            <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">
              Generate Career Roadmap
            </h1>
            <p className="text-xs text-[var(--muted)]">
              Tell us about your goals and we&apos;ll create a personalized learning path
            </p>
          </div>
        </div>

        {/* Hero Banner */}
        <Card
          variant="glass"
          hoverable={false}
          className="p-6 border border-[var(--card-border)] bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-transparent relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/25">
              <Rocket size={24} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">AI-Powered Roadmap Builder</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Our engine analyzes your current skills and target role to generate a structured,
                phase-by-phase learning roadmap with curated resources and practical projects.
              </p>
            </div>
          </div>
        </Card>

        {/* Form */}
        <div className="space-y-6">
          {/* Dream Role */}
          <Card variant="default" hoverable={false} className="border border-[var(--card-border)] shadow-sm">
            <CardHeader className="border-b border-[var(--divider)] py-4 px-6 mb-0">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary-500" />
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Dream Role</CardTitle>
              </div>
              <CardDescription>What career role are you targeting?</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAREER_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setDreamRole(role)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer text-left ${
                      dreamRole === role
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-sm shadow-primary-500/10'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:border-primary-500/30 hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Skills */}
          <Card variant="default" hoverable={false} className="border border-[var(--card-border)] shadow-sm">
            <CardHeader className="border-b border-[var(--divider)] py-4 px-6 mb-0">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-accent-500" />
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Current Skills</CardTitle>
              </div>
              <CardDescription>
                Skills you already have — we&apos;ll skip topics you&apos;ve mastered
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Input
                placeholder="Type a skill and press Enter (e.g. Python, React, SQL)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <Badge key={idx} variant="primary" className="flex items-center gap-1 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-primary-500/20 rounded-full p-0.5 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {skills.length === 0 && (
                <p className="text-xs text-[var(--muted)] italic">
                  No skills added yet. Leave empty if you&apos;re starting from scratch.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Experience Level */}
          <Card variant="default" hoverable={false} className="border border-[var(--card-border)] shadow-sm">
            <CardHeader className="border-b border-[var(--divider)] py-4 px-6 mb-0">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-violet-500" />
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Experience Level</CardTitle>
              </div>
              <CardDescription>How much relevant experience do you have?</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExperienceLevel(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      experienceLevel === opt.value
                        ? 'border-primary-500 bg-primary-500/10 shadow-sm shadow-primary-500/10'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary-500/30 hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        experienceLevel === opt.value
                          ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                          : 'bg-[var(--muted-bg)] text-[var(--muted)]'
                      }`}
                    >
                      {opt.icon}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${
                        experienceLevel === opt.value ? 'text-primary-500' : 'text-[var(--foreground)]'
                      }`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-[var(--muted)]">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hours per Week */}
          <Card variant="default" hoverable={false} className="border border-[var(--card-border)] shadow-sm">
            <CardHeader className="border-b border-[var(--divider)] py-4 px-6 mb-0">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <CardTitle className="text-base font-bold text-[var(--foreground)]">Hours Per Week</CardTitle>
              </div>
              <CardDescription>
                How many hours can you dedicate to learning each week?
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="flex-1 h-2 bg-[var(--muted-bg)] rounded-full appearance-none cursor-pointer accent-primary-500
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/30
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex items-baseline gap-1 shrink-0 min-w-[72px] justify-end">
                  <span className="text-2xl font-extrabold text-primary-500">{hoursPerWeek}</span>
                  <span className="text-xs text-[var(--muted)]">h/wk</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--muted)] px-1">
                <span>2 hrs (casual)</span>
                <span>40 hrs (full-time)</span>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 text-sm font-medium animate-scale-in">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Generate Button */}
          <Button
            size="lg"
            fullWidth
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={isGenerating}
            className="py-4 text-base font-bold"
          >
            <Sparkles size={20} />
            {isGenerating ? 'Generating your roadmap...' : 'Generate My Roadmap'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
