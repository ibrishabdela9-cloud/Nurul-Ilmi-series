/**
 * Global Command Palette (Ctrl+K / Cmd+K)
 * Lightning-fast desktop search across all modules, students,
 * vouchers, and quick administrative actions.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Users,
  Receipt,
  Wallet,
  Clock,
  Printer,
  Sparkles,
  X,
  ArrowRight,
  ShieldAlert,
  Cloud,
  Cable,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { DesktopNavModule } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppStoreState;
  onNavigate: (module: DesktopNavModule) => void;
  onSelectStudent: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  state,
  onNavigate,
  onSelectStudent,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled from parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search filtered results
  const matchedStudents = state.students.filter(
    s =>
      s.fullNameEnglish.toLowerCase().includes(q) ||
      s.fullNameAmharic.includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.guardianPhone.includes(q)
  );

  const matchedVouchers = state.vouchers.filter(
    v =>
      v.voucherNumber.toLowerCase().includes(q) ||
      v.payerReceiver.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
  );

  const allItems: { id: DesktopNavModule; label: string; group: string; icon: any }[] = [
    { id: 'dashboard', label: 'Go to Executive Dashboard', group: 'Navigation', icon: BookOpen },
    { id: 'hifz_tracker', label: 'Qur’an Hifz Tracker (Sabaq / Sabqi / Manzil)', group: 'Navigation', icon: BookOpen },
    { id: 'students', label: 'Student Admissions & ID Cards', group: 'Navigation', icon: Users },
    { id: 'prayer_engine', label: 'Solar Prayer Engine & Qibla Compass', group: 'Navigation', icon: Clock },
    { id: 'fees_invoicing', label: 'Fees & Invoicing (Telebirr & CBE Birr)', group: 'Navigation', icon: Receipt },
    { id: 'cashbook', label: 'Cashbook & Serialized Vouchers', group: 'Navigation', icon: Wallet },
    { id: 'zakat_calculator', label: 'Fiqh Zakat Calculator (85g Gold Nisab)', group: 'Navigation', icon: Receipt },
    { id: 'document_center', label: 'Official Printing Center (Receipts & IDs)', group: 'Navigation', icon: Printer },
    { id: 'document_center', label: 'Direct USB Android Sideload & Deployment Kit (Cable & ADB)', group: 'Installation', icon: Cable },
    { id: 'google_workspace', label: 'Google Workspace Cloud Sync (Drive & Sheets)', group: 'Navigation', icon: Cloud },
    { id: 'ai_assistant', label: 'AI Islamic Education & Tajweed Advisor', group: 'Navigation', icon: Sparkles },
  ];

  const navigationCommands = allItems.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, vouchers, prayer times, modules... (e.g. Bilal, NI-2024, Telebirr)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions / Navigation */}
          {navigationCommands.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 mb-1.5">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {navigationCommands.slice(0, 5).map(cmd => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        onNavigate(cmd.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-emerald-950/60 hover:border-emerald-700/60 border border-transparent text-slate-200 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span>{cmd.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students Matched */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                <span>Students Registry ({matchedStudents.length})</span>
                <span className="font-ethiopic text-slate-400">የተማሪዎች መዝገብ</span>
              </div>
              <div className="space-y-1">
                {matchedStudents.slice(0, 4).map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectStudent(st.id);
                      onNavigate('students');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors text-left"
                  >
                    <div>
                      <div className="font-medium text-slate-100 flex items-center gap-2">
                        <span>{st.fullNameEnglish}</span>
                        <span className="font-ethiopic text-xs text-amber-300">({st.fullNameAmharic})</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 font-mono text-slate-300">
                          {st.rollNo}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Juz {st.currentJuz} · Level: {st.hifzLevel} · Sub-city: {st.subCity}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Open Profile
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vouchers Matched */}
          {matchedVouchers.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 mb-1.5">
                Financial Vouchers ({matchedVouchers.length})
              </div>
              <div className="space-y-1">
                {matchedVouchers.slice(0, 3).map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onNavigate('cashbook');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors text-left"
                  >
                    <div>
                      <div className="font-medium text-slate-100 flex items-center gap-2">
                        <span className="font-mono text-amber-400">{v.voucherNumber}</span>
                        <span>{v.payerReceiver}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{v.description}</div>
                    </div>
                    <span className="font-mono font-semibold text-emerald-400">
                      {v.type === 'INCOME' ? '+' : '-'} {v.amountETB.toLocaleString()} ETB
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {navigationCommands.length === 0 && matchedStudents.length === 0 && matchedVouchers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p>No matching institutional records found for "{query}".</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching by student name, roll number, or module.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1 bg-slate-800 rounded">↑</kbd> <kbd className="px-1 bg-slate-800 rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-slate-800 rounded">↵</kbd></span>
            <span>Close: <kbd className="px-1 bg-slate-800 rounded">ESC</kbd></span>
          </div>
          <span className="text-emerald-400 font-medium">Nurul Ilmi OS</span>
        </div>
      </div>
    </div>
  );
};
