import React, { useState } from 'react';
import { Download, CheckCircle2, Laptop, Smartphone, WifiOff, Cable } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner' | 'header-usb';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, triggerInstall } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [targetTab, setTargetTab] = useState<'desktop' | 'android' | 'usb' | 'ios'>('usb');

  const handleOpenModal = (tab: 'desktop' | 'android' | 'usb' | 'ios' = 'usb') => {
    setTargetTab(tab);
    setModalOpen(true);
  };

  const handleClick = async () => {
    if (isInstallable) {
      const res = await triggerInstall();
      if (!res) {
        handleOpenModal('usb');
      }
    } else {
      handleOpenModal('usb');
    }
  };

  if (variant === 'header-usb') {
    return (
      <>
        <button
          onClick={() => handleOpenModal('usb')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/70 border border-amber-600/50 hover:border-amber-400 text-xs text-amber-300 hover:text-amber-100 transition shadow-sm"
          title="Install directly to Android Phone via USB Cable or ADB"
        >
          <Cable className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">USB Android</span>
        </button>
        <PWAInstallModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          defaultTab={targetTab} 
        />
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="space-y-1.5">
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 hover:from-emerald-900/60 transition group text-xs font-semibold shadow-sm"
          title="Install desktop or Android application"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="leading-tight text-white font-medium">Install App</p>
              <p className="text-[10px] text-emerald-400/80 font-normal">Desktop & Android</p>
            </div>
          </div>
          {isInstalled ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PWA
            </span>
          )}
        </button>

        {/* Dedicated Direct USB button */}
        <button
          onClick={() => handleOpenModal('usb')}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-950/50 hover:border-amber-400 transition text-[11px] font-medium"
          title="Direct USB Cable & ADB Sideload for Android"
        >
          <div className="flex items-center gap-2">
            <Cable className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct USB Android</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono">
            ADB
          </span>
        </button>

        <PWAInstallModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          defaultTab={targetTab} 
        />
      </div>
    );
  }

  // Header variant
  return (
    <>
      <button
        onClick={() => handleOpenModal('usb')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
          isInstalled
            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/40'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
        }`}
        title="Install Nurul Ilmi on Desktop, or directly via USB to Android"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isInstalled ? 'App Installed' : 'Install App'}
        </span>
      </button>

      <PWAInstallModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultTab={targetTab} 
      />
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 border border-amber-400/40 px-3.5 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <WifiOff className="w-4 h-4 animate-bounce" />
      <span>Offline Mode — Institutional cached data active</span>
    </div>
  );
};
