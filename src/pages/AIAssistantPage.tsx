import { useNavigate } from 'react-router-dom';
import { Bot, Terminal, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

export default function AIAssistantPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const [terminalStep, setTerminalStep] = useState(0);
  
  const terminalMessages = [
    "> Establishing secure connection to R-Labs...",
    "> Loading interview-winning strategies...",
    "> Integrating grammar & tone perfection modules...",
    "> Calibrating contextual chatbot...",
    "> AI Assistant will be online soon. Standby."
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
        {/* Glowing Bot Icon */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white p-8 rounded-[32px] shadow-[0_0_40px_rgba(168,85,247,0.6)] border border-purple-100 flex items-center justify-center animate-bounce duration-[3000ms]">
            <Bot className="w-16 h-16 text-purple-600" />
          </div>
        </div>

        {/* Badass Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
          Your Personal Career Coach is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Waking Up...</span>
        </h1>

        {/* Professional Message */}
        <p className="text-xl text-slate-500 max-w-2xl mb-8 leading-relaxed font-medium">
          R-Labs is building an intelligent chat assistant that will sit right next to your editor, providing real-time suggestions, writing bullet points, and fixing grammar on the fly.
        </p>

        {/* Dynamic Boot Sequence (Terminal Box) */}
        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 mb-12 shadow-2xl border border-gray-800 text-left font-mono">
          <div className="flex gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="space-y-2">
            <p className="text-purple-400 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="opacity-50">boot_sequence:</span>
            </p>
            <p className="text-gray-300 text-sm h-6 transition-all duration-500 ease-in-out">
              {terminalMessages[terminalStep]}
            </p>
          </div>
        </div>

        {/* Call to Action (Redirects to Dashboard/Editor) */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl text-xl hover:bg-slate-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 flex items-center gap-4 overflow-hidden"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
          <span className="relative flex items-center gap-3">
            <MessageSquare className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
            Continue Crafting (Standard Editor)
          </span>
        </button>

        {/* Decorative background blobs */}
        <div className="fixed top-1/4 -right-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl -z-10 animate-blob"></div>
        <div className="fixed bottom-1/4 -left-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl -z-10 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
