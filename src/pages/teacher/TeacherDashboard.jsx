import React from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, LayoutDashboard, Plus, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TeacherDashboard() {
  const { currentUser, userRole } = useAuth();

  if (userRole !== 'teacher' && userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Access Denied</h2>
        <p className="text-slate-500">Only authorized faculty can view the Admin Portal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faculty Portal</h1>
          <p className="text-slate-500">Manage students, quizzes, and marks securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Create Quiz', icon: Plus, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
          { title: 'Upload Marks', icon: Upload, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
          { title: 'Manage Students', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
          { title: 'System Settings', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/20' }
        ].map((card, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <h3 className="font-bold">{card.title}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="font-bold text-lg">Upload Students CSV</h3>
          <p className="text-slate-500 text-sm mb-4">Upload a .csv file containing student names and Karunya emails.</p>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-semibold">
            Select File
          </button>
        </div>
      </div>
    </div>
  );
}

// Added an import for ShieldAlert which was missing
import { ShieldAlert } from 'lucide-react';
