'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressBar, EmptyState } from '@/components/ui/Badge';
import { getLatestRoadmap, updateRoadmapMilestones } from '@/lib/roadmaps';
import { mockRoadmap } from '@/data/mockRoadmap';
import type { Roadmap } from '@/types';
import {
  ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Bookmark, Link as LinkIcon, Cpu, Star, Award, Compass,
  Sparkles, Map, Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // Load roadmap from Supabase on mount
  const loadRoadmap = useCallback(async () => {
    if (!user) return;
    setIsLoadingRoadmap(true);
    try {
      const saved = await getLatestRoadmap(user.id);
      if (saved) {
        setRoadmap(saved);
        setIsSample(false);
        // Auto-expand first incomplete milestone
        const firstIncomplete = saved.milestones.find(
          (m) => !m.tasks.every((t) => t.completed),
        );
        setExpandedMilestone(firstIncomplete?.id ?? saved.milestones[0]?.id ?? null);
      } else {
        setRoadmap(mockRoadmap);
        setIsSample(true);
        setExpandedMilestone(mockRoadmap.milestones[0]?.id ?? null);
      }
    } catch (err) {
      console.error('[roadmap] Failed to load:', err);
      setRoadmap(mockRoadmap);
      setIsSample(true);
      setExpandedMilestone(mockRoadmap.milestones[0]?.id ?? null);
    } finally {
      setIsLoadingRoadmap(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) loadRoadmap();
  }, [user, loadRoadmap]);

  if (authLoading || !isAuthenticated || isLoadingRoadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={<Map size={48} />}
          title="No Roadmap Yet"
          description="Generate your first personalized career roadmap to get started."
          action={
            <Link href="/roadmap/generate">
              <Button leftIcon={<Sparkles size={16} />}>Generate Roadmap</Button>
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  // ---- Milestone interaction ----

  const milestones = roadmap.milestones;

  const handleToggleTask = async (milestoneId: string, taskId: string) => {
    const updated = milestones.map((ms) => {
      if (ms.id !== milestoneId) return ms;
      const updatedTasks = ms.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
      return { ...ms, tasks: updatedTasks, completed: updatedTasks.every((t) => t.completed) };
    });

    setRoadmap({ ...roadmap, milestones: updated });

    // Persist to Supabase if it's a real (non-sample) roadmap
    if (!isSample) {
      updateRoadmapMilestones(roadmap.id, updated).catch((err) =>
        console.error('[roadmap] Failed to persist task toggle:', err),
      );
    }
  };

  // Compute stats
  const totalTasks = milestones.reduce((sum, ms) => sum + ms.tasks.length, 0);
  const completedTasks = milestones.reduce(
    (sum, ms) => sum + ms.tasks.filter((t) => t.completed).length,
    0,
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleExpand = (id: string) => {
    setExpandedMilestone(expandedMilestone === id ? null : id);
  };

  const getTaskIcon = (type: string) => {
    if (type === 'project') return <Cpu size={14} className="text-violet-500" />;
    if (type === 'practice') return <Compass size={14} className="text-amber-500" />;
    if (type === 'certification') return <Award size={14} className="text-rose-500" />;
    return <Star size={14} className="text-primary-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">
                Interactive Learning Roadmap
              </h1>
              <p className="text-xs text-[var(--muted)]">Structured target goals to bridge your target role gaps</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isSample ? 'warning' : 'success'} className="py-1.5 px-3 text-xs">
              {isSample ? 'Sample Roadmap' : 'AI Generated'}
            </Badge>
            <Badge variant="primary" className="py-1.5 px-3.5 text-xs">
              Role: {roadmap.careerGoal} ({roadmap.totalDuration})
            </Badge>
          </div>
        </div>

        {/* Generate CTA */}
        <Card
          variant="glass"
          hoverable={false}
          className="p-5 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-accent-500/5 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-500/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/20">
                <Rocket size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {isSample ? 'Create Your Personalized Roadmap' : 'Generate a New Roadmap'}
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  {isSample
                    ? 'This is a sample roadmap. Generate one tailored to your skills and goals.'
                    : 'Want to explore a different career path? Generate a fresh roadmap.'}
                </p>
              </div>
            </div>
            <Link href="/roadmap/generate" className="shrink-0">
              <Button size="sm" leftIcon={<Sparkles size={14} />}>
                {isSample ? 'Generate Roadmap' : 'New Roadmap'}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Global Progress Widget */}
        <Card
          variant="glass"
          hoverable={false}
          className="p-6 border border-[var(--card-border)] bg-gradient-to-r from-primary-500/10 to-accent-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">Overall Progress</h3>
              <p className="text-xs text-[var(--muted)]">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <span className="text-3xl font-extrabold text-primary-500">{progressPercent}%</span>
          </div>
          <ProgressBar
            progress={progressPercent}
            color="bg-gradient-to-r from-primary-500 to-accent-500"
            size="lg"
          />
        </Card>

        {/* Roadmap Milestones Timeline */}
        <div className="space-y-4 relative pl-4 md:pl-6 border-l-2 border-[var(--divider)] ml-3 md:ml-4">
          {milestones.map((ms) => {
            const isExpanded = expandedMilestone === ms.id;
            const msCompleted = ms.tasks.every((t) => t.completed);

            return (
              <div key={ms.id} className="relative space-y-3">
                {/* Timeline node icon */}
                <div
                  onClick={() => toggleExpand(ms.id)}
                  className={`absolute -left-[27px] md:-left-[35px] top-1.5 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all ${
                    msCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : isExpanded
                      ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:border-primary-500'
                  }`}
                >
                  {msCompleted ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                </div>

                {/* Milestone Card */}
                <Card
                  variant={isExpanded ? 'default' : 'bordered'}
                  hoverable={false}
                  className={`border transition-all ${
                    isExpanded
                      ? 'border-primary-500/30 shadow-md shadow-primary-500/5'
                      : 'border-[var(--card-border)] hover:border-primary-500/20'
                  }`}
                >
                  {/* Collapsible Trigger Header */}
                  <div
                    onClick={() => toggleExpand(ms.id)}
                    className="flex justify-between items-center p-5 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
                          WEEK {ms.week} • {ms.duration}
                        </span>
                        {msCompleted && (
                          <Badge variant="success" className="text-[9px] py-0.5 px-1.5">
                            Milestone Complete
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">{ms.title}</h3>
                      <p className="text-xs text-[var(--muted)] pr-6">{ms.description}</p>
                    </div>
                    <div className="shrink-0 text-[var(--muted)]">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded Milestone Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-[var(--divider)]/50 space-y-6 animate-scale-in">
                      {/* Sub tasks checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-[var(--muted)] tracking-wider">CHECKLIST</h4>
                        <div className="space-y-2">
                          {ms.tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(ms.id, task.id)}
                              className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                                task.completed
                                  ? 'border-emerald-500/10 bg-emerald-500/5 text-[var(--muted)]'
                                  : 'border-[var(--card-border)] hover:border-primary-500/25 bg-[var(--card-bg)]'
                              }`}
                            >
                              <div className="shrink-0 mt-0.5">
                                {task.completed ? (
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                ) : (
                                  <Circle size={16} className="text-[var(--muted)]" />
                                )}
                              </div>
                              <div className="flex-1 flex justify-between items-center gap-2">
                                <span
                                  className={`text-xs font-medium ${task.completed ? 'line-through' : 'text-[var(--foreground)]'}`}
                                >
                                  {task.title}
                                </span>
                                <div className="shrink-0 flex items-center gap-1">
                                  {getTaskIcon(task.type)}
                                  <span className="text-[9px] uppercase font-bold text-[var(--muted)] hidden sm:inline">
                                    {task.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      {ms.resources.length > 0 && (
                        <div className="space-y-3 border-t border-[var(--divider)]/50 pt-4">
                          <h4 className="text-xs font-bold text-[var(--muted)] tracking-wider flex items-center gap-1">
                            <Bookmark size={14} className="text-primary-500" /> RECOMMENDED RESOURCES
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ms.resources.map((res, idx) => (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]/50 rounded-xl text-xs transition-colors"
                              >
                                <div className="space-y-0.5">
                                  <h5 className="font-bold text-[var(--foreground)]">{res.title}</h5>
                                  <p className="text-[10px] text-[var(--muted)] capitalize">
                                    {res.type} • {res.platform}
                                  </p>
                                </div>
                                <LinkIcon size={14} className="text-[var(--muted)] shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
