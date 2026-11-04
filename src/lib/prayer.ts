/**
 * Solar Astronomical Prayer Engine calibrated for Chiro Town, Eastern Oromia, Ethiopia
 * Coordinates: Latitude 9.083° N, Longitude 40.867° E, Timezone UTC+3 (East Africa Time)
 * Elevation: ~1,826 meters above sea level
 * Convention: Muslim World League (MWL) with Shafi / Hanafi Asr calculation options
 */

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'qiyam';
  nameEnglish: string;
  nameArabic: string;
  timeString: string;
  dateObj: Date;
  passed: boolean;
  isNext: boolean;
}

export interface PrayerCalculationConfig {
  latitude: number;
  longitude: number;
  timeZoneOffset: number; // +3 for EAT
  elevationMeters: number;
  fajrAngle: number;       // 18° MWL
  ishaAngle: number;       // 17° MWL
  asrMethod: 'shafi' | 'hanafi'; // 1 vs 2 shadow multiplier
}

export const CHIRO_TOWN_CONFIG: PrayerCalculationConfig = {
  latitude: 9.0833,
  longitude: 40.8667,
  timeZoneOffset: 3,
  elevationMeters: 1826,
  fajrAngle: 18,
  ishaAngle: 17,
  asrMethod: 'shafi',
};

// Backwards-compatibility alias
export const ADDIS_ABABA_CONFIG = CHIRO_TOWN_CONFIG;

// Ka'bah coordinates in Mecca
const MECCA_LAT = 21.422487;
const MECCA_LNG = 39.826206;

/**
 * Calculates Qibla direction in degrees from true North
 */
export function calculateQiblaBearing(lat = ADDIS_ABABA_CONFIG.latitude, lng = ADDIS_ABABA_CONFIG.longitude): number {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (MECCA_LAT * Math.PI) / 180;
  const deltaLambda = ((MECCA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  return (qibla + 360) % 360;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Computes solar position and prayer timetable for a given date
 */
export function calculatePrayerTimes(
  targetDate: Date = new Date(),
  config: PrayerCalculationConfig = ADDIS_ABABA_CONFIG
): {
  prayers: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  countdownMinutes: number;
  countdownFormatted: string;
  qiblaBearing: number;
} {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  // Day of year
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((targetDate.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Approximate Sun declination & Equation of Time
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // minutes
  const declination = 23.45 * Math.sin(toRadians((360 / 365) * (dayOfYear - 81))); // degrees

  // Solar Noon in local time (Chiro Town, Eastern Oromia UTC+3, standard meridian 45° E)
  const standardMeridian = config.timeZoneOffset * 15;
  const longitudeDifference = (standardMeridian - config.longitude) * 4; // minutes
  const solarNoonMinutes = 12 * 60 + longitudeDifference - eot;

  const latRad = toRadians(config.latitude);
  const decRad = toRadians(declination);

  // Elevation correction for sunrise/sunset (refraction + elevation dip)
  const dip = 0.0347 * Math.sqrt(config.elevationMeters);
  const sunriseSunAltitude = -(0.833 + dip);

  function getHourAngle(altitudeDegrees: number): number {
    const altRad = toRadians(altitudeDegrees);
    const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return toDegrees(Math.acos(cosHA));
  }

  const sunriseHA = getHourAngle(sunriseSunAltitude);
  const sunriseMinutes = solarNoonMinutes - sunriseHA * 4;
  const sunsetMinutes = solarNoonMinutes + sunriseHA * 4;

  const fajrHA = getHourAngle(-config.fajrAngle);
  const fajrMinutes = solarNoonMinutes - fajrHA * 4;

  const ishaHA = getHourAngle(-config.ishaAngle);
  const ishaMinutes = solarNoonMinutes + ishaHA * 4;

  // Asr altitude calculation:
  // shadow factor = 1 (Shafi/Maliki/Hanbali) or 2 (Hanafi)
  const shadowMultiplier = config.asrMethod === 'hanafi' ? 2 : 1;
  const noonShadow = Math.tan(Math.abs(latRad - decRad));
  const asrAltitude = toDegrees(Math.atan(1 / (shadowMultiplier + noonShadow)));
  const asrHA = getHourAngle(asrAltitude);
  const asrMinutes = solarNoonMinutes + asrHA * 4;

  // Qiyam (Last 1/3rd of the night: between Maghrib and Fajr next morning)
  // Approximate length of night ~ (24*60 - (sunset - fajr))
  const nightDuration = 24 * 60 - sunsetMinutes + fajrMinutes;
  const qiyamMinutes = (sunsetMinutes + (2 / 3) * nightDuration) % (24 * 60);

  function minutesToDate(mins: number): Date {
    const d = new Date(targetDate);
    const normalized = (mins + 24 * 60) % (24 * 60);
    const h = Math.floor(normalized / 60);
    const m = Math.floor(normalized % 60);
    d.setHours(h, m, 0, 0);
    return d;
  }

  function formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  const fajrDate = minutesToDate(fajrMinutes);
  const sunriseDate = minutesToDate(sunriseMinutes);
  const dhuhrDate = minutesToDate(solarNoonMinutes);
  const asrDate = minutesToDate(asrMinutes);
  const maghribDate = minutesToDate(sunsetMinutes);
  const ishaDate = minutesToDate(ishaMinutes);
  const qiyamDate = minutesToDate(qiyamMinutes);

  const rawList: Omit<PrayerTimeItem, 'passed' | 'isNext'>[] = [
    { id: 'fajr', nameEnglish: 'Fajr', nameArabic: 'الفجر', timeString: formatTime(fajrDate), dateObj: fajrDate },
    { id: 'sunrise', nameEnglish: 'Sunrise', nameArabic: 'الشروق', timeString: formatTime(sunriseDate), dateObj: sunriseDate },
    { id: 'dhuhr', nameEnglish: 'Dhuhr', nameArabic: 'الظهر', timeString: formatTime(dhuhrDate), dateObj: dhuhrDate },
    { id: 'asr', nameEnglish: `Asr (${config.asrMethod === 'hanafi' ? 'Hanafi' : 'Shafi/Standard'})`, nameArabic: 'العصر', timeString: formatTime(asrDate), dateObj: asrDate },
    { id: 'maghrib', nameEnglish: 'Maghrib', nameArabic: 'المغرب', timeString: formatTime(maghribDate), dateObj: maghribDate },
    { id: 'isha', nameEnglish: 'Isha', nameArabic: 'العشاء', timeString: formatTime(ishaDate), dateObj: ishaDate },
    { id: 'qiyam', nameEnglish: 'Qiyam (Tahajjud)', nameArabic: 'قيام الليل', timeString: formatTime(qiyamDate), dateObj: qiyamDate },
  ];

  const now = new Date();
  let nextFound = false;

  const prayers: PrayerTimeItem[] = rawList.map(item => {
    const passed = now > item.dateObj;
    let isNext = false;
    if (!passed && !nextFound) {
      isNext = true;
      nextFound = true;
    }
    return {
      ...item,
      passed,
      isNext,
    };
  });

  let nextPrayer = prayers.find(p => p.isNext) || prayers[0]; // If all passed, next is Fajr tomorrow
  let diffMs = nextPrayer.dateObj.getTime() - now.getTime();
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000; // Tomorrow's prayer
  }

  const countdownMinutes = Math.floor(diffMs / 60000);
  const hoursLeft = Math.floor(countdownMinutes / 60);
  const minsLeft = countdownMinutes % 60;
  const countdownFormatted = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;

  return {
    prayers,
    nextPrayer,
    countdownMinutes,
    countdownFormatted,
    qiblaBearing: calculateQiblaBearing(),
  };
}

/**
 * Web Audio API gentle synthesizer chime for Azan notification
 */
export function playAzanChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const tones = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 melodic chord

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 1.25);
    });
  } catch (err) {
    console.warn('Web Audio chime could not play:', err);
  }
}
