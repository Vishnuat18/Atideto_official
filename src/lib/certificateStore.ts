// Shared Certificate & Student Registry Store
// Guarantees 1:1 consistent IDs across Admin ERP, Student Portal, and Public Verification.

export interface StudentCohortRecord {
  id: string;
  studentId?: string;
  registerNumber?: string;
  project?: string;
  name: string;
  email: string;
  role?: string;
  phone: string;
  college: string;
  degree: string;
  gradYear: string;
  academicBatch?: string;
  department?: string;
  gender?: string;
  mode?: string;
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
  createdAt?: string;
  status: 'active' | 'completed' | 'revoked';
  
  // Completion tracking fields
  offerLetterStatus?: 'not_started' | 'draft' | 'sent' | 'accepted' | 'rejected';
  offerLetterDate?: string;
  courseCompletionStatus?: 'not_started' | 'in_progress' | 'completed' | 'certified';
  courseCompletionDate?: string;
  internshipCompletionStatus?: 'not_started' | 'in_progress' | 'completed' | 'certified';
  internshipCompletionDate?: string;
  attendanceCertificateStatus?: 'not_started' | 'generated' | 'verified';
  attendanceCertificateDate?: string;
  projectCompletionStatus?: 'not_started' | 'in_progress' | 'completed' | 'certified';
  projectCompletionDate?: string;
  
  // Legacy certificate flags (kept for backward compatibility)
  certGenerated?: boolean;
  certGeneratedAt?: string;
  certHold?: boolean;
  sentToAdministration?: boolean;
  attendanceCertId?: string;
  tools: string[];
  area: string[];
}

export const COURSE_CODE_MAP: Record<string, string> = {
  'Full stack web development': 'MER',
  'Full Stack Web Development': 'MER',
  'FULL STACK WEB DEVELOPMENT': 'MER',
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
  'Artificial Intelligence and Machine Learning': 'AIM',
  'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AIM',
  'AI & Machine Learning': 'AIM',
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
    "id": "621523205106",
    "studentId": "621523205106",
    "registerNumber": "621523205106",
    "name": "SURESH KUMAR D",
    "email": "sureshkumard706@gmail.com",
    "phone": "+91 90473 33741",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0001",
    "offerNo": "ATD-OFL-2026-0001",
    "attendanceCertId": "ATD-ATT-2026-0001",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205116",
    "studentId": "621523205116",
    "registerNumber": "621523205116",
    "name": "VISHWA V",
    "email": "vishwa0847@gmail.com",
    "phone": "+91 78453 72081",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0002",
    "offerNo": "ATD-OFL-2026-0002",
    "attendanceCertId": "ATD-ATT-2026-0002",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205092",
    "studentId": "621523205092",
    "registerNumber": "621523205092",
    "name": "SARAVANAN K",
    "email": "starsaro615@gmail.com",
    "phone": "+91 63824 43901",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0003",
    "offerNo": "ATD-OFL-2026-0003",
    "attendanceCertId": "ATD-ATT-2026-0003",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205064",
    "studentId": "621523205064",
    "registerNumber": "621523205064",
    "name": "NITHISH KUMAR V",
    "email": "nithu2005nk@gmail.com",
    "phone": "+91 98949 58127",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0004",
    "offerNo": "ATD-OFL-2026-0004",
    "attendanceCertId": "ATD-ATT-2026-0004",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205103",
    "studentId": "621523205103",
    "registerNumber": "621523205103",
    "name": "SHANMATHI R S",
    "email": "srishanmathi861019@gmail.com",
    "phone": "+91 80568 12105",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0005",
    "offerNo": "ATD-OFL-2026-0005",
    "attendanceCertId": "ATD-ATT-2026-0005",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205079",
    "studentId": "621523205079",
    "registerNumber": "621523205079",
    "name": "SAILISHA S",
    "email": "sailishas3@gmail.com",
    "phone": "+91 80154 74295",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0006",
    "offerNo": "ATD-OFL-2026-0006",
    "attendanceCertId": "ATD-ATT-2026-0006",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205066",
    "studentId": "621523205066",
    "registerNumber": "621523205066",
    "name": "PRASANTHA S",
    "email": "prasantha2006s@gmail.com",
    "phone": "+91 93421 26255",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0007",
    "offerNo": "ATD-OFL-2026-0007",
    "attendanceCertId": "ATD-ATT-2026-0007",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205070",
    "studentId": "621523205070",
    "registerNumber": "621523205070",
    "name": "PRIYA A",
    "email": "priyaanandan780@gmail.com",
    "phone": "+91 99433 72027",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0008",
    "offerNo": "ATD-OFL-2026-0008",
    "attendanceCertId": "ATD-ATT-2026-0008",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205098",
    "studentId": "621523205098",
    "registerNumber": "621523205098",
    "name": "SHIBIYA S",
    "email": "shibiya86@gmail.com",
    "phone": "+91 90432 07088",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0009",
    "offerNo": "ATD-OFL-2026-0009",
    "attendanceCertId": "ATD-ATT-2026-0009",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205068",
    "studentId": "621523205068",
    "registerNumber": "621523205068",
    "name": "PREETHIROSHINI S",
    "email": "preethiroshini184@gmail.com",
    "phone": "+91 86676 22088",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0010",
    "offerNo": "ATD-OFL-2026-0010",
    "attendanceCertId": "ATD-ATT-2026-0010",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205071",
    "studentId": "621523205071",
    "registerNumber": "621523205071",
    "name": "PRIYADHARSHINI S",
    "email": "priyadk515@gmail.com",
    "phone": "+91 87544 20699",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0011",
    "offerNo": "ATD-OFL-2026-0011",
    "attendanceCertId": "ATD-ATT-2026-0011",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205119",
    "studentId": "621523205119",
    "registerNumber": "621523205119",
    "name": "YOSHIKA R",
    "email": "yoshikajune12@gmail.com",
    "phone": "+91 90803 95931",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0012",
    "offerNo": "ATD-OFL-2026-0012",
    "attendanceCertId": "ATD-ATT-2026-0012",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205082",
    "studentId": "621523205082",
    "registerNumber": "621523205082",
    "name": "SANJAY S",
    "email": "sjay69521@gmail.com",
    "phone": "+91 93456 91952",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0013",
    "offerNo": "ATD-OFL-2026-0013",
    "attendanceCertId": "ATD-ATT-2026-0013",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205114",
    "studentId": "621523205114",
    "registerNumber": "621523205114",
    "name": "VIMAL PRAVIN V",
    "email": "vimalpravin071@gmail.com",
    "phone": "+91 63854 17239",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0014",
    "offerNo": "ATD-OFL-2026-0014",
    "attendanceCertId": "ATD-ATT-2026-0014",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "612523205084",
    "studentId": "612523205084",
    "registerNumber": "612523205084",
    "name": "E.SANJAYKUMAR",
    "email": "skesanjaykumar322@gmail.com",
    "phone": "+91 63803 15756",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0015",
    "offerNo": "ATD-OFL-2026-0015",
    "attendanceCertId": "ATD-ATT-2026-0015",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205099",
    "studentId": "621523205099",
    "registerNumber": "621523205099",
    "name": "T SIBIRAJ",
    "email": "sibira237@gmail.com",
    "phone": "+91 88382 03876",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0016",
    "offerNo": "ATD-OFL-2026-0016",
    "attendanceCertId": "ATD-ATT-2026-0016",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205100",
    "studentId": "621523205100",
    "registerNumber": "621523205100",
    "name": "SITHESWARAN G",
    "email": "sitheswaran224@gmail.com",
    "phone": "+91 63790 47103",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 96,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0017",
    "offerNo": "ATD-OFL-2026-0017",
    "attendanceCertId": "ATD-ATT-2026-0017",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "FastAPI"
    ],
    "area": [
      "Artificial Intelligence",
      "Machine Learning & Automation"
    ]
  },
  {
    "id": "621523205095",
    "studentId": "621523205095",
    "registerNumber": "621523205095",
    "name": "SHARMILA C",
    "email": "sarmilas961@gmail.com",
    "phone": "+91 78454 50844",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 97,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0018",
    "offerNo": "ATD-OFL-2026-0018",
    "attendanceCertId": "ATD-ATT-2026-0018",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "FastAPI"
    ],
    "area": [
      "Artificial Intelligence",
      "Machine Learning & Automation"
    ]
  },
  {
    "id": "621523205086",
    "studentId": "621523205086",
    "registerNumber": "621523205086",
    "name": "SANTHIYA P",
    "email": "santhiyap667@gmail.com",
    "phone": "+91 78128 68653",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 98,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0019",
    "offerNo": "ATD-OFL-2026-0019",
    "attendanceCertId": "ATD-ATT-2026-0019",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "FastAPI"
    ],
    "area": [
      "Artificial Intelligence",
      "Machine Learning & Automation"
    ]
  },
  {
    "id": "621523205118",
    "studentId": "621523205118",
    "registerNumber": "621523205118",
    "name": "YOGESH S",
    "email": "yogeshbrf2006@gmail.com",
    "phone": "+91 93844 44414",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Artificial Intelligence and Data Science",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 99,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0020",
    "offerNo": "ATD-OFL-2026-0020",
    "attendanceCertId": "ATD-ATT-2026-0020",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "FastAPI"
    ],
    "area": [
      "Artificial Intelligence",
      "Machine Learning & Automation"
    ]
  },
  {
    "id": "6215232065069",
    "studentId": "6215232065069",
    "registerNumber": "6215232065069",
    "name": "S.PREM KUMAR",
    "email": "premkumar35006@gmail.com",
    "phone": "+91 81908 16136",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0021",
    "offerNo": "ATD-OFL-2026-0021",
    "attendanceCertId": "ATD-ATT-2026-0021",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JavaScript",
      "Tailwind CSS"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205109",
    "studentId": "621523205109",
    "registerNumber": "621523205109",
    "name": "VEERA GOWRI SANKAR M G",
    "email": "mrveera004@gmail.com",
    "phone": "+91 93618 20778",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "WEB DEVELOPMENT",
    "domain": "Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0022",
    "offerNo": "ATD-OFL-2026-0022",
    "attendanceCertId": "ATD-ATT-2026-0022",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205120",
    "studentId": "621523205120",
    "registerNumber": "621523205120",
    "name": "YUKESH S",
    "email": "yukeshsuresh007@gmail.com",
    "phone": "+91 93426 61977",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "WEB DEVELOPMENT",
    "domain": "Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0023",
    "offerNo": "ATD-OFL-2026-0023",
    "attendanceCertId": "ATD-ATT-2026-0023",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205110",
    "studentId": "621523205110",
    "registerNumber": "621523205110",
    "name": "VENKAT RAMANAN R",
    "email": "venkatrenuga8@gmail.com",
    "phone": "+91 63749 93996",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "WEB DEVELOPMENT",
    "domain": "Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0024",
    "offerNo": "ATD-OFL-2026-0024",
    "attendanceCertId": "ATD-ATT-2026-0024",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB"
    ],
    "area": [
      "Full Stack Development",
      "MERN Stack"
    ]
  },
  {
    "id": "621523205115",
    "studentId": "621523205115",
    "registerNumber": "621523205115",
    "name": "VISHAL N",
    "email": "vishalajd@gmail.com",
    "phone": "+91 93606 14507",
    "college": "Mahendra College of Engineering",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "CLOUD COMPUTING & DEVOPS",
    "domain": "Cloud Computing & DevOps",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "2026-09-14",
    "endDate": "2026-10-14",
    "duration": "30 Days",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "₹700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0025",
    "offerNo": "ATD-OFL-2026-0025",
    "attendanceCertId": "ATD-ATT-2026-0025",
    "issueDate": "2026-10-14",
    "status": "active",
    "tools": [
      "Docker",
      "Kubernetes",
      "AWS",
      "Jenkins",
      "Linux",
      "Terraform"
    ],
    "area": [
      "DevOps",
      "Cloud & CI/CD"
    ]
  }
];

const CACHE_KEY = 'atideto_cohort_students_v12';

export const CLIENTS_CACHE_KEY = 'atideto_crm_clients';

// Safe currency / numeric parser that handles numbers, formatted strings (e.g. '₹15,000'),
// descriptive non-numeric text (e.g. 'Strategic Collaboration', 'N/A'), null, and undefined
// without ever throwing TypeErrors or returning NaN.
export function parseCurrencyNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[^0-9]/g, '');
  return parseInt(str, 10) || 0;
}

// Canonical domain normalizer to merge duplicate tracks & spelling/casing variations
export function normalizeDomain(domain?: string): string {
  if (!domain) return 'Full Stack Web Development';
  const clean = String(domain).trim();
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

  // Artificial Intelligence and Machine Learning
  if (lower.includes('artificial') || lower.includes('aiml') || lower.includes('ai / ml') || lower.includes('ai & ml') || (lower.includes('machine learning') && !lower.includes('data science'))) {
    return 'Artificial Intelligence and Machine Learning';
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
  if (!college) return 'Mahendra College of Engineering';
  const clean = String(college).trim().replace(/[\s,]+$/, '');
  const lower = clean.toLowerCase();

  if (lower.includes('mahendra') || lower.includes('mahindra')) {
    return 'Mahendra College of Engineering';
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
  "621523205106": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sureshkumard706@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205116": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "vishwa0847@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205092": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "starsaro615@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205064": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "nithu2005nk@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205103": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "srishanmathi861019@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205079": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sailishas3@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205066": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "prasantha2006s@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205070": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "priyaanandan780@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205098": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "shibiya86@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205068": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "preethiroshini184@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205071": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "priyadk515@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205119": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "yoshikajune12@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205082": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sjay69521@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205114": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "vimalpravin071@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205084": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "skesanjaykumar322@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205099": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sibira237@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205100": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sitheswaran224@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205095": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "sarmilas961@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205086": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "santhiyap667@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "621523205118": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "yogeshbrf2006@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "612523205084": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "6215232065069": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  },
  "premkumar35006@gmail.com": {
    "feeTotal": "₹700",
    "feePaid": "₹0",
    "paymentStatus": "Payment Due"
  }
};

export function getFinalizedPayments(): Record<string, FinalizedPaymentRecord> {
  let stored: Record<string, FinalizedPaymentRecord> = {};
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(FINALIZED_PAYMENTS_KEY);
      if (raw) stored = JSON.parse(raw);
    }
  } catch { /* ignore */ }
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

const DOCUMENT_YEAR = '2026';
const CERTIFICATE_ID_PREFIX = 'ATD-INT';
const OFFER_LETTER_ID_PREFIX = 'ATD-OFL';
const ATTENDANCE_ID_PREFIX = 'ATD-ATT';

function buildDocumentId(prefix: string, sequence: number): string {
  return `${prefix}-${DOCUMENT_YEAR}-${String(sequence).padStart(4, '0')}`;
}

function extractDocumentSequence(value?: string): number | null {
  if (!value) return null;
  const match = value.trim().match(/(\d{4})$/);
  if (!match) return null;
  const parsed = parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Returns a collision-free internship certificate ID, offer letter number and
 * attendance certificate ID for a new student. A single sequence is chosen so
 * all three documents of one student share the same number, and the sequence is
 * verified to be free across every existing document ID of every type.
 */
export function generateUniqueDocumentIds(
  students: StudentCohortRecord[],
  preferredSequence?: number
): { certId: string; offerNo: string; attendanceCertId: string } {
  const used = {
    certId: new Set<string>(),
    offerNo: new Set<string>(),
    attendanceCertId: new Set<string>()
  };
  let maxSequence = 0;

  for (const student of students || []) {
    if (!student) continue;
    const values: Array<['certId' | 'offerNo' | 'attendanceCertId', string | undefined]> = [
      ['certId', student.certId],
      ['offerNo', student.offerNo],
      ['attendanceCertId', student.attendanceCertId]
    ];
    for (const [field, raw] of values) {
      const value = (raw || '').trim().toUpperCase();
      if (!value) continue;
      used[field].add(value);
      const sequence = extractDocumentSequence(value);
      if (sequence !== null) maxSequence = Math.max(maxSequence, sequence);
    }
  }

  const isSequenceFree = (sequence: number) =>
    !used.certId.has(buildDocumentId(CERTIFICATE_ID_PREFIX, sequence)) &&
    !used.offerNo.has(buildDocumentId(OFFER_LETTER_ID_PREFIX, sequence)) &&
    !used.attendanceCertId.has(buildDocumentId(ATTENDANCE_ID_PREFIX, sequence));

  let sequence = Math.max(Number(preferredSequence) || 0, maxSequence + 1, 1);
  while (!isSequenceFree(sequence)) sequence += 1;

  return {
    certId: buildDocumentId(CERTIFICATE_ID_PREFIX, sequence),
    offerNo: buildDocumentId(OFFER_LETTER_ID_PREFIX, sequence),
    attendanceCertId: buildDocumentId(ATTENDANCE_ID_PREFIX, sequence)
  };
}

/**
 * Guarantees that internship certificate IDs, offer letter numbers and
 * attendance certificate IDs are unique across the entire cohort. Canonical
 * records keep their issued IDs; duplicate or missing IDs are reassigned to the
 * next free sequence in cohort order.
 */
function reconcileDocumentIds(records: StudentCohortRecord[]): StudentCohortRecord[] {
  type DocField = 'certId' | 'offerNo' | 'attendanceCertId';
  const fields: DocField[] = ['certId', 'offerNo', 'attendanceCertId'];
  const prefixByField: Record<DocField, string> = {
    certId: CERTIFICATE_ID_PREFIX,
    offerNo: OFFER_LETTER_ID_PREFIX,
    attendanceCertId: ATTENDANCE_ID_PREFIX
  };

  const canonicalKeys = new Set<string>();
  for (const canonical of CANONICAL_COHORT_STUDENTS) {
    for (const value of [canonical.id, canonical.studentId, canonical.registerNumber, canonical.email]) {
      if (value) canonicalKeys.add(String(value).trim().toLowerCase());
    }
  }
  const isCanonicalRecord = (record: StudentCohortRecord) =>
    [record.id, record.studentId, record.registerNumber, record.email]
      .filter(Boolean)
      .some(value => canonicalKeys.has(String(value).trim().toLowerCase()));

  const work = records.map(record => ({ ...record }));
  const used: Record<DocField, Set<string>> = {
    certId: new Set<string>(),
    offerNo: new Set<string>(),
    attendanceCertId: new Set<string>()
  };

  // Canonical/protected records claim their issued IDs first so a duplicated
  // runtime record can never steal an official certificate number.
  const order = work
    .map((_, index) => index)
    .sort((a, b) => {
      const canonicalA = isCanonicalRecord(work[a]) ? 1 : 0;
      const canonicalB = isCanonicalRecord(work[b]) ? 1 : 0;
      return canonicalB - canonicalA || a - b;
    });

  const conflictingFields = new Map<number, DocField[]>();
  for (const index of order) {
    const record = work[index];
    const conflicts: DocField[] = [];
    for (const field of fields) {
      const value = (record[field] || '').trim();
      if (!value) continue;
      const key = value.toUpperCase();
      if (used[field].has(key)) {
        conflicts.push(field);
      } else {
        used[field].add(key);
      }
    }
    if (conflicts.length > 0) conflictingFields.set(index, conflicts);
  }

  let maxSequence = 0;
  for (const field of fields) {
    for (const value of used[field]) {
      const sequence = extractDocumentSequence(value);
      if (sequence !== null) maxSequence = Math.max(maxSequence, sequence);
    }
  }

  const isSequenceFreeForFields = (sequence: number, needed: DocField[]) =>
    needed.every(field => !used[field].has(buildDocumentId(prefixByField[field], sequence)));

  const pendingIndexes = work
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => fields.some(field => !(record[field] || '').trim()))
    .map(({ index }) => index)
    .concat(Array.from(conflictingFields.keys()))
    .filter((index, position, all) => all.indexOf(index) === position)
    .sort((a, b) => a - b);

  for (const index of pendingIndexes) {
    const record = work[index];
    const neededFields = fields.filter(field => {
      const value = (record[field] || '').trim();
      return !value || (conflictingFields.get(index) || []).includes(field);
    });
    if (neededFields.length === 0) continue;

    const existingSequences = fields
      .map(field => extractDocumentSequence(record[field]))
      .filter((sequence): sequence is number => sequence !== null);

    let chosen: number | null = null;
    for (const candidate of existingSequences) {
      if (isSequenceFreeForFields(candidate, neededFields)) {
        chosen = candidate;
        break;
      }
    }

    if (chosen === null) {
      let candidate = Math.max(maxSequence + 1, 1);
      while (!isSequenceFreeForFields(candidate, neededFields)) candidate += 1;
      chosen = candidate;
      maxSequence = candidate;
    }

    for (const field of neededFields) {
      const id = buildDocumentId(prefixByField[field], chosen);
      record[field] = id;
      used[field].add(id.toUpperCase());
    }
  }

  return work;
}

// Central deduplication and merge function across all student sources
export function deduplicateAndMergeStudents(list: (Partial<StudentCohortRecord> & { student_id?: string; studentName?: string; course_interest?: string; courseInterest?: string })[]): StudentCohortRecord[] {  if (!Array.isArray(list)) return [];

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

      // Real 10+ digit university register number always takes precedence over dummy AT-MEC/AT-MCE IDs
      const isRawNumeric = /^\d{10,}/.test(rawId);
      let chosenId = existing.id;
      if (isRawNumeric) {
        chosenId = rawId;
      }

      // Explicitly enforce Sanjaykumar register number: 612523205084
      if (rawEmail === 'skesanjaykumar322@gmail.com' || existing.email === 'skesanjaykumar322@gmail.com') {
        chosenId = '612523205084';
      }

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

      const paymentStatus = fin ? fin.paymentStatus : (existing.paymentStatus || raw.paymentStatus || 'Pending Admin Decision');

      // College & Dates: the first-seen (authoritative) record always wins so a
      // stale local cache can never overwrite fresh cloud values.
      const collegeVal = 'Mahendra College of Engineering';
      const startDateVal = existing.startDate || raw.startDate || '2026-09-14';
      const endDateVal = existing.endDate || raw.endDate || '2026-10-14';
      const durationVal = existing.duration || raw.duration || '30 Days';

      // Existing record in storage always takes priority over default/canonical values
      const mergedRecord: StudentCohortRecord = {
        ...existing,
        id: chosenId,
        studentId: chosenId,
        name: (existing.name && existing.name !== 'Registered Student') ? existing.name : (rawName || existing.name),
        email: existing.email || rawEmail,
        phone: existing.phone || rawPhone,
        college: collegeVal,
        degree: existing.degree || raw.degree || 'B.Tech Information Technology',
        gradYear: existing.gradYear || raw.gradYear || '2027',
        course: existing.course || existing.domain || normDomain,
        domain: existing.domain || existing.course || normDomain,
        startDate: startDateVal,
        endDate: endDateVal,
        duration: durationVal,
        mentor: existing.mentor || raw.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        attendance: existing.attendance !== undefined ? Number(existing.attendance) : (raw.attendance !== undefined ? Number(raw.attendance) : 95),
        score: existing.score !== undefined ? Number(existing.score) : (raw.score !== undefined ? Number(raw.score) : 95),
        feePaid,
        feeTotal,
        paymentStatus,
        certId: existing.certId || raw.certId || '',
        offerNo: existing.offerNo || raw.offerNo || '',
        attendanceCertId: existing.attendanceCertId || raw.attendanceCertId || '',
        issueDate: existing.issueDate || raw.issueDate || '2026-10-14',
        createdAt: existing.createdAt || (raw as any).createdAt || '',
        status: existing.status || (raw.status as any) || 'active',
        tools: (existing.tools && existing.tools.length > 0) ? existing.tools : (raw.tools || ['React', 'Node.js', 'Express', 'MongoDB']),
        area: (existing.area && existing.area.length > 0) ? existing.area : (raw.area || ['Full Stack', 'Web Development']),
        certGenerated: existing.certGenerated !== undefined ? existing.certGenerated : Boolean(raw.certGenerated),
        sentToAdministration: existing.sentToAdministration !== undefined ? existing.sentToAdministration : Boolean(raw.sentToAdministration),
        certHold: Boolean(existing.certHold !== undefined ? existing.certHold : raw.certHold),
        registerNumber: chosenId,
        project: existing.project || raw.project || '',
        offerLetterStatus: existing.offerLetterStatus ?? raw.offerLetterStatus,
        offerLetterDate: existing.offerLetterDate ?? raw.offerLetterDate,
        courseCompletionStatus: existing.courseCompletionStatus ?? raw.courseCompletionStatus,
        courseCompletionDate: existing.courseCompletionDate ?? raw.courseCompletionDate,
        internshipCompletionStatus: existing.internshipCompletionStatus ?? raw.internshipCompletionStatus,
        internshipCompletionDate: existing.internshipCompletionDate ?? raw.internshipCompletionDate,
        attendanceCertificateStatus: existing.attendanceCertificateStatus ?? raw.attendanceCertificateStatus,
        attendanceCertificateDate: existing.attendanceCertificateDate ?? raw.attendanceCertificateDate,
        projectCompletionStatus: existing.projectCompletionStatus ?? raw.projectCompletionStatus,
        projectCompletionDate: existing.projectCompletionDate ?? raw.projectCompletionDate
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

      const paymentStatus = fin ? fin.paymentStatus : (raw.paymentStatus || 'Pending Admin Decision');

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
        startDate: raw.startDate || '2026-09-14',
        endDate: raw.endDate || '2026-10-14',
        duration: raw.duration || '30 Days',
        mentor: raw.mentor || 'Karthik Ramanathan (AI & Web Lead)',
        attendance: raw.attendance !== undefined ? raw.attendance : 95,
        score: raw.score !== undefined ? raw.score : 95,
        feePaid,
        feeTotal,
        paymentStatus,
        certId: raw.certId || '',
        offerNo: raw.offerNo || '',
        attendanceCertId: raw.attendanceCertId || '',
        issueDate: raw.issueDate || raw.startDate || '2026-10-14',
        createdAt: (raw as any).createdAt || '',
        status: (raw.status as any) || 'active',
        tools: (raw.tools && raw.tools.length > 0) ? raw.tools : ['React', 'Node.js', 'Express', 'MongoDB'],
        area: (raw.area && raw.area.length > 0) ? raw.area : ['Full Stack', 'Web Development'],
        certGenerated: raw.certGenerated !== undefined ? raw.certGenerated : (raw.status === 'completed' || raw.id === '710022104001'),
        sentToAdministration: raw.sentToAdministration !== undefined ? raw.sentToAdministration : true,
        certHold: Boolean(raw.certHold),
        registerNumber: raw.registerNumber || assignedId,
        project: raw.project || '',
        offerLetterStatus: raw.offerLetterStatus,
        offerLetterDate: raw.offerLetterDate,
        courseCompletionStatus: raw.courseCompletionStatus,
        courseCompletionDate: raw.courseCompletionDate,
        internshipCompletionStatus: raw.internshipCompletionStatus,
        internshipCompletionDate: raw.internshipCompletionDate,
        attendanceCertificateStatus: raw.attendanceCertificateStatus,
        attendanceCertificateDate: raw.attendanceCertificateDate,
        projectCompletionStatus: raw.projectCompletionStatus,
        projectCompletionDate: raw.projectCompletionDate
      };

      mergedMap.set(recordKey, newRecord);
      if (rawEmail) emailToKey.set(rawEmail, recordKey);
      if (phoneDigits && phoneDigits.length >= 10) phoneToKey.set(phoneDigits, recordKey);
    }
  }

  // Preserve issued IDs and reassign only conflicts/missing values so the
  // internship, offer letter and attendance IDs can never collide.
  const reconciled = reconcileDocumentIds(Array.from(mergedMap.values()));
  return reconciled.map((s) => ({
    ...s,
    name: s.email === 'mrveera004@gmail.com' ? 'VEERA GOWRI SANKAR M G' : s.name
  }));
}

let legacyCacheCleaned = false;

export function getStoredStudents(): StudentCohortRecord[] {
  let list: any[] = [];
  try {
    if (typeof window !== 'undefined') {
      // Clean legacy caches once per session so fresh cohort begins from first (0001)
      if (!legacyCacheCleaned) {
        legacyCacheCleaned = true;
        const legacyKeys = [
          'atideto_cohort_students_v1',
          'atideto_cohort_students_v2',
          'atideto_cohort_students_v3',
          'atideto_cohort_students_v4',
          'atideto_cohort_students_v5',
          'atideto_cohort_students_v6',
          'atideto_cohort_students_v7',
          'atideto_cohort_students_v8',
          'atideto_cohort_students_v9',
          'atideto_cohort_students_v10',
          'atideto_cohort_students_v11',
          'atideto_deleted_students'
        ];
        for (const k of legacyKeys) {
          try { localStorage.removeItem(k); } catch { /* ignore */ }
        }
      }

      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Never discard the cached cohort based on date/ID heuristics: those
        // heuristics also matched legitimate records (e.g. new students using
        // the default 2026-10-25 start date), which silently wiped the cache.
        if (Array.isArray(parsed)) {
          list = parsed.filter(Boolean);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached student cohort:', e);
  }

  // Always merge list with CANONICAL_COHORT_STUDENTS to guarantee all 21 candidates are present
  const combined = list.length > 0 ? [...list, ...CANONICAL_COHORT_STUDENTS] : CANONICAL_COHORT_STUDENTS;
  const finalStudents = deduplicateAndMergeStudents(combined);

  try {
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(finalStudents);
      if (localStorage.getItem(CACHE_KEY) !== serialized) {
        localStorage.setItem(CACHE_KEY, serialized);
      }
    }
  } catch { /* ignore */ }
  return finalStudents;
}

export function saveStoredStudents(students: StudentCohortRecord[], silent = false) {
  if (typeof window === 'undefined') return;
  try {
    const deduplicated = deduplicateAndMergeStudents(students);
    const newJson = JSON.stringify(deduplicated);
    const existingJson = localStorage.getItem(CACHE_KEY);

    // Only update and dispatch if data actually changed
    if (existingJson !== newJson) {
      localStorage.setItem(CACHE_KEY, newJson);
      if (!silent) {
        window.dispatchEvent(new CustomEvent('atideto-students-updated', { detail: deduplicated }));
      }
    }
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

  const matchesTarget = (st: StudentCohortRecord) => {
    const stId = (st.id || '').trim().toLowerCase();
    const stStudentId = (st.studentId || '').trim().toLowerCase();
    const stEmail = (st.email || '').trim().toLowerCase();
    return stId === cleanId || stStudentId === cleanId || Boolean(targetEmail && stEmail === targetEmail);
  };

  // Never allow a document ID update to collide with another student's ID.
  const sanitizedUpdates: Partial<StudentCohortRecord> = { ...updates };
  for (const field of ['certId', 'offerNo', 'attendanceCertId'] as const) {
    const raw = sanitizedUpdates[field];
    if (!raw) continue;
    const key = String(raw).trim().toUpperCase();
    const hasConflict = current.some(st => !matchesTarget(st) && (st[field] || '').trim().toUpperCase() === key);
    if (hasConflict) {
      delete sanitizedUpdates[field];
    }
  }

  const next = current.map(st => {
    if (!matchesTarget(st)) return st;
    // Strictly preserve untouched fields while applying updates
    const nextRecord = { ...st, ...sanitizedUpdates };
    if (!nextRecord.certId) nextRecord.certId = st.certId;
    if (!nextRecord.offerNo) nextRecord.offerNo = st.offerNo;
    if (!nextRecord.attendanceCertId) nextRecord.attendanceCertId = st.attendanceCertId;
    return nextRecord;
  });
  saveStoredStudents(next);
  return next;
}

export function bulkUpdateStudentsInRegistry(
  ids: string[],
  updates: Partial<StudentCohortRecord>
): StudentCohortRecord[] {
  const current = getStoredStudents();
  if (!ids || ids.length === 0) return current;
  const idSet = new Set(ids.map(i => i.trim().toLowerCase()));

  const next = current.map(st => {
    const stId = (st.id || '').trim().toLowerCase();
    const stStudentId = (st.studentId || '').trim().toLowerCase();
    const isMatch = idSet.has(stId) || idSet.has(stStudentId);
    if (!isMatch) return st;
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

export function saveStoredClients(clients: any[], silent = false) {
  if (typeof window === 'undefined') return;
  try {
    const newJson = JSON.stringify(clients);
    const existingJson = localStorage.getItem(CLIENTS_CACHE_KEY);
    if (existingJson !== newJson) {
      localStorage.setItem(CLIENTS_CACHE_KEY, newJson);
      if (!silent) {
        window.dispatchEvent(new CustomEvent('atideto-clients-updated', { detail: clients }));
      }
    }
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

  // 1. Exact match by certId, studentId, registerNumber, email, offerNo, attendanceCertId, or full name
  const exact = list.find(s => 
    s.id.toLowerCase() === q ||
    (s.studentId && s.studentId.toLowerCase() === q) ||
    (s.registerNumber && s.registerNumber.toLowerCase() === q) ||
    s.certId.toLowerCase() === q ||
    (s.attendanceCertId && s.attendanceCertId.toLowerCase() === q) ||
    s.email.toLowerCase() === q ||
    s.name.toLowerCase() === q ||
    s.offerNo.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Alphanumeric stripped match (e.g. ATDINT20260001, ATDOFL20260001, ATDATT20260001, 621523205106)
  if (qClean.length >= 6) {
    const stripped = list.find(s => 
      s.certId.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean ||
      s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean ||
      (s.studentId && s.studentId.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean) ||
      (s.registerNumber && s.registerNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean) ||
      (s.offerNo && s.offerNo.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean) ||
      (s.attendanceCertId && s.attendanceCertId.toLowerCase().replace(/[^a-z0-9]/g, '') === qClean)
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
    } catch(_) { /* ignore */ }
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
    } catch(_) { /* ignore */ }
  }

  return next;
}

