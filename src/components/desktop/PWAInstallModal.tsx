import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  X, 
  Sparkles, 
  WifiOff, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Monitor,
  Cable,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  FolderDown,
  RefreshCw
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { generateAndroidUSBPackage, downloadBlob, ANDROID_USB_STEPS } from '../../lib/android-usb-exporter';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'desktop' | 'android' | 'usb' | 'ios';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab
}) => {
  const { isInstallable, isInstalled, isAndroid, isDesktop, isIOS, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'usb' | 'ios'>(
    defaultTab || 'usb'
  );
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [usbDeviceStatus, setUsbDeviceStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await triggerInstall();
      if (success) {
        setInstallStatus('Installation accepted! Application launching in standalone mode.');
      } else {
        setInstallStatus('Install prompt dismissed. You can install at any time via your browser menu.');
      }
    } else {
      setInstallStatus('Native prompt unavailable in this browser context. Follow the guided steps below.');
    }
  };

  const handleDownloadUSBKit = async () => {
    try {
      setIsExportingZip(true);
      setInstallStatus('Generating Android USB Sideload Kit (ADB batch scripts, manifests, and offline launcher)...');
      const blob = await generateAndroidUSBPackage();
      downloadBlob(blob, 'NurulIlmi-Android-USB-Kit.zip');
      setInstallStatus('NurulIlmi-Android-USB-Kit.zip downloaded successfully! Extract and run install-via-usb.bat on Windows or connect via USB.');
    } catch (err) {
      console.error('Failed to generate USB package:', err);
      setInstallStatus('Failed to generate ZIP package. Please use Method A or copy commands manually.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleCheckUSBDevice = async () => {
    if ('usb' in navigator) {
      try {
        setUsbDeviceStatus('Waiting for you to select your connected Android device in the browser prompt...');
        // @ts-expect-error WebUSB API standard check
        const device = await navigator.usb.requestDevice({ filters: [] });
        if (device) {
          setUsbDeviceStatus(`Connected: ${device.productName || 'Android Device'} (${device.manufacturerName || 'Vendor'}). Ready for USB Sideload!`);
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'NotFoundError') {
          setUsbDeviceStatus('No device selected. Please connect your phone with a USB cable and ensure it is unlocked.');
        } else {
          setUsbDeviceStatus(`USB Check info: ${error.message || 'Make sure phone is connected in File Transfer (MTP) mode.'}`);
        }
      }
    } else {
      setUsbDeviceStatus('WebUSB is not supported in this browser. Use ADB or Google Chrome chrome://inspect directly.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Islamic Geometric Gradient */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-0.5 shadow-lg shadow-emerald-900/40 flex items-center justify-center">
                <img src="/icon.svg" alt="Nurul Ilmi Logo" className="w-10 h-10 object-contain rounded-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">Install Nurul Ilmi Suite</h3>
                  {isInstalled && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Installed
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-400/80">
                  نور العلم — Standalone Desktop & Direct USB Android Native Experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Platform Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveTab('usb')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'usb'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                  : 'bg-slate-800/80 text-amber-300 hover:bg-slate-800 hover:text-white border border-amber-500/30'
              }`}
            >
              <Cable className="w-3.5 h-3.5" />
              <span>Direct USB Android Cable</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">NEW</span>
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'desktop'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Desktop (PC / Mac)
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'android'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Wireless Android
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ios'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> iOS / Safari
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
              <Monitor className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Standalone Window</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Runs borderless without browser address bar distractions.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
              <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Offline Availability</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Precached assets, Qur'an data, and offline prayer calculator.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
              <Cable className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Direct USB Sideload</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Install via USB cable using Chrome DevTools, ADB, or MTP drag-and-drop.</p>
              </div>
            </div>
          </div>

          {/* Action Button: One-Click Instant Install if available on current device */}
          {activeTab !== 'usb' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-sm font-bold text-white">Instant One-Click Installation</p>
                </div>
                <p className="text-xs text-slate-300">
                  {isInstallable 
                    ? 'Your browser is ready to install the application instantly.'
                    : 'Click below to prompt native installation on this device.'}
                </p>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                {isInstalled ? 'Reinstall / Launch Standalone' : 'Install Nurul Ilmi App'}
              </button>
            </div>
          )}

          {installStatus && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200">
              {installStatus}
            </div>
          )}

          {/* ===================== TAB: DIRECT USB ANDROID ===================== */}
          {activeTab === 'usb' && (
            <div className="space-y-6">
              {/* Banner for USB Sideload */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Cable className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Direct USB Android Cable Installation Center</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Connect your Android phone to this computer with a standard USB cable to install Nurul Ilmi directly onto your phone without requiring Google Play Store.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadUSBKit}
                    disabled={isExportingZip}
                    className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/60 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>{isExportingZip ? 'Packaging...' : 'Download USB Kit (.zip)'}</span>
                  </button>
                </div>

                {/* USB Diagnostic Button */}
                <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>USB Cable Status:</span>
                    <button
                      onClick={handleCheckUSBDevice}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>Detect USB Phone Connection</span>
                    </button>
                  </div>
                  {usbDeviceStatus && (
                    <span className="text-[11px] text-amber-300 font-medium">{usbDeviceStatus}</span>
                  )}
                </div>
              </div>

              {/* Three Recommended USB Installation Methods */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Select Your Preferred USB Method
                </h5>

                {/* Method 1: Chrome USB DevTools Port Forwarding (Instant Native WebAPK) */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">A</span>
                      <strong className="text-sm font-semibold text-white">Method A (Fastest): Chrome USB Remote Port-Forwarding</strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                      Recommended • No Compile Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Installs a genuine Google-signed native WebAPK directly onto your Android phone via physical USB connection.
                  </p>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <li>Plug your Android phone into this computer with a USB cable.</li>
                    <li>
                      On your phone: Enable <strong className="text-emerald-300">"USB Debugging"</strong> (Settings &rarr; About phone &rarr; tap "Build number" 7 times &rarr; Developer options &rarr; toggle "USB Debugging").
                    </li>
                    <li>
                      On this computer's Google Chrome, open a new tab and enter:
                      <div className="flex items-center gap-2 my-1">
                        <code className="px-2 py-1 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] border border-slate-700">
                          chrome://inspect/#devices
                        </code>
                        <button
                          onClick={() => handleCopy('chrome://inspect/#devices', 'chrome-inspect')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Copy address"
                        >
                          {copiedCmd === 'chrome-inspect' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </li>
                    <li>
                      Click <strong className="text-white">"Port forwarding..."</strong>, set Port to <strong className="text-emerald-400">3000</strong> and IP to <strong className="text-emerald-400">localhost:3000</strong>, check <strong className="text-white">"Enable port forwarding"</strong>.
                    </li>
                    <li>
                      On your connected phone's Chrome browser, visit <code className="text-amber-300">localhost:3000</code> or this app URL. Tap menu <strong className="text-white">(⋮)</strong> &rarr; <strong className="text-emerald-400">"Install app"</strong>.
                    </li>
                  </ol>
                </div>

                {/* Method 2: ADB Sideload Command Line (1-Click Batch Script) */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-xs">B</span>
                      <strong className="text-sm font-semibold text-white">Method B: One-Click ADB Command Line USB Install</strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                      Windows / Mac / Linux
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Use our pre-packaged batch installer or run standard Android Debug Bridge commands:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-200 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-amber-400" /> Command Line:</span>
                        <button
                          onClick={() => handleCopy('adb devices\nadb reverse tcp:3000 tcp:3000\nadb shell am start -a android.intent.action.VIEW -d "http://localhost:3000"', 'adb-cmd')}
                          className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300"
                        >
                          {copiedCmd === 'adb-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCmd === 'adb-cmd' ? 'Copied' : 'Copy ADB Commands'}</span>
                        </button>
                      </div>
                      <div className="text-slate-400"># 1. Verify USB device is detected:</div>
                      <div className="text-emerald-400">adb devices</div>
                      <div className="text-slate-400"># 2. Pipe local port over USB wire to phone:</div>
                      <div className="text-emerald-400">adb reverse tcp:3000 tcp:3000</div>
                      <div className="text-slate-400"># 3. Launch and trigger standalone app install on Android:</div>
                      <div className="text-emerald-400">adb shell am start -a android.intent.action.VIEW -d "http://localhost:3000"</div>
                    </div>
                  </div>
                </div>

                {/* Method 3: USB Drag & Drop File Transfer (MTP) */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 flex items-center justify-center font-bold text-xs">C</span>
                      <strong className="text-sm font-semibold text-white">Method C: MTP File Transfer (Drag & Drop via USB)</strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                      No Terminal Needed
                    </span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <li>Connect phone via USB. On phone pull down top shade &rarr; select <strong className="text-white">"File Transfer" (MTP)</strong>.</li>
                    <li>On PC, open your phone's drive &rarr; navigate to <strong className="text-emerald-300">Internal storage &rarr; Download</strong> folder.</li>
                    <li>
                      Download and copy the <strong className="text-white">NurulIlmi-USB-Launcher.html</strong> from the kit into your phone's Download folder.
                    </li>
                    <li>On your phone, open the <strong className="text-white">"Files"</strong> or "My Files" app &rarr; Downloads &rarr; tap the file to install.</li>
                  </ol>
                </div>
              </div>

              {/* Step Checklist */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Important Android Troubleshooting Tips</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-slate-200 block mb-0.5">Phone says "Unauthorized":</strong>
                    Unlock phone screen and tap "Always allow from this computer" &rarr; "Allow".
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-slate-200 block mb-0.5">Charge-only mode:</strong>
                    Ensure your USB cable supports data transfer (some cheap cables are charge-only).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: DESKTOP ===================== */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Laptop className="w-4 h-4" /> How to install on Desktop (Windows, macOS, Linux)
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-white">Option A: Address Bar Install Icon:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Look at the right end of your browser's address bar (URL bar). Click the small <span className="text-emerald-400 font-semibold">[⨁ Install]</span> or computer monitor icon and click <span className="text-white font-semibold">"Install"</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-white">Option B: Google Chrome Menu:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Click the three-dots menu <span className="text-white font-semibold">(⋮)</span> at top right &rarr; select <span className="text-white font-semibold">"Cast, save, and share"</span> (or "Save and share") &rarr; click <span className="text-emerald-400 font-semibold">"Install Nurul Ilmi Series..."</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-white">Option C: Microsoft Edge Menu:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Click the three-dots menu <span className="text-white font-semibold">(...)</span> &rarr; select <span className="text-white font-semibold">"Apps"</span> &rarr; click <span className="text-emerald-400 font-semibold">"Install Nurul Ilmi Desktop as an app"</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: WIRELESS ANDROID ===================== */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> How to install on Android (Wireless / Google Chrome)
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-white">Open in Google Chrome on your Phone:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Open this URL in Google Chrome or Samsung Internet on your Android mobile device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-white">Tap Chrome Menu:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Tap the three vertical dots <span className="text-white font-semibold">(⋮)</span> at the top-right corner of Chrome.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-white">Tap "Install app" or "Add to Home screen":</strong>
                    <p className="text-slate-400 mt-0.5">
                      Tap <span className="text-emerald-400 font-semibold">"Install app"</span> (or "Add to Home screen"). Confirm the prompt. The app will be placed directly on your Android home screen and app drawer with the Nurul Ilmi icon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: IOS ===================== */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> How to install on Apple iOS (iPhone & iPad)
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-white">Open in Safari:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Apple iOS requires Safari for Home Screen PWA installation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-white">Tap the Share Button:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Tap the <span className="text-white font-semibold">Share icon [↑]</span> located at the bottom toolbar in Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-white">Select "Add to Home Screen":</strong>
                    <p className="text-slate-400 mt-0.5">
                      Scroll down the share sheet and tap <span className="text-emerald-400 font-semibold">"Add to Home Screen"</span> &rarr; tap <span className="text-white font-semibold">"Add"</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PWA & USB Sideload Verified • Sandboxed Storage • Offline Precached</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
