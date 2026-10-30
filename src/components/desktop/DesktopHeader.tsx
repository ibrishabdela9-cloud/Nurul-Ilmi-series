/**
 * Desktop Titlebar & Executive Header
 * Native window chrome, live dual Ethiopian Ge'ez & Gregorian clock,
 * live Addis Ababa prayer status bar with Azan chime trigger,
 * and quick-action launcher.
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Compass,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Printer,
} from 'lucide-react';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { calculatePrayerTimes, playAzanChime } from '../../lib/prayer';
import { DesktopNavModule } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';

interface DesktopHeaderProps {
  activeModule: DesktopNavModule;
  onNavigate: (module: DesktopNavModule) => void;
  onOpenCommandPalette: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeModule,
  onNavigate,
  onOpenCommandPalette,
  isMaximized,
  onToggleMaximize,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [chimeTested, setChimeTested] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ethDate = toEthiopianDate(currentTime);
  const prayerData = calculatePrayerTimes(currentTime);

  const handleChimeTest = () => {
    playAzanChime();
    setChimeTested(true);
    setTimeout(() => setChimeTested(false), 2000);
  };

  return (
    <header className="h-14 bg-slate-950/95 backdrop-blur-xl border-b border-emerald-900/40 flex items-center justify-between px-3.5 select-none z-30 shrink-0 shadow-lg">
      {/* Left: Window Controls & App Identity */}
      <div className="flex items-center gap-3">
        {/* macOS-style desktop buttons */}
        <div className="flex items-center gap-1.5 mr-2">
          <button
            title="Minimize to Dashboard"
            onClick={() => onNavigate('dashboard')}
            className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 transition-colors shadow-sm"
          />
          <button
            title="Minimize"
            onClick={() => onNavigate('dashboard')}
            className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors shadow-sm"
          />
          <button
            title={isMaximized ? 'Restore Window' : 'Maximize Window'}
            onClick={onToggleMaximize}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-sm"
          />
        </div>

        {/* Brand Identity */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 flex items-center justify-center shadow-md shadow-emerald-950/80 border border-emerald-400/40 group-hover:border-amber-400/60 transition-colors">
            <span className="font-arabic text-amber-300 font-bold text-lg leading-none">ن</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Nurul Ilmi
              </span>
              <span className="font-arabic text-sm text-amber-400 font-bold">نور العلم</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-medium">
                Addis Ababa · ETB
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-none mt-0.5">
              Integrated Qur’an & Financial Desktop Architecture
            </div>
          </div>
        </button>
      </div>

      {/* Center: Live Prayer Timetable Badge & Ge'ez Calendar */}
      <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-emerald-800/40 rounded-full px-3.5 py-1 text-xs shadow-inner">
        {/* Ethiopian Date */}
        <button
          onClick={() => onNavigate('ethiopian_calendar')}
          className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors pr-2.5 border-r border-slate-800"
          title="Open Ethiopian Ge'ez Calendar Engine"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-ethiopic font-semibold text-amber-300">{ethDate.monthNameAmharic} {ethDate.geezDay}</span>
          <span className="text-[11px] text-slate-400 font-mono">({ethDate.year} ዓ.ም)</span>
        </button>

        {/* Next Prayer & Azan Countdown */}
        <button
          onClick={() => onNavigate('prayer_engine')}
          className="flex items-center gap-1.5 text-slate-200 hover:text-emerald-300 transition-colors"
          title="Open Solar Prayer Engine for Addis Ababa"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Next:</span>
          <span className="font-bold text-emerald-300">{prayerData.nextPrayer?.nameEnglish}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-mono font-bold shadow-sm">
            in {prayerData.countdownFormatted}
          </span>
        </button>

        {/* Qibla Direction */}
        <button
          onClick={() => onNavigate('prayer_engine')}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 pl-2.5 border-l border-slate-800 font-medium"
          title="Qibla Bearing from Addis Ababa to Ka'bah (Mecca)"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>353.4° NNW</span>
        </button>

        {/* Azan Chime Test */}
        <button
          onClick={handleChimeTest}
          className={`p-1 rounded-full text-slate-400 hover:text-amber-400 transition-all ${
            chimeTested ? 'text-amber-400 scale-125' : ''
          }`}
          title={chimeTested ? 'Chime Playing!' : 'Test Azan Web Audio Chime'}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Quick Search, Action Shortcuts, and Window State */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-600/60 text-xs text-slate-200 transition-all shadow-inner group"
          title="Search anything across all modules (Ctrl+K or Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:inline text-slate-300">Search records...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-800 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* PWA Desktop & Android Install Launcher */}
        <PWAInstallButton variant="header" />
        <PWAInstallButton variant="header-usb" />

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => onNavigate('ai_assistant')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-950 to-emerald-950 hover:from-teal-900 hover:to-emerald-900 border border-emerald-600/50 hover:border-emerald-400 text-xs text-emerald-200 transition-all shadow-sm font-medium"
          title="Open AI Institutional & Tajweed Advisor"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline">AI Advisor</span>
        </button>

        {/* Document & Print Quick Button */}
        <button
          onClick={() => onNavigate('document_center')}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          title="Print Official Ethiopian Stamped Receipts, ID Cards & Transcripts"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Maximize/Restore Toggle */}
        <button
          onClick={onToggleMaximize}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors hidden sm:flex"
          title={isMaximized ? 'Restore Window Size' : 'Maximize Window'}
        >
          {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
