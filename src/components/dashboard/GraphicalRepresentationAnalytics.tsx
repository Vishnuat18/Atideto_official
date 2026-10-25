import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Layers,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  Download,
  Filter,
  Check,
  Table as TableIcon
} from 'lucide-react';

export type GraphCategory = 'all' | 'ungrouped' | 'grouped';
export type GraphType = 'line' | 'bar' | 'pie' | 'histogram' | 'polygon' | 'curve';

export interface GraphicalAnalyticsProps {
  currentPane?: string;
  students?: any[];
  courses?: any[];
  internships?: any[];
  clients?: any[];
  staff?: any[];
  payments?: any[];
  isCompact?: boolean;
  onClose?: () => void;
  titleOverride?: string;
}

export const PANE_OPTIONS = [
  { id: 'overview', label: 'Overview & Global Ops' },
  { id: 'all-students', label: 'Candidate Registry' },
  { id: 'attendance', label: 'Attendance & Compliance' },
  { id: 'courses', label: 'Course Catalog & Enrolment' },
  { id: 'internships', label: 'Internships & Projects' },
  { id: 'registrations', label: 'Admissions Pipeline' },
  { id: 'student-payments', label: 'Fee Collections & Ledger' },
  { id: 'reports', label: 'Academic & Evaluation Scores' },
  { id: 'certificates', label: 'Certifications & Credentials' },
  { id: 'clients', label: 'Corporate Partners & MOUs' },
  { id: 'staff', label: 'Staff & Faculty Load' },
];

export default function GraphicalRepresentationAnalytics({
  currentPane = 'overview',
  students = [],
  courses = [],
  internships = [],
  clients = [],
  staff = [],
  payments = [],
  isCompact = false,
  onClose,
  titleOverride
}: GraphicalAnalyticsProps) {
  const [selectedPane, setSelectedPane] = useState<string>(currentPane);
  const [selectedCategory, setSelectedCategory] = useState<GraphCategory>('all');
  const [selectedGraphType, setSelectedGraphType] = useState<GraphType | 'all'>('all');
  const [showFrequencyTable, setShowFrequencyTable] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sync pane when prop changes
  React.useEffect(() => {
    setSelectedPane(currentPane);
  }, [currentPane]);

  // Extract / Calculate data for the selected pane
  const paneData = useMemo(() => {
    const totalCount = students.length || 21;

    // 1. Ungrouped Data Preparation (Discrete Items & Trends)
    let ungroupedLineData: { label: string; value: number; secondary?: number; unit?: string }[] = [];
    let ungroupedBarData: { category: string; value: number; label?: string }[] = [];
    let ungroupedPieData: { name: string; value: number; percent: number }[] = [];
    let ungroupedTitle = 'Metric Progression';
    let ungroupedDescription = 'Discrete entity values and temporal progression';

    // 2. Grouped Data Preparation (Continuous Intervals / Bins)
    // Continuous values to bin into grouped frequency distribution
    let rawContinuousValues: number[] = [];
    let unitLabel = '';
    let binMin = 0;
    let binMax = 100;
    let binStep = 10;
    let groupedMetricName = 'Score / Percentage';

    if (selectedPane === 'attendance') {
      ungroupedTitle = 'Cohort Attendance Compliance';
      ungroupedDescription = 'Daily tracking & cumulative sprint adherence';
      // Line: 12 weekly sprints
      const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
      ungroupedLineData = weeks.map((w, i) => ({
        label: w,
        value: Math.min(100, Math.round(92 + Math.sin(i * 0.8) * 6)),
        unit: '%'
      }));
      // Bar: College groups
      const mecAtt = Math.round(
        students.filter(s => s.college?.includes('Mahendra Engineering')).reduce((acc, s) => acc + (s.attendance || 95), 0) /
        (students.filter(s => s.college?.includes('Mahendra Engineering')).length || 1)
      ) || 96;
      const mceAtt = Math.round(
        students.filter(s => s.college?.includes('Mahendra College')).reduce((acc, s) => acc + (s.attendance || 95), 0) /
        (students.filter(s => s.college?.includes('Mahendra College')).length || 1)
      ) || 94;
      ungroupedBarData = [
        { category: 'MEC IT Cohort', value: mecAtt, label: `${mecAtt}%` },
        { category: 'MCE CSE Cohort', value: mceAtt, label: `${mceAtt}%` },
        { category: 'Autonomous Batches', value: 95, label: '95%' },
        { category: 'Executive Mentorship', value: 98, label: '98%' },
      ];
      // Pie: Attendance Tiers
      const dist = students.filter(s => (s.attendance || 95) >= 95).length || 14;
      const sat = students.filter(s => (s.attendance || 95) >= 85 && (s.attendance || 95) < 95).length || 6;
      const bord = students.filter(s => (s.attendance || 95) >= 75 && (s.attendance || 95) < 85).length || 1;
      const warn = students.filter(s => (s.attendance || 95) < 75).length || 0;
      ungroupedPieData = [
        { name: 'Distinction (≥95%)', value: dist, percent: Math.round((dist / totalCount) * 100) },
        { name: 'Satisfactory (85-94%)', value: sat, percent: Math.round((sat / totalCount) * 100) },
        { name: 'Borderline (75-84%)', value: bord, percent: Math.round((bord / totalCount) * 100) },
        ...(warn > 0 ? [{ name: 'Warning (<75%)', value: warn, percent: Math.round((warn / totalCount) * 100) }] : [])
      ];

      rawContinuousValues = students.map(s => s.attendance || 95);
      binMin = 60;
      binMax = 100;
      binStep = 10;
      unitLabel = '%';
      groupedMetricName = 'Attendance Rate';
    } else if (selectedPane === 'student-payments' || selectedPane === 'finance-payments' || selectedPane === 'billing') {
      ungroupedTitle = 'Fee Realization & Fiscal Trajectory';
      ungroupedDescription = 'Tuition settlement and institutional collection records';
      // Line: Monthly collections (in ₹ Thousands)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      ungroupedLineData = months.map((m, i) => ({
        label: m,
        value: [45, 80, 140, 210, 290, 380, 470, 560, 640, 714][i] || 714,
        unit: '₹k'
      }));
      // Bar: Payment Methods
      ungroupedBarData = [
        { category: 'Institutional NEFT', value: 540, label: '₹5.40L' },
        { category: 'Direct Wire', value: 120, label: '₹1.20L' },
        { category: 'UPI Corporate', value: 42, label: '₹42k' },
        { category: 'Demand Draft', value: 12, label: '₹12k' },
      ];
      // Pie: Settlement status
      const paid = students.filter(s => s.paymentStatus === 'Paid' || s.feePaid === s.feeTotal).length || 16;
      const partial = students.filter(s => s.paymentStatus === 'Partial' || (s.feePaid !== s.feeTotal && s.feePaid !== '₹0')).length || 5;
      ungroupedPieData = [
        { name: 'Fully Paid (100%)', value: paid, percent: Math.round((paid / totalCount) * 100) },
        { name: 'Partially Settled', value: partial, percent: Math.round((partial / totalCount) * 100) },
      ];

      // continuous values: percentage of fees paid
      rawContinuousValues = students.map(s => {
        const total = parseInt((s.feeTotal || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const p = parseInt((s.feePaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
        if (total === 0) return 100;
        return Math.min(100, Math.round((p / total) * 100));
      });
      binMin = 0;
      binMax = 100;
      binStep = 20;
      unitLabel = '% paid';
      groupedMetricName = 'Tuition Settlement Ratio';
    } else if (selectedPane === 'courses') {
      ungroupedTitle = 'Course Curriculum Density & Enrolment';
      ungroupedDescription = 'Capacity allocation across active syllabus modules';
      // Line: Course modules vs duration
      ungroupedLineData = (courses.length > 0 ? courses.slice(0, 8) : [
        { title: 'MERN Stack', enrolled: 68 },
        { title: 'Spring Boot', enrolled: 45 },
        { title: 'GenAI & LLMs', enrolled: 52 },
        { title: 'Python Architect', enrolled: 74 },
        { title: 'Next.js 15', enrolled: 58 },
        { title: 'Data Analytics', enrolled: 62 },
        { title: 'Cloud DevOps', enrolled: 38 },
        { title: 'UI/UX Design', enrolled: 42 }
      ]).map((c: any) => ({
        label: c.title?.split(' ')[0] || 'Course',
        value: c.enrolled || 50,
        unit: 'students'
      }));
      // Bar: Category distribution
      ungroupedBarData = [
        { category: 'Full Stack', value: 171, label: '171 Enrolled' },
        { category: 'AI & Data', value: 158, label: '158 Enrolled' },
        { category: 'Programming', value: 190, label: '190 Enrolled' },
        { category: 'Cloud DevOps', value: 38, label: '38 Enrolled' },
        { category: 'Design & Media', value: 42, label: '42 Enrolled' }
      ];
      // Pie: Course Categories
      ungroupedPieData = [
        { name: 'Programming Tracks', value: 190, percent: 32 },
        { name: 'Full Stack Web', value: 171, percent: 29 },
        { name: 'AI & Data Science', value: 158, percent: 26 },
        { name: 'Cloud & Design', value: 80, percent: 13 }
      ];

      rawContinuousValues = (courses.length > 0 ? courses : [
        { enrolled: 68 }, { enrolled: 45 }, { enrolled: 52 }, { enrolled: 74 },
        { enrolled: 58 }, { enrolled: 62 }, { enrolled: 38 }, { enrolled: 42 },
        { enrolled: 31 }, { enrolled: 36 }, { enrolled: 80 }, { enrolled: 44 }
      ]).map((c: any) => c.enrolled || 50);
      binMin = 20;
      binMax = 100;
      binStep = 15;
      unitLabel = 'enrollments';
      groupedMetricName = 'Course Capacity Density';
    } else if (selectedPane === 'reports' || selectedPane === 'all-students') {
      ungroupedTitle = 'Cohort Assessment & Evaluation Metrics';
      ungroupedDescription = 'Academic score progression, viva evaluations, and milestone grading';
      // Line: Top candidate scores
      ungroupedLineData = students.slice(0, 10).map((s, idx) => ({
        label: s.name?.split(' ')[0] || `S${idx + 1}`,
        value: s.score || (92 + (idx % 6)),
        unit: 'pts'
      }));
      // Bar: Track average scores
      const trackScores: Record<string, { total: number; count: number }> = {};
      students.forEach(s => {
        const d = s.domain?.split(' ')[0] || 'General';
        if (!trackScores[d]) trackScores[d] = { total: 0, count: 0 };
        trackScores[d].total += s.score || 95;
        trackScores[d].count += 1;
      });
      ungroupedBarData = Object.entries(trackScores).slice(0, 5).map(([track, stats]) => {
        const avg = Math.round(stats.total / stats.count);
        return { category: track, value: avg, label: `${avg}/100` };
      });
      if (ungroupedBarData.length === 0) {
        ungroupedBarData = [
          { category: 'Full Stack', value: 96, label: '96/100' },
          { category: 'Data Science', value: 94, label: '94/100' },
          { category: 'Cloud DevOps', value: 95, label: '95/100' },
          { category: 'AI Systems', value: 97, label: '97/100' }
        ];
      }
      // Pie: Evaluation Grade Brackets
      const highDist = students.filter(s => (s.score || 95) >= 95).length || 15;
      const firstClass = students.filter(s => (s.score || 95) >= 85 && (s.score || 95) < 95).length || 6;
      ungroupedPieData = [
        { name: 'Grade O: High Distinction (≥95)', value: highDist, percent: Math.round((highDist / totalCount) * 100) },
        { name: 'Grade A+: First Class (85-94)', value: firstClass, percent: Math.round((firstClass / totalCount) * 100) },
      ];

      rawContinuousValues = students.map(s => s.score || 95);
      binMin = 70;
      binMax = 100;
      binStep = 6;
      unitLabel = 'marks';
      groupedMetricName = 'Evaluation Score Intervals';
    } else if (selectedPane === 'certificates') {
      ungroupedTitle = 'Credential Verification & Public Issuance';
      ungroupedDescription = 'Tamper-proof verifiable credentials and QR scan telemetry';
      // Line: Monthly certificates generated
      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      ungroupedLineData = months.map((m, i) => ({
        label: m,
        value: [2, 5, 9, 14, 18, 21][i] || 21,
        unit: 'certs'
      }));
      // Bar: Credential types
      ungroupedBarData = [
        { category: 'Course Completion', value: 21, label: '21 Issued' },
        { category: 'Internship Experience', value: 21, label: '21 Issued' },
        { category: 'Attendance Honors', value: 16, label: '16 Issued' },
        { category: 'Project Capstone', value: 21, label: '21 Issued' }
      ];
      // Pie: Status
      const activeCerts = students.filter(s => !s.certHold).length || 20;
      const heldCerts = totalCount - activeCerts;
      ungroupedPieData = [
        { name: 'Publicly Active & Verifiable', value: activeCerts, percent: Math.round((activeCerts / totalCount) * 100) },
        ...(heldCerts > 0 ? [{ name: 'Administrative Hold', value: heldCerts, percent: Math.round((heldCerts / totalCount) * 100) }] : [])
      ];

      // Simulated QR scan verification hits per candidate
      rawContinuousValues = students.map((_, i) => (i * 3 + 4) % 25 + 5);
      binMin = 0;
      binMax = 35;
      binStep = 7;
      unitLabel = 'QR scans';
      groupedMetricName = 'Verification Telemetry';
    } else if (selectedPane === 'clients') {
      ungroupedTitle = 'Corporate Client Partnerships & MOUs';
      ungroupedDescription = 'Institutional accounts, active industrial charters and project scale';
      ungroupedLineData = [
        { label: 'Q1', value: 2, unit: 'MOUs' },
        { label: 'Q2', value: 4, unit: 'MOUs' },
        { label: 'Q3', value: 7, unit: 'MOUs' },
        { label: 'Q4', value: 9, unit: 'MOUs' },
      ];
      ungroupedBarData = (clients.length > 0 ? clients.slice(0, 4) : [
        { name: 'Wipro Limited', activeProjects: 2 },
        { name: 'Infosys BPM', activeProjects: 1 },
        { name: 'TCS Enterprise', activeProjects: 2 },
        { name: 'Cognizant Tech', activeProjects: 1 },
      ]).map((c: any) => ({
        category: c.name?.split(' ')[0] || 'Client',
        value: c.activeProjects || 1,
        label: `${c.activeProjects || 1} Projects`
      }));
      ungroupedPieData = [
        { name: 'Active Corporate MOUs', value: 6, percent: 67 },
        { name: 'Contract Renewals', value: 2, percent: 22 },
        { name: 'In Negotiation', value: 1, percent: 11 }
      ];

      rawContinuousValues = [2.5, 5.0, 7.5, 3.2, 8.0, 4.5, 12.0, 6.0]; // Contract values in Lakhs
      binMin = 0;
      binMax = 15;
      binStep = 3;
      unitLabel = '₹ Lakhs';
      groupedMetricName = 'Contract Value Distribution';
    } else if (selectedPane === 'staff') {
      ungroupedTitle = 'Faculty & Mentorship Allocation';
      ungroupedDescription = 'Student mentee loads and department distribution';
      ungroupedLineData = (staff.length > 0 ? staff : [
        { name: 'Sam', assigned_students: 13 },
        { name: 'Neevas', assigned_students: 13 },
        { name: 'Vishnu', assigned_students: 13 },
        { name: 'Kiran', assigned_students: 10 },
        { name: 'Yogesh', assigned_students: 13 },
        { name: 'Sanjay', assigned_students: 8 },
        { name: 'Sachin', assigned_students: 12 }
      ]).map((m: any) => ({
        label: m.name?.split(' ')[0] || 'Staff',
        value: m.assigned_students || 10,
        unit: 'mentees'
      }));
      ungroupedBarData = [
        { category: 'Executive', value: 3, label: '3 Members' },
        { category: 'Engineering', value: 2, label: '2 Members' },
        { category: 'Product', value: 1, label: '1 Member' },
        { category: 'Media/Design', value: 1, label: '1 Member' },
      ];
      ungroupedPieData = [
        { name: 'Executive Leadership', value: 3, percent: 43 },
        { name: 'Software Engineering', value: 2, percent: 29 },
        { name: 'Product & Design', value: 2, percent: 28 }
      ];

      rawContinuousValues = (staff.length > 0 ? staff : [
        { assigned_students: 13 }, { assigned_students: 13 }, { assigned_students: 13 },
        { assigned_students: 10 }, { assigned_students: 13 }, { assigned_students: 8 },
        { assigned_students: 12 }
      ]).map((m: any) => m.assigned_students || 10);
      binMin = 5;
      binMax = 15;
      binStep = 2;
      unitLabel = 'students';
      groupedMetricName = 'Mentorship Load Distribution';
    } else {
      // Default: Overview & Global Ops
      ungroupedTitle = 'Institutional System Performance';
      ungroupedDescription = 'Onboarding velocity, domain specialization and revenue';
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      ungroupedLineData = months.map((m, i) => ({
        label: m,
        value: Math.round(totalCount * ([0.2, 0.35, 0.5, 0.65, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0][i] || 1)),
        unit: 'registered'
      }));
      // Domain track breakdown
      const domainMap: Record<string, number> = {};
      students.forEach(s => {
        const d = s.domain || 'Full Stack';
        const key = d.split(' ')[0];
        domainMap[key] = (domainMap[key] || 0) + 1;
      });
      ungroupedBarData = Object.entries(domainMap).slice(0, 5).map(([domain, count]) => ({
        category: domain,
        value: count,
        label: `${count} Students`
      }));
      if (ungroupedBarData.length === 0) {
        ungroupedBarData = [
          { category: 'Full Stack', value: 12, label: '12 Students' },
          { category: 'AI & Data', value: 5, label: '5 Students' },
          { category: 'Cloud DevOps', value: 4, label: '4 Students' }
        ];
      }
      // College Distribution
      const mec = students.filter(s => s.college?.includes('Mahendra Engineering')).length || 15;
      const mce = students.filter(s => s.college?.includes('Mahendra College')).length || 6;
      ungroupedPieData = [
        { name: 'Mahendra Eng. College (MEC IT)', value: mec, percent: Math.round((mec / totalCount) * 100) },
        { name: 'Mahendra College of Eng. (MCE CSE)', value: mce, percent: Math.round((mce / totalCount) * 100) }
      ];

      rawContinuousValues = students.map(s => s.attendance || 95);
      binMin = 70;
      binMax = 100;
      binStep = 6;
      unitLabel = '% compliance';
      groupedMetricName = 'Cohort Adherence Index';
    }

    // Fallback if empty
    if (rawContinuousValues.length === 0) {
      rawContinuousValues = [92, 94, 95, 96, 98, 99, 93, 95, 96, 97, 100, 95, 94, 96, 97, 98, 92, 95, 96, 99, 95];
    }

    // 3. Mathematical Grouped Data Binning (Continuous Intervals, Midpoints, Frequency, Cumulative)
    const bins: {
      interval: string;
      lower: number;
      upper: number;
      midpoint: number;
      frequency: number;
      relativeFreq: number;
      cumFreq: number;
      fx: number;
    }[] = [];

    let cum = 0;
    const numBins = Math.max(4, Math.ceil((binMax - binMin) / binStep));
    const effectiveStep = (binMax - binMin) / numBins;

    for (let i = 0; i < numBins; i++) {
      const lower = Math.round((binMin + i * effectiveStep) * 10) / 10;
      const upper = Math.round((binMin + (i + 1) * effectiveStep) * 10) / 10;
      const midpoint = Math.round(((lower + upper) / 2) * 10) / 10;

      // Count values in [lower, upper) (inclusive for last bin)
      const count = rawContinuousValues.filter(v => {
        if (i === numBins - 1) return v >= lower && v <= upper;
        return v >= lower && v < upper;
      }).length;

      cum += count;
      const relativeFreq = Math.round((count / (rawContinuousValues.length || 1)) * 1000) / 10;

      bins.push({
        interval: `${lower} - ${upper}${unitLabel ? ` ${unitLabel}` : ''}`,
        lower,
        upper,
        midpoint,
        frequency: count,
        relativeFreq,
        cumFreq: cum,
        fx: Math.round(count * midpoint * 10) / 10
      });
    }

    // Statistical Parameters (Mean, Standard Deviation, Mode)
    const n = rawContinuousValues.length;
    const sum = rawContinuousValues.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / (n || 1)) * 10) / 10;
    const variance = rawContinuousValues.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n || 1);
    const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

    // Find modal class interval (highest frequency)
    const maxFreq = Math.max(...bins.map(b => b.frequency), 1);
    const modalBin = bins.find(b => b.frequency === maxFreq) || bins[0];

    return {
      ungroupedTitle,
      ungroupedDescription,
      ungroupedLineData,
      ungroupedBarData,
      ungroupedPieData,
      groupedMetricName,
      unitLabel,
      bins,
      stats: {
        sampleSize: n,
        mean,
        stdDev,
        modalInterval: modalBin.interval,
        maxFreq
      }
    };
  }, [selectedPane, students, courses, internships, clients, staff, payments]);

  // SVG dimensions for chart renderings
  const width = 560;
  const height = 240;
  const padding = { top: 24, right: 30, bottom: 44, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // -------------------------------------------------------------
  // 1. RENDER UNGROUPED: LINE GRAPH
  // -------------------------------------------------------------
  const renderLineGraph = () => {
    const data = paneData.ungroupedLineData;
    if (!data.length) return null;
    const maxVal = Math.max(...data.map(d => d.value), 10);
    const minVal = Math.min(...data.map(d => d.value), 0);
    const range = maxVal - minVal || 1;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
      const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
      return { x, y, ...d };
    });

    const pathString = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <span className="w-2.5 h-2.5 rounded-full bg-black inline-block" />
            <span>Line Graph • Ungrouped Temporal Trajectory</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            Peak: {maxVal} {data[0]?.unit || ''}
          </span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = Math.round(minVal + range * pct);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#94A3B8] font-mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Polyline Path */}
            <path d={pathString} fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Area gradient under line */}
            <linearGradient id="lineFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
            </linearGradient>
            <path
              d={`${pathString} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`}
              fill="url(#lineFillGrad)"
            />

            {/* Interactive Data Points */}
            {points.map((p, i) => (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 6 : 4}
                  className="fill-white stroke-[#000000] stroke-[2.5px] transition-all"
                />
                <text
                  x={p.x}
                  y={padding.top + chartH + 16}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-[#64748B]"
                >
                  {p.label}
                </text>
                {hoveredIndex === i && (
                  <g>
                    <rect
                      x={p.x - 30}
                      y={p.y - 28}
                      width="60"
                      height="20"
                      rx="4"
                      fill="#0F172A"
                      className="shadow-md"
                    />
                    <text
                      x={p.x}
                      y={p.y - 15}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-white font-mono"
                    >
                      {p.value} {p.unit || ''}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Line Graph</b> connects discrete individual observed metrics chronologically, revealing upward and downward progression over periods.</span>
        </p>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 2. RENDER UNGROUPED: BAR GRAPH
  // -------------------------------------------------------------
  const renderBarGraph = () => {
    const data = paneData.ungroupedBarData;
    if (!data.length) return null;
    const maxVal = Math.max(...data.map(d => d.value), 10);
    const barWidth = Math.min(54, Math.max(26, (chartW / data.length) * 0.55));
    const step = chartW / data.length;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block" />
            <span>Bar Graph • Ungrouped Categorical Comparison</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            {data.length} Categories Compared
          </span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = Math.round(maxVal * pct);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#94A3B8] font-mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Bars */}
            {data.map((d, i) => {
              const barH = (d.value / maxVal) * chartH;
              const x = padding.left + i * step + (step - barWidth) / 2;
              const y = padding.top + chartH - barH;

              return (
                <g
                  key={i}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="4"
                    className={`transition-all ${
                      hoveredIndex === i ? 'fill-[#000000]' : 'fill-[#0F172A]'
                    }`}
                  />
                  {/* Frequency / metric label above bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-[#0F172A] font-mono"
                  >
                    {d.label || d.value}
                  </text>
                  {/* Category label below x-axis */}
                  <text
                    x={x + barWidth / 2}
                    y={padding.top + chartH + 16}
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-[#64748B] truncate max-w-[70px]"
                  >
                    {d.category.length > 12 ? `${d.category.slice(0, 10)}…` : d.category}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Bar Graph</b> represents discrete non-continuous entities with distinct spacing between vertical bars, comparing values side-by-side.</span>
        </p>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 3. RENDER UNGROUPED: PIE DIAGRAM OR CIRCLE GRAPH
  // -------------------------------------------------------------
  const renderPieDiagram = () => {
    const data = paneData.ungroupedPieData;
    if (!data.length) return null;
    const total = data.reduce((a, b) => a + b.value, 0) || 1;

    // Angles in radians
    const cx = 150;
    const cy = 120;
    const radius = 80;
    const innerRadius = 45; // Sleek Donut / Circle graph

    // Monochrome slate palette matching two-color spec
    const sliceShades = ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1'];

    let currentAngle = -Math.PI / 2;
    const slices = data.map((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const ix1 = cx + innerRadius * Math.cos(endAngle);
      const iy1 = cy + innerRadius * Math.sin(endAngle);
      const ix2 = cx + innerRadius * Math.cos(startAngle);
      const iy2 = cy + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix1} ${iy1}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}
        Z
      `;

      return {
        ...d,
        pathData,
        fill: sliceShades[i % sliceShades.length],
        midAngle: startAngle + sliceAngle / 2
      };
    });

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <PieChartIcon size={14} className="text-black" />
            <span>Pie Diagram / Circle Graph • Proportional Share</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">Total: {total} Units</span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          {/* SVG Donut Circle */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <svg viewBox="0 0 300 240" className="w-[240px] h-[190px] select-none">
              {slices.map((s, i) => (
                <g
                  key={i}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <path
                    d={s.pathData}
                    fill={s.fill}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className={`transition-all duration-200 ${
                      hoveredIndex === i ? 'opacity-90 scale-[1.02] origin-center' : 'opacity-100'
                    }`}
                  />
                </g>
              ))}
              {/* Center donut label */}
              <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#FFFFFF" />
              <text x={cx} y={cy - 2} textAnchor="middle" className="text-base font-black fill-[#0F172A]">
                100%
              </text>
              <text x={cx} y={cy + 13} textAnchor="middle" className="text-[9px] font-bold fill-[#64748B] uppercase">
                Proportion
              </text>
            </svg>
          </div>

          {/* Legend Table */}
          <div className="w-full md:w-1/2 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block">
              Proportion Breakdown
            </span>
            <div className="space-y-1.5">
              {slices.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 rounded-lg border transition ${
                    hoveredIndex === i
                      ? 'bg-[#F1F5F9] border-[#CBD5E1]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 border border-white shadow-2xs"
                      style={{ backgroundColor: s.fill }}
                    />
                    <span className="text-xs font-semibold text-[#0F172A] truncate max-w-[140px]">
                      {s.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-[#0F172A] block">
                      {s.percent}%
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {s.value} units
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Pie Diagram (Circle Graph)</b> represents components of a whole where sector arc angles are strictly proportional to the fraction they represent.</span>
        </p>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 4. RENDER GROUPED: HISTOGRAM
  // -------------------------------------------------------------
  const renderHistogram = () => {
    const bins = paneData.bins;
    if (!bins.length) return null;
    const maxFreq = paneData.stats.maxFreq;

    // Histogram bars MUST touch each other without arbitrary gaps (gap = 0)!
    const barWidth = chartW / bins.length;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <BarChart3 size={14} className="text-black" />
            <span>Histogram • Grouped Continuous Frequency Bins</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            {bins.length} Class Intervals (Gap = 0)
          </span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = Math.round(maxFreq * pct);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#94A3B8] font-mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Histogram Continuous Bars (Contiguous, Touching) */}
            {bins.map((bin, i) => {
              const barH = (bin.frequency / maxFreq) * chartH;
              const x = padding.left + i * barWidth;
              const y = padding.top + chartH - barH;

              return (
                <g
                  key={i}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Contiguous Rect with 1px border to demarcate adjacent class intervals */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    className={`transition-all ${
                      hoveredIndex === i ? 'fill-[#000000]' : 'fill-[#1E293B]'
                    }`}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  {/* Frequency count above bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-[#0F172A] font-mono"
                  >
                    f={bin.frequency}
                  </text>
                  {/* Interval range on x-axis */}
                  <text
                    x={x + barWidth / 2}
                    y={padding.top + chartH + 16}
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-[#64748B]"
                  >
                    [{bin.lower}-{bin.upper})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Histogram</b> represents grouped continuous frequency data. Unlike a bar chart, the rectangles touch each other without gaps, where width is the class interval and height is class frequency.</span>
        </p>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 5. RENDER GROUPED: FREQUENCY POLYGON
  // -------------------------------------------------------------
  const renderFrequencyPolygon = () => {
    const bins = paneData.bins;
    if (!bins.length) return null;
    const maxFreq = paneData.stats.maxFreq;
    const barWidth = chartW / bins.length;

    // Midpoints of each bin
    const polygonPoints: { x: number; y: number; midpoint: number; freq: number; label: string }[] = [];

    // Left base anchor at hypothetical preceding interval with frequency 0
    const firstX = padding.left + barWidth / 2;
    polygonPoints.push({
      x: padding.left,
      y: padding.top + chartH,
      midpoint: bins[0].lower,
      freq: 0,
      label: 'Base'
    });

    // Actual midpoint vertices
    bins.forEach((bin, i) => {
      const x = padding.left + i * barWidth + barWidth / 2;
      const y = padding.top + chartH - (bin.frequency / maxFreq) * chartH;
      polygonPoints.push({
        x,
        y,
        midpoint: bin.midpoint,
        freq: bin.frequency,
        label: `${bin.midpoint}`
      });
    });

    // Right base anchor at hypothetical succeeding interval with frequency 0
    polygonPoints.push({
      x: padding.left + bins.length * barWidth,
      y: padding.top + chartH,
      midpoint: bins[bins.length - 1].upper,
      freq: 0,
      label: 'Base'
    });

    const pathData = polygonPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <Activity size={14} className="text-black" />
            <span>Frequency Polygon • Midpoints of Grouped Class Intervals</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            Vertices Joined by Straight Line Segments
          </span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = Math.round(maxFreq * pct);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#94A3B8] font-mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Ghost Histogram Outlines for Statistical Reference */}
            {bins.map((bin, i) => {
              const barH = (bin.frequency / maxFreq) * chartH;
              const x = padding.left + i * barWidth;
              const y = padding.top + chartH - barH;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* X-axis */}
            <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Shaded Area Under Polygon */}
            <path d={`${pathData} Z`} fill="#0F172A" fillOpacity="0.08" />

            {/* Polygon Straight Segments */}
            <path d={pathData} fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Midpoint Vertices */}
            {polygonPoints.slice(1, -1).map((p, i) => (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 6 : 4}
                  className="fill-black stroke-white stroke-2 transition-all"
                />
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-[#0F172A] font-mono"
                >
                  {p.freq}
                </text>
                <text
                  x={p.x}
                  y={padding.top + chartH + 16}
                  textAnchor="middle"
                  className="text-[9px] font-semibold fill-[#64748B]"
                >
                  m={p.midpoint}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Frequency Polygon</b> connects the midpoints of adjacent histogram rectangles with straight lines, anchoring to zero frequency at both extremes to form a closed polygon.</span>
        </p>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 6. RENDER GROUPED: FREQUENCY CURVE
  // -------------------------------------------------------------
  const renderFrequencyCurve = () => {
    const bins = paneData.bins;
    if (!bins.length) return null;
    const maxFreq = paneData.stats.maxFreq;
    const barWidth = chartW / bins.length;

    // Build points array including baseline boundaries
    const curvePoints: { x: number; y: number }[] = [];
    curvePoints.push({ x: padding.left, y: padding.top + chartH });

    bins.forEach((bin, i) => {
      const x = padding.left + i * barWidth + barWidth / 2;
      const y = padding.top + chartH - (bin.frequency / maxFreq) * chartH;
      curvePoints.push({ x, y });
    });

    curvePoints.push({ x: padding.left + bins.length * barWidth, y: padding.top + chartH });

    // Generate smooth cubic bezier spline curve through vertices
    const getCurvePath = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? i : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    };

    const smoothPath = getCurvePath(curvePoints);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <TrendingUp size={14} className="text-black" />
            <span>Frequency Curve • Smooth Continuous Probability Density</span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">
            Fitted Spline Distribution (KDE)
          </span>
        </div>

        <div className="relative bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartH * (1 - pct);
              const val = Math.round(maxFreq * pct);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#94A3B8] font-mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Smooth Gradient Fill under curve */}
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.02" />
            </linearGradient>
            <path
              d={`${smoothPath} L ${padding.left + bins.length * barWidth} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`}
              fill="url(#curveFill)"
            />

            {/* Smooth Spline Stroke */}
            <path d={smoothPath} fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

            {/* Mean (μ) indicator line */}
            <line
              x1={padding.left + chartW * 0.65}
              y1={padding.top}
              x2={padding.left + chartW * 0.65}
              y2={padding.top + chartH}
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={padding.left + chartW * 0.65 + 4}
              y={padding.top + 12}
              className="text-[9px] font-bold fill-[#0F172A] font-mono"
            >
              Mean (μ={paneData.stats.mean})
            </text>

            {/* X-axis Midpoint labels */}
            {bins.map((bin, i) => (
              <text
                key={i}
                x={padding.left + i * barWidth + barWidth / 2}
                y={padding.top + chartH + 16}
                textAnchor="middle"
                className="text-[9px] font-semibold fill-[#64748B]"
              >
                {bin.midpoint}
              </text>
            ))}
          </svg>
        </div>
        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <Info size={12} className="text-[#0F172A]" />
          <span><b>Frequency Curve</b> is a smooth freehand curve drawn along the vertices of the frequency polygon, eliminating jagged corners to represent continuous probability density.</span>
        </p>
      </div>
    );
  };

  return (
    <div className={`rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm overflow-hidden ${isCompact ? 'p-3' : 'p-4 sm:p-6'} space-y-5`}>
      {/* 1. Header Toolbar matching 2-Color & Native Mobile UX */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#000000] text-white">
              <Layers size={18} />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
              {titleOverride || 'Analytical Graphical Representations'}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Statistical insight engine: <b>Ungrouped Data</b> (Line, Bar, Pie) & <b>Grouped Data</b> (Histogram, Polygon, Curve)
          </p>
        </div>

        {/* Pane Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Target Pane:</span>
            <select
              value={selectedPane}
              onChange={(e) => setSelectedPane(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer"
            >
              {PANE_OPTIONS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Raw Frequency Distribution Table */}
          <button
            type="button"
            onClick={() => setShowFrequencyTable(!showFrequencyTable)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showFrequencyTable
                ? 'bg-black text-white border-black'
                : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border-[#E2E8F0]'
            }`}
          >
            <TableIcon size={13} />
            <span>{showFrequencyTable ? 'Hide Table' : 'Frequency Table'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-black cursor-pointer"
              title="Close Panel"
            >
              <ChevronDown size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Statistical Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Sample Size (N)</span>
          <div className="text-xl font-black text-[#0F172A] mt-0.5">{paneData.stats.sampleSize}</div>
          <span className="text-[10px] text-[#64748B]">Active observed units</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Mean (μ)</span>
          <div className="text-xl font-black text-[#0F172A] mt-0.5">{paneData.stats.mean}</div>
          <span className="text-[10px] text-[#64748B]">Arithmetic average</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Std Dev (σ)</span>
          <div className="text-xl font-black text-[#0F172A] mt-0.5">±{paneData.stats.stdDev}</div>
          <span className="text-[10px] text-[#64748B]">Dispersion index</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Modal Interval</span>
          <div className="text-sm font-black text-[#0F172A] truncate mt-1">{paneData.stats.modalInterval}</div>
          <span className="text-[10px] text-[#64748B]">Peak class density</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase text-[#64748B] block">Representation</span>
          <div className="text-sm font-black text-[#0F172A] mt-1">6 Graph Types</div>
          <span className="text-[10px] text-[#64748B]">2 Statistical Tiers</span>
        </div>
      </div>

      {/* 3. Segmented Switcher Control (Directly matching the Reference Infographic) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Category Filter: All | Ungrouped Data | Grouped Data */}
          <div className="inline-flex p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-2xs self-start">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGraphType('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#000000] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>All Graphs</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ungrouped');
                if (selectedGraphType === 'histogram' || selectedGraphType === 'polygon' || selectedGraphType === 'curve') {
                  setSelectedGraphType('line');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'ungrouped'
                  ? 'bg-[#000000] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>1. Ungrouped Data</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('grouped');
                if (selectedGraphType === 'line' || selectedGraphType === 'bar' || selectedGraphType === 'pie') {
                  setSelectedGraphType('histogram');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'grouped'
                  ? 'bg-[#000000] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>2. Grouped Data</span>
            </button>
          </div>

          {/* Specific Graph Sub-Type Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(selectedCategory === 'all' || selectedCategory === 'ungrouped') && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'line' ? 'all' : 'line')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'line'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Line Graph
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'bar' ? 'all' : 'bar')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'bar'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Bar Graph
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'pie' ? 'all' : 'pie')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'pie'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Pie Diagram
                </button>
              </>
            )}

            {(selectedCategory === 'all' || selectedCategory === 'grouped') && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'histogram' ? 'all' : 'histogram')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'histogram'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Histogram
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'polygon' ? 'all' : 'polygon')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'polygon'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Frequency Polygon
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGraphType(selectedGraphType === 'curve' ? 'all' : 'curve')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    selectedGraphType === 'curve'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  Frequency Curve
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Underlying Grouped Frequency Distribution Table (Expandable) */}
      {showFrequencyTable && (
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider block">
                Continuous Grouped Frequency Distribution Table
              </span>
              <span className="text-[11px] text-[#64748B]">
                Class intervals, midpoints ($x_i$), frequencies ($f_i$) and products ($f_i \\cdot x_i$)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F172A]">
              Σ f = {paneData.stats.sampleSize}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-xs text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold text-[10px] uppercase">
                  <th className="py-2 px-3">Class Interval [a - b)</th>
                  <th className="py-2 px-3">Midpoint (xᵢ)</th>
                  <th className="py-2 px-3">Frequency (fᵢ)</th>
                  <th className="py-2 px-3">Relative Freq (%)</th>
                  <th className="py-2 px-3">Cumulative (cf)</th>
                  <th className="py-2 px-3 text-right">Product (fᵢ · xᵢ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paneData.bins.map((bin, i) => (
                  <tr key={i} className="hover:bg-white transition">
                    <td className="py-2 px-3 font-semibold text-[#0F172A]">{bin.interval}</td>
                    <td className="py-2 px-3 font-mono text-[#64748B]">{bin.midpoint}</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0F172A]">{bin.frequency}</td>
                    <td className="py-2 px-3 font-mono text-[#64748B]">{bin.relativeFreq}%</td>
                    <td className="py-2 px-3 font-mono text-[#64748B]">{bin.cumFreq}</td>
                    <td className="py-2 px-3 font-mono text-right text-[#0F172A]">{bin.fx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Chart Display Area */}
      {selectedGraphType !== 'all' ? (
        /* Single Selected Graph Type */
        <div className="p-2">
          {selectedGraphType === 'line' && renderLineGraph()}
          {selectedGraphType === 'bar' && renderBarGraph()}
          {selectedGraphType === 'pie' && renderPieDiagram()}
          {selectedGraphType === 'histogram' && renderHistogram()}
          {selectedGraphType === 'polygon' && renderFrequencyPolygon()}
          {selectedGraphType === 'curve' && renderFrequencyCurve()}
        </div>
      ) : selectedCategory === 'ungrouped' ? (
        /* All 3 Ungrouped Data Graphs */
        <div className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-2">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">
              Category 1: Ungrouped Data Representations
            </h4>
            <p className="text-xs text-[#64748B]">
              Observations recorded individually as discrete units without classification into intervals.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">{renderLineGraph()}</div>
            <div className="space-y-4">{renderBarGraph()}</div>
            <div className="lg:col-span-2">{renderPieDiagram()}</div>
          </div>
        </div>
      ) : selectedCategory === 'grouped' ? (
        /* All 3 Grouped Data Graphs */
        <div className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-2">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">
              Category 2: Grouped Data Representations
            </h4>
            <p className="text-xs text-[#64748B]">
              Observations classified into continuous class intervals to analyze frequency distributions.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">{renderHistogram()}</div>
            <div className="space-y-4">{renderFrequencyPolygon()}</div>
            <div className="lg:col-span-2">{renderFrequencyCurve()}</div>
          </div>
        </div>
      ) : (
        /* Full Comparison: All 6 Graphical Types from the Infographic */
        <div className="space-y-8">
          {/* Section 1: Ungrouped Data */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold">1</span>
                  <span>Ungrouped Data Representations</span>
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Line Graph, Bar Graph, and Pie Diagram / Circle Graph
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>{renderLineGraph()}</div>
              <div>{renderBarGraph()}</div>
              <div>{renderPieDiagram()}</div>
            </div>
          </div>

          {/* Section 2: Grouped Data */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold">2</span>
                  <span>Grouped Data Representations</span>
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Histogram (gap = 0), Frequency Polygon (midpoint vertices), and Frequency Curve (smooth spline)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>{renderHistogram()}</div>
              <div>{renderFrequencyPolygon()}</div>
              <div>{renderFrequencyCurve()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
