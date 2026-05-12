import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data - In a real app, this would be fetched from Firestore: 
// db.collection('marks').where('studentId', '==', currentUser.uid)
const MOCK_MARKS = [
  { subject: 'Cloud Computing', internals: 45, max: 50, grade: 'O', status: 'Excellent' },
  { subject: 'Cyber Security', internals: 38, max: 50, grade: 'A', status: 'Good' },
  { subject: 'DevOps', internals: 28, max: 50, grade: 'C', status: 'Needs Improvement' },
  { subject: 'Machine Learning', internals: 48, max: 50, grade: 'O', status: 'Excellent' },
];

const GRAPH_DATA = MOCK_MARKS.map(m => ({
  name: m.subject.split(' ')[0],
  Score: m.internals
}));

export default function MarksPortal() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <FileText className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Access Denied</h2>
        <p className="text-slate-500">Please sign in with your Karunya email to view your private marks.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Confidential Marks Portal</h1>
          <p className="text-slate-500">Only you can view your academic performance.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Current GPA</p>
          <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">8.42</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Performance Analytics
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GRAPH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="Score" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-6 border border-amber-200/50 dark:border-amber-900/50">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-500">
            <AlertTriangle className="w-5 h-5" /> AI Analysis
          </h2>
          <p className="text-amber-900/80 dark:text-amber-200/80 text-sm mb-4">
            Based on your recent marks, you are excelling in Cloud Computing and ML. However, your DevOps score (28/50) is below average.
          </p>
          <div className="bg-white/60 dark:bg-black/20 p-4 rounded-2xl">
            <h3 className="font-semibold text-sm mb-2">Recommended Action:</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Complete the DevOps interactive quizzes and focus on CI/CD pipelines module.</p>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg">Semester 4 - Internal Marks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Internal Marks</th>
                <th className="p-4 font-medium">Grade</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_MARKS.map((mark, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" /> {mark.subject}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">{mark.internals}</span>
                      <span className="text-slate-400 text-sm">/ {mark.max}</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${mark.internals >= 40 ? 'bg-emerald-500' : mark.internals >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${(mark.internals / mark.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      mark.grade === 'O' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      mark.grade === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                      {mark.grade}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 flex items-center gap-1">
                    {mark.internals >= 40 ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {mark.status}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
