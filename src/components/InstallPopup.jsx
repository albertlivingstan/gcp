import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('studyhub_install_popup');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!hasSeenPopup && !isStandalone) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('studyhub_install_popup', 'true');
  };

  const handleInstall = () => {
    alert("To install: Tap the share button in your browser and select 'Add to Home Screen'.");
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button onClick={handleClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-start gap-4">
        <div className="bg-indigo-50 dark:bg-slate-700 p-2 rounded-xl shadow-sm shrink-0">
          <img src="/image.png" alt="App Icon" className="w-10 h-10 object-contain" />
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
