'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressRing, ProgressBar } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { getUserInterviews, deleteInterviewSession, DbInterviewSession } from '@/lib/interviews';
import {
  ArrowLeft, Cpu, Volume2, Video, Calendar, Clock, BarChart2,
  Trash2, Sparkles, Check, AlertTriangle, BookOpen, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [history, setHistory] = useState<DbInterviewSession[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal inspection state
  const [selectedSession, setSelectedSession] = useState<DbInterviewSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectQuestionIndex, setInspectQuestionIndex] = useState(0);

  const fetchHistory = async () => {
    if (!user?.id) return;
    setIsFetching(true);
    setErrorMessage(null);
    try {
      const list = await getUserInterviews(user.id);
      setHistory(list);
    } catch (err: any) {
      console.error('[interview history] Fetch failed:', err);
      setErrorMessage(err.message || 'Failed to load past mock interview sessions.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

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

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this mock interview round permanently?')) return;
    try {
      await deleteInterviewSession(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedSession?.id === id) {
        setIsModalOpen(false);
        setSelectedSession(null);
      }
    } catch (err: any) {
      console.error('[interview history] Delete failed:', err);
      alert(err.message || 'Delete operation failed');
    }
  };

  const handleOpenDetails = (session: DbInterviewSession) => {
    setSelectedSession(session);
    setInspectQuestionIndex(0);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/mock-interview">
            <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">Practice History</h1>
            <p className="text-xs text-[var(--muted)]">Review and evaluate your previous mock interview performance summaries</p>
          </div>
        </div>

        {/* Global Error message */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs">
            {errorMessage}
          </div>
        )}

        {/* Loading State */}
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-xs text-[var(--muted)] gap-3">
            <Loader2 className="animate-spin text-primary-500" size={32} />
            Loading previous rounds...
          </div>
        ) : history.length === 0 ? (
          /* Empty state */
          <Card variant="glass" className="p-12 text-center flex flex-col items-center justify-center border border-[var(--card-border)] min-h-[300px]">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-4 animate-pulse">
              <BarChart2 size={24} />
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">No Interview History Found</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mt-1 mb-6">
              You haven't completed any mock interview practice rounds yet. Take a round to start tracking score metrics.
            </p>
            <Link href="/mock-interview">
              <Button size="sm">Start First Round</Button>
            </Link>
          </Card>
        ) : (
          /* List of past rounds */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((session) => {
              const dateStr = session.created_at
                ? new Date(session.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recent';

              return (
                <Card
                  key={session.id}
                  variant="default"
                  onClick={() => handleOpenDetails(session)}
                  className="border border-[var(--card-border)] hover:border-primary-500/30 transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between group"
                >
                  <CardContent className="pt-6 space-y-4">
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-primary-500 transition-colors">
                          {session.target_role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <Badge variant="primary" className="py-0.5 px-2 text-[10px]">
                            {session.interview_type.toUpperCase()}
                          </Badge>
                          <Badge variant="warning" className="py-0.5 px-2 text-[10px]">
                            {session.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black px-2.5 py-1 rounded-full ${
                          session.overall_score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                          session.overall_score >= 60 ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {session.overall_score}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                      {session.summary_feedback}
                    </p>
                  </CardContent>

                  {/* Footer metadata */}
                  <div className="px-6 pb-4 pt-3 border-t border-[var(--divider)]/40 flex justify-between items-center bg-[var(--background)]/10">
                    <span className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                      <Calendar size={12} /> {dateStr}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(session.id || '', e)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete round history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* STEP 4: DETAILED SESSION INSPECTOR MODAL */}
        {selectedSession && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`${selectedSession.target_role} Practice Review`}
            size="xl"
            footer={
              <Button onClick={() => setIsModalOpen(false)} size="sm">
                Close Review
              </Button>
            }
          >
            <div className="space-y-6">
              {/* Top row: general parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[var(--divider)] pb-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">SCORE</span>
                  <span className="text-xl font-black text-primary-500">{selectedSession.overall_score}%</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">DIFFICULTY</span>
                  <span className="text-xs font-semibold text-[var(--foreground)]">{selectedSession.difficulty}</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">DATE</span>
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    {selectedSession.created_at ? new Date(selectedSession.created_at).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>

              {/* General feedback paragraph */}
              <div className="bg-[var(--muted-bg)]/20 p-4 rounded-xl border border-[var(--card-border)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1">
                  <Sparkles size={14} className="text-primary-500" /> AI Mentor Summary Feedback
                </span>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {selectedSession.summary_feedback}
                </p>
              </div>

              {/* Skills to Improve tags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--muted)] tracking-wider block">
                  FOCUS TOPICS FOR PREPARATION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSession.skills_to_improve.map((skill, idx) => (
                    <Badge key={idx} variant="warning" className="py-0.5 px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Question selector accordion links */}
              <div className="space-y-4 border-t border-[var(--divider)] pt-4">
                <span className="text-xs font-bold text-[var(--muted)] tracking-wider block">
                  QUESTION-BY-QUESTION DRILLDOWN ({selectedSession.questions.length})
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {selectedSession.questions.map((q, idx) => {
                    const qFeedback = selectedSession.scores[q.id];
                    const isSelected = inspectQuestionIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setInspectQuestionIndex(idx)}
                        className={`py-1.5 px-3 border text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500/5 text-primary-500 font-bold'
                            : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--muted)]'
                        }`}
                      >
                        Q{idx + 1}
                        {qFeedback && (
                          <span className="ml-1 text-[9px] font-bold opacity-80">
                            ({qFeedback.score}/10)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected question evaluation detail card */}
                {selectedSession.questions[inspectQuestionIndex] && (
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-2xl space-y-5 animate-fade-in">
                    {/* Title */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider block">
                        Question {inspectQuestionIndex + 1} • {selectedSession.questions[inspectQuestionIndex].category}
                      </span>
                      <h4 className="font-bold text-sm text-[var(--foreground)]">
                        "{selectedSession.questions[inspectQuestionIndex].question}"
                      </h4>
                    </div>

                    {/* User's Answer */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider block">YOUR ANSWER</span>
                      <p className="text-xs text-[var(--muted)] leading-relaxed bg-[var(--background)]/30 p-3.5 rounded-xl border border-[var(--card-border)]/50">
                        {selectedSession.answers[selectedSession.questions[inspectQuestionIndex].id] || 'No answer submitted.'}
                      </p>
                    </div>

                    {/* Inline Evaluation Score & bullet points */}
                    {selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id] && (
                      <div className="space-y-4 pt-3 border-t border-[var(--divider)]/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[var(--muted)] tracking-wider">EVALUATION METRICS</span>
                          <Badge variant={
                            selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].score >= 8 ? 'success' :
                            selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].score >= 6 ? 'warning' :
                            'danger'
                          } className="font-black px-2 py-0.5 rounded-full">
                            Score: {selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].score}/10
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Strengths */}
                          <div className="bg-[var(--background)]/20 border border-[var(--card-border)] p-3.5 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                              <Check size={12} /> Key Strengths
                            </span>
                            <ul className="space-y-1 text-[11px] text-[var(--muted)] list-disc list-inside">
                              {selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].strengths.map((str, i) => (
                                <li key={i}>{str}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Weaknesses */}
                          <div className="bg-[var(--background)]/20 border border-[var(--card-border)] p-3.5 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                              <AlertTriangle size={12} /> Weaknesses
                            </span>
                            <ul className="space-y-1 text-[11px] text-[var(--muted)] list-disc list-inside">
                              {selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].weaknesses.map((weak, i) => (
                                <li key={i}>{weak}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="bg-[var(--background)]/20 border border-[var(--card-border)] p-3.5 rounded-xl space-y-2">
                          <span className="text-xs font-bold text-primary-500 flex items-center gap-1">
                            <AlertTriangle size={12} /> Suggested Improvements
                          </span>
                          <ul className="space-y-1 text-[11px] text-[var(--muted)] list-disc list-inside">
                            {selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Model answer */}
                        <div className="bg-[var(--muted-bg)]/40 border border-[var(--card-border)] p-4 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-bold text-primary-500 flex items-center gap-1">
                            <BookOpen size={12} /> Example of a Stronger Answer
                          </span>
                          <p className="text-xs text-[var(--muted)] leading-relaxed bg-[var(--background)]/20 p-3 rounded-lg border border-[var(--card-border)]/50">
                            "{selectedSession.scores[selectedSession.questions[inspectQuestionIndex].id].suggested_answer}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
