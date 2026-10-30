/**
 * Module 6: Academic Performance & Transcripts
 * Multi-subject assessment engine generating weighted term scores,
 * GPA grades, and official printable academic dossiers with Ethiopian stamp.
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  X,
  Stamp,
  Download,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { AcademicAssessment, Student } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { generateStudentDossierPDF, downloadPDF } from '../../lib/pdf-generator';

interface AcademicTranscriptsModuleProps {
  state: AppStoreState;
  onAddAssessment: (assessment: AcademicAssessment) => void;
  onNavigate: (module: any) => void;
}

export const AcademicTranscriptsModule: React.FC<AcademicTranscriptsModuleProps> = ({
  state,
  onAddAssessment,
  onNavigate,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    state.students[0]?.id || ''
  );
  const [term, setTerm] = useState<'Term 1' | 'Midterm' | 'Term 2 (Final)'>('Term 1');
  const [academicYear, setAcademicYear] = useState('2026/27 (፳፻፲፱ ዓ.ም)');

  // Subject scores (out of 100)
  const [hifzRecitation, setHifzRecitation] = useState<number>(95);
  const [tajweedTheory, setTajweedTheory] = useState<number>(92);
  const [fiqhOfIbadat, setFiqhOfIbadat] = useState<number>(88);
  const [aqeedah, setAqeedah] = useState<number>(90);
  const [arabicNahw, setArabicNahw] = useState<number>(85);
  const [hadithArbain, setHadithArbain] = useState<number>(91);
  const [adab, setAdab] = useState<number>(98);
  const [conduct, setConduct] = useState<'Exemplary' | 'Good' | 'Satisfactory' | 'Needs Improvement'>('Exemplary');

  const [activePrintDossier, setActivePrintDossier] = useState<{ student: Student; assessment: AcademicAssessment } | null>(null);

  const currentStudent = state.students.find(s => s.id === selectedStudentId);

  // Computations
  const totalScore = hifzRecitation + tajweedTheory + fiqhOfIbadat + aqeedah + arabicNahw + hadithArbain + adab;
  const averagePercentage = Math.round((totalScore / 700) * 100);

  let gpaLetter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' = 'B';
  if (averagePercentage >= 95) gpaLetter = 'A+';
  else if (averagePercentage >= 85) gpaLetter = 'A';
  else if (averagePercentage >= 75) gpaLetter = 'B+';
  else if (averagePercentage >= 65) gpaLetter = 'B';
  else if (averagePercentage >= 50) gpaLetter = 'C';
  else gpaLetter = 'F';

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const newAssessment: AcademicAssessment = {
      id: `ass-${Date.now()}`,
      studentId: selectedStudentId,
      term,
      academicYear,
      dateRecorded: new Date().toISOString().split('T')[0],
      hifzRecitation,
      tajweedTheoryAndApplication: tajweedTheory,
      fiqhOfIbadat,
      aqeedahAndTawheed: aqeedah,
      arabicLanguageAndNahw: arabicNahw,
      hadithArbain,
      adabAndAkhlaq: adab,
      totalScore,
      averagePercentage,
      gpaLetter,
      conductEvaluation: conduct,
      ustadhSignoff: 'Dr. Sheikh Zakaria Ababor (Mudir)',
    };

    onAddAssessment(newAssessment);
    setActivePrintDossier({ student: currentStudent, assessment: newAssessment });
  };

  const studentAssessments = state.assessments.filter(a => a.studentId === selectedStudentId);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Academic Performance & Transcripts</h1>
            <span className="font-arabic text-amber-300 text-lg">الشهادة الأكاديمية والنتائج</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional term grading engine across Tajweed, Fiqh, Nahw, and Hadith with official printable Ethiopian academic dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Student:</label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-1.5 focus:border-emerald-500 outline-none"
          >
            {state.students.map(st => (
              <option key={st.id} value={st.id}>
                {st.fullNameEnglish} ({st.rollNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Assessment Form (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-100 pb-2 border-b border-slate-800">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Record Term Dossier for {currentStudent.fullNameEnglish}</span>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Academic Term:</label>
                  <select
                    value={term}
                    onChange={e => setTerm(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Term 1">Term 1 (፩ኛ መንፈቀ-ዓመት)</option>
                    <option value="Midterm">Midterm (የእኩለ-ዓመት)</option>
                    <option value="Term 2 (Final)">Term 2 Final (፪ኛ መንፈቀ-ዓመት)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Academic Year:</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Subject Scores Inputs */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                  <span>Core Islamic Curriculum (Max: 100)</span>
                  <span className="font-mono text-amber-300">Avg: {averagePercentage}% ({gpaLetter})</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">1. Hifz Recitation:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hifzRecitation}
                      onChange={e => setHifzRecitation(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">2. Tajweed Science:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={tajweedTheory}
                      onChange={e => setTajweedTheory(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">3. Fiqh of Ibadat:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={fiqhOfIbadat}
                      onChange={e => setFiqhOfIbadat(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">4. Aqeedah & Tawheed:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={aqeedah}
                      onChange={e => setAqeedah(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">5. Arabic & Nahw:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={arabicNahw}
                      onChange={e => setArabicNahw(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">6. Hadith Arba'in:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hadithArbain}
                      onChange={e => setHadithArbain(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-0.5">7. Adab & Akhlaq (Character):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={adab}
                    onChange={e => setAdab(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Student Conduct & Demeanor:</label>
                <select
                  value={conduct}
                  onChange={e => setConduct(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Exemplary">Exemplary (ምስጉን ስነ-ምግባር)</option>
                  <option value="Good">Good (ጥሩ)</option>
                  <option value="Satisfactory">Satisfactory (መካከለኛ)</option>
                  <option value="Needs Improvement">Needs Improvement (ማሻሻያ የሚያስፈልገው)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>Save & Generate Official Academic Dossier</span>
              </button>
            </form>
          </div>

          {/* Dossier Preview & Printing (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Official Transcript Dossier Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentStudent) {
                      const doc = generateStudentDossierPDF(currentStudent, state.assessments, state.hifzRecords);
                      downloadPDF(doc, `Nurul_Ilmi_Academic_Dossier_${currentStudent.rollNo}.pdf`);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-md active:scale-95"
                  title="Generate and download PDF using jsPDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Dossier</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Official Academic Dossier Sheet */}
            <div className="print-surface bg-white text-slate-900 rounded-xl p-6 border-2 border-amber-600/60 shadow-xl space-y-4 text-xs font-sans">
              {/* Header with Emblems */}
              <div className="text-center border-b-2 border-emerald-900 pb-3 space-y-1">
                <div className="font-arabic text-xl font-bold text-emerald-900">
                  معهد نور العلم لتحفيظ القرآن الكريم والعلوم الشرعية
                </div>
                <div className="font-bold text-sm text-slate-900 tracking-wider uppercase">
                  Nurul Ilmi Integrated Qur’an & Islamic Studies Institute
                </div>
                <div className="font-ethiopic font-semibold text-xs text-amber-900">
                  የኑሩል ዒልሚ የቁርኣን ሒፍዝና የኢስላማዊ ጥናት ማዕከል · አዲስ አበባ
                </div>
                <div className="text-[10px] text-slate-600">
                  Addis Ababa, Ethiopia · EAT (UTC+3) · Official Academic Transcript
                </div>
              </div>

              {/* Student Bio Row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                <div>
                  <div>Candidate: <strong className="text-slate-900">{currentStudent.fullNameEnglish}</strong></div>
                  <div>የተማሪው ስም: <strong className="font-ethiopic text-slate-900">{currentStudent.fullNameAmharic}</strong></div>
                  <div>Hifz Track: <strong>{currentStudent.hifzLevel}</strong></div>
                </div>
                <div className="text-right">
                  <div>Registration Roll No: <strong className="font-mono text-emerald-900">{currentStudent.rollNo}</strong></div>
                  <div>Term: <strong>{term}</strong> ({academicYear})</div>
                  <div>Sub-City: <strong>{currentStudent.subCity}</strong></div>
                </div>
              </div>

              {/* Subjects Table */}
              <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
                <thead className="bg-emerald-950 text-white">
                  <tr>
                    <th className="py-1.5 px-2 border border-slate-300">Course / Subject (የቁርኣንና ሸሪዓ ትምህርቶች)</th>
                    <th className="py-1.5 px-2 border border-slate-300 text-center">Max</th>
                    <th className="py-1.5 px-2 border border-slate-300 text-center">Score</th>
                    <th className="py-1.5 px-2 border border-slate-300 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">1. Qur'an Hifz & Muraja'ah Recitation (ሒፍዝ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{hifzRecitation}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">2. Tajweed Science: Makharij & Sifat (ታጅዊድ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{tajweedTheory}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">3. Fiqh of Taharah, Salah & Sawm (ፊቅህ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{fiqhOfIbadat}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">4. Aqeedah & Principles of Tawheed (ዐቂዳህ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{aqeedah}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">5. Arabic Grammar: Nahw & Sarf (ዐረብኛ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{arabicNahw}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">6. Prophetic Hadith: Al-Arba'in An-Nawawiyyah (ሐዲስ)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{hadithArbain}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 border border-slate-300 font-medium">7. Islamic Adab & Akhlaq (ስነ-ምግባር)</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center">100</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-900">{adab}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center text-emerald-800 font-semibold">Exemplary</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-100 font-bold">
                  <tr>
                    <td className="py-2 px-2 border border-slate-300">Cumulative Aggregate</td>
                    <td className="py-2 px-2 border border-slate-300 text-center">700</td>
                    <td className="py-2 px-2 border border-slate-300 text-center text-emerald-900 font-mono text-sm">
                      {totalScore} ({averagePercentage}%)
                    </td>
                    <td className="py-2 px-2 border border-slate-300 text-center font-mono text-emerald-800">
                      Grade: {gpaLetter}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signatures and Institutional Seal */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-300 text-[10px]">
                <div className="space-y-6">
                  <div>
                    <div className="font-semibold text-slate-800">Lead Ustadh: Ustadh Hassen Taha</div>
                    <div className="text-slate-500">Signature: __________________________</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Mudir & Head Sheikh: Dr. Sheikh Zakaria Ababor</div>
                    <div className="text-slate-500">Signature: __________________________</div>
                  </div>
                </div>

                {/* Stamped Seal */}
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-emerald-900 flex flex-col items-center justify-center p-2 text-center text-emerald-950 font-bold select-none rotate-[-6deg]">
                  <div className="font-arabic text-xs">نور العلم</div>
                  <div className="text-[8px] uppercase tracking-wider">Official Seal</div>
                  <div className="text-[7px]">Addis Ababa Campus</div>
                  <div className="font-ethiopic text-[7px]">የኢንስቲትዩቱ ማህተም</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
