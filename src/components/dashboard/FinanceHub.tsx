import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  FileSpreadsheet,
  BarChart2,
  Plus,
  Download,
  Calendar,
  ChevronDown,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { FinanceOverview } from './FinanceOverview';
import { RevenueTab } from './RevenueTab';
import { ExpensesTab } from './ExpensesTab';
import { ProfitReportTab } from './ProfitReportTab';
import type { RevenueRecord, ExpenseRecord, DatePreset } from '@/lib/financeTypes';
import { getPeriodBounds, getPeriodLabel } from '@/lib/financeCalculations';
import { DATE_PRESETS } from '@/lib/financeTypes';
import { migrateHistoricalData, getMigrationStatus, setMigrationStatus } from '@/lib/financeMigration';
import { toast } from 'sonner';

type FinanceSubTab = 'overview' | 'revenue' | 'expenses' | 'profit';
type RevenueViewMode = 'all' | 'client-payments';

interface FinanceHubProps {
  revenueList: RevenueRecord[];
  setRevenueList: React.Dispatch<React.SetStateAction<RevenueRecord[]>>;
  expenseList: ExpenseRecord[];
  setExpenseList: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  students: any[];
  crmClients: any[];
  paymentsList: any[];
  expensesList: any[];
  currentUserEmail: string;
  initialSubTab?: FinanceSubTab;
  initialRevenueView?: RevenueViewMode;
}

export function FinanceHub({
  revenueList,
  setRevenueList,
  expenseList,
  setExpenseList,
  students,
  crmClients,
  paymentsList,
  expensesList,
  currentUserEmail,
  initialSubTab = 'overview',
  initialRevenueView = 'all',
}: FinanceHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>(initialSubTab);
  const [revenueViewMode, setRevenueViewMode] = useState<'all' | 'client-payments'>(initialRevenueView);
  const [datePreset, setDatePreset] = useState<DatePreset>('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);

  const period = useMemo(() => {
    if (datePreset === 'custom') {
      return { start: customStart, end: customEnd, label: getPeriodLabel('custom', customStart, customEnd) };
    }
    const bounds = getPeriodBounds(datePreset);
    return { ...bounds, label: getPeriodLabel(datePreset) };
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    if (!migrationDone && !getMigrationStatus()) {
      migrateHistoricalData(paymentsList, students, crmClients, expensesList, currentUserEmail)
        .then(result => {
          setRevenueList(result.revenue);
          setExpenseList(result.expenses);
          setMigrationStatus();
          setMigrationDone(true);
          toast.success('Historical finance data imported successfully');
        });
    } else {
      setMigrationDone(true);
    }
  }, []);

  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== 'custom') {
      setShowCustomPicker(false);
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
    setDatePreset('custom');
  };

  const subTabs: { id: FinanceSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { id: 'revenue', label: 'Revenue', icon: <Wallet size={16} /> },
    { id: 'expenses', label: 'Expenses', icon: <FileSpreadsheet size={16} /> },
    { id: 'profit', label: 'Profit Report', icon: <BarChart2 size={16} /> },
  ];

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <FinanceOverview
            revenueList={revenueList}
            expenseList={expenseList}
            period={period}
            students={students}
            crmClients={crmClients}
          />
        );
      case 'revenue':
        return (
          <RevenueTab
            revenueList={revenueList}
            setRevenueList={setRevenueList}
            period={period}
            students={students}
            crmClients={crmClients}
            currentUserEmail={currentUserEmail}
            initialViewMode={revenueViewMode}
            onViewModeChange={setRevenueViewMode}
          />
        );
      case 'expenses':
        return (
          <ExpensesTab
            expenseList={expenseList}
            setExpenseList={setExpenseList}
            period={period}
            currentUserEmail={currentUserEmail}
          />
        );
      case 'profit':
        return (
          <ProfitReportTab
            revenueList={revenueList}
            expenseList={expenseList}
            period={period}
          />
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#000000] text-white">
              <TrendingUp size={18} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Finance Hub
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Unified revenue tracking, expense management, and profit analysis
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="text-slate-500" size={14} />
          <span className="text-xs font-semibold text-slate-600">Period:</span>
          
          <div className="flex items-center gap-1">
            {DATE_PRESETS.map(preset => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleDatePresetChange(preset.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                  datePreset === preset.value
                    ? 'bg-[#000000] text-white shadow-xs'
                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {showCustomPicker && datePreset === 'custom' && (
          <div className="flex items-center gap-2 ml-2 border-l border-[#E2E8F0] pl-3">
            <input
              type="date"
              value={customStart}
              onChange={e => handleCustomDateChange(e.target.value, customEnd)}
              className="px-2 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:border-black"
              max={customEnd || undefined}
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={e => handleCustomDateChange(customStart, e.target.value)}
              className="px-2 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:border-black"
              min={customStart || undefined}
            />
            <button
              type="button"
              onClick={() => setShowCustomPicker(false)}
              className="p-1 text-slate-500 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4">
          <span className="text-xs text-[#64748B] font-medium">{period.label}</span>
          <button
            type="button"
            onClick={() => setShowCustomPicker(true)}
            className="px-2 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <Calendar size={12} />
            <span>Custom</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === tab.id
                ? 'bg-[#000000] text-white shadow-xs'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}