import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 500); // Wait for fade out animation
    }, 1500); // 1.5 seconds splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-600 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white p-4 rounded-3xl shadow-2xl mb-6 animate-bounce">
        <img src="/image.png" alt="StudyHub Logo" className="w-24 h-24 object-contain" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">StudyHub</h1>
      <p className="text-indigo-200 mt-2 font-medium">Your Engineering Companion</p>
    </div>
  );
}
