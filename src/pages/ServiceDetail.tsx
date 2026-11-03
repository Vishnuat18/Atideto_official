import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  X,
  Code,
  Globe,
  Layout,
  Briefcase,
  Building,
  Building2,
  ShoppingBag,
  Rocket,
  RefreshCw,
  Wrench,
  Search,
  Webhook,
  CreditCard,
  MessageSquare,
  Bot,
  Workflow,
  FileText,
  Mail,
  Users,
  Layers,
  Package,
  CalendarCheck,
  Home,
  Stethoscope,
  Utensils,
  GraduationCap,
  Truck,
  Coins,
  Dumbbell,
  Smartphone,
  Tablet,
  Cloud,
  Database,
  ShieldCheck,
  PenTool,
  Palette,
  TrendingUp,
  Zap,
  Sparkles,
  BarChart3
} from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { useTheme } from '@/context/ThemeContext';
import {
  CATEGORIZED_SERVICES,
  getCategorizedServiceById,
  CategorizedService,
  getServiceSubtitle
} from '@/constants/categorizedServices';

// High-resolution 3D Solution Assets for Capability Cards
import crmImg from '@/assets/solutions/crm.png';
import billingImg from '@/assets/solutions/billing.png';
import erpImg from '@/assets/solutions/erp.png';
import inventoryImg from '@/assets/solutions/inventory_management.png';
import schoolErpImg from '@/assets/solutions/school_erp.png';
import hotelImg from '@/assets/solutions/hotel management.png';
import gymImg from '@/assets/solutions/gym_management.png';
import businessPortfolioImg from '@/assets/solutions/business_portfolio.png';
import transportImg from '@/assets/solutions/transport_management.png';
import scmImg from '@/assets/solutions/scm.png';
import lmsImg from '@/assets/solutions/lms.png';
import studentMgmtImg from '@/assets/solutions/student_management.png';
import expenseImg from '@/assets/solutions/expense.png';
import ecommerceImg from '@/assets/solutions/ecommerce.png';
import apiImg from '@/assets/solutions/api.png';
import appointmentImg from '@/assets/solutions/appointment.png';
import digitalMarketingImg from '@/assets/solutions/digital_marketing.png';
import chitImg from '@/assets/solutions/chit.png';

// 4-Image WhatsApp Automation Hover Showcase
import whatsapp1 from '@/assets/services_images/ai_automation/whatsapp1.png';
import whatsapp2 from '@/assets/services_images/ai_automation/whatsapp2.png';
import whatsapp3 from '@/assets/services_images/ai_automation/whatsapp3.png';
import whatsapp4 from '@/assets/services_images/ai_automation/whatsapp4.png';
import appointmentBookingImg from '@/assets/services_images/ai_automation/appointment_booking.png';
import bpaImg from '@/assets/services_images/ai_automation/business_process_automation.png';
import crmPipeImg from '@/assets/services_images/ai_automation/crm_pipelining.png';
import custSupportImg from '@/assets/services_images/ai_automation/customer_support.png';
import emailAutoImg from '@/assets/services_images/ai_automation/email_automation.png';
import chatbotImg from '@/assets/services_images/ai_automation/website_chatbot.png';
import webChatbotImg from '@/assets/services_images/ai_automation/website_chatbot2.png';
import youtubeAiImg from '@/assets/services_images/ai_automation/youtube_and_video_ai.png';
import customAiImg from '@/assets/services_images/ai_automation/custom_ai_solutions.jpg';

const WHATSAPP_HOVER_IMAGES = [whatsapp1, whatsapp2, whatsapp3, whatsapp4];

// Intelligent 3D illustration resolver for capability cards
function getCapabilityImage(name: string, categoryId: string): string {
  const n = name.toLowerCase();
  if (n.includes('whatsapp')) return appointmentImg;
  if (n.includes('crm')) return crmImg;
  if (n.includes('billing') || n.includes('invoice') || n.includes('payment') || n.includes('expense')) return billingImg;
  if (n.includes('erp')) return erpImg;
  if (n.includes('inventory') || n.includes('order') || n.includes('warehouse')) return inventoryImg;
  if (n.includes('support') || n.includes('customer') || n.includes('employee') || n.includes('attendance')) return studentMgmtImg;
  if (n.includes('email') || n.includes('youtube') || n.includes('ad') || n.includes('marketing') || n.includes('social') || n.includes('copywriting')) return digitalMarketingImg;
  if (n.includes('chat') || n.includes('bot') || n.includes('ai') || n.includes('model')) return apiImg;
  if (n.includes('ecommerce') || n.includes('store')) return ecommerceImg;
  if (n.includes('appointment') || n.includes('reminder') || n.includes('booking')) return appointmentImg;
  if (n.includes('website') || n.includes('landing') || n.includes('portfolio') || n.includes('corporate') || n.includes('redesign') || n.includes('maintenance')) return businessPortfolioImg;
  if (n.includes('transport') || n.includes('fleet') || n.includes('logistics') || n.includes('scm') || n.includes('flow')) return scmImg;
  if (n.includes('campus') || n.includes('school') || n.includes('course') || n.includes('lms')) return schoolErpImg;
  if (n.includes('hotel') || n.includes('hospitality')) return hotelImg;
  if (n.includes('gym') || n.includes('fitness')) return gymImg;
  if (n.includes('chit')) return chitImg;
  if (n.includes('ui') || n.includes('ux') || n.includes('wirefram') || n.includes('prototype') || n.includes('design')) return businessPortfolioImg;
  if (n.includes('cloud') || n.includes('devops') || n.includes('docker') || n.includes('kubernetes') || n.includes('security') || n.includes('api')) return apiImg;
  
  if (categoryId === 'ai-automation') return apiImg;
  if (categoryId === 'business-systems') return erpImg;
  if (categoryId === 'app-development') return appointmentImg;
  if (categoryId === 'marketing-advertising' || categoryId === 'digital-marketing') return digitalMarketingImg;
  if (categoryId === 'website-development') return businessPortfolioImg;
  if (categoryId === 'custom-software-development') return crmImg;
  if (categoryId === 'ui-ux-design') return businessPortfolioImg;
  return erpImg;
}

function getCapabilityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('custom website')) return Code;
  if (n.includes('business website')) return Building2;
  if (n.includes('corporate') || n.includes('business')) return Building;
  if (n.includes('portfolio') || n.includes('agency')) return Layout;
  if (n.includes('ecommerce') || n.includes('e-commerce') || n.includes('store') || n.includes('shop') || n.includes('retail') || n.includes('marketplace')) return ShoppingBag;
  if (n.includes('landing page')) return Rocket;
  if (n.includes('redesign')) return RefreshCw;
  if (n.includes('maintenance')) return Wrench;
  if (n.includes('seo')) return Search;
  if (n.includes('api')) return Webhook;
  if (n.includes('payment') || n.includes('billing') || n.includes('invoice') || n.includes('pos') || n.includes('fintech') || n.includes('wallet') || n.includes('chit') || n.includes('finance') || n.includes('expense')) return CreditCard;
  if (n.includes('whatsapp') || n.includes('chat') || n.includes('message')) return MessageSquare;
  if (n.includes('ai agent') || n.includes('bot') || n.includes('ocr')) return Bot;
  if (n.includes('automation') || n.includes('workflow') || n.includes('orchestrat')) return Workflow;
  if (n.includes('document')) return FileText;
  if (n.includes('email') || n.includes('drip')) return Mail;
  if (n.includes('crm') || n.includes('lead') || n.includes('customer') || n.includes('social') || n.includes('community')) return Users;
  if (n.includes('dashboard') || n.includes('analytics') || n.includes('reporting') || n.includes('bi')) return BarChart3;
  if (n.includes('erp') || n.includes('system')) return Layers;
  if (n.includes('inventory') || n.includes('stock') || n.includes('warehouse') || n.includes('order')) return Package;
  if (n.includes('attendance') || n.includes('payroll')) return CalendarCheck;
  if (n.includes('booking') || n.includes('appointment')) return CalendarCheck;
  if (n.includes('real estate') || n.includes('property')) return Home;
  if (n.includes('hospital') || n.includes('clinic') || n.includes('healthcare') || n.includes('medical')) return Stethoscope;
  if (n.includes('hotel') || n.includes('restaurant') || n.includes('food')) return Utensils;
  if (n.includes('school') || n.includes('college') || n.includes('student') || n.includes('lms') || n.includes('edtech') || n.includes('learning')) return GraduationCap;
  if (n.includes('transport') || n.includes('logistics') || n.includes('fleet') || n.includes('route')) return Truck;
  if (n.includes('gym') || n.includes('fitness') || n.includes('workout')) return Dumbbell;
  if (n.includes('ios') || n.includes('apple') || n.includes('android') || n.includes('mobile') || n.includes('app')) return Smartphone;
  if (n.includes('flutter') || n.includes('react native')) return Tablet;
  if (n.includes('cloud') || n.includes('saas') || n.includes('devops') || n.includes('docker') || n.includes('kubernetes')) return Cloud;
  if (n.includes('database')) return Database;
  if (n.includes('security') || n.includes('compliance')) return ShieldCheck;
  if (n.includes('ui') || n.includes('ux') || n.includes('figma') || n.includes('prototype') || n.includes('component')) return PenTool;
  if (n.includes('design') || n.includes('brand') || n.includes('visual')) return Palette;
  if (n.includes('ad') || n.includes('marketing') || n.includes('roas') || n.includes('funnel') || n.includes('cro') || n.includes('growth')) return TrendingUp;
  if (n.includes('youtube') || n.includes('video') || n.includes('reel')) return Zap;
  return Sparkles;
}

function getCapabilityCoverImage(name: string, categoryId: string): string {
  const n = name.toLowerCase();

  // 0. AI & Automation Solutions (from @/assets/services_images/ai_automation)
  if (n.includes('whatsapp')) return whatsapp1;
  if (n === 'ai chatbots' || n.includes('ai chatbot')) return chatbotImg;
  if (n.includes('appointment')) return appointmentBookingImg;
  if (n.includes('business process')) return bpaImg;
  if (n.includes('crm pipelining') || n.includes('crm pipeline')) return crmPipeImg;
  if (n.includes('custom ai')) return customAiImg;
  if (n.includes('customer support')) return custSupportImg;
  if (n.includes('email automation')) return emailAutoImg;
  if (n.includes('website chatbot')) return webChatbotImg;
  if (n.includes('youtube')) return youtubeAiImg;

  // 1. Food Delivery & Restaurant
  if (n.includes('food') || n.includes('restaurant')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

  // 2. Healthcare & Clinic
  if (n.includes('health') || n.includes('clinic') || n.includes('medical') || n.includes('doctor')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';

  // 3. Real Estate & Property
  if (n.includes('real estate') || n.includes('property')) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  // 4. Fitness & Gym
  if (n.includes('fitness') || n.includes('workout') || n.includes('gym')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';

  // 5. Logistics, Fleet & Route GPS
  if (n.includes('logistics') || n.includes('fleet') || n.includes('transport') || n.includes('telematics')) return 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80';

  // 6. FinTech, Wallet, POS & Billing
  if (n.includes('fintech') || n.includes('wallet') || n.includes('billing') || n.includes('pos') || n.includes('chit') || n.includes('finance') || n.includes('expense')) return 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80';

  // 7. EdTech, Campus, School & Learning
  if (n.includes('edtech') || n.includes('student') || n.includes('school') || n.includes('college') || n.includes('campus') || n.includes('lms')) return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';

  // 8. Social & Community
  if (n.includes('social') || n.includes('community')) return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80';

  // 9. Booking & Appointment
  if (n.includes('booking') || n.includes('appointment')) return 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80';

  // 10. E-Commerce & Storefront
  if (n.includes('ecommerce') || n.includes('e-commerce') || n.includes('store') || n.includes('retail') || n.includes('marketplace') || n.includes('shop')) return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80';

  // 11. Corporate & Business Websites / Portals
  if (n.includes('corporate') || n.includes('business')) return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

  // 12. Landing Pages
  if (n.includes('landing page') || n.includes('funnel')) return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

  // 13. SaaS & Web App Platforms
  if (n.includes('saas') || n.includes('platform')) return 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80';

  // 14. Hotel & Resort Booking
  if (n.includes('hotel') || n.includes('resort')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  // 15. Creative Portfolio & Agency
  if (n.includes('portfolio') || n.includes('agency')) return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';

  // 16. UI/UX Design & Prototypes
  if (n.includes('ui') || n.includes('ux') || n.includes('prototype') || n.includes('figma') || n.includes('component')) return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80';

  // 17. Brand Identity
  if (n.includes('brand') || n.includes('visual')) return 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80';

  // 18. Analytics & Dashboards
  if (n.includes('dashboard') || n.includes('analytics') || n.includes('bi')) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

  // 19. Inventory, Warehouse & Order
  if (n.includes('inventory') || n.includes('warehouse') || n.includes('stock') || n.includes('order')) return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

  // 20. ERP & Business Operations
  if (n.includes('erp') || n.includes('system')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';

  // 21. Attendance & Employee HR
  if (n.includes('attendance') || n.includes('employee') || n.includes('payroll')) return 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80';

  // 22. AI Agents & Chatbots
  if (n.includes('ai') || n.includes('agent') || n.includes('bot') || n.includes('support')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  // 23. WhatsApp
  if (n.includes('whatsapp')) return whatsapp1;

  // 24. Document OCR
  if (n.includes('document') || n.includes('ocr')) return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80';

  // 25. Ads & Marketing
  if (n.includes('meta') || n.includes('ad') || n.includes('marketing')) return 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80';
  if (n.includes('google') || n.includes('search')) return 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80';
  if (n.includes('video') || n.includes('reel') || n.includes('youtube')) return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';

  // Fallbacks by category
  if (categoryId === 'ai-automation') return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'business-systems') return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'app-development') return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'marketing-advertising' || categoryId === 'digital-marketing') return 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'website-development') return 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'custom-software-development') return 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80';
  if (categoryId === 'ui-ux-design') return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80';

  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
}

function getCapabilityDesc(name: string, serviceTitle: string): string {
  const n = name.toLowerCase();
  if (n.includes('whatsapp')) return 'Centralize customer journeys, automated messages & alerts.';
  if (n.includes('customer support')) return 'Triage inquiries instantly with automated AI workflows & routing.';
  if (n.includes('chatbot') || n.includes('ai chat')) return 'Context-aware conversational agents powered by enterprise models.';
  if (n.includes('crm')) return 'Centralize customer journeys, sales pipelines & lifecycle tracking.';
  if (n.includes('erp') || n.includes('system')) return 'Unite enterprise operations, supply networks & financial control.';
  if (n.includes('portfolio') || n.includes('website') || n.includes('showcase')) return 'High-impact corporate showcases engineered to convert visitors.';
  if (n.includes('billing') || n.includes('invoice') || n.includes('pos')) return 'Automated recurring billing, ledger reconciliation & tax POS.';
  if (n.includes('inventory') || n.includes('warehouse')) return 'Live stock counts, automated reorder thresholds & barcode tracking.';
  if (n.includes('appointment') || n.includes('reminder') || n.includes('booking')) return 'Frictionless self-service reservations with automated reminders.';
  if (n.includes('workflow') || n.includes('process')) return 'Autonomous cross-platform pipelines eliminating manual bottlenecks.';
  if (n.includes('flutter') || n.includes('react native') || n.includes('mobile')) return 'Native iOS & Android mobile architectures engineered for speed.';
  if (n.includes('ui') || n.includes('ux') || n.includes('design')) return 'Human-centered interfaces, Figma tokens & interactive prototypes.';
  if (n.includes('cloud') || n.includes('devops') || n.includes('docker')) return 'Scalable infrastructure as code with Docker, Kubernetes & CI/CD.';
  if (n.includes('marketing') || n.includes('ad') || n.includes('campaign')) return 'Precision paid advertising funnels & automated creative generation.';
  return `Autonomous enterprise workflows engineered for scale in ${serviceTitle}.`;
}

interface ServiceFaqItem {
  num: string;
  category: string;
  question: string;
  answer: string;
}

function getServiceFaqs(service: CategorizedService): ServiceFaqItem[] {
  const serviceId = service.id;

  if (serviceId === 'ai-automation') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we automate?',
        answer: 'We automate repetitive business workflows — including WhatsApp messaging, lead capture, customer support, and invoice processing — so your team can focus on growth.'
      },
      {
        num: '02',
        category: 'System stage',
        question: 'New build or existing stack?',
        answer: 'Both. We can connect directly to your existing tools (CRMs, Google Sheets, ERPs) via secure APIs or build an entirely new automation system from the ground up.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We start by identifying your biggest time-draining tasks, then deliver a working prototype within 48 hours for you to test and approve before rollout.'
      },
      {
        num: '04',
        category: 'Production scale',
        question: 'Full automation system?',
        answer: 'Yes. We deliver fully managed automation with encrypted data flows, error protection, team onboarding, and ongoing maintenance to ensure 24/7 reliability.'
      }
    ];
  }

  if (serviceId === 'business-systems') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we deliver?',
        answer: 'We build all-in-one custom management software — including ERP, CRM, inventory, POS, billing, and school portals — consolidating scattered spreadsheets into one live dashboard.'
      },
      {
        num: '02',
        category: 'Data migration',
        question: 'New build or existing data?',
        answer: 'We handle both. We can build a fresh system from scratch or safely import all your existing customer records, inventory, and historical data with zero downtime.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We analyze your daily department operations and provide interactive wireframes so you can review and approve every screen before development begins.'
      },
      {
        num: '04',
        category: 'Enterprise scale',
        question: 'Full enterprise deployment?',
        answer: 'Yes. Your platform includes custom user roles, automated daily backups, secure cloud hosting, staff training sessions, and continuous technical support.'
      }
    ];
  }

  if (serviceId === 'website-development') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we build?',
        answer: 'We build fast, mobile-friendly corporate websites, landing pages, and web portals designed to showcase your brand authority and convert visitors into customers.'
      },
      {
        num: '02',
        category: 'Brand stage',
        question: 'New site or redesign?',
        answer: 'Both. We create new websites from scratch and redesign outdated sites to improve visual design, mobile responsiveness, and Google page-speed scores.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We discuss your goals and provide an interactive Figma design preview. Once you are 100% happy with the layout and look, our developers build it.'
      },
      {
        num: '04',
        category: 'Production standard',
        question: 'Full web infrastructure?',
        answer: 'Yes. Every website comes with SSL security, fast CDN hosting, mobile optimization, search engine SEO tags, and automated contact form alerts.'
      }
    ];
  }

  if (serviceId === 'custom-software-development') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we engineer?',
        answer: 'We engineer tailor-made SaaS applications, client portals, and internal business engines designed specifically for your operations, with 100% intellectual property ownership.'
      },
      {
        num: '02',
        category: 'Codebase stage',
        question: 'From scratch or refactor?',
        answer: 'We can develop brand-new applications from scratch or refactor legacy code to improve performance, fix security vulnerabilities, and handle higher traffic.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We outline a clear feature scope and project timeline, then deliver working progress updates every sprint so you can test features early and provide feedback.'
      },
      {
        num: '04',
        category: 'Lifecycle & scale',
        question: 'Full production deployment?',
        answer: 'Yes. We manage cloud architecture, database setup, automated testing, smooth launch, and ongoing maintenance to keep your software running smoothly.'
      }
    ];
  }

  if (serviceId === 'app-development') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What apps do we build?',
        answer: 'We build native and cross-platform iOS and Android mobile apps for e-commerce, on-demand services, booking systems, and internal enterprise tools.'
      },
      {
        num: '02',
        category: 'Platform stage',
        question: 'New app or web extension?',
        answer: 'Both. We can create an original mobile-first application or turn your existing web platform and database into a seamless mobile experience.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We create interactive mobile prototypes for you to test on your phone. Once the navigation and user experience feel right, we build the backend and app.'
      },
      {
        num: '04',
        category: 'App Store launch',
        question: 'Full publishing lifecycle?',
        answer: 'Yes. We handle the entire Apple App Store and Google Play Store submission process, resolve store guidelines, and provide post-launch support and updates.'
      }
    ];
  }

  if (serviceId === 'digital-marketing') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we manage?',
        answer: 'We manage high-ROI advertising campaigns on Google Search, Meta (Instagram & Facebook), and YouTube designed to drive high-intent leads and sales.'
      },
      {
        num: '02',
        category: 'Campaign stage',
        question: 'New campaigns or optimization?',
        answer: 'We can launch fresh campaigns from scratch or audit your current ads to cut wasted budget on low-performing keywords and reduce your cost per lead.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We study your target market, write engaging ad copy, design dedicated landing pages, and launch initial test campaigns within 5 days.'
      },
      {
        num: '04',
        category: 'Growth engine',
        question: 'Full marketing funnel?',
        answer: 'Yes. We connect ad leads directly into your WhatsApp or CRM, set up automated follow-up messages, and provide a clear weekly ROI dashboard.'
      }
    ];
  }

  if (serviceId === 'ui-ux-design') {
    return [
      {
        num: '01',
        category: 'Services overview',
        question: 'What do we design?',
        answer: 'We design intuitive mobile apps, modern web applications, SaaS dashboards, and cohesive brand identities that make your product effortless to use.'
      },
      {
        num: '02',
        category: 'Brand stage',
        question: 'New or existing brand?',
        answer: 'Both. We help new startups build their visual identity from zero and help existing businesses modernize clunky interfaces to boost user satisfaction.'
      },
      {
        num: '03',
        category: 'First step',
        question: 'Where do we start?',
        answer: 'We map out your user flows with low-fidelity wireframes, test them with you, and then apply color palettes, typography, and interactive prototypes.'
      },
      {
        num: '04',
        category: 'Design system',
        question: 'Full design system?',
        answer: 'Yes. You receive a complete Figma design library with reusable components, design tokens, responsive screens, and developer handoff notes.'
      }
    ];
  }

  // Fallback for any other services
  return [
    {
      num: '01',
      category: 'Services overview',
      question: `What do we build in ${service.title}?`,
      answer: `We deliver end-to-end design, custom development, and automation solutions tailored specifically for ${service.title}.`
    },
    {
      num: '02',
      category: 'Project stage',
      question: 'New or existing system?',
      answer: 'We work with both new projects starting from scratch and established systems that need upgrading or modernizing.'
    },
    {
      num: '03',
      category: 'First step',
      question: 'Where do we start?',
      answer: 'We start with a quick discovery consultation, followed by a clear project roadmap and working prototype within days.'
    },
    {
      num: '04',
      category: 'Complete direction',
      question: 'Full production deployment?',
      answer: 'Yes. We handle testing, deployment, and ongoing technical support to ensure your system runs smoothly at all times.'
    }
  ];
}

interface CapabilityCardProps {
  cap: { name: string; tag?: string };
  categoryId: string;
  isLight: boolean;
  onSelect: () => void;
}

function CapabilityCard({ cap, categoryId, isLight, onSelect }: CapabilityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const isWhatsApp = cap.name.toLowerCase().includes('whatsapp');
  const Icon = getCapabilityIcon(cap.name);
  const coverImage = getCapabilityCoverImage(cap.name, categoryId);

  useEffect(() => {
    if (!isWhatsApp || !isHovered) {
      setActiveImgIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % WHATSAPP_HOVER_IMAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isWhatsApp, isHovered]);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer aspect-[3/4] flex flex-col items-center justify-center p-4 sm:p-6 select-none ${
        isLight 
          ? 'bg-white border-stone-200/90 shadow-sm hover:shadow-2xl hover:border-transparent' 
          : 'bg-[#0D111A] border-white/10 shadow-sm hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-white/20'
      }`}
    >
      {/* Background Image(s) */}
      {isWhatsApp ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {WHATSAPP_HOVER_IMAGES.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={`${cap.name} preview ${idx + 1}`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                isHovered && activeImgIndex === idx
                  ? 'opacity-100 scale-105 transition-all duration-700'
                  : 'opacity-0 scale-100'
              }`}
            />
          ))}

          {/* 2s cycle step dots indicator when hovered */}
          {isHovered && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-white/90">
                {activeImgIndex + 1}/4
              </span>
            </div>
          )}
        </div>
      ) : (
        <img
          src={coverImage}
          alt={cap.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-100 pointer-events-none"
        />
      )}

      {/* Cinematic Dark Vignette Overlay on Hover for crisp readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Center Content: Portrait Layout with Icon and Name */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 px-2 sm:px-3 text-center transition-all duration-300 text-zinc-900 dark:text-zinc-100 group-hover:text-white pointer-events-none">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm text-zinc-700 dark:text-zinc-300 group-hover:text-white" />
        <span 
          className="font-bold text-xs sm:text-sm lg:text-[15px] tracking-tight leading-snug drop-shadow-sm font-heading"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {cap.name}
        </span>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Find the requested service or fallback to first
  const currentService: CategorizedService =
    (serviceId ? getCategorizedServiceById(serviceId) : undefined) || CATEGORIZED_SERVICES[0];

  // FAQ selection state (click to toggle)
  const [selectedFaqIdx, setSelectedFaqIdx] = useState<number>(0);

  // Computed service-specific FAQs
  const serviceFaqs = getServiceFaqs(currentService);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  // Find current index to provide Next Service link
  const currentIdx = CATEGORIZED_SERVICES.findIndex((s) => s.id === currentService.id);
  const nextService = CATEGORIZED_SERVICES[(currentIdx + 1) % CATEGORIZED_SERVICES.length];

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-clip ${
      isLight ? 'bg-[#FAF9F5] text-zinc-900' : 'bg-[#06080E] text-white'
    }`}>
      <SEO
        title={`${currentService.title} | Atideto Technologies`}
        description={currentService.tagline}
        url={`https://atideto.in/services/${currentService.id}`}
      />

      {/* ── 1. HERO SECTION (Neatly Proportioned, No Over Space, Balanced Image) ── */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-28 lg:pb-16 overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          aria-hidden
          className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-[#0052FF]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
            <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/services" className="hover:text-black dark:hover:text-white transition-colors">Services</Link>
            <ChevronRight size={12} />
            <span className="text-[#2EA8FF] font-bold">{currentService.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Eyebrow + Title + Copy + CTA Buttons */}
            <div className="lg:col-span-7 text-left">

              {/* Eyebrow: ── SERVICE CAPABILITY (Matching 2nd Reference Image, No Number) */}
              <div className="inline-flex items-center gap-3 mb-4 select-none">
                <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#0052FF] dark:text-[#2EA8FF]">
                  {currentService.eyebrow || 'SERVICE CAPABILITY'}
                </span>
              </div>

              {/* Big Title with Subtitle (Max 44px Desktop, 32px Mobile, Weight 700, Line-Height 1.15) */}
              <h1
                className="text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight leading-[1.15] mb-6 text-zinc-900 dark:text-white flex items-center gap-3 sm:gap-4 flex-wrap font-heading"
              >
                <span>{currentService.title}</span>
                <span className="text-zinc-400 dark:text-white/20 font-light text-2xl sm:text-3xl lg:text-4xl select-none">/</span>
                <span
                  className="text-base sm:text-xl lg:text-2xl font-semibold text-zinc-500 dark:text-[#94A3B8] tracking-tight font-heading"
                >
                  {getServiceSubtitle(currentService.id, currentService.eyebrow)}
                </span>
              </h1>

              {/* Tagline / Subtitle */}
              <p 
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal text-zinc-600 dark:text-slate-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {currentService.description || currentService.tagline}
              </p>

              {/* Action Buttons: Talk about this service ↗ + Explore Capabilities */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/client-connect')}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm text-white bg-[#0052FF] hover:bg-[#0047E0] shadow-[0_4px_24px_rgba(0,82,255,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Talk about this service</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/20 text-white font-mono text-xs">
                    ↗
                  </span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('capabilities-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    isLight
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>Explore Capabilities</span>
                  <ChevronDown size={14} />
                </button>
              </div>

            </div>

            {/* Right Column: 3D Illustration Only (Balanced & Neatly Sized) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
              <div className="relative group cursor-pointer inline-flex flex-col items-center">
                {/* Tooltip 1: Architecture Status (Top Floating) */}
                <div className="absolute -top-3 right-0 sm:right-2 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-30">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080E1C]/95 border border-[#38BDF8]/40 text-white shadow-2xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono tracking-wide text-slate-200">
                      Production Architecture
                    </span>
                  </div>
                </div>

                <img
                  src={currentService.visualImage}
                  alt={currentService.title}
                  className="w-48 sm:w-60 md:w-64 lg:w-72 max-w-[280px] sm:max-w-[300px] lg:max-w-[320px] h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
                />

                {/* Tooltip 2: Engine Name (Bottom Floating) */}
                <div className="absolute -bottom-5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-30">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080E1C]/95 border border-white/20 text-white shadow-2xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2EA8FF] animate-pulse" />
                    <span className="text-xs font-mono font-semibold tracking-wide text-slate-200">
                      {currentService.title} Engine
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── 2. CENTERPIECE CAPABILITIES CARDS GRID (With Cohesive Header) ── */}
      <section 
        id="capabilities-grid" 
        className={`py-16 sm:py-20 border-t ${
          isLight ? 'border-zinc-200/80 bg-[#FAF9F5]' : 'border-white/10 bg-[#080B12]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-10 sm:mb-12 text-left">
            <div className="inline-flex items-center gap-3 mb-3 select-none">
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#0052FF] dark:text-[#2EA8FF]">
                CORE CAPABILITIES
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[36px] font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.2] font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              What we engineer & deploy.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-400 font-normal font-sans mt-2">
              Explore specialized capabilities engineered for scalability, reliability, and speed.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {currentService.capabilities.map((cap) => (
              <CapabilityCard
                key={cap.name}
                cap={cap}
                categoryId={currentService.id}
                isLight={isLight}
                onSelect={() => navigate(`/client-connect?service=${encodeURIComponent(cap.name)}`)}
              />
            ))}
          </div>

        </div>
      </section>


      {/* ── 3. WHERE THIS CAN HELP (4 Numbered Moves in a Row) ── */}
      <section className="py-20 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Eyebrow + Headline + Subtitle */}
          <div className="mb-14 text-left">
            <div className="inline-flex items-center gap-3 mb-3 select-none">
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#0052FF] dark:text-[#2EA8FF]">
                A USEFUL STARTING POINT
              </span>
            </div>

            <h2
              className="text-[28px] sm:text-[36px] font-bold tracking-tight mb-2 text-zinc-900 dark:text-white leading-[1.2] font-heading"
            >
              Where this can help.
            </h2>
            <p className="text-base text-zinc-600 dark:text-slate-400 font-normal font-sans">
              Four common examples, explained simply.
            </p>
          </div>

          {/* 4 Numbered Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentService.whereThisHelps.map((item) => (
              <div
                key={item.num}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-zinc-200 shadow-sm hover:shadow-lg hover:border-[#0052FF]/40'
                    : 'bg-[#0B0F19] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Header: Number Badge + Diagonal Arrow */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-7 h-7 rounded-full bg-[#0052FF]/10 text-[#2EA8FF] flex items-center justify-center font-mono font-bold text-xs">
                      {item.num}
                    </span>
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#2EA8FF] transition-colors" />
                  </div>

                  <h3
                    className="text-[20px] sm:text-[22px] font-semibold tracking-tight mb-2.5 text-zinc-900 dark:text-white group-hover:text-[#2EA8FF] transition-colors font-heading leading-snug"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className={`text-sm sm:text-base leading-relaxed font-sans font-normal ${isLight ? 'text-zinc-600' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ── 4. QUESTIONS BEFORE THE FIRST STEP (FAQ Style Matching Reference Image) ── */}
      <section 
        id="faq-section"
        className="py-20 lg:py-28 border-t border-white/10 bg-black text-white relative overflow-hidden"
      >
        {/* Subtle Ambient Background Lighting */}
        <div 
          aria-hidden="true"
          className="absolute -top-32 right-1/4 w-[600px] h-[350px] bg-[#0066FF]/10 blur-[140px] rounded-full pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header: FAQ & Questions before the first step */}
          <div className="mb-10 sm:mb-14 text-left">
            <div className="inline-flex items-center gap-3 mb-3 select-none">
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#0052FF] shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-heading text-[#2EA8FF]">
                FAQ & CONSULTATION
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2] font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Questions before the first step.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal font-sans mt-2">
              Clear answers regarding deployment timelines, technical integrations, and project start.
            </p>
          </div>

          {/* FAQ Accordion List - Click to Toggle Answer */}
          <div className="border-t border-white/10 divide-y divide-white/10">
            {serviceFaqs.map((faq, idx) => {
              const isOpen = selectedFaqIdx === idx;

              return (
                <div
                  key={faq.num}
                  onClick={() => setSelectedFaqIdx(selectedFaqIdx === idx ? -1 : idx)}
                  className="group py-7 sm:py-9 transition-colors duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-start justify-between gap-4 sm:gap-8">
                    
                    {/* Left: Number [01], [02], etc. */}
                    <div className="shrink-0 w-10 sm:w-16 font-mono text-xs sm:text-sm text-slate-400 group-hover:text-white transition-colors pt-1 select-none">
                      [{faq.num}]
                    </div>

                    {/* Middle: Category, Title and Expandable Answer */}
                    <div className="flex-1 min-w-0 pr-2 sm:pr-6">
                      
                      {/* Overline Category */}
                      <div className="text-xs font-mono text-slate-400 tracking-wider mb-2 transition-colors group-hover:text-slate-300">
                        {faq.category}
                      </div>

                      {/* Question Title */}
                      <h3
                        className={`text-[19px] sm:text-[22px] font-semibold tracking-tight transition-colors font-heading leading-snug ${
                          isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {faq.question}
                      </h3>

                      {/* Expandable Answer (Revealed on Hover or Click) */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 sm:pt-4 max-w-3xl">
                              <p
                                className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal font-sans"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* Right: Circular Toggle Button (Blue Glow when Open/Hovered - Strictly NO RED) */}
                    <div className="shrink-0 pt-1">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.6)] scale-105'
                            : 'bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                        }`}
                      >
                        {isOpen ? (
                          <X size={15} className="sm:size-4 transition-transform duration-200" />
                        ) : (
                          <Plus size={15} className="sm:size-4 transition-transform duration-200 group-hover:rotate-90" />
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Next Service Navigation Bar */}
          <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-slate-400">
            <span>Currently viewing: <strong className="text-white">{currentService.title}</strong></span>
            <Link
              to={`/services/${nextService.id}`}
              className="inline-flex items-center gap-2 font-bold text-sm text-[#2EA8FF] hover:underline font-heading"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span>Next Service: {nextService.title}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
