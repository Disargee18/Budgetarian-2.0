import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import './Settings.css';

const Settings = () => {
  const { profile, budget, metrics, preferences, allergies, setBudget, setProfile, logout, updateMealPlan } = useUser();
  const navigate = useNavigate();

  const [editBudget, setEditBudget] = useState(budget.weekly);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveBudget = () => {
    setBudget({ ...budget, weekly: parseFloat(editBudget) });
    setSuccessMsg('Budget updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRegeneratePlan = () => {
    const userData = { profile, budget: { ...budget, weekly: parseFloat(editBudget) }, metrics, preferences, allergies };
    const { plan } = generateWeeklyPlan(userData);
    updateMealPlan(plan);
    setSuccessMsg('Meal plan regenerated based on new budget!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      logout();
      navigate('/register');
    }
  };

  return (
    <div className="settings-container">
      <header className="mb-lg">
        <h2>Settings</h2>
        <p className="text-muted">Manage your preferences and account.</p>
      </header>

      {successMsg && (
        <div className="alert-success mb-md">
          {successMsg}
        </div>
      )}

      <div className="bento-container settings-grid">
        <div className="bento-card">
          <h3 className="mb-md">Weekly Budget</h3>
          <div className="input-group">
            <label className="input-label">Update Amount ({budget.currency})</label>
            <div className="flex gap-sm">
              <input 
                type="number" 
                className="input-field" 
                value={editBudget} 
                onChange={(e) => setEditBudget(e.target.value)} 
              />
              <button className="btn btn-primary" onClick={handleSaveBudget}>Save</button>
            </div>
          </div>
          <p className="text-sm text-muted mt-sm">Changing your budget? You might want to regenerate your weekly plan to fit the new budget.</p>
          <button className="btn btn-outline mt-md" onClick={handleRegeneratePlan}>
            Regenerate Meal Plan
          </button>
        </div>

        <div className="bento-card">
          <h3 className="mb-md text-danger">Danger Zone</h3>
          <p className="text-sm text-muted mb-md">This will delete all your local data, including your profile, logs, and current meal plan.</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            Reset Account Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
