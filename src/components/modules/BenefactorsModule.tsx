/**
 * Module 9: Benefactor & Donor Management
 * Individual and corporate benefactor registries, lifetime contribution ledgers,
 * Addis Ababa merchants, diaspora endowments, and committed pledge tracking.
 */

import React, { useState } from 'react';
import {
  HeartHandshake,
  Plus,
  Search,
  Filter,
  Award,
  Globe,
  Building2,
  Mail,
  Phone,
  DollarSign,
  X,
} from 'lucide-react';
import { AppStoreState, formatEthiopianPhone } from '../../lib/store';
import { Benefactor } from '../../types';

interface BenefactorsModuleProps {
  state: AppStoreState;
  onAddBenefactor: (b: Benefactor) => void;
}

export const BenefactorsModule: React.FC<BenefactorsModuleProps> = ({
  state,
  onAddBenefactor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<any>('Local Diaspora');
  const [phone, setPhone] = useState('+2519');
  const [email, setEmail] = useState('');
  const [cityCountry, setCityCountry] = useState('Addis Ababa, Ethiopia');
  const [contributedETB, setContributedETB] = useState<number>(50000);
  const [pledgedETB, setPledgedETB] = useState<number>(100000);
  const [tier, setTier] = useState<any>('Gold (Dhahab)');

  const filteredBenefactors = state.benefactors.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.cityCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    const matchesTier = tierFilter === 'ALL' || b.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalContributions = state.benefactors.reduce((acc, b) => acc + b.totalContributedETB, 0);
  const totalPledges = state.benefactors.reduce((acc, b) => acc + b.pledgedAmountETB, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBenefactor: Benefactor = {
      id: `bnf-${Date.now()}`,
      name: name.trim(),
      type,
      phone: phone.trim(),
      email: email.trim() || 'info@donor.et',
      cityCountry: cityCountry.trim(),
      totalContributedETB: contributedETB,
      pledgedAmountETB: pledgedETB,
      lastContributionDate: new Date().toISOString().split('T')[0],
      tier,
    };

    onAddBenefactor(newBenefactor);
    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Benefactors & Donors Registry</h1>
            <span className="font-arabic text-amber-300 text-lg">سجل الواقفين والمحسنين</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual, corporate, and diaspora benefactor portfolios tracking lifetime endowments and committed pledges.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Benefactor</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Lifetime Endowments</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {totalContributions.toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Directly disbursed to campus projects</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Committed Pledges</div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {totalPledges.toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled for upcoming quarters</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Donors & Foundations</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {state.benefactors.length} Entities
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Addis Ababa & Global Diaspora</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search benefactors by name, city, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Tiers</option>
          <option value="Diamond (Waheed)">Diamond (Waheed)</option>
          <option value="Gold (Dhahab)">Gold (Dhahab)</option>
          <option value="Silver (Fiddah)">Silver (Fiddah)</option>
        </select>
      </div>

      {/* Benefactor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBenefactors.map(b => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 text-xs flex flex-col justify-between space-y-4 shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{b.name}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>{b.cityCountry}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  {b.tier}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Lifetime Contributions:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {b.totalContributedETB.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Pledged Commitment:</span>
                  <span className="font-mono font-semibold text-amber-300">
                    {b.pledgedAmountETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{formatEthiopianPhone(b.phone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>{b.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Category: {b.type}</span>
              <span>Last: {b.lastContributionDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Benefactor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Register Benefactor / Donor</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Benefactor Name / Foundation:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Haji Nurredin Kassim"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Entity Type:</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Local Diaspora">Local Diaspora</option>
                    <option value="Addis Ababa Merchant">Addis Ababa Merchant</option>
                    <option value="Islamic Foundation">Islamic Foundation</option>
                    <option value="Family Trust">Family Trust</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Honorary Tier:</label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Diamond (Waheed)">Diamond (Waheed)</option>
                    <option value="Gold (Dhahab)">Gold (Dhahab)</option>
                    <option value="Silver (Fiddah)">Silver (Fiddah)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Location / City:</label>
                  <input
                    type="text"
                    value={cityCountry}
                    onChange={e => setCityCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Contributed Amount (ETB):</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={contributedETB}
                    onChange={e => setContributedETB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pledged Amount (ETB):</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={pledgedETB}
                    onChange={e => setPledgedETB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Save Benefactor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
