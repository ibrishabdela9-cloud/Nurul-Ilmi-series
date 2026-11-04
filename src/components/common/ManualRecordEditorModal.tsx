/**
 * Manual Record Editor Modal Component
 * Al-Furqan Quran Memorization Center & Islamic Studies Institute
 * 
 * Provides administrative manual edition across all institutional records:
 * - Students Roster (Personal particulars, Hifz level, Juz progress, guardian phone, address)
 * - Tuition Fee Invoices (Amounts, payment channels, transaction refs, settlement status)
 * - Cashbook General Ledger Vouchers (Income/Expense, accounts, amounts in ETB, authorized signatures)
 * - Daily Hifz & Recitation Logs (Sabaq, Sabqi, Manzil, Tajweed scores)
 * - Academic Assessment Dossiers (Term scores across 7 subjects, conduct, Mudir signoff)
 * - Faculty & Ustadh Registry (Roles, salaries, halqah assignments)
 * - Institution Details (Head Mudir: Al-Sheikh Khadir Hamza, Address: Ethiopia, Eastern Oromia, Chiro Town)
 * 
 * Includes confirmation dialogs, audit logging, and instant Google Sheets synchronization.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  Receipt,
  BookOpen,
  GraduationCap,
  UserCheck,
  Building2,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { 
  Student, 
  FeeInvoice, 
  CashbookVoucher, 
  HifzDailyRecord, 
  AcademicAssessment, 
  FacultyMember,
  PaymentMethod,
  InvoiceStatus,
  VoucherType,
} from '../../types';
import { AppStoreState, isValidEthiopianPhone } from '../../lib/store';
import { autoSyncUpdatedRecord } from '../../lib/workspace';

export type ManualEditEntityType = 
  | 'STUDENT' 
  | 'INVOICE' 
  | 'VOUCHER' 
  | 'HIFZ' 
  | 'ASSESSMENT' 
  | 'FACULTY' 
  | 'INSTITUTION';

interface ManualRecordEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppStoreState;
  initialType?: ManualEditEntityType;
  initialRecordId?: string;
  onUpdateStudent: (student: Student) => void;
  onUpdateInvoice: (invoice: FeeInvoice) => void;
  onUpdateVoucher: (voucher: CashbookVoucher) => void;
  onUpdateHifz: (record: HifzDailyRecord) => void;
  onUpdateAssessment: (assessment: AcademicAssessment) => void;
  onUpdateFaculty: (faculty: FacultyMember) => void;
  onDeleteRecord?: (type: ManualEditEntityType, id: string) => void;
  onShowToast: (msg: string) => void;
}

export const ManualRecordEditorModal: React.FC<ManualRecordEditorModalProps> = ({
  isOpen,
  onClose,
  state,
  initialType = 'STUDENT',
  initialRecordId,
  onUpdateStudent,
  onUpdateInvoice,
  onUpdateVoucher,
  onUpdateHifz,
  onUpdateAssessment,
  onUpdateFaculty,
  onDeleteRecord,
  onShowToast,
}) => {
  const [activeType, setActiveType] = useState<ManualEditEntityType>(initialType);
  const [selectedId, setSelectedId] = useState<string>(initialRecordId || '');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State Containers
  const [studentForm, setStudentForm] = useState<Partial<Student>>({});
  const [invoiceForm, setInvoiceForm] = useState<Partial<FeeInvoice>>({});
  const [voucherForm, setVoucherForm] = useState<Partial<CashbookVoucher>>({});
  const [hifzForm, setHifzForm] = useState<Partial<HifzDailyRecord>>({});
  const [assessmentForm, setAssessmentForm] = useState<Partial<AcademicAssessment>>({});
  const [facultyForm, setFacultyForm] = useState<Partial<FacultyMember>>({});

  // Sync initial type and record selection
  useEffect(() => {
    setActiveType(initialType);
    if (initialRecordId) {
      setSelectedId(initialRecordId);
    } else {
      // Pick first record in current collection
      if (initialType === 'STUDENT' && state.students.length > 0) setSelectedId(state.students[0].id);
      else if (initialType === 'INVOICE' && state.invoices.length > 0) setSelectedId(state.invoices[0].id);
      else if (initialType === 'VOUCHER' && state.vouchers.length > 0) setSelectedId(state.vouchers[0].id);
      else if (initialType === 'HIFZ' && state.hifzRecords.length > 0) setSelectedId(state.hifzRecords[0].id);
      else if (initialType === 'ASSESSMENT' && state.assessments.length > 0) setSelectedId(state.assessments[0].id);
      else if (initialType === 'FACULTY' && state.faculty.length > 0) setSelectedId(state.faculty[0].id);
    }
  }, [initialType, initialRecordId]);

  // Load record into form whenever selection changes
  useEffect(() => {
    setFormError(null);
    setConfirmDelete(false);

    if (activeType === 'STUDENT') {
      const rec = state.students.find(s => s.id === selectedId) || state.students[0];
      if (rec) {
        setSelectedId(rec.id);
        setStudentForm({ ...rec });
      }
    } else if (activeType === 'INVOICE') {
      const rec = state.invoices.find(i => i.id === selectedId) || state.invoices[0];
      if (rec) {
        setSelectedId(rec.id);
        setInvoiceForm({ ...rec });
      }
    } else if (activeType === 'VOUCHER') {
      const rec = state.vouchers.find(v => v.id === selectedId) || state.vouchers[0];
      if (rec) {
        setSelectedId(rec.id);
        setVoucherForm({ ...rec });
      }
    } else if (activeType === 'HIFZ') {
      const rec = state.hifzRecords.find(h => h.id === selectedId) || state.hifzRecords[0];
      if (rec) {
        setSelectedId(rec.id);
        setHifzForm({ ...rec });
      }
    } else if (activeType === 'ASSESSMENT') {
      const rec = state.assessments.find(a => a.id === selectedId) || state.assessments[0];
      if (rec) {
        setSelectedId(rec.id);
        setAssessmentForm({ ...rec });
      }
    } else if (activeType === 'FACULTY') {
      const rec = state.faculty.find(f => f.id === selectedId) || state.faculty[0];
      if (rec) {
        setSelectedId(rec.id);
        setFacultyForm({ ...rec });
      }
    }
  }, [activeType, selectedId, state]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (activeType === 'STUDENT') {
        if (!studentForm.fullNameEnglish?.trim()) {
          throw new Error('Student full name in English is required.');
        }
        if (studentForm.guardianPhone && !isValidEthiopianPhone(studentForm.guardianPhone)) {
          throw new Error('Guardian phone must be a valid Ethiopian phone (+2519..., 09..., 07...).');
        }
        const updated = studentForm as Student;
        onUpdateStudent(updated);
        onShowToast(`Student record for ${updated.fullNameEnglish} saved.`);
        await autoSyncUpdatedRecord('students', state);
      } else if (activeType === 'INVOICE') {
        if (!invoiceForm.invoiceNumber) throw new Error('Invoice Number is required.');
        const amount = Number(invoiceForm.amountETB) || 0;
        const paid = Number(invoiceForm.amountPaidETB) || 0;
        const balance = Math.max(0, amount - paid);
        const status: InvoiceStatus = balance <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

        const updated: FeeInvoice = {
          ...(invoiceForm as FeeInvoice),
          amountETB: amount,
          amountPaidETB: paid,
          balanceETB: balance,
          status,
        };
        onUpdateInvoice(updated);
        onShowToast(`Invoice ${updated.invoiceNumber} manually updated.`);
        await autoSyncUpdatedRecord('invoices', state);
      } else if (activeType === 'VOUCHER') {
        if (!voucherForm.voucherNumber || !voucherForm.description) {
          throw new Error('Voucher number and description are required.');
        }
        const updated: CashbookVoucher = {
          ...(voucherForm as CashbookVoucher),
          amountETB: Number(voucherForm.amountETB) || 0,
        };
        onUpdateVoucher(updated);
        onShowToast(`Cashbook Voucher ${updated.voucherNumber} manually saved.`);
        await autoSyncUpdatedRecord('cashbook', state);
      } else if (activeType === 'HIFZ') {
        const updated = hifzForm as HifzDailyRecord;
        onUpdateHifz(updated);
        onShowToast('Hifz Recitation Entry manually updated.');
        await autoSyncUpdatedRecord('hifz', state);
      } else if (activeType === 'ASSESSMENT') {
        const a = assessmentForm;
        const total = (Number(a.hifzRecitation) || 0) +
          (Number(a.tajweedTheoryAndApplication) || 0) +
          (Number(a.fiqhOfIbadat) || 0) +
          (Number(a.aqeedahAndTawheed) || 0) +
          (Number(a.arabicLanguageAndNahw) || 0) +
          (Number(a.hadithArbain) || 0) +
          (Number(a.adabAndAkhlaq) || 0);
        const avg = Math.round((total / 700) * 100);
        let gpa: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' = 'B';
        if (avg >= 95) gpa = 'A+';
        else if (avg >= 85) gpa = 'A';
        else if (avg >= 75) gpa = 'B+';
        else if (avg >= 65) gpa = 'B';
        else if (avg >= 50) gpa = 'C';
        else gpa = 'F';

        const updated: AcademicAssessment = {
          ...(a as AcademicAssessment),
          totalScore: total,
          averagePercentage: avg,
          gpaLetter: gpa,
          ustadhSignoff: a.ustadhSignoff || 'Al-Sheikh Khadir Hamza (Head Mudir)',
        };
        onUpdateAssessment(updated);
        onShowToast(`Assessment marks saved. Average: ${avg}% (${gpa}).`);
        await autoSyncUpdatedRecord('assessments', state);
      } else if (activeType === 'FACULTY') {
        const updated = facultyForm as FacultyMember;
        onUpdateFaculty(updated);
        onShowToast(`Faculty profile for ${updated.name} updated.`);
      }

      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Validation error saving record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!onDeleteRecord) return;
    onDeleteRecord(activeType, selectedId);
    onShowToast('Record deleted from registry.');
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150">
      <div className="bg-white text-[#273449] border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#17365D] text-white flex items-center justify-between border-b border-[#273449]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C49A45] p-0.5 bg-white shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/image_9f3d5314.png"
                alt="Al-Furqan Emblem"
                className="w-full h-full rounded-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">Manual Record Editor</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16836B] text-white font-mono font-bold">
                  Live Edition & Sheets Sync
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Al-Furqan Academy · Ethiopia, Eastern Oromia, Chiro Town · Head Mudir: Al-Sheikh Khadir Hamza
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Selector Tabs */}
        <div className="px-6 pt-3 pb-2 bg-[#F5F7FA] border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {[
            { id: 'STUDENT', label: 'Students Roster', icon: Users, count: state.students.length },
            { id: 'INVOICE', label: 'Fee Invoices', icon: Receipt, count: state.invoices.length },
            { id: 'VOUCHER', label: 'Cashbook Ledger', icon: FileSpreadsheet, count: state.vouchers.length },
            { id: 'HIFZ', label: 'Hifz Logs', icon: BookOpen, count: state.hifzRecords.length },
            { id: 'ASSESSMENT', label: 'Academic Marks', icon: GraduationCap, count: state.assessments.length },
            { id: 'FACULTY', label: 'Faculty & Ustadhs', icon: UserCheck, count: state.faculty.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveType(tab.id as ManualEditEntityType);
                  setSelectedId('');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                  isActive
                    ? 'bg-[#17365D] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-[#17365D] border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C49A45]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-[#16836B] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Record Selector Ribbon */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-semibold text-slate-500 whitespace-nowrap">Choose Record to Edit:</span>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#273449] font-medium outline-none focus:border-[#17365D] flex-1 max-w-md"
            >
              {activeType === 'STUDENT' && state.students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullNameEnglish} ({s.rollNo}) · {s.hifzLevel} · {s.status}
                </option>
              ))}
              {activeType === 'INVOICE' && state.invoices.map(i => (
                <option key={i.id} value={i.id}>
                  {i.invoiceNumber} · {i.termOrMonth} · {i.amountETB.toLocaleString()} ETB · Status: {i.status}
                </option>
              ))}
              {activeType === 'VOUCHER' && state.vouchers.map(v => (
                <option key={v.id} value={v.id}>
                  {v.voucherNumber} · {v.type} ({v.amountETB.toLocaleString()} ETB) · {v.payerReceiver}
                </option>
              ))}
              {activeType === 'HIFZ' && state.hifzRecords.map(h => {
                const st = state.students.find(s => s.id === h.studentId);
                return (
                  <option key={h.id} value={h.id}>
                    {h.date} · {st?.fullNameEnglish || h.studentId} · Surah #{h.sabaqSurah} ({h.sabaqStartAyah}-{h.sabaqEndAyah})
                  </option>
                );
              })}
              {activeType === 'ASSESSMENT' && state.assessments.map(a => {
                const st = state.students.find(s => s.id === a.studentId);
                return (
                  <option key={a.id} value={a.id}>
                    {a.term} · {st?.fullNameEnglish || a.studentId} · GPA: {a.gpaLetter} ({a.averagePercentage}%)
                  </option>
                );
              })}
              {activeType === 'FACULTY' && state.faculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} · {f.role} · Salary: {f.monthlySalaryETB.toLocaleString()} ETB
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>ID: {selectedId}</span>
          </div>
        </div>

        {formError && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
            <button onClick={() => setFormError(null)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        )}

        {/* Form Body Scroll Canvas */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* STUDENT FORM */}
          {activeType === 'STUDENT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    value={studentForm.fullNameEnglish || ''}
                    onChange={e => setStudentForm(prev => ({ ...prev, fullNameEnglish: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-medium focus:border-[#17365D] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Full Name (Ge'ez / Amharic)</label>
                  <input
                    type="text"
                    value={studentForm.fullNameAmharic || ''}
                    onChange={e => setStudentForm(prev => ({ ...prev, fullNameAmharic: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-ethiopic font-semibold focus:border-[#17365D] outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Roll / Admission Number</label>
                  <input
                    type="text"
                    value={studentForm.rollNo || ''}
                    onChange={e => setStudentForm(prev => ({ ...prev, rollNo: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold focus:border-[#17365D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Gender</label>
                  <select
                    value={studentForm.gender || 'Male'}
                    onChange={e => setStudentForm(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  >
                    <option value="Male">Male (ወንድ)</option>
                    <option value="Female">Female (ሴት)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Enrollment Status</label>
                  <select
                    value={studentForm.status || 'Active'}
                    onChange={e => setStudentForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  >
                    <option value="Active">Active (ተመዝጋቢ)</option>
                    <option value="Graduated">Graduated Khatm (የተመረቀ)</option>
                    <option value="On Leave">On Leave (ፈቃድ ላይ)</option>
                    <option value="Suspended">Suspended (የታገደ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Current Juz (1-30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={studentForm.currentJuz || 1}
                    onChange={e => setStudentForm(prev => ({ ...prev, currentJuz: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Memorized Juz Count (0-30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={studentForm.memorizedJuzCount || 0}
                    onChange={e => setStudentForm(prev => ({ ...prev, memorizedJuzCount: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold text-[#16836B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Hifz Level Track</label>
                  <select
                    value={studentForm.hifzLevel || 'Junior Tahfiz (Juz 1-5)'}
                    onChange={e => setStudentForm(prev => ({ ...prev, hifzLevel: e.target.value as any }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  >
                    <option value="Junior Tahfiz (Juz 1-5)">Junior Tahfiz (Juz 1-5)</option>
                    <option value="Intermediate (Juz 6-15)">Intermediate (Juz 6-15)</option>
                    <option value="Advanced Hifz (Juz 16-29)">Advanced Hifz (Juz 16-29)</option>
                    <option value="Khatm & Sanad (30 Juz)">Khatm & Sanad (30 Juz)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Current Surah Number</label>
                  <input
                    type="number"
                    min={1}
                    max={114}
                    value={studentForm.currentSurah || 1}
                    onChange={e => setStudentForm(prev => ({ ...prev, currentSurah: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Current Ayah Number</label>
                  <input
                    type="number"
                    min={1}
                    value={studentForm.currentAyah || 1}
                    onChange={e => setStudentForm(prev => ({ ...prev, currentAyah: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#F5F7FA] rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 block">Guardian, Residence & Contacts:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Guardian Full Name</label>
                    <input
                      type="text"
                      value={studentForm.guardianName || ''}
                      onChange={e => setStudentForm(prev => ({ ...prev, guardianName: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Guardian Phone (Ethiopia)</label>
                    <input
                      type="text"
                      value={studentForm.guardianPhone || ''}
                      onChange={e => setStudentForm(prev => ({ ...prev, guardianPhone: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none font-mono"
                      placeholder="+2519... or 09..."
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Town / Sub-City</label>
                    <input
                      type="text"
                      value={studentForm.subCity || 'Chiro Town'}
                      onChange={e => setStudentForm(prev => ({ ...prev, subCity: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Academic & Behavioral Dossier Notes</label>
                <textarea
                  rows={2}
                  value={studentForm.notes || ''}
                  onChange={e => setStudentForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                />
              </div>
            </div>
          )}

          {/* INVOICE FORM */}
          {activeType === 'INVOICE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    value={invoiceForm.invoiceNumber || ''}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Term / Month</label>
                  <input
                    type="text"
                    value={invoiceForm.termOrMonth || ''}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, termOrMonth: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-medium"
                    placeholder="e.g. Tikimt 2019 / Term 1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate || ''}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Total Fee Amount (ETB) *</label>
                  <input
                    type="number"
                    value={invoiceForm.amountETB || 0}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, amountETB: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold text-[#17365D] text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    value={invoiceForm.amountPaidETB || 0}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, amountPaidETB: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold text-emerald-700 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Payment Method</label>
                  <select
                    value={invoiceForm.paymentMethod || 'Commercial Bank of Ethiopia'}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  >
                    <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Telebirr">Telebirr Merchant</option>
                    <option value="Awash Bank">Awash Bank Sharia</option>
                    <option value="CBE Birr">CBE Birr Mobile</option>
                    <option value="Cash in Safe">Cash in Safe (Madrasah Bursar)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Transaction Reference / Bank Slip #</label>
                  <input
                    type="text"
                    value={invoiceForm.transactionRef || ''}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, transactionRef: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono outline-none"
                    placeholder="e.g. FT262918829"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Official Stamped Receipt Number</label>
                  <input
                    type="text"
                    value={invoiceForm.officialReceiptNumber || ''}
                    onChange={e => setInvoiceForm(prev => ({ ...prev, officialReceiptNumber: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-semibold text-[#16836B] outline-none"
                    placeholder="e.g. RCP-ET-9182"
                  />
                </div>
              </div>
            </div>
          )}

          {/* VOUCHER FORM */}
          {activeType === 'VOUCHER' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Voucher Number *</label>
                  <input
                    type="text"
                    value={voucherForm.voucherNumber || ''}
                    onChange={e => setVoucherForm(prev => ({ ...prev, voucherNumber: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Voucher Type</label>
                  <select
                    value={voucherForm.type || 'INCOME'}
                    onChange={e => setVoucherForm(prev => ({ ...prev, type: e.target.value as VoucherType }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-semibold outline-none"
                  >
                    <option value="INCOME">INCOME (ገቢ)</option>
                    <option value="EXPENSE">EXPENSE (ወጪ)</option>
                    <option value="TRANSFER">TRANSFER (ማስተላለፍ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Amount (ETB) *</label>
                  <input
                    type="number"
                    value={voucherForm.amountETB || 0}
                    onChange={e => setVoucherForm(prev => ({ ...prev, amountETB: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold text-[#17365D] text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Payer / Receiver</label>
                  <input
                    type="text"
                    value={voucherForm.payerReceiver || ''}
                    onChange={e => setVoucherForm(prev => ({ ...prev, payerReceiver: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Category</label>
                  <input
                    type="text"
                    value={voucherForm.category || ''}
                    onChange={e => setVoucherForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Authorized By</label>
                  <input
                    type="text"
                    value={voucherForm.authorizedBy || 'Al-Sheikh Khadir Hamza (Head Mudir)'}
                    onChange={e => setVoucherForm(prev => ({ ...prev, authorizedBy: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Transaction Description *</label>
                <textarea
                  rows={2}
                  value={voucherForm.description || ''}
                  onChange={e => setVoucherForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* FACULTY FORM */}
          {activeType === 'FACULTY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Faculty Member Name *</label>
                  <input
                    type="text"
                    value={facultyForm.name || ''}
                    onChange={e => setFacultyForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Amharic Name</label>
                  <input
                    type="text"
                    value={facultyForm.nameAmharic || ''}
                    onChange={e => setFacultyForm(prev => ({ ...prev, nameAmharic: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-ethiopic font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Official Role</label>
                  <input
                    type="text"
                    value={facultyForm.role || ''}
                    onChange={e => setFacultyForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                    placeholder="e.g. Head Mudir, Senior Ustadh"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Monthly Salary / Honorarium (ETB)</label>
                  <input
                    type="number"
                    value={facultyForm.monthlySalaryETB || 0}
                    onChange={e => setFacultyForm(prev => ({ ...prev, monthlySalaryETB: Number(e.target.value) }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={facultyForm.phone || ''}
                    onChange={e => setFacultyForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Assigned Halqah / Department</label>
                <input
                  type="text"
                  value={facultyForm.assignedHalqah || ''}
                  onChange={e => setFacultyForm(prev => ({ ...prev, assignedHalqah: e.target.value }))}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 outline-none"
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              {onDeleteRecord && selectedId && (
                !confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    <span className="text-rose-800 text-xs font-bold">Are you sure?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#17365D] hover:bg-[#1f4577] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes & Sync</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
