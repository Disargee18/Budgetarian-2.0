import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Check, RotateCcw, Lightbulb, Activity, Utensils, Target, Flame, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { premiumCard, premiumButton, breathe, fadeUp, staggerContainer, checkMark, scaleIn } from '../lib/animations';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import { generateDailyMealPlanAI } from '../lib/openrouterClient';

const MealChecklistRow = ({ id, mealName, calories, protein, cost, tags, checked, toggle, disabled }) => (
  <motion.div
    layout
    variants={premiumCard}
    initial="rest"
    whileHover={disabled ? "rest" : "hover"}
    className={`group relative flex items-center gap-4 rounded-premium p-4 glass-card transition-all duration-300 ${disabled ? "opacity-60" : ""}`}
  >
    <motion.button
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={() => !disabled && toggle(id)}
      disabled={disabled}
      className={`relative h-6 w-6 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
        checked
          ? "border-premium-emerald bg-premium-emerald"
          : "border-white/10 bg-white/5 hover:border-premium-emerald/50"
      }`}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg 
            variants={checkMark} 
            initial="hidden" 
            animate="visible" 
            exit="hidden"
            className="h-3.5 w-3.5 text-premium-bg" 
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 8l4 4 6-6" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <p className={`font-heading text-base font-semibold truncate ${checked ? "text-premium-text-muted line-through" : "text-white"}`}>
          {mealName}
        </p>
        <span className="font-heading text-sm font-bold text-premium-emerald">{cost}</span>
      </div>
      <div className="flex items-center gap-4 mt-1">
        <span className="text-[10px] font-medium text-premium-text-secondary uppercase tracking-wider">{calories} kcal</span>
        <span className="text-[10px] font-medium text-premium-text-secondary uppercase tracking-wider">{protein}g protein</span>
      </div>
    </div>
  </motion.div>
);

const CalorieRing = ({ calories, maxCalories }) => {
  const percent = Math.min((calories / maxCalories) * 100, 100);
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle className="stroke-white/5" strokeWidth="6" fill="transparent" r="35" cx="50" cy="50" />
        <motion.circle
          className="stroke-premium-emerald"
          strokeWidth="6"
          fill="transparent"
          r="35"
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
        <p className="font-heading text-2xl font-bold text-white">{calories}</p>
        <p className="text-[8px] font-bold text-premium-text-muted uppercase tracking-widest">Kcal</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { profile, budget, mealPlan, updateMealPlan, isLoading, metrics, preferences, allergies, healthConditions } = useUser();
  const [activeDay, setActiveDay] = useState('Monday');
  const MAX_DAILY_REGENS = 4;

  const getRegenCount = () => {
    const stored = localStorage.getItem('budgetarian_regen');
    if (!stored) return 0;
    const { count, date } = JSON.parse(stored);
    const today = new Date().toISOString().split('T')[0];
    return date === today ? count : 0;
  };

  const [regenCount, setRegenCount] = useState(getRegenCount());
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setActiveDay(days[new Date().getDay()]);
  }, []);

  const handleToggleMeal = (day, mealType) => {
    const newPlan = { ...mealPlan };
    newPlan[day][mealType].eaten = !newPlan[day][mealType].eaten;
    updateMealPlan(newPlan);
  };

  const stats = (() => {
    let spent = 0;
    let eatenCount = 0;
    let totalCount = 0;
    let streak = 0;
    Object.keys(mealPlan).forEach(day => {
      let dayComplete = true;
      Object.values(mealPlan[day]).forEach(meal => {
        totalCount++;
        if (meal.eaten) {
          spent += meal.cost;
          eatenCount++;
        } else {
          dayComplete = false;
        }
      });
      if (dayComplete && Object.keys(mealPlan[day]).length > 0) streak++;
    });
    return { spent, remaining: (budget?.weekly || 0) - spent, streak };
  })();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-[60vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-premium-emerald/20 border-t-premium-emerald animate-spin" />
        <p className="text-sm font-medium text-premium-text-secondary">Initializing Strategy...</p>
      </div>
    );
  }

  if (!profile || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-6">
        <div className="text-center glass-card p-10 rounded-premium-lg max-w-md">
          <Lightbulb size={32} className="mx-auto text-premium-amber mb-6" />
          <h2 className="font-heading text-2xl font-bold text-white mb-4">No Active Plan</h2>
          <p className="text-sm text-premium-text-secondary mb-8">Generate your first nutritional protocol to begin tracking.</p>
          <button
            onClick={async () => {
              setIsRegenerating(true);
              try {
                const userData = { profile, metrics, budget, preferences, allergies, healthConditions };
                let plan;
                try { plan = await generateMealPlanAI(userData); }
                catch (e) { plan = generateWeeklyPlan(userData).plan; }
                await updateMealPlan(plan);
              } finally { setIsRegenerating(false); }
            }}
            disabled={isRegenerating}
            className="w-full py-4 premium-button bg-premium-emerald text-premium-bg flex items-center justify-center gap-2"
          >
            {isRegenerating ? 'Generating...' : 'Start Now'}
          </button>
        </div>
      </div>
    );
  }

  const todayMeals = mealPlan[activeDay] || {};
  const todayCalories = Object.values(todayMeals).reduce((acc, meal) => acc + (meal.cals || 0), 0);
  const targetDailyCalories = 2000;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold text-white">
            Hello, <span className="text-premium-emerald">{profile.name}</span>
          </h2>
          <p className="text-sm text-premium-text-secondary mt-1">
            Your optimization plan for <span className="text-white font-semibold">{activeDay}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-premium-emerald/5 border border-premium-emerald/10">
          <div className="h-2 w-2 rounded-full bg-premium-emerald animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-premium-emerald">AI Engine Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main: Daily Plan */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 rounded-premium-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-heading text-lg font-bold text-white">Meal Protocol</h3>
              <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-white/5 border border-white/5 overflow-x-auto w-full sm:w-auto">
                {Object.keys(mealPlan).map(day => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeDay === day ? "bg-premium-emerald text-premium-bg" : "text-premium-text-muted hover:text-white"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(todayMeals).map(([mealType, meal], idx) => (
                <MealChecklistRow
                  key={mealType}
                  id={mealType}
                  mealName={meal.name}
                  calories={meal.cals}
                  protein={meal.protein || 0}
                  cost={`${budget.currency}${meal.cost}`}
                  tags={meal.tags}
                  checked={meal.eaten}
                  toggle={(id) => handleToggleMeal(activeDay, id)}
                  disabled={activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                />
              ))}
            </div>

            <div className="mt-8">
              <button
                disabled={regenCount >= MAX_DAILY_REGENS || isRegenerating || activeDay !== new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                onClick={async () => {
                  setIsRegenerating(true);
                  try {
                    const dailyPlan = await generateDailyMealPlanAI({ profile, metrics, budget, preferences, allergies, healthConditions }, activeDay);
                    const newPlan = { ...mealPlan, [activeDay]: dailyPlan };
                    await updateMealPlan(newPlan);
                    const newCount = regenCount + 1;
                    setRegenCount(newCount);
                    localStorage.setItem('budgetarian_regen', JSON.stringify({ count: newCount, date: new Date().toISOString().split('T')[0] }));
                  } finally { setIsRegenerating(false); }
                }}
                className="w-full py-3 rounded-premium border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                <RotateCcw size={14} className={isRegenerating ? 'animate-spin' : ''} />
                {isRegenerating ? 'Optimizing...' : `Regenerate Strategy (${MAX_DAILY_REGENS - regenCount})`}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-premium-lg relative overflow-hidden">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={16} className="text-premium-emerald" /> Intensity Status
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <CalorieRing calories={todayCalories} maxCalories={targetDailyCalories} />
              <div className="flex-1 space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-[8px] font-bold text-premium-text-muted uppercase mb-1">Status</p>
                  <p className={`text-xs font-black ${todayCalories > targetDailyCalories ? 'text-premium-amber' : 'text-premium-emerald'}`}>
                    {todayCalories > targetDailyCalories ? 'OVER LIMIT' : 'OPTIMAL'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-[8px] font-bold text-premium-text-muted uppercase mb-1">Daily Goal</p>
                  <p className="text-xs font-black text-white">{targetDailyCalories} kcal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-premium-lg border-l-4 border-premium-amber">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard size={16} className="text-premium-amber" /> Budget Flow
              </h3>
              <span className="text-[10px] font-bold text-premium-amber">{budget.currency}</span>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-white">{budget.currency}{stats.remaining.toFixed(0)}</p>
              <p className="text-[9px] font-bold text-premium-text-muted uppercase mt-1 tracking-widest">Available Credits</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-bold text-premium-text-muted uppercase">Usage</p>
                <p className="text-xs font-bold text-white">{budget.currency}{stats.spent.toFixed(0)}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-bold text-premium-text-muted uppercase">Limit</p>
                <p className="text-xs font-bold text-white">{budget.currency}{budget.weekly}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-premium-lg text-center">
            <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest mb-4">Consistency Streak</p>
            <p className="text-5xl font-bold text-premium-emerald mb-4">{stats.streak}</p>
            <div className="flex justify-center gap-1.5 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < stats.streak ? 'bg-premium-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
              ))}
            </div>
            <p className="text-[10px] italic text-premium-text-secondary">Maintain protocol for optimal results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
