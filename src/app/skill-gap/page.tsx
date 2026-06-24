'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressRing, ProgressBar } from '@/components/ui/Badge';
import { getLatestSkillGapAnalysis, saveSkillGapAnalysis } from '@/lib/skills';
import type { SkillGapAnalysis } from '@/types';
import {
  ArrowLeft, Target, Award, Brain, BarChart2, ShieldAlert,
  ChevronRight, RefreshCw, Sparkles, BookOpen, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function SkillGapPage() {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [selectedRole, setSelectedRole] = useState<string>('AI Engineer');
  const [activeTab, setActiveTab] = useState<'missing' | 'current' | 'all'>('missing');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync selectedRole with profile's target role when profile loads
  useEffect(() => {
    if (profile?.targetRole) {
      setSelectedRole(profile.targetRole);
    } else if (profile?.careerGoal) {
      setSelectedRole(profile.careerGoal);
    }
  }, [profile]);

  // Load latest analysis on mount or selectedRole change
  const loadAnalysis = async () => {
    if (!user?.id) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const cached = await getLatestSkillGapAnalysis(user.id, selectedRole);
      if (cached) {
        setAnalysis(cached);
      } else {
        // No saved analysis yet, trigger one immediately
        await triggerAnalysis(selectedRole);
      }
    } catch (err: any) {
      console.error('[skill-gap] Failed to load cached report:', err);
      // Fallback: try triggering immediately
      await triggerAnalysis(selectedRole);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAnalysis();
    }
  }, [user?.id, selectedRole]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const triggerAnalysis = async (role: string) => {
    if (!user?.id) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const skillsQuery = profile?.skills ? profile.skills.join(',') : '';
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;
      const url = `${API_URL}/api/skills/gap?role=${encodeURIComponent(role)}&current_skills=${encodeURIComponent(skillsQuery)}`;
      console.log(`[skill-gap] Fetching comparison via: ${url}`);
      
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status code ${res.status}`);
      }

      const data = await res.json();
      const newAnalysis: SkillGapAnalysis = {
        targetRole: data.targetRole,
        matchPercentage: data.matchPercentage,
        readinessLevel: data.readinessLevel,
        currentSkills: data.currentSkills || [],
        requiredSkills: data.requiredSkills || [],
        missingSkills: data.missingSkills || []
      };

      setAnalysis(newAnalysis);

      // Save report in Supabase
      try {
        await saveSkillGapAnalysis(user.id, newAnalysis);
      } catch (dbErr: any) {
        console.error('[skill-gap] Database save failed:', dbErr);
        // Do not crash the app, analysis is still valid in local state
      }

    } catch (err: any) {
      console.error('[skill-gap] Analysis failed:', err);
      setErrorMessage(err.message || 'Failed to trigger skill evaluation.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerate = () => {
    triggerAnalysis(selectedRole);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const getPriorityBadge = (prio: 'high' | 'medium' | 'low') => {
    if (prio === 'high') return <Badge variant="danger">Critical</Badge>;
    if (prio === 'medium') return <Badge variant="warning">Important</Badge>;
    return <Badge variant="default">Recommended</Badge>;
  };

  const getReadinessBadge = (level: string) => {
    if (level === 'ready') return <Badge variant="success">Job Ready</Badge>;
    if (level === 'almost-ready') return <Badge variant="primary">Almost Ready</Badge>;
    if (level === 'getting-there') return <Badge variant="warning">Getting There</Badge>;
    return <Badge variant="danger">Action Required</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">Skill Gap Radar</h1>
              <p className="text-xs text-[var(--muted)]">Map your technical profile against real-world target roles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[var(--muted)] shrink-0">TARGET ROLE:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-sm font-bold bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all cursor-pointer font-medium"
            >
              <option value="AI Engineer">AI Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRegenerate}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 py-2 px-3"
            >
              <RefreshCw className={isAnalyzing ? 'animate-spin' : ''} size={14} />
              Re-analyze
            </Button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs flex gap-3 items-start">
            <AlertTriangle className="shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-bold block mb-0.5">Evaluation Error</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {isAnalyzing && !analysis ? (
          /* Initial Loading State */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 h-[250px] rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
              <div className="md:col-span-8 h-[250px] rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
            </div>
            <div className="h-[400px] rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
          </div>
        ) : !analysis ? (
          /* Empty State */
          <Card variant="glass" className="p-12 text-center flex flex-col items-center justify-center border border-[var(--card-border)] min-h-[300px]">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-4">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">No Analysis Available</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mt-1 mb-6">
              Configure your target career path and click trigger below to analyze technical competency gaps.
            </p>
            <Button onClick={handleRegenerate}>Trigger Skill Evaluation</Button>
          </Card>
        ) : (
          /* Hydrated Data View */
          <div className="space-y-8">
            {/* Top Summary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Match Meter */}
              <Card variant="glass" className="md:col-span-4 flex flex-col items-center justify-center text-center p-8 border border-[var(--card-border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">Skill Match Rate</CardTitle>
                  <CardDescription>Overall coverage of target curriculum</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col items-center gap-4">
                  <ProgressRing progress={analysis.matchPercentage} size={140} strokeWidth={12}>
                    <div className="text-center">
                      <span className="text-4xl font-extrabold">{analysis.matchPercentage}%</span>
                    </div>
                  </ProgressRing>
                  <div className="mt-2">{getReadinessBadge(analysis.readinessLevel)}</div>
                </CardContent>
              </Card>

              {/* Quick Stats & AI Summary */}
              <Card variant="default" className="md:col-span-8 border border-[var(--card-border)] p-6 flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Radar Analysis</CardTitle>
                  <CardDescription>Comparing your skills against core job specifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--card-border)]">
                      <span className="text-2xl font-bold block text-primary-500">{analysis.currentSkills.length}</span>
                      <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Your Skills</span>
                    </div>
                    <div className="p-4 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--card-border)]">
                      <span className="text-2xl font-bold block text-emerald-500">{analysis.requiredSkills.length}</span>
                      <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Required</span>
                    </div>
                    <div className="p-4 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--card-border)]">
                      <span className="text-2xl font-bold block text-rose-500">{analysis.missingSkills.length}</span>
                      <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Missing Gaps</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl mt-4">
                    <Brain className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs leading-relaxed text-[var(--foreground)]">
                      <strong>AI Advisor:</strong>{' '}
                      {analysis.matchPercentage >= 80 ? (
                        <span>Excellent work! Your technical profile matches the curriculum exceptionally well. Focus on mock interview practice to prepare for applications.</span>
                      ) : (
                        <span>
                          You have matched {analysis.currentSkills.length} core competencies. To unlock <strong>{selectedRole}</strong> interviews, prioritize mastering{' '}
                          <strong>{analysis.missingSkills[0]?.name || 'next-priority skills'}</strong> and{' '}
                          <strong>{analysis.missingSkills[1]?.name || 'additional topics'}</strong>.
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab view for skill lists */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--divider)] pb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('missing')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      activeTab === 'missing'
                        ? 'bg-primary-500 text-white shadow shadow-primary-500/20 font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Missing Gaps ({analysis.missingSkills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('current')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      activeTab === 'current'
                        ? 'bg-primary-500 text-white shadow shadow-primary-500/20 font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Your Skills ({analysis.currentSkills.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-primary-500 text-white shadow shadow-primary-500/20 font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Required Checklist ({analysis.requiredSkills.length})
                  </button>
                </div>
              </div>

              {/* Lists */}
              <div className="grid grid-cols-1 gap-4">
                {/* Missing Gaps Tab */}
                {activeTab === 'missing' && (
                  analysis.missingSkills.length === 0 ? (
                    <Card variant="glass" className="p-8 text-center text-xs text-[var(--muted)]">
                      No missing skills! You meet all requirements for this role.
                    </Card>
                  ) : (
                    analysis.missingSkills.map((skill, idx) => (
                      <Card
                        key={idx}
                        variant="default"
                        className="p-5 border border-[var(--card-border)] hover:border-primary-500/30 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-fade-in"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-[var(--foreground)]">{skill.name}</h4>
                            <Badge variant="default" className="text-[10px] py-0.5">
                              {skill.category}
                            </Badge>
                            {getPriorityBadge(skill.priority)}
                          </div>
                          <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
                            {skill.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-semibold text-[var(--muted)]">Target Level: {skill.level}</span>
                          <Link href="/roadmap">
                            <Button size="sm" className="flex items-center gap-1.5 text-xs py-2 px-4">
                              <BookOpen size={12} /> Find Resource
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))
                  )
                )}

                {/* Current Skills Tab */}
                {activeTab === 'current' && (
                  analysis.currentSkills.length === 0 ? (
                    <Card variant="glass" className="p-8 text-center text-xs text-[var(--muted)]">
                      No matching skills found. Edit your skills in the Profile section to recalculate coverage.
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                      {analysis.currentSkills.map((skill, idx) => (
                        <Card key={idx} variant="default" className="p-4 border border-[var(--card-border)] flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-[var(--foreground)]">{skill.name}</h4>
                            <p className="text-[10px] text-[var(--muted)] mt-0.5">{skill.category}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="success" className="capitalize text-[10px]">
                              {skill.level}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                )}

                {/* Required Curriculum Tab */}
                {activeTab === 'all' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    {analysis.requiredSkills.map((skill, idx) => {
                      const hasSkill = analysis.currentSkills.some(
                        (s) =>
                          s.name.toLowerCase().includes(skill.name.toLowerCase()) ||
                          skill.name.toLowerCase().includes(s.name.toLowerCase())
                      );
                      return (
                        <Card
                          key={idx}
                          variant="default"
                          className={`p-4 border flex items-center justify-between ${
                            hasSkill ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[var(--card-border)]'
                          }`}
                        >
                          <div>
                            <h4 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                              {skill.name}
                            </h4>
                            <p className="text-[10px] text-[var(--muted)] mt-0.5">{skill.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--muted)]">Level: {skill.level}</span>
                            {hasSkill ? (
                              <Badge variant="success">Unlocked</Badge>
                            ) : (
                              <Badge variant="default">Locked</Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
