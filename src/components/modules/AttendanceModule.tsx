/**
 * Module 7: Daily Attendance Register
 * Class-by-class attendance recording for students and faculty tracking
 * Present, Absent, Late, and Excused statuses with reason logging.
 */

import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Save,
  Users,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { AttendanceRecord, AttendanceSession, AttendanceStatus } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';

interface AttendanceModuleProps {
  state: AppStoreState;
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  state,
  onSaveAttendanceBatch,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSession, setSelectedSession] = useState<AttendanceSession>('Morning Sabaq');
  
  // Local state for current roll-call session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; reason: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; reason: string }> = {};
    state.students.forEach(s => {
      initial[s.id] = { status: 'Present', reason: '' };
    });
    return initial;
  });

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const ethDate = toEthiopianDate(new Date(selectedDate));

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    setAttendanceMap(prev => {
      const updated: Record<string, { status: AttendanceStatus; reason: string }> = {};
      Object.keys(prev).forEach(id => {
        updated[id] = { status: 'Present', reason: '' };
      });
      return updated;
    });
  };

  const handleSaveBatch = () => {
    const records: AttendanceRecord[] = state.students.map(s => {
      const entry = attendanceMap[s.id] || { status: 'Present', reason: '' };
      return {
        id: `att-${selectedDate}-${selectedSession}-${s.id}`,
        studentId: s.id,
        date: selectedDate,
        session: selectedSession,
        status: entry.status,
        reason: entry.reason,
      };
    });

    onSaveAttendanceBatch(records);
    setSavedNotification(`Attendance successfully saved for ${records.length} students (${selectedSession}).`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  // Quick stats
  const total = state.students.length;
  const presentCount = Object.values(attendanceMap).filter(v => v.status === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(v => v.status === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter(v => v.status === 'Late').length;
  const excusedCount = Object.values(attendanceMap).filter(v => v.status === 'Excused').length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Daily Attendance Register</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የዕለት የተማሪዎች ክትትል</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class-by-class roll call across Morning Sabaq, Afternoon Tajweed, and Evening Muraaja’ah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
          >
            Mark All Present (ሁሉም ተገኝተዋል)
          </button>
          <button
            onClick={handleSaveBatch}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Date & Session Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Gregorian Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Ethiopian Date Display */}
          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 font-ethiopic">
            {ethDate.formattedAmharic}
          </div>

          {/* Session Picker */}
          <select
            value={selectedSession}
            onChange={e => setSelectedSession(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-semibold text-amber-300 outline-none focus:border-emerald-500"
          >
            <option value="Morning Sabaq">Morning Sabaq (የጠዋት ሒፍዝ ክፍለ-ጊዜ)</option>
            <option value="Afternoon Tajweed">Afternoon Tajweed (የከሰዓት ታጅዊድ)</option>
            <option value="Evening Muraaja'ah">Evening Muraaja'ah (የማታ ክለሳ)</option>
          </select>
        </div>

        {/* Stats Summary Pill */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px]">
          <span className="text-emerald-400 font-bold">{presentCount} Present</span>
          <span className="text-slate-600">·</span>
          <span className="text-rose-400 font-bold">{absentCount} Absent</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-bold">{lateCount} Late</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 font-bold">{attendanceRate}% Rate</span>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Hifz Level</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Absence Reason / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {state.students.map(student => {
              const currentStatus = attendanceMap[student.id]?.status || 'Present';
              const currentReason = attendanceMap[student.id]?.reason || '';

              return (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{student.fullNameEnglish}</div>
                    <div className="font-ethiopic text-[11px] text-amber-300">{student.fullNameAmharic}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{student.rollNo}</td>
                  <td className="py-3 px-4 text-slate-300">{student.hifzLevel}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          currentStatus === 'Late'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Excused')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          currentStatus === 'Excused'
                            ? 'bg-teal-700 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={currentReason}
                      onChange={e => handleReasonChange(student.id, e.target.value)}
                      placeholder={currentStatus !== 'Present' ? 'Specify reason...' : 'Optional notes'}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
