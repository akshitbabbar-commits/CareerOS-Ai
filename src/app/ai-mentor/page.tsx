'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge, Avatar } from '@/components/ui/Badge';
import { Bot, Send, Sparkles, AlertCircle, ArrowLeft, Lightbulb, Compass, Award, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { getChatHistory, saveChatHistory } from '@/lib/mentor';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { text: 'Which projects stand out for an AI Engineer?', icon: Compass },
  { text: 'How do I negotiate my first base salary?', icon: DollarSign },
  { text: 'What is the STAR method for interviews?', icon: Award },
  { text: 'How do I transition from Web Dev to AI?', icon: Lightbulb },
];

const mockReplies: Record<string, string> = {
  project: "To stand out as an AI Engineer, build these 3 projects:\n1. **Vector DB Search & Retrieval (RAG)**: Connect a local LLM with document databases (e.g. Pinecone/Chroma) to demonstrate context-aware chats.\n2. **Fine-Tuned Small Model**: Fine-tune Llama-3 or Mistral on a custom dataset using LoRA/QLoRA.\n3. **MLOps Deployment Pipeline**: Deploy a model with FastAPI, Docker, and GitHub Actions, tracking performance with Prometheus or weights & biases.",
  salary: "When negotiating a starter base salary:\n1. **Research Ranges**: Check levels.fyi or glassdoor for matching titles in your location.\n2. **Leverage Alternatives**: If you have multiple offers, mention you're comparing packages without sounding transactional.\n3. **Focus on Value**: Frame the negotiation around the technical impacts you'll bring to the team.\n4. **Don't Forget Equity & Signing Bonus**: If base salary is fixed, ask if there is room for signing bonuses or performance equity reviews.",
  star: "The **STAR method** is the gold standard for behavioral interviews:\n- **Situation**: Describe the context/background (keep it under 20%).\n- **Task**: Identify the specific challenge or goal you needed to address.\n- **Action**: Explain exactly what *you* did (technologies used, collaboration, coding).\n- **Result**: Quantify the impact (e.g., 'reduced latency by 30%', 'saved 10 hours weekly').",
  transition: "To transition from Web Dev to AI:\n1. **Leverage your strengths**: You already know Python/JavaScript, APIs, and client architectures.\n2. **Learn the mathematics**: Brush up on linear algebra, calculus, and basic stats (probability, regressions).\n3. **Master AI libraries**: Start with NumPy/Pandas, then move to PyTorch and Hugging Face transformer pipelines.\n4. **Bridge the gap**: Build full-stack LLM-powered applications (RAG search, AI agents) to combine your web expertise with new AI skills.",
  default: "I'm your AI Career Mentor. I'm trained on recruiter guidelines and senior developer pathing. Feel free to ask about tech stacks, resume structuring, behavioral questions, or transition steps!",
};

export default function AIMentorPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'mentor_init',
      role: 'assistant',
      content: "Hello! I am your AI Career Mentor. Let's discuss your career goals. Whether you want advice on learning paths, portfolio reviews, or salary negotiation strategies, I am here to help. What is on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    async function loadHistory() {
      if (!user?.id) return;
      try {
        const history = await getChatHistory(user.id, 'mentor');
        if (history && history.length > 0) {
          setMessages(
            history.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp),
            }))
          );
        } else {
          // No history in Supabase yet, save the default initial message
          const defaultMsg: Message = {
            id: 'mentor_init',
            role: 'assistant',
            content: "Hello! I am your AI Career Mentor. Let's discuss your career goals. Whether you want advice on learning paths, portfolio reviews, or salary negotiation strategies, I am here to help. What is on your mind?",
            timestamp: new Date(),
          };
          setMessages([defaultMsg]);
          await saveChatHistory(user.id, 'mentor', [
            {
              id: defaultMsg.id,
              role: defaultMsg.role,
              content: defaultMsg.content,
              timestamp: defaultMsg.timestamp.toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('[ai-mentor] Error loading chat history:', err);
      }
    }
    if (isAuthenticated && user?.id) {
      loadHistory();
    }
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const handleSend = async (text: string) => {
    if (!text.trim() || !user?.id) return;

    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputVal('');
    setIsTyping(true);

    // Save user message immediately to Supabase
    try {
      await saveChatHistory(
        user.id,
        'mentor',
        updatedMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }))
      );
    } catch (err) {
      console.error('[ai-mentor] Failed to save user message:', err);
    }

    try {
      // Call FastAPI backend chat message endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;
      const url = `${API_URL}/api/chat/message`;
      console.log(`[ai-mentor] Querying API at: ${url}`);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_type: 'mentor'
        })
      });
      
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(textErr || `Status code ${res.status}`);
      }

      const data = await res.json();
      
      const botMsg: Message = {
        id: 'msg_' + Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);

      // Save complete thread including bot reply to Supabase
      await saveChatHistory(
        user.id,
        'mentor',
        finalMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }))
      );

    } catch (err: any) {
      console.error('[ai-mentor] API error:', err);
      
      const botMsg: Message = {
        id: 'msg_err_' + Math.random().toString(36).substring(7),
        role: 'assistant',
        content: "⚠️ I am unable to connect to the AI service right now. Please verify that the Gemini API is correctly configured in your environment variables and try again.",
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 border border-[var(--card-border)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-[family-name:var(--font-heading)]">AI Career Mentor</h1>
            <p className="text-xs text-[var(--muted)]">Get personalized advice and preparation tactics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[calc(100vh-14rem)] min-h-[500px]">
          {/* Left Column: Hints & Information */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card variant="glass" className="h-full border border-[var(--card-border)] flex flex-col justify-between p-6">
              <div className="space-y-4">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl w-fit">
                  <Bot size={24} />
                </div>
                <h3 className="font-bold text-lg">Your Personal Coach</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Your AI Career Mentor analyzes your resume score, skill gaps, and interview practice results in real-time to offer high-quality feedback.
                </p>
                <div className="space-y-2 border-t border-[var(--divider)] pt-4">
                  <h4 className="text-xs font-bold text-[var(--muted)] tracking-wider">TOPICS TO DISCUSS</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      Role Roadmap Customization
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      Salary negotiation guides
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      ATS parsing optimizations
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-accent-500/5 border border-accent-500/10 rounded-2xl">
                <AlertCircle className="text-accent-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] leading-normal text-[var(--muted)]">
                  Conversations are saved to your profile history. Information is confidential and only analyzed to match you with career opportunities.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Chat Interface */}
          <Card variant="default" className="lg:col-span-8 border border-[var(--card-border)] flex flex-col overflow-hidden h-full shadow-sm">
            <CardHeader className="border-b border-[var(--divider)] py-4 px-6 bg-gradient-to-r from-primary-500/5 to-accent-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow">
                  <Bot size={20} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    Coach Maxwell
                    <Badge variant="primary" className="text-[9px] py-0.5 px-1.5">AI Mentor</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">Senior Career Architect & Tech Strategist</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0 shadow-sm border border-primary-500/20">
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-none shadow-md shadow-primary-500/15'
                        : 'bg-[var(--muted-bg)] text-[var(--foreground)] rounded-tl-none border border-[var(--card-border)]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0 border border-primary-500/20">
                    <Bot size={16} />
                  </div>
                  <div className="bg-[var(--muted-bg)] p-4 rounded-2xl rounded-tl-none border border-[var(--card-border)] flex items-center gap-1 text-[var(--muted)]">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </CardContent>

            {/* Suggested prompts footer */}
            {messages.length === 1 && !isTyping && (
              <div className="px-6 py-3 border-t border-[var(--divider)] bg-[var(--background)]/20">
                <p className="text-[10px] font-bold text-[var(--muted)] tracking-wider mb-2">SUGGESTED DISCUSSIONS</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.text)}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-primary-500/5 hover:border-primary-500/20 text-[11px] text-left transition-colors cursor-pointer"
                      >
                        <Icon size={14} className="text-primary-500 shrink-0" />
                        {item.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <CardFooter className="p-4 border-t border-[var(--divider)] bg-[var(--background)]/30 flex items-center gap-3">
              <Input
                placeholder="Ask about resume tips, salary negotiation, career shifts..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
                className="rounded-xl px-4 py-3 h-11"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend(inputVal)}
                disabled={!inputVal.trim() || isTyping}
                className="p-3 h-11 w-11 flex items-center justify-center gradient-bg text-white rounded-xl shadow-lg hover:shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
