import React from 'react';
import { motion } from 'framer-motion';
import { Book, Folder, FileText, Download, ExternalLink } from 'lucide-react';

const SUBJECTS = [
  { id: 'sub_1', name: 'Cloud Computing', code: 'CS401', files: 12 },
  { id: 'sub_2', name: 'Cyber Security', code: 'CS402', files: 8 },
  { id: 'sub_3', name: 'DevOps', code: 'CS403', files: 15 },
];

export default function SubjectsHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subjects Hub</h1>
        <p className="text-slate-500">All your course materials in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Subject List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-300">Your Enrolled Subjects</h2>
          {SUBJECTS.map((sub, i) => (
            <motion.div 
              key={sub.id}
              whileHover={{ x: 5 }}
              className={`p-4 rounded-2xl cursor-pointer transition-colors border ${i === 0 ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${i === 0 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Book className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${i === 0 ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>{sub.name}</h3>
                  <p className="text-xs text-slate-500">{sub.code} • {sub.files} Materials</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Material Viewer */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Folder className="w-6 h-6 text-indigo-500 fill-indigo-100 dark:fill-indigo-900" /> 
                Cloud Computing
              </h2>
              <p className="text-sm text-slate-500 mt-1">Prof. Smith • Unit 1 & 2 Materials</p>
            </div>
            <button className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Request Access
            </button>
          </div>

          <div className="space-y-3">
            {[
              { type: 'pdf', name: 'Unit 1: Introduction to Cloud Infrastructure.pdf', size: '2.4 MB', date: 'Oct 12' },
              { type: 'ppt', name: 'AWS Services Overview.pptx', size: '5.1 MB', date: 'Oct 15' },
              { type: 'doc', name: 'Lab 1 Manual - EC2 Setup.docx', size: '1.2 MB', date: 'Oct 18' },
            ].map((file, idx) => (
              <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${file.type === 'pdf' ? 'bg-rose-100 text-rose-600' : file.type === 'ppt' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{file.name}</h4>
                    <p className="text-xs text-slate-500">{file.size} • Uploaded {file.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600"><ExternalLink className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
