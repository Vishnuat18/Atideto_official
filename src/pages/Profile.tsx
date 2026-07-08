import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Shield, Key, LogOut } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '@/components/seo/SEO';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { name: displayName });
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!auth.currentUser || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsUpdating(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword('');
      toast.success('Password updated successfully');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in to update your password.');
      } else {
        toast.error('Failed to update password');
      }
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 md:px-12">
      <SEO title="Profile | ATIDETO" description="Manage your ATIDETO profile." noindex={true} />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-[0_0_15px_rgba(0,82,255,0.2)] mb-4">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-[#AFAFAF] text-sm mb-4">{user.email}</p>
            <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium uppercase tracking-wider">
              {user.role}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'general' ? 'bg-white/10 text-white' : 'text-[#AFAFAF] hover:bg-white/5 hover:text-white'}`}
          >
            <User size={18} /> General Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-[#AFAFAF] hover:bg-white/5 hover:text-white'}`}
          >
            <Key size={18} /> Security
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-400/10 transition-colors mt-8"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-8">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-2xl font-bold mb-1">General Settings</h3>
                <p className="text-[#AFAFAF] text-sm">Manage your account details and preferences.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#AFAFAF] mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#050505] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EA8FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#AFAFAF] mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user.email || ''} 
                    disabled
                    className="w-full bg-[#050505]/50 border border-white/10 rounded-lg px-4 py-3 text-[#AFAFAF] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#AFAFAF] mt-2">Email addresses cannot be changed once registered.</p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-[#2EA8FF] hover:bg-[#1C8DDB] disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Admin Only Block */}
              {user.role === 'admin' && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-4 text-[#2EA8FF]">
                    <Shield size={24} />
                    <h3 className="text-xl font-bold text-white">System Access</h3>
                  </div>
                  <p className="text-[#AFAFAF] text-sm mb-6">
                    You have elevated permissions. As an administrator, you can access the core platform settings, manage users, and view sensitive metrics.
                  </p>
                  <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-lg font-medium transition-colors">
                    Go to Admin Console
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-2xl font-bold mb-1">Security Settings</h3>
                <p className="text-[#AFAFAF] text-sm">Update your password and secure your account.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#AFAFAF] mb-2">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-[#050505] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EA8FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#AFAFAF] mb-2">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#050505] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EA8FF] transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isUpdating || !newPassword}
                    className="px-6 py-3 bg-[#2F2FE4] hover:bg-[#3A3DFF] disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
