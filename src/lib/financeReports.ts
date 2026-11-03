import type { RevenueRecord, ExpenseRecord, ProfitReportData } from './financeTypes';
import { formatCurrency, formatDateForInput } from './financeCalculations';

export async function generateRevenueReport(
  revenue: RevenueRecord[],
  filters: { source?: string; status?: string; start: string; end: string }
): Promise<{ pdfBlob: Blob; csvBlob: Blob }> {
  const filtered = revenue.filter(r => {
    if (filters.source && filters.source !== 'all' && r.source !== filters.source) return false;
    if (filters.status && filters.status !== 'all' && r.status !== filters.status) return false;
    const recordDate = new Date(r.date);
    const startDate = new Date(filters.start);
    const endDate = new Date(filters.end);
    endDate.setHours(23, 59, 59, 999);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const confirmed = filtered.filter(r => r.status === 'confirmed');
  const totalAmount = confirmed.reduce((sum, r) => sum + r.amount, 0);

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Atideto Technologies', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Revenue Report', 14, 22);
  doc.text(`Period: ${formatDateForInput(new Date(filters.start))} to ${formatDateForInput(new Date(filters.end))}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);
  doc.text(`Total Records: ${filtered.length} | Confirmed: ${confirmed.length} | Total: ${formatCurrency(totalAmount)}`, 14, 40);

  const headers = ['Date', 'Source', 'Payer', 'Reference', 'Amount (INR)', 'Method', 'Status', 'Txn Ref', 'Notes'];
  const rows = filtered.map(r => [
    r.date,
    r.source === 'internship' ? 'Internship' : 'Service',
    r.payer,
    r.referenceId || '-',
    formatCurrency(r.amount),
    r.method,
    r.status.charAt(0).toUpperCase() + r.status.slice(1),
    r.txnRef || '-',
    r.notes || '-',
  ]);

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 46,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 10, right: 10 },
  });

  const pdfBlob = doc.output('blob');

  const csvHeaders = headers.join(',');
  const csvRows = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const csvContent = `${csvHeaders}\n${csvRows}`;
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  return { pdfBlob, csvBlob };
}

export async function generateExpenseReport(
  expenses: ExpenseRecord[],
  filters: { status?: string; category?: string; start: string; end: string }
): Promise<{ pdfBlob: Blob; csvBlob: Blob }> {
  const filtered = expenses.filter(e => {
    if (filters.status && filters.status !== 'all' && e.status !== filters.status) return false;
    if (filters.category && filters.category !== 'all' && e.category !== filters.category) return false;
    const recordDate = new Date(e.date);
    const startDate = new Date(filters.start);
    const endDate = new Date(filters.end);
    endDate.setHours(23, 59, 59, 999);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const approved = filtered.filter(e => e.status === 'approved');
  const totalAmount = approved.reduce((sum, e) => sum + e.amount, 0);

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Atideto Technologies', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Expense Report', 14, 22);
  doc.text(`Period: ${formatDateForInput(new Date(filters.start))} to ${formatDateForInput(new Date(filters.end))}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);
  doc.text(`Total Records: ${filtered.length} | Approved: ${approved.length} | Total Approved: ${formatCurrency(totalAmount)}`, 14, 40);

  const headers = ['Date', 'Title', 'Category', 'Vendor', 'Amount (INR)', 'Status', 'Submitted By', 'Proof', 'Txn Ref', 'Notes'];
  const rows = filtered.map(e => [
    e.date,
    e.title,
    e.category,
    e.vendor || '-',
    formatCurrency(e.amount),
    e.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    e.submittedBy,
    e.proofUrl ? 'Yes' : 'No',
    e.txnRef || '-',
    e.description || '-',
  ]);

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 46,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 10, right: 10 },
  });

  const pdfBlob = doc.output('blob');

  const csvHeaders = headers.join(',');
  const csvRows = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const csvContent = `${csvHeaders}\n${csvRows}`;
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  return { pdfBlob, csvBlob };
}

export async function generateProfitReport(data: ProfitReportData): Promise<{ pdfBlob: Blob; csvBlob: Blob }> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Atideto Technologies', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Profit & Loss Report', 14, 22);
  doc.text(`Period: ${data.period.label} (${data.period.start} to ${data.period.end})`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Summary', 14, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const summaryData = [
    ['Internship Revenue', formatCurrency(data.internshipRevenue)],
    ['Service Revenue', formatCurrency(data.serviceRevenue)],
    ['Total Revenue', formatCurrency(data.totalRevenue)],
    ['Approved Expenses', formatCurrency(data.approvedExpenses)],
    ['Net Profit / (Loss)', formatCurrency(data.netProfit)],
  ];

  (doc as any).autoTable({
    head: [['Metric', 'Amount (INR)']],
    body: summaryData,
    startY: 48,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Expense Breakdown', 14, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const expenseRows = data.expenseBreakdown.map(e => [
    e.category,
    formatCurrency(e.total),
    e.count.toString(),
  ]);

  (doc as any).autoTable({
    head: [['Category', 'Total (INR)', 'Count']],
    body: expenseRows,
    startY: finalY + 4,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 },
  });

  finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Revenue Breakdown', 14, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const revenueRows = data.revenueBreakdown.map(r => [
    r.source,
    formatCurrency(r.total),
    r.count.toString(),
  ]);

  (doc as any).autoTable({
    head: [['Source', 'Total (INR)', 'Count']],
    body: revenueRows,
    startY: finalY + 4,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 },
  });

  finalY = (doc as any).lastAutoTable.finalY + 8;

  if (data.pendingExpenses > 0 || data.rejectedExpenses > 0 || data.refundedRevenue > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Excluded from Calculation', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const excludedRows = [];
    if (data.pendingExpenses > 0) excludedRows.push(['Pending Expenses', formatCurrency(data.pendingExpenses)]);
    if (data.rejectedExpenses > 0) excludedRows.push(['Rejected Expenses', formatCurrency(data.rejectedExpenses)]);
    if (data.refundedRevenue > 0) excludedRows.push(['Refunded Revenue', formatCurrency(data.refundedRevenue)]);

    (doc as any).autoTable({
      head: [['Item', 'Amount (INR)']],
      body: excludedRows,
      startY: finalY + 4,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
    });
  }

  const pdfBlob = doc.output('blob');

  const csvParts: string[] = [];
  csvParts.push('Atideto Technologies,Profit & Loss Report');
  csvParts.push(`Period,${data.period.label} (${data.period.start} to ${data.period.end})`);
  csvParts.push(`Generated,${new Date().toLocaleDateString('en-IN')}`);
  csvParts.push('');
  csvParts.push('Summary');
  csvParts.push('Metric,Amount (INR)');
  summaryData.forEach(row => csvParts.push(row.join(',')));
  csvParts.push('');
  csvParts.push('Expense Breakdown');
  csvParts.push('Category,Total (INR),Count');
  data.expenseBreakdown.forEach(e => csvParts.push(`${e.category},${e.total},${e.count}`));
  csvParts.push('');
  csvParts.push('Revenue Breakdown');
  csvParts.push('Source,Total (INR),Count');
  data.revenueBreakdown.forEach(r => csvParts.push(`${r.source},${r.total},${r.count}`));
  
  if (data.pendingExpenses > 0 || data.rejectedExpenses > 0 || data.refundedRevenue > 0) {
    csvParts.push('');
    csvParts.push('Excluded from Calculation');
    csvParts.push('Item,Amount (INR)');
    if (data.pendingExpenses > 0) csvParts.push(`Pending Expenses,${data.pendingExpenses}`);
    if (data.rejectedExpenses > 0) csvParts.push(`Rejected Expenses,${data.rejectedExpenses}`);
    if (data.refundedRevenue > 0) csvParts.push(`Refunded Revenue,${data.refundedRevenue}`);
  }

  const csvContent = csvParts.join('\n');
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  return { pdfBlob, csvBlob };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}