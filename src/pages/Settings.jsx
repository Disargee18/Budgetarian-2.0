import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, clayButton, scaleIn } from '../lib/animations';
import { supabase } from '../lib/supabaseClient';
import { AlertTriangle, Check } from 'lucide-react';
import { PRESET_AVATARS } from '../lib/avatars';

const ClayInput = (props) => (
  <input
    className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
    {...props}
  />
);

const Settings = () => {
  const { logout, profile, budget, metrics, preferences, allergies, healthConditions, setProfile, setBudget, setMetrics, setPreferences, setAllergies, setHealthConditions, saveProfile, saveBudget, savePreferences } = useUser();
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
      const newMetrics = { ...metrics }; // In this case metrics are handled in profile table
      
      const userData = {
        profile: newProfile,
        metrics: newMetrics,
        budget: { weekly: weeklyBudget, currency },
        preferences,
        allergies,
        healthConditions
      };

      await saveProfile(userData);
      setProfile(newProfile);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveMessage('Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const userData = {
        profile,
        metrics,
        budget: { weekly: weeklyBudget, currency },
        preferences,
        allergies,
        healthConditions
      };

      await saveBudget(userData);
      await savePreferences(userData);
      
      setBudget({ weekly: weeklyBudget, currency });
      setSaveMessage('Preferences updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setSaveMessage('Error saving preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // ... (rest of handleDeleteAccount remains same)
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setDeleteError('No active session found.');
        setIsDeleting(false);
        return;
      }

      const userId = session.user.id;

      await supabase.from('meal_plans').delete().eq('user_id', userId);
      await supabase.from('user_preferences').delete().eq('user_id', userId);
      await supabase.from('user_budgets').delete().eq('user_id', userId);
      await supabase.from('user_profiles').delete().eq('user_id', userId);
      await supabase.from('users').delete().eq('id', userId);

      await logout();
      localStorage.removeItem('budgetarian_data');
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setDeleteError('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <header className="mb-8">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-clay-fg tracking-tight">
          Settings
        </h2>
      </header>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-8 z-50 rounded-claySm px-6 py-3 font-body font-bold text-white shadow-clayButton ${
            saveMessage.includes('Error') ? 'bg-red-500' : 'bg-[#639922]'
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
        
        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl">
          <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">Profile Picture</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-[#639922]/20 shadow-clayButton bg-gradient-to-br from-[#639922] to-[#27500A] text-white overflow-hidden">
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="font-heading text-3xl font-black">{profile?.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div>
              <p className="font-heading font-bold text-clay-fg">{profile?.name}</p>
              <p className="font-body text-sm text-clay-muted">Choose a new avatar below</p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {PRESET_AVATARS.map(avatar => (
              <motion.button
                key={avatar.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedAvatar(avatar.src);
                }}
                className={`relative flex flex-col items-center gap-1.5 rounded-clayMd p-2.5 transition-all duration-300 ${
                  selectedAvatar === avatar.src
                    ? 'bg-gradient-to-br from-[#97C459] to-[#27500A] shadow-clayButton'
                    : 'bg-white/65 shadow-clayCard hover:bg-white'
                }`}
              >
                <img src={avatar.src} alt={avatar.label} className="h-12 w-12 rounded-full object-cover" />
                <span className={`font-body text-[10px] font-medium ${
                  selectedAvatar === avatar.src ? 'text-white' : 'text-clay-muted'
                }`}>{avatar.label}</span>
                {selectedAvatar === avatar.src && (
                  <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-clayCard"
                  >
                    <Check className="h-3 w-3 text-[#27500A]" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          <div className="mt-6">
            <motion.button 
              variants={clayButton} 
              initial="rest" 
              whileHover="hover" 
              whileTap="tap" 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex h-12 items-center justify-center rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Update Photo'}
            </motion.button>
          </div>
        </div>

        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl">
          <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">Account Information</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Full Name</label>
              <ClayInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Email Address</label>
              <ClayInput type="email" value={session?.user?.email || ''} readOnly disabled className="opacity-60" />
            </div>
          </div>
          <div className="mt-6">
            <motion.button 
              variants={clayButton} 
              initial="rest" 
              whileHover="hover" 
              whileTap="tap" 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex h-12 items-center justify-center rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>

        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl">
          <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">App Preferences</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Weekly Budget</label>
              <ClayInput type="number" value={weeklyBudget} onChange={(e) => setWeeklyBudget(e.target.value)} />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
              >
                <option value="₱">₱ PHP</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
              </select>
            </div>
            <div className="space-y-2 pt-4">
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Food Allergies</label>
              <ClayInput value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Health Conditions</label>
              <ClayInput value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} />
            </div>
          </div>
          <div className="mt-6">
            <motion.button 
              variants={clayButton} 
              initial="rest" 
              whileHover="hover" 
              whileTap="tap" 
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="inline-flex h-12 items-center justify-center rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </motion.button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl border-2 border-red-200/60">
          <h3 className="font-heading text-xl font-bold text-red-700 mb-2">Danger Zone</h3>
          <p className="font-body text-sm text-clay-muted mb-6">These actions are permanent and cannot be undone.</p>
          <div className="flex flex-wrap gap-4">
            <motion.button 
              variants={clayButton} initial="rest" whileHover="hover" whileTap="tap" 
              onClick={handleLogout}
              className="inline-flex h-12 items-center justify-center rounded-claySm border-2 border-[#EF9F27]/30 bg-transparent px-6 font-heading font-bold tracking-wide text-[#BA7517] transition-all hover:border-[#EF9F27] hover:bg-[#EF9F27]/5"
            >
              Sign Out
            </motion.button>
            <motion.button 
              variants={clayButton} initial="rest" whileHover="hover" whileTap="tap" 
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex h-12 items-center justify-center rounded-claySm bg-red-100 px-6 font-heading font-bold tracking-wide text-red-700 transition-all hover:bg-red-200"
            >
              Delete Account
            </motion.button>
          </div>
        </div>

      </motion.div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => { if (!isDeleting) setShowDeleteModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-clayLg bg-white p-8 shadow-clayCard"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-clay-fg">Delete Account</h3>
                  <p className="font-body text-sm text-clay-muted">This action is irreversible</p>
                </div>
              </div>

              <p className="font-body text-sm text-clay-fg mb-4">
                This will permanently delete your account and all associated data including your profile, meal plans, budget, and preferences. This cannot be undone.
              </p>

              <p className="font-body text-sm text-clay-muted mb-2">
                Type <strong className="text-red-600">DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                disabled={isDeleting}
                className="h-12 w-full rounded-claySm bg-[#EFEBF5] px-4 font-body text-base text-clay-fg shadow-clayPressed placeholder:text-clay-muted focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50"
              />

              {deleteError && (
                <p className="mt-3 font-body text-sm text-red-600">{deleteError}</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                  disabled={isDeleting}
                  className="flex-1 h-12 rounded-claySm border-2 border-clay-muted/20 bg-transparent font-heading font-bold text-clay-muted transition-all hover:bg-[#EFEBF5] disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="flex-1 h-12 rounded-claySm bg-red-600 font-heading font-bold text-white shadow-clayButton transition-all hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Settings;
