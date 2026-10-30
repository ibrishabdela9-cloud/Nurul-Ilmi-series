/**
 * Module 2: Prayer Timings Engine
 * Solar astronomical calculation engine calibrated for Addis Ababa (9.032° N, 38.747° E)
 * using MWL conventions, Shafi/Hanafi Asr options, live Azan countdowns, and Qibla compass.
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  MapPin,
  Settings,
} from 'lucide-react';
import {
  calculatePrayerTimes,
  playAzanChime,
  ADDIS_ABABA_CONFIG,
  PrayerCalculationConfig,
} from '../../lib/prayer';

export const PrayerEngineModule: React.FC = () => {
  const [config, setConfig] = useState<PrayerCalculationConfig>(ADDIS_ABABA_CONFIG);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isChimeTesting, setIsChimeTesting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerResult = calculatePrayerTimes(currentTime, config);

  const handleTestChime = () => {
    playAzanChime();
    setIsChimeTesting(true);
    setTimeout(() => setIsChimeTesting(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Solar Astronomical Prayer Engine</h1>
            <span className="font-arabic text-amber-300 text-lg">مواقيت الصلاة الفلكية</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated for Addis Ababa (9.032° N, 38.747° E · 2,355m Elevation · UTC+3 EAT) via Muslim World League convention.
          </p>
        </div>

        {/* Shafi vs Hanafi Asr Method Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <span className="text-[11px] text-slate-400 pl-2">Asr Method:</span>
          <button
            onClick={() => setConfig(prev => ({ ...prev, asrMethod: 'shafi' }))}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              config.asrMethod === 'shafi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shafi / Standard (1x)
          </button>
          <button
            onClick={() => setConfig(prev => ({ ...prev, asrMethod: 'hanafi' }))}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              config.asrMethod === 'hanafi'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hanafi (2x Shadow)
          </button>
        </div>
      </div>

      {/* Main Countdown Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-700/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-4 bottom-2 opacity-10 font-arabic text-9xl text-amber-400 select-none pointer-events-none">
          الصلاة
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700 text-emerald-300 font-semibold uppercase tracking-wider">
                Next Impending Prayer Call
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentTime.toLocaleTimeString()} EAT
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {prayerResult.nextPrayer?.nameEnglish}
              </h2>
              <span className="font-arabic text-2xl text-amber-300 font-bold">
                {prayerResult.nextPrayer?.nameArabic}
              </span>
            </div>

            <div className="text-xs text-slate-300">
              Astronomical Adhan scheduled for:{' '}
              <span className="font-mono text-emerald-300 font-bold text-sm">
                {prayerResult.nextPrayer?.timeString}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Time Remaining</div>
              <div className="text-4xl font-extrabold text-amber-300 font-mono tracking-tight animate-pulse">
                {prayerResult.countdownFormatted}
              </div>
            </div>

            <button
              onClick={handleTestChime}
              className={`p-3 rounded-xl border transition-all ${
                isChimeTesting
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-slate-900/90 text-emerald-400 border-emerald-800 hover:border-emerald-600'
              }`}
              title="Test Azan Web Audio Tone"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Timetable Cards & Qibla Compass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full Timetable (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Full Astronomical Solar Schedule</span>
            </span>
            <span className="text-slate-400 font-mono">
              Addis Ababa (9.032° N, 38.747° E)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {prayerResult.prayers.map(prayer => (
              <div
                key={prayer.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  prayer.isNext
                    ? 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-600 shadow-md text-white'
                    : prayer.passed
                    ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      prayer.isNext ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {prayer.id === 'fajr' || prayer.id === 'sunrise' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-teal-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>{prayer.nameEnglish}</span>
                      <span className="font-arabic text-amber-300 text-xs">{prayer.nameArabic}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {prayer.id === 'fajr'
                        ? '18° Solar Depression (MWL)'
                        : prayer.id === 'sunrise'
                        ? 'Altitude -0.833° with 2355m elevation dip'
                        : prayer.id === 'dhuhr'
                        ? 'Solar Zenith Meridian Crossing'
                        : prayer.id === 'asr'
                        ? `${config.asrMethod === 'hanafi' ? 'Double shadow length' : 'Single shadow length'}`
                        : prayer.id === 'maghrib'
                        ? 'Geometric sunset'
                        : prayer.id === 'isha'
                        ? '17° Twilight angle (MWL)'
                        : 'Last 1/3rd of the night'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-100">
                    {prayer.timeString}
                  </div>
                  <div className="text-[10px]">
                    {prayer.isNext ? (
                      <span className="text-amber-400 font-semibold">Incoming</span>
                    ) : prayer.passed ? (
                      <span className="text-slate-500">Concluded</span>
                    ) : (
                      <span className="text-emerald-400">Scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Compass & Geolocation Info (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="font-bold text-sm text-slate-100 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Qibla Direction (Addis Ababa → Ka’bah)</span>
          </div>

          {/* Compass Visualizer Dial */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
              {/* Compass markings */}
              <span className="absolute top-2 text-[10px] font-bold text-rose-400 font-mono">N</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-500 font-mono">S</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-500 font-mono">W</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-500 font-mono">E</span>

              {/* Ka'bah pointer line */}
              <div
                className="absolute w-1 h-20 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 rounded-full origin-bottom"
                style={{
                  transform: `translateY(-50%) rotate(${prayerResult.qiblaBearing}deg)`,
                }}
              />

              {/* Ka'bah symbol */}
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/80 flex items-center justify-center text-[10px] text-amber-300 font-bold z-10 shadow-lg">
                🕋
              </div>
            </div>

            <div className="text-center mt-3">
              <div className="font-mono font-extrabold text-lg text-amber-300">
                {prayerResult.qiblaBearing.toFixed(1)}° True North
              </div>
              <div className="text-[11px] text-slate-400">
                North-Northwest (NNW) towards Mecca
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Station Coordinates:</span>
            </div>
            <div>Latitude: 9.0320° N</div>
            <div>Longitude: 38.7470° E</div>
            <div>Elevation: 2,355 meters (High Plateau)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
