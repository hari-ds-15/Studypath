/**
 * Comprehensive Directory of Free Programming Courses, YouTube Channels,
 * Documentation & Practice Websites, and Free Certification Links.
 */

export const PROGRAMMING_TOPICS = [
  {
    id: 'python',
    name: 'Python Programming',
    category: 'Programming Languages',
    iconColor: 'from-blue-500 to-yellow-500',
    tags: ['python', 'py', 'oop', 'fastapi', 'django', 'pandas', 'numpy', 'automation', 'backend'],
    summary: 'Master Python syntax, object-oriented design, web backend APIs, and scientific computing.',
    youtube_channels: [
      {
        title: 'freeCodeCamp - 6-Hour Full Python Bootcamp',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        badge: 'Full Course',
        description: 'Comprehensive beginner-to-intermediate Python bootcamp covering variables, data structures, and functions.'
      },
      {
        title: 'Corey Schafer - Python OOP, Closures & Decorators',
        channel: 'Corey Schafer',
        url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhWLLoM5_Y9YTBt',
        badge: 'Playlist',
        description: 'The gold standard playlist for OOP, dunder methods, generator expressions, and decorator patterns.'
      },
      {
        title: 'Programming with Mosh - Python Tutorial for Beginners',
        channel: 'Programming with Mosh',
        url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
        badge: 'Full Course',
        description: 'Clean, structured 6-hour guide from basic syntax to 3 real-world portfolio projects.'
      },
      {
        title: 'mCoding - Fast, Modern Python & AsyncIO',
        channel: 'mCoding',
        url: 'https://www.youtube.com/@mCoding',
        badge: 'Channel',
        description: 'Deep dives into AsyncIO, memory profiling, CPython internals, and type checking with MyPy.'
      },
      {
        title: 'Tech With Tim - Python Projects & Game Dev',
        channel: 'Tech With Tim',
        url: 'https://www.youtube.com/@TechWithTim',
        badge: 'Channel',
        description: 'Practical intermediate Python projects, Pygame, networking, and automation scripts.'
      }
    ],
    free_websites: [
      {
        title: 'Python 3 Official Documentation',
        provider: 'Python Software Foundation',
        url: 'https://docs.python.org/3/',
        badge: 'Official Docs',
        description: 'The authoritative language reference manual, built-in functions, and standard library reference.'
      },
      {
        title: 'Real Python Tutorials & Quizzes',
        provider: 'Real Python',
        url: 'https://realpython.com/',
        badge: 'Interactive Guides',
        description: 'Step-by-step production Python tutorials, quizzes, and code pattern walkthroughs.'
      },
      {
        title: 'LeetCode Python Practice Problem Set',
        provider: 'LeetCode',
        url: 'https://leetcode.com/problemset/all/',
        badge: 'Practice Platform',
        description: 'Solve 2,000+ algorithmic coding interview problems with Python 3 support and runtime benchmarks.'
      },
      {
        title: 'W3Schools Python Interactive Playground',
        provider: 'W3Schools',
        url: 'https://www.w3schools.com/python/',
        badge: 'Interactive Sandbox',
        description: 'Try-it-yourself live interactive code sandbox with beginner examples.'
      }
    ],
    free_certificates: [
      {
        title: 'Scientific Computing with Python Certification',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
        badge: 'Free Certificate',
        cert_type: 'Accredited Free Cert',
        description: '300-hour verified curriculum covering algorithms, data structures, and 5 mandatory certification projects.'
      },
      {
        title: 'Python Essentials 1 & 2 Certifications',
        provider: 'Cisco Networking Academy',
        url: 'https://www.netacad.com/courses/programming/pcap-programming-essentials-python',
        badge: 'Cisco Badge',
        cert_type: 'Digital Badge & Certificate',
        description: 'Official OpenEDG Python Institute accredited training aligning with PCAP certification.'
      },
      {
        title: 'Kaggle Python Micro-Course & Certificate',
        provider: 'Kaggle (Google)',
        url: 'https://www.kaggle.com/learn/python',
        badge: 'Kaggle Certificate',
        cert_type: 'Free Course Certificate',
        description: 'Hands-on interactive notebook course covering Python fundamentals and syntax for data science.'
      }
    ]
  },
  {
    id: 'javascript-typescript',
    name: 'JavaScript & TypeScript',
    category: 'Programming Languages',
    iconColor: 'from-yellow-400 to-blue-600',
    tags: ['javascript', 'typescript', 'js', 'ts', 'es6', 'web', 'frontend', 'nodejs', 'async'],
    summary: 'Master modern ES6+, TypeScript static typing, DOM manipulation, and asynchronous event loops.',
    youtube_channels: [
      {
        title: 'freeCodeCamp - Full JavaScript Course for Beginners',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        badge: 'Full Course',
        description: 'Master JavaScript programming language from core variables to modern ES6 functions.'
      },
      {
        title: 'The Net Ninja - Modern JavaScript & TypeScript Playlists',
        channel: 'The Net Ninja',
        url: 'https://www.youtube.com/@NetNinja',
        badge: 'Playlist Series',
        description: 'Crystal clear modular tutorials on async JavaScript, Promises, Fetch API, and TypeScript.'
      },
      {
        title: 'Traversy Media - JavaScript & Web Development Crash Courses',
        channel: 'Traversy Media',
        url: 'https://www.youtube.com/@TraversyMedia',
        badge: 'Channel',
        description: 'Fast, practical full-stack JavaScript, Node.js, and TypeScript project builds.'
      },
      {
        title: 'Matt Pocock - TypeScript Pro Tips & Generics',
        channel: 'Matt Pocock',
        url: 'https://www.youtube.com/@mattpocockuk',
        badge: 'Channel',
        description: 'High-density TypeScript wizardry, utility types, conditional types, and generics.'
      }
    ],
    free_websites: [
      {
        title: 'JavaScript.info - The Modern JavaScript Tutorial',
        provider: 'JavaScript.info',
        url: 'https://javascript.info/',
        badge: 'Definitive Book',
        description: 'Comprehensive online textbook from fundamentals to closures, prototypes, and Web APIs.'
      },
      {
        title: 'MDN Web Docs - JavaScript Reference',
        provider: 'Mozilla Developer Network',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        badge: 'Official Web Standard',
        description: 'The industry-standard reference for JavaScript built-in objects, methods, and syntax.'
      },
      {
        title: 'TypeScript Official Handbook & Sandbox',
        provider: 'Microsoft TypeScript',
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        badge: 'Official Docs',
        description: 'Official TypeScript handbook and live interactive in-browser compiler playground.'
      }
    ],
    free_certificates: [
      {
        title: 'JavaScript Algorithms & Data Structures Certification',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
        badge: 'Free Certificate',
        cert_type: 'Accredited Free Cert',
        description: 'Build 20+ interactive projects including Palindrome Checker, Roman Numeral Converter, and Cash Register.'
      },
      {
        title: 'HackerRank JavaScript (Basic & Intermediate) Certificates',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Industry-recognized skill assessment covering closures, prototypes, event loops, and arrays.'
      }
    ]
  },
  {
    id: 'java',
    name: 'Java Programming & Spring Boot',
    category: 'Programming Languages',
    iconColor: 'from-orange-500 to-red-600',
    tags: ['java', 'spring', 'springboot', 'oop', 'jvm', 'enterprise', 'backend', 'android'],
    summary: 'Enterprise Java development, JVM internals, multithreading, and RESTful Spring Boot microservices.',
    youtube_channels: [
      {
        title: 'Kunal Kushwaha - Complete Java + DSA Course',
        channel: 'Kunal Kushwaha',
        url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
        badge: 'Course Series',
        description: 'Top-rated comprehensive course covering Java from scratch to advanced DSA and interviews.'
      },
      {
        title: 'Telusko - Java Full Course for Beginners',
        channel: 'Telusko',
        url: 'https://www.youtube.com/watch?v=BGTx91t8q50',
        badge: 'Full Course',
        description: 'Complete 12-hour Java masterclass covering OOP, Collections Framework, and JDBC.'
      },
      {
        title: 'Amigoscode - Java & Spring Boot Production Pipelines',
        channel: 'Amigoscode',
        url: 'https://www.youtube.com/@amigoscode',
        badge: 'Channel',
        description: 'Production Spring Boot, Docker containerization, PostgreSQL JPA, and JWT authentication.'
      }
    ],
    free_websites: [
      {
        title: 'Oracle Java Official Tutorials',
        provider: 'Oracle',
        url: 'https://docs.oracle.com/javase/tutorial/',
        badge: 'Official Docs',
        description: 'Official Oracle guides on core language concepts, generics, concurrency, and security.'
      },
      {
        title: 'Baeldung Java & Spring Guides',
        provider: 'Baeldung',
        url: 'https://www.baeldung.com/',
        badge: 'Enterprise Guides',
        description: 'The highest quality practical Java, Spring Boot, Hibernate, and JUnit testing tutorials.'
      },
      {
        title: 'GeeksforGeeks Java Programming Language Hub',
        provider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/java/',
        badge: 'Reference & Code',
        description: 'Comprehensive code snippets, interview questions, and memory model explanations.'
      }
    ],
    free_certificates: [
      {
        title: 'Oracle Java Explorer Professional Badge',
        provider: 'Oracle University',
        url: 'https://education.oracle.com/learn/java/pPKey_Java',
        badge: 'Oracle Badge',
        cert_type: 'Official Vendor Badge',
        description: 'Free official learning path and completion badge from Oracle University.'
      },
      {
        title: 'HackerRank Java Skills Certification',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/java_basic',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Demonstrate proficiency in Java syntax, OOP inheritance, and data collections.'
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C & C++ Programming & Systems',
    category: 'Programming Languages',
    iconColor: 'from-blue-600 to-indigo-800',
    tags: ['c', 'cpp', 'c++', 'pointers', 'memory', 'stl', 'systems', 'embedded', 'game dev'],
    summary: 'Low-level memory management, pointers, modern C++20 STL, RAII, and high-performance systems.',
    youtube_channels: [
      {
        title: 'The Cherno - C++ Master Series',
        channel: 'The Cherno',
        url: 'https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4G5b',
        badge: 'Master Playlist',
        description: 'The most popular modern C++ series explaining memory layout, pointers, heap allocation, and virtual tables.'
      },
      {
        title: 'freeCodeCamp - C++ 31-Hour Full Masterclass Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=8jLOx1hD3_o',
        badge: 'Full Course',
        description: 'From zero programming background to advanced C++ concepts and templates.'
      },
      {
        title: 'Abdul Bari - C / C++ Foundations & Data Structures',
        channel: 'Abdul Bari',
        url: 'https://www.youtube.com/@abdul_bari',
        badge: 'Channel',
        description: 'World-renowned lectures explaining memory allocation, pointers, and structures visually.'
      }
    ],
    free_websites: [
      {
        title: 'LearnCpp.com - Complete Modern C++ Guide',
        provider: 'LearnCpp',
        url: 'https://www.learncpp.com/',
        badge: 'Online Book',
        description: 'The premier free comprehensive tutorial website for learning modern C++ from scratch.'
      },
      {
        title: 'CppReference.com - Definitive C/C++ Reference',
        provider: 'CppReference',
        url: 'https://en.cppreference.com/w/',
        badge: 'Standard Reference',
        description: 'Detailed API docs and reference for the entire C and C++ standard libraries.'
      }
    ],
    free_certificates: [
      {
        title: 'Cisco CPA: Programming Essentials in C++',
        provider: 'Cisco Networking Academy',
        url: 'https://www.netacad.com/courses/programming/cpp-essentials',
        badge: 'Cisco Certificate',
        cert_type: 'Accredited Free Certificate',
        description: 'Learn universal computer programming concepts and C++ syntax with a Cisco completion certificate.'
      },
      {
        title: 'HackerRank C++ Skills Certification',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/cpp_basic',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Verify your proficiency in STL vector, string manipulation, classes, and templates.'
      }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms (DSA)',
    category: 'Computer Science',
    iconColor: 'from-emerald-500 to-teal-700',
    tags: ['dsa', 'algorithms', 'data structures', 'leetcode', 'neetcode', 'interviews', 'dynamic programming', 'graphs', 'trees'],
    summary: 'Big-O complexity analysis, linked lists, balanced trees, graph searches (BFS/DFS, Dijkstra), and Dynamic Programming.',
    youtube_channels: [
      {
        title: 'NeetCode - NeetCode 150 & Blind 75 Full Video Solutions',
        channel: 'NeetCode',
        url: 'https://www.youtube.com/@NeetCode',
        badge: 'Channel',
        description: 'The definitive video breakdowns of all 150 core interview algorithmic problem patterns.'
      },
      {
        title: 'Abdul Bari - Algorithms & Dynamic Programming Lectures',
        channel: 'Abdul Bari',
        url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
        badge: 'Playlist Series',
        description: 'World-famous whiteboard lectures on DP, Greedy, Backtracking, Divide & Conquer, and Graph theory.'
      },
      {
        title: 'MIT OpenCourseWare - Introduction to Algorithms (6.006)',
        channel: 'MIT OCW',
        url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb',
        badge: 'University Course',
        description: 'MIT university computer science curriculum covering algorithmic proofs and time complexity.'
      },
      {
        title: 'Take U Forward (Striver) - A2Z DSA Sheet & Solutions',
        channel: 'Take U Forward',
        url: 'https://www.youtube.com/@takeUforward',
        badge: 'Channel',
        description: 'Complete step-by-step video roadmaps for graphs, trees, and dynamic programming.'
      }
    ],
    free_websites: [
      {
        title: 'NeetCode Interactive Roadmap',
        provider: 'NeetCode.io',
        url: 'https://neetcode.io/roadmap',
        badge: 'Interactive Roadmap',
        description: 'Visual topic tree roadmap structuring problems with code templates in Python, Java, C++, and JS.'
      },
      {
        title: 'LeetCode Top Interview 150 Study Plan',
        provider: 'LeetCode',
        url: 'https://leetcode.com/studyplan/top-interview-150/',
        badge: 'Practice Platform',
        description: 'Curated collection of 150 classic interview problems with automatic testcase grading.'
      },
      {
        title: 'VisuAlgo - Visualizing Data Structures & Algorithms',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en',
        badge: 'Interactive Visualizer',
        description: 'Animated step-by-step visualizer for sorting algorithms, AVL trees, graphs, and union-find.'
      }
    ],
    free_certificates: [
      {
        title: 'HackerRank Problem Solving (Basic & Intermediate) Certifications',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/problem_solving_basic',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Tests ability to solve algorithmic problems using arrays, stacks, strings, and trees under time constraints.'
      },
      {
        title: 'freeCodeCamp Relational Data Structures Certificate',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/',
        badge: 'Free Certificate',
        cert_type: 'Accredited Free Cert',
        description: 'Hands-on practice challenges and verified certificate on algorithmic structures.'
      }
    ]
  },
  {
    id: 'ai-ml',
    name: 'Machine Learning, Deep Learning & Generative AI',
    category: 'AI & Data Science',
    iconColor: 'from-purple-600 to-pink-600',
    tags: ['ai', 'ml', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'llm', 'generative ai', 'transformers', 'rag'],
    summary: 'Neural networks, Transformers, Scikit-Learn pipelines, PyTorch models, and RAG agent workflows.',
    youtube_channels: [
      {
        title: 'Andrej Karpathy - Neural Networks: Zero to Hero',
        channel: 'Andrej Karpathy',
        url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
        badge: 'Course Series',
        description: 'Build micrograd, makemore, and GPT from scratch in pure Python with mathematical first principles.'
      },
      {
        title: 'StatQuest with Josh Starmer - Machine Learning Visual Guide',
        channel: 'StatQuest',
        url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',
        badge: 'Playlist',
        description: 'Clear, intuitive visual breakdowns of Random Forests, Gradient Boost, PCA, SVMs, and neural nets.'
      },
      {
        title: '3Blue1Brown - Neural Networks & Linear Algebra Visualized',
        channel: '3Blue1Brown',
        url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
        badge: 'Visual Series',
        description: 'Geometric intuition for backpropagation, gradient vectors, and activation functions.'
      },
      {
        title: 'freeCodeCamp - LangChain & Generative AI Masterclass',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=lG7Uxts9SXs',
        badge: 'Full Course',
        description: 'Build LLM apps, RAG vector pipelines, and autonomous agent loops with LangChain.'
      }
    ],
    free_websites: [
      {
        title: 'Hugging Face NLP & Transformers Free Course',
        provider: 'Hugging Face',
        url: 'https://huggingface.co/learn/nlp-course',
        badge: 'Interactive Course',
        description: 'Free comprehensive course on fine-tuning Hugging Face models, pipelines, and tokenizers.'
      },
      {
        title: 'Scikit-Learn Official User Guide',
        provider: 'Scikit-Learn',
        url: 'https://scikit-learn.org/stable/user_guide.html',
        badge: 'Official Docs',
        description: 'The definitive machine learning documentation for supervised, unsupervised, and preprocessing models.'
      },
      {
        title: 'Google Gemini AI Developer Documentation',
        provider: 'Google DeepMind',
        url: 'https://ai.google.dev/',
        badge: 'Official Docs',
        description: 'Official guides for Gemini 2.5/3.5 models, multimodal prompts, structured outputs, and SDKs.'
      },
      {
        title: 'Kaggle Datasets & ML Notebooks',
        provider: 'Kaggle (Google)',
        url: 'https://www.kaggle.com/datasets',
        badge: 'Datasets & Code',
        description: 'Over 100,000 public datasets and community notebooks to train and evaluate models.'
      }
    ],
    free_certificates: [
      {
        title: 'Google Cloud Generative AI Fundamentals Certificate',
        provider: 'Google Cloud Skill Boost',
        url: 'https://www.cloudskillsboost.google/course_templates/556',
        badge: 'Google Badge',
        cert_type: 'Official Google Certificate',
        description: 'Learn large language model fundamentals, attention mechanisms, and responsible AI with a Google Cloud badge.'
      },
      {
        title: 'Kaggle Intro to Machine Learning & Deep Learning Certificates',
        provider: 'Kaggle (Google)',
        url: 'https://www.kaggle.com/learn',
        badge: 'Kaggle Certificate',
        cert_type: 'Hands-on Course Certs',
        description: 'Free verified certificate upon completing hands-on model training and validation exercises.'
      },
      {
        title: 'DeepLearning.AI Free Short Courses with Certificates',
        provider: 'DeepLearning.AI',
        url: 'https://www.deeplearning.ai/short-courses/',
        badge: 'DeepLearning.AI Badge',
        cert_type: 'Expert Short Course Certs',
        description: 'Free 1-hour courses on Prompt Engineering, LangChain, Vector Databases, and Multi-AI Agents.'
      }
    ]
  },
  {
    id: 'web-react',
    name: 'React, Next.js & Full-Stack Web Development',
    category: 'Web Development',
    iconColor: 'from-cyan-500 to-blue-600',
    tags: ['react', 'nextjs', 'fullstack', 'frontend', 'tailwind', 'fastapi', 'rest api', 'html', 'css'],
    summary: 'Modern component architecture, custom hooks, Server Components, Tailwind CSS, and REST API integration.',
    youtube_channels: [
      {
        title: 'Fireship - 100 Seconds of Code & Full-Stack Guides',
        channel: 'Fireship',
        url: 'https://www.youtube.com/@Fireship',
        badge: 'Channel',
        description: 'High-density architectural breakdowns of React, Next.js, WebSockets, and modern web frameworks.'
      },
      {
        title: 'freeCodeCamp - React & FastAPI Full-Stack Masterclass',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=0sOvCWFmrtA',
        badge: 'Full Course',
        description: 'Build complete production-ready apps with React on the frontend and FastAPI on the backend.'
      },
      {
        title: 'Web Dev Simplified - React Hooks & CSS Architecture',
        channel: 'Web Dev Simplified',
        url: 'https://www.youtube.com/@WebDevSimplified',
        badge: 'Channel',
        description: 'Practical deep dives into useEffect, useMemo, custom hooks, and state management.'
      }
    ],
    free_websites: [
      {
        title: 'React Official Interactive Documentation',
        provider: 'React Team (Meta)',
        url: 'https://react.dev/learn',
        badge: 'Official Docs',
        description: 'The new interactive React documentation featuring live sandboxes, diagrams, and best practices.'
      },
      {
        title: 'Next.js Interactive Learn Course',
        provider: 'Vercel / Next.js',
        url: 'https://nextjs.org/learn',
        badge: 'Interactive Course',
        description: 'Step-by-step interactive course building a full-stack dashboard with Next.js App Router.'
      },
      {
        title: 'Tailwind CSS Class Reference',
        provider: 'Tailwind Labs',
        url: 'https://tailwindcss.com/docs',
        badge: 'Official Docs',
        description: 'Utility-first styling documentation, flex/grid layouts, responsive modifiers, and dark mode.'
      }
    ],
    free_certificates: [
      {
        title: 'Front End Development Libraries Certification',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
        badge: 'Free Certificate',
        cert_type: 'Accredited Free Cert',
        description: 'Master React, Redux, SASS, and Bootstrap with 5 verified project builds including Drum Machine and Markdown Previewer.'
      },
      {
        title: 'HackerRank Frontend (React) Skills Certificate',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/frontend_developer_react',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Demonstrates proficiency in React state hooks, lifecycle methods, and component rendering.'
      }
    ]
  },
  {
    id: 'cloud-devops',
    name: 'Cloud Computing, Docker, Kubernetes & AWS',
    category: 'Cloud & DevOps',
    iconColor: 'from-orange-500 to-amber-600',
    tags: ['cloud', 'aws', 'docker', 'kubernetes', 'k8s', 'devops', 'ci/cd', 'terraform', 'linux'],
    summary: 'Containerization, microservice orchestration, AWS cloud infrastructure, CI/CD pipelines, and Terraform IaC.',
    youtube_channels: [
      {
        title: 'TechWorld with Nana - Docker & Kubernetes Full Course',
        channel: 'TechWorld with Nana',
        url: 'https://www.youtube.com/playlist?list=PLy7NrLkytTXD5ZbgdI_OoxsZk_aO57yvP',
        badge: 'Course Series',
        description: 'Visual explanations of containerization, Pods, Services, Ingress, Deployments, and Helm charts.'
      },
      {
        title: 'freeCodeCamp - AWS Certified Solutions Architect Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=SOTamWNgDKc',
        badge: 'Full Course',
        description: '14-hour comprehensive cloud training covering AWS EC2, S3, RDS, IAM, VPC, and Lambda.'
      },
      {
        title: 'NetworkChuck - Docker & DevOps Labs',
        channel: 'NetworkChuck',
        url: 'https://www.youtube.com/playlist?list=PLIhvC56v63IJVXv0GJcl9vO5bd4544uSm',
        badge: 'Playlist',
        description: 'Hands-on practical guides to container networking, reverse proxies, and Linux cloud sysadmin.'
      }
    ],
    free_websites: [
      {
        title: 'Docker Official Get Started Guides',
        provider: 'Docker Inc.',
        url: 'https://docs.docker.com/get-started/',
        badge: 'Official Docs',
        description: 'Official guides for multi-stage Dockerfiles, Compose orchestration, and image optimization.'
      },
      {
        title: 'Kubernetes Official Interactive Tutorials',
        provider: 'CNCF / Kubernetes',
        url: 'https://kubernetes.io/docs/tutorials/',
        badge: 'Interactive Labs',
        description: 'Interactive browser-based Minikube cluster management tutorials and kubectl CLI references.'
      },
      {
        title: 'HashiCorp Learn - Terraform Cloud Tutorials',
        provider: 'HashiCorp',
        url: 'https://developer.hashicorp.com/terraform/tutorials',
        badge: 'Official Tutorials',
        description: 'Declarative Infrastructure-as-Code guides for provisioning multi-cloud cloud resources.'
      }
    ],
    free_certificates: [
      {
        title: 'AWS Skill Builder Digital Badges & Free Cloud Training',
        provider: 'Amazon Web Services',
        url: 'https://explore.skillbuilder.aws/',
        badge: 'AWS Badge',
        cert_type: 'Official Vendor Badges',
        description: 'Free self-paced courses and official digital badges for AWS Cloud Practitioner and Solutions Architect.'
      },
      {
        title: 'Microsoft Learn Azure Fundamentals & Badges',
        provider: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/',
        badge: 'Microsoft Badge',
        cert_type: 'Verified Trophy & Badges',
        description: 'Free cloud computing learning paths, sandbox lab exercises, and Microsoft Learn trophies.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity, Threat Hunting & Network Defense',
    category: 'Cybersecurity',
    iconColor: 'from-red-600 to-rose-700',
    tags: ['cybersecurity', 'security', 'ethical hacking', 'penetration testing', 'ctf', 'cryptography', 'owasp', 'wireshark'],
    summary: 'Vulnerability assessment, packet analysis with Wireshark, penetration testing, cryptography, and SIEM threat hunting.',
    youtube_channels: [
      {
        title: 'John Hammond - Malware Analysis, CTFs & Threat Hunting',
        channel: 'John Hammond',
        url: 'https://www.youtube.com/@_JohnHammond',
        badge: 'Channel',
        description: 'Hands-on walkthroughs of exploit analysis, reverse engineering, and defensive threat detection.'
      },
      {
        title: 'David Bombal - Ethical Hacking & Wireshark Packet Analysis',
        channel: 'David Bombal',
        url: 'https://www.youtube.com/@davidbombal',
        badge: 'Channel',
        description: 'Deep packet inspection, network protocols, penetration testing tools, and defensive tactics.'
      },
      {
        title: 'freeCodeCamp - CompTIA Security+ & Ethical Hacking Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=9GdX266Z3Sg',
        badge: 'Full Course',
        description: 'Comprehensive 15-hour course on cryptography, network defense, threat actors, and digital forensics.'
      }
    ],
    free_websites: [
      {
        title: 'TryHackMe - Hands-on Cyber Security Training',
        provider: 'TryHackMe',
        url: 'https://tryhackme.com/',
        badge: 'Interactive Labs',
        description: 'Hands-on virtual rooms for cybersecurity, web vulnerabilities, and network security.'
      },
      {
        title: 'PortSwigger Web Security Academy',
        provider: 'PortSwigger (Burp Suite)',
        url: 'https://portswigger.net/web-security',
        badge: 'Free Academy',
        description: 'Free interactive web vulnerability labs (SQL injection, XSS, CSRF, SSRF) by the authors of Burp Suite.'
      },
      {
        title: 'OWASP Top 10 Security Project',
        provider: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-ten/',
        badge: 'Security Standard',
        description: 'The standard awareness document for developers and security professionals.'
      }
    ],
    free_certificates: [
      {
        title: 'Cisco Introduction to Cybersecurity & Cyber Threat Management',
        provider: 'Cisco Networking Academy',
        url: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
        badge: 'Cisco Badge',
        cert_type: 'Verified Certificate & Badge',
        description: 'Foundations of cyber safety, privacy, defense, and incident response with Cisco verified digital badge.'
      },
      {
        title: 'Fortinet Certified Cybersecurity Associate (FCA / NSE 1-3)',
        provider: 'Fortinet Training Institute',
        url: 'https://www.fortinet.com/training/cybersecurity-professionals',
        badge: 'Fortinet Cert',
        cert_type: 'Official Vendor Certificate',
        description: 'Free official cybersecurity certification training covering network threat landscapes and firewalls.'
      }
    ]
  },
  {
    id: 'sql-databases',
    name: 'SQL, Database Systems & Data Engineering',
    category: 'Data Science',
    iconColor: 'from-blue-600 to-indigo-700',
    tags: ['sql', 'database', 'postgres', 'mysql', 'spark', 'kafka', 'data engineering', 'etl', 'query optimization'],
    summary: 'Relational database schema design, window functions, indexing, query execution plans, and Apache Spark / Kafka.',
    youtube_channels: [
      {
        title: 'Alex The Analyst - SQL Masterclass for Data Analytics',
        channel: 'Alex The Analyst',
        url: 'https://www.youtube.com/playlist?list=PLUaB-1hjhk8GZOu0530ZPvwPXbES8n3nw',
        badge: 'Playlist',
        description: 'From basic SELECT queries to complex CTEs, window functions, subqueries, and table optimization.'
      },
      {
        title: 'freeCodeCamp - SQL & Relational Databases Full Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        badge: 'Full Course',
        description: 'Full 4-hour foundations course in SQL schema design, joins, normalization, and ACID properties.'
      },
      {
        title: 'freeCodeCamp - Apache Spark & PySpark Masterclass',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=_C8kWso4ne4',
        badge: 'Full Course',
        description: 'Hands-on distributed data processing with PySpark, DataFrame transformations, and Spark SQL.'
      }
    ],
    free_websites: [
      {
        title: 'Mode Analytics Interactive SQL Tutorial',
        provider: 'Mode Analytics',
        url: 'https://mode.com/sql-tutorial/',
        badge: 'Interactive Lab',
        description: 'Hands-on SQL practice with real databases covering window functions, CTEs, and cohort analysis.'
      },
      {
        title: 'PostgreSQL Official Documentation',
        provider: 'PostgreSQL Global Development Group',
        url: 'https://www.postgresql.org/docs/',
        badge: 'Official Docs',
        description: 'The complete reference for PostgreSQL queries, indexing methods, JSONB, and partitioning.'
      },
      {
        title: 'SQLZoo Interactive SQL Playground',
        provider: 'SQLZoo',
        url: 'https://sqlzoo.net/',
        badge: 'Practice Sandbox',
        description: 'Interactive SQL quizzes and live browser-based query engines across all complexity levels.'
      }
    ],
    free_certificates: [
      {
        title: 'Relational Database Certification',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/relational-database/',
        badge: 'Free Certificate',
        cert_type: 'Accredited Free Cert',
        description: '300-hour Linux & PostgreSQL hands-on curriculum building databases, Bash scripts, and Git repositories.'
      },
      {
        title: 'HackerRank SQL (Basic, Intermediate & Advanced) Certifications',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/sql_basic',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Demonstrates mastery of complex joins, aggregate group-bys, and recursive queries under timed conditions.'
      },
      {
        title: 'MongoDB University - Free Database Courses & Badges',
        provider: 'MongoDB',
        url: 'https://learn.mongodb.com/',
        badge: 'MongoDB Badge',
        cert_type: 'Official Vendor Badges',
        description: 'Learn NoSQL document databases, indexing, and aggregation pipelines with free MongoDB certification badges.'
      }
    ]
  },
  {
    id: 'rust',
    name: 'Rust Systems Programming',
    category: 'Programming Languages',
    iconColor: 'from-amber-600 to-orange-800',
    tags: ['rust', 'systems', 'memory safety', 'borrow checker', 'concurrency', 'cargo', 'webassembly'],
    summary: 'Memory safety without garbage collection, borrow checker semantics, ownership, lifetimes, and WebAssembly.',
    youtube_channels: [
      {
        title: "Let's Get Rusty - The Rust Programming Video Guide",
        channel: "Let's Get Rusty",
        url: 'https://www.youtube.com/@LetsGetRusty',
        badge: 'Channel',
        description: 'Clear video chapter-by-chapter walkthroughs of the official Rust Programming Book.'
      },
      {
        title: 'No Boilerplate - Fast, Reliable Rust Explanations',
        channel: 'No Boilerplate',
        url: 'https://www.youtube.com/@NoBoilerplate',
        badge: 'Channel',
        description: 'High-density videos exploring Rust concurrency, memory safety, and compile-time guarantees.'
      },
      {
        title: 'freeCodeCamp - Rust Programming Full Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=BpPEoQ4j80s',
        badge: 'Full Course',
        description: 'Complete hands-on introduction to Rust syntax, borrowing, traits, and error handling.'
      }
    ],
    free_websites: [
      {
        title: 'The Rust Programming Language (The Book)',
        provider: 'Rust Community',
        url: 'https://doc.rust-lang.org/book/',
        badge: 'Official Book',
        description: 'The definitive free textbook for mastering Rust ownership, borrowing, and smart pointers.'
      },
      {
        title: 'Rust by Example',
        provider: 'Rust Community',
        url: 'https://doc.rust-lang.org/rust-by-example/',
        badge: 'Interactive Examples',
        description: 'A collection of runnable Rust examples exercising language features and standard libraries.'
      }
    ],
    free_certificates: [
      {
        title: 'Microsoft Learn - Take Your First Steps with Rust',
        provider: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/training/paths/rust-first-steps/',
        badge: 'Microsoft Badge',
        cert_type: 'Verified Trophies & Badges',
        description: 'Structured modules and exercises covering memory management and error handling in Rust.'
      },
      {
        title: 'Exercism Rust Track & Mentor Badges',
        provider: 'Exercism.org',
        url: 'https://exercism.org/tracks/rust',
        badge: 'Free Track Badge',
        cert_type: 'Mentored Coding Badge',
        description: 'Solve 90+ idiomatic Rust coding exercises with automated testing and mentor feedback.'
      }
    ]
  },
  {
    id: 'golang',
    name: 'Go (Golang) Microservices & Concurrency',
    category: 'Programming Languages',
    iconColor: 'from-cyan-500 to-sky-700',
    tags: ['go', 'golang', 'goroutines', 'channels', 'microservices', 'backend', 'concurrency', 'docker'],
    summary: 'Goroutines, channels, non-blocking network I/O, cloud-native microservices, and high-throughput backends.',
    youtube_channels: [
      {
        title: 'freeCodeCamp - Go Programming Language Master Course',
        channel: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=YS4e4q9oBaU',
        badge: 'Full Course',
        description: '11-hour comprehensive Go bootcamp from foundational types to concurrency and channels.'
      },
      {
        title: 'Tech School - Backend Master Class with Golang & PostgreSQL',
        channel: 'Tech School',
        url: 'https://www.youtube.com/playlist?list=PLy_6D98if3ULEtXtNSY_2qN21VCKgoQAE',
        badge: 'Master Playlist',
        description: 'Build production banking backend with Go, gRPC, JWT auth, Docker, and Kubernetes.'
      }
    ],
    free_websites: [
      {
        title: 'A Tour of Go - Official Interactive Tutorial',
        provider: 'Go Development Team (Google)',
        url: 'https://go.dev/tour/welcome/1',
        badge: 'Interactive Tour',
        description: 'Interactive in-browser walkthrough of Go basics, methods, interfaces, and concurrency primitives.'
      },
      {
        title: 'Go by Example',
        provider: 'Mark McGranaghan',
        url: 'https://gobyexample.com/',
        badge: 'Hands-on Examples',
        description: 'Hands-on introduction to Go using annotated example programs and code snippets.'
      }
    ],
    free_certificates: [
      {
        title: 'HackerRank Go (Basic) Skill Certification',
        provider: 'HackerRank',
        url: 'https://www.hackerrank.com/skills-verification/go_basic',
        badge: 'Skill Certificate',
        cert_type: 'Timed Assessment Cert',
        description: 'Demonstrates proficiency in Go slices, goroutines, mutex synchronization, and error handling.'
      }
    ]
  }
];
