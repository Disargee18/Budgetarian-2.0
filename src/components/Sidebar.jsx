import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BarChart2, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BudgetarianLogo } from './BudgetarianLogo';
import { supabase } from '../lib/supabaseClient';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/overview', icon: User, label: 'Profile' },
    { to: '/stats', icon: BarChart2, label: 'Analytics' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-3 bg-white/70 backdrop-blur-xl border-b border-clay-border z-40 sticky top-0">
        <div className="flex items-center gap-2.5">
          <BudgetarianLogo size="small" />
          <h1 className="text-lg font-extrabold text-clay-foreground tracking-tight">
            Budget<span className="text-clay-green">arian</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 h-9 w-9 flex items-center justify-center rounded-clay-sm bg-white shadow-clayButton active:shadow-clayPressed active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-50 bg-clay-canvas/95 backdrop-blur-xl pt-20 p-5 flex flex-col"
          >
            <nav className="space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-[16px] px-5 py-4 transition-all duration-300 font-heading font-extrabold ${
                      isActive 
                        ? 'bg-white shadow-clayCard text-clay-accent border border-clay-border' 
                        : 'text-clay-muted hover:text-clay-foreground hover:bg-white/50'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 rounded-[16px] px-5 py-4 text-clay-red hover:bg-clay-red/5 transition-all font-heading font-extrabold"
              >
                <LogOut size={20} />
                <span className="text-sm">Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col p-6 sticky top-0 h-screen bg-white/40 backdrop-blur-md border-r border-clay-border z-20">
        <div className="flex items-center gap-2.5 mb-10 pl-1">
          <BudgetarianLogo size="small" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none text-clay-foreground">
              Budget<span className="text-clay-green">arian</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] text-clay-green uppercase mt-1 block whitespace-nowrap">Smart Meal Planning</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-[14px] px-4 py-3 transition-all duration-300 font-heading font-extrabold group ${
                  isActive
                    ? 'bg-white shadow-clayCard text-clay-accent border border-clay-border -translate-y-0.5'
                    : 'text-clay-muted hover:text-clay-foreground hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-clay-accent animate-clay-breathe" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-[14px] text-clay-muted hover:text-clay-red hover:bg-clay-red/5 transition-all group font-heading font-extrabold"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
