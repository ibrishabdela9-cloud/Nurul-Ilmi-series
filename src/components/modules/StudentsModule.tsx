/**
 * Module 4: Student Lifecycle & Admissions
 * Comprehensive student directory, guardian mappings, Ethiopian phone validation,
 * Sub-City demographic filters, and printable official student ID card.
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Printer,
  Phone,
  MapPin,
  Calendar,
  Award,
  HeartHandshake,
  ShieldAlert,
  Edit2,
  X,
  CheckCircle2,
  QrCode,
  Download,
} from 'lucide-react';
import { AppStoreState, isValidEthiopianPhone, formatEthiopianPhone } from '../../lib/store';
import { Student, HifzLevel } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { generateStudentDossierPDF, downloadPDF } from '../../lib/pdf-generator';

interface StudentsModuleProps {
  state: AppStoreState;
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onNavigate: (module: any) => void;
  onSelectStudent: (id: string) => void;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  state,
  onAddStudent,
  onUpdateStudent,
  onNavigate,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [subCityFilter, setSubCityFilter] = useState<string>('ALL');
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [idCardPreviewStudent, setIdCardPreviewStudent] = useState<Student | null>(null);

  // Form state for new admission
  const [formFullNameEnglish, setFormFullNameEnglish] = useState('');
  const [formFullNameAmharic, setFormFullNameAmharic] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formDob, setFormDob] = useState('2012-05-10');
  const [formHifzLevel, setFormHifzLevel] = useState<HifzLevel>('Juz Amma (Beginner Hifz)');
  const [formCurrentJuz, setFormCurrentJuz] = useState<number>(30);
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianPhone, setFormGuardianPhone] = useState('+2519');
  const [formGuardianRelation, setFormGuardianRelation] = useState<'Father' | 'Mother' | 'Brother' | 'Uncle' | 'Guardian'>('Father');
  const [formSubCity, setFormSubCity] = useState<'Kirkos' | 'Bole' | 'Arada' | 'Yeka' | 'Addis Ketema' | 'Nifas Silk-Lafto' | 'Kolfe Keranio' | 'Gulele' | 'Lideta' | 'Akaky Kaliti'>('Bole');
  const [formEmergencyContact, setFormEmergencyContact] = useState('+2519');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const subCities = ['Kirkos', 'Bole', 'Arada', 'Yeka', 'Addis Ketema', 'Nifas Silk-Lafto', 'Kolfe Keranio', 'Gulele', 'Lideta', 'Akaky Kaliti'];
  const hifzLevels: HifzLevel[] = [
    'Nazira (Foundation Reading)',
    'Juz Amma (Beginner Hifz)',
    'Intermediate Hifz (Juz 1-15)',
    'Advanced Hifz (Juz 16-29)',
    'Khatm Aspirant (Final Revision)',
    'Sanad & Ijazah Program',
  ];

  const filteredStudents = state.students.filter(s => {
    const matchesSearch =
      s.fullNameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fullNameAmharic.includes(searchQuery) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardianPhone.includes(searchQuery);

    const matchesLevel = levelFilter === 'ALL' || s.hifzLevel === levelFilter;
    const matchesSubCity = subCityFilter === 'ALL' || s.subCity === subCityFilter;

    return matchesSearch && matchesLevel && matchesSubCity;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formFullNameEnglish.trim()) {
      setFormError('Student English full name is required');
      return;
    }
    if (!formFullNameAmharic.trim()) {
      setFormError('Student Amharic full name is required (የተማሪው ሙሉ ስም)');
      return;
    }
    if (!isValidEthiopianPhone(formGuardianPhone)) {
      setFormError('Guardian phone must be a valid Ethiopian number (+2519..., +2517..., 09..., or 07...)');
      return;
    }

    const nextRollNo = `NI-2026-${String(state.students.length + 1).padStart(3, '0')}`;
    const avatarColors = ['bg-emerald-700', 'bg-teal-700', 'bg-amber-700', 'bg-sky-700', 'bg-indigo-700', 'bg-rose-700'];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      rollNo: nextRollNo,
      fullNameEnglish: formFullNameEnglish.trim(),
      fullNameAmharic: formFullNameAmharic.trim(),
      gender: formGender,
      dob: formDob,
      enrollmentDate: new Date().toISOString().split('T')[0],
      hifzLevel: formHifzLevel,
      currentJuz: formCurrentJuz,
      currentSurah: 1,
      currentAyah: 1,
      memorizedJuzCount: formCurrentJuz === 30 ? 1 : 0,
      guardianName: formGuardianName.trim(),
      guardianPhone: formGuardianPhone.trim(),
      guardianRelation: formGuardianRelation,
      subCity: formSubCity,
      emergencyContact: formEmergencyContact.trim() || formGuardianPhone.trim(),
      status: 'Active',
      avatarColor: randomColor,
      notes: formNotes.trim(),
    };

    onAddStudent(newStudent);
    setIsAdmissionModalOpen(false);
    // Reset form
    setFormFullNameEnglish('');
    setFormFullNameAmharic('');
    setFormGuardianName('');
    setFormGuardianPhone('+2519');
    setFormNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Student Directory & Admissions</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የተማሪዎች ሙሉ መዝገብ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active admissions register, Addis Ababa sub-city demographic mappings, guardian contact details, and printable ID badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('bulk_csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission (ምዝገባ)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name (English or Amharic), roll number, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Hifz Level Filter */}
        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Hifz Levels</option>
            {hifzLevels.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          {/* Sub-City Filter */}
          <select
            value={subCityFilter}
            onChange={e => setSubCityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Sub-Cities (ክፍለ ከተማ)</option>
            {subCities.map(city => (
              <option key={city} value={city}>{city} Sub-City</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 text-xs flex flex-col justify-between transition-all hover:shadow-lg space-y-4"
          >
            <div className="space-y-3">
              {/* Header with Avatar & Roll No */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${student.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                    {student.fullNameEnglish.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">{student.fullNameEnglish}</h2>
                    <div className="font-ethiopic text-amber-300 font-medium">
                      {student.fullNameAmharic}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-900/80 font-bold">
                  {student.rollNo}
                </span>
              </div>

              {/* Status and Sponsorship Badge */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                  {student.hifzLevel}
                </span>
                {student.isOrphanSponsored && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3" />
                    <span>Orphan Sponsored</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  {student.gender}
                </span>
              </div>

              {/* Hifz Progress Bar */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Current Position:</span>
                  <span className="font-bold text-amber-300">
                    Juz {student.currentJuz} / 30 ({student.memorizedJuzCount} Memorized)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.max(5, (student.memorizedJuzCount / 30) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Guardian & Demographic Details */}
              <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center justify-between">
                  <span>Guardian ({student.guardianRelation}):</span>
                  <span className="text-slate-200 font-medium">{student.guardianName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>Phone:</span>
                  </span>
                  <span className="font-mono text-slate-300">{formatEthiopianPhone(student.guardianPhone)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>Sub-City:</span>
                  </span>
                  <span className="text-slate-200">{student.subCity} Sub-City</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5">
              <button
                onClick={() => {
                  const doc = generateStudentDossierPDF(student, state.assessments, state.hifzRecords);
                  downloadPDF(doc, `Nurul_Ilmi_Dossier_${student.rollNo}.pdf`);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 hover:text-white transition-colors text-xs font-medium"
                title="Download formatted academic dossier PDF via jsPDF"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                <span>PDF Dossier</span>
              </button>
              <button
                onClick={() => setIdCardPreviewStudent(student)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                title="Preview and print official student ID badge"
              >
                <Printer className="w-3 h-3 text-teal-400" />
                <span>ID</span>
              </button>
              <button
                onClick={() => {
                  onSelectStudent(student.id);
                  onNavigate('hifz_tracker');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-sm text-xs"
              >
                <Award className="w-3 h-3" />
                <span>Log Sabaq</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card Printable Modal */}
      {idCardPreviewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Official Student ID Badge</h2>
              <button
                onClick={() => setIdCardPreviewStudent(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable ID Card Surface */}
            <div className="print-surface bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-2 border-amber-500/70 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center font-arabic text-lg">
                    ن
                  </div>
                  <div>
                    <div className="font-bold text-xs tracking-wider text-amber-300 uppercase">Nurul Ilmi Series</div>
                    <div className="text-[10px] text-slate-300">Addis Ababa Main Campus, Ethiopia</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-emerald-200">
                    ID: {idCardPreviewStudent.rollNo}
                  </span>
                </div>
              </div>

              <div className="py-4 flex gap-4 items-center">
                <div className={`w-20 h-24 rounded-lg ${idCardPreviewStudent.avatarColor} border-2 border-amber-400/80 flex flex-col items-center justify-center text-white shrink-0 shadow-inner`}>
                  <Users className="w-8 h-8 text-amber-200" />
                  <span className="text-[10px] mt-1 font-semibold">{idCardPreviewStudent.gender}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-base text-white">{idCardPreviewStudent.fullNameEnglish}</div>
                  <div className="font-ethiopic text-amber-300 font-semibold text-sm">
                    {idCardPreviewStudent.fullNameAmharic}
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    Level: <span className="font-medium text-emerald-300">{idCardPreviewStudent.hifzLevel}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Guardian: {idCardPreviewStudent.guardianName} ({idCardPreviewStudent.guardianPhone})
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Sub-City: {idCardPreviewStudent.subCity}</span>
                </div>
                <div className="font-ethiopic text-amber-300/80">
                  ትምህርትና ሒፍዝ ማዕከል
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIdCardPreviewStudent(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Student Admission Modal */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-base text-white">Student Admission Form</h2>
                <span className="font-ethiopic text-amber-300 text-sm">አዲስ ተማሪ ምዝገባ</span>
              </div>
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Student Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formFullNameEnglish}
                    onChange={e => setFormFullNameEnglish(e.target.value)}
                    placeholder="e.g. Abdurahim Seid Ali"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">ሙሉ ስም (Amharic) *</label>
                  <input
                    type="text"
                    required
                    value={formFullNameAmharic}
                    onChange={e => setFormFullNameAmharic(e.target.value)}
                    placeholder="ለምሳሌ፡ አብዱራሒም ሰይድ አሊ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-ethiopic outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male (ወንድ)</option>
                    <option value="Female">Female (ሴት)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={e => setFormDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Initial Starting Juz</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formCurrentJuz}
                    onChange={e => setFormCurrentJuz(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assigned Hifz Level</label>
                <select
                  value={formHifzLevel}
                  onChange={e => setFormHifzLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  {hifzLevels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="font-semibold text-amber-300">Guardian & Location Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Guardian Name</label>
                    <input
                      type="text"
                      required
                      value={formGuardianName}
                      onChange={e => setFormGuardianName(e.target.value)}
                      placeholder="e.g. Seid Ali"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Relation</label>
                    <select
                      value={formGuardianRelation}
                      onChange={e => setFormGuardianRelation(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                    >
                      <option value="Father">Father (አባት)</option>
                      <option value="Mother">Mother (እናት)</option>
                      <option value="Brother">Brother (ወንድም)</option>
                      <option value="Uncle">Uncle (አጎት)</option>
                      <option value="Guardian">Guardian (አሳዳጊ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Guardian Phone (Ethiopia: +251... / 09...)</label>
                    <input
                      type="text"
                      required
                      value={formGuardianPhone}
                      onChange={e => setFormGuardianPhone(e.target.value)}
                      placeholder="+251911456789 or 0911456789"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Sub-City in Addis Ababa (ክፍለ ከተማ)</label>
                    <select
                      value={formSubCity}
                      onChange={e => setFormSubCity(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                    >
                      {subCities.map(c => (
                        <option key={c} value={c}>{c} Sub-City</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdmissionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Complete Enrollment (ምዝገባውን አጠናቅቅ)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
