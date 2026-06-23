import type { InterviewSession, InterviewFeedback } from '@/types';

export const mockInterviewQuestions = {
  hr: [
    { id: 'hr_1', question: 'Tell me about yourself and your career goals.' },
    { id: 'hr_2', question: 'Why are you interested in this AI Engineer position?' },
    { id: 'hr_3', question: 'Describe a challenging project you worked on and how you overcame obstacles.' },
    { id: 'hr_4', question: 'How do you stay updated with the latest developments in AI/ML?' },
    { id: 'hr_5', question: 'Where do you see yourself in 5 years?' },
  ],
  technical: [
    { id: 'tech_1', question: 'Explain the difference between supervised and unsupervised learning with examples.' },
    { id: 'tech_2', question: 'How would you handle class imbalance in a classification problem?' },
    { id: 'tech_3', question: 'Describe the transformer architecture and why it revolutionized NLP.' },
    { id: 'tech_4', question: 'What is gradient descent? Explain different variants.' },
    { id: 'tech_5', question: 'How would you design an ML system for real-time fraud detection?' },
  ],
  behavioral: [
    { id: 'beh_1', question: 'Tell me about a time you had to learn a new technology quickly.' },
    { id: 'beh_2', question: 'Describe a situation where you disagreed with a team member. How did you resolve it?' },
    { id: 'beh_3', question: 'Give an example of when you had to meet a tight deadline.' },
    { id: 'beh_4', question: 'Tell me about a failure and what you learned from it.' },
    { id: 'beh_5', question: 'How do you prioritize tasks when working on multiple projects?' },
  ],
};

export const mockInterviewFeedback: InterviewFeedback = {
  communication: 75,
  technicalAccuracy: 80,
  confidence: 70,
  structure: 72,
  overall: 74,
  strengths: [
    'Strong technical knowledge of ML fundamentals',
    'Clear explanation of complex concepts',
    'Good use of real-world examples',
  ],
  improvements: [
    'Practice the STAR method for behavioral answers',
    'Provide more quantified results in your examples',
    'Work on maintaining consistent eye contact',
  ],
  tips: [
    'Prepare 5-6 strong stories that showcase different skills',
    'Research the company thoroughly before the interview',
    'Practice whiteboard coding for technical rounds',
  ],
};

export const mockInterviewSession: InterviewSession = {
  id: 'int_001',
  userId: 'usr_demo_001',
  type: 'technical',
  role: 'AI Engineer',
  questions: mockInterviewQuestions.technical.map((q, i) => ({
    ...q,
    answer: i < 3 ? 'Sample answer provided during the mock interview...' : undefined,
    score: i < 3 ? 70 + Math.floor(Math.random() * 20) : undefined,
    feedback: i < 3 ? 'Good explanation with room for more depth.' : undefined,
    timeSpent: i < 3 ? 120 + Math.floor(Math.random() * 60) : undefined,
  })),
  overallScore: 74,
  feedback: mockInterviewFeedback,
  createdAt: new Date(Date.now() - 7200000).toISOString(),
};
