import { useNavigate } from 'react-router-dom';
import { Sparkles as SparklesIcon, FileText as FileTextIcon, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AIBuilderPage() {
  const navigate = useNavigate();
  const [terminalStep, setTerminalStep] = useState(0);
  
  const terminalMessages = [
    "> Initializing R-Labs Neural Engine...",
    "> Loading 10,000+ ATS-friendly data points...",
    "> Calibrating professional vocabulary...",
    "> Fine-tuning layout algorithms...",
    "> Training in progress. Please standby."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalStep((prev) => (prev + 1) % terminalMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {/* Glowing Icon with Animated Ring */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white p-8 rounded-[32px] shadow-[0_0_40px_rgba(59,130,246,0.6)] border border-blue-100 flex items-center justify-center animate-pulse">
            <SparklesIcon className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Badass Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
          The AI is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Training...</span>
        </h1>

        {/* Professional Message */}
        <p className="text-xl text-slate-500 max-w-2xl mb-8 leading-relaxed font-medium">
          R-Labs is building a revolutionary AI engine that will write your entire ATS-optimized resume in seconds. We are fine-tuning the magic. Until then, craft your masterpiece using our powerful standard builder.
        </p>

        {/* Dynamic AI Terminal */}
        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 mb-12 shadow-2xl border border-gray-800 text-left font-mono">
          <div className="flex gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="space-y-2">
            <p className="text-blue-400 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="opacity-50">internal_logs:</span>
            </p>
            <p className="text-gray-300 text-sm h-6 transition-all duration-500 ease-in-out">
              {terminalMessages[terminalStep]}
            </p>
          </div>
        </div>

        {/* Call to Action (Redirects to Dashboard/Editor) */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl text-xl hover:bg-slate-800 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 flex items-center gap-4 overflow-hidden animate-bounce hover:animate-none"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
          <span className="relative flex items-center gap-3">
            <FileTextIcon className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
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
