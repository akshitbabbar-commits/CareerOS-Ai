import type { Profile, DashboardMetrics, Activity, AISuggestion } from '@/types';

export const mockUser: Profile = {
  id: 'usr_demo_001',
  fullName: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  college: 'Stanford University',
  degree: 'B.S. Computer Science',
  graduationYear: 2025,
  skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS'],
  interests: ['Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Open Source'],
  careerGoal: 'AI Engineer',
  experienceLevel: 'intermediate',
  avatarUrl: undefined,
  createdAt: '2024-09-15T10:30:00Z',
  updatedAt: '2025-01-15T14:20:00Z',
};

export const mockDashboardMetrics: DashboardMetrics = {
  careerReadiness: 72,
  resumeScore: 78,
  skillsProgress: 65,
  roadmapProgress: 45,
  interviewReadiness: 68,
  projectsCompleted: 4,
  learningStreak: 12,
};

export const mockActivities: Activity[] = [
  {
    id: 'act_001',
    type: 'resume',
    title: 'Resume Analyzed',
    description: 'Your resume scored 78/100 — 3 improvements suggested',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    icon: 'FileText',
  },
  {
    id: 'act_002',
    type: 'interview',
    title: 'Mock Interview Completed',
    description: 'Technical interview for AI Engineer — Score: 72/100',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    icon: 'Mic',
  },
  {
    id: 'act_003',
    type: 'roadmap',
    title: 'Milestone Completed',
    description: 'Completed "Python Advanced Concepts" milestone',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    icon: 'Map',
  },
  {
    id: 'act_004',
    type: 'skill',
    title: 'New Skill Added',
    description: 'Added "TensorFlow" to your skill profile',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    icon: 'Target',
  },
  {
    id: 'act_005',
    type: 'chat',
    title: 'AI Mentor Session',
    description: 'Discussed career transition strategies',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    icon: 'Bot',
  },
];

export const mockAISuggestions: AISuggestion[] = [
  {
    id: 'sug_001',
    title: 'Add Machine Learning Projects',
    description: 'Your resume lacks ML project experience. Add 2-3 projects to boost your ATS score by 15 points.',
    action: 'View Projects',
    actionUrl: '/projects',
    priority: 'high',
  },
  {
    id: 'sug_002',
    title: 'Practice System Design',
    description: 'System design is crucial for AI Engineer roles. Start with distributed systems basics.',
    action: 'Start Practice',
    actionUrl: '/mock-interview',
    priority: 'medium',
  },
  {
    id: 'sug_003',
    title: 'Complete Week 4 Roadmap',
    description: "You're 2 days behind on your Deep Learning fundamentals milestone.",
    action: 'View Roadmap',
    actionUrl: '/roadmap',
    priority: 'high',
  },
];
