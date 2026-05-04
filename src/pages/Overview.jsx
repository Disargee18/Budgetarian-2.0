import React from 'react';
import { useUser } from '../context/UserContext';
import { calculateTDEE, adjustCaloriesForGoal } from '../lib/mealGenerator';
import { Edit2, Flame, Target, Utensils } from 'lucide-react';
import './Overview.css';
import { Link } from 'react-router-dom';

const Overview = () => {
  const { profile, metrics, mealPlan } = useUser();

  if (!profile || !metrics) return <div>Loading...</div>;

  const bmi = (metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);
  const tdee = calculateTDEE(metrics.weight, metrics.height, profile.age, profile.gender, metrics.activity);
  const targetCals = adjustCaloriesForGoal(tdee, metrics.goal);

  // Calculate meals logged
  let totalMeals = 0;
  let eatenMeals = 0;
  Object.values(mealPlan).forEach(day => {
    Object.values(day).forEach(meal => {
      totalMeals++;
      if (meal.eaten) eatenMeals++;
    });
  });

  return (
    <div className="overview-container">
      <header className="mb-lg">
        <h2>Your Profile Overview</h2>
      </header>

      <div className="bento-container overview-grid">
        {/* Profile Card */}
        <div className="bento-card profile-main-card">
          <div className="profile-header">
            <div className="avatar-circle">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl mb-xs">{profile.name}</h3>
              <p className="text-muted">{profile.age} years • {profile.gender}</p>
            </div>
          </div>
          
          <div className="profile-stats mt-lg">
            <div className="stat-box">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{metrics.weight} kg</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Height</span>
              <span className="stat-value">{metrics.height} cm</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">BMI</span>
              <span className="stat-value">{bmi}</span>
            </div>
          </div>
          
          <div className="mt-md flex justify-center">
            <Link to="/settings" className="btn btn-outline text-sm">
              <Edit2 size={14} className="mr-sm" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Goal Badge */}
        <div className="bento-card goal-card">
          <Target className="text-primary mb-md" size={32} />
          <h3 className="mb-xs text-lg">Current Goal</h3>
          <p className="font-medium text-primary-dark">{metrics.goal}</p>
          <div className="goal-target mt-md">
            <Flame className="text-accent mr-sm" size={18} />
            <span>Target: {targetCals} kcal/day</span>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bento-card summary-card">
          <Utensils className="text-primary mb-md" size={32} />
          <h3 className="mb-xs text-lg">Weekly Summary</h3>
          <p className="text-muted mb-md">Meals Logged</p>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${(eatenMeals / totalMeals) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm font-medium mt-sm">{eatenMeals} / {totalMeals} meals eaten</p>
        </div>

        {/* Daily Tip */}
        <div className="bento-card tip-card">
          <h3 className="mb-md text-primary-dark">💡 Daily Health Tip</h3>
          <p className="font-medium text-lg leading-relaxed">
            "Drinking a glass of water before meals can help you feel more full and support digestion. Stay hydrated!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
