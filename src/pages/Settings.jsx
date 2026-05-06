import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { AlertTriangle, Check, User, Shield, ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { PRESET_AVATARS } from '../lib/avatars';

const PremiumInput = (props) => (
  <input
    className="h-12 w-full glass-input px-4 font-body text-sm placeholder:text-premium-text-muted transition-all"
    {...props}
  />
);

const Settings = () => {
  const { session, logout, profile, budget, metrics, preferences, allergies, healthConditions, setProfile, setBudget, setMetrics, setPreferences, setAllergies, setHealthConditions, saveProfile, saveBudget, savePreferences } = useUser();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.photo || null);
  
  // Form states
  const [name, setName] = useState(profile?.name || '');
  const [currency, setCurrency] = useState(budget?.currency || '₱');
  const [weeklyBudget, setWeeklyBudget] = useState(budget?.weekly || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const newProfile = { ...profile, name, photo: selectedAvatar };
      const userData = { profile: newProfile, metrics, budget: { weekly: weeklyBudget, currency }, preferences, allergies, healthConditions };
      await saveProfile(userData);
      setProfile(newProfile);
      setSaveMessage('Profile updated successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const userData = { profile, metrics, budget: { weekly: weeklyBudget, currency }, preferences, allergies, healthConditions };
      await saveBudget(userData);
      await savePreferences(userData);
      setBudget({ weekly: weeklyBudget, currency });
      setSaveMessage('Resource protocols updated.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error updating protocols.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    try {
      const userId = session.user.id;
      await supabase.from('meal_plans').delete().eq('user_id', userId);
      await supabase.from('user_preferences').delete().eq('user_id', userId);
      await supabase.from('user_budgets').delete().eq('user_id', userId);
      await supabase.from('user_profiles').delete().eq('user_id', userId);
      await logout();
      navigate('/login');
    } catch (err) {
      setDeleteError('Failed to delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-32 lg:pb-0">
      <header>
        <h2 className="font-heading text-3xl font-bold text-white mb-2">System Config</h2>
        <p className="text-sm text-premium-text-secondary font-medium uppercase tracking-widest">Operational Protocols</p>
      </header>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 rounded-lg px-6 py-3 text-xs font-bold text-premium-bg shadow-lg ${
            saveMessage.includes('Error') ? 'bg-red-500' : 'bg-premium-emerald'
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Profile */}
        <div className="glass-card p-6 sm:p-8 rounded-premium-lg">
          <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-2">
            <User size={16} className="text-premium-emerald" /> Identity Settings
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            <div className="relative h-24 w-24 shrink-0 rounded-premium border border-premium-emerald/30 bg-premium-bg overflow-hidden shadow-lg">
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-white/5 font-heading text-3xl font-bold text-white/20">
                  {profile?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Member Name</label>
                <PremiumInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Email</label>
                <PremiumInput type="email" value={session?.user?.email || ''} disabled className="opacity-50 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Select Avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {PRESET_AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.src)}
                  className={`relative p-1 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar.src ? 'border-premium-emerald bg-premium-emerald/5' : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <img src={avatar.src} alt={avatar.label} className="h-full w-full rounded-md object-cover" />
                  {selectedAvatar === avatar.src && (
                    <div className="absolute -top-1 -right-1 bg-premium-emerald rounded-full p-0.5 shadow-lg">
                      <Check size={8} className="text-premium-bg" strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={isSaving} className="w-full sm:w-auto px-8 py-3 rounded-premium bg-premium-emerald text-premium-bg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
            {isSaving ? 'Updating...' : 'Save Profile'}
          </button>
        </div>

        {/* Resources */}
        <div className="glass-card p-6 sm:p-8 rounded-premium-lg">
          <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-2">
            <Shield size={16} className="text-premium-amber" /> Resource Protocols
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Weekly Budget</label>
              <PremiumInput type="number" value={weeklyBudget} onChange={(e) => setWeeklyBudget(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Currency</label>
              <div className="relative">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-12 w-full glass-input px-4 font-body text-sm appearance-none cursor-pointer">
                  <option value="₱">₱ PHP</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-premium-text-muted" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Restrictions</label>
              <PremiumInput value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Peanuts" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-wider ml-1">Conditions</label>
              <PremiumInput value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} placeholder="e.g. Diabetes" />
            </div>
          </div>
          <button onClick={handleSavePreferences} disabled={isSaving} className="w-full sm:w-auto px-8 py-3 rounded-premium bg-premium-amber text-premium-bg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
            {isSaving ? 'Updating...' : 'Save Protocols'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 sm:p-8 rounded-premium-lg border border-red-500/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-red-500 flex items-center justify-center sm:justify-start gap-2">
                <AlertTriangle size={16} /> Danger Zone
              </h3>
              <p className="text-[10px] text-premium-text-muted mt-1 uppercase tracking-widest">Account and data deletion</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button onClick={handleLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] font-bold text-white uppercase tracking-widest">
                <LogOut size={12} /> Sign Out
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-[10px] font-bold text-red-500 uppercase tracking-widest">
                <Trash2 size={12} /> Purge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm glass-card p-8 rounded-premium-lg border-red-500/30">
              <h3 className="text-lg font-bold text-white mb-4">Purge Account</h3>
              <p className="text-xs text-premium-text-secondary mb-6 leading-relaxed">This action will permanently delete all your data. Type <span className="text-red-500 font-bold">DELETE</span> below.</p>
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="h-12 w-full glass-input px-4 text-center text-sm font-bold mb-4 focus:ring-red-500/50" placeholder="CONFIRM" />
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 text-[10px] font-bold text-white uppercase border border-white/10 rounded-lg">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE' || isDeleting} className="flex-1 py-3 text-[10px] font-bold text-premium-bg bg-red-600 rounded-lg disabled:opacity-30">Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
