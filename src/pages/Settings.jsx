import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { AlertTriangle, Check, User, Shield, ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { PRESET_AVATARS } from '../lib/avatars';
import { ClayCard, ClayButton, ClayInput, ClayBadge } from '../components/ClayComponents';

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
      setSaveMessage('Budget settings updated.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error updating budget.');
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
    <div className="space-y-10 max-w-4xl mx-auto pb-32 lg:pb-0">
      <header>
        <h2 className="text-4xl font-black text-clay-foreground mb-2">Settings</h2>
        <p className="text-sm text-clay-muted font-bold uppercase tracking-widest">Manage your account</p>
      </header>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 rounded-[16px] px-8 py-4 text-sm font-black shadow-clayDeep border ${
            saveMessage.includes('Error') ? 'bg-clay-red/90 text-white border-clay-red' : 'bg-clay-green/90 text-white border-clay-green'
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      <div className="space-y-10">
        {/* Profile */}
        <ClayCard className="p-8 sm:p-10 bg-white/80">
          <h3 className="text-lg font-black text-clay-foreground mb-10 flex items-center gap-3">
            <User size={20} className="text-clay-accent" /> Profile Settings
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-10 mb-10">
            <div className="relative h-32 w-32 shrink-0 rounded-clay-md border-4 border-white bg-clay-canvas shadow-clayCard overflow-hidden">
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-clay-muted/5 text-4xl font-black text-clay-muted/20">
                  {profile?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Name</label>
                <ClayInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Email Address</label>
                <ClayInput type="email" value={session?.user?.email || ''} disabled className="opacity-50 cursor-not-allowed bg-clay-canvas shadow-clayPressed" />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Choose Avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {PRESET_AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.src)}
                  className={`relative p-1.5 rounded-clay-sm border-2 transition-all duration-300 ${
                    selectedAvatar === avatar.src 
                      ? 'border-clay-accent bg-white shadow-clayButton -translate-y-1' 
                      : 'border-transparent hover:border-clay-border'
                  }`}
                >
                  <img src={avatar.src} alt={avatar.label} className="h-full w-full rounded-[14px] object-cover" />
                  {selectedAvatar === avatar.src && (
                    <div className="absolute -top-2 -right-2 bg-clay-accent text-white rounded-full p-1 shadow-clayButton animate-clay-breathe">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <ClayButton onClick={handleSaveProfile} disabled={isSaving} variant="primary" className="w-full sm:w-auto h-14">
            {isSaving ? 'Updating...' : 'Save Profile'}
          </ClayButton>
        </ClayCard>

        {/* Resources */}
        <ClayCard className="p-8 sm:p-10 bg-white/80">
          <h3 className="text-lg font-black text-clay-foreground mb-10 flex items-center gap-3">
            <Shield size={20} className="text-clay-amber" /> Budget & Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Weekly Budget</label>
              <ClayInput type="number" value={weeklyBudget} onChange={(e) => setWeeklyBudget(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Currency</label>
              <div className="relative">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className="clay-input appearance-none cursor-pointer pr-12"
                >
                  <option value="₱">₱ PHP</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-clay-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Dietary Restrictions</label>
              <ClayInput value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Peanuts" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Health Goals</label>
              <ClayInput value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} placeholder="e.g. Gain Weight" />
            </div>
          </div>
          <ClayButton onClick={handleSavePreferences} disabled={isSaving} variant="success" className="w-full sm:w-auto h-14">
            {isSaving ? 'Updating...' : 'Save Settings'}
          </ClayButton>
        </ClayCard>

        {/* Danger Zone */}
        <ClayCard className="p-8 sm:p-10 border-l-8 border-clay-red bg-white/70">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-black text-clay-red flex items-center justify-center sm:justify-start gap-3">
                <AlertTriangle size={20} /> Danger Zone
              </h3>
              <p className="text-[10px] text-clay-muted mt-1 font-black uppercase tracking-[0.2em]">Permanently delete your data</p>
            </div>
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <ClayButton onClick={handleLogout} variant="ghost" size="sm" className="flex-1 sm:flex-none">
                <LogOut size={16} className="mr-2" /> Sign Out
              </ClayButton>
              <ClayButton onClick={() => setShowDeleteModal(true)} variant="danger" size="sm" className="flex-1 sm:flex-none bg-clay-red/10 text-clay-red shadow-none hover:bg-clay-red hover:text-white">
                <Trash2 size={16} className="mr-2" /> Delete Account
              </ClayButton>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-clay-foreground/60 backdrop-blur-md p-6">
            <ClayCard className="w-full max-w-md p-10 bg-white border-clay-red/30 shadow-clayDeep">
              <h3 className="text-2xl font-black text-clay-foreground mb-4">Are you sure?</h3>
              <p className="text-sm text-clay-muted mb-8 leading-relaxed font-medium">This action will permanently delete your account and all associated data. Type <span className="text-clay-red font-black">DELETE</span> to confirm.</p>
              <ClayInput type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="h-14 text-center text-lg font-black mb-6 shadow-clayPressed" placeholder="CONFIRM" />
              <div className="flex gap-4">
                <ClayButton onClick={() => setShowDeleteModal(false)} variant="ghost" className="flex-1">Cancel</ClayButton>
                <ClayButton onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE' || isDeleting} variant="danger" className="flex-1">Confirm</ClayButton>
              </div>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
