/**
 * Module: Real-time Prayer Time Tracker & Solar Astronomical Engine
 * Al-Furqan Quran & Hadith Academy
 * Calculates daily Salah times based on Addis Ababa coordinates (9.025° N, 38.747° E)
 * or device location via the Geolocation API with live countdown and Azan chime.
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
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  calculatePrayerTimes,
  playAzanChime,
  ADDIS_ABABA_CONFIG,
  PrayerCalculationConfig,
  calculateQiblaBearing,
} from '../../lib/prayer';

export const PrayerEngineModule: React.FC = () => {
  const [config, setConfig] = useState<PrayerCalculationConfig>(ADDIS_ABABA_CONFIG);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isChimeTesting, setIsChimeTesting] = useState(false);
  const [locationMode, setLocationMode] = useState<'DEFAULT' | 'GPS'>('DEFAULT');
  const [locationStatus, setLocationStatus] = useState<string>('Addis Ababa (Grand Anwar Mosque)');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Live second-by-second clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation API is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setConfig(prev => ({
          ...prev,
          latitude,
          longitude,
          elevationMeters: altitude || 2355,
        }));
        setLocationMode('GPS');
        setLocationStatus(`GPS Device Position (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError(`Could not access GPS (${err.message}). Using Addis Ababa coordinates.`);
        setIsLocating(false);
        setLocationMode('DEFAULT');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleResetToDefault = () => {
    setConfig(ADDIS_ABABA_CONFIG);
    setLocationMode('DEFAULT');
    setLocationStatus('Addis Ababa (Grand Anwar Mosque)');
    setLocationError(null);
  };

  const prayerResult = calculatePrayerTimes(currentTime, config);
  const qiblaDeg = calculateQiblaBearing(config.latitude, config.longitude);

  // Exact second countdown calculation
  const nextTarget = prayerResult.nextPrayer?.dateObj;
  let remainingSec = 0;
  if (nextTarget) {
    let diff = nextTarget.getTime() - currentTime.getTime();
    if (diff < 0) diff += 24 * 3600 * 1000;
    remainingSec = Math.floor(diff / 1000);
  }
  const hours = Math.floor(remainingSec / 3600);
  const minutes = Math.floor((remainingSec % 3600) / 60);
  const seconds = remainingSec % 60;
  const liveCountdownStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleTestChime = () => {
    playAzanChime();
    setIsChimeTesting(true);
    setTimeout(() => setIsChimeTesting(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="card-saas p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5 text-[#C49A45]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#17365D] tracking-tight">Real-Time Prayer Time Tracker</h1>
                <span className="font-arabic text-[#16836B] font-bold text-lg">مواقيت الصلاة الفلكية</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Al-Furqan Quran & Hadith Academy · Live solar calculation engine for Addis Ababa & device GPS.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Asr Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Geolocation Button */}
          {locationMode === 'DEFAULT' ? (
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 text-[#1E40AF] border border-blue-200 text-xs font-semibold transition"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Detect My Location'}</span>
            </button>
          ) : (
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Addis Ababa</span>
            </button>
          )}

          {/* Asr Calculation Method */}
          <div className="flex items-center bg-[#F5F7FA] border border-slate-200 rounded-lg p-1 text-xs">
            <button
              onClick={() => setConfig(prev => ({ ...prev, asrMethod: 'shafi' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                config.asrMethod === 'shafi'
                  ? 'bg-[#16836B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shafi / Std (1x)
            </button>
            <button
              onClick={() => setConfig(prev => ({ ...prev, asrMethod: 'hanafi' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                config.asrMethod === 'hanafi'
                  ? 'bg-[#C49A45] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hanafi (2x)
            </button>
          </div>
        </div>
      </div>

      {/* Geolocation Status Alert if any */}
      {locationError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Main Real-Time Prayer Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#17365D] via-[#102642] to-[#16836B] text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-6 -bottom-6 font-arabic text-9xl text-white/5 select-none pointer-events-none">
          الصلاة
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#16836B] text-white font-bold uppercase tracking-wider shadow-sm">
                Next Impending Prayer
              </span>
              <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C49A45]" />
                {locationStatus}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <h2 className="text-4xl font-extrabold tracking-tight text-white">
                {prayerResult.nextPrayer?.nameEnglish}
              </h2>
              <span className="font-arabic text-3xl text-[#C49A45] font-bold">
                {prayerResult.nextPrayer?.nameArabic}
              </span>
            </div>

            <div className="text-sm text-slate-200">
              Astronomical Adhan Call:{' '}
              <span className="font-mono text-[#C49A45] font-bold text-lg bg-black/20 px-2.5 py-0.5 rounded">
                {prayerResult.nextPrayer?.timeString}
              </span>
              <span className="text-xs text-slate-300 ml-2">East Africa Time (UTC+3)</span>
            </div>
          </div>

          {/* Right: Live Second-by-Second Countdown */}
          <div className="flex items-center gap-6 bg-black/25 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-right">
              <div className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                Countdown to Adhan
              </div>
              <div className="text-4xl font-extrabold text-[#C49A45] font-mono tracking-tight mt-0.5">
                {liveCountdownStr}
              </div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">
                {prayerResult.countdownFormatted} remaining
              </div>
            </div>

            <button
              onClick={handleTestChime}
              className={`p-3 rounded-xl border transition-all ${
                isChimeTesting
                  ? 'bg-[#C49A45] text-slate-900 border-[#C49A45] scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              title="Test Azan Web Audio Chime"
            >
              <Volume2 className="w-6 h-6 text-[#C49A45]" />
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Full Timetable & Qibla Bearing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timetable List (8 Cols) */}
        <div className="lg:col-span-8 card-saas p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16836B]" />
              <h3 className="font-bold text-sm text-[#17365D]">Daily Astronomical Prayer Timetable</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Coordinates: {config.latitude.toFixed(3)}° N, {config.longitude.toFixed(3)}° E
            </span>
          </div>

          <div className="space-y-2">
            {prayerResult.prayers.map(prayer => (
              <div
                key={prayer.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  prayer.isNext
                    ? 'bg-[#EFF6FF] border-[#17365D] shadow-sm text-[#17365D]'
                    : prayer.passed
                    ? 'bg-[#F8FAFC] border-slate-100 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      prayer.isNext
                        ? 'bg-[#17365D] text-white shadow-sm'
                        : 'bg-[#F1F5F9] text-slate-500'
                    }`}
                  >
                    {prayer.id === 'fajr' || prayer.id === 'sunrise' ? (
                      <Sun className="w-4 h-4 text-[#C49A45]" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#16836B]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span>{prayer.nameEnglish}</span>
                      <span className="font-arabic text-[#16836B] text-xs font-semibold">{prayer.nameArabic}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {prayer.id === 'fajr'
                        ? '18° Solar Depression (Muslim World League)'
                        : prayer.id === 'sunrise'
                        ? 'Altitude -0.833° with 2355m plateau elevation dip'
                        : prayer.id === 'dhuhr'
                        ? 'Solar Noon / Meridian Transit'
                        : prayer.id === 'asr'
                        ? `${config.asrMethod === 'hanafi' ? 'Hanafi (Double shadow)' : 'Shafi / Standard (Single shadow)'}`
                        : prayer.id === 'maghrib'
                        ? 'Geometric sunset at horizon'
                        : prayer.id === 'isha'
                        ? '17° Twilight angle (MWL standard)'
                        : 'Last one-third of the night'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold text-sm ${
                    prayer.isNext ? 'text-[#17365D] text-base' : 'text-slate-800'
                  }`}>
                    {prayer.timeString}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    {prayer.isNext ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#17365D] font-bold">
                        Next Salah
                      </span>
                    ) : prayer.passed ? (
                      <span className="text-slate-400">Passed</span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Compass & Location Diagnostics (4 Cols) */}
        <div className="lg:col-span-4 card-saas p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-[#C49A45]" />
            <h3 className="font-bold text-sm text-[#17365D]">Qibla Direction (to Ka’bah)</h3>
          </div>

          {/* Dial Visualization */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 rounded-full border-4 border-slate-200 bg-[#F8FAFC] flex items-center justify-center shadow-inner">
              {/* Compass Cardinal Points */}
              <span className="absolute top-2 text-[10px] font-bold text-rose-500 font-mono">N</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 font-mono">S</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-400 font-mono">W</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-400 font-mono">E</span>

              {/* Ka'bah Pointer Arrow */}
              <div
                className="absolute w-1.5 h-20 bg-gradient-to-t from-transparent via-[#C49A45] to-[#16836B] rounded-full origin-bottom"
                style={{
                  transform: `translateY(-50%) rotate(${qiblaDeg}deg)`,
                }}
              />

              {/* Ka'bah Center Symbol */}
              <div className="w-9 h-9 rounded-xl bg-[#17365D] border-2 border-[#C49A45] flex items-center justify-center text-sm shadow-md z-10">
                🕋
              </div>
            </div>

            <div className="text-center mt-3">
              <div className="font-mono font-extrabold text-xl text-[#17365D]">
                {qiblaDeg.toFixed(1)}° True North
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                North-Northwest (NNW) towards Mecca al-Mukarramah
              </div>
            </div>
          </div>

          {/* Coordinates Summary */}
          <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-[#17365D]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16836B]" />
                <span>Station Coordinates:</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                {locationMode}
              </span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Latitude:</span>
              <span className="font-bold text-slate-800">{config.latitude.toFixed(4)}° N</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Longitude:</span>
              <span className="font-bold text-slate-800">{config.longitude.toFixed(4)}° E</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Plateau Elevation:</span>
              <span className="font-bold text-slate-800">{Math.round(config.elevationMeters)}m ASL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
