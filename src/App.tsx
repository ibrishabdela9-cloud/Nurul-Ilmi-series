/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Al-Furqan Quran & Hadith Academy (أكاديمية الفرقان للقرآن والحديث)
 * Professional Islamic School Management System
 * Ethiopia, Eastern Oromia, Chiro Town · EAT (UTC+3) · Ethiopian Birr (ETB)
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
import { SupportedLanguage } from './lib/i18n';

// Desktop Shell Components
import { DesktopHeader } from './components/desktop/DesktopHeader';
import { DesktopSidebar } from './components/desktop/DesktopSidebar';
import { CommandPalette } from './components/desktop/CommandPalette';
import { OfflineIndicator } from './components/desktop/PWAInstallButton';

// 14 Core Institutional Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { FacultyHrModule } from './components/modules/FacultyHrModule';
import { ClassesSectionsModule } from './components/modules/ClassesSectionsModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { AcademicTranscriptsModule } from './components/modules/AcademicTranscriptsModule';
import { PrayerEngineModule } from './components/modules/PrayerEngineModule';
import { HifzTrackerModule } from './components/modules/HifzTrackerModule';
import { ExaminationsModule } from './components/modules/ExaminationsModule';
import { CashbookModule } from './components/modules/CashbookModule';
import { ParentsModule } from './components/modules/ParentsModule';
import { NoticesModule } from './components/modules/NoticesModule';
import { DocumentCenterModule } from './components/modules/DocumentCenterModule';
import { SettingsModule } from './components/modules/SettingsModule';

// Supplementary Institutional Extensions
import { FeesInvoicingModule } from './components/modules/FeesInvoicingModule';
import { CsvImporterModule } from './components/modules/CsvImporterModule';
import { BudgetManagementModule } from './components/modules/BudgetManagementModule';
import { BenefactorsModule } from './components/modules/BenefactorsModule';
import { CharityFundsModule } from './components/modules/CharityFundsModule';
import { ZakatCalculatorModule } from './components/modules/ZakatCalculatorModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { StrategicKpisModule } from './components/modules/StrategicKpisModule';
import { ShuraGovernanceModule } from './components/modules/ShuraGovernanceModule';
import { GoogleWorkspaceModule } from './components/modules/GoogleWorkspaceModule';
import { EthiopianCalendarModule } from './components/modules/EthiopianCalendarModule';
import { AiAssistantModule } from './components/modules/AiAssistantModule';
import { AuditLogModule } from './components/modules/AuditLogModule';

export default function App() {
  const [state, setState] = useState<AppStoreState>(() => getInitialState());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SaaS Navigation & Preferences State
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('alfurqan_lang') as SupportedLanguage) || 'en';
  });
  const [academicYear, setAcademicYear] = useState<string>(() => {
    return localStorage.getItem('alfurqan_year') || '2026/2027 (2019 E.C.)';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Synchronize language and text direction (RTL for Arabic)
  useEffect(() => {
    localStorage.setItem('alfurqan_lang', currentLanguage);
    const html = document.documentElement;
    html.lang = currentLanguage;
    if (currentLanguage === 'ar') {
      html.dir = 'rtl';
    } else {
      html.dir = 'ltr';
    }
  }, [currentLanguage]);

  // Synchronize academic year
  useEffect(() => {
    localStorage.setItem('alfurqan_year', academicYear);
  }, [academicYear]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    showToast(`Interface language switched to ${lang.toUpperCase()}`);
  };

  const handleAcademicYearChange = (year: string) => {
    setAcademicYear(year);
    showToast(`Active Academic Year updated to ${year}`);
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
    setIsMobileSidebarOpen(false); // Close mobile drawer upon navigation
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
    showToast(`Student ${student.fullNameEnglish} successfully enrolled in Al-Furqan!`);
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
    logAudit('Head Mudir', 'ASSESSMENT_RECORDED', 'ACADEMICS', `Recorded ${assessment.term} dossier for student ${assessment.studentId} with GPA: ${assessment.gpaLetter}`);
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

  // Additional state handlers
  const handleAddBudget = (b: DepartmentBudget) => {
    setState(prev => ({ ...prev, budgets: [...prev.budgets, b] }));
    showToast(`Budget for ${b.department} allocated.`);
  };

  const handleAddBenefactor = (b: Benefactor) => {
    setState(prev => ({ ...prev, benefactors: [b, ...prev.benefactors] }));
    showToast(`Benefactor ${b.name} registered.`);
  };

  const handleAddOrphanSponsorship = (s: OrphanSponsorship) => {
    setState(prev => ({
      ...prev,
      orphanSponsorships: [s, ...prev.orphanSponsorships],
      students: prev.students.map(st => st.id === s.studentId ? { ...st, isOrphanSponsored: true } : st),
    }));
    showToast('Orphan Hifz Sponsorship activated!');
  };

  const handleAddFaculty = (f: FacultyMember) => {
    setState(prev => ({ ...prev, faculty: [...prev.faculty, f] }));
    showToast(`Faculty member ${f.name} appointed.`);
  };

  const handleUpdateInventoryQty = (id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === id ? { ...item, quantityInStock: Math.max(0, item.quantityInStock + delta) } : item),
    }));
  };

  const handleAddInventoryItem = (item: InventoryItem) => {
    setState(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
    showToast(`Asset item ${item.itemName} logged in stock.`);
  };

  const handleAddKPI = (kpi: StrategicKPI) => {
    setState(prev => ({ ...prev, kpis: [...prev.kpis, kpi] }));
    showToast('Strategic objective registered.');
  };

  const handleAddShuraMeeting = (m: ShuraMeeting) => {
    setState(prev => ({ ...prev, shuraMeetings: [m, ...prev.shuraMeetings] }));
    showToast('Shura assembly minutes published.');
  };

  const handleAddNotice = (n: AdministrativeNotice) => {
    setState(prev => ({ ...prev, notices: [n, ...prev.notices] }));
    showToast('Circular posted to bulletin.');
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
      case 'faculty_hr':
        return (
          <FacultyHrModule
            state={state}
            onAddFaculty={handleAddFaculty}
          />
        );
      case 'classes_sections':
        return <ClassesSectionsModule state={state} />;
      case 'attendance':
        return (
          <AttendanceModule
            state={state}
            onSaveAttendanceBatch={handleSaveAttendanceBatch}
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
      case 'examinations':
        return <ExaminationsModule state={state} />;
      case 'cashbook':
        return (
          <CashbookModule
            state={state}
            onAddVoucher={handleAddVoucher}
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
      case 'parents':
        return <ParentsModule state={state} />;
      case 'circulars_notices':
        return (
          <NoticesModule
            state={state}
            onAddNotice={handleAddNotice}
          />
        );
      case 'document_center':
        return <DocumentCenterModule state={state} />;
      case 'settings':
        return (
          <SettingsModule
            state={state}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            academicYear={academicYear}
            onAcademicYearChange={handleAcademicYearChange}
            onShowToast={showToast}
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
    <div className="min-h-screen bg-[#F5F7FA] text-[#273449] flex flex-col font-sans select-none antialiased">
      {/* Top Navigation Bar */}
      <DesktopHeader
        activeModule={state.activeModule}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMaximized={state.activeWindowMaximized}
        onToggleMaximize={handleToggleMaximize}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        academicYear={academicYear}
        onAcademicYearChange={handleAcademicYearChange}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main SaaS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Collapsible) */}
        <div className="hidden lg:flex">
          <DesktopSidebar
            activeModule={state.activeModule}
            onNavigate={handleNavigate}
            state={state}
            currentLanguage={currentLanguage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-white shadow-2xl flex flex-col">
              <DesktopSidebar
                activeModule={state.activeModule}
                onNavigate={handleNavigate}
                state={state}
                currentLanguage={currentLanguage}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Module Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F7FA]">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#17365D] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#C49A45]/40 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#16836B] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real-Time Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );
}
