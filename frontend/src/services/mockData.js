import { PROGRAMMING_TOPICS } from '../data/freeCoursesAndCertsData';

export const FALLBACK_COURSES = [
  {
    course_id: 1,
    id: 1,
    course_name: "Machine Learning: From Theory to Production",
    title: "Machine Learning: From Theory to Production",
    code: "CS-401",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimated_duration: "6 weeks",
    learning_format: "Interactive & Video",
    description: "End-to-end machine learning engineering covering supervised/unsupervised algorithms, scikit-learn, deep neural networks, model evaluation, and deployment.",
    match_score: 96.0,
    explanation: "Directly accelerates your target career path as an AI Engineer with hands-on PyTorch and scikit-learn modules.",
    algorithm: "Hybrid AI Match",
    tags: ["python", "machine learning", "scikit-learn", "deep learning", "ai"],
    is_saved: false,
    is_enrolled: true,
    progress: 35,
    image_url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Foundations of Statistical Learning",
        lessons: [
          { title: "Lecture 1.1: Loss Functions & Gradient Descent", duration: "25 min" },
          { title: "Lecture 1.2: Regularization (L1/L2) & Bias-Variance Tradeoff", duration: "30 min" },
          { title: "Lecture 1.3: Decision Trees & Random Forests", duration: "40 min" }
        ]
      },
      {
        title: "Module 2: Deep Learning & Neural Architectures",
        lessons: [
          { title: "Lecture 2.1: Multi-Layer Perceptrons & Backprop", duration: "45 min" },
          { title: "Lecture 2.2: Convolutional Networks & Vision", duration: "50 min" },
          { title: "Lecture 2.3: Attention Mechanisms & Transformers", duration: "60 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "StatQuest with Josh Starmer - Machine Learning Playlist",
        url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
        author: "StatQuest",
        badge: "Playlist",
        description: "Visual, intuitive step-by-step breakdowns of Decision Trees, PCA, SVMs, and Neural Networks."
      },
      {
        type: "youtube",
        title: "Andrej Karpathy - Neural Networks: Zero to Hero",
        url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
        author: "Andrej Karpathy",
        badge: "Course Series",
        description: "Build backpropagation engines (micrograd), language models (makemore), and GPT transformers from scratch in pure Python."
      },
      {
        type: "youtube",
        title: "3Blue1Brown - Essence of Neural Networks & Linear Algebra",
        url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
        author: "3Blue1Brown",
        badge: "Visual Series",
        description: "Geometric visual intuition for weight matrices, backpropagation gradients, and deep representations."
      },
      {
        type: "youtube",
        title: "freeCodeCamp - Machine Learning with Python Course",
        url: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Hands-on implementation of regression, classification, clustering, and TensorFlow basics."
      },
      {
        type: "docs",
        title: "Scikit-Learn Official User Guide & API Reference",
        url: "https://scikit-learn.org/stable/user_guide.html",
        provider: "Scikit-Learn Developers",
        badge: "Official Docs",
        description: "Comprehensive documentation for supervised/unsupervised estimators, cross-validation, and pipelines."
      },
      {
        type: "docs",
        title: "PyTorch Official Tutorials & Deep Learning Recipes",
        url: "https://pytorch.org/tutorials/",
        provider: "PyTorch Foundation",
        badge: "Official Docs",
        description: "End-to-end PyTorch guides from autograd basics to distributed model training and quantization."
      }
    ]
  },
  {
    course_id: 2,
    id: 2,
    course_name: "Advanced Data Structures & Algorithms",
    title: "Advanced Data Structures & Algorithms",
    code: "CS-302",
    category: "Core CS",
    difficulty: "Advanced",
    estimated_duration: "8 weeks",
    learning_format: "Interactive Coding & Problem Sets",
    description: "Deep dive into dynamic programming, graph algorithms (Dijkstra, Tarjan), balanced search trees, trie structures, and amortized complexity.",
    match_score: 92.0,
    explanation: "Fulfills core technical interview requirements and strengthens your problem-solving foundations.",
    algorithm: "Collaborative & Content",
    tags: ["dsa", "algorithms", "data structures", "graphs", "dynamic programming"],
    is_saved: true,
    is_enrolled: true,
    progress: 60,
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Complex Graph Algorithms",
        lessons: [
          { title: "Lecture 1.1: Shortest Paths & Minimum Spanning Trees", duration: "35 min" },
          { title: "Lecture 1.2: Topological Sort & Strongly Connected Components", duration: "40 min" }
        ]
      },
      {
        title: "Module 2: Dynamic Programming & State Machines",
        lessons: [
          { title: "Lecture 2.1: Memoization vs Tabulation Patterns", duration: "45 min" },
          { title: "Lecture 2.2: 2D Dynamic Programming & Interval DP", duration: "50 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "NeetCode - Complete DSA Roadmaps & LeetCode Explanations",
        url: "https://www.youtube.com/@NeetCode",
        author: "NeetCode",
        badge: "Channel",
        description: "Intuitive, clean whiteboard breakdowns of the Blind 75 and NeetCode 150 algorithms."
      },
      {
        type: "youtube",
        title: "Abdul Bari - Algorithms Mastery Playlist",
        url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
        author: "Abdul Bari",
        badge: "Playlist",
        description: "The gold standard whiteboard lectures on Divide & Conquer, Greedy, Dynamic Programming, and Graph Traversals."
      },
      {
        type: "youtube",
        title: "freeCodeCamp - 8-Hour Data Structures & Algorithms",
        url: "https://www.youtube.com/watch?v=8hly31xKli0",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Comprehensive foundational walkthrough of arrays, linked lists, trees, graphs, and Big-O notation."
      }
    ]
  },
  {
    course_id: 3,
    id: 3,
    course_name: "Modern Full-Stack Web Architecture (React & FastAPI)",
    title: "Modern Full-Stack Web Architecture (React & FastAPI)",
    code: "CS-308",
    category: "Web Development",
    difficulty: "Intermediate",
    estimated_duration: "5 weeks",
    learning_format: "Project-Based & Live Labs",
    description: "Build reactive full-stack web applications using React 19, Tailwind CSS, Vite, FastAPI REST endpoints, and asynchronous relational databases.",
    match_score: 89.0,
    explanation: "Complements your Python background with production modern frontend and API engineering skills.",
    algorithm: "Content-Based",
    tags: ["react", "fastapi", "python", "javascript", "tailwind", "vite"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: React Component Lifecycle & State",
        lessons: [
          { title: "Lecture 1.1: Modern React Hooks & Context", duration: "30 min" },
          { title: "Lecture 1.2: Asynchronous State & React Router 7", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Full Stack Web Development for Beginners",
        url: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Hands-on project building responsive frontend interfaces connected to asynchronous backend services."
      }
    ]
  },
  {
    course_id: 4,
    id: 4,
    course_name: "Cloud Computing, Microservices & DevOps",
    title: "Cloud Computing, Microservices & DevOps",
    code: "CS-415",
    category: "Cloud & DevOps",
    difficulty: "Intermediate",
    estimated_duration: "6 weeks",
    learning_format: "Hands-on Sandbox",
    description: "Containerization with Docker, Kubernetes orchestration, CI/CD pipelines, AWS fundamentals, and microservices architecture.",
    match_score: 85.0,
    explanation: "Essential for scaling AI models and web services to thousands of concurrent users.",
    algorithm: "KNN Recommender",
    tags: ["docker", "kubernetes", "aws", "devops", "cloud"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Docker Containers & Virtualization",
        lessons: [
          { title: "Lecture 1.1: Dockerfile Optimization & Multi-Stage Builds", duration: "30 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - DevOps Engineering Course for Beginners",
        url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "End-to-end DevOps automation, Docker containers, Linux administration, and CI/CD pipelines."
      }
    ]
  }
];

export const FALLBACK_ELECTIVES = [
  {
    course_id: 101,
    id: 101,
    course_name: "Generative AI & Large Language Models (LLMs)",
    code: "CS-505",
    category: "AI & ML",
    difficulty: "Advanced",
    credits: 4,
    match_score: 95.0,
    career_relevance: "Directly aligns with AI Engineer and LLM Architect career pathways",
    prerequisites: ["Python Programming", "Machine Learning Fundamentals"],
    tags: ["LLMs", "RAG", "Transformers", "Prompt Engineering"],
    is_saved: false,
    description: "Hands-on engineering course covering transformer architectures, Retrieval-Augmented Generation (RAG), parameter-efficient fine-tuning (LoRA), and high-throughput serving.",
    free_resources: [
      {
        type: "youtube",
        title: "Andrej Karpathy - Let's build GPT: from scratch, in code",
        url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
        author: "Andrej Karpathy",
        badge: "Deep Dive",
        description: "Build a nanoGPT character-level transformer from scratch with PyTorch."
      }
    ]
  },
  {
    course_id: 102,
    id: 102,
    course_name: "Distributed Systems & Scalable Database Architecture",
    code: "CS-512",
    category: "Cloud & DevOps",
    difficulty: "Advanced",
    credits: 4,
    match_score: 91.0,
    career_relevance: "Crucial for Backend Architects & Distributed Systems Engineers",
    prerequisites: ["Data Structures & Algorithms", "Database Systems & SQL"],
    tags: ["Distributed Systems", "Raft", "Sharding", "Consensus"],
    is_saved: false,
    description: "Master CAP theorem, consensus protocols (Raft, Paxos), horizontal sharding, event-driven streaming with Kafka, and high availability systems.",
    free_resources: [
      {
        type: "youtube",
        title: "MIT 6.824: Distributed Systems Lectures",
        url: "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
        author: "MIT OpenCourseWare",
        badge: "University Series",
        description: "Full MIT course on distributed storage, fault tolerance, and consensus."
      }
    ]
  },
  {
    course_id: 103,
    id: 103,
    course_name: "Cybersecurity, Cryptography & Network Defense",
    code: "CS-420",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    credits: 3,
    match_score: 87.0,
    career_relevance: "Industry standard for Cybersecurity Specialists & Security Analysts",
    prerequisites: ["Computer Networks", "Operating Systems"],
    tags: ["Cybersecurity", "Zero Trust", "Penetration Testing", "Cryptography"],
    is_saved: false,
    description: "Covers public key cryptography, zero-trust network models, penetration testing methodologies, vulnerability assessments, and secure coding standards.",
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Certified Ethical Hacker (CEH) Course",
        url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        author: "freeCodeCamp.org",
        badge: "Certification Prep",
        description: "Full network defense and ethical hacking foundation walkthrough."
      }
    ]
  },
  {
    course_id: 104,
    id: 104,
    course_name: "High-Performance Data Engineering with Apache Spark & Kafka",
    code: "CS-440",
    category: "Data Science",
    difficulty: "Advanced",
    credits: 4,
    match_score: 89.0,
    career_relevance: "Essential for Big Data Engineers & Data Pipeline Architects",
    prerequisites: ["Python Programming", "Database Systems & SQL"],
    tags: ["Spark", "Kafka", "Data Lakehouse", "ETL Pipelines"],
    is_saved: false,
    description: "Design real-time streaming pipelines, batch processing with PySpark, Delta Lake table formats, and automated DAG scheduling with Apache Airflow.",
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Data Engineering Course for Beginners",
        url: "https://www.youtube.com/watch?v=qWru-b6m030",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Build streaming ETL pipelines with modern data engineering stack."
      }
    ]
  }
];

export const FALLBACK_PROFILE = {
  user_id: 1,
  education_level: "Undergraduate",
  branch_major: "Computer Science & Engineering",
  learning_speed: "Balanced",
  preferred_content_type: "Interactive & Video",
  average_study_hours: 3.5,
  weekly_target_hours: 20,
  strong_subjects: ["Python Programming", "Machine Learning Fundamentals", "Full Stack Web Development"],
  weak_subjects: ["Data Structures & Algorithms"],
  career_interests: ["AI Engineer", "Full Stack Developer"],
  learning_efficiency_score: 84.5,
  study_method_style: "Video -> Practice -> Quiz -> Revision",
  onboarding_completed: true
};

export const FALLBACK_ANALYTICS = {
  total_study_hours: 28.5,
  weekly_study_hours: 14.5,
  target_study_hours: 20.0,
  study_streak_days: 7,
  completion_rate: 76.0,
  course_completion_rate: 76.0,
  average_quiz_score: 88.0,
  quiz_average_score: 88.0,
  total_quizzes_taken: 12,
  quizzes_taken_count: 12,
  learning_efficiency_score: 84.5,
  active_courses_count: 3,
  enrolled_courses_count: 3,
  completed_courses_count: 2,
  study_hours_trend: [
    { day: "Mon", hours: 3.2, target: 3.0 },
    { day: "Tue", hours: 2.8, target: 3.0 },
    { day: "Wed", hours: 4.1, target: 3.0 },
    { day: "Thu", hours: 2.5, target: 3.0 },
    { day: "Fri", hours: 3.8, target: 3.0 },
    { day: "Sat", hours: 4.5, target: 3.0 },
    { day: "Sun", hours: 3.0, target: 3.0 }
  ],
  quiz_score_trend: [
    { date: "Sep 05", quiz: "Python Fundamentals", score: 85.0 },
    { date: "Sep 08", quiz: "Control Flow & OOP", score: 90.0 },
    { date: "Sep 11", quiz: "Linear Algebra & Stats", score: 78.0 },
    { date: "Sep 14", quiz: "Data Structures & Time Comp", score: 80.0 },
    { date: "Sep 17", quiz: "Machine Learning Foundations", score: 100.0 }
  ],
  subject_mastery: [
    { subject: "Python & AI", score: 94, fullMark: 100 },
    { subject: "DSA", score: 78, fullMark: 100 },
    { subject: "SQL / DB", score: 85, fullMark: 100 },
    { subject: "Web Dev", score: 90, fullMark: 100 },
    { subject: "Cloud & DevOps", score: 75, fullMark: 100 },
    { subject: "System Design", score: 82, fullMark: 100 }
  ],
  strong_subjects: ["Python & AI Engineering", "Database Systems (SQL)", "Full-Stack Web Dev"],
  weak_subjects: ["Advanced Graph Algorithms", "Distributed Systems Sharding"],
  daily_breakdown: [
    { day: "Mon", hours: 3.2 },
    { day: "Tue", hours: 2.8 },
    { day: "Wed", hours: 4.1 },
    { day: "Thu", hours: 2.5 },
    { day: "Fri", hours: 3.8 },
    { day: "Sat", hours: 4.5 },
    { day: "Sun", hours: 3.0 }
  ]
};

export const FALLBACK_QUIZZES = [
  {
    id: 1,
    course_id: 1,
    title: "Machine Learning Fundamentals & Scikit-Learn Diagnostic",
    description: "Test your mastery of gradient descent, bias-variance tradeoff, cross-validation, and classification metrics.",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    total_questions: 5,
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: "Which of the following techniques is specifically designed to reduce high variance (overfitting) in deep models?",
        options: ["L2 Regularization (Weight Decay)", "Increasing model parameters", "Removing training data", "Decreasing learning rate only"],
        correct_index: 0,
        explanation: "L2 regularization penalizes large weights, constraining model complexity and reducing variance."
      },
      {
        id: 2,
        question_text: "What does the Bias-Variance tradeoff dictate when a model is overly simplistic?",
        options: ["High Bias (Underfitting)", "High Variance (Overfitting)", "Zero Loss", "Infinite Precision"],
        correct_index: 0,
        explanation: "Overly simplistic models suffer from High Bias because they cannot capture the underlying structure of the data."
      },
      {
        id: 3,
        question_text: "In gradient descent optimization, what is the role of the learning rate parameter η?",
        options: ["Controls the step size taken in the direction of the negative gradient", "Computes the exact inverse Hessian matrix", "Determines the number of hidden layers", "Acts as the regularization loss weight"],
        correct_index: 0,
        explanation: "The learning rate scales the magnitude of parameter updates along the gradient surface."
      },
      {
        id: 4,
        question_text: "Which metric is most critical when evaluating a medical diagnostic model where false negatives are dangerous?",
        options: ["Recall (Sensitivity)", "Precision", "Accuracy alone", "Specificity"],
        correct_index: 0,
        explanation: "Recall minimizes false negatives by capturing all true positive cases."
      },
      {
        id: 5,
        question_text: "What is the primary benefit of K-Fold Cross Validation?",
        options: ["Provides an unbiased estimate of model generalization performance across all subsets", "Speeds up model training time by 10x", "Eliminates the need for validation data completely", "Guarantees 100% test accuracy"],
        correct_index: 0,
        explanation: "K-Fold evaluates model performance across k different splits, preventing split bias."
      }
    ]
  },
  {
    id: 2,
    course_id: 2,
    title: "Data Structures & Time Complexity Diagnostic",
    description: "Test your understanding of Big-O notations, tree balancing, and hash collision strategies.",
    difficulty: "Advanced",
    time_limit_minutes: 20,
    total_questions: 5,
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: "What is the average time complexity of searching in a balanced AVL or Red-Black Binary Search Tree?",
        options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
        correct_index: 0,
        explanation: "Balanced binary search trees maintain height at O(log N), guaranteeing logarithmic search time."
      },
      {
        id: 2,
        question_text: "Which algorithm finds the single-source shortest path on a weighted graph with non-negative edge weights in O((V + E) log V) time?",
        options: ["Dijkstra's Algorithm with Min-Heap", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Breadth-First Search (BFS)"],
        correct_index: 0,
        explanation: "Dijkstra with a priority queue min-heap achieves O((V+E) log V) time complexity."
      },
      {
        id: 3,
        question_text: "What is the worst-case time complexity of QuickSort when pivot selection is consistently poor (e.g. smallest element)?",
        options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"],
        correct_index: 0,
        explanation: "Poor pivot selection degrades QuickSort recursion depth to O(N), resulting in O(N^2) quadratic time."
      },
      {
        id: 4,
        question_text: "How does Dynamic Programming optimize recursive problems with overlapping subproblems?",
        options: ["By memoizing (caching) previously calculated subproblem results to avoid redundant work", "By running parallel threads on the CPU", "By converting recursion into random permutations", "By reducing space complexity to O(1) in all cases"],
        correct_index: 0,
        explanation: "Memoization and tabulation store subproblem solutions, converting exponential time into polynomial time."
      },
      {
        id: 5,
        question_text: "Which data structure is ideal for implementing LRU (Least Recently Used) Cache with O(1) get and put operations?",
        options: ["Hash Map + Doubly Linked List", "Binary Search Tree + Stack", "Array + Queue", "Single Linked List alone"],
        correct_index: 0,
        explanation: "A Hash Map provides O(1) key lookups while a Doubly Linked List provides O(1) node removal and insertion."
      }
    ]
  },
  {
    id: 3,
    course_id: 3,
    title: "SQL & Database Systems Diagnostic",
    description: "Assess your mastery of ACID properties, indexing mechanisms, JOINs, and query optimization.",
    difficulty: "Intermediate",
    time_limit_minutes: 15,
    total_questions: 5,
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: "Which ACID property ensures that committed transactions remain permanent even after a power crash?",
        options: ["Durability", "Atomicity", "Consistency", "Isolation"],
        correct_index: 0,
        explanation: "Durability guarantees that committed state changes are safely recorded to non-volatile storage (write-ahead log)."
      },
      {
        id: 2,
        question_text: "What is the difference between WHERE and HAVING clauses in SQL?",
        options: ["WHERE filters rows before aggregation; HAVING filters aggregated group results", "HAVING cannot be used with GROUP BY", "WHERE only works on strings, HAVING on numbers", "There is no functional difference"],
        correct_index: 0,
        explanation: "WHERE filters candidate rows before grouping, whereas HAVING filters aggregate calculations like COUNT or AVG."
      },
      {
        id: 3,
        question_text: "Which index structure is the standard for range queries (e.g. BETWEEN 10 AND 50) in relational databases like PostgreSQL and MySQL?",
        options: ["B-Tree Index", "Hash Index", "Bitmap Index", "Full-Text Index"],
        correct_index: 0,
        explanation: "B-Tree indexes store sorted leaf node chains, enabling efficient range scans and binary search lookups."
      },
      {
        id: 4,
        question_text: "What does 3NF (Third Normal Form) require in relational database design?",
        options: ["Every non-prime attribute must depend directly on the primary key, eliminating transitive dependencies", "All tables must have exactly three columns", "Tables cannot have foreign keys", "Data must be stored in duplicate rows for redundancy"],
        correct_index: 0,
        explanation: "3NF eliminates transitive dependencies (if A -> B and B -> C, then C should be in its own entity)."
      },
      {
        id: 5,
        question_text: "Which JOIN type returns all records from the left table and only matched records from the right table?",
        options: ["LEFT OUTER JOIN", "INNER JOIN", "FULL OUTER JOIN", "CROSS JOIN"],
        correct_index: 0,
        explanation: "LEFT JOIN preserves all rows from the primary left relation, filling unmatched right fields with NULL."
      }
    ]
  }
];

export const FALLBACK_QUIZ_HISTORY = [
  {
    id: 1,
    quiz_id: 1,
    quiz_title: "Machine Learning Fundamentals & Scikit-Learn Diagnostic",
    score_percentage: 100.0,
    passed: true,
    total_questions: 5,
    correct_count: 5,
    time_spent_seconds: 240,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    quiz_id: 2,
    quiz_title: "Data Structures & Time Complexity Diagnostic",
    score_percentage: 80.0,
    passed: true,
    total_questions: 5,
    correct_count: 4,
    time_spent_seconds: 360,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export const FALLBACK_NOTIFICATIONS = [
  {
    id: 1,
    type: "study_reminder",
    title: "Upcoming Study Session: ML Foundations",
    message: "You have a scheduled 45-minute practice session on Neural Architectures at 18:00 today.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    is_read: false,
    action_url: "/study-plan"
  },
  {
    id: 2,
    type: "quiz_alert",
    title: "Diagnostic Assessment Passed! 🎉",
    message: "Congratulations! You scored 100% on Machine Learning Fundamentals & Scikit-Learn Diagnostic.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_read: false,
    action_url: "/quizzes"
  },
  {
    id: 3,
    type: "recommendation",
    title: "New Elective Recommendation Available",
    message: "Generative AI & LLMs (CS-505) has a 95% match with your AI Engineer career pathway.",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    is_read: true,
    action_url: "/electives"
  },
  {
    id: 4,
    type: "progress_summary",
    title: "Weekly Learning Milestone Reached",
    message: "You have completed 14.5 hours of focused study this week. Keep up the momentum!",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    is_read: true,
    action_url: "/analytics"
  }
];

export const FALLBACK_STUDY_METHOD = {
  recommended_pipeline: "Video Lecture ➔ Guided Practice ➔ Checkpoint Quiz ➔ Spaced Summary",
  why_selected: "Optimized for multimodal learners. Research shows 15-20 min video chunks followed by active hands-on coding and micro-quizzing boosts 30-day recall by up to 42%.",
  suitable_session_length: 45,
  preferred_content_type: "Interactive & Practice",
  learning_speed: "Balanced",
  expected_retention_boost: "+42% Conceptual Mastery",
  steps: [
    {
      step_number: 1,
      name: "Concept Priming & Video Lecture",
      duration_minutes: 18,
      icon: "Video",
      description: "Watch structured, bite-sized conceptual lessons with active note-taking.",
      tips: "Pause at core definitions and write code syntax in your own words."
    },
    {
      step_number: 2,
      name: "Guided Hands-on Practice",
      duration_minutes: 14,
      icon: "Code",
      description: "Implement the newly learned concepts on sandboxes and coding challenges.",
      tips: "Solve the problem from scratch without looking at the reference solution first."
    },
    {
      step_number: 3,
      name: "Micro-Quiz & Diagnostics",
      duration_minutes: 8,
      icon: "HelpCircle",
      description: "Take a fast 5-question timed quiz to measure active neural retrieval.",
      tips: "Review explanations immediately for any hesitant or incorrect answers."
    },
    {
      step_number: 4,
      name: "Spaced Summary & Flashcard",
      duration_minutes: 5,
      icon: "RotateCcw",
      description: "Condense the core takeaways into a reusable formula or cheat-sheet snippet.",
      tips: "Schedule your next review within 48 hours for long-term consolidation."
    }
  ]
};
