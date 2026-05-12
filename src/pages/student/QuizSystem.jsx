import React from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Zap, ShieldAlert, Timer } from 'lucide-react';

const QUIZZES = [
  { id: 1, title: 'Cloud Computing Architecture', subject: 'CS401', questions: 20, time: '30m', xp: 500, active: true },
  { id: 2, title: 'Network Security Basics', subject: 'CS402', questions: 15, time: '20m', xp: 300, active: true },
  { id: 3, title: 'Docker & Kubernetes', subject: 'CS403', questions: 25, time: '45m', xp: 800, active: false }
];

export default function QuizSystem() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quiz Hub</h1>
          <p className="text-slate-500">Compete, earn XP, and test your knowledge!</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5" /> 12,450 XP
          </div>
        </div>
      </div>

      {/* Active Live Quiz Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-300"></span> LIVE NOW
            </div>
            <h2 className="text-3xl font-black mb-2">Mid-Term Mega Quiz!</h2>
            <p className="text-rose-100">Join the live Wayground session. Top 3 students win physical badges.</p>
          </div>
          <button className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3">
            <Play className="w-6 h-6 fill-current" /> Join with Code
          </button>
        </div>
      </motion.div>

      <h3 className="text-xl font-bold mt-8 mb-4">Available Quizzes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES.map((quiz, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border ${quiz.active ? 'border-indigo-200 dark:border-indigo-500/30 shadow-indigo-500/10 shadow-lg' : 'border-slate-200 dark:border-slate-800 opacity-70'} transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{quiz.subject}</span>
              {quiz.active && <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><Zap className="w-3 h-3 fill-current" /> Active</span>}
            </div>
            <h4 className="text-lg font-bold mb-2">{quiz.title}</h4>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {quiz.time}</span>
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Anti-cheat on</span>
            </div>
            <button className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${quiz.active ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}>
              {quiz.active ? <><Play className="w-4 h-4 fill-current" /> Start Quiz (+{quiz.xp} XP)</> : 'Ended'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
