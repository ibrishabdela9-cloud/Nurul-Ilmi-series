/**
 * Module: Examinations & Assessments
 * Al-Furqan Quran & Hadith Academy
 * Management of term exams, Hifz retention tests, Tajweed oral boards,
 * and Hadith recitation evaluations with GPA computation and stationary print triggers.
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Printer,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { Student } from '../../types';

export const ExaminationsModule: React.FC<{ state: AppStoreState }> = ({ state }) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [printStudent, setPrintStudent] = useState<Student | null>(null);

  const filteredAssessments = state.assessments.filter(a => {
    const student = state.students.find(s => s.id === a.studentId);
    const matchesSearch =
      (student?.fullNameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (student?.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesTerm = selectedTerm === 'ALL' || a.term === selectedTerm;
    return matchesSearch && matchesTerm;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-saas p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-[#C49A45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#17365D] tracking-tight">Examinations & Marksheets</h1>
              <span className="font-arabic text-[#16836B] font-bold text-lg">الامتحانات والتقييم الأكاديمي</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Al-Furqan Quran & Hadith Academy · Term evaluations, oral Tajweed boards, and GPA grading.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-semibold text-[#17365D]"
          >
            <option value="ALL">All Terms</option>
            <option value="Term 1">Term 1 (First Semester)</option>
            <option value="Midterm">Midterm Evaluation</option>
            <option value="Term 2 (Final)">Term 2 (Final Sanad Board)</option>
          </select>
        </div>
      </div>

      {/* Marksheet Cards & Table */}
      <div className="card-saas p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search student marksheet by name or roll #..."
              className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#17365D]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredAssessments.length} assessment records
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-3">Roll #</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Term & Academic Year</th>
                <th className="p-3 text-center">Hifz / Recitation</th>
                <th className="p-3 text-center">Tajweed Theory</th>
                <th className="p-3 text-center">Hadith Arbain</th>
                <th className="p-3 text-center">Fiqh of Ibadat</th>
                <th className="p-3 text-center">Overall GPA</th>
                <th className="p-3 text-center">Official Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.map(a => {
                const student = state.students.find(s => s.id === a.studentId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#17365D]">{student?.rollNo || 'ST-00'}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{student?.fullNameEnglish}</div>
                      <div className="font-ethiopic text-[10px] text-slate-400">{student?.fullNameAmharic}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{a.term}</span>
                      <span className="text-[10px] text-slate-400 block">{a.academicYear}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-[#16836B] font-mono">
                      {a.hifzRecitation}/100
                    </td>
                    <td className="p-3 text-center font-bold font-mono">
                      {a.tajweedTheoryAndApplication}/100
                    </td>
                    <td className="p-3 text-center font-bold font-mono">
                      {a.hadithArbain}/100
                    </td>
                    <td className="p-3 text-center font-bold font-mono">
                      {a.fiqhOfIbadat}/100
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-extrabold text-xs">
                        {a.gpaLetter} ({a.averagePercentage}%)
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => student && setPrintStudent(student)}
                        className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 text-[#1E40AF] text-[11px] font-bold border border-blue-200 inline-flex items-center gap-1 transition"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Preview Modal */}
      {printStudent && (
        <PrintPreviewModal
          isOpen={true}
          onClose={() => setPrintStudent(null)}
          documentType="DOSSIER"
          student={printStudent}
          assessments={state.assessments}
          hifzRecords={state.hifzRecords}
        />
      )}
    </div>
  );
};
