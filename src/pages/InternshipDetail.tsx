import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  Laptop,
  Clock,
  Award,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Users,
  Rocket,
  ShoppingCart,
  LayoutDashboard,
  GraduationCap,
  Star,
  FolderGit2,
  QrCode,
  Share2,
  Building2,
  Code2,
  Globe,
  Server,
  Database,
  Cpu,
  Boxes,
  Palette,
  Key,
  Smartphone,
  FileCode,
  CheckCheck,
  Check,
  Layers,
  ArrowRight,
  Play,
  Terminal,
  Copy,
  RefreshCw,
  Coffee,
  type LucideIcon
} from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { useTheme } from '@/context/ThemeContext';
import { INTERNSHIP_PROGRAMS } from '@/constants';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { generateCurriculumPDF, CurriculumModuleData } from '@/utils/curriculumPdfGenerator';

// Brand assets
import atidetoLogo from '@/assets/atideto/logo.png';
import StepperRegistrationModal from '@/components/registration/StepperRegistrationModal';

interface CurriculumModule {
  id: string;
  title: string;
  shortTitle: string;
  duration: string;
  icon: LucideIcon;
  summary: string;
  lessons: {
    title: string;
    description: string;
  }[];
}

// ── 12 Comprehensive Engineering Modules (Listed one-by-one with real titles) ──
const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'web-foundations',
    title: 'Web Foundations & Developer Tooling',
    shortTitle: 'Web Foundations',
    duration: 'Module 01',
    icon: Globe,
    summary: 'Master how the modern web operates, client-server models, and set up professional developer environments.',
    lessons: [
      {
        title: 'How the Web Works: Browsers, DNS, Servers & HTTP/HTTPS Protocols',
        description: 'Understand network requests, status codes, packet lifecycles, and modern web infrastructure.'
      },
      {
        title: 'Semantic HTML5 Architecture, Accessible Markup & Form Engineering',
        description: 'Write accessible HTML according to WCAG standards with robust input controls and media assets.'
      },
      {
        title: 'Production Tooling: Terminal CLI, VS Code Environment & Git Config',
        description: 'Configure linters, formatters, command-line tools, and enterprise Git repository standards.'
      },
      {
        title: 'Practical Project: Semantic Personal Portfolio & Web Architecture',
        description: 'Design and publish a production-ready personal developer showcase hosted on cloud infrastructure.'
      }
    ]
  },
  {
    id: 'css-responsive',
    title: 'CSS3 & Responsive Design Systems',
    shortTitle: 'CSS3 & Layouts',
    duration: 'Module 02',
    icon: Palette,
    summary: 'Engineer mobile-first responsive interfaces using modern Flexbox, CSS Grid, and custom properties.',
    lessons: [
      {
        title: 'CSS Architecture: Cascade, Specificity, Box Model & Modern Resets',
        description: 'Eliminate styling bugs with modular CSS structuring, fluid spacing tokens, and custom properties.'
      },
      {
        title: 'Flexbox In-Depth: 1D Axis Alignment, Wrapping & Dynamic Menus',
        description: 'Build flexible navigation bars, equal-height card decks, and adaptive multi-tier UI layouts.'
      },
      {
        title: 'CSS Grid Mastery: 2D Dashboard Structures & Auto-Fit Layouts',
        description: 'Construct responsive administrative grids, complex subgrid alignments, and masonry patterns.'
      },
      {
        title: 'Practical Project: Multi-Device Responsive SaaS Marketing Page',
        description: 'Implement a high-converting digital product landing page optimized across mobile, tablet, and desktop.'
      }
    ]
  },
  {
    id: 'javascript-core',
    title: 'JavaScript Core & Interactive DOM',
    shortTitle: 'JavaScript Core',
    duration: 'Module 03',
    icon: Code2,
    summary: 'Deep dive into modern JavaScript syntax, functional programming paradigms, and dynamic DOM manipulation.',
    lessons: [
      {
        title: 'JavaScript Fundamentals: Data Types, Immutability & Control Flow',
        description: 'Master primitive vs reference types, strict equality, modern conditions, and defensive coding.'
      },
      {
        title: 'Functional Programming: Arrow Functions, Scopes, Closures & Array Methods',
        description: 'Leverage map, filter, reduce, pure functions, lexical scope, and functional state handlers.'
      },
      {
        title: 'DOM Manipulation: Dynamic Node Tree Rendering & Event Delegation',
        description: 'Manipulate UI elements dynamically with event listeners, bubbling, capturing, and local storage.'
      },
      {
        title: 'Practical Project: Interactive Task & Real-Time State Application',
        description: 'Build an offline-first productivity app with live filtering, tag assignment, and browser persistence.'
      }
    ]
  },
  {
    id: 'es6-async-apis',
    title: 'Modern ES6+, Asynchronous & REST APIs',
    shortTitle: 'ES6+ & REST APIs',
    duration: 'Module 04',
    icon: Cpu,
    summary: 'Harness modern ES6+ language features, handle asynchronous data streams, and consume RESTful endpoints.',
    lessons: [
      {
        title: 'Modern ES6+ Syntax: Modules, Destructuring, Spread/Rest & Operators',
        description: 'Write elegant, idiomatic JavaScript using optional chaining, nullish coalescing, and modular imports.'
      },
      {
        title: 'Asynchronous Architecture: Event Loop, Promises & Async/Await',
        description: 'Manage concurrency, avoid race conditions, and handle asynchronous microtasks effectively.'
      },
      {
        title: 'RESTful API Contracts: Fetch API, HTTP Verbs & Error Boundaries',
        description: 'Query remote endpoints, parse JSON payloads, manage rate limits, and construct custom error handlers.'
      },
      {
        title: 'Practical Project: API-Driven Live Intelligence Dashboard',
        description: 'Connect third-party enterprise APIs to display live currency conversion, weather feeds, and data charts.'
      }
    ]
  },
  {
    id: 'react-essentials',
    title: 'React Essentials & Component Architecture',
    shortTitle: 'React Essentials',
    duration: 'Module 05',
    icon: Layers,
    summary: 'Build declarative user interfaces using React, Virtual DOM reconciliation, and unidirectional data flow.',
    lessons: [
      {
        title: 'Thinking in React: Virtual DOM, JSX Syntax & Declarative UIs',
        description: 'Transition from imperative DOM manipulation to declarative, state-driven component design.'
      },
      {
        title: 'State & Props: Unidirectional Data Flow & Event Handlers',
        description: 'Pass immutable props, manage local component state, and propagate actions up through callbacks.'
      },
      {
        title: 'Reusable UI Kits: Component Composition, Lists & Key Stability',
        description: 'Structure atomic design components, render efficient lists with keys, and handle conditional branches.'
      },
      {
        title: 'Practical Project: Commercial E-Commerce Product Catalog',
        description: 'Develop an interactive storefront catalog with instant search filtering, category toggles, and cart badge.'
      }
    ]
  },
  {
    id: 'advanced-react',
    title: 'Advanced React Hooks & Application State',
    shortTitle: 'Advanced React',
    duration: 'Module 06',
    icon: Smartphone,
    summary: 'Master standard and custom React hooks, complex multi-step forms, and client-side routing.',
    lessons: [
      {
        title: 'React Hooks Mastery: useState, useEffect Lifecycle & useRef',
        description: 'Synchronize external systems with useEffect, prevent infinite renders, and target mutable DOM nodes.'
      },
      {
        title: 'Form Architecture: Controlled Inputs, Validation & Custom Hooks',
        description: 'Extract business logic into reusable custom hooks and implement client-side schema validation.'
      },
      {
        title: 'Client Routing: React Router DOM, Nested Layouts & Dynamic URLs',
        description: 'Set up multi-page SPAs with URL parameters, query strings, active link indicators, and protected routes.'
      },
      {
        title: 'Practical Project: Multi-Page Analytics Portal with Persistent State',
        description: 'Assemble an interactive dashboard featuring tabbed views, parameterized routes, and local state sync.'
      }
    ]
  },
  {
    id: 'nodejs-express',
    title: 'Node.js & Express.js Backend Services',
    shortTitle: 'Node & Express APIs',
    duration: 'Module 07',
    icon: Server,
    summary: 'Build high-throughput backend APIs, custom middleware pipelines, and scalable microservice architectures.',
    lessons: [
      {
        title: 'Node.js Runtime Architecture: Event Loop & Non-Blocking I/O',
        description: 'Understand worker threads, streams, buffers, file systems, and npm package dependency management.'
      },
      {
        title: 'Express Server Architecture: Routing Standards & HTTP Methods',
        description: 'Implement GET, POST, PUT, PATCH, and DELETE endpoints matching industry RESTful conventions.'
      },
      {
        title: 'Middleware Chains: Body Parsing, CORS Policies & Error Logging',
        description: 'Construct global error-handling middleware, request loggers, and CORS origin security rules.'
      },
      {
        title: 'Practical Project: Production CRUD API Service with Postman Testing',
        description: 'Write, document, and test a fully operational backend API with automated Postman verification tests.'
      }
    ]
  },
  {
    id: 'database-engineering',
    title: 'Database Engineering: MongoDB & SQL Modeling',
    shortTitle: 'Database Engineering',
    duration: 'Module 08',
    icon: Database,
    summary: 'Design scalable databases, write optimized queries, and manage data relationships with Mongoose ODM.',
    lessons: [
      {
        title: 'Database Architecture: Document Collections vs Relational Tables',
        description: 'Evaluate when to choose NoSQL vs SQL, normalization vs denormalization, and ACID guarantees.'
      },
      {
        title: 'Mongoose ODM: Schema Definitions, Validation & Relationships',
        description: 'Define strongly-typed document schemas, custom field validators, timestamps, and virtual properties.'
      },
      {
        title: 'Query Performance: Compound Indexing, Pagination & Aggregation',
        description: 'Execute multi-stage aggregation pipelines, handle infinite pagination, and avoid unindexed collscans.'
      },
      {
        title: 'Practical Project: Cloud MongoDB Atlas Integration with Live API',
        description: 'Provision a cloud database cluster, secure connection strings via env variables, and seed test data.'
      }
    ]
  },
  {
    id: 'auth-security',
    title: 'Authentication, Authorization & Security',
    shortTitle: 'Security & Auth',
    duration: 'Module 09',
    icon: Key,
    summary: 'Secure applications against vulnerabilities with stateless JWT authentication and role-based access control.',
    lessons: [
      {
        title: 'Cryptographic Security: Password Hashing with Salt & Bcrypt',
        description: 'Safeguard user credentials with salted hashes, secure password policies, and brute-force defenses.'
      },
      {
        title: 'Stateless Auth: JSON Web Tokens (JWT) & Token Verification',
        description: 'Sign and verify JWT payloads, manage expiration headers, and store tokens safely in secure cookies.'
      },
      {
        title: 'Role-Based Access Control (RBAC): Protecting Private Endpoints',
        description: 'Write authorization middleware that verifies user roles (Student, Mentor, Admin) before granting access.'
      },
      {
        title: 'Practical Project: Enterprise User Authentication & Session Gateway',
        description: 'Develop a complete sign-up, sign-in, and password reset gateway with protected route guards.'
      }
    ]
  },
  {
    id: 'fullstack-cloud',
    title: 'Full-Stack Integration & Cloud Deployment',
    shortTitle: 'Full-Stack & Cloud',
    duration: 'Module 10',
    icon: Rocket,
    summary: 'Connect client applications to backend services, containerize with Docker, and deploy with CI/CD.',
    lessons: [
      {
        title: 'Full-Stack Data Flow: Axios Interceptors, Async Cache & CORS',
        description: 'Link React frontends to Express APIs with automatic bearer token attachment and toast alerts.'
      },
      {
        title: 'Docker Containerization: Multi-Stage Builds & Compose Stacks',
        description: 'Write optimized Dockerfiles with Alpine base images and orchestrate multi-container app stacks.'
      },
      {
        title: 'Continuous Deployment: GitHub Actions Pipelines & Cloud Hosting',
        description: 'Configure automated build workflows that trigger zero-downtime releases on Vercel, Render, or AWS.'
      },
      {
        title: 'Practical Project: Live Production Full-Stack Application Deployment',
        description: 'Deploy an integrated full-stack application with live database connectivity and custom domain SSL.'
      }
    ]
  },
  {
    id: 'commercial-capstone',
    title: 'Commercial Capstone Project & Code Defense',
    shortTitle: 'Commercial Capstone',
    duration: 'Module 11',
    icon: FolderGit2,
    summary: 'Architect, build, and defend an end-to-end commercial software product under senior tech mentorship.',
    lessons: [
      {
        title: 'Capstone Scoping: System Architecture & Agile Sprint Tasks',
        description: 'Draft system design diagrams, database entity-relationship models, and technical task boards.'
      },
      {
        title: 'Sprint Development: Collaborative Git Flow & PR Code Reviews',
        description: 'Execute agile sprints, open feature branch pull requests, and receive feedback from engineering leads.'
      },
      {
        title: 'Security Audits, Latency Benchmarks & Production Readiness',
        description: 'Run automated vulnerability audits, optimize asset delivery, and ensure 99.9% uptime compliance.'
      },
      {
        title: 'Capstone Defense: Live Product Demonstration & Technical Review',
        description: 'Present the completed software application to senior tech mentors, explaining architectural decisions.'
      }
    ]
  },
  {
    id: 'career-placement',
    title: 'Career Placement & Interview Preparation',
    shortTitle: 'Career & Placement',
    duration: 'Module 12',
    icon: Briefcase,
    summary: 'Prepare your professional portfolio, practice technical rounds, and connect directly to hiring partners.',
    lessons: [
      {
        title: 'Engineering Branding: Technical Resume & GitHub Profile Polish',
        description: 'Transform project repositories into hiring assets with clean READMEs, architecture GIFs, and docs.'
      },
      {
        title: 'Technical Mock Interviews: Coding Challenges & System Design',
        description: 'Practice real technical interview scenarios covering data structures, API contracts, and debugging.'
      },
      {
        title: 'Behavioral Interviews & Offer Negotiation Mentorship',
        description: 'Learn communication frameworks to articulate engineering trade-offs and navigate compensation offers.'
      },
      {
        title: 'Official Credential Issuance & Hiring Partner Introductions',
        description: 'Receive verified digital certification and unlock direct interview referrals to 120+ corporate partners.'
      }
    ]
  }
];

const JAVA_CURRICULUM_MODULES: CurriculumModule[] = [
  CURRICULUM_MODULES[0], // Web Foundations & Git
  CURRICULUM_MODULES[1], // Advanced CSS Architecture
  CURRICULUM_MODULES[2], // JavaScript Core & DOM
  CURRICULUM_MODULES[3], // Modern ES6+ & REST APIs
  CURRICULUM_MODULES[4], // React Essentials & Components
  CURRICULUM_MODULES[5], // Advanced React Hooks & State
  {
    id: 'java-core-oop',
    title: 'Core Java 21, OOPs & Spring Framework Foundations',
    shortTitle: 'Java 21 & Spring Core',
    duration: 'Module 07',
    icon: Server,
    summary: 'Master modern Java 21 syntax, object-oriented design patterns, JVM memory mechanics, and Spring IoC container architecture.',
    lessons: [
      {
        title: 'Java 21 Fundamentals: Types, Records, Pattern Matching & JVM Architecture',
        description: 'Understand JVM bytecode execution, Heap vs Stack memory allocation, Garbage Collection, and immutable Records.'
      },
      {
        title: 'Object-Oriented Programming: Encapsulation, Polymorphism, Interfaces & Abstract Classes',
        description: 'Implement enterprise design patterns (Factory, Singleton, Builder) with strict encapsulation and clean abstractions.'
      },
      {
        title: 'Java Collections Framework, Generics & Streams API',
        description: 'Process in-memory data structures efficiently using List, Map, Set, generic boundaries, and parallel Streams.'
      },
      {
        title: 'Spring Framework Core: Dependency Injection & Inversion of Control (IoC)',
        description: 'Configure Spring Beans, understand component scanning, constructor injection, and application context lifecycles.'
      }
    ]
  },
  {
    id: 'spring-boot-apis',
    title: 'Spring Boot 3 Microservices, REST APIs & Validation',
    shortTitle: 'Spring Boot APIs',
    duration: 'Module 08',
    icon: Cpu,
    summary: 'Build high-throughput RESTful microservices with Spring Boot 3, declarative validation, DTOs, and global exception handlers.',
    lessons: [
      {
        title: 'Spring Boot 3 Architecture: Starters, Auto-Configuration & Application Properties',
        description: 'Initialize production microservices with Spring Initializr, manage multi-profile YAML configs, and explore Actuator.'
      },
      {
        title: 'RESTful API Engineering: @RestController, Request Mapping & HTTP Verbs',
        description: 'Construct idempotent GET, POST, PUT, PATCH, and DELETE endpoints with robust pagination and sorting contracts.'
      },
      {
        title: 'DTO Pattern, Hibernate Validator & Global Exception Handling',
        description: 'Isolate database models from API payloads using MapStruct DTOs, @Valid annotations, and @ControllerAdvice.'
      },
      {
        title: 'Practical Project: Commercial E-Commerce Order & Inventory Microservice',
        description: 'Develop and test a production-grade Spring Boot microservice with comprehensive Swagger/OpenAPI documentation.'
      }
    ]
  },
  {
    id: 'spring-data-mysql',
    title: 'Spring Data JPA, Hibernate ORM & MySQL Relational Database',
    shortTitle: 'Spring Data & MySQL',
    duration: 'Module 09',
    icon: Database,
    summary: 'Design scalable relational schemas, manage transactions, write optimized JPQL queries, and eliminate N+1 query bottlenecks.',
    lessons: [
      {
        title: 'Relational Database Modeling: MySQL 8, Foreign Keys, Normalization & ACID',
        description: 'Structure 3NF normalized tables, enforce foreign key integrity, and evaluate index performance on high-volume tables.'
      },
      {
        title: 'Spring Data JPA & Hibernate: Entities, Mappings & Cascading',
        description: 'Map entity relationships (@OneToMany, @ManyToMany, @JoinColumn) with lazy loading and dirty checking mechanisms.'
      },
      {
        title: 'Advanced Querying: JPQL, Derived Queries & N+1 Problem Prevention',
        description: 'Write custom JPQL queries, leverage entity graphs to eliminate N+1 SELECT overhead, and execute native SQL updates.'
      },
      {
        title: 'Practical Project: Cloud MySQL Integration with Database Migration Scripts',
        description: 'Provision AWS RDS/Cloud MySQL, automate schema versioning with Flyway migrations, and manage connection pools.'
      }
    ]
  },
  {
    id: 'spring-security-cloud',
    title: 'Spring Security 6, JWT Authentication & Cloud Deployment',
    shortTitle: 'Security & Cloud',
    duration: 'Module 10',
    icon: Key,
    summary: 'Secure enterprise endpoints with Spring Security 6 filter chains, stateless JWT tokens, Docker containers, and CI/CD pipelines.',
    lessons: [
      {
        title: 'Spring Security 6 Architecture: SecurityFilterChain & Password Encoding',
        description: 'Configure stateless HTTP security, BCryptPasswordEncoder hashing, and CSRF protection policies.'
      },
      {
        title: 'Stateless Authentication: JWT Generation, Verification & Role-Based Access (RBAC)',
        description: 'Implement JWT authentication filters, validate access tokens, and enforce @PreAuthorize("hasRole(\'ADMIN\')") guards.'
      },
      {
        title: 'Docker Containerization: Multi-Stage Java Builds & Compose Stacks',
        description: 'Package Spring Boot JARs into lightweight Alpine Docker containers and orchestrate React + Spring + MySQL stacks.'
      },
      {
        title: 'Practical Project: Full-Stack Enterprise Auth & Microservice Deployment',
        description: 'Deploy containerized React frontend, Spring Boot backend, and MySQL database to production cloud hosting with SSL.'
      }
    ]
  },
  {
    id: 'java-capstone',
    title: 'Enterprise Java Commercial Capstone & Code Defense',
    shortTitle: 'Java Capstone Defense',
    duration: 'Module 11',
    icon: FolderGit2,
    summary: 'Architect, build, and defend an end-to-end commercial software product with Java Spring Boot backend, React UI, and MySQL DB.',
    lessons: [
      {
        title: 'Enterprise System Architecture: Domain-Driven Design & Microservice Decomposition',
        description: 'Map out architecture blueprints, database ER diagrams, API specifications, and Jira sprint user stories.'
      },
      {
        title: 'Agile Full-Stack Sprints: React UI Integration, Spring Boot APIs & Git PRs',
        description: 'Connect responsive React interfaces to Spring Boot endpoints, implement transactions, and merge reviewed PRs.'
      },
      {
        title: 'Automated Testing & Performance Tuning: JUnit 5, Mockito & Latency Benchmarks',
        description: 'Write unit and integration tests with Mockito, profile database queries, and achieve sub-50ms API response latency.'
      },
      {
        title: 'Capstone Defense: Live Enterprise Product Demonstration & Technical Review',
        description: 'Demonstrate live production software before senior enterprise software architects and defend architectural decisions.'
      }
    ]
  },
  CURRICULUM_MODULES[11] // Career Placement & Interview Preparation
];

export default function InternshipDetail() {
  const { internshipId } = useParams<{ internshipId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';

  // Normalized lookup supporting aliases and direct IDs
  const rawId = (internshipId || '').toLowerCase().trim();
  const ID_ALIASES: Record<string, string> = {
    'fullstack': 'fs-mern',
    'full-stack': 'fs-mern',
    'mern': 'fs-mern',
    'mean': 'fs-mean',
    'java': 'fs-java',
    'ai-cloud': 'cloud',
    'mobile': 'app-dev',
    'marketing': 'digital-marketing',
    'automation': 'python',
    'cybersecurity': 'cyber-security',
    'cyber': 'cyber-security',
    'web': 'web-dev',
    'data': 'data-science',
    'uiux': 'ui-ux'
  };
  const resolvedId = ID_ALIASES[rawId] || rawId;
  const activeProgram =
    INTERNSHIP_PROGRAMS.find((p) => p.id.toLowerCase() === resolvedId || p.id.toLowerCase() === rawId) ||
    INTERNSHIP_PROGRAMS[0];

  const curriculumModules = activeProgram.id === 'fs-java' ? JAVA_CURRICULUM_MODULES : CURRICULUM_MODULES;

  // Active module tracker for left sticky sidebar
  const [activeModuleId, setActiveModuleId] = useState<string>(curriculumModules[0].id);
  const isClickScrolling = useRef(false);

  // Interactive Hero Code / Architecture Simulator state
  const [heroActiveTab, setHeroActiveTab] = useState<'backend' | 'frontend' | 'database' | 'api'>('backend');
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [apiRunCount, setApiRunCount] = useState(1);
  const [copiedCode, setCopiedCode] = useState(false);

  // Application Modal state (No pricing plans)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    college: '',
    degree: 'B.Tech / B.E.',
    graduationYear: '2025',
    preferredStartDate: 'Immediate Upcoming Cohort',
    experienceLevel: 'Beginner',
    linkedIn: '',
    github: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [internshipId]);

  // ScrollSpy on Window: Detects which curriculum module is currently in view
  useEffect(() => {
    const handleWindowScroll = () => {
      if (isClickScrolling.current) return;
      const scrollPosition = window.scrollY + 140;

      let found = false;
      for (let i = curriculumModules.length - 1; i >= 0; i--) {
        const section = document.getElementById(`module-${curriculumModules[i].id}`);
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveModuleId(curriculumModules[i].id);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        setActiveModuleId(curriculumModules[0].id);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [curriculumModules]);

  // Smooth scroll to a module on click with proper offset
  const handleModuleClick = (moduleId: string) => {
    setActiveModuleId(moduleId);
    isClickScrolling.current = true;
    const targetEl = document.getElementById(`module-${moduleId}`);
    if (targetEl) {
      const yOffset = -90; // offset for sticky status bar
      const y = targetEl.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  const handleDownloadPDF = () => {
    try {
      generateCurriculumPDF(
        activeProgram.title,
        activeProgram.duration || '12 Weeks (3 Months)',
        activeProgram.category || 'Software Engineering',
        curriculumModules
      );
      toast.success(`Downloaded official curriculum roadmap for ${activeProgram.title}!`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'internship_applications'), {
        internshipId: activeProgram.id,
        internshipTitle: activeProgram.title,
        ...formData,
        userId: user?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      toast.success(`Application submitted successfully for ${activeProgram.title}!`);
      setApplyStep(3); // Success step
    } catch (err) {
      console.warn('Firebase submission fallback:', err);
      toast.success(`Application recorded for ${activeProgram.title}! Admissions will connect shortly.`);
      setApplyStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-x-clip ${
        isLight ? 'bg-[#FAF9F5] text-zinc-900' : 'bg-[#05070D] text-white'
      }`}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <SEO
        title={`${activeProgram.title} Internship | Atideto Academy`}
        description={
          activeProgram.description ||
          `Join the ${activeProgram.title} industry internship at Atideto. Build real production projects, receive 1:1 mentorship, and secure corporate placement assistance.`
        }
        url={`https://atideto.in/internships/${activeProgram.id}`}
        keywords={`${activeProgram.title}, tech internship, software internship, atideto academy, placement guarantee, ${activeProgram.skills.join(', ')}`}
      />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 1. HERO SECTION (Clean, Punchy & Modern with Action CTAs) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-20 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden
          className="absolute top-10 right-10 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none opacity-20 bg-[#0066FF]"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none opacity-15 bg-[#38BDF8]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/upskill" className="hover:text-white transition-colors">Internships</Link>
            <ChevronRight size={12} />
            <span className="text-slate-400">{activeProgram.category}</span>
            <ChevronRight size={12} />
            <span className="text-[#2EA8FF] font-bold">{activeProgram.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Eyebrow + Title + Lead + CTAs + Benefit Line */}
            <div className="lg:col-span-7 text-left">
              
              {/* Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-[#0066FF] font-bold text-sm">—</span>
                <span className="text-xs font-bold tracking-[0.25em] text-[#38BDF8] uppercase font-mono">
                  ATIDETO TALENT ACCELERATOR · {activeProgram.category.toUpperCase()} INTERNSHIP
                </span>
              </div>

              {/* Bold Large Heading */}
              <h1
                className="text-[32px] sm:text-[38px] lg:text-[46px] font-bold tracking-tight leading-[1.12] mb-5 text-white font-heading"
              >
                {activeProgram.id === 'fs-java' ? (
                  <>
                    Full Stack Web Development <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EA8FF] to-[#0052FF]">
                      (Java Enterprise)
                    </span>
                  </>
                ) : (
                  activeProgram.title
                )}
              </h1>

              {/* Lead Paragraph */}
              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 text-slate-300 font-normal max-w-xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {activeProgram.id === 'fs-java'
                  ? 'Master enterprise-level full-stack engineering using Java 21, Spring Boot microservices, modern React interfaces, and production MySQL relational databases with direct 1-to-1 mentorship from senior software engineers.'
                  : activeProgram.description ||
                    'Learn to build modern web applications from frontend to backend through practical sessions, guided commercial projects, and career-focused practice under senior tech leads.'}
              </p>

              {/* Action Buttons: View Curriculum & Download Curriculum */}
              <div className="flex flex-wrap items-center gap-3.5 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-[0_4px_20px_rgba(0,102,255,0.35)] transition-all cursor-pointer"
                >
                  <span>View Curriculum ↓</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Curriculum PDF ↓</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setApplyStep(1);
                    setIsApplyModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer"
                >
                  <span>Apply for Internship ↗</span>
                </button>
              </div>

              {/* Checkmark Benefit Line */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#0066FF] font-bold">✓</span>
                  <span>{activeProgram.id === 'fs-java' ? 'Java 21 & Spring Boot 3 Core' : '12-week structured roadmap'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#0066FF] font-bold">✓</span>
                  <span>{activeProgram.id === 'fs-java' ? 'React 18 & REST Microservices' : '48 hands-on sessions'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#0066FF] font-bold">✓</span>
                  <span>{activeProgram.id === 'fs-java' ? 'MySQL & Production Cloud Capstone' : 'Verified commercial capstone'}</span>
                </span>
              </div>

            </div>

            {/* Right Column: Interactive Full-Stack Java Architecture Simulator & Code Workspace */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-[480px] rounded-3xl bg-[#080E1C] border border-white/10 p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
                
                {/* Tech Aura Glow */}
                <div className="absolute inset-0 bg-radial from-[#0066FF]/20 via-transparent to-transparent opacity-80" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#38BDF8]/20 blur-3xl pointer-events-none" />

                {/* Inner Code Card */}
                <div className="relative z-10 rounded-2xl bg-[#05070D] border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
                  
                  {/* Top Bar: macOS window dots + filename + copy */}
                  <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90 inline-block" />
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 font-semibold">
                      {heroActiveTab === 'backend' && <><Coffee size={12} className="text-[#38BDF8]" /> OrderController.java</>}
                      {heroActiveTab === 'frontend' && <><Code2 size={12} className="text-[#38BDF8]" /> CheckoutPortal.tsx</>}
                      {heroActiveTab === 'database' && <><Database size={12} className="text-[#38BDF8]" /> schema_v2.sql</>}
                      {heroActiveTab === 'api' && <><Terminal size={12} className="text-emerald-400" /> Live REST API Tester</>}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 1500);
                      }}
                      className="text-slate-400 hover:text-white transition-colors p-1 rounded"
                      title="Copy Snippet"
                    >
                      {copiedCode ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>

                  {/* Interactive Switcher Tabs */}
                  <div className="flex items-center border-b border-white/[0.08] bg-[#0A0D16] p-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setHeroActiveTab('backend')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium ${
                        heroActiveTab === 'backend'
                          ? 'bg-[#0052FF] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      Java API
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroActiveTab('frontend')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium ${
                        heroActiveTab === 'frontend'
                          ? 'bg-[#0052FF] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      React UI
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroActiveTab('database')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium ${
                        heroActiveTab === 'database'
                          ? 'bg-[#0052FF] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      MySQL
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroActiveTab('api')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium flex items-center justify-center gap-1 ${
                        heroActiveTab === 'api'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-emerald-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Play size={10} className="fill-current" />
                      Live Run
                    </button>
                  </div>

                  {/* Code Panel */}
                  <div className="p-4 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto min-h-[200px] flex flex-col justify-between">
                    {heroActiveTab === 'backend' && (
                      <div className="space-y-1 text-slate-300">
                        <div><span className="text-[#F59E0B]">@RestController</span></div>
                        <div><span className="text-[#F59E0B]">@RequestMapping</span>(<span className="text-emerald-400">"/api/v1/orders"</span>)</div>
                        <div><span className="text-[#38BDF8]">public class</span> <span className="text-white font-bold">OrderController</span> &#123;</div>
                        <div className="pl-4"><span className="text-[#F59E0B]">@Autowired</span> <span className="text-[#38BDF8]">private</span> OrderService orderService;</div>
                        <br />
                        <div className="pl-4"><span className="text-[#F59E0B]">@PostMapping</span>(<span className="text-emerald-400">"/dispatch"</span>)</div>
                        <div className="pl-4"><span className="text-[#38BDF8]">public</span> ResponseEntity&lt;OrderDTO&gt; <span className="text-[#2EA8FF]">createOrder</span>(</div>
                        <div className="pl-8"><span className="text-[#F59E0B]">@Valid @RequestBody</span> OrderPayload payload) &#123;</div>
                        <div className="pl-8"><span className="text-[#38BDF8]">return</span> ResponseEntity.ok(orderService.dispatch(payload));</div>
                        <div className="pl-4">&#125;</div>
                        <div>&#125;</div>
                      </div>
                    )}

                    {heroActiveTab === 'frontend' && (
                      <div className="space-y-1 text-slate-300">
                        <div><span className="text-[#38BDF8]">import</span> &#123; useState &#125; <span className="text-[#38BDF8]">from</span> <span className="text-emerald-400">'react'</span>;</div>
                        <div><span className="text-[#38BDF8]">import</span> &#123; api &#125; <span className="text-[#38BDF8]">from</span> <span className="text-emerald-400">'@/services/javaClient'</span>;</div>
                        <br />
                        <div><span className="text-[#38BDF8]">export function</span> <span className="text-white font-bold">CheckoutPortal</span>() &#123;</div>
                        <div className="pl-4"><span className="text-[#38BDF8]">const</span> [order, setOrder] = useState&lt;Order&gt;();</div>
                        <br />
                        <div className="pl-4"><span className="text-[#38BDF8]">const</span> handleDispatch = <span className="text-[#38BDF8]">async</span> () =&gt; &#123;</div>
                        <div className="pl-8"><span className="text-[#38BDF8]">const</span> res = <span className="text-[#38BDF8]">await</span> api.post(<span className="text-emerald-400">'/orders/dispatch'</span>, &#123; id: <span className="text-amber-400">9021</span> &#125;);</div>
                        <div className="pl-8">setOrder(res.data);</div>
                        <div className="pl-4">&#125;;</div>
                        <div className="pl-4"><span className="text-[#38BDF8]">return</span> &lt;<span className="text-[#2EA8FF]">OrderReceipt</span> status=&#123;order?.status&#125; /&gt;;</div>
                        <div>&#125;</div>
                      </div>
                    )}

                    {heroActiveTab === 'database' && (
                      <div className="space-y-1 text-slate-300">
                        <div><span className="text-[#38BDF8]">CREATE TABLE</span> <span className="text-white font-bold">enterprise_orders</span> (</div>
                        <div className="pl-4">id <span className="text-amber-400">BIGINT AUTO_INCREMENT</span> PRIMARY KEY,</div>
                        <div className="pl-4">order_uid <span className="text-amber-400">VARCHAR(64)</span> NOT NULL,</div>
                        <div className="pl-4">total_amount <span className="text-amber-400">DECIMAL(12,2)</span> NOT NULL,</div>
                        <div className="pl-4">payment_status <span className="text-amber-400">ENUM</span>(<span className="text-emerald-400">'PAID'</span>, <span className="text-emerald-400">'PENDING'</span>),</div>
                        <div className="pl-4">created_at <span className="text-amber-400">TIMESTAMP</span> DEFAULT CURRENT_TIMESTAMP,</div>
                        <div className="pl-4"><span className="text-[#38BDF8]">INDEX</span> idx_order_uid (order_uid)</div>
                        <div>) <span className="text-[#38BDF8]">ENGINE</span>=InnoDB DEFAULT CHARSET=utf8mb4;</div>
                      </div>
                    )}

                    {heroActiveTab === 'api' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0052FF] text-white">POST</span>
                            <span className="text-[11px] text-slate-200 truncate">/api/v1/orders/dispatch</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSimulatingApi(true);
                              setTimeout(() => {
                                setIsSimulatingApi(false);
                                setApiRunCount((prev) => prev + 1);
                              }, 350);
                            }}
                            disabled={isSimulatingApi}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                          >
                            {isSimulatingApi ? <RefreshCw size={10} className="animate-spin" /> : <Play size={10} className="fill-current" />}
                            <span>{isSimulatingApi ? 'Executing...' : 'Run Request'}</span>
                          </button>
                        </div>

                        {/* Response Output Box */}
                        <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono space-y-1">
                          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-white/10">
                            <span>HTTP/1.1 200 OK</span>
                            <span className="text-emerald-400 font-bold">14ms · Spring Boot 3.2</span>
                          </div>
                          <div className="text-slate-300 pt-1">&#123;</div>
                          <div className="pl-3 text-emerald-400">"status": <span className="text-white">"DISPATCHED"</span>,</div>
                          <div className="pl-3 text-emerald-400">"orderId": <span className="text-white">"JAVA-ORD-{1000 + apiRunCount}"</span>,</div>
                          <div className="pl-3 text-emerald-400">"runtime": <span className="text-white">"OpenJDK 21.0.2 on Linux"</span>,</div>
                          <div className="pl-3 text-emerald-400">"dbCommit": <span className="text-white">"MySQL 8.0 Primary Replica"</span></div>
                          <div className="text-slate-300">&#125;</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Telemetry status + Enterprise tag */}
                  <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-slate-300">Java 21 · Spring Boot · MySQL 8</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#38BDF8] font-bold">
                      ENTERPRISE STACK
                    </span>
                  </div>

                </div>

                {/* Quick Stack Badges Below Card */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono">
                  {['Java 21', 'Spring Boot 3', 'React.js', 'MySQL 8', 'REST Microservices', 'Hibernate ORM'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-[#38BDF8]/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 2. THE 4 PROGRAM PILLARS (1-to-1 Mentorship, Project-Based, etc.) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 relative z-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
                <Users size={18} />
                <strong className="text-sm font-bold text-white">1-to-1 Mentorship</strong>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed block">
                Personal guidance, weekly live debugging, and direct code reviews from senior tech leads.
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
                <FolderGit2 size={18} />
                <strong className="text-sm font-bold text-white">Project-Based Learning</strong>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed block">
                Learn by building real, commercial-grade full-stack applications with production Git PRs.
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
                <Briefcase size={18} />
                <strong className="text-sm font-bold text-white">Career-Focused Skills</strong>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed block">
                Interview simulations, technical resume reviews, and direct corporate placement prep.
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
                <Clock size={18} />
                <strong className="text-sm font-bold text-white">Flexible Learning</strong>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed block">
                Structured, adaptable weekly sprints that seamlessly fit around college exams and classes.
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 3. THE ATIDETO APPROACH (01, 02, 03 Features) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06] bg-[#070C18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                THE ATIDETO APPROACH
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Learn with purpose.
              </h2>
            </div>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm leading-relaxed">
              A focused engineering experience built around practical skills, clean code, and meaningful career momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <article className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] font-mono font-bold flex items-center justify-center text-sm mb-5">
                01
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-2 font-heading leading-snug">Understand the essentials</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                Master the architectural tools, data flows, and runtime mechanics behind modern web applications.
              </p>
            </article>

            <article className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] font-mono font-bold flex items-center justify-center text-sm mb-5">
                02
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-2 font-heading leading-snug">Build as you learn</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                Apply concepts through guided commercial projects, weekly sprint milestones, and peer code reviews.
              </p>
            </article>

            <article className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] font-mono font-bold flex items-center justify-center text-sm mb-5">
                03
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-2 font-heading leading-snug">Show your skills</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                Deploy a verifiable GitHub portfolio and claim your authenticated certificate that proves your readiness.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 4. CURRICULUM ROADMAP (Sticky Left Panel + Top-to-Bottom Modules) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06]" id="curriculum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start w-full relative text-left">
            
            {/* ── LEFT PANEL: FULLY STICKY (Matching Courses Page Layout) ── */}
            <aside className="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-24 self-start text-left select-none z-10 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto hide-scrollbar">
              
              {/* Header Title */}
              <div className="mb-3">
                <h3 className="text-[18px] font-bold text-white tracking-tight font-heading">
                  Curriculum Modules
                </h3>
              </div>

              {/* Clean list of modules with Icon + Title (Matching Courses layout) */}
              <nav className="space-y-1" aria-label="Curriculum Modules">
                {curriculumModules.map((m) => {
                  const isActive = activeModuleId === m.id;
                  const ModIcon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleModuleClick(m.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left group ${
                        isActive
                          ? 'bg-white/[0.08] text-white border border-white/15 shadow-[0_2px_12px_rgba(0,0,0,0.5)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]'
                          : 'bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/[0.08]'
                      }`}>
                        <ModIcon size={13} />
                      </div>
                      <span className="truncate">{m.shortTitle || m.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Download Syllabus PDF Action Button */}
              <div className="pt-3 mt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Syllabus PDF</span>
                </button>
              </div>

            </aside>

            {/* ── RIGHT PANEL: FREE WINDOW SCROLLING MODULES & LESSONS (Top to Bottom) ── */}
            <main className="flex-1 min-w-0 w-full space-y-12 text-left">
              
              {/* Curriculum Header Bar */}
              <div className={`relative z-10 ${isLight ? 'text-zinc-900 border-zinc-200' : 'text-white border-white/[0.08]'} pt-3 pb-3 mb-6 border-b flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="text-sm font-bold tracking-wide uppercase text-white font-sans">
                    Curriculum Roadmap
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {curriculumModules.length} Technical Modules
                </span>
              </div>

              {/* All Modules Rendered One-by-One with Real Titles & Detailed Lessons */}
              {curriculumModules.map((m) => {
                const ModIcon = m.icon;
                return (
                  <div
                    key={m.id}
                    id={`module-${m.id}`}
                    className="scroll-mt-28 space-y-4"
                  >
                    {/* Module Header Bar */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#080E1C] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/35 text-[#38BDF8] flex items-center justify-center shrink-0">
                          <ModIcon size={18} />
                        </div>
                        <div>
                          <h3 className="text-[18px] sm:text-[20px] font-semibold text-white tracking-tight font-heading">
                            {m.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {m.summary}
                          </p>
                        </div>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-[#38BDF8] font-bold shrink-0">
                        {m.duration}
                      </span>
                    </div>

                    {/* Lessons listed one-by-one top to bottom with title and description */}
                    <div className="space-y-2.5 pl-2 sm:pl-4 border-l-2 border-white/10">
                      {m.lessons.map((lesson, lIdx) => (
                        <div
                          key={lIdx}
                          className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] hover:bg-[#0066FF]/10 border border-white/5 hover:border-[#38BDF8]/40 transition-all text-left flex items-start gap-3.5 group"
                        >
                          <div className="w-6 h-6 rounded-md bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#38BDF8] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                            {lIdx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors font-heading">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mt-1 font-sans font-normal">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}

            </main>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 5. LEARNING OUTCOMES (4 Concrete Deliverables) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06] bg-[#070C18]" id="outcomes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                YOUR PROGRESS
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Learning outcomes.
              </h2>
            </div>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm leading-relaxed font-sans font-normal">
              By the end of the program, you&apos;ll have a verifiable foundation for building and defending production-ready software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            
            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-white mb-1 font-heading">Build responsive interfaces</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                  Create accessible, mobile-friendly experiences with semantic HTML5, modern CSS layouts, JavaScript, and React components.
                </p>
              </div>
            </article>

            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-white mb-1 font-heading">Develop backend APIs</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                  Design RESTful endpoints, middleware chains, error boundaries, and server-side workflows using Node.js and Express.
                </p>
              </div>
            </article>

            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-white mb-1 font-heading">Work with data securely</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                  Model MongoDB and relational data schemas, perform safe migrations, and integrate stateless JWT authentication.
                </p>
              </div>
            </article>

            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-white mb-1 font-heading">Ship a portfolio project</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                  Use Git collaboration, Docker containerization, production CI/CD pipelines, and present a live capstone demo.
                </p>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 6. SKILLS YOU'LL LEARN (Logo + Name Clearly Displayed) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06]" id="skills">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                PROGRAM TOOLKIT
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Skills you&apos;ll learn.
              </h2>
            </div>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm leading-relaxed">
              Core technologies and industry workflows covered extensively throughout this curriculum.
            </p>
          </div>

          {/* Clean Flex/Grid of Skills with Tech Icons + Names */}
          <div className="flex flex-wrap gap-3 text-left">
            {[
              { name: 'HTML5 Semantic', icon: Globe },
              { name: 'CSS3 & Responsive Grid', icon: Palette },
              { name: 'JavaScript (ES6+)', icon: Code2 },
              { name: 'TypeScript', icon: FileCode },
              { name: 'React.js', icon: Code2 },
              { name: 'Node.js', icon: Server },
              { name: 'Express.js', icon: Layers },
              { name: 'REST APIs', icon: Cpu },
              { name: 'MongoDB Atlas', icon: Database },
              { name: 'PostgreSQL', icon: Database },
              { name: 'Git & GitHub', icon: FolderGit2 },
              { name: 'Docker Containers', icon: Boxes },
              { name: 'JWT Authentication', icon: Key },
              { name: 'Responsive Design', icon: Smartphone },
              { name: 'CI/CD Cloud Deploy', icon: Rocket },
              { name: 'Testing & Postman', icon: CheckCheck }
            ].map((skill) => {
              const SkillIcon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/60 hover:bg-[#0066FF]/10 transition-all text-xs font-semibold text-slate-200 cursor-default"
                >
                  <SkillIcon size={16} className="text-[#38BDF8]" />
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 7. OUR PROJECTS (Projects with Purpose + Dedicated Icons) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06] bg-[#070C18]" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                LEARN BY BUILDING
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Projects with purpose.
              </h2>
            </div>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm leading-relaxed">
              Practical commercial projects that give you real software to demonstrate in employer interviews.
            </p>
          </div>

          {/* 4 Capstone Projects with Dedicated Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {[
              {
                title: 'Smart Commerce',
                icon: ShoppingCart,
                desc: 'A full-fledged shopping platform with product filtering, cart persistence, and secure checkout.',
                tags: ['React', 'Node.js', 'MongoDB']
              },
              {
                title: 'Team Dashboard',
                icon: LayoutDashboard,
                desc: 'A secure management dashboard with clear workflows, data visualizations, and REST API integration.',
                tags: ['React', 'REST API', 'Auth']
              },
              {
                title: 'Learning Platform',
                icon: GraduationCap,
                desc: 'A course platform with lesson resources, real-time code sandboxes, and student progress tracking.',
                tags: ['Full Stack', 'UI Design', 'Express']
              },
              {
                title: 'Automated CI/CD Engine',
                icon: Rocket,
                desc: 'An automated release tool testing code, building Docker images, and managing cloud deployments.',
                tags: ['Docker', 'GitHub Actions', 'AWS']
              }
            ].map((proj) => {
              const ProjIcon = proj.icon;
              return (
                <article
                  key={proj.title}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0066FF]/60 hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Project Icon in Glowing Container */}
                    <div className="w-11 h-11 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/35 text-[#38BDF8] flex items-center justify-center mb-5">
                      <ProjIcon size={20} />
                    </div>

                    <h3 className="text-[20px] sm:text-[22px] font-semibold text-white mb-2 font-heading leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-normal font-sans">
                      {proj.desc}
                    </p>
                  </div>

                  {/* Project Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#38BDF8] bg-[#0066FF]/15 border border-[#0066FF]/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 8. CERTIFICATE SECTION (Verified Completion Paper Mockup) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06]" id="certificate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
            
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8]">
                CELEBRATE YOUR PROGRESS
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Earn your certificate.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Complete the course requirements and commercial capstone to demonstrate what you&apos;ve learned. Accredited by Atideto Technologies and accepted by 120+ hiring partners.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white transition-all cursor-pointer"
                >
                  <span>Explore course requirements ↗</span>
                </button>
              </div>
            </div>

            {/* Right: Certificate Paper Mockup */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-lg rounded-2xl bg-white text-zinc-900 p-7 sm:p-9 shadow-2xl border-2 border-amber-400/50 text-center relative overflow-hidden">
                
                {/* Brand Header */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <span className="font-extrabold text-xs tracking-wider text-zinc-900 uppercase">
                    Atideto Technologies
                  </span>
                </div>

                <div className="text-[9px] font-mono font-bold tracking-[0.25em] text-amber-700 uppercase mb-2">
                  CERTIFICATE OF COMPLETION
                </div>

                <h3 className="text-[24px] sm:text-[28px] font-bold text-zinc-900 tracking-tight mb-2 font-heading">
                  {activeProgram.title}
                </h3>

                <p className="text-[11px] text-zinc-600 max-w-md mx-auto leading-relaxed mb-6 font-sans">
                  This official credential verifies the successful completion of 12-week commercial software engineering sprints, Capstone code review, and live deployment.
                </p>

                {/* Signature Line */}
                <div className="w-28 h-[1px] bg-amber-400 mx-auto mb-2" />
                <div className="text-xs font-extrabold text-zinc-900 font-sans">Learner Name</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">
                  Course completion • Project-based learning • Verified ID: ATD-2026-CERT
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 9. STUDENT REVIEWS SECTION (5 Stars + Authentic Feedback) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06] bg-[#070C18]" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                LEARNER PERSPECTIVES
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading">
                Student reviews.
              </h2>
            </div>
            <p className="max-w-md text-slate-400 text-xs sm:text-sm leading-relaxed">
              Authentic experiences and feedback from learners who graduated through Atideto Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-[#38BDF8] tracking-widest text-xs mb-3">★★★★★</div>
                <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;The hands-on project approach helped me connect conceptual syntax with real enterprise application development.&rdquo;
                </blockquote>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#38BDF8] font-bold text-xs flex items-center justify-center shrink-0">
                  SR
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Sanjay Ram</strong>
                  <small className="text-[10px] text-slate-400 block">{activeProgram.title}</small>
                </div>
              </div>
            </article>

            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-[#38BDF8] tracking-widest text-xs mb-3">★★★★★</div>
                <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;Breaking the learning path into 12 weekly goals made complex full-stack topics structured and easy to follow.&rdquo;
                </blockquote>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#38BDF8] font-bold text-xs flex items-center justify-center shrink-0">
                  AK
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Ananya Krishnan</strong>
                  <small className="text-[10px] text-slate-400 block">{activeProgram.title}</small>
                </div>
              </div>
            </article>

            <article className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-[#38BDF8] tracking-widest text-xs mb-3">★★★★★</div>
                <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;Building a live capstone gave me a clear, concrete project to discuss and demonstrate in my engineering interviews.&rdquo;
                </blockquote>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#38BDF8] font-bold text-xs flex items-center justify-center shrink-0">
                  PM
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Pranav Menon</strong>
                  <small className="text-[10px] text-slate-400 block">{activeProgram.title}</small>
                </div>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 10. BOTTOM CALL TO ACTION BANNER ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 relative z-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#090F1E] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                YOUR NEXT CHAPTER
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-2 leading-[1.2] font-heading">
                Your ideas deserve to become real.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Build practical software engineering skills with Atideto Technologies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setApplyStep(1);
                  setIsApplyModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(0,102,255,0.4)] transition-all cursor-pointer"
              >
                Apply for Internship ↗
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Download Curriculum PDF ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 4-STEPPER INTERNSHIP REGISTRATION MODAL ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <StepperRegistrationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialProgramId={activeProgram.id}
        initialProgramTitle={activeProgram.title}
        initialType="Internship"
      />

    </div>
  );
}
