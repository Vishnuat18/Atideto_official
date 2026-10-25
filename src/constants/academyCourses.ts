export interface CourseModule {
  week: string;
  title: string;
  topics: string[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner to Advanced' | 'Intermediate to Advanced';
  rating: number;
  reviewsCount: number;
  projectsCount: number;
  skills: string[];
  technologies: string[];
  highlights: string[];
  curriculum: CourseModule[];
  careerRoles: string[];
  certification: string;
  badge?: string;
}

export const COURSE_CATEGORIES = [
  { id: 'all', label: 'All Courses' },
  { id: 'ai-ml', label: 'AI & Machine Learning' },
  { id: 'fullstack', label: 'Full Stack & Web' },
  { id: 'cloud-devops', label: 'Cloud & DevOps' },
  { id: 'cybersecurity', label: 'Cyber Security' },
  { id: 'mobile', label: 'Mobile Engineering' },
  { id: 'data', label: 'Data Science & Big Data' },
  { id: 'ui-ux', label: 'UI/UX & Product Design' },
  { id: 'core', label: 'Core Systems & Languages' }
];

export const ACADEMY_COURSES: AcademyCourse[] = [
  // ── 1. AI & Machine Learning ──
  {
    id: 'generative-ai-engineering',
    title: 'Generative AI & LLM Systems Engineering',
    category: 'AI & Machine Learning',
    categoryId: 'ai-ml',
    shortDesc: 'Build autonomous agents, RAG pipelines, fine-tune models, and deploy scalable AI applications.',
    description: 'A comprehensive engineering program covering prompt engineering, embeddings, vector databases, LangChain, LlamaIndex, fine-tuning open-source LLMs (Llama 3, Mistral), and production deployment with vLLM and FastAPI.',
    duration: '12 Weeks',
    level: 'Intermediate',
    rating: 4.95,
    reviewsCount: 340,
    projectsCount: 6,
    skills: ['LangChain', 'LlamaIndex', 'RAG Pipelines', 'Vector DBs (Pinecone, Qdrant)', 'Model Fine-tuning (LoRA/QLoRA)', 'Autonomous Agents'],
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'Docker', 'OpenAI API'],
    highlights: ['Production RAG enterprise pipeline', 'Multi-agent orchestration with AutoGen', 'Fine-tuned domain model on GPU cloud'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Foundations of Modern LLMs & Prompt Architecture', topics: ['Transformer architectures', 'Embeddings & tokenization', 'Zero-shot, Few-shot & Chain-of-Thought prompting'] },
      { week: 'Weeks 4-6', title: 'Advanced Retrieval-Augmented Generation (RAG)', topics: ['Chunking strategies', 'Hybrid vector search', 'Re-ranking & hallucination guards'] },
      { week: 'Weeks 7-9', title: 'Autonomous Agents & Function Calling', topics: ['LangGraph workflows', 'Tool calling APIs', 'Stateful conversational memory'] },
      { week: 'Weeks 10-12', title: 'Fine-Tuning, Quantization & Production Serving', topics: ['PEFT / QLoRA with Hugging Face', 'vLLM inference acceleration', 'Production monitoring & evaluations'] }
    ],
    careerRoles: ['Generative AI Engineer', 'AI Solutions Architect', 'LLM Application Developer'],
    certification: 'Atideto Certified Generative AI Engineer',
    badge: 'Trending & High Demand'
  },
  {
    id: 'ai-autonomous-agents',
    title: 'Autonomous AI Agents & Multi-Agent Workflows',
    category: 'AI & Machine Learning',
    categoryId: 'ai-ml',
    shortDesc: 'Architect self-directed AI agents capable of planning, browsing, coding, and collaborative execution.',
    description: 'Learn the architectural patterns behind autonomous agents. Build agents with memory, self-correction, tool execution, and multi-agent coordination using CrewAI and LangGraph.',
    duration: '10 Weeks',
    level: 'Advanced',
    rating: 4.92,
    reviewsCount: 210,
    projectsCount: 5,
    skills: ['Multi-Agent Architecture', 'CrewAI', 'LangGraph', 'Browser Automation', 'Self-Healing Systems'],
    technologies: ['Python', 'LangGraph', 'Playwright', 'FastAPI', 'Docker', 'Redis'],
    highlights: ['Automated market intelligence agent', 'Self-debugging software engineer bot', 'Multi-agent legal contract reviewer'],
    curriculum: [
      { week: 'Weeks 1-2', title: 'Agent Cognitive Architectures', topics: ['ReAct prompting', 'Plan-and-Solve patterns', 'Hierarchical planning'] },
      { week: 'Weeks 3-5', title: 'Agent Tooling & Environmental Control', topics: ['Browser use with Playwright', 'SQL agent execution', 'Sandboxed code execution'] },
      { week: 'Weeks 6-8', title: 'Multi-Agent Collaboration with CrewAI & LangGraph', topics: ['Role assignment', 'Message bus patterns', 'Human-in-the-loop validation'] },
      { week: 'Weeks 9-10', title: 'Production Reliability & Guardrails', topics: ['Loop detection', 'Cost controls & caching', 'Evals for non-deterministic agents'] }
    ],
    careerRoles: ['Agentic AI Engineer', 'AI Automation Specialist', 'Chief AI Architect'],
    certification: 'Atideto Autonomous Systems Specialist',
    badge: 'Next-Gen'
  },
  {
    id: 'machine-learning-deep-learning',
    title: 'Machine Learning & Deep Neural Networks',
    category: 'AI & Machine Learning',
    categoryId: 'ai-ml',
    shortDesc: 'Master mathematical foundations, classical ML algorithms, CNNs, RNNs, and transformer models.',
    description: 'From linear algebra and gradient descent to building custom neural networks in PyTorch, computer vision with OpenCV, and real-time inference on edge devices.',
    duration: '14 Weeks',
    level: 'Beginner to Advanced',
    rating: 4.88,
    reviewsCount: 420,
    projectsCount: 7,
    skills: ['Supervised Learning', 'Deep Learning', 'PyTorch', 'Computer Vision', 'Hyperparameter Tuning'],
    technologies: ['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'PyTorch', 'OpenCV'],
    highlights: ['Medical image classification with ResNet', 'Real-time object detection with YOLOv8', 'Time series stock forecasting'],
    curriculum: [
      { week: 'Weeks 1-4', title: 'Math Foundations & Classical ML', topics: ['Linear algebra & calculus for ML', 'Regression, Trees & SVMs', 'Clustering & PCA'] },
      { week: 'Weeks 5-8', title: 'Deep Neural Networks with PyTorch', topics: ['Backpropagation math', 'Custom PyTorch modules', 'Regularization & optimization algorithms'] },
      { week: 'Weeks 9-11', title: 'Computer Vision & Convolutional Nets', topics: ['CNN architectures (ResNet, EfficientNet)', 'Transfer learning', 'YOLO object detection'] },
      { week: 'Weeks 12-14', title: 'Sequence Modeling & MLOps Deployment', topics: ['Transformers & attention mechanisms', 'TorchScript & ONNX export', 'FastAPI model serving'] }
    ],
    careerRoles: ['Machine Learning Engineer', 'Computer Vision Engineer', 'AI Research Scientist'],
    certification: 'Atideto Certified ML & DL Practitioner'
  },

  // ── 2. Full Stack & Web Engineering ──
  {
    id: 'fullstack-mern-pro',
    title: 'Full Stack MERN Architecture & Enterprise Apps',
    category: 'Full Stack & Web',
    categoryId: 'fullstack',
    shortDesc: 'Master full-stack JavaScript: React 19, Node.js microservices, Express, MongoDB, and Redux Toolkit.',
    description: 'Learn modern full-stack development by engineering scalable web apps from ground zero. Build enterprise authentication, payment gateways, realtime websockets, and automated CI/CD deployments.',
    duration: '14 Weeks',
    level: 'All Levels',
    rating: 4.96,
    reviewsCount: 680,
    projectsCount: 8,
    skills: ['React 19', 'Node.js', 'Express', 'MongoDB Aggregations', 'JWT & OAuth', 'WebSockets'],
    technologies: ['JavaScript/TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Stripe'],
    highlights: ['Production SaaS application with billing', 'Real-time collaborative workspace', 'Role-based access control engine'],
    curriculum: [
      { week: 'Weeks 1-4', title: 'Modern React & State Architecture', topics: ['Hooks, Suspense & Server Components', 'Redux Toolkit & Zustand', 'Tailwind CSS & UI component systems'] },
      { week: 'Weeks 5-8', title: 'Backend APIs with Node & Express', topics: ['RESTful API design', 'Authentication & JWT security', 'File streaming & uploads'] },
      { week: 'Weeks 9-11', title: 'Database Mastery with MongoDB', topics: ['Complex schemas & indexes', 'Aggregation pipeline power', 'Transactions & replication'] },
      { week: 'Weeks 12-14', title: 'Realtime, Payments & Production Cloud', topics: ['Socket.io bidirectional sync', 'Stripe checkout & webhooks', 'Dockerizing & cloud deployment'] }
    ],
    careerRoles: ['Full Stack Developer', 'MERN Stack Engineer', 'Frontend Team Lead'],
    certification: 'Atideto Certified Full Stack Professional',
    badge: 'Highest Placement'
  },
  {
    id: 'nextjs-typescript-masterclass',
    title: 'Next.js 15, React 19 & TypeScript Masterclass',
    category: 'Full Stack & Web',
    categoryId: 'fullstack',
    shortDesc: 'Build high-speed, SEO-optimized, production-ready web platforms with Next.js App Router.',
    description: 'Deep dive into Next.js 15 App Router, React Server Components (RSC), Server Actions, Prisma ORM, PostgreSQL, Tailwind CSS, Turbopack, and edge runtime deployment.',
    duration: '10 Weeks',
    level: 'Intermediate',
    rating: 4.94,
    reviewsCount: 390,
    projectsCount: 5,
    skills: ['Next.js 15 App Router', 'React Server Components', 'TypeScript Strict Mode', 'Prisma ORM', 'Server Actions', 'Edge Functions'],
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Vercel'],
    highlights: ['High-throughput E-commerce marketplace', 'B2B Analytics Dashboard with real-time charts', 'Headless CMS blog with sub-second page speed'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Next.js App Router & Server Architecture', topics: ['Layouts, routes & parallel routes', 'Server vs Client components', 'Caching & revalidation strategies'] },
      { week: 'Weeks 4-6', title: 'Full Stack Data Layer with Prisma & Postgres', topics: ['Relational schema design', 'Prisma migrations & transactions', 'Server Actions for zero-API mutations'] },
      { week: 'Weeks 7-8', title: 'Authentication, Security & Performance', topics: ['NextAuth / Clerk authentication', 'Rate limiting & middleware guards', 'Core Web Vitals optimization'] },
      { week: 'Weeks 9-10', title: 'Deployment, Monitoring & Edge Network', topics: ['Vercel Edge functions', 'Postgres connection pooling (PgBouncer)', 'Automated testing with Vitest & Playwright'] }
    ],
    careerRoles: ['Senior Frontend Engineer', 'Next.js Specialist', 'Full Stack TypeScript Engineer'],
    certification: 'Atideto Certified Next.js Architect'
  },
  {
    id: 'backend-go-distributed',
    title: 'Backend Engineering with Go & Distributed Systems',
    category: 'Full Stack & Web',
    categoryId: 'fullstack',
    shortDesc: 'Architect high-throughput microservices, gRPC interfaces, and distributed caching in Golang.',
    description: 'Master Go concurrency (goroutines, channels, sync primitives), build blazingly fast gRPC and REST APIs, design database access layers, and implement event-driven architectures with Kafka and Redis.',
    duration: '12 Weeks',
    level: 'Intermediate to Advanced',
    rating: 4.91,
    reviewsCount: 185,
    projectsCount: 5,
    skills: ['Golang Concurrency', 'gRPC & Protocol Buffers', 'Microservices', 'Distributed Caching', 'Event-Driven Systems'],
    technologies: ['Go (Golang)', 'gRPC', 'PostgreSQL', 'Redis', 'Apache Kafka', 'Docker'],
    highlights: ['High-concurrency payment processing gateway', 'Real-time distributed pub/sub broker', 'Fault-tolerant distributed rate limiter'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Go Core & Concurrency Deep Dive', topics: ['Pointers, structs & interfaces', 'Goroutines, channels & select', 'Worker pools & mutex locks'] },
      { week: 'Weeks 4-6', title: 'Microservices with gRPC & REST', topics: ['Protocol buffers definition', 'gRPC unary & streaming APIs', 'Structured logging & middleware'] },
      { week: 'Weeks 7-9', title: 'High-Performance Persistence Layer', topics: ['SQL optimizations & connection pools', 'Redis caching strategies', 'Transactions & database migrations'] },
      { week: 'Weeks 10-12', title: 'Distributed Systems Patterns & Deployment', topics: ['Kafka message producers & consumers', 'Idempotency & circuit breakers', 'Docker & Kubernetes deployment'] }
    ],
    careerRoles: ['Go Backend Engineer', 'Systems Architect', 'Distributed Systems Specialist'],
    certification: 'Atideto Distributed Systems Engineer'
  },

  // ── 3. Cloud & DevOps ──
  {
    id: 'cloud-aws-gcp-architect',
    title: 'Cloud Architecture & Multi-Cloud Engineering (AWS & GCP)',
    category: 'Cloud & DevOps',
    categoryId: 'cloud-devops',
    shortDesc: 'Design enterprise cloud architectures, VPC networks, serverless compute, and cost-optimized infrastructure.',
    description: 'Comprehensive multi-cloud training covering AWS (EC2, S3, RDS, Lambda, IAM, ECS, CloudFront) and Google Cloud Platform (Compute Engine, Cloud Run, GKE, BigQuery) with industry best practices.',
    duration: '12 Weeks',
    level: 'Intermediate',
    rating: 4.89,
    reviewsCount: 310,
    projectsCount: 6,
    skills: ['AWS Services', 'GCP Architecture', 'VPC Networking', 'Serverless Architecture', 'Cloud Security & IAM'],
    technologies: ['AWS', 'GCP', 'Terraform', 'Linux', 'Docker', 'CloudWatch'],
    highlights: ['Multi-region disaster recovery architecture', 'Serverless event-driven processing pipeline', 'Enterprise zero-trust VPC setup'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Cloud Fundamentals & Identity Architecture', topics: ['IAM policies & role-based access', 'VPC, subnets & routing tables', 'Network security groups & NACLs'] },
      { week: 'Weeks 4-6', title: 'Compute & Storage Ecosystems', topics: ['EC2, Compute Engine & autoscaling', 'S3, GCS storage tiers & lifecycles', 'Managed relational databases (RDS, Cloud SQL)'] },
      { week: 'Weeks 7-9', title: 'Serverless & Modern Micro-Compute', topics: ['AWS Lambda & Cloud Functions', 'API Gateway integrations', 'SQS, SNS & EventBridge messaging'] },
      { week: 'Weeks 10-12', title: 'High Availability & Cost Governance', topics: ['Multi-AZ architectures & load balancing', 'FinOps & cost optimization', 'CloudWatch & Cloud Monitoring alerting'] }
    ],
    careerRoles: ['Cloud Solutions Architect', 'AWS Cloud Engineer', 'Cloud Operations Specialist'],
    certification: 'Atideto Certified Multi-Cloud Architect'
  },
  {
    id: 'devops-kubernetes-terraform',
    title: 'DevOps Engineering, Kubernetes & Terraform (IaC)',
    category: 'Cloud & DevOps',
    categoryId: 'cloud-devops',
    shortDesc: 'Master modern CI/CD, Kubernetes container orchestration, and Infrastructure as Code with Terraform.',
    description: 'Transform software delivery through automated GitHub Actions pipelines, ArgoCD GitOps, production Kubernetes cluster management, Helm charts, Terraform infrastructure provisioning, and Prometheus observability.',
    duration: '14 Weeks',
    level: 'Intermediate to Advanced',
    rating: 4.95,
    reviewsCount: 450,
    projectsCount: 7,
    skills: ['Docker & Containerization', 'Kubernetes (K8s)', 'Terraform IaC', 'GitHub Actions CI/CD', 'GitOps with ArgoCD', 'Prometheus & Grafana'],
    technologies: ['Docker', 'Kubernetes', 'Terraform', 'Helm', 'GitHub Actions', 'ArgoCD', 'Prometheus'],
    highlights: ['Production-ready Kubernetes cluster setup', 'Automated zero-downtime CI/CD deployment pipeline', 'Terraform infrastructure provisioning for enterprise SaaS'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Advanced Docker & Linux Systems', topics: ['Multi-stage Docker builds', 'Container security & scanning', 'Linux networking & systemd'] },
      { week: 'Weeks 4-7', title: 'Kubernetes Production Orchestration', topics: ['Pods, Deployments, Services & Ingress', 'StatefulSets & Persistent Volumes', 'ConfigMaps, Secrets & Helm packaging'] },
      { week: 'Weeks 8-10', title: 'Infrastructure as Code with Terraform', topics: ['HCL syntax & resource blocks', 'Remote state locking & modules', 'Multi-environment workspace management'] },
      { week: 'Weeks 11-14', title: 'CI/CD Pipelines, GitOps & Observability', topics: ['GitHub Actions automated testing', 'GitOps with ArgoCD', 'Prometheus metrics & Grafana dashboards'] }
    ],
    careerRoles: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Kubernetes Administrator'],
    certification: 'Atideto Certified DevOps & SRE Professional',
    badge: 'High Salary'
  },

  // ── 4. Cyber Security ──
  {
    id: 'cybersecurity-ethical-hacking',
    title: 'Cyber Security & Ethical Hacking Mastery',
    category: 'Cyber Security',
    categoryId: 'cybersecurity',
    shortDesc: 'Hands-on penetration testing, web application security (OWASP Top 10), and vulnerability assessment.',
    description: 'Master ethical hacking from reconnaissance to exploitation and mitigation. Learn Kali Linux, Burp Suite Pro, Metasploit, Wireshark, SQL injection, XSS, and privilege escalation on real lab targets.',
    duration: '12 Weeks',
    level: 'All Levels',
    rating: 4.93,
    reviewsCount: 380,
    projectsCount: 6,
    skills: ['Penetration Testing', 'Web Application Security', 'Network Analysis', 'Vulnerability Assessment', 'Burp Suite Pro', 'Metasploit'],
    technologies: ['Kali Linux', 'Burp Suite', 'Wireshark', 'Nmap', 'Metasploit', 'Python Security Scripting'],
    highlights: ['End-to-end web application penetration test report', 'Active Directory red-team simulation', 'CTF (Capture The Flag) lab challenge completion'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Networking Fundamentals & Reconnaissance', topics: ['TCP/IP stack & protocol analysis', 'OSINT & digital footprinting', 'Port scanning & enumeration with Nmap'] },
      { week: 'Weeks 4-6', title: 'Web App Security & OWASP Top 10', topics: ['SQL Injection & Blind SQLi', 'Cross-Site Scripting (XSS) & CSRF', 'Authentication bypass & IDOR vulnerabilities'] },
      { week: 'Weeks 7-9', title: 'Network Exploitation & System Security', topics: ['Metasploit framework execution', 'Privilege escalation on Linux & Windows', 'Wireshark packet sniffing & MITM attacks'] },
      { week: 'Weeks 10-12', title: 'Professional Reporting & Defense Countermeasures', topics: ['Writing industry-standard pentest audits', 'Web Application Firewalls (WAF)', 'Remediation architecture'] }
    ],
    careerRoles: ['Security Analyst', 'Penetration Tester', 'SOC Analyst', 'Ethical Hacker'],
    certification: 'Atideto Certified Security Specialist'
  },

  // ── 5. Mobile Engineering ──
  {
    id: 'flutter-dart-crossplatform',
    title: 'Flutter & Dart Cross-Platform Mobile Engineering',
    category: 'Mobile Engineering',
    categoryId: 'mobile',
    shortDesc: 'Build fluid iOS and Android apps with 60 FPS performance, BloC architecture, and Firebase backend.',
    description: 'Master Flutter from widget tree architecture to clean architecture, state management with BLoC, animation controllers, offline SQLite caching, and App Store / Google Play publishing.',
    duration: '10 Weeks',
    level: 'All Levels',
    rating: 4.91,
    reviewsCount: 290,
    projectsCount: 5,
    skills: ['Flutter Framework', 'Dart Programming', 'BLoC State Management', 'Firebase Integration', 'Offline Data Sync', 'App Store Publishing'],
    technologies: ['Flutter', 'Dart', 'Firebase', 'SQLite', 'REST APIs', 'Figma'],
    highlights: ['Production Food Delivery App with real-time tracking', 'Crypto Portfolio & Wallet app', 'Offline-first audio streaming player'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Dart Core & Flutter UI Foundations', topics: ['Dart OOP & asynchronous programming', 'Stateless vs Stateful widgets', 'Responsive layouts & themes'] },
      { week: 'Weeks 4-6', title: 'State Management & Clean Architecture', topics: ['BLoC & Cubit state handling', 'Repository pattern & dependency injection', 'Navigation 2.0 & deep linking'] },
      { week: 'Weeks 7-8', title: 'Native Device APIs & Offline Storage', topics: ['Camera, geolocation & notifications', 'SQLite local database & caching', 'Firebase Authentication & Firestore'] },
      { week: 'Weeks 9-10', title: 'Performance, Testing & Store Publishing', topics: ['App size reduction & 60 FPS profiling', 'Unit & widget testing', 'iOS and Android app store submission'] }
    ],
    careerRoles: ['Flutter Mobile Developer', 'Cross-Platform Engineer', 'Mobile App Lead'],
    certification: 'Atideto Certified Flutter Developer'
  },
  {
    id: 'react-native-expo-pro',
    title: 'React Native & Expo Enterprise Mobile Apps',
    category: 'Mobile Engineering',
    categoryId: 'mobile',
    shortDesc: 'Leverage your React skills to build native mobile experiences for iOS & Android with Expo.',
    description: 'Learn modern React Native with Expo Router, TypeScript, native gestures with Reanimated 3, offline-first sync with WatermelonDB, and push notifications.',
    duration: '10 Weeks',
    level: 'Intermediate',
    rating: 4.89,
    reviewsCount: 240,
    projectsCount: 5,
    skills: ['React Native', 'Expo Router', 'Reanimated 3', 'TypeScript Mobile', 'Push Notifications'],
    technologies: ['React Native', 'Expo', 'TypeScript', 'Redux / Zustand', 'Tailwind NativeWind'],
    highlights: ['Social networking app with video feeds', 'Health & fitness tracker with health kit integration', 'Fintech banking interface with biometric login'],
    curriculum: [
      { week: 'Weeks 1-2', title: 'React Native & Expo Ecosystem', topics: ['Expo Router file-based navigation', 'Core components & styling with NativeWind', 'Responsive mobile design'] },
      { week: 'Weeks 3-5', title: 'Advanced Gestures & Fluid Animations', topics: ['React Native Reanimated 3', 'Gesture Handler interactions', 'Shared element transitions'] },
      { week: 'Weeks 6-8', title: 'Device Hardware & Offline Architecture', topics: ['Biometrics (Face ID / Fingerprint)', 'Push notifications with Expo', 'Offline data sync & caching'] },
      { week: 'Weeks 9-10', title: 'EAS Builds & App Store Deployment', topics: ['Expo Application Services (EAS)', 'Over-The-Air (OTA) updates', 'Production release pipeline'] }
    ],
    careerRoles: ['React Native Developer', 'Mobile Frontend Engineer', 'Mobile Architect'],
    certification: 'Atideto Certified React Native Engineer'
  },

  // ── 6. Data Science & Big Data ──
  {
    id: 'data-science-python-pandas',
    title: 'Data Science & Analytics with Python & SQL',
    category: 'Data Science & Big Data',
    categoryId: 'data',
    shortDesc: 'Extract insights from messy data with Pandas, NumPy, statistical hypothesis testing, and Seaborn.',
    description: 'Transform raw data into strategic business decisions. Master data wrangling, exploratory data analysis (EDA), A/B testing statistical rigor, interactive dashboards, and machine learning forecasting.',
    duration: '12 Weeks',
    level: 'All Levels',
    rating: 4.90,
    reviewsCount: 520,
    projectsCount: 6,
    skills: ['Python Data Stack', 'Pandas & NumPy', 'SQL for Analytics', 'Exploratory Data Analysis', 'Statistical Testing', 'Tableau / PowerBI'],
    technologies: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'Matplotlib', 'Seaborn', 'PowerBI'],
    highlights: ['E-commerce customer churn prediction', 'Marketing attribution & cohort analysis', 'Interactive executive KPI PowerBI dashboard'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'Python Foundations & Data Wrangling', topics: ['Python data structures & functions', 'Pandas indexing, filtering & grouping', 'Handling missing values & outliers'] },
      { week: 'Weeks 4-6', title: 'Advanced SQL for Analytics', topics: ['Window functions & subqueries', 'CTE recursive queries', 'Database performance & indexing'] },
      { week: 'Weeks 7-9', title: 'Statistics, EDA & Visual Storytelling', topics: ['Probability distributions & p-values', 'A/B testing experimentation', 'Matplotlib, Seaborn & Plotly charts'] },
      { week: 'Weeks 10-12', title: 'Predictive Modeling & Executive Dashboards', topics: ['Linear & logistic regression modeling', 'Building enterprise PowerBI reports', 'Automating daily data reports'] }
    ],
    careerRoles: ['Data Analyst', 'Data Scientist', 'Business Intelligence Developer'],
    certification: 'Atideto Certified Data Analyst'
  },

  // ── 7. UI/UX & Product Design ──
  {
    id: 'ui-ux-design-systems',
    title: 'UI/UX Design, Design Systems & Figma Mastery',
    category: 'UI/UX & Product Design',
    categoryId: 'ui-ux',
    shortDesc: 'Design pixel-perfect interfaces, scalable component libraries, and interactive prototypes in Figma.',
    description: 'Learn modern digital product design from user research and wireframing to atomic design systems in Figma (auto layout, variables, component variants) and developer handoff.',
    duration: '8 Weeks',
    level: 'All Levels',
    rating: 4.94,
    reviewsCount: 310,
    projectsCount: 4,
    skills: ['Figma Pro', 'Design Systems', 'Atomic Design', 'User Research', 'Interactive Prototyping', 'Design Tokens'],
    technologies: ['Figma', 'FigJam', 'Framer', 'Maze', 'Notion'],
    highlights: ['Complete enterprise SaaS design system with 100+ components', 'Mobile fintech banking app prototype', 'E-commerce checkout UX audit & redesign'],
    curriculum: [
      { week: 'Weeks 1-2', title: 'UX Research & Information Architecture', topics: ['User personas & journey mapping', 'Wireframing & user flow diagrams', 'Competitor heuristics analysis'] },
      { week: 'Weeks 3-4', title: 'Visual Design Fundamentals in Figma', topics: ['Typography scales & color theory', 'Grids, spacing & visual hierarchy', 'Micro-interactions & icon systems'] },
      { week: 'Weeks 5-6', title: 'Design Systems & Advanced Figma Features', topics: ['Auto Layout 5.0 mastery', 'Component variants & properties', 'Figma variables & design tokens'] },
      { week: 'Weeks 7-8', title: 'Interactive Prototyping & Developer Handoff', topics: ['Smart animate & micro-animations', 'Usability testing with real users', 'Spec documentation & dev handoff'] }
    ],
    careerRoles: ['UI/UX Designer', 'Product Designer', 'Design Systems Lead'],
    certification: 'Atideto Certified Product Designer'
  },

  // ── 8. Core Systems & Languages ──
  {
    id: 'java-enterprise-spring-boot',
    title: 'Java Enterprise & Spring Boot Microservices',
    category: 'Core Systems & Languages',
    categoryId: 'core',
    shortDesc: 'Master Java 21, Object-Oriented Design, Spring Boot 3, Hibernate JPA, and secure REST APIs.',
    description: 'The definitive enterprise backend course. Learn Java concurrency, Spring Security, Hibernate ORM, Dockerized microservices, Kafka messaging, and JUnit testing.',
    duration: '12 Weeks',
    level: 'Beginner to Advanced',
    rating: 4.92,
    reviewsCount: 480,
    projectsCount: 6,
    skills: ['Java 21 Core & OOP', 'Spring Boot 3', 'Hibernate / JPA', 'Spring Security (OAuth2)', 'Microservices Architecture', 'JUnit & Mockito'],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Maven', 'Redis'],
    highlights: ['Core Banking Transaction Engine with concurrency safety', 'Multi-tenant Enterprise ERP backend', 'Event-driven order management system'],
    curriculum: [
      { week: 'Weeks 1-4', title: 'Java 21 Core & Modern OOP', topics: ['Classes, interfaces & polymorphism', 'Collections framework & generics', 'Streams API & Lambda expressions'] },
      { week: 'Weeks 5-7', title: 'Spring Boot 3 & Data Persistence', topics: ['Dependency injection & beans', 'Spring Data JPA & Hibernate', 'Database transactions & flyway migrations'] },
      { week: 'Weeks 8-10', title: 'Enterprise Security & Microservices', topics: ['Spring Security 6 with JWT & OAuth2', 'RESTful API best practices', 'Inter-service communication with Feign'] },
      { week: 'Weeks 11-12', title: 'Testing, Containerization & CI/CD', topics: ['Unit & integration testing with Mockito', 'Containerizing Spring Boot with Docker', 'Deploying to cloud environments'] }
    ],
    careerRoles: ['Java Developer', 'Enterprise Backend Engineer', 'Spring Boot Specialist'],
    certification: 'Atideto Certified Java Enterprise Engineer'
  },
  {
    id: 'systems-c-cpp-programming',
    title: 'Systems Programming & Data Structures in C / C++',
    category: 'Core Systems & Languages',
    categoryId: 'core',
    shortDesc: 'Understand what happens at machine level: memory management, pointers, and optimized algorithms.',
    description: 'Build an unshakeable computer science foundation. Master manual memory management (malloc/free, valgrind), pointers, custom data structures (trees, graphs, hash tables), and low-level Linux systems programming.',
    duration: '10 Weeks',
    level: 'All Levels',
    rating: 4.87,
    reviewsCount: 220,
    projectsCount: 5,
    skills: ['Pointers & Memory Architecture', 'Data Structures & Algorithms', 'C & Modern C++', 'Systems Programming', 'Debugging with GDB'],
    technologies: ['C', 'C++', 'Linux', 'GDB', 'Valgrind', 'Makefile'],
    highlights: ['Custom memory allocator implementation', 'High-performance HTTP server from scratch using raw sockets', 'Thread-safe concurrent hash map'],
    curriculum: [
      { week: 'Weeks 1-3', title: 'C Fundamentals & Memory Model', topics: ['Stack vs heap memory layout', 'Pointer arithmetic & double pointers', 'Dynamic memory allocation & leak detection'] },
      { week: 'Weeks 4-6', title: 'Core Data Structures Implementation', topics: ['Linked lists, stacks & queues', 'Binary search trees & AVL trees', 'Hash tables & collision resolution'] },
      { week: 'Weeks 7-8', title: 'Modern C++ & Standard Template Library (STL)', topics: ['C++ classes, templates & RAII', 'Smart pointers (unique_ptr, shared_ptr)', 'STL containers & algorithms'] },
      { week: 'Weeks 9-10', title: 'Systems Programming on Linux', topics: ['Process management (fork, exec)', 'POSIX threads (pthread) concurrency', 'Network sockets communication'] }
    ],
    careerRoles: ['Systems Engineer', 'Embedded Developer', 'Firmware Engineer', 'C/C++ Software Engineer'],
    certification: 'Atideto Certified Systems Programmer'
  }
];
