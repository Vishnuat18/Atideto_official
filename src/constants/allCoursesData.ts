import { 
  Code2, Globe, Smartphone, Cpu, Database, Cloud, 
  ShieldCheck, Server, CheckCircle2, Layout, Award, Rocket,
  LucideIcon 
} from 'lucide-react';
import sampleCourseImg from '@/assets/course_logos/image.png';

export interface CurriculumModule {
  week: string;
  title: string;
  lessons: string[];
  quiz?: string;
  assignment?: string;
}

export interface CourseData {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  subcategory: string;
  shortDesc: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewsCount: number;
  projectsCount: number;
  skills: string[];
  technologies: string[];
  image: string;
  badge?: string;
  progressPercent: number;
  modulesCount: number;
  lessonsCount: number;
  quizzesCount: number;
  curriculum: CurriculumModule[];
  capstoneProject: {
    title: string;
    deliverable: string;
  };
}

export interface CategoryGroup {
  id: string;
  number: string;
  name: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  subcategories: string[];
  courses: CourseData[];
}

// Helper to generate full curriculum and details for any course
function createCourse(
  id: string,
  title: string,
  categoryId: string,
  categoryName: string,
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  duration: string,
  shortDesc: string,
  skills: string[],
  technologies: string[],
  capstoneTitle: string,
  capstoneDeliverable: string,
  rating = 4.92,
  reviewsCount = 320
): CourseData {
  return {
    id,
    title,
    category: categoryName,
    categoryId,
    subcategory: categoryName,
    shortDesc,
    description: `Master ${title} with Atideto Academy. Comprehensive industry-led curriculum featuring real-world projects, mentor code reviews, and enterprise best practices.`,
    duration,
    level,
    rating,
    reviewsCount,
    projectsCount: 4,
    skills,
    technologies,
    image: sampleCourseImg,
    progressPercent: 85,
    modulesCount: 4,
    lessonsCount: 28,
    quizzesCount: 4,
    capstoneProject: {
      title: capstoneTitle,
      deliverable: capstoneDeliverable,
    },
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: `Core Foundations & Syntax of ${title}`,
        lessons: ['Fundamental architecture & concepts', 'Environment setup & standard libraries', 'Idiomatic coding patterns'],
        quiz: 'Foundational Knowledge Assessment',
        assignment: `Hands-on ${title} mini-project`,
      },
      {
        week: 'Weeks 3-5',
        title: `Advanced Architecture & Implementation`,
        lessons: ['Complex data structures & control flow', 'Performance tuning & optimization', 'Design patterns in action'],
        quiz: 'Intermediate Practical Quiz',
        assignment: `Production-ready component build`,
      },
      {
        week: 'Weeks 6-8',
        title: `Enterprise Production & Capstone Delivery`,
        lessons: ['Testing, debugging & CI/CD deployment', 'Security benchmarks & code audits', 'Industry portfolio review'],
        quiz: 'Mastery Certification Exam',
        assignment: capstoneDeliverable,
      },
    ],
  };
}

export const ATIDETO_12_CATEGORY_GROUPS: CategoryGroup[] = [
  // ── 01. Programming Languages (8 courses) ──
  {
    id: 'programming-languages',
    number: '01',
    name: 'Programming Languages',
    icon: Code2,
    eyebrow: 'CORE FOUNDATIONS',
    title: 'Programming Languages',
    description: 'Learn programming fundamentals and problem-solving.',
    subcategories: ['Fundamentals', 'Object-Oriented', 'Algorithms & Data Structures'],
    courses: [
      createCourse('c-programming', 'C Programming', 'programming-languages', 'Programming Languages', 'Beginner', '6 Weeks', 'Master pointers, memory management, data structures, and low-level system software development.', ['Pointers & Addresses', 'Dynamic Memory', 'File I/O', 'Data Structures in C'], ['GCC', 'Make', 'GDB', 'Linux CLI'], 'Low-Level Memory Allocator', 'Custom malloc/free allocator with fragmentation analysis'),
      createCourse('cpp-programming', 'C++ Programming', 'programming-languages', 'Programming Languages', 'Intermediate', '8 Weeks', 'OOP, STL containers, modern C++20 features, smart pointers, and high-performance algorithms.', ['Object-Oriented C++', 'STL Containers', 'Templates & Generics', 'Smart Pointers'], ['Clang', 'CMake', 'Modern C++20'], 'High-Throughput Financial Order Book', 'Low-latency matching engine using modern C++ memory models'),
      createCourse('java-programming', 'Java Programming', 'programming-languages', 'Programming Languages', 'Beginner', '8 Weeks', 'Java 21, JVM internals, concurrency, collections framework, and clean object-oriented architecture.', ['Core Java 21', 'Collections Framework', 'Multithreading & Concurrency', 'JVM Memory Model'], ['Java 21', 'IntelliJ IDEA', 'Maven', 'JUnit 5'], 'Multithreaded Banking Transaction Engine', 'Thread-safe atomic transaction manager with ACID verification'),
      createCourse('python-programming', 'Python Programming', 'programming-languages', 'Programming Languages', 'Beginner', '8 Weeks', 'Python 3.12 syntax, data structures, OOP, file automation, and modular package development.', ['Python 3.12 Idioms', 'OOP & Magic Methods', 'Decorators & Generators', 'Data Parsing'], ['Python', 'pytest', 'Virtualenv', 'Jupyter'], 'Automated Systems Auditing CLI', 'Modular CLI tool with automated PDF report generation and email notifications'),
      createCourse('javascript-programming', 'JavaScript Programming', 'programming-languages', 'Programming Languages', 'Beginner', '7 Weeks', 'Modern ES6+, async/await, closures, prototypes, DOM mechanics, and event loops.', ['ES6+ Syntax', 'Asynchronous Programming', 'Event Loop & Promises', 'Functional JS'], ['Node.js', 'Vite', 'Babel', 'ESLint'], 'Reactive State Management Library', 'Custom lightweight reactive publish-subscribe state engine'),
      createCourse('csharp-programming', 'C# Programming', 'programming-languages', 'Programming Languages', 'Intermediate', '8 Weeks', '.NET 9 ecosystem, LINQ, async tasks, dependency injection, and clean enterprise APIs.', ['.NET 9 Core', 'LINQ & Collections', 'Async/Await Tasks', 'Entity Framework'], ['C# 13', '.NET 9', 'Visual Studio', 'Nuget'], 'Enterprise Inventory Web Service', 'Robust REST microservice with dependency injection and EF Core'),
      createCourse('dsa', 'Data Structures and Algorithms (DSA)', 'programming-languages', 'Programming Languages', 'Intermediate', '10 Weeks', 'Trees, graphs, dynamic programming, backtracking, and competitive algorithmic mastery.', ['Complexity Analysis', 'Graph Algorithms', 'Dynamic Programming', 'Tree Balancing'], ['Java', 'C++', 'LeetCode Patterns'], 'Algorithmic Route Optimization Engine', 'High-speed graph search and memory-efficient routing framework'),
      createCourse('oop', 'Object-Oriented Programming (OOP)', 'programming-languages', 'Programming Languages', 'Beginner', '6 Weeks', 'Encapsulation, inheritance, polymorphism, abstraction, and SOLID design principles.', ['Encapsulation & Abstraction', 'Polymorphic Architecture', 'SOLID Principles', 'Design Patterns'], ['Java', 'Python', 'UML Modeling'], 'Pluggable E-Commerce Checkout Architecture', 'Extensible payment & tax calculation engine using Gang-of-Four patterns'),
    ],
  },

  // ── 02. Web Development (10 courses) ──
  {
    id: 'web-development',
    number: '02',
    name: 'Web Development',
    icon: Globe,
    eyebrow: 'MODERN WEB ENGINEERING',
    title: 'Web Development',
    description: 'Build responsive websites and web applications.',
    subcategories: ['Frontend & Frameworks', 'Full-Stack Systems', 'APIs & Backend'],
    courses: [
      createCourse('html-css', 'HTML and CSS', 'web-development', 'Web Development', 'Beginner', '6 Weeks', 'Semantic HTML5, CSS3 flexbox, grid, animations, and accessible mobile layouts.', ['Semantic HTML5', 'CSS Flexbox & Grid', 'Keyframe Animations', 'Web Accessibility'], ['HTML5', 'CSS3', 'PostCSS'], 'Responsive Editorial Web Publication', 'Multi-device responsive magazine layout with dark/light themes'),
      createCourse('responsive-web-design', 'Responsive Web Design', 'web-development', 'Web Development', 'Beginner', '6 Weeks', 'Mobile-first design principles, media queries, fluid typography, and viewport optimization.', ['Fluid Layouts', 'Mobile-First CSS', 'Responsive Images', 'Container Queries'], ['CSS3', 'Tailwind CSS', 'Chrome DevTools'], 'Omni-Device Product Showcase', 'Fluid multi-breakpoint landing page scoring 100 on Google PageSpeed'),
      createCourse('javascript-dom', 'JavaScript and DOM', 'web-development', 'Web Development', 'Beginner', '6 Weeks', 'DOM manipulation, event delegation, client-side rendering, and dynamic web interfaces.', ['DOM Tree Traversal', 'Event Delegation', 'Custom Events', 'Browser Storage API'], ['Vanilla JS', 'DevTools', 'Web APIs'], 'Interactive Kanban Task Board', 'Drag-and-drop workspace with local storage persistence and history undo'),
      createCourse('reactjs', 'React.js', 'web-development', 'Web Development', 'Intermediate', '8 Weeks', 'React 19 hooks, component architecture, state management, and custom hook ecosystems.', ['React 19 Hooks', 'State Management', 'Component Lifecycle', 'Performance Profiling'], ['React 19', 'Vite', 'Zustand', 'React Query'], 'Real-Time Collaborative Dashboard', 'Analytics telemetry dashboard with live WebSocket data streams'),
      createCourse('nextjs', 'Next.js', 'web-development', 'Web Development', 'Intermediate', '8 Weeks', 'Next.js 15 App Router, Server Components, streaming SSR, and SEO-optimized web systems.', ['App Router Architecture', 'React Server Components', 'Server Actions', 'Dynamic OpenGraph'], ['Next.js 15', 'TypeScript', 'Tailwind', 'Vercel'], 'Full-Stack Headless E-Commerce Storefront', 'Sub-second streaming storefront with integrated Stripe checkout'),
      createCourse('nodejs', 'Node.js', 'web-development', 'Web Development', 'Intermediate', '8 Weeks', 'Node event loop, streams, file system pipelines, clustering, and high-concurrency servers.', ['Event-Driven Architecture', 'Node Streams & Buffers', 'Child Processes & Cluster', 'HTTP/2 Servers'], ['Node.js', 'npm', 'Jest', 'Docker'], 'High-Concurrency Log Streaming Server', 'Zero-memory-leak event stream processor handling 20k events/sec'),
      createCourse('expressjs', 'Express.js', 'web-development', 'Web Development', 'Intermediate', '6 Weeks', 'Robust REST middleware, security headers, routing, error handling, and session authentication.', ['Custom Middleware', 'RESTful Routing', 'JWT & Session Auth', 'Error Handling Pipelines'], ['Express.js', 'Helmet', 'CORS', 'Morgan'], 'Secure Role-Based Portal API', 'Enterprise API with rate limiting, sanitization, and JWT authentication'),
      createCourse('rest-apis', 'REST APIs', 'web-development', 'Web Development', 'Intermediate', '6 Weeks', 'API design guidelines, OpenAPI 3.0 specifications, caching, rate limiting, and versioning.', ['API Versioning Strategies', 'OpenAPI 3.0 Specs', 'HTTP Semantics & Caching', 'Pagination & Filtering'], ['Swagger/OpenAPI', 'Postman', 'Express'], 'Public SaaS Developer API', 'Production REST API with comprehensive automated Swagger documentation'),
      createCourse('full-stack-development', 'Full-Stack Development', 'web-development', 'Web Development', 'Advanced', '12 Weeks', 'End-to-end full stack architecture connecting React/Next.js, Node.js, PostgreSQL, and AWS.', ['End-to-End System Design', 'Full-Stack Type Safety', 'Database Migrations', 'Production Deployment'], ['Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'], 'Enterprise B2B Project Management Suite', 'Complete multi-tenant SaaS application with team workspaces and billing'),
      createCourse('typescript', 'TypeScript', 'web-development', 'Web Development', 'Intermediate', '6 Weeks', 'Type inference, generics, conditional types, mapped types, and strict production setups.', ['Advanced Generics', 'Utility & Mapped Types', 'Strict Null Checks', 'TSConfig Optimization'], ['TypeScript 5', 'tsc', 'ts-node'], 'Type-Safe Schema Validation Engine', 'Custom validation library with full autocomplete type inference'),
    ],
  },

  // ── 03. Mobile App Development (7 courses) ──
  {
    id: 'mobile-app-development',
    number: '03',
    name: 'Mobile App Development',
    icon: Smartphone,
    eyebrow: 'NATIVE & CROSS-PLATFORM MOBILE',
    title: 'Mobile App Development',
    description: 'Create mobile applications for Android and iOS.',
    subcategories: ['Native Android', 'Cross-Platform Frameworks', 'Mobile Deployment'],
    courses: [
      createCourse('android-kotlin', 'Android Development with Kotlin', 'mobile-app-development', 'Mobile App Development', 'Beginner', '10 Weeks', 'Modern Android with Jetpack Compose, Coroutines, Flow, Room database, and MVVM architecture.', ['Jetpack Compose UI', 'Kotlin Coroutines & Flow', 'Room Database', 'Hilt Dependency Injection'], ['Android Studio', 'Kotlin', 'Jetpack', 'Gradle'], 'Offline-First Health Tracker', 'Jetpack Compose application with biometric authentication and background sensors'),
      createCourse('android-java', 'Android Development with Java', 'mobile-app-development', 'Mobile App Development', 'Beginner', '8 Weeks', 'Android SDK fundamentals, Activities, Fragments, Services, and SQLite database storage.', ['Android SDK Lifecycle', 'Fragments & Adapters', 'Broadcast Receivers', 'SQLite & Content Providers'], ['Java', 'Android SDK', 'XML Layouts'], 'City Guide & Route Planner', 'Native Java application with Google Maps integration and offline caches'),
      createCourse('flutter-development', 'Flutter Development', 'mobile-app-development', 'Mobile App Development', 'Beginner', '10 Weeks', 'Build pixel-perfect native iOS & Android applications from a single codebase with Flutter.', ['Widget Tree Architecture', 'State Management (Bloc/Riverpod)', 'Platform Channels', 'Smooth 120fps Animations'], ['Flutter 3', 'Dart', 'DevTools', 'Xcode'], 'FinTech Multi-Currency Digital Wallet', 'Cross-platform financial application with biometric security and card management'),
      createCourse('dart-programming', 'Dart Programming', 'mobile-app-development', 'Mobile App Development', 'Beginner', '6 Weeks', 'Dart language syntax, sound null safety, async isolates, streams, and collection operations.', ['Sound Null Safety', 'Asynchronous Isolates', 'Streams & Futures', 'Dart Collections & Generics'], ['Dart SDK', 'VS Code', 'DartPad'], 'High-Performance Data Ingestion CLI', 'Threaded CLI utility for processing multi-gigabyte log archives'),
      createCourse('react-native', 'React Native', 'mobile-app-development', 'Mobile App Development', 'Intermediate', '10 Weeks', 'Cross-platform mobile apps with React Native, Expo, Native Modules, and offline sync.', ['Expo Ecosystem', 'Reanimated 3 Motion', 'React Navigation', 'Native Module Bridges'], ['React Native', 'Expo', 'TypeScript', 'Redux Toolkit'], 'On-Demand Delivery & Tracking App', 'Real-time driver location tracking with interactive map animations'),
      createCourse('mobile-ui-ux-design', 'Mobile UI/UX Design', 'mobile-app-development', 'Mobile App Development', 'Beginner', '6 Weeks', 'Human Interface Guidelines, Material 3, touch targets, haptic feedback, and fluid gestures.', ['Material 3 Guidelines', 'iOS Human Interface', 'Micro-interactions', 'Gesture Design'], ['Figma', 'Protopie', 'Mirror App'], 'Mobile Banking Design System', 'Complete 50+ component mobile design system ready for developer handoff'),
      createCourse('mobile-app-deployment', 'Mobile App Deployment', 'mobile-app-development', 'Mobile App Development', 'Intermediate', '6 Weeks', 'App Store Connect, Google Play Console, code signing, Fastlane CI/CD automation.', ['App Store Guidelines', 'Google Play Signing', 'Fastlane Automation', 'OTA Updates'], ['Fastlane', 'TestFlight', 'Play Console', 'GitHub Actions'], 'Automated Zero-Touch Release Pipeline', 'CI/CD pipeline delivering automated builds to TestFlight and Internal Play tracks'),
    ],
  },

  // ── 04. Artificial Intelligence and Machine Learning (10 courses) ──
  {
    id: 'ai-ml',
    number: '04',
    name: 'Artificial Intelligence & Machine Learning',
    icon: Cpu,
    eyebrow: 'INTELLIGENCE & PREDICTIVE SYSTEMS',
    title: 'Artificial Intelligence and Machine Learning',
    description: 'Develop intelligent applications and predictive models.',
    subcategories: ['Machine Learning', 'Generative AI & LLMs', 'Computer Vision & NLP'],
    courses: [
      createCourse('ai-fundamentals', 'AI Fundamentals', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Beginner', '6 Weeks', 'Core concepts of intelligence, heuristic search, decision trees, and ethics in AI.', ['Search Algorithms (A*)', 'Knowledge Representation', 'Game Theory & Minimax', 'Ethical AI Guidelines'], ['Python', 'Jupyter', 'Scikit-learn'], 'Autonomous Game Playing Agent', 'A* and Minimax game engine solving complex adversarial mazes'),
      createCourse('machine-learning', 'Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Intermediate', '10 Weeks', 'Supervised and unsupervised learning, regression, classification, clustering, and evaluation.', ['Regression & Classification', 'Ensemble Models (XGBoost)', 'Dimensionality Reduction (PCA)', 'Cross-Validation'], ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'], 'Customer Churn Prediction Engine', 'End-to-end classification pipeline with hyperparameter tuning and ROC analysis'),
      createCourse('deep-learning', 'Deep Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Advanced', '10 Weeks', 'Neural networks, backpropagation, CNNs, RNNs, and PyTorch model architectures.', ['Feedforward Networks', 'Convolutional Architectures', 'Recurrent Neural Nets', 'PyTorch Autograd'], ['PyTorch', 'TensorBoard', 'CUDA'], 'Multi-Class Medical Image Classifier', 'ResNet architecture trained on medical scans with Grad-CAM visualization'),
      createCourse('generative-ai', 'Generative AI', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Intermediate', '8 Weeks', 'Diffusion models, variational autoencoders, GANs, transformer foundations, and RAG.', ['Diffusion Mathematics', 'Latent Space Navigation', 'Transformer Attention', 'RAG Pipelines'], ['HuggingFace', 'LangChain', 'PyTorch'], 'Creative Multimodal Generation Suite', 'Text-to-image and audio generation pipeline with custom style embeddings'),
      createCourse('llms', 'Large Language Models (LLMs)', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Advanced', '8 Weeks', 'Architecture of GPT/Llama, fine-tuning (LoRA/QLoRA), tokenization, and inference optimization.', ['Self-Attention Mechanisms', 'LoRA & QLoRA Fine-Tuning', 'Quantization (GGUF)', 'vLLM Serving'], ['HuggingFace Transformers', 'Ollama', 'vLLM'], 'Domain-Adapted Specialized Legal LLM', 'Quantized Llama-3 model fine-tuned on corporate contract analysis'),
      createCourse('prompt-engineering', 'Prompt Engineering', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Beginner', '5 Weeks', 'Chain-of-thought, few-shot prompting, system steering, hallucination reduction, and evaluation.', ['Few-Shot & Zero-Shot', 'Chain-of-Thought (CoT)', 'System Guardrails', 'Automated Evals'], ['OpenAI API', 'Anthropic Claude', 'DSPy'], 'Production Prompt Evaluation Benchmark', 'Framework evaluating hallucination rates and output consistency across LLM families'),
      createCourse('ai-agents', 'AI Agents', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Advanced', '8 Weeks', 'Autonomous multi-agent architectures, function calling, tool use, and memory systems.', ['LangGraph Workflows', 'Function Calling & Tool Use', 'Vector Memory Retrieval', 'Multi-Agent Coordination'], ['LangGraph', 'CrewAI', 'ChromaDB'], 'Autonomous Market Research Agent Squad', 'Multi-agent system that browses the web, synthesizes data, and produces executive reports'),
      createCourse('nlp', 'Natural Language Processing (NLP)', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Intermediate', '8 Weeks', 'Text tokenization, embeddings, sentiment analysis, NER, and transformer sequence models.', ['Word2Vec & Embeddings', 'Named Entity Recognition', 'BERT & RoBERTa Models', 'Seq2Seq Pipelines'], ['Spacy', 'NLTK', 'Transformers'], 'Financial News Sentiment & Entity Extraction Engine', 'Real-time financial stream parser extracting market sentiment and ticker mentions'),
      createCourse('computer-vision', 'Computer Vision', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Intermediate', '8 Weeks', 'OpenCV image processing, object detection with YOLO, image segmentation, and edge tracking.', ['OpenCV Image Filters', 'YOLOv11 Object Detection', 'Semantic Segmentation', 'Face Recognition'], ['OpenCV', 'Ultralytics YOLO', 'TorchVision'], 'Real-Time Edge Security Surveillance System', 'Live camera stream analyzer detecting unauthorized intrusions and vehicle plates'),
      createCourse('ai-application-development', 'AI Application Development', 'ai-ml', 'Artificial Intelligence and Machine Learning', 'Advanced', '10 Weeks', 'Integrating AI models into enterprise software with streaming responses, vector stores, and APIs.', ['Vector Database Integration', 'Streaming Server Sent Events', 'Latency & Cost Optimization', 'Production Guardrails'], ['Next.js', 'FastAPI', 'Pinecone', 'LangChain'], 'Enterprise Copilot for Technical Documentation', 'Production RAG assistant with cited sources and real-time streaming chat interface'),
    ],
  },

  // ── 05. Data Science and Analytics (10 courses) ──
  {
    id: 'data-science-analytics',
    number: '05',
    name: 'Data Science and Analytics',
    icon: Database,
    eyebrow: 'DATA & PREDICTIVE ANALYTICS',
    title: 'Data Science and Analytics',
    description: 'Turn data into insights and predictions.',
    subcategories: ['Data Analysis', 'BI & Visualization', 'Big Data Engineering'],
    courses: [
      createCourse('data-science-fundamentals', 'Data Science Fundamentals', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '6 Weeks', 'The data science lifecycle, hypothesis formulation, exploratory data analysis, and metrics.', ['Scientific Method in Data', 'Hypothesis Testing', 'Data Cleaning Protocols', 'Metric Design'], ['Python', 'Jupyter', 'Pandas'], 'Global Health Trends Exploratory Analysis', 'Statistical EDA report exploring multi-decade epidemiological indicators'),
      createCourse('data-analysis-python', 'Data Analysis with Python', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '8 Weeks', 'Clean, transform, merge, and aggregate large datasets with idiomatic Python methods.', ['Data Transformation', 'Missing Value Imputation', 'Outlier Detection', 'Automated Cleaning Pipelines'], ['Python', 'Pandas', 'NumPy', 'Seaborn'], 'E-Commerce Retail Transaction Analyzer', 'Pipeline processing 5 million transactions with customer cohort retention analysis'),
      createCourse('numpy-pandas', 'NumPy and Pandas', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '6 Weeks', 'High-speed vectorization, broadcasting, multi-indexing, and DataFrame reshaping.', ['Array Vectorization', 'Broadcasting Rules', 'MultiIndex DataFrames', 'Pivot & Reshape'], ['NumPy', 'Pandas'], 'High-Frequency Financial Tick Parser', 'Vectorized calculation of moving averages and volatility bands over tick datasets'),
      createCourse('sql-for-data-analysis', 'SQL for Data Analysis', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '6 Weeks', 'Complex joins, window functions (ROW_NUMBER, LEAD/LAG), CTEs, and aggregation.', ['Window Functions', 'Common Table Expressions', 'Subqueries & Joins', 'Cohort Analysis in SQL'], ['PostgreSQL', 'BigQuery', 'DBeaver'], 'SaaS Subscription Churn & LTV SQL Suite', 'Complex SQL analytical queries computing rolling MRR, churn rate, and cohort LTV'),
      createCourse('excel-for-analytics', 'Excel for Analytics', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '5 Weeks', 'Advanced formulas (XLOOKUP, INDEX/MATCH), Pivot Tables, Power Query, and dynamic models.', ['XLOOKUP & Dynamic Arrays', 'Pivot Tables & Slicers', 'Power Query ETL', 'Financial Modeling'], ['Microsoft Excel', 'Power Query'], 'Corporate Financial Executive Dashboard', 'Automated multi-year financial forecast model with dynamic scenario toggles'),
      createCourse('power-bi', 'Power BI', 'data-science-analytics', 'Data Science and Analytics', 'Intermediate', '6 Weeks', 'DAX formulas, relational data modeling, interactive visual reports, and Power BI Service.', ['DAX Measures & Columns', 'Star Schema Modeling', 'Interactive Bookmarks', 'Role-Based Row Security'], ['Power BI Desktop', 'DAX Studio'], 'Global Supply Chain Operational Dashboard', 'Interactive executive dashboard displaying supplier latency and fulfillment rates'),
      createCourse('tableau', 'Tableau', 'data-science-analytics', 'Data Science and Analytics', 'Intermediate', '6 Weeks', 'Calculated fields, LOD expressions, dual-axis charts, parameters, and Tableau storyboards.', ['Level of Detail (LOD)', 'Parameters & Sets', 'Geographic Mapping', 'Interactive Stories'], ['Tableau Desktop', 'Tableau Server'], 'Hospital Patient Flow Visual Storyboard', 'Visual telemetry system mapping emergency room wait times and patient triage stages'),
      createCourse('statistics-probability', 'Statistics and Probability', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '6 Weeks', 'Descriptive stats, probability distributions, Central Limit Theorem, and A/B test theory.', ['Normal & Binomial Distributions', 'Central Limit Theorem', 'p-values & Confidence Intervals', 'A/B Testing Methodologies'], ['Python', 'SciPy', 'Statsmodels'], 'Digital Marketing A/B Test Significance Engine', 'Automated statistical testing suite evaluating conversion lift across sample sizes'),
      createCourse('data-visualization', 'Data Visualization', 'data-science-analytics', 'Data Science and Analytics', 'Beginner', '6 Weeks', 'Visual storytelling, color perception, chart selection principles, and interactive charts.', ['Visual Perception Rules', 'Color Theory for Data', 'Interactive Visuals', 'Dashboard Architecture'], ['Matplotlib', 'Plotly', 'Seaborn', 'D3.js'], 'Interactive Climate Telemetry Globe', 'Plotly and D3 visualization displaying historical climate temperature anomalies'),
      createCourse('big-data-fundamentals', 'Big Data Fundamentals', 'data-science-analytics', 'Data Science and Analytics', 'Intermediate', '8 Weeks', 'Hadoop ecosystem, Apache Spark distributed computing, PySpark DataFrames, and Lakehouses.', ['Distributed Computing', 'PySpark Transformations', 'HDFS & Parquet Storage', 'Delta Lake Architecture'], ['Apache Spark', 'PySpark', 'Databricks'], 'Terabyte-Scale Clickstream Processing Job', 'PySpark distributed batch job cleaning and aggregating multi-terabyte web logs'),
    ],
  },

  // ── 06. Cloud Computing and DevOps (10 courses) ──
  {
    id: 'cloud-devops',
    number: '06',
    name: 'Cloud Computing and DevOps',
    icon: Cloud,
    eyebrow: 'INFRASTRUCTURE & GITOPS',
    title: 'Cloud Computing and DevOps',
    description: 'Deploy, automate, and maintain modern applications.',
    subcategories: ['Cloud Platforms', 'Containers & Kubernetes', 'CI/CD & IaC'],
    courses: [
      createCourse('cloud-computing-fundamentals', 'Cloud Computing Fundamentals', 'cloud-devops', 'Cloud Computing and DevOps', 'Beginner', '6 Weeks', 'IaaS vs PaaS vs SaaS, cloud economics, high availability, regions, and core architectures.', ['Shared Responsibility Model', 'High Availability Design', 'Multi-AZ Strategies', 'Cloud Cost Management'], ['AWS', 'Azure', 'GCP Basics'], 'Cloud Architecture Migration Blueprint', 'Strategic migration assessment and cost estimation plan for legacy server infrastructure'),
      createCourse('aws', 'AWS', 'cloud-devops', 'Cloud Computing and DevOps', 'Intermediate', '10 Weeks', 'EC2, S3, RDS, VPC networking, IAM security, Lambda serverless, and CloudWatch telemetry.', ['VPC & Subnets', 'IAM Security Policies', 'Serverless Lambda', 'RDS Multi-AZ'], ['AWS Console', 'AWS CLI', 'CloudFormation'], 'Fault-Tolerant Multi-AZ Web Infrastructure', 'Automated high-availability architecture with application load balancing and auto-scaling'),
      createCourse('microsoft-azure', 'Microsoft Azure', 'cloud-devops', 'Cloud Computing and DevOps', 'Intermediate', '8 Weeks', 'Azure VMs, App Services, Blob storage, Azure SQL, Entra ID (Azure AD), and ARM templates.', ['Azure Virtual Networks', 'App Services Deployment', 'Entra ID Identity', 'Bicep / ARM Templates'], ['Azure Portal', 'Azure CLI', 'Bicep'], 'Enterprise Cloud Workspace on Azure', 'Secure cloud environment with role-based access control and automated backups'),
      createCourse('google-cloud-platform', 'Google Cloud Platform', 'cloud-devops', 'Cloud Computing and DevOps', 'Intermediate', '8 Weeks', 'Compute Engine, Cloud Storage, BigQuery, Google Kubernetes Engine (GKE), and Cloud IAM.', ['GCP Compute & Storage', 'GKE Cluster Operations', 'BigQuery Warehousing', 'Cloud Run Microservices'], ['gcloud CLI', 'Google Cloud Console', 'GKE'], 'Scalable Containerized Service on Cloud Run', 'Zero-scale serverless deployment with automated Cloud Build CI/CD integration'),
      createCourse('linux-administration', 'Linux Administration', 'cloud-devops', 'Cloud Computing and DevOps', 'Beginner', '6 Weeks', 'Bash scripting, systemd services, SSH hardening, user permissions, networking, and cron.', ['Bash Automation Scripts', 'Systemd Service Units', 'File Permissions & ACLs', 'SSH Key Authentication'], ['Ubuntu Server', 'Bash', 'systemctl', 'iptables'], 'Hardened Production Linux Server Setup', 'Automated Bash configuration provisioning firewall rules, SSL certs, and monitoring agents'),
      createCourse('git-and-github', 'Git and GitHub', 'cloud-devops', 'Cloud Computing and DevOps', 'Beginner', '4 Weeks', 'Branching workflows, merge conflicts, interactive rebasing, pull requests, and Git hooks.', ['Git Internal DAG', 'Interactive Rebase', 'Trunk-Based Development', 'Pre-Commit Hooks'], ['Git CLI', 'GitHub', 'GitHub CLI'], 'Multi-Developer Git Workflow Repository', 'Production repository configuration with branch protections and automated issue templates'),
      createCourse('docker', 'Docker', 'cloud-devops', 'Cloud Computing and DevOps', 'Beginner', '6 Weeks', 'Containerization, multi-stage Dockerfiles, Docker Compose, volumes, and image optimization.', ['Containerization Principles', 'Multi-Stage Builds', 'Docker Compose Stacks', 'Volume Persistence'], ['Docker', 'Docker Compose', 'Docker Hub'], 'Microservices Multi-Container Stack', 'Orchestration of Node API, Redis cache, and Postgres database via Docker Compose'),
      createCourse('kubernetes', 'Kubernetes', 'cloud-devops', 'Cloud Computing and DevOps', 'Advanced', '10 Weeks', 'Pods, Deployments, Services, Ingress controllers, Helm charts, and cluster autoscaling.', ['Kubernetes Architecture', 'Deployments & Ingress', 'StatefulSets & PV/PVC', 'Helm Chart Packaging'], ['Kubernetes', 'kubectl', 'Helm', 'Minikube'], 'Production-Grade Kubernetes Deployment', 'Zero-downtime rolling deployment with horizontal pod autoscaling and Helm templates'),
      createCourse('cicd-pipelines', 'CI/CD Pipelines', 'cloud-devops', 'Cloud Computing and DevOps', 'Intermediate', '6 Weeks', 'GitHub Actions, automated testing, container builds, security scans, and deployment stages.', ['GitHub Actions Workflows', 'Matrix Testing Builds', 'Secret Management', 'Automated Releases'], ['GitHub Actions', 'Docker', 'Trivy'], 'Automated Test & Deployment Pipeline', 'Continuous integration workflow testing code, scanning vulnerabilities, and pushing images'),
      createCourse('infrastructure-as-code', 'Infrastructure as Code', 'cloud-devops', 'Cloud Computing and DevOps', 'Advanced', '8 Weeks', 'Terraform syntax, providers, state management, remote backends, and reusable modules.', ['Terraform HCL Syntax', 'State Locking (S3/DynamoDB)', 'Modular Infrastructure', 'Drift Detection'], ['Terraform', 'Terragrunt', 'AWS Provider'], 'Complete Multi-Region Cloud Infrastructure via Terraform', 'Fully modular Terraform codebase spinning up VPC, clusters, and databases in code'),
    ],
  },

  // ── 07. Cybersecurity and Networking (9 courses) ──
  {
    id: 'cybersecurity-networking',
    number: '07',
    name: 'Cybersecurity and Networking',
    icon: ShieldCheck,
    eyebrow: 'SECURITY & DEFENSIVE SYSTEMS',
    title: 'Cybersecurity and Networking',
    description: 'Understand networks, security, and defensive practices.',
    subcategories: ['Offensive Security', 'Defensive & SOC', 'Network Engineering'],
    courses: [
      createCourse('computer-networks', 'Computer Networks', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Beginner', '6 Weeks', 'OSI model, TCP/IP stack, DNS, DHCP, routing protocols, subnetting, and packet capture.', ['OSI 7-Layer Model', 'TCP/IP Handshakes', 'IPv4 Subnetting & CIDR', 'Wireshark Packet Analysis'], ['Wireshark', 'Packet Tracer', 'tcpdump'], 'Enterprise Network Topology Simulation', 'Configured multi-subnet corporate network with dynamic routing and VLAN separation'),
      createCourse('network-security', 'Network Security', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Intermediate', '8 Weeks', 'Firewalls, IDS/IPS, VPN architectures, SSL/TLS handshakes, and perimeter defenses.', ['Firewall Rulesets', 'Snort IDS Configuration', 'WireGuard VPNs', 'TLS 1.3 Cryptography'], ['pfSense', 'Snort', 'OpenVPN', 'Wireshark'], 'Secured Virtual Enterprise Gateway', 'Configured firewall with intrusion detection alerts and encrypted site-to-site VPN'),
      createCourse('cybersecurity-fundamentals', 'Cybersecurity Fundamentals', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Beginner', '6 Weeks', 'CIA triad, threat modeling, security hygiene, malware types, and compliance standards.', ['CIA Triad Principles', 'Threat Vector Modeling', 'Social Engineering Defenses', 'NIST Cybersecurity Framework'], ['Kali Linux', 'Keepass', 'OSINT Tools'], 'Corporate Security Risk Assessment', 'Comprehensive vulnerability audit assessing enterprise attack surface and mitigation strategies'),
      createCourse('ethical-hacking-fundamentals', 'Ethical Hacking Fundamentals', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Intermediate', '10 Weeks', 'Reconnaissance, Nmap port scanning, vulnerability exploitation, and Metasploit basics.', ['Reconnaissance Techniques', 'Nmap Port Scanning', 'Metasploit Exploitation', 'Privilege Escalation Basics'], ['Kali Linux', 'Nmap', 'Metasploit', 'Burp Suite'], 'Authorized Penetration Test Report', 'Hands-on penetration test on isolated target VM with detailed remediation guidance'),
      createCourse('web-application-security', 'Web Application Security', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Intermediate', '8 Weeks', 'OWASP Top 10 vulnerabilities: SQL injection, XSS, CSRF, broken access control, and Burp Suite.', ['OWASP Top 10 Exploits', 'SQL Injection Testing', 'Stored & Reflected XSS', 'Burp Suite Proxy'], ['Burp Suite Community', 'OWASP ZAP', 'Postman'], 'Web Application Security Audit', 'Full vulnerability assessment identifying and patching OWASP Top 10 flaws in target app'),
      createCourse('cryptography', 'Cryptography', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Intermediate', '6 Weeks', 'Symmetric vs asymmetric encryption (AES, RSA), hashing (SHA-256), digital signatures, PKI.', ['Symmetric Encryption (AES)', 'Public-Key RSA & ECC', 'Cryptographic Hashes', 'Digital Certificates & PKI'], ['OpenSSL', 'Python Cryptography'], 'Encrypted Secure Message Exchange', 'Python implementation of hybrid encryption with digital signature verification'),
      createCourse('security-operations-soc', 'Security Operations (SOC)', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Intermediate', '8 Weeks', 'SIEM log monitoring, threat hunting, incident response protocols, and alert triage.', ['SIEM Log Ingestion', 'Incident Response Playbooks', 'Splunk Search Queries', 'Threat Hunting'], ['Splunk', 'Wazuh SIEM', 'Elastic Security'], 'Security Operations Monitoring & Incident Response Lab', 'Configured SIEM dashboard detecting brute-force intrusions with automated alert dispatch'),
      createCourse('digital-forensics', 'Digital Forensics', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Advanced', '8 Weeks', 'Memory dumps, disk image acquisition, evidence preservation, and file carving.', ['Chain of Custody Rules', 'Disk Image Acquisition', 'Memory Dump Analysis with Volatility', 'Log Timeline Reconstruction'], ['Autopsy', 'Volatility', 'FTK Imager'], 'Forensic Post-Mortem Investigation', 'Investigation of compromised system image identifying malware persistence mechanisms'),
      createCourse('cloud-security', 'Cloud Security', 'cybersecurity-networking', 'Cybersecurity and Networking', 'Advanced', '8 Weeks', 'Cloud IAM least privilege, S3 bucket hardening, cloud security posture management (CSPM).', ['Cloud IAM Auditing', 'VPC Flow Log Analysis', 'Key Management (KMS)', 'Cloud Security Benchmarks'], ['AWS GuardDuty', 'ScoutSuite', 'Prowler'], 'Automated Cloud Security Audit Pipeline', 'Continuous cloud compliance scanner checking infrastructure against CIS benchmarks'),
    ],
  },

  // ── 08. Database Technologies (9 courses) ──
  {
    id: 'database-technologies',
    number: '08',
    name: 'Database Technologies',
    icon: Server,
    eyebrow: 'STORAGE & DATA ARCHITECTURE',
    title: 'Database Technologies',
    description: 'Store, query, and manage application data.',
    subcategories: ['Relational Databases', 'NoSQL & Cache', 'Database Administration'],
    courses: [
      createCourse('sql-fundamentals', 'SQL Fundamentals', 'database-technologies', 'Database Technologies', 'Beginner', '6 Weeks', 'DDL and DML, primary keys, foreign keys, filtering, grouping, and relational schemas.', ['Relational Theory', 'Data Definition (DDL)', 'Data Manipulation (DML)', 'Aggregate Queries'], ['PostgreSQL', 'SQLite', 'DBeaver'], 'Relational E-Commerce Database Schema', 'Normalized database structure supporting products, customers, orders, and fulfillment'),
      createCourse('mysql', 'MySQL', 'database-technologies', 'Database Technologies', 'Beginner', '6 Weeks', 'MySQL 8 architecture, InnoDB engine, transactions, stored procedures, and index usage.', ['InnoDB Storage Engine', 'ACID Transactions', 'Stored Procedures & Triggers', 'B-Tree Indexing'], ['MySQL 8', 'MySQL Workbench'], 'High-Performance Customer Order System', 'Optimized database with stored procedures and automated transactional integrity checks'),
      createCourse('postgresql', 'PostgreSQL', 'database-technologies', 'Database Technologies', 'Intermediate', '8 Weeks', 'Advanced PostgreSQL, JSONB fields, full-text search, partitions, and EXPLAIN query analysis.', ['JSONB Semi-Structured Data', 'Full-Text Search Indices', 'Table Partitioning', 'EXPLAIN ANALYZE Optimization'], ['PostgreSQL 16', 'pgAdmin', 'DBeaver'], 'High-Scale Analytics Datastore', 'Partitioned PostgreSQL database with GIN indexing and sub-5ms search queries'),
      createCourse('mongodb', 'MongoDB', 'database-technologies', 'Database Technologies', 'Beginner', '6 Weeks', 'Document-oriented storage, BSON, Aggregation Pipeline, indexing, and Mongoose ODM.', ['Document Modeling', 'Aggregation Pipeline Stages', 'Compound Indices', 'Mongoose ODM Schemas'], ['MongoDB Atlas', 'Compass', 'Node.js'], 'Content Management Document Store', 'Flexible NoSQL document database handling multi-variant product catalogs with aggregation'),
      createCourse('database-design', 'Database Design', 'database-technologies', 'Database Technologies', 'Beginner', '6 Weeks', 'Entity Relationship Diagrams (ERD), normalization (1NF to BCNF), and schema denormalization.', ['ERD Modeling', 'Normal Forms (1NF-3NF-BCNF)', 'Cardinality Constraints', 'Denormalization Trade-offs'], ['Draw.io', 'Lucidchart', 'PostgreSQL'], 'Hospital Management System ERD & Schema', 'Fully normalized enterprise schema with complete referential constraint modeling'),
      createCourse('dbms-concepts', 'DBMS Concepts', 'database-technologies', 'Database Technologies', 'Beginner', '5 Weeks', 'Transactions, concurrency control, two-phase locking, write-ahead logging (WAL), and ACID.', ['ACID Properties Deep-Dive', 'Two-Phase Locking (2PL)', 'Deadlock Detection', 'Write-Ahead Logging'], ['PostgreSQL', 'Theory & Practice'], 'Custom Transaction Isolation Simulator', 'Python simulator demonstrating dirty reads, non-repeatable reads, and serializability'),
      createCourse('database-administration', 'Database Administration', 'database-technologies', 'Database Technologies', 'Advanced', '8 Weeks', 'Backup & point-in-time recovery (PITR), replication, connection pooling, and security audits.', ['Point-in-Time Recovery', 'Master-Replica Streaming', 'PgBouncer Connection Pooling', 'User Permissions & Audits'], ['PostgreSQL', 'PgBouncer', 'pg_dump'], 'High-Availability Database Cluster', 'Replicated database pair with automated failover and automated point-in-time recovery scripts'),
      createCourse('query-optimization', 'Query Optimization', 'database-technologies', 'Database Technologies', 'Intermediate', '6 Weeks', 'Index tuning, query execution plans, reducing table scans, and optimizing join algorithms.', ['Query Plan Diagnostics', 'Covering Indices', 'Hash Joins vs Nested Loops', 'Buffer Cache Tuning'], ['EXPLAIN ANALYZE', 'pg_stat_statements'], 'Database Performance Acceleration Audit', 'Refactoring of slow analytic queries yielding 10x throughput improvement on production dataset'),
      createCourse('redis-and-caching', 'Redis and Caching', 'database-technologies', 'Database Technologies', 'Intermediate', '6 Weeks', 'In-memory key-value data structures, Pub/Sub, cache invalidation strategies, and rate limiting.', ['In-Memory Data Structures', 'Cache Invalidation (Cache-Aside)', 'Redis Pub/Sub Pipelines', 'Sliding Window Rate Limiter'], ['Redis', 'ioredis', 'Docker'], 'High-Throughput Session & Rate Limiting Cache', 'Redis-backed token bucket rate limiter and distributed session store for web cluster'),
    ],
  },

  // ── 09. Software Engineering and Testing (10 courses) ──
  {
    id: 'software-engineering-testing',
    number: '09',
    name: 'Software Engineering and Testing',
    icon: CheckCircle2,
    eyebrow: 'QUALITY & SYSTEM ARCHITECTURE',
    title: 'Software Engineering and Testing',
    description: 'Learn professional development workflows and software quality.',
    subcategories: ['Software Architecture', 'Automation & Quality', 'System Design'],
    courses: [
      createCourse('software-engineering-fundamentals', 'Software Engineering Fundamentals', 'software-engineering-testing', 'Software Engineering and Testing', 'Beginner', '6 Weeks', 'Modular code design, cohesion & coupling, technical debt management, and code reviews.', ['Cohesion & Coupling Metrics', 'Refactoring Best Practices', 'Code Review Checklists', 'Technical Debt Valuation'], ['Git', 'GitHub Pull Requests', 'SonarQube'], 'Software Architecture Modernization Review', 'Refactoring legacy monolithic spaghetti code into clean decoupled modules'),
      createCourse('sdlc', 'Software Development Life Cycle (SDLC)', 'software-engineering-testing', 'Software Engineering and Testing', 'Beginner', '4 Weeks', 'Waterfall, Agile, Scrum, Kanban, requirements gathering, and release management.', ['Agile Principles', 'Sprint Planning & Ceremonies', 'User Story Writing', 'Release Milestone Planning'], ['Jira', 'Confluence', 'GitHub Projects'], 'Software Product Delivery Blueprint', 'Complete sprint planning specification with user stories, acceptance criteria, and burndown charts'),
      createCourse('manual-testing', 'Manual Testing', 'software-engineering-testing', 'Software Engineering and Testing', 'Beginner', '6 Weeks', 'Test plan design, test cases, boundary value analysis, equivalence partitioning, bug reporting.', ['Test Case Authoring', 'Equivalence Partitioning', 'Boundary Value Analysis', 'Severity vs Priority Triaging'], ['Jira', 'TestRail', 'Google Sheets'], 'Enterprise Test Plan & Execution Matrix', 'Comprehensive test matrix and bug reports for commercial SaaS checkout system'),
      createCourse('automation-testing', 'Automation Testing', 'software-engineering-testing', 'Software Engineering and Testing', 'Intermediate', '8 Weeks', 'Automation frameworks, test runners, assertions, Page Object Model (POM), and reporting.', ['Automation Framework Setup', 'Page Object Model (POM)', 'Assertion Libraries', 'HTML Test Reporting'], ['Python', 'pytest', 'Allure Reports'], 'Automated Regression Test Suite', 'Robust test suite running unattended nightly builds with Allure visual reports'),
      createCourse('selenium', 'Selenium', 'software-engineering-testing', 'Software Engineering and Testing', 'Intermediate', '8 Weeks', 'Selenium WebDriver, element locators, synchronization waits, headless testing, cross-browser.', ['WebDriver Architecture', 'Dynamic Element Locators', 'Explicit & Implicit Waits', 'Cross-Browser Grid Execution'], ['Selenium WebDriver', 'Java / Python', 'ChromeDriver'], 'Cross-Browser E-Commerce Test Automation', 'Selenium framework testing checkout flows across Chrome, Firefox, and Safari'),
      createCourse('api-testing', 'API Testing', 'software-engineering-testing', 'Software Engineering and Testing', 'Intermediate', '6 Weeks', 'REST API testing, status code assertions, JSON schema validation, Newman CI/CD execution.', ['REST Status Assertions', 'JSON Schema Validation', 'Authentication Headers', 'Newman CLI Automation'], ['Postman', 'Newman', 'REST Assured'], 'Automated API Regression Test Suite', 'Postman and Newman pipeline executing 100+ endpoint tests on pull request triggers'),
      createCourse('unit-testing', 'Unit Testing', 'software-engineering-testing', 'Software Engineering and Testing', 'Beginner', '6 Weeks', 'Writing isolated unit tests, mock objects, stubs, spies, test coverage analysis, and TDD.', ['Test-Driven Development (TDD)', 'Mocking Dependencies', 'Code Coverage Metrics', 'Parametrized Testing'], ['Jest', 'pytest', 'Mockito'], 'Test-Driven Billing Calculation Module', 'Financial calculation library developed 100% via TDD with 98% line coverage'),
      createCourse('java-testing-junit', 'Java Testing with JUnit', 'software-engineering-testing', 'Software Engineering and Testing', 'Intermediate', '6 Weeks', 'JUnit 5 annotations, lifecycle methods, assertions, Mockito framework, and Spring Boot tests.', ['JUnit 5 Annotations', 'Mockito Mock/Spy', 'Spring Boot Integration Tests', 'Parametrized Tests'], ['JUnit 5', 'Mockito', 'Maven Surefire'], 'Spring Boot Service Test Suite', 'Complete test suite verifying service layer logic and database persistence layers'),
      createCourse('agile-and-scrum', 'Agile and Scrum', 'software-engineering-testing', 'Software Engineering and Testing', 'Beginner', '4 Weeks', 'Scrum master practices, sprint retrospectives, backlog grooming, velocity tracking.', ['Scrum Ceremonies', 'Backlog Grooming', 'Velocity & Burn-up Charts', 'Continuous Improvement'], ['Jira Software', 'Miro', 'Slack'], 'Scrum Team Execution Simulation', 'End-to-end simulation of 2-week sprint with stakeholder demos and retrospective action items'),
      createCourse('system-design-fundamentals', 'System Design Fundamentals', 'software-engineering-testing', 'Software Engineering and Testing', 'Advanced', '8 Weeks', 'Scalability, load balancing, caching tiers, database sharding, CAP theorem, message queues.', ['Horizontal vs Vertical Scaling', 'CAP Theorem Trade-offs', 'Database Sharding Strategies', 'Message Queue Buffers'], ['Kafka', 'Nginx', 'System Design Diagrams'], 'High-Scale Distributed URL Shortener System Design', 'Production architecture handling 100k requests/sec with low latency and high availability'),
    ],
  },

  // ── 10. UI/UX and Product Design (8 courses) ──
  {
    id: 'ui-ux-product-design',
    number: '10',
    name: 'UI/UX and Product Design',
    icon: Layout,
    eyebrow: 'PRODUCT INTERFACES & RESEARCH',
    title: 'UI/UX and Product Design',
    description: 'Design usable, attractive digital products.',
    subcategories: ['Design Systems', 'UX Research', 'Interface Prototyping'],
    courses: [
      createCourse('ui-design-fundamentals', 'UI Design Fundamentals', 'ui-ux-product-design', 'UI/UX and Product Design', 'Beginner', '6 Weeks', 'Visual hierarchy, typography scales, color harmony, spacing grids, and component anatomy.', ['Visual Hierarchy', 'Typography Systems', 'Harmonious Color Palettes', '8pt Spacing Grid'], ['Figma', 'Adobe XD'], 'Modern SaaS Web Application UI', 'Pixel-perfect web interface adhering to strict visual hierarchy and color psychology'),
      createCourse('ux-research', 'UX Research', 'ui-ux-product-design', 'UI/UX and Product Design', 'Beginner', '6 Weeks', 'User interviews, usability testing, journey mapping, personas, and heuristic evaluations.', ['User Interview Protocols', 'Customer Journey Mapping', 'Persona Synthesis', 'Heuristic Evaluation (Nielsen)'], ['Miro', 'Notion', 'UserTesting'], 'Comprehensive UX Research & Usability Study', 'Usability study report analyzing checkout friction with actionable design recommendations'),
      createCourse('wireframing-prototyping', 'Wireframing and Prototyping', 'ui-ux-product-design', 'UI/UX and Product Design', 'Beginner', '6 Weeks', 'Low-fidelity wireframing, high-fidelity interactive clickable prototypes, and user flows.', ['Low-Fi Wireframing', 'Interactive Component States', 'Micro-interactions', 'User Flow Mapping'], ['Figma', 'Protopie'], 'Interactive Mobile App Prototype', 'Clickable mobile prototype with realistic screen transitions and stateful form validations'),
      createCourse('figma', 'Figma', 'ui-ux-product-design', 'UI/UX and Product Design', 'Beginner', '6 Weeks', 'Auto Layout, Component Variants, interactive components, variables, and design tokens.', ['Auto Layout Mastery', 'Component Sets & Variants', 'Figma Variables & Modes', 'Developer Handoff Specs'], ['Figma Desktop', 'Plugins Ecosystem'], 'Complete Digital Product Design File', 'Production Figma file with auto-layout screens, dark/light modes, and interactive tokens'),
      createCourse('design-systems', 'Design Systems', 'ui-ux-product-design', 'UI/UX and Product Design', 'Intermediate', '8 Weeks', 'Atomic design methodology, design token architecture, documentation, and governance.', ['Atomic Design Tokens', 'Component Library Governance', 'Accessibility Guidelines', 'Storybook Synchronization'], ['Figma', 'Zeroheight', 'Storybook'], 'Enterprise Multi-Brand Design System', 'Scalable component library powering both web and mobile digital product lines'),
      createCourse('responsive-interface-design', 'Responsive Interface Design', 'ui-ux-product-design', 'UI/UX and Product Design', 'Beginner', '6 Weeks', 'Adaptive layouts across desktop, tablet, and mobile; touch targets, and responsive patterns.', ['Adaptive vs Responsive Layouts', 'Touch Target Standards', 'Fluid Container Scaling', 'Cross-Platform Adaptation'], ['Figma', 'Chrome Responsive Inspector'], 'Omni-Device Dashboard Interface', 'Adaptive enterprise dashboard providing tailored experiences across all screen sizes'),
      createCourse('accessibility', 'Accessibility', 'ui-ux-product-design', 'UI/UX and Product Design', 'Intermediate', '5 Weeks', 'WCAG 2.2 guidelines, color contrast ratios, screen reader optimization, and inclusive UX.', ['WCAG 2.2 AA Standards', 'Color Contrast Compliance', 'Screen Reader Semantics', 'Focus Trapping & Keyboard Nav'], ['WAVE Tool', 'Axe DevTools', 'NVDA Screen Reader'], 'Accessible Digital Product Audit', 'Full accessibility remediation transforming non-compliant web portal into WCAG AAA standard'),
      createCourse('product-design-fundamentals', 'Product Design Fundamentals', 'ui-ux-product-design', 'UI/UX and Product Design', 'Intermediate', '8 Weeks', 'Product discovery, metrics (AARRR), product-market fit validation, and roadmap strategy.', ['Product Discovery Frameworks', 'Pirate Metrics (AARRR)', 'Feature Prioritization (RICE)', 'Minimum Viable Product (MVP)'], ['Miro', 'Figma', 'Mixpanel Basics'], 'Product Vision & MVP Strategy Deck', 'Complete product design strategy defining user problem, MVP roadmap, and success metrics'),
    ],
  },

  // ── 11. Interview and Career Preparation (10 courses) ──
  {
    id: 'interview-career-prep',
    number: '11',
    name: 'Interview & Career Preparation',
    icon: Award,
    eyebrow: 'CAREER ACCELERATION & INTERVIEWS',
    title: 'Interview and Career Preparation',
    description: 'Prepare students for internships and placements.',
    subcategories: ['Technical Preparation', 'Behavioral & HR', 'Placement Readiness'],
    courses: [
      createCourse('aptitude-logical-reasoning', 'Aptitude and Logical Reasoning', 'interview-career-prep', 'Interview and Career Preparation', 'Beginner', '5 Weeks', 'Pattern recognition, logical deductions, coding-decoding, blood relations, and puzzles.', ['Logical Deductions', 'Pattern Recognition', 'Analytical Puzzles', 'Speed Problem Solving'], ['Practice Tests', 'Online Assessors'], 'Aptitude Speed & Accuracy Portfolio', 'Comprehensive timed benchmark scorecards across 500+ reasoning problems'),
      createCourse('quantitative-aptitude', 'Quantitative Aptitude', 'interview-career-prep', 'Interview and Career Preparation', 'Beginner', '5 Weeks', 'Percentages, profit & loss, time-speed-distance, permutations, probability, and algebra.', ['Arithmetic Short-Cuts', 'Permutations & Combinations', 'Data Interpretation', 'Probability Calculations'], ['Timed Quizzes', 'Formulas Handbook'], 'Quantitative Problem Solving Benchmark', 'High-accuracy assessment records across all standard corporate placement tests'),
      createCourse('technical-interview-prep', 'Technical Interview Preparation', 'interview-career-prep', 'Interview and Career Preparation', 'Intermediate', '8 Weeks', 'Core engineering concepts, live coding whiteboard strategies, and architecture discussions.', ['Whiteboard Problem Solving', 'Complexity Articulation', 'Edge Case Analysis', 'Engineering Trade-offs'], ['LeetCode', 'HackerRank', 'Live Mock Platforms'], 'Technical Interview Demonstration Video', 'Recorded live mock interview demonstrating systematic problem solving and communication'),
      createCourse('hr-interview-prep', 'HR Interview Preparation', 'interview-career-prep', 'Interview and Career Preparation', 'Beginner', '4 Weeks', 'STAR method behavioral stories, leadership questions, compensation talks, and culture fit.', ['STAR Method Storytelling', 'Leadership & Conflict Scenarios', 'Salary Negotiation Tactics', 'Executive Presence'], ['Video Mock Audits', 'STAR Worksheets'], 'Personal Professional Story Matrix', 'Polished set of 10 STAR behavioral stories tailored to top-tier technology employers'),
      createCourse('coding-interview-practice', 'Coding Interview Practice', 'interview-career-prep', 'Interview and Career Preparation', 'Intermediate', '8 Weeks', 'Timed coding drills, top 75 interview patterns, two-pointer, sliding window, and trees.', ['Sliding Window Patterns', 'Two-Pointer Technique', 'Fast & Slow Pointers', 'Graph Search Drills'], ['LeetCode 75', 'NeetCode Roadmap'], 'Verified Coding Interview Portfolio', 'Solutions repository with detailed time/space complexity notes for 150 top patterns'),
      createCourse('dsa-interview-questions', 'Data Structures Interview Questions', 'interview-career-prep', 'Interview and Career Preparation', 'Intermediate', '8 Weeks', 'Most frequently asked tree, graph, dynamic programming, and string manipulation questions.', ['Tree Inversion & Traversal', 'Graph Cycle Detection', 'LRU Cache Implementations', 'DP Knapsack Variations'], ['Java / C++ / Python'], 'DSA Interview Cheat Sheet & Codebase', 'Curated, clean repository of optimal implementations for top 100 corporate questions'),
      createCourse('sql-interview-questions', 'SQL Interview Questions', 'interview-career-prep', 'Interview and Career Preparation', 'Intermediate', '6 Weeks', 'Window functions, duplicate elimination, ranking queries, CTEs, and query performance.', ['Dense Rank vs Rank', 'Self-Joins on Hierarchies', 'Cumulative Totals & Moving Averages', 'Interview Query Speed'], ['PostgreSQL', 'MySQL', 'LeetCode Database'], 'SQL Placement Interview Solution Library', 'Complete collection of solutions and explanations for top 50 database interview challenges'),
      createCourse('resume-portfolio-building', 'Resume and Portfolio Building', 'interview-career-prep', 'Interview and Career Preparation', 'Beginner', '4 Weeks', 'ATS-optimized resume crafting, GitHub profile transformation, and live portfolio websites.', ['ATS Keyword Optimization', 'Impact Bullet Formats (Action + Metric)', 'GitHub README Polish', 'Portfolio Web Presentation'], ['Canva', 'LaTeX / Overleaf', 'GitHub Pages'], 'High-Impact ATS-Compliant Tech Resume', 'Professionally formatted resume scoring 95+ on leading applicant tracking systems'),
      createCourse('group-discussion', 'Group Discussion', 'interview-career-prep', 'Interview and Career Preparation', 'Beginner', '4 Weeks', 'Initiation strategies, articulation of viewpoints, consensus building, and body language.', ['Discussion Initiation Techniques', 'Structured Argument Formulation', 'Active Listening & Synthesis', 'Professional Non-Verbal Signals'], ['Live Video Sessions', 'Evaluation Rubrics'], 'Group Discussion Leadership Evaluation', 'Scorecard recording performance and moderation skills in live simulated discussions'),
      createCourse('mock-assessments', 'Mock Assessments', 'interview-career-prep', 'Interview and Career Preparation', 'Intermediate', '6 Weeks', 'Simulated online assessment tests (OA), timed coding rounds, and aptitude screeners.', ['Timed Test Stamina', 'OA Platform Mechanics', 'Debugging Under Pressure', 'Score Analytics'], ['HackerRank Assessor', 'CodeSignal Simulator'], 'Full-Length Corporate OA Clearance Record', 'Completed series of 5 full-length mock company assessments with detailed performance audits'),
    ],
  },

  // ── 12. Projects, Internships and Career Paths (10 courses) ──
  {
    id: 'projects-internships',
    number: '12',
    name: 'Projects, Internships & Career Paths',
    icon: Rocket,
    eyebrow: 'REAL-WORLD EXPERIENCE',
    title: 'Projects, Internships and Career Paths',
    description: 'Convert learning into practical experience.',
    subcategories: ['Hands-on Capstones', 'Virtual Internships', 'Career Roadmaps'],
    courses: [
      createCourse('beginner-mini-projects', 'Beginner Mini Projects', 'projects-internships', 'Projects, Internships and Career Paths', 'Beginner', '6 Weeks', 'Build 5 foundational software projects to solidify programming logic and syntax.', ['Project Scoping', 'Logic Implementation', 'Version Control Habits', 'Documentation'], ['Git', 'VS Code', 'Multi-Language'], 'Foundational Multi-Project Showcase', 'Portfolio of 5 functional utilities including an expense tracker, weather client, and game'),
      createCourse('full-stack-projects', 'Full-Stack Projects', 'projects-internships', 'Projects, Internships and Career Paths', 'Advanced', '10 Weeks', 'End-to-end full stack web platforms with auth, relational databases, payments, and deployment.', ['Full-Stack Integration', 'Auth & Authorization', 'Payment Gateway Integration', 'Cloud Hosting'], ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe'], 'Production SaaS Marketplace Application', 'Live multi-vendor platform with authenticated accounts, real payments, and admin dashboards'),
      createCourse('ai-ml-projects', 'AI and ML Projects', 'projects-internships', 'Projects, Internships and Career Paths', 'Advanced', '10 Weeks', 'Real-world machine learning and LLM engineering projects deployed as live cloud services.', ['Model Deployment (FastAPI)', 'Docker Containerization', 'Dataset Engineering', 'Inference APIs'], ['PyTorch', 'FastAPI', 'Docker', 'HuggingFace'], 'Predictive Health Telemetry & Diagnostic API', 'Trained ML model served via Dockerized REST API with interactive frontend visualizer'),
      createCourse('mobile-app-projects', 'Mobile App Projects', 'projects-internships', 'Projects, Internships and Career Paths', 'Advanced', '10 Weeks', 'Production-ready iOS and Android mobile apps published on app distribution networks.', ['Native Mobile State', 'Push Notifications', 'Offline Data Synchronization', 'Store Build Generation'], ['Flutter', 'React Native', 'Firebase'], 'On-Demand Service Booking Mobile App', 'Complete mobile application featuring booking flows, push alerts, and map tracking'),
      createCourse('open-source-contributions', 'Open-Source Contributions', 'projects-internships', 'Projects, Internships and Career Paths', 'Intermediate', '6 Weeks', 'Finding beginner-friendly issues, navigating large codebases, contributing PRs to public repos.', ['Codebase Navigation', 'Issue Discovery (Good First Issue)', 'Pull Request Etiquette', 'CLA & CI Compliance'], ['GitHub', 'Git', 'Open Source Ecosystem'], 'Merged Contributions to Popular Open-Source Repositories', 'Verified merged pull requests solving real bugs in active open-source repositories'),
      createCourse('guided-capstone-projects', 'Guided Capstone Projects', 'projects-internships', 'Projects, Internships and Career Paths', 'Advanced', '10 Weeks', 'Dedicated mentorship from senior software engineers on custom enterprise-grade software.', ['Architecture Review Boards', 'System Decomposition', 'Code Quality Benchmarks', 'Final Portfolio Defense'], ['Full-Stack Stacks', 'Cloud Infrastructure'], 'Enterprise Industry Capstone Defense', 'Production software artifact defended before panel of industry software architects'),
      createCourse('virtual-internship-programs', 'Virtual Internship Programs', 'projects-internships', 'Projects, Internships and Career Paths', 'Intermediate', '8 Weeks', 'Simulated corporate engineering work, agile sprints, Jira tickets, and stakeholder syncs.', ['Corporate Sprint Workflows', 'Jira Ticket Resolution', 'Cross-Functional Collaboration', 'Standup Communications'], ['Jira', 'GitHub', 'Slack', 'Zoom'], 'Verified Virtual Internship Completion Record', 'Experience report detailing sprint tickets resolved and feature specifications delivered'),
      createCourse('industry-project-challenges', 'Industry Project Challenges', 'projects-internships', 'Projects, Internships and Career Paths', 'Advanced', '8 Weeks', 'Time-boxed hackathons and client brief challenges solving real business software problems.', ['Rapid Prototyping', 'Feature Prioritization Under Deadlines', 'MVP Pitch Delivery', 'System Stability'], ['Hackathon Toolkits', 'Cloud Deployments'], 'Winning Hackathon Prototype Solution', 'Live deployable solution solving industry challenge with executive pitch deck'),
      createCourse('career-roadmaps', 'Career Roadmaps', 'projects-internships', 'Projects, Internships and Career Paths', 'Beginner', '4 Weeks', 'Clear roadmap planning for Frontend, Backend, Full-Stack, DevOps, Data Science, and AI careers.', ['Skill Gap Analysis', 'Certification Roadmaps', 'Industry Compensation Benchmarks', 'Long-Term Growth Milestones'], ['Roadmap.sh', 'Notion', 'LinkedIn Career Insights'], 'Personalized 2-Year Tech Career Action Plan', 'Comprehensive step-by-step career milestones, project targets, and target company lists'),
      createCourse('portfolio-development', 'Portfolio Development', 'projects-internships', 'Projects, Internships and Career Paths', 'Intermediate', '6 Weeks', 'Design and publish a high-converting, modern developer portfolio website with interactive showcases.', ['Modern Editorial Design', 'Case Study Storytelling', 'Performance Optimization', 'Custom Domain & Analytics'], ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'], 'Live Production Developer Portfolio', 'Stunning live personal portfolio site highlighting real projects, case studies, and contact forms'),
    ],
  },
];

// Flat list of all 111 courses
export const ALL_COURSES_LIST: CourseData[] = ATIDETO_12_CATEGORY_GROUPS.flatMap(g => g.courses);

// Helper to look up course by ID
export function getCourseById(courseId: string): CourseData | undefined {
  return ALL_COURSES_LIST.find(c => c.id === courseId);
}
