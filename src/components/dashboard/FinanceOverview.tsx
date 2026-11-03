import React, { useMemo } from 'react';
import {
  Wallet,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ExternalLink,
} from 'lucide-react';
import type { RevenueRecord, ExpenseRecord } from '@/lib/financeTypes';
import { calculateRevenueTotals, calculateExpenseTotals, formatCurrency, formatCurrencyCompact, getPeriodLabel } from '@/lib/financeCalculations';

interface FinanceOverviewProps {
  revenueList: RevenueRecord[];
  expenseList: ExpenseRecord[];
  period: { start: string; end: string; label: string };
  students: any[];
  crmClients: any[];
}

export function FinanceOverview({
  revenueList,
  expenseList,
  period,
  students,
  crmClients,
}: FinanceOverviewProps) {
  const revenueTotals = useMemo(() => calculateRevenueTotals(revenueList, period), [revenueList, period]);
  const expenseTotals = useMemo(() => calculateExpenseTotals(expenseList, period), [expenseList, period]);
  const netProfit = revenueTotals.total - expenseTotals.approved;
  const profitMargin = revenueTotals.total > 0 ? ((netProfit / revenueTotals.total) * 100).toFixed(1) : '0.0';

  const recentTransactions = useMemo(() => {
    const confirmedRevenue = revenueList
      .filter(r => r.status === 'confirmed')
      .map(r => ({
        ...r,
        type: 'revenue' as const,
        displayDate: r.date,
      }));
    
    const approvedExpenses = expenseList
      .filter(e => e.status === 'approved')
      .map(e => ({
        ...e,
        type: 'expense' as const,
        displayDate: e.date,
        payer: e.vendor || e.title,
      }));

    return [...confirmedRevenue, ...approvedExpenses]
      .sort((a, b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime())
      .slice(0, 10);
  }, [revenueList, expenseList]);

  const studentFeeCollected = useMemo(() => {
    return students.reduce((sum, s) => sum + (parseFloat(String(s.feePaid || '0').replace(/[^0-9.]/g, '')) || 0), 0);
  }, [students]);

  const clientRevenueReceived = useMemo(() => {
    return crmClients.reduce((sum, c) => sum + (c.receivedAmount || 0), 0);
  }, [crmClients]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-100">
              <Wallet className="text-emerald-600" size={14} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{formatCurrency(revenueTotals.total)}</div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <span>Confirmed: {formatCurrency(revenueTotals.confirmed)}</span>
            {revenueTotals.refunded > 0 && (
              <span className="text-red-600">Refunded: {formatCurrency(revenueTotals.refunded)}</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Expenses</span>
            <div className="p-1.5 rounded-lg bg-red-100">
              <FileSpreadsheet className="text-red-600" size={14} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{formatCurrency(expenseTotals.approved)}</div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <span>Approved: {formatCurrency(expenseTotals.approved)}</span>
            {expenseTotals.pending > 0 && (
              <span className="text-amber-600">Pending: {formatCurrency(expenseTotals.pending)}</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Net Profit</span>
            <div className={`p-1.5 rounded-lg ${netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {netProfit >= 0 ? (
                <TrendingUp className="text-emerald-600" size={14} />
              ) : (
                <TrendingDown className="text-red-600" size={14} />
              )}
            </div>
          </div>
          <div className={`text-3xl font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <span>Margin: {profitMargin}%</span>
            <span>Period: {period.label}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Collection Rate</span>
            <div className="p-1.5 rounded-lg bg-blue-100">
              <TrendingUp className="text-blue-600" size={14} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A]">
            {revenueTotals.total > 0 
              ? `${((revenueTotals.confirmed / (revenueTotals.confirmed + expenseTotals.approved)) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="text-[12.5px] text-[#64748B]">
            {revenueTotals.confirmed + expenseTotals.approved} transactions
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A]">Revenue by Source</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#64748B]">Internship Revenue</span>
                <span className="font-bold text-[#0F172A]">{formatCurrency(revenueTotals.internship)}</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: revenueTotals.total > 0 ? `${(revenueTotals.internship / revenueTotals.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#64748B]">Service Revenue</span>
                <span className="font-bold text-[#0F172A]">{formatCurrency(revenueTotals.service)}</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: revenueTotals.total > 0 ? `${(revenueTotals.service / revenueTotals.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A]">Expenses by Category</h3>
          </div>
          <div className="space-y-2">
            {expenseTotals.byCategory.length > 0 ? (
              expenseTotals.byCategory.slice(0, 5).map(cat => (
                <div key={cat.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#64748B] truncate pr-2">{cat.category}</span>
                    <span className="font-bold text-[#0F172A]">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-600 rounded-full transition-all duration-500"
                      style={{ width: expenseTotals.approved > 0 ? `${(cat.total / expenseTotals.approved) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748B] text-center py-4">No approved expenses in this period</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-sm text-[#0F172A]">Recent Transactions</h3>
          <span className="text-xs text-[#64748B]">{recentTransactions.length} most recent</span>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-[#64748B]">
            <Clock className="mx-auto text-3xl mb-2 opacity-50" />
            <p className="font-medium">No transactions in this period</p>
            <p className="text-xs mt-1">Add revenue or expenses to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[12.5px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Source / Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3 px-4 font-mono text-slate-500">{tx.displayDate}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11.5px] font-bold ${
                        tx.type === 'revenue' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {tx.type === 'revenue' ? (
                          <>
                            <ArrowUpRight size={10} />
                            Revenue
                          </>
                        ) : (
                          <>
                            <ArrowDownRight size={10} />
                            Expense
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">{tx.payer}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {tx.type === 'revenue' 
                        ? (tx.source === 'internship' ? 'Internship' : 'Service')
                        : tx.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-sm">
                      {tx.type === 'revenue' 
                        ? <span className="text-emerald-700">+{formatCurrency(tx.amount)}</span>
                        : <span className="text-red-700">-{formatCurrency(tx.amount)}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tx.method || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11.5px] font-bold ${
                        tx.status === 'confirmed' || tx.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : tx.status === 'pending_review'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {tx.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function parseCurrencyNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}