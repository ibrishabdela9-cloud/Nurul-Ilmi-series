/**
 * Google Workspace Integration Service
 * Manages Google OAuth 2.0 authentication, Google Drive backups,
 * and direct Google Sheets institutional synchronization.
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
import { Student, FeeInvoice, CashbookVoucher } from '../types';

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

export const getCachedToken = (): string | null => cachedAccessToken;

/**
 * Creates or updates an official Google Sheet with Student Records
 */
export async function exportStudentsToGoogleSheets(
  students: Student[],
  token: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Step 1: Create a new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Nurul Ilmi - Student Register (${new Date().toISOString().split('T')[0]})`,
      },
      sheets: [
        {
          properties: {
            title: 'Active Students',
            gridProperties: { rowCount: students.length + 5, columnCount: 8 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Google Sheet: ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Step 2: Populate Header & Student Rows
  const values = [
    ['Roll No', 'Full English Name', 'Amharic Name', 'Hifz Current Surah', 'Juz', 'Guardian Name', 'Phone (+251)', 'Status'],
    ...students.map(s => [
      s.rollNo,
      s.fullNameEnglish,
      s.fullNameAmharic,
      `Surah ${s.currentSurah}`,
      s.currentJuz,
      s.guardianName,
      s.guardianPhone,
      s.status,
    ]),
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Active%20Students!A1:H${values.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Exports Fee Invoices and Cashbook Vouchers to Google Sheets
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
        title: `Nurul Ilmi - Financial Audit Ledger (${new Date().toISOString().split('T')[0]})`,
      },
      sheets: [
        { properties: { title: 'Tuition Invoices' } },
        { properties: { title: 'Cashbook Vouchers' } },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create financial Google Sheet: ${err}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Invoices sheet
  const invoiceValues = [
    ['Invoice No', 'Student ID', 'Term/Month', 'Amount (ETB)', 'Due Date', 'Status', 'Payment Method'],
    ...invoices.map(inv => [
      inv.invoiceNumber,
      inv.studentId,
      inv.termOrMonth,
      inv.amountETB,
      inv.dueDate,
      inv.status,
      inv.paymentMethod || 'N/A',
    ]),
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Tuition%20Invoices!A1:G${invoiceValues.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: invoiceValues }),
    }
  );

  // Vouchers sheet
  const voucherValues = [
    ['Voucher No', 'Type', 'Category', 'Amount (ETB)', 'Payer/Receiver', 'Description', 'Date'],
    ...vouchers.map(v => [
      v.voucherNumber,
      v.type,
      v.category,
      v.amountETB,
      v.payerReceiver,
      v.description,
      v.date,
    ]),
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cashbook%20Vouchers!A1:G${voucherValues.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: voucherValues }),
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Backs up entire Nurul Ilmi database snapshot to Google Drive
 */
export async function backupDatabaseToGoogleDrive(
  dataSnapshot: Record<string, any>,
  token: string
): Promise<{ fileId: string; name: string; webViewLink?: string }> {
  const fileName = `Nurul_Ilmi_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const fileContent = JSON.stringify(dataSnapshot, null, 2);

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'Automated backup of Nurul Ilmi Institutional Suite (Qur’an & Financial Data)',
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
 * List files created by Nurul Ilmi in Google Drive
 */
export async function listGoogleDriveBackups(token: string) {
  const query = encodeURIComponent("name contains 'Nurul_Ilmi' and trashed = false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,size,webViewLink)&orderBy=createdTime desc&pageSize=15`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to query Google Drive files');
  }

  const data = await res.json();
  return data.files || [];
}
