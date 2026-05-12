import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { subjects, mockPPTs } from '../../data/mockData';
import { Upload, Check, X, BookOpen, FileText, Settings, Users, LayoutDashboard, Plus, CheckCircle, Link, Edit, Save } from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState('');
  
  const [stats, setStats] = useState([
    { label: 'Total PPTs Uploaded', value: 24, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    { label: 'Pending Notes', value: 8, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { label: 'Approved Notes', value: 156, icon: Check, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50' },
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
    } catch (error) {
      console.error("Error fetching PPTs", error);
    }
  };

  useEffect(() => {
    fetchAdminPPTs();
    fetchPendingNotes();
    fetchSubjects();
  }, []);

  const [uploadForm, setUploadForm] = useState({ subject: subjects[0]?.id || '', title: '', file: null, fileName: '', url: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [adminUploadedPPTs, setAdminUploadedPPTs] = useState([]);
  const [editingPptId, setEditingPptId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subjectId: '', url: '' });
  
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectForm, setNewSubjectForm] = useState({ title: '', description: '', color: 'bg-blue-500', icon: 'Cpu' });

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
            if (adminPin === '1234') {
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
                  onChange={e => setUploadForm({...uploadForm, subject: e.target.value})}
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
                  onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
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
                      onChange={e => setUploadForm({...uploadForm, url: e.target.value})}
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
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                          className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                        />
                        <select 
                          value={editForm.subjectId} 
                          onChange={(e) => setEditForm({...editForm, subjectId: e.target.value})} 
                          className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                          {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                        <input 
                          type="url" 
                          value={editForm.url} 
                          onChange={(e) => setEditForm({...editForm, url: e.target.value})} 
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
                      onChange={e => setNewSubjectForm({...newSubjectForm, title: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Theme</label>
                    <select 
                      value={newSubjectForm.color}
                      onChange={e => setNewSubjectForm({...newSubjectForm, color: e.target.value})}
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
                      onChange={e => setNewSubjectForm({...newSubjectForm, description: e.target.value})}
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
                <div key={s.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-slate-500">{s.description.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">ID: {s.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
