'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles, FileText, Target, Map, Mic, Bot, Briefcase, ArrowRight,
  CheckCircle, ChevronDown, Award, Users, Star, Brain, Cpu
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { value: '50K+', label: 'Active Learners', icon: Users },
  { value: '120K+', label: 'Resumes Analyzed', icon: FileText },
  { value: '85K+', label: 'Mock Interviews', icon: Mic },
  { value: '94%', label: 'Placement Rate', icon: Target },
];

const features = [
  {
    title: 'AI Career Mentor',
    description: 'Get round-the-clock guidance on career choices, salary negotiation, and learning strategies from your personalized AI mentor.',
    icon: Bot,
    color: 'from-violet-500 to-indigo-500',
    link: '/ai-mentor',
  },
  {
    title: 'Resume & ATS Analyzer',
    description: 'Upload your resume and get immediate feedback on ATS compatibility, keyword matching, formatting, and impactful verbs.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    link: '/resume-analyzer',
  },
  {
    title: 'Skill Gap Radar',
    description: 'Select your target role and visualize your skillset against top industry performers. Spot missing requirements instantly.',
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    link: '/skill-gap',
  },
  {
    title: 'Personalized Roadmaps',
    description: 'Generate structured weekly learning milestones tailored to your pace, complete with courses, documentation, and hand-on projects.',
    icon: Map,
    color: 'from-amber-500 to-orange-500',
    link: '/roadmap',
  },
  {
    title: 'AI Mock Interviews',
    description: 'Conduct realistic voice or text mock interviews with AI. Get deep performance reviews on communication and accuracy.',
    icon: Mic,
    color: 'from-rose-500 to-pink-500',
    link: '/mock-interview',
  },
  {
    title: 'Project Recommender',
    description: 'Get real-world portfolio project recommendations complete with starter tech stacks, requirements, and evaluation metrics.',
    icon: Briefcase,
    color: 'from-fuchsia-500 to-purple-500',
    link: '/projects',
  },
];

const faqs = [
  {
    question: 'How accurate is the ATS scoring system?',
    answer: 'Our scoring algorithms model common modern Applicant Tracking Systems (ATS) used by major tech and Fortune 500 companies, checking keyword densities, section structures, and formatting errors with a 95% alignment accuracy.',
  },
  {
    question: 'Can I practice interviews for specific roles?',
    answer: 'Absolutely. You can choose between general HR, technical (covering coding, architecture, and tools), or behavioral (STAR framework) rounds, custom-tailored to over 50 specific roles.',
  },
  {
    question: 'Is the learning roadmap static or dynamic?',
    answer: 'It is highly dynamic. As you complete roadmap tasks or add new skills to your profile, the career operating system adapts the remaining timeline and resources.',
  },
  {
    question: 'Is there a limit to how many mock interviews I can take?',
    answer: 'During the launch phase, all users get unlimited mock interviews and resume evaluations to ensure everyone has access to quality preparation tools.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 border-b border-[var(--divider)]">
        {/* Abstract Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-y-1/2 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
              <Badge variant="primary" className="py-1 px-3 text-sm flex items-center gap-1.5 animate-fade-in">
                <Sparkles size={14} className="animate-spin-slow text-primary-500" />
                Launch Your Career with AI Precision
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-[family-name:var(--font-heading)] leading-[1.1] animate-fade-in delay-100">
                Your AI-Powered <br />
                <span className="gradient-text">Career Operating System</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed animate-fade-in delay-200">
                Discover your path, master key skills, build an outstanding resume, and conquer mock interviews. CareerOS AI is your ultimate roadmap to professional success.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in delay-300">
                <Link href={isAuthenticated ? '/dashboard' : '/signup'} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto flex items-center gap-2 group">
                    Get Started Free
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-[var(--divider)] w-full text-xs text-[var(--muted)] animate-fade-in delay-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  Fully customizable roadmaps
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  ATS scoring framework
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mockup */}
            <div className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl opacity-60" />
              <div className="w-full relative z-10 glass rounded-3xl border border-[var(--card-border)] p-6 shadow-2xl space-y-6 animate-float">
                {/* Simulated Readiness Gauge */}
                <div className="flex items-center justify-between border-b border-[var(--divider)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">
                      C
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Dashboard Overview</h4>
                      <p className="text-xs text-[var(--muted)]">Ready for next steps</p>
                    </div>
                  </div>
                  <Badge variant="success" className="py-1 px-2.5">
                    Job Ready
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card variant="glass" hoverable={false} padding="sm">
                    <p className="text-[10px] text-[var(--muted)] font-medium">RESUME ATS SCORE</p>
                    <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">87%</h3>
                    <div className="h-1 bg-[var(--muted-bg)] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[87%]" />
                    </div>
                  </Card>
                  <Card variant="glass" hoverable={false} padding="sm">
                    <p className="text-[10px] text-[var(--muted)] font-medium">SKILL MATCH RATE</p>
                    <h3 className="text-2xl font-extrabold text-primary-500 mt-1">79%</h3>
                    <div className="h-1 bg-[var(--muted-bg)] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary-500 w-[79%]" />
                    </div>
                  </Card>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[var(--muted)] tracking-wider">AI RECOMMENDATIONS</p>
                  <div className="flex items-start gap-3 p-3 bg-primary-500/5 border border-primary-500/10 rounded-xl">
                    <Brain className="text-primary-500 shrink-0" size={16} />
                    <p className="text-xs leading-normal">
                      Practice <strong>behavioral mock interviews</strong> to increase communications score by <strong>15%</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-accent-500/5 border border-accent-500/10 rounded-xl">
                    <Cpu className="text-accent-500 shrink-0" size={16} />
                    <p className="text-xs leading-normal">
                      Add <strong>Docker & Kubernetes</strong> certificates to bypass current target role skill gaps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--muted-bg)]/30 border-b border-[var(--divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl mb-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-3xl font-extrabold font-[family-name:var(--font-heading)]">{stat.value}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-b border-[var(--divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="primary" className="py-1 px-3">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)]">
              Everything you need to land your dream job
            </h2>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              We cover all steps of the hiring journey, matching cutting-edge LLMs with tailored algorithms to guide you dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link href={feature.link} key={index}>
                  <Card variant="glass" className="h-full border border-[var(--card-border)] hover:border-primary-500/40 hover:shadow-xl transition-all cursor-pointer group">
                    <CardContent className="space-y-4 pt-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary-500 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-xs font-semibold text-primary-500 pt-2 group-hover:translate-x-1 transition-transform">
                        Try It Now
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-[var(--muted-bg)]/10 border-b border-[var(--divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="primary" className="py-1 px-3">Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)]">
              Four steps to career success
            </h2>
            <p className="text-base text-[var(--muted)]">
              CareerOS AI coordinates your learning and interview preparation into a single continuous loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center border-2 border-primary-500 text-primary-500 font-extrabold text-xl">
                1
              </div>
              <h3 className="font-bold text-lg">Define Target Role</h3>
              <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
                Pick your dream job title and complete your profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center border-2 border-primary-500 text-primary-500 font-extrabold text-xl">
                2
              </div>
              <h3 className="font-bold text-lg">Analyze Gaps</h3>
              <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
                Scan your resume and target skills to see exactly what is missing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center border-2 border-primary-500 text-primary-500 font-extrabold text-xl">
                3
              </div>
              <h3 className="font-bold text-lg">Learn & Build</h3>
              <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
                Follow your weekly roadmap containing projects and key certificates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                4
              </div>
              <h3 className="font-bold text-lg">Conquer Interviews</h3>
              <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
                Practice customized mock sessions with voice input and score high!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-b border-[var(--divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="primary" className="py-1 px-3">Success Stories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)]">
              Empowering students & job-seekers globally
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass" padding="md" hoverable={false} className="border border-[var(--card-border)]">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-sm text-[var(--muted)] italic leading-relaxed mb-6">
                "The Resume Analyzer was a game changer for me. It identified three critical missing tools in my description. After patching them and practice interviewing, I landed a Software Developer role at Stripe!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                  SK
                </div>
                <div>
                  <h4 className="font-bold text-sm">Siddharth Kumar</h4>
                  <p className="text-xs text-[var(--muted)]">Software Developer at Stripe</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="md" hoverable={false} className="border border-[var(--card-border)]">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-sm text-[var(--muted)] italic leading-relaxed mb-6">
                "The mock interview engine evaluates structural and confidence responses. The voice recording felt like a real HR round. Highly recommended for any graduating student."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  AR
                </div>
                <div>
                  <h4 className="font-bold text-sm">Amanda Ross</h4>
                  <p className="text-xs text-[var(--muted)]">Product Manager at Microsoft</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="md" hoverable={false} className="border border-[var(--card-border)]">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-sm text-[var(--muted)] italic leading-relaxed mb-6">
                "Having a weekly roadmap kept me accountable. Rather than scrolling through countless tutorials, I followed CareerOS's learning suggestions and built a full stack portfolio in a month."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  JB
                </div>
                <div>
                  <h4 className="font-bold text-sm">James Benson</h4>
                  <p className="text-xs text-[var(--muted)]">Frontend Engineer at Vercel</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 border-b border-[var(--divider)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="primary" className="py-1 px-3">Help Center</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border border-[var(--card-border)] rounded-2xl bg-[var(--card-bg)] overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 font-semibold text-left text-sm sm:text-base hover:bg-[var(--hover-bg)]/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`text-[var(--muted)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-[var(--divider)] bg-[var(--background)]/20 text-sm text-[var(--muted)] leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-r from-indigo-900 to-violet-950 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-[family-name:var(--font-heading)] leading-tight">
            Ready to Accelerate Your Career Success?
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create your account today and unlock tools tailored to optimize your search, skill growth, and hiring score.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={isAuthenticated ? '/dashboard' : '/signup'} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 shadow-2xl">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--divider)] bg-[var(--card-bg)] text-xs text-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center text-white font-bold text-xs">
                C
              </div>
              <span className="font-bold text-[var(--foreground)]">CareerOS AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#features" className="hover:text-[var(--foreground)]">Features</Link>
              <Link href="/login" className="hover:text-[var(--foreground)]">Sign In</Link>
              <Link href="/signup" className="hover:text-[var(--foreground)]">Sign Up</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} CareerOS AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
