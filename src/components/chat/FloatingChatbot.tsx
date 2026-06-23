'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Badge';
import { Bot, X, Send, MessageSquare, Sparkles, LogIn } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialSuggestions = [
  'How do I improve my resume ATS score?',
  'What are key skills for an AI Engineer?',
  'How do I practice for a technical interview?',
  'Tell me about the learning roadmap.',
];

const mockBotResponses = {
  ats: "To improve your ATS score: 1. Use clean formatting (no columns or graphics), 2. Align your skills exactly with keywords from the job description, 3. Use action verbs (e.g., 'Engineered', 'Optimized') instead of passive statements.",
  skills: "For AI Engineers, industry-standard requirements include: Python, PyTorch/TensorFlow, SQL, Docker, AWS/GCP services, Deep Learning, NLP or Computer Vision, and vector databases like Milvus or Pinecone.",
  interview: "You can practice mock interviews right here! Head over to the 'AI Mock Interview' page. You can choose technical, behavioral, or HR rounds, receive real-time timer-based questions, and receive detailed AI feedback on your structure and confidence.",
  roadmap: "Your personalized roadmap translates skill gaps into structured weekly goals. Each milestone has articles, videos, and portfolio projects to demonstrate practical understanding.",
  default: "I'm your CareerOS AI Assistant. I can help you analyze your resume, recommend projects, guide your skill acquisition, or set up mock interview rounds. Try asking one of the quick suggestions or type your question!",
};

export function FloatingChatbot() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'bot_init',
      role: 'assistant',
      content: "Hi! I'm your CareerOS AI Assistant. How can I help guide your career path today?",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Don't show chatbot on login, signup or forgot password pages
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
  if (isAuthPage) return null;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let reply = mockBotResponses.default;
    const lower = text.toLowerCase();
    if (lower.includes('ats') || lower.includes('resume')) reply = mockBotResponses.ats;
    else if (lower.includes('skills') || lower.includes('ai engineer') || lower.includes('requirements')) reply = mockBotResponses.skills;
    else if (lower.includes('interview') || lower.includes('practice')) reply = mockBotResponses.interview;
    else if (lower.includes('roadmap') || lower.includes('milestone') || lower.includes('learning')) reply = mockBotResponses.roadmap;

    const botMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substring(7),
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <Card className="w-[360px] sm:w-[400px] h-[500px] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl flex flex-col mb-4 overflow-hidden animate-scale-in">
          {/* Header */}
          <CardHeader className="flex items-center justify-between border-b border-[var(--divider)] py-3 px-4 bg-gradient-to-r from-primary-500/10 to-accent-500/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
                <Bot size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  CareerOS Assistant
                  <Sparkles size={12} className="text-primary-500" />
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-[var(--muted)]">Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </CardHeader>

          {/* Messages area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[75%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-none shadow-md shadow-primary-500/10'
                      : 'bg-[var(--muted-bg)] text-[var(--foreground)] rounded-tl-none border border-[var(--card-border)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-[var(--muted-bg)] p-3 rounded-2xl rounded-tl-none border border-[var(--card-border)] flex items-center gap-1 text-[var(--muted)]">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </CardContent>

          {/* Quick suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-[var(--divider)]">
              {initialSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1 text-[10px] bg-[var(--muted-bg)] hover:bg-primary-500/10 hover:text-primary-500 rounded-full border border-[var(--card-border)] transition-colors text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <CardFooter className="p-3 border-t border-[var(--divider)] bg-[var(--background)]/40 flex items-center gap-2">
            {!isAuthenticated ? (
              <div className="w-full text-center flex flex-col items-center gap-2 py-1">
                <p className="text-[10px] text-[var(--muted)] font-medium">Please sign in to save conversation history</p>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                    <LogIn size={12} /> Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Ask a career question..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
                  className="rounded-xl px-3 py-2 text-xs h-9"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim() || isTyping}
                  className="p-2 h-9 w-9 flex items-center justify-center gradient-bg text-white rounded-xl shadow hover:shadow-lg hover:shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full gradient-bg text-white shadow-2xl flex items-center justify-center hover:scale-105 hover:rotate-6 active:scale-95 transition-all shadow-primary-500/30 cursor-pointer"
        id="floating-chat-bubble"
        aria-label="Toggle chat widget"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
