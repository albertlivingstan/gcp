import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Upload, FileText, CheckCircle, Trash2, Mic, Square } from 'lucide-react';
import localforage from 'localforage';
import { subjects } from '../data/mockData';

export default function TrendsPage() {
  const [approvedNotes, setApprovedNotes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyForm, setVerifyForm] = useState({ name: '', email: '' });
  const [chatInputs, setChatInputs] = useState({});
  const [showToast, setShowToast] = useState('');
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState({});
  const mediaRecorderRef = useRef({});
  const audioChunksRef = useRef({});
  
  // New Post Form State
  const [newPost, setNewPost] = useState({ title: '', content: '', subject: 'General', file: null, fileName: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedNotes = await localforage.getItem('approvedNotes');
        const savedProfile = JSON.parse(localStorage.getItem('studyHubProfile') || 'null');
        
        if (!savedNotes || savedNotes.length === 0) {
          const mockNotes = [
            { id: 101, subject: 'Machine Learning', title: 'Great Cheatsheet for Neural Networks', content: 'I compiled all the formulas for backpropagation. Hope it helps!', author: 'AI_Student', likes: 24, comments: [{ id: 1, author: 'DataNerd', text: 'This is amazing, thanks!' }] },
            { id: 102, subject: 'System Software', title: 'Pass 1 vs Pass 2 Assembler', content: 'Detailed diagram explaining the differences.', author: 'CompilerGeek', fileName: 'Assembler_Diagram.pdf', likes: 15, comments: [] }
          ];
          setApprovedNotes(mockNotes);
          await localforage.setItem('approvedNotes', mockNotes);
        } else {
          setApprovedNotes(savedNotes);
        }
        
        if (savedProfile) {
          setUserProfile(savedProfile);
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    loadData();
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!verifyForm.name || !verifyForm.email) return;
    
    const profile = { name: verifyForm.name, email: verifyForm.email };
    setUserProfile(profile);
    localStorage.setItem('studyHubProfile', JSON.stringify(profile));
    setShowVerifyModal(false);
    triggerToast('Successfully verified!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, file: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) {
      setShowVerifyModal(true);
      return;
    }
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: Date.now(),
      subject: newPost.subject,
      title: newPost.title,
      content: newPost.content,
      author: userProfile.name,
      fileName: newPost.fileName,
      fileData: newPost.file,
      likes: 0,
      comments: []
    };

    const updatedNotes = [post, ...approvedNotes];
    setApprovedNotes(updatedNotes);
    await localforage.setItem('approvedNotes', updatedNotes);
    
    setNewPost({ title: '', content: '', subject: 'General', file: null, fileName: '' });
    triggerToast('Note successfully posted!');
  };

  const handleChatSubmit = async (e, noteId, customAudio = null) => {
    if (e) e.preventDefault();
    if (!userProfile) {
      setShowVerifyModal(true);
      return;
    }
    
    const text = chatInputs[noteId];
    if (!customAudio && (!text || !text.trim())) return;

    const newNotes = approvedNotes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: [...(note.comments || []), { 
            id: Date.now(), 
            author: userProfile.name, 
            text: text || '', 
            audio: customAudio 
          }]
        };
      }
      return note;
    });

    setApprovedNotes(newNotes);
    await localforage.setItem('approvedNotes', newNotes);
    setChatInputs({ ...chatInputs, [noteId]: '' });
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Delete this entire note?")) return;
    const newNotes = approvedNotes.filter(n => n.id !== noteId);
    setApprovedNotes(newNotes);
    await localforage.setItem('approvedNotes', newNotes);
    triggerToast('Note deleted.');
  };

  const deleteComment = async (noteId, commentId) => {
    const newNotes = approvedNotes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          comments: note.comments.filter(c => c.id !== commentId)
        };
      }
      return note;
    });
    setApprovedNotes(newNotes);
    await localforage.setItem('approvedNotes', newNotes);
  };

  const handleLike = async (noteId) => {
    const newNotes = approvedNotes.map(note => {
      if (note.id === noteId) {
        return { ...note, likes: (note.likes || 0) + 1 };
      }
      return note;
    });
    setApprovedNotes(newNotes);
    await localforage.setItem('approvedNotes', newNotes);
  };

  const handleDownload = (fileData, fileName) => {
    if (!fileData) {
      triggerToast('No file data available.');
      return;
    }
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRecording = async (noteId) => {
    if (!userProfile) {
      setShowVerifyModal(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current[noteId] = mediaRecorder;
      audioChunksRef.current[noteId] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current[noteId].push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current[noteId], { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          handleChatSubmit(null, noteId, reader.result);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording({ ...isRecording, [noteId]: true });
    } catch (err) {
      console.error("Microphone access denied", err);
      triggerToast("Microphone access required for voice messages.");
    }
  };

  const stopRecording = (noteId) => {
    if (mediaRecorderRef.current[noteId]) {
      mediaRecorderRef.current[noteId].stop();
      setIsRecording({ ...isRecording, [noteId]: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{showToast}</span>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Join the Discussion</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Please verify your identity to chat and upload notes.</p>
              
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
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover, discuss, and share study notes and files with your peers.</p>
      </div>

      {/* New Post Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold mb-4">Share a Note or File</h2>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Note Title..."
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select 
              value={newPost.subject}
              onChange={(e) => setNewPost({...newPost, subject: e.target.value})}
              className="w-48 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="General">General</option>
              {subjects.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
            </select>
          </div>
          <textarea 
            placeholder="What's on your mind? Add notes here..."
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          ></textarea>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors font-medium">
                <Upload className="w-5 h-5" />
                <span>{newPost.fileName ? newPost.fileName : "Attach PPT, PDF, Image..."}</span>
                <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
              </label>
            </div>
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Post Note
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
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
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                      {note.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{note.author}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">{note.subject}</span>
                      </div>
                    </div>
                  </div>
                  {userProfile && userProfile.name === note.author && (
                    <button onClick={() => deleteNote(note.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{note.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{note.content}</p>
                
                {note.fileName && (
                  <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 mb-4 group hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{note.fileName}</div>
                        <div className="text-xs text-slate-500">Document Attachment</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(note.fileData || note.file, note.fileName)}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow transition-all"
                    >
                      Download
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
                    <div key={idx} className="flex gap-3 group/comment relative">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-700 group-hover/comment:border-indigo-300 transition-colors max-w-lg">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{comment.author}</div>
                          {userProfile && userProfile.name === comment.author && (
                            <button onClick={() => deleteComment(note.id, comment.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {comment.text && <div className="text-sm text-slate-800 dark:text-slate-200">{comment.text}</div>}
                        {comment.audio && (
                          <div className="mt-2">
                            <audio controls src={comment.audio} className="h-8 max-w-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={(e) => handleChatSubmit(e, note.id)} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder={userProfile ? "Write a reply..." : "Verify to reply..."}
                    value={chatInputs[note.id] || ''}
                    onChange={(e) => setChatInputs({...chatInputs, [note.id]: e.target.value})}
                    onFocus={() => !userProfile && setShowVerifyModal(true)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                  />
                  
                  {isRecording[note.id] ? (
                    <button 
                      type="button" 
                      onClick={() => stopRecording(note.id)}
                      className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 flex items-center justify-center transition-colors shrink-0 animate-pulse"
                      title="Stop Recording"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => startRecording(note.id)}
                      className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shrink-0"
                      title="Record Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                  
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
