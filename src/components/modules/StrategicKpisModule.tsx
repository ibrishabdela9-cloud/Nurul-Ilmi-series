/**
 * Module 16: Strategic KPIs & Milestones
 * Institutional progress dashboard tracking operational objectives,
 * target deadlines, and percentage completions.
 */

import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { StrategicKPI } from '../../types';

interface StrategicKpisModuleProps {
  state: AppStoreState;
  onAddKPI: (kpi: StrategicKPI) => void;
}

export const StrategicKpisModule: React.FC<StrategicKpisModuleProps> = ({
  state,
  onAddKPI,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Hifz Outcomes');
  const [targetValue, setTargetValue] = useState<number>(30);
  const [currentValue, setCurrentValue] = useState<number>(15);
  const [unit, setUnit] = useState('Huffaz');
  const [deadline, setDeadline] = useState('2027-06-30');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetValue <= 0) return;

    const progressPercentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
    const status = progressPercentage >= 100 ? 'Achieved' : progressPercentage >= 60 ? 'On Track' : 'At Risk';

    const newKpi: StrategicKPI = {
      id: `kpi-${Date.now()}`,
      title: title.trim(),
      category,
      targetValue,
      currentValue,
      unit: unit.trim(),
      deadline,
      progressPercentage,
      status,
    };

    onAddKPI(newKpi);
    setIsAddModalOpen(false);
    setTitle('');
  };

  const achievedCount = state.kpis.filter(k => k.status === 'Achieved').length;
  const onTrackCount = state.kpis.filter(k => k.status === 'On Track').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Strategic KPIs & Institutional Milestones</h1>
            <span className="font-arabic text-amber-300 text-lg">الأهداف والمؤشرات الاستراتيجية</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional roadmap tracking Hifz outcomes, community reach, and financial sustainability milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Strategic Objective</span>
        </button>
      </div>

      {/* Aggregate Status Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">On Track Objectives</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{onTrackCount} Goals</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Achieved Milestones</div>
            <div className="text-2xl font-bold text-amber-300 font-mono mt-1">{achievedCount} Goals</div>
          </div>
          <Target className="w-8 h-8 text-amber-500/30" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Total Strategic KPIs</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">{state.kpis.length} Tracked</div>
          </div>
          <TrendingUp className="w-8 h-8 text-teal-500/30" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.kpis.map(kpi => (
          <div
            key={kpi.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 text-xs space-y-4 shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
                  {kpi.category}
                </span>
                <h3 className="font-bold text-sm text-white mt-0.5">{kpi.title}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  kpi.status === 'Achieved'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : kpi.status === 'On Track'
                    ? 'bg-teal-950 text-teal-300 border-teal-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}
              >
                {kpi.status}
              </span>
            </div>

            {/* Progress Bar & Metric Numbers */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>Progress:</span>
                <span className="font-mono font-bold text-amber-300">{kpi.progressPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, kpi.progressPercentage)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-400">Current Velocity:</span>
                <div className="font-mono font-bold text-white text-sm mt-0.5">
                  {kpi.currentValue.toLocaleString()} {kpi.unit}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Target Horizon:</span>
                <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                  {kpi.targetValue.toLocaleString()} {kpi.unit}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Deadline: {kpi.deadline}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add KPI Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Define Strategic KPI Milestone</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Milestone Objective Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Expand Female Tahfiz Wing to Bole Branch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category:</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Hifz Outcomes">Hifz Outcomes</option>
                  <option value="Community Reach">Community Reach</option>
                  <option value="Financial Sustainability">Financial Sustainability</option>
                  <option value="Infrastructure Expansion">Infrastructure Expansion</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Value:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={targetValue}
                    onChange={e => setTargetValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Current Value:</label>
                  <input
                    type="number"
                    min={0}
                    value={currentValue}
                    onChange={e => setCurrentValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit:</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="Students, ETB, etc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Deadline:</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
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
                  Register Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
