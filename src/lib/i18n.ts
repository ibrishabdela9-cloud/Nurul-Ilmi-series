/**
 * Internationalization (i18n) Engine for Al-Furqan Quran Memorization Center & Islamic Studies Institute
 * Official Document Headers:
 * - Afaan Oromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN"
 * - English: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE"
 * - Arabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية"
 */

export type SupportedLanguage = 'en' | 'om' | 'ar' | 'am';

export interface Translations {
  // Navigation (14 core modules)
  dashboard: string;
  students: string;
  teachers: string;
  classes_sections: string;
  attendance: string;
  academic_management: string;
  islamic_studies: string;
  quran_management: string;
  examinations: string;
  fees_finance: string;
  parents: string;
  communication: string;
  reports: string;
  manual_edition: string;
  settings: string;

  // Header & School Identity
  schoolName: string;
  schoolSubtitle: string;
  documentHeaderOromoo: string;
  documentHeaderEnglish: string;
  documentHeaderArabic: string;
  searchPlaceholder: string;
  notifications: string;
  academicYear: string;
  userRole: string;
  logout: string;
  myProfile: string;

  // Dashboard
  welcomeTitle: string;
  welcomeSubtitle: string;
  totalStudents: string;
  totalTeachers: string;
  totalClasses: string;
  attendanceRate: string;
  feeCollection: string;
  academicPerformance: string;
  financialOverview: string;
  recentActivities: string;
  upcomingEvents: string;
  announcements: string;
  quickActions: string;

  // Actions
  addStudent: string;
  takeAttendance: string;
  recordPayment: string;
  printPreview: string;
  exportPdf: string;
  filter: string;
  search: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  status: string;
}

export const OFFICIAL_DOCUMENT_HEADERS = {
  oromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
  english: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE",
  arabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
  location: "Ethiopia, Eastern Oromia, Chiro Town",
  logoUrl: "/assets/aistudio/image_9f3d5314.png",
};

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    classes_sections: 'Classes & Sections',
    attendance: 'Attendance',
    academic_management: 'Academic Management',
    islamic_studies: 'Islamic Studies & Prayer',
    quran_management: 'Quran Management',
    examinations: 'Examinations',
    fees_finance: 'Fees & Finance',
    parents: 'Parents',
    communication: 'Communication',
    reports: 'Reports & Print Hub',
    manual_edition: 'Manual Edition & Sheets',
    settings: 'Settings',

    schoolName: 'AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE',
    schoolSubtitle: 'Ethiopia, Eastern Oromia, Chiro Town',
    documentHeaderEnglish: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE",
    documentHeaderOromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
    documentHeaderArabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
    searchPlaceholder: 'Search students, faculty, vouchers... (Ctrl+K)',
    notifications: 'Notifications',
    academicYear: 'Academic Year',
    userRole: 'Al-Sheikh Khadir Hamza · Head Mudir',
    logout: 'Log Out',
    myProfile: 'Account Settings',

    welcomeTitle: 'Welcome to Al-Furqan Center & Institute',
    welcomeSubtitle: 'Real-time institutional management of Qur’an memorization, Sharia studies, and financial ledger.',
    totalStudents: 'Total Students',
    totalTeachers: 'Faculty & Ustadhs',
    totalClasses: 'Halqahs & Sections',
    attendanceRate: 'Today’s Attendance',
    feeCollection: 'Fee Collection',
    academicPerformance: 'Academic Performance',
    financialOverview: 'Monthly Income vs Expenditure',
    recentActivities: 'Recent Activities',
    upcomingEvents: 'Upcoming Institutional Events',
    announcements: 'Important Circulars',
    quickActions: 'Quick Command Actions',

    addStudent: 'Enroll Student',
    takeAttendance: 'Mark Roll-Call',
    recordPayment: 'Record Payment',
    printPreview: 'Print Preview',
    exportPdf: 'Export PDF',
    filter: 'Filter',
    search: 'Search...',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete Record',
    edit: 'Edit Details',
    view: 'View Dossier',
    status: 'Status',
  },

  om: {
    dashboard: 'Daashboordii',
    students: 'Barattoota',
    teachers: 'Barsiisota',
    classes_sections: 'Kutaa fi Garee',
    attendance: 'Hordoffii Argamaa',
    academic_management: 'Bulchiinsa Barnootaa',
    islamic_studies: 'Barnoota Islaamaa fi Salaata',
    quran_management: 'Kunuunsa Qur’aanaa',
    examinations: 'Qormaata',
    fees_finance: 'Kaffaltii fi Faayinaansii',
    parents: 'Maatii',
    communication: 'Walqunnamtii',
    reports: 'Gabaasa fi Maxxansaa',
    manual_edition: 'Gulaallii Ragaalee',
    settings: 'Qindaa’ina',

    schoolName: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
    schoolSubtitle: 'Itoophiyaa, Oromiyaa Bahaa, Magaalaa Ciroo',
    documentHeaderEnglish: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE",
    documentHeaderOromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
    documentHeaderArabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
    searchPlaceholder: 'Barattoota, ragaalee barbaadi... (Ctrl+K)',
    notifications: 'Beeksisa',
    academicYear: 'Waggaa Barnootaa',
    userRole: 'Al-Sheekh Khadir Hamza · Mudiira Ol’aanaa',
    logout: 'Ba’i',
    myProfile: 'Profaayilii Koo',

    welcomeTitle: "Baga nagaan dhuftan Giddu-Gala Al-Furqaan",
    welcomeSubtitle: "Haala waliigalaa barumsa Qur’aanaa, Beekkumsa Shari’aa fi faayinaansii mana barumsaa keenyaa har’aa.",
    totalStudents: 'Waliigala Barattoota',
    totalTeachers: 'Barsiisota fi Ustaazota',
    totalClasses: 'Kutaalee fi Halaqaa',
    attendanceRate: 'Argama Har’aa',
    feeCollection: 'Kaffaltii Walitti Qabame',
    academicPerformance: 'Raawwii Barnootaa',
    financialOverview: 'Galii fi Baasii Ji’aa',
    recentActivities: 'Gochoota Dhihoo',
    upcomingEvents: 'Sagantaalee Dhufan',
    announcements: 'Beeksisa Barbaachisoo',
    quickActions: 'Tarkaanfiiwwan Saffisaa',

    addStudent: 'Barataa Galmeessi',
    takeAttendance: 'Argama Galmeessi',
    recordPayment: 'Kaffaltii Galmeessi',
    printPreview: 'Maxxansa Dursee Ilaali',
    exportPdf: 'PDF Baasi',
    filter: 'Calali',
    search: 'Barbaadi...',
    save: 'Olkaayi',
    cancel: 'Dhiisi',
    delete: 'Haqi',
    edit: 'Gulaali',
    view: 'Ilaali',
    status: 'Haala',
  },

  ar: {
    dashboard: 'لوحة التحكم',
    students: 'الطلاب',
    teachers: 'المعلمون والأساتذة',
    classes_sections: 'الفصول والحلقات',
    attendance: 'الحضور والغياب',
    academic_management: 'الإدارة الأكاديمية',
    islamic_studies: 'الدراسات الإسلامية ومواقيت الصلاة',
    quran_management: 'شؤون القرآن والحديث',
    examinations: 'الامتحانات والاختبارات',
    fees_finance: 'الرسوم والمالية',
    parents: 'أولياء الأمور',
    communication: 'الاتصالات والتعاميم',
    reports: 'التقارير ومركز الطباعة',
    manual_edition: 'تعديل السجلات ومزامنة الشيتس',
    settings: 'الإعدادات والنظام',

    schoolName: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
    schoolSubtitle: "إثيوبيا، أوروميا الشرقية، مدينة جرو",
    documentHeaderEnglish: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE",
    documentHeaderOromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
    documentHeaderArabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
    searchPlaceholder: 'ابحث عن طالب، إيصال، سجل... (Ctrl+K)',
    notifications: 'الإشعارات',
    academicYear: 'العام الدراسي',
    userRole: 'فضيلة الشيخ خضر حمزة · المدير العام',
    logout: 'تسجيل الخروج',
    myProfile: 'الملف الشخصي',

    welcomeTitle: 'أهلاً بكم في مركز الفرقان لتحفيظ القرآن الكريم والعلوم الشرعية',
    welcomeSubtitle: 'لوحة متكاملة لمتابعة حفظ القرآن، دورات العلوم الشرعية، والوضع المالي للأكاديمية.',
    totalStudents: 'إجمالي الطلاب',
    totalTeachers: 'هيئة التدريس والمشايخ',
    totalClasses: 'الحلقات والفصول',
    attendanceRate: 'نسبة حضور اليوم',
    feeCollection: 'نسبة تحصيل الرسوم',
    academicPerformance: 'الأداء الأكاديمي',
    financialOverview: 'الإيرادات والمصروفات الشهرية',
    recentActivities: 'آخر السجلات والعمليات',
    upcomingEvents: 'الفعاليات المجدولة',
    announcements: 'التعاميم الإدارية',
    quickActions: 'أوامر سريعة',

    addStudent: 'تسجيل طالب جديد',
    takeAttendance: 'تسجيل الحضور',
    recordPayment: 'قبض دفعة رسوم',
    printPreview: 'معاينة الطباعة الرسمية',
    exportPdf: 'تصدير مستند PDF',
    filter: 'تصفية',
    search: 'بحث...',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف السجل',
    edit: 'تعديل البيانات',
    view: 'عرض الإضبارة',
    status: 'الحالة',
  },

  am: {
    dashboard: 'ዋና ዳሽቦርድ',
    students: 'የተማሪዎች ማዕከል',
    teachers: 'መምህራንና ኡስታዞች',
    classes_sections: 'ክፍሎችና ሀለቃ',
    attendance: 'የዕለት ክትትል',
    academic_management: 'አካዳሚክ አስተዳደር',
    islamic_studies: 'ኢስላማዊ ጥናትና ሶላት',
    quran_management: 'የቁርኣንና ሐዲስ ሒፍዝ',
    examinations: 'ፈተናዎችና ምዘና',
    fees_finance: 'ክፍያና ፋይናንስ',
    parents: 'የወላጆች መዝገብ',
    communication: 'ማስታወቂያና ግንኙነት',
    reports: 'ሪፖርቶችና ህትመት ማዕከል',
    manual_edition: 'ማኑዋል ማስተካከያና ሺትስ',
    settings: 'የሲስተም ማስተካከያ',

    schoolName: "አል-ፉርቃን የቁርኣን ሂፍዝ ማዕከልና የሸሪዓ ጥናት ኢንስቲትዩት",
    schoolSubtitle: "ኢትዮጵያ፣ ምሥራቅ ኦሮሚያ፣ ጭሮ ከተማ",
    documentHeaderEnglish: "AL-FURQAN QURAN MEMORIZATION CENTER & ISLAMIC STUDIES INSTITUTE",
    documentHeaderOromoo: "GIDDU-GALA HIFZII QUR'AANAA AL-FURQAAN FI BEEKKUMSA SHARI’AA AL-FURQAAN",
    documentHeaderArabic: "مركز الفرقان لتحفيظ القرآن الكريم و العلوم الشرعية",
    searchPlaceholder: 'ተማሪዎችን፣ ደረሰኞችን ይፈልጉ... (Ctrl+K)',
    notifications: 'ማሳወቂያዎች',
    academicYear: 'የትምህርት ዘመን',
    userRole: 'አል-ሸይኽ ኻድር ሐምዛ · ዋና ሙዲር',
    logout: 'ውጣ',
    myProfile: 'የግል መረጃ',

    welcomeTitle: 'እንኳን ወደ አል-ፉርቃን የቁርኣን ሂፍዝ ማዕከል በደህና መጡ',
    welcomeSubtitle: 'የትምህርት ቤታችን የቁርኣን ሒፍዝ፣ የሸሪዓ ትምህርትና የፋይናንስ እንቅስቃሴ የቀጥታ ማጠቃለያ።',
    totalStudents: 'አጠቃላይ ተማሪዎች',
    totalTeachers: 'መምህራንና ኡስታዞች',
    totalClasses: 'የሚሰሩ ሀለቃዎች',
    attendanceRate: 'የዛሬው የተማሪዎች መገኘት',
    feeCollection: 'የክፍያ መሰብሰብ ምጣኔ',
    academicPerformance: 'የትምህርት ውጤት አፈጻጸም',
    financialOverview: 'ወርሃዊ ገቢና ወጪ ንጽጽር',
    recentActivities: 'የቅርብ ጊዜ እንቅስቃሴዎች',
    upcomingEvents: 'ቀጣይ ፕሮግራሞች',
    announcements: 'አስፈላጊ ማስታወቂያዎች',
    quickActions: 'ፈጣን የትዕዛዝ ሰሌዳ',

    addStudent: 'አዲስ ተማሪ መዝግብ',
    takeAttendance: 'ክትትል መዝግብ',
    recordPayment: 'ክፍያ ተቀበል',
    printPreview: 'የህትመት ቅድመ-ዕይታ',
    exportPdf: 'PDF አውርድ',
    filter: 'አጣራ',
    search: 'ፈልግ...',
    save: 'መዝግብ',
    cancel: 'ይቅር',
    delete: 'ሰርዝ',
    edit: 'አስተካክል',
    view: 'ተመልከት',
    status: 'ሁኔታ',
  },
};
