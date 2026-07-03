import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { subjects, mockPPTs } from '../../data/mockData';
import { Upload, Check, X, BookOpen, FileText, Settings, Users, LayoutDashboard, Plus, CheckCircle, Link, Edit, Save, PlaySquare, PlayCircle, Video, ListVideo, Award } from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState('');

  const [adminVideos, setAdminVideos] = useState([]);
  const [adminQuizzes, setAdminQuizzes] = useState([]);

  const [stats, setStats] = useState([
    { label: 'Total PPTs Uploaded', value: 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    { label: 'Pending Notes', value: 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { label: 'Total Videos', value: 0, icon: PlaySquare, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/50' },
    { label: 'Total Students', value: 1042, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/50' },
  ]);

  const [pendingNotes, setPendingNotes] = useState([]);

  const fetchPendingNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pendingNotes'));
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      setPendingNotes(notes);

      setStats(prev => {
        const newStats = [...prev];
        newStats[1].value = notes.length;
        return newStats;
      });
    } catch (error) {
      console.error("Error fetching pending notes", error);
    }
  };

  const [firebaseSubjects, setFirebaseSubjects] = useState([]);
  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subjects'));
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() });
      });
      setFirebaseSubjects(subs);
    } catch (error) {
      console.error("Error fetching subjects", error);
    }
  };

  const allSubjects = [...subjects, ...firebaseSubjects];

  const fetchAdminPPTs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'adminPPTs'));
      const ppts = [];
      querySnapshot.forEach((doc) => {
        ppts.push({ id: doc.id, ...doc.data() });
      });
      setAdminUploadedPPTs(ppts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      setStats(prev => {
        const newStats = [...prev];
        newStats[0].value = ppts.length;
        return newStats;
      });
    } catch (error) {
      console.error("Error fetching PPTs", error);
    }
  };

  const fetchAdminVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'adminVideos'));
      const vids = [];
      querySnapshot.forEach((doc) => {
        vids.push({ id: doc.id, ...doc.data() });
      });
      setAdminVideos(vids.sort((a, b) => (a.order || 0) - (b.order || 0)));

      setStats(prev => {
        const newStats = [...prev];
        newStats[2].value = vids.length;
        return newStats;
      });
    } catch (error) {
      console.error("Error fetching videos", error);
    }
  };

  const fetchAdminQuizzes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'adminQuizzes'));
      const qz = [];
      querySnapshot.forEach((doc) => {
        qz.push({ id: doc.id, ...doc.data() });
      });
      setAdminQuizzes(qz);
    } catch (error) {
      console.error("Error fetching quizzes", error);
    }
  };

  useEffect(() => {
    fetchAdminPPTs();
    fetchAdminVideos();
    fetchAdminQuizzes();
    fetchPendingNotes();
    fetchSubjects();
  }, []);

  const [uploadForm, setUploadForm] = useState({ subject: subjects[0]?.id || '', title: '', file: null, fileName: '', url: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [adminUploadedPPTs, setAdminUploadedPPTs] = useState([]);
  const [editingPptId, setEditingPptId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subjectId: '', url: '' });

  const [videoForm, setVideoForm] = useState({ title: '', subjectId: subjects[0]?.id || '', unit: '', description: '', youtubeUrl: '', tags: '', difficulty: 'Medium', duration: '', order: 0 });
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoSearchTerm, setVideoSearchTerm] = useState('');

  const [quizForm, setQuizForm] = useState({ title: '', subjectId: subjects[0]?.id || '', xp: 500, time: 10, attempts: 1, active: true, type: 'internal', externalLink: '', questions: [{ text: '', options: ['', '', '', ''], correctIndex: 0 }] });
  const [isUploadingQuiz, setIsUploadingQuiz] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectForm, setNewSubjectForm] = useState({ title: '', description: '', color: 'bg-blue-500', icon: 'Cpu' });

  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectForm, setEditSubjectForm] = useState({ title: '', description: '', color: 'bg-blue-500' });

  const handleEditSubjectClick = (s) => {
    setEditingSubjectId(s.id);
    setEditSubjectForm({ title: s.title, description: s.description, color: s.color || 'bg-blue-500' });
  };

  const handleUpdateSubject = async (subjectId) => {
    if (!editSubjectForm.title || !editSubjectForm.description) {
      triggerToast('Title and description are required.');
      return;
    }
    try {
      await updateDoc(doc(db, 'subjects', subjectId), {
        title: editSubjectForm.title,
        description: editSubjectForm.description,
        color: editSubjectForm.color,
        updatedAt: new Date().toISOString()
      });
      triggerToast('Subject updated successfully!');
      setEditingSubjectId(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update subject.');
    }
  };

  const handleEditClick = (ppt) => {
    setEditingPptId(ppt.id);
    setEditForm({ title: ppt.title, subjectId: ppt.subjectId, url: ppt.url || '' });
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectForm.title || !newSubjectForm.description) return;

    try {
      const subjectId = newSubjectForm.title.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'subjects', subjectId), {
        title: newSubjectForm.title,
        description: newSubjectForm.description,
        color: newSubjectForm.color,
        icon: newSubjectForm.icon,
        createdAt: new Date().toISOString()
      });
      triggerToast('Subject added successfully!');
      setShowAddSubject(false);
      setNewSubjectForm({ title: '', description: '', color: 'bg-blue-500', icon: 'Cpu' });
      fetchSubjects();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to add subject.');
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeUrl) {
      triggerToast('Title and YouTube URL are required.');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const videoId = extractYouTubeId(videoForm.youtubeUrl);
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

      const videoData = {
        title: videoForm.title,
        subjectId: videoForm.subjectId,
        unit: videoForm.unit,
        description: videoForm.description,
        youtubeUrl: videoForm.youtubeUrl,
        youtubeId: videoId,
        thumbnailUrl: thumbnailUrl,
        tags: typeof videoForm.tags === 'string' ? videoForm.tags.split(',').map(t => t.trim()).filter(Boolean) : videoForm.tags,
        difficulty: videoForm.difficulty,
        duration: videoForm.duration,
        order: Number(videoForm.order)
      };

      if (editingVideoId) {
        await updateDoc(doc(db, 'adminVideos', editingVideoId), videoData);
        triggerToast('Video updated successfully!');
      } else {
        videoData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'adminVideos'), videoData);
        triggerToast('Video added successfully!');
      }

      setVideoForm({ title: '', subjectId: videoForm.subjectId, unit: '', description: '', youtubeUrl: '', tags: '', difficulty: 'Medium', duration: '', order: 0 });
      setEditingVideoId(null);
      fetchAdminVideos();
    } catch (err) {
      console.error(err);
      triggerToast(`Failed to ${editingVideoId ? 'update' : 'add'} video.`);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleEditVideoClick = (video) => {
    setEditingVideoId(video.id);
    setVideoForm({
      title: video.title,
      subjectId: video.subjectId,
      unit: video.unit || '',
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      tags: video.tags ? video.tags.join(', ') : '',
      difficulty: video.difficulty || 'Medium',
      duration: video.duration || '',
      order: video.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteDoc(doc(db, 'adminVideos', id));
      triggerToast('Video removed successfully.');
      fetchAdminVideos();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete video.');
    }
  };

  const handleUpdatePPT = async (id) => {
    try {
      await updateDoc(doc(db, 'adminPPTs', id), {
        title: editForm.title,
        subjectId: editForm.subjectId,
        url: editForm.url
      });
      triggerToast('PPT updated successfully.');
      setEditingPptId(null);
      fetchAdminPPTs();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update PPT.');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizForm.title) {
      triggerToast('Quiz title is required.');
      return;
    }

    setIsUploadingQuiz(true);
    try {
      const quizData = {
        title: quizForm.title,
        subjectId: quizForm.subjectId,
        xp: Number(quizForm.xp),
        time: Number(quizForm.time),
        attempts: Number(quizForm.attempts),
        active: quizForm.active,
        type: quizForm.type,
        externalLink: quizForm.type === 'external' ? quizForm.externalLink : null,
        questions: quizForm.type === 'internal' ? quizForm.questions : [],
        createdAt: new Date().toISOString()
      };

      if (editingQuizId) {
        await updateDoc(doc(db, 'adminQuizzes', editingQuizId), quizData);
        triggerToast('Quiz updated successfully!');
        setEditingQuizId(null);
      } else {
        await addDoc(collection(db, 'adminQuizzes'), quizData);
        triggerToast('Quiz added successfully!');
      }

      setQuizForm({ title: '', subjectId: subjects[0]?.id || '', xp: 500, time: 10, attempts: 1, active: true, type: 'internal', externalLink: '', questions: [{ text: '', options: ['', '', '', ''], correctIndex: 0 }] });
      fetchAdminQuizzes();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to add quiz.');
    } finally {
      setIsUploadingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteDoc(doc(db, 'adminQuizzes', id));
      triggerToast('Quiz removed successfully.');
      fetchAdminQuizzes();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete quiz.');
    }
  };




  useEffect(() => {
    // Moved to the fetchPendingNotes above to fetch both
  }, []);

  const handleDeletePPT = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?")) return;
    try {
      await deleteDoc(doc(db, 'adminPPTs', id));
      triggerToast('PPT removed successfully.');
      fetchAdminPPTs();
      setStats(prev => {
        const newStats = [...prev];
        newStats[0].value = Math.max(0, newStats[0].value - 1);
        return newStats;
      });
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete PPT.');
    }
  };

  const triggerToast = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleApprove = async (id) => {
    const noteToApprove = pendingNotes.find(n => n.id === id);
    if (noteToApprove) {
      try {
        const approvedNote = {
          subject: noteToApprove.subject,
          title: noteToApprove.title,
          content: noteToApprove.content,
          author: noteToApprove.author,
          fileName: noteToApprove.fileName || null,
          fileUrl: noteToApprove.fileUrl || null,
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'approvedNotes'), approvedNote);
        await deleteDoc(doc(db, 'pendingNotes', id));
        fetchPendingNotes();
        triggerToast('Note successfully approved and published to Trends!');
      } catch (err) {
        console.error(err);
        triggerToast('Failed to approve note.');
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'pendingNotes', id));
      fetchPendingNotes();
      triggerToast('Note rejected and removed.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to reject note.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title || (!uploadForm.file && !uploadForm.url)) {
      triggerToast('Please provide a title and select a file or enter a Google Slides URL.');
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl = uploadForm.url || '';

      if (uploadForm.file) {
        const timestamp = new Date().getTime();
        const fileRef = ref(storage, `adminPPTs/${timestamp}_${uploadForm.file.name}`);
        await uploadBytes(fileRef, uploadForm.file);
        fileUrl = await getDownloadURL(fileRef);
      }

      const newDoc = {
        subjectId: uploadForm.subject,
        title: uploadForm.title,
        fileName: uploadForm.file ? uploadForm.file.name : 'Google Slides Link',
        url: fileUrl,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'adminPPTs'), newDoc);

      triggerToast('File uploaded and published successfully!');
      setUploadForm({ subject: subjects[0].id, title: '', file: null, fileName: '', url: '' });
      fetchAdminPPTs();
      setStats(prev => {
        const newStats = [...prev];
        newStats[0].value += 1; // Total PPTs up
        return newStats;
      });
    } catch (err) {
      console.error(err);
      triggerToast('Error saving file to Firebase.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdminFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({ ...uploadForm, file: file, fileName: file.name });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Admin Security</h2>
          <p className="text-slate-500 text-center text-sm mb-6">Enter the master passcode to access the dashboard.</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            // Default Passcode is 1234. In a real app, use Firebase Auth.
            if (adminPin === '2006') {
              setIsAuthenticated(true);
            } else {
              alert("Incorrect Passcode");
            }
          }}>
            <input
              type="password"
              placeholder="Admin PIN"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none text-center tracking-[0.5em] font-mono text-lg"
              autoFocus
            />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

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
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <PlaySquare className="w-5 h-5" /> Manage Videos
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quizzes' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Award className="w-5 h-5" /> Manage Quizzes
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
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Upload Study Material</h2>
              <form onSubmit={handleUpload} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={e => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g. Chapter 1: Introduction"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">File (PPT, PDF)</label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative h-[180px] flex flex-col items-center justify-center">
                      <input type="file" onChange={handleAdminFileChange} disabled={!!uploadForm.url} className={`absolute inset-0 w-full h-full opacity-0 ${uploadForm.url ? 'cursor-not-allowed' : 'cursor-pointer'}`} accept=".ppt,.pptx,.pdf,.doc,.docx" />
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {uploadForm.fileName ? <span className="font-bold text-indigo-600 dark:text-indigo-400">{uploadForm.fileName}</span> : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">.ppt, .pptx, .pdf up to 50MB</p>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">Or Google Slides Link</label>
                    <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/30">
                      <Link className="w-8 h-8 text-slate-400 mb-3" />
                      <input
                        type="url"
                        disabled={!!uploadForm.file}
                        value={uploadForm.url}
                        onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })}
                        placeholder="https://docs.google.com/presentation/d/..."
                        className={`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${uploadForm.file ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <p className="text-xs text-slate-500 mt-3 text-center">Paste a public Google Slides link to embed directly.</p>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto">
                  {isUploading ? 'Uploading to Firebase...' : 'Publish Material'}
                </button>
              </form>
            </div>

            {/* PPT Viewer / Remover List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-2xl mt-8">
              <h2 className="text-xl font-bold mb-6">Manage Uploaded Material</h2>
              <div className="space-y-4">
                {adminUploadedPPTs.length === 0 ? (
                  <p className="text-slate-500 text-sm">No materials uploaded yet.</p>
                ) : (
                  adminUploadedPPTs.map(ppt => (
                    <div key={ppt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg gap-4">
                      {editingPptId === ppt.id ? (
                        <div className="flex-1 w-full space-y-3">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <select
                            value={editForm.subjectId}
                            onChange={(e) => setEditForm({ ...editForm, subjectId: e.target.value })}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                          >
                            {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                          </select>
                          <input
                            type="url"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            placeholder="PPT/Slides URL"
                            className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdatePPT(ppt.id)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                              <Save className="w-4 h-4" /> Save
                            </button>
                            <button onClick={() => setEditingPptId(null)} className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <div>
                              <p className="font-semibold text-sm">{ppt.title}</p>
                              <p className="text-xs text-slate-500">{allSubjects.find(s => s.id === ppt.subjectId)?.title || ppt.subjectId}</p>
                              {ppt.url && <a href={ppt.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline mt-0.5 inline-block truncate max-w-[200px] sm:max-w-xs">{ppt.url}</a>}
                              {ppt.fileName && !ppt.url && <p className="text-xs text-slate-400 mt-0.5">{ppt.fileName}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(ppt)}
                              className="text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                              title="Edit PPT"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePPT(ppt.id)}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                              title="Remove PPT"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'videos' && (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PlaySquare className="text-red-500 w-6 h-6" />
                {editingVideoId ? 'Edit YouTube Explanation' : 'Add YouTube Explanation'}
              </h2>
              <form onSubmit={handleVideoSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select
                      value={videoForm.subjectId}
                      onChange={e => setVideoForm({ ...videoForm, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Subject...</option>
                      {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit / Topic</label>
                    <input
                      type="text"
                      value={videoForm.unit}
                      onChange={e => setVideoForm({ ...videoForm, unit: e.target.value })}
                      placeholder="e.g. Unit 1: Basics"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    value={videoForm.title}
                    onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="e.g. Intro to Operating Systems"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">YouTube URL</label>
                  <input
                    type="url"
                    required
                    value={videoForm.youtubeUrl}
                    onChange={e => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description / Notes Summary</label>
                  <textarea
                    rows="3"
                    value={videoForm.description}
                    onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                    placeholder="Brief overview of what the video covers..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={videoForm.tags}
                      onChange={e => setVideoForm({ ...videoForm, tags: e.target.value })}
                      placeholder="e.g. devops, basics, exam"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      value={videoForm.difficulty}
                      onChange={e => setVideoForm({ ...videoForm, difficulty: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Medium">Medium</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (min)</label>
                    <input
                      type="text"
                      value={videoForm.duration}
                      onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })}
                      placeholder="e.g. 15:30"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={isUploadingVideo} className="bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto flex items-center gap-2 justify-center">
                    {editingVideoId ? <Save className="w-5 h-5" /> : <ListVideo className="w-5 h-5" />}
                    {isUploadingVideo ? (editingVideoId ? 'Updating...' : 'Publishing...') : (editingVideoId ? 'Update Video' : 'Publish Video')}
                  </button>
                  {editingVideoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVideoId(null);
                        setVideoForm({ title: '', subjectId: subjects[0]?.id || '', unit: '', description: '', youtubeUrl: '', tags: '', difficulty: 'Medium', duration: '', order: 0 });
                      }}
                      className="px-6 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-4xl mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold">Manage Video Explanations</h2>
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={videoSearchTerm}
                  onChange={e => setVideoSearchTerm(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full sm:w-64"
                />
              </div>
              <div className="space-y-4">
                {adminVideos.filter(v =>
                  v.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
                  (allSubjects.find(s => s.id === v.subjectId)?.title || '').toLowerCase().includes(videoSearchTerm.toLowerCase())
                ).length === 0 ? (
                  <p className="text-slate-500 text-sm">No videos found.</p>
                ) : (
                  adminVideos
                    .filter(v =>
                      v.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
                      (allSubjects.find(s => s.id === v.subjectId)?.title || '').toLowerCase().includes(videoSearchTerm.toLowerCase())
                    )
                    .map(video => (
                      <div key={video.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg gap-4 bg-slate-50 dark:bg-slate-900/30">
                        <div className="flex gap-4 items-center">
                          <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
                            {video.thumbnailUrl ? (
                              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PlayCircle className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{video.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded font-medium">{allSubjects.find(s => s.id === video.subjectId)?.title || video.subjectId}</span>
                              {video.unit && <span className="text-xs text-slate-500 font-medium">{video.unit}</span>}
                              {video.difficulty && <span className="text-xs text-slate-500 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">{video.difficulty}</span>}
                            </div>
                            <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1.5 inline-block">Watch on YouTube</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditVideoClick(video)}
                            className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                            title="Edit Video"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                            title="Remove Video"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'quizzes' && (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-4xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Award className="text-amber-500 w-6 h-6" /> {editingQuizId ? 'Edit Quiz' : 'Create New Quiz'}</h2>
              <form onSubmit={handleQuizSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quiz Title</label>
                    <input
                      type="text" required value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                      placeholder="e.g. Mid-Term Mega Quiz" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select
                      value={quizForm.subjectId} onChange={e => setQuizForm({ ...quizForm, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    >
                      {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">XP Reward</label>
                    <input
                      type="number" value={quizForm.xp} onChange={e => setQuizForm({ ...quizForm, xp: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time Limit (mins)</label>
                    <input
                      type="number" value={quizForm.time} onChange={e => setQuizForm({ ...quizForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Attempts</label>
                    <input
                      type="number" value={quizForm.attempts} onChange={e => setQuizForm({ ...quizForm, attempts: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={quizForm.active} onChange={e => setQuizForm({ ...quizForm, active: e.target.checked })} className="w-5 h-5 rounded border-slate-300" />
                      <span className="font-medium">Active</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quiz Type</label>
                    <select
                      value={quizForm.type} onChange={e => setQuizForm({ ...quizForm, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    >
                      <option value="internal">Internal (Build Questions Here)</option>
                      <option value="external">External Link (Wayground etc.)</option>
                    </select>
                  </div>
                  {quizForm.type === 'external' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">External Quiz Link</label>
                      <input
                        type="url" required={quizForm.type === 'external'} value={quizForm.externalLink} onChange={e => setQuizForm({ ...quizForm, externalLink: e.target.value })}
                        placeholder="https://wayground.com/join..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      />
                    </div>
                  )}
                </div>

                {quizForm.type === 'internal' && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Questions ({quizForm.questions.length})</h3>
                      <button type="button" onClick={() => setQuizForm({ ...quizForm, questions: [...quizForm.questions, { text: '', options: ['', '', '', ''], correctIndex: 0 }] })} className="text-indigo-600 text-sm font-bold flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        <Plus className="w-4 h-4" /> Add Question
                      </button>
                    </div>
                    <div className="space-y-6">
                      {quizForm.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                          {quizForm.questions.length > 1 && (
                            <button type="button" onClick={() => {
                              const newQs = [...quizForm.questions]; newQs.splice(qIndex, 1); setQuizForm({ ...quizForm, questions: newQs });
                            }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          <label className="block text-sm font-medium mb-1">Question {qIndex + 1}</label>
                          <input type="text" required value={q.text} onChange={e => { const newQs = [...quizForm.questions]; newQs[qIndex].text = e.target.value; setQuizForm({ ...quizForm, questions: newQs }); }} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 mb-3" placeholder="Enter question..." />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map(optIdx => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input type="radio" name={`correct-${qIndex}`} checked={q.correctIndex === optIdx} onChange={() => { const newQs = [...quizForm.questions]; newQs[qIndex].correctIndex = optIdx; setQuizForm({ ...quizForm, questions: newQs }); }} className="w-4 h-4 text-indigo-600" />
                                <input type="text" required value={q.options[optIdx]} onChange={e => { const newQs = [...quizForm.questions]; newQs[qIndex].options[optIdx] = e.target.value; setQuizForm({ ...quizForm, questions: newQs }); }} className={`w-full px-3 py-1.5 rounded-lg border ${q.correctIndex === optIdx ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`} placeholder={`Option ${optIdx + 1}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="submit" disabled={isUploadingQuiz} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full md:w-auto flex items-center gap-2 justify-center shadow-lg shadow-amber-500/20">
                    {isUploadingQuiz ? 'Publishing...' : editingQuizId ? 'Update Quiz' : 'Publish Quiz Platform'}
                  </button>
                  {editingQuizId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuizId(null);
                        setQuizForm({ title: '', subjectId: subjects[0]?.id || '', xp: 500, time: 10, attempts: 1, active: true, type: 'internal', externalLink: '', questions: [{ text: '', options: ['', '', '', ''], correctIndex: 0 }] });
                      }}
                      className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-4xl mt-8">
              <h2 className="text-xl font-bold mb-6">Manage Existing Quizzes</h2>
              <div className="space-y-4">
                {adminQuizzes.length === 0 ? (
                  <p className="text-slate-500 text-sm">No quizzes created yet.</p>
                ) : (
                  adminQuizzes.map(quiz => (
                    <div key={quiz.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg gap-4 bg-slate-50 dark:bg-slate-900/30">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${quiz.active ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                          <h3 className="font-bold text-slate-900 dark:text-white">{quiz.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded font-medium">{allSubjects.find(s => s.id === quiz.subjectId)?.title || quiz.subjectId}</span>
                          <span>{quiz.type === 'external' ? 'External Link' : `${quiz.questions?.length || 0} Questions`}</span>
                          <span>{quiz.time} mins</span>
                          <span>{quiz.attempts || 1} Attempt(s)</span>
                          <span>{quiz.xp} XP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingQuizId(quiz.id);
                            setQuizForm({
                              title: quiz.title,
                              subjectId: quiz.subjectId,
                              xp: quiz.xp || 500,
                              time: quiz.time || 10,
                              attempts: quiz.attempts || 1,
                              active: quiz.active !== undefined ? quiz.active : true,
                              type: quiz.type || 'internal',
                              externalLink: quiz.externalLink || '',
                              questions: quiz.questions && quiz.questions.length > 0 ? quiz.questions : [{ text: '', options: ['', '', '', ''], correctIndex: 0 }]
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                          title="Delete Quiz"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
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
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{note.content.substring(0, 100)}...</p>
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
              <button
                onClick={() => setShowAddSubject(!showAddSubject)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showAddSubject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showAddSubject ? 'Cancel' : 'Add Subject'}
              </button>
            </div>

            {showAddSubject && (
              <form onSubmit={handleAddSubject} className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-bold mb-2">Create New Subject</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newSubjectForm.title}
                      onChange={e => setNewSubjectForm({ ...newSubjectForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Theme</label>
                    <select
                      value={newSubjectForm.color}
                      onChange={e => setNewSubjectForm({ ...newSubjectForm, color: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="bg-blue-500">Blue</option>
                      <option value="bg-purple-500">Purple</option>
                      <option value="bg-green-500">Green</option>
                      <option value="bg-red-500">Red</option>
                      <option value="bg-orange-500">Orange</option>
                      <option value="bg-teal-500">Teal</option>
                      <option value="bg-pink-500">Pink</option>
                      <option value="bg-indigo-500">Indigo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      required
                      rows="2"
                      value={newSubjectForm.description}
                      onChange={e => setNewSubjectForm({ ...newSubjectForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Save Subject
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {allSubjects.map(s => (
                <div key={s.id} className="py-4">
                  {editingSubjectId === s.id ? (
                    /* ── Inline Edit Form ── */
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-indigo-300 dark:border-indigo-700 p-4 space-y-3">
                      <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-1">Editing: {s.id}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={editSubjectForm.title}
                            onChange={e => setEditSubjectForm({ ...editSubjectForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Color Theme</label>
                          <select
                            value={editSubjectForm.color}
                            onChange={e => setEditSubjectForm({ ...editSubjectForm, color: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          >
                            <option value="bg-blue-500">Blue</option>
                            <option value="bg-purple-500">Purple</option>
                            <option value="bg-green-500">Green</option>
                            <option value="bg-red-500">Red</option>
                            <option value="bg-orange-500">Orange</option>
                            <option value="bg-teal-500">Teal</option>
                            <option value="bg-pink-500">Pink</option>
                            <option value="bg-indigo-500">Indigo</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium mb-1">Description</label>
                          <textarea
                            rows="2"
                            value={editSubjectForm.description}
                            onChange={e => setEditSubjectForm({ ...editSubjectForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingSubjectId(null)}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateSubject(s.id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Save className="w-4 h-4" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal Row ── */
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                        <div>
                          <h3 className="font-semibold">{s.title}</h3>
                          <p className="text-sm text-slate-500">{s.description.substring(0, 60)}{s.description.length > 60 ? '...' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">ID: {s.id}</span>
                        <button
                          onClick={() => handleEditSubjectClick(s)}
                          className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-indigo-200 dark:border-indigo-800/50"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
