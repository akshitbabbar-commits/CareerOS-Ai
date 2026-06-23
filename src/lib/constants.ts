export const APP_NAME = 'CareerOS AI';
export const APP_TAGLINE = 'Your AI-Powered Career Operating System';
export const APP_DESCRIPTION =
  'Discover career paths, improve resumes, practice interviews, and get personalized AI mentorship — all in one platform.';

export const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Features', href: '/#features', icon: 'Sparkles' },
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Resume', href: '/resume-analyzer', icon: 'FileText' },
  { label: 'Skills', href: '/skill-gap', icon: 'Target' },
  { label: 'Roadmap', href: '/roadmap', icon: 'Map' },
  { label: 'Interview', href: '/mock-interview', icon: 'Mic' },
  { label: 'AI Mentor', href: '/ai-mentor', icon: 'Bot' },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Resume Analyzer', href: '/resume-analyzer', icon: 'FileText' },
  { label: 'Skill Gap', href: '/skill-gap', icon: 'Target' },
  { label: 'Roadmap', href: '/roadmap', icon: 'Map' },
  { label: 'Mock Interview', href: '/mock-interview', icon: 'Mic' },
  { label: 'AI Mentor', href: '/ai-mentor', icon: 'Bot' },
  { label: 'Job Prep', href: '/job-prep', icon: 'Briefcase' },
  { label: 'Projects', href: '/projects', icon: 'FolderKanban' },
  { label: 'Profile', href: '/profile', icon: 'User' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

export const CAREER_ROLES = [
  'AI Engineer',
  'Data Scientist',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Product Manager',
  'UX Designer',
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' },
] as const;

export const INTERVIEW_TYPES = [
  { value: 'hr', label: 'HR Interview', icon: 'Users', description: 'Behavioral and culture fit questions' },
  { value: 'technical', label: 'Technical Interview', icon: 'Code', description: 'Coding and system design questions' },
  { value: 'behavioral', label: 'Behavioral Interview', icon: 'MessageSquare', description: 'STAR method and situational questions' },
] as const;
