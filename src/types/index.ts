export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  features?: string[];
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  skills: string[];
  projects: number;
  liveClasses: boolean;
  certificate: boolean;
  internship: boolean;
  price: number;
  category: string;
  logo?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  experience: string;
  social: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FormStep {
  title: string;
  description: string;
}
