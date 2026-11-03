import type { RevenueRecord, ExpenseRecord, ProfitReportData, DatePreset } from './financeTypes';

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getPeriodBounds(preset: DatePreset, customStart?: string, customEnd?: string): { start: string; end: string } {
  const now = new Date();
  const today = formatDateForInput(now);
  
  switch (preset) {
    case 'today':
      return { start: today, end: today };
    case 'this_week': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      return { start: formatDateForInput(monday), end: today };
    }
    case 'this_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: formatDateForInput(firstDay), end: today };
    }
    case 'this_quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      const firstMonth = quarter * 3;
      const firstDay = new Date(now.getFullYear(), firstMonth, 1);
      return { start: formatDateForInput(firstDay), end: today };
    }
    case 'this_year': {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      return { start: formatDateForInput(firstDay), end: today };
    }
    case 'custom':
      return { 
        start: customStart || today, 
        end: customEnd || today 
      };
    default:
      return { start: today, end: today };
  }
}

export function getPeriodLabel(preset: DatePreset, customStart?: string, customEnd?: string): string {
  const bounds = getPeriodBounds(preset, customStart, customEnd);
  const start = new Date(bounds.start);
  const end = new Date(bounds.end);
  
  if (preset === 'custom') {
    return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  }
  
  const presetLabels: Record<DatePreset, string> = {
    today: 'Today',
    this_week: 'This Week',
    this_month: 'This Month',
    this_quarter: 'This Quarter',
    this_year: 'This Year',
    custom: 'Custom Range',
  };
  return presetLabels[preset];
}

export function filterByPeriod<T extends { date: string }>(records: T[], start: string, end: string): T[] {
  const startDate = parseISODate(start);
  const endDate = parseISODate(end);
  endDate.setHours(23, 59, 59, 999);
  
  return records.filter(r => {
    const recordDate = parseISODate(r.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

export function calculateRevenueTotals(
  revenue: RevenueRecord[], 
  period: { start: string; end: string }
): { internship: number; service: number; total: number; confirmed: number; refunded: number } {
  const inPeriod = filterByPeriod(revenue, period.start, period.end);
  
  const confirmed = inPeriod.filter(r => r.status === 'confirmed');
  const refunded = inPeriod.filter(r => r.status === 'refunded');
  
  const internship = confirmed.filter(r => r.source === 'internship').reduce((sum, r) => sum + r.amount, 0);
  const service = confirmed.filter(r => r.source === 'service').reduce((sum, r) => sum + r.amount, 0);
  const total = confirmed.reduce((sum, r) => sum + r.amount, 0);
  const refundedAmount = refunded.reduce((sum, r) => sum + r.amount, 0);
  
  return { internship, service, total, confirmed: total, refunded: refundedAmount };
}

export function calculateExpenseTotals(
  expenses: ExpenseRecord[], 
  period: { start: string; end: string }
): { approved: number; pending: number; rejected: number; byCategory: { category: string; total: number; count: number }[] } {
  const inPeriod = filterByPeriod(expenses, period.start, period.end);
  
  const approved = inPeriod.filter(e => e.status === 'approved');
  const pending = inPeriod.filter(e => e.status === 'pending_review');
  const rejected = inPeriod.filter(e => e.status === 'rejected');
  
  const approvedTotal = approved.reduce((sum, e) => sum + e.amount, 0);
  const pendingTotal = pending.reduce((sum, e) => sum + e.amount, 0);
  const rejectedTotal = rejected.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryMap = new Map<string, { total: number; count: number }>();
  approved.forEach(e => {
    const existing = categoryMap.get(e.category) || { total: 0, count: 0 };
    existing.total += e.amount;
    existing.count += 1;
    categoryMap.set(e.category, existing);
  });
  
  const byCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count,
  })).sort((a, b) => b.total - a.total);
  
  return { approved: approvedTotal, pending: pendingTotal, rejected: rejectedTotal, byCategory };
}

export function calculateProfit(
  revenue: RevenueRecord[], 
  expenses: ExpenseRecord[], 
  period: { start: string; end: string; label: string }
): ProfitReportData {
  const { internship, service, total, refunded } = calculateRevenueTotals(revenue, period);
  const { approved, pending, rejected, byCategory } = calculateExpenseTotals(expenses, period);
  
  const revenueInPeriod = filterByPeriod(revenue.filter(r => r.status === 'confirmed'), period.start, period.end);
  const expensesInPeriod = filterByPeriod(expenses.filter(e => e.status === 'approved'), period.start, period.end);
  
  const revenueBreakdown = [
    { source: 'Internship Revenue', total: internship, count: revenueInPeriod.filter(r => r.source === 'internship').length },
    { source: 'Service Revenue', total: service, count: revenueInPeriod.filter(r => r.source === 'service').length },
  ];
  
  return {
    period: { label: period.label, start: period.start, end: period.end },
    internshipRevenue: internship,
    serviceRevenue: service,
    totalRevenue: total,
    approvedExpenses: approved,
    netProfit: total - approved,
    expenseBreakdown: byCategory,
    revenueBreakdown,
    transactionCounts: {
      revenue: revenueInPeriod.length,
      expenses: expensesInPeriod.length,
    },
    pendingExpenses: pending,
    rejectedExpenses: rejected,
    refundedRevenue: refunded,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(1)}Cr`;
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(1)}L`;
  if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(1)}K`;
  return `₹${amount}`;
}

export { DATE_PRESETS } from './financeTypes';