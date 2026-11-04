/**
 * Module 19: Document & Printing Center
 * Dedicated print layouts for Student ID Cards, Academic Transcripts,
 * and Ethiopian Stamped Receipts with media print optimization.
 */

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  CreditCard,
  Award,
  Users,
  Search,
  CheckCircle2,
  QrCode,
  Download,
  Sparkles,
  Cable,
  FolderDown,
  Terminal,
} from 'lucide-react';
import { AppStoreState, formatEthiopianPhone } from '../../lib/store';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { generateStudentDossierPDF, generateInvoicePDF, downloadPDF } from '../../lib/pdf-generator';
import { generateAndroidUSBPackage, downloadBlob } from '../../lib/android-usb-exporter';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

export const DocumentCenterModule: React.FC<{ state: AppStoreState }> = ({ state }) => {
  const [docType, setDocType] = useState<'ID_CARD' | 'TRANSCRIPT' | 'RECEIPT'>('RECEIPT');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(state.students[0]?.id || '');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(state.invoices[0]?.id || '');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const student = state.students.find(s => s.id === selectedStudentId);
  const invoice = state.invoices.find(i => i.id === selectedInvoiceId);
  const ethDate = toEthiopianDate();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingUsb, setIsExportingUsb] = useState(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  const handleExportUsb = async () => {
    setIsExportingUsb(true);
    try {
      const blob = await generateAndroidUSBPackage();
      downloadBlob(blob, 'NurulIlmi-Android-USB-Kit.zip');
      setPdfToast('NurulIlmi-Android-USB-Kit.zip exported! Ready for USB transfer.');
    } catch (err) {
      console.error('USB Package Export Error:', err);
      setPdfToast('Failed to generate USB package.');
    } finally {
      setIsExportingUsb(false);
      setTimeout(() => setPdfToast(null), 3500);
    }
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      if (docType === 'RECEIPT') {
        if (!invoice) return;
        const invStudent = state.students.find(s => s.id === invoice.studentId);
        const doc = generateInvoicePDF(invoice, invStudent);
        downloadPDF(doc, `AlFurqan_Invoice_${invoice.invoiceNumber}.pdf`);
        setPdfToast(`Official PDF Invoice ${invoice.invoiceNumber} exported successfully!`);
      } else {
        if (!student) return;
        const doc = generateStudentDossierPDF(student, state.assessments, state.hifzRecords);
        downloadPDF(doc, `AlFurqan_Academic_Dossier_${student.rollNo}.pdf`);
        setPdfToast(`Academic Dossier for ${student.fullNameEnglish} exported successfully!`);
      }
    } catch (err) {
      console.error('PDF Export Error:', err);
      setPdfToast('Failed to generate PDF document.');
    } finally {
      setIsExportingPdf(false);
      setTimeout(() => setPdfToast(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Official Document & Printing Center</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የህትመትና የሰነዶች ማዕከል</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Export professionally formatted PDF documents using jsPDF with Ethiopian dual-calendar and institutional stamps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17365D] hover:bg-[#102642] text-white font-bold text-xs transition-all shadow-md active:scale-95 border border-[#C49A45]/40"
            title="Preview official A4 stationery with Al-Furqan seal watermark"
          >
            <Printer className="w-4 h-4 text-[#C49A45]" />
            <span>Official Print Preview (A4)</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs transition-all shadow-md shadow-emerald-950 active:scale-95 disabled:opacity-50"
            title="Download formatted PDF via jsPDF"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF (jsPDF)'}</span>
          </button>
        </div>
      </div>

      {pdfToast && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-xs font-semibold text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{pdfToast}</span>
          </div>
          <button onClick={() => setPdfToast(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Document Type Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDocType('RECEIPT')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              docType === 'RECEIPT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ethiopian Stamped Receipt (ደረሰኝ)</span>
          </button>

          <button
            onClick={() => setDocType('ID_CARD')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              docType === 'ID_CARD'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Student Official ID Card (ባጅ)</span>
          </button>

          <button
            onClick={() => setDocType('TRANSCRIPT')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              docType === 'TRANSCRIPT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Academic Transcript Dossier (ውጤት)</span>
          </button>
        </div>

        {/* Filter Selection dropdowns */}
        <div className="flex items-center gap-2">
          {docType === 'RECEIPT' ? (
            <select
              value={selectedInvoiceId}
              onChange={e => setSelectedInvoiceId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
            >
              {state.invoices.map(inv => {
                const st = state.students.find(s => s.id === inv.studentId);
                return (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {st?.fullNameEnglish} ({inv.amountETB.toLocaleString()} ETB)
                  </option>
                );
              })}
            </select>
          ) : (
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
            >
              {state.students.map(st => (
                <option key={st.id} value={st.id}>
                  {st.fullNameEnglish} ({st.rollNo})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Document Print Surface Container */}
      <div className="flex justify-center p-4">
        {docType === 'RECEIPT' && invoice && (
          <div className="print-surface bg-white text-slate-900 w-full max-w-2xl rounded-2xl p-8 border-2 border-emerald-900 shadow-2xl space-y-5 text-xs font-sans">
            {/* Header with Institutional Branding & Official Logo */}
            <div className="flex items-start justify-between border-b-2 border-[#17365D] pb-4 gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/image_9f3d5314.png"
                  alt="Al-Furqan Crest"
                  className="w-16 h-16 rounded-full object-contain border border-[#16836B] p-0.5 shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="font-arabic text-base font-bold text-[#16836B]">
                    مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية
                  </div>
                  <div className="font-extrabold text-xs text-[#17365D] uppercase tracking-tight">
                    AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE
                  </div>
                  <div className="font-bold text-[10px] text-[#C49A45] uppercase tracking-tight">
                    GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">
                    Chiro (Ciroo) · West Hararghe / Oromia · Addis Ababa · Ethiopia · Official Stamped Cash Receipt
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1 shrink-0">
                <div className="font-mono font-extrabold text-base text-[#17365D]">
                  {invoice.officialReceiptNumber || 'RCP-ET-9941'}
                </div>
                <div className="text-[10px] text-slate-600">
                  Date: {invoice.lastPaymentDate || new Date().toISOString().split('T')[0]}
                </div>
                <div className="font-ethiopic text-[10px] text-amber-800 font-semibold">
                  {ethDate.formattedAmharic}
                </div>
              </div>
            </div>

            {/* Candidate & Payment Breakdown */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px]">
              <div className="space-y-1">
                <div>Candidate: <strong className="text-slate-900">{student?.fullNameEnglish}</strong></div>
                <div>የተማሪው ሙሉ ስም: <strong className="font-ethiopic text-slate-900">{student?.fullNameAmharic}</strong></div>
                <div>Student ID / Roll: <strong className="font-mono text-emerald-900">{student?.rollNo}</strong></div>
                <div>Sub-City: <strong>{student?.subCity}</strong></div>
              </div>
              <div className="space-y-1 text-right">
                <div>Payment For: <strong>{invoice.termOrMonth}</strong></div>
                <div>Settlement Channel: <strong>{invoice.paymentMethod || 'Telebirr Merchant 88219'}</strong></div>
                <div>Transaction Slip Ref: <strong className="font-mono text-slate-800">{invoice.transactionRef || 'TB-9283748291'}</strong></div>
                <div>Status: <span className="font-bold text-emerald-800 uppercase">{invoice.status}</span></div>
              </div>
            </div>

            {/* Total Cleared Highlight */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-sm">
              <span className="font-semibold text-emerald-950">Total Amount Settled (የተከፈለው ገንዘብ መጠን):</span>
              <span className="font-mono font-extrabold text-emerald-900 text-lg">
                {invoice.amountPaidETB.toLocaleString()} ETB
              </span>
            </div>

            <div className="text-[10px] text-slate-500 italic">
              Amount in Words: {invoice.amountPaidETB.toLocaleString()} Ethiopian Birr Only.
            </div>

            {/* Signatures & Round Official Stamp */}
            <div className="pt-6 flex items-center justify-between border-t border-slate-300 text-[10px]">
              <div className="space-y-6">
                <div>
                  <div className="font-semibold text-slate-800">Collector / Cashier: Sheikh Dawud Abdo</div>
                  <div className="text-slate-500">Authorized Signature: ____________________________</div>
                </div>
              </div>

              <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#16836B] p-0.5 flex flex-col items-center justify-center bg-white shadow-sm select-none rotate-[-4deg]">
                <img
                  src="/assets/aistudio/image_9f3d5314.png"
                  alt="Al-Furqan Official Stamp"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        )}

        {docType === 'ID_CARD' && student && (
          <div className="print-surface bg-gradient-to-br from-[#17365D] via-[#102642] to-[#16836B] border-2 border-[#C49A45] rounded-2xl p-6 text-white max-w-md w-full shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/image_9f3d5314.png"
                  alt="Al-Furqan Logo"
                  className="w-10 h-10 rounded-full object-contain bg-white border border-[#C49A45] p-0.5"
                />
                <div>
                  <div className="font-extrabold text-xs tracking-tight text-[#C49A45] uppercase">
                    AL-FURQAN CENTER & INSTITUTE
                  </div>
                  <div className="text-[10px] text-slate-200">Chiro & Addis Ababa · Ethiopia</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 border border-white/30 text-white font-bold">
                  ID: {student.rollNo}
                </span>
              </div>
            </div>

            <div className="py-2 flex gap-4 items-center">
              <div className={`w-24 h-28 rounded-xl ${student.avatarColor} border-2 border-amber-400/80 flex flex-col items-center justify-center text-white shrink-0 shadow-lg`}>
                <Users className="w-10 h-10 text-amber-200" />
                <span className="text-[10px] mt-1 font-semibold">{student.gender}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-lg text-white">{student.fullNameEnglish}</div>
                <div className="font-ethiopic text-amber-300 font-semibold text-sm">
                  {student.fullNameAmharic}
                </div>
                <div className="text-[11px] text-slate-300 pt-1">
                  Level: <span className="font-medium text-emerald-300">{student.hifzLevel}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Guardian: {student.guardianName} ({formatEthiopianPhone(student.guardianPhone)})
                </div>
                <div className="text-[10px] text-slate-400">
                  Sub-City: {student.subCity} | Blood: {student.bloodGroup || 'O+'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-900/80 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Verified Enrollment</span>
              </div>
              <div className="font-ethiopic text-amber-300/90 font-medium">
                የተማሪ መታወቂያ ካርድ · ፳፻፲፱ ዓ.ም
              </div>
            </div>
          </div>
        )}

        {docType === 'TRANSCRIPT' && student && (
          <div className="print-surface bg-white text-slate-900 w-full max-w-2xl rounded-2xl p-8 border-2 border-slate-300 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-center gap-4 border-b-2 border-[#17365D] pb-3 text-center">
              <img
                src="/assets/aistudio/image_9f3d5314.png"
                alt="Al-Furqan Crest"
                className="w-16 h-16 rounded-full object-contain border border-[#16836B] p-0.5 shrink-0"
              />
              <div className="space-y-0.5 text-center flex-1">
                <div className="font-arabic text-base font-bold text-[#16836B]">
                  مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية
                </div>
                <div className="font-extrabold text-xs text-[#17365D] uppercase tracking-tight">
                  AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE
                </div>
                <div className="font-bold text-[10px] text-[#C49A45] uppercase tracking-tight">
                  GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
              <div>
                <div>Candidate: <strong className="text-slate-900">{student.fullNameEnglish}</strong></div>
                <div>የተማሪው ስም: <strong className="font-ethiopic text-slate-900">{student.fullNameAmharic}</strong></div>
                <div>Track: <strong>{student.hifzLevel}</strong></div>
              </div>
              <div className="text-right">
                <div>Roll No: <strong className="font-mono text-emerald-900">{student.rollNo}</strong></div>
                <div>Sub-City: <strong>{student.subCity}</strong></div>
                <div>Academic Year: <strong>2026/27 (፳፻፲፱ ዓ.ም)</strong></div>
              </div>
            </div>

            <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
              <thead className="bg-emerald-950 text-white">
                <tr>
                  <th className="py-1.5 px-2 border border-slate-300">Course / Subject (የቁርኣንና ሸሪዓ ትምህርቶች)</th>
                  <th className="py-1.5 px-2 border border-slate-300 text-center">Score</th>
                  <th className="py-1.5 px-2 border border-slate-300 text-center">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1.5 px-2 border border-slate-300">1. Qur'an Hifz & Retention (ሒፍዝ)</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">96/100</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Mumtaz (A+)</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 border border-slate-300">2. Tajweed Science: Makharij & Sifat (ታጅዊድ)</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">92/100</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Mumtaz (A)</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 border border-slate-300">3. Fiqh of Taharah & Salah (ፊቅህ)</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">89/100</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Jayyid Jiddan (B+)</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 border border-slate-300">4. Aqeedah & Tawheed (ዐቂዳህ)</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">94/100</td>
                  <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Mumtaz (A)</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-4 flex items-center justify-between border-t border-slate-300 text-[10px]">
              <div>
                <div className="font-semibold text-slate-800">Lead Ustadh: Ustadh Hassen Taha</div>
                <div className="text-slate-500">Signature: __________________________</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-900 p-0.5 flex items-center justify-center bg-white shadow-sm">
                  <img
                    src="/assets/aistudio/image_9f3d5314.png"
                    alt="Al-Furqan Official Seal"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="text-[8px] font-bold text-emerald-950 uppercase mt-0.5">Official Stamp · Chiro Town</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direct Android USB Sideload Kit Section */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cable className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Direct Android USB Sideload & Deployment Toolkit
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                Hardware USB
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Install Nurul Ilmi directly onto your Android phone via physical USB cable. Package includes 1-click ADB batch installer, AndroidManifest.xml, and offline launcher.
            </p>
          </div>
          <button
            onClick={handleExportUsb}
            disabled={isExportingUsb}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/60 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            <FolderDown className="w-4 h-4" />
            <span>{isExportingUsb ? 'Packaging Kit...' : 'Download Android USB Kit (.zip)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <span className="font-semibold text-amber-300 block mb-1">1. Connect Cable & MTP</span>
            <span>Connect USB cable to phone, swipe down notification, and choose "File Transfer" (MTP).</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <span className="font-semibold text-amber-300 block mb-1">2. USB Debugging (ADB)</span>
            <span>Enable Developer Options & USB Debugging on Android for zero-click ADB install.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <span className="font-semibold text-amber-300 block mb-1">3. Chrome USB Inspect</span>
            <span>Forward port 3000 in chrome://inspect to mint native WebAPK on phone instantly.</span>
          </div>
        </div>
      </div>

      {/* Official Stationery Print Preview Modal */}
      {isPreviewModalOpen && (
        <PrintPreviewModal
          isOpen={true}
          onClose={() => setIsPreviewModalOpen(false)}
          documentType={docType === 'RECEIPT' ? 'INVOICE' : 'DOSSIER'}
          student={student}
          invoice={invoice}
          assessments={state.assessments}
          hifzRecords={state.hifzRecords}
        />
      )}
    </div>
  );
};
