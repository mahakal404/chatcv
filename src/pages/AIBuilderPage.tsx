import { useNavigate } from 'react-router-dom';
import { Sparkles as SparklesIcon, FileText as FileTextIcon } from 'lucide-react';

export default function AIBuilderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {/* Glowing Icon */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 flex items-center justify-center">
            <SparklesIcon className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Badass Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
          The AI is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Training...</span>
        </h1>

        {/* Professional Message */}
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
          R-Labs is building a revolutionary AI engine that will write your entire ATS-optimized resume in seconds. We are fine-tuning the magic. Until then, craft your masterpiece using our powerful standard builder.
        </p>

        {/* Call to Action (Redirects to Dashboard/Editor) */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl text-xl hover:bg-slate-800 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 flex items-center gap-4 overflow-hidden"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
          <span className="relative flex items-center gap-3">
            <FileTextIcon className="w-6 h-6" />
            Build Manually (Standard Editor)
          </span>
        </button>

        {/* Decorative background blobs */}
        <div className="fixed top-1/4 -left-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-blob"></div>
        <div className="fixed bottom-1/4 -right-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}
