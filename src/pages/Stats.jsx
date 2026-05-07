import React from 'react';
import { useUser } from '../context/UserContext';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayCard, ClayBadge } from '../components/ClayComponents';

const Stats = () => {
  const { mealPlan, isLoading, budget } = useUser();

  if (isLoading || !mealPlan || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex flex-col h-full min-h-[50vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white shadow-clayCard flex items-center justify-center border border-clay-border">
          <div className="h-8 w-8 rounded-full border-2 border-clay-green/20 border-t-clay-green animate-spin" />
        </div>
        <p className="text-sm font-bold text-clay-muted">Aggregating...</p>
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
        <h2 className="text-3xl font-black text-clay-foreground mb-1">Analytics</h2>
        <p className="text-[10px] text-clay-muted font-bold uppercase tracking-widest">Performance</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calories Chart */}
        <ClayCard className="p-6 sm:p-8 border-l-4 border-clay-green bg-white/80">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-clay-foreground mb-0.5">Calories</h3>
              <p className="text-xs text-clay-muted font-medium">Daily intake.</p>
            </div>
            <div className="h-10 w-10 rounded-clay-sm bg-clay-green/10 flex items-center justify-center">
              <Activity className="text-clay-green" size={20} />
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 px-1">
            {days.map((day, idx) => {
              const height = `${Math.max((dailyCalories[idx] / maxCal) * 100, 8)}%`;
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <div key={day} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                  <div className="relative w-full flex-1 flex flex-col justify-end bg-[#EFEBF5] shadow-clayPressed rounded-t-lg overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 1, delay: 0.1 * idx }}
                      className={`w-full rounded-t-lg shadow-clayButton transition-all duration-300 ${isToday ? 'bg-clay-accent' : 'bg-clay-green/60'}`}
                    />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-clay-accent' : 'text-clay-muted'}`}>
                    {day.substring(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </ClayCard>

        {/* Spending Chart */}
        <ClayCard className="p-6 sm:p-8 border-l-4 border-clay-amber bg-white/80">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-clay-foreground mb-0.5">Spending</h3>
              <p className="text-xs text-clay-muted font-medium">Financial flow.</p>
            </div>
            <div className="h-10 w-10 rounded-clay-sm bg-clay-amber/10 flex items-center justify-center">
              <TrendingUp className="text-clay-amber" size={20} />
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 px-1">
            {days.map((day, idx) => {
              const height = `${Math.max((dailySpent[idx] / maxSpent) * 100, 8)}%`;
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <div key={day} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                  <div className="relative w-full flex-1 flex flex-col justify-end bg-[#EFEBF5] shadow-clayPressed rounded-t-lg overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 1, delay: 0.1 * idx }}
                      className={`w-full rounded-t-lg shadow-clayButton transition-all duration-300 ${isToday ? 'bg-clay-green' : 'bg-clay-amber/60'}`}
                    />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-clay-green' : 'text-clay-muted'}`}>
                    {day.substring(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        </ClayCard>
      </div>

      <ClayCard className="p-8 bg-white/70">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-clay-muted uppercase tracking-[0.2em] mb-1">Average</p>
            <p className="text-3xl font-black text-clay-foreground">{(dailyCalories.reduce((a,b) => a+b, 0) / 7).toFixed(0)} <span className="text-[10px] text-clay-green uppercase font-black">kcal</span></p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-clay-muted uppercase tracking-[0.2em] mb-1">Total</p>
            <p className="text-3xl font-black text-clay-foreground">{budget.currency}{dailySpent.reduce((a,b) => a+b, 0).toFixed(0)}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-clay-muted uppercase tracking-[0.2em] mb-1">Accuracy</p>
            <p className="text-3xl font-black text-clay-green">94.2%</p>
          </div>
        </div>
      </ClayCard>
    </div>
  );
};

export default Stats;
