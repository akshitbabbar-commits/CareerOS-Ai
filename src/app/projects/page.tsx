'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { mockProjects } from '@/data/mockProjects';
import {
  ArrowLeft, Search, Filter, BookOpen, Clock, Code, Award,
  Sparkles, Check, Heart, Play
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [searchVal, setSearchVal] = useState('');
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  // Filter projects
  const filteredProjects = mockProjects.filter((p) => {
    const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.description.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchVal.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  const getDifficultyColor = (diff: string) => {
    if (diff === 'beginner') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    if (diff === 'intermediate') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    return 'bg-red-500/10 text-red-500 border border-red-500/20';
  };

  const handleStartProject = (p: typeof mockProjects[0]) => {
    setSelectedProject(p);
    setIsSuccessModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)]">Project Recommender</h1>
              <p className="text-xs text-[var(--muted)]">Build outstanding portfolio items to showcase your technical skills</p>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <Card variant="default" className="border border-[var(--card-border)] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input
              type="text"
              placeholder="Search by title, description, or technologies..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>

          {/* Difficulty filter buttons */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-primary-500 text-white'
                    : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => (
            <Card key={p.id} variant="glass" className="border border-[var(--card-border)] flex flex-col justify-between hover:shadow-xl transition-all">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getDifficultyColor(p.difficulty)}`}>
                    {p.difficulty}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Clock size={14} />
                    {p.estimatedDuration}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base sm:text-lg group-hover:text-primary-500 transition-colors">
                    {p.title}
                  </h3>
                  <Badge variant="primary" className="text-[9px] py-0.5 px-2">
                    {p.category}
                  </Badge>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed h-12 overflow-hidden text-ellipsis">
                  {p.description}
                </p>

                {/* Technologies */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">TECH STACK</span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-md font-medium text-[var(--foreground)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--divider)]/50">
                  <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">LEARNING OUTCOMES</span>
                  <div className="space-y-1">
                    {p.learningOutcomes.map((o, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        <Check size={12} className="text-emerald-500 shrink-0" />
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 border-t border-[var(--divider)]/50 bg-[var(--background)]/20 flex gap-3">
                <Button size="sm" fullWidth onClick={() => handleStartProject(p)} className="flex items-center justify-center gap-1 text-xs">
                  <Play size={12} /> Start Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-xs text-[var(--muted)]">
            No projects matched your criteria. Try adjusting the search query or difficulty filters!
          </div>
        )}

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Project Activated!"
          size="sm"
          footer={
            <Button onClick={() => setIsSuccessModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-center py-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
              <Award size={36} />
            </div>
            <h3 className="font-bold text-base">"{selectedProject?.title}" is now added to your profile!</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs mx-auto">
              This project will now show up on your Learning Roadmap as a milestone. We've pinned the resources to help you build it step-by-step.
            </p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
