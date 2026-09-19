/**
 * Comprehensive Career Stream Learning Roadmaps
 * Step-by-step beginner-to-advanced progression with prerequisites,
 * milestone projects, and curated reliable free learning resources.
 */

export const CAREER_ROADMAPS = {
  "AI Engineer": {
    title: "AI & Machine Learning Engineer",
    category: "AI & ML",
    icon: "Brain",
    color: "from-amber-500 to-rose-500",
    badge: "High Demand",
    description: "End-to-end pathway from programming fundamentals and mathematics to deep neural networks, LLMs, RAG, and production model serving.",
    estimated_time: "6-9 months (at 15-20 hrs/week)",
    end_of_roadmap_milestone: "Deploy a production-grade multi-modal Retrieval-Augmented Generation (RAG) system with custom fine-tuned weights and real-time inference streaming.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Programming & Mathematical Foundations",
        goal: "Build fluency in Python, linear algebra, multivariable calculus, and exploratory data analysis.",
        prerequisites: ["None - complete beginner friendly"],
        duration: "4-6 weeks",
        what_to_learn: [
          "Python 3 fundamentals, data structures, list comprehensions, and OOP",
          "NumPy matrix operations, vectorization, and broadcasting",
          "Pandas DataFrames, data cleaning, filtering, and feature engineering",
          "Linear Algebra: Matrix multiplication, eigenvalues, dot products, vector spaces",
          "Calculus: Partial derivatives, gradients, and the chain rule"
        ],
        milestone_project: {
          title: "Exploratory Data Analysis & Statistical Insight Engine",
          description: "Ingest a real-world dataset (e.g. Kaggle Housing / Titanic), clean null values, perform statistical hypothesis tests, and visualize correlation heatmaps using Matplotlib and Seaborn."
        },
        readiness_checklist: [
          "Can write clean, modular Python functions with type hints",
          "Comfortable calculating dot products and gradients by hand",
          "Able to clean and reshape complex CSV datasets with Pandas"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Python for Beginners Full Course",
            url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "youtube",
            title: "3Blue1Brown - Essence of Linear Algebra",
            url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
            provider: "3Blue1Brown",
            badge: "Visual Series"
          },
          {
            type: "docs",
            title: "Official NumPy & Pandas Documentation Guides",
            url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
            provider: "NumPy / Pandas Foundation",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Classical Machine Learning & Scikit-Learn",
        goal: "Master supervised and unsupervised learning algorithms, evaluation metrics, and cross-validation pipelines.",
        prerequisites: ["Stage 1 completion or Python + Linear Algebra proficiency"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Supervised algorithms: Linear/Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost)",
          "Unsupervised algorithms: K-Means Clustering, PCA Dimensionality Reduction",
          "Loss functions, Regularization (L1 Lasso, L2 Ridge), and Bias-Variance tradeoff",
          "Evaluation metrics: Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix",
          "Scikit-Learn Pipelines and hyperparameter tuning with GridSearchCV"
        ],
        milestone_project: {
          title: "End-to-End Customer Churn & Risk Prediction API",
          description: "Train an ensemble XGBoost model with cross-validation, serialize the model using Joblib, and expose a prediction REST endpoint with FastAPI."
        },
        readiness_checklist: [
          "Can explain bias-variance tradeoff and how L2 regularization prevents overfitting",
          "Able to build full Scikit-Learn preprocessing and modeling pipelines",
          "Score > 80% on Classical Machine Learning diagnostic quiz"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "StatQuest with Josh Starmer - Machine Learning Fundamentals",
            url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
            provider: "StatQuest",
            badge: "Visual Breakdown"
          },
          {
            type: "docs",
            title: "Scikit-Learn User Guide & Estimator API",
            url: "https://scikit-learn.org/stable/user_guide.html",
            provider: "Scikit-Learn Developers",
            badge: "Official Docs"
          },
          {
            type: "cert",
            title: "Kaggle Intermediate Machine Learning Certificate",
            url: "https://www.kaggle.com/learn/intermediate-machine-learning",
            provider: "Kaggle (Google)",
            badge: "Free Certificate"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Advanced",
        title: "Stage 3: Deep Learning, PyTorch & Computer Vision / NLP",
        goal: "Understand backpropagation, build neural networks in PyTorch, and implement CNNs and Transformers.",
        prerequisites: ["Stage 2 completion or strong classical ML foundations"],
        duration: "8-10 weeks",
        what_to_learn: [
          "Multi-Layer Perceptrons (MLPs), activation functions (ReLU, GELU), and backprop autograd",
          "PyTorch tensors, Dataset/DataLoader abstractions, custom training loops, and CUDA acceleration",
          "Convolutional Neural Networks (CNNs), ResNet architectures, and transfer learning",
          "Recurrent networks, Self-Attention mechanisms, and the Transformer architecture"
        ],
        milestone_project: {
          title: "Custom Image Classifier & Object Detection Pipeline",
          description: "Fine-tune a pretrained ResNet/Vision Transformer on custom domain images with data augmentation, achieving > 92% validation accuracy."
        },
        readiness_checklist: [
          "Can write custom PyTorch training and validation loops with optimizer zero_grad",
          "Understand query, key, value attention calculations mathematically",
          "Able to debug exploding/vanishing gradients and apply gradient clipping"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "Andrej Karpathy - Neural Networks: Zero to Hero",
            url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            provider: "Andrej Karpathy",
            badge: "Deep Dive Series"
          },
          {
            type: "docs",
            title: "PyTorch Official Tutorials & Deep Learning Recipes",
            url: "https://pytorch.org/tutorials/",
            provider: "PyTorch Foundation",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 4,
        level: "Advanced",
        title: "Stage 4: Generative AI, LLMs, RAG & Production MLOps",
        goal: "Build generative AI systems, fine-tune models with LoRA/QLoRA, design vector databases, and deploy with high throughput.",
        prerequisites: ["Stage 3 PyTorch & Transformer mastery"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Large Language Model architectures, tokenization (BPE), and prompt engineering",
          "Retrieval-Augmented Generation (RAG) using LangChain / LlamaIndex and vector databases (Pinecone, Chroma)",
          "Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA) on custom datasets",
          "MLOps: Model serialization (ONNX), containerization (Docker), and serving with vLLM / FastAPI"
        ],
        milestone_project: {
          title: "Full-Stack Enterprise Document Q&A RAG Platform",
          description: "Build an enterprise document search platform with semantic chunking, hybrid vector + keyword search, reranking, and streaming LLM responses with citations."
        },
        readiness_checklist: [
          "Built a working RAG pipeline with hybrid retrieval and evaluation metrics (RAGAS)",
          "Successfully fine-tuned an open-weights LLM using LoRA on GPU",
          "Deployed containerized inference endpoint with sub-500ms latency"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - LangChain & Vector Databases for LLMs",
            url: "https://www.youtube.com/watch?v=yF9kGESA35g",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Hugging Face Transformers & PEFT Documentation",
            url: "https://huggingface.co/docs/transformers/index",
            provider: "Hugging Face",
            badge: "Official Docs"
          }
        ]
      }
    ]
  },

  "Data Science": {
    title: "Data Scientist & Analytics Specialist",
    category: "Data Science",
    icon: "BarChart3",
    color: "from-blue-500 to-indigo-600",
    badge: "Popular",
    description: "Comprehensive pathway covering Python/R, SQL query mastery, statistical inference, predictive modeling, and business intelligence dashboards.",
    estimated_time: "5-7 months (at 12-16 hrs/week)",
    end_of_roadmap_milestone: "Build an automated business intelligence pipeline that extracts raw data from SQL databases, performs predictive forecasting, and updates interactive dashboards.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Python Data Analysis & Advanced SQL",
        goal: "Master data manipulation in Python and write complex analytical SQL queries.",
        prerequisites: ["Basic computer literacy"],
        duration: "4-5 weeks",
        what_to_learn: [
          "Python data types, control flow, functions, and file I/O",
          "Pandas data wrangling, grouping, pivots, and missing data imputation",
          "Relational Database concepts, JOINs (INNER, LEFT, FULL, CROSS), subqueries, and CTEs",
          "Window functions in SQL (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG)",
          "Data visualization with Matplotlib, Seaborn, and Plotly interactive charts"
        ],
        milestone_project: {
          title: "E-Commerce Cohort Analysis & Customer Retention Study",
          description: "Analyze 500k+ transaction records in PostgreSQL, calculate monthly cohort retention rates using SQL window functions, and plot retention heatmaps."
        },
        readiness_checklist: [
          "Can write complex SQL queries with multiple CTEs and window functions",
          "Able to clean messy real-world CSV/JSON datasets with Pandas",
          "Know how to choose appropriate charts for distributions vs correlations"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - SQL and Database Design Course",
            url: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "PostgreSQL Official Tutorial & Window Functions",
            url: "https://www.postgresql.org/docs/current/tutorial.html",
            provider: "PostgreSQL Global Group",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Applied Statistics, A/B Testing & Predictive Modeling",
        goal: "Conduct rigorous hypothesis testing, experiment design, and train predictive machine learning models.",
        prerequisites: ["Stage 1 completion or strong SQL & Pandas skills"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Probability distributions (Normal, Binomial, Poisson) and Central Limit Theorem",
          "Hypothesis testing (t-tests, ANOVA, Chi-Square, p-values, confidence intervals)",
          "A/B Testing methodology: Sample size calculation, power analysis, and significance testing",
          "Regression & Classification: Ridge/Lasso, Random Forests, Logistic Regression",
          "Time series analysis and forecasting (ARIMA, Prophet, seasonality decomposition)"
        ],
        milestone_project: {
          title: "A/B Test Experimentation Engine & Conversion Uplift Analyzer",
          description: "Design an end-to-end A/B test pipeline analyzing conversion rates across landing pages with power calculations, p-value adjustments, and business impact metrics."
        },
        readiness_checklist: [
          "Can explain p-values and Type I / Type II errors intuitively",
          "Able to execute statistical significance tests in SciPy / Statsmodels",
          "Score > 80% on Applied Statistics diagnostic assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "StatQuest - Statistics Fundamentals & Hypothesis Testing",
            url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",
            provider: "StatQuest",
            badge: "Visual Series"
          },
          {
            type: "docs",
            title: "Statsmodels Official Statistical Models Guide",
            url: "https://www.statsmodels.org/stable/index.html",
            provider: "Statsmodels Developers",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Advanced",
        title: "Stage 3: Big Data Engineering, Spark & Dashboard Deployment",
        goal: "Process large-scale datasets with PySpark, automate pipelines, and build interactive Streamlit dashboards.",
        prerequisites: ["Stage 2 completion or predictive modeling foundations"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Distributed computing with Apache Spark & PySpark DataFrames",
          "Data lakehouse table formats (Delta Lake, Apache Iceberg, Parquet)",
          "Automated workflow scheduling with Apache Airflow DAGs",
          "Interactive dashboard engineering with Streamlit / Dash and cloud deployment"
        ],
        milestone_project: {
          title: "Real-Time Big Data Analytics Dashboard on Cloud",
          description: "Process multi-gigabyte dataset with PySpark, compute aggregate metrics, store in Delta Lake, and present live insights in an interactive Streamlit application."
        },
        readiness_checklist: [
          "Understand Spark execution plans, partitions, and shuffle operations",
          "Built and deployed an interactive data application",
          "Completed portfolio presentation of end-to-end analytics project"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - PySpark Big Data Course",
            url: "https://www.youtube.com/watch?v=_C8kWso4ebw",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Apache Spark Official Quick Start Guide",
            url: "https://spark.apache.org/docs/latest/quick-start.html",
            provider: "Apache Software Foundation",
            badge: "Official Docs"
          }
        ]
      }
    ]
  },

  "Full Stack Developer": {
    title: "Modern Full Stack Web Developer",
    category: "Web Development",
    icon: "Code",
    color: "from-emerald-500 to-teal-600",
    badge: "Industry Standard",
    description: "Complete full-stack curriculum from HTML/CSS/JavaScript and React to Node.js/FastAPI, relational databases, REST/GraphQL APIs, and cloud deployment.",
    estimated_time: "5-8 months (at 15-20 hrs/week)",
    end_of_roadmap_milestone: "Build and deploy a full-featured SaaS web application with authentication, payment processing, background queues, and responsive UI.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Web Foundations (HTML5, Modern CSS & JavaScript ES6+)",
        goal: "Master semantic markup, modern CSS flexbox/grid/Tailwind, and asynchronous JavaScript.",
        prerequisites: ["None - complete beginner friendly"],
        duration: "4-6 weeks",
        what_to_learn: [
          "Semantic HTML5, accessibility (ARIA), and SEO foundations",
          "CSS3: Flexbox, CSS Grid, responsive media queries, and Tailwind CSS utility classes",
          "Modern JavaScript: ES6+ syntax, destructuring, arrow functions, DOM manipulation",
          "Asynchronous JavaScript: Promises, async/await, Fetch API, and JSON handling",
          "Git version control: branching, commits, pull requests, and GitHub workflows"
        ],
        milestone_project: {
          title: "Responsive Task Management & Kanban Board",
          description: "Build an interactive responsive Kanban board in pure JavaScript with drag-and-drop, local storage persistence, and dynamic dark/light mode toggle."
        },
        readiness_checklist: [
          "Can create fully responsive mobile-first layouts using Tailwind CSS",
          "Fluently handle async fetch requests and parse API JSON responses",
          "Proficient with Git commit, branch, merge, and remote GitHub pushes"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Full JavaScript Course for Beginners",
            url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "MDN Web Docs - JavaScript Guide & Tutorials",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            provider: "Mozilla Developer Network",
            badge: "Official Docs"
          },
          {
            type: "cert",
            title: "Responsive Web Design Certification",
            url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
            provider: "freeCodeCamp.org",
            badge: "Free Certificate"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Modern Frontend with React 19, TypeScript & State Management",
        goal: "Build component-driven single-page applications with React, TypeScript, and client routing.",
        prerequisites: ["Stage 1 completion or JavaScript ES6+ proficiency"],
        duration: "6-8 weeks",
        what_to_learn: [
          "React Component Lifecycle, JSX, Props, and State management with useState / useReducer",
          "React Hooks: useEffect, useMemo, useCallback, useRef, and custom reusable hooks",
          "TypeScript: Interfaces, types, union types, generics, and React component typing",
          "Client-side routing with React Router 7, lazy loading, and error boundaries",
          "Global state management with Zustand / Redux Toolkit and data fetching with TanStack Query"
        ],
        milestone_project: {
          title: "Collaborative Real-Time Workspace / Dashboard",
          description: "Build a multi-page React 19 + TypeScript dashboard with live charts, filtering, search, and optimistic UI updates."
        },
        readiness_checklist: [
          "Understand React re-rendering mechanics and how to prevent unnecessary renders",
          "Can type complex React props and asynchronous API responses in TypeScript",
          "Score > 80% on Frontend React diagnostic assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - React 19 Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Official React Documentation (react.dev)",
            url: "https://react.dev/",
            provider: "React Core Team",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Intermediate",
        title: "Stage 3: Backend API Engineering (FastAPI / Node.js & Databases)",
        goal: "Design scalable RESTful APIs, relational databases, user authentication, and authorization.",
        prerequisites: ["Stage 2 completion or frontend integration experience"],
        duration: "6-8 weeks",
        what_to_learn: [
          "REST API design principles, status codes, request validation (Pydantic / Zod)",
          "FastAPI (Python) or Express / NestJS (Node.js/TypeScript) endpoints",
          "Relational databases (PostgreSQL): Schema design, indexing, foreign keys, migrations with Alembic / Prisma",
          "Authentication & Security: JWT tokens, password hashing (bcrypt), OAuth 2.0, CORS, and rate limiting"
        ],
        milestone_project: {
          title: "Authenticated Multi-Tenant REST API with PostgreSQL",
          description: "Build a secure REST backend with JWT authentication, role-based access control (RBAC), relational database models, and automated Swagger/OpenAPI docs."
        },
        readiness_checklist: [
          "Can design normalized database schemas and write efficient SQL queries",
          "Implemented secure JWT authentication with refresh token rotation",
          "Comfortable writing unit and integration tests for API endpoints"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - FastAPI Full Course & REST APIs",
            url: "https://www.youtube.com/watch?v=tLKKmouU5OI",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "FastAPI Official Documentation & Tutorial",
            url: "https://fastapi.tiangolo.com/tutorial/",
            provider: "Tiangolo (FastAPI)",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 4,
        level: "Advanced",
        title: "Stage 4: Full-Stack Integration, DevOps, CI/CD & Cloud Deployment",
        goal: "Deploy containerized full-stack web applications to the cloud with CI/CD automation and caching.",
        prerequisites: ["Stage 3 API and database mastery"],
        duration: "4-6 weeks",
        what_to_learn: [
          "Docker containerization (multi-stage Dockerfiles) and docker-compose orchestration",
          "Caching and message queues with Redis",
          "Continuous Integration / Continuous Deployment (CI/CD) with GitHub Actions",
          "Cloud deployment on AWS / Vercel / Render / Supabase with custom domains and SSL"
        ],
        milestone_project: {
          title: "Full-Stack Production SaaS Application with CI/CD",
          description: "Deploy a production React + FastAPI + PostgreSQL SaaS application with automated GitHub Actions testing and containerized cloud deployment."
        },
        readiness_checklist: [
          "Created optimized multi-stage Docker build files",
          "Configured automated CI/CD pipeline on GitHub Actions",
          "Live deployed application accessible via public HTTPS URL"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Docker & Kubernetes Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=Wf2eSG3owoA",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Docker Official Get Started Documentation",
            url: "https://docs.docker.com/get-started/",
            provider: "Docker Inc.",
            badge: "Official Docs"
          }
        ]
      }
    ]
  },

  "Backend Systems Engineer": {
    title: "Backend & Distributed Systems Engineer (Java / C++ / Go / Rust)",
    category: "Core CS",
    icon: "Server",
    color: "from-purple-500 to-indigo-700",
    badge: "Core Engineering",
    description: "Deep engineering roadmap covering systems programming languages (Java, C++, Go, Rust), memory models, concurrency, database internals, and high-throughput distributed systems.",
    estimated_time: "6-9 months (at 15-20 hrs/week)",
    end_of_roadmap_milestone: "Build a distributed, horizontally-sharded key-value storage engine with Raft consensus protocol, write-ahead logging (WAL), and LSM-tree storage.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Systems Language Foundations & Memory Models",
        goal: "Master strongly-typed systems languages (Java, C++, Go, or Rust), pointers, and memory layout.",
        prerequisites: ["Basic programming logic"],
        duration: "5-6 weeks",
        what_to_learn: [
          "Choice of language: Java (JVM & OOP), C++ (Pointers & STL), Go (Goroutines & Channels), or Rust (Borrow Checker & Ownership)",
          "Stack vs Heap memory allocations, pointer arithmetic, and reference semantics",
          "Data structures implementation: Dynamic arrays, singly/doubly linked lists, hash tables, and binary trees",
          "Algorithmic complexity: Big-O time and space amortized analysis"
        ],
        milestone_project: {
          title: "Custom Memory-Managed Data Structure Library",
          description: "Implement a dynamic resizable Vector, HashMap with quadratic probing, and AVL self-balancing tree from scratch without using language standard library collections."
        },
        readiness_checklist: [
          "Can explain stack vs heap memory differences and pointer mechanics",
          "Able to implement a Hash Map and binary search tree from scratch",
          "Score > 80% on Data Structures diagnostic assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - C++ Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "youtube",
            title: "freeCodeCamp - Java Programming for Beginners",
            url: "https://www.youtube.com/watch?v=A74TOX803D0",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "The Rust Programming Language (The Book)",
            url: "https://doc.rust-lang.org/book/",
            provider: "Rust Team",
            badge: "Official Book"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Concurrency, Multithreading & High-Performance Networking",
        goal: "Write thread-safe concurrent code, avoid race conditions, and implement TCP/HTTP network servers.",
        prerequisites: ["Stage 1 completion"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Concurrency primitives: Mutexes, Semaphores, Atomic variables, Condition variables, and Read-Write locks",
          "Race conditions, Deadlocks, Livelocks, and Lock-free programming techniques",
          "Socket programming: Non-blocking I/O, event loops (epoll / kqueue), and TCP connection handling",
          "High-performance RPC protocols: Protocol Buffers (Protobuf) and gRPC services"
        ],
        milestone_project: {
          title: "High-Throughput Multi-Threaded HTTP / TCP Server",
          description: "Build a multi-threaded TCP web server with connection thread pooling, HTTP 1.1 request parser, non-blocking sockets, and concurrent request benchmarks."
        },
        readiness_checklist: [
          "Can identify and eliminate race conditions using mutexes or lock-free atomics",
          "Understand how OS event demultiplexing (epoll/kqueue) handles 10,000 concurrent connections",
          "Built a working gRPC microservice with protocol buffer definitions"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Go Programming by Example",
            url: "https://www.youtube.com/watch?v=YS4e4q9oBaU",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "gRPC Official Guides and Language Tutorials",
            url: "https://grpc.io/docs/languages/",
            provider: "gRPC Authors",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Advanced",
        title: "Stage 3: Distributed Systems Architecture, Sharding & Consensus",
        goal: "Master distributed storage, consensus algorithms (Raft, Paxos), CAP theorem, and event streaming.",
        prerequisites: ["Stage 2 concurrency and networking foundations"],
        duration: "8-10 weeks",
        what_to_learn: [
          "CAP Theorem, PACELC, ACID vs BASE, and Strong vs Eventual Consistency",
          "Consensus algorithms: Raft leader election, log replication, and commit invariants",
          "Horizontal database sharding, consistent hashing, and partition rebalancing",
          "Event streaming and message brokers: Apache Kafka, partition consumer groups, and idempotent publishers"
        ],
        milestone_project: {
          title: "Distributed Fault-Tolerant Raft Key-Value Store",
          description: "Implement the Raft consensus algorithm from scratch in Go / Java / Rust, supporting leader election, log replication across 3 nodes, and crash recovery."
        },
        readiness_checklist: [
          "Can explain how Raft ensures state machine safety across network partitions",
          "Able to design consistent hashing rings for distributed caching",
          "Score > 85% on Distributed Systems diagnostic assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "MIT 6.824: Distributed Systems Lectures",
            url: "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
            provider: "MIT OpenCourseWare",
            badge: "MIT University Course"
          },
          {
            type: "docs",
            title: "The Raft Consensus Algorithm Interactive Visualization",
            url: "https://raft.github.io/",
            provider: "Raft Authors",
            badge: "Interactive Guide"
          }
        ]
      }
    ]
  },

  "Cloud & DevOps": {
    title: "Cloud Architect & DevOps Engineer",
    category: "Cloud & DevOps",
    icon: "Cloud",
    color: "from-sky-500 to-blue-700",
    badge: "Enterprise Standard",
    description: "Master Linux administration, Docker containerization, Kubernetes orchestration, Infrastructure as Code (Terraform), and AWS cloud architectures.",
    estimated_time: "5-7 months (at 12-16 hrs/week)",
    end_of_roadmap_milestone: "Deploy a highly available, multi-region Kubernetes cluster using Terraform IaC with automated GitOps CI/CD and Prometheus/Grafana monitoring.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Linux Administration, Bash & Networking Basics",
        goal: "Master Linux terminal commands, file systems, permissions, shell scripting, and network protocols.",
        prerequisites: ["Basic computer literacy"],
        duration: "4-5 weeks",
        what_to_learn: [
          "Linux file system hierarchy, permissions (chmod/chown), process management (ps, top, systemctl)",
          "Bash scripting, variables, loops, pipes, grep, sed, and awk text processing",
          "Networking fundamentals: DNS, TCP/IP, UDP, Subnets, CIDR notation, SSH, and Firewalls (iptables/ufw)"
        ],
        milestone_project: {
          title: "Automated Linux Server Provisioning & Hardening Script",
          description: "Write a modular Bash automation script that provisions a fresh Linux VPS, configures UFW firewalls, creates SSH key-only sudo users, and sets up automated log rotation."
        },
        readiness_checklist: [
          "Can comfortably navigate Linux servers entirely through the CLI",
          "Write Bash scripts with error handling and parameter flags",
          "Able to configure DNS records, SSL certificates, and SSH tunnels"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Linux for Beginners Full Course",
            url: "https://www.youtube.com/watch?v=sWbGOq4stl8",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Linux Command Line Official Guide",
            url: "https://linuxcommand.org/tlcl.php",
            provider: "LinuxCommand",
            badge: "Free Book"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Containerization with Docker & Kubernetes Orchestration",
        goal: "Build lightweight container images and orchestrate microservices in Kubernetes.",
        prerequisites: ["Stage 1 Linux foundations"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Docker: Dockerfiles, multi-stage builds, layers caching, volumes, networks, and docker-compose",
          "Kubernetes architecture: Control Plane, Nodes, Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer)",
          "Kubernetes Ingress controllers, ConfigMaps, Secrets, Persistent Volumes, and Helm charts"
        ],
        milestone_project: {
          title: "Microservices Deployment on Local Kubernetes Cluster",
          description: "Containerize a full-stack web application, create Kubernetes deployment manifests, configure Ingress routing, and manage configuration with Helm."
        },
        readiness_checklist: [
          "Understand Docker image layer optimization and security best practices",
          "Can debug failing Kubernetes pods using kubectl logs and describe commands",
          "Score > 80% on Container & Kubernetes diagnostic quiz"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Docker & Kubernetes Tutorial",
            url: "https://www.youtube.com/watch?v=Wf2eSG3owoA",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "Kubernetes Official Interactive Tutorials",
            url: "https://kubernetes.io/docs/tutorials/",
            provider: "Cloud Native Computing Foundation",
            badge: "Official Docs"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Advanced",
        title: "Stage 3: Infrastructure as Code (Terraform) & Cloud Architecture (AWS)",
        goal: "Provision reproducible cloud infrastructure with Terraform and build automated GitOps pipelines.",
        prerequisites: ["Stage 2 container and orchestration mastery"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Infrastructure as Code (IaC) with Terraform: Providers, state management, modules, and variables",
          "AWS Cloud Architecture: VPCs, EC2, S3, IAM policies, RDS, ALB, and EKS managed Kubernetes",
          "CI/CD GitOps automation with GitHub Actions and ArgoCD",
          "Observability and monitoring: Prometheus metrics scraping, Grafana visual dashboards, and log aggregation"
        ],
        milestone_project: {
          title: "Complete GitOps Cloud Infrastructure on AWS with Terraform",
          description: "Write modular Terraform code to provision a secure AWS VPC, managed database, and EKS cluster with automated ArgoCD GitOps deployment."
        },
        readiness_checklist: [
          "Can write modular, reusable Terraform configurations with remote state locking in S3/DynamoDB",
          "Configured Prometheus/Grafana dashboards for cluster telemetry",
          "Built end-to-end GitOps deployment workflow"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Terraform Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=SLB_c_ayRMo",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "HashiCorp Terraform Official Tutorials",
            url: "https://developer.hashicorp.com/terraform/tutorials",
            provider: "HashiCorp",
            badge: "Official Tutorials"
          }
        ]
      }
    ]
  },

  "Cybersecurity": {
    title: "Cybersecurity & Network Defense Specialist",
    category: "Cybersecurity",
    icon: "Shield",
    color: "from-rose-500 to-red-700",
    badge: "Critical Role",
    description: "Comprehensive curriculum covering ethical hacking, network defense, penetration testing, cryptography, zero-trust architecture, and secure coding standards.",
    estimated_time: "5-7 months (at 12-16 hrs/week)",
    end_of_roadmap_milestone: "Perform an end-to-end penetration testing audit of a vulnerable enterprise infrastructure, document CVE vulnerabilities, and implement zero-trust mitigations.",
    stages: [
      {
        stage_number: 1,
        level: "Beginner",
        title: "Stage 1: Networking Protocols, Operating Systems & Security Fundamentals",
        goal: "Understand OSI model, packet analysis with Wireshark, Linux security, and cryptography basics.",
        prerequisites: ["None - beginner friendly"],
        duration: "4-6 weeks",
        what_to_learn: [
          "OSI & TCP/IP models, packet headers, port scanning, and Wireshark packet capture",
          "Cryptography: Symmetric (AES), Asymmetric (RSA, ECC), Hashing (SHA-256), and TLS 1.3 handshakes",
          "Common vulnerabilities: OWASP Top 10 overview, SQL Injection, XSS, CSRF, and Authentication bypass"
        ],
        milestone_project: {
          title: "Network Traffic & Packet Analyzer with Wireshark",
          description: "Capture and analyze live network traffic packets, identify unencrypted credentials and suspicious ARP spoofing attempts, and document network remediation steps."
        },
        readiness_checklist: [
          "Can explain TCP 3-way handshake and analyze packet flows in Wireshark",
          "Understand public/private key cryptography and digital certificate validation",
          "Score > 80% on Cybersecurity Fundamentals diagnostic assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Cybersecurity Full Course for Beginners",
            url: "https://www.youtube.com/watch?v=U_P23dqepQ4",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "OWASP Top 10 Web Application Security Risks",
            url: "https://owasp.org/www-project-top-ten/",
            provider: "OWASP Foundation",
            badge: "Industry Standard"
          }
        ]
      },
      {
        stage_number: 2,
        level: "Intermediate",
        title: "Stage 2: Ethical Hacking, Penetration Testing & Web Security",
        goal: "Master penetration testing tools (Nmap, Burp Suite, Metasploit) and exploit web vulnerabilities in controlled sandboxes.",
        prerequisites: ["Stage 1 networking and security basics"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Reconnaissance and vulnerability scanning with Nmap and Nikto",
          "Web application security testing with Burp Suite: Intercepting proxies, SQLi, and IDOR vulnerabilities",
          "Privilege escalation techniques on Linux and Windows targets",
          "Hands-on lab solving on TryHackMe and Hack The Box platforms"
        ],
        milestone_project: {
          title: "Comprehensive Web Application Penetration Test Audit",
          description: "Conduct a full security audit of an intentionally vulnerable web application (e.g. DVWA / Juice Shop), exploit 5 distinct OWASP vulnerabilities, and write an executive remediation report."
        },
        readiness_checklist: [
          "Comfortable using Burp Suite for HTTP request interception and payload fuzzing",
          "Can identify and demonstrate SQL injection and Cross-Site Scripting (XSS)",
          "Completed at least 15 TryHackMe / Hack The Box practice rooms"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - Ethical Hacking Full Course",
            url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "PortSwigger Web Security Academy (Free Hands-On Labs)",
            url: "https://portswigger.net/web-security",
            provider: "PortSwigger",
            badge: "Interactive Labs"
          }
        ]
      },
      {
        stage_number: 3,
        level: "Advanced",
        title: "Stage 3: Zero Trust Architecture, SIEM & Threat Hunting",
        goal: "Design enterprise Zero Trust security models, configure SIEM monitoring, and perform active threat hunting.",
        prerequisites: ["Stage 2 penetration testing and network defense experience"],
        duration: "6-8 weeks",
        what_to_learn: [
          "Zero Trust Architecture principles: Never trust, always verify, least-privilege access",
          "Security Information and Event Management (SIEM) with Wazuh / Splunk",
          "Incident response workflows, digital forensics, and malware analysis fundamentals",
          "Cloud security (AWS IAM least privilege, CloudTrail audit logs, GuardDuty threat detection)"
        ],
        milestone_project: {
          title: "Enterprise SIEM Telemetry & Threat Detection Pipeline",
          description: "Set up an open-source Wazuh SIEM cluster, ingest logs from multiple Linux/Windows endpoints, create custom rule alerts for brute-force SSH attacks, and trigger automated quarantine actions."
        },
        readiness_checklist: [
          "Can configure SIEM log collectors and write custom detection rules",
          "Understand Zero Trust identity validation mechanisms and mutual TLS (mTLS)",
          "Score > 85% on Advanced Security & Defensive Architecture assessment"
        ],
        free_resources: [
          {
            type: "youtube",
            title: "freeCodeCamp - SOC Analyst & SIEM Training Course",
            url: "https://www.youtube.com/watch?v=7uV_Zf36-xQ",
            provider: "freeCodeCamp.org",
            badge: "Full Course"
          },
          {
            type: "docs",
            title: "NIST Special Publication 800-207: Zero Trust Architecture",
            url: "https://csrc.nist.gov/publications/detail/sp/800-207/final",
            provider: "NIST",
            badge: "Official Standard"
          }
        ]
      }
    ]
  }
};

/**
 * Get roadmap by career stream name with fallback
 */
export function getCareerRoadmap(careerStream) {
  if (!careerStream) return CAREER_ROADMAPS["AI Engineer"];
  
  const clean = careerStream.toLowerCase();
  if (clean.includes("ai") || clean.includes("machine learning") || clean.includes("ml")) {
    return CAREER_ROADMAPS["AI Engineer"];
  }
  if (clean.includes("data science") || clean.includes("data analyst") || clean.includes("analytics")) {
    return CAREER_ROADMAPS["Data Science"];
  }
  if (clean.includes("full stack") || clean.includes("web") || clean.includes("frontend")) {
    return CAREER_ROADMAPS["Full Stack Developer"];
  }
  if (clean.includes("backend") || clean.includes("systems") || clean.includes("java") || clean.includes("c++") || clean.includes("rust") || clean.includes("go")) {
    return CAREER_ROADMAPS["Backend Systems Engineer"];
  }
  if (clean.includes("cloud") || clean.includes("devops")) {
    return CAREER_ROADMAPS["Cloud & DevOps"];
  }
  if (clean.includes("cyber") || clean.includes("security")) {
    return CAREER_ROADMAPS["Cybersecurity"];
  }

  return CAREER_ROADMAPS["Full Stack Developer"];
}
