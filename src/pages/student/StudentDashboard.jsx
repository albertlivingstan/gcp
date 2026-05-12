import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, ArrowRight, Zap, Target, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = [
  { id: 1, name: 'Cloud Computing', code: 'CS401', progress: 75, color: 'from-blue-500 to-cyan-400' },
  { id: 2, name: 'Cyber Security', code: 'CS402', progress: 45, color: 'from-rose-500 to-pink-500' },
  { id: 3, name: 'DevOps', code: 'CS403', progress: 90, color: 'from-violet-500 to-fuchsia-500' },
];

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Welcome back, {currentUser ? currentUser.displayName.split(' ')[0] : 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            You're doing great. Keep up the momentum!
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Global Rank</p>
              <p className="font-bold text-lg text-slate-900 dark:text-white">#42</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total XP</p>
              <p className="font-bold text-lg text-slate-900 dark:text-white">12,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Banner - Span 2 cols */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-indigo-500/20 group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Target className="w-48 h-48 -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold mb-6">
              <Flame className="w-4 h-4 text-amber-300" />
              Daily Quiz Challenge
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight max-w-sm">Master Cloud Computing Architecture</h2>
            <p className="text-indigo-100 mb-8 max-w-md">
              Complete today's quiz to earn double XP and unlock the "Cloud Architect" badge.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
              Start Quiz <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Quick Stats / Study Planner */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {[
                { task: 'Cloud Assignment 3', due: 'Tomorrow, 11:59 PM', type: 'assignment' },
                { task: 'DevOps Model Exam', due: 'Friday, 10:00 AM', type: 'exam' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className={`w-2 h-2 mt-2 rounded-full ${item.type === 'exam' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="font-semibold text-sm">{item.task}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Subjects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Subjects</h2>
          <Link to="/hub/subjects" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${subject.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {subject.code}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-500">Course Progress</span>
                  <span className="text-slate-900 dark:text-white">{subject.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
