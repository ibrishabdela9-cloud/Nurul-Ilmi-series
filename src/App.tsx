/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Nurul Ilmi Series (نور العلم) - Desktop Operating System
 * Integrated Qur’an Memorization, Islamic Studies & Financial Architecture
 * Addis Ababa, Ethiopia · EAT (UTC+3) · Ethiopian Birr (ETB)
 */

import React, { useState, useEffect } from 'react';
import {
  getInitialState,
  saveStateToStorage,
  AppStoreState,
} from './lib/store';
import {
  DesktopNavModule,
  Student,
  HifzDailyRecord,
  AttendanceRecord,
  AcademicAssessment,
  FeeInvoice,
  CashbookVoucher,
  Benefactor,
  OrphanSponsorship,
  DepartmentBudget,
  FacultyMember,
  InventoryItem,
  StrategicKPI,
  ShuraMeeting,
  AdministrativeNotice,
  AuditLogEntry,
  PaymentMethod,
} from './types';

// Desktop Shell Components
import { DesktopHeader } from './components/desktop/DesktopHeader';
import { DesktopSidebar } from './components/desktop/DesktopSidebar';
import { CommandPalette } from './components/desktop/CommandPalette';
import { OfflineIndicator } from './components/desktop/PWAInstallButton';

// Institutional Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { PrayerEngineModule } from './components/modules/PrayerEngineModule';
import { HifzTrackerModule } from './components/modules/HifzTrackerModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { CsvImporterModule } from './components/modules/CsvImporterModule';
import { AcademicTranscriptsModule } from './components/modules/AcademicTranscriptsModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { FeesInvoicingModule } from './components/modules/FeesInvoicingModule';
import { CashbookModule } from './components/modules/CashbookModule';
import { BudgetManagementModule } from './components/modules/BudgetManagementModule';
import { BenefactorsModule } from './components/modules/BenefactorsModule';
import { CharityFundsModule } from './components/modules/CharityFundsModule';
import { ZakatCalculatorModule } from './components/modules/ZakatCalculatorModule';
import { FacultyHrModule } from './components/modules/FacultyHrModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { StrategicKpisModule } from './components/modules/StrategicKpisModule';
import { ShuraGovernanceModule } from './components/modules/ShuraGovernanceModule';
import { NoticesModule } from './components/modules/NoticesModule';
import { DocumentCenterModule } from './components/modules/DocumentCenterModule';
import { GoogleWorkspaceModule } from './components/modules/GoogleWorkspaceModule';
import { EthiopianCalendarModule } from './components/modules/EthiopianCalendarModule';
import { AiAssistantModule } from './components/modules/AiAssistantModule';
import { AuditLogModule } from './components/modules/AuditLogModule';

export default function App() {
  const [state, setState] = useState<AppStoreState>(() => getInitialState());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logAudit = (actor: string, action: string, module: string, details: string, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      module,
      details,
      severity,
    };
    setState(prev => ({
      ...prev,
      auditLogs: [newEntry, ...prev.auditLogs],
    }));
  };

  const handleNavigate = (module: DesktopNavModule) => {
    setState(prev => ({ ...prev, activeModule: module }));
  };

  const handleToggleMaximize = () => {
    setState(prev => ({ ...prev, activeWindowMaximized: !prev.activeWindowMaximized }));
  };

  // Student Admissions
  const handleAddStudent = (student: Student) => {
    setState(prev => ({
      ...prev,
      students: [student, ...prev.students],
    }));
    logAudit('Administrator', 'STUDENT_ENROLLED', 'ADMISSIONS', `Enrolled ${student.fullNameEnglish} (${student.rollNo}) in ${student.hifzLevel}`);
    showToast(`Student ${student.fullNameEnglish} successfully enrolled!`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s),
    }));
    logAudit('Administrator', 'STUDENT_UPDATED', 'ADMISSIONS', `Updated record for ${updatedStudent.fullNameEnglish}`);
  };

  const handleBulkAddStudents = (newStudents: Student[]) => {
    setState(prev => ({
      ...prev,
      students: [...newStudents, ...prev.students],
    }));
    logAudit('Administrator', 'BULK_CSV_IMPORT', 'ADMISSIONS', `Imported ${newStudents.length} students via CSV`);
    showToast(`Bulk imported ${newStudents.length} students into directory!`);
  };

  // Daily Hifz Recitations
  const handleAddHifzRecord = (record: HifzDailyRecord) => {
    setState(prev => ({
      ...prev,
      hifzRecords: [record, ...prev.hifzRecords],
    }));
    logAudit('Senior Ustadh', 'RECITATION_LOGGED', 'HIFZ_TRACKER', `Logged Sabaq for Surah #${record.sabaqSurah} (Ayahs ${record.sabaqStartAyah}-${record.sabaqEndAyah}), Tajweed: ${record.sabaqTajweedScore}/10`);
    showToast('Recitation successfully logged in registry.');
  };

  const handleUpdateStudentProgress = (studentId: string, currentJuz: number, surah: number, ayah: number, memorizedJuz: number) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            currentJuz,
            currentSurah: surah,
            currentAyah: ayah,
            memorizedJuzCount: Math.max(s.memorizedJuzCount, memorizedJuz),
          };
        }
        return s;
      }),
    }));
  };

  // Academic Assessments
  const handleAddAssessment = (assessment: AcademicAssessment) => {
    setState(prev => ({
      ...prev,
      assessments: [assessment, ...prev.assessments],
    }));
    logAudit('Mudir / Lead Ustadh', 'ASSESSMENT_RECORDED', 'ACADEMICS', `Recorded ${assessment.term} dossier for student ${assessment.studentId} with GPA: ${assessment.gpaLetter}`);
    showToast('Academic Dossier saved and ready for printing.');
  };

  // Attendance Register
  const handleSaveAttendanceBatch = (records: AttendanceRecord[]) => {
    setState(prev => ({
      ...prev,
      attendance: [...records, ...prev.attendance],
    }));
    logAudit('Ustadh In-Charge', 'ATTENDANCE_BATCH_SAVED', 'ATTENDANCE', `Saved roll call for ${records.length} students`);
    showToast('Roll-call attendance recorded.');
  };

  // Invoicing & Fee Collection
  const handleAddInvoice = (inv: FeeInvoice) => {
    setState(prev => ({
      ...prev,
      invoices: [inv, ...prev.invoices],
    }));
    logAudit('Treasurer', 'INVOICE_GENERATED', 'FEES', `Issued ${inv.invoiceNumber} for ${inv.amountETB.toLocaleString()} ETB`);
    showToast(`Invoice ${inv.invoiceNumber} issued.`);
  };

  const handleRecordPayment = (invoiceId: string, amountETB: number, method: PaymentMethod, txRef: string) => {
    setState(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.amountPaidETB + amountETB;
          const newBalance = Math.max(0, inv.amountETB - newPaid);
          const newStatus = newBalance <= 0 ? 'Paid' : 'Partial';
          return {
            ...inv,
            amountPaidETB: newPaid,
            balanceETB: newBalance,
            status: newStatus,
            paymentMethod: method,
            transactionRef: txRef,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            officialReceiptNumber: `RCP-ET-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return inv;
      }),
    }));
    logAudit('Treasurer', 'PAYMENT_RECEIVED', 'FEES', `Received ${amountETB.toLocaleString()} ETB via ${method} (Ref: ${txRef})`);
    showToast(`Payment of ${amountETB.toLocaleString()} ETB processed.`);
  };

  // Cashbook & General Ledger
  const handleAddVoucher = (voucher: CashbookVoucher) => {
    setState(prev => {
      // Atomic balance update on target account
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === voucher.accountId) {
          const delta = voucher.type === 'INCOME' ? voucher.amountETB : voucher.type === 'EXPENSE' ? -voucher.amountETB : 0;
          return {
            ...acc,
            balanceETB: acc.balanceETB + delta,
          };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        vouchers: [voucher, ...prev.vouchers],
      };
    });
    logAudit('Treasurer', 'VOUCHER_POSTED', 'CASHBOOK', `Posted ${voucher.voucherNumber} (${voucher.type} of ${voucher.amountETB.toLocaleString()} ETB)`);
    showToast(`Voucher ${voucher.voucherNumber} posted to General Ledger.`);
  };

  // Department Budgets
  const handleAddBudget = (b: DepartmentBudget) => {
    setState(prev => ({
      ...prev,
      budgets: [...prev.budgets, b],
    }));
    logAudit('Financial Comptroller', 'BUDGET_ALLOCATED', 'BUDGETS', `Allocated ${b.allocatedETB.toLocaleString()} ETB to ${b.department}`);
    showToast(`Budget for ${b.department} allocated.`);
  };

  // Benefactors & Donors
  const handleAddBenefactor = (b: Benefactor) => {
    setState(prev => ({
      ...prev,
      benefactors: [b, ...prev.benefactors],
    }));
    logAudit('Administrator', 'BENEFACTOR_REGISTERED', 'DONORS', `Registered benefactor ${b.name} (${b.tier})`);
    showToast(`Benefactor ${b.name} added to portfolio.`);
  };

  // Orphan Sponsorships
  const handleAddOrphanSponsorship = (s: OrphanSponsorship) => {
    setState(prev => ({
      ...prev,
      orphanSponsorships: [s, ...prev.orphanSponsorships],
      students: prev.students.map(st => st.id === s.studentId ? { ...st, isOrphanSponsored: true } : st),
    }));
    logAudit('Welfare Trustee', 'ORPHAN_SPONSORED', 'CHARITY', `Activated full sponsorship for student ${s.studentId} (${s.monthlyAllocationETB.toLocaleString()} ETB/mo)`);
    showToast('Orphan Hifz Sponsorship activated!');
  };

  // Faculty HR
  const handleAddFaculty = (f: FacultyMember) => {
    setState(prev => ({
      ...prev,
      faculty: [...prev.faculty, f],
    }));
    logAudit('Mudir Office', 'FACULTY_APPOINTED', 'HR', `Appointed ${f.name} as ${f.role}`);
    showToast(`Faculty member ${f.name} appointed.`);
  };

  // Inventory & Asset Control
  const handleUpdateInventoryQty = (id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantityInStock: Math.max(0, item.quantityInStock + delta),
          };
        }
        return item;
      }),
    }));
  };

  const handleAddInventoryItem = (item: InventoryItem) => {
    setState(prev => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
    logAudit('Asset Comptroller', 'ASSET_PROCURED', 'INVENTORY', `Added ${item.itemName} (${item.quantityInStock} units)`);
    showToast(`Asset item ${item.itemName} logged in stock.`);
  };

  // Strategic KPIs
  const handleAddKPI = (kpi: StrategicKPI) => {
    setState(prev => ({
      ...prev,
      kpis: [...prev.kpis, kpi],
    }));
    logAudit('Strategic Committee', 'KPI_DEFINED', 'STRATEGY', `Created KPI: ${kpi.title}`);
    showToast('Strategic objective registered.');
  };

  // Shura Council
  const handleAddShuraMeeting = (m: ShuraMeeting) => {
    setState(prev => ({
      ...prev,
      shuraMeetings: [m, ...prev.shuraMeetings],
    }));
    logAudit('Shura Secretary', 'SHURA_MINUTES_RATIFIED', 'GOVERNANCE', `Ratified assembly minutes for ${m.title}`);
    showToast('Shura assembly minutes published.');
  };

  // Administrative Notices
  const handleAddNotice = (n: AdministrativeNotice) => {
    setState(prev => ({
      ...prev,
      notices: [n, ...prev.notices],
    }));
    logAudit('Administrative Office', 'NOTICE_PUBLISHED', 'CIRCULARS', `Published circular: ${n.titleEnglish}`);
    showToast('Notice posted to institutional bulletin.');
  };

  const handleSelectStudent = (id: string) => {
    setState(prev => ({ ...prev, selectedStudentId: id }));
  };

  // Module Router
  const renderModule = () => {
    switch (state.activeModule) {
      case 'dashboard':
        return (
          <DashboardModule
            state={state}
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
          />
        );
      case 'prayer_engine':
        return <PrayerEngineModule />;
      case 'hifz_tracker':
        return (
          <HifzTrackerModule
            state={state}
            onAddHifzRecord={handleAddHifzRecord}
            onUpdateStudentProgress={handleUpdateStudentProgress}
          />
        );
      case 'students':
        return (
          <StudentsModule
            state={state}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
          />
        );
      case 'bulk_csv':
        return (
          <CsvImporterModule
            state={state}
            onBulkAddStudents={handleBulkAddStudents}
            onNavigate={handleNavigate}
          />
        );
      case 'academic_transcripts':
        return (
          <AcademicTranscriptsModule
            state={state}
            onAddAssessment={handleAddAssessment}
            onNavigate={handleNavigate}
          />
        );
      case 'attendance':
        return (
          <AttendanceModule
            state={state}
            onSaveAttendanceBatch={handleSaveAttendanceBatch}
          />
        );
      case 'fees_invoicing':
        return (
          <FeesInvoicingModule
            state={state}
            onAddInvoice={handleAddInvoice}
            onRecordPayment={handleRecordPayment}
            onAddVoucher={handleAddVoucher}
          />
        );
      case 'cashbook':
        return (
          <CashbookModule
            state={state}
            onAddVoucher={handleAddVoucher}
          />
        );
      case 'budgets':
        return (
          <BudgetManagementModule
            state={state}
            onAddBudget={handleAddBudget}
          />
        );
      case 'benefactors':
        return (
          <BenefactorsModule
            state={state}
            onAddBenefactor={handleAddBenefactor}
          />
        );
      case 'charity_funds':
        return (
          <CharityFundsModule
            state={state}
            onAddOrphanSponsorship={handleAddOrphanSponsorship}
            onNavigate={handleNavigate}
          />
        );
      case 'zakat_calculator':
        return (
          <ZakatCalculatorModule
            state={state}
            onAddVoucher={handleAddVoucher}
            onNavigate={handleNavigate}
          />
        );
      case 'faculty_hr':
        return (
          <FacultyHrModule
            state={state}
            onAddFaculty={handleAddFaculty}
          />
        );
      case 'inventory':
        return (
          <InventoryModule
            state={state}
            onUpdateInventoryQty={handleUpdateInventoryQty}
            onAddInventoryItem={handleAddInventoryItem}
          />
        );
      case 'strategic_kpis':
        return (
          <StrategicKpisModule
            state={state}
            onAddKPI={handleAddKPI}
          />
        );
      case 'shura_governance':
        return (
          <ShuraGovernanceModule
            state={state}
            onAddShuraMeeting={handleAddShuraMeeting}
          />
        );
      case 'circulars_notices':
        return (
          <NoticesModule
            state={state}
            onAddNotice={handleAddNotice}
          />
        );
      case 'document_center':
        return <DocumentCenterModule state={state} />;
      case 'google_workspace':
        return <GoogleWorkspaceModule state={state} onShowToast={showToast} />;
      case 'ethiopian_calendar':
        return <EthiopianCalendarModule />;
      case 'ai_assistant':
        return <AiAssistantModule state={state} />;
      case 'audit_log':
        return <AuditLogModule state={state} />;
      default:
        return (
          <DashboardModule
            state={state}
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Native Desktop Window Header */}
      <DesktopHeader
        activeModule={state.activeModule}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMaximized={state.activeWindowMaximized}
        onToggleMaximize={handleToggleMaximize}
      />

      {/* Main Desktop Workstation Body */}
      <div className={`flex-1 flex overflow-hidden ${state.activeWindowMaximized ? 'p-0' : 'p-2 sm:p-3'}`}>
        <div
          className={`flex-1 flex bg-slate-950/95 border border-emerald-900/40 shadow-2xl shadow-black/80 ring-1 ring-emerald-500/10 overflow-hidden ${
            state.activeWindowMaximized ? 'rounded-none' : 'rounded-2xl'
          }`}
        >
          {/* Categorized Multi-Module Navigation Board */}
          <DesktopSidebar
            activeModule={state.activeModule}
            onNavigate={handleNavigate}
            state={state}
          />

          {/* Module Primary Canvas Board */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#02140f] via-slate-950 to-[#020b08]">
            {renderModule()}
          </main>
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        state={state}
        onNavigate={handleNavigate}
        onSelectStudent={handleSelectStudent}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-600 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real-Time Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );
}
