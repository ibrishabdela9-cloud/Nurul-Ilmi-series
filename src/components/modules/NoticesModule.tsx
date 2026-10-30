/**
 * Module 18: Notices & Administrative Circulars
 * Public bulletin board and policy governance center for term schedules,
 * financial guidelines, and student life circulars in English and Amharic.
 */

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  Bell,
  Users,
  Search,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { AdministrativeNotice } from '../../types';

interface NoticesModuleProps {
  state: AppStoreState;
  onAddNotice: (notice: AdministrativeNotice) => void;
}

export const NoticesModule: React.FC<NoticesModuleProps> = ({
  state,
  onAddNotice,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleAmharic, setTitleAmharic] = useState('');
  const [priority, setPriority] = useState<any>('High');
  const [audience, setAudience] = useState<any>('All Students & Guardians');
  const [contentEnglish, setContentEnglish] = useState('');
  const [contentAmharic, setContentAmharic] = useState('');
  const [issuedBy, setIssuedBy] = useState('Dr. Sheikh Zakaria Ababor (Mudir)');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEnglish.trim() || !contentEnglish.trim()) return;

    const newNotice: AdministrativeNotice = {
      id: `ntc-${Date.now()}`,
      titleEnglish: titleEnglish.trim(),
      titleAmharic: titleAmharic.trim() || titleEnglish.trim(),
      date: new Date().toISOString().split('T')[0],
      priority,
      targetAudience: audience,
      contentEnglish: contentEnglish.trim(),
      contentAmharic: contentAmharic.trim() || contentEnglish.trim(),
      issuedBy: issuedBy.trim(),
    };

    onAddNotice(newNotice);
    setIsAddModalOpen(false);
    setTitleEnglish('');
    setTitleAmharic('');
    setContentEnglish('');
    setContentAmharic('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Administrative Notices & Circulars</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የማስታወቂያና የውሳኔዎች ሠሌዳ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Official institutional memos, term schedules, and financial directives issued in both Amharic and English.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {state.notices.map(notice => (
          <div
            key={notice.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">{notice.titleEnglish}</h3>
                <div className="font-ethiopic text-amber-300 font-semibold">{notice.titleAmharic}</div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    notice.priority === 'High'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : notice.priority === 'Urgent'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {notice.priority} Priority
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{notice.date}</span>
              </div>
            </div>

            {/* Content Dual Script Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">English Directive:</span>
                <p className="text-slate-200 leading-relaxed">{notice.contentEnglish}</p>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
                <span className="text-[10px] uppercase font-semibold text-amber-300/80 font-ethiopic">የአማርኛ መግለጫ:</span>
                <p className="text-slate-200 font-ethiopic leading-relaxed">{notice.contentAmharic}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Target Audience: <strong className="text-slate-200">{notice.targetAudience}</strong></span>
              <span>Issued By: <strong className="text-emerald-400">{notice.issuedBy}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Publish Institutional Notice</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Notice Heading (English):</label>
                <input
                  type="text"
                  required
                  value={titleEnglish}
                  onChange={e => setTitleEnglish(e.target.value)}
                  placeholder="e.g. Ramadan Recitation Schedule & Suhoor Guidelines"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">አርዕስት (Amharic):</label>
                <input
                  type="text"
                  value={titleAmharic}
                  onChange={e => setTitleAmharic(e.target.value)}
                  placeholder="ለምሳሌ፡ የረመዳን የቁርኣን ንባብ ፕሮግራም"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-ethiopic outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Priority:</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="High">High</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Audience:</label>
                  <select
                    value={audience}
                    onChange={e => setAudience(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="All Students & Guardians">All Students & Guardians</option>
                    <option value="Faculty Only">Faculty Only</option>
                    <option value="Board of Trustees">Board of Trustees</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">English Message Content:</label>
                <textarea
                  rows={3}
                  required
                  value={contentEnglish}
                  onChange={e => setContentEnglish(e.target.value)}
                  placeholder="Official notice details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">የአማርኛ ዝርዝር መግለጫ:</label>
                <textarea
                  rows={3}
                  value={contentAmharic}
                  onChange={e => setContentAmharic(e.target.value)}
                  placeholder="የማስታወቂያው ዝርዝር መረጃ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-ethiopic outline-none focus:border-emerald-500"
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
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
