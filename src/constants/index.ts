import type { Service, Course, TeamMember, Testimonial, Stat, NavItem } from '@/types';

import aiAgentsImg from '@/assets/service cards/ai agents.jpg';
import aiAutomationImg from '@/assets/service cards/ai automation.jpg';
import apiDevImg from '@/assets/service cards/api dev.jpg';
import cloudImg from '@/assets/service cards/cloud.jpg';
import customSoftwareImg from '@/assets/service cards/custom software.jpg';
import databaseSolutionsImg from '@/assets/service cards/database solutons.jpg';
import desktopSoftwareImg from '@/assets/service cards/desktop software.jpg';
import mobileAppDevImg from '@/assets/service cards/mobile app dev.jpg';
import uiUxDesignImg from '@/assets/service cards/ui ux design.jpg';
import webDevImg from '@/assets/service cards/web dev.jpg';

import yokeshDetailImg from '@/assets/Team_atideto/yokesh-removebg-preview.png';
import neevasDetailImg from '@/assets/Team_atideto/neevas-removebg-preview.png';
import samDetailImg from '@/assets/Team_atideto/sam-removebg-preview.png';
import vishnuDetailImg from '@/assets/Team_atideto/vishnu_-removebg-preview.png';
import kiranDetailImg from '@/assets/Team_atideto/kiran-removebg-preview.png';
import sanjayDetailImg from '@/assets/Team_atideto/sanjay-removebg-preview.png';
import sachinDetailImg from '@/assets/Team_atideto/sachin-removebg-preview.png';

import yokeshImg from '@/assets/team/yokesh.jpeg';
import neevasImg from '@/assets/team/neevas.jpg';
import samImg from '@/assets/team/sam.jpeg';
import vishnuImg from '@/assets/team/vishnu_.png';
import kiranImg from '@/assets/team/kiran.jpeg';
import sanjayImg from '@/assets/team/sanjay.jpeg';
import sachinImg from '@/assets/team/sachin.png';

import javaLogo from '@/assets/course_logos/java.jpg';
import pythonLogo from '@/assets/course_logos/python.jpg';
import cLogo from '@/assets/course_logos/c_programming.jpg';
import sqlLogo from '@/assets/course_logos/sql.jpg';
import mongodbLogo from '@/assets/course_logos/mongodb.jpg';
import html5Logo from '@/assets/course_logos/html5.jpg';
import css3Logo from '@/assets/course_logos/css3.jpg';
import javascriptLogo from '@/assets/course_logos/javascript.jpg';
import dataScienceLogo from '@/assets/course_logos/data_science.jpg';
import dataAnalyticsLogo from '@/assets/course_logos/data_analytics.jpg';
import androidLogo from '@/assets/course_logos/android.jpg';

import { Brain, Code, Cpu, Database, Globe, LineChart, Server, Shield, Smartphone } from 'lucide-react';


// Internship logos
import javaFullStackIntImg from '@/assets/internship/java full stack.png';
import mernStackIntImg from '@/assets/internship/mern stack.png';
import meanStackIntImg from '@/assets/internship/mean stack.png';
import webDevIntImg from '@/assets/internship/web development.png';
import pythonIntImg from '@/assets/internship/python.png';
import javaIntImg from '@/assets/internship/java.png';
import dataScienceIntImg from '@/assets/internship/data science.png';
import digitalMarketingIntImg from '@/assets/internship/digital marketing.png';
import appDevIntImg from '@/assets/internship/mobile app development.png';
import cyberSecurityIntImg from '@/assets/internship/cyber secrity.png';
import cloudIntImg from '@/assets/internship/cloud.png';
import uiUxIntImg from '@/assets/internship/ui ux design.png';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'ATIDETO Academy', href: '/academy' },
  { label: 'About', href: '/about' },
  { label: 'Client Connect', href: '/client-connect' },
  { label: 'Login / Register', href: '/login' },
];

export const SERVICES = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    description: 'Build scalable enterprise software tailored for your business with modern architecture and high performance.',
    image: customSoftwareImg
  },
  {
    id: 'web-dev',
    title: 'Web Application Development',
    description: 'Modern responsive websites built with cutting-edge technologies delivering exceptional user experiences.',
    image: webDevImg
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    description: 'Beautiful Android and iOS applications optimized for performance and user engagement.',
    image: mobileAppDevImg
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design',
    description: 'Human-centered interfaces designed for simplicity, accessibility and unforgettable experiences.',
    image: uiUxDesignImg
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    description: 'Automate repetitive business processes using intelligent AI agents and advanced workflows.',
    image: aiAutomationImg
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    description: 'Deploy intelligent AI agents capable of handling customer support, operations and business automation.',
    image: aiAgentsImg
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    description: 'Secure cloud migration, deployment and scalable infrastructure for modern businesses.',
    image: cloudImg
  },
  {
    id: 'desktop-apps',
    title: 'Desktop Applications',
    description: 'Robust Windows desktop software designed for speed, reliability and enterprise productivity.',
    image: desktopSoftwareImg
  },
  {
    id: 'api-dev',
    title: 'API Development',
    description: 'Fast, secure and scalable REST APIs powering modern digital ecosystems.',
    image: apiDevImg
  },
  {
    id: 'database-solutions',
    title: 'Database Solutions',
    description: 'Reliable database architecture, optimization and management for high-performance applications.',
    image: databaseSolutionsImg
  },
  {
    id: 'devops',
    title: 'DevOps & Deployment',
    description: 'Accelerate software delivery with automated deployment pipelines and continuous integration.',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    description: 'Modernize your business using innovative technologies that drive growth and efficiency.',
  }
];

export const COURSES: Course[] = [
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Master Java from fundamentals to advanced OOP, Spring Boot, and enterprise application development.',
    duration: '3 Months',
    level: 'Beginner to Advanced',
    skills: ['OOP', 'Spring Boot', 'Hibernate', 'REST APIs', 'JUnit'],
    projects: 5,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 299,
    category: 'Backend',
    logo: javaLogo},
  {
    id: 'python',
    title: 'Python Development',
    description: 'Comprehensive Python programming covering scripting, web development with Django/Flask, and automation.',
    duration: '3 Months',
    level: 'Beginner to Advanced',
    skills: ['Python Core', 'Django', 'Flask', 'Automation', 'APIs'],
    projects: 6,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 299,
    category: 'Backend',
    logo: pythonLogo},
  {
    id: 'c-programming',
    title: 'C Programming',
    description: 'Deep dive into system programming with C, covering memory management, pointers, and algorithms.',
    duration: '2 Months',
    level: 'Beginner to Intermediate',
    skills: ['C Core', 'Memory Management', 'Pointers', 'Algorithms', 'Data Structures'],
    projects: 4,
    liveClasses: true,
    certificate: true,
    internship: false,
    price: 199,
    category: 'Core',
    logo: cLogo},
  {
    id: 'sql',
    title: 'SQL & Database Design',
    description: 'Master relational databases, complex queries, optimization, and database architecture patterns.',
    duration: '6 Weeks',
    level: 'Beginner to Advanced',
    skills: ['SQL Queries', 'Joins', 'Stored Procedures', 'Indexing', 'PostgreSQL / MySQL'],
    projects: 3,
    liveClasses: true,
    certificate: true,
    internship: false,
    price: 149,
    category: 'Database',
    logo: sqlLogo},
  {
    id: 'mongodb',
    title: 'MongoDB & NoSQL',
    description: 'NoSQL database mastery with MongoDB, aggregation pipelines, and scalable document design.',
    duration: '6 Weeks',
    level: 'Beginner to Advanced',
    skills: ['Document Design', 'Aggregation', 'Indexing', 'Atlas', 'Mongoose'],
    projects: 3,
    liveClasses: true,
    certificate: true,
    internship: false,
    price: 149,
    category: 'Database',
    logo: mongodbLogo},
  {
    id: 'html',
    title: 'HTML5 Fundamentals',
    description: 'Build the web with semantic HTML5, accessibility best practices, and modern document structure.',
    duration: '3 Weeks',
    level: 'Beginner',
    skills: ['Semantic HTML', 'Forms', 'Accessibility', 'SEO Basics', 'HTML5 APIs'],
    projects: 2,
    liveClasses: false,
    certificate: true,
    internship: false,
    price: 49,
    category: 'Frontend',
    logo: html5Logo},
  {
    id: 'css',
    title: 'CSS3 & Modern Styling',
    description: 'Master CSS3 animations, Flexbox, CSS Grid, and responsive design for pixel-perfect UIs.',
    duration: '4 Weeks',
    level: 'Beginner to Intermediate',
    skills: ['Flexbox', 'CSS Grid', 'Animations', 'Responsive Design', 'CSS Variables'],
    projects: 3,
    liveClasses: false,
    certificate: true,
    internship: false,
    price: 79,
    category: 'Frontend',
    logo: css3Logo},
  {
    id: 'javascript',
    title: 'JavaScript Mastery',
    description: 'From JavaScript basics to ES6+, async programming, DOM manipulation, and modern frameworks intro.',
    duration: '2 Months',
    level: 'Beginner to Advanced',
    skills: ['ES6+', 'Async/Await', 'DOM APIs', 'React Intro', 'Node.js Basics'],
    projects: 5,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 249,
    category: 'Frontend',
    logo: javascriptLogo},
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Complete data science curriculum with Python, statistics, machine learning, and model deployment.',
    duration: '4 Months',
    level: 'Intermediate',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Data Visualization'],
    projects: 7,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 399,
    category: 'Data',
    logo: dataScienceLogo},
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Business analytics using Excel, SQL, Power BI, and Python to extract actionable insights.',
    duration: '3 Months',
    level: 'Beginner to Intermediate',
    skills: ['Excel', 'Power BI', 'Tableau', 'SQL', 'Python Analytics'],
    projects: 4,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 299,
    category: 'Data',
    logo: dataAnalyticsLogo},
  {
    id: 'android',
    title: 'Android App Development',
    description: 'Build production-ready Android apps with Kotlin, Jetpack Compose, and modern Android architecture.',
    duration: '3 Months',
    level: 'Beginner to Advanced',
    skills: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Firebase', 'Play Store Publishing'],
    projects: 5,
    liveClasses: true,
    certificate: true,
    internship: true,
    price: 349,
    category: 'Mobile',
    logo: androidLogo},
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '6',
    name: 'Sam Abishek',
    role: 'Founder, Atideto',
    bio: 'Founder and visionary passionate about democratizing tech education and building scalable digital ecosystems.',
    social: { 
      email: 'mailto:vipsamabishek444@gmail.com',
      phone: 'tel:+919087284053',
      whatsapp: 'https://wa.me/919087284053',
      linkedin: 'https://www.linkedin.com/in/sam-abishek-74983541a',
      instagram: 'https://www.instagram.com/vva_kiddo_sam'
    },
    image: samImg,
    detailImage: samDetailImg
  },
  {
    id: '2',
    name: 'Neevas Nagil AR',
    role: 'Co-Founder & CFO',
    bio: 'Visionary technologist with extensive experience building enterprise software and driving product strategy.',
    social: { 
      email: 'mailto:Neevasramesh2020@gmail.com',
      phone: 'tel:+919363600534',
      whatsapp: 'https://wa.me/919363600534',
      linkedin: 'https://www.linkedin.com/in/neevas-ramesh-6a3146366',
      instagram: 'https://instagram.com/mr_cotton_candy_30',
      facebook: 'https://www.facebook.com/share/1HQhn3yenG/'
    },
    image: neevasImg,
    detailImage: neevasDetailImg
  },
  {
    id: '3',
    name: 'Yokesh S',
    role: 'AI Engineer & UI/UX Designer',
    bio: 'Specialist in generative AI and neural network architecture. Leads the automation division, integrating cutting-edge models into enterprise solutions.',
    social: { 
      email: 'mailto:yogeshbrf2006@gmail.com',
      phone: 'tel:+919384444413',
      whatsapp: 'https://wa.me/919384444413',
      linkedin: 'https://www.linkedin.com/in/yogesh-s-8559a32a4',
      github: 'https://github.com/yogeshbrf'
    },
    image: yokeshImg,
    detailImage: yokeshDetailImg
  },
  {
    id: '1',
    name: 'Vishnu R',
    role: 'CEO, Atideto',
    bio: 'Full-stack architect specializing in scalable cloud systems and modern web frameworks.',
    social: { 
      email: 'mailto:vishnurajan24766@gmail.com',
      phone: 'tel:+916379000598',
      whatsapp: 'https://wa.me/916379000598',
      linkedin: 'https://www.linkedin.com/in/vishnu-r-a41884300/',
      github: 'https://github.com/Vishnuat18'
    },
    image: vishnuImg,
    detailImage: vishnuDetailImg
  },
  {
    id: '5',
    name: 'Kiran Balaso Patil',
    role: 'CPO, Atideto',
    bio: 'Cloud infrastructure expert specializing in Kubernetes and AWS. Ensures our systems are globally available, secure, and highly scalable.',
    social: { 
      email: 'mailto:kiranbalasopatil33@gmail.com',
      phone: 'tel:+918610641610',
      whatsapp: 'https://wa.me/918610641610',
      linkedin: 'https://www.linkedin.com/in/kiran-balaso-patil-851a43351',
      github: 'https://github.com/KiranBalasoPatil3052006'
    },
    image: kiranImg,
    detailImage: kiranDetailImg
  },
  {
    id: '4',
    name: 'Sanjay',
    role: 'Designer & Video Editor',
    bio: 'Award-winning UI/UX designer crafting experiences that convert. Worked with 100+ brands globally.',
    social: { 
      email: 'mailto:sanjaysanjeev2289@gmail.com',
      phone: 'tel:+919092472289',
      whatsapp: 'https://wa.me/919092472289',
      instagram: 'https://instagram.com/stylish_ismart_sanjay',
      facebook: 'https://www.facebook.com/share/1HQhn3yenG/'
    },
    image: sanjayImg,
    detailImage: sanjayDetailImg
  },
  {
    id: '7',
    name: 'Sachin',
    role: 'Client Manager',
    bio: 'Dedicated client manager ensuring transparent communication, honest timelines, and accountable delivery.',
    social: { 
      phone: 'tel:+918778457688',
      whatsapp: 'https://wa.me/918778457688'
    },
    image: sachinImg,
    detailImage: sachinDetailImg
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'David Chen',
    role: 'CEO',
    company: 'TechVentures Inc.',
    content: 'ATIDETO transformed our entire digital infrastructure. The team delivered a complex AI automation system in record time. Exceptional quality and professionalism.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&auto=format&fit=crop'},
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Product Director',
    company: 'FinovateCorp',
    content: 'The mobile app ATIDETO built for us achieved 4.9 stars on both stores. Their attention to UX details and performance optimization is unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&auto=format&fit=crop'},
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'CTO',
    company: 'HealthStream',
    content: 'We engaged ATIDETO for cloud migration. Zero downtime, 40% cost reduction. They know what they are doing at every level of the stack.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&auto=format&fit=crop'},
  {
    id: '4',
    name: 'Aisha Patel',
    role: 'Academy Graduate',
    company: 'Google',
    content: 'The ATIDETO Academy Data Science program landed me my dream job at Google. The curriculum was industry-aligned and the mentorship was invaluable.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80&auto=format&fit=crop'},
];

export const STATS: Stat[] = [
  { value: '250', label: 'Projects Delivered', suffix: '+' },
  { value: '98', label: 'Client Satisfaction', suffix: '%' },
  { value: '2000', label: 'Students Trained', suffix: '+' },
  { value: '15', label: 'Countries Served', suffix: '+' },
];

export const TECH_STACK = [
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'AI/ML' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'TensorFlow', category: 'AI' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'GraphQL', category: 'API' },
  { name: 'Redis', category: 'Cache' },
  { name: 'Figma', category: 'Design' },
  { name: 'Swift', category: 'iOS' },
];

export const TIMELINE = [
  { year: '2018', title: 'Founded', desc: 'ATIDETO was founded with a vision to democratize premium software development.' },
  { year: '2019', title: 'Academy Launched', desc: 'Launched our tech education wing with 3 initial courses and 50 students.' },
  { year: '2020', title: 'Global Expansion', desc: 'Expanded to serve clients across 10+ countries through remote-first operations.' },
  { year: '2021', title: 'AI Division', desc: 'Established dedicated AI & Automation division to meet growing enterprise demand.' },
  { year: '2022', title: '1000+ Students', desc: 'Academy milestone: over 1,000 students trained and placed in top companies.' },
  { year: '2023', title: 'Cloud Partnership', desc: 'Official AWS & Google Cloud partner status achieved.' },
  { year: '2024', title: 'Enterprise Scale', desc: '250+ projects delivered, 2,000+ students trained across 15+ countries.' },
];

export const CORE_VALUES = [
  { icon: '', title: 'Excellence', desc: 'We deliver nothing short of exceptional quality in every project and interaction.' },
  { icon: '', title: 'Innovation', desc: 'Continuously pushing boundaries with cutting-edge technology and creative solutions.' },
  { icon: '', title: 'Integrity', desc: 'Transparent communication, honest timelines, and accountable delivery.' },
  { icon: '', title: 'Learning', desc: 'A culture of continuous growth for our team and our students.' },
  { icon: '', title: 'Impact', desc: 'Building technology that creates meaningful change for businesses and careers.' },
  { icon: '', title: 'Speed', desc: 'Agile execution without compromising on the craftsmanship of our work.' },
];

export const INTERNSHIP_CATEGORIES = [
  'All',
  'Full Stack',
  'Programming',
  'AI & Data',
  'Design',
  'Security',
  'Cloud',
  'Marketing'
];

export const INTERNSHIP_PROGRAMS = [
  {
    id: 'fs-java',
    title: 'Full Stack Web Development (Java)',
    duration: '3 Months',
    description: 'Master enterprise-level full-stack development using Java, Spring Boot, and modern frontend technologies.',
    skills: ['Java', 'Spring Boot', 'React', 'MySQL'],
    category: 'Full Stack',
    icon: javaFullStackIntImg
  },
  {
    id: 'fs-mern',
    title: 'Full Stack Development (MERN Stack)',
    duration: '3 Months',
    description: 'Build scalable single-page applications with MongoDB, Express.js, React, and Node.js.',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    category: 'Full Stack',
    icon: mernStackIntImg
  },
  {
    id: 'fs-mean',
    title: 'Full Stack Development (MEAN Stack)',
    duration: '3 Months',
    description: 'Develop robust web applications using MongoDB, Express.js, Angular, and Node.js.',
    skills: ['MongoDB', 'Express', 'Angular', 'Node.js'],
    category: 'Full Stack',
    icon: meanStackIntImg
  },
  {
    id: 'web-dev',
    title: 'Web Development Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'DOM'],
    category: 'Programming',
    icon: webDevIntImg
  },
  {
    id: 'python',
    title: 'Python Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['Python', 'Django', 'Flask', 'Automation'],
    category: 'Programming',
    icon: pythonIntImg
  },
  {
    id: 'core-java',
    title: 'Core Java',
    duration: 'Custom Duration',
    description: '',
    skills: ['OOPs', 'Data Structures', 'Multithreading'],
    category: 'Programming',
    icon: javaIntImg
  },
  {
    id: 'data-science',
    title: 'Data Science Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'],
    category: 'AI & Data',
    icon: dataScienceIntImg
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    category: 'Marketing',
    icon: digitalMarketingIntImg
  },
  {
    id: 'app-dev',
    title: 'App Development Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['Flutter', 'React Native', 'Android', 'iOS'],
    category: 'Programming',
    icon: appDevIntImg
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['Ethical Hacking', 'Network Security', 'Linux'],
    category: 'Security',
    icon: cyberSecurityIntImg
  },
  {
    id: 'cloud',
    title: 'Cloud Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['AWS', 'Azure', 'Docker', 'DevOps'],
    category: 'Cloud',
    icon: cloudIntImg
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design Internship',
    duration: 'Custom Duration',
    description: '',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Research'],
    category: 'Design',
    icon: uiUxIntImg
  }
];
