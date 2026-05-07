import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Check, RotateCcw, Lightbulb, Activity, Utensils, Target, Flame, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard, ClayButton, ClayBadge, ClayProgressBar } from '../components/ClayComponents';
import { generateMealPlanAI, generateDailyMealPlanAI } from '../lib/openrouterClient';

const MealChecklistRow = ({ id, mealName, calories, protein, cost, tags, checked, toggle, disabled }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`group relative flex items-center gap-3.5 rounded-[16px] p-4 bg-white/70 shadow-clayCard border border-clay-border transition-all duration-300 hover:-translate-y-0.5 ${disabled ? "opacity-60" : ""}`}
  >
    <motion.button
      whileTap={disabled ? {} : { scale: 0.85 }}
      onClick={() => !disabled && toggle(id)}
      disabled={disabled}
      className={`relative h-6 w-6 flex-shrink-0 rounded-[8px] flex items-center justify-center transition-all duration-300 shadow-clayButton active:shadow-clayPressed ${
        checked
          ? "bg-gradient-income text-white"
          : "bg-[#EFEBF5] text-clay-muted hover:bg-white"
      }`}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            className="h-3.5 w-3.5" 
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 8l4 4 6-6" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2.5">
        <p className={`text-base font-extrabold truncate transition-all duration-300 ${checked ? "text-clay-muted/50 line-through" : "text-clay-foreground"}`}>
          {mealName}
        </p>
        <span className="text-base font-black text-clay-green shrink-0">{cost}</span>
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        <ClayBadge variant="sky">{calories} kcal</ClayBadge>
        <ClayBadge variant="primary">{protein}g</ClayBadge>
      </div>
    </div>
  </motion.div>
);

const CalorieRing = ({ calories, maxCalories }) => {
  const percent = Math.min((calories / maxCalories) * 100, 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-clayCard border border-clay-border p-1.5">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle className="stroke-clay-canvas" strokeWidth="10" fill="transparent" r="30" cx="50" cy="50" />
        <motion.circle
          className="stroke-clay-green"
          strokeWidth="10"
          fill="transparent"
          r="30"
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
        <p className="text-xl font-black text-clay-foreground">{calories}</p>
        <p className="text-[9px] font-black text-clay-muted uppercase tracking-widest">Kcal</p>
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
      <div className="flex flex-col h-full min-h-[50vh] items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white shadow-clayCard flex items-center justify-center border border-clay-border">
          <div className="h-8 w-8 rounded-full border-2 border-clay-green/20 border-t-clay-green animate-spin" />
        </div>
        <p className="text-sm font-bold text-clay-muted">Updating plan...</p>
      </div>
    );
  }

  if (!profile || Object.keys(mealPlan).length === 0) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-4">
        <ClayCard className="text-center max-w-sm p-8">
          <div className="h-14 w-14 rounded-full bg-gradient-amber shadow-clayButton flex items-center justify-center mx-auto mb-6">
            <Lightbulb size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-clay-foreground mb-2">No Active Plan</h2>
          <p className="text-sm text-clay-muted font-medium mb-6">Let's generate your first plan to begin tracking.</p>
          <ClayButton
            onClick={async () => {
              setIsRegenerating(true);
              try {
                const userData = { profile, metrics, budget, preferences, allergies, healthConditions };
                const plan = await generateMealPlanAI(userData);
                await updateMealPlan(plan);
              } catch (e) {
                console.error("Failed to generate AI plan:", e);
                alert("Failed to generate meal plan. Please try again.");
              } finally { setIsRegenerating(false); }
            }}
            disabled={isRegenerating}
            variant="success"
            className="w-full h-11"
          >
            {isRegenerating ? 'Generating...' : 'Start Now'}
          </ClayButton>
        </ClayCard>
      </div>
    );
  }

  const todayMeals = mealPlan[activeDay] || {};
  const todayCalories = Object.values(todayMeals).reduce((acc, meal) => acc + (meal.cals || 0), 0);
  const targetDailyCalories = 2000;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-clay-foreground">
            Hello, <span className="text-clay-accent">{profile.name}</span>
          </h2>
          <p className="text-sm text-clay-muted font-medium mt-1">
            Your plan for <span className="text-clay-foreground font-extrabold">{activeDay}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white shadow-clayCard border border-clay-border w-fit">
          <div className="h-2 w-2 rounded-full bg-clay-green shadow-[0_0_8px_rgba(22,163,74,0.5)] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-clay-green">AI Engine Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main: Daily Plan */}
        <div className="lg:col-span-8 space-y-6">
          <ClayCard className="p-0 overflow-visible bg-white/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-xl font-black text-clay-foreground">Meal Protocol</h3>
                <div className="flex flex-nowrap gap-1 p-1.5 rounded-[18px] bg-[#EFEBF5] shadow-clayPressed overflow-x-auto scrollbar-hide w-full sm:w-auto">
                  {Object.keys(mealPlan).map(day => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-wider transition-all duration-300 min-w-[44px] ${
                        activeDay === day 
                          ? "bg-white shadow-clayButton text-clay-accent -translate-y-0.5" 
                          : "text-clay-muted hover:text-clay-foreground"
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3.5">
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
                  className="w-full py-4 rounded-[16px] bg-white border border-clay-border shadow-clayButton text-[10px] font-black uppercase tracking-widest text-clay-muted hover:text-clay-foreground hover:shadow-clayButtonHover hover:-translate-y-0.5 active:scale-[0.96] active:shadow-clayPressed transition-all flex items-center justify-center gap-2.5 disabled:opacity-30"
                >
                  <RotateCcw size={16} className={isRegenerating ? 'animate-spin' : ''} />
                  {isRegenerating ? 'Updating...' : `Regenerate Plan (${MAX_DAILY_REGENS - regenCount})`}
                </button>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* Sidebar: Stats */}
        <div className="lg:col-span-4 space-y-6">
          <ClayCard className="p-6 bg-white/80">
            <h3 className="text-base font-black text-clay-foreground mb-6 flex items-center gap-2.5">
              <Activity size={18} className="text-clay-green" /> Status
            </h3>
            <div className="flex flex-col items-center gap-6">
              <CalorieRing calories={todayCalories} maxCalories={targetDailyCalories} />
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="p-3 rounded-[16px] bg-[#EFEBF5] shadow-clayPressed text-center">
                  <p className="text-[9px] font-black text-clay-muted uppercase mb-0.5 tracking-widest">Health</p>
                  <p className={`text-xs font-black ${todayCalories > targetDailyCalories ? 'text-clay-red' : 'text-clay-green'}`}>
                    {todayCalories > targetDailyCalories ? 'OVER' : 'OPTIMAL'}
                  </p>
                </div>
                <div className="p-3 rounded-[16px] bg-[#EFEBF5] shadow-clayPressed text-center">
                  <p className="text-[9px] font-black text-clay-muted uppercase mb-0.5 tracking-widest">Goal</p>
                  <p className="text-xs font-black text-clay-foreground">{targetDailyCalories}</p>
                </div>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6 border-l-4 border-clay-amber bg-white/80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-clay-foreground flex items-center gap-2.5">
                <CreditCard size={18} className="text-clay-amber" /> Budget
              </h3>
              <ClayBadge variant="amber">{budget.currency}</ClayBadge>
            </div>
            <div className="text-center py-4">
              <p className="text-4xl font-black text-clay-foreground">{budget.currency}{stats.remaining.toFixed(0)}</p>
              <p className="text-[9px] font-black text-clay-muted uppercase mt-1.5 tracking-[0.2em]">Available</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-[16px] bg-[#EFEBF5] shadow-clayPressed text-center">
                <p className="text-[9px] font-black text-clay-muted uppercase mb-0.5 tracking-widest">Used</p>
                <p className="text-xs font-black text-clay-foreground">{budget.currency}{stats.spent.toFixed(0)}</p>
              </div>
              <div className="p-3 rounded-[16px] bg-[#EFEBF5] shadow-clayPressed text-center">
                <p className="text-[9px] font-black text-clay-muted uppercase mb-0.5 tracking-widest">Limit</p>
                <p className="text-xs font-black text-clay-foreground">{budget.currency}{budget.weekly}</p>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6 text-center bg-gradient-to-br from-white to-[#F4F1FA]">
            <p className="text-[10px] font-black text-clay-muted uppercase tracking-[0.2em] mb-4">Streak</p>
            <div className="relative inline-flex items-center justify-center mb-6">
               <div className="absolute inset-0 bg-clay-green/10 blur-xl rounded-full" />
               <p className="text-6xl font-black text-clay-green relative z-10">{stats.streak}</p>
            </div>
            <div className="flex justify-center gap-1.5 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full shadow-sm transition-all duration-500 ${i < stats.streak ? 'bg-clay-green scale-110 shadow-[0_0_8px_rgba(22,163,74,0.3)]' : 'bg-[#EFEBF5] shadow-clayPressed'}`} />
              ))}
            </div>
            <p className="text-[10px] italic text-clay-muted font-medium">Keep it up!</p>
          </ClayCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
