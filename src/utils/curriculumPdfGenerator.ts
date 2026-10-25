import { jsPDF } from 'jspdf';

export interface CurriculumModuleData {
  id: string;
  title: string;
  duration: string;
  summary: string;
  lessons: { title: string; description: string }[];
}

export function generateCurriculumPDF(
  programTitle: string,
  duration: string,
  category: string,
  modules: CurriculumModuleData[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ── HEADER: Deep Tech Navy ──────────────────────────────
  doc.setFillColor(7, 26, 51);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Cyan-Blue Brand Accent Line
  doc.setFillColor(0, 102, 255);
  doc.rect(0, 30, pageWidth, 1.8, 'F');

  // Header Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('ATIDETO TECHNOLOGIES', 15, 13);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(156, 183, 228);
  doc.text('ACADEMY OF SOFTWARE ENGINEERING & INNOVATION', 15, 19);
  doc.text('https://atideto.in  |  admissions@atideto.in', 15, 25);

  // Right Header Stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248);
  doc.text('OFFICIAL CURRICULUM ROADMAP', pageWidth - 15, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 215, 240);
  doc.text('2026 CERTIFIED EDITION', pageWidth - 15, 22, { align: 'right' });

  // ── DOCUMENT TITLE & META ──────────────────────────────
  let y = 41;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(7, 26, 51);
  doc.text(`${programTitle}`, 15, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 115, 140);
  doc.text(
    `Track: ${category || 'Software Engineering'}   |   Duration: ${duration || '12 Weeks (3 Months)'}   |   Format: Live Weekend Sprints + 1:1 Mentorship`,
    15,
    y
  );

  // ── 4 CORE PROGRAM PILLARS ──────────────────────────────
  y += 8;
  doc.setFillColor(245, 249, 255);
  doc.setDrawColor(215, 228, 245);
  doc.roundedRect(15, y, pageWidth - 30, 18, 2.5, 2.5, 'FD');

  const colW = (pageWidth - 30) / 4;
  const pillars = [
    { label: '1-TO-1 MENTORSHIP', desc: 'Weekly senior code reviews' },
    { label: 'PROJECT-BASED LEARNING', desc: '4 Commercial capstone apps' },
    { label: 'CAREER-FOCUSED SKILLS', desc: '120+ Placement network' },
    { label: 'FLEXIBLE LEARNING', desc: 'Structured adaptable sprints' }
  ];

  pillars.forEach((p, idx) => {
    const colX = 15 + idx * colW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 102, 255);
    doc.text(p.label, colX + 4, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(90, 105, 125);
    doc.text(p.desc, colX + 4, y + 13);
  });

  // ── MODULES BREAKDOWN ──────────────────────────────────
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(7, 26, 51);
  doc.text('Comprehensive Technical Syllabus & Learning Modules', 15, y);

  y += 5;

  modules.forEach((m, idx) => {
    if (y > pageHeight - 35) {
      doc.addPage();
      
      // Secondary page mini header
      doc.setFillColor(7, 26, 51);
      doc.rect(0, 0, pageWidth, 14, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`ATIDETO TECHNOLOGIES — ${programTitle} (Continued)`, 15, 9);
      
      doc.setFillColor(0, 102, 255);
      doc.rect(0, 14, pageWidth, 1, 'F');

      y = 22;
    }

    // Module Container Header
    doc.setFillColor(242, 246, 254);
    doc.setDrawColor(220, 228, 242);
    doc.rect(15, y, pageWidth - 30, 7.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 102, 255);
    doc.text(`Module ${String(idx + 1).padStart(2, '0')}:`, 18, y + 5);

    doc.setTextColor(7, 26, 51);
    doc.text(m.title, 38, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 115, 140);
    doc.text(m.duration, pageWidth - 18, y + 5, { align: 'right' });

    y += 8;

    // Lessons list
    m.lessons.forEach((lesson, lIdx) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(0, 102, 255);
      doc.text(`• ${lIdx + 1}.`, 20, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 75, 95);
      doc.text(`${lesson.title} — ${lesson.description}`, 26, y + 4.5, {
        maxWidth: pageWidth - 42
      });

      y += 5.5;
    });

    y += 3;
  });

  // ── CERTIFICATE & VERIFICATION NOTE ────────────────────
  if (y > pageHeight - 40) {
    doc.addPage();
    y = 20;
  } else {
    y += 4;
  }

  doc.setFillColor(245, 248, 254);
  doc.setDrawColor(215, 226, 242);
  doc.roundedRect(15, y, pageWidth - 30, 18, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(7, 26, 51);
  doc.text('CORE DELIVERABLES & CERTIFICATE VERIFICATION:', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(70, 85, 105);
  doc.text('• Industry-grade codebase development, clean architecture, and commercial capstone deployment.', 20, y + 10.5);
  doc.text('• Awarded official Atideto Verified Certificate with QR code authentication upon capstone defense.', 20, y + 14.5);

  // ── FOOTER ──────────────────────────────────────────────
  const footerY = pageHeight - 12;
  doc.setDrawColor(220, 226, 236);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 145, 165);
  doc.text('© 2026 Atideto Technologies Private Limited. Official Engineering Syllabus.', 15, footerY + 5);
  doc.text('Verify Credentials: https://atideto.in/verify', pageWidth - 15, footerY + 5, { align: 'right' });

  // Save the PDF
  const safeTitle = programTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Atideto_${safeTitle}_Curriculum.pdf`);
}
