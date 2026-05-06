import React from 'react';
import { useUser } from '../context/UserContext';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/animations';

const Stats = () => {
  const { mealPlan, isLoading } = useUser();

  if (isLoading || !mealPlan || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex flex-col h-full min-h-[60vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-premium-emerald/20 border-t-premium-emerald animate-spin" />
        <p className="text-sm font-medium text-premium-text-secondary">Aggregating Data...</p>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyCalories = days.map(day => (mealPlan[day] ? Object.values(mealPlan[day]).reduce((acc, m) => acc + m.cals, 0) : 0));
  const dailySpent = days.map(day => (mealPlan[day] ? Object.values(mealPlan[day]).reduce((acc, m) => acc + (m.eaten ? m.cost : 0), 0) : 0));

  const maxCal = Math.max(...dailyCalories, 2000);
  const maxSpent = Math.max(...dailySpent, 100);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header>
        <h2 className="font-heading text-3xl font-bold text-white mb-2">Health Analytics</h2>
        <p className="text-sm text-premium-text-secondary font-medium uppercase tracking-widest">Efficiency Metrics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calories Chart */}
        <div className="glass-card p-6 sm:p-10 rounded-premium-lg border-l-4 border-premium-emerald">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">Caloric Intensity</h3>
              <p className="text-xs text-premium-text-muted">Daily intake optimization.</p>
            </div>
            <Activity className="text-premium-emerald/40" size={20} />
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-1">
            {days.map((day, idx) => {
              const height = `${Math.max((dailyCalories[idx] / maxCal) * 100, 5)}%`;
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <div key={day} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                  <div className="relative w-full flex-1 flex flex-col justify-end bg-white/5 rounded-t-lg overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 1, delay: 0.1 * idx }}
                      className={`w-full rounded-t-lg ${isToday ? 'bg-premium-amber' : 'bg-premium-emerald/60 hover:bg-premium-emerald transition-colors'}`}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-premium-surface border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      {dailyCalories[idx]} kcal
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? 'text-premium-amber' : 'text-premium-text-muted'}`}>
                    {day.substring(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spending Chart */}
        <div className="glass-card p-6 sm:p-10 rounded-premium-lg border-l-4 border-premium-amber">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">Financial Flux</h3>
              <p className="text-xs text-premium-text-muted">Capital allocation efficiency.</p>
            </div>
            <TrendingUp className="text-premium-amber/40" size={20} />
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-1">
            {days.map((day, idx) => {
              const height = `${Math.max((dailySpent[idx] / maxSpent) * 100, 5)}%`;
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <div key={day} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                  <div className="relative w-full flex-1 flex flex-col justify-end bg-white/5 rounded-t-lg overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 1, delay: 0.1 * idx }}
                      className={`w-full rounded-t-lg ${isToday ? 'bg-premium-emerald' : 'bg-premium-amber/60 hover:bg-premium-amber transition-colors'}`}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-premium-surface border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      ₱{dailySpent[idx]}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? 'text-premium-amber' : 'text-premium-text-muted'}`}>
                    {day.substring(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-premium-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest mb-2">Weekly Average</p>
            <p className="font-heading text-3xl font-bold text-white">{(dailyCalories.reduce((a,b) => a+b, 0) / 7).toFixed(0)} <span className="text-xs text-premium-emerald">kcal</span></p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest mb-2">Total Resource Usage</p>
            <p className="font-heading text-3xl font-bold text-white">₱{dailySpent.reduce((a,b) => a+b, 0).toFixed(0)}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest mb-2">Execution Accuracy</p>
            <p className="font-heading text-3xl font-bold text-premium-emerald">94.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
