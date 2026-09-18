import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.profile import StudentProfile
from app.models.course import Subject, Course, Enrollment, SavedCourse
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.study_plan import StudySession, RecommendationLog
from app.models.notification import Notification
from app.services.auth_service import hash_password

def seed_database(db: Session):
    # 2. Courses with curated free channels, playlists, official documentation, and practice platforms
    courses_data = [
        {
            "title": "Advanced Python & Algorithmic Problem Solving",
            "code": "CS-PY-301",
            "category": "Core CS",
            "difficulty": "Intermediate",
            "estimated_duration": "6 weeks (24 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Master advanced Python idioms, decorators, generators, concurrency with asyncio, memory management, and high-performance algorithmic optimization.",
            "prerequisites": json.dumps(["Python Programming"]),
            "tags": json.dumps(["Python", "AsyncIO", "OOP", "Algorithms", "Performance"]),
            "career_track": "Software Engineer",
            "is_elective": False,
            "rating": 4.9,
            "enrolled_count": 340,
            "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Python Masterclass & Deep Dive",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                    "description": "Full 6-hour Python bootcamp covering core syntax to advanced data structures and algorithms.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Corey Schafer - Python OOP, Closures & Decorators",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhWLLoM5_Y9YTBt",
                    "description": "Industry-standard playlist covering object-oriented Python, dunder methods, closures, and decorator factories.",
                    "badge": "Playlist",
                    "author": "Corey Schafer"
                },
                {
                    "title": "mCoding - Fast, Modern Python & AsyncIO",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@mCoding",
                    "description": "Master advanced Python memory layout, GIL internals, type annotations, and AsyncIO coroutines.",
                    "badge": "Channel",
                    "author": "mCoding"
                },
                {
                    "title": "ArjanCodes - Software Design & Architecture in Python",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@ArjanCodes",
                    "description": "Clean code patterns, SOLID principles, dependency injection, and scalable Python refactoring.",
                    "badge": "Channel",
                    "author": "ArjanCodes"
                },
                {
                    "title": "Python 3 Official Documentation & Standard Library",
                    "type": "docs",
                    "url": "https://docs.python.org/3/",
                    "description": "The definitive language reference manual, built-in functions, itertools, and concurrency docs.",
                    "badge": "Official Docs",
                    "author": "Python Software Foundation"
                },
                {
                    "title": "Real Python - In-Depth Python Tutorials & Quizzes",
                    "type": "website",
                    "url": "https://realpython.com/",
                    "description": "Production-grade tutorials on asynchronous programming, memory profiling, and algorithms.",
                    "badge": "Tutorials",
                    "author": "Real Python"
                },
                {
                    "title": "LeetCode Python Algorithmic Practice",
                    "type": "practice",
                    "url": "https://leetcode.com/problemset/all/",
                    "description": "Interactive coding challenges to test and sharpen your algorithmic problem solving in Python.",
                    "badge": "Practice Platform",
                    "author": "LeetCode"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Advanced Functional Python & Metaprogramming",
                    "lessons": [
                        {"id": "l-101", "title": "Deep Dive into Python Closures & Decorators", "duration": "25 min", "type": "video", "completed": True, "content": "Understand how closures retain lexical scope and build parameterizable decorator factories with functools.wraps."},
                        {"id": "l-102", "title": "Generators, Iterators, and Memory Optimization", "duration": "20 min", "type": "practice", "completed": True, "content": "Use yield expressions and itertools to stream gigabyte-scale datasets with minimal memory footprints."},
                        {"id": "l-103", "title": "Metaclasses & Dynamic Class Construction", "duration": "30 min", "type": "text", "completed": False, "content": "Master type() dynamic instantiation, __new__ vs __init__, and custom class validation patterns."}
                    ]
                },
                {
                    "id": "mod-2",
                    "title": "Module 2: Asynchronous Programming & Concurrency",
                    "lessons": [
                        {"id": "l-201", "title": "The AsyncIO Event Loop & Task Coroutines", "duration": "35 min", "type": "video", "completed": False, "content": "How the single-threaded event loop coordinates non-blocking I/O operations seamlessly."},
                        {"id": "l-202", "title": "Multiprocessing vs Multithreading vs AsyncIO", "duration": "25 min", "type": "practice", "completed": False, "content": "Bypassing the GIL for CPU-bound tasks vs utilizing thread pools for legacy blocking I/O."},
                        {"id": "l-203", "title": "Module 2 Checkpoint Quiz", "duration": "15 min", "type": "quiz", "completed": False, "content": "Test your mastery of coroutine scheduling, exception handling in tasks, and semaphore throttling."}
                    ]
                }
            ])
        },
        {
            "title": "Machine Learning: From Theory to Production",
            "code": "AI-ML-401",
            "category": "AI & ML",
            "difficulty": "Advanced",
            "estimated_duration": "8 weeks (36 hrs)",
            "learning_format": "Interactive & Video",
            "description": "Build, evaluate, and deploy scalable ML models using Scikit-Learn, XGBoost, and PyTorch. Covers feature engineering, cross-validation, hyperparameter tuning, and MLflow pipeline deployment.",
            "prerequisites": json.dumps(["Python Programming", "Mathematics for Computing"]),
            "tags": json.dumps(["Machine Learning", "Scikit-Learn", "Regression", "Classification", "PyTorch"]),
            "career_track": "AI Engineer",
            "is_elective": False,
            "rating": 4.9,
            "enrolled_count": 510,
            "image_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "StatQuest with Josh Starmer - Machine Learning Fundamentals",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
                    "description": "Visual, intuitive explanations of Decision Trees, Random Forests, Gradient Boost, PCA, and SVMs.",
                    "badge": "Playlist",
                    "author": "StatQuest"
                },
                {
                    "title": "Andrej Karpathy - Neural Networks: Zero to Hero",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
                    "description": "Build backpropagation engines (micrograd), language models (makemore), and GPT models from scratch.",
                    "badge": "Course Series",
                    "author": "Andrej Karpathy"
                },
                {
                    "title": "3Blue1Brown - Essence of Linear Algebra & Neural Networks",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
                    "description": "Geometric intuition for matrices, eigenvalues, gradients, and deep neural network loss landscapes.",
                    "badge": "Visual Series",
                    "author": "3Blue1Brown"
                },
                {
                    "title": "freeCodeCamp - Machine Learning with Python & Scikit-Learn",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=i_LwzRVP7bg",
                    "description": "Hands-on implementation of regression, classification, clustering, and ensemble learning.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Scikit-Learn Official User Guide & API Reference",
                    "type": "docs",
                    "url": "https://scikit-learn.org/stable/user_guide.html",
                    "description": "Comprehensive documentation for supervised/unsupervised estimators, pipelines, and metrics.",
                    "badge": "Official Docs",
                    "author": "Scikit-Learn Developers"
                },
                {
                    "title": "PyTorch Official Tutorials & Deep Learning Recipes",
                    "type": "docs",
                    "url": "https://pytorch.org/tutorials/",
                    "description": "End-to-end PyTorch guides from autograd basics to distributed model training.",
                    "badge": "Official Docs",
                    "author": "PyTorch Foundation"
                },
                {
                    "title": "Kaggle Learn - Free Interactive ML Micro-Courses",
                    "type": "practice",
                    "url": "https://www.kaggle.com/learn",
                    "description": "Interactive notebook tutorials with hands-on practice on real datasets and competitions.",
                    "badge": "Hands-on Lab",
                    "author": "Kaggle"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Mathematical Foundations & Feature Engineering",
                    "lessons": [
                        {"id": "l-111", "title": "Linear Algebra & Gradient Descent Optimization", "duration": "30 min", "type": "video", "completed": True, "content": "Understand loss manifolds, learning rates, stochastic gradient descent, and Adam optimizer dynamics."},
                        {"id": "l-112", "title": "Handling Imbalanced Datasets & Outlier Detection", "duration": "25 min", "type": "practice", "completed": False, "content": "Implement SMOTE, focal loss, and isolation forests on real-world financial fraud data."}
                    ]
                },
                {
                    "id": "mod-2",
                    "title": "Module 2: Ensemble Models & Gradient Boosting",
                    "lessons": [
                        {"id": "l-113", "title": "Random Forests vs Gradient Boosted Trees (XGBoost/LightGBM)", "duration": "35 min", "type": "video", "completed": False, "content": "Explore bagging vs boosting variance-reduction mechanics and regularization."},
                        {"id": "l-114", "title": "Module Quiz: Supervised Learning Diagnostics", "duration": "15 min", "type": "quiz", "completed": False, "content": "Comprehensive test on ROC-AUC curves, precision-recall trade-offs, and bias-variance tradeoff."}
                    ]
                }
            ])
        },
        {
            "title": "Data Structures & Algorithms Mastery",
            "code": "CS-DSA-201",
            "category": "Core CS",
            "difficulty": "Intermediate",
            "estimated_duration": "10 weeks (40 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Comprehensive journey through algorithmic design techniques: Big-O analysis, binary search trees, heap priority queues, graph traversals (BFS/DFS, Dijkstra), dynamic programming, and greedy algorithms.",
            "prerequisites": json.dumps(["Python Programming"]),
            "tags": json.dumps(["Data Structures", "Algorithms", "Graphs", "Dynamic Programming", "Trees"]),
            "career_track": "Software Engineer",
            "is_elective": False,
            "rating": 4.8,
            "enrolled_count": 780,
            "image_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "NeetCode - Blind 75 & NeetCode 150 Algorithms",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@NeetCode",
                    "description": "Systematic step-by-step video breakdowns of all core algorithmic coding patterns.",
                    "badge": "Channel",
                    "author": "NeetCode"
                },
                {
                    "title": "Abdul Bari - Algorithms & Dynamic Programming Masterclass",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
                    "description": "World-class university lectures on Dynamic Programming, Greedy, Divide & Conquer, and Graphs.",
                    "badge": "Playlist",
                    "author": "Abdul Bari"
                },
                {
                    "title": "MIT OpenCourseWare - Introduction to Algorithms (6.006)",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb",
                    "description": "Flagship MIT computer science lectures covering data structures, sorting, trees, and graphs.",
                    "badge": "University Course",
                    "author": "MIT OCW"
                },
                {
                    "title": "freeCodeCamp - Algorithms & Data Structures Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=8hly31xKli0",
                    "description": "Foundations of asymptotic Big-O runtime analysis, linked lists, hash tables, and binary trees.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "NeetCode Interactive Roadmap",
                    "type": "practice",
                    "url": "https://neetcode.io/roadmap",
                    "description": "Visual tree roadmap structuring algorithms from Arrays to Dynamic Programming with video solutions.",
                    "badge": "Roadmap",
                    "author": "NeetCode.io"
                },
                {
                    "title": "LeetCode Top Interview 150 Study Plan",
                    "type": "practice",
                    "url": "https://leetcode.com/studyplan/top-interview-150/",
                    "description": "Curated collection of 150 classic interview problems across all algorithmic categories.",
                    "badge": "Practice Platform",
                    "author": "LeetCode"
                },
                {
                    "title": "VisuAlgo - Visualizing Data Structures & Algorithms",
                    "type": "website",
                    "url": "https://visualgo.net/en",
                    "description": "Interactive animated visualizations of tree traversals, graph searches, sorting, and heaps.",
                    "badge": "Interactive Tool",
                    "author": "VisuAlgo"
                },
                {
                    "title": "GeeksforGeeks Data Structures Portal",
                    "type": "docs",
                    "url": "https://www.geeksforgeeks.org/data-structures/",
                    "description": "Reference implementations, complexity tables, and code snippets in Python, C++, and Java.",
                    "badge": "Reference",
                    "author": "GeeksforGeeks"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Linear Structures & Algorithmic Complexity",
                    "lessons": [
                        {"id": "l-201", "title": "Asymptotic Analysis & Big-O Notation", "duration": "20 min", "type": "video", "completed": True, "content": "Analyze worst-case, average-case, and amortized runtime complexities across common operations."},
                        {"id": "l-202", "title": "Dynamic Arrays, Two-Pointers, and Sliding Window", "duration": "30 min", "type": "practice", "completed": True, "content": "Solve top LeetCode-style sliding window and two-pointer substring problems in O(N) time."}
                    ]
                },
                {
                    "id": "mod-2",
                    "title": "Module 2: Trees, Heaps, and Priority Queues",
                    "lessons": [
                        {"id": "l-203", "title": "Binary Search Trees & Self-Balancing AVL Trees", "duration": "30 min", "type": "video", "completed": False, "content": "Rotations, tree balancing, in-order traversals, and range-query optimizations."},
                        {"id": "l-204", "title": "Data Structures Diagnostic Quiz", "duration": "15 min", "type": "quiz", "completed": False, "content": "Test your mastery on graph representations, recursion stacks, and min-heap properties."}
                    ]
                }
            ])
        },
        {
            "title": "Data Analytics & Predictive Modeling",
            "code": "DS-AN-301",
            "category": "Data Science",
            "difficulty": "Intermediate",
            "estimated_duration": "6 weeks (25 hrs)",
            "learning_format": "Visual & Interactive",
            "description": "Transform messy raw datasets into actionable executive insights. Master SQL window functions, Pandas data wrangling, statistical hypothesis testing, and interactive dashboard creation.",
            "prerequisites": json.dumps(["Python Programming", "Database Systems & SQL"]),
            "tags": json.dumps(["Data Analytics", "SQL", "Pandas", "Statistics", "Tableau"]),
            "career_track": "Data Analyst",
            "is_elective": False,
            "rating": 4.7,
            "enrolled_count": 420,
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "Alex The Analyst - Full Data Analyst Bootcamp",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLUaB-1hjhk8GZOu0530ZPvwPXbES8n3nw",
                    "description": "End-to-end curriculum covering SQL, Excel, Tableau, Power BI, Python, and portfolio building.",
                    "badge": "Bootcamp Series",
                    "author": "Alex The Analyst"
                },
                {
                    "title": "freeCodeCamp - Data Analysis with Python & Pandas",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=r-uOLxNrNk8",
                    "description": "Comprehensive tutorial on Pandas data wrangling, NumPy vectorized math, and Matplotlib plotting.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Luke Barousse - Data Analytics Career Track",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@LukeBarousse",
                    "description": "Modern analytics tutorials, SQL query tricks, Python data visualization, and data engineering tips.",
                    "badge": "Channel",
                    "author": "Luke Barousse"
                },
                {
                    "title": "Ken Jee - Data Analytics Portfolio Project from Scratch",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PL2zmN_b2h65x6_P1f_qgI_8R_X0G2hZpT",
                    "description": "Step-by-step project build from data scraping and cleaning to exploratory analysis and presentation.",
                    "badge": "Project Series",
                    "author": "Ken Jee"
                },
                {
                    "title": "Pandas Official User Guide & Reference",
                    "type": "docs",
                    "url": "https://pandas.pydata.org/docs/user_guide/index.html",
                    "description": "The definitive documentation for DataFrame manipulation, groupby operations, and time-series resampling.",
                    "badge": "Official Docs",
                    "author": "Pandas Development Team"
                },
                {
                    "title": "Mode Analytics Interactive SQL Tutorial",
                    "type": "practice",
                    "url": "https://mode.com/sql-tutorial/",
                    "description": "Hands-on SQL practice with real databases covering window functions, CTEs, and cohort analysis.",
                    "badge": "Interactive Lab",
                    "author": "Mode Analytics"
                },
                {
                    "title": "Kaggle Open Datasets Hub",
                    "type": "website",
                    "url": "https://www.kaggle.com/datasets",
                    "description": "Explore and analyze over 100,000 public datasets with community notebooks and code benchmarks.",
                    "badge": "Datasets",
                    "author": "Kaggle"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Advanced SQL & Data Wrangling",
                    "lessons": [
                        {"id": "l-301", "title": "SQL Window Functions: ROW_NUMBER, RANK, DENSE_RANK", "duration": "25 min", "type": "video", "completed": True, "content": "Write complex analytical SQL queries with partitioning, frame clauses, and rolling aggregations."},
                        {"id": "l-302", "title": "High-Performance Pandas Transformations", "duration": "30 min", "type": "practice", "completed": False, "content": "Vectorized string manipulation, datetime resampling, and multi-index grouping in Pandas."}
                    ]
                }
            ])
        },
        {
            "title": "Modern Full-Stack Web Architecture with React & FastAPI",
            "code": "WEB-FS-301",
            "category": "Web Development",
            "difficulty": "Intermediate",
            "estimated_duration": "8 weeks (32 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Architect high-performance web applications with React, Vite, Tailwind CSS, FastAPI, and PostgreSQL. Implement JWT authentication, WebSocket real-time feeds, and responsive UI.",
            "prerequisites": json.dumps(["Python Programming"]),
            "tags": json.dumps(["React", "FastAPI", "TailwindCSS", "REST", "FullStack"]),
            "career_track": "Full Stack Developer",
            "is_elective": False,
            "rating": 4.9,
            "enrolled_count": 610,
            "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "Fireship - High-Speed Web Dev & Full-Stack Guides",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@Fireship",
                    "description": "Fast-paced architectural breakdowns of React, Next.js, FastAPI, WebSockets, and modern APIs.",
                    "badge": "Channel",
                    "author": "Fireship"
                },
                {
                    "title": "freeCodeCamp - React & FastAPI Full Stack Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA",
                    "description": "Build complete production web apps with React on the frontend and FastAPI on the backend.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "The Net Ninja - React 18 & Modern Hooks Tutorial",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
                    "description": "Clear step-by-step guide to React state, custom hooks, React Router, and Tailwind styling.",
                    "badge": "Playlist",
                    "author": "The Net Ninja"
                },
                {
                    "title": "Traversy Media - Modern Web Dev & REST APIs",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@TraversyMedia",
                    "description": "Practical crash courses on modern web tools, Tailwind CSS, Vite, and full-stack deployment.",
                    "badge": "Channel",
                    "author": "Traversy Media"
                },
                {
                    "title": "React Official Documentation (react.dev)",
                    "type": "docs",
                    "url": "https://react.dev/learn",
                    "description": "Official interactive documentation with live sandboxes, component state guides, and best practices.",
                    "badge": "Official Docs",
                    "author": "React Team"
                },
                {
                    "title": "FastAPI Official Documentation & Swagger UI Guide",
                    "type": "docs",
                    "url": "https://fastapi.tiangolo.com/",
                    "description": "High-performance Python web framework documentation with async handlers, Pydantic validation, and JWT auth.",
                    "badge": "Official Docs",
                    "author": "Tiangolo / FastAPI"
                },
                {
                    "title": "MDN Web Docs - Web Standards & JavaScript",
                    "type": "website",
                    "url": "https://developer.mozilla.org/",
                    "description": "The authoritative reference for HTML5, CSS3, ES6+ JavaScript, and Web APIs.",
                    "badge": "Reference",
                    "author": "Mozilla"
                },
                {
                    "title": "Tailwind CSS Documentation & Class Catalog",
                    "type": "docs",
                    "url": "https://tailwindcss.com/docs",
                    "description": "Utility-first CSS styling reference, responsive layout modifiers, and dark-mode styling.",
                    "badge": "Docs",
                    "author": "Tailwind Labs"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Modern React 18 & State Architecture",
                    "lessons": [
                        {"id": "l-401", "title": "Custom React Hooks & Context State Management", "duration": "25 min", "type": "video", "completed": True, "content": "Build reusable data-fetching hooks, memoized selectors, and auth context providers."},
                        {"id": "l-402", "title": "Building Smooth Animations with Framer Motion", "duration": "20 min", "type": "practice", "completed": True, "content": "Create fluid page transitions, gestures, layout animations, and glassmorphic micro-interactions."}
                    ]
                }
            ])
        },
        {
            "title": "Cloud-Native Infrastructure: Docker, Kubernetes & AWS",
            "code": "CLOUD-OPS-401",
            "category": "Cloud & DevOps",
            "difficulty": "Advanced",
            "estimated_duration": "7 weeks (28 hrs)",
            "learning_format": "Hands-on Lab & Practice",
            "description": "Containerize microservices with multi-stage Docker builds, orchestrate auto-scaling clusters with Kubernetes, and automate CI/CD deployments using GitHub Actions and AWS ECS.",
            "prerequisites": json.dumps(["Full Stack Web Development"]),
            "tags": json.dumps(["Docker", "Kubernetes", "AWS", "CI/CD", "DevOps"]),
            "career_track": "Cloud Architect",
            "is_elective": False,
            "rating": 4.8,
            "enrolled_count": 290,
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "TechWorld with Nana - Docker & Kubernetes Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLy7NrLkytTXD5ZbgdI_OoxsZk_aO57yvP",
                    "description": "Visual explanations of containerization, Pods, Deployments, Services, Ingress, and Helm charts.",
                    "badge": "Playlist",
                    "author": "TechWorld with Nana"
                },
                {
                    "title": "freeCodeCamp - AWS Certified Solutions Architect Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=SOTamWNgDKc",
                    "description": "Full 14-hour cloud training covering AWS EC2, S3, RDS, IAM, VPC, and serverless compute.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "NetworkChuck - Docker & Cloud DevOps Labs",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLIhvC56v63IJVXv0GJcl9vO5bd4544uSm",
                    "description": "Hands-on container networking, Compose stacks, reverse proxies, and infrastructure tutorials.",
                    "badge": "Playlist",
                    "author": "NetworkChuck"
                },
                {
                    "title": "Christian Lempa - HomeLab, K8s & Cloud Architecture",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@ChristianLempa",
                    "description": "Practical guides for bare-metal Kubernetes, CI/CD pipelines, GitOps, and cloud security.",
                    "badge": "Channel",
                    "author": "Christian Lempa"
                },
                {
                    "title": "Docker Official Documentation & Guides",
                    "type": "docs",
                    "url": "https://docs.docker.com/get-started/",
                    "description": "Official guides for multi-stage Dockerfiles, Docker Compose, caching strategies, and container registries.",
                    "badge": "Official Docs",
                    "author": "Docker Inc."
                },
                {
                    "title": "Kubernetes Official Interactive Documentation",
                    "type": "docs",
                    "url": "https://kubernetes.io/docs/tutorials/",
                    "description": "Interactive cluster tutorials, kubectl CLI cheatsheet, and Kubernetes architecture concepts.",
                    "badge": "Official Docs",
                    "author": "CNCF / Kubernetes"
                },
                {
                    "title": "AWS Skill Builder Free Digital Cloud Training",
                    "type": "website",
                    "url": "https://explore.skillbuilder.aws/",
                    "description": "Free official learning paths, self-paced courses, and certification preparation directly from AWS.",
                    "badge": "Free Training",
                    "author": "Amazon Web Services"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Containerization & Docker Best Practices",
                    "lessons": [
                        {"id": "l-501", "title": "Multi-Stage Dockerfiles & Image Size Optimization", "duration": "25 min", "type": "video", "completed": False, "content": "Reduce Docker image sizes from 1.2GB to 80MB using Alpine and multi-stage build caching."}
                    ]
                }
            ])
        },
        # Specialized Electives
        {
            "title": "Elective: Applied Artificial Intelligence & Generative LLMs",
            "code": "ELEC-AI-501",
            "category": "AI & ML",
            "difficulty": "Advanced",
            "estimated_duration": "6 weeks (24 hrs)",
            "learning_format": "Interactive & Research",
            "description": "Specialization elective in Transformer architectures, Prompt Engineering, Retrieval-Augmented Generation (RAG) with vector databases, and fine-tuning open-source LLMs.",
            "prerequisites": json.dumps(["Machine Learning Fundamentals", "Python Programming"]),
            "tags": json.dumps(["LLM", "Transformers", "RAG", "Generative AI", "LangChain"]),
            "career_track": "AI Engineer",
            "is_elective": True,
            "rating": 4.95,
            "enrolled_count": 480,
            "image_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "Andrej Karpathy - Let's build GPT: from scratch, in code",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=kCc8FmEb1nY",
                    "description": "The definitive 2-hour lecture building nanoGPT from mathematical first principles with PyTorch.",
                    "badge": "Master Lecture",
                    "author": "Andrej Karpathy"
                },
                {
                    "title": "freeCodeCamp - LangChain & Generative AI Bootcamp",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=lG7Uxts9SXs",
                    "description": "Build LLM applications, RAG pipelines, agents, and custom tool integrations using LangChain.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "James Briggs - Vector Databases, Embeddings & Production RAG",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@JamesBriggs",
                    "description": "Deep dive into vector search, Pinecone, FAISS, hybrid search, and semantic similarity.",
                    "badge": "Channel",
                    "author": "James Briggs"
                },
                {
                    "title": "Yannic Kilcher - AI Research Paper Breakdowns",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@YannicKilcher",
                    "description": "Technical analysis of groundbreaking papers in Large Language Models, Transformer architectures, and Diffusion.",
                    "badge": "Research Channel",
                    "author": "Yannic Kilcher"
                },
                {
                    "title": "Hugging Face NLP & Transformers Course",
                    "type": "practice",
                    "url": "https://huggingface.co/learn/nlp-course",
                    "description": "Free hands-on course covering tokenizers, fine-tuning Transformers, and deployment on Hugging Face Hub.",
                    "badge": "Free Course",
                    "author": "Hugging Face"
                },
                {
                    "title": "Google Gemini AI Developer Documentation",
                    "type": "docs",
                    "url": "https://ai.google.dev/",
                    "description": "Official guides for Gemini 2.5/3.5 models, multimodal prompts, structured JSON outputs, and function calling.",
                    "badge": "Official Docs",
                    "author": "Google DeepMind"
                },
                {
                    "title": "LangChain & LangGraph Official Documentation",
                    "type": "docs",
                    "url": "https://python.langchain.com/docs/get_started/introduction",
                    "description": "The official framework documentation for building stateful multi-agent systems and RAG pipelines.",
                    "badge": "Official Docs",
                    "author": "LangChain"
                }
            ]),
            "syllabus": json.dumps([
                {"id": "mod-e1", "title": "Module 1: Attention Mechanisms & Transformer Architecture", "lessons": []},
                {"id": "mod-e2", "title": "Module 2: Building Production RAG Pipelines with Vector DBs", "lessons": []},
                {"id": "mod-e3", "title": "Module 3: LoRA & Parameter-Efficient Fine-Tuning", "lessons": []}
            ])
        },
        {
            "title": "Elective: Big Data Engineering & Distributed Systems",
            "code": "ELEC-DS-502",
            "category": "Data Science",
            "difficulty": "Advanced",
            "estimated_duration": "7 weeks (28 hrs)",
            "learning_format": "Hands-on Lab & Practice",
            "description": "Specialization elective covering Apache Spark, Kafka streaming pipelines, Parquet columnar storage, Lakehouse architectures (Delta Lake), and distributed consensus algorithms.",
            "prerequisites": json.dumps(["Database Systems & SQL", "Python Programming"]),
            "tags": json.dumps(["Spark", "Kafka", "Data Lake", "Distributed Systems", "Big Data"]),
            "career_track": "Data Engineer",
            "is_elective": True,
            "rating": 4.85,
            "enrolled_count": 310,
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Apache Spark & PySpark Masterclass",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=_C8kWso4ne4",
                    "description": "Hands-on distributed data processing with PySpark, DataFrame transformations, and Spark SQL.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Data Science Garage - Apache Kafka Real-Time Streaming",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLt1SIbA8guus-b_Uf4Y5X_o48B8rRk28n",
                    "description": "Real-time event streaming architectures, topics, partitions, producers, consumers, and Kafka Connect.",
                    "badge": "Playlist",
                    "author": "Data Science Garage"
                },
                {
                    "title": "MIT 6.824 - Distributed Systems Lectures (Robert Morris)",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2hErI4uutuwxGE2QVPky",
                    "description": "World-leading MIT course on Raft consensus, MapReduce, fault-tolerance, and distributed storage.",
                    "badge": "University Course",
                    "author": "MIT"
                },
                {
                    "title": "Seattle Data Guy - Modern Data Engineering Best Practices",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@SeattleDataGuy",
                    "description": "Data lakehouse blueprints, Airflow orchestration, dbt data modeling, and streaming architectures.",
                    "badge": "Channel",
                    "author": "Seattle Data Guy"
                },
                {
                    "title": "Apache Spark Official Documentation",
                    "type": "docs",
                    "url": "https://spark.apache.org/docs/latest/",
                    "description": "Official cluster deployment guides, PySpark API reference, Catalyst optimizer, and Spark Streaming docs.",
                    "badge": "Official Docs",
                    "author": "Apache Software Foundation"
                },
                {
                    "title": "Confluent Kafka Developer Learning Hub",
                    "type": "website",
                    "url": "https://developer.confluent.io/",
                    "description": "Interactive hands-on tutorials, code recipes, and architecture patterns for event streaming systems.",
                    "badge": "Learning Hub",
                    "author": "Confluent"
                },
                {
                    "title": "Delta Lake Open Source Lakehouse Guide",
                    "type": "docs",
                    "url": "https://delta.io/",
                    "description": "ACID transactions, schema enforcement, and time-travel on distributed Apache Spark data lakes.",
                    "badge": "Docs",
                    "author": "Delta Lake"
                }
            ]),
            "syllabus": json.dumps([
                {"id": "mod-e1", "title": "Module 1: Distributed Computing Paradigms & Apache Spark", "lessons": []},
                {"id": "mod-e2", "title": "Module 2: Real-time Event Streaming with Apache Kafka", "lessons": []},
                {"id": "mod-e3", "title": "Module 3: Modern Data Lakehouse Architecture", "lessons": []}
            ])
        },
        {
            "title": "Elective: Cloud Architecture & Serverless Microservices",
            "code": "ELEC-CLOUD-503",
            "category": "Cloud & DevOps",
            "difficulty": "Advanced",
            "estimated_duration": "6 weeks (22 hrs)",
            "learning_format": "Interactive & Video",
            "description": "Specialization elective focusing on AWS Lambda, API Gateway, event-driven microservice patterns, Terraform Infrastructure-as-Code, and zero-trust cloud network security.",
            "prerequisites": json.dumps(["Cloud Computing & DevOps"]),
            "tags": json.dumps(["Serverless", "AWS Lambda", "Terraform", "Microservices", "Cloud Security"]),
            "career_track": "Cloud Architect",
            "is_elective": True,
            "rating": 4.88,
            "enrolled_count": 275,
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "Be A Better Dev - AWS Lambda, DynamoDB & Serverless",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@BeABetterDev",
                    "description": "Deep architectural guides for building resilient, event-driven serverless systems on AWS.",
                    "badge": "Channel",
                    "author": "Be A Better Dev"
                },
                {
                    "title": "freeCodeCamp - HashiCorp Terraform Associate Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=V4waklkBC38",
                    "description": "Complete Infrastructure-as-Code masterclass for provisioning multi-cloud resources declaratively.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Serverless Guru - Production Serverless Design Patterns",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@ServerlessGuru",
                    "description": "EventBridge architectures, SQS/SNS fanout patterns, cold start optimization, and microservice decoupling.",
                    "badge": "Channel",
                    "author": "Serverless Guru"
                },
                {
                    "title": "Marcia Villalba - FooBar Serverless on AWS",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@FooBar_Serverless",
                    "description": "Step-by-step guides on AWS Step Functions, API Gateway, Lambda, and CloudWatch monitoring.",
                    "badge": "Channel",
                    "author": "FooBar Serverless"
                },
                {
                    "title": "Serverless Framework Official Documentation",
                    "type": "docs",
                    "url": "https://www.serverless.com/framework/docs",
                    "description": "YAML configuration guide for packaging, deploying, and managing serverless functions across clouds.",
                    "badge": "Official Docs",
                    "author": "Serverless Inc."
                },
                {
                    "title": "HashiCorp Learn - Terraform Cloud & CLI Tutorials",
                    "type": "practice",
                    "url": "https://developer.hashicorp.com/terraform/tutorials",
                    "description": "Interactive tutorials for creating, modifying, and destroying cloud infrastructure with Terraform.",
                    "badge": "Interactive Lab",
                    "author": "HashiCorp"
                },
                {
                    "title": "AWS Well-Architected Framework Documentation",
                    "type": "docs",
                    "url": "https://aws.amazon.com/architecture/well-architected/",
                    "description": "Architectural best practices across Security, Reliability, Performance, Cost, and Operational Excellence.",
                    "badge": "Architecture Docs",
                    "author": "Amazon Web Services"
                }
            ]),
            "syllabus": json.dumps([
                {"id": "mod-e1", "title": "Module 1: Serverless Patterns & Event-Driven Architectures", "lessons": []},
                {"id": "mod-e2", "title": "Module 2: Declarative Infrastructure with Terraform", "lessons": []},
                {"id": "mod-e3", "title": "Module 3: High-Availability & Disaster Recovery Design", "lessons": []}
            ])
        },
        {
            "title": "Elective: Cybersecurity, Threat Analysis & Network Defense",
            "code": "ELEC-SEC-504",
            "category": "Cybersecurity",
            "difficulty": "Advanced",
            "estimated_duration": "8 weeks (30 hrs)",
            "learning_format": "Hands-on Lab & Practice",
            "description": "Specialization elective in vulnerability assessment, reverse engineering, TLS protocol handshake internals, penetration testing tools, and defensive SIEM logging.",
            "prerequisites": json.dumps(["Cybersecurity & Network Defense"]),
            "tags": json.dumps(["Security", "Penetration Testing", "Cryptography", "Network Defense", "SIEM"]),
            "career_track": "Cybersecurity Specialist",
            "is_elective": True,
            "rating": 4.9,
            "enrolled_count": 390,
            "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "John Hammond - Malware Analysis, CTFs & Threat Hunting",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@_JohnHammond",
                    "description": "Hands-on walkthroughs of exploit analysis, reverse engineering, ransomware inspection, and threat detection.",
                    "badge": "Channel",
                    "author": "John Hammond"
                },
                {
                    "title": "David Bombal - Ethical Hacking & Wireshark Packet Analysis",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@davidbombal",
                    "description": "Deep packet inspection, network protocols, penetration testing tools, and defensive tactics.",
                    "badge": "Channel",
                    "author": "David Bombal"
                },
                {
                    "title": "freeCodeCamp - CompTIA Security+ & Ethical Hacking Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=9GdX266Z3Sg",
                    "description": "Comprehensive 15-hour course on cryptography, network defense, threat actors, and digital forensics.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "LiveOverflow - Binary Exploitation & Web Security",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@LiveOverflow",
                    "description": "Buffer overflows, memory layout, XSS, assembly reverse engineering, and security research concepts.",
                    "badge": "Channel",
                    "author": "LiveOverflow"
                },
                {
                    "title": "TryHackMe - Hands-on Cyber Security Training",
                    "type": "practice",
                    "url": "https://tryhackme.com/",
                    "description": "Hands-on browser-based virtual labs for penetration testing, network defense, and CTF challenges.",
                    "badge": "Hands-on Lab",
                    "author": "TryHackMe"
                },
                {
                    "title": "Hack The Box Academy",
                    "type": "practice",
                    "url": "https://academy.hackthebox.com/",
                    "description": "Step-by-step offensive and defensive cybersecurity training modules and practical target machines.",
                    "badge": "Academy",
                    "author": "Hack The Box"
                },
                {
                    "title": "OWASP Top 10 Security Project",
                    "type": "docs",
                    "url": "https://owasp.org/www-project-top-ten/",
                    "description": "The globally recognized awareness standard for web application vulnerabilities and remediation.",
                    "badge": "Standard Docs",
                    "author": "OWASP Foundation"
                },
                {
                    "title": "PortSwigger Web Security Academy",
                    "type": "website",
                    "url": "https://portswigger.net/web-security",
                    "description": "Free interactive web vulnerability labs and tutorials created by the authors of Burp Suite.",
                    "badge": "Free Labs",
                    "author": "PortSwigger"
                }
            ]),
            "syllabus": json.dumps([
                {"id": "mod-e1", "title": "Module 1: Offensive Security & Vulnerability Exploitation", "lessons": []},
                {"id": "mod-e2", "title": "Module 2: Cryptographic Protocols & Key Exchange Mechanisms", "lessons": []},
                {"id": "mod-e3", "title": "Module 3: Threat Hunting & Incident Response Playbooks", "lessons": []}
            ])
        },
        # Beginner Foundational Curriculum
        {
            "title": "Python Foundations & Programming Basics",
            "code": "CS-PY-101",
            "category": "Core CS",
            "difficulty": "Beginner",
            "estimated_duration": "4 weeks (16 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Learn programming from absolute scratch using Python 3. Master basic syntax, data types, control structures, loops, functions, lists, dictionaries, error handling, and object-oriented fundamentals.",
            "prerequisites": json.dumps(["None - Absolute Beginner"]),
            "tags": json.dumps(["Python", "Beginner", "Programming Basics", "Functions", "OOP", "Variables"]),
            "career_track": "Software Engineer",
            "is_elective": False,
            "rating": 4.92,
            "enrolled_count": 890,
            "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Python for Beginners Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                    "description": "Comprehensive 4.5-hour beginner course covering variables, strings, numbers, lists, tuples, functions, if statements, dictionaries, and classes.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Programming with Mosh - Python Tutorial for Beginners",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                    "description": "Clear step-by-step introduction for absolute beginners building real-world Python mini-projects.",
                    "badge": "Tutorial",
                    "author": "Programming with Mosh"
                },
                {
                    "title": "Python.org Official Beginner's Guide",
                    "type": "docs",
                    "url": "https://wiki.python.org/moin/BeginnersGuide",
                    "description": "Official Python Foundation guide for newcomers, non-programmers, and junior students.",
                    "badge": "Official Docs",
                    "author": "Python Software Foundation"
                },
                {
                    "title": "W3Schools Interactive Python Tutorial",
                    "type": "website",
                    "url": "https://www.w3schools.com/python/",
                    "description": "Interactive browser exercises to test syntax, loops, functions, and string formatting.",
                    "badge": "Interactive",
                    "author": "W3Schools"
                },
                {
                    "title": "HackerRank Python (Basic) Skills Certification",
                    "type": "practice",
                    "url": "https://www.hackerrank.com/skills-verification/python_basic",
                    "description": "Free skill verification certification assessing basic Python concepts, lists, and functions.",
                    "badge": "Free Certificate",
                    "author": "HackerRank"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Python Basics & Control Flow",
                    "lessons": [
                        {"id": "l-101", "title": "Variables, Data Types, and User Input", "duration": "20 min", "type": "video", "completed": True, "content": "Introduction to integers, floats, strings, booleans, and type conversion."},
                        {"id": "l-102", "title": "Conditionals, Comparison Operators & Logic", "duration": "25 min", "type": "practice", "completed": True, "content": "Master if-elif-else branching and logical operators (and, or, not)."},
                        {"id": "l-103", "title": "For Loops, While Loops & Iteration", "duration": "20 min", "type": "practice", "completed": False, "content": "Using range(), break, continue, and iterating over sequences."}
                    ]
                },
                {
                    "id": "mod-2",
                    "title": "Module 2: Data Collections & Functions",
                    "lessons": [
                        {"id": "l-104", "title": "Lists, Tuples, Dictionaries, and Sets", "duration": "30 min", "type": "video", "completed": False, "content": "Indexing, slicing, key-value lookups, and collection methods."},
                        {"id": "l-105", "title": "Writing Functions, Parameters & Return Values", "duration": "25 min", "type": "practice", "completed": False, "content": "Positional arguments, keyword arguments, default parameters, and variable scope."}
                    ]
                }
            ])
        },
        {
            "title": "Web Development Fundamentals: HTML, CSS & Modern JavaScript",
            "code": "WEB-FS-101",
            "category": "Web Development",
            "difficulty": "Beginner",
            "estimated_duration": "4 weeks (18 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Zero-to-hero introduction to web development. Build modern, responsive websites using semantic HTML5, CSS3 Flexbox/Grid, and modern ES6+ JavaScript for DOM interactivity.",
            "prerequisites": json.dumps(["None - Absolute Beginner"]),
            "tags": json.dumps(["HTML5", "CSS3", "JavaScript", "DOM", "Frontend", "Beginner", "Responsive Design"]),
            "career_track": "Frontend Developer",
            "is_elective": False,
            "rating": 4.88,
            "enrolled_count": 940,
            "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - HTML & CSS Full Course for Beginners",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=kUMe1FH4CHE",
                    "description": "Comprehensive 11-hour course building responsive layouts from scratch.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Traversy Media - Modern JavaScript Crash Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                    "description": "Beginner friendly walkthrough of JavaScript variables, arrays, objects, loops, and DOM manipulation.",
                    "badge": "Crash Course",
                    "author": "Traversy Media"
                },
                {
                    "title": "MDN Web Docs - Learn Web Development",
                    "type": "docs",
                    "url": "https://developer.mozilla.org/en-US/docs/Learn",
                    "description": "Mozilla's structured beginner curriculum for HTML, CSS, JavaScript, and Web APIs.",
                    "badge": "Official Docs",
                    "author": "Mozilla MDN"
                },
                {
                    "title": "freeCodeCamp Responsive Web Design Certification",
                    "type": "practice",
                    "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
                    "description": "Free accredited certificate building 5 responsive web projects in HTML & CSS.",
                    "badge": "Free Certificate",
                    "author": "freeCodeCamp.org"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Semantic HTML5 & Modern CSS3 Layouts",
                    "lessons": [
                        {"id": "l-101", "title": "HTML Tags, Forms, and Accessibility", "duration": "25 min", "type": "video", "completed": True, "content": "Learn semantic document structure and accessible forms."},
                        {"id": "l-102", "title": "Flexbox & CSS Grid Mastery", "duration": "30 min", "type": "practice", "completed": True, "content": "Build multi-column responsive grid systems."}
                    ]
                }
            ])
        },
        {
            "title": "Relational Databases & SQL Foundations",
            "code": "DS-SQL-101",
            "category": "Data Science",
            "difficulty": "Beginner",
            "estimated_duration": "3 weeks (12 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Master SQL query writing from ground zero. Query relational databases with SELECT, WHERE, ORDER BY, GROUP BY, aggregate functions (SUM, AVG, COUNT), INNER/LEFT JOINs, and database table creation.",
            "prerequisites": json.dumps(["None"]),
            "tags": json.dumps(["SQL", "PostgreSQL", "Database", "Queries", "Data", "Beginner"]),
            "career_track": "Data Analyst",
            "is_elective": False,
            "rating": 4.85,
            "enrolled_count": 760,
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "Alex The Analyst - SQL for Beginners Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=7S_tz1z_5bA",
                    "description": "Complete beginner SQL tutorial explaining SELECT statements, WHERE clauses, GROUP BY, and JOINs.",
                    "badge": "Full Course",
                    "author": "Alex The Analyst"
                },
                {
                    "title": "freeCodeCamp - SQL Database Course for Beginners",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                    "description": "Learn schema design, CRUD operations, relationships, and foreign keys.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "SQLBolt - Interactive SQL Lessons",
                    "type": "practice",
                    "url": "https://sqlbolt.com/",
                    "description": "Interactive browser exercises to practice SQL queries step by step.",
                    "badge": "Interactive Lab",
                    "author": "SQLBolt"
                },
                {
                    "title": "HackerRank SQL (Basic) Certification",
                    "type": "practice",
                    "url": "https://www.hackerrank.com/skills-verification/sql_basic",
                    "description": "Verify your SQL querying, filtering, and joining skills with a free verified certificate.",
                    "badge": "Free Certificate",
                    "author": "HackerRank"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Querying Tables & Filtering Data",
                    "lessons": [
                        {"id": "l-101", "title": "SELECT, DISTINCT, WHERE, and Operators", "duration": "20 min", "type": "video", "completed": True, "content": "Filter records using AND, OR, NOT, IN, BETWEEN, and LIKE pattern matching."},
                        {"id": "l-102", "title": "GROUP BY, HAVING, and Aggregate Calculations", "duration": "25 min", "type": "practice", "completed": False, "content": "Compute sums, averages, and group counts."}
                    ]
                }
            ])
        },
        {
            "title": "AI & Machine Learning Concepts for Beginners",
            "code": "AI-ML-101",
            "category": "AI & ML",
            "difficulty": "Beginner",
            "estimated_duration": "4 weeks (14 hrs)",
            "learning_format": "Visual & Interactive",
            "description": "An intuitive, accessible introduction to Artificial Intelligence and Machine Learning. Understand supervised vs unsupervised learning, regression, classification, decision trees, neural network intuition, and AI ethics without complex mathematical formulas.",
            "prerequisites": json.dumps(["Basic Computer Literacy"]),
            "tags": json.dumps(["AI", "Machine Learning", "Intro", "Beginner", "Data Science", "Neural Networks"]),
            "career_track": "AI Engineer",
            "is_elective": False,
            "rating": 4.90,
            "enrolled_count": 820,
            "image_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "StatQuest with Josh Starmer - Machine Learning Basics",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
                    "description": "Crystal-clear visual walkthroughs of Decision Trees, Linear Regression, and Logistic Regression.",
                    "badge": "Visual Series",
                    "author": "StatQuest"
                },
                {
                    "title": "Google Cloud - Introduction to Generative AI Course",
                    "type": "website",
                    "url": "https://www.cloudskillsboost.google/course_templates/536",
                    "description": "Free introductory learning path explaining what Generative AI is and how Large Language Models work.",
                    "badge": "Free Certificate",
                    "author": "Google Cloud"
                },
                {
                    "title": "Elements of AI - University of Helsinki",
                    "type": "website",
                    "url": "https://www.elementsofai.com/",
                    "description": "Award-winning free online course covering what AI can and cannot do with real-world case studies.",
                    "badge": "Free Certificate",
                    "author": "University of Helsinki"
                },
                {
                    "title": "Kaggle - Intro to Machine Learning",
                    "type": "practice",
                    "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
                    "description": "Hands-on browser coding lessons building your first ML model in Python with Scikit-Learn.",
                    "badge": "Interactive Lab",
                    "author": "Kaggle"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: What is AI & Machine Learning?",
                    "lessons": [
                        {"id": "l-101", "title": "Supervised vs Unsupervised vs Reinforcement Learning", "duration": "20 min", "type": "video", "completed": True, "content": "How machines learn patterns from labeled data and discover clusters."},
                        {"id": "l-102", "title": "Regression vs Classification Explained Visually", "duration": "25 min", "type": "practice", "completed": False, "content": "Predicting continuous values vs categorical classes."}
                    ]
                }
            ])
        },
        {
            "title": "Cloud Computing & Linux Fundamentals",
            "code": "CLOUD-OPS-101",
            "category": "Cloud & DevOps",
            "difficulty": "Beginner",
            "estimated_duration": "3 weeks (12 hrs)",
            "learning_format": "Hands-on Lab & Practice",
            "description": "Master essential cloud fundamentals: Linux command-line terminal, file system navigation, permissions, networking basics (IP addresses, DNS, ports), and AWS/GCP cloud services overview (IaaS, PaaS, SaaS).",
            "prerequisites": json.dumps(["None"]),
            "tags": json.dumps(["Cloud", "Linux", "AWS", "DevOps", "Beginner", "Bash", "Networking"]),
            "career_track": "Cloud Architect",
            "is_elective": False,
            "rating": 4.87,
            "enrolled_count": 680,
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "NetworkChuck - Linux for Beginners Full Series",
                    "type": "youtube",
                    "url": "https://www.youtube.com/playlist?list=PLIhvC56v63IKioClkSNDjW7iz-6TFvLwS",
                    "description": "Fun, beginner-friendly Linux terminal tutorial covering navigation, permissions, and package managers.",
                    "badge": "Playlist",
                    "author": "NetworkChuck"
                },
                {
                    "title": "freeCodeCamp - Cloud Computing Fundamentals",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=2LaAJq1lB1Q",
                    "description": "Understand cloud service models, virtualization, regions, and basic AWS cloud infrastructure.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "AWS Cloud Practitioner Essentials",
                    "type": "website",
                    "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials",
                    "description": "Official free foundational training directly from Amazon Web Services.",
                    "badge": "Free Course",
                    "author": "Amazon Web Services"
                },
                {
                    "title": "OverTheWire Bandit - Linux Practice Wargames",
                    "type": "practice",
                    "url": "https://overthewire.org/wargames/bandit/",
                    "description": "Gamified terminal challenges to learn Linux shell commands from absolute beginner to advanced.",
                    "badge": "Interactive Lab",
                    "author": "OverTheWire"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Linux Command Line & File Permissions",
                    "lessons": [
                        {"id": "l-101", "title": "Terminal Navigation: cd, ls, pwd, mkdir, rm", "duration": "20 min", "type": "video", "completed": True, "content": "Master shell navigation and file creation."},
                        {"id": "l-102", "title": "Permissions: chmod, chown, and user groups", "duration": "20 min", "type": "practice", "completed": False, "content": "Read, write, execute permissions and numeric modes."}
                    ]
                }
            ])
        },
        {
            "title": "Cybersecurity & Digital Safety Essentials",
            "code": "SEC-101",
            "category": "Cybersecurity",
            "difficulty": "Beginner",
            "estimated_duration": "3 weeks (10 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Learn the fundamentals of cybersecurity and digital defense: the CIA triad (Confidentiality, Integrity, Availability), password security, encryption basics, phishing prevention, network protocols (HTTP/HTTPS, DNS), and digital hygiene.",
            "prerequisites": json.dumps(["None"]),
            "tags": json.dumps(["Cybersecurity", "Security", "Networking", "Beginner", "Privacy", "Encryption"]),
            "career_track": "Cybersecurity Specialist",
            "is_elective": False,
            "rating": 4.89,
            "enrolled_count": 710,
            "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Cybersecurity for Beginners Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=U_P23uqUAtQ",
                    "description": "Complete introductory guide to threat modeling, common cyber attacks, and defensive tactics.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Cisco Networking Academy - Introduction to Cybersecurity",
                    "type": "website",
                    "url": "https://www.skillsforall.com/course/introduction-to-cybersecurity",
                    "description": "Free accredited Cisco digital badge course exploring the world of cybersecurity and defense.",
                    "badge": "Free Certificate",
                    "author": "Cisco"
                },
                {
                    "title": "TryHackMe - Pre-Security Learning Path",
                    "type": "practice",
                    "url": "https://tryhackme.com/path/outline/presecurity",
                    "description": "Interactive browser labs teaching cybersecurity basics, networking, and web applications.",
                    "badge": "Interactive Lab",
                    "author": "TryHackMe"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Core Security Concepts & Threat Defense",
                    "lessons": [
                        {"id": "l-101", "title": "The CIA Triad & Threat Types", "duration": "20 min", "type": "video", "completed": True, "content": "Understanding malware, phishing, social engineering, and denial of service."},
                        {"id": "l-102", "title": "Encryption, Hashing, and Password Security", "duration": "20 min", "type": "practice", "completed": False, "content": "Symmetric vs asymmetric encryption and secure hashing algorithms."}
                    ]
                }
            ])
        },
        {
            "title": "Introduction to Data Structures & Problem Solving",
            "code": "CS-DSA-101",
            "category": "Core CS",
            "difficulty": "Beginner",
            "estimated_duration": "5 weeks (20 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Master foundational data structures and problem solving: arrays, strings, dynamic lists, linear search, binary search, recursion basics, and introductory Big-O time and space complexity analysis.",
            "prerequisites": json.dumps(["Python Foundations"]),
            "tags": json.dumps(["Data Structures", "Algorithms", "Beginner", "Arrays", "Recursion", "Big-O"]),
            "career_track": "Software Engineer",
            "is_elective": False,
            "rating": 4.91,
            "enrolled_count": 850,
            "image_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Data Structures for Beginners Full Course",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=zg9ih6SVACc",
                    "description": "Clear step-by-step introduction to arrays, linked lists, stacks, queues, and Big-O notation.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "NeetCode - Beginner Problem Solving & Arrays",
                    "type": "youtube",
                    "url": "https://www.youtube.com/@NeetCode",
                    "description": "Introductory guide to arrays, two-pointers, hashing, and linear scans.",
                    "badge": "Channel",
                    "author": "NeetCode"
                },
                {
                    "title": "VisuAlgo - Interactive Visualizer for Beginners",
                    "type": "website",
                    "url": "https://visualgo.net/en",
                    "description": "Interactive animated visualizations of sorting, searching, and list operations.",
                    "badge": "Interactive Tool",
                    "author": "VisuAlgo"
                },
                {
                    "title": "HackerRank Problem Solving (Basic) Certification",
                    "type": "practice",
                    "url": "https://www.hackerrank.com/skills-verification/problem_solving_basic",
                    "description": "Free verified certificate testing basic algorithmic problem solving and array manipulations.",
                    "badge": "Free Certificate",
                    "author": "HackerRank"
                }
            ]),
            "syllabus": json.dumps([
                {
                    "id": "mod-1",
                    "title": "Module 1: Arrays, Strings & Linear Searching",
                    "lessons": [
                        {"id": "l-101", "title": "Memory Layout of Arrays & Big-O Time Complexity", "duration": "20 min", "type": "video", "completed": True, "content": "Understand O(1) random indexing vs O(N) linear lookups."},
                        {"id": "l-102", "title": "Binary Search Algorithm from Scratch", "duration": "25 min", "type": "practice", "completed": False, "content": "Divide and conquer logarithmic O(log N) search on sorted arrays."}
                    ]
                }
            ])
        },
        {
            "title": "Elective: Introduction to Mobile App Development with Flutter & Dart",
            "code": "ELEC-MOB-101",
            "category": "Web Development",
            "difficulty": "Beginner",
            "estimated_duration": "5 weeks (20 hrs)",
            "learning_format": "Interactive & Practice",
            "description": "Specialization elective in multi-platform mobile application development. Learn Dart syntax, Flutter widget trees, reactive state management, and mobile UI design for iOS and Android.",
            "prerequisites": json.dumps(["Programming Basics"]),
            "tags": json.dumps(["Flutter", "Dart", "Mobile", "Beginner", "iOS", "Android", "UI Design"]),
            "career_track": "Mobile App Developer",
            "is_elective": True,
            "rating": 4.88,
            "enrolled_count": 340,
            "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
            "free_resources": json.dumps([
                {
                    "title": "freeCodeCamp - Flutter & Dart Full Course for Beginners",
                    "type": "youtube",
                    "url": "https://www.youtube.com/watch?v=VPvVD8t02U8",
                    "description": "Build multi-platform mobile applications from scratch using Flutter and Dart.",
                    "badge": "Full Course",
                    "author": "freeCodeCamp.org"
                },
                {
                    "title": "Flutter Official Documentation & Widget Catalog",
                    "type": "docs",
                    "url": "https://docs.flutter.dev/",
                    "description": "Official interactive documentation, widget index, and sample apps from Google.",
                    "badge": "Official Docs",
                    "author": "Google Flutter"
                }
            ]),
            "syllabus": json.dumps([
                {"id": "mod-e1", "title": "Module 1: Dart Fundamentals & Widget Tree Architecture", "lessons": []}
            ])
        }
    ]

    # Check if courses already seeded
    if db.query(Course).count() > 0:
        # Sync free resources, difficulty, duration and insert missing courses
        for c_data in courses_data:
            course = db.query(Course).filter(Course.code == c_data["code"]).first()
            if course:
                course.title = c_data.get("title", course.title)
                course.category = c_data.get("category", course.category)
                course.difficulty = c_data.get("difficulty", course.difficulty)
                course.estimated_duration = c_data.get("estimated_duration", course.estimated_duration)
                course.learning_format = c_data.get("learning_format", course.learning_format)
                course.description = c_data.get("description", course.description)
                course.free_resources = c_data.get("free_resources", "[]")
                course.tags = c_data.get("tags", course.tags)
                course.image_url = c_data.get("image_url", course.image_url)
                course.is_elective = c_data.get("is_elective", course.is_elective)
                course.career_track = c_data.get("career_track", course.career_track)
                db.add(course)
            else:
                new_c = Course(**c_data)
                db.add(new_c)
        db.commit()
        return

    print("Seeding StudyPath database with realistic EdTech catalog...")

    # 1. Subjects
    subjects_data = [
        {"name": "Python Programming", "code": "CS101", "category": "Core CS", "description": "Core syntax, data types, OOP, standard library, and algorithmic problem solving in Python."},
        {"name": "Data Structures & Algorithms", "code": "CS201", "category": "Core CS", "description": "Arrays, linked lists, trees, graphs, dynamic programming, sorting and searching algorithms."},
        {"name": "Mathematics for Computing", "code": "MATH101", "category": "Mathematics", "description": "Linear algebra, discrete math, probability, calculus and optimization foundations."},
        {"name": "Database Systems & SQL", "code": "CS202", "category": "Data Science", "description": "Relational database design, ACID properties, normal forms, indexing and SQL optimization."},
        {"name": "Machine Learning Fundamentals", "code": "AI301", "category": "AI & ML", "description": "Supervised, unsupervised learning, regression, classification, decision trees and evaluation."},
        {"name": "Full Stack Web Development", "code": "WEB201", "category": "Web Development", "description": "React, modern JavaScript/TypeScript, REST APIs, state management and frontend architecture."},
        {"name": "Cloud Computing & DevOps", "code": "CLOUD301", "category": "Cloud & DevOps", "description": "Docker, Kubernetes, AWS/GCP services, CI/CD pipelines, and microservices architecture."},
        {"name": "Cybersecurity & Network Defense", "code": "SEC301", "category": "Cybersecurity", "description": "Cryptography, authentication protocols, OWASP top 10, penetration testing and security auditing."}
    ]

    for s in subjects_data:
        subj = Subject(**s)
        db.add(subj)
    db.commit()

    course_instances = []
    for c_data in courses_data:
        course = Course(**c_data)
        db.add(course)
        course_instances.append(course)
    db.commit()

    # 3. Quizzes & Questions
    python_course = next(c for c in course_instances if "CS-PY-301" in c.code)
    dsa_course = next(c for c in course_instances if "CS-DSA-201" in c.code)
    ml_course = next(c for c in course_instances if "AI-ML-401" in c.code)
    web_course = next(c for c in course_instances if "WEB-FS-301" in c.code)

    quizzes_data = [
        {
            "course_id": python_course.id,
            "title": "Advanced Python Diagnostics & Optimization Quiz",
            "description": "Evaluate your proficiency in decorators, memory management, generator expressions, and asynchronous execution in Python.",
            "time_limit_minutes": 10,
            "passing_score": 75.0,
            "questions": [
                {
                    "question_text": "What does functools.wraps do when applied inside a custom decorator function?",
                    "options": json.dumps([
                        "It speeds up execution of the decorated function by 2x.",
                        "It preserves the original function's name, docstring, and metadata.",
                        "It converts the function into an asynchronous coroutine.",
                        "It forces the decorator to run inside a separate thread pool."
                    ]),
                    "correct_option_index": 1,
                    "explanation": "functools.wraps is a convenience decorator that copies __name__, __doc__, and annotations from the wrapped function to the wrapper function.",
                    "subject_tag": "Python Programming",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "Which built-in Python module is best suited for streaming large multi-gigabyte log files without loading the full file into RAM?",
                    "options": json.dumps([
                        "multiprocessing.Pool",
                        "itertools with generator yield expressions",
                        "pickle.load",
                        "json.loads"
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Generators produce items one at a time on demand (lazy evaluation), yielding constant O(1) space complexity regardless of stream size.",
                    "subject_tag": "Python Programming",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "In Python's AsyncIO model, what happens when an 'await' expression is encountered?",
                    "options": json.dumps([
                        "The Python process halts until the OS completes the operation synchronously.",
                        "Control is yielded back to the event loop, allowing other scheduled coroutines to execute.",
                        "A new operating system kernel thread is spawned immediately.",
                        "The garbage collector runs an immediate mark-and-sweep cycle."
                    ]),
                    "correct_option_index": 1,
                    "explanation": "The 'await' keyword pauses the current coroutine and yields execution to the event loop so other concurrent tasks can make progress during I/O wait.",
                    "subject_tag": "Python Programming",
                    "difficulty": "Advanced"
                },
                {
                    "question_text": "What is the primary difference between a list comprehension and a generator expression in Python?",
                    "options": json.dumps([
                        "List comprehensions return tuples; generator expressions return lists.",
                        "List comprehensions compute all elements eagerly in memory; generator expressions compute elements lazily.",
                        "Generator expressions cannot be iterated over in a for-loop.",
                        "List comprehensions only support integers."
                    ]),
                    "correct_option_index": 1,
                    "explanation": "List comprehensions [x for x in data] allocate the complete list in memory immediately, whereas generator expressions (x for x in data) return an iterator object.",
                    "subject_tag": "Python Programming",
                    "difficulty": "Beginner"
                },
                {
                    "question_text": "How does Python handle memory management for cyclic object references?",
                    "options": json.dumps([
                        "Through pure reference counting alone.",
                        "Through a cyclic generational garbage collector running alongside reference counting.",
                        "By forcing the programmer to invoke free() manually.",
                        "Cycles are automatically converted into weak references."
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Python combines immediate reference counting with a periodic generational cyclic garbage collector that detects unreachable reference loops.",
                    "subject_tag": "Python Programming",
                    "difficulty": "Advanced"
                }
            ]
        },
        {
            "course_id": dsa_course.id,
            "title": "Data Structures & Algorithmic Complexity Quiz",
            "description": "Assess your understanding of time/space complexity, balanced trees, heaps, and graph search strategies.",
            "time_limit_minutes": 12,
            "passing_score": 70.0,
            "questions": [
                {
                    "question_text": "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
                    "options": json.dumps([
                        "O(1)",
                        "O(log N)",
                        "O(N)",
                        "O(N log N)"
                    ]),
                    "correct_option_index": 2,
                    "explanation": "If keys are inserted in strictly ascending or descending order, an unbalanced BST degrades into a linear linked list with O(N) search time.",
                    "subject_tag": "Data Structures",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "Which data structure provides O(1) amortized insertion, O(1) find-min, and O(log N) extract-min?",
                    "options": json.dumps([
                        "Binary Min-Heap",
                        "Sorted Array",
                        "Doubly Linked List",
                        "Hash Table"
                    ]),
                    "correct_option_index": 0,
                    "explanation": "A Binary Min-Heap maintains the heap-order property where the root is always the minimum element (O(1) peek), and extracting requires O(log N) sift-down.",
                    "subject_tag": "Data Structures",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "What is the optimal algorithm for finding the shortest path between two nodes in a graph with non-negative edge weights?",
                    "options": json.dumps([
                        "Depth-First Search (DFS)",
                        "Dijkstra's Algorithm using a Priority Queue",
                        "Kruskal's Algorithm",
                        "Bellman-Ford Algorithm"
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Dijkstra's algorithm with a min-heap priority queue finds single-source shortest paths in O((V + E) log V) time for graphs with non-negative weights.",
                    "subject_tag": "Algorithms",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "In Dynamic Programming, what two core properties must a problem exhibit for DP to be applicable?",
                    "options": json.dumps([
                        "Greedy choice property and linear scalability.",
                        "Optimal substructure and overlapping subproblems.",
                        "Divide and conquer recursion and constant memory.",
                        "Disjoint sets and tree topology."
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Dynamic Programming applies when solutions to subproblems can be memoized/tabulated to solve larger instances (overlapping subproblems + optimal substructure).",
                    "subject_tag": "Algorithms",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "What is the average time complexity of QuickSort when choosing a randomized pivot?",
                    "options": json.dumps([
                        "O(N^2)",
                        "O(N log N)",
                        "O(log N)",
                        "O(N)"
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Randomized pivot selection ensures balanced partitioning on average, delivering O(N log N) expected time.",
                    "subject_tag": "Algorithms",
                    "difficulty": "Beginner"
                }
            ]
        },
        {
            "course_id": ml_course.id,
            "title": "Machine Learning Foundations & Model Evaluation Quiz",
            "description": "Test your mastery over gradient descent, classification metrics, overfitting diagnostics, and regularized regression.",
            "time_limit_minutes": 10,
            "passing_score": 70.0,
            "questions": [
                {
                    "question_text": "When evaluating a model for cancer detection where missing a true positive is catastrophic, which metric should be maximized?",
                    "options": json.dumps([
                        "Precision",
                        "Recall (Sensitivity)",
                        "Specificity",
                        "Mean Squared Error"
                    ]),
                    "correct_option_index": 1,
                    "explanation": "Recall = TP / (TP + FN). Maximizing recall minimizes False Negatives (missed diagnoses).",
                    "subject_tag": "Machine Learning Fundamentals",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "What effect does L1 Regularization (Lasso) have on linear model coefficients compared to L2 (Ridge)?",
                    "options": json.dumps([
                        "L1 drives less important feature weights strictly to zero (sparse feature selection).",
                        "L1 shrinks all weights uniformly without setting any to zero.",
                        "L1 causes numerical instability with gradient descent.",
                        "L1 cannot be used for regression problems."
                    ]),
                    "correct_option_index": 0,
                    "explanation": "Due to the diamond geometry of the L1 penalty norm, optimal solutions frequently intersect coordinate axes, producing sparse solutions with exact zeros.",
                    "subject_tag": "Machine Learning Fundamentals",
                    "difficulty": "Intermediate"
                },
                {
                    "question_text": "If a machine learning model achieves 99.2% accuracy on training data but drops to 64.5% on validation data, what issue is present?",
                    "options": json.dumps([
                        "High Bias (Underfitting)",
                        "High Variance (Overfitting)",
                        "Data Leakage in validation set",
                        "Zero learning rate"
                    ]),
                    "correct_option_index": 1,
                    "explanation": "A large gap between training and validation error indicates high variance (overfitting), where the model has memorized training noise.",
                    "subject_tag": "Machine Learning Fundamentals",
                    "difficulty": "Beginner"
                }
            ]
        }
    ]

    for q_data in quizzes_data:
        questions = q_data.pop("questions")
        quiz = Quiz(**q_data)
        db.add(quiz)
        db.commit()
        db.refresh(quiz)

        for q_item in questions:
            q_obj = QuizQuestion(quiz_id=quiz.id, **q_item)
            db.add(q_obj)
        db.commit()

    # 4. Create Demo Student Account
    demo_user = User(
        email="alex.chen@studypath.edu",
        hashed_password=hash_password("StudyPath123!"),
        full_name="Alex Chen",
        role="student",
        is_active=True
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    demo_profile = StudentProfile(
        user_id=demo_user.id,
        education_level="Undergraduate",
        branch_major="Computer Science & Engineering",
        learning_speed="Balanced",
        preferred_content_type="Interactive & Practice",
        average_study_hours=3.5,
        weekly_target_hours=20.0,
        strong_subjects=json.dumps(["Python Programming", "Mathematics for Computing"]),
        weak_subjects=json.dumps(["Data Structures & Algorithms", "Database Systems & SQL"]),
        career_interests=json.dumps(["AI Engineer", "Full Stack Developer"]),
        learning_efficiency_score=84.5,
        onboarding_completed=True,
        study_method_style="Video -> Practice -> Quiz -> Revision",
        session_length_preference=45
    )
    db.add(demo_profile)
    db.commit()

    # Enroll demo user in 3 courses
    for i, c in enumerate(course_instances[:3]):
        prog = 85.0 if i == 0 else (45.0 if i == 1 else 20.0)
        enr = Enrollment(
            user_id=demo_user.id,
            course_id=c.id,
            progress=prog,
            completed=(prog >= 100.0),
            current_module_index=0,
            current_lesson_index=1
        )
        db.add(enr)
    db.commit()

    # Save 1 elective course
    saved_e = SavedCourse(
        user_id=demo_user.id,
        course_id=course_instances[6].id # Applied AI Elective
    )
    db.add(saved_e)
    db.commit()

    # Add initial quiz attempts for demo user
    quizzes = db.query(Quiz).all()
    if quizzes:
        qa1 = QuizAttempt(
            user_id=demo_user.id,
            quiz_id=quizzes[0].id,
            score_percentage=90.0,
            total_questions=5,
            correct_count=4,
            answers_payload=json.dumps([
                {"question_id": 1, "selected": 1, "is_correct": True},
                {"question_id": 2, "selected": 1, "is_correct": True},
                {"question_id": 3, "selected": 1, "is_correct": True},
                {"question_id": 4, "selected": 1, "is_correct": True},
                {"question_id": 5, "selected": 0, "is_correct": False}
            ]),
            time_spent_seconds=280,
            completed_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(qa1)

        if len(quizzes) > 1:
            qa2 = QuizAttempt(
                user_id=demo_user.id,
                quiz_id=quizzes[1].id,
                score_percentage=60.0,
                total_questions=5,
                correct_count=3,
                answers_payload=json.dumps([
                    {"question_id": 6, "selected": 2, "is_correct": True},
                    {"question_id": 7, "selected": 0, "is_correct": True},
                    {"question_id": 8, "selected": 0, "is_correct": False},
                    {"question_id": 9, "selected": 1, "is_correct": True},
                    {"question_id": 10, "selected": 0, "is_correct": False}
                ]),
                time_spent_seconds=340,
                completed_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(qa2)
        db.commit()

    # Create 4 Peer Students to power Collaborative Filtering and KNN
    peers = [
        {"name": "Sarah Miller", "email": "sarah.m@studypath.edu", "speed": "Fast Paced", "hrs": 4.5, "strong": ["Machine Learning Fundamentals", "Mathematics for Computing"], "weak": ["Cybersecurity"], "efficiency": 91.0},
        {"name": "David Kim", "email": "david.k@studypath.edu", "speed": "Balanced", "hrs": 3.0, "strong": ["Full Stack Web Development", "Python Programming"], "weak": ["Data Structures & Algorithms"], "efficiency": 82.0},
        {"name": "Elena Rostova", "email": "elena.r@studypath.edu", "speed": "Slow & Thorough", "hrs": 4.0, "strong": ["Data Structures & Algorithms", "Mathematics for Computing"], "weak": ["Cloud Computing & DevOps"], "efficiency": 86.5},
        {"name": "Marcus Johnson", "email": "marcus.j@studypath.edu", "speed": "Fast Paced", "hrs": 3.5, "strong": ["Cloud Computing & DevOps", "Full Stack Web Development"], "weak": ["Machine Learning Fundamentals"], "efficiency": 88.0},
    ]

    for p_idx, p_data in enumerate(peers):
        p_user = User(
            email=p_data["email"],
            hashed_password=hash_password("StudyPath123!"),
            full_name=p_data["name"],
            role="student",
            is_active=True
        )
        db.add(p_user)
        db.commit()
        db.refresh(p_user)

        p_prof = StudentProfile(
            user_id=p_user.id,
            education_level="Undergraduate",
            branch_major="Computer Science & Engineering",
            learning_speed=p_data["speed"],
            preferred_content_type="Interactive & Practice",
            average_study_hours=p_data["hrs"],
            strong_subjects=json.dumps(p_data["strong"]),
            weak_subjects=json.dumps(p_data["weak"]),
            career_interests=json.dumps(["Software Engineer", "Data Scientist"]),
            learning_efficiency_score=p_data["efficiency"],
            onboarding_completed=True
        )
        db.add(p_prof)

        # Peer enrollments
        for c in course_instances[p_idx:p_idx+4]:
            en = Enrollment(
                user_id=p_user.id,
                course_id=c.id,
                progress=80.0 + (p_idx * 5.0),
                completed=True
            )
            db.add(en)
    db.commit()

    # 5. Seed Initial Study Plan for demo user
    from app.services.scheduler_service import scheduler_service
    scheduler_service.generate_ai_study_plan(demo_user.id, db)

    # 6. Seed Notifications for demo user
    notifications_data = [
        {
            "user_id": demo_user.id,
            "title": "Weekly Study Plan Ready",
            "message": "Your AI-personalized 7-day schedule has been generated based on your goal to master Data Structures.",
            "type": "study_reminder",
            "action_url": "/study-plan",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "user_id": demo_user.id,
            "title": "Quiz Recommendation Updated",
            "message": "Based on your recent 60% quiz score on Data Structures, we've adjusted your recommended study track.",
            "type": "recommendation",
            "action_url": "/recommendations",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=6)
        },
        {
            "user_id": demo_user.id,
            "title": "Learning Efficiency +6.2%",
            "message": "Great job! Consistent study sessions this week boosted your learning efficiency index to 84.5%.",
            "type": "progress_summary",
            "action_url": "/analytics",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(days=1)
        }
    ]

    for n in notifications_data:
        notif = Notification(**n)
        db.add(notif)
    db.commit()

    print("Database seeded successfully with courses, demo user, quizzes, and peer networks!")
