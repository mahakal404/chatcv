import React, { useEffect, useState, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronLeft, Save, Download, Layout, Palette, Eye, Edit3, Sparkles, Loader2, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Cloud, Pencil, RefreshCw, AlertTriangle, LogIn, Coins, Play, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { ResumeData, Resume } from '../types';
import ResumeForm from '../components/ResumeForm';
import AIChatbot from '../components/AIChatbot';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { useUserProfile } from '../hooks/useUserProfile';
import TokenBox from '../components/TokenBox';
import TechTemplate from '../components/templates/TechTemplate';
import { pdf } from '@react-pdf/renderer';
import EarnTokenModal from '../components/EarnTokenModal';
import { motion, AnimatePresence } from 'motion/react';

// ─── Guest LocalStorage Key ───────────────────────────────────
const GUEST_DATA_KEY = 'chatcv_guest_data';

import { BlobProvider } from '@react-pdf/renderer';
import ClassicTemplatePDF from '../components/templates/ClassicTemplatePDF';
import * as pdfjsLib from 'pdfjs-dist';
import desktopLogo from '../assets/chatcv_desk.webp';

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// ─── Mobile Detection Hook ─────────────────────────────────────
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener('change', handler as any);
    return () => mql.removeEventListener('change', handler as any);
  }, [breakpoint]);
  return isMobile;
}

// ─── NOTE: useDebounce hook removed ─────────────────────────
// Debounce is now inlined inside BuilderPage using the
// "Master Debounce" pattern (deep clone + integrated save status)
// to guarantee React-PDF detects every data mutation.

// ─── Mobile PDF Renderer Component ────────────────────────────
function MobilePDFPreview({ blobUrl, loading: pdfLoading }: { blobUrl: string | null; loading: boolean }) {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [rendering, setRendering] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render PDF pages to canvas images
  useEffect(() => {
    if (!blobUrl) return;
    let cancelled = false;
    const renderPages = async () => {
      setRendering(true);
      try {
        const response = await fetch(blobUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const images: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const scale = 2; // High-res rendering
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          images.push(canvas.toDataURL('image/png'));
        }

        if (!cancelled) {
          setPageImages(images);
        }
      } catch (err) {
        console.error('PDF render error:', err);
      } finally {
        if (!cancelled) setRendering(false);
      }
    };
    renderPages();
    return () => { cancelled = true; };
  }, [blobUrl]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const isLoading = pdfLoading || rendering;

  return (
    <div className="flex flex-col h-full bg-slate-200">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-white/90 backdrop-blur-sm border-b border-slate-200 z-10">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-all min-w-[52px]"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-all active:scale-95"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PDF Pages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {isLoading && pageImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Rendering Preview</p>
              <p className="text-xs text-slate-400 mt-1">Generating your resume...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {pageImages.map((src, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl shadow-xl overflow-hidden transition-transform duration-200"
                style={{
                  width: `${zoom * 100}%`,
                  maxWidth: `${zoom * 100}%`,
                }}
              >
                <img
                  src={src}
                  alt={`Resume page ${i + 1}`}
                  className="w-full h-auto block"
                  style={{ imageRendering: 'auto' }}
                />
                {/* Page number badge */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {i + 1} / {pageImages.length}
                </div>
                {/* Subtle overlay indicating re-rendering */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const INITIAL_DATA: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', address: '', linkedin: '', portfolio: '' },
  profileImage: null,
  showProfileImage: false,
  summary: '',
  experience: [],
  education: [],
  certifications: [],
  skills: [],
  languages: [],
  projects: [],
  theme: 'modern',
  accentColor: '#4f46e5',
  skillDisplayStyle: 'text',
  showSkillLevels: true,
  languageDisplayStyle: 'text',
  showLanguageLevels: true,
  hasUnlockedClassicIcons: false,
  previewPremiumIcons: false,
  customSections: []
};

export default function BuilderPage({ user }: { user: User | null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isGuest = !user;
  const [resume, setResume] = useState<Resume | null>(null);
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [saveStatus, setSaveStatus] = useState<'Typing...' | 'Saving...' | '✅ Saved'>('✅ Saved');
  const [debouncedData, setDebouncedData] = useState<ResumeData>(INITIAL_DATA);
  const [isDataReady, setIsDataReady] = useState(false);
  const isMobile = useIsMobile();
  const isInitialLoad = useRef(true);

  // ─── Token System ─────────────────────────────────────────────
  const { profile, deductToken, addToken } = useUserProfile(user);
  const tokens = profile?.tokens ?? 0;

  // ─── Ad Modal State ───────────────────────────────────────────
  const [showAdModal, setShowAdModal] = useState(false);
  // Blob URL ref so gated download can trigger without re-rendering
  const pdfBlobUrlRef = useRef<string | null>(null);


  // ─── LocalStorage Keys ────────────────────────────────────────
  // Authenticated users: per-resume draft key (pre-existing behaviour)
  // Guest users: shared guest key (chatcv_guest_data)
  const draftKey = isGuest ? GUEST_DATA_KEY : (id ? `chatCV_draft_${id}` : null);

  // ─── Fix 2: Master Debounce (1s delay + Deep Clone) ───────────
  // Deep-cloning breaks object reference equality so React-PDF
  // is FORCED to recognise the mutation and regenerate the blob.
  useEffect(() => {
    if (isInitialLoad.current) return;

    setSaveStatus('Typing...');
    const timer = setTimeout(() => {
      setSaveStatus('Saving...');

      // DEEP CLONE — the core fix that makes live-preview work
      const freshData: ResumeData = JSON.parse(JSON.stringify(data));
      setDebouncedData(freshData);

      // Persist to localStorage as draft
      if (draftKey) {
        try {
          const dataWithTimestamp = { ...freshData, _savedAt: Date.now() };
          localStorage.setItem(draftKey, JSON.stringify(dataWithTimestamp));
        } catch (err) {
          console.error('LocalStorage save failed:', err);
        }
      }
      setSaveStatus('✅ Saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, draftKey]);

  // ─── Guest: Load chatcv_guest_data on mount ───────────────────
  useEffect(() => {
    if (!isGuest) return; // authenticated flow handled below
    try {
      const saved = localStorage.getItem(GUEST_DATA_KEY);
      if (saved) {
        const { _savedAt, ...guestData } = JSON.parse(saved);
        setData(guestData);
        setDebouncedData(guestData);
        toast.info('Welcome back! Your previous work has been restored.', { duration: 4000 });
      }
    } catch {
      localStorage.removeItem(GUEST_DATA_KEY);
    }
    setIsDataReady(true);
    setLoading(false);
    setTimeout(() => { isInitialLoad.current = false; }, 2000);
  }, [isGuest]);

  // ─── Guest: beforeunload warning ──────────────────────────────
  useEffect(() => {
    if (!isGuest) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const msg = 'आप बिना login किए अपना resume save नहीं करेंगे तो सारी details gayb ho jaye gi. क\'या आप sure हैं?';
      e.preventDefault();
      e.returnValue = msg; // Required for Chrome/Edge
      return msg;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isGuest]);

  // ─── Sync guest data to Firestore once user logs in ───────────
  useEffect(() => {
    if (!user) return; // still a guest
    const guestRaw = localStorage.getItem(GUEST_DATA_KEY);
    if (!guestRaw) return;
    try {
      const { _savedAt, ...guestData } = JSON.parse(guestRaw);
      // Only sync if the user just arrived at /builder without an id (fresh builder)
      if (!id) {
        // Apply guest data to form so they see their work
        setData(guestData);
        setDebouncedData(guestData);
        toast.success('Your guest draft has been loaded! Save it to your account.', { duration: 5000 });
      }
      // Clear guest data now that user is authenticated
      localStorage.removeItem(GUEST_DATA_KEY);
    } catch {
      localStorage.removeItem(GUEST_DATA_KEY);
    }
  }, [user]);



  // ─── Load from Firestore, then check for newer local draft ───
  // Only runs for authenticated users with a resume ID
  useEffect(() => {
    if (!id || !user) return; // guest flow handled in the effect above
    const fetchResume = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'resumes', id));
        if (docSnap.exists()) {
          const resumeData = docSnap.data() as Resume;
          if (resumeData.uid !== user.uid) {
            navigate('/dashboard');
            return;
          }
          setResume({ id: docSnap.id, ...resumeData });
          
          // Check for a local draft
          const perResumeDraftKey = `chatCV_draft_${id}`;
          const localDraft = localStorage.getItem(perResumeDraftKey);
          if (localDraft) {
            try {
              const parsed = JSON.parse(localDraft);
              // If local draft has a timestamp newer than the Firestore save, offer to restore
              if (parsed._savedAt && resumeData.lastModified) {
                const localTime = parsed._savedAt;
                const firestoreTime = (resumeData.lastModified as any)?.toMillis?.() || 0;
                if (localTime > firestoreTime) {
                  const { _savedAt, ...draftData } = parsed;
                  setData(draftData);
                  // CRITICAL FIX: Instantly provide the saved data to the PDF engine on load
                  setDebouncedData(draftData);
                  setIsDataReady(true);
                  toast.info('Restored your unsaved local draft.', { duration: 4000 });
                  // Mark initial load done so auto-save doesn't re-trigger immediately
                  setTimeout(() => { isInitialLoad.current = false; }, 2000);
                  setLoading(false);
                  return;
                }
              }
            } catch {
              // Invalid JSON in localStorage, ignore
              localStorage.removeItem(perResumeDraftKey);
            }
          }

          setData(resumeData.data);
          // CRITICAL FIX: Instantly provide the loaded data to the PDF engine
          setDebouncedData(resumeData.data);
          setIsDataReady(true);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setLoading(false);
        setTimeout(() => { isInitialLoad.current = false; }, 2000);
      }
    };
    fetchResume();
  }, [id, user, navigate]);

  // ─── Live Magic ───────────────────────────────────────────────
  // Save-status + auto-save are now handled inside the Master
  // Debounce effect above (Fix 2). No separate effects needed.

  const handleSave = async () => {
    if (isGuest) {
      // Guest: redirect to login with a hint
      toast.info('Please sign in to save your resume to the cloud!', { duration: 4000 });
      navigate('/login');
      return;
    }
    if (!id || !user) return;
    setSaving(true);
    const path = `resumes/${id}`;
    try {
      await updateDoc(doc(db, 'resumes', id), {
        title: resume?.title || 'Untitled Resume',
        data,
        lastModified: serverTimestamp()
      });
      // Clear local draft after successful cloud save
      const perResumeDraftKey = `chatCV_draft_${id}`;
      localStorage.removeItem(perResumeDraftKey);
      setSaveStatus('✅ Saved');
      toast.success("Resume saved to cloud!");
    } catch (err) {
      console.error("Error saving resume:", err);
      toast.error("Failed to save resume.");
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (e) {
        // Error already logged by handleFirestoreError
      }
    } finally {
      setSaving(false);
    }
  };

  // ─── Gated PDF Download Handler ──────────────────────────────
  const handleDownload = useCallback(async () => {
    if (isGuest) {
      toast.info('Please sign in to download your resume!', { duration: 4000 });
      navigate('/login');
      return;
    }
    if (tokens <= 0) {
      setShowAdModal(true);
      return;
    }
    // Deduct token first
    try {
      const remaining = await deductToken(1);
      toast.success(`1 Token deducted. Remaining: ${remaining} 🪙`, { duration: 3000 });
      // Generate a fresh PDF explicitly without the preview flag to secure premium features
      toast.info('Generating final PDF...', { duration: 2000 });
      const blob = await pdf(<ClassicTemplatePDF data={debouncedData} isPreview={false} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.fullName || 'Resume'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Download failed. Token was not deducted.');
    }
  }, [isGuest, tokens, deductToken, addToken, data.personalInfo.fullName, debouncedData, navigate]);


  const handleUnlockClassicIcons = async () => {
    if (isGuest) {
      toast.error('Please login to unlock Premium Icons.');
      return;
    }
    
    if (tokens >= 1) {
      try {
        await deductToken(1);
        setData(prev => ({ ...prev, hasUnlockedClassicIcons: true }));
        toast.success("Premium Icons unlocked successfully! 🎉");
      } catch (err) {
        toast.error("Failed to unlock Premium Icons.");
      }
    } else {
      setShowAdModal(true);
    }
  };

  const handleAIImprove = async (section: string, content: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Improve this professional resume ${section} to be more impactful, concise, and professional: "${content}". 
        Use industry-specific keywords and strong action verbs (e.g., "Spearheaded", "Orchestrated", "Optimized") where appropriate.`,
        config: { 
          systemInstruction: "You are an expert resume writer and career coach. Provide only the improved text without quotes or preamble.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });
      return response.text;
    } catch (err) {
      console.error("AI Error:", err);
      return content;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      {/* Action Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to={isGuest ? '/' : '/dashboard'} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
            <img src={desktopLogo} alt="ChatCV Logo" className="h-8 w-auto object-contain" />
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:block">
            <input
              type="text"
              value={resume?.title || ''}
              onChange={(e) => setResume(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="text-lg font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-48"
            />
          </div>
          {/* Live Magic Status Indicator */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            {saveStatus === '✅ Saved' && (
              <div className="flex items-center gap-1 text-emerald-500 transition-all">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Saved</span>
              </div>
            )}
            {saveStatus === 'Saving...' && (
              <div className="flex items-center gap-1 text-amber-500 transition-all">
                <Cloud className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Saving...</span>
              </div>
            )}
            {saveStatus === 'Typing...' && (
              <div className="flex items-center gap-1 text-indigo-400 transition-all">
                <Pencil className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Typing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ── Premium Token Box ── logged-in only ───────────── */}
          {!isGuest && <TokenBox user={user} />}

          {/* Guest Banner */}
          {isGuest && (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign in to save
            </Link>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl sm:hidden">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ${
              isGuest
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isGuest ? <LogIn className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{isGuest ? 'Login to Save' : 'Save'}</span>
          </button>
          {/* Gated Download Button — reads blob URL from BlobProvider below */}
          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold shadow-lg transition-all ${
              !isGuest && tokens === 0
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
            title={isGuest ? 'Sign in to download' : tokens === 0 ? 'No tokens — watch an ad to earn 1 free' : `Download PDF (costs 1 token)`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isGuest ? 'Download PDF' : tokens === 0 ? '🎬 Earn & Download' : 'Download PDF'}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Forms */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-8 bg-white border-r border-slate-200 ${viewMode === 'preview' ? 'hidden sm:block' : 'block'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-8 text-slate-400">
              <Layout className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Editor</span>
            </div>
            
            <ResumeForm data={data} setData={setData} onAIImprove={handleAIImprove} />
            
            <div className="mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Palette className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Themes & Styling</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Themes are fully guest-accessible — no auth guard ✓ */}
                {['classic', 'modern', 'creative', 'tech'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setData({ ...data, theme: t as any })}
                    className={`p-4 rounded-2xl border-2 transition-all capitalize font-bold ${data.theme === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                  >
                    {t === 'tech' ? 'Tech/Dev' : t}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {data.theme === 'classic' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl shadow-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            Premium Vector Icons
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">Enhance your Classic template with professional, high-res icons.</p>
                        </div>
                        
                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                          <div className="flex items-center justify-between sm:justify-end gap-3 bg-white px-3 py-2 rounded-lg border border-slate-200">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center cursor-pointer">
                              <Eye size={16} className="text-gray-600 mr-2" /> Preview (Free)
                            </label>
                            <button
                              onClick={() => setData({ ...data, previewPremiumIcons: !data.previewPremiumIcons })}
                              className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${data.previewPremiumIcons ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${data.previewPremiumIcons ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>

                          {data.hasUnlockedClassicIcons ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg text-xs font-bold w-full sm:w-auto">
                              <span>✅ Premium Icons Unlocked!</span>
                            </div>
                          ) : (
                            <button
                              onClick={handleUnlockClassicIcons}
                              className="relative overflow-hidden group bg-slate-900 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                              <span className="text-sm">💎</span>
                              <span className="text-xs whitespace-nowrap">Apply Icons (Cost: 1 Token)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-bold text-slate-700">Accent Color:</span>
                  <div className="flex gap-2">
                    {['#4f46e5', '#0ea5e9', '#10b981', '#f43f5e', '#f59e0b', '#111827'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setData({ ...data, accentColor: c })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${data.accentColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-sm font-bold text-slate-700">Skill Display Style:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'text', label: 'Text Only' },
                      { id: 'stars', label: 'Stars' },
                      { id: 'dots', label: 'Dots' },
                      { id: 'bar', label: 'Progress Bar' },
                      { id: 'circle', label: 'Circle' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setData({ ...data, skillDisplayStyle: s.id as any })}
                        className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${data.skillDisplayStyle === s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RIGHT PANEL: BULLETPROOF PDF LIVE PREVIEW
            Architecture: usePDF blob → native <iframe>
            ═══════════════════════════════════════════════════════════ */}
        <div className={`flex-1 overflow-hidden ${viewMode === 'edit' ? 'hidden sm:block' : 'block'}`}>
          {!isDataReady ? (
            <div className="w-full h-full relative bg-slate-50 flex flex-col items-center justify-center animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
              <p className="font-medium text-slate-600">Loading your draft...</p>
            </div>
          ) : (
            <BlobProvider document={<ClassicTemplatePDF data={debouncedData} isPreview={true} />}>
            {({ blob, url, loading, error }) => {
              // Keep ref in sync so gated download handler can always access latest URL
              if (url) pdfBlobUrlRef.current = url;
              if (error) {
                console.error("PDF Rendering Error:", error);
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                    <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                    <p className="font-bold text-lg text-red-500 mb-2">Error generating preview</p>
                    <p className="text-sm text-slate-600">{error.message || "Silent crash in TemplatePDF. Check for null/undefined text values."}</p>
                  </div>
                );
              }

              const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
              const isMobileView = window.innerWidth < 1024;
              const shouldShowButton = isMobileView && isTouchDevice;

              if (shouldShowButton) {
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-slate-50 p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-10 h-10 text-violet-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Your Resume is Ready</h3>
                      <p className="text-sm text-slate-500 max-w-xs">Tap below to open a full-screen, high-quality preview of your resume in a new tab.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (url) window.open(url, '_blank');
                        else toast.info('PDF is still generating, please wait...');
                      }}
                      disabled={loading}
                      className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-wait"
                      style={{ backgroundColor: '#7C3AED' }}
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> View Live Resume</>
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <div className="w-full h-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
                  {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
                      <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                      <p className="text-sm font-bold text-slate-700">Updating Live Preview...</p>
                      <p className="text-xs text-slate-400 mt-1">Generating your resume...</p>
                    </div>
                  )}

                  {url ? (
                    <iframe
                      src={`${url}#toolbar=0`}
                      className="w-full h-full border-none shadow-2xl"
                      title="Resume Live Preview"
                      key={url}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <p className="font-bold text-sm">Initializing PDF Engine...</p>
                    </div>
                  )}
                </div>
              );
            }}
          </BlobProvider>
          )}
        </div>
      </main>
      <AIChatbot />

      {/* ═══════════════════════════════════════════════════════
          AD MODAL — shown when tokens === 0
          ═══════════════════════════════════════════════════════ */}
      <EarnTokenModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
        addToken={addToken}
      />
    </div>
  );
}
