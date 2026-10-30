/**
 * Bulk CSV Ingestion Engine for Nurul Ilmi Series
 * Strict Ethiopian phone regex validation (+2519..., +2517..., 09..., 07...),
 * duplicate detection against existing student records, and preview staging.
 */

import { Student, HifzLevel } from '../types';
import { isValidEthiopianPhone } from './store';

export interface CsvParsedRow {
  rowNumber: number;
  rollNo: string;
  fullNameEnglish: string;
  fullNameAmharic: string;
  gender: 'Male' | 'Female';
  dob: string;
  hifzLevel: HifzLevel;
  currentJuz: number;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: 'Father' | 'Mother' | 'Brother' | 'Uncle' | 'Guardian';
  subCity: 'Kirkos' | 'Bole' | 'Arada' | 'Yeka' | 'Addis Ketema' | 'Nifas Silk-Lafto' | 'Kolfe Keranio' | 'Gulele' | 'Lideta' | 'Akaky Kaliti';
  emergencyContact: string;
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
}

export function generateSampleStudentsCsv(): string {
  const headers = [
    'RollNo',
    'FullNameEnglish',
    'FullNameAmharic',
    'Gender',
    'DOB',
    'HifzLevel',
    'CurrentJuz',
    'GuardianName',
    'GuardianPhone',
    'GuardianRelation',
    'SubCity',
    'EmergencyContact',
  ];

  const sampleRows = [
    [
      'NI-2024-007',
      'Abdurahim Seid Ali',
      'አብዱራሒም ሰይድ አሊ',
      'Male',
      '2011-03-15',
      'Intermediate Hifz (Juz 1-15)',
      '8',
      'Seid Ali',
      '+251911334455',
      'Father',
      'Bole',
      '+251911334455',
    ],
    [
      'NI-2024-008',
      'Maryam Dawud Kemal',
      'መርየም ዳዉድ ከማል',
      'Female',
      '2012-07-22',
      'Juz Amma (Beginner Hifz)',
      '30',
      'Dawud Kemal',
      '0921445566',
      'Father',
      'Kirkos',
      '0921445566',
    ],
    [
      'NI-2024-009',
      'Umar Farooq Hassen',
      'ዑመር ፋሩቅ ሐሰን',
      'Male',
      '2010-12-10',
      'Advanced Hifz (Juz 16-29)',
      '19',
      'Hassen Farooq',
      '+251977112233',
      'Father',
      'Addis Ketema',
      '+251977112233',
    ],
  ];

  return [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
}

export function parseStudentsCsv(csvText: string, existingStudents: Student[]): CsvParsedRow[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const existingRolls = new Set(existingStudents.map(s => s.rollNo.toLowerCase()));

  const parsed: CsvParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle CSV line splitting (supporting basic quotes)
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length < 5) continue;

    const rowNum = i + 1;
    const errors: string[] = [];

    const rollNo = values[0] || `NI-2026-${String(100 + i).padStart(3, '0')}`;
    const fullNameEnglish = values[1] || '';
    const fullNameAmharic = values[2] || '';
    const rawGender = (values[3] || 'Male').toLowerCase();
    const gender: 'Male' | 'Female' = rawGender.startsWith('f') ? 'Female' : 'Male';
    const dob = values[4] || '2012-01-01';
    const rawLevel = values[5] || 'Juz Amma (Beginner Hifz)';
    const currentJuz = parseInt(values[6] || '1', 10);
    const guardianName = values[7] || 'Guardian';
    const guardianPhone = values[8] || '';
    const rawRelation = (values[9] || 'Father') as 'Father' | 'Mother' | 'Brother' | 'Uncle' | 'Guardian';
    const subCity = (values[10] || 'Bole') as 'Kirkos' | 'Bole' | 'Arada' | 'Yeka' | 'Addis Ketema' | 'Nifas Silk-Lafto' | 'Kolfe Keranio' | 'Gulele' | 'Lideta' | 'Akaky Kaliti';
    const emergencyContact = values[11] || guardianPhone;

    // Validations
    if (!fullNameEnglish) {
      errors.push('English full name is required');
    }

    if (existingRolls.has(rollNo.toLowerCase())) {
      errors.push(`Duplicate roll number: ${rollNo} already exists in database`);
    }

    if (!isValidEthiopianPhone(guardianPhone)) {
      errors.push(`Invalid Ethiopian phone format: "${guardianPhone}". Must follow +2519..., +2517..., 09..., or 07...`);
    }

    if (isNaN(currentJuz) || currentJuz < 1 || currentJuz > 30) {
      errors.push(`Current Juz must be between 1 and 30 (got: ${values[6]})`);
    }

    let hifzLevel: HifzLevel = 'Juz Amma (Beginner Hifz)';
    if (rawLevel.includes('Nazira')) hifzLevel = 'Nazira (Foundation Reading)';
    else if (rawLevel.includes('Intermediate') || (currentJuz >= 1 && currentJuz <= 15)) hifzLevel = 'Intermediate Hifz (Juz 1-15)';
    else if (rawLevel.includes('Advanced') || (currentJuz > 15 && currentJuz < 30)) hifzLevel = 'Advanced Hifz (Juz 16-29)';
    else if (rawLevel.includes('Khatm') || currentJuz === 30) hifzLevel = 'Khatm Aspirant (Final Revision)';

    parsed.push({
      rowNumber: rowNum,
      rollNo,
      fullNameEnglish,
      fullNameAmharic: fullNameAmharic || fullNameEnglish,
      gender,
      dob,
      hifzLevel,
      currentJuz: isNaN(currentJuz) ? 1 : currentJuz,
      guardianName,
      guardianPhone,
      guardianRelation: rawRelation,
      subCity,
      emergencyContact,
      isValid: errors.length === 0,
      errors,
      isDuplicate: existingRolls.has(rollNo.toLowerCase()),
    });
  }

  return parsed;
}
