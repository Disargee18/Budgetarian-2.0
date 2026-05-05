import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Check, RotateCcw, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cardFloat, breathe, fadeUp, staggerContainer, checkMark, clayButton, scaleIn } from '../lib/animations';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import { generateDailyMealPlanAI } from '../lib/openrouterClient';

const MealChecklistRow = ({ id, mealName, calories, cost, checked, toggle, disabled }) => (
  <motion.div
    layout
    className={`flex items-center gap-3 rounded-clayMd bg-white/65 p-4 shadow-clayCard backdrop-blur-xl ${disabled ? "opacity-75 grayscale-[0.2]" : ""}`}
  >
    <motion.button
      whileTap={disabled ? {} : { scale: 0.88 }}
      onClick={() => !disabled && toggle(id)}
      disabled={disabled}
      className={`h-7 w-7 rounded-[12px] border-2 transition-all duration-200 shadow-clayPressed flex items-center justify-center ${
        checked
          ? "border-[#27500A] bg-gradient-to-br from-[#639922] to-[#27500A]"
          : "border-clay-muted/30 bg-[#EFEBF5]"
      } ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg 
            variants={checkMark} 
            initial="hidden" 
            animate="visible" 
            exit="hidden"
            className="h-4 w-4" 
            viewBox="0 0 16 16"
          >
            <motion.path 
              d="M3 8l4 4 6-6" 
              stroke="white" 
              strokeWidth="2"
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              variants={checkMark} 
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>

    <div className="flex flex-col">
      <span className={`font-body font-medium transition-all duration-200 ${checked ? "line-through text-clay-muted" : "text-clay-fg"}`}>
        {mealName}
      </span>
      <span className="font-body text-xs text-clay-muted">{id}</span>
    </div>

    <div className="ml-auto flex gap-2">
      <span className="rounded-full bg-[#EF9F27]/15 px-3 py-1 font-body text-xs font-bold text-[#BA7517]">
        {calories} kcal
      </span>
      <span className="rounded-full bg-[#639922]/15 px-3 py-1 font-body text-xs font-bold text-[#27500A]">
        {cost}
      </span>
    </div>
  </motion.div>
);

const CalorieRing = ({ calories, maxCalories }) => {
  const percent = Math.min((calories / maxCalories) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-[#EFEBF5]"
          strokeWidth="8"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <motion.circle
          className="stroke-[#639922]"
          strokeWidth="8"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-xl font-black text-clay-primary leading-none">{calories}</span>
        <span className="font-body text-[10px] font-medium text-clay-muted">kcal</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { profile, budget, mealPlan, updateMealPlan, isLoading, metrics, preferences, allergies, healthConditions } = useUser();
  const [activeDay, setActiveDay] = useState('Monday');
  const MAX_DAILY_REGENS = 3;

  const getRegenCount = () => {
    const stored = localStorage.getItem('budgetarian_regen');
    if (!stored) return 0;
    const { count, date } = JSON.parse(stored);
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return 0;
    return count;
  };

  const [regenCount, setRegenCount] = useState(getRegenCount());
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    setActiveDay(days[today]);
  }, []);

  const handleToggleMeal = (day, mealType) => {
    const newPlan = { ...mealPlan };
    newPlan[day][mealType].eaten = !newPlan[day][mealType].eaten;
    updateMealPlan(newPlan);
  };

  const calculateBudgetStats = () => {
    let spent = 0;
    let totalMealsEaten = 0;
    let totalMeals = 0;
    let streak = 0;
    
    const days = Object.keys(mealPlan);
    
    // Adherence logic mock (would need proper history in real app)
    days.forEach(day => {
      let dayEaten = 0;
      let dayTotal = 0;
      Object.values(mealPlan[day]).forEach(meal => {
        totalMeals++;
        dayTotal++;
        if (meal.eaten) {
          spent += meal.cost;
          totalMealsEaten++;
          dayEaten++;
        }
      });
      if (dayEaten === dayTotal && dayTotal > 0) streak++;
    });

    const remaining = budget.weekly - spent;
    return { spent, remaining, adherence: Math.round((totalMealsEaten / totalMeals) * 100) || 0, streak };
  };

  if (isLoading || !profile || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#639922]/20 border-t-[#639922]" />
          <p className="font-body text-clay-muted">Preparing your meal plan...</p>
        </div>
      </div>
    );
  }

  const stats = calculateBudgetStats();
  const todayMeals = mealPlan[activeDay] || {};
  const todayCalories = Object.values(todayMeals).reduce((acc, meal) => acc + (meal.cals || 0), 0);
  const targetDailyCalories = 2000; // Mock target
  
  // Create an array of 7 items for the dot grid (mock past 7 days)
  const adherenceDots = Array.from({ length: 7 }).map((_, i) => i < stats.streak);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-clay-fg tracking-tight">
          Hello, {profile.name}!
        </h2>
        <p className="font-body text-lg text-clay-muted">Here is your plan for this week.</p>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {/* CELL 1: WEEKLY MEAL PLAN */}
        <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-2 space-y-6">
          <div className="rounded-clay bg-white/65 p-6 md:p-8 shadow-clayCard backdrop-blur-xl h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="font-heading text-2xl font-bold text-clay-fg">Weekly Plan</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mealPlan).map(day => (
                  <motion.button
                    key={day}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveDay(day)}
                    className={`rounded-full px-4 py-2 font-heading text-sm font-bold transition-all duration-300 ${
                      activeDay === day
                        ? "bg-gradient-to-br from-[#97C459] to-[#27500A] text-white shadow-clayButton"
                        : "bg-white/40 text-clay-muted hover:bg-white/80"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <AnimatePresence mode="popLayout">
                {Object.entries(mealPlan[activeDay]).map(([mealType, meal]) => (
                  <MealChecklistRow
                    key={mealType}
                    id={mealType}
                    mealName={meal.name}
                    calories={meal.cals}
                    cost={`${budget.currency}${meal.cost}`}
                    checked={meal.eaten}
                    toggle={(id) => handleToggleMeal(activeDay, id)}
                    disabled={activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center">
              <motion.button
                variants={clayButton}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                disabled={regenCount >= MAX_DAILY_REGENS || isRegenerating || activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                onClick={async () => {
                  if (regenCount >= MAX_DAILY_REGENS) return;
                  setIsRegenerating(true);
                  try {
                    const userData = {
                      profile,
                      metrics,
                      budget,
                      preferences,
                      allergies,
                      healthConditions
                    };
                    const dailyPlan = await generateDailyMealPlanAI(userData, activeDay);
                    // Only replace the active day
                    const newPlan = { ...mealPlan, [activeDay]: dailyPlan };
                    await updateMealPlan(newPlan);
                    const newCount = regenCount + 1;
                    setRegenCount(newCount);
                    const today = new Date().toISOString().split('T')[0];
                    localStorage.setItem('budgetarian_regen', JSON.stringify({ count: newCount, date: today }));
                  } catch (err) {
                    console.error('Regeneration failed:', err);
                  } finally {
                    setIsRegenerating(false);
                  }
                }}
                className="inline-flex h-12 items-center justify-center rounded-claySm border-2 border-[#EF9F27]/30 bg-transparent px-6 font-heading font-bold tracking-wide text-clay-secondary transition-all duration-200 hover:border-[#EF9F27] hover:bg-[#EF9F27]/5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className={`mr-2 h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' }) 
                  ? 'Viewing Only' 
                  : isRegenerating ? 'Regenerating...' : `Regenerate Day (${MAX_DAILY_REGENS - regenCount} left)`}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* CELL 2: TODAY'S MEAL PLAN */}
        <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-1">
          <div className="rounded-clay bg-white/65 p-6 md:p-8 shadow-clayCard backdrop-blur-xl h-full flex flex-col">
            <h3 className="font-heading text-2xl font-bold text-clay-fg mb-6">Today</h3>
            
            <div className="flex justify-center mb-6">
              <CalorieRing calories={todayCalories} maxCalories={targetDailyCalories} />
            </div>

            <div className="space-y-3 flex-1">
              {Object.entries(todayMeals).map(([mealType, meal]) => (
                <div key={mealType} className="flex items-center justify-between rounded-clayMd bg-[#EFEBF5] p-3 shadow-clayPressed">
                  <span className="font-body text-sm font-medium text-clay-muted">{mealType}</span>
                  <motion.button
                    whileTap={activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' }) ? {} : { scale: 0.88 }}
                    onClick={() => activeDay === new Date().toLocaleDateString('en-US', { weekday: 'long' }) && handleToggleMeal(activeDay, mealType)}
                    disabled={activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    className={`rounded-full px-3 py-1 font-body text-xs font-bold transition-colors ${
                      meal.eaten 
                        ? "bg-[#639922]/15 text-[#27500A]" 
                        : "bg-white shadow-clayCard text-clay-fg"
                    } ${activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'Long' }) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {meal.eaten ? "Done" : "Check"}
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CELL 3: BUDGET TRACKER */}
        <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-1">
          <motion.div 
            variants={cardFloat} 
            initial="rest" 
            whileHover="hover"
            className="rounded-clay bg-white/65 p-6 shadow-clayCard backdrop-blur-xl h-full"
          >
            <h3 className="font-heading text-xl font-bold text-clay-fg mb-6 text-center">Budget Tracker</h3>
            
            <motion.div 
              variants={breathe} 
              animate="animate"
              className="mx-auto mb-6 flex h-36 w-36 flex-col items-center justify-center rounded-full shadow-clayButton bg-gradient-to-br from-[#97C459] to-[#27500A]"
            >
              <span className="font-heading text-3xl font-black text-white">
                {budget.currency}{stats.remaining}
              </span>
              <span className="font-body text-xs text-white/80">remaining</span>
            </motion.div>

            <div className="space-y-2">
              {[
                { label: "Budget", value: `${budget.currency}${budget.weekly}`, color: "bg-[#639922]/15 text-[#27500A]" },
                { label: "Spent", value: `${budget.currency}${stats.spent}`, color: "bg-[#EF9F27]/15 text-[#BA7517]" },
                { label: "Left", value: `${budget.currency}${stats.remaining}`, color: "bg-[#3B6D11]/15 text-[#27500A]" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`flex items-center justify-between rounded-clayMd px-4 py-3 ${color}`}>
                  <span className="font-body text-sm font-medium">{label}</span>
                  <span className="font-heading font-bold">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* CELL 4: ADHERENCE STREAK */}
        <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-1">
          <div className="rounded-clay bg-white/65 p-6 shadow-clayCard backdrop-blur-xl h-full flex flex-col justify-center items-center text-center">
            <h3 className="font-heading text-xl font-bold text-clay-fg mb-4">Adherence Streak</h3>
            
            <motion.div variants={breathe} animate="animate" className="mb-4">
              <span className="font-heading text-5xl font-black text-clay-primary">{stats.streak}</span>
              <span className="font-heading text-xl font-bold text-clay-muted ml-1">days</span>
            </motion.div>

            <div className="flex gap-2 mb-4">
              {adherenceDots.map((checked, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className={`h-4 w-4 rounded-full ${
                    checked 
                      ? "bg-gradient-to-br from-[#639922] to-[#27500A] shadow-clayButton" 
                      : "bg-[#EFEBF5] shadow-clayPressed"
                  }`}
                />
              ))}
            </div>
            
            <p className="font-body text-sm text-clay-muted">Keep up the great work! You're staying right on track.</p>
          </div>
        </motion.div>

        {/* CELL 5: QUICK AI TIP */}
        <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-2">
          <div className="rounded-clay bg-white/65 p-6 shadow-clayCard backdrop-blur-xl border-l-4 border-[#EF9F27] flex items-start gap-4 h-full">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#EF9F27]/15">
              <Lightbulb className="h-6 w-6 text-[#BA7517]" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading text-lg font-bold text-clay-fg mb-1">NutriPlan Tip</h4>
              <p className="font-body text-clay-muted text-sm leading-relaxed">
                If you're finding it hard to hit your protein goals, consider adding a scoop of whey protein to your morning oatmeal. It blends perfectly and adds about 25g of protein with zero prep time!
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="h-8 w-8 flex-shrink-0 text-[#BA7517] hover:text-[#EF9F27] transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
