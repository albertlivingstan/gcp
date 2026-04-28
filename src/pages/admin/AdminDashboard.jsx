import React, { useState } from 'react';
import { subjects, mockPPTs } from '../../data/mockData';
import { Upload, Check, X, BookOpen, FileText, Settings, Users, LayoutDashboard, Plus, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState('');
  
  const [stats, setStats] = useState([
    { label: 'Total PPTs Uploaded', value: 24, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    { label: 'Pending Notes', value: 8, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { label: 'Approved Notes', value: 156, icon: Check, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50' },
    { label: 'Total Students', value: 1042, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/50' },
  ]);

  const [pendingNotes, setPendingNotes] = useState([
    { id: 1, subject: 'System Software', title: 'Compiler Phases Summary', author: 'Student_104', snippet: 'Lexical analysis reads stream of characters and...' },
    { id: 2, subject: 'Machine Learning', title: 'SVM Kernel Tricks', author: 'DataNerd', snippet: 'The kernel trick allows SVMs to solve non-linear...' },
  ]);

  const [uploadForm, setUploadForm] = useState({ subject: subjects[0].id, title: '', file: null });

  const triggerToast = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleApprove = (id) => {
    setPendingNotes(prev => prev.filter(n => n.id !== id));
    setStats(prev => {
      const newStats = [...prev];
      newStats[1].value = Math.max(0, newStats[1].value - 1); // Pending down
      newStats[2].value += 1; // Approved up
      return newStats;
    });
    triggerToast('Note successfully approved and published!');
  };

  const handleReject = (id) => {
    setPendingNotes(prev => prev.filter(n => n.id !== id));
    setStats(prev => {
      const newStats = [...prev];
      newStats[1].value = Math.max(0, newStats[1].value - 1); // Pending down
      return newStats;
    });
    triggerToast('Note rejected and removed.');
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadForm.title) {
      triggerToast('Please provide a title');
      return;
    }
    
    // Simulate upload
    triggerToast('File uploaded successfully!');
    setUploadForm({ subject: subjects[0].id, title: '', file: null });
    setStats(prev => {
      const newStats = [...prev];
      newStats[0].value += 1; // Total PPTs up
      return newStats;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{showToast}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2 shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-24">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Admin Menu</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Upload className="w-5 h-5" /> Upload PPTs
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notes' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <div className="relative">
                <FileText className="w-5 h-5" />
                {pendingNotes.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
              </div>
              Review Notes
            </button>
            <button 
              onClick={() => setActiveTab('subjects')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subjects' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Settings className="w-5 h-5" /> Manage Subjects
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-slate-500">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">Activity logs will appear here...</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Upload Study Material</h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Select Subject</label>
                <select 
                  value={uploadForm.subject}
                  onChange={e => setUploadForm({...uploadForm, subject: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  value={uploadForm.title}
                  onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                  placeholder="e.g. Chapter 1: Introduction" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File (PPT, PDF)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">.ppt, .pptx, .pdf up to 50MB</p>
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Upload File
              </button>
            </form>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Pending Notes</h2>
            <div className="grid gap-4">
              {pendingNotes.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500/50" />
                  <p>All caught up! No pending notes to review.</p>
                </div>
              ) : (
                pendingNotes.map(note => (
                  <div key={note.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded">
                          {note.subject}
                        </span>
                        <span className="text-xs text-slate-500">by {note.author}</span>
                      </div>
                      <h3 className="font-bold text-lg">{note.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{note.snippet}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleApprove(note.id)}
                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-green-200 dark:border-green-800/50"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(note.id)}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-200 dark:border-red-800/50"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Subjects</h2>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {subjects.map(s => (
                <div key={s.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-slate-500">{s.description.substring(0, 60)}...</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
