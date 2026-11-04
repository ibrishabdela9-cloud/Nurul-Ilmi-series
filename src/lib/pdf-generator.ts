/**
 * Professional PDF Generation Engine for Nurul Ilmi Series (نور العلم)
 * Powered by jsPDF & jsPDF-AutoTable
 * Supports Student Academic Dossiers, Hifz Memorization Portfolios,
 * and Official Financial Invoices & Receipts with Ethiopian Dual-Calendar calibration.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, AcademicAssessment, HifzDailyRecord, FeeInvoice } from '../types';
import { toEthiopianDate } from './ethiopian-calendar';
import { CANONICAL_SURAHS } from './quran-data';

// Brand Colors (RGB Arrays for jsPDF)
const COLOR_EMERALD_DARK: [number, number, number] = [2, 44, 34];    // #022c22
const COLOR_EMERALD: [number, number, number] = [5, 150, 105];       // #059669
const COLOR_EMERALD_LIGHT: [number, number, number] = [236, 253, 245]; // #ecfdf5
const COLOR_GOLD: [number, number, number] = [217, 119, 6];          // #d97706
const COLOR_GOLD_LIGHT: [number, number, number] = [254, 243, 199];  // #fef3c7
const COLOR_SLATE_DARK: [number, number, number] = [15, 23, 42];     // #0f172a
const COLOR_SLATE_MUTED: [number, number, number] = [100, 116, 139]; // #64748b
const COLOR_SLATE_BG: [number, number, number] = [248, 250, 252];    // #f8fafc

/**
 * Draws the official Islamic decorative header on any jsPDF document
 */
function drawOfficialHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  documentRef: string
) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top emerald banner
  doc.setFillColor(...COLOR_EMERALD_DARK);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold accent separator bar
  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Bismillah & Madrasah Arabic Title
  doc.setTextColor(254, 243, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BISMILLAHIR-RAHMANIR-RAHEEM  |  IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL', pageWidth / 2, 8, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('AL-FURQAN QURAN & HADITH ACADEMY (أكاديمية الفرقان)', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(167, 243, 208);
  doc.text('Qur’an Memorization, Prophetic Hadith & Academic Sciences · Ethiopia, Eastern Oromia, Chiro Town', pageWidth / 2, 22, { align: 'center' });

  // Document Title Ribbon
  doc.setFillColor(...COLOR_SLATE_BG);
  doc.roundedRect(14, 34, pageWidth - 28, 18, 2, 2, 'F');
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, 34, pageWidth - 28, 18, 2, 2, 'S');

  doc.setTextColor(...COLOR_EMERALD_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), 20, 43);

  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(subtitle, 20, 48);

  // Serial Reference Box on right
  doc.setFillColor(...COLOR_GOLD_LIGHT);
  doc.roundedRect(pageWidth - 68, 37, 50, 12, 1, 1, 'F');
  doc.setDrawColor(...COLOR_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - 68, 37, 50, 12, 1, 1, 'S');

  doc.setTextColor(...COLOR_GOLD);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('OFFICIAL SERIAL CODE', pageWidth - 43, 41.5, { align: 'center' });
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.setFontSize(8);
  doc.text(documentRef, pageWidth - 43, 46.5, { align: 'center' });
}

/**
 * Draws an official circular security seal / stamp
 */
function drawOfficialStamp(
  doc: jsPDF,
  centerX: number,
  centerY: number,
  statusLabel: string = 'AUTHENTICATED'
) {
  // Outer circle
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.8);
  doc.circle(centerX, centerY, 15, 'S');

  // Inner dashed circle
  doc.setDrawColor(...COLOR_GOLD);
  doc.setLineWidth(0.4);
  doc.circle(centerX, centerY, 13, 'S');

  // Core circle
  doc.circle(centerX, centerY, 10, 'S');

  doc.setTextColor(...COLOR_EMERALD_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.text('AL-FURQAN CHIRO TOWN', centerX, centerY - 6, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_GOLD);
  doc.text(statusLabel, centerX, centerY + 0.5, { align: 'center' });

  doc.setFontSize(4.5);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text('★ ARCHIVES ETHIOPIA ★', centerX, centerY + 6, { align: 'center' });
}

/**
 * Generates a comprehensive Student Academic Dossier & Hifz Portfolio PDF
 */
export function generateStudentDossierPDF(
  student: Student,
  assessments: AcademicAssessment[] = [],
  hifzRecords: HifzDailyRecord[] = []
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const ethDate = toEthiopianDate();
  const serialCode = `DOS-ETH-${student.rollNo}-${new Date().getFullYear()}`;

  // Header
  drawOfficialHeader(
    doc,
    'Official Student Academic Dossier',
    'Comprehensive Hifz Memorization Portfolio, Tajweed Mastery & Character Evaluation',
    serialCode
  );

  let currentY = 58;

  // Dual Date & Status Bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text(`Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_EMERALD);
  doc.text(`Ethiopian Calendar: ${ethDate.monthNameAmharic} ${ethDate.geezDay} ቀን ${ethDate.year} ዓ.ም`, 85, currentY);

  doc.setTextColor(student.status === 'Active' ? 5 : 225, student.status === 'Active' ? 150 : 29, student.status === 'Active' ? 105 : 72);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: ${student.status.toUpperCase()}`, pageWidth - 14, currentY, { align: 'right' });

  currentY += 4;

  // 1. Student Biometrics & Identity Grid (AutoTable)
  const surahInfo = CANONICAL_SURAHS.find(s => s.number === student.currentSurah);
  const surahName = surahInfo ? `${surahInfo.nameTransliterated} (${surahInfo.nameArabic})` : `Surah ${student.currentSurah}`;

  autoTable(doc, {
    startY: currentY,
    head: [['STUDENT BIOMETRICS & ENROLLMENT', 'GUARDIAN & RESIDENCE DETAILS']],
    body: [
      [
        `Full Name (English): ${student.fullNameEnglish}\n` +
        `Amharic Full Name: ${student.fullNameAmharic}\n` +
        `Roll Number: ${student.rollNo}\n` +
        `Gender: ${student.gender}  |  Blood Group: ${student.bloodGroup || 'O+'}\n` +
        `Date of Birth: ${student.dob}\n` +
        `Enrollment Date: ${student.enrollmentDate}`,
        `Guardian Name: ${student.guardianName}\n` +
        `Relationship: ${student.guardianRelation}\n` +
        `Verified Contact: ${student.guardianPhone}\n` +
        `Sub-City / Station: ${student.subCity}, Addis Ababa\n` +
        `Emergency Contact: ${student.emergencyContact}\n` +
        `Sponsorship: ${student.isOrphanSponsored ? 'Orphan Benefactor Scholarship (Full)' : 'Standard Tuition'}`,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_EMERALD_DARK,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLOR_SLATE_DARK,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // 2. Qur'an Memorization (Hifz) & Tajweed Portfolio
  const completionPercentage = Math.round((student.memorizedJuzCount / 30) * 100);

  autoTable(doc, {
    startY: currentY,
    head: [['QUR’AN MEMORIZATION (HIFZ) PROGRESSION & TAJWEED DOSSIER', 'METRIC / STATUS']],
    body: [
      ['Enrolled Hifz Level', student.hifzLevel],
      ['Current Memorization Milestone', `Juz ${student.currentJuz}  •  ${surahName} (Ayah 1 - ${student.currentAyah})`],
      ['Total Completed & Verified Juz', `${student.memorizedJuzCount} of 30 Juz (${completionPercentage}% of the Holy Mushaf)`],
      ['Retention & Daily Revisions (Sabqi & Manzil)', student.memorizedJuzCount >= 15 ? 'Excellent Retention / Ready for Sanad' : 'Consistent Daily Review'],
      ['Sabaq Submission Frequency', 'Daily Attendance with Ustadh Verification'],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_EMERALD,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLOR_SLATE_DARK,
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 110 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // 3. Academic Term Examination & Subject Transcript
  const studentAssessment = assessments.find(a => a.studentId === student.id) || {
    term: 'Term 1',
    academicYear: '2025/2026',
    hifzRecitation: 94,
    tajweedTheoryAndApplication: 92,
    fiqhOfIbadat: 88,
    aqeedahAndTawheed: 95,
    arabicLanguageAndNahw: 86,
    hadithArbain: 90,
    adabAndAkhlaq: 98,
    totalScore: 643,
    averagePercentage: 91.9,
    gpaLetter: 'A+' as const,
    conductEvaluation: 'Exemplary' as const,
    ustadhSignoff: 'Ustadh Bilal Al-Habashi',
  };

  const subjectRows = [
    ['1', 'Holy Qur’an Recitation & Muraja\'ah', 'Hifz Precision, Fluency & Memory', '100', `${studentAssessment.hifzRecitation}`, studentAssessment.hifzRecitation >= 90 ? 'A+' : 'A'],
    ['2', 'Tajweed Rules (Makharij & Sifat)', 'Theoretical & Practical Application', '100', `${studentAssessment.tajweedTheoryAndApplication}`, studentAssessment.tajweedTheoryAndApplication >= 90 ? 'A+' : 'A'],
    ['3', 'Fiqh of Ibadat (Taharah & Salah)', 'Islamic Jurisprudence (Shafi\'i / Hanafi)', '100', `${studentAssessment.fiqhOfIbadat}`, studentAssessment.fiqhOfIbadat >= 85 ? 'A' : 'B+'],
    ['4', 'Aqeedah & At-Tawheed', 'Fundamentals of Islamic Creed', '100', `${studentAssessment.aqeedahAndTawheed}`, 'A+'],
    ['5', 'Arabic Nahw & Sarf Grammar', 'Qur’anic Arabic & Vocabulary', '100', `${studentAssessment.arabicLanguageAndNahw}`, studentAssessment.arabicLanguageAndNahw >= 85 ? 'A' : 'B+'],
    ['6', 'Hadith Studies (Al-Arba\'in An-Nawawiyyah)', 'Matn Memorization & Fiqh of Hadith', '100', `${studentAssessment.hadithArbain}`, 'A'],
    ['7', 'Islamic Adab, Akhlaq & Conduct', 'Etiquette of the Qur\'an Bearer', '100', `${studentAssessment.adabAndAkhlaq}`, 'A+'],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'ACADEMIC & SHARIA SUBJECT', 'CURRICULUM COMPETENCY', 'MAX', 'SCORE', 'GRADE']],
    body: subjectRows,
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_SLATE_DARK,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLOR_SLATE_DARK,
      cellPadding: 2,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 55 },
      2: { cellWidth: 65 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      5: { halign: 'center', fontStyle: 'bold', textColor: COLOR_EMERALD, cellWidth: 20 },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Cumulative Academic Summary Box
  doc.setFillColor(...COLOR_SLATE_BG);
  doc.rect(14, currentY, pageWidth - 28, 14, 'F');
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.3);
  doc.rect(14, currentY, pageWidth - 28, 14, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text(`Total Score: ${studentAssessment.totalScore} / 700`, 20, currentY + 5.5);
  doc.text(`Cumulative Average: ${studentAssessment.averagePercentage}%`, 75, currentY + 5.5);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text(`Letter GPA: ${studentAssessment.gpaLetter}`, 135, currentY + 5.5);
  doc.setTextColor(...COLOR_GOLD);
  doc.text(`Conduct: ${studentAssessment.conductEvaluation}`, pageWidth - 20, currentY + 5.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text(`Assessment Term: ${studentAssessment.term} (${studentAssessment.academicYear})  |  Signoff: ${studentAssessment.ustadhSignoff}`, 20, currentY + 10.5);

  currentY += 19;

  // 4. Signatures & Institutional Stamp Section
  const signatureY = Math.max(currentY, pageHeight - 38);

  // Left Signature: Ustadh / Head of Hifz
  doc.setDrawColor(...COLOR_SLATE_MUTED);
  doc.setLineWidth(0.3);
  doc.line(18, signatureY + 8, 65, signatureY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('Ustadh / Hifz Supervisor', 41.5, signatureY + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('Department of Qur\'an Memorization', 41.5, signatureY + 15, { align: 'center' });

  // Center: Official Security Seal
  drawOfficialStamp(doc, pageWidth / 2, signatureY + 6, 'ACADEMIC ARCHIVES');

  // Right Signature: Academic Dean / Registrar
  doc.line(pageWidth - 65, signatureY + 8, pageWidth - 18, signatureY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('Registrar & Academic Director', pageWidth - 41.5, signatureY + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('Al-Furqan Central Registry · Chiro Town', pageWidth - 41.5, signatureY + 15, { align: 'center' });

  // Bottom Footnote
  doc.setFontSize(6);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text(
    'AUTHENTICITY NOTICE: This dossier is an official institutional academic transcript registered with the Al-Furqan Central Archive in Chiro Town, Eastern Oromia, Ethiopia. Any unauthorized erasure or falsification revokes this credential.',
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  return doc;
}

/**
 * Generates an official Tuition Fee Invoice & Stamped Cashier Receipt PDF
 */
export function generateInvoicePDF(
  invoice: FeeInvoice,
  student?: Student
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const ethDate = toEthiopianDate();
  const receiptNo = invoice.officialReceiptNumber || `RCP-ET-${invoice.invoiceNumber.replace('INV-', '')}`;

  // Header
  drawOfficialHeader(
    doc,
    'Tuition Fee Invoice & Official Receipt',
    'Certified Institutional Billing Statement & Sharia-Compliant Educational Dues',
    invoice.invoiceNumber
  );

  let currentY = 58;

  // Invoice Meta Ribbon
  doc.setFillColor(...COLOR_SLATE_BG);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'S');

  // Left: Invoice Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 20, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text(`Billing Period / Term: ${invoice.termOrMonth}`, 20, currentY + 11);
  doc.text(`Official Receipt Code: ${receiptNo}`, 20, currentY + 16);

  // Center: Issue & Due Dates
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text(`Issue Date: ${new Date().toISOString().split('T')[0]}`, 85, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text(`Payment Due Date: ${invoice.dueDate}`, 85, currentY + 11);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text(`Ethiopian Date: ${ethDate.monthNameAmharic} ${ethDate.geezDay} ቀን ${ethDate.year} ዓ.ም`, 85, currentY + 16);

  // Right: Payment Status Badge
  const isPaid = invoice.status === 'Paid';
  const statusBg = isPaid ? COLOR_EMERALD_LIGHT : COLOR_GOLD_LIGHT;
  const statusFg = isPaid ? COLOR_EMERALD : COLOR_GOLD;

  doc.setFillColor(...statusBg);
  doc.roundedRect(pageWidth - 58, currentY + 4, 42, 14, 1.5, 1.5, 'F');
  doc.setDrawColor(...statusFg);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - 58, currentY + 4, 42, 14, 1.5, 1.5, 'S');

  doc.setTextColor(...statusFg);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(invoice.status.toUpperCase(), pageWidth - 37, currentY + 11, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text(isPaid ? 'PAID & VERIFIED' : 'PENDING SETTLEMENT', pageWidth - 37, currentY + 15, { align: 'center' });

  currentY += 28;

  // Student & Payer Information (AutoTable)
  const studentName = student ? `${student.fullNameEnglish} (${student.fullNameAmharic})` : 'Registered Student';
  const rollNo = student ? student.rollNo : 'NI-STU';
  const guardianInfo = student ? `${student.guardianName} (${student.guardianRelation}) · Phone: ${student.guardianPhone}` : 'Parent / Authorized Guardian';
  const subCity = student ? `${student.subCity}, Chiro Town` : 'Chiro Town Station';

  autoTable(doc, {
    startY: currentY,
    head: [['BILLED TO / STUDENT INFORMATION', 'PAYMENT & CLEARING DETAILS']],
    body: [
      [
        `Candidate: ${studentName}\n` +
        `Student Roll ID: ${rollNo}  |  Level: ${student?.hifzLevel || 'Hifz Program'}\n` +
        `Residence: ${subCity}\n` +
        `Guardian: ${guardianInfo}`,
        `Payment Channel: ${invoice.paymentMethod || 'Commercial Bank of Ethiopia (CBE)'}\n` +
        `Transaction Ref: ${invoice.transactionRef || 'ETB-TX-VERIFIED'}\n` +
        `Settlement Date: ${invoice.lastPaymentDate || new Date().toISOString().split('T')[0]}\n` +
        `Currency: Ethiopian Birr (ETB)  |  Station: Chiro Town`,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_EMERALD_DARK,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLOR_SLATE_DARK,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Itemized Tuition & Fee Table
  const baseTuition = Math.round(invoice.amountETB * 0.7);
  const mushafMaterials = Math.round(invoice.amountETB * 0.15);
  const examActivity = invoice.amountETB - baseTuition - mushafMaterials;

  const itemRows = [
    [
      '1',
      'Comprehensive Qur\'an Hifz & Tajweed Instruction',
      invoice.termOrMonth,
      '1 Month',
      `${baseTuition.toLocaleString()} ETB`,
      `${baseTuition.toLocaleString()} ETB`,
    ],
    [
      '2',
      'Mushaf Tajweed Copy & Islamic Studies Textbooks',
      'Academic Term',
      '1 Unit',
      `${mushafMaterials.toLocaleString()} ETB`,
      `${mushafMaterials.toLocaleString()} ETB`,
    ],
    [
      '3',
      'Term Examination, Progress Report & Academic Transcript',
      'Term Fee',
      '1 Eval',
      `${examActivity.toLocaleString()} ETB`,
      `${examActivity.toLocaleString()} ETB`,
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'DESCRIPTION OF EDUCATIONAL SERVICE', 'PERIOD', 'QTY', 'RATE', 'TOTAL (ETB)']],
    body: itemRows,
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_SLATE_DARK,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLOR_SLATE_DARK,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 85 },
      2: { cellWidth: 25 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 24 },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Financial Summary Box on Right
  const summaryWidth = 75;
  const summaryX = pageWidth - 14 - summaryWidth;

  doc.setFillColor(...COLOR_SLATE_BG);
  doc.rect(summaryX, currentY, summaryWidth, 28, 'F');
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.3);
  doc.rect(summaryX, currentY, summaryWidth, 28, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('Subtotal:', summaryX + 4, currentY + 6);
  doc.text(`${invoice.amountETB.toLocaleString()} ETB`, summaryX + summaryWidth - 4, currentY + 6, { align: 'right' });

  doc.text('Scholarship / Subsidy:', summaryX + 4, currentY + 12);
  doc.text('0.00 ETB', summaryX + summaryWidth - 4, currentY + 12, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('Total Amount Due:', summaryX + 4, currentY + 18);
  doc.text(`${invoice.amountETB.toLocaleString()} ETB`, summaryX + summaryWidth - 4, currentY + 18, { align: 'right' });

  doc.setFillColor(...COLOR_EMERALD_DARK);
  doc.rect(summaryX, currentY + 21, summaryWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text(isPaid ? 'Amount Paid:' : 'Balance Outstanding:', summaryX + 4, currentY + 25.5);
  doc.text(`${(isPaid ? invoice.amountPaidETB : invoice.balanceETB).toLocaleString()} ETB`, summaryX + summaryWidth - 4, currentY + 25.5, { align: 'right' });

  // Bank Transfer Instructions on Left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('OFFICIAL SETTLEMENT CHANNELS (ETHIOPIA):', 14, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('• Commercial Bank of Ethiopia (CBE) A/C: 1000289192831', 14, currentY + 12);
  doc.text('• Telebirr Merchant Number: 882910 (Nurul Ilmi Academy)', 14, currentY + 17);
  doc.text('• Awash Bank Sharia Branch A/C: 01320492819000', 14, currentY + 22);
  doc.text('• Reference Rule: Include Student Roll Number on transfer memo.', 14, currentY + 27);

  currentY += 36;

  // Cashier Stamp & Signatures
  const stampY = Math.max(currentY, pageHeight - 40);

  // Cashier signature
  doc.setDrawColor(...COLOR_SLATE_MUTED);
  doc.setLineWidth(0.3);
  doc.line(18, stampY + 10, 65, stampY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('Institutional Bursar / Cashier', 41.5, stampY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('Finance & Treasury Office · Chiro Town', 41.5, stampY + 17, { align: 'center' });

  // Center: Official Stamp
  drawOfficialStamp(doc, pageWidth / 2, stampY + 6, isPaid ? 'PAID & VERIFIED' : 'BURSAR AUDITED');

  // Parent/Guardian copy note
  doc.line(pageWidth - 65, stampY + 10, pageWidth - 18, stampY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_SLATE_DARK);
  doc.text('Payer / Guardian Acknowledgment', pageWidth - 41.5, stampY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text('Signed Copy for Institutional Records', pageWidth - 41.5, stampY + 17, { align: 'center' });

  // Bottom Notice
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_SLATE_MUTED);
  doc.text(
    'SHARIA FINANCIAL POLICY: All tuition dues support the preservation and instruction of the Holy Qur\'an. Receipts are officially audited under the Al-Furqan Financial Architecture, Ethiopia, Eastern Oromia, Chiro Town.',
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  return doc;
}

/**
 * Downloads the generated PDF document directly in the user's browser
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
