import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPopup() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      const hasSeenPopup = localStorage.getItem('studyhub_install_popup_closed');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      if (!hasSeenPopup && !isStandalone) {
        setShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback for iOS / Desktop Safari where beforeinstallprompt isn't supported yet
    const hasSeenPopup = localStorage.getItem('studyhub_install_popup_closed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && !isStandalone && !hasSeenPopup) {
      setTimeout(() => setShow(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('studyhub_install_popup_closed', 'true');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("To install: Tap the share button in your browser and select 'Add to Home Screen'.");
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button onClick={handleClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="bg-indigo-50 dark:bg-slate-700 p-2 rounded-xl shadow-sm shrink-0">
          <img src="/pwa-192x192.png" alt="App Icon" className="w-10 h-10 object-contain rounded-lg" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white leading-tight">Install StudyHub</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Get the app on your home screen for faster access and offline support.</p>
          <button onClick={handleInstall} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Add to Home Screen
          </button>
        </div>
      </div>
    </div>
  );
}
