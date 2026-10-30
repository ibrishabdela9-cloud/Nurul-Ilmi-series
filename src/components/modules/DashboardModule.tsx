/**
 * Module 1: Executive Dashboard & Live Institutional Boards
 * High-clarity boards for real-time counts of enrolled students,
 * Qur'an Hifz retention, fee collections in ETB, cashbook ledger,
 * prayer timings for Addis Ababa, and rapid administrative actions.
 */

import React from 'react';
import {
  Users,
  Wallet,
  Receipt,
  HeartHandshake,
  BookOpen,
  Plus,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Calendar,
  Sparkles,
  Printer,
  Compass,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { DesktopNavModule } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { calculatePrayerTimes, playAzanChime } from '../../lib/prayer';

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

  // Metrics computation
  const activeStudents = state.students.filter(s => s.status === 'Active');
  const totalMemorizedJuz = state.students.reduce((acc, s) => acc + s.memorizedJuzCount, 0);

  const totalBankAndCashETB = state.accounts.reduce((acc, a) => acc + a.balanceETB, 0);

  const totalInvoicedETB = state.invoices.reduce((acc, i) => acc + i.amountETB, 0);
  const totalCollectedETB = state.invoices.reduce((acc, i) => acc + i.amountPaidETB, 0);
  const totalReceivablesETB = state.invoices.reduce((acc, i) => acc + i.balanceETB, 0);
  const feeCollectionRate = totalInvoicedETB > 0 ? Math.round((totalCollectedETB / totalInvoicedETB) * 100) : 0;

  const activeOrphanSponsorships = state.orphanSponsorships.filter(o => o.isActive).length;

  return (
    <div className="space-y-6">
      {/* ==================== WELCOME & EXECUTIVE BOARD BANNER ==================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#041f17] via-slate-950 to-[#031713] border border-emerald-500/30 p-6 shadow-2xl">
        {/* Subtle Islamic Calligraphy watermark background */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-5 pointer-events-none flex items-center justify-center font-arabic text-9xl text-amber-300 select-none">
          نور العلم
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-arabic text-amber-300 text-lg font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono font-medium">
                Addis Ababa · EAT UTC+3
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Nurul Ilmi Series</span>
              <span className="font-arabic text-amber-400 font-normal text-2xl">نور العلم</span>
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              Integrated Qur’an Memorization (Hifz), Tajweed science, Islamic jurisprudence, and double-entry ETB institutional ledger.
            </p>
          </div>

          {/* Ethiopian Ge'ez Calendar Card */}
          <div className="flex items-center gap-3.5 bg-slate-900/95 border border-amber-500/30 rounded-xl p-3.5 text-xs shadow-lg shrink-0">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-ethiopic font-bold text-amber-300 text-sm">
                {ethDate.formattedAmharic}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {ethDate.formattedEnglish}
              </div>
              <button
                onClick={() => onNavigate('ethiopian_calendar')}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold mt-0.5 block"
              >
                Open Ge’ez Engine &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PRIMARY 4 KPI METRIC BOARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Board 1: Students & Hifz Retention */}
        <div
          onClick={() => onNavigate('students')}
          className="cursor-pointer board-card rounded-2xl p-4.5 hover:scale-[1.02] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {activeStudents.length}{' '}
            <span className="text-sm font-normal text-slate-400 font-sans">Enrolled</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-emerald-400 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalMemorizedJuz} Juz Retained</span>
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric Board 2: Net Cashbook ETB */}
        <div
          onClick={() => onNavigate('cashbook')}
          className="cursor-pointer board-card rounded-2xl p-4.5 hover:scale-[1.02] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Net Cashbook (ETB)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-sm">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight font-mono tabular-nums">
            {totalBankAndCashETB.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between font-medium">
            <span>4 Accounts (CBE, Awash, Safe)</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric Board 3: Tuition Invoicing */}
        <div
          onClick={() => onNavigate('fees_invoicing')}
          className="cursor-pointer board-card rounded-2xl p-4.5 hover:scale-[1.02] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-400" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tuition Invoicing
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform shadow-sm">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {feeCollectionRate}%{' '}
            <span className="text-sm font-normal text-teal-400 font-sans">Collected</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between font-medium">
            <span>Due: {totalReceivablesETB.toLocaleString()} ETB</span>
            <ArrowUpRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric Board 4: Orphan Sponsorship */}
        <div
          onClick={() => onNavigate('charity_funds')}
          className="cursor-pointer board-card rounded-2xl p-4.5 hover:scale-[1.02] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Orphan Sponsorship
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-sm">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
            {activeOrphanSponsorships}{' '}
            <span className="text-sm font-normal text-rose-300 font-sans">100% Sponsored</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-rose-400 flex items-center justify-between font-medium">
            <span>Boarding & Mushafs Covered</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ==================== QUICK COMMAND ACTION RIBBON ==================== */}
      <div className="board-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <span className="font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="tracking-wide uppercase text-[11px]">Quick Action Command Ribbon:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('hifz_tracker')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-950 active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Record Daily Sabaq</span>
          </button>
          <button
            onClick={() => onNavigate('cashbook')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold transition-all hover:border-amber-500/50 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Post Cash Voucher</span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold transition-all hover:border-emerald-500/50 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Admission</span>
          </button>
          <button
            onClick={() => onNavigate('document_center')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold transition-all hover:border-teal-500/50 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>Print Stamped Receipt</span>
          </button>
          <button
            onClick={() => onNavigate('zakat_calculator')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold transition-all hover:border-amber-500/50 active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Calculate Zakat Nisab</span>
          </button>
        </div>
      </div>

      {/* ==================== SPLIT BOARDS: MOSQUE OPERATIONS & HIFZ FEED ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Addis Ababa Mosque & Solar Prayer Board (1 Col) */}
        <div className="board-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-wide">
                  Addis Ababa Prayer Board
                </h2>
                <span className="text-[10px] text-slate-400">Solar Astrological Timetable</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('prayer_engine')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
            >
              Full Timetable &rarr;
            </button>
          </div>

          {/* Next Prayer Highlight Box */}
          <div className="board-card-highlight rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider">
                Next Adhan Call
              </span>
              <div className="text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
                <span>{prayerData.nextPrayer?.nameEnglish}</span>
                <span className="font-arabic text-amber-300 text-lg font-bold">
                  {prayerData.nextPrayer?.nameArabic}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Time:{' '}
                <span className="font-mono text-emerald-300 font-bold">
                  {prayerData.nextPrayer?.timeString}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-amber-300 font-mono tabular-nums">
                {prayerData.countdownFormatted}
              </div>
              <button
                onClick={() => playAzanChime()}
                className="mt-1.5 text-xs px-2.5 py-1 rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 transition-all font-semibold active:scale-95 shadow-sm"
              >
                Chime Test 🔔
              </button>
            </div>
          </div>

          {/* Quick Timetable Mini List */}
          <div className="space-y-1.5 text-xs">
            {prayerData.prayers.map(p => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                  p.isNext
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-white font-bold shadow-md shadow-emerald-950/50'
                    : p.passed
                    ? 'bg-slate-950/40 border-slate-900 text-slate-400'
                    : 'bg-slate-900/70 border-slate-800/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-arabic text-amber-300 font-bold text-sm">{p.nameArabic}</span>
                  <span className="font-medium">{p.nameEnglish}</span>
                </div>
                <span className="font-mono font-bold tabular-nums">{p.timeString}</span>
              </div>
            ))}
          </div>

          {/* Qibla Direction Notice */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Qibla to Ka’bah (Mecca)</span>
            </span>
            <span className="font-mono font-bold text-amber-300">353.4° NNW</span>
          </div>
        </div>

        {/* Right Column: Recent Sabaq Recitations & Hifz Progress Board (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Hifz Daily Recitations Board */}
          <div className="board-card rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white tracking-wide">
                    Hifz Recitation Activity Board
                  </h2>
                  <span className="text-[10px] text-slate-400">Live Sabaq, Sabqi & Manzil Registry</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('hifz_tracker')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                Open Hifz Tracker &rarr;
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3.5 font-bold">Student</th>
                    <th className="py-2.5 px-3.5 font-bold">Sabaq (Lesson)</th>
                    <th className="py-2.5 px-3.5 font-bold text-center">Tajweed</th>
                    <th className="py-2.5 px-3.5 font-bold">Sabqi</th>
                    <th className="py-2.5 px-3.5 font-bold">Manzil</th>
                    <th className="py-2.5 px-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                  {state.hifzRecords.slice(0, 5).map(record => {
                    const student = state.students.find(s => s.id === record.studentId);
                    return (
                      <tr key={record.id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-2.5 px-3.5">
                          <div className="font-bold text-slate-100">
                            {student?.fullNameEnglish || 'Unknown Student'}
                          </div>
                          <div className="font-ethiopic text-[11px] text-amber-300">
                            {student?.fullNameAmharic}
                          </div>
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-bold text-emerald-400">
                            Surah #{record.sabaqSurah}
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono">
                            Ayahs {record.sabaqStartAyah}–{record.sabaqEndAyah}
                          </div>
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                              record.sabaqTajweedScore >= 9
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                                : 'bg-amber-950 text-amber-300 border border-amber-600/60'
                            }`}
                          >
                            {record.sabaqTajweedScore}/10
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="text-slate-200 font-medium">Juz {record.sabqiJuz}</div>
                          <div className="text-[10px] text-slate-400">{record.sabqiGrade}</div>
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="text-slate-200 font-medium">Juz {record.manzilJuz}</div>
                          <div className="text-[10px] text-emerald-400 font-semibold">{record.manzilRetention}</div>
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            onClick={() => {
                              if (student) onSelectStudent(student.id);
                              onNavigate('students');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/50 transition-colors text-[11px] font-medium"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Financial Vouchers Ledger Board */}
          <div className="board-card rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white tracking-wide">
                    Treasury & Audited Cashbook Vouchers
                  </h2>
                  <span className="text-[10px] text-slate-400">CBE, Awash Bank, Cash Safe & Telebirr</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('cashbook')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold hover:underline"
              >
                Cashbook Ledger &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.vouchers.slice(0, 4).map(v => (
                <div
                  key={v.id}
                  className="bg-slate-950/90 border border-slate-800/90 hover:border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs transition-colors shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300">{v.voucherNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                          v.type === 'INCOME'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-600/60'
                        }`}
                      >
                        {v.type}
                      </span>
                    </div>
                    <div className="text-slate-100 font-semibold truncate max-w-[200px]">
                      {v.payerReceiver}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{v.category}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono font-extrabold text-sm ${
                        v.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {v.type === 'INCOME' ? '+' : '-'} {v.amountETB.toLocaleString()} ETB
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{v.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
