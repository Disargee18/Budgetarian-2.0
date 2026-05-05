import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, clayButton } from '../lib/animations';

const ClayInput = (props) => (
  <input
    className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
    {...props}
  />
);

const Settings = () => {
  const { logout, profile, budget } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-clay-fg tracking-tight">
          Settings
        </h2>
      </header>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
        
        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl">
          <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">Account Information</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Full Name</label>
              <ClayInput type="text" defaultValue={profile?.name || ''} />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Email Address</label>
              <ClayInput type="email" defaultValue={`${profile?.name?.split(' ')[0].toLowerCase()}@example.com`} />
            </div>
          </div>
          <div className="mt-6">
            <motion.button variants={clayButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-flex h-12 items-center justify-center rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton">
              Save Changes
            </motion.button>
          </div>
        </div>

        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl">
          <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">App Preferences</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Currency</label>
              <select className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed focus:outline-none focus:ring-4 focus:ring-[#639922]/20">
                <option value="₱" selected={budget?.currency === '₱'}>₱ PHP</option>
                <option value="$" selected={budget?.currency === '$'}>$ USD</option>
                <option value="€" selected={budget?.currency === '€'}>€ EUR</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-body font-medium text-clay-fg">Notifications</p>
                <p className="font-body text-sm text-clay-muted">Receive daily meal reminders</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#639922] cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl border-2 border-red-100">
          <h3 className="font-heading text-xl font-bold text-red-700 mb-2">Danger Zone</h3>
          <p className="font-body text-sm text-clay-muted mb-6">These actions are permanent and cannot be undone.</p>
          <div className="flex gap-4">
            <motion.button 
              variants={clayButton} initial="rest" whileHover="hover" whileTap="tap" 
              onClick={handleLogout}
              className="inline-flex h-12 items-center justify-center rounded-claySm border-2 border-[#EF9F27]/30 bg-transparent px-6 font-heading font-bold tracking-wide text-[#BA7517] transition-all hover:border-[#EF9F27] hover:bg-[#EF9F27]/5"
            >
              Sign Out
            </motion.button>
            <motion.button 
              variants={clayButton} initial="rest" whileHover="hover" whileTap="tap" 
              className="inline-flex h-12 items-center justify-center rounded-claySm bg-red-100 px-6 font-heading font-bold tracking-wide text-red-700 transition-all hover:bg-red-200"
            >
              Reset All Data
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Settings;
