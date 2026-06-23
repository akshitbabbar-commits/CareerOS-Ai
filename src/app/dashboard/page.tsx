'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressRing, ProgressBar, Skeleton } from '@/components/ui/Badge';
import { mockDashboardMetrics, mockActivities, mockAISuggestions } from '@/data/mockDashboard';
import {
  Sparkles, Bot, FileText, Target, Map, Mic, Briefcase, Award,
  Flame, ArrowRight, Clock, ChevronRight, CheckCircle2, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  FileText: FileText,
  Mic: Mic,
  Map: Map,
  Target: Target,
  Bot: Bot,
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading skeleton dashboard mirroring the real layout geometry
  if (isLoading || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="space-y-8 pb-12 animate-pulse-slow">
          {/* Welcome Header Skeleton */}
          <div className="h-44 rounded-3xl border border-[var(--divider)] bg-[var(--card-bg)]/40 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
            <div className="space-y-3 flex-1">
              <Skeleton variant="text" className="h-8 w-1/3" />
              <Skeleton variant="text" className="h-4 w-2/3" />
            </div>
            <Skeleton variant="rectangular" className="h-10 w-44 rounded-xl shrink-0" />
          </div>

          {/* Top Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-[380px] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/40 p-8 flex flex-col items-center justify-center space-y-6">
              <Skeleton variant="text" className="h-6 w-1/2" />
              <Skeleton variant="circular" className="h-36 w-36" />
              <Skeleton variant="text" className="h-4 w-1/3" />
              <Skeleton variant="text" className="h-3 w-2/3" />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[178px] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/40 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <Skeleton variant="rectangular" className="h-10 w-10 rounded-xl" />
                    <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton variant="text" className="h-5 w-1/2" />
                    <Skeleton variant="text" className="h-3 w-3/4" />
                  </div>
                  <Skeleton variant="rectangular" className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/40 p-5 flex items-center gap-4">
                <Skeleton variant="rectangular" className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-3 w-1/3" />
                  <Skeleton variant="text" className="h-5 w-2/3" />
                </div>
              </div>
            ))}
          </div>

          {/* Lower Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-[420px] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/40 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton variant="text" className="h-6 w-1/3" />
                <Skeleton variant="text" className="h-4 w-1/2" />
              </div>
              <div className="space-y-4 my-4 flex-1 justify-center flex flex-col">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/20 p-4 flex items-center justify-between">
                    <div className="space-y-2 flex-1 pr-4">
                      <Skeleton variant="text" className="h-4 w-1/3" />
                      <Skeleton variant="text" className="h-3 w-3/4" />
                    </div>
                    <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 h-[420px] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/40 p-6 flex flex-col">
              <div className="space-y-2 mb-6">
                <Skeleton variant="text" className="h-6 w-1/3" />
                <Skeleton variant="text" className="h-4 w-1/2" />
              </div>
              <div className="space-y-6 flex-1 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton variant="text" className="h-4 w-1/2" />
                      <Skeleton variant="text" className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Welcome Header with Glassmorphism and Neon Glow Blobs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary-500/10 to-accent-500/5 p-6 sm:p-8 rounded-3xl border border-primary-500/15 relative overflow-hidden backdrop-blur-md animate-fade-in-up">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-[family-name:var(--font-heading)] flex items-center gap-2 text-[var(--foreground)]">
              {getGreeting()}, {user?.fullName}!
              <Sparkles className="text-primary-500 animate-bounce-subtle shrink-0" size={24} />
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-xl">
              Here is your career preparedness report for today. You are making steady progress towards becoming an <strong>{user?.fullName === 'Alex Johnson' ? 'AI Engineer' : 'Job-Ready Candidate'}</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/ai-mentor">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 group rounded-xl">
                <Bot size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                <span>Chat with AI Mentor</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Grid: Composite Score + Key Progress Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Readiness Score Card */}
          <Card variant="glass" className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 border border-[var(--card-border)] relative overflow-hidden group hover:border-primary-500/30 transition-all duration-300 shadow-md animate-fade-in-up delay-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors duration-300" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-accent-500/5 rounded-full blur-2xl group-hover:bg-accent-500/10 transition-colors duration-300" />
            
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold tracking-tight text-[var(--foreground)]">Career Readiness</CardTitle>
              <CardDescription>Composite preparation indicator</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 pt-4 w-full">
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                <ProgressRing progress={mockDashboardMetrics.careerReadiness} size={160} strokeWidth={12}>
                  <div className="text-center">
                    <span className="text-4xl font-extrabold tracking-tight gradient-text">{mockDashboardMetrics.careerReadiness}</span>
                    <span className="text-sm text-[var(--muted)] block font-semibold mt-1">/ 100</span>
                  </div>
                </ProgressRing>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-semibold text-xs border border-emerald-500/20 shadow-sm">
                <TrendingUp size={14} />
                <span>+4% increase this week</span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed max-w-[240px]">
                Your score places you in the <strong className="text-[var(--foreground)] font-semibold">Top 15%</strong> of applicants in Stanford University.
              </p>
            </CardContent>
          </Card>

          {/* Core Metrics Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Resume Card */}
            <Card variant="glass" className="flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:shadow-blue-500/5 group hover:-translate-y-1 animate-fade-in-up delay-200">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 border border-blue-500/20 shadow-inner">
                    <FileText size={20} />
                  </div>
                  <Badge variant="info" className="font-semibold shadow-sm">8.7 ATS Score</Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base tracking-tight text-[var(--foreground)]">Resume Analysis</h3>
                  <p className="text-xs text-[var(--muted)]">Overall resume scan & parsing feedback</p>
                </div>
                <div className="pt-2">
                  <ProgressBar progress={mockDashboardMetrics.resumeScore} color="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-3 border-t border-[var(--divider)]/50 flex justify-end">
                <Link href="/resume-analyzer" className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 group/link">
                  <span>Fix Resume</span>
                  <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>

            {/* Skill Match Card */}
            <Card variant="glass" className="flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:shadow-emerald-500/5 group hover:-translate-y-1 animate-fade-in-up delay-300">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 border border-emerald-500/20 shadow-inner">
                    <Target size={20} />
                  </div>
                  <Badge variant="primary" className="font-semibold shadow-sm">{mockDashboardMetrics.skillsProgress}% match</Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base tracking-tight text-[var(--foreground)]">Skill Gap Analysis</h3>
                  <p className="text-xs text-[var(--muted)]">Acquired skills vs target role requirements</p>
                </div>
                <div className="pt-2">
                  <ProgressBar progress={mockDashboardMetrics.skillsProgress} color="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-3 border-t border-[var(--divider)]/50 flex justify-end">
                <Link href="/skill-gap" className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 group/link">
                  <span>View Gap Radar</span>
                  <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>

            {/* Roadmap Progress Card */}
            <Card variant="glass" className="flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:shadow-amber-500/5 group hover:-translate-y-1 animate-fade-in-up delay-400">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 border border-amber-500/20 shadow-inner">
                    <Map size={20} />
                  </div>
                  <Badge variant="warning" className="font-semibold shadow-sm">Week 3 of 8</Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base tracking-tight text-[var(--foreground)]">Roadmap Progress</h3>
                  <p className="text-xs text-[var(--muted)]">Completed milestones & learning tasks</p>
                </div>
                <div className="pt-2">
                  <ProgressBar progress={mockDashboardMetrics.roadmapProgress} color="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-3 border-t border-[var(--divider)]/50 flex justify-end">
                <Link href="/roadmap" className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1 group/link">
                  <span>Continue Learning</span>
                  <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>

            {/* Interview Readiness Card */}
            <Card variant="glass" className="flex flex-col justify-between hover:border-rose-500/30 transition-all duration-300 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:shadow-rose-500/5 group hover:-translate-y-1 animate-fade-in-up delay-500">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300 border border-rose-500/20 shadow-inner">
                    <Mic size={20} />
                  </div>
                  <Badge variant="danger" className="font-semibold shadow-sm">{mockDashboardMetrics.interviewReadiness}% ready</Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base tracking-tight text-[var(--foreground)]">AI Mock Interview</h3>
                  <p className="text-xs text-[var(--muted)]">HR, technical & behavioral practices</p>
                </div>
                <div className="pt-2">
                  <ProgressBar progress={mockDashboardMetrics.interviewReadiness} color="bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-3 border-t border-[var(--divider)]/50 flex justify-end">
                <Link href="/mock-interview" className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 group/link">
                  <span>Start Session</span>
                  <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Stats: Projects Completed & Learning Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass" className="flex items-center gap-4 p-5 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in-up delay-600">
            <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300 border border-violet-500/15">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] font-semibold tracking-wider">PROJECTS COMPLETED</p>
              <h4 className="text-xl font-bold mt-0.5 text-[var(--foreground)]">{mockDashboardMetrics.projectsCompleted} Portfolio Items</h4>
            </div>
          </Card>
          <Card variant="glass" className="flex items-center gap-4 p-5 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in-up delay-700">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300 border border-orange-500/15">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] font-semibold tracking-wider">LEARNING STREAK</p>
              <h4 className="text-xl font-bold mt-0.5 text-[var(--foreground)]">{mockDashboardMetrics.learningStreak} Days Active</h4>
            </div>
          </Card>
          <Card variant="glass" className="flex items-center gap-4 p-5 border border-[var(--card-border)] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in-up delay-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 border border-emerald-500/15">
              <Award size={22} />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] font-semibold tracking-wider">COMPLETED CHECKLIST</p>
              <h4 className="text-xl font-bold mt-0.5 text-[var(--foreground)]">8 of 15 Tasks Ready</h4>
            </div>
          </Card>
        </div>

        {/* Lower Section: AI Suggestions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI Suggestions */}
          <Card variant="glass" className="lg:col-span-7 border border-[var(--card-border)] shadow-sm flex flex-col animate-fade-in-up delay-800">
            <CardHeader className="border-b border-[var(--divider)]">
              <CardTitle className="flex items-center gap-2 text-lg text-[var(--foreground)]">
                <Sparkles size={18} className="text-primary-500 shrink-0" />
                AI Career Co-Pilot Recommendations
              </CardTitle>
              <CardDescription>Tailored tasks based on target role gap analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1">
              {mockAISuggestions.map((suggestion) => {
                const borderColors = {
                  high: 'border-l-4 border-l-red-500/70 hover:border-l-red-500',
                  medium: 'border-l-4 border-l-amber-500/70 hover:border-l-amber-500',
                  low: 'border-l-4 border-l-blue-500/70 hover:border-l-blue-500',
                };
                const priorityColor = borderColors[suggestion.priority as keyof typeof borderColors] || 'border-l-4 border-l-primary-500/70';

                return (
                  <div
                    key={suggestion.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[var(--card-border)] rounded-2xl bg-[var(--background)]/40 hover:bg-[var(--hover-bg)]/40 transition-all duration-300 group/item ${priorityColor} hover:shadow-md hover:translate-x-0.5`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-sm text-[var(--foreground)] tracking-tight">{suggestion.title}</h4>
                        <Badge variant={suggestion.priority === 'high' ? 'danger' : 'warning'} className="font-semibold shadow-sm px-2 py-0.5 text-[10px]">
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xl">
                        {suggestion.description}
                      </p>
                    </div>
                    <Link href={suggestion.actionUrl} className="shrink-0 sm:self-center">
                      <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs font-semibold group/btn">
                        <span>{suggestion.action}</span>
                        <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card variant="glass" className="lg:col-span-5 border border-[var(--card-border)] shadow-sm flex flex-col animate-fade-in-up delay-800">
            <CardHeader className="border-b border-[var(--divider)]">
              <CardTitle className="flex items-center gap-2 text-lg text-[var(--foreground)]">
                <Clock size={18} className="text-[var(--muted)] shrink-0" />
                Recent Activity
              </CardTitle>
              <CardDescription>Timeline of your career preparation steps</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-y-auto max-h-[360px] space-y-6 relative">
              {/* Timeline Connector Line */}
              <div className="absolute left-[44px] top-10 bottom-10 w-0.5 bg-[var(--divider)] -z-0 opacity-70" />
              
              {mockActivities.map((act, index) => {
                const IconComponent = iconMap[act.icon as keyof typeof iconMap] || Clock;
                const isLatest = index === 0;
                
                return (
                  <div key={act.id} className="flex gap-4 relative group/timeline select-none">
                    <div className={`p-2.5 bg-[var(--muted-bg)] text-[var(--foreground)] rounded-xl shrink-0 h-10 w-10 flex items-center justify-center z-10 border transition-all duration-300 ${
                      isLatest 
                        ? 'border-primary-500 bg-primary-500/5 text-primary-500 shadow-[0_0_10px_rgba(99,102,241,0.2)] animate-pulse-glow' 
                        : 'border-[var(--card-border)] group-hover/timeline:border-[var(--muted)] group-hover/timeline:scale-105'
                    }`}>
                      <IconComponent size={18} />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h4 className={`font-bold text-sm leading-none transition-colors ${isLatest ? 'text-primary-500' : 'text-[var(--foreground)]'}`}>{act.title}</h4>
                      <p className="text-xs text-[var(--muted)] leading-relaxed break-words">{act.description}</p>
                      <span className="text-[10px] text-[var(--muted)] block font-medium opacity-80">
                        {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

