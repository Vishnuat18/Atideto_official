// Shared Certificate & Student Registry Store
// Guarantees 1:1 consistent IDs across Admin ERP, Student Portal, and Public Verification.

export interface StudentCohortRecord {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  gradYear: string;
  course: string;
  domain: string;
  startDate: string;
  endDate?: string;
  duration: string;
  mentor: string;
  attendance: number;
  score: number;
  feePaid: string;
  feeTotal: string;
  paymentStatus: string;
  certId: string;
  offerNo: string;
  issueDate: string;
  status: 'active' | 'completed' | 'revoked';
  tools: string[];
  area: string[];
  certGenerated?: boolean;
  certGeneratedAt?: string;
  sentToAdministration?: boolean;
  certHold?: boolean;
  attendanceCertId?: string;
}

export const COURSE_CODE_MAP: Record<string, string> = {
  'Full stack web development': 'MER',
  'Full Stack Web Development': 'MER',
  'Full Stack Development': 'MER',
  'Full Stack Development (MERN Stack)': 'MER',
  'web development': 'WDV',
  'Web development': 'WDV',
  'Web Development': 'WDV',
  'Java Full Stack Web Development': 'JFS',
  'MERN Full Stack Web Development': 'MER',
  'MEAN Full Stack Web Development': 'MEA',
  'Python': 'PYT',
  'python': 'PYT',
  'Python Programming': 'PYT',
  'Core Java': 'CJV',
  'Data Science': 'DSC',
  'Digital Marketing': 'DGM',
  'Mobile App Development': 'APP',
  'Cyber security': 'CYB',
  'Cyber Security': 'CYB',
  'Cloud Computing': 'CLD',
  'UI / UX Design': 'UIX',
};

export function getCourseCode(title: string): string {
  if (!title) return 'GEN';
  for (const [key, code] of Object.entries(COURSE_CODE_MAP)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return code;
  }
  return 'GEN';
}

export const CANONICAL_COHORT_STUDENTS: StudentCohortRecord[] = [
  {
    id: '710022104001',
    name: 'Arun Kumar',
    email: 'arunkumar@annauniv.edu',
    phone: '+91 98765 43210',
    college: 'Anna University',
    degree: 'B.E Computer Science & Engineering',
    gradYear: '2026',
    course: 'Web Development',
    domain: 'Web Development',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    duration: '2 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 100,
    score: 98,
    feePaid: '₹0',
    feeTotal: '₹0',
    paymentStatus: 'Completed',
    certId: 'ATD-INT-2026-0001',
    offerNo: 'ATD-OFL-2026-0001',
    issueDate: '2026-08-01',
    status: 'completed',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    area: ['Frontend', 'Web Development']
  },
  // 15 B.Tech IT Candidates (Mahendra Engineering College)
  {
    id: 'AT-MEC-2027-01',
    name: 'Suresh kumar D',
    email: 'sureshkumard706@gmail.com',
    phone: '+91 90473 33741',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full stack web development',
    domain: 'Full stack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 96,
    score: 95,
    feePaid: '₹0',
    feeTotal: '₹650',
    paymentStatus: 'Payment Due',
    certId: 'AT-IC-MER-2026-0001',
    offerNo: 'ATD-OFL-2026-0001',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
    area: ['Full Stack', 'Web Development', 'MERN Stack']
  },
  {
    id: 'AT-MEC-2027-02',
    name: 'V.vishwa',
    email: 'vishwa0847@gmail.com',
    phone: '+91 78453 72081',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'web development',
    domain: 'web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Priya Sundaram (Staff Architect)',
    attendance: 95,
    score: 93,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0002',
    offerNo: 'ATD-OFL-2026-0002',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive UI'],
    area: ['Web Development', 'Frontend Systems']
  },
  {
    id: 'AT-MEC-2027-03',
    name: 'SARAVANAN K',
    email: 'starsaro615@gmail.com',
    phone: '+91 63824 43901',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full Stack Web Development',
    domain: 'Full Stack Web Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Vishnu R (Technical Director)',
    attendance: 97,
    score: 96,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0003',
    offerNo: 'ATD-OFL-2026-0003',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    area: ['Full Stack', 'Backend APIs', 'Web Applications']
  },
  {
    id: 'AT-MEC-2027-04',
    name: 'V.Nithish kumar',
    email: 'nithu2005nk@gmail.com',
    phone: '+91 98949 58127',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full stack Web Development',
    domain: 'Full stack Web Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 98,
    score: 97,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0004',
    offerNo: 'ATD-OFL-2026-0004',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB'],
    area: ['Full Stack', 'Frontend Engineering', 'Modern Web']
  },
  {
    id: 'AT-MEC-2027-05',
    name: 'SRISHANMATHI R',
    email: 'srishanmathi861019@gmail.com',
    phone: '+91 80568 12105',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full Stack Web Development',
    domain: 'Full Stack Web Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Priya Sundaram (Staff Architect)',
    attendance: 98,
    score: 96,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0005',
    offerNo: 'ATD-OFL-2026-0005',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'SQL', 'Postman'],
    area: ['Full Stack', 'Backend APIs', 'Web Systems']
  },
  {
    id: 'AT-MEC-2027-06',
    name: 'SAILISHA S',
    email: 'sailishas3@gmail.com',
    phone: '+91 80154 74295',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'full stack web development',
    domain: 'full stack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 95,
    score: 93,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0006',
    offerNo: 'ATD-OFL-2026-0006',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    area: ['Full Stack', 'Responsive UI']
  },
  {
    id: 'AT-MEC-2027-07',
    name: 'S.Prasantha',
    email: 'prasantha2006s@gmail.com',
    phone: '+91 93421 26255',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Fullstack Web development',
    domain: 'Fullstack Web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Vishnu R (Technical Director)',
    attendance: 96,
    score: 94,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0007',
    offerNo: 'ATD-OFL-2026-0007',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    area: ['Full Stack', 'MERN Stack']
  },
  {
    id: 'AT-MEC-2027-08',
    name: 'A.PRIYA',
    email: 'priyaanandan780@gmail.com',
    phone: '+91 99433 72027',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Fullstack web development',
    domain: 'Fullstack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Priya Sundaram (Staff Architect)',
    attendance: 95,
    score: 93,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0008',
    offerNo: 'ATD-OFL-2026-0008',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    area: ['Full Stack', 'Frontend Systems']
  },
  {
    id: 'AT-MEC-2027-09',
    name: 'SHIBIYA S',
    email: 'shibiya86@gmail.com',
    phone: '+91 90432 07088',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full stack web development',
    domain: 'Full stack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 97,
    score: 95,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0009',
    offerNo: 'ATD-OFL-2026-0009',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker'],
    area: ['Full Stack', 'Cloud Deployment']
  },
  {
    id: 'AT-MEC-2027-10',
    name: 'S.Preethiroshini',
    email: 'preethiroshini184@gmail.com',
    phone: '+91 86676 22088',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full stack web development',
    domain: 'Full stack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Priya Sundaram (Staff Architect)',
    attendance: 96,
    score: 94,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0010',
    offerNo: 'ATD-OFL-2026-0010',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
    area: ['Full Stack', 'Interactive UI']
  },
  {
    id: 'AT-MEC-2027-11',
    name: 'S.Priyadharshini',
    email: 'priyadk515@gmail.com',
    phone: '+91 87544 20699',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full stack web development',
    domain: 'Full stack web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 97,
    score: 95,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0011',
    offerNo: 'ATD-OFL-2026-0011',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
    area: ['Full Stack', 'Web Development']
  },
  {
    id: 'AT-MEC-2027-12',
    name: 'S.Sanjay',
    email: 'sjay69521@gmail.com',
    phone: '+91 93456 91952',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full Stack Development',
    domain: 'Full Stack Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Vishnu R (Technical Director)',
    attendance: 96,
    score: 94,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0012',
    offerNo: 'ATD-OFL-2026-0012',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
    area: ['Full Stack', 'Web Development']
  },
  {
    id: 'AT-MEC-2027-13',
    name: 'R. Yoshika',
    email: 'yoshikajune12@gmail.com',
    phone: '+91 90803 95931',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Web development',
    domain: 'Web development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Priya Sundaram (Staff Architect)',
    attendance: 95,
    score: 94,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0013',
    offerNo: 'ATD-OFL-2026-0013',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    area: ['Web Development', 'Frontend UI']
  },
  {
    id: 'AT-MEC-2027-14',
    name: 'Vimal Pravin V',
    email: 'vimalpravin071@gmail.com',
    phone: '+91 63854 17239',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Web Development',
    domain: 'Web Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 96,
    score: 95,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0014',
    offerNo: 'ATD-OFL-2026-0014',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
    area: ['Web Development', 'Full Stack']
  },
  {
    id: 'AT-MEC-2027-15',
    name: 'Yogesh S',
    email: 'yogeshbrf2006@gmail.com',
    phone: '+91 93844 44413',
    college: 'Mahendra Engineering College',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    course: 'Full Stack Web Development',
    domain: 'Full Stack Web Development',
    startDate: '2026-10-25',
    endDate: '2027-01-25',
    duration: '3 Months',
    mentor: 'Vishnu R (Technical Director)',
    attendance: 98,
    score: 96,
    feePaid: '₹0',
    feeTotal: '₹700',
    paymentStatus: 'Payment Due',
    certId: 'ATD-INT-2026-0015',
    offerNo: 'ATD-OFL-2026-0015',
    issueDate: '2026-10-25',
    status: 'active',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
    area: ['Full Stack', 'Web Development']
  },

  // 6 B.E. CSE Candidates (Mahendra College of Engineering)
  {
    id: 'AT-MCE-2027-01',
    name: 'Saravanan M',
    email: 'saravananmanigandan8@gmail.com',
    phone: '+91 81248 52751',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'python',
    domain: 'python',
    startDate: '2026-09-24',
    endDate: '2026-10-23',
    duration: '1 Month',
    mentor: 'Lead Python Engineer',
    attendance: 97,
    score: 95,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0016',
    offerNo: 'ATD-OFL-2026-0016',
    issueDate: '2026-10-23',
    status: 'active',
    tools: ['Python', 'Django', 'FastAPI', 'PostgreSQL'],
    area: ['Python Programming', 'Backend Systems']
  },
  {
    id: 'AT-MCE-2027-02',
    name: 'Rithick S',
    email: 'rithickroshan2005s@gmail.com',
    phone: '+91 72006 91128',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'Full Stack Development (MERN Stack)',
    domain: 'Full Stack Development (MERN Stack)',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    duration: '1 Month',
    mentor: 'Karthik Ramanathan (AI & Web Lead)',
    attendance: 98,
    score: 96,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0017',
    offerNo: 'ATD-OFL-2026-0017',
    issueDate: '2026-10-30',
    status: 'active',
    tools: ['MongoDB', 'Express', 'React', 'Node.js'],
    area: ['Full Stack', 'MERN Stack']
  },
  {
    id: 'AT-MCE-2027-03',
    name: 'Srisanth M',
    email: 'srisathabi@gmail.com',
    phone: '+91 73394 43932',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'Cyber security',
    domain: 'Cyber security',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    duration: '1 Month',
    mentor: 'Certified Ethical Hacker (CEH)',
    attendance: 96,
    score: 94,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0018',
    offerNo: 'ATD-OFL-2026-0018',
    issueDate: '2026-10-30',
    status: 'active',
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'],
    area: ['Cyber Security', 'Network Defense']
  },
  {
    id: 'AT-MCE-2027-04',
    name: 'Siva K',
    email: 'sivasiva90574@gmail.com',
    phone: '+91 63809 65886',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'Cyber security',
    domain: 'Cyber security',
    startDate: '2026-10-02',
    endDate: '2026-10-30',
    duration: '1 Month',
    mentor: 'Certified Ethical Hacker (CEH)',
    attendance: 96,
    score: 95,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0019',
    offerNo: 'ATD-OFL-2026-0019',
    issueDate: '2026-10-30',
    status: 'active',
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'],
    area: ['Cyber Security', 'Network Defense']
  },
  {
    id: 'AT-MCE-2027-05',
    name: 'Rajesh D',
    email: 'drajesh20061@gmail.com',
    phone: '+91 63799 11479',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'Cyber security',
    domain: 'Cyber security',
    startDate: '2026-10-02',
    endDate: '2026-10-30',
    duration: '1 Month',
    mentor: 'Certified Ethical Hacker (CEH)',
    attendance: 97,
    score: 95,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0020',
    offerNo: 'ATD-OFL-2026-0020',
    issueDate: '2026-10-30',
    status: 'active',
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'],
    area: ['Cyber Security', 'Network Defense']
  },
  {
    id: 'AT-MCE-2027-06',
    name: 'Thamarai Kannan S',
    email: 'kannanthamarai699@gmail.com',
    phone: '+91 95004 32154',
    college: 'Mahendra College of Engineering',
    degree: 'B.E. Computer Science and Engineering',
    gradYear: '2027',
    course: 'Cyber security',
    domain: 'Cyber security',
    startDate: '2026-10-02',
    endDate: '2026-10-30',
    duration: '1 Month',
    mentor: 'Certified Ethical Hacker (CEH)',
    attendance: 96,
    score: 94,
    feePaid: '₹500',
    feeTotal: '₹1,000',
    paymentStatus: 'Partial Paid',
    certId: 'ATD-INT-2026-0021',
    offerNo: 'ATD-OFL-2026-0021',
    issueDate: '2026-10-30',
    status: 'active',
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'],
    area: ['Cyber Security', 'Network Defense']
  }
];

const CACHE_KEY = 'atideto_cohort_students_v2';

export const CLIENTS_CACHE_KEY = 'atideto_crm_clients';

// Canonical domain normalizer to merge duplicate tracks & spelling/casing variations
export function normalizeDomain(domain?: string): string {
  if (!domain) return 'Full Stack Web Development';
  const clean = domain.trim();
  const lower = clean.toLowerCase();

  // Full Stack variations
  if (lower.includes('full stack') || lower.includes('fullstack') || lower.includes('mern') || lower.includes('mean')) {
    if (lower.includes('java')) return 'Full Stack Web Development (Java)';
    if (lower.includes('mean')) return 'Full Stack Development (MEAN Stack)';
    if (lower.includes('mern')) return 'Full Stack Development (MERN Stack)';
    return 'Full Stack Web Development';
  }

  // Web Development
  if (lower.includes('web dev') || lower === 'web development' || lower.includes('web development')) {
    return 'Web Development';
  }

  // Python
  if (lower.includes('python')) {
    return 'Python Programming';
  }

  // Cyber Security
  if (lower.includes('cyber') || lower.includes('security') || lower.includes('ethical hack')) {
    return 'Cyber Security';
  }

  // Data Science
  if (lower.includes('data science') || lower.includes('machine learning')) {
    return 'Data Science';
  }

  // Data Analytics
  if (lower.includes('data anal') || lower.includes('power bi')) {
    return 'Data Analytics';
  }

  // Core Java
  if (lower.includes('java') && !lower.includes('script')) {
    return 'Core Java';
  }

  // Cloud Computing / DevOps
  if (lower.includes('cloud') || lower.includes('devops') || lower.includes('aws') || lower.includes('gcp') || lower.includes('docker')) {
    return 'Cloud Computing & DevOps';
  }

  // UI / UX Design
  if ((lower.includes('ui') && lower.includes('ux')) || lower.includes('design') || lower.includes('figma')) {
    return 'UI / UX Design';
  }

  // Mobile App Development
  if (lower.includes('mobile') || lower.includes('app dev') || lower.includes('flutter') || lower.includes('react native') || lower.includes('android')) {
    return 'Mobile App Development';
  }

  // Digital Marketing
  if (lower.includes('digital market') || lower.includes('marketing') || lower.includes('seo')) {
    return 'Digital Marketing';
  }

  // Fallback: Title case trimmed string
  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Canonical college normalizer to trim whitespace and harmonize variations
export function normalizeCollege(college?: string): string {
  if (!college) return 'Mahendra Engineering College';
  const clean = college.trim().replace(/[\s,]+$/, '');
  const lower = clean.toLowerCase();

  if (lower.includes('mahendra college of engineering') || lower.includes('mce')) {
    return 'Mahendra College of Engineering';
  }
  if (lower.includes('mahendra engineering college') || lower.includes('mec')) {
    return 'Mahendra Engineering College';
  }
  if (lower.includes('anna univ')) {
    return 'Anna University';
  }
  return clean;
}

export const FINALIZED_PAYMENTS_KEY = 'atideto_finalized_payments';

export interface FinalizedPaymentRecord {
  feeTotal: string;
  feePaid: string;
  paymentStatus: string;
  updatedAt?: string;
  notes?: string;
  paymentMethod?: string;
}

// Built-in verified baseline finalized payments reflecting admin-decided amounts
const BASELINE_FINALIZED_PAYMENTS: Record<string, FinalizedPaymentRecord> = {
  // Arun Kumar (Anna Univ Alumni - Completed)
  '710022104001': { feeTotal: '₹0', feePaid: '₹0', paymentStatus: 'Completed' },
  'arunkumar@annauniv.edu': { feeTotal: '₹0', feePaid: '₹0', paymentStatus: 'Completed' },

  // MEC Candidates: ₹700 (Suresh kumar D at ₹650)
  'at-mec-2027-01': { feeTotal: '₹650', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'sureshkumard706@gmail.com': { feeTotal: '₹650', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-02': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'vishwa0847@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-03': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'starsaro615@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-04': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'nithu2005nk@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-05': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'srishanmathi861019@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-06': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'sailishas3@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-07': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'prasantha2006s@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-08': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'priyaanandan780@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-09': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'shibiya86@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-10': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'preethiroshini184@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-11': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'priyadk515@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-12': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'sjay69521@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-13': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'yoshikajune12@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-14': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'vimalpravin071@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'at-mec-2027-15': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },
  'yogeshbrf2006@gmail.com': { feeTotal: '₹700', feePaid: '₹0', paymentStatus: 'Payment Due' },

  // MCE Candidates: Total ₹1,000, Paid ₹500, Partial Paid
  'at-mce-2027-01': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'saravananmanigandan8@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'at-mce-2027-02': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'rithickroshan2005s@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'at-mce-2027-03': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'srisathabi@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'at-mce-2027-04': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'sivasiva90574@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'at-mce-2027-05': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'drajesh20061@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'at-mce-2027-06': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' },
  'kannanthamarai699@gmail.com': { feeTotal: '₹1,000', feePaid: '₹500', paymentStatus: 'Partial Paid' }
};

export function getFinalizedPayments(): Record<string, FinalizedPaymentRecord> {
  let stored: Record<string, FinalizedPaymentRecord> = {};
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(FINALIZED_PAYMENTS_KEY);
      if (raw) stored = JSON.parse(raw);
    }
  } catch {}
  return { ...BASELINE_FINALIZED_PAYMENTS, ...stored };
}

export function saveFinalizedPayment(
  identifier: string, 
  dataOrFeePaid: Partial<FinalizedPaymentRecord> | string,
  feeTotalArg?: string,
  paymentStatusArg?: string
) {
  if (!identifier) return;
  try {
    const data: Partial<FinalizedPaymentRecord> = typeof dataOrFeePaid === 'object' && dataOrFeePaid !== null
      ? dataOrFeePaid
      : {
          feePaid: typeof dataOrFeePaid === 'string' ? dataOrFeePaid : undefined,
          feeTotal: feeTotalArg,
          paymentStatus: paymentStatusArg
        };
    if (typeof window !== 'undefined') {
      const current = getFinalizedPayments();
      const cleanKey = identifier.toLowerCase().trim();
      const existing: Partial<FinalizedPaymentRecord> = current[cleanKey] || {};
      
      const record: FinalizedPaymentRecord = {
        feeTotal: data.feeTotal !== undefined && data.feeTotal !== '' ? String(data.feeTotal) : (existing.feeTotal || 'To Be Decided by Admin'),
        feePaid: data.feePaid !== undefined && data.feePaid !== '' ? String(data.feePaid) : (existing.feePaid || '₹0'),
        paymentStatus: data.paymentStatus || existing.paymentStatus || 'Pending Admin Decision',
        updatedAt: new Date().toISOString(),
        notes: data.notes || existing.notes,
        paymentMethod: data.paymentMethod || existing.paymentMethod
      };

      current[cleanKey] = record;
      localStorage.setItem(FINALIZED_PAYMENTS_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('atideto_payment_update'));
    }
  } catch (e) {
    console.error('Failed to save finalized payment record:', e);
  }
}

// Central deduplication and merge function across all student sources
export function deduplicateAndMergeStudents(list: (Partial<StudentCohortRecord> & { student_id?: string; studentName?: string; course_interest?: string; courseInterest?: string })[]): StudentCohortRecord[] {
  if (!Array.isArray(list)) return [];

  const finalizedPayments = getFinalizedPayments();
  const mergedMap = new Map<string, StudentCohortRecord>();
  const emailToKey = new Map<string, string>();
  const phoneToKey = new Map<string, string>();

  const getPhoneDigits = (phone?: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : digits;
  };

  const getFinPayment = (id?: string, email?: string): FinalizedPaymentRecord | undefined => {
    const idKey = (id || '').toLowerCase().trim();
    const emailKey = (email || '').toLowerCase().trim();
    return (idKey && finalizedPayments[idKey]) || (emailKey && finalizedPayments[emailKey]) || undefined;
  };

  for (const raw of list) {
    if (!raw) continue;

    const rawId = (raw.id || raw.studentId || raw.student_id || '').trim();
    const rawName = (raw.name || raw.studentName || '').trim() || 'Registered Student';
    const rawEmail = (raw.email || '').trim().toLowerCase();
    const rawPhone = (raw.phone || '').trim();
    const phoneDigits = getPhoneDigits(rawPhone);

    // Identify if student already exists by ID, email, or 10-digit phone
    let existingKey: string | undefined;
    if (rawId && mergedMap.has(rawId.toLowerCase())) {
      existingKey = rawId.toLowerCase();
    } else if (rawEmail && emailToKey.has(rawEmail)) {
      existingKey = emailToKey.get(rawEmail);
    } else if (phoneDigits && phoneDigits.length >= 10 && phoneToKey.has(phoneDigits)) {
      existingKey = phoneToKey.get(phoneDigits);
    }

    const normDomain = normalizeDomain(raw.domain || raw.course || raw.course_interest || raw.courseInterest);
    const normCollege = normalizeCollege(raw.college);

    if (existingKey && mergedMap.has(existingKey)) {
      // Merge with existing record
      const existing = mergedMap.get(existingKey)!;

      const isExistingCanonical = /^AT-(MEC|MCE|STU)-\d+/i.test(existing.id) || /^\d{10,}/.test(existing.id);
      const isRawCanonical = /^AT-(MEC|MCE|STU)-\d+/i.test(rawId) || /^\d{10,}/.test(rawId);
      const chosenId = (isExistingCanonical || !isRawCanonical) ? existing.id : rawId;

      const fin = getFinPayment(chosenId, rawEmail) || getFinPayment(existing.id, existing.email);

      // Payment details are FINAL once decided/updated
      let feeTotal = fin ? fin.feeTotal : '';
      if (!feeTotal) {
        if (existing.feeTotal && !existing.feeTotal.includes('34,000')) feeTotal = existing.feeTotal;
        else if (raw.feeTotal && !raw.feeTotal.includes('34,000')) feeTotal = raw.feeTotal;
        else feeTotal = 'To Be Decided by Admin';
      }

      let feePaid = fin ? fin.feePaid : '';
      if (!feePaid) {
        if (existing.feePaid && !existing.feePaid.includes('34,000')) feePaid = existing.feePaid;
        else if (raw.feePaid && !raw.feePaid.includes('34,000')) feePaid = raw.feePaid;
        else feePaid = '₹0';
      }

      let paymentStatus = fin ? fin.paymentStatus : (existing.paymentStatus || raw.paymentStatus || 'Pending Admin Decision');

      // Existing record in storage always takes priority over default/canonical values
      const mergedRecord: StudentCohortRecord = {
        ...existing,
        id: chosenId,
        studentId: chosenId,
        name: (existing.name && existing.name !== 'Registered Student') ? existing.name : (rawName || existing.name),
        email: existing.email || rawEmail,
        phone: existing.phone || rawPhone,
        college: existing.college || normCollege || 'Mahendra Engineering College',
        degree: existing.degree || raw.degree || 'B.Tech Information Technology',
        gradYear: existing.gradYear || raw.gradYear || '2027',
        course: existing.course || existing.domain || normDomain,
        domain: existing.domain || existing.course || normDomain,
        startDate: raw.startDate || existing.startDate || '2026-10-25',
        endDate: raw.endDate || existing.endDate || '2027-01-25',
        duration: raw.duration || existing.duration || '3 Months',
        mentor: raw.mentor || existing.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        attendance: raw.attendance !== undefined ? Number(raw.attendance) : (existing.attendance ?? 95),
        score: raw.score !== undefined ? Number(raw.score) : (existing.score ?? 95),
        feePaid,
        feeTotal,
        paymentStatus,
        certId: existing.certId || raw.certId || '',
        offerNo: existing.offerNo || raw.offerNo || '',
        attendanceCertId: existing.attendanceCertId || raw.attendanceCertId || '',
        issueDate: existing.issueDate || raw.issueDate || '2026-10-25',
        status: existing.status || (raw.status as any) || 'active',
        tools: (existing.tools && existing.tools.length > 0) ? existing.tools : (raw.tools || ['React', 'Node.js', 'Express', 'MongoDB']),
        area: (existing.area && existing.area.length > 0) ? existing.area : (raw.area || ['Full Stack', 'Web Development']),
        certGenerated: existing.certGenerated !== undefined ? existing.certGenerated : Boolean(raw.certGenerated),
        sentToAdministration: existing.sentToAdministration !== undefined ? existing.sentToAdministration : Boolean(raw.sentToAdministration),
        certHold: Boolean(existing.certHold !== undefined ? existing.certHold : raw.certHold)
      };

      mergedMap.set(existingKey, mergedRecord);
    } else {
      // New record
      const assignedId = rawId || `AT-STU-2026-${String(mergedMap.size + 1).padStart(4, '0')}`;
      const recordKey = assignedId.toLowerCase();

      const fin = getFinPayment(assignedId, rawEmail);

      let feeTotal = fin ? fin.feeTotal : '';
      if (!feeTotal) {
        if (raw.feeTotal && !raw.feeTotal.includes('34,000')) feeTotal = raw.feeTotal;
        else feeTotal = 'To Be Decided by Admin';
      }

      let feePaid = fin ? fin.feePaid : '';
      if (!feePaid) {
        if (raw.feePaid && !raw.feePaid.includes('34,000')) feePaid = raw.feePaid;
        else feePaid = '₹0';
      }

      let paymentStatus = fin ? fin.paymentStatus : (raw.paymentStatus || 'Pending Admin Decision');

      const newRecord: StudentCohortRecord = {
        id: assignedId,
        studentId: assignedId,
        name: rawName,
        email: rawEmail,
        phone: rawPhone,
        college: normCollege,
        degree: raw.degree || 'B.Tech Information Technology',
        gradYear: raw.gradYear || '2027',
        course: normDomain,
        domain: normDomain,
        startDate: raw.startDate || '2026-10-25',
        endDate: raw.endDate || '2027-01-25',
        duration: raw.duration || '3 Months',
        mentor: raw.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        attendance: raw.attendance !== undefined ? raw.attendance : 95,
        score: raw.score !== undefined ? raw.score : 95,
        feePaid,
        feeTotal,
        paymentStatus,
        certId: raw.certId || '',
        offerNo: raw.offerNo || '',
        attendanceCertId: raw.attendanceCertId || '',
        issueDate: raw.issueDate || raw.startDate || '2026-10-25',
        status: (raw.status as any) || 'active',
        tools: (raw.tools && raw.tools.length > 0) ? raw.tools : ['React', 'Node.js', 'Express', 'MongoDB'],
        area: (raw.area && raw.area.length > 0) ? raw.area : ['Full Stack', 'Web Development'],
        certGenerated: raw.certGenerated !== undefined ? raw.certGenerated : (raw.status === 'completed' || raw.id === '710022104001'),
        sentToAdministration: raw.sentToAdministration !== undefined ? raw.sentToAdministration : true,
        certHold: Boolean(raw.certHold)
      };

      mergedMap.set(recordKey, newRecord);
      if (rawEmail) emailToKey.set(rawEmail, recordKey);
      if (phoneDigits && phoneDigits.length >= 10) phoneToKey.set(phoneDigits, recordKey);
    }
  }

  // Preserve existing certificate IDs and sequences
  const result = Array.from(mergedMap.values());
  return result.map((s, idx) => {
    const seqStr = String(idx + 1).padStart(4, '0');
    return {
      ...s,
      certId: s.certId || `ATD-INT-2026-${seqStr}`,
      offerNo: s.offerNo || `ATD-OFL-2026-${seqStr}`,
      attendanceCertId: s.attendanceCertId || `ATD-ATT-2026-${seqStr}`,
    };
  });
}

export function getStoredStudents(): StudentCohortRecord[] {
  let list: any[] = [];
  let deletedIds: string[] = [];
  try {
    if (typeof window !== 'undefined') {
      const deletedRaw = localStorage.getItem('atideto_deleted_students');
      if (deletedRaw) {
        deletedIds = JSON.parse(deletedRaw);
      }
      const raw = localStorage.getItem(CACHE_KEY) || localStorage.getItem('atideto_students_cache');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = [...parsed];
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached student cohort:', e);
  }

  // Filter out any student that was intentionally deleted
  if (Array.isArray(deletedIds) && deletedIds.length > 0) {
    const delSet = new Set(deletedIds.map(d => String(d).toLowerCase().trim()));
    list = list.filter(s => {
      const sId = String(s.id || '').toLowerCase().trim();
      const sStudentId = String(s.studentId || '').toLowerCase().trim();
      const sCertId = String(s.certId || '').toLowerCase().trim();
      return !delSet.has(sId) && !delSet.has(sStudentId) && !delSet.has(sCertId);
    });
  }

  // Only seed with canonical cohort as initial fallback if storage is completely empty
  const finalStudents = list.length > 0 
    ? deduplicateAndMergeStudents(list) 
    : deduplicateAndMergeStudents(CANONICAL_COHORT_STUDENTS);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(finalStudents));
      localStorage.setItem('atideto_students_cache', JSON.stringify(finalStudents));
    }
  } catch {}
  return finalStudents;
}

export function saveStoredStudents(students: StudentCohortRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    const deduplicated = deduplicateAndMergeStudents(students);
    localStorage.setItem(CACHE_KEY, JSON.stringify(deduplicated));
    localStorage.setItem('atideto_students_cache', JSON.stringify(deduplicated));
    window.dispatchEvent(new CustomEvent('atideto-students-updated', { detail: deduplicated }));
    window.dispatchEvent(new Event('atideto_payment_update'));
  } catch (e) {
    console.error('Failed to save student cohort to localStorage:', e);
  }
}

export function addStudentToRegistry(studentData: Partial<StudentCohortRecord>): StudentCohortRecord[] {
  const current = getStoredStudents();
  const id = (studentData.id || studentData.studentId || '').trim().toLowerCase();
  const email = (studentData.email || '').trim().toLowerCase();
  const existingIdx = current.findIndex(s => {
    const sId = (s.id || '').trim().toLowerCase();
    const sStudentId = (s.studentId || '').trim().toLowerCase();
    const sEmail = (s.email || '').trim().toLowerCase();
    return (id && (sId === id || sStudentId === id)) || (email && sEmail === email);
  });
  if (existingIdx !== -1) {
    const updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...studentData };
    saveStoredStudents(updated);
    return updated;
  }
  const merged = deduplicateAndMergeStudents([studentData, ...current]);
  saveStoredStudents(merged);
  return merged;
}

export function updateStudentInRegistry(id: string, updates: Partial<StudentCohortRecord>): StudentCohortRecord[] {
  if (!id) return getStoredStudents();
  // Save finalized payment if payment fields were updated
  if (updates.feePaid !== undefined || updates.feeTotal !== undefined || updates.paymentStatus !== undefined) {
    saveFinalizedPayment(id, {
      feePaid: updates.feePaid,
      feeTotal: updates.feeTotal,
      paymentStatus: updates.paymentStatus
    });
    if (updates.email) {
      saveFinalizedPayment(updates.email, {
        feePaid: updates.feePaid,
        feeTotal: updates.feeTotal,
        paymentStatus: updates.paymentStatus
      });
    }
  }

  const current = getStoredStudents();
  const cleanId = id.trim().toLowerCase();
  const targetEmail = (updates.email || '').trim().toLowerCase();
  const next = current.map(st => {
    const stId = (st.id || '').trim().toLowerCase();
    const stStudentId = (st.studentId || '').trim().toLowerCase();
    const stEmail = (st.email || '').trim().toLowerCase();
    const isMatch = stId === cleanId || stStudentId === cleanId || (targetEmail && stEmail === targetEmail);
    if (!isMatch) return st;
    // Strictly preserve untouched fields while applying updates
    return { ...st, ...updates };
  });
  saveStoredStudents(next);
  return next;
}

export function removeStudentFromRegistry(id: string): StudentCohortRecord[] {
  const current = getStoredStudents();
  const next = current.filter(st => st.id !== id && st.studentId !== id);
  saveStoredStudents(next);
  return next;
}

export const CANONICAL_CLIENTS: any[] = [
  {
    id: 'CLT-ARX-001',
    client_id: 'CLT-ARX-001',
    name: 'Arrox Tech Company',
    type: 'Corporate Client',
    industry: 'Enterprise Software & IT Solutions',
    contactPerson: 'Praveen Shakti',
    contact_person: 'Praveen Shakti',
    email: 'praveenshakthi001@gmail.com',
    phone: '+91 98765 43210',
    mouStatus: 'Mou not signed',
    mou_status: 'Mou not signed',
    project: 'Website cum ERP',
    activeProjects: 1,
    active_projects: 1,
    quotationAmount: 15000,
    contractValue: '₹15,000',
    contract_value: '₹15,000',
    receivedAmount: 8000,
    amountPaid: '₹8,000',
    balanceDue: '₹7,000',
    paymentBreakdown: 'Received ₹3,000 + ₹5,000 = ₹8,000 (Balance: ₹7,000)',
    pipelineStatus: 'In Progress',
    pipeline_status: 'In Progress',
    tools: ['Website', 'ERP Systems', 'PostgreSQL', 'React', 'Node.js'],
    area: ['Enterprise Web', 'Business ERP', 'Database Architecture']
  },
  {
    id: 'COL-ZYR-001',
    client_id: 'COL-ZYR-001',
    name: 'ZyrFlow Technologies Private Limited',
    type: 'Collaborator Company',
    industry: 'Technology & Industrial R&D',
    contactPerson: 'ZyrFlow Leadership Team',
    contact_person: 'ZyrFlow Leadership Team',
    email: 'contact@zyrflow.com',
    phone: '+91 98765 12345',
    mouStatus: 'Collaborator Partner',
    mou_status: 'Collaborator Partner',
    project: 'Industrial Talent Immersion & Student Co-op',
    activeProjects: 2,
    active_projects: 2,
    quotationAmount: 0,
    contractValue: 'Strategic Collaboration',
    contract_value: 'Strategic Collaboration',
    receivedAmount: 0,
    amountPaid: 'N/A',
    balanceDue: '₹0',
    pipelineStatus: 'Active Partnership',
    pipeline_status: 'Active Partnership',
    tools: ['Industrial Tracks', 'Co-op Education', 'Corporate Immersion'],
    area: ['Collaborative Ecosystem', 'Workforce Training']
  },
  {
    id: 'COL-PIV-001',
    client_id: 'COL-PIV-001',
    name: 'Pivilis Tech Company',
    type: 'Collaborator Company',
    industry: 'Software Engineering & Cloud Solutions',
    contactPerson: 'Pivilis Operations Team',
    contact_person: 'Pivilis Operations Team',
    email: 'hello@pivilis.tech',
    phone: '+91 98765 67890',
    mouStatus: 'Collaborator Partner',
    mou_status: 'Collaborator Partner',
    project: 'Technical Project Incubation & Product Engineering',
    activeProjects: 1,
    active_projects: 1,
    quotationAmount: 0,
    contractValue: 'Strategic Collaboration',
    contract_value: 'Strategic Collaboration',
    receivedAmount: 0,
    amountPaid: 'N/A',
    balanceDue: '₹0',
    pipelineStatus: 'Active Partnership',
    pipeline_status: 'Active Partnership',
    tools: ['Cloud Architecture', 'Product Engineering', 'Full Stack'],
    area: ['Collaborative Ecosystem', 'Product R&D']
  }
];

export function getStoredClients(): any[] {
  if (typeof window === 'undefined') return CANONICAL_CLIENTS;
  try {
    const raw = localStorage.getItem(CLIENTS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure Arrox, ZyrFlow, and Pivilis are always present with exact real fields
        const hasArrox = parsed.some(c => c.name && c.name.toLowerCase().includes('arrox'));
        const hasZyrFlow = parsed.some(c => c.name && c.name.toLowerCase().includes('zyrflow'));
        const hasPivilis = parsed.some(c => c.name && c.name.toLowerCase().includes('pivilis'));
        if (!hasArrox || !hasZyrFlow || !hasPivilis) {
          const merged = [...parsed];
          if (!hasArrox) merged.unshift(CANONICAL_CLIENTS[0]);
          if (!hasZyrFlow) merged.push(CANONICAL_CLIENTS[1]);
          if (!hasPivilis) merged.push(CANONICAL_CLIENTS[2]);
          saveStoredClients(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached clients:', e);
  }
  saveStoredClients(CANONICAL_CLIENTS);
  return CANONICAL_CLIENTS;
}

export function saveStoredClients(clients: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLIENTS_CACHE_KEY, JSON.stringify(clients));
    window.dispatchEvent(new CustomEvent('atideto-clients-updated', { detail: clients }));
  } catch (e) {
    console.error('Failed to save clients to localStorage:', e);
  }
}

export function updateClientInRegistry(id: string, updates: any): any[] {
  const current = getStoredClients();
  const next = current.map(c => c.id === id ? { ...c, ...updates } : c);
  saveStoredClients(next);
  return next;
}

export function removeClientFromRegistry(id: string): any[] {
  const current = getStoredClients();
  const next = current.filter(c => c.id !== id);
  saveStoredClients(next);
  return next;
}

export function findStudentOrCertificate(query: string): StudentCohortRecord | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  const qClean = q.replace(/[^a-z0-9]/g, '');
  if (!qClean || qClean === '-' || q === '---' || q.length < 2) return null;

  const list = getStoredStudents();

  // 1. Exact match by certId, studentId, email, offerNo, or full name
  const exact = list.find(s => 
    s.id.toLowerCase() === q ||
    (s.studentId && s.studentId.toLowerCase() === q) ||
    s.certId.toLowerCase() === q ||
    s.email.toLowerCase() === q ||
    s.name.toLowerCase() === q ||
    s.offerNo.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Alphanumeric stripped match (e.g. ATDINT20260001, ATICMER20260001, ATMEC202701)
  if (qClean.length >= 6) {
    const stripped = list.find(s => 
      s.certId.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean ||
      s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean ||
      (s.studentId && s.studentId.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean)
    );
    if (stripped) return stripped;
  }

  // 3. Qualified 4-box / cohort sequence match (e.g. 2026-0004 or MER-2026-0004)
  if (q.includes('-') || q.includes(' ')) {
    const parts = q.split(/[-/\s]+/).filter(Boolean);
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];
      if (/^\d{4}$/.test(secondLast) && /^\d{1,4}$/.test(lastPart)) {
        const rollFormatted = lastPart.padStart(4, '0');
        const match = list.find(s => {
          const sCert = s.certId.toLowerCase();
          const sId = s.id.toLowerCase();
          return (sCert.includes(`${secondLast}-${rollFormatted}`) || sCert.endsWith(rollFormatted) || sId.endsWith(lastPart));
        });
        if (match) return match;
      }
    }
  }

  // 4. Full Name match (at least 4 characters)
  if (q.length >= 4 && !/^\d+$/.test(q)) {
    const nameMatch = list.find(s => s.name.toLowerCase() === q || s.name.toLowerCase().startsWith(q));
    if (nameMatch) return nameMatch;
  }

  return null;
}

export function getVerificationUrl(certId: string): string {
  return `https://atideto.in/verify?id=${encodeURIComponent(certId)}`;
}


export function toggleStudentCertificateHold(id: string, hold?: boolean): StudentCohortRecord[] {
  const current = getStoredStudents();
  const next = current.map(st => {
    if (st.id === id || st.studentId === id) {
      const nextHold = hold !== undefined ? hold : !st.certHold;
      return { ...st, certHold: nextHold };
    }
    return st;
  });
  saveStoredStudents(next);
  return next;
}

export function deleteStudentFromRegistry(id: string): StudentCohortRecord[] {
  if (typeof window !== 'undefined') {
    try {
      const deletedRaw = localStorage.getItem('atideto_deleted_students');
      const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedList.includes(id)) {
        deletedList.push(id);
        localStorage.setItem('atideto_deleted_students', JSON.stringify(deletedList));
      }
    } catch (_) {}
  }

  const current = getStoredStudents();
  const next = current.filter(st => st.id !== id && st.studentId !== id && st.certId !== id);
  saveStoredStudents(next);

  if (typeof window !== 'undefined') {
    try {
      const regStr = localStorage.getItem('atideto_registrations');
      if (regStr) {
        const regs = JSON.parse(regStr);
        const filteredRegs = regs.filter((r: any) => 
          r.applicationId !== id && 
          r.id !== id && 
          r.studentId !== id &&
          r.regId !== id
        );
        localStorage.setItem('atideto_registrations', JSON.stringify(filteredRegs));
      }
    } catch (_) {}
  }

  return next;
}

