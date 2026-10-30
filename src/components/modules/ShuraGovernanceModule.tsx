/**
 * Module 17: Shura Council Governance
 * Formal consultative assembly registry tracking Shura agendas, voting attendees,
 * approved resolutions, and follow-up action items.
 */

import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  CheckSquare,
  FileText,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { ShuraMeeting } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';

interface ShuraGovernanceModuleProps {
  state: AppStoreState;
  onAddShuraMeeting: (meeting: ShuraMeeting) => void;
}

export const ShuraGovernanceModule: React.FC<ShuraGovernanceModuleProps> = ({
  state,
  onAddShuraMeeting,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [chairperson, setChairperson] = useState('Dr. Sheikh Zakaria Ababor (Mudir)');
  const [agendaText, setAgendaText] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const eth = toEthiopianDate();
    const agendaPoints = agendaText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const approvedResolutions = resolutionText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    const newMeeting: ShuraMeeting = {
      id: `shura-${Date.now()}`,
      meetingDate: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${eth.monthNameAmharic} ${eth.geezDay} ቀን ${eth.geezYear} ዓ.ም`,
      title: title.trim(),
      chairperson: chairperson.trim(),
      votingAttendees: [
        'Dr. Sheikh Zakaria Ababor',
        'Sheikh Dawud Abdo',
        'Ustadh Hassen Taha',
        'Ustadha Halima Kedir',
        'Community Elders Delegation',
      ],
      agendaPoints: agendaPoints.length > 0 ? agendaPoints : ['Review of general institutional operations'],
      approvedResolutions: approvedResolutions.length > 0 ? approvedResolutions : ['Resolution 26-XX: Unanimously approved.'],
      actionItems: [
        { task: 'Implement resolution directives with finance and academic office', assignee: 'Administrator', deadline: '2026-11-30', completed: false },
      ],
      quorumReached: true,
    };

    onAddShuraMeeting(newMeeting);
    setIsAddModalOpen(false);
    setTitle('');
    setAgendaText('');
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Shura Council Governance</h1>
            <span className="font-arabic text-amber-300 text-lg">مجلس الشورى والقرارات</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal consultative assembly minutes tracking quorum attendees, voted resolutions, and operational follow-up tasks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record Shura Minutes</span>
        </button>
      </div>

      {/* Shura Assembly Meetings List */}
      <div className="space-y-4">
        {state.shuraMeetings.map(meeting => (
          <div
            key={meeting.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">{meeting.title}</h3>
                <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{meeting.meetingDate}</span>
                  <span className="font-ethiopic text-amber-300">({meeting.ethiopianDateString})</span>
                  <span>· Presided by: <strong className="text-slate-200">{meeting.chairperson}</strong></span>
                </div>
              </div>
              <span className="self-start sm:self-center px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                Quorum Validated
              </span>
            </div>

            {/* Attendees */}
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">Voting Council Attendees:</div>
              <div className="flex flex-wrap gap-1.5">
                {meeting.votingAttendees.map((att, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                    {att}
                  </span>
                ))}
              </div>
            </div>

            {/* Agenda & Approved Resolutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Agenda */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-semibold text-amber-400">Deliberated Agenda Items:</div>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {meeting.agendaPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Resolutions */}
              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-900/60 space-y-1.5">
                <div className="font-semibold text-emerald-400">Ratified Resolutions (القرارات המعتمدة):</div>
                <ul className="space-y-1 text-slate-200 list-disc list-inside">
                  {meeting.approvedResolutions.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            {meeting.actionItems && meeting.actionItems.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Assigned Action Follow-Ups:</div>
                <div className="space-y-1.5">
                  {meeting.actionItems.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60 text-[11px]">
                      <div className="flex items-center gap-2">
                        <CheckSquare className={`w-3.5 h-3.5 ${act.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className={act.completed ? 'line-through text-slate-500' : 'text-slate-200'}>{act.task}</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Assignee: <span className="text-amber-300">{act.assignee}</span> · Due: {act.deadline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Shura Minutes Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Record Shura Council Assembly Minutes</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Session Assembly Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Q2 Academic Review & Ramadan Preparations"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Presiding Chairperson:</label>
                <input
                  type="text"
                  value={chairperson}
                  onChange={e => setChairperson(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Agenda Items (One per line):</label>
                <textarea
                  rows={3}
                  value={agendaText}
                  onChange={e => setAgendaText(e.target.value)}
                  placeholder="Review of graduation banquet&#10;Audit report for Commercial Bank of Ethiopia account&#10;Recruitment of Tajweed Ustadh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Approved Resolutions (One per line):</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  placeholder="Resolution 26-04: Approved budget of 85,000 ETB for Ramadan Quran contest&#10;Resolution 26-05: Confirmed calendar dates for Hidar 1"
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
                  Ratify & Post Minutes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
