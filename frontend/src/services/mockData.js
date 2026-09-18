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
  study_streak_days: 7,
  completion_rate: 76.0,
  average_quiz_score: 88.0,
  total_quizzes_taken: 12,
  learning_efficiency_score: 84.5,
  active_courses_count: 3,
  daily_breakdown: [
    { day: "Mon", hours: 3.0 },
    { day: "Tue", hours: 2.5 },
    { day: "Wed", hours: 3.5 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 3.0 },
    { day: "Sat", hours: 4.0 },
    { day: "Sun", hours: 2.5 }
  ]
};

export const FALLBACK_STUDY_PLAN = {
  weekly_target_hours: 20,
  total_scheduled_hours: 18.5,
  sessions: [
    {
      id: 1,
      title: "Machine Learning Foundations",
      subject: "AI & ML",
      day_of_week: "Monday",
      start_time: "09:00",
      end_time: "10:30",
      session_type: "Video",
      is_completed: true,
      notes: "Watch StatQuest gradient descent video lecture."
    },
    {
      id: 2,
      title: "LeetCode Practice: Graph BFS/DFS",
      subject: "Data Structures",
      day_of_week: "Monday",
      start_time: "17:00",
      end_time: "18:30",
      session_type: "Practice",
      is_completed: false,
      notes: "Solve 3 graph traversal problems on sandbox."
    },
    {
      id: 3,
      title: "Neural Networks Backpropagation",
      subject: "AI & ML",
      day_of_week: "Tuesday",
      start_time: "10:00",
      end_time: "11:30",
      session_type: "Video",
      is_completed: false,
      notes: "Karpathy micrograd walkthrough."
    },
    {
      id: 4,
      title: "Full-Stack API Integration Lab",
      subject: "Web Development",
      day_of_week: "Wednesday",
      start_time: "15:00",
      end_time: "16:30",
      session_type: "Practice",
      is_completed: false,
      notes: "Connect React frontend to FastAPI endpoints."
    },
    {
      id: 5,
      title: "Module Diagnostic Assessment",
      subject: "Computer Science",
      day_of_week: "Friday",
      start_time: "18:00",
      end_time: "19:00",
      session_type: "Quiz",
      is_completed: false,
      notes: "Timed 15-minute diagnostic quiz on algorithms."
    }
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
    questions: [
      {
        id: 1,
        question_text: "What is the average time complexity of searching in a balanced AVL or Red-Black Binary Search Tree?",
        options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
        correct_index: 0,
        explanation: "Balanced binary search trees maintain height at O(log N), guaranteeing logarithmic search time."
      }
    ]
  }
];
