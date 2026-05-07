import React from 'react';
import { useUser } from '../context/UserContext';
import { Edit3, Target, Activity, Flame, Lightbulb, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayCard, ClayBadge, ClayButton } from '../components/ClayComponents';

const Overview = () => {
  const { profile, metrics, budget, isLoading } = useUser();

  if (isLoading || !profile || !metrics) {
    return (
      <div className="flex flex-col h-full min-h-[50vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white shadow-clayCard flex items-center justify-center border border-clay-border">
          <div className="h-8 w-8 rounded-full border-2 border-clay-green/20 border-t-clay-green animate-spin" />
        </div>
        <p className="text-sm font-bold text-clay-muted">Retrieving data...</p>
      </div>
    );
  }

  const bmi = (() => {
    if (!metrics.height || !metrics.weight) return null;
    const heightInMeters = parseFloat(metrics.height) / 100;
    const weightInKg = parseFloat(metrics.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  })();

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header>
        <h2 className="text-3xl font-black text-clay-foreground mb-1">Profile</h2>
        <p className="text-[10px] text-clay-muted font-bold uppercase tracking-widest">Personal Overview</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Profile Card */}
        <div className="lg:col-span-8">
          <ClayCard className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden h-full bg-white/80">
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-clay-accent/5 blur-2xl" />
            
            <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-[20px] border-4 border-white bg-clay-canvas overflow-hidden mx-auto sm:mx-0 shadow-clayCard">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-clay-muted/20">{profile.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-black text-clay-foreground mb-1">{profile.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-clay-green shadow-[0_0_6px_rgba(22,163,74,0.4)]" />
                    <p className="text-[9px] font-black text-clay-muted uppercase tracking-widest">Active</p>
                  </div>
                </div>
                <ClayButton variant="ghost" size="sm" className="w-full sm:w-auto h-9">
                  <Edit3 size={12} className="mr-1.5" /> Edit
                </ClayButton>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <ClayBadge variant="amber">{metrics.goal}</ClayBadge>
                <ClayBadge variant="primary">{profile.age} Yrs</ClayBadge>
                <ClayBadge variant="sky">{profile.gender}</ClayBadge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-clay-border">
                {[
                  { label: "Height", value: `${metrics.height}cm` },
                  { label: "Weight", value: `${metrics.weight}kg` },
                  { label: "Weekly", value: `${budget.currency}${budget.weekly}` },
                  { label: "Daily", value: `${budget.currency}${(budget.weekly / 7).toFixed(0)}` },
                ].map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <p className="text-[9px] font-black text-clay-muted uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-base font-black text-clay-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ClayCard>
        </div>

        {/* BMI Card */}
        <div className="lg:col-span-4">
          <ClayCard className="p-6 sm:p-8 h-full flex flex-col items-center justify-center text-center bg-white/80">
            <h3 className="text-[10px] font-black text-clay-muted mb-6 uppercase tracking-widest">BMI Index</h3>
            {bmi && (
              <div className="relative flex h-32 w-32 items-center justify-center mb-6">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br opacity-15 blur-xl ${bmi < 25 ? 'from-clay-green to-clay-emerald' : 'from-clay-amber to-clay-red'}`} />
                <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-clayCard border border-clay-border">
                  <span className="text-3xl font-black text-clay-foreground">{bmi}</span>
                  <span className="text-[9px] font-black text-clay-muted uppercase tracking-widest mt-0.5">Value</span>
                </div>
              </div>
            )}
            <p className="text-xs text-clay-muted font-medium">
              Status: <span className={`font-black uppercase ${bmi < 25 ? 'text-clay-green' : 'text-clay-amber'}`}>{bmi < 25 ? 'Optimal' : 'Elevated'}</span>
            </p>
          </ClayCard>
        </div>

        {/* Analytic Cards */}
        {[
          { label: 'Activity', value: metrics.activity, icon: Activity },
          { label: 'Intensity', value: '21 Meals', icon: Flame },
          { label: 'System', value: 'v2.0 Stable', icon: Lightbulb }
        ].map((stat, idx) => (
          <div key={idx} className="lg:col-span-4">
            <ClayCard className="p-5 flex items-center gap-4 bg-white/70">
              <div className="flex h-11 w-11 items-center justify-center rounded-clay-sm bg-white shadow-clayButton border border-clay-border">
                <stat.icon className="h-5 w-5 text-clay-accent" />
              </div>
              <div>
                <p className="text-[9px] font-black text-clay-muted uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-base font-black text-clay-foreground">{stat.value}</p>
              </div>
            </ClayCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
