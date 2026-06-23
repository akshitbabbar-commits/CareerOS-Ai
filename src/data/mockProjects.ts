import type { ProjectRecommendation, ChecklistItem, ChatMessage } from '@/types';

export const mockProjects: ProjectRecommendation[] = [
  {
    id: 'proj_001',
    title: 'AI-Powered Sentiment Analyzer',
    description: 'Build a web app that analyzes sentiment from social media posts using NLP and transformer models.',
    difficulty: 'intermediate',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'React'],
    learningOutcomes: ['NLP fundamentals', 'Transformer models', 'API development', 'Full-stack integration'],
    estimatedDuration: '2-3 weeks',
    category: 'NLP',
  },
  {
    id: 'proj_002',
    title: 'Real-Time Object Detection System',
    description: 'Create a computer vision system that detects objects in real-time using YOLO or similar models.',
    difficulty: 'advanced',
    technologies: ['Python', 'PyTorch', 'OpenCV', 'YOLO', 'Docker'],
    learningOutcomes: ['Computer Vision', 'Model optimization', 'Real-time processing', 'Docker deployment'],
    estimatedDuration: '3-4 weeks',
    category: 'Computer Vision',
  },
  {
    id: 'proj_003',
    title: 'Recommendation Engine',
    description: 'Build a movie/product recommendation system using collaborative filtering and content-based approaches.',
    difficulty: 'intermediate',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Flask', 'PostgreSQL'],
    learningOutcomes: ['Recommendation algorithms', 'Data preprocessing', 'Database design', 'API design'],
    estimatedDuration: '2 weeks',
    category: 'Machine Learning',
  },
  {
    id: 'proj_004',
    title: 'RAG Chatbot with Custom Knowledge Base',
    description: 'Create a chatbot that can answer questions from your own documents using Retrieval Augmented Generation.',
    difficulty: 'advanced',
    technologies: ['Python', 'LangChain', 'OpenAI', 'Pinecone', 'Next.js'],
    learningOutcomes: ['RAG architecture', 'Vector databases', 'LLM integration', 'Prompt engineering'],
    estimatedDuration: '2-3 weeks',
    category: 'LLM',
  },
  {
    id: 'proj_005',
    title: 'Automated Data Pipeline',
    description: 'Design an ETL pipeline that ingests, transforms, and loads data from multiple sources.',
    difficulty: 'intermediate',
    technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Docker', 'AWS S3'],
    learningOutcomes: ['Data engineering', 'ETL processes', 'Workflow orchestration', 'Cloud storage'],
    estimatedDuration: '2 weeks',
    category: 'Data Engineering',
  },
  {
    id: 'proj_006',
    title: 'Personal Portfolio with Blog',
    description: 'Build a stunning developer portfolio with blog, project showcase, and contact functionality.',
    difficulty: 'beginner',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Vercel'],
    learningOutcomes: ['Modern web development', 'SSG/SSR concepts', 'SEO optimization', 'Deployment'],
    estimatedDuration: '1-2 weeks',
    category: 'Web Development',
  },
];

export const mockChecklist: ChecklistItem[] = [
  { id: 'cl_001', title: 'ATS-optimized resume', description: 'Ensure your resume passes ATS scanners', completed: true, category: 'resume' },
  { id: 'cl_002', title: 'Tailored for target role', description: 'Customize resume for each application', completed: true, category: 'resume' },
  { id: 'cl_003', title: 'Quantified achievements', description: 'Include metrics in all bullet points', completed: false, category: 'resume' },
  { id: 'cl_004', title: 'Professional summary', description: 'Write a compelling 2-3 line summary', completed: false, category: 'resume' },
  { id: 'cl_005', title: 'Portfolio website live', description: 'Deploy your portfolio with custom domain', completed: false, category: 'portfolio' },
  { id: 'cl_006', title: '3+ showcase projects', description: 'Feature your best projects with demos', completed: true, category: 'portfolio' },
  { id: 'cl_007', title: 'Case studies written', description: 'Write detailed case studies for top projects', completed: false, category: 'portfolio' },
  { id: 'cl_008', title: 'Professional README files', description: 'Add comprehensive READMEs to all repos', completed: true, category: 'github' },
  { id: 'cl_009', title: 'Consistent commit history', description: 'Maintain regular contribution activity', completed: true, category: 'github' },
  { id: 'cl_010', title: 'Pinned repositories', description: 'Pin your best 6 repositories', completed: false, category: 'github' },
  { id: 'cl_011', title: 'Professional headline', description: 'Write a compelling LinkedIn headline', completed: true, category: 'linkedin' },
  { id: 'cl_012', title: 'Complete profile (All-Star)', description: 'Fill all LinkedIn profile sections', completed: false, category: 'linkedin' },
  { id: 'cl_013', title: '500+ connections', description: 'Build your professional network', completed: false, category: 'linkedin' },
  { id: 'cl_014', title: 'AWS/GCP Certification', description: 'Get cloud platform certification', completed: false, category: 'certifications' },
  { id: 'cl_015', title: 'TensorFlow Developer Certificate', description: 'Google TensorFlow certification', completed: false, category: 'certifications' },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content: "Hello! I'm your AI Career Mentor. I'm here to help you navigate your career journey. What would you like to discuss today?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_002',
    role: 'user',
    content: "I'm a CS student wanting to become an AI Engineer. What skills should I focus on?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'msg_003',
    role: 'assistant',
    content: `Great choice! AI Engineering is one of the most exciting and in-demand career paths right now. Here's a prioritized skill roadmap for you:

### 🎯 Core Technical Skills (Must-Have)
1. **Python** — Master it. It's the backbone of AI/ML development
2. **Mathematics** — Linear algebra, calculus, probability & statistics
3. **Machine Learning** — Supervised, unsupervised, reinforcement learning
4. **Deep Learning** — Neural networks, CNNs, RNNs, Transformers

### 🚀 Advanced Skills (High Priority)
5. **NLP & LLMs** — Text processing, fine-tuning, RAG systems
6. **MLOps** — Model deployment, monitoring, CI/CD for ML
7. **Cloud Platforms** — AWS SageMaker, GCP Vertex AI, or Azure ML

### 💡 Recommended Path
Start with strengthening your Python and math foundations, then move to ML algorithms. Deep learning and NLP should come after you're comfortable with classical ML.

Would you like me to create a detailed weekly study plan?`,
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
];
