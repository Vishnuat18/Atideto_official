import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Wallet,
  User,
  Plus,
  Play,
  CheckCircle2,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Sparkles,
  LogOut,
  X,
  Share2,
  Bookmark,
  MoreHorizontal,
  FolderGit2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Video,
  FileText,
  Briefcase,
  TrendingUp,
  LayoutDashboard,
  Bell,
  CheckSquare,
  QrCode,
  Printer,
  Check,
  GraduationCap,
  Code2,
  Maximize2,
  ShieldAlert,
  Star,
  Lock,
  Menu,
  LayoutGrid,
  Globe,
  List
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { signOut } from 'firebase/auth';
import { exportElementToA4Pdf, exportElementToImage } from '@/lib/exportPdfDocument';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import atidetoWordmark from '@/assets/atideto/atideto.png';
import atidetoLogo from '@/assets/atideto/logo.png';
import { toast } from 'sonner';
import { getStudentsFromDb, subscribeToCloudSync } from '@/lib/api';
import { 
  getStoredStudents, 
  getVerificationUrl, 
  findStudentOrCertificate, 
  StudentCohortRecord 
} from '@/lib/certificateStore';
import { ALL_COURSES_LIST } from '@/constants/allCoursesData';
import { ACADEMY_COURSES } from '@/constants/academyCourses';
import { generateCurriculumPDF, CurriculumModuleData } from '@/utils/curriculumPdfGenerator';
import atidetoLogoImg from '@/assets/certificates/atideto-logo.png';
import { AuthenticCertificateCanvas } from '@/components/certificates/AuthenticCertificateCanvas';
import { AuthenticOfferLetterCanvas } from '@/components/certificates/AuthenticOfferLetterCanvas';
import { AuthenticAttendanceCertificateCanvas } from '@/components/certificates/AuthenticAttendanceCertificateCanvas';
import { FullScreenCertificateModal } from '@/components/certificates/FullScreenCertificateModal';
import { printOfficialDocument } from '@/lib/printDocument';
import GraphicalRepresentationAnalytics from './GraphicalRepresentationAnalytics';

interface StudentProps {
  user: {
    uid?: string;
    name: string;
    email: string;
    role: string;
  };
  onSwitchToAdmin?: () => void;
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
}

// Clean, unique Student Tab Types matching Company Structure (No numbers!)
export type StudentTabType = 
  | 'overview'
  // ACADEMICS
  | 'courses'
  | 'internships'
  // RECORDS
  | 'attendance'
  | 'certificates'
  | 'payments'
  // CAREER & ADVANCEMENT
  | 'explore'
  // ACCOUNT
  | 'profile';

// Right Panel state for Student matching Reference Image 2 slide-over drawer
interface StudentRightPanelState {
  isOpen: boolean;
  type: 'course-lecture' | 'course-curriculum' | 'internship-details' | 'certificate-viewer' | 'payment-receipt' | 'task-submission';
  title: string;
  data?: any;
}

// 21 Real Enrolled Cohort Students from Canonical Store (15 B.Tech IT + 6 B.E. CSE)
export const ORIGINAL_COHORT_STUDENTS = getStoredStudents();
const LEGACY_COHORT_STUDENTS = ORIGINAL_COHORT_STUDENTS;

// Helper to resolve the complete week-by-week curriculum as published on the Website
function getCourseCurriculumDetails(courseData: any) {
  if (!courseData) return null;
  const title = (courseData.title || '').toLowerCase();
  const domain = (courseData.domain || courseData.category || '').toLowerCase();
  const cid = (courseData.id || '').toLowerCase();

  // 1. Direct ID or title match in ACADEMY_COURSES
  let acadMatch = ACADEMY_COURSES.find(c =>
    c.id.toLowerCase() === cid ||
    (courseData.courseId && c.id.toLowerCase() === courseData.courseId.toLowerCase()) ||
    title.includes(c.title.toLowerCase()) ||
    c.title.toLowerCase().includes(title)
  );

  // 2. Keyword/domain match in ACADEMY_COURSES
  if (!acadMatch) {
    if (
      title.includes('full stack') || domain.includes('full stack') ||
      title.includes('mern') || domain.includes('mern') ||
      title.includes('web development') || domain.includes('web development') ||
      title.includes('web dev') || domain.includes('web dev')
    ) {
      acadMatch = ACADEMY_COURSES.find(c => c.id === 'fullstack-mern-pro');
    } else if (title.includes('next') || domain.includes('next') || title.includes('react') || domain.includes('react')) {
      acadMatch = ACADEMY_COURSES.find(c => c.id === 'nextjs-typescript-masterclass');
    } else if (title.includes('agent') || domain.includes('agent')) {
      acadMatch = ACADEMY_COURSES.find(c => c.id === 'ai-autonomous-agents');
    } else if (
      title.includes('generative') || title.includes('llm') || title.includes('rag') ||
      domain.includes('generative') || title.includes('ai') || domain.includes('ai') ||
      title.includes('machine learning') || domain.includes('machine learning')
    ) {
      acadMatch = ACADEMY_COURSES.find(c => c.id === 'generative-ai-engineering');
    }
  }

  // 3. Direct ID or title match in ALL_COURSES_LIST
  let allMatch = ALL_COURSES_LIST.find(c =>
    c.id.toLowerCase() === cid ||
    title.includes(c.title.toLowerCase()) ||
    c.title.toLowerCase().includes(title)
  );

  // 4. Keyword/domain match in ALL_COURSES_LIST
  if (!allMatch && !acadMatch) {
    if (
      title.includes('cyber') || domain.includes('cyber') ||
      title.includes('security') || domain.includes('security') ||
      title.includes('ethical') || domain.includes('ethical')
    ) {
      allMatch = ALL_COURSES_LIST.find(c => c.id === 'cybersecurity-fundamentals' || c.id === 'ethical-hacking-fundamentals');
    } else if (title.includes('python') || domain.includes('python')) {
      allMatch = ALL_COURSES_LIST.find(c => c.id === 'data-analysis-python' || c.id === 'ai-fundamentals');
    } else if (title.includes('data') || domain.includes('data') || title.includes('analytics') || domain.includes('analytics')) {
      allMatch = ALL_COURSES_LIST.find(c => c.id === 'data-science-fundamentals' || c.id === 'sql-for-data-analysis');
    } else if (title.includes('cloud') || domain.includes('cloud') || title.includes('devops') || domain.includes('devops')) {
      allMatch = ALL_COURSES_LIST.find(c => c.id === 'cloud-computing-fundamentals' || c.id === 'aws');
    }
  }

  if (acadMatch && acadMatch.curriculum && acadMatch.curriculum.length > 0) {
    return {
      id: acadMatch.id,
      title: acadMatch.title,
      category: acadMatch.category,
      duration: acadMatch.duration,
      level: acadMatch.level,
      instructor: courseData.instructor || 'Karthik Ramanathan (AI & Web Lead)',
      rating: acadMatch.rating || 4.96,
      skills: acadMatch.skills,
      technologies: acadMatch.technologies || courseData.tools || [],
      certification: acadMatch.certification || `Atideto Certified ${acadMatch.title} Professional`,
      modules: acadMatch.curriculum.map((m, mIdx) => ({
        id: `mod-${mIdx}`,
        week: m.week,
        title: m.title,
        summary: `Production curriculum module covering ${m.topics.slice(0, 2).join(', ')}.`,
        lessons: m.topics.map((top, tIdx) => ({
          id: `lesson-${mIdx}-${tIdx}`,
          title: top,
          duration: '45-60 min',
          description: `Production lecture, hands-on architectural code walkthrough, and practical lab patterns for ${top}.`
        })),
        quiz: `Diagnostic Assessment ${mIdx + 1}: ${m.title}`,
        assignment: `Production Sprint Project: Implement & deploy ${m.topics[0]}`
      })),
      capstone: {
        title: `${acadMatch.title} Production Capstone`,
        deliverable: `Production-ready commercial system deployment with CI/CD, unit tests, code audit, and architecture defense.`
      }
    };
  }

  if (allMatch && allMatch.curriculum && allMatch.curriculum.length > 0) {
    return {
      id: allMatch.id,
      title: allMatch.title,
      category: allMatch.category,
      duration: allMatch.duration,
      level: allMatch.level,
      instructor: courseData.instructor || 'Senior Engineering Architect',
      rating: allMatch.rating || 4.92,
      skills: allMatch.skills,
      technologies: allMatch.technologies || courseData.tools || [],
      certification: `Atideto Certified ${allMatch.title} Engineer`,
      modules: allMatch.curriculum.map((m, mIdx) => ({
        id: `mod-${mIdx}`,
        week: m.week,
        title: m.title,
        summary: `Structured engineering module covering ${m.lessons.slice(0, 2).join(', ')}.`,
        lessons: m.lessons.map((les, lIdx) => ({
          id: `lesson-${mIdx}-${lIdx}`,
          title: les,
          duration: '50 min',
          description: `Detailed practical lecture and architectural codebase for ${les}.`
        })),
        quiz: m.quiz || `Knowledge Milestone ${mIdx + 1}`,
        assignment: m.assignment || `Practical Lab Deliverable ${mIdx + 1}`
      })),
      capstone: allMatch.capstoneProject
    };
  }

  // Fallback rich 4-module curriculum for the course
  const fallback = ALL_COURSES_LIST[0];
  return {
    id: fallback.id,
    title: courseData.title || fallback.title,
    category: courseData.category || 'Software Engineering',
    duration: courseData.duration || '12 Weeks',
    level: 'Beginner to Advanced',
    instructor: courseData.instructor || 'Senior Engineering Architect',
    rating: 4.95,
    skills: courseData.tools || fallback.skills,
    technologies: courseData.tools || fallback.technologies,
    certification: 'Atideto Certified Software Engineer',
    modules: fallback.curriculum.map((m, mIdx) => ({
      id: `mod-${mIdx}`,
      week: m.week,
      title: m.title,
      summary: `Hands-on module covering ${m.lessons.slice(0, 2).join(', ')}.`,
      lessons: m.lessons.map((les, lIdx) => ({
        id: `lesson-${mIdx}-${lIdx}`,
        title: les,
        duration: '50 min',
        description: `Detailed practical lecture and codebase for ${les}.`
      })),
      quiz: m.quiz,
      assignment: m.assignment
    })),
    capstone: fallback.capstoneProject
  };
}

export default function StudentBlackWhiteDashboard({ user, onSwitchToAdmin, zoomLevel = 0.8, onZoomChange }: StudentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StudentTabType>('overview');
  const mainScrollRef = useRef<HTMLElement | null>(null);

  // Always reset scroll to top on tab switch or mount - never retain scrolled down position
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
      mainScrollRef.current.scrollLeft = 0;
    }
  }, [activeTab]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreSheetOpen, setMobileMoreSheetOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState<'modules' | 'tasks' | 'attendance'>('modules');
  const [analyticsSemester, setAnalyticsSemester] = useState('Fall Semester (2026)');

  // Dynamic ViewSwitcher Mode: 'list' (Table) vs 'grid' (Small icons / card boxes)
  const [panelViewMode, setPanelViewMode] = useState<Record<string, 'list' | 'grid'>>({});
  const getViewMode = (tab: string, defaultMode?: 'list' | 'grid'): 'list' | 'grid' => {
    if (panelViewMode[tab]) return panelViewMode[tab];
    if (defaultMode) return defaultMode;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? 'grid' : 'list';
  };
  const setViewMode = (tab: string, mode: 'list' | 'grid') => {
    setPanelViewMode(prev => ({ ...prev, [tab]: mode }));
  };

  // Track which pane has its Graphical Analytics Insight open
  const [analyticsExpandedPanes, setAnalyticsExpandedPanes] = useState<Record<string, boolean>>({
    'overview': false,
    'courses': false,
    'internships': false,
    'attendance': false,
    'payments': false,
  });

  const togglePaneAnalytics = (tab: string) => {
    setAnalyticsExpandedPanes(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  const isPaneAnalyticsOpen = (tab: string) => !!analyticsExpandedPanes[tab];

  const ViewSwitcher = ({ tab, defaultMode = 'list', hideAnalyticsToggle = false }: { tab: string; defaultMode?: 'list' | 'grid'; hideAnalyticsToggle?: boolean }) => {
    const mode = getViewMode(tab, defaultMode);
    const analyticsOpen = isPaneAnalyticsOpen(tab);
    return (
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="inline-flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode(tab, 'grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'grid'
                ? 'bg-[#000000] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Small icons (Grid card view)"
          >
            <LayoutGrid size={14} />
            <span>Small icons</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(tab, 'list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'list'
                ? 'bg-[#000000] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="List (Table list view)"
          >
            <List size={14} />
            <span>List</span>
          </button>
        </div>

        {!hideAnalyticsToggle && (
          <button
            type="button"
            onClick={() => togglePaneAnalytics(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition cursor-pointer select-none ${
              analyticsOpen
                ? 'bg-[#000000] text-white border-black font-bold shadow-2xs'
                : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border-[#E2E8F0] font-semibold'
            }`}
            title="Toggle Graphical Analytic Insights (Line, Bar, Pie, Histogram, Frequency Polygon, Frequency Curve)"
          >
            <Layers size={14} />
            <span>Analytic Insights</span>
          </button>
        )}
      </div>
    );
  };

  // Interactive curriculum lesson completion & accordion states
  const [completedLessonKeys, setCompletedLessonKeys] = useState<Record<string, boolean>>({
    'lesson-0-0': true,
    'lesson-0-1': true
  });
  const [expandedModuleIdxs, setExpandedModuleIdxs] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleLessonCheck = (lessonKey: string) => {
    setCompletedLessonKeys(prev => {
      const next = { ...prev, [lessonKey]: !prev[lessonKey] };
      toast.success(next[lessonKey] ? 'Marked lesson as completed!' : 'Lesson unmarked');
      return next;
    });
  };

  const toggleModuleAccordion = (idx: number) => {
    setExpandedModuleIdxs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // All real enrolled cohort students (updated from cache / MySQL)
  const [cohortStudents, setCohortStudents] = useState<any[]>(ORIGINAL_COHORT_STUDENTS);

  // Synchronized Student Profile & Internship Tuition Payment Status
  const [studentProfile, setStudentProfile] = useState<any>(() => {
    // Initial resolution: match logged-in user or default to first enrolled candidate Suresh kumar D
    const matched = ORIGINAL_COHORT_STUDENTS.find(s => 
      (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && s.name.toLowerCase() === user.name.toLowerCase())
    );
    return matched || ORIGINAL_COHORT_STUDENTS[0];
  });

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchAndSyncStudent = async () => {
      if (isFetching || !isMounted) return;
      isFetching = true;

      try {
        let stored = getStoredStudents();
        try {
          const dbStudents = await getStudentsFromDb();
          if (dbStudents && Array.isArray(dbStudents) && dbStudents.length > 0) {
            stored = dbStudents;
          }
        } catch (e) {
          console.warn('Student sync notice:', e);
        }

        if (!isMounted) return;

        setCohortStudents(prev => {
          if (prev.length === stored.length && prev[0]?.id === stored[0]?.id && prev[0]?.score === stored[0]?.score) {
            return prev;
          }
          return stored;
        });

        const userEmail = (user?.email || '').toLowerCase().trim();
        const userName = (user?.name || '').toLowerCase().trim();

        const found = stored.find((s: any) => 
          (userEmail && s.email && s.email.toLowerCase() === userEmail) ||
          (userName && s.name && s.name.toLowerCase() === userName) ||
          (studentProfile && (s.id === studentProfile.id || s.studentId === studentProfile.studentId))
        );

        if (found) {
          setStudentProfile((prev: any) => {
            if (prev && prev.id === found.id && prev.attendance === found.attendance && prev.feePaid === found.feePaid && prev.status === found.status) {
              return prev;
            }
            return found;
          });
        } else if (userEmail) {
          setStudentProfile((prev: any) => ({
            ...prev,
            id: user?.uid || `STD-${Date.now()}`,
            name: user?.name || userEmail.split('@')[0],
            email: userEmail,
            status: 'Active',
            attendance: prev?.attendance || 95,
            score: prev?.score || 92
          }));
        } else if (stored.length > 0) {
          setStudentProfile((prev: any) => prev || stored[0]);
        }
      } finally {
        isFetching = false;
      }
    };

    fetchAndSyncStudent();
    const unsubscribeCloud = subscribeToCloudSync(() => {
      fetchAndSyncStudent();
    });

    const handleUpdate = () => {
      fetchAndSyncStudent();
    };

    window.addEventListener('atideto-students-updated', handleUpdate);
    window.addEventListener('atideto_students_updated', handleUpdate);

    return () => {
      isMounted = false;
      unsubscribeCloud();
      window.removeEventListener('atideto-students-updated', handleUpdate);
      window.removeEventListener('atideto_students_updated', handleUpdate);
    };
  }, [user]);

  // Right-Side Slide-Over Panel State (Reference Image 2)
  const [rightPanel, setRightPanel] = useState<StudentRightPanelState>({
    isOpen: false,
    type: 'course-lecture',
    title: ''
  });

  const studentCertRef = useRef<HTMLDivElement>(null);
  const studentCertPreviewWrapperRef = useRef<HTMLDivElement>(null);
  const [studentCertContainerWidth, setStudentCertContainerWidth] = useState<number>(1414);
  const [studentCertZoomLevel, setStudentCertZoomLevel] = useState<'fit' | number>('fit');
  const [isExportingCert, setIsExportingCert] = useState(false);
  const [showFullViewModal, setShowFullViewModal] = useState<boolean>(false);

  useEffect(() => {
    if (!studentCertPreviewWrapperRef.current) return;
    const updateWidth = () => {
      if (studentCertPreviewWrapperRef.current) {
        setStudentCertContainerWidth(studentCertPreviewWrapperRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setStudentCertContainerWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(studentCertPreviewWrapperRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [studentProfile, activeTab]);

  const [studentSelectedDoc, setStudentSelectedDoc] = useState<'certificate' | 'offer-letter' | 'attendance'>('certificate');
  const studentOfferRef = useRef<HTMLDivElement>(null);
  const studentAttendanceRef = useRef<HTMLDivElement>(null);

  const isLandscape = studentSelectedDoc === 'certificate';
  const certBaseW = isLandscape ? 1414 : 850;
  const certBaseH = studentSelectedDoc === 'certificate' ? 1000 : studentSelectedDoc === 'attendance' ? 1202 : 1277;
  const effectiveAvailW = studentCertContainerWidth > 0 
    ? studentCertContainerWidth - (typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24)
    : (typeof window !== 'undefined' ? Math.max(260, window.innerWidth - 36) : 320);
  const certAvailW = Math.max(240, effectiveAvailW);
  const certFitScale = Math.min(1, Math.max(0.16, certAvailW / certBaseW));
  const certEffScale = studentCertZoomLevel === 'fit' ? certFitScale : studentCertZoomLevel;

  const handlePrintStudentCert = () => {
    const targetEl = 
      studentSelectedDoc === 'certificate' 
        ? studentCertRef.current 
        : studentSelectedDoc === 'attendance'
        ? studentAttendanceRef.current
        : studentOfferRef.current;
    if (!targetEl) return;
    printOfficialDocument(targetEl, {
      orientation: isLandscape ? 'landscape' : 'portrait',
      title: `ATIDETO_${studentSelectedDoc}_${(studentProfile?.name || 'Student').replace(/\s+/g, '_')}`
    });
  };

  const handleDownloadStudentCertPng = async () => {
    if (studentProfile?.certHold) {
      toast.error('This credential is on administrative hold.');
      return;
    }
    const targetEl = 
      studentSelectedDoc === 'certificate' 
        ? studentCertRef.current 
        : studentSelectedDoc === 'attendance'
        ? studentAttendanceRef.current
        : studentOfferRef.current;
    if (!targetEl) return;
    try {
      setIsExportingCert(true);
      const safeName = (studentProfile?.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      await exportElementToImage(targetEl, {
        filename: `ATIDETO_${studentSelectedDoc}_${safeName}.png`,
        canonicalWidth: certBaseW,
        canonicalHeight: isLandscape ? 1000 : (studentSelectedDoc === 'attendance' ? 1202 : 1277)
      });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('Failed to export document image.');
    } finally {
      setIsExportingCert(false);
    }
  };

  const handleDownloadStudentCertPdf = async () => {
    if (studentProfile?.certHold) {
      toast.error('This credential is on administrative hold.');
      return;
    }
    const targetEl = 
      studentSelectedDoc === 'certificate' 
        ? studentCertRef.current 
        : studentSelectedDoc === 'attendance'
        ? studentAttendanceRef.current
        : studentOfferRef.current;
    if (!targetEl) return;
    try {
      setIsExportingCert(true);
      const safeName = (studentProfile?.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      await exportElementToA4Pdf(targetEl, {
        filename: `ATIDETO_${studentSelectedDoc}_${safeName}.pdf`,
        orientation: isLandscape ? 'landscape' : 'portrait',
        canonicalWidth: certBaseW,
        canonicalHeight: isLandscape ? 1000 : (studentSelectedDoc === 'attendance' ? 1202 : 1277)
      });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('Failed to export PDF.');
    } finally {
      setIsExportingCert(false);
    }
  };

  // Student's Enrolled Courses & Internships
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 'genai-llm',
      title: 'Generative AI & LLM Systems Engineering',
      instructor: 'Karthik Ramanathan (AI Lead)',
      duration: '12 Weeks',
      progress: 75,
      attendance: 96,
      batch: '2026-B1',
      status: 'Active',
      lessons: [
        { id: 1, title: 'Foundations of Transformers & Attention Mechanisms', duration: '45 min', completed: true },
        { id: 2, title: 'LangChain & LlamaIndex Production Pipelines', duration: '55 min', completed: true },
        { id: 3, title: 'Advanced RAG with Vector DBs (Pinecone & Qdrant)', duration: '60 min', completed: true },
        { id: 4, title: 'Fine-Tuning Open Source LLMs with LoRA / QLoRA', duration: '65 min', completed: false },
        { id: 5, title: 'Multi-Agent Workflows with CrewAI & LangGraph', duration: '50 min', completed: false },
      ],
      tools: ['PyTorch', 'LangChain', 'LlamaIndex', 'Pinecone', 'Docker'],
      area: ['AI Systems', 'Machine Learning', 'RAG', 'SaaS']
    },
    {
      id: 'nextjs-systems',
      title: 'Next.js 15, React 19 & TypeScript Systems',
      instructor: 'Principal Frontend Architect',
      duration: '10 Weeks',
      progress: 90,
      attendance: 94,
      batch: '2026-B2',
      status: 'Active',
      lessons: [
        { id: 1, title: 'Server Components, Actions & Streaming SSR', duration: '40 min', completed: true },
        { id: 2, title: 'State Architecture with Zustand & TanStack Query', duration: '50 min', completed: true },
        { id: 3, title: 'Database Modeling with PostgreSQL & Prisma', duration: '55 min', completed: true },
        { id: 4, title: 'Micro-Animations with Framer Motion & Tailwind', duration: '45 min', completed: true },
        { id: 5, title: 'Production Docker Containerization & Cloud Deployment', duration: '50 min', completed: false },
      ],
      tools: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'PostgreSQL'],
      area: ['Full Stack', 'Web Architecture', 'SaaS', 'UI/UX']
    }
  ]);

  // Student's Active Internships
  const [internships, setInternships] = useState([
    {
      id: 'AT-INT-2026-7894',
      title: 'Commercial AI Engineering Industrial Internship',
      company: 'Atideto Technologies Labs',
      role: 'Generative AI Research Intern',
      duration: '3 Months (Aug 2026 - Nov 2026)',
      mentor: 'Karthik Ramanathan (AI Lead)',
      stipend: '₹18,000 / month',
      status: 'In Progress (Sprint 04)',
      score: 95,
      deliverables: 'Enterprise Document Intelligence & RAG Chatbot with sub-50ms latency.',
      tools: ['FastAPI', 'Python', 'Qdrant', 'Next.js'],
      area: ['AI Research', 'Backend APIs', 'Vector DB', 'Production']
    }
  ]);

  const renderPaneAnalytics = (tab: string, forceOpen: boolean = false) => {
    if (!forceOpen && !isPaneAnalyticsOpen(tab)) return null;
    return (
      <div className="mb-5 animate-in fade-in-50 duration-200">
        <GraphicalRepresentationAnalytics
          currentPane={tab}
          students={cohortStudents}
          courses={enrolledCourses}
          internships={internships}
          onClose={forceOpen ? undefined : () => togglePaneAnalytics(tab)}
        />
      </div>
    );
  };

  // Tasks & Attendance Checklist
  const [studentTasks, setStudentTasks] = useState([
    { id: 't1', title: 'Implement Vector Embeddings pipeline for PDF ingestion', due: '24 Oct 2026', completed: true, points: '50 Pts' },
    { id: 't2', title: 'Fine-tune Llama-3-8B model on domain financial dataset', due: '27 Oct 2026', completed: true, points: '80 Pts' },
    { id: 't3', title: 'Connect LangGraph agent with real-time web search tool', due: '30 Oct 2026', completed: false, points: '65 Pts' },
    { id: 't4', title: 'Deploy Docker image to GCP Cloud Run with SSL domain', due: '05 Nov 2026', completed: false, points: '90 Pts' }
  ]);

  // Live Lectures Schedule
  const [liveLectures] = useState([
    {
      id: 'lec-101',
      title: 'Production Multi-Agent Systems with LangGraph & CrewAI',
      instructor: 'Karthik Ramanathan (AI Lead)',
      date: 'Thursday, 22 Oct 2026',
      time: '07:30 PM - 09:00 PM IST',
      platform: 'Google Meet (HD)',
      status: 'Upcoming'
    },
    {
      id: 'lec-102',
      title: 'High-Performance Next.js 15 Architecture & Edge Middleware',
      instructor: 'Senior Frontend Architect',
      date: 'Saturday, 24 Oct 2026',
      time: '11:00 AM - 01:00 PM IST',
      platform: 'Atideto Live Classroom',
      status: 'Scheduled'
    }
  ]);

  // Dynamically sync active internships & course tracks with active candidate profile
  useEffect(() => {
    if (!studentProfile) return;
    const rawDomain = studentProfile.domain || studentProfile.course || 'Full stack web development';
    const domainTitle = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);

    setInternships([
      {
        id: studentProfile.id || 'AT-MEC-2027-01',
        title: `${domainTitle} Industrial Internship`,
        company: `${studentProfile.college || 'Mahendra Engineering College'}`,
        role: `${domainTitle} Candidate Trainee`,
        duration: `${studentProfile.internshipDuration || '3 Months'} (${studentProfile.startDate || '25 Oct 2026'}${studentProfile.endDate ? ` - ${studentProfile.endDate}` : ''})`,
        mentor: studentProfile.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        stipend: 'Industry Performance-based',
        status: studentProfile.internshipStatus || 'Active Industrial Track',
        score: studentProfile.score || 95,
        deliverables: `Production engineering milestone in ${domainTitle} with code reviews, Git PR defense, and deployment.`,
        tools: studentProfile.tools || ['React', 'Node.js', 'Express', 'MongoDB'],
        area: studentProfile.area || ['Full Stack', 'Web Development', 'REST APIs']
      }
    ]);

    setEnrolledCourses([
      {
        id: 'primary-academic-track',
        title: `${domainTitle} Systems & Engineering Track`,
        instructor: studentProfile.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        duration: studentProfile.internshipDuration || '3 Months',
        progress: studentProfile.score || 92,
        attendance: studentProfile.attendance || 96,
        batch: studentProfile.batch || '2026-MEC',
        status: studentProfile.status || 'Verified Enrolled',
        lessons: [
          { id: 1, title: `Architecture Foundations of ${domainTitle}`, duration: '45 min', completed: true },
          { id: 2, title: 'Responsive Interfaces, Design Systems & Component Tree', duration: '55 min', completed: true },
          { id: 3, title: 'RESTful API Contracts, Database Transactions & State Stores', duration: '60 min', completed: true },
          { id: 4, title: 'Automated Testing, Docker Containerization & CI/CD Pipelines', duration: '65 min', completed: false },
          { id: 5, title: 'Capstone Defense: Production Software Review & Architecture Audit', duration: '50 min', completed: false },
        ],
        tools: studentProfile.tools || ['React', 'Node.js', 'MySQL', 'JavaScript'],
        area: studentProfile.area || ['Full Stack', 'Software Engineering']
      }
    ]);
  }, [studentProfile]);

  // Sync new registrations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('atideto_registrations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const newInternships = parsed.map((item: any) => ({
            id: item.applicationId || 'AT-INT-2026-NEW',
            title: `${item.selectedProgramTitle || 'AI Engineering'} Internship`,
            company: 'Atideto Technologies Labs',
            role: 'Associate Engineering Intern',
            duration: item.duration || '2 Months',
            mentor: 'Atideto Engineering Lead',
            stipend: 'Performance-based',
            status: 'Enrolled & Verified',
            score: 100,
            deliverables: 'Commercial Capstone Software & Milestone Defense',
            tools: ['React', 'Python', 'Docker'],
            area: ['Engineering', 'Hands-on', 'Capstone']
          }));

          setInternships(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const fresh = newInternships.filter((i: any) => !existingIds.has(i.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch (e) {
      console.error('Error syncing student registrations:', e);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleLessonComplete = (courseId: string, lessonId: number) => {
    setEnrolledCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updated = c.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l);
        const completedCount = updated.filter(l => l.completed).length;
        const newProgress = Math.round((completedCount / updated.length) * 100);
        return { ...c, lessons: updated, progress: newProgress };
      }
      return c;
    }));
    toast.success('Lecture milestone updated!');
  };

  const toggleTaskComplete = (taskId: string) => {
    setStudentTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    toast.success('Task status updated!');
  };

  return (
    <div 
      data-slot="dashboard"
      className="w-full h-full overflow-hidden flex flex-col antialiased bg-[#F8FAFC] text-[#0F172A] font-sans"
    >
      
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TOP HEADER BAR (Apple / Android Native App Bar Style)                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] px-3 sm:px-6 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        
        {/* Left: Mobile Menu Trigger + Atideto Brand + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 -ml-1 text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition cursor-pointer active:scale-95"
            title="Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition text-left"
            title="Go to Atideto Main Website"
          >
            <img src={atidetoLogo} alt="Atideto" className="h-6 sm:h-7 w-auto object-contain" />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#000000]">
                Atideto<span className="text-[#0066FF] font-light">Tech</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] hidden sm:inline-block">
                Student App
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#64748B] pl-4 border-l border-[#E2E8F0]">
            <span className="text-black font-semibold">Student</span>
            <ChevronRight size={13} className="text-[#94A3B8]" />
            <span className="font-bold text-[#0066FF] capitalize">
              {activeTab === 'overview' ? 'Overview' : activeTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Right: Main Website + Quick Switch to Admin + Notification + Student Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-black transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Return to Main Website"
          >
            <Globe size={13} className="text-[#0066FF]" />
            <span className="hidden xs:inline sm:inline">Main Website</span>
          </button>

          <button 
            title="Notifications" 
            className="p-2 rounded-full hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition relative cursor-pointer active:scale-95"
          >
            <Bell size={17} />
            <span className="w-2 h-2 rounded-full bg-[#0066FF] absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* User Profile Badge (Reference Image 2 Style) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 sm:border-l sm:border-[#E2E8F0]">
            <button 
              type="button"
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full bg-[#000000] text-white font-black text-xs flex items-center justify-center shadow-sm cursor-pointer active:scale-95 hover:ring-2 hover:ring-[#0066FF]/20 transition"
              title="Open Student Profile"
            >
              {(studentProfile?.name || user.name || 'S').charAt(0).toUpperCase()}
            </button>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <p className="font-bold text-[#0F172A] leading-none truncate max-w-[120px]">{studentProfile?.name || user.name}</p>
              <p className="text-[#64748B] text-[10px] mt-0.5 font-medium">{studentProfile?.degree || 'Verified Candidate'}</p>
            </div>
            <button 
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-[#64748B] hover:text-red-600 hover:bg-[#F1F5F9] rounded-lg transition ml-0.5 cursor-pointer active:scale-95"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MAIN ERP BODY: LEFT PANEL + WORKSPACE (Exact Reference Image 2)      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex w-full relative overflow-hidden min-h-0">
        
        {/* LEFT SIDEBAR: Clean, Minimal, Corporate (Desktop Only) */}
        <aside className={`hidden md:flex flex-col ${sidebarCollapsed ? 'w-18' : 'w-64'} bg-[#FFFFFF] border-r border-[#E2E8F0] shrink-0 h-full overflow-hidden transition-all duration-200 select-none z-20`}>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-semibold custom-scrollbar min-h-0">
            
            {/* Top Active Dashboard Tab (Rounded Dark Pill - Exact Ref Image 2) */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#000000] text-white font-extrabold shadow-sm'
                  : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-black'
              }`}
            >
              <LayoutDashboard size={16} className={activeTab === 'overview' ? 'text-white' : 'text-[#64748B]'} />
              {!sidebarCollapsed && <span className="tracking-tight text-xs">Dashboard</span>}
            </button>

            {/* CATEGORY: ACADEMICS (No Numbers!) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Academics
                </span>
              )}
            </div>

            <StudentSidebarItem 
              icon={<BookOpen size={16} />} 
              label="Enrolled Courses" 
              count={String(enrolledCourses.length)}
              active={activeTab === 'courses'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('courses')} 
            />
            <StudentSidebarItem 
              icon={<Briefcase size={16} />} 
              label="Active Internships" 
              count={String(internships.length)}
              active={activeTab === 'internships'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('internships')} 
            />

            {/* CATEGORY: RECORDS (No Numbers!) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Records
                </span>
              )}
            </div>

            <StudentSidebarItem 
              icon={<CalendarCheck size={16} />} 
              label="Attendance & Tasks" 
              badge="96%"
              active={activeTab === 'attendance'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('attendance')} 
            />
            <StudentSidebarItem 
              icon={<Award size={16} />} 
              label="Verified Certificates" 
              badge="Verified"
              active={activeTab === 'certificates'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('certificates')} 
            />
            <StudentSidebarItem 
              icon={<Wallet size={16} />} 
              label="Payment Receipts" 
              active={activeTab === 'payments'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('payments')} 
            />

            {/* CATEGORY: CAREER & ADVANCEMENT (No Numbers!) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Career & Advancement
                </span>
              )}
            </div>

            <StudentSidebarItem 
              icon={<Sparkles size={16} />} 
              label="Register New Program" 
              badge="4-Stepper"
              active={activeTab === 'explore'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setIsRegisterModalOpen(true)} 
            />

            {/* CATEGORY: ACCOUNT (No Numbers!) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Account
                </span>
              )}
            </div>

            <StudentSidebarItem 
              icon={<User size={16} />} 
              label="Student Profile" 
              active={activeTab === 'profile'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('profile')} 
            />

          </nav>

          {/* Sidebar Footer with Collapse Toggle (Always Visible Pinned) */}
          <div className="p-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8] shrink-0 bg-white z-10">
            {!sidebarCollapsed && (
              <span className="text-[11px] font-medium">&copy; 2026 Atideto Academy</span>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#64748B] hover:text-black transition mx-auto cursor-pointer"
              title="Toggle Sidebar"
            >
              <ChevronRight size={14} className={sidebarCollapsed ? '' : 'rotate-180 transition-transform'} />
            </button>
          </div>
        </aside>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* MAIN WORKSPACE CONTENT: Clean Minimal Canvas                         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <main ref={mainScrollRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden max-w-full touch-pan-y min-h-0 bg-[#F8FAFC] p-3 sm:p-6 lg:p-8 custom-scrollbar pb-24 sm:pb-8">
          
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 1: OVERVIEW & ANALYTICS (Exact Reference Image 2 Layout)       */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
              
              {/* Header Title with Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    Overview & Learning Progression
                  </h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Your real-time sprint milestones, syllabus completion, and verifiable credentials
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                  <Calendar size={13} className="text-[#0066FF]" />
                  <span>Wednesday, 21 Oct 2026</span>
                </div>
              </div>

              {/* Mobile View: High-density compact small-icon metric badges (sm:hidden) */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                {/* 1. Courses */}
                <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-[#0F172A] leading-none">
                      {enrolledCourses.length}
                    </div>
                    <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Courses</span>
                  </div>
                </div>

                {/* 2. Internships */}
                <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Briefcase size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-[#0F172A] leading-none">
                      {internships.length}
                    </div>
                    <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Internship</span>
                  </div>
                </div>

                {/* 3. Attendance */}
                <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CalendarCheck size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-[#0F172A] leading-none">
                      {studentProfile?.attendance || 96}%
                    </div>
                    <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Attendance</span>
                  </div>
                </div>

                {/* 4. Score */}
                <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-[#0F172A] leading-none">
                      {studentProfile?.score || 95}/100
                    </div>
                    <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Score</span>
                  </div>
                </div>
              </div>

              {/* Desktop / Tablet View: 4 Top Metric Cards (hidden sm:grid) */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
                
                {/* 1. Enrolled Courses */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="sm:hidden" />
                      <BookOpen size={16} className="hidden sm:block" />
                    </div>
                    <span>Courses</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                    {enrolledCourses.length}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium break-words">AI & Full Stack</p>
                </div>

                {/* 2. Active Internships */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                      <Briefcase size={14} className="sm:hidden" />
                      <Briefcase size={16} className="hidden sm:block" />
                    </div>
                    <span>Internship</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                    {internships.length}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#0066FF] font-semibold break-words">Sprint 04 active</p>
                </div>

                {/* 3. Academic Attendance */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                      <CalendarCheck size={14} className="sm:hidden" />
                      <CalendarCheck size={16} className="hidden sm:block" />
                    </div>
                    <span>Attendance</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                    {studentProfile?.attendance || 96}%
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold flex items-center gap-1 break-words">
                    <CheckCircle2 size={11} /> Exemplary
                  </p>
                </div>

                {/* 4. Verified Credentials */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                      <Award size={14} className="sm:hidden" />
                      <Award size={16} className="hidden sm:block" />
                    </div>
                    <span>Score</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                    {studentProfile?.score || 95}/100
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#0066FF] font-medium break-words">{studentProfile?.degree || 'Verified Candidate'}</p>
                </div>
              </div>

              {/* Large Section: Active Internship & Cohort Operations (Ref Image 2 Middle Card) */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                      <Briefcase size={18} className="text-[#0F172A]" />
                      <span>Active Internship & Cohort Roadmap</span>
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {studentProfile?.college || 'Mahendra Engineering College'} • {studentProfile?.batch || '2026 Academic Cohort'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#000000] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <BookOpen size={13} />
                      <span>View Curriculum Syllabus</span>
                      <span>→</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('attendance')}
                      className="px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold transition cursor-pointer active:scale-95"
                    >
                      Sprint Tasks
                    </button>
                  </div>
                </div>

                {/* 4 Inner Stat Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Enrolled Track
                    </span>
                    <div className="text-base font-black text-[#0F172A] truncate">
                      {studentProfile?.domain || studentProfile?.course || 'Full stack web development'}
                    </div>
                    <p className="text-[11px] text-[#0066FF] font-medium">{studentProfile?.internshipDuration || '3 Months'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Assigned Mentor
                    </span>
                    <div className="text-base font-black text-[#0F172A] truncate">
                      {studentProfile?.mentor || 'Karthik Ramanathan'}
                    </div>
                    <p className="text-[11px] text-[#64748B]">Atideto Lead Mentor</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Tuition Settlement
                    </span>
                    <div className={`text-base font-black truncate ${
                      (studentProfile?.paymentStatus || '').toLowerCase().includes('due')
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}>
                      {studentProfile?.paymentStatus || 'Pending Admin Decision'}
                    </div>
                    <p className="text-[11px] text-[#64748B]">Paid: {studentProfile?.feePaid || '₹0'} of {studentProfile?.feeTotal || 'To Be Decided by Admin'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Academic Standing
                    </span>
                    <div className="text-base font-black text-emerald-600">
                      {studentProfile?.score || 95}/100 Grade
                    </div>
                    <p className="text-[11px] text-[#64748B]">Attendance: {studentProfile?.attendance || 96}%</p>
                  </div>

                </div>
              </div>

              {/* Lower Section: Graphical Analytic Insights Engine (Ungrouped & Grouped Visuals) */}
              <div className="space-y-5">
                <GraphicalRepresentationAnalytics
                  currentPane="overview"
                  students={cohortStudents}
                  courses={enrolledCourses}
                  internships={internships}
                  titleOverride="Student Learning Analytic Insights"
                />
              </div>

              {/* Course Tracks & Video Lectures Table with Slide-Over Drawer Launch */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A]">My Enrolled Courses & Curriculum</h3>
                    <p className="text-xs text-[#64748B]">Click any course to inspect the complete week-by-week curriculum as in the Website</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="text-xs font-bold text-[#0F172A] hover:underline cursor-pointer"
                  >
                    View All Enrolled Courses →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                        <th className="py-3 px-4">TYPE</th>
                        <th className="py-3 px-4">SCHEDULE & DURATION</th>
                        <th className="py-3 px-4">FEE (₹)</th>
                        <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {enrolledCourses.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'course-curriculum',
                            title: c.title,
                            data: c
                          })}
                          className="hover:bg-[#F8FAFC] transition cursor-pointer"
                        >
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-sm text-[#0F172A] block">{c.title}</span>
                            <span className="text-[11px] text-[#64748B] block mt-0.5">
                              Batch: {c.batch}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                              TRAINING
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                            <span className="font-semibold block">01 Sept 2026</span>
                            <span className="text-[11px] text-[#64748B] block">{c.duration}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                            {studentProfile?.feeTotal || 'Admin Decided'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1 min-w-[110px]">
                              <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                <span>{c.progress}%</span>
                                <span className="text-[10px] text-[#64748B] font-normal">Syllabus</span>
                              </div>
                              <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-black rounded-full"
                                  style={{ width: `${c.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                              <span>Active</span>
                              <ChevronDown size={12} className="text-[#64748B]" />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition">
                                <ExternalLink size={14} />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 2: ENROLLED COURSES & VIDEO LECTURES                          */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'courses' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Enrolled Courses & Complete Curriculum</h1>
                  <p className="text-xs text-[#64748B]">Complete week-by-week curriculum architecture, technical modules, coding labs, and syllabus milestones as in the Website</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="courses" defaultMode="grid" />
                </div>
              </div>

              {renderPaneAnalytics('courses')}

              {getViewMode('courses', 'grid') === 'grid' ? (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {enrolledCourses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'course-curriculum',
                        title: c.title,
                        data: c
                      })}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {c.batch}
                          </span>
                          <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                            Active
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg text-[#0F172A]">{c.title}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{c.instructor}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-[#64748B]">Syllabus Progress</span>
                            <span className="text-[#0F172A] font-bold">{c.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {c.tools.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#0F172A]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full py-2.5 rounded-xl bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer">
                        <BookOpen size={14} />
                        <span>View Curriculum & Syllabus</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Minimal 2-Color Table (List View) */
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                          <th className="py-3 px-4">TYPE</th>
                          <th className="py-3 px-4">SCHEDULE & DURATION</th>
                          <th className="py-3 px-4">FEE (₹)</th>
                          <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {enrolledCourses.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setRightPanel({
                              isOpen: true,
                              type: 'course-curriculum',
                              title: c.title,
                              data: c
                            })}
                            className="hover:bg-[#F8FAFC] transition cursor-pointer"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-sm text-[#0F172A] block">{c.title}</span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">
                                Batch: {c.batch}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                TRAINING
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                              <span className="font-semibold block">01 Sept 2026</span>
                              <span className="text-[11px] text-[#64748B] block">{c.duration}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                              {studentProfile?.feeTotal || 'Admin Decided'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 min-w-[110px]">
                                <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                  <span>{c.progress}%</span>
                                  <span className="text-[10px] text-[#64748B] font-normal">Syllabus</span>
                                </div>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-black rounded-full"
                                    style={{ width: `${c.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>Active</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <span className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition">
                                  <ExternalLink size={14} />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 3: ACTIVE INTERNSHIPS & SPRINT MILESTONES                      */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'internships' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Commercial Industrial Internships</h1>
                  <p className="text-xs text-[#64748B]">Live client engagements, sprint tasks, mentor reviews, and production defense</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ViewSwitcher tab="internships" defaultMode="grid" />
                  <button
                    onClick={() => navigate('/upskill')}
                    className="px-4 py-2 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <span>View More Internships</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('internships')}

              {getViewMode('internships', 'grid') === 'grid' ? (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {internships.map((int) => (
                    <div key={int.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                                {int.id}
                              </span>
                              <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                                {int.status}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mt-1.5">{int.title}</h3>
                            <p className="text-xs text-[#64748B] mt-0.5">{int.company} • {int.role}</p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-[#64748B]">Duration</p>
                            <p className="font-bold text-sm text-[#0F172A]">{int.duration}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <span className="text-[#64748B] text-[10px] font-bold uppercase">Mentor</span>
                            <p className="font-bold text-[#0F172A] mt-0.5 break-words">{int.mentor}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <span className="text-[#64748B] text-[10px] font-bold uppercase">Stipend</span>
                            <p className="font-bold text-[#0F172A] mt-0.5 break-words">{int.stipend}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <span className="text-[#64748B] text-[10px] font-bold uppercase">Score</span>
                            <p className="font-bold text-[#0F172A] mt-0.5">{int.score}/100</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h5 className="font-bold text-xs text-[#0F172A]">Deliverables & Scope</h5>
                          <p className="text-xs text-[#475569] leading-relaxed p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            {int.deliverables}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                        <button
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'internship-details',
                            title: int.title,
                            data: int
                          })}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <ExternalLink size={13} />
                          <span>Sprint Tasks</span>
                        </button>

                        <button
                          onClick={() => {
                            toast.success(`Opening Offer Letter (${studentProfile?.offerNo || 'ATIDETO/2026/INT/001'})...`);
                            window.print();
                          }}
                          className="py-2 px-3 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Briefcase size={13} />
                          <span>Offer Letter</span>
                        </button>

                        <a
                          href={getVerificationUrl(studentProfile?.certId || 'ATD-INT-2026-0001')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] transition cursor-pointer shadow-2xs"
                          title="Verify Credential"
                        >
                          <ShieldCheck size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Minimal 2-Color Table (List View) */
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                          <th className="py-3 px-4">TYPE</th>
                          <th className="py-3 px-4">SCHEDULE & DURATION</th>
                          <th className="py-3 px-4">FEE (₹)</th>
                          <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {internships.map((int) => (
                          <tr
                            key={int.id}
                            className="hover:bg-[#F8FAFC] transition"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-sm text-[#0F172A] block">{int.title}</span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">
                                Batch: {int.id} • {int.company}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                INTERNSHIP
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                              <span className="font-semibold block">01 Sept 2026</span>
                              <span className="text-[11px] text-[#64748B] block">{int.duration}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                              {int.stipend || '₹9,999'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 min-w-[110px]">
                                <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                  <span>{int.score}/100</span>
                                  <span className="text-[10px] text-[#64748B] font-normal">Score</span>
                                </div>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-black rounded-full"
                                    style={{ width: `${int.score}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>{int.status}</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setRightPanel({
                                    isOpen: true,
                                    type: 'internship-details',
                                    title: int.title,
                                    data: int
                                  })}
                                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                  title="Sprint Tasks"
                                >
                                  <ExternalLink size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    toast.success(`Printing Offer Letter...`);
                                    window.print();
                                  }}
                                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                  title="Offer Letter"
                                >
                                  <Briefcase size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View More Internships Redirect Banner */}
              <div className="p-6 rounded-2xl bg-[#0B132B] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <Briefcase size={16} className="text-[#38BDF8]" />
                    <span>Explore More Industrial Internships</span>
                  </h3>
                  <p className="text-xs text-white/70">
                    Discover all 13 official Atideto industrial internship domains, certifications, and live commercial tracks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/upskill')}
                  className="px-5 py-2.5 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-500/30 shrink-0 cursor-pointer"
                >
                  <span>View More Internships</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 5: ATTENDANCE & TASKS CHECKLIST                               */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Attendance & Sprint Submissions</h1>
                  <p className="text-xs text-[#64748B]">Track daily attendance records, milestone tasks, and earn honor grade badges</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="attendance" defaultMode="list" />
                </div>
              </div>

              {renderPaneAnalytics('attendance')}

              {/* Attendance Summary (Strict 2-Color Minimal) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Sessions</span>
                  <div className="text-2xl font-black text-[#0F172A]">25 Lectures</div>
                  <p className="text-[11px] text-[#64748B]">24 Attended Live</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Attendance Ratio</span>
                  <div className="text-2xl font-black text-[#0F172A]">96.0%</div>
                  <p className="text-[11px] text-[#64748B]">Requirement: 80%</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Honors Eligibility</span>
                  <div className="text-2xl font-black text-[#0F172A]">Verified</div>
                  <p className="text-[11px] text-[#64748B]">Distinction Candidate</p>
                </div>
              </div>

              {/* Switchable Sprint Tasks View */}
              {getViewMode('attendance', 'list') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                          <th className="py-3 px-4">TYPE</th>
                          <th className="py-3 px-4">SCHEDULE & DURATION</th>
                          <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {studentTasks.map((t) => (
                          <tr
                            key={t.id}
                            onClick={() => toggleTaskComplete(t.id)}
                            className="hover:bg-[#F8FAFC] transition cursor-pointer"
                          >
                            <td className="py-3.5 px-4">
                              <span className={`font-bold text-sm block ${t.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'}`}>
                                {t.title}
                              </span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">
                                Batch: Task #{t.id}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                DELIVERABLE
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                              <span className="font-semibold block">Due: {t.due}</span>
                              <span className="text-[11px] text-[#64748B] block">Weekly Sprint</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 min-w-[110px]">
                                <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                  <span>{t.points}</span>
                                  <span className="text-[10px] text-[#64748B] font-normal">{t.completed ? '100%' : 'Pending'}</span>
                                </div>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-black rounded-full"
                                    style={{ width: t.completed ? '100%' : '0%' }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>{t.completed ? 'Completed' : 'Active'}</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <span className={`p-1.5 rounded-lg border transition ${
                                  t.completed 
                                    ? 'bg-[#000000] text-white border-black' 
                                    : 'bg-white text-[#64748B] border-[#E2E8F0]'
                                }`}>
                                  <CheckCircle2 size={13} />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskComplete(t.id)}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            Task #{t.id}
                          </span>
                          <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                            {t.completed ? 'Completed' : 'Active'}
                          </span>
                        </div>

                        <div>
                          <h4 className={`font-bold text-sm ${t.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'}`}>
                            {t.title}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">Due: {t.due}</p>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] flex justify-between text-xs">
                          <span className="text-[#64748B]">Weight:</span>
                          <span className="font-bold text-[#0F172A]">{t.points}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            t.completed
                              ? 'bg-white border border-[#E2E8F0] text-[#0F172A]'
                              : 'bg-[#000000] hover:bg-slate-800 text-white'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          <span>{t.completed ? 'Completed' : 'Mark Complete'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 6: VERIFIED CERTIFICATES                                      */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'certificates' && (() => {
            const verificationUrl = getVerificationUrl(studentProfile?.certId || 'ATD-INT-2026-0001');
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(verificationUrl)}`;

            // Admin Privilege Certificate Hold or Unissued Check
            if (studentProfile?.certHold || studentProfile?.certGenerated === false) {
              const isHold = Boolean(studentProfile?.certHold);
              return (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  <div className={`p-8 sm:p-12 rounded-3xl ${isHold ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 border-2 border-slate-300'} shadow-xl text-center space-y-5`}>
                    <div className={`w-20 h-20 mx-auto rounded-3xl ${isHold ? 'bg-amber-100 border border-amber-300 text-amber-600' : 'bg-slate-100 border border-slate-300 text-slate-800'} flex items-center justify-center shadow-inner`}>
                      {isHold ? <ShieldAlert size={42} /> : <Lock size={42} />}
                    </div>
                    
                    <div className="space-y-2">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${isHold ? 'bg-amber-200/80 text-amber-900 border border-amber-400' : 'bg-slate-200/80 text-slate-900 border border-slate-400'}`}>
                        {isHold ? 'Official Administrative Status: Held' : 'Official Administrative Status: Pending Admin Issuance'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
                        {isHold ? 'Credential Temporarily on Administrative Hold' : 'Internship In Progress — Certificate Awaiting Admin Verification'}
                      </h2>
                      <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
                        {isHold 
                          ? `Your completion certificate and official credentials for ${studentProfile?.domain || 'Cohort Program'} have been temporarily placed on administrative hold by the academic office.`
                          : `Initially, all enrolled candidates must fulfill program milestones and attendance requirements. Your certificate will be issued and verified directly by the Atideto administrator upon completion.`}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 max-w-lg mx-auto text-left space-y-3 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                        <CalendarCheck size={15} className="text-blue-600" />
                        <span>Current Attendance: {studentProfile?.attendance ?? 95}% (Updated with Admin)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Attendance is tracked and updated solely by the admin. Once your final attendance and project review are marked as complete by the administration, your credentials will automatically unlock here.
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>Record: {studentProfile?.certId || studentProfile?.studentId || 'ATD-INT-2026-0001'}</span>
                        <span className="text-slate-800 font-bold">Admin Clearance Required</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <ChevronRight size={14} className="rotate-180" />
                        <span>Return to Overview</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                        <Award size={18} />
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                        Verified Credentials & Certifications
                      </h1>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 font-medium">
                      Official digitally authenticated completion credentials • MSME UDYAM-TN-20-0242534 Verified
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFullViewModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                      title="Open Full Screen Popup View"
                    >
                      <Maximize2 size={14} />
                      <span>Show Full View</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintStudentCert}
                      className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Print Official Certificate"
                    >
                      <Printer size={14} className="text-[#0066FF]" />
                      <span>Print Certificate</span>
                    </button>

                    <button
                      type="button"
                      disabled={isExportingCert}
                      onClick={handleDownloadStudentCertPdf}
                      className="px-4 py-2 bg-[#000000] hover:bg-[#0066FF] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Download size={14} />
                      <span>Download Vector PDF</span>
                    </button>

                    <button
                      type="button"
                      disabled={isExportingCert}
                      onClick={handleDownloadStudentCertPng}
                      className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Download size={14} className="text-[#0066FF]" />
                      <span>300DPI PNG</span>
                    </button>

                    <a
                      href={verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink size={14} className="text-emerald-600" />
                      <span>Verify on Public Portal</span>
                    </a>
                  </div>
                </div>

                {/* Document Type Selector Tabs */}
                <div className="flex items-center gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => setStudentSelectedDoc('certificate')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      studentSelectedDoc === 'certificate' 
                        ? 'bg-[#000000] text-white shadow-xs' 
                        : 'bg-[#F1F5F9] text-slate-700 hover:bg-[#E2E8F0]'
                    }`}
                  >
                    <Award size={13} />
                    <span>Completion Certificate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentSelectedDoc('offer-letter')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      studentSelectedDoc === 'offer-letter' 
                        ? 'bg-[#000000] text-white shadow-xs' 
                        : 'bg-[#F1F5F9] text-slate-700 hover:bg-[#E2E8F0]'
                    }`}
                  >
                    <Briefcase size={13} />
                    <span>Offer Letter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentSelectedDoc('attendance')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      studentSelectedDoc === 'attendance' 
                        ? 'bg-[#000000] text-white shadow-xs' 
                        : 'bg-[#F1F5F9] text-slate-700 hover:bg-[#E2E8F0]'
                    }`}
                  >
                    <CalendarCheck size={13} />
                    <span>Attendance Certificate</span>
                  </button>
                </div>

                {/* Live Visual Certificate Canvas (Exact Ornate Design from System) */}
                <div ref={studentCertPreviewWrapperRef} className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span className="font-bold text-white">
                        {studentSelectedDoc === 'certificate' 
                          ? 'Live Official Visual Certificate' 
                          : studentSelectedDoc === 'attendance'
                          ? 'Official Certificate of Attendance'
                          : 'Official Internship Offer Letter'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({studentSelectedDoc === 'offer-letter' ? studentProfile?.offerNo || 'ZF/2026/INT/001' : studentProfile?.certId || 'AT-IC-MER-2026-0001'})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {isLandscape ? '1414×1000 Reference' : studentSelectedDoc === 'attendance' ? '850×1202 Reference' : '850×1277 Reference'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowFullViewModal(true)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Maximize2 size={12} />
                        <span>Show Full View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(verificationUrl);
                          toast.success('Copied verification URL to clipboard!');
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg"
                      >
                        <span>Share URL</span>
                        <Share2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Visual Certificate Card Frame */}
                  <div className="w-full overflow-x-auto pb-2 flex justify-center">
                    <div
                      style={{
                        width: `${Math.round(certBaseW * certEffScale)}px`,
                        height: `${Math.round(certBaseH * certEffScale)}px`,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
                        transition: 'width 0.12s ease-out, height 0.12s ease-out'
                      }}
                      className="shrink-0 bg-white"
                    >
                      {studentSelectedDoc === 'certificate' && (
                        <AuthenticCertificateCanvas
                          containerRef={studentCertRef}
                          data={{
                            name: studentProfile?.name || 'Suresh kumar D',
                            college: studentProfile?.college || 'Mahendra Engineering College',
                            id: studentProfile?.id || studentProfile?.studentId || 'AT-MEC-2027-01',
                            domain: studentProfile?.domain || 'Full stack web development',
                            startDate: studentProfile?.startDate || '2026-10-25',
                            endDate: studentProfile?.endDate || '2027-01-25',
                            duration: studentProfile?.duration || '3 Months',
                            issueDate: studentProfile?.issueDate || '2026-10-25',
                            certId: studentProfile?.certId || 'AT-IC-MER-2026-0001'
                          }}
                          qrCodeUrl={qrApiUrl}
                          scale={certEffScale}
                        />
                      )}

                      {studentSelectedDoc === 'offer-letter' && (
                        <AuthenticOfferLetterCanvas
                          containerRef={studentOfferRef}
                          data={{
                            studentName: studentProfile?.name || 'Suresh kumar D',
                            collegeName: studentProfile?.college || 'Mahendra Engineering College',
                            studentEmail: studentProfile?.email || 'sureshkumard706@gmail.com',
                            studentPhone: studentProfile?.phone || '+91 90473 33741',
                            domain: studentProfile?.domain || 'Full stack web development',
                            duration: studentProfile?.duration || '3 Months',
                            startDate: studentProfile?.startDate || '2026-10-25',
                            endDate: studentProfile?.endDate || '2027-01-25',
                            offerLetterNo: studentProfile?.offerNo || 'ZF/2026/INT/001',
                            issueDate: studentProfile?.issueDate || '2026-10-25',
                            salutation: 'Mr.',
                            mode: 'Offline'
                          }}
                          scale={certEffScale}
                        />
                      )}

                      {studentSelectedDoc === 'attendance' && (
                        <AuthenticAttendanceCertificateCanvas
                          containerRef={studentAttendanceRef}
                          data={{
                            studentName: studentProfile?.name || 'Suresh kumar D',
                            collegeName: studentProfile?.college || 'Mahendra Engineering College',
                            department: studentProfile?.degree || 'Department of Computer Science and Engineering',
                            registerNo: studentProfile?.id || studentProfile?.studentId || 'AT-MEC-2027-01',
                            domain: studentProfile?.domain || 'Full stack web development',
                            startDate: studentProfile?.startDate || '2026-10-25',
                            endDate: studentProfile?.endDate || '2027-01-25',
                            totalDays: 30,
                            presentDays: Math.round(30 * (studentProfile?.attendance || 93) / 100),
                            attendancePct: `${studentProfile?.attendance || 93.3}%`,
                            certId: `ATD/INT/2026/${(studentProfile?.id || '001').replace(/[^0-9]/g, '').slice(-3) || '001'}`,
                            issueDate: studentProfile?.issueDate || '2026-10-25'
                          }}
                          scale={certEffScale}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Comprehensive 8-Point Credential Dossier Grid */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      <h3 className="font-extrabold text-sm text-[#0F172A]">
                        Cryptographic Verification Dossier
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      100% Validated in Canonical Registry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Certificate ID</span>
                      <div className="font-mono font-bold text-[#0F172A]">{studentProfile?.certId || 'AT-IC-MER-2026-0001'}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">Immutable Record</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Student Registration ID</span>
                      <div className="font-mono font-bold text-[#0F172A]">{studentProfile?.id || 'AT-MEC-2027-01'}</div>
                      <span className="text-[10px] text-[#0066FF] font-semibold">1:1 Canonical ID</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">College / Institution</span>
                      <div className="font-bold text-[#0F172A] break-words">{studentProfile?.college || 'Mahendra Engineering College'}</div>
                      <span className="text-[10px] text-[#64748B]">{studentProfile?.degree || 'B.Tech IT'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Domain Specialization</span>
                      <div className="font-bold text-[#0066FF] break-words">{studentProfile?.domain || 'Full stack web development'}</div>
                      <span className="text-[10px] text-[#64748B]">{studentProfile?.duration || '3 Months'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Internship Period</span>
                      <div className="font-bold text-[#0F172A]">{studentProfile?.startDate || '25 Oct 2026'} - {studentProfile?.endDate || '25 Jan 2027'}</div>
                      <span className="text-[10px] text-[#64748B]">Industrial Milestone Defense</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Issuing Authority</span>
                      <div className="font-bold text-[#0F172A]">ATIDETO Technologies Inc.</div>
                      <span className="text-[10px] text-[#64748B]">Founder & MD Council</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Government MSME Reg No</span>
                      <div className="font-mono font-bold text-[#0F172A]">UDYAM-TN-20-0242534</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">Govt of India Verified</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#64748B]">Offer Letter Number</span>
                      <div className="font-mono font-bold text-slate-800">{studentProfile?.offerNo || 'ATIDETO/2026/INT/001'}</div>
                      <span className="text-[10px] text-[#0066FF] font-semibold">Dispatched & Signed</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 7: PAYMENT RECEIPTS & INVOICES                                */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 7: PAYMENT RECEIPTS & INVOICES                                */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'payments' && (() => {
            const feeTotalNum = parseInt((studentProfile?.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
            const feePaidNum = parseInt((studentProfile?.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
            const feeDueNum = Math.max(0, feeTotalNum - feePaidNum);
            const status = studentProfile?.paymentStatus || (feeTotalNum === 0 ? 'Pending Admin Decision' : feeDueNum === 0 ? 'Paid in Full' : feePaidNum > 0 ? 'Partial Paid' : 'Payment Due');
            const paidPercent = feeTotalNum > 0 ? Math.min(100, Math.round((feePaidNum / feeTotalNum) * 100)) : 0;
            const duePercent = Math.max(0, 100 - paidPercent);

            return (
              <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Payment Receipts & Invoices</h1>
                    <p className="text-xs text-[#64748B]">Official internship tuition receipts, payment clearance certificates, and tax invoices</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ViewSwitcher tab="payments" defaultMode="list" />
                    <button
                      type="button"
                      onClick={() => {
                        toast.success(`Printing Official GST Invoice Slip for ${studentProfile?.name || user.name}...`);
                        window.print();
                      }}
                      className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Download size={14} />
                      <span>Export Invoice</span>
                    </button>
                  </div>
                </div>

                {renderPaneAnalytics('student-payments')}

                {/* 3 Fee Summary Highlights (Strict 2-Color Minimal) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Internship Program Fee</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">{feeTotalNum > 0 ? `₹${feeTotalNum.toLocaleString('en-IN')}` : (studentProfile?.feeTotal || 'To Be Decided by Admin')}</div>
                    <p className="text-[11px] text-[#64748B]">Approved Academic Track</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Amount Paid</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">₹{feePaidNum.toLocaleString('en-IN')}</div>
                    <p className="text-[11px] text-[#64748B]">{paidPercent}% Paid • {status}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Due Balance</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                      ₹{feeDueNum.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-[#64748B]">{feeDueNum === 0 ? 'Zero Outstanding Balance' : `${duePercent}% Balance Due`}</p>
                  </div>
                </div>

                {/* Switchable Views */}
                {getViewMode('payments', 'list') === 'list' ? (
                  /* Minimal 2-Color Table (List View) */
                  <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                            <th className="py-3 px-4">TYPE</th>
                            <th className="py-3 px-4">SCHEDULE & DURATION</th>
                            <th className="py-3 px-4">FEE (₹)</th>
                            <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                            <th className="py-3 px-4">STATUS</th>
                            <th className="py-3 px-4 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          <tr className="hover:bg-[#F8FAFC] transition">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-sm text-[#0F172A] block">
                                {studentProfile?.domain || 'Full Stack Web Development'}
                              </span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">
                                Batch: {studentProfile?.id || 'AT-MEC-2027-01'} • Invoice #{studentProfile?.id ? `AT-INV-2026-${studentProfile.id.replace(/[^0-9]/g, '')}` : 'AT-INV-2026-9042'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                TUITION
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                              <span className="font-semibold block">{studentProfile?.duration || '3 Months'}</span>
                              <span className="text-[11px] text-[#64748B] block">Tax Invoice Cleared</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                              {feeTotalNum > 0 ? `₹${feeTotalNum.toLocaleString('en-IN')}` : (studentProfile?.feeTotal || 'To Be Decided by Admin')}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 min-w-[110px]">
                                <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                  <span>₹{feePaidNum.toLocaleString('en-IN')}</span>
                                  <span className="text-[10px] text-[#64748B] font-normal">{paidPercent}%</span>
                                </div>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-black rounded-full"
                                    style={{ width: `${paidPercent}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>{status}</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    toast.success(`Downloading Tax Invoice...`);
                                    window.print();
                                  }}
                                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                  title="Download Tax Invoice"
                                >
                                  <Download size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Small Icons / Card Box Grid (Grid View) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {studentProfile?.id ? `INV-${studentProfile.id.replace(/[^0-9]/g, '')}` : 'INV-9042'}
                          </span>
                          <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                            {status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">
                            {studentProfile?.domain || 'Full Stack Web Development'}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{studentProfile?.college || 'Engineering College'}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Total Fee:</span>
                            <span className="font-bold text-[#0F172A]">{feeTotalNum > 0 ? `₹${feeTotalNum.toLocaleString('en-IN')}` : (studentProfile?.feeTotal || 'To Be Decided by Admin')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Amount Paid:</span>
                            <span className="font-bold text-[#0F172A]">₹{feePaidNum.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Due Balance:</span>
                            <span className="font-bold text-[#0F172A]">₹{feeDueNum.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${paidPercent}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          onClick={() => {
                            toast.success(`Printing Official GST Invoice Slip for ${studentProfile?.name || user.name}...`);
                            window.print();
                          }}
                          className="w-full py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Download size={13} />
                          <span>Download Tax Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 9: STUDENT PROFILE                                            */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Student Profile & Academic Record</h1>
                <p className="text-xs text-[#64748B]">Personal details, verified university enrollment, and contact preferences</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-5 text-xs">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F1F5F9]">
                  <div className="w-16 h-16 rounded-full bg-[#000000] text-white text-2xl font-black flex items-center justify-center shadow-sm">
                    {(studentProfile?.name || user.name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0F172A]">{studentProfile?.name || user.name}</h3>
                    <p className="text-[#64748B] text-xs">{studentProfile?.email || user.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
                      Verified Enrolled Candidate • ID: {studentProfile?.id || 'AT-MEC-2027-01'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#0F172A]">Full Name</label>
                    <input
                      type="text"
                      key={`name-${studentProfile?.id}`}
                      defaultValue={studentProfile?.name || user.name}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0F172A]">Email Address</label>
                    <input
                      type="email"
                      disabled
                      key={`email-${studentProfile?.id}`}
                      defaultValue={studentProfile?.email || user.email}
                      className="w-full px-3 py-2 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0F172A]">University / College</label>
                    <input
                      type="text"
                      key={`col-${studentProfile?.id}`}
                      defaultValue={studentProfile?.college || 'Mahendra Engineering College'}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0F172A]">Degree & Graduation Year</label>
                    <input
                      type="text"
                      key={`deg-${studentProfile?.id}`}
                      defaultValue={`${studentProfile?.degree || 'B.Tech IT'} (${studentProfile?.gradYear || '2027'})`}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Profile preferences updated!')}
                  className="px-5 py-2.5 bg-[#000000] hover:bg-[#0066FF] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* RIGHT-SIDE SLIDE-OVER DRAWER (Complete Curriculum & Details)          */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {rightPanel.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl sm:max-w-2xl h-full bg-[#FFFFFF] border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 select-text"
          >
            
            {/* Drawer Top Header (Ref Image 2 Toolbar: Close, Link, Bookmark, More) */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setRightPanel({ ...rightPanel, isOpen: false })}
                  className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#64748B] hover:text-black transition cursor-pointer shrink-0"
                  title="Close Panel"
                >
                  <X size={18} />
                </button>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] block leading-tight">
                    {rightPanel.type === 'course-curriculum' || rightPanel.type === 'course-lecture' 
                      ? 'Academic Curriculum Blueprint' 
                      : rightPanel.type === 'certificate-viewer' 
                        ? 'Verifiable Credential' 
                        : 'Industrial Internship Roadmap'}
                  </span>
                  <h3 className="font-extrabold text-sm text-[#0F172A] truncate max-w-[240px] sm:max-w-md">
                    {rightPanel.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#64748B] shrink-0">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Curriculum link copied to clipboard!');
                  }}
                  className="p-1.5 hover:bg-[#F1F5F9] rounded-lg hover:text-black transition cursor-pointer"
                  title="Copy Link"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={() => toast.success('Bookmarked curriculum for offline study!')}
                  className="p-1.5 hover:bg-[#F1F5F9] rounded-lg hover:text-black transition cursor-pointer"
                  title="Bookmark"
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-xs">
              
              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE 1: COMPLETE WEBSITE CURRICULUM BLUEPRINT                 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {(rightPanel.type === 'course-curriculum' || rightPanel.type === 'course-lecture') && rightPanel.data && (() => {
                const cur = getCourseCurriculumDetails(rightPanel.data);
                if (!cur) return null;

                const totalLessons = cur.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
                const completedCount = cur.modules.reduce((acc: number, m: any) => {
                  return acc + m.lessons.filter((l: any) => completedLessonKeys[l.id]).length;
                }, 0);
                const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : (rightPanel.data?.progress || 85);

                const handleDownloadPDF = () => {
                  try {
                    const pdfModules: CurriculumModuleData[] = cur.modules.map((m: any) => ({
                      id: m.id,
                      title: `${m.week}: ${m.title}`,
                      duration: '1-2 Weeks',
                      summary: m.summary || `Comprehensive curriculum module covering ${m.title}.`,
                      lessons: m.lessons.map((l: any) => ({
                        title: l.title,
                        description: l.description || 'Hands-on practical lecture, source code walkthrough, and system architecture.'
                      }))
                    }));
                    generateCurriculumPDF(cur.title, cur.duration, cur.category, pdfModules);
                    toast.success('Official Atideto Curriculum PDF generated and downloaded!');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to generate PDF');
                  }
                };

                return (
                  <div className="space-y-6">
                    {/* 1. HERO BANNER */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white shadow-md space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0066FF] text-white">
                            {cur.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/20">
                            {cur.level}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#38BDF8] flex items-center gap-1">
                          <Clock size={12} /> {cur.duration}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-lg font-black tracking-tight text-white">{cur.title}</h2>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Mentor: <span className="text-white font-semibold">{cur.instructor}</span> • Atideto Academy
                        </p>
                      </div>

                      {/* Quick Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-[#94A3B8] block">Modules</span>
                          <span className="text-sm font-black text-white">{cur.modules.length}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-[#94A3B8] block">Lessons</span>
                          <span className="text-sm font-black text-white">{totalLessons}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-[#94A3B8] block">Rating</span>
                          <span className="text-sm font-black text-amber-300 flex items-center justify-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> 4.95
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-[#94A3B8]">Curriculum Completion</span>
                          <span className="text-[#38BDF8]">{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8] rounded-full transition-all duration-300" 
                            style={{ width: `${progressPercent}%` }} 
                          />
                        </div>
                      </div>

                      {/* Top Buttons: Download PDF & Mark Verified */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={handleDownloadPDF}
                          className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                        >
                          <Download size={14} />
                          <span>Download Curriculum (PDF)</span>
                        </button>
                        <button
                          onClick={() => {
                            toast.success('Curriculum milestone marked as completed & verified!');
                            setRightPanel({ ...rightPanel, isOpen: false });
                          }}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Sprint Verified</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. COMPETENCIES & TECHNOLOGIES MASTERED */}
                    <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                          Technologies & Tools Mastered
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cur.technologies.map((tech: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[10px] font-mono font-semibold text-[#0F172A]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9]">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                          Key Competencies Gained
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cur.skills.map((skill: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-800 flex items-center gap-1">
                              <Check size={10} className="text-emerald-600" /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 3. WEEK-BY-WEEK BLUEPRINT (ACCORDION - AS IN WEBSITE) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-widest text-[#0066FF] uppercase font-mono">
                            WEEK-BY-WEEK BLUEPRINT
                          </span>
                          <h3 className="font-extrabold text-sm text-[#0F172A] tracking-tight">
                            Curriculum Architecture
                          </h3>
                        </div>
                        <span className="text-[11px] text-[#64748B] font-medium">
                          {cur.modules.length} Modules
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {cur.modules.map((mod: any, mIdx: number) => {
                          const isExpanded = !!expandedModuleIdxs[mIdx];
                          return (
                            <div 
                              key={mod.id || mIdx}
                              className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs transition"
                            >
                              {/* Module Header Button */}
                              <button
                                onClick={() => toggleModuleAccordion(mIdx)}
                                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition cursor-pointer gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#000000] text-white shrink-0">
                                    {mod.week}
                                  </span>
                                  <span className="font-bold text-xs text-[#0F172A] truncate">
                                    {mod.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-[#94A3B8]">
                                    {mod.lessons.length} Lessons
                                  </span>
                                  <div className="p-1 rounded bg-[#F1F5F9] text-[#64748B]">
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </div>
                                </div>
                              </button>

                              {/* Module Body Content */}
                              {isExpanded && (
                                <div className="p-3.5 pt-1 border-t border-[#F1F5F9] bg-[#FAFAFA] space-y-3 text-xs">
                                  {/* Summary */}
                                  {mod.summary && (
                                    <p className="text-[11px] text-[#64748B] italic">
                                      {mod.summary}
                                    </p>
                                  )}

                                  {/* Lessons list with interactive checkboxes */}
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block">
                                      Included Lessons & Practical Labs:
                                    </span>
                                    {mod.lessons.map((les: any) => {
                                      const isDone = !!completedLessonKeys[les.id];
                                      return (
                                        <div
                                          key={les.id}
                                          onClick={() => toggleLessonCheck(les.id)}
                                          className={`p-2.5 rounded-lg border flex items-center justify-between transition cursor-pointer ${
                                            isDone
                                              ? 'bg-white border-emerald-300 text-[#64748B]'
                                              : 'bg-white border-[#E2E8F0] hover:border-[#0066FF] text-[#0F172A]'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                              isDone ? 'bg-emerald-600 text-white' : 'border border-[#CBD5E1]'
                                            }`}>
                                              {isDone ? <Check size={11} /> : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className={`font-semibold text-xs break-words ${isDone ? 'line-through text-[#94A3B8]' : ''}`}>
                                                {les.title}
                                              </p>
                                              {les.description && (
                                                <p className="text-[10px] text-[#94A3B8] break-words">
                                                  {les.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-mono text-[#64748B] shrink-0 ml-2">
                                            {les.duration}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Quizzes & Assignments */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {mod.quiz && (
                                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 flex items-center gap-2 text-[11px]">
                                        <CheckCircle2 size={13} className="text-amber-600 shrink-0" />
                                        <span className="break-words"><strong>Quiz:</strong> {mod.quiz}</span>
                                      </div>
                                    )}
                                    {mod.assignment && (
                                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center gap-2 text-[11px]">
                                        <Code2 size={13} className="text-[#0066FF] shrink-0" />
                                        <span className="break-words"><strong>Sprint:</strong> {mod.assignment}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. PRODUCTION CAPSTONE PROJECT (AS IN WEBSITE) */}
                    {cur.capstone && (
                      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#0066FF]">
                            INDUSTRY CAPSTONE DELIVERABLE
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-[#0F172A]">
                          {cur.capstone.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          {cur.capstone.deliverable}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-[#0066FF] border-t border-[#F1F5F9]">
                          <span>Commercial Code Review Defense</span>
                          <span>Atideto Technical Director</span>
                        </div>
                      </div>
                    )}

                    {/* 5. VERIFIABLE CERTIFICATE CREDENTIAL */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#0F172A]">{cur.certification}</h5>
                          <p className="text-[10px] text-[#64748B]">Issued upon 100% curriculum completion and capstone defense</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('certificates')}
                        className="px-3 py-1.5 rounded-lg bg-[#000000] hover:bg-[#0066FF] text-white text-[11px] font-bold transition shrink-0 cursor-pointer"
                      >
                        View Certificate
                      </button>
                    </div>

                  </div>
                );
              })()}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE 2: CERTIFICATE VIEWER PREVIEW                            */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'certificate-viewer' && (
                <div className="space-y-4 pt-2">
                  <h4 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">Official Verified Certificate</h4>
                  <div className="p-6 rounded-xl bg-white text-black space-y-4 border-2 border-[#0F172A] shadow-md relative">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <img src={atidetoLogoImg} alt="Atideto" className="h-7 w-auto object-contain" />
                      <span className="font-mono text-[10px] font-bold uppercase text-[#0066FF]">Digitally Authenticated</span>
                    </div>
                    <div className="text-center py-2 space-y-1.5">
                      <h3 className="font-serif text-lg font-black uppercase tracking-tight">Certificate of Accomplishment</h3>
                      <p className="text-[11px] text-gray-600">Presented to</p>
                      <h2 className="text-xl font-bold font-sans underline decoration-2">{user.name}</h2>
                      <p className="text-[11px] text-gray-700 max-w-sm mx-auto">
                        For successfully mastering advanced engineering cohorts in <b>{rightPanel.data?.domain || 'Artificial Intelligence'}</b>.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-[10px] font-mono text-gray-600">
                      <span>ID: {rightPanel.data?.id || 'ATD-INT-2026-0001'}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> 100% Validated
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0066FF]/20"
                  >
                    <Download size={15} />
                    <span>Download Official PDF Certificate</span>
                  </button>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE 3: INTERNSHIP DETAILS & SPRINT ROADMAP                   */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'internship-details' && (
                <div className="space-y-6">
                  {/* Full Width Top Action Button */}
                  <button
                    onClick={() => {
                      toast.success('Sprint milestone marked as completed and submitted!');
                      setRightPanel({ ...rightPanel, isOpen: false });
                    }}
                    className="w-full py-3 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark As Complete & Submit Deliverable</span>
                  </button>

                  {/* Attributes Grid Table */}
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-[#FFFFFF]">
                    <div className="grid grid-cols-3 p-3">
                      <span className="text-[#64748B] font-semibold">Status</span>
                      <div className="col-span-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
                          {rightPanel.data?.status || 'Active Industrial Track'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 p-3">
                      <span className="text-[#64748B] font-semibold">Duration & Cohort</span>
                      <div className="col-span-2">
                        <span className="font-bold text-[#0F172A]">{rightPanel.data?.duration || '3 Months'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 p-3">
                      <span className="text-[#64748B] font-semibold">Lead Mentor</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#000000] text-white text-[10px] font-black flex items-center justify-center">
                          K
                        </div>
                        <span className="font-bold text-[#0F172A]">{rightPanel.data?.mentor || 'Karthik Ramanathan (AI Lead)'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 p-3">
                      <span className="text-[#64748B] font-semibold">Tools & Tech</span>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {(rightPanel.data?.tools || ['React', 'Node.js', 'Express', 'MongoDB']).map((tool: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-mono text-[#0F172A]">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 p-3">
                      <span className="text-[#64748B] font-semibold">Area / Domain</span>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {(rightPanel.data?.area || ['Full Stack', 'Web Development']).map((a: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-medium text-[#475569]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core Deliverable Details */}
                  {rightPanel.data?.deliverables && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-[#0F172A]">Commercial Engineering Deliverables</h4>
                      <p className="text-xs text-[#475569] leading-relaxed p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        {rightPanel.data.deliverables}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 4-STEPPER REGISTRATION MODAL FOR REGISTERING COURSES / INTERNSHIPS */}
      <StepperRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        initialType="Internship"
        onSuccess={(newRecord) => {
          setInternships(prev => [{
            id: newRecord.applicationId,
            title: `${newRecord.selectedProgramTitle} Internship`,
            company: 'Atideto Technologies Labs',
            role: 'Associate Engineering Intern',
            duration: newRecord.duration,
            mentor: 'Atideto Senior Engineering Lead',
            stipend: 'Standard Cohort',
            status: 'Enrolled & Verified',
            score: 100,
            deliverables: 'Commercial Capstone Software & Milestone Defense',
            tools: ['Python', 'React', 'Docker'],
            area: ['Engineering', 'Hands-on', 'Capstone']
          }, ...prev]);
        }}
      />

      {/* Full-Screen Certificate Modal Popup */}
      <FullScreenCertificateModal
        isOpen={showFullViewModal}
        onClose={() => setShowFullViewModal(false)}
        docType={studentSelectedDoc}
        data={{
          name: studentProfile?.name || 'Suresh kumar D',
          college: studentProfile?.college || 'Mahendra Engineering College',
          id: studentProfile?.id || studentProfile?.studentId || 'AT-MEC-2027-01',
          domain: studentProfile?.domain || 'Full stack web development',
          startDate: studentProfile?.startDate || '2026-10-25',
          endDate: studentProfile?.endDate || '2027-01-25',
          duration: studentProfile?.duration || '3 Months',
          issueDate: studentProfile?.issueDate || '2026-10-25',
          certId: studentProfile?.certId || 'AT-IC-MER-2026-0001'
        }}
        offerLetterData={{
          studentName: studentProfile?.name || 'Suresh kumar D',
          collegeName: studentProfile?.college || 'Mahendra Engineering College',
          studentEmail: studentProfile?.email || 'sureshkumard706@gmail.com',
          studentPhone: studentProfile?.phone || '+91 90473 33741',
          domain: studentProfile?.domain || 'Full stack web development',
          duration: studentProfile?.duration || '3 Months',
          startDate: studentProfile?.startDate || '2026-10-25',
          endDate: studentProfile?.endDate || '2027-01-25',
          offerLetterNo: studentProfile?.offerNo || 'ZF/2026/INT/001',
          issueDate: studentProfile?.issueDate || '2026-10-25',
          salutation: 'Mr.',
          mode: 'Offline'
        }}
        attendanceData={{
          studentName: studentProfile?.name || 'Suresh kumar D',
          collegeName: studentProfile?.college || 'Mahendra Engineering College',
          department: studentProfile?.degree || 'Department of Computer Science and Engineering',
          registerNo: studentProfile?.id || studentProfile?.studentId || 'AT-MEC-2027-01',
          domain: studentProfile?.domain || 'Full stack web development',
          startDate: studentProfile?.startDate || '2026-10-25',
          endDate: studentProfile?.endDate || '2027-01-25',
          totalDays: 30,
          presentDays: Math.round(30 * (studentProfile?.attendance || 93) / 100),
          attendancePct: `${studentProfile?.attendance || 93.3}%`,
          certId: `ATD/INT/2026/${(studentProfile?.id || '001').replace(/[^0-9]/g, '').slice(-3) || '001'}`,
          issueDate: studentProfile?.issueDate || '2026-10-25'
        }}
        qrCodeUrl={getVerificationUrl(studentProfile?.certId || 'AT-IC-MER-2026-0001')}
      />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* APPLE / ANDROID NATIVE MOBILE BOTTOM NAVIGATION DOCK (md:hidden)      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#E2E8F0] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-safe safe-bottom flex items-center justify-around select-none"
      >
        {/* 1. Home / Overview */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 ${
            activeTab === 'overview'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'overview' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <LayoutDashboard size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Home</span>
        </button>

        {/* 2. Courses */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('courses');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 relative ${
            activeTab === 'courses'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition relative ${activeTab === 'courses' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <BookOpen size={19} />
            <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-black bg-[#0066FF] text-white flex items-center justify-center ring-2 ring-white">
              {enrolledCourses.length}
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Courses</span>
        </button>

        {/* 3. Internships */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('internships');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 relative ${
            activeTab === 'internships'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition relative ${activeTab === 'internships' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <Briefcase size={19} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Internship</span>
        </button>

        {/* 4. Certificates */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('certificates');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 ${
            activeTab === 'certificates'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'certificates' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <Award size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Certificates</span>
        </button>

        {/* 5. More / Menu Drawer */}
        <button
          type="button"
          onClick={() => setMobileMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 ${
            mobileMoreSheetOpen || activeTab === 'attendance' || activeTab === 'payments' || activeTab === 'profile'
              ? 'text-[#0066FF] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${mobileMoreSheetOpen || activeTab === 'attendance' || activeTab === 'payments' || activeTab === 'profile' ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'text-[#64748B]'}`}>
            <MoreHorizontal size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">More</span>
        </button>
      </nav>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* APPLE / ANDROID NATIVE SLIDE-UP ACTION SHEET / MOBILE DRAWER          */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {(mobileMenuOpen || mobileMoreSheetOpen) && (
        <div 
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[90vh] bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 pb-safe"
          >
            {/* Apple Drag Indicator */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Sheet Header: Student Card + Role Switch */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#000000] text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                  {(studentProfile?.name || user.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#0F172A] truncate">
                      {studentProfile?.name || user.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      Enrolled
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {studentProfile?.id || 'AT-MEC-2027-01'} • {studentProfile?.degree || 'Candidate'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer active:scale-95 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sheet Menu Items Grid / List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar text-xs font-semibold">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 block pt-1 pb-1">
                Academic & Records
              </span>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('overview');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'overview' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span>Dashboard Overview</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('courses');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'courses' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} />
                  <span>Enrolled Courses</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF] text-white">
                  {enrolledCourses.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('internships');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'internships' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={18} />
                  <span>Active Internships</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('attendance');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'attendance' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck size={18} />
                  <span>Attendance & Tasks</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {studentProfile?.attendance || 96}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('certificates');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'certificates' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award size={18} />
                  <span>Verified Credentials</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF]/10 text-[#0066FF]">
                  Verified
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('payments');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'payments' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet size={18} />
                  <span>Payment Receipts</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 block pt-3 pb-1">
                Account & Preferences
              </span>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                  navigate('/upskill');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-[#0066FF]" />
                  <span>Register New Program</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Upskill
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'profile' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span>Student Profile</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <div className="pt-2 pb-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign Out of Student Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponent for Student Sidebar Item (Matching Reference Image 2 Style)
function StudentSidebarItem({
  icon,
  label,
  count,
  badge,
  active,
  collapsed,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  count?: string;
  badge?: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
        active 
          ? 'bg-[#F1F5F9] text-[#000000] font-bold shadow-2xs' 
          : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
      }`}
    >
      <span className={active ? 'text-[#000000]' : 'text-[#64748B]'}>{icon}</span>
      {!collapsed && (
        <span className="flex-1 truncate tracking-tight text-xs">{label}</span>
      )}
      {!collapsed && count && (
        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${active ? 'bg-black text-white' : 'bg-[#E2E8F0] text-[#475569]'}`}>
          {count}
        </span>
      )}
      {!collapsed && badge && (
        <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 uppercase">
          {badge}
        </span>
      )}
    </button>
  );
}
