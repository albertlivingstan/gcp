import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, HelpCircle, Users, Download, Bookmark, CheckCircle2 } from 'lucide-react';
import { subjects, mockPPTs, mockBigQuestions } from '../data/mockData';
import ChatBox from '../components/ChatBox';

export default function SubjectPage() {
  const { id } = useParams();
  const subject = subjects.find(s => s.id === id);
  const ppts = mockPPTs[id] || [];
  const bigQuestions = mockBigQuestions[id] || [];
  
  const [activeTab, setActiveTab] = useState('ppt');
  const [personalNote, setPersonalNote] = useState('');
  const [publicNoteTitle, setPublicNoteTitle] = useState('');
  const [publicNoteContent, setPublicNoteContent] = useState('');
  const [submittedNotes, setSubmittedNotes] = useState([]);
  const [doneQuestions, setDoneQuestions] = useState(new Set());

  if (!subject) {
    return <div className="text-center py-20 text-2xl">Subject not found.</div>;
  }

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!publicNoteTitle.trim() || !publicNoteContent.trim()) return;
    
    setSubmittedNotes(prev => [...prev, {
      id: Date.now(),
      title: publicNoteTitle,
      content: publicNoteContent,
      status: 'pending' // pending or approved
    }]);
    
    setPublicNoteTitle('');
    setPublicNoteContent('');
  };

  const toggleQuestionDone = (index) => {
    const newDone = new Set(doneQuestions);
    if (newDone.has(index)) {
      newDone.delete(index);
    } else {
      newDone.add(index);
    }
    setDoneQuestions(newDone);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <span className={`w-4 h-4 rounded-full ${subject.color}`}></span>
            {subject.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subject.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <button 
              onClick={() => setActiveTab('ppt')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'ppt' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4" /> PPTs
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'questions' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <HelpCircle className="w-4 h-4" /> Big Questions
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> Community Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 min-h-[600px]">
            {activeTab === 'ppt' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Study Materials</h2>
                </div>
                {ppts.length > 0 ? ppts.map(ppt => (
                  <div key={ppt.id} className="flex-1 flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                      <span className="font-medium">{ppt.title}</span>
                      <button className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-sm">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                    <iframe 
                      src={ppt.url} 
                      className="w-full flex-1 min-h-[500px] bg-slate-100" 
                      frameBorder="0"
                      allowFullScreen="true"
                    ></iframe>
                  </div>
                )) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">No PPTs available yet.</div>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-orange-500" /> 
                    Important Exam Questions
                  </h2>
                  <div className="text-sm font-medium text-slate-500">
                    Progress: {doneQuestions.size} / {bigQuestions.length}
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${bigQuestions.length ? (doneQuestions.size / bigQuestions.length) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="space-y-3">
                  {bigQuestions.map((q, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border transition-all ${doneQuestions.has(index) ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                    >
                      <div className="flex gap-4">
                        <button 
                          onClick={() => toggleQuestionDone(index)}
                          className={`shrink-0 mt-0.5 ${doneQuestions.has(index) ? 'text-green-500' : 'text-slate-300 hover:text-indigo-400'}`}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${doneQuestions.has(index) ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                            {q}
                          </p>
                        </div>
                        <button className="text-slate-400 hover:text-indigo-500 shrink-0">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> 
                  Community Notes
                </h2>
                
                {/* Submit Form */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium mb-3 text-sm">Contribute your notes</h3>
                  <form onSubmit={handleNoteSubmit} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Note Title" 
                      value={publicNoteTitle}
                      onChange={(e) => setPublicNoteTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <textarea 
                      placeholder="Write your study notes here..." 
                      rows="3"
                      value={publicNoteContent}
                      onChange={(e) => setPublicNoteContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={!publicNoteTitle || !publicNoteContent}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        Submit for Approval
                      </button>
                    </div>
                  </form>
                </div>

                {/* Submitted Notes List */}
                <div className="space-y-4 mt-6">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Recent Notes</h3>
                  {submittedNotes.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No notes submitted yet. Be the first!</p>
                  ) : (
                    submittedNotes.map(note => (
                      <div key={note.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative">
                        {note.status === 'pending' && (
                          <span className="absolute top-4 right-4 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                            Awaiting Approval
                          </span>
                        )}
                        <h4 className="font-bold text-slate-900 dark:text-white pr-24">{note.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI ChatBox */}
          <ChatBox subject={subject} />

          {/* Personal Scratchpad */}
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/30 overflow-hidden flex flex-col h-[300px]">
            <div className="p-3 border-b border-amber-200 dark:border-amber-900/30 bg-amber-100/50 dark:bg-amber-900/20 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-amber-700 dark:text-amber-500" />
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-500">Personal Notes (Auto-saved)</h3>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent p-4 resize-none outline-none text-sm text-amber-900 dark:text-amber-100 placeholder:text-amber-700/50 dark:placeholder:text-amber-500/50"
              placeholder="Jot down quick notes here while reading..."
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
