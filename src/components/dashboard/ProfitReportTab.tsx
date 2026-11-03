import React, { useMemo } from 'react';
import {
  Download,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownRight,
} from 'lucide-react';
import type { RevenueRecord, ExpenseRecord } from '@/lib/financeTypes';
import { calculateProfit, formatCurrency, getPeriodBounds, getPeriodLabel } from '@/lib/financeCalculations';
import { DATE_PRESETS } from '@/lib/financeTypes';
import { generateProfitReport, downloadBlob } from '@/lib/financeReports';
import { toast } from 'sonner';

interface ProfitReportTabProps {
  revenueList: RevenueRecord[];
  expenseList: ExpenseRecord[];
  period: { start: string; end: string; label: string };
}

export function ProfitReportTab({
  revenueList,
  expenseList,
  period,
}: ProfitReportTabProps) {
  const profitData = useMemo(() => calculateProfit(revenueList, expenseList, period), [revenueList, expenseList, period]);

  const handleExport = async () => {
    try {
      const { pdfBlob, csvBlob } = await generateProfitReport(profitData);
      downloadBlob(pdfBlob, `profit-report-${period.start}-to-${period.end}.pdf`);
      downloadBlob(csvBlob, `profit-report-${period.start}-to-${period.end}.csv`);
      toast.success('Profit report downloaded');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to generate report');
    }
  };

  const formatNumber = (num: number) => formatCurrency(num);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Internship Revenue</span>
            <Wallet className="text-emerald-600" size={16} />
          </div>
          <div className="text-3xl font-black text-emerald-700">{formatNumber(profitData.internshipRevenue)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Service Revenue</span>
            <TrendingUp className="text-blue-600" size={16} />
          </div>
          <div className="text-3xl font-black text-blue-700">{formatNumber(profitData.serviceRevenue)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Revenue</span>
            <TrendingUp className="text-[#0066FF]" size={16} />
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{formatNumber(profitData.totalRevenue)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Approved Expenses</span>
            <FileSpreadsheet className="text-red-600" size={16} />
          </div>
          <div className="text-3xl font-black text-red-700">{formatNumber(profitData.approvedExpenses)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Net Profit / Loss</span>
            {profitData.netProfit >= 0 ? (
              <TrendingUp className="text-emerald-600" size={16} />
            ) : (
              <TrendingDown className="text-red-600" size={16} />
            )}
          </div>
          <div className={`text-3xl font-black ${profitData.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {profitData.netProfit >= 0 ? '+' : ''}{formatNumber(profitData.netProfit)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-[#0F172A]">Expense Breakdown (Approved)</h3>
          <div className="space-y-3">
            {profitData.expenseBreakdown.length > 0 ? (
              profitData.expenseBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0F172A]">{cat.category}</span>
                    <span className="font-bold text-[#0F172A]">{formatNumber(cat.total)}</span>
                  </div>
                  <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-600 rounded-full transition-all duration-500"
                      style={{ width: profitData.approvedExpenses > 0 ? `${(cat.total / profitData.approvedExpenses) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>{cat.count} transactions</span>
                    <span>{profitData.approvedExpenses > 0 ? `${((cat.total / profitData.approvedExpenses) * 100).toFixed(1)}%` : '0%'} of expenses</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#64748B] text-center py-4">No approved expenses in this period</p>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-[#0F172A]">Revenue Breakdown (Confirmed)</h3>
          <div className="space-y-3">
            {profitData.revenueBreakdown.map((rev, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#0F172A]">{rev.source}</span>
                  <span className="font-bold text-[#0F172A]">{formatNumber(rev.total)}</span>
                </div>
                <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: profitData.totalRevenue > 0 ? `${(rev.total / profitData.totalRevenue) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#64748B]">
                  <span>{rev.count} transactions</span>
                  <span>{profitData.totalRevenue > 0 ? `${((rev.total / profitData.totalRevenue) * 100).toFixed(1)}%` : '0%'} of revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Revenue Transactions</span>
          <div className="text-2xl font-black text-[#0F172A]">{profitData.transactionCounts.revenue}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Expense Transactions</span>
          <div className="text-2xl font-black text-[#0F172A]">{profitData.transactionCounts.expenses}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Period</span>
          <div className="text-sm font-bold text-[#0F172A]">{period.label}</div>
        </div>
      </div>

      {(profitData.pendingExpenses > 0 || profitData.rejectedExpenses > 0 || profitData.refundedRevenue > 0) && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={18} />
            <h3 className="font-bold text-sm text-amber-900">Excluded from Profit Calculation</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {profitData.pendingExpenses > 0 && (
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Clock size={14} />
                  <span className="font-medium">Pending Expenses</span>
                </div>
                <div className="font-bold text-amber-900 mt-1">{formatNumber(profitData.pendingExpenses)}</div>
              </div>
            )}
            {profitData.rejectedExpenses > 0 && (
              <div className="p-3 bg-white rounded-xl border border-red-200">
                <div className="flex items-center gap-1.5 text-red-700">
                  <XCircle size={14} />
                  <span className="font-medium">Rejected Expenses</span>
                </div>
                <div className="font-bold text-red-900 mt-1">{formatNumber(profitData.rejectedExpenses)}</div>
              </div>
            )}
            {profitData.refundedRevenue > 0 && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ArrowDownRight size={14} />
                  <span className="font-medium">Refunded Revenue</span>
                </div>
                <div className="font-bold text-slate-900 mt-1">{formatNumber(profitData.refundedRevenue)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-[#0F172A]">Profit Calculation Summary</h3>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 bg-[#000000] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export Report (PDF + CSV)</span>
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Total Confirmed Revenue</span>
            <span className="font-bold text-[#0F172A]">{formatNumber(profitData.totalRevenue)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#F1F5F9] text-emerald-700">
            <span>├─ Internship Revenue</span>
            <span className="font-bold">{formatNumber(profitData.internshipRevenue)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#F1F5F9] text-blue-700">
            <span>└─ Service Revenue</span>
            <span className="font-bold">{formatNumber(profitData.serviceRevenue)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#F1F5F9] text-red-700">
            <span>Less: Approved Expenses</span>
            <span className="font-bold">({formatNumber(profitData.approvedExpenses)})</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
            {profitData.refundedRevenue > 0 && (
              <>
                <span className="text-slate-700">Less: Refunded Revenue</span>
                <span className="font-bold text-slate-700">({formatNumber(profitData.refundedRevenue)})</span>
              </>
            )}
          </div>
          <div className={`flex justify-between py-3 text-lg ${profitData.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            <span className="font-black">Net Profit / (Loss)</span>
            <span className="font-black">{profitData.netProfit >= 0 ? '+' : ''}{formatNumber(profitData.netProfit)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B]">
            Calculation: Net Profit = Confirmed Revenue Received − Approved Expenses
            {profitData.refundedRevenue > 0 ? ' − Refunded Revenue' : ''}
            . Pending/Rejected expenses and unpaid revenue are excluded.
          </p>
        </div>
      </div>
    </div>
  );
}