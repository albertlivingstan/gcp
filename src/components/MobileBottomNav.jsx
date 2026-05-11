import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${path === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/trends" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${path === '/trends' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] font-medium">Trends</span>
        </Link>
        <Link to="/admin/login" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${path.startsWith('/admin') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      </div>
    </div>
  );
}
