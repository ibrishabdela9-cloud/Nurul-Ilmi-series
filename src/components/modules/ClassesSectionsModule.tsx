/**
 * Module: Classes & Sections (Halqahs)
 * Al-Furqan Quran & Hadith Academy
 * Management of Qur'an recitation circles (Halqahs), Hadith classrooms,
 * and academic grades with assigned Ustadhs and capacity metrics.
 */

import React, { useState } from 'react';
import {
  Layers,
  Users,
  UserCheck,
  BookOpen,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';

export interface HalqahClass {
  id: string;
  name: string;
  nameArabic: string;
  level: string;
  leadUstadh: string;
  room: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  targetFocus: string;
}

const INITIAL_HALQAHS: HalqahClass[] = [
  {
    id: 'hlq-01',
    name: 'Halqah Abu Bakr As-Siddiq',
    nameArabic: 'حلقة أبي بكر الصديق',
    level: 'Advanced Hifz (Juz 20-30)',
    leadUstadh: 'Dr. Sheikh Zakaria (Head Mudir)',
    room: 'Main Mihrab Hall · Ground Fl',
    schedule: 'Fajr - 8:30 AM & Asr - Maghrib',
    capacity: 25,
    enrolled: 22,
    targetFocus: 'Final Khatm Revision & Tajweed Precision',
  },
  {
    id: 'hlq-02',
    name: 'Halqah Umar ibn al-Khattab',
    nameArabic: 'حلقة عمر بن الخطاب',
    level: 'Intermediate Hifz (Juz 1-15)',
    leadUstadh: 'Ustadh Bilal Nuru',
    room: 'Maktab Hall B · First Floor',
    schedule: '8:00 AM - 12:30 PM',
    capacity: 25,
    enrolled: 24,
    targetFocus: 'New Sabaq Memorization & Daily Sabqi',
  },
  {
    id: 'hlq-03',
    name: 'Halqah Uthman ibn Affan',
    nameArabic: 'حلقة عثمان بن عفان',
    level: 'Qur’an Foundation & Nazira',
    leadUstadh: 'Ustadh Dawud Omar',
    room: 'Classroom 102 · North Wing',
    schedule: '2:00 PM - 5:30 PM',
    capacity: 20,
    enrolled: 19,
    targetFocus: 'Makharij al-Huruf & Noorani Qaidah',
  },
  {
    id: 'hlq-04',
    name: 'Halqah Ali ibn Abi Talib',
    nameArabic: 'حلقة علي بن أبي طالب',
    level: 'Hadith Arbain & Fiqh of Ibadat',
    leadUstadh: 'Sheikh Abdurrahman Kassim',
    room: 'Auditorium Hall · East Campus',
    schedule: 'Saturday & Sunday Intensive',
    capacity: 35,
    enrolled: 31,
    targetFocus: 'Imam an-Nawawi 40 Hadith & Shafi Fiqh',
  },
  {
    id: 'hlq-05',
    name: 'Halqah Aisha bint Abi Bakr',
    nameArabic: 'حلقة عائشة أم المؤمنين',
    level: 'Intermediate Hifz (Female Section)',
    leadUstadh: 'Ustadha Muna Kedir',
    room: 'Women’s Academy Annex · Fl 2',
    schedule: '8:30 AM - 12:30 PM',
    capacity: 25,
    enrolled: 23,
    targetFocus: 'Juz Amma, Tabarak & Qad Sami’a',
  },
];

export const ClassesSectionsModule: React.FC<{ state: AppStoreState }> = ({ state }) => {
  const [halqahs, setHalqahs] = useState<HalqahClass[]>(INITIAL_HALQAHS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHalqah, setSelectedHalqah] = useState<HalqahClass>(INITIAL_HALQAHS[0]);

  const filteredHalqahs = halqahs.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.leadUstadh.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-saas p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-[#C49A45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#17365D] tracking-tight">Classes & Sections (Halqahs)</h1>
              <span className="font-arabic text-[#16836B] font-bold text-lg">الفصول والحلقات القرآنية</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Al-Furqan Quran & Hadith Academy · Halqah rosters, assigned Ustadhs, and room schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            {halqahs.length} Active Halqahs
          </span>
        </div>
      </div>

      {/* Grid of Halqahs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHalqahs.map(h => {
          const fillPercentage = Math.round((h.enrolled / h.capacity) * 100);
          return (
            <div
              key={h.id}
              onClick={() => setSelectedHalqah(h)}
              className="card-saas p-5 cursor-pointer hover:border-[#17365D] transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-arabic text-base font-bold text-[#16836B]">{h.nameArabic}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#17365D] font-bold">
                    {h.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#17365D] mt-2 tracking-tight">{h.name}</h3>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{h.level}</div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#16836B]" />
                    <span className="font-semibold text-slate-800">{h.leadUstadh}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{h.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C49A45]" />
                    <span className="text-[11px] font-mono">{h.schedule}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Student Capacity:</span>
                  <span className="font-mono font-bold text-[#17365D]">
                    {h.enrolled} / {h.capacity} ({fillPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      fillPercentage >= 95 ? 'bg-amber-500' : 'bg-[#16836B]'
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
