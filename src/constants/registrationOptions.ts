// Comprehensive Dropdown Options & Helpers for Upskill Internship & Course Registration
// Covers: Institution Types, Degrees, Specializations, Graduation Years, States, Districts, Cities, 12 Website Programs, and Auto End Date Calculation

export const INSTITUTION_TYPES = [
  'Autonomous Institution',
  'University / Deemed University',
  'Anna University Affiliated College',
  'State / Central University Affiliated',
  'Government / Government-Aided Institution',
  'Private / Self-Financing College',
  'Polytechnic / Diploma Institution',
  'Other Institution (Type Below)'
];

export const DEGREE_OPTIONS = [
  'B.Tech (Bachelor of Technology)',
  'B.E. (Bachelor of Engineering)',
  'B.Sc (Bachelor of Science)',
  'BCA (Bachelor of Computer Applications)',
  'M.Tech (Master of Technology)',
  'M.E. (Master of Engineering)',
  'M.Sc (Master of Science)',
  'MCA (Master of Computer Applications)',
  'B.Com / BBA',
  'MBA (Master of Business Administration)',
  'Diploma in Engineering / Technology',
  'Integrated M.Tech / M.Sc',
  'Ph.D. / Research Scholar',
  'Other Degree (Type Below)'
];

export const SPECIALIZATION_OPTIONS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Computer Science & Business Systems (CSBS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Mechatronics Engineering',
  'Biomedical Engineering',
  'Biotechnology',
  'Cyber Security / Information Security',
  'Data Science & Analytics',
  'Software Engineering',
  'Robotics & Automation',
  'Automobile Engineering',
  'Aerospace / Aeronautical Engineering',
  'Chemical Engineering',
  'Agricultural Engineering',
  'Commerce / Computer Applications',
  'Other Specialization (Type Below)'
];

export const GRADUATION_YEARS = [
  '2024 (Graduated / Alumnus)',
  '2025 (Final Year Student)',
  '2026 (Pre-Final Year Student)',
  '2027 (Second Year Student)',
  '2028 (First Year Student)',
  '2029 (Integrated / Diploma)',
  '2030+',
  'Other Year (Type Below)'
];

export const ALL_INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi (NCT)',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Bihar',
  'Odisha',
  'Assam',
  'Goa',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jharkhand',
  'Chhattisgarh',
  'Chandigarh',
  'Puducherry',
  'Jammu & Kashmir',
  'Ladakh',
  'Andaman & Nicobar Islands',
  'Arunachal Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura',
  'Dadra & Nagar Haveli and Daman & Diu',
  'Lakshadweep',
  'Other / International (Type Below)'
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Tamil Nadu': [
    'Namakkal',
    'Salem',
    'Chennai',
    'Coimbatore',
    'Erode',
    'Tiruchirappalli',
    'Madurai',
    'Tirunelveli',
    'Vellore',
    'Dharmapuri',
    'Krishnagiri',
    'Dindigul',
    'Thanjavur',
    'Cuddalore',
    'Kanchipuram',
    'Tiruvallur',
    'Chengalpattu',
    'Tiruppur',
    'Karur',
    'Theni',
    'Virudhunagar',
    'Sivaganga',
    'Ramanathapuram',
    'Thoothukudi',
    'Kanyakumari',
    'Villupuram',
    'Kallakurichi',
    'Ranipet',
    'Tirupattur',
    'Tiruvannamalai',
    'Perambalur',
    'Ariyalur',
    'Nagapattinam',
    'Mayiladuthurai',
    'Tiruvarur',
    'Pudukkottai',
    'Nilgiris',
    'Tenkasi',
    'Other District (Type Below)'
  ],
  'Karnataka': [
    'Bengaluru Urban',
    'Bengaluru Rural',
    'Mysuru',
    'Mangaluru (Dakshina Kannada)',
    'Hubballi-Dharwad',
    'Belagavi',
    'Tumakuru',
    'Shivamogga',
    'Udupi',
    'Ballari',
    'Kalaburagi',
    'Davangere',
    'Mandya',
    'Hassan',
    'Other District (Type Below)'
  ],
  'Kerala': [
    'Thiruvananthapuram',
    'Kochi (Ernakulam)',
    'Kozhikode',
    'Thrissur',
    'Kollam',
    'Palakkad',
    'Malappuram',
    'Kannur',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Pathanamthitta',
    'Kasaragod',
    'Wayanad',
    'Other District (Type Below)'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada (NTR)',
    'Guntur',
    'Tirupati',
    'Nellore',
    'Kurnool',
    'Kakinada',
    'Rajahmundry',
    'Anantapur',
    'Kadapa',
    'Chittoor',
    'Other District (Type Below)'
  ],
  'Telangana': [
    'Hyderabad',
    'Ranga Reddy',
    'Medchal-Malkajgiri',
    'Warangal',
    'Karimnagar',
    'Nizamabad',
    'Khammam',
    'Nalgonda',
    'Other District (Type Below)'
  ],
  'Maharashtra': [
    'Mumbai City',
    'Mumbai Suburban',
    'Pune',
    'Nagpur',
    'Thane',
    'Nashik',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Solapur',
    'Kolhapur',
    'Navi Mumbai',
    'Other District (Type Below)'
  ],
  'Delhi (NCT)': [
    'New Delhi',
    'Central Delhi',
    'South Delhi',
    'North Delhi',
    'East Delhi',
    'West Delhi',
    'South West Delhi',
    'North East Delhi',
    'Other District (Type Below)'
  ]
};

export const POPULAR_CITIES = [
  'Mallasamudram',
  'Namakkal',
  'Salem',
  'Chennai',
  'Coimbatore',
  'Erode',
  'Tiruchirappalli',
  'Madurai',
  'Tirunelveli',
  'Vellore',
  'Hosur',
  'Bengaluru',
  'Hyderabad',
  'Kochi',
  'Thiruvananthapuram',
  'Visakhapatnam',
  'Vijayawada',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Noida / Gurgaon',
  'Kolkata',
  'Other City / Campus (Type Below)'
];

// The Official 12 Upskill / Internship Programs from the Atideto Website
export const WEBSITE_UPSKILL_PROGRAMS = [
  {
    id: 'fs-java',
    title: 'Full Stack Web Development (Java)',
    category: 'Full Stack',
    skills: 'Java, Spring Boot, React, MySQL',
    defaultDuration: '30 Days'
  },
  {
    id: 'fs-mern',
    title: 'Full Stack Development (MERN Stack)',
    category: 'Full Stack',
    skills: 'MongoDB, Express, React, Node.js',
    defaultDuration: '30 Days'
  },
  {
    id: 'fs-mean',
    title: 'Full Stack Development (MEAN Stack)',
    category: 'Full Stack',
    skills: 'MongoDB, Express, Angular, Node.js',
    defaultDuration: '30 Days'
  },
  {
    id: 'web-dev',
    title: 'Web Development Internship',
    category: 'Programming',
    skills: 'HTML5, CSS3, JavaScript, DOM',
    defaultDuration: '30 Days'
  },
  {
    id: 'python',
    title: 'Python Internship',
    category: 'Programming',
    skills: 'Python, Django, Flask, Automation',
    defaultDuration: '30 Days'
  },
  {
    id: 'core-java',
    title: 'Core Java',
    category: 'Programming',
    skills: 'OOPs, Data Structures, Multithreading',
    defaultDuration: '30 Days'
  },
  {
    id: 'data-science',
    title: 'Data Science Internship',
    category: 'AI & Data',
    skills: 'Python, Machine Learning, Pandas, SQL',
    defaultDuration: '30 Days'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Internship',
    category: 'Marketing',
    skills: 'SEO, Google Ads, Social Media, Analytics',
    defaultDuration: '30 Days'
  },
  {
    id: 'app-dev',
    title: 'App Development Internship',
    category: 'Programming',
    skills: 'Flutter, React Native, Android, iOS',
    defaultDuration: '30 Days'
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security Internship',
    category: 'Security',
    skills: 'Ethical Hacking, Network Security, Linux',
    defaultDuration: '30 Days'
  },
  {
    id: 'cloud',
    title: 'Cloud Internship',
    category: 'Cloud',
    skills: 'AWS, Azure, Docker, DevOps',
    defaultDuration: '30 Days'
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design Internship',
    category: 'Design',
    skills: 'Figma, Wireframing, Prototyping, Research',
    defaultDuration: '30 Days'
  },
  {
    id: 'other-program',
    title: 'Other Program (Type Below)',
    category: 'Custom Track',
    skills: 'Custom Industrial Curriculum',
    defaultDuration: '30 Days'
  }
];

export const DURATION_OPTIONS = [
  { label: '7 Days (1 Week Fast Track)', value: '7 Days', days: 7 },
  { label: '15 Days (2 Weeks Intensive)', value: '15 Days', days: 15 },
  { label: '30 Days (1 Month Standard)', value: '30 Days', days: 30 },
  { label: '60 Days (2 Months Advanced)', value: '60 Days', days: 60 },
  { label: '90 Days (3 Months Industrial Track)', value: '90 Days', days: 90 },
  { label: 'Other Duration (Type Below)', value: 'Other', days: 30 }
];

/**
 * Automatically calculates the end date based on start date and chosen duration.
 * @param startDateStr 'YYYY-MM-DD' or date string
 * @param durationStr e.g. '7 Days', '15 Days', '30 Days', '60 Days', '90 Days', '3 Months'
 * @returns 'YYYY-MM-DD' formatted string
 */
export function calculateAutomaticEndDate(startDateStr: string, durationStr: string): string {
  if (!startDateStr) return '';
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return '';

  let daysToAdd = 30;
  const dLower = (durationStr || '').toLowerCase();

  if (dLower.includes('7') && (dLower.includes('day') || dLower.includes('week'))) {
    daysToAdd = 7;
  } else if (dLower.includes('15') && dLower.includes('day')) {
    daysToAdd = 15;
  } else if (dLower.includes('60') || dLower.includes('2 month')) {
    daysToAdd = 60;
  } else if (dLower.includes('90') || dLower.includes('3 month')) {
    daysToAdd = 90;
  } else if (dLower.includes('180') || dLower.includes('6 month')) {
    daysToAdd = 180;
  } else if (dLower.includes('30') || dLower.includes('1 month')) {
    daysToAdd = 30;
  } else {
    // Check if user typed a specific number of days e.g. "45 days" or "10 days"
    const match = dLower.match(/(\d+)\s*(day|days|d)/);
    if (match) {
      daysToAdd = parseInt(match[1], 10);
    } else {
      const monthMatch = dLower.match(/(\d+)\s*(month|months|m)/);
      if (monthMatch) {
        daysToAdd = parseInt(monthMatch[1], 10) * 30;
      }
    }
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Formats a YYYY-MM-DD date string into a friendly readable date e.g. "24 Nov 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
