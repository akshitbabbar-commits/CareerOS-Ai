'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressRing, ProgressBar } from '@/components/ui/Badge';
import { TextArea } from '@/components/ui/Input';
import { CAREER_ROLES } from '@/lib/constants';
import { saveInterviewSession } from '@/lib/interviews';
import {
  ArrowLeft, Mic, Play, ChevronRight, CheckCircle2, Award,
  Clock, Volume2, Video, AlertCircle, RefreshCw, Send, Sparkles, Check, Cpu,
  History, HelpCircle, BookOpen, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface InlineFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  suggested_answer: string;
}

export default function MockInterviewPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Setup state
  const [step, setStep] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [interviewType, setInterviewType] = useState<'technical' | 'hr' | 'mixed'>('technical');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Execution state
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  
  // Inline feedback for current question
  const [currentFeedback, setCurrentFeedback] = useState<InlineFeedback | null>(null);
  
  // All feedbacks stored for summary
  const [allFeedbacks, setAllFeedbacks] = useState<Record<string, InlineFeedback>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [skillsToImprove, setSkillsToImprove] = useState<string[]>([]);

  // Page level message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);

  // Sync role with user profile when loaded
  useEffect(() => {
    if (user) {
      const profileRole = (user as any).targetRole || 'Software Engineer';
      if (CAREER_ROLES.includes(profileRole as any)) {
        setTargetRole(profileRole);
      }
    }
  }, [user]);

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

  // Start interview session via API
  const handleStartInterview = async () => {
    setErrorMessage(null);
    setIsSubmittingAnswer(true);
    try {
      const urls = [
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/interview/start`,
        `http://localhost:8000/api/interview/start`
      ];

      let response = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log(`[interview] Starting session via: ${url}`);
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: interviewType,
              role: targetRole,
              difficulty: difficulty
            })
          });
          if (res.ok) {
            response = res;
            break;
          }
          const text = await res.text();
          lastError = new Error(text || `Status code ${res.status}`);
        } catch (e: any) {
          console.warn(`[interview] Endpoint failed: ${url}`, e);
          lastError = e;
        }
      }

      if (!response) {
        throw lastError || new Error('Could not connect to mock interview service.');
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setQuestions(data.questions);
      setAnswers({});
      setAllFeedbacks({});
      setCurrentAnswer('');
      setCurrentFeedback(null);
      setCurrentQuestionIndex(0);
      setStep('active');
    } catch (err: any) {
      console.error('[interview] Start failed:', err);
      setErrorMessage(err.message || 'Failed to initialize questions. Ensure backend service is running.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Submit single answer to API for evaluation
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please enter or record an answer before submitting.');
      return;
    }

    setErrorMessage(null);
    setIsSubmittingAnswer(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const urls = [
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/interview/answer`,
        `http://localhost:8000/api/interview/answer`
      ];

      let response = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log(`[interview] Submitting answer via: ${url}`);
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              question_id: currentQuestion.id,
              answer: currentAnswer,
              target_role: targetRole
            })
          });
          if (res.ok) {
            response = res;
            break;
          }
          const text = await res.text();
          lastError = new Error(text || `Status code ${res.status}`);
        } catch (e: any) {
          console.warn(`[interview] Endpoint failed: ${url}`, e);
          lastError = e;
        }
      }

      if (!response) {
        throw lastError || new Error('Could not evaluate the answer.');
      }

      const result = await response.json();
      const feedback: InlineFeedback = result.feedback;
      
      // Store current feedback
      setCurrentFeedback(feedback);
      
      // Save answer text & feedback in collection
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: currentAnswer }));
      setAllFeedbacks((prev) => ({ ...prev, [currentQuestion.id]: feedback }));

    } catch (err: any) {
      console.error('[interview] Submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit answer. Ensure backend is running.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Next question navigation or session completion
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setCurrentFeedback(null);
    } else {
      // Completed all questions, generate overall summary and save to Supabase
      handleCompleteSession();
    }
  };

  const handleCompleteSession = async () => {
    setStep('feedback');
    setIsSavingSession(true);
    setErrorMessage(null);

    // Compute average score on a 10-point scale first, then map to percentage
    const feedbackList = Object.values(allFeedbacks);
    const avgScore = feedbackList.length > 0
      ? feedbackList.reduce((acc, curr) => acc + curr.score, 0) / feedbackList.length
      : 7.0;
    
    const calculatedOverall = Math.round(avgScore * 10); // convert e.g., 7.5 to 75
    setOverallScore(calculatedOverall);

    // Generate summary feedback & skills to improve from inline items
    const allWeaknesses = feedbackList.flatMap(f => f.weaknesses);
    const allImprovements = feedbackList.flatMap(f => f.improvements);
    
    // Pick unique skills or categories from weak responses
    const skillsSet = new Set<string>();
    questions.forEach(q => {
      const fb = allFeedbacks[q.id];
      if (fb && fb.score < 8 && q.category) {
        skillsSet.add(q.category);
      }
    });
    
    if (skillsSet.size === 0) {
      skillsSet.add('STAR Method Delivery');
      skillsSet.add('Quantitative Metrics');
    }
    const skillsArr = Array.from(skillsSet).slice(0, 3);
    setSkillsToImprove(skillsArr);

    const summary = calculatedOverall >= 80
      ? `Excellent job! You demonstrated deep technical proficiency and clear structured delivery throughout this round. Your answers showed solid command of ${targetRole} keywords. To optimize further, focus on sharpening edge cases in your code and keeping your delivery concise.`
      : calculatedOverall >= 60
      ? `Good attempt. You have a solid baseline of skills for the ${targetRole} role, but some answers lacked technical depth or metrics. Work on structuring your answers using the STAR method (Situation, Task, Action, Result) and explicitly state the business outcomes of your projects.`
      : `This session highlighted key technical and behavioral areas that need reinforcement. Try practicing intermediate coding questions, and use our suggested model answers to structure your explanations more thoroughly. Focus on outlining clear technical tradeoffs in design questions.`;

    setSummaryFeedback(summary);

    if (user?.id) {
      try {
        await saveInterviewSession(user.id, {
          target_role: targetRole,
          difficulty: difficulty,
          interview_type: interviewType,
          questions: questions.map(q => ({ id: q.id, question: q.question, category: q.category })),
          answers: answers,
          scores: allFeedbacks as any,
          overall_score: calculatedOverall,
          summary_feedback: summary,
          skills_to_improve: skillsArr
        });
        console.log('[interview] Successfully saved session to Supabase.');
      } catch (dbErr: any) {
        console.error('[interview] Failed to save session:', dbErr);
        setErrorMessage('Summary generated, but database save failed. Please verify if your Supabase schema is created.');
      } finally {
        setIsSavingSession(false);
      }
    }
  };

  // Mock voice input transcription simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Retrieve model suggested answer snippet for realism
      const currentQuestion = questions[currentQuestionIndex];
      const modelAnswer = currentQuestionIndex === 0
        ? "I would define the target goals clearly, configure an isolated sandbox containing model files, write test suites verifying inputs, configure Docker tags, and use CI/CD scripts to deploy."
        : "In my recent team project, we faced a tight two-week deadline to deploy. I set up a project board, mapped out priorities, paired with developers on blockers, and we delivered early with full unit coverage.";
      setCurrentAnswer(modelAnswer);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[var(--foreground)]">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)] text-[var(--foreground)]">AI Mock Interview Simulator</h1>
              <p className="text-xs text-[var(--muted)]">Conduct round practice and receive instant evaluation feedback per question</p>
            </div>
          </div>
          {step === 'setup' && (
            <Link href="/mock-interview/history">
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                <History size={14} /> Review Previous Rounds
              </Button>
            </Link>
          )}
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs flex gap-3 items-start">
            <AlertTriangle className="shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-bold block mb-0.5">Database / Connection Error</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: SETUP PHASE */}
        {step === 'setup' && (
          <Card variant="glass" className="border border-[var(--card-border)] p-8 max-w-2xl mx-auto shadow-md">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20">
                <Mic size={22} />
              </div>
              <CardTitle className="text-xl">Configure Your Practice Round</CardTitle>
              <CardDescription>Select target role and round parameters. We will generate 10 questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type Select */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[var(--muted)] tracking-wider">INTERVIEW ROUND TYPE</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['technical', 'hr', 'mixed'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 capitalize transition-all cursor-pointer ${
                        interviewType === type
                          ? 'border-primary-500 bg-primary-500/5 text-primary-500 font-bold shadow-md'
                          : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]/50 text-[var(--muted)]'
                      }`}
                    >
                      {type === 'technical' && <Cpu size={20} />}
                      {type === 'hr' && <Volume2 size={20} />}
                      {type === 'mixed' && <Video size={20} />}
                      <span className="text-xs">{type === 'hr' ? 'HR' : type} Round</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Role + Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Role select */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--muted)] tracking-wider">TARGET CAREER ROLE</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-primary-500 transition-colors cursor-pointer font-medium"
                  >
                    {CAREER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Select */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--muted)] tracking-wider">DIFFICULTY THRESHOLD</label>
                  <div className="flex gap-2">
                    {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`flex-1 py-2 px-3 border text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
                          difficulty === diff
                            ? 'border-primary-500 bg-primary-500/5 text-primary-500 font-bold'
                            : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--muted)]'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
                <AlertCircle className="text-primary-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] leading-relaxed text-[var(--muted)]">
                  You will answer **10 custom questions** sequentially. You will receive an immediate score (0–10) and feedback detailing model answers after submitting each response.
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={handleStartInterview}
                disabled={isSubmittingAnswer}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
              >
                {isSubmittingAnswer ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Creating session...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Start 10-Question Interview
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: ACTIVE INTERVIEW */}
        {step === 'active' && questions.length > 0 && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex justify-between items-center bg-[var(--card-bg)] border border-[var(--card-border)] px-6 py-3.5 rounded-2xl shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-wider text-primary-500 block uppercase">
                  Round Progress
                </span>
                <span className="text-xs font-bold text-[var(--muted)]">
                  Question {currentQuestionIndex + 1} of {questions.length} • {interviewType.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="primary">{targetRole}</Badge>
                <Badge variant="warning">{difficulty}</Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar progress={((currentQuestionIndex + (currentFeedback ? 1 : 0)) / questions.length) * 100} size="sm" />

            {/* Question Card */}
            <Card variant="default" className="border border-[var(--card-border)] shadow-md overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Large Question Block */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-[var(--muted)] tracking-wider">QUESTION</span>
                  <blockquote className="text-lg font-bold leading-relaxed text-[var(--foreground)] border-l-4 border-primary-500 pl-4">
                    "{questions[currentQuestionIndex].question}"
                  </blockquote>
                  <span className="text-[10px] font-semibold text-[var(--muted)] block pl-4">
                    Category: {questions[currentQuestionIndex].category}
                  </span>
                </div>

                {/* Left/Right Split: Answer Box OR Feedback Details */}
                {!currentFeedback ? (
                  /* Input State */
                  <div className="space-y-4 pt-4 border-t border-[var(--divider)]">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-[var(--muted)] tracking-wider">YOUR RESPONSE</label>
                      <button
                        onClick={handleToggleRecord}
                        className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-full font-bold cursor-pointer transition-all ${
                          isRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20'
                        }`}
                      >
                        <Mic size={14} />
                        {isRecording ? 'Listening (Click to Stop)' : 'Use Simulated Voice'}
                      </button>
                    </div>

                    <TextArea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your structured answer here, or click 'Use Simulated Voice' for demo transcription..."
                      rows={6}
                      className="rounded-xl border-[var(--card-border)] bg-[var(--background)]/30 text-sm focus:border-primary-500"
                    />
                  </div>
                ) : (
                  /* Evaluated State (Inline Feedback) */
                  <div className="space-y-6 pt-6 border-t border-[var(--divider)] animate-fade-in">
                    {/* Inline Score overview */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-primary-500/5 to-accent-500/5 p-5 rounded-2xl border border-primary-500/10">
                      <ProgressRing progress={currentFeedback.score * 10} size={76} strokeWidth={6}>
                        <div className="text-center">
                          <span className="text-lg font-black">{currentFeedback.score}</span>
                          <span className="text-[10px] text-[var(--muted)] block">/ 10</span>
                        </div>
                      </ProgressRing>
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-sm">Question Scored</h4>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          Your response has been scored **{currentFeedback.score}/10** based on content completeness, keywords matching, and role relevance.
                        </p>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-2.5">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                          <Check size={14} /> Key Strengths
                        </span>
                        <ul className="space-y-1.5 text-xs text-[var(--muted)] pl-1 list-disc list-inside">
                          {currentFeedback.strengths.map((str, idx) => (
                            <li key={idx} className="leading-normal">{str}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-2.5">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                          <AlertTriangle size={14} /> Weaknesses
                        </span>
                        <ul className="space-y-1.5 text-xs text-[var(--muted)] pl-1 list-disc list-inside">
                          {currentFeedback.weaknesses.map((weak, idx) => (
                            <li key={idx} className="leading-normal">{weak}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggested Model Answer */}
                    <div className="bg-[var(--muted-bg)]/40 border border-[var(--card-border)] p-5 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-primary-500 flex items-center gap-1.5">
                        <BookOpen size={14} /> Example of a Stronger Answer
                      </span>
                      <p className="text-xs text-[var(--muted)] leading-relaxed italic bg-[var(--background)]/30 p-3.5 rounded-xl border border-[var(--card-border)]/50">
                        "{currentFeedback.suggested_answer}"
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Action Buttons */}
              <CardFooter className="p-5 border-t border-[var(--divider)] bg-[var(--background)]/20 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setStep('setup')} className="text-xs">
                  Cancel Practice
                </Button>
                {!currentFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmittingAnswer}
                    className="flex items-center gap-1.5 text-xs rounded-xl"
                  >
                    {isSubmittingAnswer ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} /> Analyzing response...
                      </>
                    ) : (
                      <>
                        Submit Answer <Send size={13} />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="flex items-center gap-1.5 text-xs rounded-xl">
                    {currentQuestionIndex === questions.length - 1 ? (
                      <>
                        Complete Round & Save <Award size={14} />
                      </>
                    ) : (
                      <>
                        Next Question <ChevronRight size={14} />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}

        {/* STEP 3: SESSION SUMMARY */}
        {step === 'feedback' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Score Ring Widget */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Score card */}
              <Card variant="glass" className="md:col-span-4 flex flex-col items-center justify-center text-center p-8 border border-[var(--card-border)] relative overflow-hidden">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">Evaluation score</CardTitle>
                  <CardDescription>Overall average completion</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col items-center gap-4 w-full">
                  <ProgressRing progress={overallScore} size={140} strokeWidth={12}>
                    <div className="text-center">
                      <span className="text-3xl font-extrabold">{overallScore}</span>
                      <span className="text-sm font-bold text-[var(--muted)]">%</span>
                    </div>
                  </ProgressRing>
                  <Badge variant="primary" className="mt-2 py-1 px-3">
                    Round Complete
                  </Badge>
                </CardContent>
              </Card>

              {/* Feedback Summary text */}
              <Card variant="default" className="md:col-span-8 border border-[var(--card-border)] p-6 flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                  <CardDescription>AI mentor feedback breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-[var(--muted)] leading-relaxed bg-[var(--muted-bg)]/20 p-4 rounded-xl border border-[var(--card-border)]">
                    {summaryFeedback}
                  </p>

                  {/* Skills to Improve tags */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-bold text-[var(--muted)] tracking-wider">
                      RECOMMENDED SKILLS FOR RADAR STUDY
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {skillsToImprove.map((skill, idx) => (
                        <Badge key={idx} variant="warning" className="py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation options footer */}
            <Card variant="glass" className="border border-[var(--card-border)] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Sparkles size={16} className="text-primary-500" />
                  What would you like to do next?
                </h3>
                <p className="text-xs text-[var(--muted)]">Review complete history or start another practice round</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => setStep('setup')} className="text-xs">
                  Take Another Round
                </Button>
                <Link href="/mock-interview/history">
                  <Button size="sm" className="text-xs flex items-center gap-1.5">
                    <History size={14} /> Review Interview History
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
