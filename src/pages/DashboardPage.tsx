import React, { useEffect, useState } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, FileText, Trash2, LogOut, Clock, ChevronRight, Sparkles, Wand2, AlertCircle, Pencil, X, Check } from 'lucide-react';
import { Resume } from '../types';
import { AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import desktopLogo from '../assets/chatcv_desk.webp';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <Trash2 className="text-red-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Resume</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-slate-900">"{title}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function DashboardPage({ user }: { user: User }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'resumes'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resumeList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume));
      setResumes(resumeList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching resumes:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleCreateNew = async () => {
    try {
      const docRef = await addDoc(collection(db, 'resumes'), {
        uid: user.uid,
        title: 'Untitled Resume',
        lastModified: serverTimestamp(),
        data: {
          personalInfo: { fullName: user.displayName || '', email: user.email || '', phone: '', address: '', linkedin: '', portfolio: '' },
          summary: '',
          experience: [],
          education: [],
          skills: [],
          projects: [],
          theme: 'modern',
          accentColor: '#4f46e5'
        }
      });
      navigate(`/builder/${docRef.id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'resumes', deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', title: '' });
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleRenameStart = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(id);
    setNewName(currentTitle);
  };

  const handleRenameCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    setNewName('');
  };

  const handleRenameSave = async (e?: React.FormEvent | React.FocusEvent | React.KeyboardEvent, id?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const targetId = id || editingId;
    if (!targetId || !newName.trim()) {
      setEditingId(null);
      return;
    }

    const oldName = resumes.find(r => r.id === targetId)?.title;
    
    // Optimistic update
    setResumes(prev => prev.map(r => r.id === targetId ? { ...r, title: newName.trim() } : r));
    setEditingId(null);

    try {
      await updateDoc(doc(db, 'resumes', targetId), {
        title: newName.trim(),
        lastModified: serverTimestamp()
      });
      toast.success('Resume renamed successfully');
    } catch (err) {
      console.error("Error renaming resume:", err);
      toast.error('Failed to rename resume');
      // Revert optimistic update
      if (oldName) {
        setResumes(prev => prev.map(r => r.id === targetId ? { ...r, title: oldName } : r));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={confirmDelete}
        title={deleteModal.title}
      />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
          <img src={desktopLogo} alt="ChatCV Logo" className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.displayName || 'User'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Resumes</h1>
            <p className="text-slate-500 mt-1">Manage and edit your professional documents</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Resume
          </button>
          <Link
            to="/ai-builder"
            className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 shadow-lg shadow-brand-purple/20 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Magic AI Builder
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <FileText className="text-slate-300 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No resumes yet</h2>
            <p className="text-slate-500 max-w-sm mb-8">Start by creating your first professional resume using our easy-to-use builder.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCreateNew}
                className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Standard (Manual)
              </button>
              <Link
                to="/ai-builder"
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Magic AI Builder
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all group"
              >
                <Link to={`/builder/${resume.id}`} className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleRenameStart(e, resume.id, resume.title)}
                        className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                        title="Rename"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, resume.id, resume.title)}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editingId === resume.id ? (
                    <div className="mb-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSave(e, resume.id);
                          if (e.key === 'Escape') handleRenameCancel(e);
                        }}
                        onBlur={() => handleRenameSave(undefined, resume.id)}
                        className="flex-1 bg-slate-50 border border-indigo-200 rounded-lg px-3 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  ) : (
                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{resume.title}</h3>
                  )}
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {resume.lastModified?.toDate ? `Last edited ${resume.lastModified.toDate().toLocaleDateString()}` : 'Just now'}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-indigo-600 font-bold text-sm">
                    <span>Edit Resume</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
