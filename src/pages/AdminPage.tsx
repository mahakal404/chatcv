import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { ADMIN_EMAIL, UserProfile } from '../hooks/useUserProfile';
import { Navigate, Link } from 'react-router-dom';
import { ChevronLeft, Gift, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage({ user }: { user: User | null }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [giftingId, setGiftingId] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState(5);

  // Secure route
  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/dashboard" />;
  }

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const fetchedUsers = snap.docs.map((doc) => doc.data() as UserProfile);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGift = async (targetUser: UserProfile) => {
    if (giftAmount <= 0) return;
    setGiftingId(targetUser.uid);
    try {
      const ref = doc(db, 'users', targetUser.uid);
      await updateDoc(ref, {
        pendingGift: {
          amount: giftAmount,
          message: `Admin has gifted you ${giftAmount} tokens! 🎉`
        }
      });
      toast.success(`Successfully gifted ${giftAmount} tokens to ${targetUser.email}`);
      // Refresh list
      await fetchUsers();
    } catch (err) {
      console.error('Error gifting tokens:', err);
      toast.error('Failed to gift tokens');
    } finally {
      setGiftingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Super Admin <span className="text-xl px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">∞</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage users and distribute tokens</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100/50 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Tokens</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm flex-shrink-0">
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.displayName || 'Unnamed User'}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-bold">
                          {u.tokens} 🪙
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="1"
                            value={giftAmount}
                            onChange={(e) => setGiftAmount(parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1.5 text-center text-sm font-bold border-none ring-1 ring-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleGift(u)}
                            disabled={giftingId === u.uid}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-95"
                          >
                            {giftingId === u.uid ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Gift className="w-4 h-4" />
                            )}
                            Gift
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
