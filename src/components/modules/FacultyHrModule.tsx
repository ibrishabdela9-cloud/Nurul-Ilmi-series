/**
 * Module 14: Faculty & HR Management
 * Ustadh profiles with unbroken Ijazah credentials, Qira'at certifications,
 * Halqah assignments, and monthly salary payroll schedules in ETB.
 */

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Award,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  X,
} from 'lucide-react';
import { AppStoreState, formatEthiopianPhone } from '../../lib/store';
import { FacultyMember } from '../../types';

interface FacultyHrModuleProps {
  state: AppStoreState;
  onAddFaculty: (f: FacultyMember) => void;
}

export const FacultyHrModule: React.FC<FacultyHrModuleProps> = ({
  state,
  onAddFaculty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nameAmharic, setNameAmharic] = useState('');
  const [role, setRole] = useState<any>('Senior Ustadh (Hifz)');
  const [ijazah, setIjazah] = useState('Hafs \'an \'Asim via Shatibiyyah');
  const [phone, setPhone] = useState('+2519');
  const [salaryETB, setSalaryETB] = useState<number>(18500);
  const [assignedHalqah, setAssignedHalqah] = useState('Halqah Juz 1-15');

  const filteredFaculty = state.faculty.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.nameAmharic.includes(searchQuery) ||
    f.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayrollETB = state.faculty.reduce((acc, f) => acc + f.monthlySalaryETB, 0);

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFaculty: FacultyMember = {
      id: `fac-${Date.now()}`,
      name: name.trim(),
      nameAmharic: nameAmharic.trim() || name.trim(),
      role,
      ijazahSanad: ijazah.trim(),
      qiraatCertifications: ['Hafs \'an \'Asim'],
      phone: phone.trim(),
      hireDate: new Date().toISOString().split('T')[0],
      monthlySalaryETB: salaryETB,
      assignedHalqah: assignedHalqah.trim(),
      status: 'Active',
    };

    onAddFaculty(newFaculty);
    setIsAddModalOpen(false);
    setName('');
    setNameAmharic('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Faculty & Ustadhs HR Management</h1>
            <span className="font-arabic text-amber-300 text-lg">الهيئة التعليمية والمشايخ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ustadh profiles with verified Ijazah sanad lineages, Qira'at licenses, and monthly salary payroll schedules in ETB.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Appoint New Ustadh</span>
        </button>
      </div>

      {/* Aggregate Payroll Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Active Academic Faculty: {state.faculty.length} Scholars</div>
            <div className="text-[11px] text-slate-400">Accredited by Ethiopian Islamic Affairs & Al-Azhar / Madinah chains</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Payroll Obligation</div>
          <div className="text-xl font-extrabold text-amber-300 font-mono">
            {totalPayrollETB.toLocaleString()} <span className="text-xs font-normal text-slate-400">ETB / Month</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Ustadh by name, role, Halqah..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaculty.map(f => (
          <div
            key={f.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 text-xs space-y-4 shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-white">{f.name}</h3>
                <div className="font-ethiopic text-amber-300 font-medium">{f.nameAmharic}</div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">{f.role}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                {f.status}
              </span>
            </div>

            {/* Ijazah & Sanad Box */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Ijazah Sanad Lineage:</span>
              </div>
              <p className="text-[11px] text-slate-300 italic">
                "{f.ijazahSanad}"
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {f.qiraatCertifications.map(q => (
                  <span key={q} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Assignment & Compensation Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
              <div>
                <div>Assigned Halqah:</div>
                <div className="font-semibold text-slate-200">{f.assignedHalqah}</div>
              </div>
              <div className="text-right">
                <div>Monthly Stipend:</div>
                <div className="font-mono font-bold text-amber-300">{f.monthlySalaryETB.toLocaleString()} ETB</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                <span className="font-mono">{formatEthiopianPhone(f.phone)}</span>
              </div>
              <div>Hired: {f.hireDate}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Appoint New Faculty Ustadh</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaculty} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Ustadh Full Name (English):</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ustadh Faruq Bilal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">ሙሉ ስም (Amharic):</label>
                  <input
                    type="text"
                    value={nameAmharic}
                    onChange={e => setNameAmharic(e.target.value)}
                    placeholder="ለምሳሌ፡ ኡስታዝ ፋሩቅ ቢላል"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-ethiopic outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institutional Role:</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Senior Ustadh (Hifz)">Senior Ustadh (Hifz)</option>
                  <option value="Ustadh (Tajweed & Qira'at)">Ustadh (Tajweed & Qira'at)</option>
                  <option value="Fiqh Lecturer">Fiqh Lecturer</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ijazah & Sanad Lineage Credentials:</label>
                <textarea
                  rows={2}
                  required
                  value={ijazah}
                  onChange={e => setIjazah(e.target.value)}
                  placeholder="e.g. Hafs 'an 'Asim with connected transmission chain"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Halqah:</label>
                  <input
                    type="text"
                    value={assignedHalqah}
                    onChange={e => setAssignedHalqah(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Monthly Salary (ETB):</label>
                  <input
                    type="number"
                    min={5000}
                    step={500}
                    value={salaryETB}
                    onChange={e => setSalaryETB(parseFloat(e.target.value) || 0)}
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
                  Complete Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
