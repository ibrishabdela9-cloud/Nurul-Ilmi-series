/**
 * Collapsible Left Navigation Sidebar
 * Inspired by premium SaaS education platforms.
 * 14 Core Modules with 18-20px Lucide icons, localized labels,
 * active indicator badges, and collapse/expand toggle.
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Layers,
  ClipboardCheck,
  GraduationCap,
  Clock,
  BookOpen,
  FileSpreadsheet,
  Receipt,
  HeartHandshake,
  Megaphone,
  Printer,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Compass,
  FileText,
  Boxes,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { DesktopNavModule } from '../../types';
import { AppStoreState } from '../../lib/store';
import { SupportedLanguage, TRANSLATIONS } from '../../lib/i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface DesktopSidebarProps {
  activeModule: DesktopNavModule;
  onNavigate: (module: DesktopNavModule) => void;
  state: AppStoreState;
  currentLanguage: SupportedLanguage;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemDef {
  id: DesktopNavModule;
  key: keyof typeof TRANSLATIONS['en'];
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeType?: 'emerald' | 'amber' | 'blue';
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeModule,
  onNavigate,
  state,
  currentLanguage,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[currentLanguage];

  // Badges
  const pendingInvoicesCount = state.invoices.filter(
    i => i.status === 'Pending' || i.status === 'Overdue'
  ).length;
  const activeStudentsCount = state.students.filter(s => s.status === 'Active').length;

  const navItems: NavItemDef[] = [
    { id: 'dashboard', key: 'dashboard', icon: LayoutDashboard },
    { id: 'students', key: 'students', icon: Users, badge: activeStudentsCount, badgeType: 'emerald' },
    { id: 'faculty_hr', key: 'teachers', icon: UserCheck },
    { id: 'classes_sections', key: 'classes_sections', icon: Layers },
    { id: 'attendance', key: 'attendance', icon: ClipboardCheck },
    { id: 'academic_transcripts', key: 'academic_management', icon: GraduationCap },
    { id: 'prayer_engine', key: 'islamic_studies', icon: Clock },
    { id: 'hifz_tracker', key: 'quran_management', icon: BookOpen },
    { id: 'examinations', key: 'examinations', icon: FileSpreadsheet },
    { id: 'cashbook', key: 'fees_finance', icon: Receipt, badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined, badgeType: 'amber' },
    { id: 'parents', key: 'parents', icon: HeartHandshake },
    { id: 'circulars_notices', key: 'communication', icon: Megaphone },
    { id: 'document_center', key: 'reports', icon: Printer },
    { id: 'manual_edition', key: 'manual_edition', icon: Edit3, badge: 'Live', badgeType: 'emerald' },
    { id: 'settings', key: 'settings', icon: Settings },
  ];

  const filteredItems = navItems.filter(item => {
    const label = t[item.key] || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 transition-all duration-200 select-none z-20 shadow-xs`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/image_9f3d5314.png"
              alt="Al-Furqan Emblem"
              className="w-7 h-7 rounded-full object-contain border border-[#16836B] p-0.5"
            />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#17365D] block leading-tight">
                Al-Furqan
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-none mt-0.5">
                Chiro Town, Eastern Oromia
              </span>
            </div>
          </div>
        ) : (
          <img
            src="/assets/aistudio/image_9f3d5314.png"
            alt="Al-Furqan"
            className="w-6 h-6 rounded-full object-contain border border-[#16836B] p-0.5"
          />
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Instant Filter Bar when expanded */}
      {!isCollapsed && (
        <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter menu..."
              className="w-full bg-white text-xs text-[#273449] placeholder:text-slate-400 pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#17365D]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const label = t[item.key];

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#17365D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F5F7FA]'
              }`}
            >
              <Icon
                className={`w-[19px] h-[19px] shrink-0 transition-transform ${
                  isActive ? 'text-[#C49A45]' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-[#C49A45] text-slate-950'
                          : item.badgeType === 'amber'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Quick Install */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <PWAInstallButton variant="sidebar" />
      </div>

      {/* Bottom Station Status */}
      <div className="p-3 border-t border-[#E2E8F0] text-[11px] text-slate-500">
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Campus Station</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                Chiro Town
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Eastern Oromia, Ethiopia · EAT
            </div>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto" title="Online: Chiro Town, Eastern Oromia" />
        )}
      </div>
    </aside>
  );
};
