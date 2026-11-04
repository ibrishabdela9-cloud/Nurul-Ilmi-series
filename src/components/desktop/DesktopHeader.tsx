/**
 * Top Navigation Bar & Executive Header
 * Inspired by premium SaaS education platforms.
 * Contains:
 * - Academy Branding (Al-Furqan Quran & Hadith Academy)
 * - Global Search (Cmd+K / Ctrl+K)
 * - Live Dual Ge'ez Calendar & Prayer ticker
 * - Interactive Notifications Menu with unread badge
 * - Multilingual Language Selector (English, Afaan Oromoo, Arabic RTL, Amharic)
 * - Academic Year Selector
 * - User Profile & Account Menu
 * - Mobile Drawer Toggle
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Globe,
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Printer,
  Volume2,
  Menu,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { calculatePrayerTimes, playAzanChime } from '../../lib/prayer';
import { DesktopNavModule } from '../../types';
import { SupportedLanguage, TRANSLATIONS } from '../../lib/i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface DesktopHeaderProps {
  activeModule: DesktopNavModule;
  onNavigate: (module: DesktopNavModule) => void;
  onOpenCommandPalette: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  academicYear: string;
  onAcademicYearChange: (year: string) => void;
  onToggleSidebarMobile?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeModule,
  onNavigate,
  onOpenCommandPalette,
  isMaximized,
  onToggleMaximize,
  currentLanguage,
  onLanguageChange,
  academicYear,
  onAcademicYearChange,
  onToggleSidebarMobile,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLanguage];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setIsNotificationsOpen(false);
      if (languageRef.current && !languageRef.current.contains(target)) setIsLanguageOpen(false);
      if (yearRef.current && !yearRef.current.contains(target)) setIsYearOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ethDate = toEthiopianDate(currentTime);
  const prayerData = calculatePrayerTimes(currentTime);

  const sampleNotifications = [
    { id: 1, title: 'Term 1 Examination Schedule Released', time: '10m ago', read: false },
    { id: 2, title: 'New Tuition Payment of 12,500 ETB Received', time: '1h ago', read: false },
    { id: 3, title: 'Grand Anwar Mosque Jumu’ah Assembly Circular', time: '3h ago', read: true },
  ];

  return (
    <header className="h-16 bg-[#17365D] text-white border-b border-[#273449]/30 flex items-center justify-between px-4 sm:px-6 select-none z-30 shrink-0 shadow-md">
      {/* Left: Mobile Drawer Button + Academy Identity */}
      <div className="flex items-center gap-3">
        {onToggleSidebarMobile && (
          <button
            onClick={onToggleSidebarMobile}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white lg:hidden transition"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Brand Crest with Official Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-[#16836B] to-[#C49A45] shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/image_9f3d5314.png"
              alt="Al-Furqan Logo"
              className="w-full h-full rounded-full object-contain bg-white"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-200 transition-colors">
                Al-Furqan Center & Institute
              </span>
              <span className="font-arabic text-xs text-[#C49A45] font-bold hidden md:inline">
                مركز الفرقان
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium leading-tight hidden sm:block">
              Hifz & Islamic Studies · Ethiopia, Eastern Oromia, Chiro Town
            </div>
          </div>
        </button>
      </div>

      {/* Center: Live Prayer & Ge'ez Badge */}
      <div className="hidden xl:flex items-center gap-3 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs backdrop-blur-md">
        <button
          onClick={() => onNavigate('ethiopian_calendar')}
          className="flex items-center gap-1.5 text-slate-100 hover:text-[#C49A45] transition-colors pr-3 border-r border-white/20"
          title="Open Ethiopian Ge'ez Calendar"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-[#C49A45]" />
          <span className="font-ethiopic font-semibold">
            {ethDate.monthNameAmharic} {ethDate.geezDay} ቀን
          </span>
          <span className="text-[11px] text-slate-300 font-mono">({ethDate.year} ዓ.ም)</span>
        </button>

        <button
          onClick={() => onNavigate('prayer_engine')}
          className="flex items-center gap-1.5 text-slate-100 hover:text-emerald-300 transition-colors"
          title="Real-Time Prayer Tracker for Addis Ababa"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">Next:</span>
          <span className="font-bold text-emerald-300">{prayerData.nextPrayer?.nameEnglish}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16836B] text-white font-mono font-bold shadow-xs">
            in {prayerData.countdownFormatted}
          </span>
        </button>

        <button
          onClick={() => playAzanChime()}
          className="p-1 hover:text-[#C49A45] text-slate-300 transition"
          title="Test Azan Chime"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Toolbar: Search, Notifications, Language, Academic Year, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Manual Edition Quick Hub Button */}
        <button
          onClick={() => onNavigate('manual_edition')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16836B]/80 hover:bg-[#16836B] border border-emerald-400/30 text-xs text-white font-medium transition shadow-sm"
          title="Manual Edition Hub (Edit Records & Sync to Sheets)"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#C49A45]" />
          <span className="hidden sm:inline">Manual Edition</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-slate-200 transition shadow-inner"
          title="Search anything (Ctrl+K or Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#C49A45]" />
          <span className="hidden md:inline text-xs text-slate-200">Search records...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-black/30 border border-white/20 rounded text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white relative transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-[#273449] rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-[#17365D]">Notifications & Circulars</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                  2 Unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {sampleNotifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer text-xs">
                    <div className="font-semibold text-slate-800 leading-tight">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    onNavigate('circulars_notices');
                  }}
                  className="text-[11px] font-bold text-[#16836B] hover:underline"
                >
                  View All Announcements
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition"
            title="Select Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="uppercase text-[11px]">{currentLanguage}</span>
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-[#273449] rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
              {[
                { code: 'en', label: 'English', sub: 'Inter font' },
                { code: 'om', label: 'Afaan Oromoo', sub: 'Noto Sans' },
                { code: 'ar', label: 'العربية (Arabic RTL)', sub: 'Noto Naskh Arabic' },
                { code: 'am', label: 'አማርኛ (Amharic)', sub: 'Noto Sans Ethiopic' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code as SupportedLanguage);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition ${
                    currentLanguage === lang.code ? 'font-bold text-[#17365D] bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block">{lang.label}</span>
                    <span className="text-[10px] text-slate-400 block">{lang.sub}</span>
                  </div>
                  {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#16836B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Year Selector Dropdown */}
        <div className="relative hidden sm:block" ref={yearRef}>
          <button
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition"
            title="Academic Year"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="text-[11px] font-mono">{academicYear.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>

          {isYearOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-[#273449] rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
              {[
                '2026/2027 (2019 E.C.)',
                '2025/2026 (2018 E.C.)',
                '2024/2025 (2017 E.C.)',
              ].map(year => (
                <button
                  key={year}
                  onClick={() => {
                    onAcademicYearChange(year);
                    setIsYearOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition ${
                    academicYear === year ? 'font-bold text-[#17365D] bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{year}</span>
                  {academicYear === year && <Check className="w-3.5 h-3.5 text-[#16836B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile & Account Dropdown with Official Web Profile Icon */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-1.5 pr-1.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition group"
            title="Account & Institutional Profile"
          >
            <div className="w-8 h-8 rounded-full border border-[#C49A45] p-0.5 bg-white shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/image_9f3d5314.png"
                alt="Profile Icon"
                className="w-full h-full rounded-full object-contain"
              />
            </div>
            <div className="hidden lg:block text-left text-xs leading-none mr-1">
              <span className="font-bold text-white block">Al-Sheikh Khadir</span>
              <span className="text-[9px] text-[#C49A45] block mt-0.5">Head Mudir</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-[#273449] rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                <img
                  src="/assets/aistudio/image_9f3d5314.png"
                  alt="Al-Furqan Emblem"
                  className="w-10 h-10 rounded-full border border-[#16836B] p-0.5 bg-white object-contain shrink-0"
                />
                <div>
                  <span className="font-bold text-sm text-[#17365D] block">Al-Sheikh Khadir Hamza</span>
                  <span className="text-[10px] text-slate-400 block">ibrishabdela9@gmail.com</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold mt-0.5 inline-block">
                    Head Mudir & Principal
                  </span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('settings');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academy Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('document_center');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Document & Print Hub</span>
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-700 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Role / Lock Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
