import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { profile, budget, mealPlan, updateMealPlan } = useUser();
  const [activeDay, setActiveDay] = useState('Monday');
  
  // Auto-select today
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

    Object.keys(mealPlan).forEach(day => {
      Object.values(mealPlan[day]).forEach(meal => {
        totalMeals++;
        if (meal.eaten) {
          spent += meal.cost;
          totalMealsEaten++;
        }
      });
    });

    const remaining = budget.weekly - spent;
    const isApproaching = remaining < (budget.weekly * 0.2);
    
    return { spent, remaining, isApproaching, adherence: Math.round((totalMealsEaten / totalMeals) * 100) || 0 };
  };

  if (!profile || Object.keys(mealPlan).length === 0) return <div>Loading...</div>;

  const stats = calculateBudgetStats();
  const todayMeals = mealPlan[activeDay];
  
  const todayCalories = Object.values(todayMeals).reduce((acc, meal) => acc + meal.cals, 0);
  const remainingMeals = Object.values(todayMeals).filter(m => !m.eaten).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header mb-lg">
        <h2>Hello, {profile.name}!</h2>
        <p className="text-muted">Here is your plan for this week.</p>
      </header>

      <div className="bento-container dashboard-grid">
        {/* Left Zone: Weekly Plan */}
        <div className="bento-card weekly-plan-card">
          <div className="flex justify-between items-center mb-md">
            <h3>Weekly Plan</h3>
            <div className="day-tabs">
              {Object.keys(mealPlan).map(day => (
                <button 
                  key={day} 
                  className={`day-tab ${activeDay === day ? 'active' : ''}`}
                  onClick={() => setActiveDay(day)}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="meals-list">
            {Object.entries(mealPlan[activeDay]).map(([mealType, meal]) => (
              <div key={mealType} className={`meal-item ${meal.eaten ? 'eaten' : ''}`}>
                <div className="meal-info">
                  <div className="flex items-center gap-sm">
                    <span className="meal-type">{mealType}</span>
                    <span className="meal-calories">{meal.cals} kcal</span>
                    <span className="meal-cost">{budget.currency}{meal.cost}</span>
                  </div>
                  <h4>{meal.name}</h4>
                  <p className="text-sm text-muted">{meal.description}</p>
                </div>
                <div className="meal-actions">
                  <button className="btn-icon" onClick={() => handleToggleMeal(activeDay, mealType)}>
                    {meal.eaten ? <CheckCircle2 className="text-success" /> : <Circle className="text-muted" />}
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-md text-center">
              <button className="btn btn-outline text-sm">
                <RefreshCw size={14} className="mr-sm" /> Regenerate Day
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone: Today's Highlight */}
        <div className="bento-card today-card">
          <h3 className="mb-md">Today: {activeDay}</h3>
          <div className="today-summary mb-lg">
            <div className="summary-stat">
              <span className="stat-value">{todayCalories}</span>
              <span className="stat-label">Total Kcal</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{remainingMeals}</span>
              <span className="stat-label">Meals Left</span>
            </div>
          </div>
          <div className="quick-check-list">
            {Object.entries(todayMeals).map(([mealType, meal]) => (
              <div key={mealType} className="quick-check-item">
                <span>{mealType}</span>
                <button 
                  className={`btn-check ${meal.eaten ? 'checked' : ''}`}
                  onClick={() => handleToggleMeal(activeDay, mealType)}
                >
                  {meal.eaten ? 'Done' : 'Check'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left: Budget Tracker */}
        <div className={`bento-card budget-card ${stats.isApproaching ? 'warning' : 'safe'}`}>
          <h3>Weekly Budget</h3>
          <div className="budget-stats mt-md">
            <div className="budget-main">
              <span className="text-sm text-muted">Remaining</span>
              <span className={`budget-amount ${stats.isApproaching ? 'text-warning' : 'text-success'}`}>
                {budget.currency}{stats.remaining}
              </span>
            </div>
            <div className="budget-divider"></div>
            <div className="budget-sub">
              <div>
                <span className="text-xs text-muted">Total</span>
                <div className="text-sm font-medium">{budget.currency}{budget.weekly}</div>
              </div>
              <div>
                <span className="text-xs text-muted">Spent</span>
                <div className="text-sm font-medium">{budget.currency}{stats.spent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Adherence */}
        <div className="bento-card adherence-card">
          <h3>Adherence</h3>
          <div className="adherence-content flex items-center justify-between mt-md">
            <div className="adherence-circle">
              <span>{stats.adherence}%</span>
            </div>
            <div className="adherence-text">
              <p className="font-medium mb-xs">Great job!</p>
              <p className="text-sm text-muted">You're staying on track with your plan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
