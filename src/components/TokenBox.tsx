import { User } from 'firebase/auth';
import { Coins } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';

interface TokenBoxProps {
  user: User | null;
}

/**
 * Premium Token Balance Box.
 * Self-contained: subscribes to Firestore via useUserProfile.
 * Renders nothing for guests (user === null) or while profile is loading.
 * Fully responsive — compact on mobile, full-size on sm+.
 */
export default function TokenBox({ user }: TokenBoxProps) {
  const { profile } = useUserProfile(user);

  // Don't render for guests or before profile is loaded
  if (!user || !profile) return null;

  const tokens = profile.tokens ?? 0;

  const gradientClass =
    tokens === 0
      ? 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400/40'
      : tokens <= 2
      ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400/40'
      : 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-400/40';

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border shadow-lg transition-all cursor-default select-none ${gradientClass} shadow-indigo-200`}
      title="Tokens are used for PDF downloads. Watch an ad to earn more."
    >
      {/* Spinning coin icon */}
      <div className="relative flex-shrink-0">
        <Coins
          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 drop-shadow-sm"
          style={{ animation: 'spin 4s linear infinite' }}
        />
      </div>

      {/* Balance text */}
      <div className="flex flex-col leading-tight">
        <span className="text-[7px] sm:text-[9px] font-bold text-white/70 uppercase tracking-widest">
          Balance
        </span>
        <span className="text-[11px] sm:text-sm font-extrabold text-white leading-none">
          {tokens} 🪙
        </span>
      </div>
    </div>
  );
}
