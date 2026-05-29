import React, { useState, useCallback } from 'react';
import { Coins, Download, Play, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';

interface EarnTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToken: (amount?: number) => Promise<number>;
}

export default function EarnTokenModal({ isOpen, onClose, addToken }: EarnTokenModalProps) {
  const [adWatching, setAdWatching] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  const handleWatchAd = useCallback(async () => {
    setAdWatching(true);
    setAdCountdown(5);
    
    // Count down 5 seconds
    for (let i = 5; i >= 1; i--) {
      await new Promise<void>((res) => setTimeout(res, 1000));
      setAdCountdown(i - 1);
    }
    
    // Credit token
    try {
      const newBalance = await addToken(1);
      onClose();
      setAdWatching(false);
      toast.success(`🎉 Success! 1 Token credited. Balance: ${newBalance} 🪙`, { duration: 4000 });
    } catch (err) {
      console.error('Ad credit error:', err);
      toast.error('Failed to credit token. Please try again.');
      setAdWatching(false);
    }
  }, [addToken, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Earn tokens by watching an ad">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={() => { if (!adWatching) onClose(); }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 pt-10 pb-12 text-white text-center">
          {/* Close button */}
          {!adWatching && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}

          {/* Coin icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Coins className="w-10 h-10 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-1">🪙 Out of Tokens?</h2>
          <p className="text-white/80 text-sm font-medium">
            Watch a short video ad to get<br />
            <span className="text-yellow-300 font-extrabold text-base">1 FREE Token</span> instantly.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-6">
          {/* Token info card */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">1 Token = 1 PDF Download</p>
              <p className="text-xs text-slate-500 mt-0.5">You can earn unlimited free tokens.</p>
            </div>
          </div>

          {/* Ad Button */}
          {!adWatching ? (
            <button
              id="watch-ad-btn"
              onClick={handleWatchAd}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-extrabold text-base hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-white" />
              🎥 Watch Ad to Earn 1 Token
            </button>
          ) : (
            <div className="w-full flex flex-col items-center gap-3 bg-slate-900 text-white py-5 rounded-2xl">
              {/* Fake video player */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-violet-400 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold">
                  {adCountdown > 0 ? adCountdown : '🎉'}
                </span>
              </div>
              <p className="text-sm font-bold text-white/80">Watching Ad... 🎬</p>
              {adCountdown > 0 && (
                <p className="text-xs text-white/50">Token will be credited in {adCountdown}s</p>
              )}
            </div>
          )}

          <p className="text-center text-xs text-slate-400 mt-4">
            No credit card required · Unlimited free downloads via ads
          </p>
        </div>
      </div>
    </div>
  );
}
