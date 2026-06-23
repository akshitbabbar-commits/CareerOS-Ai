// TypeScript types for the entire application

// ===== User & Profile =====
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  interests: string[];
  careerGoal: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  avatarUrl?: string;
  targetRole?: string | null;
  location?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Resume =====
export interface ResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  atsScore: number;
  formatting: ScoreCategory;
  keywords: ScoreCategory;
  grammar: ScoreCategory;
  impact: ScoreCategory;
  suggestions: ResumeSuggestion[];
  missingSkills: string[];
  createdAt: string;
}

export interface ScoreCategory {
  score: number;
  maxScore: number;
  label: string;
  details: string[];
}

export interface ResumeSuggestion {
  id: string;
  category: 'formatting' | 'content' | 'keywords' | 'grammar' | 'impact';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  original?: string;
  suggested?: string;
}

// ===== Skills =====
export interface SkillGapAnalysis {
  targetRole: string;
  currentSkills: Skill[];
  requiredSkills: Skill[];
  missingSkills: Skill[];
  matchPercentage: number;
  readinessLevel: 'not-ready' | 'getting-there' | 'almost-ready' | 'ready';
}

export interface Skill {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

// ===== Roadmap =====
export interface Roadmap {
  id: string;
  userId: string;
  careerGoal: string;
  milestones: Milestone[];
  progress: number;
  totalDuration: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  week: number;
  duration: string;
  tasks: RoadmapTask[];
  resources: Resource[];
  completed: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  type: 'learn' | 'practice' | 'project' | 'certification';
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
  platform: string;
}

// ===== Interview =====
export interface InterviewSession {
  id: string;
  userId: string;
  type: 'hr' | 'technical' | 'behavioral';
  role: string;
  questions: InterviewQuestion[];
  overallScore: number;
  feedback: InterviewFeedback;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
  timeSpent?: number;
}

export interface InterviewFeedback {
  communication: number;
  technicalAccuracy: number;
  confidence: number;
  structure: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

// ===== Chat =====
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  sessionType: 'mentor' | 'chatbot';
  messages: ChatMessage[];
  createdAt: string;
}

// ===== Dashboard =====
export interface DashboardMetrics {
  careerReadiness: number;
  resumeScore: number;
  skillsProgress: number;
  roadmapProgress: number;
  interviewReadiness: number;
  projectsCompleted: number;
  learningStreak: number;
}

export interface Activity {
  id: string;
  type: 'resume' | 'interview' | 'roadmap' | 'skill' | 'chat';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  actionUrl: string;
  priority: 'high' | 'medium' | 'low';
}

// ===== Projects =====
export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  learningOutcomes: string[];
  estimatedDuration: string;
  category: string;
}

// ===== Job Prep =====
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'resume' | 'portfolio' | 'github' | 'linkedin' | 'certifications';
}

// ===== Career Readiness =====
export interface CareerReadiness {
  userId: string;
  resumeScore: number;
  skillsScore: number;
  interviewScore: number;
  projectsScore: number;
  learningScore: number;
  overallScore: number;
  updatedAt: string;
}

// ===== Navigation =====
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}
