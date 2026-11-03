export type RevenueSource = 'internship' | 'service';
export type RevenueStatus = 'confirmed' | 'pending' | 'failed' | 'refunded';
export type ExpenseStatus = 'pending_review' | 'approved' | 'rejected';
export type ExpenseCategory = 
  | 'Cloud Hosting' 
  | 'Software Licenses' 
  | 'Domains & Security' 
  | 'Honorariums & Stipends' 
  | 'Infrastructure & Lab' 
  | 'Marketing & Outreach' 
  | 'Other';

export interface RevenueRecord {
  id: string;
  date: string;
  source: RevenueSource;
  referenceId?: string;
  payer: string;
  amount: number;
  method: string;
  status: RevenueStatus;
  txnRef?: string;
  notes?: string;
  createdBy: string;
  createdAt: number;
  proofUrl?: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: ExpenseCategory;
  description: string;
  date: string;
  amount: number;
  status: ExpenseStatus;
  proofUrl: string;
  proofName: string;
  proofType: string;
  vendor?: string;
  method?: string;
  txnRef?: string;
  notes?: string;
  submittedBy: string;
  submittedAt: number;
  approvedBy?: string;
  approvedAt?: number;
  rejectionReason?: string;
}

export interface ProfitReportData {
  period: { label: string; start: string; end: string };
  internshipRevenue: number;
  serviceRevenue: number;
  totalRevenue: number;
  approvedExpenses: number;
  netProfit: number;
  expenseBreakdown: { category: string; total: number; count: number }[];
  revenueBreakdown: { source: string; total: number; count: number }[];
  transactionCounts: { revenue: number; expenses: number };
  pendingExpenses: number;
  rejectedExpenses: number;
  refundedRevenue: number;
}

export const REVENUE_STATUS_OPTIONS: { value: RevenueStatus; label: string; color: string }[] = [
  { value: 'confirmed', label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'refunded', label: 'Refunded', color: 'bg-slate-100 text-slate-800 border-slate-200' },
];

export const EXPENSE_STATUS_OPTIONS: { value: ExpenseStatus; label: string; color: string }[] = [
  { value: 'pending_review', label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Cloud Hosting',
  'Software Licenses',
  'Domains & Security',
  'Honorariums & Stipends',
  'Infrastructure & Lab',
  'Marketing & Outreach',
  'Other',
];

export const REVENUE_SOURCES: { value: RevenueSource; label: string }[] = [
  { value: 'internship', label: 'Internship Revenue' },
  { value: 'service', label: 'Service Revenue' },
];

export const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
] as const;

export type DatePreset = typeof DATE_PRESETS[number]['value'];