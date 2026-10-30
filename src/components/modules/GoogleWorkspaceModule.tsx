/**
 * Google Workspace Cloud Integration Module
 * Real-time sync with Google Drive & Google Sheets for student rosters,
 * financial ledgers, and secure cloud backups.
 */

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Cloud, 
  UploadCloud, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Lock, 
  LogOut, 
  FileText, 
  Database, 
  AlertCircle,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { 
  signInWithGoogleWorkspace, 
  signOutGoogleWorkspace, 
  initWorkspaceAuth, 
  exportStudentsToGoogleSheets, 
  exportFinancialsToGoogleSheets, 
  backupDatabaseToGoogleDrive, 
  listGoogleDriveBackups, 
  getCachedToken 
} from '../../lib/workspace';
import { AppStoreState } from '../../lib/store';
import { User } from 'firebase/auth';

interface GoogleWorkspaceModuleProps {
  state: AppStoreState;
  onShowToast: (msg: string) => void;
}

export const GoogleWorkspaceModule: React.FC<GoogleWorkspaceModuleProps> = ({ state, onShowToast }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getCachedToken());
  const [loading, setLoading] = useState(false);
  const [syncedFiles, setSyncedFiles] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isExportingStudents, setIsExportingStudents] = useState(false);
  const [isExportingFinances, setIsExportingFinances] = useState(false);
  const [isBackingUpDrive, setIsBackingUpDrive] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: async () => {},
  });

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth((user, authToken) => {
      setCurrentUser(user);
      setToken(authToken);
      if (authToken) {
        loadDriveFiles(authToken);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadDriveFiles = async (authToken: string) => {
    try {
      const files = await listGoogleDriveBackups(authToken);
      setSyncedFiles(files);
    } catch (err) {
      console.warn('Could not load drive files', err);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { user, accessToken } = await signInWithGoogleWorkspace();
      setCurrentUser(user);
      setToken(accessToken);
      onShowToast(`Signed in to Google Workspace as ${user.email}`);
      await loadDriveFiles(accessToken);
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || 'Failed to sign in to Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleWorkspace();
    setCurrentUser(null);
    setToken(null);
    setSyncedFiles([]);
    onShowToast('Signed out from Google Workspace.');
  };

  const handleExportStudents = async () => {
    if (!token) return;
    setConfirmModal({
      isOpen: true,
      title: 'Export Student Register to Google Sheets',
      description: `This will create a new live Google Spreadsheet containing ${state.students.length} student records, their Hifz progress, roll numbers, and contact details in your Google Account.`,
      action: async () => {
        setIsExportingStudents(true);
        try {
          const res = await exportStudentsToGoogleSheets(state.students, token);
          onShowToast('Student Register successfully synced to Google Sheets!');
          setStatusMsg(`Created spreadsheet: ${res.spreadsheetUrl}`);
          await loadDriveFiles(token);
        } catch (err: any) {
          setStatusMsg(err.message);
        } finally {
          setIsExportingStudents(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleExportFinances = async () => {
    if (!token) return;
    setConfirmModal({
      isOpen: true,
      title: 'Export Financial Audit Ledger to Google Sheets',
      description: `This will create an official two-tab Google Spreadsheet with ${state.invoices.length} tuition invoices and ${state.vouchers.length} cashbook vouchers in Ethiopian Birr (ETB).`,
      action: async () => {
        setIsExportingFinances(true);
        try {
          const res = await exportFinancialsToGoogleSheets(state.invoices, state.vouchers, token);
          onShowToast('Financial ledger exported to Google Sheets!');
          setStatusMsg(`Created spreadsheet: ${res.spreadsheetUrl}`);
          await loadDriveFiles(token);
        } catch (err: any) {
          setStatusMsg(err.message);
        } finally {
          setIsExportingFinances(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleBackupToDrive = async () => {
    if (!token) return;
    setConfirmModal({
      isOpen: true,
      title: 'Upload Full Institutional Backup to Google Drive',
      description: 'This will compile all Hifz tracking, student enrollments, faculty profiles, and financial vouchers into an encrypted JSON snapshot and upload it to your Google Drive.',
      action: async () => {
        setIsBackingUpDrive(true);
        try {
          const res = await backupDatabaseToGoogleDrive(state, token);
          onShowToast(`Institutional database snapshot saved to Google Drive: ${res.name}`);
          await loadDriveFiles(token);
        } catch (err: any) {
          setStatusMsg(err.message);
        } finally {
          setIsBackingUpDrive(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-900 p-3 flex items-center justify-center shadow-lg border border-emerald-500/30 shrink-0">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Google Workspace Integration</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Drive & Sheets API
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Synchronize Hifz memorization registers, tuition invoices, and cashbook vouchers directly with Google Sheets, and store encrypted backups on Google Drive.
            </p>
          </div>
        </div>

        {/* Account Authentication Badge */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border border-emerald-500/50" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">{currentUser.displayName || 'Authorized User'}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{currentUser.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-900/60 hover:text-rose-300 text-slate-300 transition"
                title="Disconnect Google Workspace"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center gap-2.5 shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-emerald-400 hover:text-white text-xs font-semibold">✕</button>
        </div>
      )}

      {/* Cloud Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Students Roster to Sheets */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Student Roster Sheet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Generates a live spreadsheet formatted with English & Arabic names, current Surah, and Ethiopian guardian phones.
              </p>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              {state.students.length} Active Records Ready
            </div>
          </div>
          <button
            onClick={handleExportStudents}
            disabled={!token || isExportingStudents}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            {isExportingStudents ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Export to Google Sheets</span>
          </button>
        </div>

        {/* Card 2: Financial Audit Ledger to Sheets */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Financial Audit Ledger</h3>
              <p className="text-xs text-slate-400 mt-1">
                Exports all tuition invoices and cashbook vouchers categorized under CBE, Awash, Telebirr, and Cash in ETB.
              </p>
            </div>
            <div className="text-[11px] text-teal-400 font-mono">
              {state.invoices.length} Invoices • {state.vouchers.length} Vouchers
            </div>
          </div>
          <button
            onClick={handleExportFinances}
            disabled={!token || isExportingFinances}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            {isExportingFinances ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Export Financial Ledger</span>
          </button>
        </div>

        {/* Card 3: Encrypted Google Drive Backup */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Drive Backup</h3>
              <p className="text-xs text-slate-400 mt-1">
                Uploads a full institutional snapshot to your private Google Drive for disaster recovery and long-term archiving.
              </p>
            </div>
            <div className="text-[11px] text-amber-400 font-mono">
              Full State Archive (JSON)
            </div>
          </div>
          <button
            onClick={handleBackupToDrive}
            disabled={!token || isBackingUpDrive}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            {isBackingUpDrive ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            <span>Backup to Google Drive</span>
          </button>
        </div>
      </div>

      {/* Synchronized Files Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Google Drive & Sheets History</h3>
            <span className="text-xs text-slate-400 font-normal">({syncedFiles.length} files located)</span>
          </div>
          {token && (
            <button
              onClick={() => loadDriveFiles(token)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Files
            </button>
          )}
        </div>

        {syncedFiles.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            {token 
              ? 'No Nurul Ilmi files uploaded yet. Click an export button above to generate your first Google Sheet or Drive backup.'
              : 'Sign in with your Google account above to view your synchronized spreadsheets and Drive backups.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Created Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {syncedFiles.map((f, i) => (
                  <tr key={f.id || i} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                      {f.mimeType?.includes('spreadsheet') ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Database className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{f.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {f.mimeType?.includes('spreadsheet') ? 'Google Sheet' : 'Drive Snapshot'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      {f.createdTime ? new Date(f.createdTime).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {f.webViewLink ? (
                        <a
                          href={f.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Saved in Drive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Modal for Destructive/Mutating Operations */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{confirmModal.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 text-[11px] text-slate-400 border border-slate-800">
              This action will connect to your authorized Google Workspace with permission to create and modify spreadsheet data.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.action}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
