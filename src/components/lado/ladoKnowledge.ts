export interface QuickQuestion {
  id: string;
  iconName: 'rocket' | 'bot' | 'graduation-cap' | 'coins' | 'zap' | 'map-pin' | 'code' | 'shield';
  title: string;
  description: string;
  queryText: string;
  answer: string;
  actionText?: string;
  actionHref?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'lado' | 'user';
  text: string;
  timestamp: string;
  actionText?: string;
  actionHref?: string;
  actionIcon?: 'arrow-right' | 'calendar' | 'file-text' | 'phone' | 'external-link';
}

export const getTimeBasedGreeting = (): { greeting: string; icon: 'sun' | 'cloud-sun' | 'moon' | 'sparkles' } => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      icon: 'sun',
      greeting: "Good morning. I am Lado, your AI guide at Atideto. How can I assist you with custom engineering, AI workflows, or our Academy today?",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      icon: 'cloud-sun',
      greeting: "Good afternoon. I am Lado from Atideto. I can assist you with custom software development, AI automation pipelines, Academy internships, or project estimates. What would you like to explore?",
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      icon: 'moon',
      greeting: "Good evening. Lado here. Whether you are architecting a new software milestone, exploring enterprise AI agents, or reviewing tech internships, I am ready to assist.",
    };
  } else {
    return {
      icon: 'sparkles',
      greeting: "Welcome. I am Lado, Atideto's continuous digital assistant. Feel free to ask about our development services, pricing, Academy curriculum, or Salem headquarters.",
    };
  }
};

export const PREDEFINED_QUESTIONS: QuickQuestion[] = [
  {
    id: 'software-mvp',
    iconName: 'rocket',
    title: 'Custom Software & Apps',
    description: 'Web, mobile iOS/Android, and cloud platforms',
    queryText: 'Tell me about your custom software and mobile app development services.',
    answer: "Atideto engineers production-ready web applications, native & cross-platform mobile apps (iOS & Android), and scalable cloud infrastructure.\n\n• Tech Stack: React, Next.js, Vite, TypeScript, Node.js, Python, Flutter, React Native, Java, PostgreSQL, MongoDB, AWS, Docker.\n• Delivery: Agile MVPs built and deployed in 2 to 4 weeks; full enterprise software systems in 90 days with end-to-end QA.",
    actionText: 'Explore Solutions',
    actionHref: '/services',
  },
  {
    id: 'ai-automation',
    iconName: 'bot',
    title: 'AI Automation & Agents',
    description: 'Automate business workflows with intelligent LLMs',
    queryText: 'How can Atideto help automate our business workflows using AI?',
    answer: "We design tailored AI solutions that resolve operational bottlenecks and eliminate repetitive overhead:\n\n• Custom AI Agents: Autonomous customer service, lead qualification, and task execution.\n• Workflow Automations: Automated document parsing, ERP/CRM data synchronizations, and reporting.\n• LLM Integrations: OpenAI, Anthropic Claude, Google Gemini, and open-source models via LangChain & LlamaIndex.\n• Result: Up to 70% reduction in manual effort with measurable ROI in 90 days.",
    actionText: 'Book AI Strategy Call',
    actionHref: '/client-connect',
  },
  {
    id: 'internships',
    iconName: 'graduation-cap',
    title: 'Atideto Academy',
    description: 'Hands-on tech internships with verified credentials',
    queryText: 'What internships and tech training programs are offered at Atideto Academy?',
    answer: "Atideto Academy offers industry-aligned internships where students and graduates build commercial-grade projects with 1-on-1 mentorship from working engineers:\n\n• Programs: Full Stack Java, MERN/MEAN Stack, Python AI/ML, Data Science & Analytics, Mobile App Dev (Flutter/Android), Cyber Security, Cloud DevOps, and UI/UX Design.\n• Outcomes: Live production codebase portfolio, verified digital certificate, resume review, and placement guidance.",
    actionText: 'View Academy Programs',
    actionHref: '/academy',
  },
  {
    id: 'pricing-quote',
    iconName: 'coins',
    title: 'Pricing & Project Quotes',
    description: 'Milestone billing, scope estimation, and proposals',
    queryText: 'How does Atideto price projects, and how can I get an itemized quote?',
    answer: "We adhere to transparent, milestone-driven pricing with no hidden costs:\n\n• Project-Based: Clear milestone stages (Kickoff Discovery, Working Prototype Demo, Final Release & Deployment).\n• Dedicated Agile Retainer: Monthly sprint squads for continuous product development.\n• Turnaround: Submit your specifications through our form, and our solutions architects provide an itemized timeline and cost estimate within 24 hours.",
    actionText: 'Submit Requirements',
    actionHref: '/requirement-gathering',
  },
  {
    id: 'process',
    iconName: 'zap',
    title: 'Development Workflow',
    description: 'Our 4-phase agile engineering methodology',
    queryText: 'What is Atideto step-by-step development process from start to finish?',
    answer: "Our 4-stage delivery framework ensures total clarity and velocity:\n\n1. Discovery & Architecture: Requirement mapping, technical feasibility, and system modeling.\n2. Interactive UI/UX Design: Clickable Figma design systems and user flows for your sign-off.\n3. Agile Engineering & QA: Bi-weekly sprint demos, automated testing, and code audits.\n4. Cloud Launch & SLA Support: Continuous deployment, server monitoring, and ongoing maintenance.",
    actionText: 'See How We Work',
    actionHref: '/services',
  },
  {
    id: 'human-contact',
    iconName: 'map-pin',
    title: 'Office & Direct Contact',
    description: 'Salem headquarters, phone, email, and founder meetings',
    queryText: 'Where is your office located, and how can I connect with your team directly?',
    answer: "You can reach our engineering leadership directly:\n\n• Headquarters: Salem, Tamil Nadu, India (serving global clients across India, US, UK, and Middle East).\n• Direct Phone / WhatsApp: +91 9087284053\n• Email: atideto.in@gmail.com\n• Video Meetings: Schedule a Google Meet session with our solutions team.",
    actionText: 'Connect With Our Team',
    actionHref: '/client-connect',
  },
];

export const getLadoResponse = (input: string): { text: string; actionText?: string; actionHref?: string } => {
  const query = input.toLowerCase().trim();

  // Greetings
  if (query.match(/^(hi|hello|hey|greetings|namaste|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello. I am Lado, your dedicated guide at Atideto. How can I assist you today? You can inquire about our custom software engineering, AI automation systems, Academy internships, or project quotations.",
    };
  }

  // Identity / Who is Lado
  if (query.includes('who are you') || query.includes('what is lado') || query.includes('about lado')) {
    return {
      text: "I am Lado, an AI companion designed for Atideto Technologies. I possess comprehensive knowledge of our software services, engineering methodologies, Academy training tracks, pricing models, and team contacts.",
    };
  }

  // Software & Web / Mobile Development
  if (query.includes('service') || query.includes('web') || query.includes('app') || query.includes('mobile') || query.includes('software') || query.includes('develop') || query.includes('frontend') || query.includes('backend') || query.includes('stack')) {
    return {
      text: "Atideto provides full-lifecycle engineering services:\n\n• Web Application Development: Modern responsive web platforms built using React, Vite, Next.js, and Tailwind CSS.\n• Mobile App Development: High-performance iOS and Android applications utilizing Flutter and React Native.\n• Custom Enterprise Software: Scalable microservices, distributed architectures, and secure REST/GraphQL APIs.\n• Cloud Solutions: AWS and GCP deployments, Docker containerization, and CI/CD pipelines.",
      actionText: 'Explore All Services',
      actionHref: '/services',
    };
  }

  // AI & Automation
  if (query.includes('ai') || query.includes('agent') || query.includes('automation') || query.includes('bot') || query.includes('machine learning') || query.includes('llm') || query.includes('gpt')) {
    return {
      text: "Our AI engineering team designs production-grade automation systems:\n\n• Autonomous AI Agents: Self-operating conversational and task agents for customer engagement and back-office pipelines.\n• Workflow Automation: Elimination of repetitive manual entry, invoice parsing, and automated reporting.\n• Custom Model & API Integrations: Enterprise integrations with OpenAI GPT-4, Anthropic Claude, and Google Gemini with retrieval augmented generation (RAG).",
      actionText: 'Discuss AI Solutions',
      actionHref: '/client-connect',
    };
  }

  // Academy & Internships
  if (query.includes('intern') || query.includes('academy') || query.includes('course') || query.includes('student') || query.includes('training') || query.includes('certificate') || query.includes('learn') || query.includes('java') || query.includes('python')) {
    return {
      text: "Atideto Academy delivers hands-on, industry-backed tech internships:\n\n• Domains: Full Stack Java, MERN/MEAN Stack, Python AI/ML, Data Analytics & Science, Mobile App Development, Cyber Security, Cloud Engineering, and UI/UX Design.\n• Features: Direct mentorship by senior engineers, live client-grade codebase contributions, verified digital credential upon completion, and interview preparation.",
      actionText: 'Explore Atideto Academy',
      actionHref: '/academy',
    };
  }

  // Pricing & Cost
  if (query.includes('price') || query.includes('cost') || query.includes('quote') || query.includes('rate') || query.includes('budget') || query.includes('how much') || query.includes('estimate')) {
    return {
      text: "We offer transparent milestone-based agreements tailored to your requirements:\n\n• MVP Projects: Typical delivery in 2 to 4 weeks with structured milestone check-ins.\n• Enterprise Systems: Complete scalable platforms deployed in 90 days.\n• Itemized Estimates: Fill out our quick requirement form, and our solutions architects will send a comprehensive scope breakdown within 24 hours.",
      actionText: 'Request an Itemized Quote',
      actionHref: '/requirement-gathering',
    };
  }

  // Contact & Location
  if (query.includes('contact') || query.includes('call') || query.includes('phone') || query.includes('email') || query.includes('talk') || query.includes('human') || query.includes('meet') || query.includes('address') || query.includes('office') || query.includes('salem') || query.includes('location')) {
    return {
      text: "You can reach our leadership team directly:\n\n• Location: Salem, Tamil Nadu, India\n• Phone / WhatsApp: +91 9087284053\n• Email: atideto.in@gmail.com\n• Business Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST\n\nYou can also schedule a direct video consultation right now:",
      actionText: 'Book a Strategy Call',
      actionHref: '/client-connect',
    };
  }

  // About & Team
  if (query.includes('team') || query.includes('founder') || query.includes('about') || query.includes('company') || query.includes('atideto') || query.includes('who built')) {
    return {
      text: "Atideto Technologies is a premium technology development company founded to accelerate businesses through modern software, AI automation, and talent incubation. Our core engineering team includes Yokesh, Neevas, Sam, Vishnu, Kiran, Sanjay, and Sachin.",
      actionText: 'Meet The Team',
      actionHref: '/about',
    };
  }

  // Requirement & Starting a Project
  if (query.includes('requirement') || query.includes('hire') || query.includes('start') || query.includes('proposal') || query.includes('work together')) {
    return {
      text: "Starting a collaboration with Atideto is straightforward:\n\n1. Submit your project requirements using our online intake form.\n2. Our technical leads review your specifications and prepare an architectural blueprint.\n3. We schedule a 15-minute alignment call with a firm estimate.",
      actionText: 'Submit Project Requirements',
      actionHref: '/requirement-gathering',
    };
  }

  // Default fallback
  return {
    text: "Thank you for asking. Atideto specializes in custom software development, mobile apps, enterprise AI workflows, and tech internships. Would you like to view our services, review the Academy programs, or connect directly with our engineering team?",
    actionText: 'Connect With Our Team',
    actionHref: '/client-connect',
  };
};
