import { normalizeDomain } from '@/lib/certificateStore';

// Official and standard internship domains supported across the ERP and the
// public QR registration form. Keep this list aligned with normalizeDomain()
// so stored aliases/casing variants resolve back to a real dropdown option.
export const STANDARD_DOMAINS = [
  'Full Stack Web Development',
  'Full Stack Web Development (Java)',
  'Full Stack Development (MERN Stack)',
  'Full Stack Development (MEAN Stack)',
  'Web Development',
  'Python',
  'Python Programming',
  'Core Java',
  'Data Science',
  'Data Analytics',
  'Artificial Intelligence and Machine Learning',
  'Digital Marketing',
  'App Development',
  'Mobile App Development',
  'Cyber Security',
  'Cloud & DevOps',
  'Cloud Computing & DevOps',
  'UI / UX Design'
];

export const getStandardDomainValue = (domain?: string): string => {
  if (!domain || !domain.trim()) return '';
  const raw = domain.toLowerCase().trim();
  const exact = STANDARD_DOMAINS.find(d => d.toLowerCase().trim() === raw);
  if (exact) return exact;
  const canonical = normalizeDomain(domain).toLowerCase().trim();
  return STANDARD_DOMAINS.find(d => d.toLowerCase().trim() === canonical) || '';
};

export const isStandardDomain = (domain?: string): boolean => Boolean(getStandardDomainValue(domain));

// "Other / Custom" should only surface for a real custom entry (or an explicitly
// selected Other placeholder) — never for a standard domain stored in a
// different casing/alias form.
export const needsCustomDomain = (domain?: string): boolean => {
  if (domain === 'Other') return true;
  const clean = (domain || '').trim();
  if (!clean) return false;
  return !getStandardDomainValue(clean);
};
