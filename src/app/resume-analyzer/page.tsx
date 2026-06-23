'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressRing, ProgressBar } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { CAREER_ROLES } from '@/lib/constants';
import { saveResumeAnalysis, getUserResumes, deleteResumeAnalysis } from '@/lib/resumes';
import type { ResumeAnalysis } from '@/types';
import {
  UploadCloud, FileText, ArrowLeft, CheckCircle2, AlertTriangle, Info,
  TrendingUp, Sparkles, RefreshCw, Layers, Key, Check, Plus, History, Trash2, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ResumeAnalyzerPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  
  // History state
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync target role with user profile when loaded
  useEffect(() => {
    if (user) {
      // Find matching role in constants or fall back to default
      const profileRole = (user as any).targetRole || 'Software Engineer';
      if (CAREER_ROLES.includes(profileRole as any)) {
        setTargetRole(profileRole);
      }
    }
  }, [user]);

  // Load history on client mount
  const loadHistory = async () => {
    if (!user?.id) return;
    setIsLoadingHistory(true);
    try {
      const list = await getUserResumes(user.id);
      setHistory(list);
    } catch (err: any) {
      console.error('[resume] Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadHistory();
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setErrorMessage('Please upload a PDF or DOCX file.');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    // Simulate progress while uploading/parsing
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 120);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Define endpoints to check: check environmental API URL or fallback to local 8000
      const urls = [
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/resume/analyze?target_role=${encodeURIComponent(targetRole)}`,
        `http://localhost:8000/api/resume/analyze?target_role=${encodeURIComponent(targetRole)}`
      ];

      let response = null;
      let lastError = null;

      for (const url of urls) {
        try {
          console.log(`[resume] Attempting parse via endpoint: ${url}`);
          const res = await fetch(url, {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            response = res;
            break;
          }
          const text = await res.text();
          lastError = new Error(text || `Server error ${res.status}`);
        } catch (e: any) {
          console.warn(`[resume] Endpoint failed: ${url}`, e);
          lastError = e;
        }
      }

      if (!response) {
        throw lastError || new Error('Could not communicate with the backend parser.');
      }

      const analysisResult = await response.json();
      setUploadProgress(100);
      clearInterval(interval);

      // Save database record
      if (user?.id) {
        try {
          const saved = await saveResumeAnalysis(user.id, {
            fileName: file.name,
            atsScore: analysisResult.atsScore,
            formatting: analysisResult.formatting,
            keywords: analysisResult.keywords,
            grammar: analysisResult.grammar,
            impact: analysisResult.impact,
            suggestions: analysisResult.suggestions,
            missingSkills: analysisResult.missingSkills
          });
          setAnalysis(saved);
          setSelectedHistoryId(saved.id);
          loadHistory(); // reload past uploads list
        } catch (dbErr: any) {
          console.error('[resume] DB persist error:', dbErr);
          // Fallback to memory
          const temp: ResumeAnalysis = {
            ...analysisResult,
            id: 'temp_' + Date.now(),
            createdAt: new Date().toISOString(),
            userId: user.id
          };
          setAnalysis(temp);
          setErrorMessage('Analysis succeeded, but database sync failed. Verify if resumes table exists.');
        }
      } else {
        setAnalysis(analysisResult);
      }
    } catch (err: any) {
      console.error('[resume] Parsing pipeline failed:', err);
      setErrorMessage(err.message || 'Connection to parser failed. Ensure backend service is running.');
    } finally {
      clearInterval(interval);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this previous analysis?')) return;
    try {
      await deleteResumeAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedHistoryId === id) {
        setAnalysis(null);
        setSelectedHistoryId(null);
        setFileName('');
      }
    } catch (err: any) {
      console.error('[resume] Delete failed:', err);
      alert(err.message || 'Delete failed');
    }
  };

  const selectHistoryItem = (item: ResumeAnalysis) => {
    setAnalysis(item);
    setFileName(item.fileName);
    setSelectedHistoryId(item.id);
    setErrorMessage(null);
  };

  const resetAnalyzer = () => {
    setAnalysis(null);
    setFileName('');
    setSelectedHistoryId(null);
    setErrorMessage(null);
  };

  const getSeverityBadge = (sev: 'high' | 'medium' | 'low') => {
    if (sev === 'high') return <Badge variant="danger">High priority</Badge>;
    if (sev === 'medium') return <Badge variant="warning">Medium priority</Badge>;
    return <Badge variant="info">Low priority</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)]">Resume & ATS Analyzer</h1>
              <p className="text-xs text-[var(--muted)]">Optimize your resume for search algorithms and recruiters</p>
            </div>
          </div>
          {analysis && (
            <Button variant="secondary" size="sm" onClick={resetAnalyzer} className="flex items-center gap-1.5">
              <RefreshCw size={14} /> Re-upload Resume
            </Button>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs flex gap-3 items-start">
            <AlertTriangle className="shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-bold block mb-0.5">Analysis Issue</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: History Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card variant="default" className="border border-[var(--card-border)] p-6 flex flex-col h-full min-h-[300px]">
              <CardHeader className="p-0 pb-4 border-b border-[var(--divider)]">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <History size={18} className="text-primary-500" />
                  Past Analyses
                </CardTitle>
                <CardDescription className="text-xs">Revisit your saved scans</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4 flex-1 overflow-y-auto max-h-[480px] space-y-2">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-[var(--muted)] gap-2">
                    <Loader2 className="animate-spin text-primary-500" size={18} />
                    Loading past records...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[var(--muted)] leading-relaxed">
                    No past analyses found.<br />Upload a resume to begin saving.
                  </div>
                ) : (
                  history.map((item) => {
                    const isSelected = selectedHistoryId === item.id;
                    const dateFormatted = new Date(item.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <div
                        key={item.id}
                        onClick={() => selectHistoryItem(item)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500/5'
                            : 'border-[var(--card-border)] hover:bg-[var(--hover-bg)]/40'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <p className="text-xs font-bold truncate pr-1 text-[var(--foreground)]">
                            {item.fileName}
                          </p>
                          <span className="text-[10px] text-[var(--muted)] block">
                            {dateFormatted}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            item.atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                            item.atsScore >= 60 ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {item.atsScore}
                          </span>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Main Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {!analysis ? (
              /* Dropzone / Upload state */
              <Card variant="glass" className="border border-[var(--card-border)] p-8 sm:p-12 min-h-[420px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {isUploading ? (
                  <div className="space-y-6 max-w-md w-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto animate-pulse">
                      <RefreshCw className="animate-spin" size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-[var(--foreground)]">Parsing {fileName}</h3>
                      <p className="text-xs text-[var(--muted)]">Extracting text layout, formatting vectors, and keywords...</p>
                    </div>
                    <div className="w-full bg-[var(--muted-bg)] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-sm font-semibold">{uploadProgress}% complete</p>
                  </div>
                ) : (
                  <div className="w-full max-w-2xl space-y-6">
                    {/* Setup Parameters */}
                    <div className="max-w-md mx-auto mb-6 space-y-2 text-left bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--card-border)]">
                      <label className="block text-xs font-bold text-[var(--muted)] tracking-wider">
                        TARGET CAREER ROLE FOR OPTIMIZATION
                      </label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-primary-500 transition-colors cursor-pointer font-medium"
                      >
                        {CAREER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                        We will screen ATS keyword density and structure guidelines matching standard thresholds for this career goal.
                      </p>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer ${
                        dragActive ? 'border-primary-500 bg-primary-500/5' : 'border-[var(--card-border)] hover:border-primary-500/40 hover:bg-[var(--hover-bg)]/20'
                      }`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('resume-file-input')?.click()}
                    >
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto">
                          <UploadCloud size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg text-[var(--foreground)]">Upload your resume</h3>
                          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
                            Drag and drop your file here, or click to browse. Supports PDF, DOC, or DOCX formats (Max 5MB).
                          </p>
                        </div>
                        <Badge variant="primary" className="py-1 px-3">
                          ATS Target: {targetRole}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              /* Analysis results */
              <div className="space-y-8 animate-fade-in">
                {/* Top overview widget */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Score */}
                  <Card variant="glass" className="md:col-span-4 flex flex-col items-center justify-center text-center p-8 border border-[var(--card-border)]">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">ATS score</CardTitle>
                      <CardDescription>Estimated matching capability</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col items-center gap-4">
                      <ProgressRing progress={analysis.atsScore} size={140} strokeWidth={12}>
                        <div className="text-center">
                          <span className="text-4xl font-extrabold">{analysis.atsScore}</span>
                          <span className="text-sm text-[var(--muted)] font-bold">/100</span>
                        </div>
                      </ProgressRing>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs mt-2">
                        <TrendingUp size={14} /> Ready for Applications
                      </div>
                    </CardContent>
                  </Card>

                  {/* Categories Breakdown */}
                  <Card variant="default" className="md:col-span-8 border border-[var(--card-border)] p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Category scoring</CardTitle>
                      <CardDescription>Breakdown of key scoring vectors</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Layers size={14} className="text-blue-500" /> {analysis.formatting.label}
                          </span>
                          <span>{analysis.formatting.score}/100</span>
                        </div>
                        <ProgressBar progress={analysis.formatting.score} color="bg-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Key size={14} className="text-emerald-500" /> {analysis.keywords.label}
                          </span>
                          <span>{analysis.keywords.score}/100</span>
                        </div>
                        <ProgressBar progress={analysis.keywords.score} color="bg-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Check size={14} className="text-orange-500" /> {analysis.grammar.label}
                          </span>
                          <span>{analysis.grammar.score}/100</span>
                        </div>
                        <ProgressBar progress={analysis.grammar.score} color="bg-orange-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-rose-500" /> {analysis.impact.label}
                          </span>
                          <span>{analysis.impact.score}/100</span>
                        </div>
                        <ProgressBar progress={analysis.impact.score} color="bg-rose-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Section: Tabs, Missing Skills & Corrections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Missing skills list */}
                  <Card variant="default" className="lg:col-span-4 border border-[var(--card-border)] p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        Detected Skill Gaps
                      </CardTitle>
                      <CardDescription className="text-xs">Keywords missing from your resume</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        ATS search models seek these skills for target roles. Add them to increase matches:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill, idx) => (
                          <Badge key={idx} variant="warning" className="flex items-center gap-1 py-1">
                            <Plus size={10} />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="border-t border-[var(--divider)] pt-4 mt-2">
                        <Link href="/skill-gap">
                          <Button variant="secondary" size="sm" fullWidth className="text-xs">
                            Open Skill Gap Radar
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column: Detailed improvement cards */}
                  <div className="lg:col-span-8 space-y-4">
                    <Tabs defaultValue="all">
                      <div className="flex items-center justify-between border-b border-[var(--divider)] pb-2">
                        <TabsList>
                          <TabsTrigger value="all">All ({analysis.suggestions.length})</TabsTrigger>
                          <TabsTrigger value="keywords">Keywords</TabsTrigger>
                          <TabsTrigger value="impact">Impact</TabsTrigger>
                          <TabsTrigger value="formatting">Format</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="all" className="space-y-4 mt-4">
                        {analysis.suggestions.map((sug) => (
                          <Card key={sug.id} variant="default" className="p-5 border border-[var(--card-border)]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-[var(--divider)]/50">
                              <h4 className="font-bold text-sm flex items-center gap-2">
                                <Info size={14} className="text-primary-500 shrink-0" />
                                {sug.title}
                              </h4>
                              {getSeverityBadge(sug.severity)}
                            </div>
                            <p className="text-xs text-[var(--muted)] mb-3 leading-normal">{sug.description}</p>
                            {sug.original && sug.suggested && (
                              <div className="space-y-2 mt-2 bg-[var(--muted-bg)]/40 p-3.5 rounded-xl border border-[var(--card-border)] text-xs">
                                <div>
                                  <span className="font-semibold text-red-500 block mb-0.5">ORIGINAL:</span>
                                  <p className="text-[var(--muted)] line-through">{sug.original}</p>
                                </div>
                                <div className="border-t border-[var(--divider)] my-2" />
                                <div>
                                  <span className="font-semibold text-emerald-500 block mb-0.5">SUGGESTED OPTIMIZATION:</span>
                                  <p className="font-medium text-[var(--foreground)]">{sug.suggested}</p>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Filtered Tabs Content */}
                      {['keywords', 'impact', 'formatting'].map((cat) => (
                        <TabsContent key={cat} value={cat} className="space-y-4 mt-4">
                          {analysis.suggestions
                            .filter((s) => s.category === cat)
                            .map((sug) => (
                              <Card key={sug.id} variant="default" className="p-5 border border-[var(--card-border)]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                  <h4 className="font-bold text-sm flex items-center gap-2">
                                    <Info size={14} className="text-primary-500 shrink-0" />
                                    {sug.title}
                                  </h4>
                                  {getSeverityBadge(sug.severity)}
                                </div>
                                <p className="text-xs text-[var(--muted)] mb-3 leading-normal">{sug.description}</p>
                                {sug.original && sug.suggested && (
                                  <div className="space-y-2 bg-[var(--muted-bg)]/40 p-3.5 rounded-xl border border-[var(--card-border)] text-xs">
                                    <div>
                                      <span className="font-semibold text-red-500 block mb-0.5">ORIGINAL:</span>
                                      <p className="text-[var(--muted)] line-through">{sug.original}</p>
                                    </div>
                                    <div className="border-t border-[var(--divider)] my-2" />
                                    <div>
                                      <span className="font-semibold text-emerald-500 block mb-0.5">SUGGESTED OPTIMIZATION:</span>
                                      <p className="font-medium text-[var(--foreground)]">{sug.suggested}</p>
                                    </div>
                                  </div>
                                )}
                              </Card>
                            ))}
                          {analysis.suggestions.filter((s) => s.category === cat).length === 0 && (
                            <div className="text-center py-8 text-xs text-[var(--muted)]">
                              No suggestions found for this category! Excellent work.
                            </div>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
