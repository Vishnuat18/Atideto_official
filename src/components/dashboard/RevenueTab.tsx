import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  X,
  Plus,
  Download,
  ChevronDown,
  ExternalLink,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
} from 'lucide-react';
import type { RevenueRecord } from '@/lib/financeTypes';
import { formatCurrency, DATE_PRESETS } from '@/lib/financeCalculations';
import { REVENUE_SOURCES, REVENUE_STATUS_OPTIONS } from '@/lib/financeTypes';
import { generateRevenueReport, downloadBlob } from '@/lib/financeReports';
import { toast } from 'sonner';

interface RevenueTabProps {
  revenueList: RevenueRecord[];
  setRevenueList: React.Dispatch<React.SetStateAction<RevenueRecord[]>>;
  period: { start: string; end: string; label: string };
  students: any[];
  crmClients: any[];
  currentUserEmail: string;
  initialViewMode?: 'all' | 'client-payments';
  onViewModeChange?: (mode: 'all' | 'client-payments') => void;
}

export function RevenueTab({
  revenueList,
  setRevenueList,
  period,
  students,
  crmClients,
  currentUserEmail,
  initialViewMode = 'all',
  onViewModeChange,
}: RevenueTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'client-payments'>(initialViewMode);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RevenueRecord | null>(null);
  const [formData, setFormData] = useState({
    id: `REV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    source: 'internship' as 'internship' | 'service',
    referenceId: '',
    payer: '',
    amount: '',
    method: 'Wire Transfer',
    status: 'confirmed' as 'confirmed' | 'pending' | 'failed' | 'refunded',
    txnRef: '',
    notes: '',
  });

  // Sync view mode with parent
  useEffect(() => {
    if (onViewModeChange) {
      onViewModeChange(viewMode);
    }
  }, [viewMode, onViewModeChange]);

  // Sync CRM client payments to revenue records
  const syncClientPayments = useCallback(() => {
    const now = Date.now();
    const newRevenue: RevenueRecord[] = [];
    
    crmClients.forEach(client => {
      const received = client.receivedAmount || 0;
      if (received > 0) {
        // Check if revenue record already exists for this client
        const existing = revenueList.find(r => 
          r.source === 'service' && 
          r.referenceId === client.id && 
          Math.abs(r.amount - received) < 1
        );
        
        if (!existing) {
          newRevenue.push({
            id: `REV-${new Date().getFullYear()}-${String(revenueList.length + newRevenue.length + 1).padStart(4, '0')}`,
            date: new Date().toISOString().split('T')[0],
            source: 'service',
            referenceId: client.id,
            payer: client.name,
            amount: received,
            method: 'Client Payment',
            status: 'confirmed',
            txnRef: `CLT-${client.id}`,
            notes: `Auto-synced from client: ${client.project}`,
            createdBy: currentUserEmail,
            createdAt: now,
          });
        }
      }
    });
    
    if (newRevenue.length > 0) {
      setRevenueList(prev => [...newRevenue, ...prev]);
    }
    return newRevenue.length;
  }, [crmClients, revenueList, setRevenueList, currentUserEmail]);

  // Auto-sync on mount and when crmClients change
  useEffect(() => {
    syncClientPayments();
  }, [syncClientPayments]);

  const filteredRevenue = useMemo(() => {
    let result = revenueList.filter(r => {
      const matchesSearch = !searchQuery || 
        r.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.txnRef?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = sourceFilter === 'all' || r.source === sourceFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      
      return matchesSearch && matchesSource && matchesStatus;
    });

    // Client payments view: show service revenue with client context
    if (viewMode === 'client-payments') {
      result = result.filter(r => r.source === 'service');
    }

    return result;
  }, [revenueList, searchQuery, sourceFilter, statusFilter, viewMode]);

  const revenueTotals = useMemo(() => {
    const confirmed = filteredRevenue.filter(r => r.status === 'confirmed');
    return {
      total: confirmed.reduce((sum, r) => sum + r.amount, 0),
      count: confirmed.length,
      internship: confirmed.filter(r => r.source === 'internship').reduce((sum, r) => sum + r.amount, 0),
      service: confirmed.filter(r => r.source === 'service').reduce((sum, r) => sum + r.amount, 0),
    };
  }, [filteredRevenue]);

  const internshipOptions = useMemo(() => [
    { value: '', label: 'Select Student / Batch' },
    ...students.map(s => ({
      value: s.id,
      label: `${s.name} (${s.id}) - ${s.domain || 'Internship'} - ${s.feePaid || '₹0'}`,
    })),
  ], [students]);

  const clientOptions = useMemo(() => [
    { value: '', label: 'Select Client / Project' },
    ...crmClients.map(c => ({
      value: c.id,
      label: `${c.name} - ${c.project} - Quoted: ₹${c.quotationAmount?.toLocaleString() || '0'} / Received: ₹${c.receivedAmount?.toLocaleString() || '0'}`,
    })),
  ], [crmClients]);

  const handleOpenAdd = () => {
    const isClientView = viewMode === 'client-payments';
    setFormData({
      id: `REV-${new Date().getFullYear()}-${String(revenueList.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      source: isClientView ? 'service' : 'internship',
      referenceId: '',
      payer: '',
      amount: '',
      method: isClientView ? 'Client Payment' : 'Wire Transfer',
      status: 'confirmed',
      txnRef: '',
      notes: '',
    });
    setEditingRevenue(null);
    setShowAddDrawer(true);
  };

  const handleEdit = (rev: RevenueRecord) => {
    setFormData({
      id: rev.id,
      date: rev.date,
      source: rev.source,
      referenceId: rev.referenceId || '',
      payer: rev.payer,
      amount: rev.amount.toString(),
      method: rev.method,
      status: rev.status,
      txnRef: rev.txnRef || '',
      notes: rev.notes || '',
    });
    setEditingRevenue(rev);
    setShowAddDrawer(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount) || 0;
    
    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    if (!formData.payer.trim()) {
      toast.error('Payer name is required');
      return;
    }

    const newRevenue: RevenueRecord = {
      ...formData,
      amount,
      createdBy: currentUserEmail,
      createdAt: Date.now(),
    } as RevenueRecord;

    if (editingRevenue) {
      setRevenueList(prev => prev.map(r => r.id === editingRevenue.id ? newRevenue : r));
      toast.success(`Revenue ${newRevenue.id} updated`);
    } else {
      setRevenueList(prev => [newRevenue, ...prev]);
      toast.success(`Revenue ${newRevenue.id} recorded`);
    }
    
    setShowAddDrawer(false);
    setEditingRevenue(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this revenue record?')) {
      setRevenueList(prev => prev.filter(r => r.id !== id));
      toast.success('Revenue record deleted');
    }
  };

  const handleStatusChange = (id: string, newStatus: RevenueRecord['status']) => {
    setRevenueList(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleExport = async () => {
    try {
      const { pdfBlob, csvBlob } = await generateRevenueReport(revenueList, {
        source: sourceFilter === 'all' ? undefined : sourceFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        start: period.start,
        end: period.end,
      });
      downloadBlob(pdfBlob, `revenue-report-${period.start}-to-${period.end}.pdf`);
      downloadBlob(csvBlob, `revenue-report-${period.start}-to-${period.end}.csv`);
      toast.success('Revenue report downloaded');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search revenue records..."
              className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 p-0.5">
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer"
          >
            <option value="all">All Sources</option>
            {REVENUE_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {REVENUE_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

{(searchQuery || sourceFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSourceFilter('all'); setStatusFilter('all'); }}
              className="px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4 ml-2">
            <span className="text-xs text-[#64748B] font-medium">View:</span>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'all'
                  ? 'bg-[#000000] text-white shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              All Revenue
            </button>
            <button
              type="button"
              onClick={() => { setViewMode('client-payments'); setSourceFilter('service'); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'client-payments'
                  ? 'bg-[#000000] text-white shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <Building2 size={12} className="inline" />
              Client Payments
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[12.5px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
          <span>Showing <b>{filteredRevenue.length}</b> of <b>{revenueList.length}</b> records | Confirmed: <b>{formatCurrency(revenueTotals.total)}</b></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Confirmed</span>
          <div className="text-2xl font-black text-[#0F172A]">{formatCurrency(revenueTotals.total)}</div>
          <p className="text-[12.5px] text-[#64748B]">{revenueTotals.count} transactions</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Internship Revenue</span>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(revenueTotals.internship)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Service Revenue</span>
          <div className="text-2xl font-black text-blue-700">{formatCurrency(revenueTotals.service)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Pending / Failed</span>
          <div className="text-2xl font-black text-amber-700">
            {formatCurrency(filteredRevenue.filter(r => r.status === 'pending' || r.status === 'failed').reduce((s, r) => s + r.amount, 0))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[12.5px] uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Payer</th>
                {viewMode === 'client-payments' ? (
                  <>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Quoted</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4">Balance</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4">Reference</th>
                  </>
                )}
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredRevenue.length === 0 ? (
                <tr>
                  <td colSpan={viewMode === 'client-payments' ? 12 : 10} className="py-10 text-center text-[#64748B]">
                    <p className="font-bold text-sm text-[#0F172A]">No revenue records match your filters</p>
                  </td>
                </tr>
              ) : (
                filteredRevenue.map((rev, idx) => {
                  const client = crmClients.find(c => c.id === rev.referenceId);
                  return (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{rev.date}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{rev.id}</td>
                      <td className="py-3.5 px-4">
                        <span className={`border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded text-[11.5px] font-bold tracking-wider uppercase inline-block`}>
                          {rev.source === 'internship' ? 'Internship' : 'Service'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0F172A]">{rev.payer}</td>
                      {viewMode === 'client-payments' ? (
                        <>
                          <td className="py-3.5 px-4 text-slate-700">{client?.project || rev.referenceId || '-'}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">{client?.quotationAmount ? formatCurrency(client.quotationAmount) : '-'}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-700">{client?.receivedAmount ? formatCurrency(client.receivedAmount) : formatCurrency(rev.amount)}</td>
                          <td className="py-3.5 px-4 font-bold text-red-700">
                            {client && client.quotationAmount && client.receivedAmount !== undefined
                              ? formatCurrency(Math.max(0, client.quotationAmount - client.receivedAmount))
                              : '-'}
                          </td>
                        </>
                      ) : (
                        <td className="py-3.5 px-4 text-slate-600">{rev.referenceId || '-'}</td>
                      )}
                      <td className="py-3.5 px-4 font-bold text-sm text-emerald-700">+{formatCurrency(rev.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-600">{rev.method}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={rev.status}
                          onChange={e => handleStatusChange(rev.id, e.target.value as RevenueRecord['status'])}
                          className={`px-2 py-0.5 rounded text-[11.5px] font-bold border ${
                            REVENUE_STATUS_OPTIONS.find(o => o.value === rev.status)?.color
                          }`}
                        >
                          {REVENUE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rev.txnRef || '-'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(rev)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rev.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-0">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-bold text-sm text-[#0F172A]">{editingRevenue ? 'Edit Revenue' : 'Add Revenue'}</h3>
              <button
                type="button"
                onClick={() => { setShowAddDrawer(false); setEditingRevenue(null); }}
                className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-slate-500 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Revenue ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-mono text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Source *</label>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value as 'internship' | 'service', referenceId: '', payer: '' })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="internship">Internship Revenue</option>
                  <option value="service">Service Revenue</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">
                  {formData.source === 'internship' ? 'Student / Batch' : 'Client / Project'} *
                </label>
                <select
                  value={formData.referenceId}
                  onChange={e => {
                    const val = e.target.value;
                    const selected = formData.source === 'internship' 
                      ? students.find(s => s.id === val)
                      : crmClients.find(c => c.id === val);
                    const updates: typeof formData = { 
                      ...formData, 
                      referenceId: val,
                      payer: selected ? selected.name : '',
                    };
                    // Auto-fill for client selection
                    if (formData.source === 'service' && selected) {
                      updates.amount = selected.receivedAmount?.toString() || '';
                      updates.notes = `Client: ${selected.name} - Project: ${selected.project}`;
                    }
                    if (formData.source === 'internship' && selected) {
                      updates.amount = selected.feePaid?.replace(/[^0-9]/g, '') || '';
                      updates.notes = `Student: ${selected.name} - Batch: ${selected.id}`;
                    }
                    setFormData(updates);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="">Select {formData.source === 'internship' ? 'Student/Batch' : 'Client/Project'}</option>
                  {formData.source === 'internship' ? internshipOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>) : clientOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Payer *</label>
                  <input
                    type="text"
                    required
                    value={formData.payer}
                    onChange={e => setFormData({ ...formData, payer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-emerald-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Payment Method</label>
                  <select
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Direct Bank">Direct Bank</option>
                    <option value="UPI / Razorpay">UPI / Razorpay</option>
                    <option value="Institutional NEFT">Institutional NEFT</option>
                    <option value="Corporate Cheque">Corporate Cheque</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as RevenueRecord['status'] })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  >
                    {REVENUE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Transaction Reference</label>
                <input
                  type="text"
                  value={formData.txnRef}
                  onChange={e => setFormData({ ...formData, txnRef: e.target.value })}
                  placeholder="Optional: Bank ref, UPI ID, etc."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#0066FF] resize-none"
                />
              </div>

              <div className="pt-4 flex items-center gap-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => { setShowAddDrawer(false); setEditingRevenue(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{editingRevenue ? 'Update Revenue' : 'Record Revenue'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}