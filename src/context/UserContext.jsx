import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

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

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
      } else {
        // Clear state if logged out
        setIsRegistered(false);
        setProfile(null);
        setBudget({ weekly: 0, currency: '₱' });
        setMetrics(null);
        setPreferences([]);
        setAllergies('');
        setHealthConditions('');
        setMealPlan({});
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    setIsLoading(true);
    let fallbackToLocal = false;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch budget
      const { data: budgetData } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch preferences
      const { data: prefData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch meal plan
      const { data: mealData } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileData) {
        setProfile({
          name: profileData.name,
          age: profileData.age,
          gender: profileData.gender,
          photo: profileData.photo
        });
        setMetrics({
          height: profileData.height,
          weight: profileData.weight,
          activity: profileData.activity_level,
          goal: profileData.goal
        });
        setIsRegistered(true);
      }

      if (budgetData) {
        setBudget({
          weekly: budgetData.weekly_budget,
          currency: budgetData.currency
        });
      }

      if (prefData) {
        setPreferences(prefData.preferences || []);
        setAllergies(prefData.allergies || '');
        setHealthConditions(prefData.health_conditions || '');
      }

      if (mealData) {
        setMealPlan(mealData.plan_data || {});
      }

    } catch (err) {
      console.error("Failed to load data from Supabase", err);
      fallbackToLocal = true;
    }

    if (fallbackToLocal || !isRegistered) {
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
    }

    setIsLoading(false);
  };

  const saveProfile = async (userData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) return;
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: uid, 
        name: userData.profile.name, 
        age: userData.profile.age, 
        weight: userData.metrics.weight, 
        height: userData.metrics.height,
        gender: userData.profile.gender,
        activity_level: userData.metrics.activity,
        photo: userData.profile.photo,
        goal: userData.metrics.goal
      }, { onConflict: 'user_id' });
    if (error) console.error("Error saving profile:", error);
  };

  const saveBudget = async (userData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) return;
    const { error } = await supabase
      .from('user_budgets')
      .upsert({ 
        user_id: uid, 
        weekly_budget: userData.budget.weekly, 
        currency: userData.budget.currency 
      }, { onConflict: 'user_id' });
    if (error) console.error("Error saving budget:", error);
  };

  const savePreferences = async (userData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) return;
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: uid, 
        preferences: userData.preferences, 
        allergies: userData.allergies, 
        health_conditions: userData.healthConditions 
      }, { onConflict: 'user_id' });
    if (error) console.error("Error saving preferences:", error);
  };

  const saveMealPlan = async (planData) => {
    if (!session?.user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('meal_plans')
      .insert({ 
        user_id: session.user.id, 
        week_start_date: today,
        plan_data: planData 
      });
    if (error) console.error("Error saving meal plan:", error);
  };

  // Save to local storage whenever state changes (fallback)
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

  const completeRegistration = async (data) => {
    setProfile(data.profile);
    setBudget(data.budget);
    setMetrics(data.metrics);
    setPreferences(data.preferences);
    setAllergies(data.allergies);
    setHealthConditions(data.healthConditions);
    setIsRegistered(true);

    // Get fresh session to ensure userId is available, with a small retry
    let currentSession = null;
    let userId = null;
    let userEmail = null;

    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.auth.getSession();
      currentSession = data.session;
      if (currentSession?.user?.id) {
        userId = currentSession.user.id;
        userEmail = currentSession.user.email;
        break;
      }
      await new Promise(r => setTimeout(r, 500)); // Wait 500ms between retries
    }

    if (!userId) {
      console.error('No userId available during registration save even after retries');
      // Fallback: try to get user from state if available
      userId = session?.user?.id;
      userEmail = session?.user?.email;
    }

    if (!userId) {
      console.error('Final check failed: No userId available');
      return;
    }

    // Ensure user exists in users table for foreign key constraints
    const { error: userError } = await supabase.from('users').upsert({ id: userId, email: userEmail }, { onConflict: 'id' });
    if (userError) console.error('Error creating user row:', userError);

    await saveProfile(data, userId);
    await saveBudget(data, userId);
    await savePreferences(data, userId);
  };

  const updateMealPlan = async (newPlan) => {
    setMealPlan(newPlan);
    await saveMealPlan(newPlan);
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
    isLoading,
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
    logout,
    loadUserData,
    saveProfile,
    saveBudget,
    savePreferences,
    saveMealPlan,
    setPreferences,
    setAllergies,
    setHealthConditions
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
