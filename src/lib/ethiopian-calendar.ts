/**
 * Ethiopian (Ge'ez) Calendar Engine
 * Implementation based on the Beyene-Kudlek algorithm via Julian Day Numbers (JDN).
 * Provides dual Gregorian-Ethiopian date conversions, Amharic localization,
 * and authentic Ge'ez numeral formatting.
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1 to 13
  day: number;   // 1 to 30 (or 5/6 in Pagume)
  monthNameAmharic: string;
  monthNameEnglish: string;
  dayNameAmharic: string;
  geezYear: string;
  geezDay: string;
  formattedAmharic: string;
  formattedEnglish: string;
}

export const ETHIOPIAN_MONTHS = [
  { id: 1, amharic: 'መስከረም', english: 'Meskerem', maxDays: 30 },
  { id: 2, amharic: 'ጥቅምት', english: 'Tikimt', maxDays: 30 },
  { id: 3, amharic: 'ኅዳር', english: 'Hidar', maxDays: 30 },
  { id: 4, amharic: 'ታኅሣሥ', english: 'Tahsas', maxDays: 30 },
  { id: 5, amharic: 'ጥር', english: 'Tir', maxDays: 30 },
  { id: 6, amharic: 'የካቲት', english: 'Yakatit', maxDays: 30 },
  { id: 7, amharic: 'መጋቢት', english: 'Megabit', maxDays: 30 },
  { id: 8, amharic: 'ሚያዝያ', english: 'Miazia', maxDays: 30 },
  { id: 9, amharic: 'ግንቦት', english: 'Ginbot', maxDays: 30 },
  { id: 10, amharic: 'ሰኔ', english: 'Sene', maxDays: 30 },
  { id: 11, amharic: 'ሐምሌ', english: 'Hamle', maxDays: 30 },
  { id: 12, amharic: 'ነሐሴ', english: 'Nehase', maxDays: 30 },
  { id: 13, amharic: 'ጳጉሜ', english: 'Pagume', maxDays: 6 },
];

export const ETHIOPIAN_DAYS = [
  { amharic: 'እሑድ', english: 'Ehud (Sunday)' },
  { amharic: 'ሰኞ', english: 'Segno (Monday)' },
  { amharic: 'ማክሰኞ', english: 'Maksegno (Tuesday)' },
  { amharic: 'ረቡዕ', english: 'Erob (Wednesday)' },
  { amharic: 'ሐሙስ', english: 'Hamus (Thursday)' },
  { amharic: 'ዓርብ', english: 'Arb (Friday)' },
  { amharic: 'ቅዳሜ', english: 'Kidame (Saturday)' },
];

/**
 * Converts integer to authentic Ge'ez numeral representation.
 * Ge'ez numerals: ፩ to ፱ (1-9), ፲ to ፺ (10-90), ፻ (100), ፼ (10000).
 */
export function toGeezNumber(num: number): string {
  if (num <= 0) return num.toString();

  const ones = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

  function convertUnder100(n: number): string {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + ones[o];
  }

  if (num < 100) {
    return convertUnder100(num);
  }

  let result = '';
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds === 1) {
    result += '፻';
  } else if (hundreds > 1 && hundreds < 100) {
    result += convertUnder100(hundreds) + '፻';
  } else if (hundreds >= 100) {
    const myriads = Math.floor(hundreds / 100);
    const remHundreds = hundreds % 100;
    result += (myriads === 1 ? '' : convertUnder100(myriads)) + '፼';
    if (remHundreds > 0) {
      result += convertUnder100(remHundreds) + '፻';
    }
  }

  if (remainder > 0) {
    result += convertUnder100(remainder);
  }

  return result;
}

/**
 * Julian Day Number (JDN) calculation for Gregorian Date
 */
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Converts Julian Day Number to Ethiopian Calendar (Beyene-Kudlek)
 */
function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

/**
 * Convert Ethiopian Date to Julian Day Number
 */
export function ethiopianToJDN(year: number, month: number, day: number): number {
  return 1723856 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

/**
 * Convert JDN to Gregorian Date
 */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l1 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l1 + 1)) / 1461001);
  const l2 = l1 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l2) / 2447);
  const day = l2 - Math.floor((2447 * j) / 80);
  const l3 = Math.floor(j / 11);
  const month = j + 2 - 12 * l3;
  const year = 100 * (n - 49) + i + l3;
  return { year, month, day };
}

/**
 * Primary conversion: Gregorian Date -> Ethiopian Date object with rich metadata
 */
export function toEthiopianDate(date: Date = new Date()): EthiopianDate {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const eth = jdnToEthiopian(jdn);

  const monthIdx = Math.max(1, Math.min(13, eth.month)) - 1;
  const monthMeta = ETHIOPIAN_MONTHS[monthIdx];
  const dayOfWeek = date.getDay(); // 0 is Sunday
  const dayMeta = ETHIOPIAN_DAYS[dayOfWeek];

  const geezYear = toGeezNumber(eth.year);
  const geezDay = toGeezNumber(eth.day);

  return {
    year: eth.year,
    month: eth.month,
    day: eth.day,
    monthNameAmharic: monthMeta.amharic,
    monthNameEnglish: monthMeta.english,
    dayNameAmharic: dayMeta.amharic,
    geezYear,
    geezDay,
    formattedAmharic: `${dayMeta.amharic}፣ ${monthMeta.amharic} ${geezDay} ቀን ${geezYear} ዓ.ም`,
    formattedEnglish: `${monthMeta.english} ${eth.day}, ${eth.year} E.C. (${dayMeta.english.split(' ')[0]})`,
  };
}

/**
 * Ethiopian Date -> Gregorian Date
 */
export function fromEthiopianDate(year: number, month: number, day: number): Date {
  const jdn = ethiopianToJDN(year, month, day);
  const greg = jdnToGregorian(jdn);
  return new Date(greg.year, greg.month - 1, greg.day);
}
