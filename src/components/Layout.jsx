import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BarChart2, Settings as SettingsIcon, Utensils, LogOut, Menu, X } from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { pageTransition, blobFloat, blobFloatAlt, blobFloatSlow } from '../lib/animations';
import { supabase } from '../lib/supabaseClient';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
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

  const blob1 = shouldReduce ? {} : blobFloat;
  const blob2 = shouldReduce ? {} : blobFloatAlt;
  const blob3 = shouldReduce ? {} : blobFloatSlow;

  return (
    <div className="relative min-h-screen bg-premium-bg font-body text-premium-text-primary flex flex-col lg:flex-row overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div variants={blob1} animate="animate" className="absolute -left-[10%] -top-[10%] h-[70vh] w-[70vh] rounded-full bg-premium-emerald/5 blur-[120px]" />
        <motion.div variants={blob2} animate="animate" className="absolute -right-[10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-premium-amber/5 blur-[100px]" />
        <motion.div variants={blob3} animate="animate" className="absolute bottom-[-10%] left-[20%] h-[50vh] w-[50vh] rounded-full bg-premium-emerald/5 blur-[100px]" />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-premium-border bg-premium-bg/80 backdrop-blur-xl z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-premium-sm bg-premium-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Utensils className="h-4 w-4 text-premium-bg" />
          </div>
          <h1 className="font-heading text-lg font-bold text-white tracking-tight">Budgetarian</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-premium-text-secondary hover:text-white transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-40 bg-premium-bg pt-20 p-6 flex flex-col"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-premium px-6 py-5 transition-all duration-300 font-heading font-medium ${
                      isActive ? 'bg-white/5 text-premium-emerald border border-white/10' : 'text-premium-text-secondary'
                    }`
                  }
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 rounded-premium px-6 py-5 text-red-400 hover:bg-red-500/5 transition-all font-heading font-medium"
              >
                <LogOut size={22} />
                <span>Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col p-8 sticky top-0 h-screen border-r border-premium-border bg-black z-20">
        <div className="flex items-center gap-3 mb-12 pl-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-premium-sm bg-premium-emerald shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Utensils className="h-5 w-5 text-premium-bg" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-white tracking-tight leading-none">Budgetarian</h1>
            <span className="text-[9px] font-bold tracking-[0.2em] text-premium-emerald uppercase mt-1 block">Premium 2.0</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-premium px-5 py-3.5 transition-all duration-300 font-heading font-medium group ${
                  isActive
                    ? 'bg-white/5 text-premium-emerald border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                    : 'text-premium-text-secondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">{item.label}</span>
                  <div className={`ml-auto h-1 w-1 rounded-full transition-all duration-300 ${isActive ? 'bg-premium-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-transparent'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-3.5 rounded-premium text-premium-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all group font-heading font-medium"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Terminate Session</span>
          </button>
          
          <div className="p-4 rounded-premium bg-white/5 border border-white/10">
            <p className="text-[10px] font-bold text-premium-emerald mb-2 uppercase tracking-wider">AI Assistant</p>
            <p className="text-[11px] text-premium-text-secondary leading-relaxed">
              System active and optimized.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-12 pb-32 z-10">
        <div className="max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
