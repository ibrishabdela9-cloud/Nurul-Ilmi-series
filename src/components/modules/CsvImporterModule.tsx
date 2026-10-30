/**
 * Module 5: Bulk CSV Importer
 * Ingestion pipeline with duplicate detection, Ethiopian phone regex validation,
 * error previews, and sample CSV generator.
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { Student } from '../../types';
import { generateSampleStudentsCsv, parseStudentsCsv, CsvParsedRow } from '../../lib/csv-importer';

interface CsvImporterModuleProps {
  state: AppStoreState;
  onBulkAddStudents: (students: Student[]) => void;
  onNavigate: (module: any) => void;
}

export const CsvImporterModule: React.FC<CsvImporterModuleProps> = ({
  state,
  onBulkAddStudents,
  onNavigate,
}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<CsvParsedRow[]>([]);
  const [hasParsed, setHasParsed] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);

  const handleDownloadSample = () => {
    const sample = generateSampleStudentsCsv();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nurul_ilmi_students_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSampleToTextarea = () => {
    const sample = generateSampleStudentsCsv();
    setCsvContent(sample);
    const result = parseStudentsCsv(sample, state.students);
    setParsedRows(result);
    setHasParsed(true);
    setImportSummary(null);
  };

  const handleParseCsv = () => {
    if (!csvContent.trim()) {
      setParsedRows([]);
      setHasParsed(false);
      return;
    }
    const result = parseStudentsCsv(csvContent, state.students);
    setParsedRows(result);
    setHasParsed(true);
    setImportSummary(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const result = parseStudentsCsv(text, state.students);
      setParsedRows(result);
      setHasParsed(true);
      setImportSummary(null);
    };
    reader.readAsText(file);
  };

  const validRows = parsedRows.filter(r => r.isValid && !r.isDuplicate);
  const invalidRows = parsedRows.filter(r => !r.isValid || r.isDuplicate);

  const handleCommitImport = () => {
    if (validRows.length === 0) return;

    const avatarColors = ['bg-emerald-700', 'bg-teal-700', 'bg-amber-700', 'bg-sky-700', 'bg-indigo-700', 'bg-rose-700'];

    const newStudents: Student[] = validRows.map((r, idx) => ({
      id: `std-bulk-${Date.now()}-${idx}`,
      rollNo: r.rollNo,
      fullNameEnglish: r.fullNameEnglish,
      fullNameAmharic: r.fullNameAmharic,
      gender: r.gender,
      dob: r.dob,
      enrollmentDate: new Date().toISOString().split('T')[0],
      hifzLevel: r.hifzLevel,
      currentJuz: r.currentJuz,
      currentSurah: 1,
      currentAyah: 1,
      memorizedJuzCount: r.currentJuz === 30 ? 1 : 0,
      guardianName: r.guardianName,
      guardianPhone: r.guardianPhone,
      guardianRelation: r.guardianRelation,
      subCity: r.subCity,
      emergencyContact: r.emergencyContact,
      status: 'Active',
      avatarColor: avatarColors[idx % avatarColors.length],
    }));

    onBulkAddStudents(newStudents);
    setImportSummary(`Successfully imported ${newStudents.length} new students into the institutional directory.`);
    setCsvContent('');
    setParsedRows([]);
    setHasParsed(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Bulk Student CSV Ingestion</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የጅምላ ተማሪዎች መረጃ ማስገቢያ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingestion engine with duplicate detection and strict Ethiopian telephone regex validation (+2519..., 09...).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download CSV Template</span>
          </button>
          <button
            onClick={handleLoadSampleToTextarea}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-900 border border-amber-700/60 text-xs text-amber-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Demo CSV</span>
          </button>
        </div>
      </div>

      {importSummary && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">{importSummary}</span>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
          >
            View Students Registry
          </button>
        </div>
      )}

      {/* CSV Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Paste CSV or Upload File</span>
            </div>
            <label className="cursor-pointer text-xs text-emerald-400 hover:underline">
              <span>Browse File (.csv)</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={10}
            value={csvContent}
            onChange={e => setCsvContent(e.target.value)}
            placeholder="RollNo,FullNameEnglish,FullNameAmharic,Gender,DOB,HifzLevel,CurrentJuz,GuardianName,GuardianPhone,GuardianRelation,SubCity,EmergencyContact&#10;NI-2024-007,Abdurahim Seid,አብዱራሒም ሰይድ,Male,2011-03-15,Intermediate Hifz (Juz 1-15),8,Seid Ali,+251911334455,Father,Bole,+251911334455"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Columns: RollNo, FullNameEnglish, FullNameAmharic, Gender, DOB, Level, Juz, Guardian, Phone, Relation, SubCity
            </span>
            <button
              onClick={handleParseCsv}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Parse & Validate
            </button>
          </div>
        </div>

        {/* Validation Invariants & Rules */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-100 pb-2 border-b border-slate-800">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Strict Ingestion Rules</span>
          </div>

          <div className="space-y-3 text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-semibold text-emerald-400 mb-1">1. Ethiopian Phone Regex</div>
              <p className="text-[11px] text-slate-400">
                Guardian phone numbers must match: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">^(\+251|0)(9|7)\d&#123;8&#125;$</code> (e.g., +251911456789, 0922883344, 0711223344).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-semibold text-teal-400 mb-1">2. Canonical Duplicate Detection</div>
              <p className="text-[11px] text-slate-400">
                Any row containing a Roll Number already enrolled in the system is flagged as a duplicate and prevented from overwriting existing files.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-semibold text-amber-400 mb-1">3. Juz & Sub-City Boundaries</div>
              <p className="text-[11px] text-slate-400">
                Starting Juz must strictly be an integer between 1 and 30. Sub-cities are matched to the 11 official administrative zones of Addis Ababa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parsing Staging & Preview Table */}
      {hasParsed && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-sm text-white">Parsed Ingestion Staging</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                {validRows.length} Valid
              </span>
              {invalidRows.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[11px]">
                  {invalidRows.length} Errors / Duplicates
                </span>
              )}
            </div>

            <button
              disabled={validRows.length === 0}
              onClick={handleCommitImport}
              className={`px-5 py-2 rounded-lg font-bold transition-all shadow-md ${
                validRows.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Commit {validRows.length} Valid Students to Database
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">English Name</th>
                  <th className="py-2.5 px-3">Amharic Name</th>
                  <th className="py-2.5 px-3">Juz</th>
                  <th className="py-2.5 px-3">Guardian Phone</th>
                  <th className="py-2.5 px-3">Sub-City</th>
                  <th className="py-2.5 px-3">Validation Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {parsedRows.map(row => (
                  <tr
                    key={row.rowNumber}
                    className={`transition-colors ${
                      row.isValid && !row.isDuplicate
                        ? 'hover:bg-slate-800/60'
                        : 'bg-rose-950/20 hover:bg-rose-950/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      {row.isValid && !row.isDuplicate ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Valid</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <XCircle className="w-4 h-4" />
                          <span>Invalid</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{row.rollNo}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{row.fullNameEnglish}</td>
                    <td className="py-2.5 px-3 font-ethiopic text-amber-300">{row.fullNameAmharic}</td>
                    <td className="py-2.5 px-3 font-mono text-center">Juz {row.currentJuz}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{row.guardianPhone}</td>
                    <td className="py-2.5 px-3 text-slate-300">{row.subCity}</td>
                    <td className="py-2.5 px-3">
                      {row.errors.length > 0 ? (
                        <span className="text-rose-300 text-[11px]">{row.errors.join('; ')}</span>
                      ) : (
                        <span className="text-emerald-400 text-[11px]">Ready for ingestion</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
