import React from 'react';
import { useUser } from '../context/UserContext';
import { Edit3, Target, Activity, Flame, Lightbulb, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, premiumCard, glow } from '../lib/animations';

const Overview = () => {
  const { profile, metrics, budget, isLoading } = useUser();

  if (isLoading || !profile || !metrics) {
    return (
      <div className="flex flex-col h-full min-h-[60vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-premium-emerald/20 border-t-premium-emerald animate-spin" />
        <p className="text-sm font-medium text-premium-text-secondary">Retrieving Biometrics...</p>
      </div>
    );
  }

  const bmi = (() => {
    if (!metrics.height || !metrics.weight) return null;
    const heightInMeters = parseFloat(metrics.height) / 100;
    const weightInKg = parseFloat(metrics.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  })();

  const getBMIGradient = (bmi) => {
    if (!bmi) return "from-premium-emerald to-premium-emerald-dark";
    if (bmi < 18.5) return "from-premium-amber to-premium-amber-dark";
    if (bmi < 25) return "from-premium-emerald to-premium-emerald-dark";
    return "from-premium-amber to-red-500";
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header>
        <h2 className="font-heading text-3xl font-bold text-white mb-2">Member Core</h2>
        <p className="text-sm text-premium-text-secondary font-medium uppercase tracking-widest">Physiological Profile</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Profile Card */}
        <div className="lg:col-span-8">
          <div className="glass-card p-6 sm:p-10 rounded-premium-lg flex flex-col sm:flex-row gap-8 relative overflow-hidden h-full">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-premium-emerald/5 blur-[60px]" />
            
            <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-premium border-2 border-premium-emerald/30 bg-premium-bg overflow-hidden mx-auto sm:mx-0 shadow-lg">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-heading text-5xl font-bold text-premium-emerald/30">{profile.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">{profile.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-premium-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest">Identity Verified</p>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-bold text-premium-text-secondary hover:text-white transition-all w-full sm:w-auto">
                  <Edit3 size={12} /> Update Data
                </button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="flex items-center gap-2 rounded-full bg-premium-amber/5 border border-premium-amber/10 px-4 py-1.5">
                  <Target size={12} className="text-premium-amber" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{metrics.goal}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-4 py-1.5">
                  <Clock size={12} className="text-premium-text-muted" />
                  <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-wider">{profile.age} Yrs</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-4 py-1.5">
                  <User size={12} className="text-premium-text-muted" />
                  <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-wider">{profile.gender}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {[
                  { label: "Height", value: `${metrics.height} cm` },
                  { label: "Weight", value: `${metrics.weight} kg` },
                  { label: "Weekly Budget", value: `${budget.currency}${budget.weekly}` },
                  { label: "Daily Limit", value: `${budget.currency}${(budget.weekly / 7).toFixed(0)}` },
                ].map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <p className="text-[8px] font-bold text-premium-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="font-heading text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BMI Card */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 sm:p-10 rounded-premium-lg h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-widest">Metabolic Index</h3>
            {bmi && (
              <div className={`flex h-36 w-36 flex-col items-center justify-center rounded-full bg-gradient-to-br ${getBMIGradient(bmi)} shadow-xl mb-8 relative border-4 border-white/10`}>
                <span className="font-heading text-4xl font-bold text-premium-bg">{bmi}</span>
                <span className="text-[8px] font-bold text-premium-bg/70 uppercase tracking-widest mt-1">BMI Value</span>
              </div>
            )}
            <p className="text-xs text-premium-text-secondary leading-relaxed">
              System category: <span className="font-bold text-white uppercase">{bmi < 25 ? 'Optimal' : 'Elevated'}</span>.
            </p>
          </div>
        </div>

        {/* Analytic Cards */}
        {[
          { label: 'Activity Level', value: metrics.activity, icon: Activity, accent: 'text-premium-emerald', bg: 'bg-premium-emerald/5' },
          { label: 'Weekly Intensity', value: '21 Meals', icon: Flame, accent: 'text-premium-amber', bg: 'bg-premium-amber/5' },
          { label: 'System Authority', value: 'NutriPlan v2.0', icon: Lightbulb, accent: 'text-premium-emerald', bg: 'bg-premium-emerald/5' }
        ].map((stat, idx) => (
          <div key={idx} className="lg:col-span-4">
            <div className="glass-card p-6 rounded-premium-lg flex items-center gap-4 transition-all hover:bg-white/5 border-white/5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.accent}`} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-premium-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="font-heading text-base font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
