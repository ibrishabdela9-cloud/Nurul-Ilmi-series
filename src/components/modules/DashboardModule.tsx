/**
 * Executive SaaS Dashboard
 * Al-Furqan Quran & Hadith Academy
 * Key statistics, attendance overview, academic performance,
 * financial overview, recent activities, upcoming events, and announcements.
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Layers,
  Receipt,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  BookOpen,
  Award,
  Megaphone,
  Printer,
  Plus,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { DesktopNavModule, Student } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { calculatePrayerTimes } from '../../lib/prayer';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

interface DashboardModuleProps {
  state: AppStoreState;
  onNavigate: (module: DesktopNavModule) => void;
  onSelectStudent: (id: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  state,
  onNavigate,
  onSelectStudent,
}) => {
  const ethDate = toEthiopianDate();
  const prayerData = calculatePrayerTimes();
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<Student | null>(null);

  // Compute key stats
  const totalStudents = state.students.length;
  const activeStudents = state.students.filter(s => s.status === 'Active').length;
  const totalFaculty = state.faculty.length;
  const totalClasses = 5; // Active Halqahs

  const totalInvoicedETB = state.invoices.reduce((sum, i) => sum + i.amountETB, 0);
  const totalCollectedETB = state.invoices.reduce((sum, i) => sum + i.amountPaidETB, 0);
  const collectionRate = totalInvoicedETB > 0 ? Math.round((totalCollectedETB / totalInvoicedETB) * 100) : 88;

  const totalMemorizedJuz = state.students.reduce((sum, s) => sum + s.memorizedJuzCount, 0);

  const topStudents = [...state.students]
    .sort((a, b) => b.memorizedJuzCount - a.memorizedJuzCount)
    .slice(0, 4);

  const upcomingEvents = [
    { id: 1, title: 'Term 1 Midterm Assessment Board', date: 'Nov 12, 2026', type: 'Exam' },
    { id: 2, title: 'General Parents & Shura Assembly', date: 'Nov 18, 2026', type: 'Meeting' },
    { id: 3, title: 'Annual Sanad Khatm & Ijazah Ceremony', date: 'Dec 05, 2026', type: 'Ceremony' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner with Official Emblem & 3-Language Document Headers */}
      <div className="card-saas p-6 bg-gradient-to-r from-white via-blue-50/40 to-emerald-50/40 flex flex-col md:flex-row md:items-center justify-between gap-5 border-l-4 border-l-[#17365D]">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-[#16836B] to-[#C49A45] shadow-md shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/image_9f3d5314.png"
              alt="Al-Furqan Emblem"
              className="w-full h-full rounded-full object-contain bg-white"
            />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-arabic text-[#16836B] font-bold text-sm">
                مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] font-bold text-[#C49A45] uppercase">
                GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D] tracking-tight uppercase leading-snug">
              AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Ethiopia, Eastern Oromia, Chiro Town · Welcome back, Al-Sheikh Khadir Hamza (Head Mudir).
            </p>
          </div>
        </div>

        {/* Dual Calendar Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Date</div>
            <div className="font-ethiopic font-bold text-[#17365D]">
              {ethDate.monthNameAmharic} {ethDate.geezDay} ቀን {ethDate.year} ዓ.ም
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} EAT
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#17365D]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Statistics Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigate('students')}
          className="card-saas p-5 cursor-pointer hover:border-[#17365D] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Students
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#17365D]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#17365D] font-mono">
              {totalStudents}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeStudents} Active
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Enrolled across 10 Addis Ababa sub-cities</span>
          </div>
        </div>

        {/* Card 2: Faculty & Ustadhs */}
        <div
          onClick={() => onNavigate('faculty_hr')}
          className="card-saas p-5 cursor-pointer hover:border-[#17365D] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Faculty & Ustadhs
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#16836B]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#17365D] font-mono">
              {totalFaculty}
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Sanad Certified
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Hifz, Tajweed, Hadith & Shafi Fiqh scholars
          </div>
        </div>

        {/* Card 3: Classes & Halqahs */}
        <div
          onClick={() => onNavigate('classes_sections')}
          className="card-saas p-5 cursor-pointer hover:border-[#17365D] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Halqahs
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#C49A45]">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#17365D] font-mono">
              {totalClasses}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              92% Filled
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Circles from Foundation Nazira to Khatm
          </div>
        </div>

        {/* Card 4: Fee Collection Rate */}
        <div
          onClick={() => onNavigate('cashbook')}
          className="card-saas p-5 cursor-pointer hover:border-[#17365D] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Fee Collection (ETB)
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-[#17365D] font-mono">
              {collectionRate}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
              {totalCollectedETB.toLocaleString()} ETB
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            CBE, Awash Bank & Telebirr verified
          </div>
        </div>
      </div>

      {/* 3. Quick Command Ribbon */}
      <div className="card-saas p-4 bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-[#17365D] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
            Quick Command Actions
          </span>
          <span className="text-[10px] text-slate-400">One-click administrative tools</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-[#17365D] text-xs font-semibold text-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-[#16836B]" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-[#17365D] text-xs font-semibold text-slate-700 transition"
          >
            <ClipboardCheck className="w-4 h-4 text-[#17365D]" />
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('cashbook')}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-[#17365D] text-xs font-semibold text-slate-700 transition"
          >
            <DollarSign className="w-4 h-4 text-[#C49A45]" />
            <span>Post Cash Voucher</span>
          </button>
          <button
            onClick={() => onNavigate('hifz_tracker')}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-[#17365D] text-xs font-semibold text-slate-700 transition"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Log Recitation</span>
          </button>
          <button
            onClick={() => onNavigate('document_center')}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-[#17365D] text-xs font-semibold text-slate-700 transition"
          >
            <Printer className="w-4 h-4 text-purple-600" />
            <span>Official Print Hub</span>
          </button>
        </div>
      </div>

      {/* 4. Two Column Grid: Attendance & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance & Hifz Milestones (7 Cols) */}
        <div className="lg:col-span-7 card-saas p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#16836B]" />
              <h3 className="font-bold text-sm text-[#17365D]">Today's Roll-Call & Attendance Overview</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              96.2% Present
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-xl">
              <span className="text-[10px] text-[#065F46] uppercase font-bold block">Present</span>
              <span className="text-xl font-extrabold text-[#065F46] font-mono">112</span>
              <span className="text-[10px] text-emerald-600 font-medium">96.2%</span>
            </div>
            <div className="bg-[#FEF9C3] border border-[#FDE047] p-3 rounded-xl">
              <span className="text-[10px] text-[#854D0E] uppercase font-bold block">Late</span>
              <span className="text-xl font-extrabold text-[#854D0E] font-mono">3</span>
              <span className="text-[10px] text-amber-700 font-medium">2.5%</span>
            </div>
            <div className="bg-[#FFF1F2] border border-[#FECDD3] p-3 rounded-xl">
              <span className="text-[10px] text-[#9F1239] uppercase font-bold block">Excused / Absent</span>
              <span className="text-xl font-extrabold text-[#9F1239] font-mono">2</span>
              <span className="text-[10px] text-rose-700 font-medium">1.3%</span>
            </div>
          </div>

          {/* Academic Performance & Top Memorizers */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C49A45]" />
                <span className="font-bold text-xs text-[#17365D] uppercase">
                  Top Qur’an Hifz Memorization Progress
                </span>
              </div>
              <button
                onClick={() => onNavigate('hifz_tracker')}
                className="text-[11px] text-[#16836B] hover:underline font-semibold"
              >
                View 30-Juz Board
              </button>
            </div>

            <div className="space-y-2">
              {topStudents.map(st => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudentForDossier(st)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#17365D] text-white flex items-center justify-center font-bold text-xs">
                      {st.fullNameEnglish.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{st.fullNameEnglish}</div>
                      <div className="text-[11px] text-slate-400">{st.rollNo} · {st.hifzLevel}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-[#16836B] text-sm">
                      {st.memorizedJuzCount} of 30 Juz
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Surah #{st.currentSurah} Ayah {st.currentAyah}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Overview & Cash Balance (5 Cols) */}
        <div className="lg:col-span-5 card-saas p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#17365D]" />
                <h3 className="font-bold text-sm text-[#17365D]">Treasury & Financial Overview</h3>
              </div>
              <button
                onClick={() => onNavigate('cashbook')}
                className="text-[11px] text-[#16836B] hover:underline font-semibold"
              >
                Cashbook & Chart
              </button>
            </div>

            {/* Total Balance Card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#17365D] to-[#102642] text-white">
              <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
                Total Multi-Account Liquidity
              </span>
              <div className="text-2xl font-extrabold font-mono mt-1 text-[#C49A45]">
                {state.accounts.reduce((s, a) => s + a.balanceETB, 0).toLocaleString()} ETB
              </div>
              <span className="text-[10px] text-emerald-300 mt-1 block">
                Commercial Bank of Ethiopia · Awash Bank · Safe
              </span>
            </div>

            {/* Inflows vs Outflows mini meters */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Revenue Inflows</span>
                <span className="text-base font-bold text-[#16836B] font-mono mt-0.5 block">
                  {state.vouchers.filter(v => v.type === 'INCOME').reduce((s, v) => s + v.amountETB, 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Operating Expenses</span>
                <span className="text-base font-bold text-[#17365D] font-mono mt-0.5 block">
                  {state.vouchers.filter(v => v.type === 'EXPENSE').reduce((s, v) => s + v.amountETB, 0).toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Events Box */}
          <div className="pt-3 border-t border-slate-100">
            <span className="font-bold text-xs text-[#17365D] uppercase block mb-2">
              Upcoming Institutional Events
            </span>
            <div className="space-y-2 text-xs">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                  <span className="font-semibold text-slate-700">{ev.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#17365D] font-bold">
                    {ev.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activities & Important Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activities (7 Cols) */}
        <div className="lg:col-span-7 card-saas p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#17365D]">Recent Operations & Audit Trail</h3>
            <button
              onClick={() => onNavigate('audit_log')}
              className="text-[11px] text-[#16836B] hover:underline font-semibold"
            >
              View Full Audit Trail
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {state.auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 rounded-full bg-[#16836B] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">{log.details}</p>
                  <span className="text-[10px] text-slate-400 font-medium">Actor: {log.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Announcements (5 Cols) */}
        <div className="lg:col-span-5 card-saas p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#C49A45]" />
              <h3 className="font-bold text-sm text-[#17365D]">Important Circulars</h3>
            </div>
            <button
              onClick={() => onNavigate('circulars_notices')}
              className="text-[11px] text-[#16836B] hover:underline font-semibold"
            >
              All Circulars
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {state.notices.slice(0, 3).map(n => (
              <div key={n.id} className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17365D]">{n.titleEnglish}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    n.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : n.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {n.priority}
                  </span>
                </div>
                <div className="font-ethiopic text-[11px] text-slate-700">{n.titleAmharic}</div>
                <p className="text-slate-600 line-clamp-2 text-[11px] mt-1">{n.contentEnglish}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print Preview Modal if a student is clicked */}
      {selectedStudentForDossier && (
        <PrintPreviewModal
          isOpen={true}
          onClose={() => setSelectedStudentForDossier(null)}
          documentType="DOSSIER"
          student={selectedStudentForDossier}
          assessments={state.assessments}
          hifzRecords={state.hifzRecords}
        />
      )}
    </div>
  );
};
