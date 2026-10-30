/**
 * Core Type Definitions for Nurul Ilmi Series Institutional Management Suite
 * Addis Ababa, Ethiopia · EAT (UTC+3) · Ethiopian Birr (ETB)
 */

export type HifzLevel =
  | 'Nazira (Foundation Reading)'
  | 'Juz Amma (Beginner Hifz)'
  | 'Intermediate Hifz (Juz 1-15)'
  | 'Advanced Hifz (Juz 16-29)'
  | 'Khatm Aspirant (Final Revision)'
  | 'Sanad & Ijazah Program';

export type StudentStatus = 'Active' | 'Graduated' | 'On Leave' | 'Withdrawn';

export interface Student {
  id: string;
  rollNo: string;
  fullNameAmharic: string;
  fullNameEnglish: string;
  gender: 'Male' | 'Female';
  dob: string;
  enrollmentDate: string;
  hifzLevel: HifzLevel;
  currentJuz: number;
  currentSurah: number;
  currentAyah: number;
  memorizedJuzCount: number;
  guardianName: string;
  guardianPhone: string; // Validated for Ethiopian pattern (+2519..., 09..., etc.)
  guardianRelation: 'Father' | 'Mother' | 'Brother' | 'Uncle' | 'Guardian';
  subCity: 'Kirkos' | 'Bole' | 'Arada' | 'Yeka' | 'Addis Ketema' | 'Nifas Silk-Lafto' | 'Kolfe Keranio' | 'Gulele' | 'Lideta' | 'Akaky Kaliti';
  emergencyContact: string;
  bloodGroup?: string;
  isOrphanSponsored?: boolean;
  status: StudentStatus;
  avatarColor: string;
  notes?: string;
}

export interface HifzDailyRecord {
  id: string;
  studentId: string;
  date: string;
  ethiopianDateString: string;
  // Sabaq (New lesson)
  sabaqSurah: number;
  sabaqStartAyah: number;
  sabaqEndAyah: number;
  sabaqMistakes: number;
  sabaqTajweedScore: number; // 1 to 10
  // Sabqi (Recent revision, past 1-2 Juz)
  sabqiJuz: number;
  sabqiSurah: number;
  sabqiGrade: 'Mumtaz (A)' | 'Jayyid Jiddan (B)' | 'Jayyid (C)' | 'Maqbool (D)' | 'Da\'eef (F)';
  // Manzil (Cumulative retention)
  manzilJuz: number;
  manzilRetention: 'Flawless' | 'Good' | 'Needs Revision' | 'Weak';
  notes: string;
  ustadhId: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type AttendanceSession = 'Morning Sabaq' | 'Afternoon Tajweed' | 'Evening Muraaja\'ah';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  session: AttendanceSession;
  status: AttendanceStatus;
  reason?: string;
}

export interface AcademicAssessment {
  id: string;
  studentId: string;
  term: 'Term 1' | 'Midterm' | 'Term 2 (Final)';
  academicYear: string;
  dateRecorded: string;
  // Subjects (out of 100)
  hifzRecitation: number;
  tajweedTheoryAndApplication: number;
  fiqhOfIbadat: number;
  aqeedahAndTawheed: number;
  arabicLanguageAndNahw: number;
  hadithArbain: number;
  adabAndAkhlaq: number;
  totalScore: number;
  averagePercentage: number;
  gpaLetter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  conductEvaluation: 'Exemplary' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  ustadhSignoff: string;
}

export type PaymentMethod = 'Telebirr' | 'CBE Birr' | 'Awash Bank' | 'Commercial Bank of Ethiopia' | 'Cash in Safe';
export type InvoiceStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  termOrMonth: string;
  amountETB: number;
  amountPaidETB: number;
  balanceETB: number;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  lastPaymentDate?: string;
  officialReceiptNumber?: string;
}

export interface CashbookAccount {
  id: string;
  name: string;
  accountNumber?: string;
  type: 'Bank' | 'Cash' | 'Digital Wallet';
  balanceETB: number;
  icon: string;
}

export type VoucherType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface CashbookVoucher {
  id: string;
  voucherNumber: string; // e.g. IN-2026-0031 or EX-2026-0012
  type: VoucherType;
  date: string;
  ethiopianDateString: string;
  accountId: string;
  targetAccountId?: string; // For transfers
  category: string;
  amountETB: number;
  payerReceiver: string;
  description: string;
  authorizedBy: string;
  status: 'Approved' | 'Audited' | 'Pending';
}

export interface Benefactor {
  id: string;
  name: string;
  type: 'Local Diaspora' | 'Addis Ababa Merchant' | 'Islamic Foundation' | 'Family Trust';
  phone: string;
  email: string;
  cityCountry: string;
  totalContributedETB: number;
  pledgedAmountETB: number;
  lastContributionDate: string;
  tier: 'Diamond (Waheed)' | 'Gold (Dhahab)' | 'Silver (Fiddah)' | 'Bronze';
  isAnonymous?: boolean;
}

export interface OrphanSponsorship {
  id: string;
  studentId: string;
  sponsorName: string;
  monthlyAllocationETB: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  coverageDetails: 'Boarding, Feeding, Mushafs & Medical';
}

export interface DepartmentBudget {
  id: string;
  department: string;
  fiscalYear: string;
  allocatedETB: number;
  spentETB: number;
  remainingETB: number;
  leadUstadh: string;
  color: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  nameAmharic: string;
  role: 'Head Sheikh & Mudir' | 'Senior Ustadh (Hifz)' | 'Ustadh (Tajweed & Qira\'at)' | 'Fiqh Lecturer' | 'Administrator' | 'Financial Comptroller';
  ijazahSanad: string; // e.g., 'Hafs \'an \'Asim via Shatibiyyah with connected chain to Prophet (ﷺ)'
  qiraatCertifications: string[];
  phone: string;
  hireDate: string;
  monthlySalaryETB: number;
  assignedHalqah: string;
  status: 'Active' | 'On Leave';
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: 'Madinah Mushaf' | 'Tajweed Text' | 'Wooden Rehal (Qur\'an Stand)' | 'Classroom Furniture' | 'Audio/Tech Equipment';
  quantityInStock: number;
  minimumThreshold: number;
  unitPriceETB: number;
  storageLocation: string;
  condition: 'Pristine' | 'Good' | 'Maintenance Required';
}

export interface ShuraMeeting {
  id: string;
  meetingDate: string;
  ethiopianDateString: string;
  title: string;
  chairperson: string;
  votingAttendees: string[];
  agendaPoints: string[];
  approvedResolutions: string[];
  actionItems: { task: string; assignee: string; deadline: string; completed: boolean }[];
  quorumReached: boolean;
}

export interface StrategicKPI {
  id: string;
  title: string;
  category: 'Hifz Outcomes' | 'Community Reach' | 'Financial Sustainability' | 'Infrastructure Expansion';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  progressPercentage: number;
  status: 'On Track' | 'At Risk' | 'Achieved';
}

export interface AdministrativeNotice {
  id: string;
  titleEnglish: string;
  titleAmharic: string;
  date: string;
  priority: 'High' | 'Routine' | 'Urgent';
  targetAudience: 'All Students & Guardians' | 'Faculty Only' | 'Board of Trustees' | 'Public';
  contentAmharic: string;
  contentEnglish: string;
  issuedBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

export type DesktopNavModule =
  | 'dashboard'
  | 'prayer_engine'
  | 'hifz_tracker'
  | 'students'
  | 'bulk_csv'
  | 'academic_transcripts'
  | 'attendance'
  | 'fees_invoicing'
  | 'benefactors'
  | 'charity_funds'
  | 'cashbook'
  | 'budgets'
  | 'zakat_calculator'
  | 'faculty_hr'
  | 'inventory'
  | 'strategic_kpis'
  | 'shura_governance'
  | 'circulars_notices'
  | 'document_center'
  | 'google_workspace'
  | 'ethiopian_calendar'
  | 'ai_assistant'
  | 'audit_log';
