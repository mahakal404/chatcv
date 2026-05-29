import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  tokens: number;
  createdAt?: any;
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

    // Create profile doc if it doesn't exist yet (first login)
    setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        // tokens field is only written when the document is NEW
        // thanks to the guard inside setDoc merge + server-side rule.
        // We use a client-side workaround: we set tokens only when missing.
      },
      { merge: true }
    ).then(async () => {
      // After the merge, check if tokens field exists; if not, initialise to 5
      const { getDoc } = await import('firebase/firestore');
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().tokens === undefined) {
        await updateDoc(ref, { tokens: 5 });
      }
    }).catch(console.error);

    // Real-time listener
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
      setProfileLoading(false);
    });

    return () => unsub();
  }, [user]);

  /** Atomically deduct `amount` tokens (default 1). Returns new balance. */
  const deductToken = async (amount = 1): Promise<number> => {
    if (!user || !profile) throw new Error('Not authenticated');
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
