import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  LayoutDashboard, 
  Award, 
  FileText,
  Settings,
  Bell, 
  Search,
  Menu,
  X,
  User,
  Bot,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/hub', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hub/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/hub/quizzes', label: 'Quizzes & Wayground', icon: Award },
  { path: '/hub/marks', label: 'Marks Portal', icon: FileText },
  { path: '/hub/ai-tutor', label: 'AI Tutor', icon: Bot },
];

export default function SmartHubLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, loginWithGoogle, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      const code = err.code || '';
      // Ignore popup-closed-by-user (user cancelled)
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;

      let msg = 'Login failed. Please try again.';
      if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
        msg = 'Firebase configuration error. Please contact the administrator.';
      } else if (code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection and try again.';
      } else if (code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized for sign-in. Please contact the administrator.';
      } else if (code === 'auth/operation-not-allowed') {
        msg = 'Google Sign-In is not enabled. Please contact the administrator.';
      } else if (err.message && !err.message.includes('closed by user')) {
        msg = 'Login failed: ' + err.message;
      }
      alert(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 80,
          x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        className={cn(
          "fixed lg:relative z-50 h-screen bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          !sidebarOpen && "lg:w-[80px] -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <motion.div 
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Student Hub
            </span>
          </motion.div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/hub');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400 font-medium" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-6 h-6 z-10 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
          
          {(userRole === 'teacher' || userRole === 'admin') && (
            <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <Link 
                to="/hub/teacher"
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden",
                  location.pathname.startsWith('/hub/teacher')
                    ? "text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                <Settings className="w-6 h-6 z-10 shrink-0" strokeWidth={2} />
                {sidebarOpen && <span className="z-10 whitespace-nowrap">Faculty Portal</span>}
              </Link>
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <Link 
              to="/"
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}
            >
              <ArrowLeft className="w-6 h-6 z-10 shrink-0" strokeWidth={2} />
              {sidebarOpen && <span className="z-10 whitespace-nowrap">Back to Home</span>}
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          
          {currentUser ? (
            <div className="flex items-center justify-between group relative px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:ring-2 ring-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
                <img 
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full shrink-0 border-2 border-white dark:border-slate-700 shadow-sm"
                />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{currentUser.displayName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{userRole} Account</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button 
                  onClick={handleLogout}
                  className="p-2 text-rose-500 bg-white dark:bg-slate-900 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors absolute right-2 opacity-0 group-hover:opacity-100"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors font-semibold"
            >
              <User className="w-5 h-5" />
              {sidebarOpen && <span>Sign In (@karunya)</span>}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search subjects, quizzes, notes..." 
                className="pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm w-[300px] transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors shadow-sm">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>
            
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-semibold border border-amber-200 dark:border-amber-500/20">
                <span>🔥</span>
                <span>5 Day Streak</span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
