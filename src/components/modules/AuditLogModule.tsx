/**
 * Module 22 & 23: Audit Trail & System Log
 * Immutable audit log capturing administrative record creation,
 * fee settlements, data exports, and security telemetry.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';

export const AuditLogModule: React.FC<{ state: AppStoreState }> = ({ state }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = state.auditLogs.filter(log => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nurul_ilmi_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Audit Trail & Security System Log</h1>
            <span className="font-arabic text-amber-300 text-lg">سجل الرقابة والعمليات</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically audited system event logs recording every voucher posting, admission mutation, and data transaction.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action, module, or details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Severities</option>
          <option value="INFO">INFO (መደበኛ)</option>
          <option value="WARN">WARN (ማስጠንቀቂያ)</option>
          <option value="CRITICAL">CRITICAL (ወሳኝ)</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Timestamp (UTC/EAT)</th>
              <th className="py-3 px-4 font-semibold">Severity</th>
              <th className="py-3 px-4 font-semibold">Actor / Authority</th>
              <th className="py-3 px-4 font-semibold">Module</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                  {log.timestamp.replace('T', ' ').slice(0, 19)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : log.severity === 'WARN'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-200 font-medium">{log.actor}</td>
                <td className="py-3 px-4 text-amber-400 font-semibold">{log.module}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{log.action}</td>
                <td className="py-3 px-4 text-slate-300 font-sans text-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
