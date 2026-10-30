/**
 * Module 10: Charity & Restricted Funds
 * Workflows for Hifz Orphan Sponsorship, Zakat al-Mal pool, and Masjid infrastructure endowments.
 */

import React, { useState } from 'react';
import {
  HandHeart,
  HeartHandshake,
  Plus,
  Search,
  CheckCircle2,
  Building,
  Users,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { OrphanSponsorship } from '../../types';

interface CharityFundsModuleProps {
  state: AppStoreState;
  onAddOrphanSponsorship: (sponsorship: OrphanSponsorship) => void;
  onNavigate: (module: any) => void;
}

export const CharityFundsModule: React.FC<CharityFundsModuleProps> = ({
  state,
  onAddOrphanSponsorship,
  onNavigate,
}) => {
  const [isAddSponsorshipModalOpen, setIsAddSponsorshipModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(state.students[0]?.id || '');
  const [sponsorName, setSponsorName] = useState('Haji Nurredin Kassim');
  const [monthlyETB, setMonthlyETB] = useState<number>(3500);

  const activeSponsorships = state.orphanSponsorships.filter(s => s.isActive);
  const totalMonthlyCommitment = activeSponsorships.reduce((acc, s) => acc + s.monthlyAllocationETB, 0);

  const handleCreateSponsorship = (e: React.FormEvent) => {
    e.preventDefault();
    const newSponsorship: OrphanSponsorship = {
      id: `orph-${Date.now()}`,
      studentId: selectedStudentId,
      sponsorName: sponsorName.trim(),
      monthlyAllocationETB: monthlyETB,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      isActive: true,
      coverageDetails: 'Boarding, Feeding, Mushafs & Medical',
    };

    onAddOrphanSponsorship(newSponsorship);
    setIsAddSponsorshipModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Charity & Restricted Endowments</h1>
            <span className="font-arabic text-amber-300 text-lg">صندوق كفالة الأيتام والزكاة</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated workflows for Hifz Orphan Full Sponsorship, Zakat al-Mal pool, and Masjid infrastructure endowments.
          </p>
        </div>

        <button
          onClick={() => setIsAddSponsorshipModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Orphan Hifz Sponsorship</span>
        </button>
      </div>

      {/* Aggregate Pools Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pool 1: Orphan Sponsorship */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Hifz Orphan Sponsorship</span>
            <HeartHandshake className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {activeSponsorships.length} <span className="text-sm font-normal text-slate-400">Students 100% Sponsored</span>
          </div>
          <div className="text-xs text-rose-400">
            Monthly Commitment: {totalMonthlyCommitment.toLocaleString()} ETB
          </div>
        </div>

        {/* Pool 2: Zakat Pool */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Zakat al-Mal Liquidity</span>
            <HandHeart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            420,750 <span className="text-sm font-normal text-slate-400">ETB</span>
          </div>
          <div className="text-xs text-slate-400">
            Designated for As-Sunuf ath-Thamaniyyah
          </div>
        </div>

        {/* Pool 3: Masjid Solar & Infra */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Solar & Waqf Endowment</span>
            <Building className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            350,000 <span className="text-sm font-normal text-slate-400">ETB</span>
          </div>
          <div className="text-xs text-slate-400">
            Tier-1 Inverters for load-shedding backup
          </div>
        </div>
      </div>

      {/* Active Orphan Sponsorships List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <h2 className="font-bold text-sm text-white">Active Hifz Orphan Sponsorship Registry</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {activeSponsorships.length} Sponsored Students
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSponsorships.map(s => {
            const student = state.students.find(st => st.id === s.studentId);
            return (
              <div
                key={s.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{student?.fullNameEnglish || 'Student'}</h3>
                    <div className="font-ethiopic text-amber-300">{student?.fullNameAmharic}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Roll: {student?.rollNo}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Benefactor / Sponsor:</span>
                    <span className="font-semibold text-white">{s.sponsorName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly Stipend:</span>
                    <span className="font-mono font-bold text-amber-300">{s.monthlyAllocationETB.toLocaleString()} ETB</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    Coverage: {s.coverageDetails}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Hifz Progress: Juz {student?.currentJuz} / 30</span>
                  <button
                    onClick={() => onNavigate('hifz_tracker')}
                    className="text-emerald-400 hover:underline"
                  >
                    View Recitation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Orphan Sponsorship Modal */}
      {isAddSponsorshipModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Enroll Orphan Hifz Sponsorship</h2>
              <button
                onClick={() => setIsAddSponsorshipModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSponsorship} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Student:</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  {state.students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullNameEnglish} ({st.rollNo}) - Juz {st.currentJuz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sponsor / Benefactor Name:</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Monthly ETB Coverage:</label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={monthlyETB}
                  onChange={e => setMonthlyETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-sm font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSponsorshipModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Activate Sponsorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
