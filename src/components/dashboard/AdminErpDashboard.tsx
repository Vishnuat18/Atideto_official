import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  BookOpen,
  Award,
  Wallet,
  Settings as SettingsIcon,
  ChevronRight,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  CalendarCheck,
  LogOut,
  X,
  Link as LinkIcon,
  Bookmark,
  MoreHorizontal,
  Mail,
  Phone,
  BarChart2,
  Clock,
  Sparkles,
  Layers,
  Building2,
  Target,
  PhoneCall,
  CheckSquare,
  TrendingUp,
  LayoutDashboard,
  Bell,
  GraduationCap,
  ClipboardList,
  Briefcase,
  Printer,
  FileText,
  FileSpreadsheet,
  IndianRupee,
  FolderGit2,
  FileCheck2,
  ArrowUpRight,
  ChevronDown,
  MessageCircle,
  Globe,
  ExternalLink,
  Edit2,
  Database,
  Server,
  Terminal,
  Play,
  RefreshCw,
  HardDrive,
  Trash2,
  RotateCcw,
  Pencil,
  ShieldAlert,
  Check,
  ArrowRight,
  PieChart,
  BarChart3,
  Menu,
  ShieldCheck,
  LayoutGrid,
  List,
  Smartphone,
  Key,
  CreditCard,
  QrCode,
  Instagram,
  Facebook,
  Linkedin,
  Copy,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import atidetoWordmark from '@/assets/atideto/atideto.png';
import atidetoLogo from '@/assets/atideto/logo.png';
import { toast } from 'sonner';
import { 
  getDatabaseStatus, 
  executeSqlQuery, 
  getStudentsFromDb, 
  createStudentInDb, 
  updateStudentInDb,
  deleteStudentFromDb,
  getStaffFromDb,
  createStaffInDb,
  updateStaffInDb,
  deleteStaffInDb,
  getClientsFromDb,
  createClientInDb,
  updateClientInDb,
  deleteClientFromDb,
  getPaymentsFromDb,
  recordPaymentInDb,
  DbStatus, 
  SqlQueryResult 
} from '@/lib/api';
import { CertificateGeneratorDrawer } from './CertificateGeneratorDrawer';
import GraphicalRepresentationAnalytics from './GraphicalRepresentationAnalytics';
import { 
  getStoredStudents, 
  saveStoredStudents,
  updateStudentInRegistry,
  saveFinalizedPayment, 
  removeStudentFromRegistry,
  deleteStudentFromRegistry,
  getStoredClients,
  saveStoredClients,
  updateClientInRegistry,
  removeClientFromRegistry,
  getVerificationUrl, 
  toggleStudentCertificateHold,
  normalizeDomain,
  normalizeCollege,
  deduplicateAndMergeStudents,
  StudentCohortRecord 
} from '@/lib/certificateStore';

interface AdminErpProps {
  user: {
    uid?: string;
    name: string;
    email: string;
    role: string;
  };
  onSwitchToStudent?: () => void;
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
}

// Clean, unique ERP Tab Types matching User Request
export type AdminTab = 
  | 'overview'
  // STUDENTS
  | 'all-students'
  | 'registrations'
  | 'attendance'
  | 'internships'
  | 'reports'
  // FINANCE
  | 'student-payments'
  | 'client-payments'
  | 'company-expenses'
  | 'finance-payments'
  | 'billing'
  // CERTIFICATES
  | 'offer-letters'
  | 'cert-course'
  | 'cert-internship'
  | 'cert-attendance'
  | 'cert-project'
  | 'certificates'
  | 'document-generator'
  // COMPANY & COLLABORATORS
  | 'company-catalogue'
  | 'collaborators'
  | 'clients'
  | 'staff' // Founders & Employees
  // DATABASE & SETTINGS
  | 'database-operations'
  | 'database'
  | 'settings'
  | 'live-server'
  // SUPPORTING VIEWS
  | 'courses'
  | 'projects'
  | 'leads'
  | 'follow-ups'
  | 'tasks'
  | 'finance'
  | 'performance';

interface RightPanelState {
  isOpen: boolean;
  type: 
    | 'student-report' 
    | 'add-student' 
    | 'edit-student' 
    | 'crm-item' 
    | 'add-client'
    | 'edit-client'
    | 'add-staff'
    | 'edit-staff'
    | 'view-staff'
    | 'add-payment'
    | 'certificate-generator' 
    | 'offer-letter-generator'
    | 'attendance-generator'
    | 'course-edit'
    | 'internship-edit'
    | null;
  title: string;
  data?: any;
  mode?: 'certificate' | 'offer-letter' | 'attendance';
}

export default function AdminErpDashboard({ user, onSwitchToStudent, zoomLevel = 0.8, onZoomChange }: AdminErpProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
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
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsFilter, setAnalyticsFilter] = useState<'enrollments' | 'revenue' | 'distribution'>('enrollments');
  const [analyticsYear, setAnalyticsYear] = useState('Full Year (2026)');

  // Right-Side Slide-Over Panel State (Reference Image 2)
  const [rightPanel, setRightPanel] = useState<RightPanelState>({
    isOpen: false,
    type: 'student-report',
    title: ''
  });
  const [stepperStep, setStepperStep] = useState(1);

  // Founders & Employees State (7 Core Members seeded in MySQL)
  const [staffMembers, setStaffMembers] = useState<any[]>([
    { id: 4, emp_id: 'EMP-01', name: 'Sam Absihek', role: 'Founder', email: 'sam@atideto.in', phone: '+91 94432 10001', department: 'Executive Leadership', status: 'Active', assigned_students: 13 },
    { id: 5, emp_id: 'EMP-02', name: 'Neevas Nagil A R', role: 'Co-Founder', email: 'neevas@atideto.in', phone: '+91 94432 10002', department: 'Executive Leadership', status: 'Active', assigned_students: 13 },
    { id: 6, emp_id: 'EMP-03', name: 'Vishnu', role: 'CEO', email: 'vishnu@atideto.in', phone: '+91 94432 10003', department: 'Executive Leadership', status: 'Active', assigned_students: 13 },
    { id: 7, emp_id: 'EMP-04', name: 'Kiran', role: 'CPO', email: 'kiran@atideto.in', phone: '+91 94432 10004', department: 'Product Management', status: 'Active', assigned_students: 10 },
    { id: 8, emp_id: 'EMP-05', name: 'Yogesh', role: 'Full Stack Developer', email: 'yogesh@atideto.in', phone: '+91 94432 10005', department: 'Software Engineering', status: 'Active', assigned_students: 13 },
    { id: 9, emp_id: 'EMP-06', name: 'Sanjay', role: 'Editor & Designer', email: 'sanjay@atideto.in', phone: '+91 94432 10006', department: 'Design & Media', status: 'Active', assigned_students: 8 },
    { id: 10, emp_id: 'EMP-07', name: 'Sachin', role: 'Client Manager', email: 'sachin@atideto.in', phone: '+91 94432 10007', department: 'Client Operations & CRM', status: 'Active', assigned_students: 12 }
  ]);

  // Form states for Add/Edit Founders & Employees with Bank, UPI, and Socials
  const [staffForm, setStaffForm] = useState<{
    id: string;
    emp_id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    department: string;
    status: string;
    account_holder: string;
    account_no: string;
    ifsc_code: string;
    branch: string;
    upi_link: string;
    scanner_image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    portfolio: string;
    other_socials: Array<{ platform: string; url: string }>;
  }>({
    id: '',
    emp_id: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    department: 'Software Engineering',
    status: 'Active',
    account_holder: '',
    account_no: '',
    ifsc_code: '',
    branch: '',
    upi_link: '',
    scanner_image: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    portfolio: '',
    other_socials: []
  });

  const getPopulatedStaffForm = (member?: any) => {
    let parsedSocials: Array<{ platform: string; url: string }> = [];
    if (Array.isArray(member?.other_socials)) {
      parsedSocials = member.other_socials;
    } else if (typeof member?.other_socials === 'string' && member.other_socials.trim()) {
      try {
        const parsed = JSON.parse(member.other_socials);
        if (Array.isArray(parsed)) parsedSocials = parsed;
      } catch (err) {
        parsedSocials = [];
      }
    }

    return {
      id: member?.id ? String(member.id) : '',
      emp_id: member?.emp_id || (member ? '' : `EMP-0${staffMembers.length + 1}`),
      name: member?.name || '',
      role: member?.role || 'Team Member',
      email: member?.email || '',
      phone: member?.phone || '+91 94432 10000',
      department: member?.department || 'Software Engineering',
      status: member?.status || 'Active',
      account_holder: member?.account_holder || member?.accountHolder || '',
      account_no: member?.account_no || member?.accountNo || '',
      ifsc_code: member?.ifsc_code || member?.ifscCode || '',
      branch: member?.branch || '',
      upi_link: member?.upi_link || member?.upiLink || '',
      scanner_image: member?.scanner_image || member?.scannerImage || '',
      instagram: member?.instagram || '',
      facebook: member?.facebook || '',
      linkedin: member?.linkedin || '',
      portfolio: member?.portfolio || '',
      other_socials: parsedSocials
    };
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      toast.success(`Copied ${label} to clipboard!`);
    } else {
      toast.info(text);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('QR scanner image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setStaffForm(prev => ({ ...prev, scanner_image: result }));
        toast.success('Scanner QR code loaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const addOtherSocial = () => {
    setStaffForm(prev => ({
      ...prev,
      other_socials: [...prev.other_socials, { platform: '', url: '' }]
    }));
  };

  const updateOtherSocial = (index: number, field: 'platform' | 'url', val: string) => {
    setStaffForm(prev => {
      const nextSocials = [...prev.other_socials];
      nextSocials[index] = { ...nextSocials[index], [field]: val };
      return { ...prev, other_socials: nextSocials };
    });
  };

  const removeOtherSocial = (index: number) => {
    setStaffForm(prev => ({
      ...prev,
      other_socials: prev.other_socials.filter((_, i) => i !== index)
    }));
  };

  const [clientForm, setClientForm] = useState<any>({
    id: '',
    name: '',
    type: 'Corporate Client',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    project: 'Website cum ERP',
    mouStatus: 'Mou not signed',
    contractValue: '₹15,000',
    amountPaid: '₹8,000',
    balanceDue: '₹7,000',
    quotationAmount: 15000,
    receivedAmount: 8000,
    activeProjects: 1,
    pipelineStatus: 'In Progress',
    tools: ['Enterprise Software'],
    area: ['Technology']
  });

  const [editStudentForm, setEditStudentForm] = useState<any>({
    id: '',
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    domain: '',
    startDate: '',
    attendance: 95,
    score: 95,
    status: 'Verified Enrolled',
    feePaid: '₹0',
    feeTotal: 'To Be Decided by Admin'
  });

  // Finance Payments Ledger State (Real receipts only — no dummy data)
  const [paymentsList, setPaymentsList] = useState<any[]>([
    { 
      id: 'RCPT-ARX-01', 
      payer: 'Arrox Tech Company (praveenshakthi001@gmail.com)', 
      type: 'Website cum ERP — Advance Payment', 
      amount: '₹3,000', 
      method: 'UPI / Direct Bank Transfer', 
      status: 'Verified',
      date: '2026-10-10'
    },
    { 
      id: 'RCPT-ARX-02', 
      payer: 'Arrox Tech Company (praveenshakthi001@gmail.com)', 
      type: 'Website cum ERP — Milestone 1 Payment', 
      amount: '₹5,000', 
      method: 'UPI / Direct Bank Transfer', 
      status: 'Verified',
      date: '2026-10-20'
    },
    { 
      id: 'RCPT-MEC-BATCH', 
      payer: 'Institutional Student Cohort (MEC & MCE Class 2027)', 
      type: '21-Candidate Cohort Tuition Invoiced', 
      amount: '₹7,14,000', 
      method: 'Institutional NEFT', 
      status: 'Verified',
      date: '2026-10-25'
    }
  ]);

  const [paymentForm, setPaymentForm] = useState({
    id: 'INV-2026-091',
    payer: '',
    type: 'Milestone Sprint Payment',
    amount: '₹5,000',
    method: 'Wire Transfer',
    status: 'Cleared'
  });

  // Company Operational Expenses Ledger State
  const [expensesList, setExpensesList] = useState<any[]>([
    {
      id: 'EXP-2026-001',
      title: 'AWS & GCP Server Infrastructure & Cloud Hosting',
      category: 'Cloud Hosting',
      amount: '₹4,200',
      numericAmount: 4200,
      vendor: 'Amazon Web Services / Google Cloud',
      date: '2026-10-05',
      paymentMethod: 'Corporate Credit Card',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-002',
      title: 'Vercel Pro & Supabase Production Stack',
      category: 'Cloud Hosting',
      amount: '₹1,800',
      numericAmount: 1800,
      vendor: 'Vercel Inc. / Supabase',
      date: '2026-10-08',
      paymentMethod: 'Corporate Card',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-003',
      title: 'Domain & SSL Certs (atideto.com, atideto.in)',
      category: 'Domains & Security',
      amount: '₹1,499',
      numericAmount: 1499,
      vendor: 'GoDaddy / Namecheap',
      date: '2026-09-15',
      paymentMethod: 'UPI NetBanking',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-004',
      title: 'Google Workspace Enterprise Suite (Email & Storage)',
      category: 'Software Licenses',
      amount: '₹2,100',
      numericAmount: 2100,
      vendor: 'Google Cloud EMEA',
      date: '2026-10-12',
      paymentMethod: 'Auto-Debit',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-005',
      title: 'Technical Mentor Stipends & Guest Honorariums',
      category: 'Honorariums & Stipends',
      amount: '₹25,000',
      numericAmount: 25000,
      vendor: 'Industry Mentors & Guest Lecturers',
      date: '2026-10-18',
      paymentMethod: 'Direct Bank IMPS',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-006',
      title: 'Lab Networking, Hardware & Office Maintenance',
      category: 'Infrastructure & Lab',
      amount: '₹12,300',
      numericAmount: 12300,
      vendor: 'Local Facility Operations',
      date: '2026-10-22',
      paymentMethod: 'Direct Bank Transfer',
      status: 'Paid'
    }
  ]);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Cloud Hosting',
    amount: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI / Direct Bank',
    status: 'Paid'
  });

  // Company Catalogue and Collaborators Subtab State
  const [catalogueSubTab, setCatalogueSubTab] = useState<'software' | 'courses' | 'internships'>('software');
  const [collaboratorSubTab, setCollaboratorSubTab] = useState<'all' | 'academic' | 'industry' | 'government'>('all');

  // 21 Enrolled Cohort Students with Canonical IDs (15 MEC B.Tech IT + 6 MCE B.E. CSE)
  const [students, setStudents] = useState<any[]>(() => getStoredStudents());

  // Website Technical Courses Catalog (12 Core Tracks)
  const [coursesList, setCoursesList] = useState([
    { id: 'c-mern', title: 'Full Stack Web Development (MERN Stack)', instructor: 'Karthik Ramanathan (AI & Web Lead)', enrolled: 68, duration: '12 Weeks', modules: 16, category: 'Full Stack', tools: ['MongoDB', 'Express', 'React', 'Node.js'] },
    { id: 'c-java-fs', title: 'Full Stack Web Development (Java & Spring Boot)', instructor: 'Senior Java Architect', enrolled: 45, duration: '12 Weeks', modules: 18, category: 'Full Stack', tools: ['Java', 'Spring Boot', 'React', 'MySQL'] },
    { id: 'c-genai', title: 'Generative AI & LLM Systems Engineering', instructor: 'Karthik Ramanathan (AI Lead)', enrolled: 52, duration: '12 Weeks', modules: 16, category: 'AI & Data', tools: ['PyTorch', 'LangChain', 'LlamaIndex', 'Pinecone'] },
    { id: 'c-python', title: 'Python Programming & Backend Architecture', instructor: 'Lead Python Engineer', enrolled: 74, duration: '8 Weeks', modules: 12, category: 'Programming', tools: ['Python', 'Django', 'FastAPI', 'PostgreSQL'] },
    { id: 'c-nextjs', title: 'Next.js 15, React 19 & TypeScript Systems', instructor: 'Priya Sundaram (Staff Architect)', enrolled: 58, duration: '10 Weeks', modules: 14, category: 'Full Stack', tools: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind'] },
    { id: 'c-data-analytics', title: 'Data Analytics & Power BI Mastery', instructor: 'Lead Data Scientist', enrolled: 62, duration: '8 Weeks', modules: 12, category: 'AI & Data', tools: ['Python', 'SQL', 'Pandas', 'Power BI', 'Excel'] },
    { id: 'c-cloud-devops', title: 'Cloud-Native DevOps & Docker on GCP', instructor: 'Cloud Infrastructure Lead', enrolled: 38, duration: '8 Weeks', modules: 12, category: 'Cloud', tools: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'] },
    { id: 'c-uiux', title: 'UI / UX Design & Figma Masterclass', instructor: 'Principal Product Designer', enrolled: 42, duration: '6 Weeks', modules: 10, category: 'Design', tools: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems'] },
    { id: 'c-cyber', title: 'Cyber Security & Ethical Hacking', instructor: 'Certified Ethical Hacker (CEH)', enrolled: 31, duration: '8 Weeks', modules: 12, category: 'Security', tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'] },
    { id: 'c-mobile', title: 'Mobile App Development (Flutter & React Native)', instructor: 'Lead Mobile Architect', enrolled: 36, duration: '10 Weeks', modules: 14, category: 'Programming', tools: ['Flutter', 'Dart', 'React Native', 'Firebase'] },
    { id: 'c-core-java', title: 'Core Java & Object-Oriented Systems', instructor: 'Senior Java Mentor', enrolled: 80, duration: '6 Weeks', modules: 10, category: 'Programming', tools: ['Java 21', 'OOPs', 'Multithreading', 'Collections'] },
    { id: 'c-data-science', title: 'Data Science & Machine Learning Engineering', instructor: 'AI Research Lead', enrolled: 44, duration: '12 Weeks', modules: 16, category: 'AI & Data', tools: ['Python', 'Scikit-Learn', 'TensorFlow', 'NumPy'] }
  ]);

  // Website Internship Programs Catalog (13 Official Tracks)
  const [internshipsList, setInternshipsList] = useState([
    { id: 'fs-java', title: 'Full Stack Web Development (Java)', duration: '3 Months', category: 'Full Stack', mentor: 'Senior Java Architect', skills: ['Java', 'Spring Boot', 'React', 'MySQL'], description: 'Enterprise full stack applications with microservices and high scalability.' },
    { id: 'fs-mern', title: 'Full Stack Development (MERN Stack)', duration: '3 Months', category: 'Full Stack', mentor: 'Karthik Ramanathan', skills: ['MongoDB', 'Express', 'React', 'Node.js'], description: 'Build end-to-end commercial web apps with real-time sockets and cloud databases.' },
    { id: 'fs-mean', title: 'Full Stack Development (MEAN Stack)', duration: '3 Months', category: 'Full Stack', mentor: 'Staff Frontend Lead', skills: ['MongoDB', 'Express', 'Angular', 'Node.js'], description: 'Enterprise TypeScript and Angular architectural engineering.' },
    { id: 'web-dev', title: 'Web Development Internship', duration: 'Custom Duration', category: 'Programming', mentor: 'Priya Sundaram', skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'], description: 'Modern responsive client portals and interactive UI engineering.' },
    { id: 'python', title: 'Python Internship', duration: 'Custom Duration', category: 'Programming', mentor: 'Lead Python Engineer', skills: ['Python', 'Django', 'Flask', 'Automation'], description: 'Automated backend pipelines, web scraping, and API services.' },
    { id: 'core-java', title: 'Core Java', duration: 'Custom Duration', category: 'Programming', mentor: 'Java Mentor Lead', skills: ['OOPs', 'Data Structures', 'Multithreading'], description: 'Object-oriented software systems and algorithms.' },
    { id: 'data-science', title: 'Data Science Internship', duration: 'Custom Duration', category: 'AI & Data', mentor: 'AI Lead', skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'], description: 'Statistical modeling, predictive algorithms, and automated analytics.' },
    { id: 'data-analyst', title: 'Data Analyst Internship', duration: 'Custom Duration', category: 'AI & Data', mentor: 'BI Specialist', skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Tableau'], description: 'Business intelligence dashboards, KPI telemetry, and executive reporting.' },
    { id: 'digital-marketing', title: 'Digital Marketing Internship', duration: 'Custom Duration', category: 'Marketing', mentor: 'Growth Lead', skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'], description: 'Search engine optimization, paid ad funnels, and conversion analysis.' },
    { id: 'app-dev', title: 'App Development Internship', duration: 'Custom Duration', category: 'Programming', mentor: 'Mobile Lead', skills: ['Flutter', 'React Native', 'Android', 'iOS'], description: 'Cross-platform mobile apps published to Google Play and Apple App Store.' },
    { id: 'cyber-security', title: 'Cyber Security Internship', duration: 'Custom Duration', category: 'Security', mentor: 'Security Consultant', skills: ['Ethical Hacking', 'Network Security', 'Linux'], description: 'Vulnerability assessment, penetration testing, and defensive engineering.' },
    { id: 'cloud', title: 'Cloud & DevOps Internship', duration: 'Custom Duration', category: 'Cloud', mentor: 'DevOps Lead', skills: ['AWS', 'GCP', 'Docker', 'Kubernetes'], description: 'Containerized microservices and automated CI/CD cloud pipelines.' },
    { id: 'ui-ux', title: 'UI / UX Design Internship', duration: 'Custom Duration', category: 'Design', mentor: 'Principal UX Designer', skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems'], description: 'Human-centered user journeys, design systems, and clickable prototypes.' }
  ]);

  // Corporate CRM Accounts & Pipeline (Real accounts loaded from storage/DB; dummy clients removed)
  const [crmClients, setCrmClients] = useState<any[]>(() => getStoredClients());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setStudents(e.detail);
      }
    };
    const handleClientsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCrmClients(e.detail);
      }
    };
    window.addEventListener('atideto-students-updated', handleUpdate);
    window.addEventListener('atideto-clients-updated', handleClientsUpdate);
    return () => {
      window.removeEventListener('atideto-students-updated', handleUpdate);
      window.removeEventListener('atideto-clients-updated', handleClientsUpdate);
    };
  }, []);

  // ERP-wide Student Delete Handler (propagates across database, registrations, cache, and UI)
  const handleDeleteStudent = async (studentId: string, studentName?: string) => {
    const displayName = studentName || studentId;
    if (window.confirm(`Are you sure you want to delete student "${displayName}" (${studentId})?\n\nThis action will completely remove the student from the active cohort registry, registrations, certificates, and MySQL database across the entire ERP.`)) {
      deleteStudentFromRegistry(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId && s.studentId !== studentId));
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
      setRightPanel(prev => (prev.data?.id === studentId || prev.data?.studentId === studentId ? { isOpen: false, type: null, title: '' } : prev));
      try {
        await deleteStudentFromDb(studentId);
      } catch (e) {
        console.warn('MySQL delete student sync notice:', e);
      }
      toast.success(`Deleted ${displayName} across entire ERP`);
    }
  };

  // Workable Student Status Update Handler
  const handleUpdateStudentStatus = (studentId: string, newStatus: string) => {
    const updated = updateStudentInRegistry(studentId, { status: newStatus as any });
    setStudents(updated);
    toast.success(`Updated status to "${newStatus}" for ${studentId}`);
  };

  // Workable Student Registered Internship Details Update Handler (Start Date, End Date, Duration, Track)
  const handleUpdateStudentInternship = (studentId: string, updates: { domain?: string; startDate?: string; endDate?: string; duration?: string; status?: string }) => {
    const updated = updateStudentInRegistry(studentId, updates as any);
    setStudents(updated);
    toast.success(`Updated internship parameters for ${studentId}`);
  };

  // Company Expense Handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) {
      toast.error('Please enter expense title and amount');
      return;
    }
    const cleanNum = parseInt(expenseForm.amount.replace(/[^0-9]/g, ''), 10) || 0;
    const newExp = {
      id: `EXP-2026-00${expensesList.length + 1}`,
      title: expenseForm.title,
      category: expenseForm.category,
      amount: `₹${cleanNum.toLocaleString('en-IN')}`,
      numericAmount: cleanNum,
      vendor: expenseForm.vendor || 'Atideto Vendor',
      date: expenseForm.date,
      paymentMethod: expenseForm.paymentMethod,
      status: expenseForm.status
    };
    setExpensesList([newExp, ...expensesList]);
    setExpenseForm({
      title: '',
      category: 'Cloud Hosting',
      amount: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI / Direct Bank',
      status: 'Paid'
    });
    toast.success('Recorded company expense successfully!');
  };

  const handleDeleteExpense = (id: string, title: string) => {
    if (window.confirm(`Delete expense record "${title}"?`)) {
      setExpensesList(prev => prev.filter(x => x.id !== id));
      toast.success('Expense deleted from ledger');
    }
  };

  // Client Payment Delete Handler
  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm(`Delete receipt/payment record ${paymentId}?`)) {
      setPaymentsList(prev => prev.filter(p => p.id !== paymentId));
      toast.success(`Payment ${paymentId} deleted`);
    }
  };

  // Comprehensive Admin Filter States (Active across all tabs)
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCollege, setFilterCollege] = useState('All Colleges');
  const [filterDomain, setFilterDomain] = useState('All Domains');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterPayment, setFilterPayment] = useState('All Payments');
  const [filterAttendanceRate, setFilterAttendanceRate] = useState('All Rates');

  // Courses Catalog Filters
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('All Categories');

  // Internships Catalog Filters
  const [internshipSearch, setInternshipSearch] = useState('');
  const [internshipCategoryFilter, setInternshipCategoryFilter] = useState('All Categories');
  const [internshipDurationFilter, setInternshipDurationFilter] = useState('All Durations');

  // Corporate Clients Filters
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('All Statuses');
  const [clientIndustryFilter, setClientIndustryFilter] = useState('All Industries');

  // Staff / Employees Filters
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('All Departments');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All Statuses');

  // Finance Payments Filters
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeStatusFilter, setFinanceStatusFilter] = useState('All Statuses');
  const [financeMethodFilter, setFinanceMethodFilter] = useState('All Methods');

  // Certificate & Offer Letter Studio Filter States
  const [certSearch, setCertSearch] = useState('');
  const [certCollegeFilter, setCertCollegeFilter] = useState('All Colleges');
  const [certDomainFilter, setCertDomainFilter] = useState('All Domains');
  const [certDocTypeFilter, setCertDocTypeFilter] = useState<'all' | 'certificate' | 'offer-letter'>('all');
  const [certSortBy, setCertSortBy] = useState<'id' | 'name' | 'attendance' | 'score'>('id');

  // Bunch / Bulk Selection for Internship Payments
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkPaymentChoice, setBulkPaymentChoice] = useState<string>('Paid in Full');
  const [bulkPaymentAmount, setBulkPaymentAmount] = useState<string>('100% Full Paid');
  const [bulkTotalFeeChoice, setBulkTotalFeeChoice] = useState<string>('');

  // Helper for minimal two-color monochrome payment status badge styling (Black & White palette)
  const getPaymentBadgeClass = (status: string | undefined) => {
    const st = (status || 'Paid in Full').toLowerCase();
    if (st.includes('full') || (st.includes('paid') && !st.includes('partial') && !st.includes('not paid'))) {
      return 'bg-[#000000] text-white border-[#000000]';
    }
    if (st.includes('partial') || st.includes('installment') || st.includes('50%')) {
      return 'bg-[#F1F5F9] text-[#0F172A] border-[#CBD5E1]';
    }
    if (st.includes('waived') || st.includes('scholarship')) {
      return 'bg-white text-[#0F172A] border-[#94A3B8] border-dashed';
    }
    return 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
  };

  // State to toggle between Table (List) and Grid ("Small icons") view for each panel
  const [panelViewMode, setPanelViewMode] = useState<Record<string, 'list' | 'grid'>>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const initial = isMobile ? 'grid' : 'list';
    return {
      'all-students': initial,
      'registrations': initial,
      'courses': initial,
      'internships': initial,
      'attendance': initial,
      'clients': initial,
      'staff': initial,
      'reports': initial,
      'student-payments': initial,
      'finance-payments': initial,
      'billing': initial,
      'certificates': initial,
      'offer-letters': initial,
    };
  });

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
    'reports': true,
    'overview': true,
  });

  const togglePaneAnalytics = (tab: string) => {
    setAnalyticsExpandedPanes(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  const isPaneAnalyticsOpen = (tab: string) => !!analyticsExpandedPanes[tab];

  // Minimal Two-Color View Switcher (Small icons / List) matching reference + Analytic Insights Toggle
  const ViewSwitcher = ({ tab, defaultMode = 'list', hideAnalyticsToggle = false }: { tab: string; defaultMode?: 'list' | 'grid'; hideAnalyticsToggle?: boolean }) => {
    const currentMode = getViewMode(tab, defaultMode);
    const analyticsOpen = isPaneAnalyticsOpen(tab);

    return (
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="inline-flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shrink-0 select-none shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode(tab, 'grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
              currentMode === 'grid'
                ? 'bg-[#000000] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#0F172A] font-semibold'
            }`}
            title="Small icons (Grid card view)"
          >
            <LayoutGrid size={14} />
            <span>Small icons</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(tab, 'list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
              currentMode === 'list'
                ? 'bg-[#000000] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#0F172A] font-semibold'
            }`}
            title="List (Table view)"
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
            title="Toggle Graphical Analytic Insights (Ungrouped: Line, Bar, Pie | Grouped: Histogram, Polygon, Curve)"
          >
            <Layers size={14} />
            <span>Analytic Insights</span>
          </button>
        )}
      </div>
    );
  };

  const renderPaneAnalytics = (tab: string, forceOpen: boolean = false) => {
    if (!forceOpen && !isPaneAnalyticsOpen(tab)) return null;
    return (
      <div className="mb-5 animate-in fade-in-50 duration-200">
        <GraphicalRepresentationAnalytics
          currentPane={tab}
          students={students}
          courses={coursesList}
          internships={internshipsList}
          clients={crmClients}
          staff={staffMembers}
          payments={paymentsList}
          onClose={forceOpen ? undefined : () => togglePaneAnalytics(tab)}
        />
      </div>
    );
  };

  // Toggle single student selection
  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle all students selection
  const toggleSelectAllStudents = (currentList: any[]) => {
    if (selectedStudentIds.length === currentList.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(currentList.map(s => s.id));
    }
  };

  // Execute Bunch / Bulk Payment Update across selected students (Manual Text Supported)
  // partially means 50%, full paid means 100%, payment due means 0
  const handleBulkPaymentUpdate = async () => {
    if (selectedStudentIds.length === 0) {
      toast.error('Please select at least one student for bunch update');
      return;
    }

    const textStatus = bulkPaymentChoice.trim() || 'Paid in Full';
    const stLower = textStatus.toLowerCase();
    const isFull = stLower.includes('full') || stLower.includes('100%');
    const isPartial = stLower.includes('partial') || stLower.includes('50%');
    const isDue = stLower.includes('due') || stLower.includes('0%') || stLower.includes('pending');

    const updated = students.map(s => {
      if (selectedStudentIds.includes(s.id)) {
        const totalFeeToUse = bulkTotalFeeChoice.trim() || s.feeTotal || 'To Be Decided by Admin';
        const totalNum = parseInt(totalFeeToUse.replace(/[^0-9]/g, ''), 10) || 0;
        
        let calculatedPaid = bulkPaymentAmount.trim();
        if (isFull) {
          calculatedPaid = totalNum > 0 ? `₹${totalNum.toLocaleString('en-IN')}` : totalFeeToUse;
        } else if (isPartial) {
          calculatedPaid = `₹${(Math.round(totalNum * 0.5)).toLocaleString('en-IN')}`;
        } else if (isDue) {
          calculatedPaid = '₹0';
        } else if (calculatedPaid === '100% Full Paid') {
          calculatedPaid = totalNum > 0 ? `₹${totalNum.toLocaleString('en-IN')}` : totalFeeToUse;
        } else if (calculatedPaid === '50% Partially Paid') {
          calculatedPaid = `₹${(Math.round(totalNum * 0.5)).toLocaleString('en-IN')}`;
        } else if (!calculatedPaid) {
          calculatedPaid = s.feePaid || '₹0';
        }

        return {
          ...s,
          feeTotal: totalFeeToUse,
          paymentStatus: textStatus,
          feePaid: calculatedPaid
        };
      }
      return s;
    });

    setStudents(updated);

    // Persist to MySQL and Record Payment Receipts
    for (const sId of selectedStudentIds) {
      const target = updated.find(s => s.id === sId);
      if (target) {
        try {
          updateStudentInRegistry(sId, target);
          saveFinalizedPayment(sId, target.feePaid, target.feeTotal, target.paymentStatus);
          await updateStudentInDb(sId, target);
          await recordPaymentInDb({
            txnId: `TXN-BULK-${Date.now().toString().slice(-4)}-${sId.slice(-2)}`,
            studentName: target.name,
            amount: target.feePaid || '₹0',
            method: 'Admin Bulk Update',
            status: target.paymentStatus.toLowerCase().includes('due') || target.paymentStatus.toLowerCase().includes('pending') ? 'Pending' : 'Success',
            course: target.course || target.domain,
            date: '2026-10-22'
          });
        } catch (err) {
          console.warn('Sync bulk payment warning:', err);
        }
      }
    }

    // Cache locally for immediate cross-dashboard reflection
    saveStoredStudents(updated);

    toast.success(`Successfully updated payment to "${textStatus}" for ${selectedStudentIds.length} students!`);
    setSelectedStudentIds([]);
  };

  // Dynamic filter option lists with merged canonical options
  const availableColleges = ['All Colleges', ...Array.from(new Set(
    students.map(s => normalizeCollege(s.college)).filter(Boolean)
  )).sort()];
  
  const availableDomains = ['All Domains', ...Array.from(new Set(
    students.map(s => normalizeDomain(s.domain || s.course)).filter(Boolean)
  )).sort()];
  
  const availableStatuses = ['All Statuses', 'Verified Enrolled', 'Active Industrial Track', 'Completed'];
  const availablePayments = ['All Payments', 'Paid in Full', 'Partial Paid', 'Payment Due', 'Waived'];
  const availableAttendanceRates = ['All Rates', '100% Present', '>= 90% Regular', '< 90% Needs Attention'];

  // Global Filtered Students calculation matching all filter dropdowns
  const filteredStudents = students.filter(s => {
    const q = filterSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.college && normalizeCollege(s.college).toLowerCase().includes(q)) ||
      (s.domain && normalizeDomain(s.domain || s.course).toLowerCase().includes(q));
    
    const matchesCollege = filterCollege === 'All Colleges' || 
      normalizeCollege(s.college).toLowerCase() === normalizeCollege(filterCollege).toLowerCase();
    const matchesDomain = filterDomain === 'All Domains' || 
      normalizeDomain(s.domain || s.course).toLowerCase() === normalizeDomain(filterDomain).toLowerCase();
    const matchesStatus = filterStatus === 'All Statuses' || (s.status && s.status.toLowerCase() === filterStatus.toLowerCase());
    const matchesPayment = filterPayment === 'All Payments' || (s.paymentStatus && s.paymentStatus.toLowerCase() === filterPayment.toLowerCase());
    const matchesAttendance = filterAttendanceRate === 'All Rates' ||
      (filterAttendanceRate === '100% Present' && (s.attendance ?? 95) >= 100) ||
      (filterAttendanceRate === '>= 90% Regular' && (s.attendance ?? 95) >= 90) ||
      (filterAttendanceRate === '< 90% Needs Attention' && (s.attendance ?? 95) < 90);

    return matchesSearch && matchesCollege && matchesDomain && matchesStatus && matchesPayment && matchesAttendance;
  });

  // Filtered Courses Catalog
  const availableCourseCategories = Array.from(new Set(['All Categories', ...coursesList.map(c => c.category).filter(Boolean)]));
  const filteredCourses = coursesList.filter(c => {
    const q = courseSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      (c.instructor && c.instructor.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.tools && c.tools.some((t: string) => t.toLowerCase().includes(q)));
    const matchesCategory = courseCategoryFilter === 'All Categories' || (c.category && c.category.toLowerCase() === courseCategoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Filtered Internships Catalog
  const availableInternshipCategories = Array.from(new Set(['All Categories', ...internshipsList.map(i => i.category).filter(Boolean)]));
  const availableInternshipDurations = Array.from(new Set(['All Durations', ...internshipsList.map(i => i.duration).filter(Boolean)]));
  const filteredInternships = internshipsList.filter(i => {
    const q = internshipSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      i.title.toLowerCase().includes(q) ||
      (i.mentor && i.mentor.toLowerCase().includes(q)) ||
      (i.category && i.category.toLowerCase().includes(q)) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.skills && i.skills.some((s: string) => s.toLowerCase().includes(q)));
    const matchesCategory = internshipCategoryFilter === 'All Categories' || (i.category && i.category.toLowerCase() === internshipCategoryFilter.toLowerCase());
    const matchesDuration = internshipDurationFilter === 'All Durations' || (i.duration && i.duration.toLowerCase() === internshipDurationFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesDuration;
  });

  // Filtered Corporate Clients
  const availableClientStatuses = Array.from(new Set(['All Statuses', ...crmClients.map(c => c.mouStatus).filter(Boolean)]));
  const availableClientIndustries = Array.from(new Set(['All Industries', ...crmClients.map(c => c.industry).filter(Boolean)]));
  const filteredClients = crmClients.filter(c => {
    const q = clientSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q));
    const matchesStatus = clientStatusFilter === 'All Statuses' || (c.mouStatus && c.mouStatus.toLowerCase() === clientStatusFilter.toLowerCase());
    const matchesIndustry = clientIndustryFilter === 'All Industries' || (c.industry && c.industry.toLowerCase() === clientIndustryFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  // Filtered Staff / Employees
  const availableStaffDepts = Array.from(new Set(['All Departments', ...staffMembers.map(m => m.department).filter(Boolean)]));
  const availableStaffStatuses = Array.from(new Set(['All Statuses', ...staffMembers.map(m => m.status).filter(Boolean)]));
  const filteredStaff = staffMembers.filter(m => {
    const q = staffSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      (m.role && m.role.toLowerCase().includes(q)) ||
      (m.emp_id && m.emp_id.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.department && m.department.toLowerCase().includes(q));
    const matchesDept = staffDeptFilter === 'All Departments' || (m.department && m.department.toLowerCase() === staffDeptFilter.toLowerCase());
    const matchesStatus = staffStatusFilter === 'All Statuses' || (m.status && m.status.toLowerCase() === staffStatusFilter.toLowerCase());
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Filtered Finance Payments Ledger
  const availableFinanceStatuses = Array.from(new Set(['All Statuses', ...paymentsList.map(p => p.status).filter(Boolean)]));
  const availableFinanceMethods = Array.from(new Set(['All Methods', ...paymentsList.map(p => p.method).filter(Boolean)]));
  const filteredFinancePayments = paymentsList.filter(p => {
    const q = financeSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      p.id.toLowerCase().includes(q) ||
      p.payer.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.amount.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q);
    const matchesStatus = financeStatusFilter === 'All Statuses' || (p.status && p.status.toLowerCase() === financeStatusFilter.toLowerCase());
    const matchesMethod = financeMethodFilter === 'All Methods' || (p.method && p.method.toLowerCase() === financeMethodFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Reusable Enterprise Filter Bar rendered across all dashboard tabs
  const renderFilterBar = (options?: { showDomain?: boolean; showStatus?: boolean; showPayment?: boolean; showCollege?: boolean; showAttendanceRate?: boolean; countLabel?: string }) => {
    const showCollege = options?.showCollege !== false;
    const showDomain = options?.showDomain !== false;
    const showStatus = options?.showStatus !== false;
    const showPayment = options?.showPayment !== false;
    const showAttendanceRate = options?.showAttendanceRate === true;
    const isFiltered = filterSearch || filterCollege !== 'All Colleges' || filterDomain !== 'All Domains' || filterStatus !== 'All Statuses' || filterPayment !== 'All Payments' || filterAttendanceRate !== 'All Rates';

    return (
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Search by name, email, roll no, or phone..."
              className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 shadow-2xs font-medium"
            />
            {filterSearch && (
              <button 
                type="button"
                onClick={() => setFilterSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear Search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* College Filter */}
          {showCollege && (
            <div className="w-full sm:w-auto min-w-[170px]">
              <div className="relative">
                <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select
                  value={filterCollege}
                  onChange={(e) => setFilterCollege(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer appearance-none"
                >
                  {availableColleges.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          )}

          {/* Domain / Specialization Filter */}
          {showDomain && (
            <div className="w-full sm:w-auto min-w-[170px]">
              <div className="relative">
                <Target className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer appearance-none"
                >
                  {availableDomains.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          )}

          {/* Status Filter */}
          {showStatus && (
            <div className="w-full sm:w-auto min-w-[140px]">
              <div className="relative">
                <CheckSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer appearance-none"
                >
                  {availableStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          )}

          {/* Payment Status Filter */}
          {showPayment && (
            <div className="w-full sm:w-auto min-w-[140px]">
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer appearance-none"
                >
                  {availablePayments.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          )}

          {/* Attendance Rate Filter */}
          {showAttendanceRate && (
            <div className="w-full sm:w-auto min-w-[160px]">
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <select
                  value={filterAttendanceRate}
                  onChange={(e) => setFilterAttendanceRate(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer appearance-none"
                >
                  {availableAttendanceRates.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>
          )}

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setFilterSearch('');
                setFilterCollege('All Colleges');
                setFilterDomain('All Domains');
                setFilterStatus('All Statuses');
                setFilterPayment('All Payments');
                setFilterAttendanceRate('All Rates');
              }}
              className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Counter telemetry */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <b>{filteredStudents.length}</b> of <b>{students.length}</b> {options?.countLabel || 'registered candidates'}</span>
          {isFiltered && <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Filtered View Active</span>}
        </div>
      </div>
    );
  };

  // Bulk / Bunch Payment Action Bar (Manual Text Editable)
  const renderBulkPaymentBar = () => {
    if (selectedStudentIds.length === 0) return null;
    return (
      <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-3 animate-in fade-in slide-in-from-top duration-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {selectedStudentIds.length}
            </span>
            <div>
              <span className="text-xs font-black text-slate-900 block">
                {selectedStudentIds.length} Student{selectedStudentIds.length > 1 ? 's' : ''} Selected for Bunch Payment Update
              </span>
              <span className="text-[11px] text-slate-600">
                Bulk update internship tuition and clearance status manually by text
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkPaymentUpdate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Apply Bunch Update ({selectedStudentIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStudentIds([])}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Manual Text Inputs & Preset Pills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-2 border-t border-blue-200/60">
          {/* 1. Total Program Fee (Manual Text) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-slate-600">Total Program Fee (Manual Text)</label>
              <span className="text-[10px] font-semibold text-slate-400">Optional Override</span>
            </div>
            <input
              type="text"
              value={bulkTotalFeeChoice}
              onChange={(e) => setBulkTotalFeeChoice(e.target.value)}
              placeholder="Keep current (or e.g. ₹1,000, ₹700, ₹0)"
              className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['₹1,000', '₹700', '₹650', '₹500', '₹0'].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBulkTotalFeeChoice(amt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                    bulkTotalFeeChoice === amt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Payment Status (Manual Text) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-slate-600">Payment Status (Manual Text)</label>
              <span className="text-[10px] font-semibold text-blue-600">100% • 50% • 0%</span>
            </div>
            <input
              type="text"
              value={bulkPaymentChoice}
              onChange={(e) => setBulkPaymentChoice(e.target.value)}
              placeholder="e.g. Paid in Full, Partial Paid, Payment Due, etc."
              className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Paid in Full', ratioText: 'Full Paid (100%)', amt: '100% Full Paid' },
                { label: 'Partial Paid', ratioText: 'Partially (50%)', amt: '50% Partially Paid' },
                { label: 'Payment Due', ratioText: 'Payment Due (0%)', amt: '₹0' },
                { label: 'Waived', ratioText: 'Waived', amt: '100% Waived' }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setBulkPaymentChoice(preset.label);
                    setBulkPaymentAmount(preset.amt);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                    bulkPaymentChoice === preset.label
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.ratioText}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tuition Amount Paid (Manual Text) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-slate-600">Amount Paid (Manual Text)</label>
              <span className="text-[10px] font-semibold text-slate-400">Custom / Ratio</span>
            </div>
            <input
              type="text"
              value={bulkPaymentAmount}
              onChange={(e) => setBulkPaymentAmount(e.target.value)}
              placeholder="e.g. 100% Full Paid, 50% Partially Paid, ₹0"
              className="w-full px-3 py-2 rounded-xl bg-white border border-blue-300 text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['100% Full Paid', '50% Partially Paid', '₹1,000', '₹700', '₹500', '₹0'].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBulkPaymentAmount(amt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                    bulkPaymentAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Editable Course Start Date Function
  const updateStudentStartDate = (studentId: string, newDate: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, startDate: newDate } : s));
    if (rightPanel.data?.id === studentId) {
      setRightPanel(prev => ({
        ...prev,
        data: { ...prev.data, startDate: newDate }
      }));
    }
    toast.success(`Course start date updated to ${newDate}!`);
  };

  // Employee Tasks
  const [tasks, setTasks] = useState([
    { id: 'TSK-101', title: 'Review Code Submissions for Student Cohort', assignee: 'Karthik Ramanathan', priority: 'High', status: 'In Progress', due: 'Today' },
    { id: 'TSK-102', title: 'Deploy Student Attendance Sync Lambda to Cloud', assignee: 'Vishnu R.', priority: 'Medium', status: 'In Progress', due: 'Tomorrow' },
    { id: 'TSK-103', title: 'Audit Spring Boot Capstone Code Submissions', assignee: 'Priya Sundaram', priority: 'High', status: 'In Progress', due: '23 Oct' },
    { id: 'TSK-104', title: 'Dispatch Official Offer Letters for Class 2027', assignee: 'Atideto Labs Coordinator', priority: 'Low', status: 'Completed', due: '20 Oct' }
  ]);

  // Generator State
  const [genForm, setGenForm] = useState({
    candidateName: 'V.Nithish kumar',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    domain: 'Full stack Web Development',
    duration: '3 Months (Oct 2026 - Jan 2027)',
    certId: 'ATIDETO-CERT-2026-MEC01',
    issueDate: '2026-10-21',
    stipend: 'Standard Industrial Cohort',
    evalScore: '95/100 (Exemplary Distinction)'
  });

  // New Student Enrollment Form State
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    domain: 'Full stack Web Development',
    startDate: '25 Oct 2026',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    feePaid: '₹0',
    feeTotal: 'To Be Decided by Admin',
    paymentStatus: 'Pending Admin Decision'
  });

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim()) {
      toast.error('Please enter the student full name');
      return;
    }
    const newId = `AT-MEC-2027-${String(students.length + 1).padStart(2, '0')}`;
    const newRecord = {
      id: newId,
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim() || `${newStudentForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      phone: newStudentForm.phone.trim() || '+91 98000 00000',
      college: newStudentForm.college,
      degree: newStudentForm.degree,
      gradYear: newStudentForm.gradYear,
      course: newStudentForm.domain,
      domain: newStudentForm.domain,
      startDate: newStudentForm.startDate || '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: newStudentForm.mentor,
      attendance: 100,
      score: 95,
      enrolled: '2026-10-21',
      feePaid: newStudentForm.feePaid || '₹0',
      feeTotal: newStudentForm.feeTotal || 'To Be Decided by Admin',
      paymentStatus: newStudentForm.paymentStatus || 'Pending Admin Decision',
      tools: newStudentForm.domain.toLowerCase().includes('data') 
        ? ['Python', 'SQL', 'Power BI', 'Pandas'] 
        : ['React', 'Node.js', 'Express', 'MongoDB'],
      area: newStudentForm.domain.toLowerCase().includes('data') 
        ? ['Data Analytics', 'BI Dashboards'] 
        : ['Full Stack', 'Web Development']
    };

    setStudents(prev => [newRecord, ...prev]);
    toast.success(`Candidate ${newRecord.name} successfully registered into ERP Cohort!`);
    
    // Automatically persist to MySQL Database atideto
    createStudentInDb(newRecord).catch(() => {});

    setRightPanel({
      isOpen: true,
      type: 'student-report',
      title: `Student Dossier: ${newRecord.name}`,
      data: newRecord
    });
    setNewStudentForm({
      name: '',
      email: '',
      phone: '',
      college: 'Mahendra Engineering College',
      degree: 'B.Tech Information Technology',
      gradYear: '2027',
      domain: 'Full stack Web Development',
      startDate: '25 Oct 2026',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      feePaid: '₹0',
      feeTotal: 'To Be Decided by Admin',
      paymentStatus: 'Pending Admin Decision'
    });
  };

  // ──────────────────────────────────────────────────────────────────────────
  // MYSQL 8.0 LIVE DATABASE SUITE STATE & OPERATIONS (localhost:3306 / atideto)
  // ──────────────────────────────────────────────────────────────────────────
  const [dbStatus, setDbStatus] = useState<DbStatus | null>({
    connected: true,
    host: 'localhost:3306',
    database: 'atideto',
    user: 'root',
    tablesCount: 11,
    tables: [
      { name: 'students', rowCount: 21 },
      { name: 'users', rowCount: 29 },
      { name: 'registrations', rowCount: 3 },
      { name: 'courses', rowCount: 4 },
      { name: 'internships', rowCount: 3 },
      { name: 'staff', rowCount: 3 },
      { name: 'clients', rowCount: 3 },
      { name: 'tasks', rowCount: 4 },
      { name: 'certificates', rowCount: 3 },
      { name: 'payments', rowCount: 4 },
      { name: 'system_settings', rowCount: 6 }
    ],
    version: 'MySQL 8.0 Community'
  });
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT student_id, name, email, phone, college, course, status, mentor FROM students;');
  const [sqlResult, setSqlResult] = useState<SqlQueryResult | null>(null);
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);
  const [selectedDbTable, setSelectedDbTable] = useState<string>('students');

  const refreshDbStatus = async () => {
    toast.loading('Checking MySQL localhost:3306 connection...');
    const status = await getDatabaseStatus();
    toast.dismiss();
    if (status && status.connected) {
      setDbStatus(status);
      toast.success(`MySQL connected! ${status.tablesCount} tables active in database "atideto".`);
    } else {
      toast.error('MySQL connection check returned offline.');
    }
  };

  const handleExecuteSql = async (customQuery?: string) => {
    const q = (customQuery || sqlQuery).trim();
    if (!q) {
      toast.error('Please enter an SQL query to execute');
      return;
    }
    setSqlLoading(true);
    try {
      const res = await executeSqlQuery(q);
      setSqlLoading(false);
      setSqlResult(res);
      if (res.success) {
        const isMutation = /^(INSERT|UPDATE|DELETE|ALTER|DROP|CREATE|TRUNCATE|REPLACE)\b/i.test(q);
        if (isMutation) {
          toast.success(`Query executed successfully! (${res.rowCount || res.affectedRows || 1} rows affected)`);
          
          // Instantly sync live state & persistent local storage from DB
          const refreshedStudents = await getStudentsFromDb();
          if (refreshedStudents && Array.isArray(refreshedStudents)) {
            setStudents(prev => {
              const combined = deduplicateAndMergeStudents([...refreshedStudents, ...prev]);
              saveStoredStudents(combined);
              return combined;
            });
          }

          const refreshedClients = await getClientsFromDb();
          if (refreshedClients && Array.isArray(refreshedClients)) {
            setCrmClients(refreshedClients);
            saveStoredClients(refreshedClients);
          }

          const refreshedStaff = await getStaffFromDb();
          if (refreshedStaff && Array.isArray(refreshedStaff)) {
            setStaffMembers(refreshedStaff);
          }

          const refreshedPayments = await getPaymentsFromDb();
          if (refreshedPayments && Array.isArray(refreshedPayments)) {
            setPaymentsList(refreshedPayments);
          }

          const status = await getDatabaseStatus();
          if (status) setDbStatus(status);
        } else {
          toast.success(`Query executed successfully! (${res.rowCount} rows returned)`);
        }
      } else {
        toast.error(`SQL Error: ${res.error || 'Failed to execute query'}`);
      }
    } catch (e: any) {
      setSqlLoading(false);
      toast.error(`Error: ${e.message}`);
    }
  };

  // Synchronize on mount: fetch live MySQL status, students, clients, staff, and run default query
  useEffect(() => {
    getDatabaseStatus().then(status => {
      if (status) setDbStatus(status);
    });

    getStudentsFromDb().then(dbStudents => {
      if (dbStudents && Array.isArray(dbStudents) && dbStudents.length > 0) {
        setStudents(prev => {
          const combined = deduplicateAndMergeStudents([...dbStudents, ...prev]);
          saveStoredStudents(combined);
          return combined;
        });
      }
    });

    getClientsFromDb().then(dbClients => {
      if (dbClients && Array.isArray(dbClients)) {
        setCrmClients(dbClients);
        saveStoredClients(dbClients);
      }
    });

    getStaffFromDb().then(dbStaff => {
      if (dbStaff && dbStaff.length > 0) {
        setStaffMembers(dbStaff);
      }
    });

    getPaymentsFromDb().then(dbPayments => {
      if (dbPayments && dbPayments.length > 0) {
        setPaymentsList(dbPayments);
      }
    });

    executeSqlQuery('SELECT student_id, name, email, phone, college, course, status FROM students;').then(res => {
      if (res && res.success) setSqlResult(res);
    });
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('atideto_sql_user');
    localStorage.removeItem('atideto_dashboard_mode');
    await signOut(auth);
    window.dispatchEvent(new Event('atideto_auth_change'));
    navigate('/login');
  };

  return (
    <div 
      data-slot="dashboard"
      className="w-full h-full overflow-hidden flex flex-col antialiased bg-[#F8FAFC] text-[#0F172A] font-sans"
    >
      
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TOP ERP HEADER BAR (Reference Image 2 Company Style)                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TOP ERP HEADER BAR (Apple / Android Native App Bar Style)             */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] px-3 sm:px-6 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        
        {/* Left: Mobile Drawer Trigger + Brand Logo & Badge */}
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 hidden sm:inline-block">
                Admin ERP
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#64748B] pl-4 border-l border-[#E2E8F0]">
            <span className="text-black font-semibold">Admin</span>
            <ChevronRight size={13} className="text-[#94A3B8]" />
            <span className="font-bold text-[#0066FF] capitalize">
              {activeTab === 'overview' ? 'Overview' : activeTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Right: Date + Switch to Student Portal + Main Website + Notification + Admin User Badge */}
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

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#64748B] font-medium pr-1">
            <Calendar size={13} className="text-[#0066FF]" />
            <span>Wednesday, 21 Oct 2026</span>
          </div>

          <button 
            title="Notifications" 
            className="p-2 rounded-full hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition relative cursor-pointer active:scale-95"
          >
            <Bell size={17} />
            <span className="w-2 h-2 rounded-full bg-[#0066FF] absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* User Profile Badge (Exact Reference Image 2) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 sm:border-l sm:border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="w-8 h-8 rounded-full bg-[#000000] text-white font-black text-xs flex items-center justify-center shadow-sm cursor-pointer active:scale-95 hover:ring-2 hover:ring-[#0066FF]/20 transition"
              title="ERP Settings"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </button>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <p className="font-bold text-[#0F172A] leading-none truncate max-w-[120px]">{user.name || 'Atideto Admin'}</p>
              <p className="text-[#64748B] text-[10px] mt-0.5 font-medium">Enterprise ERP</p>
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
            
            {/* Top Active Dashboard Tab (Rounded Dark Pill) */}
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

            {/* 1. CATEGORY: STUDENTS (Reference Image 2) */}
            <div className="pt-3 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Students
                </span>
              )}
            </div>

            <SidebarItem 
              icon={<GraduationCap size={16} />} 
              label="All Students" 
              active={activeTab === 'all-students'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('all-students')} 
            />
            <SidebarItem 
              icon={<ClipboardList size={16} />} 
              label="Registrations" 
              active={activeTab === 'registrations'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('registrations')} 
            />
            <SidebarItem 
              icon={<CalendarCheck size={16} />} 
              label="Attendance" 
              active={activeTab === 'attendance'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('attendance')} 
            />
            <SidebarItem 
              icon={<Briefcase size={16} />} 
              label="Internships" 
              active={activeTab === 'internships'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('internships')} 
            />
            <SidebarItem 
              icon={<BarChart2 size={16} />} 
              label="Reports" 
              active={activeTab === 'reports'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('reports')} 
            />
            {/* 2. CATEGORY: CERTIFICATES (Reference Image 2) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Certificates
                </span>
              )}
            </div>

            <SidebarItem 
              icon={<FileText size={16} />} 
              label="Offer Letter" 
              active={activeTab === 'offer-letters'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('offer-letters')} 
            />
            <SidebarItem 
              icon={<Award size={16} />} 
              label="Course Completion" 
              active={activeTab === 'cert-course'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('cert-course')} 
            />
            <SidebarItem 
              icon={<CheckSquare size={16} />} 
              label="Internship Completion" 
              active={activeTab === 'cert-internship'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('cert-internship')} 
            />
            <SidebarItem 
              icon={<CalendarCheck size={16} />} 
              label="Attendance Certificate" 
              active={activeTab === 'cert-attendance'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('cert-attendance')} 
            />
            <SidebarItem 
              icon={<FolderGit2 size={16} />} 
              label="Project Completion" 
              active={activeTab === 'cert-project'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('cert-project')} 
            />

            {/* 3. CATEGORY: COMPANY (Company Catalogue & Collaborators Separated) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Company
                </span>
              )}
            </div>

            <SidebarItem 
              icon={<Building2 size={16} />} 
              label="Company Catalogue" 
              active={activeTab === 'company-catalogue'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('company-catalogue')} 
            />
            <SidebarItem 
              icon={<Layers size={16} />} 
              label="Collaborators" 
              active={activeTab === 'collaborators'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('collaborators')} 
            />
            <SidebarItem 
              icon={<Users size={16} />} 
              label="Founders & Employees" 
              active={activeTab === 'staff'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('staff')} 
            />

            {/* 4. CATEGORY: FINANCE (Student Payments, Client Payments, Expenses Separated) */}
            <div className="pt-4 pb-1 px-3">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                  Finance
                </span>
              )}
            </div>

            <SidebarItem 
              icon={<Wallet size={16} />} 
              label="Student Internship Payment" 
              active={activeTab === 'student-payments'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('student-payments')} 
            />
            <SidebarItem 
              icon={<IndianRupee size={16} />} 
              label="Client Payment" 
              active={activeTab === 'client-payments'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('client-payments')} 
            />
            <SidebarItem 
              icon={<FileSpreadsheet size={16} />} 
              label="Expenses" 
              active={activeTab === 'company-expenses'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('company-expenses')} 
            />

            {/* 5. CATEGORY: DATABASE OPERATIONS (Redesigned Neat & Simple) */}
            <div className="pt-4 pb-1 px-3 flex items-center justify-between">
              {!sidebarCollapsed && (
                <>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
                    Database
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                    MySQL
                  </span>
                </>
              )}
            </div>

            <SidebarItem 
              icon={<Database size={16} />} 
              label="Database Operations" 
              active={activeTab === 'database-operations' || activeTab === 'live-server'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('database-operations')} 
            />
            <SidebarItem 
              icon={<SettingsIcon size={16} />} 
              label="System Settings" 
              active={activeTab === 'settings'} 
              collapsed={sidebarCollapsed} 
              onClick={() => setActiveTab('settings')} 
            />

          </nav>

          {/* Sidebar Footer with Collapse Toggle (Always Visible Pinned) */}
          <div className="p-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8] shrink-0 bg-white z-10">
            {!sidebarCollapsed && (
              <span className="text-[11px] font-medium">&copy; 2026 Atideto Technologies</span>
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
        {/* MAIN WORKSPACE CONTENT: Clean Minimal Canvas (Independent Scroll)    */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <main ref={mainScrollRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden max-w-full touch-pan-y min-h-0 bg-[#F8FAFC] p-3 sm:p-6 lg:p-8 custom-scrollbar pb-24 sm:pb-8">
          
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 1: OVERVIEW & ANALYTICS (Exact Reference Image 2 Layout)       */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (() => {
            const cohortVerified = students.reduce((acc, s) => acc + (parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);
            const cohortInvoiced = students.reduce((acc, s) => acc + (parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);
            const corporateVerified = crmClients.reduce((acc, c) => acc + (c.amountPaid ? parseInt(c.amountPaid.replace(/[^0-9]/g, ''), 10) : (c.receivedAmount || 0)), 0);
            const corporateTotal = crmClients.reduce((acc, c) => acc + (c.contractValue ? parseInt(c.contractValue.replace(/[^0-9]/g, ''), 10) : (c.quotationAmount || 0)), 0);

            const verifiedRevenue = cohortVerified + corporateVerified;
            const totalInvoiced = cohortInvoiced + corporateTotal;
            const studentsWithDue = students.filter(s => {
              const tot = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
              const pd = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
              return tot > pd;
            });
            const corporateDue = Math.max(0, corporateTotal - corporateVerified);
            const totalPendingDues = Math.max(0, totalInvoiced - verifiedRevenue);
            const collectionRate = totalInvoiced > 0 ? Math.round((verifiedRevenue / totalInvoiced) * 100) : 0;

            return (
              <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
                
                {/* Header Title with Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Overview & Analytics
                    </h1>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Real-time cohort enrollments, financial settlements, and operational status
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                    <Calendar size={13} className="text-[#0066FF]" />
                    <span>Wednesday, 21 Oct 2026</span>
                  </div>
                </div>

                {/* Mobile View: High-density compact small-icon metric badges (sm:hidden) */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                  {/* 1. Students */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Users size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-black text-[#0F172A] leading-none">
                        {students.length}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Students</span>
                    </div>
                  </div>

                  {/* 2. Courses */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-black text-[#0F172A] leading-none">
                        {coursesList.length}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Courses</span>
                    </div>
                  </div>

                  {/* 3. Verified Rev */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <IndianRupee size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-black text-[#0F172A] leading-none">
                        ₹{verifiedRevenue >= 1000 ? `${(verifiedRevenue / 1000).toFixed(1)}k` : verifiedRevenue}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Verified Rev</span>
                    </div>
                  </div>

                  {/* 4. Pending Due */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ClipboardList size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-base font-black leading-none ${studentsWithDue.length > 0 || corporateDue > 0 ? 'text-amber-600' : 'text-[#0F172A]'}`}>
                        {studentsWithDue.length}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold block truncate mt-0.5">Pending Dues</span>
                    </div>
                  </div>
                </div>

                {/* Desktop / Tablet View: 4 Top Metric Cards (hidden sm:grid) */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
                  
                  {/* 1. Total Students */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                        <Users size={14} className="sm:hidden" />
                        <Users size={16} className="hidden sm:block" />
                      </div>
                      <span>Students</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                      {students.length}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium break-words">{students.length} Registered Cohort</p>
                  </div>

                  {/* 2. Active Courses */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                        <BookOpen size={14} className="sm:hidden" />
                        <BookOpen size={16} className="hidden sm:block" />
                      </div>
                      <span>Active Courses</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                      {coursesList.length}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium break-words">AI, Web & Cloud</p>
                  </div>

                  {/* 3. Verified Revenue */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                        <IndianRupee size={14} className="sm:hidden" />
                        <IndianRupee size={16} className="hidden sm:block" />
                      </div>
                      <span>Verified Rev</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                      ₹{verifiedRevenue.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#0066FF] font-semibold flex items-center gap-1 break-words">
                      <CheckCircle2 size={11} /> {collectionRate}% of ₹{totalInvoiced.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* 4. Pending Due */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-[#64748B]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
                        <ClipboardList size={14} className="sm:hidden" />
                        <ClipboardList size={16} className="hidden sm:block" />
                      </div>
                      <span>Pending Due</span>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-black ${studentsWithDue.length > 0 || corporateDue > 0 ? 'text-amber-600' : 'text-[#0F172A]'}`}>
                      {studentsWithDue.length}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium break-words">
                      {totalPendingDues === 0 ? 'All Clear' : `₹${totalPendingDues.toLocaleString('en-IN')} Due`}
                    </p>
                  </div>
                </div>

              {/* Large Section: Employee CRM & Corporate Training Operations (Exact Reference Image 2) */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                      <Building2 size={18} className="text-[#0F172A]" />
                      <span>Employee CRM & Corporate Training Operations</span>
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Company-wide client acquisitions, active leads pipeline, and team task completion
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setActiveTab('clients')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#000000] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sales Pipeline</span>
                      <ArrowRight size={13} />
                    </button>
                    <button 
                      onClick={() => setActiveTab('staff')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold transition cursor-pointer"
                    >
                      Staff Performance
                    </button>
                  </div>
                </div>

                {/* 4 Inner Stat Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Corporate Clients
                    </span>
                    <div className="text-xl font-black text-[#0F172A]">6 Accounts</div>
                    <p className="text-[11px] text-[#64748B]">2 MOUs Active</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Active Leads Pipeline
                    </span>
                    <div className="text-xl font-black text-[#0F172A]">₹6,80,000</div>
                    <p className="text-[11px] text-[#64748B]">5 Deals Open</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Team Follow-ups
                    </span>
                    <div className="text-xl font-black text-[#0F172A]">0 Scheduled Today</div>
                    <p className="text-[11px] text-[#64748B]">2 Completed Logs</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Team Tasks
                    </span>
                    <div className="text-xl font-black text-[#0F172A]">3 In Progress</div>
                    <p className="text-[11px] text-[#64748B]">2 Completed</p>
                  </div>

                </div>
              </div>

              {/* Lower Section: Graphical Analytic Insights Engine (All 6 Graph Types across all Panes) */}
              <div className="space-y-5">
                <GraphicalRepresentationAnalytics
                  currentPane="overview"
                  students={students}
                  courses={coursesList}
                  internships={internshipsList}
                  clients={crmClients}
                  staff={staffMembers}
                  payments={paymentsList}
                />
              </div>

              {/* Quick Students Table with Right Panel Drawer Launch */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A]">Registered Candidates Directory</h3>
                    <p className="text-xs text-[#64748B]">Click any candidate to open their 360° dossier & edit start date in the right panel</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('all-students')}
                    className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    View All {students.length} Students →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider pb-2">
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Domain / Track</th>
                        <th className="py-2.5 px-3">Start Date (Editable)</th>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {students.slice(0, 5).map((s) => (
                        <tr
                          key={s.id}
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'student-report',
                            title: `Student Dossier: ${s.name}`,
                            data: s
                          })}
                          className="hover:bg-[#F8FAFC] transition cursor-pointer"
                        >
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#0F172A] block">{s.name}</span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">{s.id} • {s.degree}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-[#475569]">{s.domain}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Calendar size={11} /> {s.startDate}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] text-[#0F172A] block">{s.phone}</span>
                            <span className="text-[10px] text-[#64748B] block break-all">{s.email}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="px-3 py-1 rounded-lg bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-[11px] transition">
                              Open Pane ↗
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 2: ALL REGISTERED STUDENTS                                    */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'all-students' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    Registered Students Database
                  </h1>
                  <p className="text-xs text-[#64748B]">
                    Complete roster of registered candidates with editable course start dates and internship payment clearance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="all-students" defaultMode="list" />
                  <button
                    type="button"
                    onClick={() => setRightPanel({
                      isOpen: true,
                      type: 'add-student',
                      title: 'Enroll New Student into ERP'
                    })}
                    className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Student</span>
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('all-students')}

              {/* Comprehensive Filter Bar (College, Domain, Status, Payment, Search) */}
              {renderFilterBar()}

              {/* Bunch / Bulk Payment Update Bar */}
              {renderBulkPaymentBar()}

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No students found matching your filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query, college, domain, or payment status filters.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterSearch('');
                      setFilterCollege('All Colleges');
                      setFilterDomain('All Domains');
                      setFilterStatus('All Statuses');
                      setFilterPayment('All Payments');
                    }}
                    className="mt-3 px-3 py-1.5 bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : getViewMode('all-students') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[850px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-3 w-8 text-center">
                            <input
                              type="checkbox"
                              checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                              onChange={() => toggleSelectAllStudents(filteredStudents)}
                              className="rounded cursor-pointer accent-black"
                              title="Select All Students"
                            />
                          </th>
                          <th className="py-3 px-4 min-w-[200px]">Candidate Name & Roll</th>
                          <th className="py-3 px-4 min-w-[190px]">Contact Info</th>
                          <th className="py-3 px-4 min-w-[190px]">College & Institution</th>
                          <th className="py-3 px-4 min-w-[170px]">Degree & Specialization</th>
                          <th className="py-3 px-4 min-w-[100px]">Grad Year</th>
                          <th className="py-3 px-4 min-w-[130px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[130px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStudents.map((s) => (
                          <tr
                            key={s.id}
                            onClick={() => setRightPanel({
                              isOpen: true,
                              type: 'student-report',
                              title: `Student Dossier: ${s.name}`,
                              data: s
                            })}
                            className={`hover:bg-[#F8FAFC] transition cursor-pointer ${selectedStudentIds.includes(s.id) ? 'bg-slate-100/60' : ''}`}
                          >
                            <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedStudentIds.includes(s.id)}
                                onChange={() => toggleSelectStudent(s.id)}
                                className="rounded cursor-pointer accent-black"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block">{s.name}</span>
                              <span className="text-[11px] text-[#64748B] font-mono">{s.id}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-[#0F172A] font-semibold text-xs block">{s.phone}</span>
                              <span className="text-[11px] text-[#64748B] block break-all mt-0.5">{s.email}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#0F172A] block">{s.college}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[#0F172A] font-medium block">{s.degree}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[11px] font-bold inline-block">
                                {s.gradYear || '2027'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="relative inline-block w-full min-w-[110px]">
                                <select
                                  value={s.status || 'Active'}
                                  onChange={(e) => handleUpdateStudentStatus(s.id, e.target.value)}
                                  className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-2xs focus:outline-none focus:border-black cursor-pointer appearance-none pr-6"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Enrolled">Enrolled</option>
                                  <option value="Completed">Completed</option>
                                  <option value="On Leave">On Leave</option>
                                  <option value="Dropped">Dropped</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1 text-[#64748B]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditStudentForm(s);
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'edit-student',
                                      title: `Edit Student: ${s.name}`,
                                      data: s
                                    });
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Edit Student"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setRightPanel({
                                    isOpen: true,
                                    type: 'student-report',
                                    title: `Student Dossier: ${s.name}`,
                                    data: s
                                  })}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Open Dossier"
                                >
                                  <ExternalLink size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(s.id, s.name)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Delete Student from entire ERP"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) showing student details only */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'student-report',
                        title: `Student Dossier: ${s.name}`,
                        data: s
                      })}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {s.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-800">
                            Class of {s.gradYear || '2027'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A] break-words">{s.name}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5 break-words">{s.college}</p>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1 text-[#475569]">
                          <p><span className="font-semibold text-black">Degree:</span> {s.degree}</p>
                          <p className="break-all"><span className="font-semibold text-black">Email:</span> {s.email}</p>
                          <p className="font-mono"><span className="font-semibold text-black">Phone:</span> {s.phone}</p>
                        </div>

                        <div className="pt-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block w-full">
                            <select
                              value={s.status || 'Active'}
                              onChange={(e) => handleUpdateStudentStatus(s.id, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-2xs focus:outline-none focus:border-black cursor-pointer appearance-none pr-6"
                            >
                              <option value="Active">Status: Active</option>
                              <option value="Enrolled">Status: Enrolled</option>
                              <option value="Completed">Status: Completed</option>
                              <option value="On Leave">Status: On Leave</option>
                              <option value="Dropped">Status: Dropped</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditStudentForm(s);
                            setRightPanel({
                              isOpen: true,
                              type: 'edit-student',
                              title: `Edit Student: ${s.name}`,
                              data: s
                            });
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-slate-100 text-[#0F172A] font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'student-report',
                            title: `Student Dossier: ${s.name}`,
                            data: s
                          })}
                          className="flex-1 py-1.5 rounded-lg bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Dossier</span>
                          <ArrowUpRight size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete Student from entire ERP"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 3: REGISTRATIONS (From 4-Stepper Form)                         */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'registrations' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    Candidate Registrations (4-Stepper Submissions)
                  </h1>
                  <p className="text-xs text-[#64748B]">Real-time submissions received via website 4-stepper registration with complete candidate details</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="registrations" defaultMode="list" />
                </div>
              </div>

              {renderPaneAnalytics('registrations')}

              {/* Filter Bar */}
              {renderFilterBar({ showPayment: false, countLabel: 'registration applications' })}

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No applications match your filter selection</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the college or specialization track filter.</p>
                </div>
              ) : getViewMode('registrations') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[800px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[220px]">Application & Candidate</th>
                          <th className="py-3 px-4 min-w-[180px]">Contact Info</th>
                          <th className="py-3 px-4 min-w-[180px]">College & Degree</th>
                          <th className="py-3 px-4 min-w-[140px]">Program Track</th>
                          <th className="py-3 px-4 min-w-[120px]">Start Date</th>
                          <th className="py-3 px-4 min-w-[120px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[110px]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStudents.map((reg) => (
                          <tr 
                            key={reg.id} 
                            onClick={() => setRightPanel({
                              isOpen: true,
                              type: 'student-report',
                              title: `Registration Review: ${reg.name}`,
                              data: reg
                            })}
                            className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">{reg.name}</span>
                              <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">{reg.id}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-[#0F172A] block text-xs">{reg.phone}</span>
                              <span className="text-[11px] text-[#64748B] block break-all mt-0.5">{reg.email}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#0F172A] block">{reg.degree}</span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5 break-words">{reg.college}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                {reg.domain}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#0F172A] text-xs">
                              {reg.startDate}
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>{reg.status}</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    toast.success(`Candidate ${reg.name} successfully approved & verified in ERP!`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                                >
                                  Approve ↗
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(reg.id, reg.name)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Delete Student from entire ERP"
                                >
                                  <Trash2 size={14} />
                                </button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredStudents.map((reg) => (
                    <div
                      key={reg.id}
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'student-report',
                        title: `Registration Review: ${reg.name}`,
                        data: reg
                      })}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {reg.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-800">
                            {reg.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A] break-words">{reg.name}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5 break-words">{reg.college}</p>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1 text-[#475569]">
                          <p><span className="font-semibold text-black">Program:</span> {reg.domain}</p>
                          <p><span className="font-semibold text-black">Start Date:</span> {reg.startDate}</p>
                          <p><span className="font-semibold text-black">Phone:</span> {reg.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toast.success(`Candidate ${reg.name} successfully approved & verified in ERP!`)}
                          className="flex-1 py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Approve</span>
                          <ArrowUpRight size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(reg.id, reg.name)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete Student from entire ERP"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 4: COURSES (Website Details - 12 Technical Courses)           */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'courses' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Technical Course Tracks & Curriculum</h1>
                  <p className="text-xs text-[#64748B]">All 12 official Atideto Academy technical courses from the website</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="courses" defaultMode="list" />
                </div>
              </div>

              {renderPaneAnalytics('courses')}

              {/* Courses Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      placeholder="Search courses by title, instructor, tech stack..."
                      className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
                    />
                    {courseSearch && (
                      <button 
                        type="button"
                        onClick={() => setCourseSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="w-full sm:w-auto min-w-[180px]">
                    <div className="relative">
                      <Target className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={courseCategoryFilter}
                        onChange={(e) => setCourseCategoryFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableCourseCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  {(courseSearch || courseCategoryFilter !== 'All Categories') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseSearch('');
                        setCourseCategoryFilter('All Categories');
                      }}
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Showing <b>{filteredCourses.length}</b> of <b>{coursesList.length}</b> technical courses</span>
                  {(courseSearch || courseCategoryFilter !== 'All Categories') && (
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Filtered View Active
                    </span>
                  )}
                </div>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No courses match your search or filter</p>
                  <p className="text-xs text-slate-400">Try adjusting your keywords or category selection</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCourseSearch('');
                      setCourseCategoryFilter('All Categories');
                    }}
                    className="mt-2 px-3 py-1.5 bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold text-xs rounded-lg transition"
                  >
                    Reset Course Filters
                  </button>
                </div>
              ) : getViewMode('courses') === 'list' ? (
                /* Minimal 2-Color Table (List View) matching user reference */
                <div className="p-3 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[800px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[240px]">Program Title & Batch</th>
                          <th className="py-3 px-4 min-w-[110px]">Type</th>
                          <th className="py-3 px-4 min-w-[150px]">Schedule & Duration</th>
                          <th className="py-3 px-4 min-w-[100px]">Fee (₹)</th>
                          <th className="py-3 px-4 min-w-[140px]">Enrollment Capacity</th>
                          <th className="py-3 px-4 min-w-[120px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[120px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredCourses.map((course, idx) => {
                          const batchCode = `Batch ${course.id.replace('c-', '').toUpperCase().slice(0, 4)}-2026-09`;
                          const type = idx % 2 === 0 ? 'INTERNSHIP' : 'TRAINING';
                          const fee = idx % 2 === 0 ? '₹9,999' : idx % 3 === 0 ? '₹12,999' : '₹7,999';
                          const schedule = idx % 2 === 0 ? '01 Sept 2026' : '15 Sept 2026';
                          const capacity = 50;
                          const enrolled = course.enrolled > capacity ? capacity : course.enrolled;
                          const percent = Math.min(100, Math.round((enrolled / capacity) * 100));

                          return (
                            <tr
                              key={course.id}
                              onClick={() => setRightPanel({
                                isOpen: true,
                                type: 'course-edit',
                                title: course.title,
                                data: course
                              })}
                              className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                            >
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">
                                  {course.title}
                                </span>
                                <span className="text-xs text-[#64748B] font-medium block mt-0.5">
                                  Batch: {batchCode}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                  {type}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-xs text-[#0F172A] block">{schedule}</span>
                                <span className="text-xs text-[#64748B] block mt-0.5">{course.duration}</span>
                              </td>

                              <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                                {fee}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="font-bold text-xs text-[#0F172A] block">
                                  {enrolled}/{capacity}
                                </span>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5">
                                  <div className="h-full bg-[#0F172A] rounded-full transition-all" style={{ width: `${percent}%` }} />
                                </div>
                              </td>

                              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                  <span>Active</span>
                                  <ChevronDown size={12} className="text-[#64748B]" />
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center justify-end gap-1 text-[#64748B]">
                                  <button
                                    type="button"
                                    onClick={() => setRightPanel({
                                      isOpen: true,
                                      type: 'course-edit',
                                      title: course.title,
                                      data: course
                                    })}
                                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                    title="Open Details"
                                  >
                                    <ExternalLink size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRightPanel({
                                      isOpen: true,
                                      type: 'course-edit',
                                      title: course.title,
                                      data: course
                                    })}
                                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                    title="Edit Course"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toast.success(`Archived ${course.title}`)}
                                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                    title="Archive"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course) => (
                    <div 
                      key={course.id} 
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'course-edit',
                        title: course.title,
                        data: course
                      })}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#000000] text-white">
                            {course.duration}
                          </span>
                          <span className="font-mono text-xs text-[#64748B]">{course.enrolled} Enrolled</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A]">{course.title}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{course.instructor}</p>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1 text-[#475569]">
                          <p><span className="font-semibold text-black">Curriculum:</span> {course.modules} Modules</p>
                          <p><span className="font-semibold text-black">Category:</span> {course.category}</p>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {course.tools.map((tool, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#64748B]">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#000000] hover:text-white text-[#0F172A] border border-[#E2E8F0] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        <span>Edit Curriculum Syllabus</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 5: INTERNSHIPS (Website Details - 13 Internship Programs)     */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 5: STUDENT REGISTERED INTERNSHIPS (WITH MANUAL START/END/DURATION) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'internships' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Briefcase size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Student Registered Internships
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Manage candidate registered internship tracks, manual start date, end date, duration, and completion status
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="internships" defaultMode="list" />
                </div>
              </div>

              {renderPaneAnalytics('internships')}

              {/* Comprehensive Filter Bar (College, Domain, Status, Search) */}
              {renderFilterBar({ countLabel: 'registered internships' })}

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No internship registrations found</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the domain or college filter.</p>
                </div>
              ) : getViewMode('internships') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[950px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-3 w-8 text-center">
                            <input
                              type="checkbox"
                              checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                              onChange={() => toggleSelectAllStudents(filteredStudents)}
                              className="rounded cursor-pointer accent-black"
                              title="Select All"
                            />
                          </th>
                          <th className="py-3 px-4 min-w-[190px]">Candidate & ID</th>
                          <th className="py-3 px-4 min-w-[210px]">Registered Domain / Track</th>
                          <th className="py-3 px-4 min-w-[130px]">Start Date (Manual)</th>
                          <th className="py-3 px-4 min-w-[130px]">End Date (Manual)</th>
                          <th className="py-3 px-4 min-w-[110px]">Duration (Manual)</th>
                          <th className="py-3 px-4 min-w-[130px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStudents.map((s) => (
                          <tr
                            key={s.id}
                            className={`hover:bg-[#F8FAFC] transition ${selectedStudentIds.includes(s.id) ? 'bg-slate-100/60' : ''}`}
                          >
                            <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedStudentIds.includes(s.id)}
                                onChange={() => toggleSelectStudent(s.id)}
                                className="rounded cursor-pointer accent-black"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block">{s.name}</span>
                              <span className="text-[11px] text-[#64748B] font-mono block">{s.id}</span>
                              <span className="text-[10px] text-[#94A3B8] block">{s.college}</span>
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <select
                                  value={s.domain || 'Web Development'}
                                  onChange={(e) => handleUpdateStudentInternship(s.id, { domain: e.target.value })}
                                  className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] shadow-2xs focus:outline-none focus:border-black cursor-pointer appearance-none pr-6"
                                >
                                  {availableDomains.filter(d => d !== 'All Domains').map((domain) => (
                                    <option key={domain} value={domain}>{domain}</option>
                                  ))}
                                  <option value="Full Stack Web Development (Java)">Full Stack Web Development (Java)</option>
                                  <option value="Full Stack Development (MERN Stack)">Full Stack Development (MERN Stack)</option>
                                  <option value="Full Stack Development (MEAN Stack)">Full Stack Development (MEAN Stack)</option>
                                  <option value="Web Development">Web Development</option>
                                  <option value="Python">Python</option>
                                  <option value="Core Java">Core Java</option>
                                  <option value="Data Science">Data Science</option>
                                  <option value="Data Analyst">Data Analyst</option>
                                  <option value="Digital Marketing">Digital Marketing</option>
                                  <option value="App Development">App Development</option>
                                  <option value="Cyber Security">Cyber Security</option>
                                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                                  <option value="UI / UX Design">UI / UX Design</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="date"
                                value={s.startDate || '2026-06-01'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { startDate: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-mono font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-black"
                              />
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="date"
                                value={s.endDate || '2027-01-25'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { endDate: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-mono font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-black"
                              />
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={s.duration || '30 days'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { duration: e.target.value })}
                                placeholder="e.g. 30 days"
                                className="w-full px-2 py-1 text-xs font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-black"
                              />
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="relative inline-block w-full">
                                <select
                                  value={s.status || 'Active'}
                                  onChange={(e) => handleUpdateStudentInternship(s.id, { status: e.target.value })}
                                  className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-2xs focus:outline-none focus:border-black cursor-pointer appearance-none pr-6"
                                >
                                  <option value="Active">Active</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Enrolled">Enrolled</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="On Leave">On Leave</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toast.success(`Saved internship settings for ${s.name}!`)}
                                  className="px-2.5 py-1 rounded-lg bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                                  title="Save Internship Updates"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditStudentForm(s);
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'certificate-generator',
                                      title: `Certificate Studio: ${s.name}`,
                                      data: s,
                                      mode: 'certificate'
                                    });
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                                  title="Open Certificate Studio"
                                >
                                  <Award size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(s.id, s.name)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Delete Student from entire ERP"
                                >
                                  <Trash2 size={14} />
                                </button>
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
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {s.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {s.status || 'Active'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A]">{s.name}</h4>
                          <p className="text-xs text-[#64748B]">{s.college}</p>
                        </div>

                        <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Registered Domain
                            </label>
                            <select
                              value={s.domain || 'Web Development'}
                              onChange={(e) => handleUpdateStudentInternship(s.id, { domain: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-black cursor-pointer"
                            >
                              {availableDomains.filter(d => d !== 'All Domains').map((domain) => (
                                <option key={domain} value={domain}>{domain}</option>
                              ))}
                              <option value="Full Stack Web Development (Java)">Full Stack Web Development (Java)</option>
                              <option value="Full Stack Development (MERN Stack)">Full Stack Development (MERN Stack)</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Python">Python</option>
                              <option value="Core Java">Core Java</option>
                              <option value="Data Science">Data Science</option>
                              <option value="Data Analyst">Data Analyst</option>
                              <option value="Digital Marketing">Digital Marketing</option>
                              <option value="App Development">App Development</option>
                              <option value="Cyber Security">Cyber Security</option>
                              <option value="Cloud & DevOps">Cloud & DevOps</option>
                              <option value="UI / UX Design">UI / UX Design</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={s.startDate || '2026-06-01'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { startDate: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-mono font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                value={s.endDate || '2027-01-25'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { endDate: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-mono font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={s.duration || '30 days'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { duration: e.target.value })}
                                className="w-full px-2 py-1 text-xs font-medium rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A]"
                                placeholder="e.g. 30 days"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Status
                              </label>
                              <select
                                value={s.status || 'Active'}
                                onChange={(e) => handleUpdateStudentInternship(s.id, { status: e.target.value })}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A]"
                              >
                                <option value="Active">Active</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Enrolled">Enrolled</option>
                                <option value="Under Review">Under Review</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          onClick={() => toast.success(`Saved internship updates for ${s.name}!`)}
                          className="flex-1 py-1.5 rounded-lg bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditStudentForm(s);
                            setRightPanel({
                              isOpen: true,
                              type: 'certificate-generator',
                              title: `Certificate Studio: ${s.name}`,
                              data: s,
                              mode: 'certificate'
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Award size={12} />
                          <span>Studio</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete Student from entire ERP"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: COMPANY CATALOGUE (SEPARATED FROM COLLABORATORS & FINANCE)   */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'company-catalogue' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Building2 size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Company Catalogue & Product Suite
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Enterprise software systems, official academy technical courses, and industrial internship programs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCatalogueSubTab('software')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${catalogueSubTab === 'software' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Software Systems
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogueSubTab('courses')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${catalogueSubTab === 'courses' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Technical Courses (12)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogueSubTab('internships')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${catalogueSubTab === 'internships' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Internship Tracks (13)
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtab 1: Enterprise Software Systems */}
              {catalogueSubTab === 'software' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black text-white">
                            Flagship Product
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Live Production
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Website cum ERP System</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Comprehensive institutional & corporate ERP featuring real-time admissions, student registries, tuition and client billing ledger, QR-verifiable certificate issuance engine, and staff permissions.
                        </p>
                        <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                          <p><span className="font-bold text-black">Client Deployments:</span> Arrox Tech Company, MEC & MCE</p>
                          <p><span className="font-bold text-black">Tech Stack:</span> React, TypeScript, Tailwind, Node.js, MySQL</p>
                          <p><span className="font-bold text-black">Contract Value:</span> ₹15,000 (Advance & Milestone 1 Cleared)</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('ERP System is currently active and managing this portal!')}
                        className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold transition hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Active System Instance</span>
                        <CheckCircle2 size={14} />
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                            Academic Suite
                          </span>
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Deployable
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">College LMS & Assessment Portal</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Autonomous higher education Learning Management System supporting batch attendance telemetry, automated assignment grading, syllabus milestones, and digital grade card publishing.
                        </p>
                        <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                          <p><span className="font-bold text-black">Target Partners:</span> Engineering & Autonomous Colleges</p>
                          <p><span className="font-bold text-black">Capabilities:</span> Attendance, Continuous Assessment, LMS</p>
                          <p><span className="font-bold text-black">SLA:</span> 99.9% Uptime with Cloud Hosting</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('LMS Module catalog specification opened!')}
                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition hover:bg-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Product Specifications</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                            Career & Training
                          </span>
                          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            Integrated
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Placement Preparation & Code Sandbox</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Multi-language online compiler sandbox, DSA challenges, company-specific test archives, AI mock interview engine, and automated student portfolio builder.
                        </p>
                        <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                          <p><span className="font-bold text-black">Supported Languages:</span> Java, Python, C++, JavaScript</p>
                          <p><span className="font-bold text-black">Question Bank:</span> 500+ Curated Placement Challenges</p>
                          <p><span className="font-bold text-black">Outcome:</span> Direct Industry Job Matching</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('Placement Sandbox specs ready!')}
                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition hover:bg-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Sandbox Details</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab 2: Technical Courses Catalogue (12 Courses) */}
              {catalogueSubTab === 'courses' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {coursesList.map((course) => (
                    <div
                      key={course.id}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black text-white">
                            {course.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">{course.duration}</span>
                        </div>
                        <h4 className="font-bold text-base text-[#0F172A]">{course.title}</h4>
                        <p className="text-xs text-[#64748B]">Lead Instructor: {course.instructor}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {course.tools.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{course.modules} Modules</span>
                        <span className="text-slate-500 font-semibold">{course.enrolled} Active Learners</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtab 3: Industrial Internship Programs (13 Programs) */}
              {catalogueSubTab === 'internships' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {internshipsList.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black text-white">
                            {prog.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">{prog.duration}</span>
                        </div>
                        <h4 className="font-bold text-base text-[#0F172A]">{prog.title}</h4>
                        <p className="text-xs text-[#64748B]">Mentor: {prog.mentor}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{prog.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {prog.skills.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/upskill')}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-black hover:text-white text-slate-900 border border-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Program Curriculum</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: COLLABORATORS (SEPARATED FROM COMPANY CATALOGUE)             */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'collaborators' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Layers size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Corporate & Academic Collaborators
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Official academic institutional partnerships, industrial technology collaborators, and government certifications
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCollaboratorSubTab('all')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${collaboratorSubTab === 'all' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollaboratorSubTab('academic')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${collaboratorSubTab === 'academic' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Academic (MOU)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollaboratorSubTab('industry')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${collaboratorSubTab === 'industry' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Industry Partners
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollaboratorSubTab('government')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${collaboratorSubTab === 'government' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'}`}
                    >
                      Gov Certifications
                    </button>
                  </div>
                </div>
              </div>

              {/* Collaborators Overview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Academic Partners</span>
                  <div className="text-3xl font-black text-[#0F172A]">4 Institutions</div>
                  <p className="text-[11px] text-[#64748B]">MEC (Autonomous), MCE, Anna Univ, Paavai</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Industry Collaborators</span>
                  <div className="text-3xl font-black text-[#0F172A]">3 Partners</div>
                  <p className="text-[11px] text-[#64748B]">Zyrflow Technologies, Pivilis Tech Lab, Arrox Tech</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Government Certifications</span>
                  <div className="text-3xl font-black text-[#0F172A]">DPIIT & MSME</div>
                  <p className="text-[11px] text-[#64748B]">#startupindia • Reg: UDYAM-TN-28-0242534</p>
                </div>
              </div>

              {/* Collaborators Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(collaboratorSubTab === 'all' || collaboratorSubTab === 'academic') && (
                  <>
                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-black text-white">
                          Academic MOU
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          MOU Signed
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Muthayammal Engineering College (Autonomous)</h4>
                      <p className="text-xs text-[#64748B]">Rasipuram, Namakkal District, Tamil Nadu</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Active Cohort:</span> 15 Candidates (B.Tech IT - Class of 2027)</p>
                        <p><span className="font-semibold text-black">Specialization:</span> Full Stack Web Development & Java</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-black text-white">
                          Academic MOU
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          MOU Signed
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Mahendra College of Engineering</h4>
                      <p className="text-xs text-[#64748B]">Minnampalli, Salem, Tamil Nadu</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Active Cohort:</span> 6 Candidates (B.E CSE - Class of 2027)</p>
                        <p><span className="font-semibold text-black">Specialization:</span> Full Stack Development & Cloud</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          University Affiliation
                        </span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          State Affiliated
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Anna University</h4>
                      <p className="text-xs text-[#64748B]">Guindy, Chennai, Tamil Nadu</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Student Records:</span> Arun Kumar (710022104001)</p>
                        <p><span className="font-semibold text-black">Track:</span> Web Development Certification</p>
                      </div>
                    </div>
                  </>
                )}

                {(collaboratorSubTab === 'all' || collaboratorSubTab === 'industry') && (
                  <>
                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-black text-white">
                          Certification Partner
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Official Issuer
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Zyrflow Technologies Pvt. Ltd.</h4>
                      <p className="text-xs text-[#64748B]">Sikarajapuram, Vellore – 632515</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Role:</span> Dual Certifying Entity on all Atideto Offer Letters & Completion Credentials</p>
                        <p><span className="font-semibold text-black">Portal:</span> zyrflow.com • internships@zyrflow.com</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          R&D Partner
                        </span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Technology Lab
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Pivilis Tech Lab</h4>
                      <p className="text-xs text-[#64748B]">Advanced Enterprise Systems & Cloud Architectures</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Domain:</span> Generative AI, Cloud DevOps, Distributed Systems</p>
                        <p><span className="font-semibold text-black">Engagement:</span> Mentorship & Guest Lecture Series</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          Enterprise Client
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active Contract
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">Arrox Tech Company</h4>
                      <p className="text-xs text-[#64748B]">praveenshakthi001@gmail.com</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Project:</span> Website cum ERP Development</p>
                        <p><span className="font-semibold text-black">Billing:</span> Quotation ₹15,000 • Received ₹8,000</p>
                      </div>
                    </div>
                  </>
                )}

                {(collaboratorSubTab === 'all' || collaboratorSubTab === 'government') && (
                  <>
                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-black text-white">
                          Govt Recognition
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          DPIIT Recognized
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">#startupindia (DPIIT)</h4>
                      <p className="text-xs text-[#64748B]">Department for Promotion of Industry and Internal Trade</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Ministry:</span> Ministry of Commerce & Industry, Govt of India</p>
                        <p><span className="font-semibold text-black">Badge:</span> Official Startup India certificate accreditation</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-black text-white">
                          Govt Registration
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active UDYAM
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F172A]">MSME Government of India</h4>
                      <p className="text-xs text-[#64748B]">Ministry of Micro, Small & Medium Enterprises</p>
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-700">
                        <p><span className="font-semibold text-black">Registration No:</span> UDYAM-TN-28-0242534</p>
                        <p><span className="font-semibold text-black">Status:</span> Active Registered Enterprise</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: CLIENT PAYMENTS (SEPARATED FROM STUDENT INTERNSHIP PAYMENTS) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'client-payments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <IndianRupee size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Corporate Client Payments & Receivables
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Enterprise software contracts, client milestone invoicing, and corporate payment ledgers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentForm({
                        id: `RCPT-CLI-00${paymentsList.length + 1}`,
                        payer: 'Arrox Tech Company',
                        type: 'Website cum ERP Milestone',
                        amount: '₹7,000',
                        method: 'UPI / Direct Bank',
                        status: 'Verified'
                      });
                      setRightPanel({
                        isOpen: true,
                        type: 'add-payment',
                        title: 'Record Corporate Client Payment'
                      });
                    }}
                    className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Record Client Payment</span>
                  </button>
                </div>
              </div>

              {/* Client Payments Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Corporate Quotation Total</span>
                  <div className="text-3xl font-black text-[#0F172A]">₹15,000</div>
                  <p className="text-[11px] text-[#64748B]">Arrox Tech Company • "Website cum ERP" Project</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Received & Realized</span>
                  <div className="text-3xl font-black text-emerald-700">₹8,000</div>
                  <p className="text-[11px] text-[#64748B]">Advance ₹3,000 + Milestone 1 ₹5,000 Cleared</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Corporate Balance Due</span>
                  <div className="text-3xl font-black text-slate-900">₹7,000</div>
                  <p className="text-[11px] text-[#64748B]">Milestone 2 due upon final delivery</p>
                </div>
              </div>

              {/* Client Payments Ledger Table */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <h3 className="font-bold text-sm text-[#0F172A] mb-3">Client Transaction & Milestone Receipts</h3>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[750px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Receipt ID</th>
                        <th className="py-3 px-4">Corporate Payer</th>
                        <th className="py-3 px-4">Project & Milestone</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {paymentsList.filter(p => !p.payer.includes('Institutional')).map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{p.id}</td>
                          <td className="py-3.5 px-4 font-bold text-[#0F172A]">{p.payer}</td>
                          <td className="py-3.5 px-4 text-slate-700">{p.type}</td>
                          <td className="py-3.5 px-4 font-black text-sm text-slate-900">{p.amount}</td>
                          <td className="py-3.5 px-4 text-slate-600">{p.method}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">{p.date}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => toast.success(`Downloaded client receipt ${p.id}`)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                                title="Download Receipt"
                              >
                                <Download size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePayment(p.id)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title="Delete Payment Record"
                              >
                                <Trash2 size={13} />
                              </button>
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
          {/* TAB: COMPANY EXPENSES (SEPARATED OPERATIONAL EXPENSES VIEW)       */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'company-expenses' && (() => {
            const totalOperatingExpenses = expensesList.reduce((acc, x) => acc + (x.numericAmount || 0), 0);
            return (
              <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                        <FileSpreadsheet size={18} />
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                        Company Operational Expenses
                      </h1>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Cloud hosting infrastructure, software licenses, domain renewals, mentor stipends, and office operational expenses
                    </p>
                  </div>
                </div>

                {/* Expenses Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Monthly Expenses</span>
                    <div className="text-3xl font-black text-[#0F172A]">₹{totalOperatingExpenses.toLocaleString('en-IN')}</div>
                    <p className="text-[11px] text-[#64748B]">{expensesList.length} Active Expense Entries</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Cloud Infrastructure</span>
                    <div className="text-3xl font-black text-slate-900">₹6,000</div>
                    <p className="text-[11px] text-[#64748B]">AWS, GCP & Vercel Production</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Software & Domains</span>
                    <div className="text-3xl font-black text-slate-900">₹3,599</div>
                    <p className="text-[11px] text-[#64748B]">Google Workspace, SSL & Domains</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Mentors & Operations</span>
                    <div className="text-3xl font-black text-slate-900">₹37,300</div>
                    <p className="text-[11px] text-[#64748B]">Guest honorariums & lab maintenance</p>
                  </div>
                </div>

                {/* Quick Add Expense Form */}
                <form onSubmit={handleAddExpense} className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Record New Company Expense</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Expense Title / Description"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-black font-medium"
                      required
                    />
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-black font-semibold cursor-pointer"
                    >
                      <option value="Cloud Hosting">Cloud Hosting</option>
                      <option value="Software Licenses">Software Licenses</option>
                      <option value="Domains & Security">Domains & Security</option>
                      <option value="Honorariums & Stipends">Honorariums & Stipends</option>
                      <option value="Infrastructure & Lab">Infrastructure & Lab</option>
                      <option value="Marketing & Outreach">Marketing & Outreach</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Amount (e.g. 2500)"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-black font-mono font-bold"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Vendor / Payee Name"
                      value={expenseForm.vendor}
                      onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-black font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Plus size={14} />
                      <span>+ Add Expense</span>
                    </button>
                  </div>
                </form>

                {/* Expenses Table */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <h3 className="font-bold text-sm text-[#0F172A] mb-3">Expenses Ledger</h3>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[750px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4">Expense ID</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Vendor</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {expensesList.map((exp) => (
                          <tr key={exp.id} className="hover:bg-[#F8FAFC] transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{exp.id}</td>
                            <td className="py-3.5 px-4 font-bold text-[#0F172A]">{exp.title}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {exp.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">{exp.vendor}</td>
                            <td className="py-3.5 px-4 font-black text-sm text-slate-900">{exp.amount}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">{exp.date}</td>
                            <td className="py-3.5 px-4 text-slate-600">{exp.paymentMethod}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(exp.id, exp.title)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                title="Delete Expense"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 6: ATTENDANCE ROLL                                            */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Cohort Attendance Register</h1>
                  <p className="text-xs text-[#64748B]">Real-time student attendance tracking across active training batches</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="attendance" defaultMode="list" />
                </div>
              </div>

              {renderPaneAnalytics('attendance')}

              {/* Filter Bar with Attendance Rate Dropdown */}
              {renderFilterBar({ showPayment: false, showStatus: false, showAttendanceRate: true, countLabel: 'attendance entries' })}

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No attendance records match your filter</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the college, domain, or attendance rate filter.</p>
                </div>
              ) : getViewMode('attendance') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[850px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[220px]">Student Name & Roll</th>
                          <th className="py-3 px-4 min-w-[200px]">College & Domain</th>
                          <th className="py-3 px-4 min-w-[120px]">Start Date</th>
                          <th className="py-3 px-4 min-w-[160px]">Attendance Ratio</th>
                          <th className="py-3 px-4 min-w-[180px]">Quick Adjustment</th>
                          <th className="py-3 px-4 min-w-[120px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[100px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStudents.map((s) => {
                          const attVal = s.attendance ?? 95;
                          return (
                            <tr
                              key={s.id}
                              className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                            >
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">{s.name}</span>
                                <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">{s.studentId || s.id}</span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-[#0F172A] block">{s.domain}</span>
                                <span className="text-[11px] text-[#64748B] block mt-0.5 break-words">{s.college}</span>
                              </td>

                              <td className="py-3.5 px-4 text-xs font-semibold text-[#0F172A]">
                                {s.startDate}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#0F172A]">{attVal}%</span>
                                  <span className="text-[10px] text-[#64748B]">({attVal >= 80 ? 'Compliant' : 'Shortage'})</span>
                                </div>
                                <div className="h-1.5 w-24 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5">
                                  <div className="h-full bg-[#0F172A] rounded-full transition-all" style={{ width: `${attVal}%` }} />
                                </div>
                              </td>

                              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const val = Math.max(0, attVal - 5);
                                      const updated = students.map(st => st.id === s.id ? { ...st, attendance: val } : st);
                                      setStudents(updated);
                                      saveStoredStudents(updated);
                                      updateStudentInRegistry(s.id, { attendance: val });
                                      await updateStudentInDb(s.id, { attendance: val });
                                      toast.success(`${s.name}: ${val}%`);
                                    }}
                                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 transition cursor-pointer"
                                    title="Decrease 5%"
                                  >
                                    -5%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const val = Math.min(100, attVal + 5);
                                      const updated = students.map(st => st.id === s.id ? { ...st, attendance: val } : st);
                                      setStudents(updated);
                                      saveStoredStudents(updated);
                                      updateStudentInRegistry(s.id, { attendance: val });
                                      await updateStudentInDb(s.id, { attendance: val });
                                      toast.success(`${s.name}: ${val}%`);
                                    }}
                                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 transition cursor-pointer"
                                    title="Increase 5%"
                                  >
                                    +5%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const updated = students.map(st => st.id === s.id ? { ...st, attendance: 100 } : st);
                                      setStudents(updated);
                                      saveStoredStudents(updated);
                                      updateStudentInRegistry(s.id, { attendance: 100 });
                                      await updateStudentInDb(s.id, { attendance: 100 });
                                      toast.success(`Marked ${s.name} 100% Present`);
                                    }}
                                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-black text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                                    title="Mark 100%"
                                  >
                                    <span>100%</span>
                                    <Check size={10} />
                                  </button>
                                </div>
                              </td>

                              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                  <span>{attVal >= 80 ? 'Active' : 'Warning'}</span>
                                  <ChevronDown size={12} className="text-[#64748B]" />
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center justify-end gap-1 text-[#64748B]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditStudentForm(s);
                                      setRightPanel({
                                        isOpen: true,
                                        type: 'edit-student',
                                        title: `Edit Attendance: ${s.name}`,
                                        data: s
                                      });
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRightPanel({
                                      isOpen: true,
                                      type: 'student-report',
                                      title: `Student Dossier: ${s.name}`,
                                      data: s
                                    })}
                                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                    title="View Dossier"
                                  >
                                    <ExternalLink size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(s.id, s.name)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                    title="Delete Student from entire ERP"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredStudents.map((s) => {
                    const attVal = s.attendance ?? 95;
                    return (
                      <div
                        key={s.id}
                        className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                              {s.studentId || s.id}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 text-slate-900 px-2.5 py-0.5 rounded text-xs font-bold">
                              {attVal}%
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-base text-[#0F172A] break-words">{s.name}</h4>
                            <p className="text-xs text-[#64748B] mt-0.5 break-words">{s.college}</p>
                          </div>

                          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0F172A] rounded-full transition-all" style={{ width: `${attVal}%` }} />
                          </div>

                          <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1 text-[#475569]">
                            <p><span className="font-semibold text-black">Track:</span> {s.domain}</p>
                            <p><span className="font-semibold text-black">Start:</span> {s.startDate}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={async () => {
                              const val = Math.max(0, attVal - 5);
                              const updated = students.map(st => st.id === s.id ? { ...st, attendance: val } : st);
                              setStudents(updated);
                              saveStoredStudents(updated);
                              updateStudentInRegistry(s.id, { attendance: val });
                              await updateStudentInDb(s.id, { attendance: val });
                              toast.success(`${s.name}: ${val}%`);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer"
                          >
                            -5%
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const val = Math.min(100, attVal + 5);
                              const updated = students.map(st => st.id === s.id ? { ...st, attendance: val } : st);
                              setStudents(updated);
                              saveStoredStudents(updated);
                              updateStudentInRegistry(s.id, { attendance: val });
                              await updateStudentInDb(s.id, { attendance: val });
                              toast.success(`${s.name}: ${val}%`);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer"
                          >
                            +5%
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = students.map(st => st.id === s.id ? { ...st, attendance: 100 } : st);
                              setStudents(updated);
                              saveStoredStudents(updated);
                              updateStudentInRegistry(s.id, { attendance: 100 });
                              await updateStudentInDb(s.id, { attendance: 100 });
                              toast.success(`Marked ${s.name} 100%`);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-black text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                          >
                            100%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Delete Student from entire ERP"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB 7: PROJECTS & CAPSTONE DEFENSE                                */}
          {/* ────────────────────────────�          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: FIND CLIENTS & CORPORATE CRM (Reference Image 2: Company)    */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'clients' || activeTab === 'leads') && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Building2 size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Company & Collaborators Catalog</h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">Enterprise client accounts, collaborator partner companies, campus hiring MOUs, and custom projects</p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="clients" defaultMode="list" />
                  <button
                    onClick={() => {
                      setClientForm({
                        id: `CLT-2026-0${crmClients.length + 1}`,
                        name: '',
                        type: 'Corporate Client',
                        project: 'Website cum ERP',
                        industry: 'Enterprise Software & Cloud',
                        contactPerson: '',
                        email: '',
                        phone: '+91 98410 00000',
                        mouStatus: 'Mou not signed',
                        contractValue: '₹15,000',
                        amountPaid: '₹8,000',
                        balanceDue: '₹7,000',
                        quotationAmount: 15000,
                        receivedAmount: 8000
                      });
                      setRightPanel({
                        isOpen: true,
                        type: 'add-client',
                        title: 'Add New Company / Collaborator'
                      });
                    }}
                    className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Company</span>
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('clients')}

              {/* Corporate Clients Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Search clients by name, industry, contact, email..."
                      className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
                    />
                    {clientSearch && (
                      <button 
                        type="button"
                        onClick={() => setClientSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="w-full sm:w-auto min-w-[170px]">
                    <div className="relative">
                      <CheckSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={clientStatusFilter}
                        onChange={(e) => setClientStatusFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableClientStatuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto min-w-[180px]">
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={clientIndustryFilter}
                        onChange={(e) => setClientIndustryFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableClientIndustries.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  {(clientSearch || clientStatusFilter !== 'All Statuses' || clientIndustryFilter !== 'All Industries') && (
                    <button
                      type="button"
                      onClick={() => {
                        setClientSearch('');
                        setClientStatusFilter('All Statuses');
                        setClientIndustryFilter('All Industries');
                      }}
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Showing <b>{filteredClients.length}</b> of <b>{crmClients.length}</b> corporate partner accounts</span>
                  {(clientSearch || clientStatusFilter !== 'All Statuses' || clientIndustryFilter !== 'All Industries') && (
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Filtered View Active
                    </span>
                  )}
                </div>
              </div>

              {filteredClients.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No corporate clients match your search or filter</p>
                  <p className="text-xs text-slate-400">Try adjusting your search terms or MOU status</p>
                  <button
                    type="button"
                    onClick={() => {
                      setClientSearch('');
                      setClientStatusFilter('All Statuses');
                      setClientIndustryFilter('All Industries');
                    }}
                    className="mt-2 px-3 py-1.5 bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold text-xs rounded-lg transition"
                  >
                    Reset Client Filters
                  </button>
                </div>
              ) : getViewMode('clients') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[800px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[220px]">Company & Project</th>
                          <th className="py-3 px-4 min-w-[170px]">Industry & Type</th>
                          <th className="py-3 px-4 min-w-[200px]">Primary Contact</th>
                          <th className="py-3 px-4 min-w-[180px]">Financials (Quotation & Payments)</th>
                          <th className="py-3 px-4 min-w-[130px]">MOU Status</th>
                          <th className="py-3 px-4 text-right min-w-[120px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredClients.map((c) => (
                          <tr
                            key={c.id}
                            className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">{c.name}</span>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className="text-[11px] text-[#64748B] font-mono">{c.id}</span>
                                {c.project && (
                                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                                    Project: {c.project}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                {c.industry}
                              </span>
                              {c.type && (
                                <span className="block text-[11px] text-slate-500 font-medium mt-1">
                                  {c.type}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#0F172A] block text-xs">{c.contactPerson}</span>
                              <span className="text-[11px] text-[#64748B] block break-all mt-0.5">{c.email}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5 text-xs">
                                <p className="font-bold text-[#0F172A]">
                                  <span className="text-[10px] text-[#64748B] font-semibold mr-1">Quotation:</span>
                                  {c.contractValue}
                                </p>
                                {c.amountPaid && (
                                  <p className="text-emerald-700 font-bold text-[11px]">
                                    <span className="text-[10px] text-emerald-800 font-semibold mr-1">Received:</span>
                                    {c.amountPaid}
                                  </p>
                                )}
                                {c.balanceDue && (
                                  <p className="text-amber-700 font-bold text-[11px]">
                                    <span className="text-[10px] text-amber-800 font-semibold mr-1">Due:</span>
                                    {c.balanceDue}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                c.mouStatus === 'Active MOU' || c.mouStatus === 'MOU Signed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : c.mouStatus === 'Collaborator Partner'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <span>{c.mouStatus}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1 text-[#64748B]">
                                <button 
                                  onClick={() => setRightPanel({
                                    isOpen: true,
                                    type: 'crm-item',
                                    title: c.name,
                                    data: c
                                  })}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Open Workspace"
                                >
                                  <ExternalLink size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setClientForm(c);
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'edit-client',
                                      title: `Edit: ${c.name}`,
                                      data: c
                                    });
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Edit Client"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (window.confirm(`Are you sure you want to delete "${c.name}"?`)) {
                                      await deleteClientFromDb(c.id);
                                      const updated = crmClients.filter(item => item.id !== c.id);
                                      setCrmClients(updated);
                                      saveStoredClients(updated);
                                      toast.success(`Deleted catalog account: ${c.name}`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Delete Account"
                                >
                                  <Trash2 size={14} />
                                </button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredClients.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            c.mouStatus === 'Active MOU' || c.mouStatus === 'MOU Signed'
                              ? 'bg-emerald-600 text-white'
                              : c.mouStatus === 'Collaborator Partner'
                              ? 'bg-blue-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}>
                            {c.mouStatus}
                          </span>
                          <span className="font-mono text-xs text-[#64748B]">{c.id}</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg text-[#0F172A] break-words">{c.name}</h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-[#64748B]">{c.industry}</span>
                            {c.type && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                                {c.type}
                              </span>
                            )}
                          </div>
                          {c.project && (
                            <div className="mt-2 text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">
                              Project: {c.project}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1.5 text-[#475569]">
                          <p><span className="font-semibold text-black">Contact:</span> {c.contactPerson}</p>
                          <p className="break-all"><span className="font-semibold text-black">Email:</span> {c.email}</p>
                          <div className="pt-1.5 border-t border-dashed border-slate-200 space-y-1">
                            <p className="flex justify-between items-center">
                              <span className="font-semibold text-black">Quotation / Contract:</span>
                              <span className="font-mono font-bold text-slate-900">{c.contractValue}</span>
                            </p>
                            {c.amountPaid && (
                              <p className="flex justify-between items-center text-emerald-700">
                                <span className="font-semibold">Received:</span>
                                <span className="font-mono font-bold">{c.amountPaid}</span>
                              </p>
                            )}
                            {c.balanceDue && (
                              <p className="flex justify-between items-center text-amber-700">
                                <span className="font-semibold">Balance Due:</span>
                                <span className="font-mono font-bold">{c.balanceDue}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                        <button 
                          onClick={() => {
                            setClientForm(c);
                            setRightPanel({
                              isOpen: true,
                              type: 'edit-client',
                              title: `Edit: ${c.name}`,
                              data: c
                            });
                          }}
                          className="flex-1 py-2 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'crm-item',
                            title: c.name,
                            data: c
                          })}
                          className="flex-1 py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Workspace</span>
                          <ArrowUpRight size={12} />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete "${c.name}"?`)) {
                              await deleteClientFromDb(c.id);
                              const updated = crmClients.filter(item => item.id !== c.id);
                              setCrmClients(updated);
                              saveStoredClients(updated);
                              toast.success(`Deleted partner account: ${c.name}`);
                            }
                          }}
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-black border border-[#CBD5E1] text-xs font-bold transition flex items-center justify-center cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: FOUNDERS & EMPLOYEES (Reference Image 2: Company)            */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'staff' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Users size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Founders & Employees
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Leadership and core team members ({staffMembers.length} active) • Editable in MySQL Database
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="staff" defaultMode="list" />
                  <button
                    onClick={() => {
                      setStaffForm(getPopulatedStaffForm());
                      setRightPanel({
                        isOpen: true,
                        type: 'add-staff',
                        title: 'Add Founder / Employee'
                      });
                    }}
                    className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Employee</span>
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('staff')}

              {/* Founders & Employees Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      placeholder="Search team members by name, role, ID, email..."
                      className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
                    />
                    {staffSearch && (
                      <button 
                        type="button"
                        onClick={() => setStaffSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="w-full sm:w-auto min-w-[170px]">
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={staffDeptFilter}
                        onChange={(e) => setStaffDeptFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableStaffDepts.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto min-w-[140px]">
                    <div className="relative">
                      <CheckSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={staffStatusFilter}
                        onChange={(e) => setStaffStatusFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableStaffStatuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  {(staffSearch || staffDeptFilter !== 'All Departments' || staffStatusFilter !== 'All Statuses') && (
                    <button
                      type="button"
                      onClick={() => {
                        setStaffSearch('');
                        setStaffDeptFilter('All Departments');
                        setStaffStatusFilter('All Statuses');
                      }}
                      className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Showing <b>{filteredStaff.length}</b> of <b>{staffMembers.length}</b> founders & core team members</span>
                  {(staffSearch || staffDeptFilter !== 'All Departments' || staffStatusFilter !== 'All Statuses') && (
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Filtered View Active
                    </span>
                  )}
                </div>
              </div>

              {filteredStaff.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No team members match your search or filter</p>
                  <p className="text-xs text-slate-400">Try adjusting your keywords or department filter</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStaffSearch('');
                      setStaffDeptFilter('All Departments');
                      setStaffStatusFilter('All Statuses');
                    }}
                    className="mt-2 px-3 py-1.5 bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold text-xs rounded-lg transition"
                  >
                    Reset Staff Filters
                  </button>
                </div>
              ) : getViewMode('staff') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[850px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[200px]">Team Member & ID</th>
                          <th className="py-3 px-4 min-w-[150px]">Role / Title</th>
                          <th className="py-3 px-4 min-w-[140px]">Department</th>
                          <th className="py-3 px-4 min-w-[180px]">Contact Info</th>
                          <th className="py-3 px-4 min-w-[180px]">Settlement & Socials</th>
                          <th className="py-3 px-4 min-w-[100px]">Status</th>
                          <th className="py-3 px-4 text-right min-w-[120px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStaff.map((member) => (
                          <tr
                            key={member.id || member.emp_id}
                            onClick={() => {
                              setStaffForm(getPopulatedStaffForm(member));
                              setRightPanel({
                                isOpen: true,
                                type: 'view-staff',
                                title: `Profile: ${member.name}`,
                                data: member
                              });
                            }}
                            className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">{member.name}</span>
                              <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">{member.emp_id || 'STAFF'}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                {member.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-xs text-[#0F172A]">
                              {member.department || 'Operations'}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="text-xs text-[#0F172A] font-medium block break-all">{member.email}</span>
                              <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">{member.phone || '+91 94432 10000'}</span>
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="space-y-1.5">
                                {member.account_no || member.upi_link ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CreditCard size={11} />
                                    <span>Bank/UPI Linked</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                    <CreditCard size={11} />
                                    <span>Details Pending</span>
                                  </span>
                                )}

                                <div className="flex items-center gap-1 text-slate-400">
                                  {member.instagram && (
                                    <a
                                      href={member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram.replace(/^@/, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 hover:text-pink-600 transition"
                                      title="Instagram"
                                    >
                                      <Instagram size={13} />
                                    </a>
                                  )}
                                  {member.facebook && (
                                    <a
                                      href={member.facebook.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 hover:text-blue-600 transition"
                                      title="Facebook"
                                    >
                                      <Facebook size={13} />
                                    </a>
                                  )}
                                  {member.linkedin && (
                                    <a
                                      href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 hover:text-blue-700 transition"
                                      title="LinkedIn"
                                    >
                                      <Linkedin size={13} />
                                    </a>
                                  )}
                                  {member.portfolio && (
                                    <a
                                      href={member.portfolio.startsWith('http') ? member.portfolio : `https://${member.portfolio}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 hover:text-indigo-600 transition"
                                      title="Portfolio / Website"
                                    >
                                      <Globe size={13} />
                                    </a>
                                  )}
                                  {member.scanner_image && (
                                    <span
                                      className="p-1 text-emerald-600 hover:scale-110 transition cursor-pointer"
                                      title="Payment Scanner QR Available"
                                      onClick={() => {
                                        setStaffForm(getPopulatedStaffForm(member));
                                        setRightPanel({
                                          isOpen: true,
                                          type: 'view-staff',
                                          title: `Profile: ${member.name}`,
                                          data: member
                                        });
                                      }}
                                    >
                                      <QrCode size={13} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                <span>{member.status || 'Active'}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1 text-[#64748B]">
                                <button
                                  onClick={() => {
                                    setStaffForm(getPopulatedStaffForm(member));
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'view-staff',
                                      title: `Profile: ${member.name}`,
                                      data: member
                                    });
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                                  title="View Full Profile & Bank Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setStaffForm(getPopulatedStaffForm(member));
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'edit-staff',
                                      title: `Edit: ${member.name} (${member.role})`,
                                      data: member
                                    });
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition cursor-pointer"
                                  title="Edit Member"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Are you sure you want to delete ${member.name} from Founders & Employees?`)) {
                                      await deleteStaffInDb(member.id || member.emp_id);
                                      setStaffMembers(prev => prev.filter(m => (m.id !== member.id && m.emp_id !== member.emp_id)));
                                      toast.success(`Removed ${member.name}`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Member"
                                >
                                  <Trash2 size={14} />
                                </button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStaff.map((member) => (
                    <div 
                      key={member.id || member.emp_id} 
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#000000] text-white font-mono">
                            {member.emp_id || 'STAFF'}
                          </span>
                          <span className="border border-slate-200 bg-slate-50 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {member.status || 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-black text-white font-black text-base flex items-center justify-center shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-base text-[#0F172A] break-words">
                              {member.name}
                            </h4>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 break-words">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] text-xs space-y-1.5 text-[#475569]">
                          <p className="flex items-center gap-1.5 flex-wrap">
                            <Building2 size={13} className="text-[#64748B] shrink-0" />
                            <span className="text-[#64748B]">Dept:</span> 
                            <span className="font-semibold text-black break-words">{member.department || 'Operations'}</span>
                          </p>
                          <p className="flex items-center gap-1.5 flex-wrap">
                            <Mail size={13} className="text-[#64748B] shrink-0" />
                            <span className="text-[#0F172A] break-all">{member.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono">
                            <Phone size={13} className="text-[#64748B] shrink-0" />
                            <span>{member.phone || '+91 94432 10000'}</span>
                          </p>
                        </div>

                        {/* Settlement Status & QR Badge */}
                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                          {member.account_no || member.upi_link ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CreditCard size={11} />
                              <span>Bank/UPI Linked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              <CreditCard size={11} />
                              <span>Bank Pending</span>
                            </span>
                          )}

                          {member.scanner_image && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                              <QrCode size={10} />
                              <span>QR</span>
                            </span>
                          )}
                        </div>

                        {/* Social Links Row */}
                        <div className="flex items-center gap-2 pt-1 text-slate-500">
                          {member.instagram && (
                            <a
                              href={member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram.replace(/^@/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-pink-600 transition"
                              title="Instagram"
                            >
                              <Instagram size={14} />
                            </a>
                          )}
                          {member.facebook && (
                            <a
                              href={member.facebook.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-blue-600 transition"
                              title="Facebook"
                            >
                              <Facebook size={14} />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-blue-700 transition"
                              title="LinkedIn"
                            >
                              <Linkedin size={14} />
                            </a>
                          )}
                          {member.portfolio && (
                            <a
                              href={member.portfolio.startsWith('http') ? member.portfolio : `https://${member.portfolio}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-indigo-600 transition"
                              title="Portfolio"
                            >
                              <Globe size={14} />
                            </a>
                          )}
                          {Array.isArray(member.other_socials) && member.other_socials.length > 0 && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              +{member.other_socials.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                        <button
                          onClick={() => {
                            setStaffForm(getPopulatedStaffForm(member));
                            setRightPanel({
                              isOpen: true,
                              type: 'view-staff',
                              title: `Profile: ${member.name}`,
                              data: member
                            });
                          }}
                          className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => {
                            setStaffForm(getPopulatedStaffForm(member));
                            setRightPanel({
                              isOpen: true,
                              type: 'edit-staff',
                              title: `Edit: ${member.name} (${member.role})`,
                              data: member
                            });
                          }}
                          className="flex-1 py-2 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete ${member.name} from Founders & Employees?`)) {
                              await deleteStaffInDb(member.id || member.emp_id);
                              setStaffMembers(prev => prev.filter(m => (m.id !== member.id && m.emp_id !== member.emp_id)));
                              toast.success(`Removed ${member.name}`);
                            }
                          }}
                          className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#CBD5E1] transition cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: STUDENT REPORTS (Reference Image 2: Students -> Reports)      */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'reports' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <BarChart2 size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Cohort Evaluation & Performance Reports
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Academic progress reports, attendance compliance, and capstone milestones for registered cohort
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ViewSwitcher tab="reports" defaultMode="list" />
                  <button
                    type="button"
                    onClick={() => toast.success('Exporting full batch evaluation dossier as PDF...')}
                    className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Export Dossier (PDF)</span>
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('reports', true)}

              {/* 4 Metric Highlights - Minimal 2-Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Average Attendance</span>
                  <div className="text-3xl font-black text-[#0F172A]">96.2%</div>
                  <p className="text-[11px] text-[#64748B]">{students.length} Active Students in Cohort</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Average Assessment Score</span>
                  <div className="text-3xl font-black text-[#0F172A]">94.6 / 100</div>
                  <p className="text-[11px] text-[#64748B]">Class Median: 95.0</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Capstone Completion</span>
                  <div className="text-3xl font-black text-[#0F172A]">100%</div>
                  <p className="text-[11px] text-[#64748B]">All {students.length} Projects Submitted</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Distinction Pass Rate</span>
                  <div className="text-3xl font-black text-[#0F172A]">100%</div>
                  <p className="text-[11px] text-[#64748B]">All Students &ge; 90%</p>
                </div>
              </div>

              {/* Filter Bar */}
              {renderFilterBar({ showPayment: false, showStatus: false, countLabel: 'evaluation records' })}

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-700">No evaluation dossiers match your filter</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the college or specialization track filter.</p>
                </div>
              ) : getViewMode('reports') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-3 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                    <table className="w-full min-w-[800px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[200px]">Roll & Name</th>
                          <th className="py-3 px-4 min-w-[200px]">College & Degree</th>
                          <th className="py-3 px-4 min-w-[140px]">Track</th>
                          <th className="py-3 px-4 min-w-[120px]">Attendance</th>
                          <th className="py-3 px-4 min-w-[130px]">Evaluation Score</th>
                          <th className="py-3 px-4 min-w-[120px]">Milestone</th>
                          <th className="py-3 px-4 text-right min-w-[110px]">Dossier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-[#F8FAFC] transition group cursor-pointer" onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'student-report',
                            title: `Student Dossier: ${s.name}`,
                            data: s
                          })}>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-[#0F172A] text-sm block group-hover:text-black">{s.name}</span>
                              <span className="font-mono text-[11px] text-[#64748B] block mt-0.5">{s.id}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#0F172A] block">{s.college}</span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">{s.degree}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                {s.domain}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-xs text-[#0F172A] block">{s.attendance || 95}%</span>
                              <div className="h-1.5 w-20 bg-[#E2E8F0] rounded-full overflow-hidden mt-1">
                                <div className="h-full bg-black rounded-full" style={{ width: `${s.attendance || 95}%` }} />
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-xs text-[#0F172A] block">{s.score || 95} / 100</span>
                              <div className="h-1.5 w-20 bg-[#E2E8F0] rounded-full overflow-hidden mt-1">
                                <div className="h-full bg-black rounded-full" style={{ width: `${s.score || 95}%` }} />
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border border-slate-300 bg-slate-50 text-slate-800">
                                Distinction
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setRightPanel({
                                  isOpen: true,
                                  type: 'student-report',
                                  title: `Student Dossier: ${s.name}`,
                                  data: s
                                })}
                                className="px-3 py-1.5 rounded-lg bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                              >
                                Dossier ↗
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'student-report',
                        title: `Student Dossier: ${s.name}`,
                        data: s
                      })}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {s.id}
                          </span>
                          <span className="border border-slate-200 bg-slate-50 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Distinction
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A] break-words">{s.name}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5 break-words">{s.college}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Score:</span>
                            <span className="font-bold text-[#0F172A]">{s.score || 95}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${s.score || 95}%` }} />
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-[#64748B]">Attendance:</span>
                            <span className="font-bold text-[#0F172A]">{s.attendance || 95}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9]" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setRightPanel({
                            isOpen: true,
                            type: 'student-report',
                            title: `Student Dossier: ${s.name}`,
                            data: s
                          })}
                          className="w-full py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Open Dossier</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: PAYMENTS & DUE (Reference Image 2: Students -> Payments & Due) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'student-payments' && (() => {
            const totalCohortFee = students.reduce((acc, s) => {
              const num = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
              return acc + num;
            }, 0);
            const totalCohortCollected = students.reduce((acc, s) => {
              const num = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
              return acc + num;
            }, 0);
            const totalCohortDues = Math.max(0, totalCohortFee - totalCohortCollected);
            const collectionPercent = totalCohortFee > 0 ? Math.round((totalCohortCollected / totalCohortFee) * 100) : 0;

            return (
              <div className="space-y-5 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                        <Wallet size={18} />
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                        Student Payments & Outstanding Dues
                      </h1>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Fee settlements, tuition collection registers, and balance records for registered candidates
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ViewSwitcher tab="student-payments" defaultMode="list" />
                    <button
                      type="button"
                      onClick={() => toast.success('Generated fee settlement statement!')}
                      className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Export Register</span>
                    </button>
                  </div>
                </div>

                {renderPaneAnalytics('student-payments')}

                {/* Dynamic Fee Summary Cards (Strict 2-Color Minimal) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Cohort Fee</span>
                    <div className="text-3xl font-black text-[#0F172A]">₹{totalCohortFee.toLocaleString('en-IN')}</div>
                    <p className="text-[11px] text-[#64748B]">{students.length} Registered Candidates • Live Program Total</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Collected & Verified</span>
                    <div className="text-3xl font-black text-[#0F172A]">₹{totalCohortCollected.toLocaleString('en-IN')}</div>
                    <p className="text-[11px] text-[#64748B]">{collectionPercent}% Realized</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Outstanding Dues</span>
                    <div className="text-3xl font-black text-[#0F172A]">
                      ₹{totalCohortDues.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-[#64748B]">{totalCohortDues === 0 ? 'Zero Pending Dues' : 'Balance Pending Follow-up'}</p>
                  </div>
                </div>

                {/* Filter Bar */}
                {renderFilterBar({ showStatus: false, countLabel: 'candidate fee accounts' })}

                {/* Bulk Payment Bar */}
                {renderBulkPaymentBar()}

                {/* Switchable Views */}
                {getViewMode('student-payments', 'list') === 'list' ? (
                  /* Minimal 2-Color Table (List View) */
                  <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full min-w-[800px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                                onChange={() => toggleSelectAllStudents(filteredStudents)}
                                className="rounded cursor-pointer accent-black"
                                title="Select All Students"
                              />
                            </th>
                            <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                            <th className="py-3 px-4">TYPE</th>
                            <th className="py-3 px-4">TOTAL FEE</th>
                            <th className="py-3 px-4">AMOUNT PAID</th>
                            <th className="py-3 px-4">DUE & CAPACITY</th>
                            <th className="py-3 px-4">STATUS</th>
                            <th className="py-3 px-4 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-[#64748B]">
                                <p className="font-bold text-sm text-[#0F172A]">No payment accounts match your filters</p>
                                <p className="text-xs text-[#64748B] mt-1">Try resetting the college, track, or payment status filters.</p>
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((s) => {
                              const totalNum = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
                              const paidNum = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                              const dueNum = Math.max(0, totalNum - paidNum);
                              const paidPercent = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 100;

                              return (
                                <tr 
                                  key={s.id} 
                                  className={`hover:bg-[#F8FAFC] transition ${selectedStudentIds.includes(s.id) ? 'bg-[#F8FAFC]' : ''}`}
                                >
                                  <td className="py-3.5 px-4 text-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedStudentIds.includes(s.id)}
                                      onChange={() => toggleSelectStudent(s.id)}
                                      className="rounded cursor-pointer accent-black"
                                    />
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="font-bold text-sm text-[#0F172A] block">{s.name}</span>
                                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                                      Batch: {s.id} • {s.college}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                      {s.domain || 'INTERNSHIP'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                                    {s.feeTotal || 'To Be Decided by Admin'}
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                                    {s.feePaid || '₹0'}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-1 min-w-[110px]">
                                      <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                        <span>₹{dueNum.toLocaleString('en-IN')}</span>
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
                                      <span>{s.paymentStatus || (dueNum === 0 ? 'Cleared' : 'Pending')}</span>
                                      <ChevronDown size={12} className="text-[#64748B]" />
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditStudentForm(s);
                                          setRightPanel({
                                            isOpen: true,
                                            type: 'edit-student',
                                            title: `Edit Payment: ${s.name}`,
                                            data: s
                                          });
                                        }}
                                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                        title="Edit Payment"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => toast.success(`Receipt downloaded for ${s.name}`)}
                                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                        title="Download Receipt"
                                      >
                                        <Download size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteStudent(s.id, s.name)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                        title="Delete Student from entire ERP"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Small Icons / Card Box Grid (Grid View) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredStudents.map((s) => {
                      const totalNum = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
                      const paidNum = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                      const dueNum = Math.max(0, totalNum - paidNum);
                      const paidPercent = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 100;

                      return (
                        <div
                          key={s.id}
                          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                                {s.id}
                              </span>
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#0F172A]">
                                <span>{s.paymentStatus || (dueNum === 0 ? 'Cleared' : 'Pending')}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-bold text-base text-[#0F172A] break-words">{s.name}</h4>
                              <p className="text-xs text-[#64748B] mt-0.5 break-words">{s.college}</p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#64748B]">Total Fee:</span>
                                <span className="font-bold text-[#0F172A]">{s.feeTotal || 'To Be Decided by Admin'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#64748B]">Amount Paid:</span>
                                <span className="font-bold text-[#0F172A]">{s.feePaid || '₹0'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#64748B]">Due Balance:</span>
                                <span className="font-bold text-[#0F172A]">₹{dueNum.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                                <div className="h-full bg-black rounded-full" style={{ width: `${paidPercent}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditStudentForm(s);
                                setRightPanel({
                                  isOpen: true,
                                  type: 'edit-student',
                                  title: `Edit Payment: ${s.name}`,
                                  data: s
                                });
                              }}
                              className="flex-1 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.success(`Receipt downloaded for ${s.name}`)}
                              className="flex-1 py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Download size={13} />
                              <span>Receipt</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-[#E2E8F0] transition cursor-pointer"
                              title="Delete Student from entire ERP"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: FINANCE: PAYMENTS (Reference Image 2: Finance -> Payments)   */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'finance-payments' || activeTab === 'billing') && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <IndianRupee size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Finance & Payments Ledger
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Company revenue realization, corporate client billings, and tuition accounting ledger
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ViewSwitcher tab="finance-payments" defaultMode="list" />
                  <button
                    onClick={() => {
                      setPaymentForm({
                        id: `INV-2026-0${paymentsList.length + 90}`,
                        payer: '',
                        type: 'Milestone Sprint Payment',
                        amount: '₹1,50,000',
                        method: 'Wire Transfer',
                        status: 'Cleared'
                      });
                      setRightPanel({
                        isOpen: true,
                        type: 'add-payment',
                        title: 'Record New Financial Payment'
                      });
                    }}
                    className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Record Payment</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Export Statement</span>
                  </button>
                </div>
              </div>

              {renderPaneAnalytics('finance-payments')}

              {/* Financial Metrics (Strict 2-Color Minimal) */}
              {(() => {
                const cohortInvoiced = students.reduce((acc, s) => acc + (parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);
                const cohortRealized = students.reduce((acc, s) => acc + (parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0), 0);
                const cohortOutstanding = Math.max(0, cohortInvoiced - cohortRealized);

                // Real Corporate Quotations & Payments (Arrox Tech: Quotation 15,000, Received 8,000)
                const corporateInvoiced = crmClients.reduce((acc, c) => {
                  const val = c.quotationAmount || parseInt(String(c.contractValue || c.contract_value || '0').replace(/[^0-9]/g, ''), 10) || 0;
                  return acc + val;
                }, 0);
                const corporateRealized = crmClients.reduce((acc, c) => {
                  const val = c.receivedAmount || parseInt(String(c.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                  return acc + val;
                }, 0);
                const corporateOutstanding = Math.max(0, corporateInvoiced - corporateRealized);

                const totalAllInvoiced = cohortInvoiced + corporateInvoiced;
                const totalAllRealized = cohortRealized + corporateRealized;
                const totalAllOutstanding = cohortOutstanding + corporateOutstanding;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Invoiced</span>
                      <div className="text-3xl font-black text-[#0F172A]">₹{totalAllInvoiced.toLocaleString('en-IN')}</div>
                      <p className="text-[11px] text-[#64748B]">Cohort (₹{cohortInvoiced.toLocaleString('en-IN')}) + Arrox (₹{corporateInvoiced.toLocaleString('en-IN')})</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Realized & Cleared</span>
                      <div className="text-3xl font-black text-[#0F172A]">₹{totalAllRealized.toLocaleString('en-IN')}</div>
                      <p className="text-[11px] text-[#64748B]">Arrox Received (₹{corporateRealized.toLocaleString('en-IN')}) + Student Fees</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Corporate & Collaborators</span>
                      <div className="text-3xl font-black text-[#0F172A]">{crmClients.length} Accounts</div>
                      <p className="text-[11px] text-[#64748B]">Arrox (Client) • ZyrFlow & Pivilis (Collaborators)</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Outstanding Due</span>
                      <div className="text-3xl font-black text-[#0F172A]">₹{totalAllOutstanding.toLocaleString('en-IN')}</div>
                      <p className="text-[11px] text-[#64748B]">Arrox Balance: ₹{corporateOutstanding.toLocaleString('en-IN')} • Cohort: ₹{cohortOutstanding.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Finance Payments Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={financeSearch}
                      onChange={(e) => setFinanceSearch(e.target.value)}
                      placeholder="Search receipts, payers, invoice IDs, methods..."
                      className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
                    />
                    {financeSearch && (
                      <button 
                        type="button"
                        onClick={() => setFinanceSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="w-full sm:w-auto min-w-[150px]">
                    <div className="relative">
                      <CheckSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={financeStatusFilter}
                        onChange={(e) => setFinanceStatusFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableFinanceStatuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto min-w-[170px]">
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <select
                        value={financeMethodFilter}
                        onChange={(e) => setFinanceMethodFilter(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer appearance-none"
                      >
                        {availableFinanceMethods.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                  </div>

                  {(financeSearch || financeStatusFilter !== 'All Statuses' || financeMethodFilter !== 'All Methods') && (
                    <button
                      type="button"
                      onClick={() => {
                        setFinanceSearch('');
                        setFinanceStatusFilter('All Statuses');
                        setFinanceMethodFilter('All Methods');
                      }}
                      className="px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#F1F5F9]">
                  <span>Showing <b>{filteredFinancePayments.length}</b> of <b>{paymentsList.length}</b> ledger entries</span>
                </div>
              </div>

              {/* Transactions Table / Grid with ViewSwitcher */}
              {getViewMode('finance-payments', 'list') === 'list' ? (
                /* Minimal 2-Color Table (List View) */
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                          <th className="py-3 px-4">TYPE</th>
                          <th className="py-3 px-4">SCHEDULE & DURATION</th>
                          <th className="py-3 px-4">FEE (₹)</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {filteredFinancePayments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-[#64748B]">
                              <p className="font-bold text-sm text-[#0F172A]">No payment receipts match your filter</p>
                              <p className="text-xs text-[#64748B] mt-1">Try resetting the status or payment method filter.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredFinancePayments.map((tx: any, idx: number) => (
                            <tr key={idx} className="hover:bg-[#F8FAFC] transition">
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-sm text-[#0F172A] block">{tx.payer}</span>
                                <span className="font-mono text-[11px] text-[#64748B] block mt-0.5">
                                  Batch: {tx.id}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                  {tx.type}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                                <span className="font-semibold block">{tx.method}</span>
                                <span className="text-[11px] text-[#64748B] block">Settled</span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">
                                {tx.amount}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                  <span>{tx.status}</span>
                                  <ChevronDown size={12} className="text-[#64748B]" />
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStatus = tx.status === 'Cleared' ? 'Pending' : 'Cleared';
                                      const updated = paymentsList.map((p) => p.id === tx.id ? { ...p, status: newStatus } : p);
                                      setPaymentsList(updated);
                                      toast.success(`Updated receipt ${tx.id} status to ${newStatus}`);
                                    }}
                                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                    title="Toggle Status"
                                  >
                                    <ExternalLink size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = paymentsList.filter((p) => p.id !== tx.id);
                                      setPaymentsList(updated);
                                      toast.success(`Removed receipt ${tx.id}`);
                                    }}
                                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                    title="Delete receipt entry"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Small Icons / Card Box Grid (Grid View) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredFinancePayments.map((tx: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                            {tx.id}
                          </span>
                          <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                            {tx.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-[#0F172A] break-words">{tx.payer}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5 break-words">{tx.type}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Amount:</span>
                            <span className="font-bold text-[#0F172A]">{tx.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Method:</span>
                            <span className="font-semibold text-[#0F172A]">{tx.method}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = tx.status === 'Cleared' ? 'Pending' : 'Cleared';
                            const updated = paymentsList.map((p) => p.id === tx.id ? { ...p, status: newStatus } : p);
                            setPaymentsList(updated);
                            toast.success(`Updated receipt ${tx.id} status to ${newStatus}`);
                          }}
                          className="flex-1 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-bold text-xs transition cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = paymentsList.filter((p) => p.id !== tx.id);
                            setPaymentsList(updated);
                            toast.success(`Removed receipt ${tx.id}`);
                          }}
                          className="p-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Student Tuition & Cohort Fee Ledger (Minimal 2-Color Table) */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0F172A]">
                      Student Tuition & Fee Ledger (Admin Editable)
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Direct manual updation of Program Fee, Amount Paid, Due Balance, and Payment Status
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]">
                    {students.length} Enrolled Candidates
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                        <th className="py-3 px-4">TYPE</th>
                        <th className="py-3 px-4">FEE (₹)</th>
                        <th className="py-3 px-4">AMOUNT PAID</th>
                        <th className="py-3 px-4">ENROLLMENT CAPACITY</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {students.map((s) => {
                        const totalNum = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
                        const paidNum = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                        const dueNum = Math.max(0, totalNum - paidNum);
                        const paidPercent = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 100;

                        return (
                          <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-sm text-[#0F172A] block">{s.name}</span>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">
                                Batch: {s.studentId || s.id}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                {s.domain || 'INTERNSHIP'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">{s.feeTotal || 'To Be Decided by Admin'}</td>
                            <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">{s.feePaid || '₹0'}</td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 min-w-[110px]">
                                <div className="text-xs font-bold text-[#0F172A] flex justify-between">
                                  <span>₹{dueNum.toLocaleString('en-IN')} Due</span>
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
                                <span>{s.paymentStatus || (dueNum === 0 ? 'Active' : 'Pending')}</span>
                                <ChevronDown size={12} className="text-[#64748B]" />
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditStudentForm(s);
                                    setRightPanel({
                                      isOpen: true,
                                      type: 'edit-student',
                                      title: `Edit Finance & Tuition: ${s.name}`
                                    });
                                  }}
                                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                  title="Edit Fee"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: CERTIFICATES - OFFER LETTERS & COMPLETIONS (Reference Image 2)*/}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'offer-letters' || activeTab === 'cert-course' || activeTab === 'cert-internship' || activeTab === 'cert-attendance' || activeTab === 'cert-project' || activeTab === 'certificates' || activeTab === 'document-generator') && (() => {
            const isOfferTab = activeTab === 'offer-letters';
            const isCertCourseTab = activeTab === 'cert-course';
            const isCertInternshipTab = activeTab === 'cert-internship';
            const isCertAttendanceTab = activeTab === 'cert-attendance';

            const filteredCertStudents = students.filter(s => {
              const q = certSearch.toLowerCase().trim();
              const matchesSearch = !q ||
                s.name.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q) ||
                (s.certId && s.certId.toLowerCase().includes(q)) ||
                (s.offerNo && s.offerNo.toLowerCase().includes(q)) ||
                (s.college && s.college.toLowerCase().includes(q)) ||
                (s.domain && s.domain.toLowerCase().includes(q)) ||
                (s.email && s.email.toLowerCase().includes(q)) ||
                (s.phone && s.phone.toLowerCase().includes(q));

              const matchesCollege = certCollegeFilter === 'All Colleges' || 
                normalizeCollege(s.college).toLowerCase() === normalizeCollege(certCollegeFilter).toLowerCase();

              const matchesDomain = certDomainFilter === 'All Domains' || 
                normalizeDomain(s.domain || s.course).toLowerCase() === normalizeDomain(certDomainFilter).toLowerCase();

              return matchesSearch && matchesCollege && matchesDomain;
            }).sort((a, b) => {
              if (certSortBy === 'name') return a.name.localeCompare(b.name);
              if (certSortBy === 'attendance') return (b.attendance || 0) - (a.attendance || 0);
              if (certSortBy === 'score') return (b.score || 0) - (a.score || 0);
              return a.id.localeCompare(b.id);
            });

            const uniqueColleges = ['All Colleges', ...Array.from(new Set(
              students.map(s => normalizeCollege(s.college)).filter(Boolean)
            )).sort()];
            const uniqueDomains = ['All Domains', ...Array.from(new Set(
              students.map(s => normalizeDomain(s.domain || s.course)).filter(Boolean)
            )).sort()];
            const isCertFiltered = certSearch || certCollegeFilter !== 'All Colleges' || certDomainFilter !== 'All Domains' || certSortBy !== 'id';

            return (
              <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
                {/* Header Title & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                        <Award size={18} />
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                        {isOfferTab ? 'Official Offer Letter Management' :
                         isCertCourseTab ? 'Course Completion Certificates' :
                         isCertInternshipTab ? 'Industrial Internship Certificates' :
                         isCertAttendanceTab ? 'Official Attendance Certificates Studio' :
                         'Certificates & Offer Letters Studio'}
                      </h1>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 font-medium">
                      Canonical 1:1 ID sync (AT-IC-XXX-2026 / ATIDETO/2026/INT) • MSME UDYAM-TN-20-0242534 Verified • High-Res 300DPI & Vector PDF
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <ViewSwitcher tab="certificates" defaultMode="list" />
                    <button
                      type="button"
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'certificate-generator',
                        mode: 'certificate',
                        title: 'Completion Certificate Studio',
                        data: filteredCertStudents[0] || students[0]
                      })}
                      className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Award size={14} />
                      <span>Certificate Studio ↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'offer-letter-generator',
                        mode: 'offer-letter',
                        title: 'Offer Letter Studio',
                        data: filteredCertStudents[0] || students[0]
                      })}
                      className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Briefcase size={14} />
                      <span>Offer Letter Studio ↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRightPanel({
                        isOpen: true,
                        type: 'attendance-generator',
                        mode: 'attendance',
                        title: 'Attendance Certificate Studio',
                        data: filteredCertStudents[0] || students[0]
                      })}
                      className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <CalendarCheck size={14} />
                      <span>Attendance Studio</span>
                    </button>

                    <a
                      href="/verify"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      <span>Verify Portal</span>
                    </a>
                  </div>
                </div>

                {renderPaneAnalytics('certificates')}

                {/* 4 Metric Highlights (Strict 2-Color Minimal) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Enrolled Cohort</span>
                    <div className="text-2xl font-black text-[#0F172A]">{students.length} Candidates</div>
                    <p className="text-[11px] text-[#64748B]">15 MEC IT + 6 MCE CSE</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Completion Certificates</span>
                    <div className="text-2xl font-black text-[#0F172A]">{students.length} Active</div>
                    <p className="text-[11px] text-[#64748B]">Tamper-Proof QR Validated</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Offer Letters Dispatched</span>
                    <div className="text-2xl font-black text-[#0F172A]">{students.length} Issued</div>
                    <p className="text-[11px] text-[#64748B]">With MD Seal & Signatures</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Government MSME Reg</span>
                    <div className="text-sm font-mono font-bold text-[#0F172A] pt-1">UDYAM-TN-20-0242534</div>
                    <p className="text-[11px] text-[#64748B]">Verified Online</p>
                  </div>
                </div>

                {/* Filter Toolbar for Certificates */}
                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={certSearch}
                        onChange={(e) => setCertSearch(e.target.value)}
                        placeholder="Search student, Reg ID, Cert ID, Offer No, College..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 font-semibold focus:outline-none focus:border-black transition"
                      />
                    </div>

                    {/* College Filter */}
                    <div className="w-full sm:w-auto min-w-[180px]">
                      <select
                        value={certCollegeFilter}
                        onChange={(e) => setCertCollegeFilter(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black cursor-pointer"
                      >
                        {uniqueColleges.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Domain Filter */}
                    <div className="w-full sm:w-auto min-w-[160px]">
                      <select
                        value={certDomainFilter}
                        onChange={(e) => setCertDomainFilter(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black cursor-pointer"
                      >
                        {uniqueDomains.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div className="w-full sm:w-auto min-w-[140px]">
                      <select
                        value={certSortBy}
                        onChange={(e) => setCertSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black cursor-pointer"
                      >
                        <option value="id">Sort: Student ID</option>
                        <option value="name">Sort: Candidate Name</option>
                        <option value="attendance">Sort: Attendance</option>
                        <option value="score">Sort: Score</option>
                      </select>
                    </div>

                    {/* Reset Button */}
                    {isCertFiltered && (
                      <button
                        type="button"
                        onClick={() => {
                          setCertSearch('');
                          setCertCollegeFilter('All Colleges');
                          setCertDomainFilter('All Domains');
                          setCertSortBy('id');
                        }}
                        className="px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                    <span>
                      Displaying <b>{filteredCertStudents.length}</b> of <b>{students.length}</b> verified candidate credentials
                    </span>
                  </div>
                </div>

                {/* Candidate Credentials Table / Grid Switchable */}
                {getViewMode('certificates', 'list') === 'list' ? (
                  /* Minimal 2-Color Table (List View) */
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4">PROGRAM TITLE & BATCH</th>
                            <th className="py-3 px-4">TYPE</th>
                            <th className="py-3 px-4">SCHEDULE & DURATION</th>
                            <th className="py-3 px-4">CERTIFICATE & OFFER</th>
                            <th className="py-3 px-4">STATUS</th>
                            <th className="py-3 px-4 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {filteredCertStudents.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-[#64748B]">
                                No candidates matched your search or filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredCertStudents.map((st) => (
                              <tr
                                key={st.id}
                                className="hover:bg-[#F8FAFC] transition"
                              >
                                {/* Program Title & Batch */}
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-sm text-[#0F172A] block">{st.name}</span>
                                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                                    Batch: {st.id} • {st.college}
                                  </span>
                                </td>

                                {/* Type Pill */}
                                <td className="py-3.5 px-4">
                                  <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                    {st.domain || 'INTERNSHIP'}
                                  </span>
                                </td>

                                {/* Schedule & Duration */}
                                <td className="py-3.5 px-4 text-[#0F172A] text-xs">
                                  <span className="font-semibold block">{st.startDate || '01 Sept 2026'}</span>
                                  <span className="text-[11px] text-[#64748B] block">{st.duration || '8 Weeks'}</span>
                                </td>

                                {/* Cert & Offer ID */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-[11px] font-bold text-[#0F172A]">
                                        {st.certId || 'AT-IC-GEN-2026-0000'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(st.certId);
                                          toast.success(`Copied Certificate ID: ${st.certId}`);
                                        }}
                                        className="p-1 hover:bg-[#F1F5F9] rounded text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                                        title="Copy Certificate ID"
                                      >
                                        <FileText size={11} />
                                      </button>
                                    </div>
                                    <p className="text-[10px] font-mono text-[#64748B]">
                                      {st.offerNo || 'ATIDETO/2026/INT/000'}
                                    </p>
                                  </div>
                                </td>

                                {/* Validation Status Pill */}
                                <td className="py-3.5 px-4">
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs">
                                    <span>
                                      {st.certHold ? 'On Hold' : st.certGenerated ? 'Active' : 'Pending'}
                                    </span>
                                    <ChevronDown size={12} className="text-[#64748B]" />
                                  </div>
                                </td>

                                {/* Ghost Action Icons */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setRightPanel({
                                        isOpen: true,
                                        type: 'certificate-generator',
                                        mode: 'certificate',
                                        title: `${st.certGenerated ? 'Regenerate Certificate' : 'Generate Certificate'}: ${st.name}`,
                                        data: st
                                      })}
                                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                      title={st.certGenerated ? 'Regenerate Certificate' : 'Generate Certificate'}
                                    >
                                      <Award size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRightPanel({
                                        isOpen: true,
                                        type: 'offer-letter-generator',
                                        mode: 'offer-letter',
                                        title: `Offer Letter: ${st.name}`,
                                        data: st
                                      })}
                                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                      title="Offer Letter"
                                    >
                                      <Briefcase size={14} />
                                    </button>
                                    <a
                                      href={`/verify?id=${encodeURIComponent(st.certId)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
                                      title="Public Verification"
                                    >
                                      <ExternalLink size={14} />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Small Icons / Card Box Grid (Grid View) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCertStudents.map((st) => (
                      <div
                        key={st.id}
                        className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-black transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
                              {st.id}
                            </span>
                            <span className="border border-[#E2E8F0] bg-white text-[#0F172A] px-2.5 py-0.5 rounded text-[10px] font-bold shadow-2xs">
                              {st.certHold ? 'On Hold' : st.certGenerated ? 'Active' : 'Pending'}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-base text-[#0F172A] break-words">{st.name}</h4>
                            <p className="text-xs text-[#64748B] mt-0.5 break-words">{st.college}</p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[#64748B]">Domain:</span>
                              <span className="font-bold text-[#0F172A] text-right">{st.domain || 'Internship'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#64748B]">Certificate ID:</span>
                              <span className="font-mono text-[10px] font-bold text-[#0F172A] break-all text-right">{st.certId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#64748B]">Offer No:</span>
                              <span className="font-mono text-[10px] text-[#64748B] break-all text-right">{st.offerNo}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setRightPanel({
                              isOpen: true,
                              type: 'certificate-generator',
                              mode: 'certificate',
                              title: `Certificate: ${st.name}`,
                              data: st
                            })}
                            className="flex-1 py-2 rounded-xl bg-[#000000] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Award size={13} />
                            <span>Certificate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRightPanel({
                              isOpen: true,
                              type: 'offer-letter-generator',
                              mode: 'offer-letter',
                              title: `Offer Letter: ${st.name}`,
                              data: st
                            })}
                            className="p-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-bold text-xs transition cursor-pointer"
                            title="Offer Letter"
                          >
                            <Briefcase size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: DATABASE OPERATIONS (Redesigned Neat & Simple)               */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {(activeTab === 'database-operations' || activeTab === 'live-server') && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
              
              {/* Header Title & Ping Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#000000] text-white">
                      <Database size={18} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                      Database Operations
                    </h1>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 font-medium">
                    Neat & Simple Live Relational Engine Console • MySQL 8.0 • atideto
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshDbStatus}
                    className="px-3.5 py-2 bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <RefreshCw size={13} className="text-[#0066FF]" />
                    <span>Ping Connection</span>
                  </button>
                </div>
              </div>

              {/* Clean Live Status Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Server size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00D26A] shadow-[0_0_8px_#00D26A]" />
                      <span className="font-extrabold text-sm text-[#0F172A]">Connected to MySQL 8.0 Live Engine</span>
                    </div>
                    <p className="font-mono text-xs text-[#64748B] mt-0.5">
                      Host: <strong className="text-[#0F172A]">localhost:3306</strong> • Database: <strong className="text-[#0066FF]">atideto</strong> • User: <strong className="text-[#0F172A]">root</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B]">Tables: </span>
                    <span className="font-bold text-[#0F172A]">{dbStatus?.tablesCount || 11}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B]">Students: </span>
                    <span className="font-bold text-[#0066FF]">{students.length}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B]">Staff: </span>
                    <span className="font-bold text-emerald-600">{staffMembers.length}</span>
                  </div>
                </div>
              </div>

              {/* Fast Table Switcher Chips */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
                  Quick Table Explorer (Click to View Live Records)
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'students', label: 'students', count: students.length },
                    { name: 'staff', label: 'staff (Founders & Employees)', count: staffMembers.length },
                    { name: 'clients', label: 'clients', count: crmClients.length },
                    { name: 'registrations', label: 'registrations', count: 3 },
                    { name: 'courses', label: 'courses', count: 12 },
                    { name: 'payments', label: 'payments', count: 4 },
                    { name: 'users', label: 'users', count: 6 }
                  ].map(tab => (
                    <button
                      key={tab.name}
                      onClick={() => {
                        setSelectedDbTable(tab.name);
                        const q = `SELECT * FROM ${tab.name} LIMIT 50;`;
                        setSqlQuery(q);
                        handleExecuteSql(q);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        selectedDbTable === tab.name
                          ? 'bg-[#000000] text-white shadow-sm'
                          : 'bg-white hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        selectedDbTable === tab.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple SQL Query Console */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                    SQL Query Runner
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[#94A3B8] font-medium mr-1">Quick Queries:</span>
                    {[
                      { label: 'All Students', q: 'SELECT student_id, name, email, phone, college, course, status FROM students;' },
                      { label: 'Founders & Staff', q: 'SELECT emp_id, name, role, department, email, phone FROM staff;' },
                      { label: 'Clients', q: 'SELECT id, name, industry, contact_person, mou_status FROM clients;' },
                      { label: 'Payments', q: 'SELECT * FROM payments;' }
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => {
                          setSqlQuery(p.q);
                          handleExecuteSql(p.q);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#0066FF] hover:text-white border border-[#E2E8F0] text-[11px] font-medium transition cursor-pointer text-[#475569]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    rows={2}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter SQL Query (e.g. SELECT * FROM students;)"
                    className="flex-1 p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#0066FF] focus:bg-white resize-none"
                  />
                  <button
                    onClick={() => handleExecuteSql()}
                    disabled={sqlLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 sm:self-stretch"
                  >
                    <Play size={14} className={sqlLoading ? 'animate-spin' : ''} />
                    <span>{sqlLoading ? 'Running...' : 'Execute'}</span>
                  </button>
                </div>

                {/* Results Viewer */}
                {sqlResult && (
                  <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">Result</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-[10px] font-bold">
                          {sqlResult.rowCount} rows
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#64748B] truncate max-w-[400px]">
                        {sqlResult.query}
                      </span>
                    </div>

                    {sqlResult.rows && sqlResult.rows.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] max-h-96 custom-scrollbar bg-white">
                        <table className="w-full text-left text-xs font-sans border-collapse">
                          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10 text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">
                            <tr>
                              <th className="p-2.5 font-mono text-slate-400 w-10">#</th>
                              {Object.keys(sqlResult.rows[0]).map((col) => (
                                <th key={col} className="p-2.5 font-mono whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {sqlResult.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-[#F8FAFC] transition">
                                <td className="p-2.5 font-mono text-[11px] text-slate-400">{rIdx + 1}</td>
                                {Object.values(row).map((val: any, cIdx) => (
                                  <td key={cIdx} className="p-2.5 whitespace-nowrap font-mono text-[11px] text-[#334155]">
                                    {typeof val === 'object' && val !== null 
                                      ? JSON.stringify(val) 
                                      : String(val ?? 'NULL')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
                        Query executed with 0 rows returned.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TAB: SYSTEM SETTINGS                                              */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">System Settings</h1>
                <p className="text-xs text-[#64748B]">Portal configuration, authentication guards, and access policies</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-4 text-xs">
                {/* Google Authenticator 2FA Section */}
                <div className="p-4 rounded-xl bg-linear-to-r from-blue-50/70 via-slate-50 to-white border border-blue-200/80 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs shrink-0 mt-0.5">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-[#0F172A] text-sm">Google Authenticator (2FA)</p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black tracking-wide border border-emerald-300 flex items-center gap-1">
                            <ShieldCheck size={11} />
                            Enforced for Admins
                          </span>
                        </div>
                        <p className="text-[#64748B] text-[11px] mt-1 leading-relaxed max-w-xl">
                          Admin logins require Time-based One-Time Passwords (RFC 6238 TOTP). Includes "Try another way" fallback via registered email OTP and 8 emergency backup codes.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="px-3.5 py-2 rounded-xl bg-black text-white hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Key size={13} />
                      <span>Configure & View Codes</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="font-bold text-[#0F172A]">Enforce Login for Course & Internship Registration</p>
                    <p className="text-[#64748B] text-[11px]">Unauthenticated candidates are directed to log in before registering</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <p className="font-bold text-[#0F172A]">Enterprise Student Cohort Portal</p>
                    <p className="text-[#64748B] text-[11px]">{students.length} Registered Candidates Active in ERP Roster</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* RIGHT-SIDE SLIDE-OVER DRAWER (100% RELEVANT & NON-DUMMY)              */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {rightPanel.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${rightPanel.type === 'certificate-generator' || rightPanel.type === 'offer-letter-generator' || rightPanel.type === 'attendance-generator' ? 'sm:w-[720px] md:w-[65%] lg:w-[58%] xl:w-[50%]' : rightPanel.type === 'view-staff' || rightPanel.type === 'edit-staff' || rightPanel.type === 'add-staff' ? 'sm:w-[520px] md:w-[46%] lg:w-[40%]' : 'sm:w-[420px] md:w-[35%] lg:w-[30%]'} h-full bg-[#FFFFFF] border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 select-text`}
          >
            {rightPanel.type === 'certificate-generator' || rightPanel.type === 'offer-letter-generator' || rightPanel.type === 'attendance-generator' ? (
              <CertificateGeneratorDrawer
                initialStudent={rightPanel.data}
                mode={rightPanel.mode || (rightPanel.type === 'offer-letter-generator' ? 'offer-letter' : rightPanel.type === 'attendance-generator' ? 'attendance' : 'certificate')}
                onClose={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                onStudentUpdated={(st) => {
                  setStudents(prev => prev.map(s => s.id === st.id ? { ...s, ...st } : s));
                }}
              />
            ) : (
              <>
                {/* 1. Header Toolbar: Minimalist, ONLY Close X Button at Right Side */}
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {rightPanel.type === 'course-edit' ? <BookOpen size={15} /> :
                   rightPanel.type === 'internship-edit' ? <Briefcase size={15} /> :
                   rightPanel.type === 'crm-item' ? <Building2 size={15} /> :
                   rightPanel.type === 'add-student' ? <GraduationCap size={15} /> :
                   rightPanel.type === 'view-staff' || rightPanel.type === 'edit-staff' || rightPanel.type === 'add-staff' ? <Users size={15} /> :
                   <ClipboardList size={15} />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-[#0F172A] break-words">
                    {rightPanel.title}
                  </h3>
                  <p className="text-[10px] text-[#64748B] font-medium break-words">
                    {rightPanel.type === 'course-edit' ? 'Technical Course Catalog' :
                     rightPanel.type === 'internship-edit' ? 'Industrial Track Specification' :
                     rightPanel.type === 'add-student' ? 'Candidate Registration Stepper' :
                     rightPanel.type === 'crm-item' ? 'Enterprise Client Dossier' :
                     rightPanel.type === 'view-staff' ? 'Founders & Employees • Profile & Settlements' :
                     rightPanel.type === 'edit-staff' ? 'Edit Founder / Employee Details' :
                     rightPanel.type === 'add-staff' ? 'Add New Team Member' :
                     'Operations Pane'}
                  </p>
                </div>
              </div>

              {/* ONLY stay close X button at right side */}
              <button
                onClick={() => setRightPanel({ ...rightPanel, isOpen: false })}
                className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#64748B] hover:text-black transition cursor-pointer shrink-0"
                title="Close Panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. Top Title & Primary Action Area */}
            <div className="px-5 pt-4 pb-3.5 space-y-3 border-b border-[#E2E8F0] shrink-0 bg-[#F8FAFC]">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0066FF]">
                    {rightPanel.type === 'add-student' ? 'New Candidate' :
                     rightPanel.type === 'course-edit' ? 'Website Curriculum' :
                     rightPanel.type === 'internship-edit' ? 'Industrial Internship' :
                     rightPanel.type === 'crm-item' ? 'Corporate Account' :
                     rightPanel.type === 'view-staff' || rightPanel.type === 'edit-staff' || rightPanel.type === 'add-staff' ? 'Company Staff & Leadership' :
                     'Verified Student'}
                  </span>
                  <h2 className="text-base font-black text-[#0F172A] tracking-tight truncate">
                    {rightPanel.type === 'add-student' ? 'Candidate Enrollment Stepper' :
                     rightPanel.data?.name || rightPanel.data?.title || rightPanel.title}
                  </h2>
                </div>
              </div>

              {/* Primary Action Buttons & Revisit Course Details Link */}
              {rightPanel.type === 'student-report' && (
                <button 
                  onClick={() => {
                    toast.success(`Academic record and attendance validated for ${rightPanel.data?.name}!`);
                    setRightPanel({ ...rightPanel, isOpen: false });
                  }}
                  className="w-full py-2 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Verify Student Record & Milestone</span>
                </button>
              )}

              {rightPanel.type === 'course-edit' && (
                <div className="space-y-2">
                  <a
                    href={`/courses`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>Revisit Website Full Course Details</span>
                  </a>
                  <button 
                    onClick={() => {
                      toast.success(`Curriculum specification updated for ${rightPanel.data?.title}!`);
                      setRightPanel({ ...rightPanel, isOpen: false });
                    }}
                    className="w-full py-2 rounded-xl bg-[#000000] hover:bg-[#222222] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Publish Updated Course Syllabus</span>
                  </button>
                </div>
              )}

              {rightPanel.type === 'internship-edit' && (
                <div className="space-y-2">
                  <a
                    href={`/upskill/${rightPanel.data?.id || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>Revisit Website Full Course Details</span>
                  </a>
                  <button 
                    onClick={() => {
                      toast.success(`Industrial internship package dispatched for ${rightPanel.data?.title}!`);
                      setRightPanel({ ...rightPanel, isOpen: false });
                    }}
                    className="w-full py-2 rounded-xl bg-[#000000] hover:bg-[#222222] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Briefcase size={14} />
                    <span>Dispatch Industrial Internship Track</span>
                  </button>
                </div>
              )}

              {rightPanel.type === 'crm-item' && (
                <button 
                  onClick={() => {
                    toast.success(`Corporate agreement updated for ${rightPanel.data?.name}!`);
                    setRightPanel({ ...rightPanel, isOpen: false });
                  }}
                  className="w-full py-2 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <FileCheck2 size={14} />
                  <span>Update Enterprise Client SLA</span>
                </button>
              )}
            </div>

            {/* 3. Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar text-xs">
              
              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE A: STUDENT DOSSIER VIEW (100% SPECIFIC TO SELECTED STUDENT) */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'student-report' && rightPanel.data && (
                <>
                  {/* EDITABLE COURSE START DATE CARD */}
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#0066FF]" />
                        <span>Course Start Date (Editable)</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live Active
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rightPanel.data.startDate || '25 Oct 2026'}
                        onChange={(e) => updateStudentStartDate(rightPanel.data.id, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        placeholder="e.g. 25 Oct 2026"
                      />
                      <button
                        onClick={() => toast.success(`Start date saved for ${rightPanel.data.name}!`)}
                        className="px-3.5 py-2 rounded-lg bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer"
                      >
                        Save Date
                      </button>
                    </div>
                  </div>

                  {/* ATTRIBUTES TABLE */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Candidate Attributes</h4>
                    
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white">
                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><BarChart2 size={13} /> Status</span>
                        <div className="col-span-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {rightPanel.data.status || 'Verified Enrolled'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><GraduationCap size={13} /> College</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">
                          {rightPanel.data.college || 'Mahendra Engineering College'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><BookOpen size={13} /> Degree & YOG</span>
                        <div className="col-span-2 text-[#0F172A] font-medium">
                          {rightPanel.data.degree || 'B.Tech Information Technology'} • Class of {rightPanel.data.gradYear || '2027'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><Layers size={13} /> Program Domain</span>
                        <div className="col-span-2 font-bold text-[#0066FF]">
                          {rightPanel.data.domain || rightPanel.data.course}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><Users size={13} /> Assigned Mentor</span>
                        <div className="col-span-2 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#000000] text-white text-[10px] font-black flex items-center justify-center">
                            {rightPanel.data.mentor ? rightPanel.data.mentor.charAt(0) : 'K'}
                          </div>
                          <span className="font-bold text-[#0F172A]">{rightPanel.data.mentor || 'Karthik Ramanathan (AI & Web Lead)'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><Phone size={13} /> Phone</span>
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="font-mono font-bold text-[#0F172A]">{rightPanel.data.phone}</span>
                          {rightPanel.data.phone && (
                            <a
                              href={`https://wa.me/${rightPanel.data.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              <MessageCircle size={11} /> WhatsApp
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><Mail size={13} /> Email</span>
                        <div className="col-span-2 text-[#0F172A] font-medium truncate">
                          <a href={`mailto:${rightPanel.data.email}`} className="hover:text-[#0066FF] hover:underline">
                            {rightPanel.data.email}
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><CheckCircle2 size={13} /> Attendance</span>
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="font-black text-emerald-600">{rightPanel.data.attendance || 96}% Present</span>
                          <span className="text-[11px] text-[#64748B]">• Grade Score: {rightPanel.data.score || 95}/100</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] flex items-center gap-1.5 font-semibold"><Sparkles size={13} /> Tech Tools</span>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {(rightPanel.data.tools || ['React', 'Node.js', 'Express', 'MongoDB']).map((tool: string) => (
                            <span key={tool} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#0066FF] font-bold">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RELEVANT FILES */}
                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Dossier Documentation</h4>
                    
                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between hover:border-[#0066FF] transition cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#000000] flex items-center justify-center text-white shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-xs">
                              MEC_Admission_Slip_{rightPanel.data.name.replace(/\s+/g, '_')}.pdf
                            </p>
                            <p className="text-[10px] text-[#64748B]">Mahendra Engineering College • IT Class of 2027</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            toast.success(`Downloading admission slip for ${rightPanel.data.name}...`);
                            window.print();
                          }}
                          className="p-1.5 hover:bg-white rounded-lg text-[#64748B] hover:text-black transition"
                        >
                          <Download size={15} />
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between hover:border-[#0066FF] transition cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0066FF] flex items-center justify-center text-white shrink-0">
                            <Award size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-xs">Atideto_Industrial_Offer_Letter.pdf</p>
                            <p className="text-[10px] text-[#64748B]">Verified Academic Roster • 3 Months Industrial</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            toast.success(`Downloading offer letter for ${rightPanel.data.name}...`);
                            window.print();
                          }}
                          className="p-1.5 hover:bg-white rounded-lg text-[#64748B] hover:text-black transition"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ACTION: GENERATE CERTIFICATE FOR THIS STUDENT */}
                  <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                    <button
                      onClick={() => {
                        setGenForm({
                          candidateName: rightPanel.data.name,
                          college: rightPanel.data.college || 'Mahendra Engineering College',
                          degree: rightPanel.data.degree || 'B.Tech Information Technology',
                          domain: rightPanel.data.domain || 'Full stack Web Development',
                          duration: rightPanel.data.duration || '3 Months (Oct 2026 - Jan 2027)',
                          certId: rightPanel.data.certId || `ATIDETO-CERT-2026-${rightPanel.data.id.replace('AT-', '')}`,
                          issueDate: rightPanel.data.issueDate || '2026-10-21',
                          stipend: 'Standard Industrial Cohort',
                          evalScore: `${rightPanel.data.score || 95}/100 (Exemplary Distinction)`
                        });
                        setRightPanel({
                          isOpen: true,
                          type: 'certificate-generator',
                          title: `${rightPanel.data.certGenerated ? 'Regenerate Certificate' : 'Generate Certificate'}: ${rightPanel.data.name}`,
                          data: rightPanel.data
                        });
                      }}
                      className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        rightPanel.data.certGenerated 
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                          : 'bg-[#0066FF] hover:bg-[#0052FF] shadow-[#0066FF]/20'
                      }`}
                    >
                      {rightPanel.data.certGenerated ? (
                        <>
                          <RotateCcw size={15} />
                          <span>Regenerate Official Certificate for {rightPanel.data.name}</span>
                        </>
                      ) : (
                        <>
                          <Award size={15} />
                          <span>Generate Official Certificate for {rightPanel.data.name}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteStudent(rightPanel.data.id, rightPanel.data.name);
                        setRightPanel({ isOpen: false, type: null, title: '' });
                      }}
                      className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-2"
                    >
                      <Trash2 size={14} />
                      <span>Delete Candidate Record from Entire ERP</span>
                    </button>
                  </div>
                </>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE B: TECHNICAL COURSE CURRICULUM VIEW (100% SPECIFIC TO COURSE) */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'course-edit' && rightPanel.data && (
                <>
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Course Specifications</h4>
                    
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white">
                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Category</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.category}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Lead Instructor</span>
                        <div className="col-span-2 font-bold text-[#0066FF]">{rightPanel.data.instructor}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Duration</span>
                        <div className="col-span-2 font-mono font-bold text-[#0F172A]">{rightPanel.data.duration}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Active Enrollment</span>
                        <div className="col-span-2 font-black text-emerald-600">{rightPanel.data.enrolled} Students Enrolled</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Curriculum Units</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.modules} Modules Total</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Core Tech Tools</span>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {rightPanel.data.tools?.map((tool: string) => (
                            <span key={tool} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#0066FF] font-bold">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SYLLABUS ROADMAP */}
                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Curriculum Modules Roadmap</h4>
                    <div className="space-y-2">
                      {[
                        { unit: 'Unit 01', title: 'Architectural Foundations & Environment Setup', hrs: '12 Hours' },
                        { unit: 'Unit 02', title: 'Data Structures, APIs & Commercial Implementation', hrs: '18 Hours' },
                        { unit: 'Unit 03', title: 'State Architecture, Performance Tuning & Scalability', hrs: '16 Hours' },
                        { unit: 'Unit 04', title: 'Production Cloud Deployment, Docker & Capstone Defense', hrs: '14 Hours' }
                      ].map((mod, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-[#0066FF] uppercase tracking-wider">{mod.unit}</span>
                            <p className="font-bold text-[#0F172A]">{mod.title}</p>
                          </div>
                          <span className="text-[10px] font-mono text-[#64748B] bg-white px-2 py-1 rounded border border-[#E2E8F0]">{mod.hrs}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COURSE FILES */}
                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Curriculum Artifacts</h4>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-[#0066FF]" />
                        <span className="font-bold text-[#0F172A] truncate max-w-[280px]">{rightPanel.data.title}_Curriculum_Plan.pdf</span>
                      </div>
                      <button onClick={() => toast.success('Downloading syllabus PDF...')} className="p-1 hover:bg-white rounded text-[#64748B]">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE C: INTERNSHIP PROGRAM VIEW (100% SPECIFIC TO INTERNSHIP) */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'internship-edit' && rightPanel.data && (
                <>
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Industrial Program Details</h4>
                    
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white">
                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Track Domain</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.title}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Program Category</span>
                        <div className="col-span-2 font-bold text-[#0066FF]">{rightPanel.data.category}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Industrial Duration</span>
                        <div className="col-span-2 font-mono font-bold text-[#0F172A]">{rightPanel.data.duration}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Technical Mentor</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.mentor}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Industry Scope</span>
                        <div className="col-span-2 text-[#475569] leading-relaxed text-[11px]">{rightPanel.data.description}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Industry Skills</span>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {rightPanel.data.skills?.map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#0066FF] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INDUSTRIAL MILESTONES */}
                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Industrial Deliverables & Sprints</h4>
                    <div className="space-y-2">
                      {[
                        { sprint: 'Sprint 01', task: 'Enterprise Git Workflow & Microservice Scaffold', state: 'Standard Practice' },
                        { sprint: 'Sprint 02', task: 'High-Concurrency Database Modeling & API Integration', state: 'Production Core' },
                        { sprint: 'Sprint 03', task: 'Enterprise Security, Token Auth & Test Coverage', state: 'Quality Assurance' },
                        { sprint: 'Sprint 04', task: 'Commercial Capstone Project Defense & Live Deployment', state: 'Final Evaluation' }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-[#0066FF] uppercase">{item.sprint}</span>
                            <p className="font-bold text-[#0F172A]">{item.task}</p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {item.state}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INTERNSHIP FILES */}
                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Industrial Charter Files</h4>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Briefcase size={16} className="text-[#0066FF]" />
                        <span className="font-bold text-[#0F172A] truncate max-w-[280px]">Atideto_{rightPanel.data.id}_Internship_Charter.pdf</span>
                      </div>
                      <button onClick={() => toast.success('Downloading internship charter PDF...')} className="p-1 hover:bg-white rounded text-[#64748B]">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE D: CORPORATE CRM CLIENT VIEW (100% SPECIFIC TO CLIENT)   */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'crm-item' && rightPanel.data && (
                <>
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Enterprise Account Profile</h4>
                    
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] bg-white text-xs">
                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Account Status</span>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            rightPanel.data.mouStatus === 'Active MOU' || rightPanel.data.mouStatus === 'MOU Signed'
                              ? 'bg-emerald-600 text-white'
                              : rightPanel.data.mouStatus === 'Collaborator Partner'
                              ? 'bg-blue-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}>
                            {rightPanel.data.mouStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Entity Type</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.type || 'Corporate Client'}</div>
                      </div>

                      {rightPanel.data.project && (
                        <div className="grid grid-cols-3 p-3 items-center">
                          <span className="text-[#64748B] font-semibold">Project Scope</span>
                          <div className="col-span-2 font-bold text-[#0066FF]">{rightPanel.data.project}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Industry Vertical</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.industry}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Primary Contact</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.contactPerson}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Corporate Phone</span>
                        <div className="col-span-2 font-mono font-bold text-[#0F172A]">{rightPanel.data.phone}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Contact Email</span>
                        <div className="col-span-2 text-[#0066FF] font-medium break-all">{rightPanel.data.email}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Quotation / Budget</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.contractValue}</div>
                      </div>

                      {rightPanel.data.amountPaid && (
                        <div className="grid grid-cols-3 p-3 items-center">
                          <span className="text-[#64748B] font-semibold">Received to Date</span>
                          <div className="col-span-2 font-black text-emerald-600">{rightPanel.data.amountPaid}</div>
                        </div>
                      )}

                      {rightPanel.data.balanceDue && (
                        <div className="grid grid-cols-3 p-3 items-center">
                          <span className="text-[#64748B] font-semibold">Balance Due</span>
                          <div className="col-span-2 font-black text-amber-600">{rightPanel.data.balanceDue}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Pipeline Stage</span>
                        <div className="col-span-2 font-bold text-[#0F172A]">{rightPanel.data.pipelineStatus}</div>
                      </div>

                      <div className="grid grid-cols-3 p-3 items-center">
                        <span className="text-[#64748B] font-semibold">Tech Scope</span>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {rightPanel.data.tools?.map((tool: string) => (
                            <span key={tool} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#0066FF] font-bold">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Legal & Commercial Documents</h4>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <FileText size={16} className="text-[#000000] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-[#0F172A] block break-words">
                            {rightPanel.data.mouStatus === 'Mou not signed'
                              ? `Atideto_${rightPanel.data.name.replace(/\s+/g, '_')}_Project_Charter_Draft.pdf`
                              : `Atideto_${rightPanel.data.name.replace(/\s+/g, '_')}_MOU_Signed.pdf`
                            }
                          </span>
                          <span className={`text-[10px] font-semibold ${
                            rightPanel.data.mouStatus === 'Mou not signed' ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {rightPanel.data.mouStatus === 'Mou not signed' ? 'Draft / Pending Execution' : 'Executed MOU & Agreement'}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => toast.success(`Downloading ${rightPanel.data.name} agreement charter PDF...`)} className="p-1 hover:bg-white rounded text-[#64748B] shrink-0">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE E: 4-STEPPER CANDIDATE REGISTRATION IN RIGHT PANEL        */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'add-student' && (
                <div className="space-y-4">
                  {/* 4-Step Progress Indicator */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
                    <div className="flex items-center justify-between relative px-2">
                      <div className="absolute top-3.5 left-4 right-4 h-[2px] bg-[#E2E8F0] -z-0" />
                      <div 
                        className="absolute top-3.5 left-4 h-[2px] bg-[#0066FF] -z-0 transition-all duration-300"
                        style={{ width: `${((stepperStep - 1) / 3) * 100}%` }}
                      />

                      {[
                        { num: 1, label: 'Personal' },
                        { num: 2, label: 'College' },
                        { num: 3, label: 'Course' },
                        { num: 4, label: 'Preview' }
                      ].map((item) => (
                        <div key={item.num} className="flex flex-col items-center relative z-10">
                          <button
                            type="button"
                            onClick={() => stepperStep > item.num && setStepperStep(item.num)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] transition shadow-sm ${
                              stepperStep > item.num
                                ? 'bg-[#0066FF] text-white cursor-pointer'
                                : stepperStep === item.num
                                  ? 'bg-[#0066FF] text-white ring-4 ring-[#0066FF]/20'
                                  : 'bg-white text-[#64748B] border border-[#CBD5E1]'
                            }`}
                          >
                            {stepperStep > item.num ? <Check size={12} /> : item.num}
                          </button>
                          <span className={`text-[10px] font-bold mt-1 ${stepperStep === item.num ? 'text-[#0066FF]' : 'text-[#64748B]'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: PERSONAL INFORMATION */}
                  {stepperStep === 1 && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-sm font-black text-[#0F172A]">Personal Information</h4>
                        <p className="text-[11px] text-[#64748B]">Tell us about candidate identity details</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Candidate Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newStudentForm.name}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                          placeholder="e.g. V. Nithish Kumar"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newStudentForm.email}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                          placeholder="nithu2005nk@gmail.com"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Phone Number *</label>
                          <input
                            type="text"
                            value={newStudentForm.phone}
                            onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                            placeholder="+91 98949 58127"
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Gender</label>
                          <select
                            defaultValue="Male"
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newStudentForm.name.trim()) {
                            toast.error('Please enter candidate full name');
                            return;
                          }
                          setStepperStep(2);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 mt-2"
                      >
                        <span>Next: College Information</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: COLLEGE INFORMATION */}
                  {stepperStep === 2 && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-sm font-black text-[#0F172A]">College Information</h4>
                        <p className="text-[11px] text-[#64748B]">Institutional and educational credentials</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">College Institution</label>
                        <input
                          type="text"
                          value={newStudentForm.college}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, college: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] bg-[#F8FAFC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Degree Program</label>
                          <input
                            type="text"
                            value={newStudentForm.degree}
                            onChange={(e) => setNewStudentForm({ ...newStudentForm, degree: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Year of Grad</label>
                          <input
                            type="text"
                            value={newStudentForm.gradYear}
                            onChange={(e) => setNewStudentForm({ ...newStudentForm, gradYear: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStepperStep(1)}
                          className="flex-1 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStepperStep(3)}
                          className="flex-1 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <span>Next: Course Details</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: COURSE & REVISIT WEBSITE BUTTON */}
                  {stepperStep === 3 && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-sm font-black text-[#0F172A]">Course & Specialization</h4>
                        <p className="text-[11px] text-[#64748B]">Select learning track and review syllabus</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Program Track / Domain *</label>
                        <select
                          value={newStudentForm.domain}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, domain: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        >
                          <option value="Full stack Web Development">Full stack Web Development</option>
                          <option value="Full Stack Development">Full Stack Development</option>
                          <option value="Web development">Web development</option>
                          <option value="Data Analyst Intern">Data Analyst Intern</option>
                          <option value="Python Programming">Python Programming</option>
                          <option value="Generative AI & LLM Engineering">Generative AI & LLM Engineering</option>
                          <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                        </select>
                      </div>

                      {/* BUTTON: Revisit Website for Full Course Details */}
                      <div className="p-3.5 rounded-xl bg-[#F0F7FF] border border-[#BFDBFE] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#0066FF]">Official Website Catalog</span>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Live</span>
                        </div>
                        <p className="text-xs font-bold text-[#1E3A8A]">{newStudentForm.domain}</p>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          Review complete syllabus, industry mentors, weekly roadmap, and capstone project details on the website.
                        </p>
                        <a
                          href={`/courses`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <ExternalLink size={13} />
                          <span>Revisit Website for Full Course Details</span>
                        </a>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Course Start Date (Editable)</label>
                        <input
                          type="text"
                          value={newStudentForm.startDate}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, startDate: e.target.value })}
                          placeholder="e.g. 25 Oct 2026"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0066FF] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStepperStep(2)}
                          className="flex-1 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStepperStep(4)}
                          className="flex-1 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <span>Next: Preview</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PREVIEW & ENROLL */}
                  {stepperStep === 4 && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-sm font-black text-[#0F172A]">Application Preview</h4>
                        <p className="text-[11px] text-[#64748B]">Verify candidate details before enrolling into ERP</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2 text-xs">
                        <div className="flex justify-between items-center pb-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B]">Full Name:</span>
                          <span className="font-bold text-[#0F172A]">{newStudentForm.name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B]">Email / Phone:</span>
                          <span className="font-semibold text-[#0F172A] truncate max-w-[170px]">{newStudentForm.email || newStudentForm.phone}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B]">College & YOG:</span>
                          <span className="font-semibold text-[#0F172A]">{newStudentForm.college} ({newStudentForm.gradYear})</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#64748B]">Course Track:</span>
                          <span className="font-bold text-[#0066FF]">{newStudentForm.domain}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#64748B]">Batch Start Date:</span>
                          <span className="font-bold text-emerald-600">{newStudentForm.startDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStepperStep(3)}
                          className="flex-1 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            handleEnrollStudent(e as any);
                            setStepperStep(1);
                          }}
                          className="flex-2 py-2 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Confirm & Enroll Candidate</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE G: EDIT STUDENT FORM                                     */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'edit-student' && editStudentForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateStudentInDb(editStudentForm.id, editStudentForm);
                    const updated = students.map(s => s.id === editStudentForm.id ? { ...s, ...editStudentForm } : s);
                    setStudents(updated);
                    saveStoredStudents(updated);
                    updateStudentInRegistry(editStudentForm.id, editStudentForm);
                    saveFinalizedPayment(editStudentForm.id, editStudentForm.feePaid, editStudentForm.feeTotal, editStudentForm.paymentStatus);
                    toggleStudentCertificateHold(editStudentForm.id, !!editStudentForm.certHold);
                    window.dispatchEvent(new Event('atideto_payment_update'));
                    toast.success(`Updated student ${editStudentForm.name} and records!`);
                    setRightPanel({ isOpen: false, type: null, title: '' });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.name}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Email Address</label>
                      <input
                        type="email"
                        value={editStudentForm.email}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Phone Number</label>
                      <input
                        type="text"
                        value={editStudentForm.phone}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">College / Institution</label>
                    <input
                      type="text"
                      value={editStudentForm.college}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Degree & Branch</label>
                      <input
                        type="text"
                        value={editStudentForm.degree}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, degree: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Course Track / Domain</label>
                      <select
                        value={editStudentForm.domain}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, domain: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      >
                        <option value="Full stack web development">Full stack web development</option>
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="web development">web development</option>
                        <option value="Fullstack Web development">Fullstack Web development</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Python Programming">Python Programming</option>
                        <option value="Generative AI & LLM Engineering">Generative AI & LLM Engineering</option>
                        <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                      </select>
                    </div>
                  </div>

                  {/* INTERNSHIP PAYMENT SECTION (Updated by Admin) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <IndianRupee size={13} className="text-blue-600" />
                        <span>Internship Tuition & Payment</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Admin Editable
                      </span>
                    </div>

                    {(() => {
                      const totalNum = parseInt((editStudentForm.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
                      const paidNum = parseInt((editStudentForm.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                      const dueNum = Math.max(0, totalNum - paidNum);
                      const paidPercent = totalNum > 0 ? Math.min(100, Math.round((paidNum / totalNum) * 100)) : 0;
                      const duePercent = Math.max(0, 100 - paidPercent);

                      return (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Total Program Fee (Manual Updation)</label>
                              <input
                                type="text"
                                value={editStudentForm.feeTotal ?? ''}
                                onChange={(e) => setEditStudentForm({ ...editStudentForm, feeTotal: e.target.value })}
                                placeholder="e.g. ₹1,000, ₹700, or To Be Decided by Admin"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Amount Paid (Manual Updation)</label>
                              <input
                                type="text"
                                value={editStudentForm.feePaid ?? ''}
                                onChange={(e) => setEditStudentForm({ ...editStudentForm, feePaid: e.target.value })}
                                placeholder="e.g. ₹500, ₹0, or Full Paid"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-blue-600 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs"
                              />
                            </div>
                          </div>

                          {/* Calculated Due Balance Display Card */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Calculated Due Balance</span>
                              <span className={`text-base font-black ${dueNum > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                ₹{dueNum.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block border ${
                                dueNum === 0 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {dueNum === 0 ? '100% Cleared (0 Due)' : `${paidPercent}% Paid • ${duePercent}% Due`}
                              </span>
                            </div>
                          </div>

                          {/* Quick Settlement Ratios: Full paid (100%), Partially (50%), Payment Due (0%) */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Settlement Ratios</label>
                              <span className="text-[9px] font-bold text-blue-600">Full (100%) • Partial (50%) • Due (0%)</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const amt = `₹${totalNum.toLocaleString('en-IN')}`;
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    feePaid: amt,
                                    paymentStatus: 'Paid in Full'
                                  });
                                }}
                                className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold transition text-center cursor-pointer"
                              >
                                Full Paid (100%)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const half = Math.round(totalNum * 0.5);
                                  const amt = `₹${half.toLocaleString('en-IN')}`;
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    feePaid: amt,
                                    paymentStatus: 'Partial Paid'
                                  });
                                }}
                                className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold transition text-center cursor-pointer"
                              >
                                Partially (50%)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    feePaid: '₹0',
                                    paymentStatus: 'Payment Due'
                                  });
                                }}
                                className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold transition text-center cursor-pointer"
                              >
                                Payment Due (0%)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const amt = `₹${totalNum.toLocaleString('en-IN')}`;
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    feePaid: amt,
                                    paymentStatus: 'Waived'
                                  });
                                }}
                                className="px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[10px] font-bold transition text-center cursor-pointer"
                              >
                                Waived (Merit)
                              </button>
                            </div>
                          </div>

                          {/* Payment Status Manual Text Input */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Payment Status (Manual Text)</label>
                              <span className="text-[9px] font-semibold text-blue-600">Type custom text status</span>
                            </div>
                            <input
                              type="text"
                              value={editStudentForm.paymentStatus || ''}
                              onChange={(e) => setEditStudentForm({ ...editStudentForm, paymentStatus: e.target.value })}
                              placeholder="e.g. Paid in Full, Partial Paid, ₹20,000 Paid (Cash), Waived, etc."
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Course Start Date</label>
                      <input
                        type="text"
                        value={editStudentForm.startDate}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, startDate: e.target.value })}
                        placeholder="e.g. 25 Oct 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-blue-600 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Enrollment Status</label>
                      <select
                        value={editStudentForm.status}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                      >
                        <option value="Verified Enrolled">Verified Enrolled</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>
                  </div>

                  {/* ATTENDANCE & PERFORMANCE EVALUATION (Admin Editable) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Calendar size={13} className="text-blue-600" />
                        <span>Attendance & Cohort Evaluation</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Admin Editable
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Attendance Rate (%)</label>
                          <span className="text-[10px] font-extrabold text-emerald-600">{editStudentForm.attendance ?? 95}%</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editStudentForm.attendance ?? 95}
                          onChange={(e) => setEditStudentForm({ ...editStudentForm, attendance: parseInt(e.target.value, 10) || 0 })}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                        {/* Quick attendance presets */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {[100, 95, 90, 85, 75].map((attVal) => (
                            <button
                              key={attVal}
                              type="button"
                              onClick={() => setEditStudentForm({ ...editStudentForm, attendance: attVal })}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border transition cursor-pointer ${
                                (editStudentForm.attendance ?? 95) === attVal
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {attVal}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Assessment Score (%)</label>
                          <span className="text-[10px] font-extrabold text-blue-600">{editStudentForm.score ?? 95}%</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editStudentForm.score ?? 95}
                          onChange={(e) => setEditStudentForm({ ...editStudentForm, score: parseInt(e.target.value, 10) || 0 })}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                        {/* Quick score presets */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {[100, 95, 90, 85, 80].map((scVal) => (
                            <button
                              key={scVal}
                              type="button"
                              onClick={() => setEditStudentForm({ ...editStudentForm, score: scVal })}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border transition cursor-pointer ${
                                (editStudentForm.score ?? 95) === scVal
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {scVal}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CERTIFICATE ACCESS PRIVILEGE (Admin Privilege) */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <ShieldAlert size={13} className="text-amber-600" />
                        <span>Admin Privilege: Certificate Access</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        editStudentForm.certHold ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {editStudentForm.certHold ? 'Hold Active (Hidden)' : 'Public Active'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      When held, the student dashboard hides completion credentials, and public verification blocks downloads.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setEditStudentForm({ ...editStudentForm, certHold: !editStudentForm.certHold })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          editStudentForm.certHold
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <ShieldAlert size={13} />
                        <span>{editStudentForm.certHold ? 'Release Certificate Hold' : 'Place Certificate on Administrative Hold'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Clean Footer Buttons without conflict */}
                  <div className="pt-4 border-t border-slate-200 mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
                    >
                      <CheckCircle2 size={15} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE H: ADD / EDIT FOUNDER & EMPLOYEE                         */}
              {/* ───────────────────────────────────────────────────────────── */}
              {(rightPanel.type === 'add-staff' || rightPanel.type === 'edit-staff') && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!staffForm.name.trim()) {
                      toast.error('Please enter team member name');
                      return;
                    }
                    if (rightPanel.type === 'add-staff') {
                      const newMember = {
                        emp_id: staffForm.emp_id || `EMP-0${staffMembers.length + 1}`,
                        name: staffForm.name,
                        role: staffForm.role,
                        email: staffForm.email || `${staffForm.name.toLowerCase().replace(/\s+/g, '.')}@atideto.in`,
                        phone: staffForm.phone,
                        department: staffForm.department,
                        status: staffForm.status || 'Active',
                        account_holder: staffForm.account_holder,
                        account_no: staffForm.account_no,
                        ifsc_code: staffForm.ifsc_code,
                        branch: staffForm.branch,
                        upi_link: staffForm.upi_link,
                        scanner_image: staffForm.scanner_image,
                        instagram: staffForm.instagram,
                        facebook: staffForm.facebook,
                        linkedin: staffForm.linkedin,
                        portfolio: staffForm.portfolio,
                        other_socials: staffForm.other_socials
                      };
                      await createStaffInDb(newMember);
                      const refreshed = await getStaffFromDb();
                      if (refreshed && refreshed.length > 0) {
                        setStaffMembers(refreshed);
                      } else {
                        setStaffMembers(prev => [newMember, ...prev]);
                      }
                      toast.success(`Added ${newMember.name} to Founders & Employees`);
                    } else {
                      await updateStaffInDb(staffForm.id || staffForm.emp_id, staffForm);
                      const refreshed = await getStaffFromDb();
                      if (refreshed && refreshed.length > 0) {
                        setStaffMembers(refreshed);
                      } else {
                        setStaffMembers(prev => prev.map(m => (m.id === staffForm.id || m.emp_id === staffForm.emp_id) ? { ...m, ...staffForm } : m));
                      }
                      toast.success(`Updated ${staffForm.name}`);
                    }
                    setRightPanel({ isOpen: false, type: null, title: '' });
                  }}
                  className="space-y-6"
                >
                  {/* SECTION 1: CORE EMPLOYEE PROFILE */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="p-1 rounded bg-black text-white">
                        <Users size={12} />
                      </span>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Core Identity & Role
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                        placeholder="e.g. Sam Absihek"
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Designation / Role *</label>
                        <input
                          type="text"
                          required
                          value={staffForm.role}
                          onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                          placeholder="Founder / CEO / Developer"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0066FF] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Employee ID</label>
                        <input
                          type="text"
                          value={staffForm.emp_id}
                          onChange={(e) => setStaffForm({ ...staffForm, emp_id: e.target.value })}
                          placeholder="EMP-01"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Department</label>
                      <select
                        value={staffForm.department}
                        onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Executive Leadership">Executive Leadership</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Design & Media">Design & Media</option>
                        <option value="Client Operations & CRM">Client Operations & CRM</option>
                        <option value="Academic Mentorship">Academic Mentorship</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Email Address</label>
                        <input
                          type="email"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          placeholder="name@atideto.in"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Phone Number</label>
                        <input
                          type="text"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          placeholder="+91 94432 10000"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Status</label>
                      <select
                        value={staffForm.status}
                        onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* SECTION 2: BANK SETTLEMENT DETAILS */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-blue-200/60">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-blue-600 text-white">
                          <CreditCard size={12} />
                        </span>
                        <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                          Bank Account Details
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Optional / Editable Later
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Enter bank details for employee salary disbursement and founder profit distributions. Can be left empty and filled anytime.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Account Holder Name</label>
                      <input
                        type="text"
                        value={staffForm.account_holder}
                        onChange={(e) => setStaffForm({ ...staffForm, account_holder: e.target.value })}
                        placeholder="e.g. Sam Abhishek / Account holder as per passbook"
                        className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Account Number</label>
                        <input
                          type="text"
                          value={staffForm.account_no}
                          onChange={(e) => setStaffForm({ ...staffForm, account_no: e.target.value })}
                          placeholder="e.g. 50100456789012"
                          className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B]">IFSC Code</label>
                        <input
                          type="text"
                          value={staffForm.ifsc_code}
                          onChange={(e) => setStaffForm({ ...staffForm, ifsc_code: e.target.value.toUpperCase() })}
                          placeholder="e.g. HDFC0001234"
                          className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-mono font-bold text-blue-700 focus:outline-none focus:border-blue-600 shadow-2xs uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Branch Name</label>
                      <input
                        type="text"
                        value={staffForm.branch}
                        onChange={(e) => setStaffForm({ ...staffForm, branch: e.target.value })}
                        placeholder="e.g. Anna Nagar Branch, Chennai / Main City Branch"
                        className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* SECTION 3: UPI & SCANNER QR IMAGE */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-emerald-200/60">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-emerald-600 text-white">
                          <QrCode size={12} />
                        </span>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                          UPI ID & Scanner QR
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">UPI Link / VPA</label>
                      <input
                        type="text"
                        value={staffForm.upi_link}
                        onChange={(e) => setStaffForm({ ...staffForm, upi_link: e.target.value })}
                        placeholder="e.g. sam@okhdfcbank or upi://pay?pa=sam@okaxis"
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>

                    {/* QR Scanner Image Uploader & Preview */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B] block">
                        Scanner QR Image (Optional)
                      </label>

                      {staffForm.scanner_image ? (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={staffForm.scanner_image}
                              alt="UPI QR Scanner"
                              className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-slate-50 p-1"
                            />
                            <div>
                              <span className="text-xs font-bold text-emerald-900 block">QR Scanner Attached</span>
                              <span className="text-[10px] text-slate-500">Live preview active</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStaffForm({ ...staffForm, scanner_image: '' })}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                          >
                            Remove QR
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl bg-white hover:bg-emerald-50/50 cursor-pointer transition">
                            <Upload size={18} className="text-emerald-600 mb-1" />
                            <span className="text-xs font-bold text-slate-700">Upload Scanner QR Code Image</span>
                            <span className="text-[10px] text-slate-400">PNG, JPG, SVG up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="relative">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Or paste scanner image URL</span>
                            <input
                              type="text"
                              value={staffForm.scanner_image}
                              onChange={(e) => setStaffForm({ ...staffForm, scanner_image: e.target.value })}
                              placeholder="https://example.com/qr-code.png"
                              className="w-full px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: SOCIAL MEDIA ACCOUNTS */}
                  <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-purple-200/60">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-purple-600 text-white">
                          <Globe size={12} />
                        </span>
                        <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                          Social Media Profiles
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B] flex items-center gap-1.5">
                          <Instagram size={13} className="text-pink-600" />
                          <span>Instagram</span>
                        </label>
                        <input
                          type="text"
                          value={staffForm.instagram}
                          onChange={(e) => setStaffForm({ ...staffForm, instagram: e.target.value })}
                          placeholder="https://instagram.com/username or @username"
                          className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B] flex items-center gap-1.5">
                          <Facebook size={13} className="text-blue-600" />
                          <span>Facebook</span>
                        </label>
                        <input
                          type="text"
                          value={staffForm.facebook}
                          onChange={(e) => setStaffForm({ ...staffForm, facebook: e.target.value })}
                          placeholder="https://facebook.com/username"
                          className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B] flex items-center gap-1.5">
                          <Linkedin size={13} className="text-blue-700" />
                          <span>LinkedIn</span>
                        </label>
                        <input
                          type="text"
                          value={staffForm.linkedin}
                          onChange={(e) => setStaffForm({ ...staffForm, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase text-[#64748B] flex items-center gap-1.5">
                          <Globe size={13} className="text-indigo-600" />
                          <span>Portfolio / Personal Website</span>
                        </label>
                        <input
                          type="text"
                          value={staffForm.portfolio}
                          onChange={(e) => setStaffForm({ ...staffForm, portfolio: e.target.value })}
                          placeholder="https://samabhishek.dev"
                          className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: OTHER SOCIAL MEDIA LINKS (DYNAMIC REPEATER) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-slate-800 text-white">
                          <ExternalLink size={12} />
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Other Social Medias (Custom URLs)
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                        {staffForm.other_socials.length} added
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Add any custom social platforms (Twitter/X, GitHub, YouTube, Threads, Behance, Medium, Discord, etc.)
                    </p>

                    {staffForm.other_socials.length === 0 ? (
                      <div className="p-3 text-center rounded-xl bg-white border border-dashed border-slate-300 text-slate-400 text-xs">
                        No additional social links added yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {staffForm.other_socials.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs">
                            <input
                              type="text"
                              value={item.platform}
                              onChange={(e) => updateOtherSocial(idx, 'platform', e.target.value)}
                              placeholder="Platform (e.g. GitHub, X)"
                              className="w-1/3 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-black"
                            />
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => updateOtherSocial(idx, 'url', e.target.value)}
                              placeholder="URL: https://github.com/..."
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-black"
                            />
                            <button
                              type="button"
                              onClick={() => removeOtherSocial(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Link"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addOtherSocial}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus size={13} />
                      <span>+ Add Another Social Media URL</span>
                    </button>
                  </div>

                  {/* FORM ACTION BUTTONS */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-2.5 rounded-xl bg-black hover:bg-blue-600 text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>{rightPanel.type === 'add-staff' ? 'Add Employee & Save Details' : 'Save All Changes'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE H-2: VIEW FOUNDER & EMPLOYEE DETAILS DRAWER              */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'view-staff' && rightPanel.data && (
                <div className="space-y-5">
                  {/* Staff Profile Header Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-black text-white font-mono">
                        {rightPanel.data.emp_id || 'STAFF'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border border-emerald-300 bg-emerald-50 text-emerald-800">
                        {rightPanel.data.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-black text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                        {rightPanel.data.name?.charAt(0) || 'E'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-lg text-slate-900 break-words leading-tight">
                          {rightPanel.data.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {rightPanel.data.role}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {rightPanel.data.department || 'Operations'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <a
                        href={`mailto:${rightPanel.data.email}`}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
                      >
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{rightPanel.data.email || 'No email'}</span>
                      </a>
                      <a
                        href={`tel:${rightPanel.data.phone}`}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition font-mono"
                      >
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{rightPanel.data.phone || 'No phone'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Bank Account Details Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                          <CreditCard size={14} />
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Bank Account Details
                        </h4>
                      </div>
                      {rightPanel.data.account_no ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Verified Settlement Info
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Not Filled Yet
                        </span>
                      )}
                    </div>

                    {rightPanel.data.account_no || rightPanel.data.account_holder ? (
                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Account Holder</span>
                          <span className="font-bold text-slate-900 text-sm">{rightPanel.data.account_holder || rightPanel.data.name}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Account Number</span>
                              <span className="font-mono font-bold text-slate-900 text-sm">{rightPanel.data.account_no || '—'}</span>
                            </div>
                            {rightPanel.data.account_no && (
                              <button
                                onClick={() => copyToClipboard(rightPanel.data.account_no, 'Account Number')}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-black border border-transparent hover:border-slate-200 transition cursor-pointer"
                                title="Copy Account Number"
                              >
                                <Copy size={13} />
                              </button>
                            )}
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                              <span className="font-mono font-bold text-blue-700 text-sm uppercase">{rightPanel.data.ifsc_code || '—'}</span>
                            </div>
                            {rightPanel.data.ifsc_code && (
                              <button
                                onClick={() => copyToClipboard(rightPanel.data.ifsc_code, 'IFSC Code')}
                                className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-black border border-transparent hover:border-slate-200 transition cursor-pointer"
                                title="Copy IFSC Code"
                              >
                                <Copy size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Branch</span>
                          <span className="font-medium text-slate-800">{rightPanel.data.branch || 'Not specified'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                        <p className="text-xs text-slate-500">No bank account details have been filled yet.</p>
                        <button
                          onClick={() => {
                            setStaffForm(getPopulatedStaffForm(rightPanel.data));
                            setRightPanel({
                              isOpen: true,
                              type: 'edit-staff',
                              title: `Edit: ${rightPanel.data.name} (${rightPanel.data.role})`,
                              data: rightPanel.data
                            });
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          + Add Bank Details Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* UPI ID & Payment QR Scanner Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                          <QrCode size={14} />
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          UPI ID & Scanner QR
                        </h4>
                      </div>
                      {rightPanel.data.upi_link || rightPanel.data.scanner_image ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          UPI Enabled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          Not Configured
                        </span>
                      )}
                    </div>

                    {rightPanel.data.upi_link ? (
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">UPI VPA / Link</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">{rightPanel.data.upi_link}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(rightPanel.data.upi_link, 'UPI Link')}
                          className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer shadow-2xs"
                          title="Copy UPI ID"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    ) : null}

                    {rightPanel.data.scanner_image ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Payment Scanner QR Code</span>
                        <img
                          src={rightPanel.data.scanner_image}
                          alt="Payment QR Scanner"
                          className="max-h-52 mx-auto object-contain rounded-xl border border-slate-300 bg-white p-2 shadow-xs"
                        />
                        <div className="pt-1">
                          <a
                            href={rightPanel.data.scanner_image}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            <ExternalLink size={12} />
                            <span>View / Download Full Image</span>
                          </a>
                        </div>
                      </div>
                    ) : null}

                    {!rightPanel.data.upi_link && !rightPanel.data.scanner_image && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                        <p className="text-xs text-slate-500">No UPI VPA or QR code scanner image has been uploaded.</p>
                        <button
                          onClick={() => {
                            setStaffForm(getPopulatedStaffForm(rightPanel.data));
                            setRightPanel({
                              isOpen: true,
                              type: 'edit-staff',
                              title: `Edit: ${rightPanel.data.name} (${rightPanel.data.role})`,
                              data: rightPanel.data
                            });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          + Add UPI Details / Scanner
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Social Media & Portfolios Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                          <Globe size={14} />
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Social Media & Online Presence
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {rightPanel.data.instagram && (
                        <a
                          href={rightPanel.data.instagram.startsWith('http') ? rightPanel.data.instagram : `https://instagram.com/${rightPanel.data.instagram.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-100 transition group"
                        >
                          <div className="flex items-center gap-2">
                            <Instagram size={15} className="text-pink-600" />
                            <span className="font-bold text-xs text-slate-900 group-hover:text-pink-700">Instagram</span>
                          </div>
                          <span className="text-[11px] text-slate-500 group-hover:text-pink-600 flex items-center gap-1 font-medium">
                            {rightPanel.data.instagram}
                            <ExternalLink size={11} />
                          </span>
                        </a>
                      )}

                      {rightPanel.data.facebook && (
                        <a
                          href={rightPanel.data.facebook.startsWith('http') ? rightPanel.data.facebook : `https://facebook.com/${rightPanel.data.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 transition group"
                        >
                          <div className="flex items-center gap-2">
                            <Facebook size={15} className="text-blue-600" />
                            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700">Facebook</span>
                          </div>
                          <span className="text-[11px] text-slate-500 group-hover:text-blue-600 flex items-center gap-1 font-medium">
                            {rightPanel.data.facebook}
                            <ExternalLink size={11} />
                          </span>
                        </a>
                      )}

                      {rightPanel.data.linkedin && (
                        <a
                          href={rightPanel.data.linkedin.startsWith('http') ? rightPanel.data.linkedin : `https://linkedin.com/in/${rightPanel.data.linkedin}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 transition group"
                        >
                          <div className="flex items-center gap-2">
                            <Linkedin size={15} className="text-blue-700" />
                            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-800">LinkedIn</span>
                          </div>
                          <span className="text-[11px] text-slate-500 group-hover:text-blue-700 flex items-center gap-1 font-medium">
                            {rightPanel.data.linkedin}
                            <ExternalLink size={11} />
                          </span>
                        </a>
                      )}

                      {rightPanel.data.portfolio && (
                        <a
                          href={rightPanel.data.portfolio.startsWith('http') ? rightPanel.data.portfolio : `https://${rightPanel.data.portfolio}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 transition group"
                        >
                          <div className="flex items-center gap-2">
                            <Globe size={15} className="text-indigo-600" />
                            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-800">Portfolio</span>
                          </div>
                          <span className="text-[11px] text-slate-500 group-hover:text-indigo-700 flex items-center gap-1 font-medium">
                            {rightPanel.data.portfolio}
                            <ExternalLink size={11} />
                          </span>
                        </a>
                      )}

                      {/* Dynamic Other Socials */}
                      {Array.isArray(rightPanel.data.other_socials) && rightPanel.data.other_socials.map((soc: any, idx: number) => {
                        if (!soc || !soc.url) return null;
                        const href = soc.url.startsWith('http') ? soc.url : `https://${soc.url}`;
                        return (
                          <a
                            key={idx}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition group"
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink size={14} className="text-slate-600" />
                              <span className="font-bold text-xs text-slate-900">{soc.platform || 'Custom Link'}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                              {soc.url}
                              <ExternalLink size={11} />
                            </span>
                          </a>
                        );
                      })}

                      {!rightPanel.data.instagram && !rightPanel.data.facebook && !rightPanel.data.linkedin && !rightPanel.data.portfolio && (!Array.isArray(rightPanel.data.other_socials) || rightPanel.data.other_socials.length === 0) && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                          <p className="text-xs text-slate-500">No social media profiles linked yet.</p>
                          <button
                            onClick={() => {
                              setStaffForm(getPopulatedStaffForm(rightPanel.data));
                              setRightPanel({
                                isOpen: true,
                                type: 'edit-staff',
                                title: `Edit: ${rightPanel.data.name} (${rightPanel.data.role})`,
                                data: rightPanel.data
                              });
                            }}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                          >
                            + Add Social Profiles
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffForm(getPopulatedStaffForm(rightPanel.data));
                        setRightPanel({
                          isOpen: true,
                          type: 'edit-staff',
                          title: `Edit: ${rightPanel.data.name} (${rightPanel.data.role})`,
                          data: rightPanel.data
                        });
                      }}
                      className="flex-2 py-2.5 rounded-xl bg-black hover:bg-blue-600 text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Pencil size={14} />
                      <span>Edit Member & Settlement Info</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE I: ADD / EDIT CLIENT                                     */}
              {/* ───────────────────────────────────────────────────────────── */}
              {(rightPanel.type === 'add-client' || rightPanel.type === 'edit-client') && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!clientForm.name.trim()) {
                      toast.error('Please enter client enterprise name');
                      return;
                    }
                    if (rightPanel.type === 'add-client') {
                      await createClientInDb(clientForm);
                      const newClient = {
                        activeProjects: 1,
                        pipelineStatus: 'Active Account',
                        tools: ['Enterprise Cloud'],
                        area: ['Corporate Technology'],
                        ...clientForm,
                        id: clientForm.id || `CLT-${Date.now().toString().slice(-4)}`
                      };
                      setCrmClients(prev => {
                        const updated = [newClient, ...prev];
                        saveStoredClients(updated);
                        return updated;
                      });
                      toast.success(`Registered corporate client: ${clientForm.name}`);
                    } else {
                      await updateClientInDb(clientForm.id, clientForm);
                      setCrmClients(prev => {
                        const updated = prev.map(c => c.id === clientForm.id ? { ...c, ...clientForm } : c);
                        saveStoredClients(updated);
                        return updated;
                      });
                      toast.success(`Updated client: ${clientForm.name}`);
                    }
                    setRightPanel({ isOpen: false, type: null, title: '' });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      placeholder="e.g. Arrox Tech Company"
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Organization Type</label>
                      <select
                        value={clientForm.type || 'Corporate Client'}
                        onChange={(e) => setClientForm({ ...clientForm, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Corporate Client">Corporate Client</option>
                        <option value="Collaborator Company">Collaborator Company</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">MOU Status</label>
                      <select
                        value={clientForm.mouStatus || 'Mou not signed'}
                        onChange={(e) => setClientForm({ ...clientForm, mouStatus: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Mou not signed">Mou not signed</option>
                        <option value="Collaborator Partner">Collaborator Partner</option>
                        <option value="Active MOU">Active MOU</option>
                        <option value="MOU Signed">MOU Signed</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Project Name / Scope</label>
                    <input
                      type="text"
                      value={clientForm.project || ''}
                      onChange={(e) => setClientForm({ ...clientForm, project: e.target.value })}
                      placeholder="e.g. Website cum ERP"
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Contact Person</label>
                      <input
                        type="text"
                        value={clientForm.contactPerson || ''}
                        onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                        placeholder="Praveen Shakti"
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Contact Email</label>
                      <input
                        type="email"
                        value={clientForm.email || ''}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        placeholder="praveenshakthi001@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-[#64748B]">Quotation</label>
                      <input
                        type="text"
                        value={clientForm.contractValue || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                          const rec = clientForm.receivedAmount || 8000;
                          setClientForm({ 
                            ...clientForm, 
                            contractValue: val,
                            quotationAmount: num,
                            balanceDue: `₹${Math.max(0, num - rec).toLocaleString('en-IN')}`
                          });
                        }}
                        placeholder="₹15,000"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0066FF] focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-[#64748B]">Received</label>
                      <input
                        type="text"
                        value={clientForm.amountPaid || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                          const quot = clientForm.quotationAmount || 15000;
                          setClientForm({ 
                            ...clientForm, 
                            amountPaid: val,
                            receivedAmount: num,
                            balanceDue: `₹${Math.max(0, quot - num).toLocaleString('en-IN')}`
                          });
                        }}
                        placeholder="₹8,000"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-emerald-600 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-[#64748B]">Balance Due</label>
                      <input
                        type="text"
                        value={clientForm.balanceDue || ''}
                        onChange={(e) => setClientForm({ ...clientForm, balanceDue: e.target.value })}
                        placeholder="₹7,000"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-amber-600 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    {rightPanel.type === 'edit-client' && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Delete client "${clientForm.name}" permanently?`)) {
                            await deleteClientFromDb(clientForm.id);
                            const updated = crmClients.filter(item => item.id !== clientForm.id);
                            setCrmClients(updated);
                            saveStoredClients(updated);
                            toast.success(`Deleted partner account: ${clientForm.name}`);
                            setRightPanel({ isOpen: false, type: null, title: '' });
                          }
                        }}
                        className="px-3 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                      className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-2.5 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>{rightPanel.type === 'add-client' ? 'Add Client' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CASE J: RECORD FINANCIAL PAYMENT                              */}
              {/* ───────────────────────────────────────────────────────────── */}
              {rightPanel.type === 'add-payment' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!paymentForm.payer.trim()) {
                      toast.error('Please enter payer or client name');
                      return;
                    }
                    const newEntry = {
                      ...paymentForm,
                      id: paymentForm.id || `INV-2026-0${paymentsList.length + 90}`
                    };
                    await recordPaymentInDb(newEntry);
                    setPaymentsList(prev => [newEntry, ...prev]);
                    toast.success(`Recorded payment of ${newEntry.amount} from ${newEntry.payer}`);
                    setRightPanel({ isOpen: false, type: null, title: '' });
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Invoice / Ref ID *</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.id}
                        onChange={(e) => setPaymentForm({ ...paymentForm, id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-mono text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Amount (₹) *</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                        placeholder="₹1,50,000"
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Payer / Account Name *</label>
                    <input
                      type="text"
                      required
                      value={paymentForm.payer}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payer: e.target.value })}
                      placeholder="e.g. Enterprise Client / Partner Account"
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Payment / Billing Type</label>
                    <input
                      type="text"
                      value={paymentForm.type}
                      onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                      placeholder="e.g. Enterprise Milestone Sprint 03"
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Payment Method</label>
                      <select
                        value={paymentForm.method}
                        onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Wire Transfer">Wire Transfer</option>
                        <option value="Direct Bank">Direct Bank</option>
                        <option value="Institutional NEFT">Institutional NEFT</option>
                        <option value="UPI / Razorpay">UPI / Razorpay</option>
                        <option value="Corporate Cheque">Corporate Cheque</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase text-[#64748B]">Status</label>
                      <select
                        value={paymentForm.status}
                        onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="Cleared">Cleared</option>
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRightPanel({ isOpen: false, type: null, title: '' })}
                      className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-2.5 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Record Payment</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* APPLE / ANDROID NATIVE MOBILE BOTTOM NAVIGATION DOCK (md:hidden)      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <nav 
        aria-label="Mobile Admin Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#E2E8F0] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-safe safe-bottom flex items-center justify-around select-none"
      >
        {/* 1. Dashboard Overview */}
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
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Dashboard</span>
        </button>

        {/* 2. Students */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('all-students');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 relative ${
            activeTab === 'all-students' || activeTab === 'registrations' || activeTab === 'attendance'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition relative ${activeTab === 'all-students' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <GraduationCap size={19} />
            <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-black bg-[#0066FF] text-white flex items-center justify-center ring-2 ring-white">
              {students.length}
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Students</span>
        </button>

        {/* 3. Certificates */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('cert-course');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 relative ${
            activeTab.startsWith('cert-') || activeTab === 'offer-letters'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition relative ${activeTab.startsWith('cert-') || activeTab === 'offer-letters' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <Award size={19} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#0066FF] ring-2 ring-white" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Certificates</span>
        </button>

        {/* 4. Finance / Dues */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('student-payments');
            setMobileMenuOpen(false);
            setMobileMoreSheetOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 ${
            activeTab === 'student-payments' || activeTab === 'finance'
              ? 'text-[#000000] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'student-payments' || activeTab === 'finance' ? 'bg-[#000000] text-white shadow-xs' : 'text-[#64748B]'}`}>
            <Wallet size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Finance</span>
        </button>

        {/* 5. More / ERP Operations */}
        <button
          type="button"
          onClick={() => setMobileMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition cursor-pointer active:scale-90 ${
            mobileMoreSheetOpen || activeTab === 'staff' || activeTab === 'clients' || activeTab === 'database' || activeTab === 'settings' || activeTab === 'reports'
              ? 'text-[#0066FF] font-extrabold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${mobileMoreSheetOpen ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'text-[#64748B]'}`}>
            <Layers size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">More ERP</span>
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
            className="w-full max-h-[92vh] bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 pb-safe"
          >
            {/* Apple Drag Indicator */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Sheet Header: Admin Profile + Role Switch */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#000000] text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#0F172A] truncate">
                      {user.name || 'Administrator'}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 uppercase">
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] break-words mt-0.5">
                    Atideto Technologies ERP Suite
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

            {/* Complete ERP Navigation Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar text-xs font-semibold">
              
              {/* CATEGORY 1: STUDENTS MANAGEMENT */}
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 block pt-1 pb-1">
                Students Management
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
                  <span>ERP Dashboard Overview</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('all-students');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'all-students' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} />
                  <span>All Students Roster</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF] text-white">
                  {students.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('registrations');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'registrations' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={18} />
                  <span>Candidate Registrations</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
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
                  <span>Cohort Attendance</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
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
                  <span>Industrial Internships</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('reports');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'reports' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart2 size={18} />
                  <span>Student Academic Reports</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('student-payments');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'student-payments' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet size={18} />
                  <span>Student Payments & Dues</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              {/* CATEGORY 2: OFFICIAL CERTIFICATES */}
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 block pt-3 pb-1">
                Official Credentials & Certificates
              </span>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('offer-letters');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'offer-letters' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Offer Letter Generator</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('cert-course');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'cert-course' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award size={18} />
                  <span>Course Completion Certificate</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('cert-internship');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'cert-internship' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare size={18} />
                  <span>Internship Completion Certificate</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('cert-attendance');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'cert-attendance' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck size={18} />
                  <span>Attendance Certificate</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              {/* CATEGORY 3: ENTERPRISE OPERATIONS */}
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] px-2 block pt-3 pb-1">
                Operations & Systems
              </span>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('staff');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'staff' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Staff & Core Founders (7)</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('clients');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'clients' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 size={18} />
                  <span>Company & Collaborators</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('database');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'database' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database size={18} />
                  <span>System Database & Console</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                  setMobileMoreSheetOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'settings' ? 'bg-black text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon size={18} />
                  <span>Global Settings</span>
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
                  <span>Sign Out of Admin Suite</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  collapsed,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition text-left cursor-pointer ${
        active 
          ? 'bg-[#000000] text-white font-extrabold shadow-sm' 
          : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[#64748B]'}>{icon}</span>
      {!collapsed && (
        <span className="truncate tracking-tight text-xs">{label}</span>
      )}
    </button>
  );
}
