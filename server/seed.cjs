// Atideto MySQL Seeder & Database Setup
// Connects to MySQL on localhost:3306 with credentials root / Semester7!

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Semester7!',
  port: Number(process.env.DB_PORT) || 3306,
  multipleStatements: true
};

async function seedDatabase() {
  console.log('[DB-INIT] Connecting to MySQL server at', DB_CONFIG.host + ':' + DB_CONFIG.port);
  
  // 1. Create database connection without database selected
  const rootConn = await mysql.createConnection(DB_CONFIG);
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`atideto\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  console.log('[DB-INIT] Database "atideto" verified/created.');
  await rootConn.end();

  // 2. Connect to "atideto" database
  const conn = await mysql.createConnection({
    ...DB_CONFIG,
    database: 'atideto'
  });

  // 3. Execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await conn.query(schemaSql);
  console.log('[DB-INIT] Schema tables successfully initialized.');

  // 4. Seed Users (Original Data Only: Admin, Founders & Employees, 10 Cohort Students)
  // Admin: admin@atideto.in / pass: admin123
  // Founders & Employees: pass: admin123
  // Students: pass: student (also supports student123 / admin123)
  const users = [
  [
    "usr-admin-01",
    "Administrator",
    "admin@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-01",
    "Sam Absihek",
    "sam@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-02",
    "Neevas Nagil A R",
    "neevas@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-03",
    "Vishnu",
    "vishnu@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-04",
    "Kiran",
    "kiran@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-05",
    "Yogesh",
    "yogesh@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-06",
    "Sanjay",
    "sanjay@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "EMP-07",
    "Sachin",
    "sachin@atideto.in",
    "admin123",
    "admin",
    "sql"
  ],
  [
    "621523205106",
    "SURESH KUMAR D",
    "sureshkumard706@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205116",
    "VISHWA V",
    "vishwa0847@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205092",
    "SARAVANAN K",
    "starsaro615@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205064",
    "NITHISH KUMAR V",
    "nithu2005nk@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205103",
    "SHANMATHI R S",
    "srishanmathi861019@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205079",
    "SAILISHA S",
    "sailishas3@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205066",
    "PRASANTHA S",
    "prasantha2006s@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205070",
    "PRIYA A",
    "priyaanandan780@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205098",
    "SHIBIYA S",
    "shibiya86@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205068",
    "PREETHIROSHINI S",
    "preethiroshini184@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205071",
    "PRIYADHARSHINI S",
    "priyadk515@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205119",
    "YOSHIKA R",
    "yoshikajune12@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205082",
    "SANJAY S",
    "sjay69521@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205114",
    "VIMAL PRAVIN V",
    "vimalpravin071@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205084",
    "SANJAYKUMAR E",
    "skesanjaykumar322@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205099",
    "SIBIRAJ T",
    "sibira237@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205100",
    "SITHESWARAN G",
    "sitheswaran224@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205095",
    "SHARMILA C",
    "sarmilas961@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205086",
    "SANTHIYA P",
    "santhiyap667@gmail.com",
    "student",
    "student",
    "sql"
  ],
  [
    "621523205118",
    "YOGESH S",
    "yogeshbrf2006@gmail.com",
    "student",
    "student",
    "sql"
  ]
];

  await conn.query('DELETE FROM users');
  for (const u of users) {
    await conn.query(
      `INSERT INTO users (uid, name, email, password, role, provider)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role);`,
      u
    );
  }
  console.log('[DB-INIT] Users seeded (Admin: admin@atideto.in / pass: admin123, Founders & Employees: pass: admin123, 10 Students: pass: student).');

  // 5. Seed Exactly the 10 Enrolled Students (All other names removed)
  await conn.query('DELETE FROM students');
  const studentsList = [
  {
    "id": "621523205106",
    "name": "SURESH KUMAR D",
    "email": "sureshkumard706@gmail.com",
    "phone": "+91 90473 33741",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0001",
    "offerNo": "ATD-OFL-2026-0001",
    "attendanceCertId": "ATD-ATT-2026-0001",
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
    "name": "VISHWA V",
    "email": "vishwa0847@gmail.com",
    "phone": "+91 78453 72081",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0002",
    "offerNo": "ATD-OFL-2026-0002",
    "attendanceCertId": "ATD-ATT-2026-0002",
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
    "name": "SARAVANAN K",
    "email": "starsaro615@gmail.com",
    "phone": "+91 63824 43901",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0003",
    "offerNo": "ATD-OFL-2026-0003",
    "attendanceCertId": "ATD-ATT-2026-0003",
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
    "name": "NITHISH KUMAR V",
    "email": "nithu2005nk@gmail.com",
    "phone": "+91 98949 58127",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "HABIT TRACKER APPLICATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0004",
    "offerNo": "ATD-OFL-2026-0004",
    "attendanceCertId": "ATD-ATT-2026-0004",
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
    "name": "SHANMATHI R S",
    "email": "srishanmathi861019@gmail.com",
    "phone": "+91 80568 12105",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0005",
    "offerNo": "ATD-OFL-2026-0005",
    "attendanceCertId": "ATD-ATT-2026-0005",
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
    "name": "SAILISHA S",
    "email": "sailishas3@gmail.com",
    "phone": "+91 80154 74295",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0006",
    "offerNo": "ATD-OFL-2026-0006",
    "attendanceCertId": "ATD-ATT-2026-0006",
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
    "name": "PRASANTHA S",
    "email": "prasantha2006s@gmail.com",
    "phone": "+91 93421 26255",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0007",
    "offerNo": "ATD-OFL-2026-0007",
    "attendanceCertId": "ATD-ATT-2026-0007",
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
    "name": "PRIYA A",
    "email": "priyaanandan780@gmail.com",
    "phone": "+91 99433 72027",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "STUDENT MANAGEMENT SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0008",
    "offerNo": "ATD-OFL-2026-0008",
    "attendanceCertId": "ATD-ATT-2026-0008",
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
    "name": "SHIBIYA S",
    "email": "shibiya86@gmail.com",
    "phone": "+91 90432 07088",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0009",
    "offerNo": "ATD-OFL-2026-0009",
    "attendanceCertId": "ATD-ATT-2026-0009",
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
    "name": "PREETHIROSHINI S",
    "email": "preethiroshini184@gmail.com",
    "phone": "+91 86676 22088",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0010",
    "offerNo": "ATD-OFL-2026-0010",
    "attendanceCertId": "ATD-ATT-2026-0010",
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
    "name": "PRIYADHARSHINI S",
    "email": "priyadk515@gmail.com",
    "phone": "+91 87544 20699",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0011",
    "offerNo": "ATD-OFL-2026-0011",
    "attendanceCertId": "ATD-ATT-2026-0011",
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
    "name": "YOSHIKA R",
    "email": "yoshikajune12@gmail.com",
    "phone": "+91 90803 95931",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "E-COMMERCE",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0012",
    "offerNo": "ATD-OFL-2026-0012",
    "attendanceCertId": "ATD-ATT-2026-0012",
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
    "name": "SANJAY S",
    "email": "sjay69521@gmail.com",
    "phone": "+91 93456 91952",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 96,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0013",
    "offerNo": "ATD-OFL-2026-0013",
    "attendanceCertId": "ATD-ATT-2026-0013",
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
    "name": "VIMAL PRAVIN V",
    "email": "vimalpravin071@gmail.com",
    "phone": "+91 63854 17239",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 97,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0014",
    "offerNo": "ATD-OFL-2026-0014",
    "attendanceCertId": "ATD-ATT-2026-0014",
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
    "id": "621523205084",
    "name": "SANJAYKUMAR E",
    "email": "skesanjaykumar322@gmail.com",
    "phone": "+91 63803 15756",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 98,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0015",
    "offerNo": "ATD-OFL-2026-0015",
    "attendanceCertId": "ATD-ATT-2026-0015",
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
    "name": "SIBIRAJ T",
    "email": "sibira237@gmail.com",
    "phone": "+91 88382 03876",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Information Technology",
    "gradYear": "2027",
    "course": "FULL STACK WEB DEVELOPMENT",
    "domain": "Full Stack Web Development",
    "project": "BILLING SYSTEM",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Karthik Ramanathan (AI & Web Lead)",
    "attendance": 99,
    "score": 94,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0016",
    "offerNo": "ATD-OFL-2026-0016",
    "attendanceCertId": "ATD-ATT-2026-0016",
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
    "name": "SITHESWARAN G",
    "email": "sitheswaran224@gmail.com",
    "phone": "+91 63790 47103",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Artificial Intelligence and Data Science",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 96,
    "score": 95,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0017",
    "offerNo": "ATD-OFL-2026-0017",
    "attendanceCertId": "ATD-ATT-2026-0017",
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
    "name": "SHARMILA C",
    "email": "sarmilas961@gmail.com",
    "phone": "+91 78454 50844",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Artificial Intelligence and Data Science",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 97,
    "score": 96,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0018",
    "offerNo": "ATD-OFL-2026-0018",
    "attendanceCertId": "ATD-ATT-2026-0018",
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
    "name": "SANTHIYA P",
    "email": "santhiyap667@gmail.com",
    "phone": "+91 78128 68653",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Artificial Intelligence and Data Science",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 98,
    "score": 97,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0019",
    "offerNo": "ATD-OFL-2026-0019",
    "attendanceCertId": "ATD-ATT-2026-0019",
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
    "name": "YOGESH S",
    "email": "yogeshbrf2006@gmail.com",
    "phone": "+91 93844 44414",
    "college": "Mahendra Engineering College",
    "degree": "B.Tech Artificial Intelligence and Data Science",
    "gradYear": "2027",
    "course": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "domain": "Artificial Intelligence and Machine Learning",
    "project": "AI ASSISTANT AND WORKFLOW AUTOMATION",
    "startDate": "25 Oct 2026",
    "batch": "2026-MEC",
    "status": "Verified Enrolled",
    "internshipStatus": "Active Industrial Track",
    "internshipDuration": "3 Months",
    "mentor": "Vishnu R (Technical Director)",
    "attendance": 99,
    "score": 98,
    "feePaid": "₹0",
    "feeTotal": "700",
    "paymentStatus": "Payment Due",
    "certId": "ATD-INT-2026-0020",
    "offerNo": "ATD-OFL-2026-0020",
    "attendanceCertId": "ATD-ATT-2026-0020",
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
  }
];

  for (const s of studentsList) {
    await conn.query(
      `INSERT INTO students 
        (student_id, name, email, phone, college, degree, grad_year, course, domain, project, start_date, batch, status, internship_status, internship_duration, mentor, attendance, score, fee_paid, fee_total, payment_status, cert_id, offer_no, attendance_cert_id, tools, area)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), phone=VALUES(phone), mentor=VALUES(mentor), fee_paid=COALESCE(students.fee_paid, VALUES(fee_paid)), fee_total=COALESCE(students.fee_total, VALUES(fee_total)), payment_status=COALESCE(students.payment_status, VALUES(payment_status));`,
      [
        s.id, s.name, s.email, s.phone, s.college, s.degree, s.gradYear, s.course, s.domain, s.project,
        s.startDate, s.batch, s.status, s.internshipStatus, s.internshipDuration, s.mentor,
        s.attendance, s.score, s.feePaid, s.feeTotal, s.paymentStatus, s.certId, s.offerNo, s.attendanceCertId,
        JSON.stringify(s.tools), JSON.stringify(s.area)
      ]
    );
  }
  console.log('[DB-INIT] 10 Enrolled Cohort Students seeded successfully.');

  // 6. Seed Registrations
  await conn.query('DELETE FROM registrations');
  const registrations = [
    ['REG-2026-001', 'Suresh kumar D', 'sureshkumard706@gmail.com', '+91 90473 33741', 'Mahendra College of Engineering', 'B.Tech Information Technology', '2027', 'Full stack web development', 'Full stack web development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Admitted with distinction.'],
    ['REG-2026-002', 'V.vishwa', 'vishwa0847@gmail.com', '+91 78453 72081', 'Mahendra College of Engineering', 'B.Tech Information Technology', '2027', 'web development', 'web development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Registration and verification cleared.'],
    ['REG-2026-003', 'SARAVANAN K', 'starsaro615@gmail.com', '+91 63824 43901', 'Mahendra College of Engineering', 'B.Tech Information Technology', '2027', 'Full Stack Web Development', 'Full Stack Web Development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'All verification steps cleared.'],
    ['REG-2026-004', 'V.Nithish kumar', 'nithu2005nk@gmail.com', '+91 98949 58127', 'Mahendra College of Engineering', 'B.Tech Information Technology', '2027', 'Full stack Web Development', 'Full stack Web Development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Verified candidate registration.']
  ];

  for (const r of registrations) {
    await conn.query(
      `INSERT INTO registrations 
        (reg_id, student_name, email, phone, college, degree, grad_year, course_interest, domain, mode, step_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);`,
      r
    );
  }
  console.log('[DB-INIT] Registrations seeded.');

  // 7. Seed Courses
  const courses = [
    ['CRS-FS-01', 'Full Stack Web Development (MERN)', 'Web Technologies', '12 Weeks', 'Intermediate', 'Admin Approved', 4.95, 240, 'Active', 'Master React 18, Node.js, Express, MongoDB, TypeScript, REST APIs and AWS deployment.'],
    ['CRS-DA-02', 'Data Analytics & Business Intelligence', 'Data Science', '10 Weeks', 'All Levels', 'Admin Approved', 4.92, 180, 'Active', 'Master Python, SQL, Power BI, Pandas, Tableau, and automated reporting pipelines.'],
    ['CRS-AI-03', 'Applied Generative AI & LLM Systems', 'Artificial Intelligence', '8 Weeks', 'Advanced', 'Admin Approved', 4.98, 95, 'Active', 'Build production RAG pipelines, LangChain agents, vector embeddings, and LLM applications.'],
    ['CRS-CC-04', 'Cloud DevOps & Kubernetes Engineering', 'Cloud & Infrastructure', '10 Weeks', 'Intermediate', 'Admin Approved', 4.88, 110, 'Active', 'Docker, Kubernetes orchestration, CI/CD GitHub Actions, Terraform, and AWS cloud architecture.']
  ];

  for (const c of courses) {
    await conn.query(
      `INSERT INTO courses (course_code, title, category, duration, level, price, rating, students_count, status, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);`,
      c
    );
  }
  console.log('[DB-INIT] Courses seeded.');

  // 8. Seed Internships
  const internships = [
    ['INT-FS-2026', 'Full Stack Engineering Industrial Track', 'Software Engineering', 'Atideto Technologies', '30 Days', 'Stipend Offered', 'Industrial Hybrid', 15, 'Open'],
    ['INT-AI-2026', 'Applied AI & LLM Systems Internship', 'Artificial Intelligence', 'Atideto Technologies', '30 Days', 'Stipend Offered', 'Remote / Hybrid', 10, 'Open'],
    ['INT-DA-2026', 'Data Analytics & BI Engineering Internship', 'Data Science', 'Atideto Technologies', '30 Days', 'Stipend Offered', 'Hybrid', 12, 'Open']
  ];

  for (const i of internships) {
    await conn.query(
      `INSERT INTO internships (internship_code, title, domain, company, duration, stipend, mode, vacancies, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title);`,
      i
    );
  }
  console.log('[DB-INIT] Internships seeded.');

  // 9. Seed Staff (7 Core Founders & Employees)
  const staff = [
    ['EMP-01', 'Sam Absihek', 'sam@atideto.in', '+91 94432 10001', 'Founder', 'Executive Leadership', 'Active', 10],
    ['EMP-02', 'Neevas Nagil A R', 'neevas@atideto.in', '+91 94432 10002', 'Co-Founder', 'Executive Leadership', 'Active', 10],
    ['EMP-03', 'Vishnu', 'vishnu@atideto.in', '+91 94432 10003', 'CEO', 'Executive Leadership', 'Active', 10],
    ['EMP-04', 'Kiran', 'kiran@atideto.in', '+91 94432 10004', 'CPO', 'Product Management', 'Active', 10],
    ['EMP-05', 'Yogesh', 'yogesh@atideto.in', '+91 94432 10005', 'Full Stack Developer', 'Software Engineering', 'Active', 10],
    ['EMP-06', 'Sanjay', 'sanjay@atideto.in', '+91 94432 10006', 'Editor & Designer', 'Design & Media', 'Active', 8],
    ['EMP-07', 'Sachin', 'sachin@atideto.in', '+91 94432 10007', 'Client Manager', 'Client Operations & CRM', 'Active', 10]
  ];

  // Safe non-destructive staff seed: preserve bank, UPI, and social details
  for (const st of staff) {
    await conn.query(
      `INSERT INTO staff (emp_id, name, email, phone, role, department, status, assigned_students)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), role=VALUES(role), department=VALUES(department);`,
      st
    );
  }
  console.log('[DB-INIT] Staff seeded (7 Core Founders & Employees).');

  // 10. Seed Clients
  const clients = [
    ['CLT-2026-01', 'Apex Global Logistics Inc.', 'Enterprise Supply Chain & Logistics', 'David Vance (VP Technology)', 'david.vance@apexlogistics.com', '+1 (415) 890-3341', 'Active MOU', 2, '₹4,50,000', 'In Progress (Sprint 04)', JSON.stringify(['Next.js', 'FastAPI', 'Pinecone', 'Docker']), JSON.stringify(['Enterprise AI', 'Cloud', 'SaaS', 'USA'])],
    ['CLT-2026-02', 'CarePlus Medical Networks', 'Healthcare & Telemedicine', 'Dr. Sarah Lin (Chief Digital Officer)', 'admin@careplusmedical.org', '+1 (650) 441-9872', 'Active MOU', 1, '₹6,80,000', 'Security Audit & Compliance', JSON.stringify(['React Native', 'Node.js', 'PostgreSQL', 'HIPAA']), JSON.stringify(['Healthcare', 'Mobile App', 'Security'])],
    ['CLT-2026-03', 'Zenith Smart Manufacturing Ltd.', 'Industrial Automation & Robotics', 'Rajesh Nair (General Manager)', 'tech@zenith-mfg.com', '+91 98410 77123', 'Under Review', 1, '₹8,20,000', 'Deal Negotiation', JSON.stringify(['TimescaleDB', 'Grafana', 'Kubernetes', 'Go']), JSON.stringify(['IoT Telemetry', 'DevOps', 'Industrial'])]
  ];

  for (const cl of clients) {
    await conn.query(
      `INSERT INTO clients (client_id, name, industry, contact_person, email, phone, mou_status, active_projects, contract_value, pipeline_status, tools, area)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name);`,
      cl
    );
  }
  console.log('[DB-INIT] Clients seeded.');

  // 11. Seed Tasks
  const tasks = [
    ['TSK-101', 'Review Code Submissions for Student Cohort', 'Karthik Ramanathan', 'High', 'In Progress', 'Today'],
    ['TSK-102', 'Deploy Student Attendance Sync Lambda to Cloud', 'Vishnu', 'Medium', 'In Progress', 'Tomorrow'],
    ['TSK-103', 'Audit Full Stack Web Capstone Code Submissions', 'Priya Sundaram', 'High', 'In Progress', '23 Oct'],
    ['TSK-104', 'Dispatch Official Offer Letters for Class 2027', 'Atideto Labs Coordinator', 'Low', 'Completed', '20 Oct']
  ];

  for (const t of tasks) {
    await conn.query(
      `INSERT INTO tasks (task_id, title, assignee, priority, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title);`,
      t
    );
  }
  console.log('[DB-INIT] Tasks seeded.');

  // 12. Seed Certificates
  await conn.query('DELETE FROM certificates');
  const certificates = [
  [
    "ATD-INT-2026-0001",
    "SURESH KUMAR D",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "94/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0001"
  ],
  [
    "ATD-INT-2026-0002",
    "VISHWA V",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "95/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0002"
  ],
  [
    "ATD-INT-2026-0003",
    "SARAVANAN K",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "96/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0003"
  ],
  [
    "ATD-INT-2026-0004",
    "NITHISH KUMAR V",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "97/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0004"
  ],
  [
    "ATD-INT-2026-0005",
    "SHANMATHI R S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "98/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0005"
  ],
  [
    "ATD-INT-2026-0006",
    "SAILISHA S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "94/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0006"
  ],
  [
    "ATD-INT-2026-0007",
    "PRASANTHA S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "95/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0007"
  ],
  [
    "ATD-INT-2026-0008",
    "PRIYA A",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "96/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0008"
  ],
  [
    "ATD-INT-2026-0009",
    "SHIBIYA S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "97/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0009"
  ],
  [
    "ATD-INT-2026-0010",
    "PREETHIROSHINI S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "98/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0010"
  ],
  [
    "ATD-INT-2026-0011",
    "PRIYADHARSHINI S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "94/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0011"
  ],
  [
    "ATD-INT-2026-0012",
    "YOSHIKA R",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "95/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0012"
  ],
  [
    "ATD-INT-2026-0013",
    "SANJAY S",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "96/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0013"
  ],
  [
    "ATD-INT-2026-0014",
    "VIMAL PRAVIN V",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "97/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0014"
  ],
  [
    "ATD-INT-2026-0015",
    "SANJAYKUMAR E",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "98/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0015"
  ],
  [
    "ATD-INT-2026-0016",
    "SIBIRAJ T",
    "Mahendra Engineering College",
    "B.Tech Information Technology",
    "Full Stack Web Development",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "94/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0016"
  ],
  [
    "ATD-INT-2026-0017",
    "SITHESWARAN G",
    "Mahendra Engineering College",
    "B.Tech Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "95/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0017"
  ],
  [
    "ATD-INT-2026-0018",
    "SHARMILA C",
    "Mahendra Engineering College",
    "B.Tech Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "96/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0018"
  ],
  [
    "ATD-INT-2026-0019",
    "SANTHIYA P",
    "Mahendra Engineering College",
    "B.Tech Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "97/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0019"
  ],
  [
    "ATD-INT-2026-0020",
    "YOGESH S",
    "Mahendra Engineering College",
    "B.Tech Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "2026-10-25",
    "3 Months (Oct 2026 - Jan 2027)",
    "98/100 (Exemplary Distinction)",
    "https://atideto.in/verify?id=ATD-INT-2026-0020"
  ]
];

  for (const cert of certificates) {
    await conn.query(
      `INSERT INTO certificates (cert_id, student_name, college, degree, domain, issue_date, duration, grade, verify_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);`,
      cert
    );
  }
  console.log('[DB-INIT] Certificates seeded.');

  // 13. Seed Payments
  // Safe non-destructive payments seed: preserve real transaction logs
  const payments = [
    ['TXN-MCE-2026-01', 'Saravanan M', '₹500', 'UPI Transfer', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MCE-2026-02', 'Rithick S', '₹500', 'UPI Transfer', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MCE-2026-03', 'Srisanth M', '₹500', 'Google Pay UPI', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MCE-2026-04', 'Siva K', '₹500', 'PhonePe UPI', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MCE-2026-05', 'Rajesh D', '₹500', 'Paytm UPI', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MCE-2026-06', 'Thamarai Kannan S', '₹500', 'Direct UPI', 'Success', 'Internet of Things (IoT)', '2026-10-22'],
    ['TXN-MEC-2026-01', 'Suresh kumar D', '₹650', 'Bank Transfer', 'Pending', 'Full stack web development', '2026-10-21'],
    ['TXN-MEC-2026-02', 'V.vishwa', '₹700', 'HDFC NetBanking', 'Pending', 'web development', '2026-10-21'],
    ['TXN-MEC-2026-03', 'SARAVANAN K', '₹700', 'Google Pay UPI', 'Pending', 'Full Stack Web Development', '2026-10-21'],
    ['TXN-MEC-2026-04', 'V.Nithish kumar', '₹700', 'SBI NetBanking', 'Pending', 'Full stack Web Development', '2026-10-21'],
    ['TXN-MEC-2026-05', 'SRISHANMATHI R', '₹700', 'Razorpay UPI', 'Pending', 'Full Stack Web Development', '2026-10-21']
  ];
for (const p of payments) {
    await conn.query(
      `INSERT INTO payments (txn_id, student_name, amount, method, status, course, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);`,
      p
    );
  }
  console.log('[DB-INIT] Payments seeded.');

  // 14. Seed System Settings
  const settings = [
    ['db_host', 'localhost:3306'],
    ['db_name', 'atideto'],
    ['db_user', 'root'],
    ['auth_mode', 'hybrid_sql_google'],
    ['active_cohort', 'B.Tech IT 2027 Cohort'],
    ['system_version', 'Atideto ERP v3.8 Enterprise']
  ];

  for (const s of settings) {
    await conn.query(
      `INSERT INTO system_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);`,
      s
    );
  }
  console.log('[DB-INIT] System settings seeded.');

  await conn.end();
  console.log('[DB-INIT] ALL DATABASE OPERATIONS COMPLETED SUCCESSFULLY FOR ATIDETO!');
}

seedDatabase().catch(err => {
  console.error('[DB-INIT-ERROR]', err);
  process.exit(1);
});
