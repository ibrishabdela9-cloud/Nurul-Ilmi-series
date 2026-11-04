/**
 * Module: Parents & Guardians Directory
 * Al-Furqan Quran & Hadith Academy
 * Directory of student guardians, emergency contacts, SMS broadcast links,
 * and sponsorship relations.
 */

import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  Phone,
  MapPin,
  Search,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';

export const ParentsModule: React.FC<{ state: AppStoreState }> = ({ state }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique guardians
  const guardians = state.students.map(s => ({
    studentId: s.id,
    studentName: s.fullNameEnglish,
    studentNameAmharic: s.fullNameAmharic,
    rollNo: s.rollNo,
    guardianName: s.guardianName,
    guardianPhone: s.guardianPhone,
    guardianRelation: s.guardianRelation,
    subCity: s.subCity,
    emergencyContact: s.emergencyContact,
    hifzLevel: s.hifzLevel,
  }));

  const filteredGuardians = guardians.filter(g =>
    g.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.guardianPhone.includes(searchQuery) ||
    g.subCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-saas p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
            <HeartHandshake className="w-5 h-5 text-[#C49A45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#17365D] tracking-tight">Parents & Guardians Directory</h1>
              <span className="font-arabic text-[#16836B] font-bold text-lg">سجل أولياء الأمور</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Al-Furqan Quran & Hadith Academy · Family contact registry, emergency channels, and parent assembly records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-[#17365D] border border-blue-200 font-bold">
            {guardians.length} Registered Guardians
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="card-saas p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by guardian name, student, or phone..."
              className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#17365D]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredGuardians.length} contacts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuardians.map(g => (
            <div
              key={g.studentId}
              className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:border-[#16836B] hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-[#17365D]">{g.guardianName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {g.guardianRelation}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#16836B]" />
                  <span>
                    Ward: <strong className="text-slate-800">{g.studentName}</strong> ({g.rollNo})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span className="font-mono">{g.guardianPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sub-City: {g.subCity}, Addis Ababa</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">{g.hifzLevel}</span>
                <a
                  href={`tel:${g.guardianPhone}`}
                  className="px-2.5 py-1 rounded bg-[#16836B]/10 hover:bg-[#16836B] text-[#16836B] hover:text-white transition font-bold text-[11px]"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
