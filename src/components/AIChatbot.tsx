import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function AIChatbot() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/ai-assistant')}
      className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:bg-purple-700 transition-all z-[100] group animate-bounce hover:animate-none"
    >
      <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">AI</span>
    </button>
  );
}
