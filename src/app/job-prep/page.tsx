'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressBar } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockChecklist } from '@/data/mockProjects';
import {
  ArrowLeft, CheckSquare, Square, CheckCircle, Sparkles, BookOpen,
  Briefcase, Award, FileText
} from 'lucide-react';
import Link from 'next/link';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const prepTips = {
  resume: [
    'Always tailor keywords to match the specific job description.',
    'Use active past-tense verbs (e.g. "implemented", "optimized").',
    'Quantify results where possible: latency reductions, speedups, accuracy %.'
  ],
  portfolio: [
    'Host the site with fast CDNs like Vercel or Netlify.',
    'Showcase live interactive demo links alongside source code.',
    'Write a concise summary explaining technical decisions made.'
  ],
  github: [
    'Create an eye-catching profile README with project summaries.',
    'Organize repositories with relevant tags and licenses.',
    'Avoid committing massive secrets or config files.'
  ],
  linkedin: [
    'Optimize your headline with matching keywords (e.g. "AI Engineer | PyTorch").',
    'Get recommendations from professors, colleagues, or mentors.',
    'Regularly share learning updates or project links to stay active.'
  ],
  certifications: [
    'Prioritize certifications validating hands-on cloud ML implementation.',
    'Show certification badges prominently on resume and LinkedIn.',
    'Validate skills with actual repo demonstrations, not just certificates.'
  ]
};

export default function JobPrepPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Load checklist state locally
  const [checklist, setChecklist] = useState(mockChecklist);

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

  const handleToggle = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const categories = ['resume', 'portfolio', 'github', 'linkedin', 'certifications'] as const;

  // Compute category progress
  const getProgress = (cat: typeof categories[number]) => {
    const items = checklist.filter((item) => item.category === cat);
    const completed = items.filter((item) => item.completed).length;
    return items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
  };

  // Compute overall progress
  const completedCount = checklist.filter((i) => i.completed).length;
  const overallProgress = Math.round((completedCount / checklist.length) * 100);

  const getCategoryIcon = (cat: typeof categories[number]) => {
    if (cat === 'resume') return <FileText size={16} className="text-blue-500" />;
    if (cat === 'portfolio') return <Briefcase size={16} className="text-violet-500" />;
    if (cat === 'github') return <GithubIcon className="w-4 h-4 text-[var(--foreground)]" />;
    if (cat === 'linkedin') return <Linkedin className="w-4 h-4 text-[#0077b5]" />;
    return <Award size={16} className="text-rose-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)]">Job Preparation Hub</h1>
              <p className="text-xs text-[var(--muted)]">Core checklist and validation items to be job-ready</p>
            </div>
          </div>
        </div>

        {/* Global Progress */}
        <Card variant="glass" className="p-6 border border-[var(--card-border)] bg-gradient-to-r from-primary-500/10 to-accent-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold">Overall Job Readiness</h3>
              <p className="text-xs text-[var(--muted)]">{completedCount} of {checklist.length} checklist items verified</p>
            </div>
            <span className="text-3xl font-extrabold text-primary-500">{overallProgress}%</span>
          </div>
          <ProgressBar progress={overallProgress} color="bg-gradient-to-r from-primary-500 to-accent-500" size="lg" />
        </Card>

        {/* Interactive checklist by categories */}
        <div className="grid grid-cols-1 gap-6">
          <Tabs defaultValue="resume">
            <div className="border-b border-[var(--divider)] pb-2 overflow-x-auto flex scrollbar-none">
              <TabsList className="flex flex-nowrap">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="flex items-center gap-2 capitalize">
                    {getCategoryIcon(cat)}
                    {cat} ({getProgress(cat)}%)
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((cat) => {
              const catItems = checklist.filter((item) => item.category === cat);
              return (
                <TabsContent key={cat} value={cat} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Checklist items list */}
                    <div className="lg:col-span-8 space-y-3">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggle(item.id)}
                          className={`flex items-start gap-3.5 p-4 border rounded-2xl cursor-pointer transition-all ${
                            item.completed
                              ? 'border-emerald-500/15 bg-emerald-500/5 text-[var(--muted)]'
                              : 'border-[var(--card-border)] hover:border-primary-500/25 bg-[var(--card-bg)]'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {item.completed ? (
                              <CheckCircle size={18} className="text-emerald-500" />
                            ) : (
                              <Square size={18} className="text-[var(--muted)]" />
                            )}
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm leading-none ${item.completed ? 'line-through' : ''}`}>
                              {item.title}
                            </h4>
                            <p className="text-xs text-[var(--muted)] mt-1.5 leading-normal">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Side tips card */}
                    <div className="lg:col-span-4 space-y-4">
                      <Card variant="glass" className="border border-[var(--card-border)] p-5">
                        <h4 className="text-xs font-bold text-[var(--muted)] tracking-wider flex items-center gap-1.5 mb-3">
                          <Sparkles size={14} className="text-primary-500" />
                          AI Hub Guidance
                        </h4>
                        <div className="space-y-3">
                          {prepTips[cat].map((tip, idx) => (
                            <p key={idx} className="text-xs leading-relaxed text-[var(--muted)]">
                              • {tip}
                            </p>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
