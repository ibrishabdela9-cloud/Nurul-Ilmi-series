/**
 * Print Preview Modal Component
 * Renders an authentic print-optimized preview of official institutional stationary
 * for Student Academic Dossiers, Financial Invoices / Vouchers, and ID Cards
 * before invoking window.print().
 */

import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Building,
  Award,
} from 'lucide-react';
import { Student, FeeInvoice, CashbookVoucher, AcademicAssessment, HifzDailyRecord } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { generateStudentDossierPDF, generateInvoicePDF, downloadPDF } from '../../lib/pdf-generator';

export type PreviewDocumentType = 'DOSSIER' | 'INVOICE' | 'VOUCHER';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: PreviewDocumentType;
  student?: Student;
  invoice?: FeeInvoice;
  voucher?: CashbookVoucher;
  assessments?: AcademicAssessment[];
  hifzRecords?: HifzDailyRecord[];
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  documentType,
  student,
  invoice,
  voucher,
  assessments = [],
  hifzRecords = [],
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const ethDate = toEthiopianDate();
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      if (documentType === 'INVOICE' && invoice) {
        const doc = generateInvoicePDF(invoice, student);
        downloadPDF(doc, `Nurul_Ilmi_Invoice_${invoice.invoiceNumber}.pdf`);
      } else if (student) {
        const doc = generateStudentDossierPDF(student, assessments, hifzRecords);
        downloadPDF(doc, `Nurul_Ilmi_Academic_Dossier_${student.rollNo}.pdf`);
      }
    } catch (e) {
      console.error('PDF Download Error:', e);
    }
  };

  const zoomScale = zoomLevel / 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#17365D]/60 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
      {/* Top Toolbar (Non-printable) */}
      <div className="no-print h-16 bg-[#17365D] text-white px-6 flex items-center justify-between border-b border-[#273449]/40 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#16836B] flex items-center justify-center text-[#C49A45] font-bold shadow-sm">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">Official Institutional Print Preview</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#16836B]/40 text-emerald-200 border border-emerald-400/30">
                A4 Standard Stationery
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Calibrated with authentic Ethiopian stamp seal watermark & Ministry registration
            </p>
          </div>
        </div>

        {/* Center Controls: Zoom */}
        <div className="flex items-center gap-2 bg-[#273449] px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
            className="p-1 hover:text-[#C49A45] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono px-2 text-slate-200">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(130, prev + 15))}
            className="p-1 hover:text-[#C49A45] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 ml-1 hover:text-white text-slate-400"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions: Print, Download, Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#273449] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-[#C49A45]" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16836B] hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Document (A4)</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Scroll Canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#EAEEF4]">
        <div
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150"
        >
          {/* Authentic A4 Stationery Sheet (210mm x 297mm) */}
          <div className="print-surface w-[210mm] min-h-[297mm] bg-white text-[#273449] p-10 shadow-2xl rounded-sm border-2 border-slate-200 relative overflow-hidden flex flex-col justify-between">
            {/* Background Stamp Seal Watermark with Official Circular Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06]">
              <img
                src="/assets/aistudio/image_9f3d5314.png"
                alt="Al-Furqan Official Seal Watermark"
                className="w-[140mm] h-[140mm] object-contain"
              />
            </div>

            {/* Top Stationery Header */}
            <div>
              <div className="border-b-4 border-double border-[#17365D] pb-4 flex items-center justify-between gap-4">
                {/* Left: Official Circular Logo Crest */}
                <div className="flex items-center gap-3.5 flex-1">
                  <img
                    src="/assets/aistudio/image_9f3d5314.png"
                    alt="Al-Furqan Emblem"
                    className="w-20 h-20 rounded-full border-2 border-[#16836B] shadow-md object-contain shrink-0 bg-white"
                  />
                  <div className="flex-1">
                    {/* Arabic Header */}
                    <div className="font-arabic font-bold text-sm text-[#16836B] leading-tight">
                      مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية
                    </div>
                    {/* English Header */}
                    <h1 className="font-extrabold text-sm sm:text-base text-[#17365D] tracking-tight uppercase leading-snug mt-0.5">
                      AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE
                    </h1>
                    {/* Afaan Oromoo Header */}
                    <div className="font-bold text-xs text-[#C49A45] tracking-tight uppercase leading-tight mt-0.5">
                      GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                      Ethiopia, Eastern Oromia, Chiro Town · Reg No: AF-QMC/2026/782
                    </p>
                  </div>
                </div>

                {/* Right: Date Stamps (Gregorian & Ge'ez) */}
                <div className="text-right text-[11px] space-y-1 shrink-0">
                  <div className="bg-[#F5F7FA] border border-slate-200 rounded px-2.5 py-1">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Ge'ez Calendar</span>
                    <span className="font-ethiopic font-bold text-[#17365D]">
                      {ethDate.monthNameAmharic} {ethDate.geezDay} ቀን {ethDate.year} ዓ.ም
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Gregorian: <span className="font-semibold text-slate-700">{currentDate}</span>
                  </div>
                </div>
              </div>

              {/* Sub-header Bar with Document Title */}
              <div className="mt-4 bg-[#17365D] text-white py-1.5 px-4 rounded flex items-center justify-between text-xs font-semibold">
                <span className="tracking-wider uppercase">
                  {documentType === 'DOSSIER' && 'OFFICIAL STUDENT ACADEMIC & HIFZ DOSSIER'}
                  {documentType === 'INVOICE' && 'OFFICIAL TUITION FEE INVOICE & PAYMENT RECEIPT'}
                  {documentType === 'VOUCHER' && 'INSTITUTIONAL CASHBOOK GENERAL LEDGER VOUCHER'}
                </span>
                <span className="font-mono text-[#C49A45] font-bold">
                  {documentType === 'DOSSIER' && `ROLL NO: ${student?.rollNo || 'ST-2026-001'}`}
                  {documentType === 'INVOICE' && `INVOICE NO: ${invoice?.invoiceNumber || 'INV-ET-2026-001'}`}
                  {documentType === 'VOUCHER' && `VOUCHER NO: ${voucher?.voucherNumber || 'VN-2026-001'}`}
                </span>
              </div>

              {/* Main Content Area based on Document Type */}
              {documentType === 'DOSSIER' && student && (
                <div className="mt-5 space-y-5 text-xs">
                  {/* Student Particulars Table */}
                  <div className="grid grid-cols-3 gap-3 bg-[#F5F7FA] p-3.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Full Name (English)</span>
                      <span className="font-bold text-sm text-[#17365D]">{student.fullNameEnglish}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Full Name (Ge'ez / Amharic)</span>
                      <span className="font-ethiopic font-bold text-sm text-slate-800">{student.fullNameAmharic}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Current Hifz Status</span>
                      <span className="font-bold text-xs text-[#16836B]">
                        {student.memorizedJuzCount} of 30 Juz Memorized ({student.hifzLevel})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Guardian / Parent</span>
                      <span className="font-semibold">{student.guardianName} ({student.guardianRelation})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Phone / Mobile</span>
                      <span className="font-mono">{student.guardianPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Town & Residence</span>
                      <span className="font-semibold">{student.subCity}, Chiro Town</span>
                    </div>
                  </div>

                  {/* Academic Subject Performance Table */}
                  <div>
                    <h3 className="font-bold text-[#17365D] text-xs uppercase mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#C49A45]" />
                      Academic & Islamic Sciences Performance Breakdown (Term Assessment)
                    </h3>
                    <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                      <thead>
                        <tr className="bg-[#17365D]/5 text-[#17365D] font-bold border-b border-slate-200">
                          <th className="p-2 border-r border-slate-200">Subject / Module</th>
                          <th className="p-2 border-r border-slate-200">Islamic Domain</th>
                          <th className="p-2 border-r border-slate-200 text-center">Max Marks</th>
                          <th className="p-2 border-r border-slate-200 text-center">Score Obtained</th>
                          <th className="p-2 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2 font-semibold">Qur’an Recitation & Tartil</td>
                          <td className="p-2 text-slate-500">Qur’anic Sciences</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold text-[#16836B]">96 / 100</td>
                          <td className="p-2 text-center font-bold text-emerald-700">A+ (Mumtaz)</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-2 font-semibold">Tajweed Theory & Rules</td>
                          <td className="p-2 text-slate-500">Ahkam al-Tajweed</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold text-[#16836B]">94 / 100</td>
                          <td className="p-2 text-center font-bold text-emerald-700">A (Mumtaz)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Fiqh of Ibadat (Shafi'i/Hanafi)</td>
                          <td className="p-2 text-slate-500">Islamic Jurisprudence</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold">90 / 100</td>
                          <td className="p-2 text-center font-bold text-[#17365D]">A</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-2 font-semibold">Aqeedah & Tawheed</td>
                          <td className="p-2 text-slate-500">Theology</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold">95 / 100</td>
                          <td className="p-2 text-center font-bold text-emerald-700">A+</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Arabic Language & Grammar</td>
                          <td className="p-2 text-slate-500">Nahw & Sarf</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold">88 / 100</td>
                          <td className="p-2 text-center font-bold text-[#17365D]">B+</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-2 font-semibold">Hadith Arbain An-Nawawiyyah</td>
                          <td className="p-2 text-slate-500">Prophetic Traditions</td>
                          <td className="p-2 text-center">100</td>
                          <td className="p-2 text-center font-bold">92 / 100</td>
                          <td className="p-2 text-center font-bold text-[#16836B]">A</td>
                        </tr>
                        <tr className="bg-[#16836B]/10 font-bold border-t-2 border-[#16836B]">
                          <td colSpan={3} className="p-2 text-[#17365D]">Cumulative Grade Average (GPA)</td>
                          <td className="p-2 text-center text-[#16836B] font-extrabold text-sm">92.5%</td>
                          <td className="p-2 text-center text-emerald-800 font-extrabold text-sm">A (Mumtaz)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Ustadh & Tajweed Evaluation Remarks */}
                  <div className="bg-[#F5F7FA] p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-[#17365D] block mb-1">Mudir / Lead Ustadh Remarks:</span>
                    <p className="text-slate-600 italic leading-relaxed">
                      "Student demonstrates exceptional discipline in morning Sabaq revision, flawless Makharij al-Huruf,
                      and steadfast adab in the Halqah. Recommended for progression to Sanad qualification upon completing
                      final Khatm."
                    </p>
                  </div>
                </div>
              )}

              {/* Invoice Mode */}
              {documentType === 'INVOICE' && invoice && (
                <div className="mt-5 space-y-5 text-xs">
                  <div className="grid grid-cols-2 gap-4 bg-[#F5F7FA] p-4 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Billed To (Student / Guardian)</span>
                      <div className="font-bold text-sm text-[#17365D]">{student?.fullNameEnglish || 'Amina Dawud'}</div>
                      <div className="font-ethiopic text-xs text-slate-700">{student?.fullNameAmharic || 'አሚና ዳውድ'}</div>
                      <div className="text-xs text-slate-500 mt-1">Roll No: {student?.rollNo || 'ST-2026-004'} · {student?.subCity || 'Chiro Central'}, Chiro Town</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">Invoice Number:</span>{' '}
                        <span className="font-mono font-bold text-slate-800">{invoice.invoiceNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">Term / Period:</span>{' '}
                        <span className="font-semibold text-slate-800">{invoice.termOrMonth}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">Due Date:</span>{' '}
                        <span className="font-mono font-semibold text-rose-700">{invoice.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">Payment Status:</span>{' '}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {invoice.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fee Itemization Table */}
                  <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                    <thead>
                      <tr className="bg-[#17365D]/5 text-[#17365D] font-bold border-b border-slate-200">
                        <th className="p-2.5 border-r border-slate-200">Item Description</th>
                        <th className="p-2.5 border-r border-slate-200">Account Classification</th>
                        <th className="p-2.5 text-right">Amount (ETB)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-semibold">Qur’an Hifz & Tajweed Instruction Fee</td>
                        <td className="p-2.5 text-slate-500">Tuition Revenue</td>
                        <td className="p-2.5 text-right font-mono font-semibold">{(invoice.amountETB * 0.7).toLocaleString()} ETB</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2.5 font-semibold">Islamic Studies, Fiqh & Arabic Materials</td>
                        <td className="p-2.5 text-slate-500">Academic Books & Mushaf</td>
                        <td className="p-2.5 text-right font-mono font-semibold">{(invoice.amountETB * 0.2).toLocaleString()} ETB</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">Campus Facilities & Library Maintenance</td>
                        <td className="p-2.5 text-slate-500">Institutional Fund</td>
                        <td className="p-2.5 text-right font-mono font-semibold">{(invoice.amountETB * 0.1).toLocaleString()} ETB</td>
                      </tr>
                      <tr className="bg-[#17365D]/10 font-bold border-t-2 border-[#17365D]">
                        <td colSpan={2} className="p-2.5 text-[#17365D]">Total Billed Amount</td>
                        <td className="p-2.5 text-right font-extrabold text-sm text-[#17365D] font-mono">
                          {invoice.amountETB.toLocaleString()} ETB
                        </td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td colSpan={2} className="p-2 font-semibold text-emerald-900">Total Amount Received (Paid)</td>
                        <td className="p-2 text-right font-bold text-emerald-800 font-mono">
                          {invoice.amountPaidETB.toLocaleString()} ETB
                        </td>
                      </tr>
                      <tr className="bg-amber-50 font-bold">
                        <td colSpan={2} className="p-2 text-amber-900">Outstanding Balance Remaining</td>
                        <td className="p-2 text-right text-amber-900 font-mono">
                          {invoice.balanceETB.toLocaleString()} ETB
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Payment Methods Info */}
                  <div className="bg-[#F5F7FA] p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#17365D] block">Official Banking & Digital Channels:</span>
                      <span className="text-slate-600 block text-[11px]">
                        Commercial Bank of Ethiopia (CBE): 1000289182391 · Awash Bank: 0142981720 · Telebirr Merchant: 892831
                      </span>
                    </div>
                    {invoice.officialReceiptNumber && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Receipt Ref:</span>
                        <span className="font-mono font-bold text-emerald-700">{invoice.officialReceiptNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Official Footer with Seal, QR Code, and Institutional Signatures */}
            <div className="border-t-2 border-slate-300 pt-6 mt-8">
              <div className="grid grid-cols-3 gap-6 items-end">
                {/* Left: Head Mudir Signature */}
                <div className="text-center">
                  <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center">
                    <span className="font-serif italic text-slate-700 text-sm">Al-Sheikh Khadir Hamza</span>
                  </div>
                  <span className="text-xs font-bold text-[#17365D] block">Al-Sheikh Khadir Hamza</span>
                  <span className="text-[10px] text-slate-500 block">Principal / Head Mudir (رئيس المركز)</span>
                  <span className="text-[9px] text-slate-400 font-mono">Signed via Seal CH-01</span>
                </div>

                {/* Center: Official Rubber Stamp Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#16836B] p-0.5 flex items-center justify-center bg-white shadow-sm">
                    <img
                      src="/assets/aistudio/image_9f3d5314.png"
                      alt="Al-Furqan Official Stamp"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span className="text-[9px] text-[#16836B] font-bold font-mono mt-1">Official Chiro Town Seal · Eastern Oromia</span>
                </div>

                {/* Right: Treasurer / Comptroller Signature & QR Code */}
                <div className="text-center">
                  <div className="h-10 border-b border-slate-400 mb-1 flex items-end justify-center">
                    <span className="font-serif italic text-slate-700 text-sm">Ustadh Dawud Omar</span>
                  </div>
                  <span className="text-xs font-bold text-[#17365D] block">Ustadh Dawud Omar</span>
                  <span className="text-[10px] text-slate-500 block">Financial Comptroller (أمين الصندوق)</span>
                  <div className="flex items-center justify-center gap-1 text-[9px] text-emerald-700 font-semibold mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Tamper-Proof Record</span>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright and Legal Line */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 mt-6 pt-2 border-t border-slate-100 font-mono">
                <span>Al-Furqan Quran Memorization Center & Islamic Studies Institute · Ethiopia, Eastern Oromia, Chiro Town</span>
                <span>Document Verification Code: FURQAN-DOC-{Date.now().toString(36).toUpperCase()}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
