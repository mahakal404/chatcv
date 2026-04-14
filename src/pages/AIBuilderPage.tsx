import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Download, Save, Sparkles, Loader2, FileText, User as UserIcon, Mic, MicOff, Paperclip, X, AlertCircle, Palette, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { ResumeData } from '../types';
import ResumePreview from '../components/ResumePreview';
import html2pdf from 'html2pdf.js';
import { getGeminiResponse } from '../lib/gemini';

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
  customSections: [],
  theme: 'modern',
  accentColor: '#8b5cf6',
  skillDisplayStyle: 'text',
  languageDisplayStyle: 'text'
};

const THEMES = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'creative', name: 'Creative' },
  { id: 'tech', name: 'Tech/Dev' }
];

const COLORS = [
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
];

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => (
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
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="text-amber-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Manual Edit Mode</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Are you sure you want to edit manually? This will override the AI's generation for this section and may affect future AI suggestions.
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
              className="flex-1 px-6 py-3 rounded-xl font-bold bg-brand-purple text-white hover:bg-purple-700 shadow-lg shadow-brand-purple/20 transition-all"
            >
              Yes, Edit
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function AIBuilderPage({ user }: { user: User }) {
  const [data, setData] = useState<ResumeData>({
    ...INITIAL_DATA,
    personalInfo: { ...INITIAL_DATA.personalInfo, fullName: user.displayName || '', email: user.email || '' }
  });
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; file?: string }[]>([
    { role: 'ai', text: `Hi ${user.displayName || 'there'}! I'm your ChatCV AI Copilot ✨ I'll guide you through building a polished, professional resume step by step. Let's start — what's your full name?` }
  ]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'preview'>('chat');
  const [isExporting, setIsExporting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<() => void>(() => {});
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const [mime, data] = base64.split(';base64,');
      setAttachedFile({
        data: data,
        mimeType: mime.split(':')[1],
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || loading) return;

    const userMsg = input.trim();
    const fileToUpload = attachedFile;
    
    setInput('');
    setAttachedFile(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMsg || (fileToUpload ? `Uploaded: ${fileToUpload.name}` : ''),
      file: fileToUpload?.name
    }]);
    setLoading(true);

    try {
      const result = await getGeminiResponse(userMsg, data, chatHistory, fileToUpload || undefined);
      
      console.log("AI Response:", result);

      if (result.resumeUpdates) {
        setData(prev => {
          const newData = { ...prev };
          Object.keys(result.resumeUpdates).forEach(key => {
            const k = key as keyof ResumeData;
            const updateValue = result.resumeUpdates[k];

            if (updateValue === undefined || updateValue === null) return;

            // Deep merge for personalInfo
            if (k === 'personalInfo' && typeof updateValue === 'object') {
              newData.personalInfo = { ...newData.personalInfo, ...updateValue as any };
            } 
            // For arrays, we trust the AI to provide the full updated array as per the new prompt instructions
            else {
              newData[k] = updateValue as any;
            }
          });
          return newData;
        });
        toast.success("Resume updated live! ✨", { duration: 2000 });
      }

      setMessages(prev => [...prev, { role: 'ai', text: result.chatMessage }]);
      
      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMsg || `Analyzed document: ${fileToUpload?.name}` }] },
        { role: 'model', parts: [{ text: JSON.stringify(result) }] }
      ]);

    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I had a bit of trouble processing that. Could you try again or provide the information more clearly?" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEdit = (callback: () => void) => {
    setPendingEdit(() => callback);
    setShowConfirmModal(true);
  };

  const confirmManualEdit = () => {
    pendingEdit();
    setShowConfirmModal(false);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      alert("Voice input is a placeholder in this demo. Please type your message.");
      setIsListening(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    setSaving(true);
    const path = 'resumes';
    try {
      await addDoc(collection(db, path), {
        uid: user.uid,
        title: `${data.personalInfo.fullName || 'New'} Resume (AI Built)`,
        lastModified: serverTimestamp(),
        data: data
      });
      toast.success("Resume saved successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Error saving resume:", err);
      toast.error("Failed to save resume. Please try again.");
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (e) {
        // Error already logged by handleFirestoreError
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) {
      toast.error("Preview not ready. Please wait.");
      return;
    }
    
    const toastId = toast.loading("Preparing your PDF...");
    setIsExporting(true);
    
    try {
      // Small delay to allow React to re-render without edit buttons
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const element = previewRef.current;
      
      // Create a temporary container to render the resume without scaling
      const container = document.createElement('div');
      container.id = 'pdf-temp-container';
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.backgroundColor = 'white';
      document.body.appendChild(container);
      
      // Clone the element
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.width = '210mm';
      clone.style.minHeight = '297mm';
      container.appendChild(clone);

      const opt = {
        margin: 0,
        filename: `${data.personalInfo.fullName || 'Resume'}_AI.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          logging: false,
          windowWidth: 794, // 210mm at 96dpi
          onclone: (clonedDoc: Document) => {
            const elements = clonedDoc.getElementsByTagName('*');
            const originalElements = element.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const clonedEl = elements[i] as HTMLElement;
              const originalEl = originalElements[i] as HTMLElement;
              if (originalEl && clonedEl.style) {
                const style = window.getComputedStyle(originalEl);
                // Force computed colors to avoid oklch parsing errors in html2canvas
                if (style.color.includes('oklch')) clonedEl.style.color = 'inherit';
                if (style.backgroundColor.includes('oklch')) clonedEl.style.backgroundColor = 'transparent';
                if (style.borderColor.includes('oklch')) clonedEl.style.borderColor = 'transparent';
                
                // Also handle any inline styles that might have oklch
                const inlineStyle = clonedEl.getAttribute('style');
                if (inlineStyle && inlineStyle.includes('oklch')) {
                  clonedEl.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/g, '#000000'));
                }
              }
            }
          }
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      // Use the promise-based API
      const worker = html2pdf().set(opt).from(clone);
      await worker.save();
      
      // Cleanup
      document.body.removeChild(container);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("PDF Error:", err);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
      // Cleanup if failed
      const container = document.getElementById('pdf-temp-container');
      if (container) document.body.removeChild(container);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <ConfirmModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={confirmManualEdit} 
      />
      
      {/* Header */}
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
            <span className="text-lg font-black tracking-tighter">
              <span className="text-brand-indigo">Chat</span><span className="text-brand-pink">CV</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl sm:hidden">
            <button
              onClick={() => setViewMode('chat')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'chat' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500'}`}
            >
              <Send className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'preview' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500'}`}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Save to Cloud</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-brand-purple/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat Interface */}
        <div className={`flex-1 flex flex-col bg-white border-r border-slate-200 ${viewMode === 'preview' ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-purple flex items-center justify-center shadow-lg shadow-brand-purple/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">ChatCV AI Copilot</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Powered by Gemini · Multimodal</span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-purple shadow-lg shadow-brand-purple/20' : 'bg-slate-200'}`}>
                      {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-brand-purple" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand-purple text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                      {msg.text}
                      {msg.file && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-white/10 rounded-lg text-xs">
                          <FileText className="w-3 h-3" />
                          {msg.file}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-brand-purple/40 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-brand-purple/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-brand-purple/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
            <div className="max-w-2xl mx-auto space-y-4">
              {attachedFile && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-brand-purple" />
                    <span className="truncate max-w-[200px] font-bold">{attachedFile.name}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-slate-200 rounded-full transition-all">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your answer..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 transition-all font-medium"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept="image/*,.pdf"
                  />
                  <button
                    onClick={toggleListening}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && !attachedFile)}
                  className="bg-brand-purple text-white p-4 rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-brand-purple/20"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                📎 Upload certificates or degrees · Preview updates live
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className={`flex-1 bg-slate-200 overflow-y-auto flex flex-col ${viewMode === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
          {/* Toolbar */}
          <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                <select 
                  value={data.theme}
                  onChange={(e) => setData({...data, theme: e.target.value as any})}
                  className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Skills:</span>
                {[
                  { id: 'text', label: 'Text' },
                  { id: 'stars', label: 'Stars' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'bar', label: 'Bar' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setData({ ...data, skillDisplayStyle: style.id as any })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      data.skillDisplayStyle === style.id 
                        ? 'bg-brand-purple text-white shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setData({...data, accentColor: color})}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${data.accentColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-brand-purple/20 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="flex-1 p-4 sm:p-12 flex justify-center">
            <div className="sticky top-20 h-fit">
              <div className="bg-white shadow-2xl shadow-slate-400 rounded-sm origin-top scale-[0.5] sm:scale-[0.7] lg:scale-[0.85] xl:scale-100 transition-transform">
                <ResumePreview 
                  data={data} 
                  ref={previewRef} 
                  isExporting={isExporting}
                  onUpdate={(newData) => setData(newData)}
                  onManualEditRequest={handleManualEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
