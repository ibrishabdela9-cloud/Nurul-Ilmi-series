/**
 * Reactive Persistent State Store for Nurul Ilmi Series Desktop App
 * Initialized with authentic Addis Ababa institutional seed data.
 * Supports auto-persistence to localStorage, atomic ledger balances,
 * and immutable audit logging.
 */

import {
  Student,
  HifzDailyRecord,
  AttendanceRecord,
  AcademicAssessment,
  FeeInvoice,
  CashbookAccount,
  CashbookVoucher,
  Benefactor,
  OrphanSponsorship,
  DepartmentBudget,
  FacultyMember,
  InventoryItem,
  ShuraMeeting,
  StrategicKPI,
  AdministrativeNotice,
  AuditLogEntry,
  DesktopNavModule,
} from '../types';
import { toEthiopianDate } from './ethiopian-calendar';

const STORAGE_KEY = 'NURUL_ILMI_DESKTOP_STORE_V1';

export interface AppStoreState {
  students: Student[];
  hifzRecords: HifzDailyRecord[];
  attendance: AttendanceRecord[];
  assessments: AcademicAssessment[];
  invoices: FeeInvoice[];
  accounts: CashbookAccount[];
  vouchers: CashbookVoucher[];
  benefactors: Benefactor[];
  orphanSponsorships: OrphanSponsorship[];
  budgets: DepartmentBudget[];
  faculty: FacultyMember[];
  inventory: InventoryItem[];
  shuraMeetings: ShuraMeeting[];
  kpis: StrategicKPI[];
  notices: AdministrativeNotice[];
  auditLogs: AuditLogEntry[];
  // Desktop workspace configuration
  activeModule: DesktopNavModule;
  activeWindowMaximized: boolean;
  selectedStudentId: string | null;
  selectedVoucherId: string | null;
}

// Validation helper for Ethiopian phone numbers (+2519..., +2517..., 09..., 07...)
export function isValidEthiopianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+251|0)(9|7)\d{8}$/.test(cleaned);
}

export function formatEthiopianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
    return '+251 ' + cleaned.slice(1, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6);
  }
  if (cleaned.startsWith('+251')) {
    return '+251 ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 9) + ' ' + cleaned.slice(9);
  }
  return phone;
}

// Initial Seed Data
const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    rollNo: 'NI-2024-001',
    fullNameEnglish: 'Bilal Abdurahman Ahmed',
    fullNameAmharic: 'ቢላል አብዱራሕማን አሕመድ',
    gender: 'Male',
    dob: '2010-04-12',
    enrollmentDate: '2023-09-11',
    hifzLevel: 'Advanced Hifz (Juz 16-29)',
    currentJuz: 24,
    currentSurah: 39, // Az-Zumar
    currentAyah: 41,
    memorizedJuzCount: 23,
    guardianName: 'Abdurahman Ahmed',
    guardianPhone: '+251911456789',
    guardianRelation: 'Father',
    subCity: 'Bole',
    emergencyContact: '+251911223344',
    bloodGroup: 'O+',
    status: 'Active',
    avatarColor: 'bg-emerald-700',
    notes: 'Exemplary memorization rate; candidate for national competition.',
  },
  {
    id: 'std-002',
    rollNo: 'NI-2024-002',
    fullNameEnglish: 'Fatima Zehra Jemal',
    fullNameAmharic: 'ፋጢማ ዘህራ ጀማል',
    gender: 'Female',
    dob: '2009-08-19',
    enrollmentDate: '2022-09-12',
    hifzLevel: 'Khatm Aspirant (Final Revision)',
    currentJuz: 30,
    currentSurah: 114, // An-Nas
    currentAyah: 6,
    memorizedJuzCount: 30,
    guardianName: 'Jemal Kedir',
    guardianPhone: '+251922558899',
    guardianRelation: 'Father',
    subCity: 'Arada',
    emergencyContact: '+251922558899',
    bloodGroup: 'A+',
    status: 'Active',
    avatarColor: 'bg-amber-600',
    notes: 'Completed full 30 Juz. Currently in Sanad Ijazah verification revision.',
  },
  {
    id: 'std-003',
    rollNo: 'NI-2024-003',
    fullNameEnglish: 'Yusuf Ibrahim Kedir',
    fullNameAmharic: 'ዩሱፍ ኢብራሂም ከድር',
    gender: 'Male',
    dob: '2012-01-25',
    enrollmentDate: '2024-01-08',
    hifzLevel: 'Intermediate Hifz (Juz 1-15)',
    currentJuz: 12,
    currentSurah: 12, // Yusuf
    currentAyah: 50,
    memorizedJuzCount: 11,
    guardianName: 'Amina Zeinu',
    guardianPhone: '+251930112233',
    guardianRelation: 'Mother',
    subCity: 'Kirkos',
    emergencyContact: '+251930112233',
    bloodGroup: 'B+',
    isOrphanSponsored: true,
    status: 'Active',
    avatarColor: 'bg-teal-700',
    notes: 'Supported by Orphan Hifz Sponsorship Program.',
  },
  {
    id: 'std-004',
    rollNo: 'NI-2024-004',
    fullNameEnglish: 'Sumayya Muktar Siraj',
    fullNameAmharic: 'ሱመያ ሙክታር ሲራጅ',
    gender: 'Female',
    dob: '2011-11-03',
    enrollmentDate: '2023-02-15',
    hifzLevel: 'Intermediate Hifz (Juz 1-15)',
    currentJuz: 14,
    currentSurah: 15,
    currentAyah: 20,
    memorizedJuzCount: 13,
    guardianName: 'Muktar Siraj',
    guardianPhone: '+251912445566',
    guardianRelation: 'Father',
    subCity: 'Yeka',
    emergencyContact: '+251912445566',
    bloodGroup: 'O-',
    status: 'Active',
    avatarColor: 'bg-sky-700',
    notes: 'Consistent attendance and strong Tajweed makharij.',
  },
  {
    id: 'std-005',
    rollNo: 'NI-2024-005',
    fullNameEnglish: 'Hamza Mohammed Nur',
    fullNameAmharic: 'ሐምዛ መሐመድ ኑር',
    gender: 'Male',
    dob: '2013-05-14',
    enrollmentDate: '2024-09-02',
    hifzLevel: 'Juz Amma (Beginner Hifz)',
    currentJuz: 30,
    currentSurah: 85, // Al-Buruj
    currentAyah: 12,
    memorizedJuzCount: 1,
    guardianName: 'Mohammed Nur',
    guardianPhone: '+251977889900',
    guardianRelation: 'Father',
    subCity: 'Addis Ketema',
    emergencyContact: '+251977889900',
    bloodGroup: 'AB+',
    status: 'Active',
    avatarColor: 'bg-indigo-700',
  },
  {
    id: 'std-006',
    rollNo: 'NI-2024-006',
    fullNameEnglish: 'Khalid Awol Hassen',
    fullNameAmharic: 'ኻሊድ አወል ሐሰን',
    gender: 'Male',
    dob: '2010-09-29',
    enrollmentDate: '2023-01-10',
    hifzLevel: 'Advanced Hifz (Juz 16-29)',
    currentJuz: 21,
    currentSurah: 32,
    currentAyah: 18,
    memorizedJuzCount: 20,
    guardianName: 'Awol Hassen',
    guardianPhone: '+251911998877',
    guardianRelation: 'Father',
    subCity: 'Nifas Silk-Lafto',
    emergencyContact: '+251911998877',
    bloodGroup: 'A-',
    isOrphanSponsored: true,
    status: 'Active',
    avatarColor: 'bg-rose-700',
  },
];

const INITIAL_ACCOUNTS: CashbookAccount[] = [
  {
    id: 'acc-cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000293847291',
    type: 'Bank',
    balanceETB: 845200.0,
    icon: 'Building2',
  },
  {
    id: 'acc-awash',
    name: 'Awash Bank S.C.',
    accountNumber: '0142839201920',
    type: 'Bank',
    balanceETB: 420750.5,
    icon: 'Landmark',
  },
  {
    id: 'acc-safe',
    name: 'Main Campus Petty Cash Safe (Addis Ababa)',
    accountNumber: 'SAFE-AA-01',
    type: 'Cash',
    balanceETB: 58400.0,
    icon: 'Vault',
  },
  {
    id: 'acc-telebirr',
    name: 'Telebirr Institutional Merchant',
    accountNumber: 'TB-MERCH-88219',
    type: 'Digital Wallet',
    balanceETB: 167300.25,
    icon: 'Smartphone',
  },
];

const INITIAL_VOUCHERS: CashbookVoucher[] = [
  {
    id: 'vch-001',
    voucherNumber: 'IN-2026-0031',
    type: 'INCOME',
    date: '2026-10-28',
    ethiopianDateString: 'ጥቅምት ፲፰ ቀን ፳፻፲፱ ዓ.ም',
    accountId: 'acc-telebirr',
    category: 'Tuition & Boarding Fee',
    amountETB: 12500.0,
    payerReceiver: 'Abdurahman Ahmed (Roll NI-2024-001)',
    description: 'Term 1 Tuition settlement via Telebirr merchant payment',
    authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
    status: 'Audited',
  },
  {
    id: 'vch-002',
    voucherNumber: 'IN-2026-0032',
    type: 'INCOME',
    date: '2026-10-29',
    ethiopianDateString: 'ጥቅምት ፲፱ ቀን ፳፻፲፱ ዓ.ም',
    accountId: 'acc-cbe',
    category: 'Diaspora Endowment Donation',
    amountETB: 150000.0,
    payerReceiver: 'Haji Nurredin Kassim (Washington DC Diaspora)',
    description: 'Masjid campus solar backup endowment grant',
    authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
    status: 'Audited',
  },
  {
    id: 'vch-003',
    voucherNumber: 'EX-2026-0012',
    type: 'EXPENSE',
    date: '2026-10-27',
    ethiopianDateString: 'ጥቅምት ፲፯ ቀን ፳፻፲፱ ዓ.ም',
    accountId: 'acc-cbe',
    category: 'Faculty Honorarium & Salaries',
    amountETB: 74000.0,
    payerReceiver: 'Academic Staff Payroll (7 Ustadhs)',
    description: 'Monthly teaching stipend for Hifz and Tajweed scholars',
    authorizedBy: 'Dr. Sheikh Zakaria (Mudir)',
    status: 'Audited',
  },
  {
    id: 'vch-004',
    voucherNumber: 'EX-2026-0013',
    type: 'EXPENSE',
    date: '2026-10-29',
    ethiopianDateString: 'ጥቅምት ፲፱ ቀን ፳፻፲፱ ዓ.ም',
    accountId: 'acc-safe',
    category: 'Madinah Mushaf Procurement',
    amountETB: 18500.0,
    payerReceiver: 'Al-Nur Islamic Bookshop Merkato',
    description: '50 Copies of 15-line Uthmani Madinah Mushafs for new intake',
    authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
    status: 'Approved',
  },
];

const INITIAL_INVOICES: FeeInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-101',
    studentId: 'std-001',
    termOrMonth: 'Term 1 (2026/27)',
    amountETB: 12500,
    amountPaidETB: 12500,
    balanceETB: 0,
    dueDate: '2026-10-31',
    status: 'Paid',
    paymentMethod: 'Telebirr',
    transactionRef: 'TB-9283748291',
    lastPaymentDate: '2026-10-28',
    officialReceiptNumber: 'RCP-ET-9941',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-102',
    studentId: 'std-002',
    termOrMonth: 'Term 1 (2026/27)',
    amountETB: 12500,
    amountPaidETB: 6000,
    balanceETB: 6500,
    dueDate: '2026-11-05',
    status: 'Partial',
    paymentMethod: 'CBE Birr',
    transactionRef: 'CBEB-4482910',
    lastPaymentDate: '2026-10-20',
    officialReceiptNumber: 'RCP-ET-9942',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-103',
    studentId: 'std-004',
    termOrMonth: 'Term 1 (2026/27)',
    amountETB: 12500,
    amountPaidETB: 0,
    balanceETB: 12500,
    dueDate: '2026-11-01',
    status: 'Pending',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-104',
    studentId: 'std-005',
    termOrMonth: 'Term 1 (2026/27)',
    amountETB: 12500,
    amountPaidETB: 0,
    balanceETB: 12500,
    dueDate: '2026-10-25',
    status: 'Overdue',
  },
];

const INITIAL_HIFZ_RECORDS: HifzDailyRecord[] = [
  {
    id: 'hifz-001',
    studentId: 'std-001',
    date: '2026-10-29',
    ethiopianDateString: 'ጥቅምት ፲፱ ቀን ፳፻፲፱ ዓ.ም',
    sabaqSurah: 39,
    sabaqStartAyah: 32,
    sabaqEndAyah: 41,
    sabaqMistakes: 1,
    sabaqTajweedScore: 9,
    sabqiJuz: 23,
    sabqiSurah: 36,
    sabqiGrade: 'Mumtaz (A)',
    manzilJuz: 14,
    manzilRetention: 'Flawless',
    notes: 'Excellent ghunnah and makharij of letters Daad and Qaf.',
    ustadhId: 'fac-002',
  },
  {
    id: 'hifz-002',
    studentId: 'std-002',
    date: '2026-10-29',
    ethiopianDateString: 'ጥቅምት ፲፱ ቀን ፳፻፲፱ ዓ.ም',
    sabaqSurah: 114,
    sabaqStartAyah: 1,
    sabaqEndAyah: 6,
    sabaqMistakes: 0,
    sabaqTajweedScore: 10,
    sabqiJuz: 29,
    sabqiSurah: 77,
    sabqiGrade: 'Mumtaz (A)',
    manzilJuz: 28,
    manzilRetention: 'Flawless',
    notes: 'Khatm completion achieved! MashaAllah.',
    ustadhId: 'fac-001',
  },
  {
    id: 'hifz-003',
    studentId: 'std-003',
    date: '2026-10-29',
    ethiopianDateString: 'ጥቅምት ፲፱ ቀን ፳፻፲፱ ዓ.ም',
    sabaqSurah: 12,
    sabaqStartAyah: 43,
    sabaqEndAyah: 50,
    sabaqMistakes: 2,
    sabaqTajweedScore: 8,
    sabqiJuz: 11,
    sabqiSurah: 10,
    sabqiGrade: 'Jayyid Jiddan (B)',
    manzilJuz: 6,
    manzilRetention: 'Good',
    notes: 'Pay close attention to Madd Muttasil vs Munfasil.',
    ustadhId: 'fac-002',
  },
];

const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'fac-001',
    name: 'Dr. Sheikh Zakaria Ababor',
    nameAmharic: 'ዶ/ር ሸይኽ ዘከሪያ አባቦር',
    role: 'Head Sheikh & Mudir',
    ijazahSanad: '10 Minor and Major Qira\'at via Shatibiyyah and Durrah with unbroken chain to the Messenger of Allah (ﷺ)',
    qiraatCertifications: ['Hafs \'an \'Asim', 'Warsh \'an Nafi\'', 'Qalun', 'Ad-Duri \'an Abi \'Amr'],
    phone: '+251911203040',
    hireDate: '2018-09-01',
    monthlySalaryETB: 28000,
    assignedHalqah: 'Halqah Al-Khatm & Sanad',
    status: 'Active',
  },
  {
    id: 'fac-002',
    name: 'Ustadh Hassen Taha',
    nameAmharic: 'ኡስታዝ ሐሰን ጣሃ',
    role: 'Senior Ustadh (Hifz)',
    ijazahSanad: 'Hafs \'an \'Asim via Al-Jazariyyah certification (Al-Azhar accredited)',
    qiraatCertifications: ['Hafs \'an \'Asim'],
    phone: '+251912334455',
    hireDate: '2020-02-15',
    monthlySalaryETB: 18500,
    assignedHalqah: 'Halqah Juz 15-30',
    status: 'Active',
  },
  {
    id: 'fac-003',
    name: 'Ustadha Halima Kedir',
    nameAmharic: 'ኡስታዛ ሐሊማ ከድር',
    role: 'Ustadh (Tajweed & Qira\'at)',
    ijazahSanad: 'Tuhfat al-Atfal & Al-Muqaddimah Al-Jazariyyah master teacher license',
    qiraatCertifications: ['Hafs \'an \'Asim'],
    phone: '+251913778899',
    hireDate: '2021-08-01',
    monthlySalaryETB: 17500,
    assignedHalqah: 'Female Tahfiz Wing (All Levels)',
    status: 'Active',
  },
  {
    id: 'fac-004',
    name: 'Sheikh Dawud Abdo',
    nameAmharic: 'ሸይኽ ዳዉድ አብዶ',
    role: 'Financial Comptroller',
    ijazahSanad: 'Islamic Finance & Shariah Accounting Auditor certification',
    qiraatCertifications: ['Hafs \'an \'Asim'],
    phone: '+251911884422',
    hireDate: '2019-04-10',
    monthlySalaryETB: 20000,
    assignedHalqah: 'Administration & Treasury',
    status: 'Active',
  },
];

const INITIAL_BUDGETS: DepartmentBudget[] = [
  {
    id: 'bgt-001',
    department: 'Ustadh & Faculty Honorariums',
    fiscalYear: '2026/27',
    allocatedETB: 950000,
    spentETB: 370000,
    remainingETB: 580000,
    leadUstadh: 'Sheikh Dawud Abdo',
    color: 'emerald',
  },
  {
    id: 'bgt-002',
    department: 'Student Feeding & Boarding Hall',
    fiscalYear: '2026/27',
    allocatedETB: 680000,
    spentETB: 312000,
    remainingETB: 368000,
    leadUstadh: 'Ustadh Hassen Taha',
    color: 'amber',
  },
  {
    id: 'bgt-003',
    department: 'Madinah Mushafs & Educational Resources',
    fiscalYear: '2026/27',
    allocatedETB: 250000,
    spentETB: 92500,
    remainingETB: 157500,
    leadUstadh: 'Ustadha Halima Kedir',
    color: 'teal',
  },
  {
    id: 'bgt-004',
    department: 'Masjid Infrastructure & Solar Power Backup',
    fiscalYear: '2026/27',
    allocatedETB: 450000,
    spentETB: 198000,
    remainingETB: 252000,
    leadUstadh: 'Dr. Sheikh Zakaria Ababor',
    color: 'indigo',
  },
];

const INITIAL_BENEFACTORS: Benefactor[] = [
  {
    id: 'bnf-001',
    name: 'Haji Nurredin Kassim',
    type: 'Local Diaspora',
    phone: '+12025550183',
    email: 'nurredin.kassim@example.com',
    cityCountry: 'Washington DC, USA',
    totalContributedETB: 350000,
    pledgedAmountETB: 500000,
    lastContributionDate: '2026-10-29',
    tier: 'Diamond (Waheed)',
  },
  {
    id: 'bnf-002',
    name: 'Bilal Traders PLC (Merkato)',
    type: 'Addis Ababa Merchant',
    phone: '+251911440022',
    email: 'info@bilaltraders.et',
    cityCountry: 'Merkato, Addis Ababa',
    totalContributedETB: 180000,
    pledgedAmountETB: 200000,
    lastContributionDate: '2026-09-15',
    tier: 'Gold (Dhahab)',
  },
  {
    id: 'bnf-003',
    name: 'Zahra Welfare Trust',
    type: 'Islamic Foundation',
    phone: '+251920887766',
    email: 'contact@zahrawelfare.org',
    cityCountry: 'Addis Ababa / Toronto',
    totalContributedETB: 240000,
    pledgedAmountETB: 300000,
    lastContributionDate: '2026-10-02',
    tier: 'Gold (Dhahab)',
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-001',
    itemName: 'King Fahd Complex 15-Line Madinah Mushaf (Large)',
    category: 'Madinah Mushaf',
    quantityInStock: 85,
    minimumThreshold: 30,
    unitPriceETB: 370,
    storageLocation: 'Library Shelf A1',
    condition: 'Pristine',
  },
  {
    id: 'inv-item-002',
    itemName: 'Tajweed Color-Coded Study Mushaf',
    category: 'Madinah Mushaf',
    quantityInStock: 24,
    minimumThreshold: 20,
    unitPriceETB: 450,
    storageLocation: 'Library Shelf A2',
    condition: 'Pristine',
  },
  {
    id: 'inv-item-003',
    itemName: 'Carved Wooden Rehal (Folding Qur\'an Stand)',
    category: 'Wooden Rehal (Qur\'an Stand)',
    quantityInStock: 110,
    minimumThreshold: 40,
    unitPriceETB: 650,
    storageLocation: 'Hall 1 & 2 Desks',
    condition: 'Good',
  },
  {
    id: 'inv-item-004',
    itemName: 'Tuhfat al-Atfal & Al-Jazariyyah Annotated Textbooks',
    category: 'Tajweed Text',
    quantityInStock: 14,
    minimumThreshold: 25,
    unitPriceETB: 180,
    storageLocation: 'Faculty Resource Office',
    condition: 'Good',
  },
];

const INITIAL_SHURA: ShuraMeeting[] = [
  {
    id: 'shura-001',
    meetingDate: '2026-10-15',
    ethiopianDateString: 'ጥቅምት ፭ ቀን ፳፻፲፱ ዓ.ም',
    title: 'Q1 Institutional Strategy & Expansion Review',
    chairperson: 'Dr. Sheikh Zakaria Ababor',
    votingAttendees: [
      'Dr. Sheikh Zakaria Ababor',
      'Sheikh Dawud Abdo',
      'Ustadh Hassen Taha',
      'Ustadha Halima Kedir',
      'Elder Hassen Gobeze (Community Trustee)',
      'Haji Kemal Seid (Board Member)',
    ],
    agendaPoints: [
      'Review of 30 Juz Khatm completion pipeline for 2026/27',
      'Installation of solar hybrid inverter to safeguard against city power cuts',
      'Approval of 20 full-scholarship seats for orphaned Hifz students',
      'Standardization of Telebirr and CBE digital receipt auditing',
    ],
    approvedResolutions: [
      'Resolution 26-01: Approved ETB 350,000 for 10kW solar system with lithium battery storage.',
      'Resolution 26-02: Confirmed 20 orphan student sponsorships with zero tuition liability.',
      'Resolution 26-03: Mandated dual Amharic-English official stamped receipts for all donors.',
    ],
    actionItems: [
      { task: 'Procure Tier-1 solar panels from accredited importer', assignee: 'Sheikh Dawud Abdo', deadline: '2026-11-15', completed: false },
      { task: 'Conduct Khatm ceremony rehearsals for 6 upcoming Huffaz', assignee: 'Ustadh Hassen Taha', deadline: '2026-11-20', completed: true },
    ],
    quorumReached: true,
  },
];

const INITIAL_KPIS: StrategicKPI[] = [
  {
    id: 'kpi-001',
    title: 'Certified Huffaz Graduating with Connected Sanad',
    category: 'Hifz Outcomes',
    targetValue: 25,
    currentValue: 18,
    unit: 'Huffaz',
    deadline: '2027-06-30',
    progressPercentage: 72,
    status: 'On Track',
  },
  {
    id: 'kpi-002',
    title: 'Orphan & Needy Student Full Sponsorship Coverage',
    category: 'Community Reach',
    targetValue: 30,
    currentValue: 24,
    unit: 'Students',
    deadline: '2026-12-31',
    progressPercentage: 80,
    status: 'On Track',
  },
  {
    id: 'kpi-003',
    title: 'Annual Zakat al-Mal & Endowment Capital (ETB)',
    category: 'Financial Sustainability',
    targetValue: 2000000,
    currentValue: 1433250,
    unit: 'ETB',
    deadline: '2026-12-31',
    progressPercentage: 71,
    status: 'On Track',
  },
  {
    id: 'kpi-004',
    title: 'Madinah Mushaf Retention Ratio in Students',
    category: 'Infrastructure Expansion',
    targetValue: 100,
    currentValue: 94,
    unit: '%',
    deadline: '2026-11-30',
    progressPercentage: 94,
    status: 'Achieved',
  },
];

const INITIAL_NOTICES: AdministrativeNotice[] = [
  {
    id: 'ntc-001',
    titleEnglish: 'Term 1 Mid-Evaluation & Tajweed Exam Schedule',
    titleAmharic: 'የመጀመሪያው ወሰነ-ትምህርት የታጅዊድ ፈተና መርሐ-ግብር',
    date: '2026-10-25',
    priority: 'High',
    targetAudience: 'All Students & Guardians',
    contentAmharic: 'የተከበራችሁ ወላጆችና ተማሪዎች፡ የ፳፻፲፱ ዓ.ም የ፩ኛው መንፈቀ-ዓመት የታጅዊድና የሒፍዝ የቃል ፈተና ከኅዳር ፩ እስከ ፭ ቀን የሚካሄድ መሆኑን እናሳውቃለን። ዝግጅታችሁን አጠናክሩ።',
    contentEnglish: 'All students are notified that Term 1 Oral Tajweed Makharij and Sabaq Recitation assessments will commence from Hidar 1 to 5. Please ensure daily Manzil revision.',
    issuedBy: 'Dr. Sheikh Zakaria Ababor (Mudir)',
  },
  {
    id: 'ntc-002',
    titleEnglish: 'Digital Fee Payments via Telebirr Merchant',
    titleAmharic: 'የትምህርት ክፍያዎችን በቴሌብር እና በኢትዮጵያ ንግድ ባንክ ስለመፈጸም',
    date: '2026-10-18',
    priority: 'Routine',
    targetAudience: 'All Students & Guardians',
    contentAmharic: 'ከጥሬ ገንዘብ ንክኪ ነፃ ለመሆን የትምህርት ክፍያዎችን በቴሌብር መለያ ቁጥር 88219 ወይም በኢትዮጵያ ንግድ ባንክ 1000293847291 ገቢ እንድታደርጉ በአክብሮት እናሳውቃለን።',
    contentEnglish: 'Guardians are encouraged to use Telebirr Merchant ID 88219 or CBE Account 1000293847291. Official stamped digital receipts will be generated automatically.',
    issuedBy: 'Sheikh Dawud Abdo (Treasurer)',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    actor: 'System Admin (Addis Ababa)',
    action: 'SYSTEM_BOOTSTRAP',
    module: 'CORE_KERNEL',
    details: 'Initialized Nurul Ilmi Series Desktop Suite with EAT (UTC+3) baseline and Ethiopian Ge\'ez calendar sync.',
    severity: 'INFO',
  },
  {
    id: 'log-002',
    timestamp: new Date().toISOString(),
    actor: 'Sheikh Dawud Abdo',
    action: 'VOUCHER_POSTED',
    module: 'CASHBOOK',
    details: 'Posted voucher IN-2026-0032 (ETB 150,000) for Diaspora solar endowment grant.',
    severity: 'INFO',
  },
];

export function getInitialState(): AppStoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate schema
      if (parsed.students && parsed.accounts && parsed.vouchers) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load localStorage state:', err);
  }

  return {
    students: INITIAL_STUDENTS,
    hifzRecords: INITIAL_HIFZ_RECORDS,
    attendance: [],
    assessments: [],
    invoices: INITIAL_INVOICES,
    accounts: INITIAL_ACCOUNTS,
    vouchers: INITIAL_VOUCHERS,
    benefactors: INITIAL_BENEFACTORS,
    orphanSponsorships: [
      {
        id: 'orph-001',
        studentId: 'std-003',
        sponsorName: 'Haji Nurredin Kassim',
        monthlyAllocationETB: 3500,
        startDate: '2024-01-01',
        endDate: '2027-01-01',
        isActive: true,
        coverageDetails: 'Boarding, Feeding, Mushafs & Medical',
      },
      {
        id: 'orph-002',
        studentId: 'std-006',
        sponsorName: 'Zahra Welfare Trust',
        monthlyAllocationETB: 3500,
        startDate: '2023-01-01',
        endDate: '2026-12-31',
        isActive: true,
        coverageDetails: 'Boarding, Feeding, Mushafs & Medical',
      },
    ],
    budgets: INITIAL_BUDGETS,
    faculty: INITIAL_FACULTY,
    inventory: INITIAL_INVENTORY,
    shuraMeetings: INITIAL_SHURA,
    kpis: INITIAL_KPIS,
    notices: INITIAL_NOTICES,
    auditLogs: INITIAL_AUDIT_LOGS,
    activeModule: 'dashboard',
    activeWindowMaximized: false,
    selectedStudentId: null,
    selectedVoucherId: null,
  };
}

export function saveStateToStorage(state: AppStoreState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}
