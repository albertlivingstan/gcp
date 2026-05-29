import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, PenTool, HelpCircle, Users, Download, Bookmark, CheckCircle2, Upload, FileText, PlaySquare, PlayCircle, Clock, ListVideo, CheckCircle } from 'lucide-react';
import localforage from 'localforage';
import { subjects, mockPPTs, mockBigQuestions } from '../data/mockData';
import ChatBox from '../components/ChatBox';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function SubjectPage() {
  const { id } = useParams();
  const [firebaseSubjects, setFirebaseSubjects] = useState([]);
  const [isLoadingSubject, setIsLoadingSubject] = useState(true);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const qs = await getDocs(collection(db, 'subjects'));
        const subs = [];
        qs.forEach(d => subs.push({id: d.id, ...d.data()}));
        setFirebaseSubjects(subs);
      } catch(err){
        console.error(err);
      } finally {
        setIsLoadingSubject(false);
      }
    };
    fetchSub();
  }, [id]);

  const allSubjects = [...subjects, ...firebaseSubjects];
  const subject = allSubjects.find(s => s.id === id);

  const basePpts = mockPPTs[id] || [];
  const bigQuestions = mockBigQuestions[id] || [];
  
  const [activeTab, setActiveTab] = useState('ppt');
  const [personalNote, setPersonalNote] = useState('');
  const [publicNoteTitle, setPublicNoteTitle] = useState('');
  const [publicNoteContent, setPublicNoteContent] = useState('');
  const [submittedNotes, setSubmittedNotes] = useState([]);
  const [doneQuestions, setDoneQuestions] = useState(new Set());
  const [ppts, setPpts] = useState(basePpts);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());

  useEffect(() => {
    const loadCustomData = async () => {
      try {
        const pptSnapshot = await getDocs(collection(db, 'adminPPTs'));
        const savedPPTs = [];
        pptSnapshot.forEach((doc) => {
          savedPPTs.push({ id: doc.id, ...doc.data() });
        });
        
        const subjectPpts = savedPPTs
          .filter(ppt => ppt.subjectId === id)
          .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

        if (subjectPpts.length > 0) {
          setPpts([...basePpts, ...subjectPpts]);
        }

        const videoSnapshot = await getDocs(collection(db, 'adminVideos'));
        const savedVideos = [];
        videoSnapshot.forEach((doc) => {
          savedVideos.push({ id: doc.id, ...doc.data() });
        });

        const subjectVideos = savedVideos
          .filter(v => v.subjectId === id)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setVideos(subjectVideos);
        if (subjectVideos.length > 0 && !currentVideo) {
          setCurrentVideo(subjectVideos[0]);
        }

      } catch (err) {
        console.error('Error loading custom data from Firebase', err);
      }
    };
    loadCustomData();
  }, [id, basePpts]);

  const handleDownload = (fileData, fileName) => {
    if (!fileData) return;
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEmbedUrl = (url, fileName) => {
    if (!url) return '';
    if (url.includes('docs.google.com/presentation/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return url.replace(/\/edit.*$/, '/embed?start=false&loop=false&delayms=3000').replace(/\/view.*$/, '/embed?start=false&loop=false&delayms=3000');
      }
    }
    
    // For PDFs uploaded to Firebase or anywhere
    if (fileName && fileName.toLowerCase().endsWith('.pdf')) {
      return url; // iFrame can usually render PDF directly
    }
    
    // For PPT/PPTX uploaded, use Google Docs Viewer
    if (fileName && (fileName.toLowerCase().endsWith('.ppt') || fileName.toLowerCase().endsWith('.pptx') || fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx'))) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    
    return url;
  };

  if (isLoadingSubject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">Loading Subject Data...</p>
      </div>
    );
  }

  if (!subject) {
    return <div className="text-center py-20 text-2xl font-bold text-slate-600 dark:text-slate-400">Subject not found.</div>;
  }

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!publicNoteTitle.trim() || !publicNoteContent.trim()) return;
    
    const newNote = {
      title: publicNoteTitle,
      content: publicNoteContent,
      subject: subject.title,
      status: 'pending',
      author: 'Student', // In a real app, this would be the logged-in user
      createdAt: new Date().toISOString()
    };
    
    try {
      await addDoc(collection(db, 'pendingNotes'), newNote);
      setSubmittedNotes(prev => [...prev, { ...newNote, id: Date.now() }]);
      setPublicNoteTitle('');
      setPublicNoteContent('');
      alert("Note submitted for approval!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit note.");
    }
  };

  const toggleQuestionDone = (index) => {
    const newDone = new Set(doneQuestions);
    if (newDone.has(index)) {
      newDone.delete(index);
    } else {
      newDone.add(index);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#8b5cf6', '#ec4899']
      });
    }
    setDoneQuestions(newDone);
  };

  const toggleVideoDone = (videoId) => {
    const newDone = new Set(completedVideos);
    if (newDone.has(videoId)) {
      newDone.delete(videoId);
    } else {
      newDone.add(videoId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#3b82f6']
      });
    }
    setCompletedVideos(newDone);
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
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'videos' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <PlaySquare className="w-4 h-4 text-red-500" /> YouTube Explanations
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
                  <div key={ppt.id} className="flex-1 flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{ppt.title || ppt.fileName}</span>
                      </div>
                      <button 
                        onClick={() => ppt.fileData ? handleDownload(ppt.fileData, ppt.fileName) : window.open(ppt.url)}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                    {ppt.url ? (
                      <iframe 
                        src={getEmbedUrl(ppt.url, ppt.fileName)} 
                        className="w-full flex-1 min-h-[500px] bg-slate-100" 
                        frameBorder="0"
                        allowFullScreen={true}
                      ></iframe>
                    ) : (
                      <div className="flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500">
                        <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Document Uploaded</p>
                        <p className="text-sm mt-1 mb-4">Please download to view this file locally.</p>
                        <button 
                          onClick={() => handleDownload(ppt.fileData, ppt.fileName)}
                          className="text-indigo-600 hover:underline font-medium flex items-center gap-1"
                        >
                          Download {ppt.fileName}
                        </button>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">No PPTs available yet.</div>
                )}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <PlaySquare className="w-6 h-6 text-red-500" /> 
                    Video Learning Hub
                  </h2>
                  <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Progress: {completedVideos.size} / {videos.length} Videos
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${videos.length ? (completedVideos.size / videos.length) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
                  
                  {/* Left Sidebar: Playlist */}
                  <div className="xl:col-span-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800/50 h-[600px]">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2 font-semibold">
                      <ListVideo className="w-5 h-5 text-indigo-500" /> Playlist ({videos.length})
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {videos.length === 0 ? (
                        <div className="text-center p-4 text-slate-500 text-sm">No videos available yet.</div>
                      ) : (
                        videos.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setCurrentVideo(v)}
                            className={`w-full text-left flex gap-3 p-2 rounded-lg transition-all ${currentVideo?.id === v.id ? 'bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 ring-1 ring-indigo-500' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border border-transparent'}`}
                          >
                            <div className="relative w-24 h-16 rounded overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
                              {v.thumbnailUrl ? (
                                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                              ) : (
                                <PlayCircle className="w-6 h-6 text-slate-400" />
                              )}
                              {completedVideos.has(v.id) && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                  <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                              <h4 className={`text-sm font-semibold line-clamp-2 ${currentVideo?.id === v.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                {v.title}
                              </h4>
                              {v.duration && <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {v.duration}</p>}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Main Video Area */}
                  <div className="xl:col-span-2 flex flex-col gap-4">
                    {currentVideo ? (
                      <>
                        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800 relative group">
                          {currentVideo.youtubeId ? (
                            <iframe 
                              src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=0&rel=0`}
                              title={currentVideo.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center flex-col text-slate-400">
                              <PlaySquare className="w-16 h-16 mb-4 opacity-50" />
                              <p>Invalid YouTube URL</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {currentVideo.unit && <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded">{currentVideo.unit}</span>}
                                {currentVideo.difficulty && <span className="text-xs border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">{currentVideo.difficulty}</span>}
                              </div>
                              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentVideo.title}</h1>
                            </div>
                            <button
                              onClick={() => toggleVideoDone(currentVideo.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shrink-0 ${completedVideos.has(currentVideo.id) ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              {completedVideos.has(currentVideo.id) ? 'Completed' : 'Mark as Completed'}
                            </button>
                          </div>
                          
                          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h3 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">About this Explanation</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                              {currentVideo.description || "No description provided."}
                            </p>
                            
                            {currentVideo.tags && currentVideo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {currentVideo.tags.map((tag, idx) => (
                                  <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded-md">#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500 p-8 h-[500px]">
                        <PlaySquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-lg font-medium">Select a video to start learning</p>
                      </div>
                    )}
                  </div>
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
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Attach File (Image, PDF, PPT)</span>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
                      </label>
                      <div className="flex-1 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={!publicNoteTitle || !publicNoteContent}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          Submit for Approval
                        </button>
                      </div>
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
