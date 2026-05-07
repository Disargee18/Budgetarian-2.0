import React from 'react';

export const ClayCard = ({ children, className = "", ...props }) => (
  <div 
    className={`relative overflow-hidden rounded-[18px] bg-white/70 p-5 text-clay-foreground shadow-clayCard backdrop-blur-xl border border-clay-border transition-all duration-500 hover:-translate-y-1 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const ClayButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-clay text-white shadow-clayButton hover:shadow-clayButtonHover",
    success: "bg-clay-green text-white shadow-clayButton hover:shadow-clayButtonHover",
    amber: "bg-clay-amber text-white shadow-clayButton hover:shadow-clayButtonHover",
    danger: "bg-clay-red text-white shadow-clayButton hover:shadow-clayButtonHover",
    ghost: "bg-white text-clay-muted border border-clay-border hover:bg-clay-canvas hover:text-clay-foreground shadow-none hover:shadow-clayCard"
  };

  const sizes = {
    sm: "h-9 px-4 text-[10px]",
    md: "h-11 px-6 text-xs",
    lg: "h-13 px-8 text-sm"
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-[14px] font-black uppercase tracking-widest transition-all duration-200 active:scale-[0.94] active:shadow-clayPressed focus-visible:ring-4 focus-visible:ring-clay-accent/20 focus:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ClayInput = ({ className = "", ...props }) => (
  <input 
    className={`flex w-full rounded-[14px] border-0 bg-[#EFEBF5] px-4 py-3 text-clay-foreground text-sm shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-clay-accent/10 focus:outline-none ${className}`}
    {...props}
  />
);

export const ClayBadge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-clay-accent/10 text-clay-accent border-clay-accent/10",
    success: "bg-clay-green/10 text-clay-green border-clay-green/10",
    amber: "bg-clay-amber/10 text-clay-amber border-clay-amber/10",
    red: "bg-clay-red/10 text-clay-red border-clay-red/10",
    sky: "bg-clay-sky/10 text-clay-sky border-clay-sky/10"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const ClayProgressBar = ({ progress, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-clay-accent shadow-clayButton",
    success: "bg-clay-green shadow-clayButton",
    amber: "bg-clay-amber shadow-clayButton"
  };

  return (
    <div className={`h-2.5 w-full bg-[#EFEBF5] shadow-clayPressed rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-1000 ease-out ${variants[variant]}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};
