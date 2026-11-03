import type { RevenueRecord, ExpenseRecord } from './financeTypes';
import { parseCurrencyNumber } from './certificateStore';

export interface MigrationResult {
  revenue: RevenueRecord[];
  expenses: ExpenseRecord[];
}

export async function migrateHistoricalData(
  paymentsList: any[],
  students: any[],
  crmClients: any[],
  expensesList: any[],
  currentUserEmail: string
): Promise<MigrationResult> {
  const now = Date.now();
  const revenue: RevenueRecord[] = [];
  const expenses: ExpenseRecord[] = [];

  let revenueCounter = 1;
  let expenseCounter = 1;

  paymentsList.forEach(p => {
    if (p.status === 'Verified' || p.status === 'Cleared') {
      const amount = parseCurrencyNumber(p.amount);
      if (amount > 0) {
        const isInstitutional = p.payer?.includes('Institutional') || false;
        const isClient = !isInstitutional && p.payer?.includes('Arrox') || false;
        
        revenue.push({
          id: `REV-${new Date().getFullYear()}-${String(revenueCounter++).padStart(4, '0')}`,
          date: p.date || new Date().toISOString().split('T')[0],
          source: isInstitutional ? 'internship' : 'service',
          referenceId: isInstitutional ? 'institutional-cohort' : 'clt-arx-001',
          payer: p.payer,
          amount,
          method: p.method,
          status: 'confirmed',
          txnRef: p.id,
          notes: `Migrated from payment ledger: ${p.type}`,
          createdBy: currentUserEmail,
          createdAt: now,
        });
      }
    }
  });

  students.forEach(s => {
    const paid = parseCurrencyNumber(s.feePaid);
    if (paid > 0) {
      revenue.push({
        id: `REV-${new Date().getFullYear()}-${String(revenueCounter++).padStart(4, '0')}`,
        date: s.issueDate || new Date().toISOString().split('T')[0],
        source: 'internship',
        referenceId: s.id,
        payer: s.name,
        amount: paid,
        method: 'Student Fee Collection',
        status: 'confirmed',
        txnRef: s.certId || `FEE-${s.id}`,
        notes: `Migrated from student fee: ${s.domain || 'Internship'}`,
        createdBy: currentUserEmail,
        createdAt: now,
      });
    }
  });

  crmClients.forEach(c => {
    const received = c.receivedAmount || parseCurrencyNumber(c.amountPaid);
    if (received > 0) {
      revenue.push({
        id: `REV-${new Date().getFullYear()}-${String(revenueCounter++).padStart(4, '0')}`,
        date: new Date().toISOString().split('T')[0],
        source: 'service',
        referenceId: c.id,
        payer: c.name,
        amount: received,
        method: 'Client Payment',
        status: 'confirmed',
        txnRef: `CLT-${c.id}`,
        notes: `Migrated from client: ${c.project}`,
        createdBy: currentUserEmail,
        createdAt: now,
      });
    }
  });

  expensesList.forEach(e => {
    const amount = e.numericAmount || parseCurrencyNumber(e.amount);
    if (amount > 0) {
      expenses.push({
        id: `EXP-${new Date().getFullYear()}-${String(expenseCounter++).padStart(4, '0')}`,
        title: e.title,
        category: e.category,
        description: e.title,
        date: e.date,
        amount,
        status: 'approved',
        proofUrl: '',
        proofName: 'Migrated - No proof available',
        proofType: 'application/pdf',
        vendor: e.vendor,
        txnRef: e.id,
        submittedBy: currentUserEmail,
        submittedAt: now,
        approvedBy: currentUserEmail,
        approvedAt: now,
      });
    }
  });

  return { revenue, expenses };
}

export function getMigrationStatus(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('finance_migrated') === 'true';
}

export function setMigrationStatus() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('finance_migrated', 'true');
}