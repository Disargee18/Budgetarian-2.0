import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetarianLogo } from './BudgetarianLogo';

const Navbar = ({ onSignIn, onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <nav className="px-6 sm:px-8 py-4 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 bg-white/80 border-clay-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <BudgetarianLogo size="small" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none text-clay-foreground">
              Budget<span className="text-clay-green">arian</span>
            </h1>
            <p className="text-[8px] text-clay-green uppercase tracking-[0.2em] font-black mt-1 whitespace-nowrap">Smart Meal Planning</p>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onSignIn}
            className="hidden sm:inline-flex px-5 py-2 text-sm font-black uppercase tracking-widest transition-colors text-clay-muted hover:text-clay-green"
          >
            Sign In
          </button>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-clay-green text-white rounded-full hover:shadow-clayButton hover:scale-105 transition-all shadow-clayButton active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
