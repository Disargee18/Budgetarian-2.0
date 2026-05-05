import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, User, BarChart2, Settings as SettingsIcon, Utensils } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageTransition, blobFloat, blobFloatAlt, blobFloatSlow } from '../lib/animations';

const Layout = () => {
  const shouldReduce = useReducedMotion();
  const blob1 = shouldReduce ? {} : blobFloat;
  const blob2 = shouldReduce ? {} : blobFloatAlt;
  const blob3 = shouldReduce ? {} : blobFloatSlow;

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative min-h-screen bg-clay-canvas font-body text-clay-fg flex"
    >
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          variants={blob1}
          animate="animate"
          className="absolute -left-[10%] -top-[10%] h-[60vh] w-[60vh] rounded-full bg-[#3B6D11]/10 blur-3xl"
        />
        <motion.div
          variants={blob2}
          animate="animate"
          className="absolute -right-[10%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-[#EF9F27]/10 blur-3xl"
        />
        <motion.div
          variants={blob3}
          animate="animate"
          className="absolute bottom-[5%] left-[10%] h-[45vh] w-[45vh] rounded-full bg-[#639922]/8 blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#97C459] to-[#27500A] shadow-clayButton">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-black text-clay-primary tracking-tight">Budgetarian</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/overview', icon: User, label: 'Overview' },
            { to: '/stats', icon: BarChart2, label: 'Stats' },
            { to: '/settings', icon: SettingsIcon, label: 'Settings' }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-clayMd p-4 transition-all duration-300 font-heading font-bold ${
                  isActive
                    ? 'bg-gradient-to-br from-[#97C459] to-[#27500A] text-white shadow-clayButton'
                    : 'text-clay-muted hover:bg-white/40 hover:text-clay-fg'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-32 max-w-7xl mx-auto w-full z-10">
        <Outlet />
      </main>
    </motion.div>
  );
};

export default Layout;
