import React from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardFloat } from '../lib/animations';

const Stats = () => {
  const { mealPlan, isLoading } = useUser();

  if (isLoading || !mealPlan || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#639922]/20 border-t-[#639922]" />
          <p className="font-body text-clay-muted">Loading your stats...</p>
        </div>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyCalories = days.map(day => {
    if (!mealPlan[day]) return 0;
    return Object.values(mealPlan[day]).reduce((acc, meal) => acc + meal.cals, 0);
  });
  
  const dailySpent = days.map(day => {
    if (!mealPlan[day]) return 0;
    return Object.values(mealPlan[day]).reduce((acc, meal) => acc + (meal.eaten ? meal.cost : 0), 0);
  });

  const maxCal = Math.max(...dailyCalories, 2000);
  const maxSpent = Math.max(...dailySpent, 100);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-clay-fg tracking-tight">
          Your Stats
        </h2>
        <p className="font-body text-lg text-clay-muted">Visualize your nutritional and financial progress.</p>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={fadeUp} className="w-full">
          <motion.div variants={cardFloat} initial="rest" whileHover="hover" className="rounded-clay bg-white/65 p-6 md:p-8 shadow-clayCard backdrop-blur-xl h-full">
            <h3 className="font-heading text-xl font-bold text-clay-fg mb-8">Daily Calories</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {days.map((day, idx) => {
                const height = `${(dailyCalories[idx] / maxCal) * 100}%`;
                const isToday = day === 'Monday'; // Mock today
                return (
                  <div key={day} className="flex flex-col items-center gap-2 w-full">
                    <div className="w-full bg-[#EFEBF5] rounded-t-sm h-full flex items-end justify-center rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{ duration: 0.8, delay: 0.1 * idx }}
                        className={`w-full rounded-full ${isToday ? 'bg-gradient-to-t from-[#EF9F27] to-[#BA7517]' : 'bg-gradient-to-t from-[#639922] to-[#27500A]'}`}
                      />
                    </div>
                    <span className="font-body text-xs font-bold text-clay-muted">{day.substring(0, 1)}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="w-full">
          <motion.div variants={cardFloat} initial="rest" whileHover="hover" className="rounded-clay bg-white/65 p-6 md:p-8 shadow-clayCard backdrop-blur-xl h-full">
            <h3 className="font-heading text-xl font-bold text-clay-fg mb-8">Daily Spending</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {days.map((day, idx) => {
                const height = `${(dailySpent[idx] / maxSpent) * 100}%`;
                return (
                  <div key={day} className="flex flex-col items-center gap-2 w-full">
                    <div className="w-full bg-[#EFEBF5] rounded-t-sm h-full flex items-end justify-center rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{ duration: 0.8, delay: 0.1 * idx }}
                        className="w-full bg-[#639922]/40 rounded-full"
                      />
                    </div>
                    <span className="font-body text-xs font-bold text-clay-muted">{day.substring(0, 1)}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Stats;
