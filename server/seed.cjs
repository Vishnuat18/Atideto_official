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
    // 1. Admin
    ['usr-admin-01', 'Administrator', 'admin@atideto.in', 'admin123', 'admin', 'sql'],

    // 2. Founders & Employees (Executive Leadership & Core Team)
    ['EMP-01', 'Sam Absihek', 'sam@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-02', 'Neevas Nagil A R', 'neevas@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-03', 'Vishnu', 'vishnu@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-04', 'Kiran', 'kiran@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-05', 'Yogesh', 'yogesh@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-06', 'Sanjay', 'sanjay@atideto.in', 'admin123', 'admin', 'sql'],
    ['EMP-07', 'Sachin', 'sachin@atideto.in', 'admin123', 'admin', 'sql'],

    // 3. The 21 Enrolled Cohort Students (Password: student)
    // Group 1: B.Tech IT dept (Mahendra Engineering College)
    ['AT-MEC-2027-01', 'Suresh kumar D', 'sureshkumard706@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-02', 'V.vishwa', 'vishwa0847@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-03', 'SARAVANAN K', 'starsaro615@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-04', 'V.Nithish kumar', 'nithu2005nk@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-05', 'SRISHANMATHI R', 'srishanmathi861019@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-06', 'SAILISHA S', 'sailishas3@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-07', 'S.Prasantha', 'prasantha2006s@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-08', 'A.PRIYA', 'priyaanandan780@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-09', 'SHIBIYA S', 'shibiya86@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-10', 'S.Preethiroshini', 'preethiroshini184@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-11', 'S.Priyadharshini', 'priyadk515@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-12', 'S.Sanjay', 'sjay69521@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-13', 'R. Yoshika', 'yoshikajune12@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-14', 'Vimal Pravin V', 'vimalpravin071@gmail.com', 'student', 'student', 'sql'],
    ['AT-MEC-2027-15', 'Yogesh S', 'yogeshbrf2006@gmail.com', 'student', 'student', 'sql'],

    // Group 2: B.E. CSE dept (Mahendra College of Engineering)
    ['AT-MCE-2027-01', 'Saravanan M', 'saravananmanigandan8@gmail.com', 'student', 'student', 'sql'],
    ['AT-MCE-2027-02', 'Rithick S', 'rithickroshan2005s@gmail.com', 'student', 'student', 'sql'],
    ['AT-MCE-2027-03', 'Srisanth M', 'srisathabi@gmail.com', 'student', 'student', 'sql'],
    ['AT-MCE-2027-04', 'Siva K', 'sivasiva90574@gmail.com', 'student', 'student', 'sql'],
    ['AT-MCE-2027-05', 'Rajesh D', 'drajesh20061@gmail.com', 'student', 'student', 'sql'],
    ['AT-MCE-2027-06', 'Thamarai Kannan S', 'kannanthamarai699@gmail.com', 'student', 'student', 'sql']
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
  const studentsList = [
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 96,
      score: 95,
      feePaid: '₹0',
      feeTotal: '650',
      paymentStatus: 'Payment Due',
      tools: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
      area: ['Full Stack', 'Web Development', 'MERN Stack', 'REST APIs']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Priya Sundaram (Staff Architect)',
      attendance: 95,
      score: 93,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive UI'],
      area: ['Web Development', 'Frontend Systems', 'Modern Web']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Vishnu R (Technical Director)',
      attendance: 97,
      score: 96,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 98,
      score: 97,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Priya Sundaram (Staff Architect)',
      attendance: 98,
      score: 96,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 95,
      score: 93,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      area: ['Full Stack', 'Responsive UI', 'REST APIs']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Vishnu R (Technical Director)',
      attendance: 96,
      score: 94,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
      area: ['Full Stack', 'MERN Stack', 'Web Applications']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Priya Sundaram (Staff Architect)',
      attendance: 95,
      score: 93,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['React', 'Tailwind CSS', 'Next.js', 'REST APIs'],
      area: ['Full Stack', 'Frontend Systems', 'Responsive UI']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 97,
      score: 95,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker'],
      area: ['Full Stack', 'Cloud Deployment', 'Web Architecture']
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Priya Sundaram (Staff Architect)',
      attendance: 96,
      score: 94,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
      area: ['Full Stack', 'Web Development', 'Interactive UI']
    },
    // Additional B.Tech IT Students (Mahendra Engineering College)
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 97,
      score: 95,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Vishnu R (Technical Director)',
      attendance: 96,
      score: 94,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Priya Sundaram (Staff Architect)',
      attendance: 95,
      score: 94,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 96,
      score: 95,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
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
      startDate: '25 Oct 2026',
      batch: '2026-MEC',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '3 Months',
      mentor: 'Vishnu R (Technical Director)',
      attendance: 98,
      score: 96,
      feePaid: '₹0',
      feeTotal: '700',
      paymentStatus: 'Payment Due',
      tools: ['React', 'Node.js', 'Express', 'MongoDB'],
      area: ['Full Stack', 'Web Development']
    },
    // B.E. CSE dept Students (Mahendra College of Engineering)
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
      startDate: '24 September 2026',
      endDate: '23 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Lead Python Engineer',
      attendance: 97,
      score: 95,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
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
      startDate: '01 October 2026',
      endDate: '30 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Karthik Ramanathan (AI & Web Lead)',
      attendance: 98,
      score: 96,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
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
      startDate: '01 October 2026',
      endDate: '30 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Certified Ethical Hacker (CEH)',
      attendance: 96,
      score: 94,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
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
      startDate: '02 October 2026',
      endDate: '30 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Certified Ethical Hacker (CEH)',
      attendance: 96,
      score: 95,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
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
      startDate: '02 October 2026',
      endDate: '30 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Certified Ethical Hacker (CEH)',
      attendance: 97,
      score: 95,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
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
      startDate: '02 October 2026',
      endDate: '30 October 2026',
      batch: '2026-MCE',
      status: 'Verified Enrolled',
      internshipStatus: 'Active Industrial Track',
      internshipDuration: '1 Month',
      mentor: 'Certified Ethical Hacker (CEH)',
      attendance: 97,
      score: 96,
      feePaid: '₹500',
      feeTotal: '1000',
      paymentStatus: 'Partial Paid',
      tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Network Security'],
      area: ['Cyber Security', 'Network Defense']
    },
    {
      id: '710022104001',
      name: 'Arun Kumar',
      email: 'arunkumar.annauniv@gmail.com',
      phone: '+91 94432 10987',
      college: 'Anna University',
      degree: 'B.E. Computer Science and Engineering',
      gradYear: '2026',
      course: 'Artificial Intelligence & Machine Learning',
      domain: 'Artificial Intelligence & Machine Learning',
      startDate: '15 Aug 2026',
      batch: '2026-AU',
      status: 'Verified Enrolled',
      internshipStatus: 'Completed Track',
      internshipDuration: '6 Months',
      mentor: 'Dr. S. K. Rajagopal (Principal Scientist)',
      attendance: 98,
      score: 99,
      feePaid: '₹0',
      feeTotal: '₹0',
      paymentStatus: 'Completed',
      tools: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'Docker'],
      area: ['Deep Learning', 'Computer Vision', 'Generative AI']
    }
  ];

  // Clean wipe any prior student data to guarantee ONLY these 10 students remain
  // Safe non-destructive seed: DO NOT wipe students or admin payment records
  for (const s of studentsList) {
    await conn.query(
      `INSERT INTO students 
        (student_id, name, email, phone, college, degree, grad_year, course, domain, start_date, batch, status, internship_status, internship_duration, mentor, attendance, score, fee_paid, fee_total, payment_status, tools, area)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), phone=VALUES(phone), mentor=VALUES(mentor), fee_paid=COALESCE(students.fee_paid, VALUES(fee_paid)), fee_total=COALESCE(students.fee_total, VALUES(fee_total)), payment_status=COALESCE(students.payment_status, VALUES(payment_status));`,
      [
        s.id, s.name, s.email, s.phone, s.college, s.degree, s.gradYear, s.course, s.domain,
        s.startDate, s.batch, s.status, s.internshipStatus, s.internshipDuration, s.mentor,
        s.attendance, s.score, s.feePaid, s.feeTotal, s.paymentStatus,
        JSON.stringify(s.tools), JSON.stringify(s.area)
      ]
    );
  }
  console.log('[DB-INIT] 10 Enrolled Cohort Students seeded successfully.');

  // 6. Seed Registrations
  await conn.query('DELETE FROM registrations');
  const registrations = [
    ['REG-2026-001', 'Suresh kumar D', 'sureshkumard706@gmail.com', '+91 90473 33741', 'Mahendra Engineering College', 'B.Tech Information Technology', '2027', 'Full stack web development', 'Full stack web development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Admitted with distinction.'],
    ['REG-2026-002', 'V.vishwa', 'vishwa0847@gmail.com', '+91 78453 72081', 'Mahendra Engineering College', 'B.Tech Information Technology', '2027', 'web development', 'web development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Registration and verification cleared.'],
    ['REG-2026-003', 'SARAVANAN K', 'starsaro615@gmail.com', '+91 63824 43901', 'Mahendra Engineering College', 'B.Tech Information Technology', '2027', 'Full Stack Web Development', 'Full Stack Web Development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'All verification steps cleared.'],
    ['REG-2026-004', 'V.Nithish kumar', 'nithu2005nk@gmail.com', '+91 98949 58127', 'Mahendra Engineering College', 'B.Tech Information Technology', '2027', 'Full stack Web Development', 'Full stack Web Development', 'Industrial Hybrid', 'Completed (Step 4/4)', 'Verified candidate registration.']
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
    ['INT-FS-2026', 'Full Stack Engineering Industrial Track', 'Software Engineering', 'Atideto Technologies', '3 Months', 'Stipend Offered', 'Industrial Hybrid', 15, 'Open'],
    ['INT-AI-2026', 'Applied AI & LLM Systems Internship', 'Artificial Intelligence', 'Atideto Technologies', '3 Months', 'Stipend Offered', 'Remote / Hybrid', 10, 'Open'],
    ['INT-DA-2026', 'Data Analytics & BI Engineering Internship', 'Data Science', 'Atideto Technologies', '3 Months', 'Stipend Offered', 'Hybrid', 12, 'Open']
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
    ['ATIDETO-CERT-2026-MEC01', 'Suresh kumar D', 'Mahendra Engineering College', 'B.Tech Information Technology', 'Full stack web development', '2026-10-21', '3 Months (Oct 2026 - Jan 2027)', '95/100 (Exemplary Distinction)', 'https://atideto.in/verify/ATIDETO-CERT-2026-MEC01'],
    ['ATIDETO-CERT-2026-MEC02', 'V.vishwa', 'Mahendra Engineering College', 'B.Tech Information Technology', 'web development', '2026-10-21', '3 Months (Oct 2026 - Jan 2027)', '93/100 (Distinction)', 'https://atideto.in/verify/ATIDETO-CERT-2026-MEC02'],
    ['ATIDETO-CERT-2026-MEC03', 'SARAVANAN K', 'Mahendra Engineering College', 'B.Tech Information Technology', 'Full Stack Web Development', '2026-10-21', '3 Months (Oct 2026 - Jan 2027)', '96/100 (Exemplary Distinction)', 'https://atideto.in/verify/ATIDETO-CERT-2026-MEC03'],
    ['ATIDETO-CERT-2026-MEC04', 'V.Nithish kumar', 'Mahendra Engineering College', 'B.Tech Information Technology', 'Full stack Web Development', '2026-10-21', '3 Months (Oct 2026 - Jan 2027)', '97/100 (Exemplary Distinction)', 'https://atideto.in/verify/ATIDETO-CERT-2026-MEC04']
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
