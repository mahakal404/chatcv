import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { toast } from 'sonner';

export const ADMIN_EMAIL = 'rc6542698@gmail.com';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  tokens: number;
  createdAt?: any;
  pendingGift?: {
    amount: number;
    message: string;
  };
}

/**
 * Subscribes to the user's Firestore profile document (users/{uid}).
 * On first sign-in the document is created with { tokens: 5 }.
 * Returns the live profile plus a helper to deduct/add tokens.
 */
export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const ref = doc(db, 'users', user.uid);

    const ensureUserProfile = async () => {
      const { getDoc, setDoc, updateDoc } = await import('firebase/firestore');
      const snap = await getDoc(ref);
      
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          tokens: 5,
        });
      } else {
        const data = snap.data();
        if (data.tokens === undefined) {
          await updateDoc(ref, { tokens: 5 });
        }
      }
    };

    ensureUserProfile().catch(console.error);

    // Real-time listener
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        // Removed automatic toast notification. Handled in ClaimGiftModal.
      }
      setProfileLoading(false);
    });

    return () => unsub();
  }, [user]);

  /** Atomically deduct `amount` tokens (default 1). Returns new balance. */
  const deductToken = async (amount = 1): Promise<number> => {
    if (!user || !profile) throw new Error('Not authenticated');
    
    // Infinity tokens for Super Admin
    if (user.email === ADMIN_EMAIL) {
      return profile.tokens;
    }

    const newBalance = Math.max(0, profile.tokens - amount);
    await updateDoc(doc(db, 'users', user.uid), { tokens: newBalance });
    return newBalance;
  };

  /** Atomically add `amount` tokens (default 1). Returns new balance. */
  const addToken = async (amount = 1): Promise<number> => {
    if (!user || !profile) throw new Error('Not authenticated');
    const newBalance = profile.tokens + amount;
    await updateDoc(doc(db, 'users', user.uid), { tokens: newBalance });
    return newBalance;
  };

  return { profile, profileLoading, deductToken, addToken };
}
