/**
 * Deterministic AI Career Roadmap Generator
 *
 * Produces realistic, role-specific roadmaps using curated knowledge bases
 * for supported career roles. No external AI API required.
 */

import type { Roadmap, Milestone, RoadmapTask, Resource } from '@/types';

// ---- Input / Output types ----

export interface RoadmapInput {
  dreamRole: string;
  currentSkills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  hoursPerWeek: number;
}

// ---- Role knowledge base type ----

interface PhaseTemplate {
  title: string;
  description: string;
  tasks: { title: string; type: RoadmapTask['type'] }[];
  resources: Resource[];
  /** Skills this phase covers — used to skip if user already has them */
  coveredSkills: string[];
}

interface RoleKnowledge {
  phases: PhaseTemplate[];
}

// ---- Curated role knowledge bases ----

const ROLE_KNOWLEDGE: Record<string, RoleKnowledge> = {
  'AI Engineer': {
    phases: [
      {
        title: 'Python & Mathematics Foundations',
        description: 'Master Python programming and the essential math underpinning AI/ML models',
        tasks: [
          { title: 'Advanced Python (decorators, generators, async/await)', type: 'learn' },
          { title: 'Linear Algebra fundamentals (vectors, matrices, eigenvalues)', type: 'learn' },
          { title: 'Probability & Statistics review', type: 'learn' },
          { title: 'Build a data processing pipeline project', type: 'project' },
        ],
        resources: [
          { title: 'Python for Data Science', url: 'https://www.coursera.org/specializations/python', type: 'course', platform: 'Coursera' },
          { title: 'Mathematics for Machine Learning', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', type: 'course', platform: 'Coursera' },
        ],
        coveredSkills: ['python', 'mathematics', 'linear algebra', 'statistics', 'probability'],
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Learn core ML algorithms, model evaluation, and scikit-learn',
        tasks: [
          { title: 'Supervised Learning (Regression, Classification)', type: 'learn' },
          { title: 'Unsupervised Learning (Clustering, PCA)', type: 'learn' },
          { title: 'Model Evaluation & Cross-Validation', type: 'learn' },
          { title: 'Kaggle Competition: House Price Prediction', type: 'practice' },
          { title: 'Build an ML classification web app', type: 'project' },
        ],
        resources: [
          { title: 'Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', platform: 'Coursera' },
          { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['machine learning', 'scikit-learn', 'sklearn', 'ml'],
      },
      {
        title: 'Deep Learning & Neural Networks',
        description: 'Master deep learning with PyTorch or TensorFlow',
        tasks: [
          { title: 'Neural Network fundamentals (backpropagation, activation functions)', type: 'learn' },
          { title: 'CNNs for Computer Vision', type: 'learn' },
          { title: 'RNNs and Transformer architecture', type: 'learn' },
          { title: 'Build an image classification project with PyTorch', type: 'project' },
          { title: 'PyTorch/TensorFlow deep dive', type: 'learn' },
        ],
        resources: [
          { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', type: 'course', platform: 'Coursera' },
          { title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['deep learning', 'pytorch', 'tensorflow', 'neural networks', 'cnn', 'rnn'],
      },
      {
        title: 'NLP & Large Language Models',
        description: 'Natural Language Processing and working with modern LLMs',
        tasks: [
          { title: 'Text preprocessing & word embeddings', type: 'learn' },
          { title: 'Transformer architecture deep dive (attention mechanisms)', type: 'learn' },
          { title: 'Fine-tuning pre-trained models (LoRA, PEFT)', type: 'learn' },
          { title: 'Build a RAG-powered chatbot', type: 'project' },
          { title: 'Hugging Face ecosystem mastery', type: 'learn' },
        ],
        resources: [
          { title: 'NLP Specialization', url: 'https://www.coursera.org/specializations/natural-language-processing', type: 'course', platform: 'Coursera' },
          { title: 'Hugging Face Course', url: 'https://huggingface.co/course', type: 'course', platform: 'Hugging Face' },
        ],
        coveredSkills: ['nlp', 'natural language processing', 'llm', 'transformers', 'hugging face', 'langchain'],
      },
      {
        title: 'MLOps & Production Deployment',
        description: 'Learn to deploy, monitor, and maintain ML models in production',
        tasks: [
          { title: 'Docker & containerization for ML workloads', type: 'learn' },
          { title: 'CI/CD pipelines for model training & deployment', type: 'learn' },
          { title: 'Model serving with FastAPI + cloud deployment', type: 'learn' },
          { title: 'Deploy an end-to-end ML pipeline to AWS/GCP', type: 'project' },
        ],
        resources: [
          { title: 'MLOps Specialization', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops', type: 'course', platform: 'Coursera' },
          { title: 'Docker for Data Science', url: 'https://docs.docker.com/', type: 'documentation', platform: 'Docker' },
        ],
        coveredSkills: ['mlops', 'docker', 'kubernetes', 'ci/cd', 'fastapi', 'deployment'],
      },
      {
        title: 'Portfolio & Interview Preparation',
        description: 'Polish your portfolio and prepare for AI engineering interviews',
        tasks: [
          { title: 'Polish GitHub portfolio with 3+ quality AI projects', type: 'practice' },
          { title: 'System design for ML systems practice', type: 'practice' },
          { title: 'ML/AI-specific interview questions (100+ questions)', type: 'practice' },
          { title: 'Build a capstone project demonstrating end-to-end AI pipeline', type: 'project' },
          { title: 'AWS Machine Learning Specialty Certification prep', type: 'certification' },
        ],
        resources: [
          { title: 'ML Interview Prep Guide', url: 'https://huyenchip.com/ml-interviews-book/', type: 'article', platform: 'Chip Huyen' },
          { title: 'System Design for ML', url: 'https://www.youtube.com/results?search_query=ml+system+design', type: 'video', platform: 'YouTube' },
        ],
        coveredSkills: ['interviewing', 'system design', 'portfolio'],
      },
    ],
  },

  'Data Scientist': {
    phases: [
      {
        title: 'Statistics & Data Foundations',
        description: 'Master statistics, probability theory, and data manipulation with pandas',
        tasks: [
          { title: 'Descriptive & Inferential Statistics deep dive', type: 'learn' },
          { title: 'Pandas & NumPy mastery for data wrangling', type: 'learn' },
          { title: 'SQL for complex analytical queries', type: 'learn' },
          { title: 'Exploratory Data Analysis on a real-world dataset', type: 'project' },
        ],
        resources: [
          { title: 'Statistics with Python', url: 'https://www.coursera.org/specializations/statistics-with-python', type: 'course', platform: 'Coursera' },
          { title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['statistics', 'pandas', 'numpy', 'sql', 'data analysis'],
      },
      {
        title: 'Data Visualization & Storytelling',
        description: 'Learn to communicate insights effectively with data',
        tasks: [
          { title: 'Matplotlib & Seaborn visualization fundamentals', type: 'learn' },
          { title: 'Interactive dashboards with Plotly/Dash', type: 'learn' },
          { title: 'Business intelligence tools (Tableau/Power BI basics)', type: 'learn' },
          { title: 'Build an interactive analytics dashboard', type: 'project' },
        ],
        resources: [
          { title: 'Data Visualization with Python', url: 'https://www.coursera.org/learn/python-for-data-visualization', type: 'course', platform: 'Coursera' },
          { title: 'Storytelling with Data', url: 'https://www.storytellingwithdata.com/', type: 'article', platform: 'SWD' },
        ],
        coveredSkills: ['data visualization', 'matplotlib', 'seaborn', 'plotly', 'tableau'],
      },
      {
        title: 'Machine Learning for Data Science',
        description: 'Apply ML algorithms to solve real business problems',
        tasks: [
          { title: 'Regression & Classification algorithms', type: 'learn' },
          { title: 'Feature engineering & selection techniques', type: 'learn' },
          { title: 'Ensemble methods (Random Forest, XGBoost, LightGBM)', type: 'learn' },
          { title: 'Kaggle: Titanic survival prediction + feature engineering', type: 'practice' },
          { title: 'End-to-end ML project with business KPIs', type: 'project' },
        ],
        resources: [
          { title: 'Applied Data Science with Python', url: 'https://www.coursera.org/specializations/data-science-python', type: 'course', platform: 'Coursera' },
          { title: 'XGBoost Documentation', url: 'https://xgboost.readthedocs.io/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['machine learning', 'xgboost', 'random forest', 'feature engineering'],
      },
      {
        title: 'Advanced Analytics & Deep Learning',
        description: 'Time series forecasting, NLP, and deep learning for data science',
        tasks: [
          { title: 'Time series analysis & forecasting (ARIMA, Prophet)', type: 'learn' },
          { title: 'NLP basics for text analysis & sentiment detection', type: 'learn' },
          { title: 'Neural networks with TensorFlow/Keras', type: 'learn' },
          { title: 'Build a demand forecasting system for a retail dataset', type: 'project' },
        ],
        resources: [
          { title: 'Practical Time Series Analysis', url: 'https://www.coursera.org/learn/practical-time-series-analysis', type: 'course', platform: 'Coursera' },
          { title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['time series', 'forecasting', 'nlp', 'deep learning', 'tensorflow'],
      },
      {
        title: 'Data Science Portfolio & Interviews',
        description: 'Build a compelling portfolio and ace data science interviews',
        tasks: [
          { title: 'Create 3 polished end-to-end case study notebooks', type: 'practice' },
          { title: 'Practice A/B testing & experimentation design questions', type: 'practice' },
          { title: 'SQL interview challenges (50+ problems)', type: 'practice' },
          { title: 'Build a capstone: Full data science product with deployment', type: 'project' },
          { title: 'Google Data Analytics Certificate prep', type: 'certification' },
        ],
        resources: [
          { title: 'Ace the Data Science Interview', url: 'https://www.acethedatascienceinterview.com/', type: 'article', platform: 'Book' },
          { title: 'StrataScratch SQL Practice', url: 'https://www.stratascratch.com/', type: 'course', platform: 'StrataScratch' },
        ],
        coveredSkills: ['interviewing', 'a/b testing', 'portfolio'],
      },
    ],
  },

  'Software Engineer': {
    phases: [
      {
        title: 'Computer Science Fundamentals',
        description: 'Strengthen your understanding of data structures, algorithms, and system design basics',
        tasks: [
          { title: 'Data Structures: Arrays, Linked Lists, Trees, Graphs, Hash Maps', type: 'learn' },
          { title: 'Algorithms: Sorting, Searching, Dynamic Programming, Greedy', type: 'learn' },
          { title: 'Big-O complexity analysis mastery', type: 'learn' },
          { title: 'Solve 50 LeetCode problems (Easy → Medium)', type: 'practice' },
        ],
        resources: [
          { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', type: 'course', platform: 'NeetCode' },
          { title: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/books/introduction-algorithms', type: 'article', platform: 'MIT Press' },
        ],
        coveredSkills: ['data structures', 'algorithms', 'dsa', 'leetcode'],
      },
      {
        title: 'Programming Language Mastery',
        description: 'Gain fluency in a primary language and its ecosystem',
        tasks: [
          { title: 'Advanced language features (generics, concurrency, memory management)', type: 'learn' },
          { title: 'Design Patterns (Factory, Observer, Strategy, Singleton)', type: 'learn' },
          { title: 'Testing fundamentals (unit, integration, e2e)', type: 'learn' },
          { title: 'Build a CLI tool or library and publish it', type: 'project' },
        ],
        resources: [
          { title: 'Design Patterns: Elements of Reusable OO Software', url: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612', type: 'article', platform: 'Book' },
          { title: 'The Pragmatic Programmer', url: 'https://pragprog.com/titles/tpp20/', type: 'article', platform: 'Book' },
        ],
        coveredSkills: ['design patterns', 'testing', 'unit testing', 'oop'],
      },
      {
        title: 'Backend & API Development',
        description: 'Build robust server-side applications and REST/GraphQL APIs',
        tasks: [
          { title: 'RESTful API design principles & best practices', type: 'learn' },
          { title: 'Database design (SQL + NoSQL fundamentals)', type: 'learn' },
          { title: 'Authentication & authorization (JWT, OAuth2)', type: 'learn' },
          { title: 'Build a full-featured REST API with auth and rate limiting', type: 'project' },
          { title: 'Caching strategies (Redis, CDN)', type: 'learn' },
        ],
        resources: [
          { title: 'Backend Development Roadmap', url: 'https://roadmap.sh/backend', type: 'article', platform: 'roadmap.sh' },
          { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['backend', 'rest api', 'graphql', 'database', 'postgresql', 'mongodb', 'redis'],
      },
      {
        title: 'System Design & Architecture',
        description: 'Learn to design scalable, reliable distributed systems',
        tasks: [
          { title: 'Load balancing, caching, and CDNs', type: 'learn' },
          { title: 'Microservices vs monolith architecture trade-offs', type: 'learn' },
          { title: 'Message queues (Kafka, RabbitMQ) & event-driven design', type: 'learn' },
          { title: 'Practice 10 system design problems (URL shortener, chat system, etc.)', type: 'practice' },
          { title: 'Design and implement a scalable notification system', type: 'project' },
        ],
        resources: [
          { title: 'System Design Interview by Alex Xu', url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', type: 'article', platform: 'Book' },
          { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'article', platform: 'Book' },
        ],
        coveredSkills: ['system design', 'microservices', 'distributed systems', 'kafka'],
      },
      {
        title: 'DevOps & Cloud Infrastructure',
        description: 'Master CI/CD, containerization, and cloud platforms',
        tasks: [
          { title: 'Docker & container orchestration (Kubernetes basics)', type: 'learn' },
          { title: 'CI/CD pipelines (GitHub Actions, Jenkins)', type: 'learn' },
          { title: 'Cloud services (AWS/GCP: EC2, S3, Lambda, RDS)', type: 'learn' },
          { title: 'Deploy a production app with Docker + CI/CD', type: 'project' },
        ],
        resources: [
          { title: 'Docker & Kubernetes Guide', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', type: 'course', platform: 'Udemy' },
          { title: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/', type: 'course', platform: 'AWS' },
        ],
        coveredSkills: ['docker', 'kubernetes', 'ci/cd', 'aws', 'gcp', 'devops', 'cloud'],
      },
      {
        title: 'Interview Preparation & Job Search',
        description: 'Sharpen coding interviews, behavioral skills, and job applications',
        tasks: [
          { title: 'Solve 100+ LeetCode problems (Medium → Hard)', type: 'practice' },
          { title: 'Mock system design interviews (3+ sessions)', type: 'practice' },
          { title: 'Behavioral interview prep with STAR method', type: 'practice' },
          { title: 'Build capstone: Full-stack production-grade application', type: 'project' },
          { title: 'AWS Solutions Architect Associate prep', type: 'certification' },
        ],
        resources: [
          { title: 'Cracking the Coding Interview', url: 'https://www.crackingthecodinginterview.com/', type: 'article', platform: 'Book' },
          { title: 'Pramp Mock Interviews', url: 'https://www.pramp.com/', type: 'course', platform: 'Pramp' },
        ],
        coveredSkills: ['interviewing', 'portfolio'],
      },
    ],
  },

  'Frontend Developer': {
    phases: [
      {
        title: 'HTML, CSS & JavaScript Mastery',
        description: 'Solidify your foundations in web technologies',
        tasks: [
          { title: 'Semantic HTML5 & accessibility (ARIA, screen readers)', type: 'learn' },
          { title: 'Advanced CSS (Grid, Flexbox, animations, custom properties)', type: 'learn' },
          { title: 'JavaScript ES6+ features & async patterns', type: 'learn' },
          { title: 'Build a responsive portfolio website from scratch', type: 'project' },
        ],
        resources: [
          { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'documentation', platform: 'Mozilla' },
          { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'course', platform: 'JS Info' },
        ],
        coveredSkills: ['html', 'css', 'javascript', 'responsive design', 'accessibility'],
      },
      {
        title: 'React & Modern Frameworks',
        description: 'Master React.js and its ecosystem for building complex UIs',
        tasks: [
          { title: 'React fundamentals (hooks, state, context, refs)', type: 'learn' },
          { title: 'State management (Zustand, Redux Toolkit, or Jotai)', type: 'learn' },
          { title: 'Routing with React Router or Next.js App Router', type: 'learn' },
          { title: 'Build a full-featured task management app with React', type: 'project' },
          { title: 'TypeScript integration with React', type: 'learn' },
        ],
        resources: [
          { title: 'React Official Docs', url: 'https://react.dev/', type: 'documentation', platform: 'React' },
          { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['react', 'react.js', 'next.js', 'nextjs', 'typescript', 'state management'],
      },
      {
        title: 'Advanced Frontend Patterns',
        description: 'Performance optimization, testing, and advanced UI patterns',
        tasks: [
          { title: 'Performance optimization (lazy loading, code splitting, memoization)', type: 'learn' },
          { title: 'Testing with Jest, React Testing Library, Cypress', type: 'learn' },
          { title: 'Design systems & component libraries', type: 'learn' },
          { title: 'Build a reusable component library with Storybook', type: 'project' },
        ],
        resources: [
          { title: 'Web Performance Fundamentals', url: 'https://web.dev/performance/', type: 'article', platform: 'web.dev' },
          { title: 'Testing Library Docs', url: 'https://testing-library.com/', type: 'documentation', platform: 'Official' },
        ],
        coveredSkills: ['performance', 'testing', 'jest', 'cypress', 'storybook', 'design systems'],
      },
      {
        title: 'Full-Stack & Deployment',
        description: 'Connect your frontend to real backends and deploy to production',
        tasks: [
          { title: 'API integration patterns (REST, GraphQL, tRPC)', type: 'learn' },
          { title: 'Authentication flows in SPAs (OAuth, JWT, sessions)', type: 'learn' },
          { title: 'Deployment (Vercel, Netlify, Docker)', type: 'learn' },
          { title: 'Build a full-stack SaaS app with Next.js + database', type: 'project' },
        ],
        resources: [
          { title: 'Next.js Documentation', url: 'https://nextjs.org/docs', type: 'documentation', platform: 'Vercel' },
          { title: 'Full Stack Open', url: 'https://fullstackopen.com/', type: 'course', platform: 'Helsinki' },
        ],
        coveredSkills: ['full stack', 'api integration', 'deployment', 'vercel', 'next.js'],
      },
      {
        title: 'Portfolio & Frontend Interviews',
        description: 'Ace frontend coding challenges and build an impressive portfolio',
        tasks: [
          { title: 'Frontend-specific coding challenges (DOM manipulation, async)', type: 'practice' },
          { title: 'UI/UX design principles for developers', type: 'learn' },
          { title: 'Behavioral interview prep with STAR method', type: 'practice' },
          { title: 'Build a capstone: Production-grade web application', type: 'project' },
          { title: 'Meta Front-End Developer Certificate prep', type: 'certification' },
        ],
        resources: [
          { title: 'Frontend Interview Handbook', url: 'https://www.frontendinterviewhandbook.com/', type: 'article', platform: 'Yangshun' },
          { title: 'GreatFrontEnd', url: 'https://www.greatfrontend.com/', type: 'course', platform: 'GreatFrontEnd' },
        ],
        coveredSkills: ['interviewing', 'portfolio'],
      },
    ],
  },
};

// ---- Alias mapping for roles without custom knowledge ----

const ROLE_ALIASES: Record<string, string> = {
  'Backend Developer': 'Software Engineer',
  'Full Stack Developer': 'Software Engineer',
  'DevOps Engineer': 'Software Engineer',
  'Machine Learning Engineer': 'AI Engineer',
  'Cloud Architect': 'Software Engineer',
  'Cybersecurity Analyst': 'Software Engineer',
  'Product Manager': 'Software Engineer',
  'UX Designer': 'Frontend Developer',
};

// ---- Helpers ----

let _idCounter = 0;

function makeId(prefix: string): string {
  _idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_idCounter}`;
}

/**
 * Check if a user skill matches any of the covered skills for a phase.
 * Uses case-insensitive substring matching.
 */
function userHasSkillsForPhase(
  userSkills: string[],
  coveredSkills: string[],
): boolean {
  if (userSkills.length === 0) return false;
  const normalised = userSkills.map((s) => s.toLowerCase().trim());

  // Consider the phase "known" if the user already has ≥60 % of the covered skills
  let matches = 0;
  for (const covered of coveredSkills) {
    const lc = covered.toLowerCase();
    if (normalised.some((s) => s.includes(lc) || lc.includes(s))) {
      matches += 1;
    }
  }

  return coveredSkills.length > 0 && matches / coveredSkills.length >= 0.6;
}

/**
 * Calculate a week-duration multiplier based on experience + hours/week.
 *   beginner + 5 h/w  → slowest (multiplier ≈ 2.5)
 *   advanced + 20 h/w → fastest (multiplier ≈ 0.5)
 */
function getDurationMultiplier(
  experienceLevel: RoadmapInput['experienceLevel'],
  hoursPerWeek: number,
): number {
  const experienceFactor =
    experienceLevel === 'beginner' ? 1.5 : experienceLevel === 'intermediate' ? 1.0 : 0.7;

  // Normalise hours: baseline is 10 h/w = factor 1
  const hoursFactor = Math.max(0.5, 10 / Math.max(1, hoursPerWeek));

  return experienceFactor * hoursFactor;
}

// ---- Main generator ----

export function generateRoadmap(input: RoadmapInput, userId: string): Roadmap {
  _idCounter = 0; // reset for deterministic IDs within a generation

  const { dreamRole, currentSkills, experienceLevel, hoursPerWeek } = input;

  // Resolve knowledge base
  const resolvedRole = ROLE_KNOWLEDGE[dreamRole]
    ? dreamRole
    : ROLE_ALIASES[dreamRole] ?? 'Software Engineer';
  const knowledge = ROLE_KNOWLEDGE[resolvedRole] ?? ROLE_KNOWLEDGE['Software Engineer'];

  // Filter out phases the user already knows
  const applicablePhases = knowledge.phases.filter(
    (phase) => !userHasSkillsForPhase(currentSkills, phase.coveredSkills),
  );

  // If everything is filtered, keep the last two phases (portfolio + advanced)
  const phases =
    applicablePhases.length >= 2
      ? applicablePhases
      : knowledge.phases.slice(-2);

  const multiplier = getDurationMultiplier(experienceLevel, hoursPerWeek);

  let currentWeek = 1;
  const milestones: Milestone[] = phases.map((phase, index) => {
    // Base duration: 2–3 weeks per phase, adjusted
    const baseDuration = phase.tasks.length <= 4 ? 2 : 3;
    const adjustedDuration = Math.max(1, Math.round(baseDuration * multiplier));

    const milestone: Milestone = {
      id: makeId('ms'),
      title: phase.title,
      description: phase.description,
      week: currentWeek,
      duration: `${adjustedDuration} week${adjustedDuration !== 1 ? 's' : ''}`,
      completed: false,
      tasks: phase.tasks.map((t) => ({
        id: makeId('t'),
        title: t.title,
        completed: false,
        type: t.type,
      })),
      resources: phase.resources,
    };

    currentWeek += adjustedDuration;
    return milestone;
  });

  const totalWeeks = currentWeek - 1;

  return {
    id: makeId('roadmap'),
    userId,
    careerGoal: dreamRole,
    milestones,
    progress: 0,
    totalDuration: `${totalWeeks} week${totalWeeks !== 1 ? 's' : ''}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
