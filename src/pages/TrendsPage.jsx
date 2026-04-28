import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Upload, FileText } from 'lucide-react';

export default function TrendsPage() {
  const [approvedNotes, setApprovedNotes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyForm, setVerifyForm] = useState({ name: '', email: '' });
  const [chatInputs, setChatInputs] = useState({});

  useEffect(() => {
    // Load from local storage to mock a backend
    const savedNotes = JSON.parse(localStorage.getItem('approvedNotes') || '[]');
    const savedProfile = JSON.parse(localStorage.getItem('studyHubProfile') || 'null');
    
    // Add some mock approved notes if empty
    if (savedNotes.length === 0) {
      const mockNotes = [
        { id: 101, subject: 'Machine Learning', title: 'Great Cheatsheet for Neural Networks', content: 'I compiled all the formulas for backpropagation. Hope it helps!', author: 'AI_Student', likes: 24, comments: [{ author: 'DataNerd', text: 'This is amazing, thanks!' }] },
        { id: 102, subject: 'System Software', title: 'Pass 1 vs Pass 2 Assembler', content: 'Detailed diagram explaining the differences.', author: 'CompilerGeek', file: 'Assembler_Diagram.pdf', likes: 15, comments: [] }
      ];
      setApprovedNotes(mockNotes);
      localStorage.setItem('approvedNotes', JSON.stringify(mockNotes));
    } else {
      setApprovedNotes(savedNotes);
    }
    
    if (savedProfile) {
      setUserProfile(savedProfile);
    }
  }, []);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!verifyForm.name || !verifyForm.email) return;
    
    const profile = { name: verifyForm.name, email: verifyForm.email };
    setUserProfile(profile);
    localStorage.setItem('studyHubProfile', JSON.stringify(profile));
    setShowVerifyModal(false);
  };

  const handleChatSubmit = (e, noteId) => {
    e.preventDefault();
    if (!userProfile) {
      setShowVerifyModal(true);
      return;
    }
    
    const text = chatInputs[noteId];
    if (!text || !text.trim()) return;

    const newNotes = approvedNotes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: [...(note.comments || []), { author: userProfile.name, text }]
        };
      }
      return note;
    });

    setApprovedNotes(newNotes);
    localStorage.setItem('approvedNotes', JSON.stringify(newNotes));
    setChatInputs({ ...chatInputs, [noteId]: '' });
  };

  const handleLike = (noteId) => {
    const newNotes = approvedNotes.map(note => {
      if (note.id === noteId) {
        return { ...note, likes: (note.likes || 0) + 1 };
      }
      return note;
    });
    setApprovedNotes(newNotes);
    localStorage.setItem('approvedNotes', JSON.stringify(newNotes));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Join the Discussion</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Please verify your identity to chat with the community.</p>
              
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={verifyForm.name}
                    onChange={(e) => setVerifyForm({...verifyForm, name: e.target.value})}
                    placeholder="e.g. Albert L." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={verifyForm.email}
                    onChange={(e) => setVerifyForm({...verifyForm, email: e.target.value})}
                    placeholder="student@university.edu" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setShowVerifyModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Verify & Join</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Trends</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover and discuss approved notes and files shared by your peers.</p>
      </div>

      <div className="space-y-8">
        {approvedNotes.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500">
            No approved notes yet. Check back later!
          </div>
        ) : (
          approvedNotes.map(note => (
            <div key={note.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {note.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{note.author}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{note.subject}</span>
                        <span>• Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{note.content}</p>
                
                {note.file && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 w-max mb-4">
                    <FileText className="w-6 h-6 text-indigo-500" />
                    <div>
                      <div className="text-sm font-medium">{note.file}</div>
                      <div className="text-xs text-slate-500">Attachment</div>
                    </div>
                    <button className="ml-4 text-xs font-medium bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      View
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <button onClick={() => handleLike(note.id)} className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                    <div className="p-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">{note.likes || 0} Likes</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium text-sm">{(note.comments || []).length} Replies</span>
                  </div>
                </div>
              </div>

              {/* Chat / Comments Section */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                  {(note.comments || []).map((comment, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{comment.author}</div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={(e) => handleChatSubmit(e, note.id)} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={userProfile ? "Write a reply..." : "Verify to reply..."}
                    value={chatInputs[note.id] || ''}
                    onChange={(e) => setChatInputs({...chatInputs, [note.id]: e.target.value})}
                    onFocus={() => !userProfile && setShowVerifyModal(true)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                  />
                  <button 
                    type="submit" 
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
