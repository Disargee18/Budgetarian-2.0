import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-clay-canvas font-body text-clay-foreground flex flex-col lg:flex-row overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[5%] -left-[5%] h-[50vh] w-[50vh] rounded-full bg-[#22C55E]/10 blur-3xl animate-clay-float" />
        <div className="absolute -right-[5%] top-[15%] h-[40vh] w-[40vh] rounded-full bg-[#84CC16]/10 blur-3xl animate-clay-float-delayed" />
        <div className="absolute bottom-[5%] left-[25%] h-[35vh] w-[35vh] rounded-full bg-[#10B981]/10 blur-3xl animate-clay-float-slow" />
      </div>

      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-32 z-10 h-screen">
        <div className="max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
