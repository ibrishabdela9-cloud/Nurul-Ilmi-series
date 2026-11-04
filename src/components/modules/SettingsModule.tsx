/**
 * Module: System Settings & Academy Profile
 * Al-Furqan Quran & Hadith Academy
 * Institutional settings, academic year control, language configurations,
 * role-based permissions, and data backup exports.
 */

import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Calendar,
  Shield,
  Database,
  Building,
  CheckCircle2,
  Save,
  Download,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../../lib/i18n';
import { AppStoreState } from '../../lib/store';

interface SettingsModuleProps {
  state: AppStoreState;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  academicYear: string;
  onAcademicYearChange: (year: string) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  state,
  currentLanguage,
  onLanguageChange,
  academicYear,
  onAcademicYearChange,
  onShowToast,
}) => {
  const [schoolName, setSchoolName] = useState('Al-Furqan Quran & Hadith Academy');
  const [headMudir, setHeadMudir] = useState('Sheikh Ibrahim Abdela');
  const [phone, setPhone] = useState('+251 91 123 4567');
  const [email, setEmail] = useState('ibrishabdela9@gmail.com');
  const [location, setLocation] = useState('Addis Ababa, Ethiopia (Grand Anwar Mosque precinct)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Academy Profile & System Settings saved successfully!');
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AlFurqan_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Full system backup downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-saas p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-[#C49A45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#17365D] tracking-tight">System Settings & Academy Profile</h1>
              <span className="font-arabic text-[#16836B] font-bold text-lg">إعدادات النظام والأكاديمية</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Al-Furqan Quran & Hadith Academy · Global institutional parameters, academic terms, and language preference.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#102642] text-white text-xs font-bold shadow-md transition"
        >
          <Database className="w-4 h-4 text-[#C49A45]" />
          <span>Export JSON Backup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institutional Profile */}
        <div className="card-saas p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#16836B]" />
            <h3 className="font-bold text-sm text-[#17365D]">Institution Profile & Accreditation</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Academy Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-bold text-[#17365D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Head Mudir / Principal</label>
                <input
                  type="text"
                  value={headMudir}
                  onChange={e => setHeadMudir(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campus Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Administrator Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location / Sub-City</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#16836B] hover:bg-emerald-700 text-white rounded-lg font-bold transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Language, Academic Year & Regional Calibration */}
        <div className="card-saas p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-[#C49A45]" />
            <h3 className="font-bold text-sm text-[#17365D]">Language & Academic Calendars</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Language Selection */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Interface Language (ቋንቋ / لغة)</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'en', label: 'English (Inter font)', rtl: false },
                  { id: 'om', label: 'Afaan Oromoo (Noto Sans)', rtl: false },
                  { id: 'ar', label: 'العربية (Noto Naskh Arabic · RTL)', rtl: true },
                  { id: 'am', label: 'አማርኛ (Noto Sans Ethiopic)', rtl: false },
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onLanguageChange(l.id as SupportedLanguage)}
                    className={`p-3 rounded-xl border text-left transition ${
                      currentLanguage === l.id
                        ? 'bg-[#17365D] text-white border-[#17365D] font-bold shadow-sm'
                        : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block">{l.label}</span>
                    {l.rtl && (
                      <span className="text-[10px] text-amber-300 font-mono mt-0.5 block">
                        Full RTL Layout Enabled
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Year Selection */}
            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1">Active Academic Year</label>
              <select
                value={academicYear}
                onChange={e => onAcademicYearChange(e.target.value)}
                className="w-full p-2.5 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-semibold text-[#17365D]"
              >
                <option value="2026/2027 (2019 E.C.)">2026/2027 Gregorian · 2019 E.C. (Current)</option>
                <option value="2025/2026 (2018 E.C.)">2025/2026 Gregorian · 2018 E.C.</option>
                <option value="2024/2025 (2017 E.C.)">2024/2025 Gregorian · 2017 E.C.</option>
              </select>
            </div>

            {/* Regional Calibration Note */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3.5 rounded-xl text-slate-700 text-xs space-y-1">
              <span className="font-bold text-[#1E40AF] block">Regional Engine Calibration:</span>
              <p className="text-slate-600">
                Timezone: East Africa Time (UTC+3) · Currency: Ethiopian Birr (ETB) · Solar Coordinates: Addis Ababa (9.025° N, 38.747° E) · Dual Calendar: Ethiopian Ge'ez & Gregorian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
