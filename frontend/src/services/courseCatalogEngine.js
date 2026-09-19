/**
 * StudyPath Comprehensive Course Catalog & Dynamic Personalization Engine
 * Covers all programming languages (Python, Java, C, C++, Rust, Go, JS/TS)
 * and levels (Beginner, Intermediate, Advanced) across all career streams.
 */

import { getStoredProfile } from './studyPlanEngine';

export const MASTER_COURSES_CATALOG = [
  // ==========================================
  // PYTHON TRACKS (Beginner -> Advanced)
  // ==========================================
  {
    course_id: 1,
    id: 1,
    title: "Python Foundations: Zero to Hero Bootcamp",
    course_name: "Python Foundations: Zero to Hero Bootcamp",
    code: "PY-101",
    language: "Python",
    category: "Core CS",
    difficulty: "Beginner",
    estimated_duration: "4 weeks",
    learning_format: "Interactive Coding & Video",
    career_stream: "All Streams",
    description: "Master Python programming from the ground up: variables, conditionals, loops, functions, lists, dictionaries, OOP, and file handling.",
    match_score: 98.0,
    explanation: "Perfect starting foundation for beginners to build fundamental coding and problem-solving confidence.",
    algorithm: "Beginner Diagnostic Match",
    tags: ["python", "beginner", "oop", "functions", "core cs"],
    is_saved: false,
    is_enrolled: true,
    progress: 40,
    image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Python Basics & Data Structures",
        lessons: [
          { title: "Lesson 1.1: Variables, Types & Control Flow", duration: "25 min" },
          { title: "Lesson 1.2: Lists, Tuples, Dictionaries & Sets", duration: "30 min" },
          { title: "Lesson 1.3: Functions, Scope & Modules", duration: "35 min" }
        ]
      },
      {
        title: "Module 2: OOP & File Operations",
        lessons: [
          { title: "Lesson 2.1: Classes, Objects & Methods", duration: "30 min" },
          { title: "Lesson 2.2: Inheritance & Encapsulation", duration: "35 min" },
          { title: "Lesson 2.3: File I/O & Exception Handling", duration: "30 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Python for Beginners Full Course",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "6-hour structured video walkthrough with coding exercises."
      },
      {
        type: "docs",
        title: "Python 3 Official Tutorial for Beginners",
        url: "https://docs.python.org/3/tutorial/index.html",
        provider: "Python Software Foundation",
        badge: "Official Docs",
        description: "Official guide covering language syntax and built-in library."
      }
    ]
  },
  {
    course_id: 2,
    id: 2,
    title: "Applied Data Structures & Algorithms in Python",
    course_name: "Applied Data Structures & Algorithms in Python",
    code: "CS-201",
    language: "Python",
    category: "Core CS",
    difficulty: "Intermediate",
    estimated_duration: "6 weeks",
    learning_format: "Problem Sets & Sandbox",
    career_stream: "All Streams",
    description: "Master Big-O analysis, linked lists, stacks, queues, binary search trees, hash tables, and recursive divide-and-conquer algorithms in Python.",
    match_score: 93.0,
    explanation: "Strengthens algorithmic problem solving and prepares for technical coding assessments.",
    algorithm: "Content & Collaborative Match",
    tags: ["python", "dsa", "algorithms", "data structures", "trees"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Linear Data Structures & Complexity",
        lessons: [
          { title: "Lesson 1.1: Big-O Time & Space Analysis", duration: "25 min" },
          { title: "Lesson 1.2: Dynamic Arrays & Linked Lists", duration: "35 min" },
          { title: "Lesson 1.3: Stacks & Queues Applications", duration: "30 min" }
        ]
      },
      {
        title: "Module 2: Trees, Graphs & Dynamic Programming",
        lessons: [
          { title: "Lesson 2.1: Binary Search Trees & AVL", duration: "40 min" },
          { title: "Lesson 2.2: Graph BFS/DFS & Dijkstra", duration: "45 min" },
          { title: "Lesson 2.3: Dynamic Programming Memoization", duration: "50 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Algorithms and Data Structures Full Course",
        url: "https://www.youtube.com/watch?v=8hly31xKli0",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Visual walkthrough of arrays, linked lists, trees, and Big-O notation."
      }
    ]
  },
  {
    course_id: 3,
    id: 3,
    title: "Machine Learning: From Theory to Production",
    course_name: "Machine Learning: From Theory to Production",
    code: "CS-401",
    language: "Python",
    category: "AI & ML",
    difficulty: "Intermediate",
    estimated_duration: "6 weeks",
    learning_format: "Interactive & Video",
    career_stream: "AI Engineer",
    description: "End-to-end machine learning engineering covering supervised/unsupervised algorithms, scikit-learn, deep neural networks, and model deployment.",
    match_score: 96.0,
    explanation: "Directly accelerates AI Engineer career pathway with hands-on Scikit-Learn and PyTorch modules.",
    algorithm: "Hybrid AI Match",
    tags: ["python", "machine learning", "scikit-learn", "ai", "deep learning"],
    is_saved: false,
    is_enrolled: true,
    progress: 35,
    image_url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Statistical Learning & Scikit-Learn",
        lessons: [
          { title: "Lesson 1.1: Loss Functions & Gradient Descent", duration: "25 min" },
          { title: "Lesson 1.2: Regularization (L1/L2) & Bias-Variance", duration: "30 min" },
          { title: "Lesson 1.3: Decision Trees & Random Forests", duration: "40 min" }
        ]
      },
      {
        title: "Module 2: Deep Learning Foundations",
        lessons: [
          { title: "Lesson 2.1: Multi-Layer Perceptrons & PyTorch", duration: "45 min" },
          { title: "Lesson 2.2: Convolutional Vision Networks", duration: "50 min" },
          { title: "Lesson 2.3: Attention & Transformers", duration: "60 min" }
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
        description: "Visual, intuitive step-by-step breakdowns of ML algorithms."
      },
      {
        type: "youtube",
        title: "Andrej Karpathy - Neural Networks: Zero to Hero",
        url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
        author: "Andrej Karpathy",
        badge: "Course Series",
        description: "Build micrograd and transformer language models from scratch in Python."
      }
    ]
  },

  // ==========================================
  // JAVA TRACKS (Beginner -> Advanced)
  // ==========================================
  {
    course_id: 11,
    id: 11,
    title: "Java Programming Masterclass: From Beginner to Pro",
    course_name: "Java Programming Masterclass: From Beginner to Pro",
    code: "JAVA-101",
    language: "Java",
    category: "Core CS",
    difficulty: "Beginner",
    estimated_duration: "5 weeks",
    learning_format: "Interactive Coding & Sandbox",
    career_stream: "Backend Systems Engineer",
    description: "Comprehensive beginner Java course covering JVM architecture, primitive types, OOP principles, collections framework, exception handling, and Java 21 features.",
    match_score: 97.0,
    explanation: "Perfect starting foundation for students choosing Java for software engineering and enterprise backend systems.",
    algorithm: "Language Preference Match",
    tags: ["java", "jvm", "oop", "collections", "beginner", "backend"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Java Basics & OOP Architecture",
        lessons: [
          { title: "Lesson 1.1: JVM, JDK, Bytecode & Variables", duration: "25 min" },
          { title: "Lesson 1.2: Classes, Constructors & Encapsulation", duration: "30 min" },
          { title: "Lesson 1.3: Polymorphism, Interfaces & Abstract Classes", duration: "35 min" }
        ]
      },
      {
        title: "Module 2: Java Collections Framework & Generics",
        lessons: [
          { title: "Lesson 2.1: ArrayList, LinkedList & List Iterators", duration: "30 min" },
          { title: "Lesson 2.2: HashMap, HashSet & TreeSets", duration: "35 min" },
          { title: "Lesson 2.3: Generics & Exception Handling", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Java Programming for Beginners",
        url: "https://www.youtube.com/watch?v=A74TOX803D0",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "9-hour full Java tutorial covering core syntax, OOP, and collections."
      },
      {
        type: "docs",
        title: "Oracle Official Java Documentation & Tutorial",
        url: "https://docs.oracle.com/javase/tutorial/",
        provider: "Oracle Corporation",
        badge: "Official Docs",
        description: "Official learning trail for Java Standard Edition."
      }
    ]
  },
  {
    course_id: 12,
    id: 12,
    title: "Enterprise Backend Architecture with Spring Boot & Java",
    course_name: "Enterprise Backend Architecture with Spring Boot & Java",
    code: "JAVA-301",
    language: "Java",
    category: "Web Development",
    difficulty: "Intermediate",
    estimated_duration: "6 weeks",
    learning_format: "Project-Based & REST APIs",
    career_stream: "Backend Systems Engineer",
    description: "Build robust enterprise REST microservices with Spring Boot 3, Spring Data JPA, Hibernate, PostgreSQL, JWT security, and Docker containers.",
    match_score: 92.0,
    explanation: "Essential for Java backend developers building scalable enterprise services and microservice architectures.",
    algorithm: "Career Goal Match",
    tags: ["java", "spring boot", "jpa", "hibernate", "rest api", "microservices"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Spring Boot Fundamentals & REST Controllers",
        lessons: [
          { title: "Lesson 1.1: Dependency Injection & ApplicationContext", duration: "30 min" },
          { title: "Lesson 1.2: Building REST Endpoints with Validation", duration: "35 min" }
        ]
      },
      {
        title: "Module 2: Spring Data JPA & Database Persistence",
        lessons: [
          { title: "Lesson 2.1: Entities, Repositories & Relationships", duration: "40 min" },
          { title: "Lesson 2.2: Spring Security & JWT Token Auth", duration: "45 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Spring Boot 3 Full Course",
        url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Complete hands-on Spring Boot 3 REST API development."
      },
      {
        type: "docs",
        title: "Spring Framework Official Reference Documentation",
        url: "https://spring.io/guides",
        provider: "Spring by VMware",
        badge: "Official Docs",
        description: "Comprehensive official getting started guides."
      }
    ]
  },

  // ==========================================
  // C / C++ TRACKS (Beginner -> Advanced)
  // ==========================================
  {
    course_id: 21,
    id: 21,
    title: "C & C++ Programming: Memory, Pointers & STL",
    course_name: "C & C++ Programming: Memory, Pointers & STL",
    code: "CPP-101",
    language: "C++",
    category: "Core CS",
    difficulty: "Beginner",
    estimated_duration: "5 weeks",
    learning_format: "Systems Sandbox & Video",
    career_stream: "Backend Systems Engineer",
    description: "Deep dive into low-level systems programming: pointers, manual memory allocation (malloc/free, new/delete), references, modern C++20 features, and STL containers.",
    match_score: 96.0,
    explanation: "Master the foundation of operating systems, game engines, and performance-critical systems.",
    algorithm: "Language Preference Match",
    tags: ["c", "c++", "pointers", "memory", "stl", "beginner", "systems"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: C Syntax, Pointers & Memory Layout",
        lessons: [
          { title: "Lesson 1.1: Stack vs Heap & Pointer Arithmetic", duration: "30 min" },
          { title: "Lesson 1.2: Structures, Unions & Dynamic Allocation", duration: "35 min" }
        ]
      },
      {
        title: "Module 2: Modern C++ Classes, RAII & STL",
        lessons: [
          { title: "Lesson 2.1: Constructors, Destructors & Smart Pointers", duration: "40 min" },
          { title: "Lesson 2.2: STL Vectors, Maps & Algorithms", duration: "45 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - C++ Tutorial for Beginners",
        url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Comprehensive 4-hour introduction to C++ syntax and pointers."
      },
      {
        type: "docs",
        title: "cppreference.com - Complete C++ Language & STL Reference",
        url: "https://en.cppreference.com/w/",
        provider: "C++ Community",
        badge: "Official Reference",
        description: "The authoritative reference for C and C++ standard libraries."
      }
    ]
  },

  // ==========================================
  // RUST & GO TRACKS (Beginner -> Advanced)
  // ==========================================
  {
    course_id: 31,
    id: 31,
    title: "Rust Fundamentals: Memory Safety, Ownership & Concurrency",
    course_name: "Rust Fundamentals: Memory Safety, Ownership & Concurrency",
    code: "RUST-101",
    language: "Rust",
    category: "Core CS",
    difficulty: "Beginner",
    estimated_duration: "5 weeks",
    learning_format: "Interactive Code & Compiler Diagnostics",
    career_stream: "Backend Systems Engineer",
    description: "Learn Rust without fear: understand the Borrow Checker, ownership, lifetimes, pattern matching, error handling (Result/Option), and fearless concurrency.",
    match_score: 95.0,
    explanation: "Master modern memory-safe systems programming used in cloud infrastructure, WebAssembly, and high-performance services.",
    algorithm: "Modern Systems Match",
    tags: ["rust", "ownership", "borrow checker", "systems", "concurrency", "beginner"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Ownership, Borrowing & Lifetimes",
        lessons: [
          { title: "Lesson 1.1: The Rust Ownership Model", duration: "30 min" },
          { title: "Lesson 1.2: References, Borrowing & Mutable Rules", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Rust Programming Course for Beginners",
        url: "https://www.youtube.com/watch?v=BpPEoQ4jflU",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Complete walkthrough of Rust ownership, structs, and traits."
      },
      {
        type: "docs",
        title: "The Rust Programming Language (The Book)",
        url: "https://doc.rust-lang.org/book/",
        provider: "Rust Official Documentation",
        badge: "Official Book",
        description: "The official, definitive book on Rust programming."
      }
    ]
  },
  {
    course_id: 32,
    id: 32,
    title: "Go (Golang): Concurrent Microservices & Cloud APIs",
    course_name: "Go (Golang): Concurrent Microservices & Cloud APIs",
    code: "GO-101",
    language: "Go",
    category: "Cloud & DevOps",
    difficulty: "Beginner",
    estimated_duration: "4 weeks",
    learning_format: "Live Labs & Microservices",
    career_stream: "Cloud Architect",
    description: "Learn Go from scratch: Goroutines, Channels, Interfaces, HTTP standard library, and building high-throughput microservices for Docker & Kubernetes.",
    match_score: 95.0,
    explanation: "Ideal for Cloud, DevOps, and backend engineering with clean, ultra-fast compiled performance.",
    algorithm: "Cloud Native Match",
    tags: ["go", "golang", "goroutines", "channels", "microservices", "cloud"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Go Syntax & Concurrency",
        lessons: [
          { title: "Lesson 1.1: Goroutines & Buffered Channels", duration: "30 min" },
          { title: "Lesson 1.2: Building REST APIs with net/http", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Go Programming by Example",
        url: "https://www.youtube.com/watch?v=YS4e4q9oBaU",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Build microservices and concurrent applications with Go."
      }
    ]
  },

  // ==========================================
  // JAVASCRIPT & WEB DEVELOPMENT (Beginner -> Advanced)
  // ==========================================
  {
    course_id: 41,
    id: 41,
    title: "Modern JavaScript (ES6+) & Web Foundations",
    course_name: "Modern JavaScript (ES6+) & Web Foundations",
    code: "JS-101",
    language: "JavaScript",
    category: "Web Development",
    difficulty: "Beginner",
    estimated_duration: "4 weeks",
    learning_format: "Interactive DOM Labs & Video",
    career_stream: "Full Stack Developer",
    description: "Master modern JavaScript ES6+, asynchronous programming, Promises, Fetch API, DOM manipulation, and responsive web foundations.",
    match_score: 98.0,
    explanation: "The essential starting point for all frontend, full-stack, and web application developers.",
    algorithm: "Beginner Frontend Match",
    tags: ["javascript", "es6", "web", "dom", "async", "beginner"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: JavaScript Core & Asynchronous JS",
        lessons: [
          { title: "Lesson 1.1: Scope, Closures & Arrow Functions", duration: "25 min" },
          { title: "Lesson 1.2: Promises, async/await & Fetch API", duration: "30 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Full JavaScript Course for Beginners",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Complete JavaScript tutorial from variables to asynchronous APIs."
      },
      {
        type: "docs",
        title: "MDN Web Docs - JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        provider: "Mozilla Developer Network",
        badge: "Official Docs",
        description: "The gold-standard reference documentation for JavaScript."
      }
    ]
  },
  {
    course_id: 42,
    id: 42,
    title: "Modern Full-Stack Web Architecture (React 19 & FastAPI)",
    course_name: "Modern Full-Stack Web Architecture (React 19 & FastAPI)",
    code: "CS-308",
    language: "JavaScript",
    category: "Web Development",
    difficulty: "Intermediate",
    estimated_duration: "5 weeks",
    learning_format: "Project-Based & Live Labs",
    career_stream: "Full Stack Developer",
    description: "Build reactive full-stack web applications using React 19, Tailwind CSS, Vite, FastAPI REST endpoints, and asynchronous relational databases.",
    match_score: 94.0,
    explanation: "Production-ready modern frontend and API engineering with state management and authentication.",
    algorithm: "Content-Based Match",
    tags: ["react", "fastapi", "python", "javascript", "tailwind", "vite"],
    is_saved: false,
    is_enrolled: true,
    progress: 15,
    image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: React Component Lifecycle & State",
        lessons: [
          { title: "Lesson 1.1: Modern React Hooks & Context", duration: "30 min" },
          { title: "Lesson 1.2: Asynchronous State & Router", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - React 19 Full Course",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Hands-on project building responsive frontend interfaces."
      }
    ]
  },

  // ==========================================
  // CLOUD & DEVOPS TRACKS
  // ==========================================
  {
    course_id: 51,
    id: 51,
    title: "Cloud Computing, Docker Containers & DevOps",
    course_name: "Cloud Computing, Docker Containers & DevOps",
    code: "CS-415",
    language: "Go",
    category: "Cloud & DevOps",
    difficulty: "Beginner",
    estimated_duration: "5 weeks",
    learning_format: "Hands-on Sandbox & CLI",
    career_stream: "Cloud Architect",
    description: "Linux fundamentals, Docker containerization, Kubernetes orchestration, CI/CD pipelines, and AWS cloud deployment.",
    match_score: 91.0,
    explanation: "Essential for deploying and scaling web services and AI applications in production cloud environments.",
    algorithm: "KNN Recommender",
    tags: ["docker", "kubernetes", "aws", "devops", "cloud", "linux", "beginner"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Linux & Docker Containers",
        lessons: [
          { title: "Lesson 1.1: Linux CLI & Multi-Stage Dockerfile", duration: "30 min" },
          { title: "Lesson 1.2: Container Networking & Volumes", duration: "35 min" }
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
        description: "End-to-end DevOps automation, Docker containers, and CI/CD pipelines."
      }
    ]
  },

  // ==========================================
  // DATA SCIENCE & SQL TRACKS
  // ==========================================
  {
    course_id: 61,
    id: 61,
    title: "SQL & Relational Database Architecture: Zero to Advanced",
    course_name: "SQL & Relational Database Architecture: Zero to Advanced",
    code: "DB-101",
    language: "SQL",
    category: "Data Science",
    difficulty: "Beginner",
    estimated_duration: "4 weeks",
    learning_format: "Interactive Queries & Labs",
    career_stream: "Data Science",
    description: "Master relational schema design, ACID transactions, complex multi-table JOINs, subqueries, window functions, and B-Tree query indexing.",
    match_score: 97.0,
    explanation: "Crucial for all software developers, data scientists, and backend engineers.",
    algorithm: "Database Foundation Match",
    tags: ["sql", "database", "postgres", "queries", "data science", "beginner"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Relational Queries & Table Relationships",
        lessons: [
          { title: "Lesson 1.1: SELECT, WHERE, GROUP BY & HAVING", duration: "25 min" },
          { title: "Lesson 1.2: INNER, LEFT, FULL JOINs & Subqueries", duration: "30 min" }
        ]
      },
      {
        title: "Module 2: Window Functions & Index Optimization",
        lessons: [
          { title: "Lesson 2.1: Window Functions (ROW_NUMBER, RANK, LEAD)", duration: "35 min" },
          { title: "Lesson 2.2: B-Tree Indexing & EXPLAIN ANALYZE", duration: "40 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - SQL and Database Design Course",
        url: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Comprehensive 4-hour video guide covering relational databases and SQL."
      },
      {
        type: "docs",
        title: "PostgreSQL Official Documentation",
        url: "https://www.postgresql.org/docs/",
        provider: "PostgreSQL Group",
        badge: "Official Docs",
        description: "Official PostgreSQL tutorial and reference manual."
      }
    ]
  },

  // ==========================================
  // CYBERSECURITY TRACKS
  // ==========================================
  {
    course_id: 71,
    id: 71,
    title: "Cybersecurity & Network Defense Fundamentals",
    course_name: "Cybersecurity & Network Defense Fundamentals",
    code: "SEC-101",
    language: "Python",
    category: "Cybersecurity",
    difficulty: "Beginner",
    estimated_duration: "4 weeks",
    learning_format: "Security Labs & Analysis",
    career_stream: "Cybersecurity",
    description: "Foundational cybersecurity course covering TCP/IP network packets, public-key cryptography, OWASP Top 10 vulnerabilities, Wireshark, and zero-trust security.",
    match_score: 95.0,
    explanation: "Start building network defense, ethical hacking, and vulnerability assessment skills.",
    algorithm: "Security Track Match",
    tags: ["cybersecurity", "security", "networking", "cryptography", "beginner"],
    is_saved: false,
    is_enrolled: false,
    progress: 0,
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    syllabus: [
      {
        title: "Module 1: Network Security & Cryptography",
        lessons: [
          { title: "Lesson 1.1: OSI Model, Packets & Wireshark", duration: "30 min" },
          { title: "Lesson 1.2: AES, RSA, Hashing & TLS 1.3", duration: "35 min" }
        ]
      }
    ],
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Cybersecurity Full Course for Beginners",
        url: "https://www.youtube.com/watch?v=U_P23dqepQ4",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Master network defense, encryption, and threat prevention."
      }
    ]
  }
];

export const MASTER_ELECTIVES_CATALOG = [
  {
    course_id: 101,
    id: 101,
    course_name: "Introduction to Generative AI & Prompt Engineering",
    code: "AI-102",
    category: "AI & ML",
    difficulty: "Beginner",
    credits: 3,
    prerequisites: ["None - Beginner Friendly"],
    match_score: 96.0,
    career_relevance: "Fast-track understanding of foundational LLM capabilities, tokenization, and effective prompting",
    tags: ["AI", "Generative AI", "Prompt Engineering", "Beginner"],
    is_saved: false,
    description: "A gentle, hands-on introduction to Large Language Models (LLMs), prompt crafting, zero-shot and few-shot reasoning, and ethical AI usage.",
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Prompt Engineering for Generative AI",
        url: "https://www.youtube.com/watch?v=_ZvnD93Ix5I",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Step-by-step introduction to prompt design patterns."
      }
    ]
  },
  {
    course_id: 102,
    id: 102,
    course_name: "Web Security & OWASP Top 10 Defensive Coding",
    code: "SEC-202",
    category: "Cybersecurity",
    difficulty: "Beginner",
    credits: 3,
    prerequisites: ["Basic Web / HTML knowledge"],
    match_score: 92.0,
    career_relevance: "Essential for Web Developers & Security Specialists to prevent data breaches",
    tags: ["Security", "OWASP", "Web", "Defense", "Beginner"],
    is_saved: false,
    description: "Hands-on defensive programming: preventing SQL injection, Cross-Site Scripting (XSS), CSRF, and securing user session tokens.",
    free_resources: [
      {
        type: "youtube",
        title: "freeCodeCamp - Web Application Security Course",
        url: "https://www.youtube.com/watch?v=2_lwsM71P3Q",
        author: "freeCodeCamp.org",
        badge: "Full Course",
        description: "Learn how to audit web applications and write secure code."
      }
    ]
  },
  {
    course_id: 103,
    id: 103,
    course_name: "Generative AI & Large Language Models (LLMs)",
    code: "CS-505",
    category: "AI & ML",
    difficulty: "Intermediate",
    credits: 4,
    prerequisites: ["Python Foundations", "Machine Learning Basics"],
    match_score: 94.0,
    career_relevance: "Directly aligns with AI Engineer and LLM Architect career pathways",
    tags: ["LLMs", "RAG", "Transformers", "Prompt Engineering"],
    is_saved: false,
    description: "Hands-on engineering covering transformer architectures, Retrieval-Augmented Generation (RAG), parameter-efficient fine-tuning (LoRA), and high-throughput serving.",
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
    course_id: 104,
    id: 104,
    course_name: "Distributed Systems & Scalable Database Architecture",
    code: "CS-512",
    category: "Core CS",
    difficulty: "Advanced",
    credits: 4,
    prerequisites: ["Data Structures & Algorithms", "SQL & Database Systems"],
    match_score: 89.0,
    career_relevance: "Crucial for Backend Architects & Distributed Systems Engineers",
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
    course_id: 105,
    id: 105,
    course_name: "High-Performance Data Engineering with Apache Spark & Kafka",
    code: "CS-440",
    category: "Data Science",
    difficulty: "Advanced",
    credits: 4,
    prerequisites: ["Python / Java", "Database Systems & SQL"],
    match_score: 88.0,
    career_relevance: "Essential for Big Data Engineers & Data Pipeline Architects",
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

/**
 * Dynamic Personalized Recommendations Engine
 * Calculates multi-dimensional match scores based on student profile preferences.
 */
export function getPersonalizedRecommendations(customProfile = null) {
  const profile = customProfile || getStoredProfile();
  const selectedLang = (profile.selected_language || profile.programming_language || "Python").toLowerCase();
  const studentLevel = (profile.skill_level || profile.education_level || "Beginner").toLowerCase();
  const careerGoal = (profile.career_stream || profile.career_interests?.[0] || "AI Engineer").toLowerCase();
  const preferredDuration = (profile.preferred_duration || "All").toLowerCase();

  return MASTER_COURSES_CATALOG.map((course) => {
    let score = 70.0;
    const courseLang = (course.language || "").toLowerCase();
    const courseLevel = (course.difficulty || "").toLowerCase();
    const courseCategory = (course.category || "").toLowerCase();
    const courseStream = (course.career_stream || "").toLowerCase();

    // 1. Language Affinity Score (+18%)
    if (selectedLang.includes(courseLang) || courseLang.includes(selectedLang) || course.tags.some(t => t.toLowerCase().includes(selectedLang))) {
      score += 18.0;
    } else if (course.tags.includes("core cs") || course.tags.includes("dsa") || course.tags.includes("sql")) {
      score += 8.0;
    }

    // 2. Skill Level Match (+15%)
    if (studentLevel.includes("beginner")) {
      if (courseLevel === "beginner") score += 15.0;
      else if (courseLevel === "intermediate") score += 4.0;
      else score -= 15.0; // Penalize advanced courses for beginners
    } else if (studentLevel.includes("intermediate")) {
      if (courseLevel === "intermediate") score += 15.0;
      else if (courseLevel === "advanced" || courseLevel === "beginner") score += 8.0;
    } else if (studentLevel.includes("advanced")) {
      if (courseLevel === "advanced") score += 15.0;
      else if (courseLevel === "intermediate") score += 10.0;
    }

    // 3. Career Stream Match (+12%)
    if (careerGoal.includes("ai") || careerGoal.includes("machine learning")) {
      if (courseCategory.includes("ai") || courseStream.includes("ai") || course.tags.includes("ai")) score += 12.0;
    } else if (careerGoal.includes("data science") || careerGoal.includes("analyst")) {
      if (courseCategory.includes("data") || course.tags.includes("sql") || course.tags.includes("data science")) score += 12.0;
    } else if (careerGoal.includes("full stack") || careerGoal.includes("web")) {
      if (courseCategory.includes("web") || course.tags.includes("react") || course.tags.includes("javascript")) score += 12.0;
    } else if (careerGoal.includes("cloud") || careerGoal.includes("devops")) {
      if (courseCategory.includes("cloud") || course.tags.includes("docker") || course.tags.includes("go")) score += 12.0;
    } else if (careerGoal.includes("cyber") || careerGoal.includes("security")) {
      if (courseCategory.includes("cybersecurity") || course.tags.includes("security")) score += 12.0;
    } else if (careerGoal.includes("backend") || careerGoal.includes("systems")) {
      if (courseCategory.includes("core cs") || course.tags.includes("java") || course.tags.includes("c++") || course.tags.includes("rust")) score += 12.0;
    }

    // 4. Duration Match (+5%)
    if (preferredDuration === "short" && course.estimated_duration.includes("4")) score += 5.0;
    if (preferredDuration === "medium" && (course.estimated_duration.includes("5") || course.estimated_duration.includes("6"))) score += 5.0;
    if (preferredDuration === "long" && (course.estimated_duration.includes("8") || course.estimated_duration.includes("10"))) score += 5.0;

    const finalMatch = Math.min(99.0, Math.max(65.0, Math.round(score * 10) / 10));

    // Dynamic rationale generator
    let reason = `Aligned with your ${profile.selected_language || "Python"} learning path and ${profile.career_stream || "Engineering"} goals.`;
    if (courseLevel === "beginner" && studentLevel.includes("beginner")) {
      reason = `Recommended as your core beginner foundation in ${course.language}. Builds prerequisites step-by-step.`;
    } else if (course.category === "AI & ML" && careerGoal.includes("ai")) {
      reason = `Directly accelerates your target career path as an AI Engineer with hands-on PyTorch and Scikit-Learn modules.`;
    }

    return {
      ...course,
      match_score: finalMatch,
      explanation: reason
    };
  }).sort((a, b) => b.match_score - a.match_score);
}

/**
 * Dynamic Personalized Electives Engine (Beginner-First)
 */
export function getPersonalizedElectives(customProfile = null) {
  const profile = customProfile || getStoredProfile();
  const studentLevel = (profile.skill_level || "Beginner").toLowerCase();

  return MASTER_ELECTIVES_CATALOG.map((elective) => {
    let score = 75.0;
    const elLevel = elective.difficulty.toLowerCase();

    if (studentLevel.includes("beginner")) {
      if (elLevel === "beginner") score += 20.0;
      else if (elLevel === "intermediate") score += 5.0;
      else score -= 15.0;
    } else if (studentLevel.includes("intermediate")) {
      if (elLevel === "intermediate") score += 20.0;
      else if (elLevel === "advanced") score += 10.0;
    } else {
      if (elLevel === "advanced") score += 20.0;
    }

    const finalMatch = Math.min(99.0, Math.max(60.0, Math.round(score * 10) / 10));

    return {
      ...elective,
      match_score: finalMatch
    };
  }).sort((a, b) => {
    // Beginner first sorting when student is a beginner
    if (studentLevel.includes("beginner")) {
      if (a.difficulty === "Beginner" && b.difficulty !== "Beginner") return -1;
      if (a.difficulty !== "Beginner" && b.difficulty === "Beginner") return 1;
    }
    return b.match_score - a.match_score;
  });
}

export const ALL_COURSES = MASTER_COURSES_CATALOG;
