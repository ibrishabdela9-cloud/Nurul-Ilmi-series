/**
 * Android USB Sideload & Installation Kit Exporter
 * Generates ready-to-transfer Android assets, ADB 1-click batch scripts,
 * native AndroidManifest.xml, MainActivity.java WebView wrapper, and
 * offline USB installation packages.
 */

import JSZip from 'jszip';

export interface USBInstallStep {
  step: number;
  title: string;
  description: string;
  details: string[];
  badge?: string;
  cmd?: string;
}

export const ANDROID_USB_STEPS: USBInstallStep[] = [
  {
    step: 1,
    title: 'Connect Android Phone via USB Cable',
    description: 'Physically connect your Android device to your PC/Mac using a reliable USB-C or Micro-USB cable.',
    details: [
      'Unlock your Android phone screen.',
      'Swipe down the top notification shade on your phone.',
      'Tap "Charging this device via USB" and change mode to "File Transfer" (MTP).',
      'Your phone will now appear in Windows Explorer or macOS Android File Transfer as a drive.'
    ],
    badge: 'Hardware Step'
  },
  {
    step: 2,
    title: 'Enable USB Debugging (For ADB / Developer Mode)',
    description: 'Allows your PC to install and control Android packages directly over the USB wire without touch confirmations.',
    details: [
      'On Android: Open Settings > About Phone.',
      'Tap "Build number" 7 times rapidly until it says "You are now a developer!".',
      'Go back to Settings > System (or Additional Settings) > Developer Options.',
      'Toggle ON "USB Debugging".',
      'When prompted on phone screen: Check "Always allow from this computer" and tap "Allow".'
    ],
    badge: 'Developer Setting'
  },
  {
    step: 3,
    title: 'Choose Your Direct USB Installation Method',
    description: 'Select either Method A (Instant Chrome USB Sideload) or Method B (ADB Command Line) or Method C (MTP File Drag-and-Drop).',
    details: [
      'Method A (Easiest - Chrome USB Remote): On PC Chrome, open chrome://inspect/#devices. Forward port 3000 to localhost:3000. On phone Chrome, open localhost:3000 and tap "Install App" to build native WebAPK.',
      'Method B (ADB Sideload): Download our USB Kit below, open terminal in the folder, and run: adb install -r NurulIlmi.apk (or run install-via-usb.bat).',
      'Method C (USB Drag & Drop): Copy NurulIlmi-Offline-Launcher.html or APK into your phone\'s "Download" folder over USB, open Files app on phone, and install.'
    ],
    badge: 'Installation'
  }
];

export async function generateAndroidUSBPackage(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Windows 1-Click ADB Installer Batch Script
  const batScript = `@echo off
title Nurul Ilmi - Direct Android USB Installer
color 0A
echo ===============================================================
echo      NURUL ILMI SERIES (نور العلم) - ANDROID USB INSTALLER
echo      Integrated Qur'an Hifz & Financial Desktop/Mobile Suite
echo ===============================================================
echo.
echo [1/4] Checking ADB connection to Android phone via USB...
adb devices
echo.
echo If your device says "unauthorized", check your phone screen
echo and tap "Always allow from this computer" -> "Allow".
echo.
pause

echo.
echo [2/4] Verifying USB connection...
adb get-state >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No authorized Android device detected via USB!
    echo Please make sure:
    echo  1. USB cable is firmly connected.
    echo  2. USB Debugging is turned ON in Developer Options.
    echo  3. You accepted the prompt on your phone screen.
    echo.
    pause
    exit /b 1
)

echo [OK] Android device detected via USB!
echo.
echo [3/4] Launching Direct USB Chrome WebAPK Minting & Sideload...
echo Forwarding port 3000 to mobile device over USB cable...
adb reverse tcp:3000 tcp:3000
echo.
echo Opening Nurul Ilmi on Android device...
adb shell am start -a android.intent.action.VIEW -d "http://localhost:3000"
echo.
echo [4/4] Installation Ready!
echo On your phone screen, Google Chrome has opened Nurul Ilmi.
echo Tap the top-right menu (three dots) -> Tap "Install app" or "Add to Home screen".
echo Android will generate and install the native standalone APK on your device!
echo.
pause
`;
  zip.file('install-via-usb.bat', batScript);

  // 2. macOS & Linux Shell Script
  const shScript = `#!/bin/bash
# Nurul Ilmi - Direct Android USB Installer (macOS & Linux)
echo "==============================================================="
echo "     NURUL ILMI SERIES (نور العلم) - ANDROID USB INSTALLER"
echo "==============================================================="
echo ""
echo "[1/3] Checking connected Android devices via USB..."
adb devices
echo ""
echo "Forwarding local port to Android device over USB cable..."
adb reverse tcp:3000 tcp:3000
echo ""
echo "Launching Nurul Ilmi application on Android device..."
adb shell am start -a android.intent.action.VIEW -d "http://localhost:3000"
echo ""
echo "Done! Tap 'Install app' on your phone to install standalone APK."
`;
  zip.file('install-via-usb.sh', shScript);

  // 3. AndroidManifest.xml for native Android Studio / Capacitor build
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nurulilmi.madrasah"
    android:versionCode="100"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Nurul Ilmi (نور العلم)"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  zip.file('android-project/AndroidManifest.xml', androidManifest);

  // 4. Native MainActivity.java (WebView wrapper with full offline caching and hardware acceleration)
  const mainActivityJava = `package com.nurulilmi.madrasah;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Fullscreen immersive experience
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        mWebView.setWebViewClient(new WebViewClient());
        mWebView.setWebChromeClient(new WebChromeClient());

        // Connect to local or packaged PWA
        mWebView.loadUrl("https://ais-pre-w3ocrwn4nqhbbwci3evsol-985236048210.europe-west2.run.app/");
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`;
  zip.file('android-project/MainActivity.java', mainActivityJava);

  // 5. Capacitor Config
  const capacitorConfig = {
    appId: 'com.nurulilmi.madrasah',
    appName: 'Nurul Ilmi Series',
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
      androidScheme: 'https',
      cleartext: true
    },
    android: {
      allowMixedContent: true,
      backgroundColor: '#020617'
    }
  };
  zip.file('capacitor.config.json', JSON.stringify(capacitorConfig, null, 2));

  // 6. Direct USB Offline HTML Launcher (can be dragged & dropped via USB into phone's Download folder)
  const offlineLauncherHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nurul Ilmi - USB Android Quick Launcher</title>
  <style>
    body {
      background: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .card {
      background: #0f172a;
      border: 1px solid #059669;
      border-radius: 16px;
      padding: 24px;
      max-width: 420px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    h1 { color: #10b981; font-size: 22px; margin-bottom: 8px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
    .btn {
      display: block;
      background: linear-gradient(135deg, #059669, #10b981);
      color: white;
      text-decoration: none;
      font-weight: bold;
      padding: 14px 20px;
      border-radius: 10px;
      margin-top: 20px;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 40px; margin-bottom: 12px;">🕌</div>
    <h1>Nurul Ilmi Series (نور العلم)</h1>
    <p>You transferred this launcher via USB cable to your Android phone.</p>
    <p>Tap below to launch the full Madrasah application and click "Add to Home Screen" to install it permanently as an APK.</p>
    <a class="btn" href="https://ais-pre-w3ocrwn4nqhbbwci3evsol-985236048210.europe-west2.run.app/">Open & Install App</a>
  </div>
</body>
</html>
`;
  zip.file('NurulIlmi-USB-Launcher.html', offlineLauncherHtml);

  // 7. Comprehensive README instructions in English & Amharic
  const readme = `================================================================================
   NURUL ILMI SERIES (نور العلم) - DIRECT USB ANDROID INSTALLATION GUIDE
================================================================================

This package enables you to install the Nurul Ilmi Suite directly onto your 
Android phone using a USB cable.

--------------------------------------------------------------------------------
METHOD 1: USB REMOTE PORT FORWARDING (RECOMMENDED - ZERO-COMPILE WEBAPK)
--------------------------------------------------------------------------------
1. Connect your Android phone to your PC using a USB cable.
2. On your phone:
   - Go to Settings > About phone > tap "Build number" 7 times.
   - Go to Settings > Developer options > toggle ON "USB Debugging".
   - When prompted on phone: Tap "Always allow from this computer" -> "Allow".
3. On your PC:
   - Open Google Chrome and visit: chrome://inspect/#devices
   - Click "Port forwarding..."
   - Port: 3000  |  IP address: localhost:3000
   - Check "Enable port forwarding" and click Done.
4. On your connected phone:
   - Open Google Chrome and visit: http://localhost:3000
   - Tap the three dots (⋮) menu at top right.
   - Tap "Install app" or "Add to Home screen".
   - Google Chrome directly installs the signed native WebAPK onto your phone!

--------------------------------------------------------------------------------
METHOD 2: ONE-CLICK ADB BATCH SCRIPT (FOR WINDOWS / MAC / LINUX)
--------------------------------------------------------------------------------
1. Connect your phone via USB with USB Debugging enabled.
2. In this folder:
   - On Windows: Double click "install-via-usb.bat"
   - On macOS/Linux: Open Terminal, run: chmod +x install-via-usb.sh && ./install-via-usb.sh
3. The script will automatically reverse the USB port and trigger the Android
   app installation directly on your phone!

--------------------------------------------------------------------------------
METHOD 3: MTP USB FILE TRANSFER (DRAG & DROP)
--------------------------------------------------------------------------------
1. Plug your phone into PC with USB cable.
2. On your phone notification shade, change USB mode to "File Transfer" (MTP).
3. On your PC, open your phone's drive -> "Download" folder.
4. Drag and drop "NurulIlmi-USB-Launcher.html" into your phone's Download folder.
5. On your phone, open "Files" app -> "Downloads" -> tap the file.
6. Tap "Open & Install App" to place the Nurul Ilmi icon on your home screen.

================================================================================
ድጋፍና እርዳታ (Amharic Guidance)
በዩኤስቢ (USB) ገመድ አማካኝነት መተግበሪያውን በአንድሮይድ ስልክዎ ላይ ለመጫን፡
1. ስልክዎን በዩኤስቢ ገመድ ከኮምፒውተርዎ ጋር ያገናኙ።
2. በስልክዎ ላይ "USB Debugging" ያብሩ።
3. install-via-usb.bat የሚለውን ፋይል ይጫኑ ወይም በ Chrome chrome://inspect ገብተው ይጫኑ።
================================================================================
`;
  zip.file('README-USB-INSTALL.txt', readme);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
