import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { User } from 'firebase/auth';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronLeft, Save, Download, Layout, Palette, Eye, Edit3, Sparkles, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { ResumeData, Resume } from '../types';
import ResumeForm from '../components/ResumeForm';
import AIChatbot from '../components/AIChatbot';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

import { PDFViewer, PDFDownloadLink, usePDF } from '@react-pdf/renderer';
import ClassicTemplatePDF from '../components/templates/ClassicTemplatePDF';
import * as pdfjsLib from 'pdfjs-dist';

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

// ─── Debounce Hook ─────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

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
  languageDisplayStyle: 'text',
  customSections: []
};

export default function BuilderPage({ user }: { user: User }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const isMobile = useIsMobile();

  // Debounce resume data updates to avoid excessive PDF re-renders
  const debouncedData = useDebounce(data, 800);

  // Generate PDF instance using the usePDF hook for mobile preview
  const pdfDocument = useMemo(
    () => <ClassicTemplatePDF data={debouncedData} />,
    [debouncedData]
  );
  const [instance, updateInstance] = usePDF({ document: pdfDocument });

  // Update the PDF instance whenever debounced data changes
  useEffect(() => {
    updateInstance(<ClassicTemplatePDF data={debouncedData} />);
  }, [debouncedData, updateInstance]);

  useEffect(() => {
    if (!id) return;
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
          setData(resumeData.data);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, user.uid, navigate]);

  const handleSave = async () => {
    if (!id || !user) return;
    setSaving(true);
    const path = `resumes/${id}`;
    try {
      await updateDoc(doc(db, 'resumes', id), {
        title: resume?.title || 'Untitled Resume',
        data,
        lastModified: serverTimestamp()
      });
      toast.success("Resume saved successfully!");
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
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="logo-icon-gradient p-1.5 rounded-full shadow-lg shadow-brand-indigo/20 relative group">
              <Sparkles className="text-white w-4 h-4" />
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
            </div>
            <span className="text-lg font-black tracking-tighter hidden sm:block">
              <span className="text-brand-indigo">Chat</span><span className="text-brand-pink">CV</span>
            </span>
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
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
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
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Save</span>
          </button>
          <PDFDownloadLink
            document={<ClassicTemplatePDF data={data} />}
            fileName={`${data.personalInfo.fullName || 'Resume'}.pdf`}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            {({ loading: pdfLoading }) => (
              <>
                {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{pdfLoading ? 'Preparing...' : 'Download PDF'}</span>
              </>
            )}
          </PDFDownloadLink>
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

        {/* Right Panel: Live PDF Preview */}
        <div className={`flex-1 overflow-hidden bg-slate-200 ${viewMode === 'edit' ? 'hidden sm:block' : 'block'}`}>
          {isMobile ? (
            <MobilePDFPreview
              blobUrl={instance.url}
              loading={instance.loading}
            />
          ) : (
            <PDFViewer
              width="100%"
              height="100%"
              showToolbar={false}
              style={{ border: 'none' }}
            >
              <ClassicTemplatePDF data={data} />
            </PDFViewer>
          )}
        </div>
      </main>
      <AIChatbot />
    </div>
  );
}
