import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [profile, setProfile] = useState(null);
  const [budget, setBudget] = useState({ weekly: 0, currency: '₱' });
  const [metrics, setMetrics] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [mealPlan, setMealPlan] = useState({}); // Weekly meal plan

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('budgetarian_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setIsRegistered(data.isRegistered || false);
        setProfile(data.profile || null);
        setBudget(data.budget || { weekly: 0, currency: '₱' });
        setMetrics(data.metrics || null);
        setPreferences(data.preferences || []);
        setAllergies(data.allergies || '');
        setHealthConditions(data.healthConditions || '');
        setMealPlan(data.mealPlan || {});
      } catch (err) {
        console.error("Failed to parse local storage data", err);
      }
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (isRegistered) {
      const dataToSave = {
        isRegistered,
        profile,
        budget,
        metrics,
        preferences,
        allergies,
        healthConditions,
        mealPlan,
      };
      localStorage.setItem('budgetarian_data', JSON.stringify(dataToSave));
    }
  }, [isRegistered, profile, budget, metrics, preferences, allergies, healthConditions, mealPlan]);

  const completeRegistration = (data) => {
    setProfile(data.profile);
    setBudget(data.budget);
    setMetrics(data.metrics);
    setPreferences(data.preferences);
    setAllergies(data.allergies);
    setHealthConditions(data.healthConditions);
    setIsRegistered(true);
  };

  const updateMealPlan = (newPlan) => {
    setMealPlan(newPlan);
  };

  const logout = () => {
    setIsRegistered(false);
    setProfile(null);
    setBudget({ weekly: 0, currency: '₱' });
    setMetrics(null);
    setPreferences([]);
    setAllergies('');
    setHealthConditions('');
    setMealPlan({});
    localStorage.removeItem('budgetarian_data');
  };

  const value = {
    isRegistered,
    profile,
    budget,
    metrics,
    preferences,
    allergies,
    healthConditions,
    mealPlan,
    completeRegistration,
    updateMealPlan,
    setBudget,
    setMetrics,
    setProfile,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
