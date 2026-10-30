/**
 * Module 12: Budget Management
 * Departmental expenditure tracking against approved fiscal allocations
 * with real-time burn-rate progress bars and variance alerts.
 */

import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Building2,
  DollarSign,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { DepartmentBudget } from '../../types';

interface BudgetManagementModuleProps {
  state: AppStoreState;
  onAddBudget: (b: DepartmentBudget) => void;
}

export const BudgetManagementModule: React.FC<BudgetManagementModuleProps> = ({
  state,
  onAddBudget,
}) => {
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [allocatedETB, setAllocatedETB] = useState<number>(300000);
  const [leadUstadh, setLeadUstadh] = useState('Sheikh Dawud Abdo');

  const totalAllocated = state.budgets.reduce((acc, b) => acc + b.allocatedETB, 0);
  const totalSpent = state.budgets.reduce((acc, b) => acc + b.spentETB, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallBurnRate = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || allocatedETB <= 0) return;

    const colors = ['emerald', 'amber', 'teal', 'indigo', 'rose', 'sky'];
    const newBudget: DepartmentBudget = {
      id: `bgt-${Date.now()}`,
      department: deptName.trim(),
      fiscalYear: '2026/27',
      allocatedETB,
      spentETB: 0,
      remainingETB: allocatedETB,
      leadUstadh,
      color: colors[state.budgets.length % colors.length],
    };

    onAddBudget(newBudget);
    setIsAddBudgetModalOpen(false);
    setDeptName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Institutional Budget Management</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የበጀት ቁጥጥርና ክትትል</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Departmental expenditure tracking against approved fiscal allocations with real-time burn-rate progress bars.
          </p>
        </div>

        <button
          onClick={() => setIsAddBudgetModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Department Budget</span>
        </button>
      </div>

      {/* Aggregate Burn Rate Header Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Fiscal Year 2026/27 (፳፻፲፱ ዓ.ም)</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {totalSpent.toLocaleString()} ETB <span className="text-sm font-normal text-slate-400">spent of {totalAllocated.toLocaleString()} ETB</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {overallBurnRate}% Aggregate Burn Rate
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Available Reserve: <span className="font-mono text-amber-300 font-bold">{totalRemaining.toLocaleString()} ETB</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, overallBurnRate)}%` }}
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.budgets.map(b => {
          const burnRate = b.allocatedETB > 0 ? Math.round((b.spentETB / b.allocatedETB) * 100) : 0;
          const isWarning = burnRate >= 80;

          return (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{b.department}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Lead: <span className="text-slate-200">{b.leadUstadh}</span> · FY {b.fiscalYear}
                  </div>
                </div>
                {isWarning && (
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Near Cap</span>
                  </span>
                )}
              </div>

              {/* Progress and Numbers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Burn Rate:</span>
                  <span className="font-mono font-bold text-amber-300">{burnRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      burnRate >= 85 ? 'bg-rose-500' : burnRate >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, burnRate)}%` }}
                  />
                </div>
              </div>

              {/* Figures Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase">Allocated</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">
                    {b.allocatedETB.toLocaleString()} ETB
                  </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase">Disbursed</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">
                    {b.spentETB.toLocaleString()} ETB
                  </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase">Remaining</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">
                    {b.remainingETB.toLocaleString()} ETB
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Budget Modal */}
      {isAddBudgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Add Department Fiscal Allocation</h2>
              <button
                onClick={() => setIsAddBudgetModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Department Name:</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  placeholder="e.g. Technology & Security Backup"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Annual Budget Allocation (ETB):</label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  required
                  value={allocatedETB}
                  onChange={e => setAllocatedETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-base font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lead Ustadh / Department Head:</label>
                <select
                  value={leadUstadh}
                  onChange={e => setLeadUstadh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  {state.faculty.map(f => (
                    <option key={f.id} value={f.name}>{f.name} ({f.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Create Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
