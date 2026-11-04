/**
 * Manual Edition & Google Sheets Master Hub Module
 * Al-Furqan Quran Memorization Center & Islamic Studies Institute
 * Ethiopia, Eastern Oromia, Chiro Town
 * 
 * Provides:
 * - Central Master Data Grid with fast record searching and manual inline editing
 * - Dedicated Google Sheets manual binding (custom Sheet ID/URL input)
 * - 1-Click "Sync All 9 Institutional Worksheets Now" manual execution
 * - Auto-Sync real-time toggle
 * - CSV and JSON offline data export
 */

import React, { useState, useEffect } from 'react';
import {
  Edit3,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  Users,
  Receipt,
  BookOpen,
  GraduationCap,
  UserCheck,
  Settings,
  ShieldCheck,
  Link2,
  Trash2,
  Plus,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { 
  Student, 
  FeeInvoice, 
  CashbookVoucher, 
  HifzDailyRecord, 
  AcademicAssessment, 
  FacultyMember 
} from '../../types';
import { 
  getMasterSheetInfo, 
  setCustomMasterSpreadsheetId, 
  clearMasterSpreadsheetId, 
  isAutoSyncEnabled, 
  setAutoSyncEnabled, 
  syncAllDataToGoogleSheets, 
  getCachedToken,
  signInWithGoogleWorkspace
} from '../../lib/workspace';

interface ManualEditionHubModuleProps {
  state: AppStoreState;
  onOpenManualEditor: (type: 'STUDENT' | 'INVOICE' | 'VOUCHER' | 'HIFZ' | 'ASSESSMENT' | 'FACULTY', recordId?: string) => void;
  onShowToast: (msg: string) => void;
}

export const ManualEditionHubModule: React.FC<ManualEditionHubModuleProps> = ({
  state,
  onOpenManualEditor,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'invoices' | 'vouchers' | 'hifz' | 'assessments' | 'faculty'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetInfo, setSheetInfo] = useState(getMasterSheetInfo());
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [autoSync, setAutoSync] = useState(isAutoSyncEnabled());
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setSheetInfo(getMasterSheetInfo());
  }, []);

  const handleToggleAutoSync = () => {
    const nextVal = !autoSync;
    setAutoSync(nextVal);
    setAutoSyncEnabled(nextVal);
    onShowToast(`Automatic background Google Sheets sync is now ${nextVal ? 'ENABLED' : 'DISABLED'}.`);
  };

  const handleSaveCustomSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSheetInput.trim()) return;
    const res = setCustomMasterSpreadsheetId(customSheetInput);
    setSheetInfo(getMasterSheetInfo());
    setCustomSheetInput('');
    onShowToast(`Master Google Sheet ID successfully bound to ${res.id}`);
  };

  const handleClearSheetBinding = () => {
    clearMasterSpreadsheetId();
    setSheetInfo(getMasterSheetInfo());
    onShowToast('Master Google Sheet binding removed.');
  };

  const handleManualSyncAll = async () => {
    let token = getCachedToken();
    if (!token) {
      try {
        const authRes = await signInWithGoogleWorkspace();
        token = authRes.accessToken;
      } catch (err: any) {
        onShowToast('Please authorize Google Workspace to sync data.');
        return;
      }
    }

    setIsSyncingAll(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncAllDataToGoogleSheets(state, token);
      setSheetInfo(getMasterSheetInfo());
      onShowToast(`Successfully synchronized all 9 worksheets (${res.rowCount} rows) to Google Sheets!`);
      setSyncStatusMsg(`Synchronized to ${res.spreadsheetUrl}`);
    } catch (err: any) {
      console.error(err);
      onShowToast(`Sync Error: ${err.message}`);
      setSyncStatusMsg(err.message);
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleDownloadCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `AlFurqan_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'students') {
      csvContent += 'Roll No,Full Name (English),Name (Amharic),Gender,Hifz Level,Current Juz,Memorized Juz,Guardian Name,Guardian Phone,Sub-City,Status\n';
      state.students.forEach(s => {
        csvContent += `"${s.rollNo}","${s.fullNameEnglish}","${s.fullNameAmharic}","${s.gender}","${s.hifzLevel}",${s.currentJuz},${s.memorizedJuzCount},"${s.guardianName}","${s.guardianPhone}","${s.subCity}","${s.status}"\n`;
      });
    } else if (activeTab === 'invoices') {
      csvContent += 'Invoice No,Student ID,Term/Month,Amount ETB,Paid ETB,Balance ETB,Due Date,Status,Payment Method\n';
      state.invoices.forEach(i => {
        csvContent += `"${i.invoiceNumber}","${i.studentId}","${i.termOrMonth}",${i.amountETB},${i.amountPaidETB},${i.balanceETB},"${i.dueDate}","${i.status}","${i.paymentMethod || ''}"\n`;
      });
    } else if (activeTab === 'vouchers') {
      csvContent += 'Voucher No,Type,Date,Account,Category,Amount ETB,Payer/Receiver,Description,Authorized By\n';
      state.vouchers.forEach(v => {
        csvContent += `"${v.voucherNumber}","${v.type}","${v.date}","${v.accountId}","${v.category}",${v.amountETB},"${v.payerReceiver}","${v.description}","${v.authorizedBy}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Exported ${activeTab} data as CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#16836B] p-0.5 bg-white shadow-md flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/image_9f3d5314.png"
              alt="Al-Furqan Crest"
              className="w-full h-full rounded-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#17365D] tracking-tight">Manual Edition & Sync Hub</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Institutional Data Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Al-Furqan Quran Memorization Center & Islamic Studies Institute · Ethiopia, Eastern Oromia, Chiro Town · Mudir: Al-Sheikh Khadir Hamza
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenManualEditor('STUDENT')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#17365D] hover:bg-[#20436e] text-white text-xs font-bold transition shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-[#C49A45]" />
            <span>Open Quick Editor</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Synchronization Control Panel */}
      <div className="card-saas p-6 space-y-4 border-2 border-emerald-500/20 shadow-md bg-gradient-to-br from-white via-[#F8FAFC] to-emerald-50/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#16836B]" />
              <h2 className="text-sm font-bold text-[#17365D]">Google Sheets Live Synchronization</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                9 Worksheets
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Synchronizes Students Roster, Daily Hifz Logs, Roll-Call, Assessments, Fee Invoices, and General Ledger vouchers automatically.
            </p>
          </div>

          {/* Sync Trigger and Auto-Sync Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAutoSync}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                autoSync 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${autoSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Auto-Sync on Save: {autoSync ? 'ON' : 'PAUSED'}</span>
            </button>

            <button
              onClick={handleManualSyncAll}
              disabled={isSyncingAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16836B] hover:bg-[#126b57] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {isSyncingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>{isSyncingAll ? 'Syncing 9 Sheets...' : 'Sync All to Google Sheets Now'}</span>
            </button>
          </div>
        </div>

        {/* Master Sheet Link Ribbon & Custom Binding */}
        <div className="pt-3 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-600">Master Spreadsheet:</span>
            {sheetInfo.id ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ID: {sheetInfo.id}
                </span>
                {sheetInfo.url && (
                  <a
                    href={sheetInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#17365D] hover:text-[#16836B] hover:underline"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={handleClearSheetBinding}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Unbind Sheet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-slate-400 italic">No custom sheet configured yet (will auto-create on first sync).</span>
            )}
            {sheetInfo.lastSync && (
              <span className="text-[11px] text-slate-400">· Last sync: {sheetInfo.lastSync}</span>
            )}
          </div>

          {/* Form to bind custom Google Sheet ID */}
          <form onSubmit={handleSaveCustomSheet} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste custom Google Sheet ID or URL..."
              value={customSheetInput}
              onChange={e => setCustomSheetInput(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#273449] font-mono outline-none focus:border-[#17365D] w-52 sm:w-64"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Bind Sheet
            </button>
          </form>
        </div>

        {syncStatusMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{syncStatusMsg}</span>
            </div>
            <button onClick={() => setSyncStatusMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}
      </div>

      {/* Master Data Grid Table Section */}
      <div className="card-saas p-6 space-y-4">
        {/* Table Selector Tabs + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: 'students', label: 'Students Roster', count: state.students.length },
              { id: 'invoices', label: 'Fee Invoices', count: state.invoices.length },
              { id: 'vouchers', label: 'Cashbook Ledger', count: state.vouchers.length },
              { id: 'hifz', label: 'Hifz Logs', count: state.hifzRecords.length },
              { id: 'assessments', label: 'Academic Marks', count: state.assessments.length },
              { id: 'faculty', label: 'Faculty & Ustadhs', count: state.faculty.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#17365D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-[#C49A45] text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search table rows..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFC] border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs text-[#273449] outline-none focus:border-[#17365D] w-44 sm:w-56"
              />
            </div>
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              title="Download table as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table with Manual Edit Action on Every Row */}
        <div className="overflow-x-auto">
          {activeTab === 'students' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-[#F8FAFC]">
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Hifz Level</th>
                  <th className="py-2.5 px-3">Current Juz / Surah</th>
                  <th className="py-2.5 px-3">Guardian & Phone</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.students
                  .filter(s => s.fullNameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#17365D]">{s.rollNo}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800 block">{s.fullNameEnglish}</span>
                        <span className="font-ethiopic text-slate-500 text-[11px]">{s.fullNameAmharic}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{s.hifzLevel}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#16836B]">Juz {s.currentJuz}</span>
                        <span className="text-[10px] text-slate-400 block">Surah {s.currentSurah} (Ayah {s.currentAyah})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-700 block">{s.guardianName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{s.guardianPhone}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onOpenManualEditor('STUDENT', s.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#17365D] hover:bg-[#17365D] hover:text-white font-semibold transition"
                          title="Manual Edit Student"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {activeTab === 'invoices' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-[#F8FAFC]">
                  <th className="py-2.5 px-3">Invoice No</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Term / Month</th>
                  <th className="py-2.5 px-3">Amount (ETB)</th>
                  <th className="py-2.5 px-3">Paid (ETB)</th>
                  <th className="py-2.5 px-3">Balance (ETB)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.invoices
                  .filter(i => i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(inv => {
                    const st = state.students.find(s => s.id === inv.studentId);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#17365D]">{inv.invoiceNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{st?.fullNameEnglish || inv.studentId}</td>
                        <td className="py-2.5 px-3 text-slate-600">{inv.termOrMonth}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inv.amountETB.toLocaleString()} ETB</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{inv.amountPaidETB.toLocaleString()} ETB</td>
                        <td className="py-2.5 px-3 font-mono text-amber-800">{inv.balanceETB.toLocaleString()} ETB</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onOpenManualEditor('INVOICE', inv.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#17365D] hover:bg-[#17365D] hover:text-white font-semibold transition"
                            title="Manual Edit Invoice"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          {activeTab === 'vouchers' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-[#F8FAFC]">
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount (ETB)</th>
                  <th className="py-2.5 px-3">Payer / Receiver</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.vouchers
                  .filter(v => v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) || v.payerReceiver.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#17365D]">{v.voucherNumber}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          v.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{v.date}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.amountETB.toLocaleString()} ETB</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{v.payerReceiver}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{v.description}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onOpenManualEditor('VOUCHER', v.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#17365D] hover:bg-[#17365D] hover:text-white font-semibold transition"
                          title="Manual Edit Voucher"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {activeTab === 'hifz' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-[#F8FAFC]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Sabaq (Surah & Ayahs)</th>
                  <th className="py-2.5 px-3">Tajweed Score</th>
                  <th className="py-2.5 px-3">Sabqi Grade</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.hifzRecords.map(h => {
                  const st = state.students.find(s => s.id === h.studentId);
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{h.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{st?.fullNameEnglish || h.studentId}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#16836B]">Surah #{h.sabaqSurah}</span>
                        <span className="text-[11px] text-slate-500 block">Ayahs {h.sabaqStartAyah}–{h.sabaqEndAyah}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{h.sabaqTajweedScore} / 10</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{h.sabqiGrade}</td>
                      <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{h.notes || 'Routine revision'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onOpenManualEditor('HIFZ', h.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#17365D] hover:bg-[#17365D] hover:text-white font-semibold transition"
                          title="Manual Edit Hifz Entry"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === 'faculty' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-[#F8FAFC]">
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Assigned Halqah</th>
                  <th className="py-2.5 px-3">Monthly Honorarium (ETB)</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.faculty.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800 block">{f.name}</span>
                      <span className="font-ethiopic text-slate-500 text-[11px]">{f.nameAmharic}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#17365D]">{f.role}</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.assignedHalqah}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{f.monthlySalaryETB.toLocaleString()} ETB</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{f.phone}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenManualEditor('FACULTY', f.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#17365D] hover:bg-[#17365D] hover:text-white font-semibold transition"
                        title="Manual Edit Faculty"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
