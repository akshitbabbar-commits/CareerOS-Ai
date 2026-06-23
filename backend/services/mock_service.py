"""
Mock data service — returns realistic demo data for all API endpoints.

Used when LLM_PROVIDER is set to "mock" or no API key is configured.
"""

from __future__ import annotations

import uuid
from datetime import datetime


def mock_login(email: str, password: str) -> dict:
    return {
        "token": f"mock_jwt_{uuid.uuid4().hex[:16]}",
        "user": mock_profile(),
    }


def mock_signup(email: str, password: str, full_name: str) -> dict:
    profile = mock_profile()
    profile["email"] = email
    profile["full_name"] = full_name
    return {
        "token": f"mock_jwt_{uuid.uuid4().hex[:16]}",
        "user": profile,
    }


def mock_profile() -> dict:
    return {
        "id": "usr_demo_001",
        "full_name": "Alex Johnson",
        "email": "alex@careeros.ai",
        "college": "Stanford University",
        "degree": "B.S. Computer Science",
        "graduation_year": 2025,
        "skills": ["Python", "React", "Machine Learning", "SQL", "TypeScript"],
        "interests": ["AI/ML", "Full-Stack", "Cloud Computing"],
        "career_goal": "AI Engineer",
        "experience_level": "Mid-Level",
        "avatar_url": "",
    }


def mock_resume_analysis(file_name: str) -> dict:
    return {
        "id": f"res_{uuid.uuid4().hex[:8]}",
        "file_name": file_name,
        "ats_score": 72,
        "categories": [
            {
                "name": "Formatting & Structure",
                "score": 85,
                "suggestions": [
                    "Use consistent bullet-point styles throughout.",
                    "Ensure section headings are clearly separated with whitespace.",
                ],
            },
            {
                "name": "Keyword Optimization",
                "score": 62,
                "suggestions": [
                    "Include role-specific keywords like 'CI/CD', 'Docker', 'Kubernetes'.",
                    "Mirror exact phrasing from target job descriptions.",
                ],
            },
            {
                "name": "Impact & Metrics",
                "score": 58,
                "suggestions": [
                    "Quantify achievements — e.g. 'Reduced latency by 40%'.",
                    "Add business-impact statements to each bullet point.",
                ],
            },
            {
                "name": "Grammar & Clarity",
                "score": 91,
                "suggestions": [
                    "Minor: replace 'utilized' with 'used' for conciseness.",
                ],
            },
        ],
        "keywords_found": [
            "Python", "React", "Machine Learning", "REST API",
            "PostgreSQL", "Git", "Agile",
        ],
        "keywords_missing": [
            "Docker", "Kubernetes", "CI/CD", "AWS", "TensorFlow",
            "System Design", "Microservices",
        ],
        "summary": "Your resume demonstrates solid technical skills but needs stronger keyword alignment with modern AI engineering roles. Focus on quantifying impact and adding cloud/DevOps terminology.",
        "created_at": datetime.now().isoformat(),
    }


def mock_resume_history() -> list[dict]:
    return [
        {
            "id": "res_abc001",
            "file_name": "alex_johnson_resume_v3.pdf",
            "ats_score": 72,
            "categories": [],
            "keywords_found": [],
            "keywords_missing": [],
            "summary": "Latest version with improved formatting.",
            "created_at": "2025-06-15T10:30:00Z",
        },
        {
            "id": "res_abc002",
            "file_name": "alex_johnson_resume_v2.pdf",
            "ats_score": 58,
            "categories": [],
            "keywords_found": [],
            "keywords_missing": [],
            "summary": "Earlier version, missing key metrics.",
            "created_at": "2025-05-20T14:00:00Z",
        },
    ]


def mock_skill_gap(role: str, user_skills: list[str]) -> dict:
    # Curated required skills libraries
    ai_curriculum = [
        {"name": "Python", "category": "Programming", "level": "advanced", "priority": "high", "description": "Advanced syntax, data structures, and async programming in Python."},
        {"name": "TensorFlow/PyTorch", "category": "ML Frameworks", "level": "advanced", "priority": "high", "description": "Deep learning model building, training, and custom layers."},
        {"name": "Machine Learning", "category": "AI/ML", "level": "advanced", "priority": "high", "description": "Core ML algorithms, parameter tuning, regression, and validation pipelines."},
        {"name": "Deep Learning", "category": "AI/ML", "level": "advanced", "priority": "high", "description": "Neural networks, architectures like CNNs, RNNs, and Transformers."},
        {"name": "NLP", "category": "AI/ML", "level": "intermediate", "priority": "high", "description": "Natural Language Processing, text preprocessing, embeddings, and tokenizers."},
        {"name": "MLOps", "category": "DevOps", "level": "intermediate", "priority": "high", "description": "CI/CD for ML models, serving endpoints, monitoring drift, and quantization."},
        {"name": "Computer Vision", "category": "AI/ML", "level": "intermediate", "priority": "medium", "description": "Image classification, object detection (YOLO), and OpenCV pipelines."},
        {"name": "Data Engineering", "category": "Data", "level": "intermediate", "priority": "medium", "description": "Data pipeline scraping, ETL pipelines, and feature store setups."},
        {"name": "SQL", "category": "Data", "level": "advanced", "priority": "medium", "description": "Complex joins, indexing optimizations, and transactional queries."},
        {"name": "Docker", "category": "DevOps", "level": "intermediate", "priority": "medium", "description": "Containerizing microservices and managing environment consistency."},
        {"name": "AWS/GCP", "category": "Cloud", "level": "intermediate", "priority": "medium", "description": "Deploying servers, serverless scaling, and cloud databases."},
        {"name": "Statistics", "category": "Mathematics", "level": "advanced", "priority": "high", "description": "Probability theory, hypothesis tests, and Bayesian inferences."}
    ]

    frontend_curriculum = [
        {"name": "JavaScript", "category": "Programming", "level": "expert", "priority": "high", "description": "Event loops, closures, asynchronous logic, and DOM rendering."},
        {"name": "TypeScript", "category": "Programming", "level": "advanced", "priority": "high", "description": "Static type check interfaces, generics, and declaration systems."},
        {"name": "React", "category": "Frontend", "level": "advanced", "priority": "high", "description": "State updates, hooks lifecycles, and component tree diffs."},
        {"name": "Next.js", "category": "Frontend", "level": "intermediate", "priority": "high", "description": "Server components hydration, folder-routing, and SSR optimizations."},
        {"name": "CSS/Tailwind", "category": "Frontend", "level": "advanced", "priority": "high", "description": "Responsive media queries, flexbox grid alignments, and utility classes."},
        {"name": "Testing", "category": "Quality", "level": "intermediate", "priority": "medium", "description": "Jest mock assertions, react-testing-library renders, and Cypress E2E."},
        {"name": "Performance", "category": "Frontend", "level": "intermediate", "priority": "medium", "description": "Webpack chunk bundle split optimizations, lazy loading, and Core Web Vitals."},
        {"name": "Accessibility", "category": "Frontend", "level": "intermediate", "priority": "medium", "description": "Semantic HTML markers, ARIA roles, and screen reader compatibility."}
    ]

    default_curriculum = [
        {"name": "Python/Java/C++", "category": "Programming", "level": "advanced", "priority": "high", "description": "Object-oriented programming, data structures, and algorithmic complexity."},
        {"name": "SQL", "category": "Data", "level": "advanced", "priority": "high", "description": "Designing schemas, query optimizations, and index configuration."},
        {"name": "Git", "category": "Tools", "level": "advanced", "priority": "low", "description": "Branch rebase, merge conflicts, pull requests, and commit logs."},
        {"name": "System Design", "category": "Architecture", "level": "intermediate", "priority": "high", "description": "Caching, load balancing, databases scaling, and microservices patterns."},
        {"name": "Docker", "category": "DevOps", "level": "intermediate", "priority": "medium", "description": "Containerizing services and managing network interfaces."},
        {"name": "CI/CD", "category": "DevOps", "level": "intermediate", "priority": "medium", "description": "Automating test integrations and staging deploy pipelines."},
        {"name": "Data Structures", "category": "Computer Science", "level": "advanced", "priority": "high", "description": "Trees, graphs, heaps, hash tables, and algorithm runtimes."}
    ]

    # Select curriculum based on role
    role_lower = role.lower()
    if "ai" in role_lower or "ml" in role_lower or "machine learning" in role_lower:
        curriculum = ai_curriculum
    elif "front" in role_lower or "react" in role_lower or "web" in role_lower:
        curriculum = frontend_curriculum
    else:
        curriculum = default_curriculum

    current_skills = []
    missing_skills = []

    # Map user skills to lower case for comparison
    user_skills_lower = [s.strip().lower() for s in user_skills]

    for req in curriculum:
        req_name_lower = req["name"].lower()
        
        # Simple substring comparison (e.g. if 'pytorch' is in user_skills, it can match 'TensorFlow/PyTorch')
        is_matched = False
        for u_skill in user_skills_lower:
            if u_skill in req_name_lower or req_name_lower in u_skill:
                is_matched = True
                break
                
        if is_matched:
            current_skills.append({
                "name": req["name"],
                "category": req["category"],
                "level": req["level"],
                "priority": req["priority"]
            })
        else:
            missing_skills.append({
                "name": req["name"],
                "category": req["category"],
                "level": req["level"],
                "priority": req["priority"],
                "description": req["description"]
            })

    # Calculations
    total_req = len(curriculum)
    match_percentage = round((len(current_skills) / total_req) * 100) if total_req > 0 else 100
    
    if match_percentage >= 80:
        readiness_level = "ready"
    elif match_percentage >= 60:
        readiness_level = "almost-ready"
    elif match_percentage >= 40:
        readiness_level = "getting-there"
    else:
        readiness_level = "not-ready"

    return {
        "targetRole": role,
        "matchPercentage": match_percentage,
        "readinessLevel": readiness_level,
        "currentSkills": current_skills,
        "requiredSkills": curriculum,
        "missingSkills": missing_skills
    }


def mock_roadmap(goal: str) -> dict:
    return {
        "goal": goal,
        "total_weeks": 12,
        "progress": 35,
        "milestones": [
            {
                "id": "m1",
                "title": "Foundation — Python & Math Refresher",
                "description": "Strengthen linear algebra, probability, and advanced Python for ML frameworks.",
                "week": 1,
                "completed": True,
                "resources": [
                    {"title": "3Blue1Brown Linear Algebra", "url": "https://youtube.com/3blue1brown", "type": "video"},
                    {"title": "Python for Data Science Handbook", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "type": "article"},
                ],
            },
            {
                "id": "m2",
                "title": "Core ML Algorithms",
                "description": "Implement regression, classification, clustering, and ensemble methods from scratch.",
                "week": 3,
                "completed": True,
                "resources": [
                    {"title": "Andrew Ng ML Specialization", "url": "https://coursera.org/specializations/machine-learning-introduction", "type": "course"},
                    {"title": "Scikit-learn Documentation", "url": "https://scikit-learn.org/stable/user_guide.html", "type": "article"},
                ],
            },
            {
                "id": "m3",
                "title": "Deep Learning Fundamentals",
                "description": "Build CNNs, RNNs, and Transformers using PyTorch. Understand backpropagation deeply.",
                "week": 5,
                "completed": False,
                "resources": [
                    {"title": "Fast.ai Practical Deep Learning", "url": "https://course.fast.ai/", "type": "course"},
                    {"title": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "type": "article"},
                ],
            },
            {
                "id": "m4",
                "title": "NLP & LLM Specialization",
                "description": "Fine-tune language models, build RAG pipelines, and understand tokenization.",
                "week": 7,
                "completed": False,
                "resources": [
                    {"title": "Hugging Face NLP Course", "url": "https://huggingface.co/learn/nlp-course", "type": "course"},
                    {"title": "Build a RAG App", "url": "https://github.com/langchain-ai/langchain", "type": "project"},
                ],
            },
            {
                "id": "m5",
                "title": "MLOps & Deployment",
                "description": "Containerize models with Docker, deploy on AWS/GCP, set up CI/CD + monitoring.",
                "week": 9,
                "completed": False,
                "resources": [
                    {"title": "MLOps Zoomcamp", "url": "https://github.com/DataTalksClub/mlops-zoomcamp", "type": "course"},
                    {"title": "Docker for ML Engineers", "url": "https://docker.com", "type": "article"},
                ],
            },
            {
                "id": "m6",
                "title": "Capstone Project & Portfolio",
                "description": "Build an end-to-end ML project, write a blog post, and update resume/LinkedIn.",
                "week": 11,
                "completed": False,
                "resources": [
                    {"title": "Build Your ML Portfolio", "url": "https://towardsdatascience.com", "type": "article"},
                    {"title": "Technical Blogging Guide", "url": "https://dev.to", "type": "article"},
                ],
            },
        ],
    }


# Curated database of role-specific interview questions with category, difficulty, and suggested model answers.
QUESTIONS_DB = {
    "AI Engineer": {
        "Easy": [
            {
                "id": "ai_easy_1",
                "question": "What is overfitting in machine learning and how do you prevent it?",
                "category": "Machine Learning Fundamentals",
                "suggested_answer": "Overfitting occurs when a model learns the noise in the training data rather than the underlying pattern, leading to high training accuracy but poor generalization to unseen data. It can be prevented using techniques like cross-validation, regularization (L1/L2), reducing model complexity, pruning decision trees, or using dropout layers in neural networks."
            },
            {
                "id": "ai_easy_2",
                "question": "Explain the difference between supervised and unsupervised learning.",
                "category": "Machine Learning Fundamentals",
                "suggested_answer": "Supervised learning uses labeled training data to predict outcomes (e.g. classification, regression). Unsupervised learning takes unlabeled data and attempts to discover latent patterns, groupings, or structures (e.g. clustering with K-Means, dimensionality reduction with PCA)."
            },
            {
                "id": "ai_easy_3",
                "question": "What are activation functions in deep learning, and why are they needed?",
                "category": "Neural Networks",
                "suggested_answer": "Activation functions introduce non-linear properties to neural networks, allowing them to learn complex non-linear mapping functions between inputs and outputs. Without non-linearity, a deep neural network, no matter how many layers it has, would behave like a simple single-layer linear regression model."
            },
            {
                "id": "ai_easy_4",
                "question": "Explain the difference between L1 and L2 regularization.",
                "category": "Model Optimization",
                "suggested_answer": "L1 regularization (Lasso) adds the absolute values of the weights as a penalty term, encouraging sparse weight matrices where less important feature weights are driven to exactly zero. L2 regularization (Ridge) adds the squared values of the weights, forcing weights to be small but rarely exactly zero, helping handle multicollinearity."
            },
            {
                "id": "ai_easy_5",
                "question": "What is bias-variance tradeoff?",
                "category": "Machine Learning Theory",
                "suggested_answer": "It is the conflict between a model's capacity to minimize error from bias (underfitting due to overly simple assumptions) vs variance (overfitting due to excessive sensitivity to training set fluctuations). The goal is to find the sweet spot that minimizes overall prediction error."
            },
            {
                "id": "ai_easy_6",
                "question": "What is cross-validation and why is it used?",
                "category": "Model Validation",
                "suggested_answer": "Cross-validation (like K-Fold) splits the dataset into K subsets. The model is trained on K-1 subsets and validated on the remaining subset. This rotation is repeated K times. It ensures the model generalizes well and reduces validation variance."
            },
            {
                "id": "ai_easy_7",
                "question": "What is the function of the learning rate in gradient descent?",
                "category": "Optimization",
                "suggested_answer": "The learning rate is a hyperparameter that determines the step size at each iteration while moving toward a minimum of a loss function. If too small, training is slow; if too large, it can overshoot the minimum and diverge."
            },
            {
                "id": "ai_easy_8",
                "question": "What is a confusion matrix?",
                "category": "Evaluation Metrics",
                "suggested_answer": "A confusion matrix is a table layout that visualizes the performance of a classification algorithm. It shows counts of True Positives, True Negatives, False Positives, and False Negatives, allowing computation of metrics like Precision, Recall, and F1-Score."
            },
            {
                "id": "ai_easy_9",
                "question": "What is the difference between classification and regression?",
                "category": "Machine Learning Fundamentals",
                "suggested_answer": "Classification models predict discrete class labels or categories (e.g. email spam vs not spam). Regression models predict continuous numerical values (e.g. house price predictions)."
            },
            {
                "id": "ai_easy_10",
                "question": "What is gradient descent?",
                "category": "Optimization",
                "suggested_answer": "Gradient descent is an iterative optimization algorithm used to minimize a loss function by updating model parameters in the direction of the steepest descent, defined by the negative gradient of the function."
            }
        ],
        "Medium": [
            {
                "id": "ai_med_1",
                "question": "Explain how the self-attention mechanism works in Transformers.",
                "category": "Deep Learning / NLP",
                "suggested_answer": "Self-attention computes Query (Q), Key (K), and Value (V) matrices from input word embeddings. It calculates attention weights by computing the dot product of Queries and Keys, scaling by the square root of key dimensions, and applying softmax. These weights are then multiplied by the Values to yield contextual representations."
            },
            {
                "id": "ai_med_2",
                "question": "How would you handle highly imbalanced datasets in machine learning?",
                "category": "Data Engineering",
                "suggested_answer": "Imbalanced datasets can be handled by: resampling (SMOTE for oversampling, or random undersampling), using tree-based ensembles, picking appropriate metrics (F1-score, Precision-Recall AUC instead of Accuracy), or using cost-sensitive training (adjusting class weights in the loss function)."
            },
            {
                "id": "ai_med_3",
                "question": "Explain gradient vanishing and exploding, and how to mitigate them.",
                "category": "Deep Learning",
                "suggested_answer": "Vanishing gradients occur when gradients shrink exponentially as they propagate backward, preventing weight updates in early layers. Exploding gradients happen when they accumulate and grow out of control. Mitigation includes: residual connections (ResNet), Batch Normalization, proper weight initialization (He/Xavier), and gradient clipping."
            },
            {
                "id": "ai_med_4",
                "question": "What is transfer learning, and when is it most useful?",
                "category": "Deep Learning",
                "suggested_answer": "Transfer learning involves taking a model pre-trained on a massive dataset (e.g. ImageNet, BERT) and fine-tuning it on a smaller, domain-specific dataset. It is highly useful when target label data is scarce, saving significant training time and computation."
            },
            {
                "id": "ai_med_5",
                "question": "Explain precision-recall trade-off.",
                "category": "Evaluation Metrics",
                "suggested_answer": "Precision and recall are inversely related. Increasing the classification threshold increases precision (fewer false positives) but lowers recall (more false negatives). Decreasing the threshold raises recall but lowers precision. F1-Score acts as the harmonic mean to find a balance."
            },
            {
                "id": "ai_med_6",
                "question": "What are Word Embeddings (e.g. Word2Vec) and how do they capture semantic meaning?",
                "category": "NLP",
                "suggested_answer": "Word embeddings map words to high-dimensional continuous vectors. They are trained on text corpora such that words appearing in similar contexts end up close to each other in vector space, capturing semantic relationships (e.g. king - man + woman = queen)."
            },
            {
                "id": "ai_med_7",
                "question": "What is the difference between batch gradient descent, mini-batch, and SGD?",
                "category": "Optimization",
                "suggested_answer": "Batch GD calculates gradients using the entire dataset (accurate but slow and high memory). SGD updates weights per single sample (fast but noisy and erratic convergence). Mini-batch GD updates parameters per batch of sample sizes (e.g. 32, 64), balancing accuracy and compute speed."
            },
            {
                "id": "ai_med_8",
                "question": "Explain how CNN layers (Convolution, Pooling) extract features.",
                "category": "Computer Vision",
                "suggested_answer": "Convolutional layers apply slide-filters (kernels) to inputs to produce feature maps capturing local features like edges, textures, and shapes. Pooling layers (Max/Average) reduce spatial dimensions, providing translation invariance and reducing parameter count."
            },
            {
                "id": "ai_med_9",
                "question": "What is the difference between bags of decision trees: Random Forest vs XGBoost?",
                "category": "Algorithms",
                "suggested_answer": "Random Forest is a bagging ensemble that trains multiple decision trees independently in parallel, averaging predictions to reduce variance. XGBoost is a boosting ensemble that trains trees sequentially, where each new tree is built to correct errors made by previous trees (gradient boosting)."
            },
            {
                "id": "ai_med_10",
                "question": "What is retrieval-augmented generation (RAG)?",
                "category": "Generative AI",
                "suggested_answer": "RAG is a technique that enhances LLM generation by querying an external vector database of private/recent documents based on the user's prompt, embedding the retrieved context into the model's prompt window, and generating grounded, factual answers."
            }
        ],
        "Hard": [
            {
                "id": "ai_hard_1",
                "question": "Explain RLHF (Reinforcement Learning from Human Feedback) in LLM training.",
                "category": "Generative AI / LLMs",
                "suggested_answer": "RLHF aligns LLMs with human values. First, we pre-train the base model. Second, we collect human comparisons on model outputs to train a Reward Model predicting alignment. Third, we optimize the policy model via PPO reinforcement learning, utilizing the Reward Model scores while applying a KL divergence penalty to avoid policy drift."
            },
            {
                "id": "ai_hard_2",
                "question": "Design an enterprise RAG system that updates vector indexes in real-time.",
                "category": "System Design",
                "suggested_answer": "An enterprise RAG system needs: a document parser (handling PDF/docs), a streaming queue (Kafka/RabbitMQ) triggering when files update, a chunking microservice with overlap, an embedding pipeline (using models like text-embedding-3-small), a vector database (Pinecone/pgvector) for metadata filtering, and semantic caching (Redis) for recurrent queries."
            },
            {
                "id": "ai_hard_3",
                "question": "Explain the difference between AWQ and GPTQ quantization techniques for LLMs.",
                "category": "Model Optimization",
                "suggested_answer": "GPTQ is a layer-by-layer second-order optimization method that quantizes weights by minimizing mean-squared error on calibration data. AWQ (Activation-aware Weight Quantization) identifies that not all weights are equal; keeping 1% of salient weights (correlating with activation magnitudes) in FP16 while quantizing the rest to 4-bit prevents perplexity degradation."
            },
            {
                "id": "ai_hard_4",
                "question": "How does FlashAttention optimize the self-attention calculation at the hardware level?",
                "category": "Deep Learning Performance",
                "suggested_answer": "FlashAttention reduces memory bottlenecks. Standard self-attention writes the intermediate NxN attention matrix to High-Bandwidth Memory (HBM), which is slow. FlashAttention tiles the inputs, loads them into fast SRAM, computes attention incrementally (using online softmax scaling), and avoids writing the large NxN matrix to HBM."
            },
            {
                "id": "ai_hard_5",
                "question": "Explain contrastive learning and the CLIP model pre-training structure.",
                "category": "Multimodal DL",
                "suggested_answer": "Contrastive learning pulls representations of similar pairs closer and pushes dissimilar pairs apart. CLIP pre-trains image and text encoders jointly. Given a batch of N (image, text) pairs, it maximizes the cosine similarity of the N correct diagonal pairs while minimizing similarity for the N*(N-1) incorrect pairings."
            },
            {
                "id": "ai_hard_6",
                "question": "How do you detect and mitigate hallucination in RAG pipelines?",
                "category": "Generative AI",
                "suggested_answer": "Mitigation includes: citation enforcement, self-consistency check, prompt constraints ('Respond only if context contains answer'), external fact-checking models, and chunk ranking using cross-encoder rerankers (like Cohere) to verify context relevancy."
            },
            {
                "id": "ai_hard_7",
                "question": "Design an online recommender system combining collaborative filtering and deep retrieval.",
                "category": "System Design",
                "suggested_answer": "A two-stage recommender: 1) Retrieval stage retrieves ~100 candidates using fast collaborative filtering or dual-encoder neural networks (user/item embedding dot products). 2) Ranking stage uses deep models (e.g. Deep & Cross Networks) factoring in real-time features (device, time, recent clicks) to output final recommendations."
            },
            {
                "id": "ai_hard_8",
                "question": "Describe the mathematical objective function of Generative Adversarial Networks (GANs).",
                "category": "Generative AI",
                "suggested_answer": "GANs use a min-max game objective: min_G max_D V(D, G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]. Discriminator D maximizes log likelihood of predicting real data correctly; Generator G minimizes log likelihood of Discriminator detecting generated samples as fake."
            },
            {
                "id": "ai_hard_9",
                "question": "Walk through the training objective of Diffusion Models.",
                "category": "Generative AI",
                "suggested_answer": "Diffusion models use a forward process that adds Gaussian noise incrementally, and a reverse process that learns to denoise. The objective function is a simplified variational lower bound, training a U-Net model to predict the noise added at a specific timestep t: Loss = E_{t, x_0, epsilon}[ || epsilon - epsilon_theta(x_t, t) ||^2 ]."
            },
            {
                "id": "ai_hard_10",
                "question": "Explain the difference between fine-tuning (LoRA) and prompt tuning.",
                "category": "Model Optimization",
                "suggested_answer": "LoRA (Low-Rank Adaptation) freezes pre-trained weight matrices and inserts trainable rank decomposition matrices (A and B of rank r << d) into attention layers, updating weights efficiently. Prompt tuning appends virtual trainable token embeddings ('soft prompts') to the input text while keeping the LLM frozen."
            }
        ]
    },
    "Frontend Developer": {
        "Easy": [
            {
                "id": "fe_easy_1",
                "question": "What is the difference between state and props in React?",
                "category": "React Basics",
                "suggested_answer": "Props (short for properties) are passed to a component by its parent and are read-only (immutable). State is managed internally within a component to hold data that can change over time (mutable), triggering a re-render when updated."
            },
            {
                "id": "fe_easy_2",
                "question": "Explain what semantic HTML is and why it is important.",
                "category": "HTML & SEO",
                "suggested_answer": "Semantic HTML uses tags that describe their meaning (like <article>, <section>, <header>, <footer>) rather than presentation (<divs>, <span>). It is crucial for accessibility (screen readers), SEO indexing, and code readability."
            },
            {
                "id": "fe_easy_3",
                "question": "What is the difference between == and === in JavaScript?",
                "category": "JavaScript Basics",
                "suggested_answer": "The double equals (==) operator performs type coercion before comparing values, so '5' == 5 returns true. The triple equals (===) operator compares both value and type without coercion, so '5' === 5 returns false."
            },
            {
                "id": "fe_easy_4",
                "question": "Explain the CSS Box Model.",
                "category": "CSS Basics",
                "suggested_answer": "The box model represents the layout box of HTML elements. It consists of: content (text/images), padding (clear area around content), border (runs around padding), and margin (clear area outside the border)."
            },
            {
                "id": "fe_easy_5",
                "question": "What is the Virtual DOM and how does React use it?",
                "category": "React Internals",
                "suggested_answer": "The Virtual DOM is a lightweight JS copy of the real DOM. When state changes, React updates the virtual DOM, compares it to the previous version (diffing), and batches updates to write only changes to the real DOM (reconciliation)."
            },
            {
                "id": "fe_easy_6",
                "question": "What are Closures in JavaScript?",
                "category": "JavaScript Concepts",
                "suggested_answer": "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). It allows an inner function to access variables from its outer scope even after the outer function has returned."
            },
            {
                "id": "fe_easy_7",
                "question": "Explain the difference between let, const, and var.",
                "category": "JavaScript Basics",
                "suggested_answer": "var is function-scoped and hoisted (leads to bug risks). let and const are block-scoped and not hoisted in the same way (temporal dead zone). let allows variable re-assignment, while const variables are read-only bindings."
            },
            {
                "id": "fe_easy_8",
                "question": "What is responsive web design?",
                "category": "CSS Layouts",
                "suggested_answer": "Responsive web design is an approach where web pages render well on all devices and screen sizes. It uses fluid grids, flexible images, and CSS Media Queries to adapt styling dynamically."
            },
            {
                "id": "fe_easy_9",
                "question": "What is local storage vs session storage?",
                "category": "Web Storage",
                "suggested_answer": "Both store key-value pairs in the browser. Local storage persists indefinitely until cleared. Session storage persists only as long as the tab/window is open, and is deleted when the session ends."
            },
            {
                "id": "fe_easy_10",
                "question": "Explain how event bubbling works in the browser.",
                "category": "DOM Events",
                "suggested_answer": "Event bubbling is a type of event propagation where an event triggers on the innermost target element and then bubbles up sequentially through its parent elements in the DOM tree unless explicitly stopped via event.stopPropagation()."
            }
        ],
        "Medium": [
            {
                "id": "fe_med_1",
                "question": "Explain JS Event Loop, micro-tasks, and macro-tasks.",
                "category": "JavaScript Internals",
                "suggested_answer": "JavaScript is single-threaded. The event loop monitors the call stack and callback queues. Macro-tasks (setTimeout, DOM events) go to the task queue. Micro-tasks (Promise.then, queueMicrotask) go to the micro-task queue, which is fully drained before the next macro-task is processed."
            },
            {
                "id": "fe_med_2",
                "question": "What is SSR vs SSG vs CSR in Next.js?",
                "category": "Next.js Architecture",
                "suggested_answer": "CSR (Client-Side Rendering) renders pages dynamically on the client. SSR (Server-Side Rendering) pre-renders pages on the server for each request. SSG (Static Site Generation) builds pages into static files at build time. Next.js combines them using routing."
            },
            {
                "id": "fe_med_3",
                "question": "How do you optimize Core Web Vitals like LCP, INP, and CLS?",
                "category": "Performance",
                "suggested_answer": "Optimize LCP (Largest Contentful Paint) by caching, lazy-loading, and compressing images. Optimize INP (Interaction to Next Paint) by breaking up long tasks and minimizing JS execution. Optimize CLS (Cumulative Layout Shift) by using explicit width/height ratios and avoiding inserts."
            },
            {
                "id": "fe_med_4",
                "question": "What are React custom hooks and when should you write one?",
                "category": "React Concepts",
                "suggested_answer": "Custom hooks are JavaScript functions whose names start with 'use' and can call other React hooks. Write them to extract component logic into reusable functions, such as data fetching, event handlers, or local storage syncing."
            },
            {
                "id": "fe_med_5",
                "question": "Explain CSS Flexbox vs Grid and when to use which.",
                "category": "CSS Layouts",
                "suggested_answer": "Flexbox is designed for 1-dimensional layouts (either rows OR columns), ideal for aligning buttons, menus, or single rows. CSS Grid is designed for 2-dimensional layouts (rows AND columns simultaneously), ideal for full-page structures and complex grids."
            },
            {
                "id": "fe_med_6",
                "question": "What is code splitting and how does it help performance?",
                "category": "Performance",
                "suggested_answer": "Code splitting splits large JS bundle files into smaller chunks loaded on-demand (e.g. via dynamic `import()` or React.lazy). This reduces initial page load size, improving start load performance."
            },
            {
                "id": "fe_med_7",
                "question": "What is CORS (Cross-Origin Resource Sharing)?",
                "category": "Security",
                "suggested_answer": "CORS is a browser security mechanism that restricts HTTP requests initiated from scripts to a different origin than the one serving the script. The target server must send appropriate HTTP headers (Access-Control-Allow-Origin) to approve the origin."
            },
            {
                "id": "fe_med_8",
                "question": "Explain debounce and throttle in JavaScript.",
                "category": "JavaScript Concepts",
                "suggested_answer": "Debounce delays executing a function until a certain amount of time has elapsed since the last call (e.g., search autocomplete inputs). Throttle limits the execution of a function to at most once per time interval (e.g., scroll/resize listeners)."
            },
            {
                "id": "fe_med_9",
                "question": "What are React Server Components (RSC) and how do they differ from Client Components?",
                "category": "React Advanced",
                "suggested_answer": "React Server Components render entirely on the server, producing static output that is sent to the browser without increasing client bundle sizes. Client components are standard components loaded, hydrated, and rendered on the client side, allowing interactive hooks."
            },
            {
                "id": "fe_med_10",
                "question": "What are the rules of hooks in React?",
                "category": "React Concepts",
                "suggested_answer": "1) Only call hooks at the top level (never inside loops, conditions, or nested functions). 2) Only call hooks from React function components or React custom hooks."
            }
        ],
        "Hard": [
            {
                "id": "fe_hard_1",
                "question": "Design a client-side state management system similar to Zustand from scratch.",
                "category": "JavaScript Architecture",
                "suggested_answer": "A state manager requires a closure to hold the state, a list of subscriber callbacks, a `getState` method, a `setState` method that updates the state and notifies subscribers, and a `subscribe` method that returns an unsubscribe function. In React, a hook is used to sync this external store with React state using `useSyncExternalStore`."
            },
            {
                "id": "fe_hard_2",
                "question": "How would you build a micro-frontend architecture for a large scale enterprise portal?",
                "category": "Frontend Systems Design",
                "suggested_answer": "Micro-frontends can be built using: Module Federation in Webpack/Vite to dynamically load remote bundles at runtime, a central orchestrator script, custom event buses or Web workers for shared communication, and single-spa router orchestrators to mount/unmount child systems."
            },
            {
                "id": "fe_hard_3",
                "question": "Explain the internal workings of React's reconciliation algorithm.",
                "category": "React Internals",
                "suggested_answer": "Reconciliation uses a heuristic algorithm with O(N) complexity. It assumes: 1) Two elements of different types will produce different trees (React will tear down the old tree and build the new one). 2) Keys are used to track element stability across renders, mapping virtual nodes to existing DOM elements."
            },
            {
                "id": "fe_hard_4",
                "question": "How would you secure a client-side application against XSS, CSRF, and clickjacking?",
                "category": "Frontend Security",
                "suggested_answer": "Security requires: Content Security Policy (CSP) headers restricting script source domains, escaping and sanitizing user inputs (DOMPurify), storing JWT credentials in HttpOnly SameSite=Strict cookies (preventing XSS/CSRF access), and using X-Frame-Options headers to block framing."
            },
            {
                "id": "fe_hard_5",
                "question": "Design an offline-first progressive web app (PWA) using Service Workers and IndexedDB.",
                "category": "Frontend Systems Design",
                "suggested_answer": "An offline-first PWA registers a Service Worker that intercepts network requests, serving resources from a Cache Storage (for static shell assets) or IndexedDB (for structured API data). It uses sync queues to sync user offline mutations to the server once online."
            },
            {
                "id": "fe_hard_6",
                "question": "Explain JavaScript memory leaks (closures, detached DOM nodes) and how to debug them.",
                "category": "Performance",
                "suggested_answer": " leaks happen when unused memory references are held in memory. Detached DOM nodes occur when elements are removed from the DOM but referenced in JS arrays. closures can capture large scope scopes. Debug using Chrome DevTools Heap Snapshots and Allocation Timelines."
            },
            {
                "id": "fe_hard_7",
                "question": "How would you design a canvas drawing board or high-frequency grid rendering at 60fps?",
                "category": "Performance",
                "suggested_answer": "High-frequency render requires: `requestAnimationFrame` loop, drawing on an offscreen canvas and transferring chunks, virtualizing list scroll containers to render only visible elements, and batching DOM reads/writes to avoid layout thrashing."
            },
            {
                "id": "fe_hard_8",
                "question": "Explain JS bundle chunking, vendor splitting, and tree shaking configurations.",
                "category": "Build Tools",
                "suggested_answer": "Bundle chunking splits code by routes. Vendor splitting extracts dependencies (like react, lodash) into separate cacheable bundles. Tree shaking uses ES module static import/export mappings to exclude dead code from final production bundles during minification."
            },
            {
                "id": "fe_hard_9",
                "question": "Explain the CSS-in-JS style compilation overhead vs CSS Modules compilation pipelines.",
                "category": "Styling Architecture",
                "suggested_answer": "Runtime CSS-in-JS (styled-components) compiles and injects style tags into the head on render, creating CPU and paint overhead. CSS Modules compile into static class hash mappings during build time, leading to zero runtime overhead and smaller styles."
            },
            {
                "id": "fe_hard_10",
                "question": "How does server-side rendering (SSR) hydration work in React and how do hydration errors happen?",
                "category": "React Internals",
                "suggested_answer": "SSR renders static HTML on the server. The client loads the JS bundle and attaches event listeners to the pre-rendered HTML structure (hydration). Hydration errors happen if the HTML output generated on the server doesn't match the client structure (e.g. using `new Date()` or window size checks on initial render)."
            }
        ]
    },
    "Default": {
        "Easy": [
            {
                "id": "def_easy_1",
                "question": "Explain the difference between a Stack and a Queue.",
                "category": "Data Structures",
                "suggested_answer": "A stack is a Last-In-First-Out (LIFO) data structure where elements are inserted (push) and removed (pop) from the same end. A queue is a First-In-First-Out (FIFO) data structure where elements are inserted (enqueue) at the back and removed (dequeue) from the front."
            },
            {
                "id": "def_easy_2",
                "question": "What is Recursion and what is a call stack overflow?",
                "category": "Algorithms",
                "suggested_answer": "Recursion is a programming technique where a function calls itself to solve smaller instances of a problem. It must have a base case. A stack overflow happens if there is no base case, causing infinite nested function calls until memory limits are reached."
            },
            {
                "id": "def_easy_3",
                "question": "What are the core OOP (Object-Oriented Programming) principles?",
                "category": "Software Design",
                "suggested_answer": "The four core principles are: Encapsulation (hiding internal state details), Inheritance (reusing parent class code), Polymorphism (overriding methods dynamically), and Abstraction (exposing only relevant public interfaces)."
            },
            {
                "id": "def_easy_4",
                "question": "What is a database Index and how does it speed up queries?",
                "category": "Databases",
                "suggested_answer": "An index is a database structure (typically a B-Tree) that maps column values to record locations in memory. Instead of checking every row sequentially (full table scan), the database traverses the index structure in logarithmic time to locate matches quickly."
            },
            {
                "id": "def_easy_5",
                "question": "Explain the difference between HTTP and HTTPS.",
                "category": "Networking",
                "suggested_answer": "HTTP transmits data in clear text, exposing it to eavesdropping. HTTPS encrypts communication using TLS/SSL protocols, ensuring confidentiality, data integrity, and authentication of the remote server."
            },
            {
                "id": "def_easy_6",
                "question": "What is Git and how do merge conflicts happen?",
                "category": "Version Control",
                "suggested_answer": "Git is a distributed version control system. A merge conflict happens when developers make conflicting edits to the same lines of code in different branches, and Git cannot automatically decide which change to keep during a merge."
            },
            {
                "id": "def_easy_7",
                "question": "What is REST and what are common HTTP methods?",
                "category": "Web APIs",
                "suggested_answer": "REST is an architectural style for design APIs. Common HTTP methods include: GET (read resource), POST (create resource), PUT (replace resource), PATCH (partially update resource), and DELETE (remove resource)."
            },
            {
                "id": "def_easy_8",
                "question": "What is time complexity and Big O notation?",
                "category": "Algorithms",
                "suggested_answer": "Big O notation measures the scalability of an algorithm by describing its execution time or memory requirements relative to the input size N as N grows to infinity (e.g. O(1), O(log N), O(N), O(N^2))."
            },
            {
                "id": "def_easy_9",
                "question": "What is the difference between an Array and a Linked List?",
                "category": "Data Structures",
                "suggested_answer": "An array allocates contiguous blocks of memory, enabling O(1) random access but making insertions in the middle slow O(N). A linked list allocates nodes dynamically anywhere in memory linked via pointers, enabling O(1) insertions but requiring O(N) traversal to look up elements."
            },
            {
                "id": "def_easy_10",
                "question": "What is a primary key vs a foreign key in SQL?",
                "category": "Databases",
                "suggested_answer": "A primary key uniquely identifies each record in a database table. A foreign key is a column that refers to the primary key of another table, establishing a relational link and enforcing referential integrity."
            }
        ],
        "Medium": [
            {
                "id": "def_med_1",
                "question": "What is SQL Injection and how do you protect your backend APIs against it?",
                "category": "Backend Security",
                "suggested_answer": "SQL injection occurs when raw, unescaped user inputs are concatenated directly into SQL query strings, allowing attackers to execute arbitrary SQL statements. Protection includes: using Parameterized Queries (Prepared Statements), using ORMs, and sanitizing inputs."
            },
            {
                "id": "def_med_2",
                "question": "Explain SQL vs NoSQL databases and when to use which.",
                "category": "Databases",
                "suggested_answer": "SQL databases are relational, table-based, and enforce schemas with strict ACID compliance (ideal for financial records). NoSQL databases are non-relational, document/key-value based, and allow flexible schemas with high scaling capabilities (ideal for real-time logs, catalogs, or unstructured data)."
            },
            {
                "id": "def_med_3",
                "question": "What is database connection pooling?",
                "category": "Databases",
                "suggested_answer": "Connection pooling maintains a cache of active database connections. Instead of paying the TCP handshake overhead to open/close a connection for every API request, the server leases a connection from the pool, uses it, and returns it immediately."
            },
            {
                "id": "def_med_4",
                "question": "Explain symmetric vs asymmetric encryption and how HTTPS uses both.",
                "category": "Security",
                "suggested_answer": "Symmetric encryption uses a single key to encrypt and decrypt. Asymmetric uses a public key to encrypt and private key to decrypt. During HTTPS handshake, asymmetric encryption is used to securely exchange a session key, which is then used for symmetric encryption during data transfer."
            },
            {
                "id": "def_med_5",
                "question": "What is a deadlock in multithreading?",
                "category": "Concurrence",
                "suggested_answer": "A deadlock happens when two or more threads are blocked forever, each waiting for a lock resource held by the other thread (e.g. Thread 1 holds Lock A, wants Lock B; Thread 2 holds Lock B, wants Lock A). Prevent by acquiring locks in a strict global order."
            },
            {
                "id": "def_med_6",
                "question": "Compare REST, GraphQL, and gRPC.",
                "category": "System Architecture",
                "suggested_answer": "REST is standard and simple, using HTTP methods. GraphQL allows clients to request specific JSON structures, preventing over/under-fetching. gRPC uses HTTP/2 and Protocol Buffers to enable highly efficient, binary remote procedure calls, ideal for internal microservices."
            },
            {
                "id": "def_med_7",
                "question": "What is the MVC (Model-View-Controller) design pattern?",
                "category": "Software Architecture",
                "suggested_answer": "MVC splits an application into: Model (manages database and business logic), View (renders UI layouts), and Controller (coordinates traffic, handling requests and updates)."
            },
            {
                "id": "def_med_8",
                "question": "What are Docker containers and how do they differ from virtual machines?",
                "category": "DevOps",
                "suggested_answer": "Virtual machines pack a full guest operating system, including kernels, virtual drivers, and apps (slow and heavy). Docker containers share the host operating system kernel, isolating only system libraries and runtime processes (fast, lightweight, and efficient)."
            },
            {
                "id": "def_med_9",
                "question": "What is caching, CDN, and Redis?",
                "category": "System Design",
                "suggested_answer": "Caching stores expensive calculations in memory. Redis is an in-memory key-value database commonly used to cache backend data. CDNs (Content Delivery Networks) cache static assets at distributed edge servers globally closer to users."
            },
            {
                "id": "def_med_10",
                "question": "How does database index selection (B-Tree vs Hash) affect performance?",
                "category": "Databases",
                "suggested_answer": "B-Tree indexes support range queries, sorting, and prefixes, operating in O(log N) time. Hash indexes associate keys directly to values, enabling O(1) point lookups, but do not support range queries, sorting, or prefix matching."
            }
        ],
        "Hard": [
            {
                "id": "def_hard_1",
                "question": "Design a distributed rate limiter that handles 100K requests per second.",
                "category": "System Design",
                "suggested_answer": "A distributed rate limiter can be built using Redis Cluster with a Token Bucket or Sliding Window Log algorithm. We track client requests using Redis keys (`limit:client_ip`). We execute atomic Redis Lua scripts to verify and decrement tokens in a single round-trip, avoiding race conditions."
            },
            {
                "id": "def_hard_2",
                "question": "Explain CAP Theorem vs PACELC Theorem.",
                "category": "Distributed Systems",
                "suggested_answer": "CAP states a distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance. PACELC extends this: If there is a Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C). This guides replication choices."
            },
            {
                "id": "def_hard_3",
                "question": "Design a highly available URL shortener service like TinyURL.",
                "category": "System Design",
                "suggested_answer": "TinyURL requires: 1) Hash generation (Base62 of auto-incrementing ID). 2) Distributed ID generator (Snowflake/ZooKeeper range allocation) to avoid duplicate IDs. 3) Datastores: NoSQL (Cassandra/DynamoDB) mapping short_id -> long_url. 4) Read caches: Redis clusters for hot keys."
            },
            {
                "id": "def_hard_4",
                "question": "How do Raft or Paxos protocols ensure distributed consistency?",
                "category": "Distributed Systems",
                "suggested_answer": "They use consensus algorithms. In Raft, a leader is elected by a majority vote of follower nodes. All state writes go through the leader, which appends the log, replicates it to follower nodes, and commits the write only after receiving write confirmation from a majority."
            },
            {
                "id": "def_hard_5",
                "question": "How does write-ahead logging (WAL) ensure durability during a database crash?",
                "category": "Databases Internals",
                "suggested_answer": "WAL mandates that no database modification (data block update) is written to disk before the corresponding log records describing the modification are flushed to non-volatile disk logs. During startup after a crash, the database reads the log to replay completed writes (Redo) and rollback uncommitted updates (Undo)."
            },
            {
                "id": "def_hard_6",
                "question": "Design a messaging system similar to Apache Kafka.",
                "category": "System Design",
                "suggested_answer": "Kafka uses an append-only commit log on disk. Topics are divided into partitions distributed across cluster nodes. Producers append binary payloads sequentially. Consumers track their progress using offsets, enabling zero-copy network transfer directly from disk buffer caches."
            },
            {
                "id": "def_hard_7",
                "question": "Explain Event Sourcing and CQRS patterns.",
                "category": "Software Architecture",
                "suggested_answer": "Event Sourcing persists the state of an application as a sequence of immutable events rather than overwriting database cells. CQRS (Command Query Responsibility Segregation) separates write commands from read queries, enabling separate, optimized read and write databases."
            },
            {
                "id": "def_hard_8",
                "question": "How do you secure microservices communication? Detail JWT vs mTLS.",
                "category": "Security",
                "suggested_answer": "Securing microservices requires: 1) Edge verification: API Gateway validates user JWTs. 2) Inter-service communication: mTLS (mutual TLS) via a Service Mesh (Istio) to encrypt traffic and authenticate calling nodes. 3) Fine-grained scope authorization."
            },
            {
                "id": "def_hard_9",
                "question": "How would you diagnose and debug a thread deadlock or CPU spike in production?",
                "category": "Performance Debugging",
                "suggested_answer": "Use thread dump profiles (`jstack` for JVM, `py-spy` for Python) to check lock wait structures and identify deadlock cycles. For CPU spikes, use profiling tools (async-profiler/perf) to capture stack traces and generate flame graphs, locating execution hotspots."
            },
            {
                "id": "def_hard_10",
                "question": "Explain TCP flow control vs congestion control.",
                "category": "Networking",
                "suggested_answer": "Flow control prevents the sender from overwhelming the receiver's buffer, regulated using the receiver's advertised window size (rwnd). Congestion control prevents the sender from overwhelming the network, regulated using the congestion window size (cwnd) adjusted via slow start, congestion avoidance, fast retransmit, and recovery."
            }
        ]
    }
}

BEHAVIORAL_QUESTIONS = [
    {
        "id": "beh_1",
        "question": "Tell me about a time you worked on a team project and had to manage a conflict.",
        "category": "Conflict Resolution",
        "suggested_answer": "In my junior project, a team member missed several deadlines. I set up a private chat to understand if they were facing blockers. We uncovered they were struggling with Docker setup. I paired with them for two hours, we established a clear sub-task breakdown, and we delivered the project on time."
    },
    {
        "id": "beh_2",
        "question": "Describe a time you had to meet a tight deadline. How did you organize your tasks?",
        "category": "Time Management",
        "suggested_answer": "During a hackathon, we had to build a React application in 48 hours. I structured our progress using a Kanban board, scoping features to a Minimum Viable Product. I focused on core user authentication and APIs first, leaving UI enhancements for the final hours, allowing us to launch with 2 hours to spare."
    },
    {
        "id": "beh_3",
        "question": "Talk about a major project failure you experienced. What did you learn?",
        "category": "Growth Mindset",
        "suggested_answer": "I once launched a script that updated database rows without a transactional wrapper, leading to partial updates during an outage. I learned the critical importance of database transactions, write-ahead testing, and always taking local backups before run operations."
    },
    {
        "id": "beh_4",
        "question": "Describe a situation where you had to learn a complex new tool or domain quickly.",
        "category": "Adaptability",
        "suggested_answer": "At my internship, I had to configure a Kubernetes deployment pipeline with zero prior experience. I spent the first two days reading official document guides and sketching cluster nodes. By day three, I built a local cluster using Minikube, helping me deploy successfully by the end of the week."
    },
    {
        "id": "beh_5",
        "question": "Tell me about a time you went above and beyond for a task.",
        "category": "Initiative",
        "suggested_answer": "While optimizing a client portal, I noticed the database query speeds were slowing down. Although my task was purely frontend styling, I spent extra time profiling index queries, rewriting two inefficient SQL joins, reducing overall API response latency by 50%."
    },
    {
        "id": "beh_6",
        "question": "Tell me about a time you disagreed with a manager or senior team member. How did you handle it?",
        "category": "Communication",
        "suggested_answer": "A senior developer wanted to use a heavy runtime CSS-in-JS library, while I preferred CSS Modules for performance. Instead of arguing, I built a quick prototype demonstrating page speed comparisons and layout thrashing offsets. They agreed with the data and we chose CSS Modules."
    },
    {
        "id": "beh_7",
        "question": "Talk about a time you had to adapt to a sudden change in project specifications.",
        "category": "Adaptability",
        "suggested_answer": "A client requested a transition from PostgreSQL to DynamoDB mid-project. I decoupled our business logic by writing repository interface wrappers. This allowed us to swap the database implementation layer with minimal changes to our controllers."
    },
    {
        "id": "beh_8",
        "question": "Describe a time you made a mistake at work. How did you handle the consequences?",
        "category": "Integrity",
        "suggested_answer": "I committed an API key to a public GitHub repository. As soon as I realized, I revoked the key in the dashboard, removed it from git history using filter-branch, set up repository secrets, and notified my manager of the leak and immediate mitigation."
    },
    {
        "id": "beh_9",
        "question": "Give an example of how you explained a highly technical concept to a non-technical stakeholder.",
        "category": "Communication",
        "suggested_answer": "I explained caching to a client by using the analogy of a kitchen workspace. Instead of cooking ingredients from scratch every time (database lookup), you place hot ingredients on the counter table (cache) for instant assembly."
    },
    {
        "id": "beh_10",
        "question": "Describe a time you had to prioritize multiple competing tasks on a tight schedule.",
        "category": "Time Management",
        "suggested_answer": "I used the Eisenhower Matrix to prioritize tasks during final exams. I sorted features by Urgency and Importance, deferring minor UI layouts, delegating copy assets, and focusing exclusively on fixing critical auth bugs."
    }
]

HR_QUESTIONS = [
    {
        "id": "hr_1",
        "question": "Tell me about yourself and your career background.",
        "category": "Introduction",
        "suggested_answer": "I am a computer science developer specialized in building full-stack web applications and AI pipeline integrations. I have experience writing React interfaces, building FastAPI servers, deploying Docker configurations, and syncing relational databases. My goal is to build scalable user-centric technology products."
    },
    {
        "id": "hr_2",
        "question": "Why are you interested in joining our company?",
        "category": "Company Alignment",
        "suggested_answer": "I have been following your growth in AI-powered productivity software. Your commitment to user experience and clean engineering aligns with my background. I want to contribute my skills in full-stack React and AI models to help solve real-world career planning challenges."
    },
    {
        "id": "hr_3",
        "question": "What are your greatest strengths and weaknesses?",
        "category": "Self-Awareness",
        "suggested_answer": "My greatest strength is my problem-solving speed and ability to learn new frameworks quickly. My weakness is that I sometimes struggle to delegate tasks because I want to ensure absolute detail; however, I am active in using project boards to share workloads cleanly."
    },
    {
        "id": "hr_4",
        "question": "Where do you see yourself in 5 years?",
        "category": "Career Goals",
        "suggested_answer": "In 5 years, I aim to grow into a Senior Full-Stack or AI Systems Architect, leading technical design decisions and mentoring junior developers. I want to build a deep expertise in system scalability and deployment."
    },
    {
        "id": "hr_5",
        "question": "Why are you looking for a new opportunity?",
        "category": "Career Growth",
        "suggested_answer": "I am looking for a role that challenges me with larger systems and direct AI model integration. I want to work with a collaborative engineering team where I can apply my full-stack skills and accelerate my development."
    },
    {
        "id": "hr_6",
        "question": "What are your salary expectations for this position?",
        "category": "Negotiation",
        "suggested_answer": "I am looking for a competitive compensation package that aligns with my full-stack experience and the responsibilities of the role. I am open to discussing specific numbers once we confirm we are a good mutual fit."
    },
    {
        "id": "hr_7",
        "question": "Describe your ideal work environment.",
        "category": "Culture Fit",
        "suggested_answer": "My ideal environment is one that promotes clear documentation, asynchronous communication, continuous learning, and structured sprints. I work well in both remote and hybrid structures."
    },
    {
        "id": "hr_8",
        "question": "How do you handle stressful situations or high-pressure deadlines?",
        "category": "Resilience",
        "suggested_answer": "I handle stress by breaking the pressure points down. I list critical blockers, communicate transparently with stakeholders about timelines, prioritize tasks using lists, and tackle items step-by-step."
    },
    {
        "id": "hr_9",
        "question": "What makes you a good fit for this role compared to other candidates?",
        "category": "Value Proposition",
        "suggested_answer": "I bring a unique combination of full-stack engineering proficiency (React, TypeScript, FastAPI) and hands-on database experience. I can immediately build clean frontends, design scalable database schemas, and optimize backend routes."
    },
    {
        "id": "hr_10",
        "question": "Do you have any questions for us about the company or team?",
        "category": "Engagement",
        "suggested_answer": "Yes, I would love to understand: What are the biggest technical challenges the engineering team is currently solving? And how is the onboarding program structured for new hires?"
    }
]


def mock_interview_start(interview_type: str, role: str, difficulty: str = "Medium") -> dict:
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    
    role_key = "Default"
    for k in QUESTIONS_DB.keys():
        if k.lower() in role.lower():
            role_key = k
            break
            
    questions = []
    
    # Get pools
    tech_pool = QUESTIONS_DB[role_key].get(difficulty, QUESTIONS_DB["Default"]["Medium"])
    
    if interview_type.lower() == "technical":
        # Select 10 technical
        selected = tech_pool[:10]
        for i, q in enumerate(selected):
            questions.append({
                "id": q["id"],
                "question": q["question"],
                "category": q["category"],
                "difficulty": difficulty
            })
    elif interview_type.lower() == "behavioral":
        selected = BEHAVIORAL_QUESTIONS[:10]
        for i, q in enumerate(selected):
            questions.append({
                "id": q["id"],
                "question": q["question"],
                "category": q["category"],
                "difficulty": difficulty
            })
    elif interview_type.lower() == "hr":
        selected = HR_QUESTIONS[:10]
        for i, q in enumerate(selected):
            questions.append({
                "id": q["id"],
                "question": q["question"],
                "category": q["category"],
                "difficulty": difficulty
            })
    else: # Mixed / default
        selected_tech = tech_pool[:4]
        selected_beh = BEHAVIORAL_QUESTIONS[:3]
        selected_hr = HR_QUESTIONS[:3]
        
        for q in selected_tech:
            questions.append({"id": q["id"], "question": q["question"], "category": q["category"], "difficulty": difficulty})
        for q in selected_beh:
            questions.append({"id": q["id"], "question": q["question"], "category": q["category"], "difficulty": difficulty})
        for q in selected_hr:
            questions.append({"id": q["id"], "question": q["question"], "category": q["category"], "difficulty": difficulty})
            
    return {
        "session_id": session_id,
        "questions": questions
    }


def find_question_by_id(question_id: str) -> dict | None:
    # 1. Search technical pools
    for role, diffs in QUESTIONS_DB.items():
        for diff, q_list in diffs.items():
            for q in q_list:
                if q["id"] == question_id:
                    return q
    # 2. Search behavioral
    for q in BEHAVIORAL_QUESTIONS:
        if q["id"] == question_id:
            return q
    # 3. Search HR
    for q in HR_QUESTIONS:
        if q["id"] == question_id:
            return q
    return None


def mock_interview_feedback(question_id: str, answer: str, role: str = "Software Engineer") -> dict:
    # Find question to retrieve suggested answer
    q_item = find_question_by_id(question_id)
    suggested_answer = q_item["suggested_answer"] if q_item else "A strong answer should cover the core concepts in detail, provide a concrete real-world example, and structure the response using the STAR method (Situation, Task, Action, Result)."
    category = q_item["category"] if q_item else "General"
    
    ans_len = len(answer.strip())
    
    if ans_len < 15:
        # Answer is too short
        return {
            "feedback": {
                "score": 3,
                "strengths": ["Acknowledged the question prompt."],
                "weaknesses": ["The response is extremely brief and lacks any technical or behavioral details."],
                "improvements": ["Elaborate on the concept by defining terms.", "Provide a structured example using the STAR method."],
                "suggested_answer": suggested_answer
            }
        }
        
    # Calculate score based on text length and character code hashing
    char_sum = sum(ord(c) for c in answer)
    score = 6 + (char_sum % 4)  # Score between 6 and 9
    
    # Customize based on category
    strengths = [
        "Identified the core concept and explained its basic mechanics.",
        "Demonstrated a good understanding of standard terminology."
    ]
    weaknesses = [
        "Lacks specific quantified metrics or business impact details.",
        "Could expand on trade-offs or alternative approaches."
    ]
    improvements = [
        "Include metrics (percentages, lines of code, numbers) to ground your experience.",
        "Clearly state the pros and cons of the discussed methodology."
    ]
    
    return {
        "feedback": {
            "score": int(score),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "improvements": improvements,
            "suggested_answer": suggested_answer
        }
    }


def mock_interview_history() -> list[dict]:
    return [
        {
            "session_id": "sess_past001",
            "type": "technical",
            "role": "AI Engineer",
            "overall_score": 74,
            "created_at": "2025-06-10T14:30:00Z",
        },
        {
            "session_id": "sess_past002",
            "type": "behavioral",
            "role": "Software Engineer",
            "overall_score": 82,
            "created_at": "2025-06-05T09:15:00Z",
        },
    ]


def mock_chat_reply(message: str, session_type: str) -> dict:
    replies = {
        "mentor": {
            "reply": f"Great question! Based on your profile as an aspiring AI Engineer, I'd recommend focusing on three key areas:\n\n**1. Technical Foundation**\nStrengthen your PyTorch/TensorFlow skills and build at least 2-3 end-to-end ML projects that demonstrate real-world problem solving.\n\n**2. System Design**\nStudy how to design scalable ML systems. Companies like Google and Meta heavily test this in interviews.\n\n**3. Portfolio & Visibility**\nPublish your work on GitHub, write technical blog posts, and engage with the ML community on Twitter/LinkedIn.\n\nWould you like me to create a detailed 12-week roadmap for any of these areas?",
            "suggestions": [
                "Create a roadmap for ML system design",
                "Help me improve my resume for AI roles",
                "What certifications should I pursue?",
                "Review my GitHub profile",
            ],
        },
        "chatbot": {
            "reply": f"I can help with that! Here's a quick overview:\n\n- **Resume Tips**: Make sure every bullet point starts with an action verb and includes measurable impact.\n- **Interview Prep**: Practice the STAR method for behavioral questions.\n- **Skill Building**: Focus on the skills that appear most frequently in your target job descriptions.\n\nNeed more details on any of these?",
            "suggestions": [
                "Tell me more about STAR method",
                "How do I quantify my achievements?",
                "What are the top AI engineering skills?",
            ],
        },
    }
    return replies.get(session_type, replies["chatbot"])


def mock_chat_history() -> list[dict]:
    return [
        {"role": "user", "content": "What skills should I focus on for an AI Engineer role?", "timestamp": "2025-06-14T10:00:00Z"},
        {"role": "assistant", "content": "For AI Engineering, I'd prioritize: Python + PyTorch/TensorFlow, System Design for ML, MLOps (Docker, K8s, CI/CD), and cloud platforms (AWS/GCP). Would you like a detailed breakdown?", "timestamp": "2025-06-14T10:00:05Z"},
        {"role": "user", "content": "Yes, give me a week-by-week plan", "timestamp": "2025-06-14T10:01:00Z"},
        {"role": "assistant", "content": "I've created a 12-week roadmap tailored to your current skill level. Check the Learning Roadmap section for the full plan with resources!", "timestamp": "2025-06-14T10:01:05Z"},
    ]


def mock_project_recommendations(goal: str, level: str) -> list[dict]:
    return [
        {
            "id": "proj_001",
            "title": "AI-Powered Resume Analyzer",
            "description": "Build an NLP pipeline that parses resumes, extracts key entities, and scores ATS compatibility using spaCy and transformers.",
            "difficulty": "intermediate",
            "tech_stack": ["Python", "spaCy", "FastAPI", "React", "PostgreSQL"],
            "learning_outcomes": ["NLP text extraction", "REST API design", "Full-stack deployment"],
            "estimated_hours": 40,
            "career_goal": "AI Engineer",
        },
        {
            "id": "proj_002",
            "title": "Real-time Sentiment Dashboard",
            "description": "Stream Twitter/Reddit data, perform real-time sentiment analysis, and visualize trends on an interactive dashboard.",
            "difficulty": "intermediate",
            "tech_stack": ["Python", "Kafka", "TensorFlow", "D3.js", "Docker"],
            "learning_outcomes": ["Streaming data pipelines", "Sentiment classification", "Data visualization"],
            "estimated_hours": 35,
            "career_goal": "Data Engineer",
        },
        {
            "id": "proj_003",
            "title": "MLOps Pipeline with Kubernetes",
            "description": "Create an end-to-end ML pipeline with automated training, model registry, A/B testing, and monitoring using MLflow + K8s.",
            "difficulty": "advanced",
            "tech_stack": ["Python", "MLflow", "Docker", "Kubernetes", "Prometheus"],
            "learning_outcomes": ["MLOps best practices", "Container orchestration", "Model monitoring"],
            "estimated_hours": 60,
            "career_goal": "ML Engineer",
        },
        {
            "id": "proj_004",
            "title": "AI Chatbot with RAG",
            "description": "Build a retrieval-augmented generation chatbot using LangChain, vector databases, and OpenAI API for domain-specific Q&A.",
            "difficulty": "intermediate",
            "tech_stack": ["Python", "LangChain", "Pinecone", "OpenAI", "Next.js"],
            "learning_outcomes": ["RAG architecture", "Vector search", "LLM integration"],
            "estimated_hours": 30,
            "career_goal": "AI Engineer",
        },
        {
            "id": "proj_005",
            "title": "Personal Finance Tracker",
            "description": "Full-stack web app with expense tracking, budget forecasting using time series models, and interactive charts.",
            "difficulty": "beginner",
            "tech_stack": ["React", "Node.js", "PostgreSQL", "Chart.js", "Tailwind"],
            "learning_outcomes": ["Full-stack development", "Database design", "Time series basics"],
            "estimated_hours": 25,
            "career_goal": "Full-Stack Developer",
        },
        {
            "id": "proj_006",
            "title": "Computer Vision Object Counter",
            "description": "Use YOLOv8 to detect and count objects in real-time video streams. Deploy as a web service with live preview.",
            "difficulty": "advanced",
            "tech_stack": ["Python", "YOLOv8", "OpenCV", "FastAPI", "WebSocket"],
            "learning_outcomes": ["Object detection", "Real-time inference", "WebSocket streaming"],
            "estimated_hours": 45,
            "career_goal": "Computer Vision Engineer",
        },
    ]


def mock_dashboard() -> dict:
    return {
        "metrics": {
            "resume_score": 72,
            "skills_progress": 62,
            "roadmap_progress": 35,
            "interview_readiness": 74,
            "projects_completed": 3,
            "learning_streak": 12,
            "overall_readiness": 68,
        },
        "ai_tip": "Focus on completing your Deep Learning milestone this week. It's the highest-impact area for your AI Engineer goal. Try building a simple CNN classifier to solidify your understanding.",
        "recent_activity": [
            {"action": "Completed resume analysis", "time": "2 hours ago", "icon": "file"},
            {"action": "Finished ML Fundamentals milestone", "time": "1 day ago", "icon": "check"},
            {"action": "Practiced technical interview (74%)", "time": "2 days ago", "icon": "mic"},
            {"action": "Updated LinkedIn profile", "time": "3 days ago", "icon": "user"},
            {"action": "Started Docker learning module", "time": "4 days ago", "icon": "book"},
        ],
    }


def generate_mock_analysis(file_name: str, target_role: str = "Software Engineer") -> dict:
    """Dynamically generate a professional-grade resume analysis tailored to the target role."""
    char_sum = sum(ord(c) for c in file_name)
    base_score = 65 + (char_sum % 20)  # score between 65 and 85
    
    role_lower = target_role.lower()
    
    if "ai" in role_lower or "ml" in role_lower or "machine learning" in role_lower:
        missing_skills = ["MLOps", "Model Deployment", "A/B Testing", "Kubernetes", "PyTorch", "Transformers"]
        keywords_details = [
            f"Found core algorithms but missing AI-specific keywords for {target_role} role.",
            "Missing keywords: 'MLOps', 'Model Deployment', 'Transformers'."
        ]
        sug_original_1 = "Developed machine learning models for prediction tasks"
        sug_suggested_1 = "Designed and deployed ML classification models using PyTorch & FastAPI, serving live predictions to 10K+ users with 94% accuracy"
        sug_title_1 = "Add MLOps & Deployment details"
        sug_desc_1 = "Explain how you deployed the models and handled scale/performance metrics."
    elif "front" in role_lower or "react" in role_lower or "ui" in role_lower or "ux" in role_lower:
        missing_skills = ["Next.js", "TypeScript", "Tailwind CSS", "Redux", "Cypress", "Web Performance"]
        keywords_details = [
            f"Good HTML/JS keywords but missing modern frontend framework terms for {target_role} role.",
            "Missing keywords: 'Next.js', 'Tailwind CSS', 'Redux'."
        ]
        sug_original_1 = "Created web pages for clients using React"
        sug_suggested_1 = "Developed responsive Next.js web applications with Tailwind CSS, reducing page load times by 40% using server-side rendering"
        sug_title_1 = "Quantify React performance improvements"
        sug_desc_1 = "Recruiters look for optimization metrics like PageSpeed score, SEO improvements, or conversion rates."
    elif "devops" in role_lower or "cloud" in role_lower or "site reliability" in role_lower:
        missing_skills = ["Kubernetes", "Terraform", "CI/CD Pipelines", "Prometheus", "AWS/GCP", "Ansible"]
        keywords_details = [
            f"Lacks automation & orchestration vocabulary needed for {target_role} role.",
            "Missing keywords: 'Kubernetes', 'Terraform', 'CI/CD'."
        ]
        sug_original_1 = "Maintained server infrastructure and configurations"
        sug_suggested_1 = "Provisioned multi-region AWS infrastructure with Terraform, automating CI/CD pipelines via GitHub Actions, reducing deployment time by 60%"
        sug_title_1 = "Highlight Infrastructure-as-Code (IaC)"
        sug_desc_1 = "Ensure you explicitly name tools like Terraform, Ansible, or CloudFormation."
    elif "product" in role_lower or "manager" in role_lower:
        missing_skills = ["Product Roadmap", "User Research", "Agile/Scrum", "SQL", "A/B Testing", "KPI Tracking"]
        keywords_details = [
            f"Missing metrics-focused product management terms for {target_role} role.",
            "Missing keywords: 'Product Roadmap', 'A/B Testing', 'KPIs'."
        ]
        sug_original_1 = "Managed product releases and team communication"
        sug_suggested_1 = "Led agile cross-functional team of 8 to launch mobile app features, utilizing A/B testing to increase user retention by 15% and weekly active users to 50K+"
        sug_title_1 = "Quantify business and growth impact"
        sug_desc_1 = "Focus on retention, revenue, engagement metrics, or user acquisition numbers."
    else: # Software Engineer / Full Stack / Backend / Default
        missing_skills = ["Docker", "System Design", "CI/CD", "Redis", "Unit Testing", "Microservices"]
        keywords_details = [
            f"Solid coding keywords but lacks backend scale & cloud architecture terms for {target_role} role.",
            "Missing keywords: 'Docker', 'System Design', 'Redis'."
        ]
        sug_original_1 = "Wrote backend APIs and connected database tables"
        sug_suggested_1 = "Architected and optimized REST APIs with FastAPI and PostgreSQL, implementing Redis caching to reduce database query latency by 50%"
        sug_title_1 = "Add architectural scaling details"
        sug_desc_1 = "Recruiters want to see how you optimize database queries, write cache layers, or structure APIs."

    return {
        "id": f"res_{uuid.uuid4().hex[:8]}",
        "fileName": file_name,
        "atsScore": int(base_score),
        "formatting": {
            "score": int(base_score + (char_sum % 10)),
            "maxScore": 100,
            "label": "Formatting & Structure",
            "details": [
                "Clean section headers detected.",
                "Consistent font usage and layout sizing.",
                "Sufficient bullet point density in experience sections.",
                "Suggestion: increase margin padding between sections for readability."
            ]
        },
        "keywords": {
            "score": int(base_score - (char_sum % 8)),
            "maxScore": 100,
            "label": "Keywords & Skills",
            "details": keywords_details
        },
        "grammar": {
            "score": int(base_score + 5 + (char_sum % 5)),
            "maxScore": 100,
            "label": "Grammar & Style",
            "details": [
                "No major grammatical errors or spelling typos found.",
                "Consistent tense usage throughout work history sections.",
                "Strong action verb presence."
            ]
        },
        "impact": {
            "score": int(base_score - 10 + (char_sum % 12)),
            "maxScore": 100,
            "label": "Work Impact & Metrics",
            "details": [
                "Some bullet points include quantified outcomes, but room for improvement.",
                "Ensure achievements follow the X-Y-Z formula (Accomplished [X] as measured by [Y] by doing [Z])."
            ]
        },
        "suggestions": [
            {
                "id": "sug_r1",
                "category": "keywords",
                "severity": "high",
                "title": sug_title_1,
                "description": sug_desc_1,
                "original": sug_original_1,
                "suggested": sug_suggested_1
            },
            {
                "id": "sug_r2",
                "category": "impact",
                "severity": "high",
                "title": "Quantify Achievements with Metrics",
                "description": "Recruiters and ATS look for metrics (percentages, dollar amounts, time saved).",
                "original": "Improved system loading performance significantly",
                "suggested": "Optimized database index mappings and query execution plans, improving system load performance by 35%"
            },
            {
                "id": "sug_r3",
                "category": "formatting",
                "severity": "low",
                "title": "Ensure Consistent Date Formatting",
                "description": "Use a standardized date style throughout, e.g. 'MM/YYYY' or 'Month YYYY'."
            }
        ],
        "missingSkills": missing_skills,
        "createdAt": datetime.now().isoformat()
    }

