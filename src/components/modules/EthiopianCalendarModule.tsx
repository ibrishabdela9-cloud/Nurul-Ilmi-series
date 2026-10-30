/**
 * Module 20: Ethiopian (Ge'ez) Calendar Engine
 * Beyene-Kudlek JDN conversion engine providing dual Gregorian/Ethiopian date displays,
 * Amharic script localization, Ge'ez numerals, and interactive bidirectional converter.
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ArrowRightLeft,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  toEthiopianDate,
  fromEthiopianDate,
  toGeezNumber,
  ETHIOPIAN_MONTHS,
  ETHIOPIAN_DAYS,
} from '../../lib/ethiopian-calendar';

export const EthiopianCalendarModule: React.FC = () => {
  const [gregorianDateInput, setGregorianDateInput] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Manual Ethiopian Input
  const todayEth = toEthiopianDate();
  const [ethYearInput, setEthYearInput] = useState<number>(todayEth.year);
  const [ethMonthInput, setEthMonthInput] = useState<number>(todayEth.month);
  const [ethDayInput, setEthDayInput] = useState<number>(todayEth.day);

  // Converted results
  const convertedFromGregorian = toEthiopianDate(new Date(gregorianDateInput));
  const convertedToGregorian = fromEthiopianDate(ethYearInput, ethMonthInput, ethDayInput);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Ethiopian (Ge'ez) Calendar Engine</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የኢትዮጵያ ዘመን አቆጣጠር እና የግዕዝ ቁጥሮች</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Authentic Beyene-Kudlek Julian Day Number (JDN) astronomical engine for dual calendar institutional synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <span className="font-ethiopic font-bold text-amber-300">
            ዛሬ፡ {todayEth.formattedAmharic}
          </span>
        </div>
      </div>

      {/* Today's Dual Calendar Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/60 border border-amber-600/50 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            CURRENT ETHIOPIAN CALENDAR DATE (ዓመተ ምሕረት)
          </div>
          <div className="font-ethiopic font-extrabold text-3xl sm:text-4xl text-amber-300">
            {todayEth.monthNameAmharic} {todayEth.geezDay} ቀን {todayEth.geezYear} ዓ.ም
          </div>
          <div className="text-sm text-slate-300">
            {todayEth.formattedEnglish} · Day: <span className="font-ethiopic text-amber-200">{todayEth.dayNameAmharic}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Gregorian Alignment</div>
          <div className="text-lg font-bold text-white font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">UTC+3 (East Africa Time)</div>
        </div>
      </div>

      {/* Bidirectional Converter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Box 1: Gregorian -> Ethiopian */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white pb-2 border-b border-slate-800">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <span>Gregorian Date → Ethiopian Date (Ge'ez)</span>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Select Gregorian Calendar Date:</label>
            <input
              type="date"
              value={gregorianDateInput}
              onChange={e => setGregorianDateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/80 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Converted Ethiopian Date:</div>
            <div className="font-ethiopic text-xl font-bold text-amber-300">
              {convertedFromGregorian.formattedAmharic}
            </div>
            <div className="text-xs text-slate-300">
              English Transliteration: {convertedFromGregorian.formattedEnglish}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono pt-1">
              Ge'ez Day: {convertedFromGregorian.geezDay} | Ge'ez Year: {convertedFromGregorian.geezYear}
            </div>
          </div>
        </div>

        {/* Box 2: Ethiopian -> Gregorian */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-white pb-2 border-b border-slate-800">
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <span>Ethiopian Date → Gregorian Date</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">Day (1-30):</label>
              <input
                type="number"
                min={1}
                max={ethMonthInput === 13 ? 6 : 30}
                value={ethDayInput}
                onChange={e => setEthDayInput(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Month (1-13):</label>
              <select
                value={ethMonthInput}
                onChange={e => setEthMonthInput(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-ethiopic outline-none focus:border-emerald-500"
              >
                {ETHIOPIAN_MONTHS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.id}. {m.amharic} ({m.english})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Year (ዓ.ም):</label>
              <input
                type="number"
                min={1900}
                max={2100}
                value={ethYearInput}
                onChange={e => setEthYearInput(parseInt(e.target.value, 10) || 2019)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/80 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Calculated Gregorian Equivalent:</div>
            <div className="text-xl font-bold text-white font-mono">
              {convertedToGregorian.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs text-slate-400">
              ISO Format: {convertedToGregorian.toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* 13 Ethiopian Months Overview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <div className="font-bold text-sm text-slate-100 pb-2 border-b border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>The 13 Canonical Months of Ethiopia (፲፫ቱ የወራት ሰንጠረዥ)</span>
          </span>
          <span className="text-[11px] text-slate-400">12 Months of 30 Days + 1 Pagume (5 or 6 Days)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {ETHIOPIAN_MONTHS.map(m => {
            const isCurrentMonth = todayEth.month === m.id;
            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrentMonth
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-500 font-mono">Month {m.id} ({toGeezNumber(m.id)})</div>
                <div className="font-ethiopic font-bold text-base text-amber-300 mt-0.5">{m.amharic}</div>
                <div className="text-[11px] text-slate-300">{m.english}</div>
                <div className="text-[10px] text-slate-500 mt-1">{m.maxDays} Days</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
