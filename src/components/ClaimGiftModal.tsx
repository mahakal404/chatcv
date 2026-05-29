import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc, deleteField, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';

interface ClaimGiftModalProps {
  user: User | null;
}

export default function ClaimGiftModal({ user }: ClaimGiftModalProps) {
  const { profile } = useUserProfile(user);
  const [claiming, setClaiming] = useState(false);

  if (!profile?.pendingGift || profile.pendingGift.amount <= 0) {
    return null;
  }

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        tokens: increment(profile.pendingGift!.amount),
        pendingGift: deleteField(),
      });
      toast.success(`Successfully claimed ${profile.pendingGift!.amount} tokens! 🎉`);
    } catch (err) {
      console.error("Error claiming gift:", err);
      toast.error("Failed to claim gift. Try again later.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center overflow-hidden flex flex-col items-center"
        >
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-7xl mb-6 relative z-10 filter drop-shadow-2xl"
          >
            🎁
          </motion.div>
          
          <h2 className="text-3xl font-extrabold text-white mb-3 relative z-10 tracking-tight">
            🎉 Surprise Gift!
          </h2>
          
          <p className="text-indigo-100 mb-8 relative z-10 leading-relaxed font-medium">
            {profile.pendingGift.message || `Admin has sent you a special gift of ${profile.pendingGift.amount} Tokens.`}
          </p>
          
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="relative z-10 w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 text-lg flex items-center justify-center gap-2"
          >
            {claiming ? "Claiming... ✨" : "🎁 Open Gift & Claim Tokens"}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
