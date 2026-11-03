import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { ExpenseRecord, ExpenseCategory } from '@/lib/financeTypes';
import { formatCurrency } from '@/lib/financeCalculations';
import { EXPENSE_CATEGORIES, EXPENSE_STATUS_OPTIONS } from '@/lib/financeTypes';
import { generateExpenseReport, downloadBlob } from '@/lib/financeReports';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

interface ExpensesTabProps {
  expenseList: ExpenseRecord[];
  setExpenseList: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  period: { start: string; end: string; label: string };
  currentUserEmail: string;
}

export function ExpensesTab({
  expenseList,
  setExpenseList,
  period,
  currentUserEmail,
}: ExpensesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    id: `EXP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    title: '',
    category: 'Cloud Hosting' as ExpenseCategory,
    description: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    vendor: '',
    method: 'UPI / Direct Bank',
    status: 'pending_review' as 'pending_review' | 'approved' | 'rejected',
    txnRef: '',
    notes: '',
  });

  const filteredExpenses = useMemo(() => {
    return expenseList.filter(e => {
      const matchesSearch = !searchQuery || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [expenseList, searchQuery, statusFilter, categoryFilter]);

  const expenseTotals = useMemo(() => {
    const approved = filteredExpenses.filter(e => e.status === 'approved');
    const pending = filteredExpenses.filter(e => e.status === 'pending_review');
    const rejected = filteredExpenses.filter(e => e.status === 'rejected');
    
    return {
      approved: approved.reduce((sum, e) => sum + e.amount, 0),
      approvedCount: approved.length,
      pending: pending.reduce((sum, e) => sum + e.amount, 0),
      pendingCount: pending.length,
      rejected: rejected.reduce((sum, e) => sum + e.amount, 0),
      rejectedCount: rejected.length,
      byCategory: approved.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [filteredExpenses]);

  const handleOpenAdd = () => {
    setFormData({
      id: `EXP-${new Date().getFullYear()}-${String(expenseList.length + 1).padStart(4, '0')}`,
      title: '',
      category: 'Cloud Hosting',
      description: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      vendor: '',
      method: 'UPI / Direct Bank',
      status: 'pending_review',
      txnRef: '',
      notes: '',
    });
    setProofFile(null);
    setEditingExpense(null);
    setShowAddDrawer(true);
  };

  const handleEdit = (exp: ExpenseRecord) => {
    setFormData({
      id: exp.id,
      title: exp.title,
      category: exp.category,
      description: exp.description,
      date: exp.date,
      amount: exp.amount.toString(),
      vendor: exp.vendor || '',
      method: exp.method,
      status: exp.status,
      txnRef: exp.txnRef || '',
      notes: exp.notes || '',
    });
    setProofFile(null);
    setEditingExpense(exp);
    setShowAddDrawer(true);
  };

  const handleProofSelect = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPG, or PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setProofFile(file);
  };

  const uploadProof = async (file: File, expenseId: string): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
const storageRef = ref(storage, `finance/proofs/${expenseId}/${fileName}`);
  
  setUploading(true);
  setUploadProgress(0);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise<string>((resolve, reject) => {
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    }, (error) => {
      setUploading(false);
      reject(error);
    }, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setUploading(false);
      resolve(downloadURL);
    });
  });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount) || 0;
    
    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('Expense title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description / business purpose is required');
      return;
    }
    if (!editingExpense && !proofFile) {
      toast.error('Proof attachment is required for new expenses');
      return;
    }

    let proofUrl = editingExpense?.proofUrl || '';
    let proofName = editingExpense?.proofName || '';
    let proofType = editingExpense?.proofType || '';
    
    if (proofFile) {
      try {
        proofUrl = await uploadProof(proofFile, formData.id);
        proofName = proofFile.name;
        proofType = proofFile.type;
      } catch (err) {
        console.error('Proof upload failed:', err);
        toast.error('Failed to upload proof. Please try again.');
        return;
      }
    }

    const newExpense: ExpenseRecord = {
      ...formData,
      amount,
      proofUrl,
      proofName,
      proofType,
      submittedBy: currentUserEmail,
      submittedAt: editingExpense?.submittedAt || Date.now(),
      approvedBy: formData.status === 'approved' && !editingExpense?.approvedBy ? currentUserEmail : editingExpense?.approvedBy,
      approvedAt: formData.status === 'approved' && !editingExpense?.approvedAt ? Date.now() : editingExpense?.approvedAt,
      rejectionReason: formData.status === 'rejected' ? formData.notes : undefined,
    } as ExpenseRecord;

    if (editingExpense) {
      setExpenseList(prev => prev.map(e => e.id === editingExpense.id ? newExpense : e));
      toast.success(`Expense ${newExpense.id} updated`);
    } else {
      setExpenseList(prev => [newExpense, ...prev]);
      toast.success(`Expense ${newExpense.id} submitted for review`);
    }
    
    setShowAddDrawer(false);
    setEditingExpense(null);
    setProofFile(null);
  };

  const handleApprove = (id: string) => {
    setExpenseList(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'approved', approvedBy: currentUserEmail, approvedAt: Date.now() } : e
    ));
    toast.success('Expense approved');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    if (!reason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setExpenseList(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'rejected', rejectionReason: reason } : e
    ));
    toast.success('Expense rejected');
  };

  const handleResubmit = (id: string) => {
    setExpenseList(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'pending_review', rejectionReason: undefined } : e
    ));
    toast.success('Expense resubmitted for review');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense record?')) {
      setExpenseList(prev => prev.filter(e => e.id !== id));
      toast.success('Expense deleted');
    }
  };

  const handleExport = async () => {
    try {
      const { pdfBlob, csvBlob } = await generateExpenseReport(expenseList, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        start: period.start,
        end: period.end,
      });
      downloadBlob(pdfBlob, `expense-report-${period.start}-to-${period.end}.pdf`);
      downloadBlob(csvBlob, `expense-report-${period.start}-to-${period.end}.csv`);
      toast.success('Expense report downloaded');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to generate report');
    }
  };

  const getStatusColor = (status: string) => {
    const opt = EXPENSE_STATUS_OPTIONS.find(o => o.value === status);
    return opt?.color || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getStatusLabel = (status: string) => {
    const opt = EXPENSE_STATUS_OPTIONS.find(o => o.value === status);
    return opt?.label || status;
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
              placeholder="Search expenses..."
              className="w-full pl-9 pr-7 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-black shadow-2xs font-medium"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 p-0.5">
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {EXPENSE_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold focus:outline-none focus:border-black shadow-2xs cursor-pointer"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
              className="px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[12.5px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
          <span>Showing <b>{filteredExpenses.length}</b> of <b>{expenseList.length}</b> records</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Approved Expenses</span>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(expenseTotals.approved)}</div>
          <p className="text-[12.5px] text-[#64748B]">{expenseTotals.approvedCount} records</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Pending Review</span>
          <div className="text-2xl font-black text-amber-700">{formatCurrency(expenseTotals.pending)}</div>
          <p className="text-[12.5px] text-[#64748B]">{expenseTotals.pendingCount} records</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Rejected</span>
          <div className="text-2xl font-black text-red-700">{formatCurrency(expenseTotals.rejected)}</div>
          <p className="text-[12.5px] text-[#64748B]">{expenseTotals.rejectedCount} records</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-extrabold uppercase text-[#64748B] tracking-wider">Categories</span>
          <div className="text-2xl font-black text-[#0F172A]">{Object.keys(expenseTotals.byCategory).length}</div>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[12.5px] uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4">Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-[#64748B]">
                    <p className="font-bold text-sm text-[#0F172A]">No expense records match your filters</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{exp.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{exp.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{exp.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{exp.vendor || '-'}</td>
                    <td className="py-3.5 px-4 font-black text-sm text-red-700">-{formatCurrency(exp.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{exp.submittedBy}</td>
                    <td className="py-3.5 px-4 text-center">
                      {exp.proofUrl ? (
                        <button
                          type="button"
                          onClick={() => setViewingProof(exp.proofUrl)}
                          className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                          title="View Proof"
                        >
                          <Eye size={14} />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">No proof</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11.5px] font-bold border ${getStatusColor(exp.status)}`}>
                        {getStatusLabel(exp.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {exp.status === 'pending_review' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(exp.id)}
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                              title="Approve"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(exp.id)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
                              title="Reject"
                            >
                              <AlertTriangle size={13} />
                            </button>
                          </>
                        )}
                        {exp.status === 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleResubmit(exp.id)}
                            className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                            title="Resubmit"
                          >
                            <ArrowUpRight size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(exp)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingProof && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0F172A]">Expense Proof</h3>
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-slate-500 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              {viewingProof.endsWith('.pdf') || viewingProof.includes('application/pdf') ? (
                <iframe 
                  src={viewingProof} 
                  className="w-full h-[70vh] rounded border" 
                  title="Expense Proof"
                />
              ) : (
                <img 
                  src={viewingProof} 
                  alt="Expense Proof" 
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showAddDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-0">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-bold text-sm text-[#0F172A]">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
              <button
                type="button"
                onClick={() => { setShowAddDrawer(false); setEditingExpense(null); setProofFile(null); }}
                className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-slate-500 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Expense ID *</label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-mono text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., AWS Server Infrastructure"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  >
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Description / Business Purpose *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the business purpose of this expense"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#0066FF] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-red-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Vendor / Payee</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="e.g., Amazon Web Services"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Payment Method</label>
                  <select
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="UPI / Direct Bank">UPI / Direct Bank</option>
                    <option value="Corporate Credit Card">Corporate Credit Card</option>
                    <option value="Corporate Card">Corporate Card</option>
                    <option value="Auto-Debit">Auto-Debit</option>
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Direct Bank IMPS">Direct Bank IMPS</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Transaction Reference</label>
                <input
                  type="text"
                  value={formData.txnRef}
                  onChange={e => setFormData({ ...formData, txnRef: e.target.value })}
                  placeholder="Optional: Transaction ID, Invoice #"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">
                  Proof Attachment {editingExpense ? '(Optional - leave empty to keep existing)' : '*'}
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 transition ${proofFile ? 'border-emerald-400 bg-emerald-50' : 'border-[#CBD5E1] hover:border-[#0066FF]'}`}
                  onClick={() => document.getElementById('proof-upload')?.click()}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleProofSelect(e.dataTransfer.files[0]); }}
                >
                  <input
                    id="proof-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => e.target.files[0] && handleProofSelect(e.target.files[0])}
                    className="hidden"
                  />
                  {proofFile ? (
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <FileText className="text-emerald-600" size={20} />
                        <div>
                          <p className="font-medium text-sm text-emerald-800">{proofFile.name}</p>
                          <p className="text-xs text-emerald-600">{(proofFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setProofFile(null); }}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <FileText className="text-slate-400" size={32} />
                      <p className="text-sm text-slate-600">Click or drag to upload proof (PDF, JPG, PNG)</p>
                      <p className="text-xs text-slate-400">Max 5MB • Required for new expenses</p>
                    </div>
                  )}
                </div>
              </div>

              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Uploading proof...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#000000] rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[12.5px] font-extrabold uppercase text-[#64748B]">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as ExpenseRecord['status'] })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0066FF]"
                >
                  {EXPENSE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
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
                  onClick={() => { setShowAddDrawer(false); setEditingExpense(null); setProofFile(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-2 py-2.5 rounded-xl bg-[#000000] hover:bg-[#0066FF] text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{editingExpense ? 'Update Expense' : 'Submit Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}