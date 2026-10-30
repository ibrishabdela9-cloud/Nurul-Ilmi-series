/**
 * Module 3: Qur’an Hifz Tracker
 * Three-tier daily recitation tracking: Sabaq, Sabqi, and Manzil.
 * Strict validation against canonical 114 Surahs with exact Ayah bounds,
 * Tajweed accuracy scoring (1-10), and 30-Juz completion visualizer.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { CANONICAL_SURAHS, getSurahByNumber, validateAyahRange } from '../../lib/quran-data';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { HifzDailyRecord } from '../../types';

interface HifzTrackerProps {
  state: AppStoreState;
  onAddHifzRecord: (record: HifzDailyRecord) => void;
  onUpdateStudentProgress: (studentId: string, currentJuz: number, surah: number, ayah: number, memorizedJuz: number) => void;
}

export const HifzTrackerModule: React.FC<HifzTrackerProps> = ({
  state,
  onAddHifzRecord,
  onUpdateStudentProgress,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    state.selectedStudentId || (state.students[0]?.id ?? '')
  );

  // Form states for recording daily recitation
  const [sabaqSurah, setSabaqSurah] = useState<number>(1);
  const [sabaqStartAyah, setSabaqStartAyah] = useState<number>(1);
  const [sabaqEndAyah, setSabaqEndAyah] = useState<number>(7);
  const [sabaqMistakes, setSabaqMistakes] = useState<number>(0);
  const [sabaqTajweedScore, setSabaqTajweedScore] = useState<number>(9);

  const [sabqiJuz, setSabqiJuz] = useState<number>(1);
  const [sabqiSurah, setSabqiSurah] = useState<number>(1);
  const [sabqiGrade, setSabqiGrade] = useState<'Mumtaz (A)' | 'Jayyid Jiddan (B)' | 'Jayyid (C)' | 'Maqbool (D)' | 'Da\'eef (F)'>('Mumtaz (A)');

  const [manzilJuz, setManzilJuz] = useState<number>(1);
  const [manzilRetention, setManzilRetention] = useState<'Flawless' | 'Good' | 'Needs Revision' | 'Weak'>('Flawless');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentStudent = state.students.find(s => s.id === selectedStudentId);
  const currentSurahMeta = getSurahByNumber(sabaqSurah);

  // Filter recitations for the selected student
  const studentRecords = state.hifzRecords.filter(r => r.studentId === selectedStudentId);

  const handleSurahChange = (num: number) => {
    setSabaqSurah(num);
    const surah = getSurahByNumber(num);
    if (surah) {
      setSabaqStartAyah(1);
      setSabaqEndAyah(Math.min(10, surah.ayahCount));
    }
  };

  const handleSubmitRecitation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Ayah range against canonical 114 Surahs
    const validation = validateAyahRange(sabaqSurah, sabaqStartAyah, sabaqEndAyah);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid Ayah range');
      return;
    }

    const eth = toEthiopianDate();
    const newRecord: HifzDailyRecord = {
      id: `hifz-${Date.now()}`,
      studentId: selectedStudentId,
      date: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${eth.monthNameAmharic} ${eth.geezDay} ቀን ${eth.geezYear} ዓ.ም`,
      sabaqSurah,
      sabaqStartAyah,
      sabaqEndAyah,
      sabaqMistakes,
      sabaqTajweedScore,
      sabqiJuz,
      sabqiSurah,
      sabqiGrade,
      manzilJuz,
      manzilRetention,
      notes: notes.trim(),
      ustadhId: 'fac-002', // Assigned Senior Ustadh
    };

    onAddHifzRecord(newRecord);

    // Update student's progress position
    if (currentStudent) {
      const updatedJuz = Math.max(currentStudent.currentJuz, currentSurahMeta?.startJuz || 1);
      const isKhatm = updatedJuz === 30 && sabaqSurah === 114;
      const newMemorizedCount = isKhatm ? 30 : Math.min(30, Math.max(currentStudent.memorizedJuzCount, updatedJuz));
      
      onUpdateStudentProgress(
        selectedStudentId,
        updatedJuz,
        sabaqSurah,
        sabaqEndAyah,
        newMemorizedCount
      );

      if (isKhatm) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
        setSuccessMessage(`MashaAllah! Khatm milestone achieved for ${currentStudent.fullNameEnglish}! Full 30 Juz memorization logged.`);
      } else {
        setSuccessMessage(`Recitation successfully saved for ${currentStudent.fullNameEnglish}.`);
      }
    }

    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Qur’an Hifz Tracker</h1>
            <span className="font-arabic text-amber-300 text-lg">سجل التحفيظ اليومي</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rigorous three-tier daily assessment: Sabaq (New Lesson), Sabqi (Recent Revision), and Manzil (Cumulative Retention).
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Select Student:</label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-1.5 focus:border-emerald-500 outline-none"
          >
            {state.students.map(st => (
              <option key={st.id} value={st.id}>
                {st.fullNameEnglish} ({st.rollNo}) - Juz {st.currentJuz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentStudent && (
        <>
          {/* Student Hifz Overview Card & 30-Juz Visualizer */}
          <div className="board-card rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${currentStudent.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {currentStudent.fullNameEnglish.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{currentStudent.fullNameEnglish}</span>
                    <span className="font-ethiopic text-amber-300 text-sm">({currentStudent.fullNameAmharic})</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                      {currentStudent.rollNo}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Hifz Level: <span className="text-slate-200 font-medium">{currentStudent.hifzLevel}</span> · Halqah Assigned: <span className="text-slate-200 font-medium">Ustadh Hassen Taha</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div className="text-center px-2">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Memorized</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">
                    {currentStudent.memorizedJuzCount} / 30 <span className="text-xs font-normal text-slate-400">Juz</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center px-2">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Surah</div>
                  <div className="text-sm font-bold text-amber-300">
                    {getSurahByNumber(currentStudent.currentSurah)?.nameTransliterated || 'Surah'}
                  </div>
                  <div className="text-[10px] text-slate-400">Ayah {currentStudent.currentAyah}</div>
                </div>
              </div>
            </div>

            {/* 30-Juz Completion Grid Visualizer */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>30-Juz Retention Matrix</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {Math.round((currentStudent.memorizedJuzCount / 30) * 100)}% Complete
                </span>
              </div>
              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1">
                {Array.from({ length: 30 }, (_, idx) => {
                  const juzNum = idx + 1;
                  const isCompleted = juzNum <= currentStudent.memorizedJuzCount;
                  const isCurrent = juzNum === currentStudent.currentJuz;
                  return (
                    <div
                      key={juzNum}
                      title={`Juz ${juzNum} ${isCompleted ? '• Memorized & Retained' : isCurrent ? '• In Progress' : '• Pending'}`}
                      className={`h-7 rounded flex items-center justify-center text-[11px] font-mono font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/80 border border-emerald-500'
                          : isCurrent
                          ? 'bg-amber-600/80 text-amber-100 border border-amber-400 animate-pulse'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {juzNum}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recitation Entry Form & History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Input Form (5 Cols) */}
            <div className="lg:col-span-5 board-card rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="font-bold text-sm text-slate-100">Log Daily Recitation</h2>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRecitation} className="space-y-4 text-xs">
                {/* 1. Sabaq Section */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between font-semibold text-emerald-400">
                    <span>1. Sabaq (السبق - New Lesson)</span>
                    <span className="text-[10px] text-slate-400">Daily Goal</span>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Canonical Surah (1 - 114):</label>
                    <select
                      value={sabaqSurah}
                      onChange={e => handleSurahChange(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                    >
                      {CANONICAL_SURAHS.map(surah => (
                        <option key={surah.number} value={surah.number}>
                          {surah.number}. {surah.nameTransliterated} ({surah.nameArabic}) - {surah.ayahCount} Ayahs [Juz {surah.startJuz}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 mb-1 block">Start Ayah:</label>
                      <input
                        type="number"
                        min={1}
                        max={currentSurahMeta?.ayahCount || 7}
                        value={sabaqStartAyah}
                        onChange={e => setSabaqStartAyah(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">
                        End Ayah (Max: {currentSurahMeta?.ayahCount}):
                      </label>
                      <input
                        type="number"
                        min={sabaqStartAyah}
                        max={currentSurahMeta?.ayahCount || 7}
                        value={sabaqEndAyah}
                        onChange={e => setSabaqEndAyah(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 mb-1 block">Mistakes Count:</label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={sabaqMistakes}
                        onChange={e => setSabaqMistakes(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Tajweed Score (1-10):</label>
                      <select
                        value={sabaqTajweedScore}
                        onChange={e => setSabaqTajweedScore(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500 font-bold text-amber-300"
                      >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => (
                          <option key={score} value={score}>
                            {score}/10 {score >= 9 ? '★ Mumtaz' : score >= 7 ? '✓ Jayyid' : 'Needs Practice'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Sabqi Section */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between font-semibold text-amber-400">
                    <span>2. Sabqi (السبقي - Recent Revision)</span>
                    <span className="text-[10px] text-slate-400">Past 1-2 Juz</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 mb-1 block">Revision Juz (1-30):</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={sabqiJuz}
                        onChange={e => setSabqiJuz(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Evaluation Grade:</label>
                      <select
                        value={sabqiGrade}
                        onChange={e => setSabqiGrade(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      >
                        <option value="Mumtaz (A)">Mumtaz (A)</option>
                        <option value="Jayyid Jiddan (B)">Jayyid Jiddan (B)</option>
                        <option value="Jayyid (C)">Jayyid (C)</option>
                        <option value="Maqbool (D)">Maqbool (D)</option>
                        <option value="Da'eef (F)">Da'eef (F)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Manzil Section */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between font-semibold text-teal-400">
                    <span>3. Manzil (المنزل - Cumulative Retention)</span>
                    <span className="text-[10px] text-slate-400">Quarter/Juz Cycle</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 mb-1 block">Manzil Juz (1-30):</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={manzilJuz}
                        onChange={e => setManzilJuz(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Retention Quality:</label>
                      <select
                        value={manzilRetention}
                        onChange={e => setManzilRetention(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-100 outline-none focus:border-emerald-500"
                      >
                        <option value="Flawless">Flawless (Strong Retention)</option>
                        <option value="Good">Good (Minor pauses)</option>
                        <option value="Needs Revision">Needs Revision (Tashkeel errors)</option>
                        <option value="Weak">Weak (Re-assign to Sabqi)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ustadh Notes */}
                <div>
                  <label className="text-slate-400 mb-1 block">Ustadh Tajweed & Observation Notes:</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Focus on Ikhfa Haqiqi with letter Kaaf and Noon Sakinah."
                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-950/80"
                >
                  <Plus className="w-4 h-4" />
                  <span>Commit Daily Recitation Record</span>
                </button>
              </form>
            </div>

            {/* Right: History Log (7 Cols) */}
            <div className="lg:col-span-7 board-card rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-bold text-sm text-slate-100">
                    Recitation History for {currentStudent.fullNameEnglish}
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {studentRecords.length} records logged
                </span>
              </div>

              {studentRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p>No recitation logs yet for this student.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Use the form on the left to record today's Sabaq, Sabqi, and Manzil.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentRecords.map(rec => {
                    const surah = getSurahByNumber(rec.sabaqSurah);
                    return (
                      <div
                        key={rec.id}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                          <span className="font-medium text-slate-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{rec.date}</span>
                            <span className="font-ethiopic text-[11px] text-amber-300">({rec.ethiopianDateString})</span>
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                            Tajweed: {rec.sabaqTajweedScore}/10
                          </span>
                        </div>

                        {/* Three Tiers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Sabaq */}
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-900/60">
                            <div className="text-[10px] text-emerald-400 font-semibold uppercase">1. Sabaq</div>
                            <div className="font-bold text-white mt-0.5">
                              {surah?.nameTransliterated} (#{rec.sabaqSurah})
                            </div>
                            <div className="text-[11px] text-slate-300 font-mono">
                              Ayah {rec.sabaqStartAyah} - {rec.sabaqEndAyah}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Mistakes: <span className="text-amber-400 font-bold">{rec.sabaqMistakes}</span>
                            </div>
                          </div>

                          {/* Sabqi */}
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-900/60">
                            <div className="text-[10px] text-amber-400 font-semibold uppercase">2. Sabqi</div>
                            <div className="font-bold text-white mt-0.5">Juz {rec.sabqiJuz}</div>
                            <div className="text-[11px] text-slate-300">Grade: {rec.sabqiGrade}</div>
                          </div>

                          {/* Manzil */}
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-teal-900/60">
                            <div className="text-[10px] text-teal-400 font-semibold uppercase">3. Manzil</div>
                            <div className="font-bold text-white mt-0.5">Juz {rec.manzilJuz}</div>
                            <div className="text-[11px] text-teal-300 font-medium">{rec.manzilRetention}</div>
                          </div>
                        </div>

                        {rec.notes && (
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 italic">
                            "{rec.notes}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
