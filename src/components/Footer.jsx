import React from 'react';
import { BudgetarianLogo } from './BudgetarianLogo';

const Footer = () => {
  return (
    <footer className="px-6 sm:px-8 py-12 border-t transition-colors bg-clay-canvas border-clay-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <BudgetarianLogo size="small" />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none text-clay-foreground">
              Budget<span className="text-clay-green">arian</span>
            </h1>
            <p className="text-[8px] text-clay-green uppercase tracking-[0.2em] font-black mt-1 whitespace-nowrap">Smart Meal Planning</p>
          </div>
        </div>
        <p className="text-[10px] font-black text-clay-muted uppercase tracking-widest">
          © 2026 Budgetarian Protocol. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
