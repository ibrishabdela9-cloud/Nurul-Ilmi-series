/**
 * Google Workspace Integration Service
 * Al-Furqan Quran Memorization Center & Islamic Studies Institute
 * 
 * Manages Google OAuth 2.0 authentication, real-time automatic synchronization
 * of all institutional reports and record tables to Google Sheets,
 * and automated Google Drive database backups.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Student, 
  FeeInvoice, 
  CashbookVoucher, 
  AttendanceRecord, 
  HifzDailyRecord, 
  AcademicAssessment,
  FacultyMember,
  InventoryItem,
  Benefactor,
} from '../types';
import { AppStoreState } from './store';

// Initialize or reuse Firebase App
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Local storage keys
const MASTER_SHEET_ID_KEY = 'alfurqan_master_sheet_id';
const MASTER_SHEET_URL_KEY = 'alfurqan_master_sheet_url';
const AUTO_SYNC_ENABLED_KEY = 'alfurqan_auto_sync_enabled';
const LAST_SYNC_TIME_KEY = 'alfurqan_last_sync_time';

export const getCachedToken = (): string | null => cachedAccessToken;

export const isAutoSyncEnabled = (): boolean => {
  const val = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return val === null ? true : val === 'true'; // Enabled by default
};

export const setAutoSyncEnabled = (enabled: boolean): void => {
  localStorage.setItem(AUTO_SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
};

export const getMasterSheetInfo = (): { id: string | null; url: string | null; lastSync: string | null } => {
  return {
    id: localStorage.getItem(MASTER_SHEET_ID_KEY),
    url: localStorage.getItem(MASTER_SHEET_URL_KEY),
    lastSync: localStorage.getItem(LAST_SYNC_TIME_KEY),
  };
};

export const setCustomMasterSpreadsheetId = (idOrUrl: string): { id: string; url: string } => {
  let id = idOrUrl.trim();
  // Extract id if full URL was provided
  const match = id.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    id = match[1];
  }
  const url = `https://docs.google.com/spreadsheets/d/${id}`;
  localStorage.setItem(MASTER_SHEET_ID_KEY, id);
  localStorage.setItem(MASTER_SHEET_URL_KEY, url);
  return { id, url };
};

export const clearMasterSpreadsheetId = (): void => {
  localStorage.removeItem(MASTER_SHEET_ID_KEY);
  localStorage.removeItem(MASTER_SHEET_URL_KEY);
};

export const initWorkspaceAuth = (
  onAuthChange: (user: User | null, token: string | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthChange(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthChange(user, null);
      }
    }
  });
};

export const signInWithGoogleWorkspace = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth provider.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Workspace Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleWorkspace = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Creates or retrieves the Master Google Sheet with all 9 worksheets
 */
export async function getOrCreateMasterSpreadsheet(token: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const existingId = localStorage.getItem(MASTER_SHEET_ID_KEY);
  const existingUrl = localStorage.getItem(MASTER_SHEET_URL_KEY);

  if (existingId && existingUrl) {
    // Validate if existing spreadsheet is accessible
    try {
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${existingId}?fields=spreadsheetId`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        return { spreadsheetId: existingId, spreadsheetUrl: existingUrl };
      }
    } catch {
      // If error, fall through and create new
    }
  }

  // Define the standard worksheets for Al-Furqan Academy
  const sheetTitles = [
    'Students Roster',
    'Daily Hifz Log',
    'Daily Attendance',
    'Academic Marksheets',
    'Tuition Fee Invoices',
    'Cashbook Ledger',
    'Faculty & Ustadhs',
    'Inventory & Mushafs',
    'Benefactors & Funds',
  ];

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'AL-FURQAN - Live Institutional Master Spreadsheet',
      },
      sheets: sheetTitles.map(title => ({
        properties: {
          title,
          gridProperties: { rowCount: 150, columnCount: 12, frozenRowCount: 1 },
        },
      })),
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Master Google Sheet: ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  localStorage.setItem(MASTER_SHEET_ID_KEY, spreadsheetId);
  localStorage.setItem(MASTER_SHEET_URL_KEY, spreadsheetUrl);

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Comprehensive Synchronization: Updates ALL 9 record tables into the Master Google Spreadsheet
 */
export async function syncAllDataToGoogleSheets(
  state: AppStoreState,
  token: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; rowCount: number }> {
  const { spreadsheetId, spreadsheetUrl } = await getOrCreateMasterSpreadsheet(token);

  // 1. Students Roster Values
  const studentsValues = [
    ['Roll No', 'Full Name (English)', 'Name (Amharic)', 'Gender', 'Hifz Level', 'Current Juz', 'Current Surah', 'Memorized Juz', 'Guardian Name', 'Phone', 'Sub-City', 'Status'],
    ...state.students.map(s => [
      s.rollNo,
      s.fullNameEnglish,
      s.fullNameAmharic,
      s.gender,
      s.hifzLevel,
      s.currentJuz,
      `Surah ${s.currentSurah} (Ayah ${s.currentAyah})`,
      s.memorizedJuzCount,
      `${s.guardianName} (${s.guardianRelation})`,
      s.guardianPhone,
      s.subCity,
      s.status,
    ]),
  ];

  // 2. Daily Hifz & Sabaq Log Values
  const hifzValues = [
    ['Log ID', 'Date', 'Ge\'ez Date', 'Student ID', 'Sabaq Surah', 'Start Ayah', 'End Ayah', 'Tajweed Score (/10)', 'Sabqi Grade', 'Manzil Retention', 'Ustadh In-Charge', 'Notes'],
    ...state.hifzRecords.map(h => [
      h.id,
      h.date,
      h.ethiopianDateString,
      h.studentId,
      h.sabaqSurah,
      h.sabaqStartAyah,
      h.sabaqEndAyah,
      `${h.sabaqTajweedScore}/10`,
      h.sabqiGrade,
      h.manzilRetention,
      h.ustadhId,
      h.notes || 'Routine revision',
    ]),
  ];

  // 3. Daily Attendance Register Values
  const attendanceValues = [
    ['Record ID', 'Date', 'Session', 'Student ID', 'Status', 'Reason/Notes'],
    ...state.attendance.map(a => [
      a.id,
      a.date,
      a.session,
      a.studentId,
      a.status,
      a.reason || 'Attended halqah session',
    ]),
  ];

  // 4. Academic Marksheets & Evaluations
  const assessmentValues = [
    ['Assessment ID', 'Student ID', 'Term', 'Academic Year', 'Date', 'Hifz Recitation (/100)', 'Tajweed Theory', 'Fiqh of Ibadat', 'Aqeedah & Tawheed', 'Arabic Grammar', 'Hadith Arbain', 'Average %', 'GPA Letter', 'Conduct'],
    ...state.assessments.map(a => [
      a.id,
      a.studentId,
      a.term,
      a.academicYear,
      a.dateRecorded,
      a.hifzRecitation,
      a.tajweedTheoryAndApplication,
      a.fiqhOfIbadat,
      a.aqeedahAndTawheed,
      a.arabicLanguageAndNahw,
      a.hadithArbain,
      `${a.averagePercentage}%`,
      a.gpaLetter,
      a.conductEvaluation,
    ]),
  ];

  // 5. Tuition Fee Invoices
  const invoiceValues = [
    ['Invoice No', 'Student ID', 'Term/Month', 'Amount (ETB)', 'Amount Paid (ETB)', 'Balance (ETB)', 'Due Date', 'Status', 'Payment Method', 'Tx Ref', 'Official Receipt #'],
    ...state.invoices.map(i => [
      i.invoiceNumber,
      i.studentId,
      i.termOrMonth,
      i.amountETB,
      i.amountPaidETB,
      i.balanceETB,
      i.dueDate,
      i.status,
      i.paymentMethod || 'Pending',
      i.transactionRef || 'N/A',
      i.officialReceiptNumber || 'N/A',
    ]),
  ];

  // 6. Cashbook General Ledger Vouchers
  const voucherValues = [
    ['Voucher No', 'Type', 'Date', 'Dual Date', 'Account ID', 'Category', 'Amount (ETB)', 'Payer / Payee', 'Description', 'Authorized By', 'Status'],
    ...state.vouchers.map(v => [
      v.voucherNumber,
      v.type,
      v.date,
      v.ethiopianDateString,
      v.accountId,
      v.category,
      v.amountETB,
      v.payerReceiver,
      v.description,
      v.authorizedBy,
      v.status,
    ]),
  ];

  // 7. Faculty & Ustadhs Roster
  const facultyValues = [
    ['Faculty ID', 'Full Name', 'Amharic Name', 'Role', 'Ijazah / Sanad', 'Assigned Halqah', 'Monthly Salary (ETB)', 'Phone', 'Hire Date', 'Status'],
    ...state.faculty.map(f => [
      f.id,
      f.name,
      f.nameAmharic,
      f.role,
      f.ijazahSanad,
      f.assignedHalqah,
      f.monthlySalaryETB,
      f.phone,
      f.hireDate,
      f.status,
    ]),
  ];

  // 8. Inventory & Mushaf Stock
  const inventoryValues = [
    ['Item ID', 'Item Name', 'Category', 'Quantity in Stock', 'Min Threshold', 'Unit Price (ETB)', 'Storage Location', 'Condition'],
    ...state.inventory.map(inv => [
      inv.id,
      inv.itemName,
      inv.category,
      inv.quantityInStock,
      inv.minimumThreshold,
      inv.unitPriceETB,
      inv.storageLocation,
      inv.condition,
    ]),
  ];

  // 9. Benefactors & Donations
  const benefactorValues = [
    ['Benefactor ID', 'Name', 'Type', 'Tier', 'Contributed (ETB)', 'Pledged (ETB)', 'Phone', 'Email', 'City / Country', 'Last Date'],
    ...state.benefactors.map(b => [
      b.id,
      b.name,
      b.type,
      b.tier,
      b.totalContributedETB,
      b.pledgedAmountETB,
      b.phone,
      b.email,
      b.cityCountry,
      b.lastContributionDate,
    ]),
  ];

  // Batch update all data ranges simultaneously
  const dataPayload = [
    { range: 'Students Roster!A1:L' + studentsValues.length, values: studentsValues },
    { range: 'Daily Hifz Log!A1:L' + hifzValues.length, values: hifzValues },
    { range: 'Daily Attendance!A1:F' + attendanceValues.length, values: attendanceValues },
    { range: 'Academic Marksheets!A1:N' + assessmentValues.length, values: assessmentValues },
    { range: 'Tuition Fee Invoices!A1:K' + invoiceValues.length, values: invoiceValues },
    { range: 'Cashbook Ledger!A1:K' + voucherValues.length, values: voucherValues },
    { range: 'Faculty & Ustadhs!A1:J' + facultyValues.length, values: facultyValues },
    { range: 'Inventory & Mushafs!A1:H' + inventoryValues.length, values: inventoryValues },
    { range: 'Benefactors & Funds!A1:J' + benefactorValues.length, values: benefactorValues },
  ];

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: dataPayload,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    throw new Error(`Failed to batch update Google Sheets: ${err}`);
  }

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  localStorage.setItem(LAST_SYNC_TIME_KEY, nowStr);

  const totalRows = studentsValues.length + hifzValues.length + attendanceValues.length + assessmentValues.length + invoiceValues.length + voucherValues.length;

  return { spreadsheetId, spreadsheetUrl, rowCount: totalRows };
}

/**
 * Real-Time Automatic Sync: Called automatically when any record is saved in the app
 */
export async function autoSyncUpdatedRecord(
  table: 'students' | 'hifz' | 'attendance' | 'invoices' | 'cashbook' | 'assessments',
  state: AppStoreState
): Promise<{ success: boolean; spreadsheetUrl?: string }> {
  if (!isAutoSyncEnabled()) return { success: false };

  const token = cachedAccessToken;
  if (!token) return { success: false };

  try {
    const result = await syncAllDataToGoogleSheets(state, token);
    return { success: true, spreadsheetUrl: result.spreadsheetUrl };
  } catch (err) {
    console.warn('Real-Time Google Sheets Auto-Sync warning:', err);
    return { success: false };
  }
}

/**
 * Backs up entire Al-Furqan database snapshot to Google Drive
 */
export async function backupDatabaseToGoogleDrive(
  dataSnapshot: Record<string, any>,
  token: string
): Promise<{ fileId: string; name: string; webViewLink?: string }> {
  const fileName = `AlFurqan_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const fileContent = JSON.stringify(dataSnapshot, null, 2);

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'Automated backup of Al-Furqan Quran Memorization Center & Islamic Studies Institute (Qur’an, Hadith & Financial Ledger)',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload to Google Drive: ${err}`);
  }

  const result = await res.json();
  return { fileId: result.id, name: result.name, webViewLink: result.webViewLink };
}

/**
 * List files created by Al-Furqan in Google Drive
 */
export async function listGoogleDriveBackups(token: string) {
  const query = encodeURIComponent("name contains 'AlFurqan' and trashed = false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,size,webViewLink)&orderBy=createdTime desc&pageSize=15`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to query Google Drive files');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Exports students roster to a dedicated Google Sheet
 */
export async function exportStudentsToGoogleSheets(
  students: Student[],
  token: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Al-Furqan Student Roster (${new Date().toISOString().split('T')[0]})`,
      },
      sheets: [
        {
          properties: {
            title: 'Students Register',
            gridProperties: { rowCount: students.length + 10, columnCount: 12, frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Student Spreadsheet: ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  const values = [
    ['Roll No', 'Full Name (English)', 'Name (Amharic)', 'Gender', 'Hifz Level', 'Current Juz', 'Current Surah', 'Memorized Juz', 'Guardian Name', 'Guardian Phone', 'Sub-City', 'Status'],
    ...students.map(s => [
      s.rollNo,
      s.fullNameEnglish,
      s.fullNameAmharic,
      s.gender,
      s.hifzLevel,
      s.currentJuz,
      `Surah ${s.currentSurah} (Ayah ${s.currentAyah})`,
      s.memorizedJuzCount,
      `${s.guardianName} (${s.guardianRelation})`,
      s.guardianPhone,
      s.subCity,
      s.status,
    ]),
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students Register!A1:L${values.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Exports financial ledger (invoices + vouchers) to a dedicated Google Sheet
 */
export async function exportFinancialsToGoogleSheets(
  invoices: FeeInvoice[],
  vouchers: CashbookVoucher[],
  token: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Al-Furqan Financial Ledger (${new Date().toISOString().split('T')[0]})`,
      },
      sheets: [
        {
          properties: {
            title: 'Tuition Invoices',
            gridProperties: { rowCount: invoices.length + 10, columnCount: 11, frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'Cashbook Vouchers',
            gridProperties: { rowCount: vouchers.length + 10, columnCount: 11, frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Financial Spreadsheet: ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  const invoiceValues = [
    ['Invoice No', 'Student ID', 'Term/Month', 'Amount (ETB)', 'Amount Paid (ETB)', 'Balance (ETB)', 'Due Date', 'Status', 'Payment Method', 'Tx Ref', 'Official Receipt #'],
    ...invoices.map(i => [
      i.invoiceNumber,
      i.studentId,
      i.termOrMonth,
      i.amountETB,
      i.amountPaidETB,
      i.balanceETB,
      i.dueDate,
      i.status,
      i.paymentMethod || 'Pending',
      i.transactionRef || 'N/A',
      i.officialReceiptNumber || 'N/A',
    ]),
  ];

  const voucherValues = [
    ['Voucher No', 'Type', 'Date', 'Dual Date', 'Account ID', 'Category', 'Amount (ETB)', 'Payer / Payee', 'Description', 'Authorized By', 'Status'],
    ...vouchers.map(v => [
      v.voucherNumber,
      v.type,
      v.date,
      v.ethiopianDateString || v.date,
      v.accountId,
      v.category,
      v.amountETB,
      v.payerReceiver,
      v.description,
      v.authorizedBy,
      v.status,
    ]),
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: `Tuition Invoices!A1:K${invoiceValues.length}`, values: invoiceValues },
        { range: `Cashbook Vouchers!A1:K${voucherValues.length}`, values: voucherValues },
      ],
    }),
  });

  return { spreadsheetId, spreadsheetUrl };
}

