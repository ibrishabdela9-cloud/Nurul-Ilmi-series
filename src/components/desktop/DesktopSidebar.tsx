/**
 * Desktop Multi-Category Navigation Sidebar (Navigation Board)
 * Enhanced high-clarity navigation with instant module search,
 * real-time badge counters, Ge'ez script typography, and executive styling.
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  Users,
  FileSpreadsheet,
  GraduationCap,
  ClipboardCheck,
  Receipt,
  Wallet,
  PieChart,
  HeartHandshake,
  HandHeart,
  Coins,
  UserCheck,
  Boxes,
  Target,
  Scale,
  Megaphone,
  Printer,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Server,
  Cloud,
  Search,
  X,
  Compass,
} from 'lucide-react';
import { DesktopNavModule } from '../../types';
import { AppStoreState } from '../../lib/store';
import { PWAInstallButton } from './PWAInstallButton';

interface DesktopSidebarProps {
  activeModule: DesktopNavModule;
  onNavigate: (module: DesktopNavModule) => void;
  state: AppStoreState;
}

interface NavItem {
  id: DesktopNavModule;
  label: string;
  amharicLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeType?: 'emerald' | 'amber' | 'rose' | 'teal';
}

interface NavGroup {
  title: string;
  titleAmharic: string;
  items: NavItem[];
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeModule,
  onNavigate,
  state,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Computed badge counts
  const pendingInvoicesCount = state.invoices.filter(
    i => i.status === 'Pending' || i.status === 'Overdue'
  ).length;
  const activeStudentsCount = state.students.filter(s => s.status === 'Active').length;
  const lowStockCount = state.inventory.filter(
    i => i.quantityInStock <= i.minimumThreshold
  ).length;
  const orphanCount = state.orphanSponsorships.filter(o => o.isActive).length;

  const groups: NavGroup[] = useMemo(() => [
    {
      title: 'ACADEMICS & HIFZ',
      titleAmharic: 'ትምህርትና ሒፍዝ',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', amharicLabel: 'ዋና ዳሽቦርድ', icon: LayoutDashboard },
        { id: 'prayer_engine', label: 'Prayer Engine (Addis)', amharicLabel: 'የሶላት ሰዓታት', icon: Clock },
        { id: 'hifz_tracker', label: 'Qur’an Hifz Tracker', amharicLabel: 'የቁርኣን ሒፍዝ ክትትል', icon: BookOpen },
        { 
          id: 'students', 
          label: 'Student Admissions', 
          amharicLabel: 'የተማሪዎች ምዝገባ', 
          icon: Users, 
          badge: activeStudentsCount, 
          badgeType: 'emerald' 
        },
        { id: 'bulk_csv', label: 'Bulk CSV Importer', amharicLabel: 'የጅምላ መረጃ መጫኛ', icon: FileSpreadsheet },
        { id: 'academic_transcripts', label: 'Transcripts & GPA', amharicLabel: 'ውጤትና ሰርተፊኬት', icon: GraduationCap },
        { id: 'attendance', label: 'Daily Attendance', amharicLabel: 'የዕለት ክትትል (ቀናት)', icon: ClipboardCheck },
      ],
    },
    {
      title: 'FINANCE & FUNDS (ETB)',
      titleAmharic: 'ፋይናንስና ፈንድ',
      items: [
        { 
          id: 'fees_invoicing', 
          label: 'Fees & Invoicing', 
          amharicLabel: 'የትምህርት ክፍያ', 
          icon: Receipt, 
          badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined, 
          badgeType: 'amber' 
        },
        { id: 'cashbook', label: 'Cashbook & Ledger', amharicLabel: 'የጥሬ ገንዘብ መዝገብ', icon: Wallet },
        { id: 'budgets', label: 'Budget Management', amharicLabel: 'የበጀት አስተዳደር', icon: PieChart },
        { id: 'benefactors', label: 'Benefactors & Donors', amharicLabel: 'ለጋሾችና በጎ አድራጊዎች', icon: HeartHandshake },
        { 
          id: 'charity_funds', 
          label: 'Orphans & Zakat Funds', 
          amharicLabel: 'የየቲሞችና የዘካ ፈንድ', 
          icon: HandHeart, 
          badge: orphanCount, 
          badgeType: 'teal' 
        },
        { id: 'zakat_calculator', label: 'Fiqh Zakat Calculator', amharicLabel: 'የዘካ ማስያ', icon: Coins },
      ],
    },
    {
      title: 'GOVERNANCE & ASSETS',
      titleAmharic: 'አመራርና ሀብት',
      items: [
        { id: 'faculty_hr', label: 'Faculty & Ustadhs', amharicLabel: 'ኡስታዞችና ሠራተኞች', icon: UserCheck },
        { 
          id: 'inventory', 
          label: 'Mushaf & Asset Control', 
          amharicLabel: 'የንብረት ቁጥጥር', 
          icon: Boxes, 
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, 
          badgeType: 'rose' 
        },
        { id: 'strategic_kpis', label: 'Strategic KPIs', amharicLabel: 'ስልታዊ ግቦች', icon: Target },
        { id: 'shura_governance', label: 'Shura Council Registry', amharicLabel: 'የሹራ ምክር ቤት', icon: Scale },
        { id: 'circulars_notices', label: 'Administrative Notices', amharicLabel: 'ማስታወቂያዎች', icon: Megaphone },
      ],
    },
    {
      title: 'DOCUMENTS & SYSTEM',
      titleAmharic: 'ሰነዶችና ሲስተም',
      items: [
        { id: 'document_center', label: 'Document & Print Hub', amharicLabel: 'የህትመት ማዕከል', icon: Printer },
        { id: 'google_workspace', label: 'Google Drive & Sheets', amharicLabel: 'የጉግል ክላውድ ሲንክ', icon: Cloud },
        { id: 'ethiopian_calendar', label: 'Ge’ez Calendar Engine', amharicLabel: 'የኢትዮጵያ ዘመን አቆጣጠር', icon: Calendar },
        { id: 'ai_assistant', label: 'AI Islamic Advisor', amharicLabel: 'አይአይ አማካሪ', icon: Sparkles },
        { id: 'audit_log', label: 'Audit Trail & Logs', amharicLabel: 'የኦዲት መዝገብ', icon: ShieldCheck },
      ],
    },
  ], [activeStudentsCount, pendingInvoicesCount, lowStockCount, orphanCount]);

  // Filter groups when searching
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase().trim();
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(
          item =>
            item.label.toLowerCase().includes(q) ||
            item.amharicLabel.includes(q) ||
            group.title.toLowerCase().includes(q) ||
            group.titleAmharic.includes(q)
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [groups, searchQuery]);

  const totalFilteredCount = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);

  const getBadgeStyle = (type?: string, isActive?: boolean) => {
    if (isActive) {
      return 'bg-amber-400 text-slate-950 border border-amber-300 font-bold';
    }
    switch (type) {
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
      case 'teal':
        return 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
      case 'emerald':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-18' : 'w-72'
      } bg-gradient-to-b from-[#031813] via-slate-950 to-[#02110c] border-r border-emerald-900/40 flex flex-col shrink-0 transition-all duration-300 select-none z-20 shadow-xl`}
    >
      {/* Navigation Board Header */}
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-emerald-900/40 bg-slate-950/70 backdrop-blur-md">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-800/50 border border-emerald-500/40 flex items-center justify-center text-amber-300 shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-wider text-slate-100 block leading-tight">
                NAVIGATION BOARD
              </span>
              <span className="font-ethiopic text-[11px] text-amber-400 font-medium leading-none block">
                የማውጫ ሰሌዳ
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 transition-colors border border-slate-800 hover:border-emerald-700/60 ml-auto shadow-sm"
          title={isCollapsed ? 'Expand Navigation Board' : 'Collapse Navigation Board'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Search / Filter Bar (Only when expanded) */}
      {!isCollapsed && (
        <div className="p-2.5 border-b border-emerald-900/30 bg-slate-950/40">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 22 modules... (ፊልተር)"
              className="w-full bg-slate-900/90 text-xs text-slate-100 placeholder:text-slate-400 pl-8 pr-7 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-700/50 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>Showing {totalFilteredCount} matching boards</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-amber-400 hover:underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[11px] font-bold tracking-wider text-emerald-400/90 flex items-center justify-between border-b border-emerald-900/20 pb-1 mb-1">
                <span>{group.title}</span>
                <span className="font-ethiopic text-amber-300 font-semibold text-xs">
                  {group.titleAmharic}
                </span>
              </div>
            )}
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? `${item.label} (${item.amharicLabel})` : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-900/90 via-emerald-950 to-slate-900 text-white font-bold shadow-md shadow-emerald-950/80 border-l-4 border-amber-400 border-y border-r border-emerald-600/40 ring-1 ring-emerald-500/20'
                        : 'text-slate-200 hover:text-white hover:bg-emerald-950/40 hover:border-emerald-800/40 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-all ${
                        isActive
                          ? 'text-amber-300 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-400 group-hover:text-emerald-300 group-hover:scale-105'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <div className="truncate">
                          <span className="block leading-tight truncate">{item.label}</span>
                          <span className={`text-[10px] font-ethiopic block leading-none mt-0.5 truncate ${
                            isActive ? 'text-amber-200/90' : 'text-slate-400 group-hover:text-slate-300'
                          }`}>
                            {item.amharicLabel}
                          </span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`ml-1.5 text-[10px] px-2 py-0.5 rounded-full font-mono tabular-nums shadow-sm shrink-0 ${getBadgeStyle(
                              item.badgeType,
                              isActive
                            )}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-8 px-4 text-xs text-slate-400 space-y-2">
            <p>No modules match "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-800/80 transition"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Install & USB Launchers */}
      <div className="px-2.5 py-2.5 border-t border-emerald-900/30 bg-slate-950/60">
        <PWAInstallButton variant="sidebar" />
      </div>

      {/* System Station Health Bar */}
      <div className="p-3 border-t border-emerald-900/40 bg-slate-950 text-[11px] text-slate-300">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleDot className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                <span>Station: Addis Ababa</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                EAT UTC+3
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-900 pt-1.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Server className="w-3 h-3 text-teal-400" />
                <span>Database Local</span>
              </span>
              <span className="text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-700/50">
                ETB Ledger
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Online: Addis Ababa EAT">
            <CircleDot className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
