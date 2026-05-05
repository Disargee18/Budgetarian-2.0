import React, { createContext, useContext, useState, useEffect, useRef  } from 'react';
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
  const lastLoadedId = useRef(null);

  useEffect(() => {
    const handleAuthEvent = async (event, currentSession) => {
      setSession(currentSession);
      
      if (currentSession) {
        const userId = currentSession.user.id;
        
        // Skip reloading if we already have data for this user
        // This is crucial to prevent re-fetching on tab focus (TOKEN_REFRESHED)
        if (userId === lastLoadedId.current && isRegistered && profile) {
          return;
        }

        // Only show loading screen for initial load or user change
        if (userId !== lastLoadedId.current) {
          setIsLoading(true);
        }

        lastLoadedId.current = userId;
        await loadUserData(userId);
      } else {
        lastLoadedId.current = null;
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
    };

    // Initialize session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        handleAuthEvent('INITIAL_SESSION', initialSession);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // SIGNED_OUT is handled here to clear state
      if (event === 'SIGNED_OUT') {
        handleAuthEvent(event, null);
      } else if (session) {
        handleAuthEvent(event, session);
      }
    });

    return () => subscription.unsubscribe();
  }, [isRegistered, profile]); // Add dependencies to check state in handleAuthEvent

  const loadUserData = async (userId) => {
    // We don't set isLoading(true) here anymore, it's handled in handleAuthEvent
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
          photo: profileData.profile_picture_url
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
    if (!uid) throw new Error("No user ID available to save profile");
    
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
        profile_picture_url: userData.profile.photo,
        goal: userData.metrics.goal
      }, { onConflict: 'user_id', ignoreDuplicates: false });
    
    if (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  const saveBudget = async (userData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) throw new Error("No user ID available to save budget");
    
    const { error } = await supabase
      .from('user_budgets')
      .upsert({ 
        user_id: uid, 
        weekly_budget: userData.budget.weekly, 
        currency: userData.budget.currency 
      }, { onConflict: 'user_id' });
      
    if (error) {
      console.error("Error saving budget:", error);
      throw error;
    }
  };

  const savePreferences = async (userData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) throw new Error("No user ID available to save preferences");
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: uid, 
        preferences: userData.preferences, 
        allergies: userData.allergies, 
        health_conditions: userData.healthConditions 
      }, { onConflict: 'user_id' });
      
    if (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  };

  const saveMealPlan = async (planData, userId) => {
    const uid = userId || session?.user?.id;
    if (!uid) {
      console.warn("No user ID available to save meal plan, skipping Supabase save.");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('meal_plans')
      .insert({ 
        user_id: uid, 
        week_start_date: today,
        plan_data: planData 
      });
    if (error) {
      console.error("Error saving meal plan:", error);
      throw error;
    }
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
      // Fallback: try to get user from state if available
      userId = session?.user?.id;
      userEmail = session?.user?.email;
    }

    if (!userId) {
      throw new Error('Final check failed: No userId available for registration');
    }

    // Ensure user exists in users table for foreign key constraints
    const { error: userError } = await supabase.from('users').upsert({ id: userId, email: userEmail });
    if (userError) {
      console.error('Error creating user row:', userError);
      throw userError;
    }

    // Save everything to Supabase first
    try {
      await Promise.all([
        saveProfile(data, userId),
        saveBudget(data, userId),
        savePreferences(data, userId)
      ]);

      // If successful, update local state
      setProfile(data.profile);
      setBudget(data.budget);
      setMetrics(data.metrics);
      setPreferences(data.preferences);
      setAllergies(data.allergies);
      setHealthConditions(data.healthConditions);
      setIsRegistered(true);
      return userId;
    } catch (err) {
      console.error("Failed to complete registration in Supabase:", err);
      throw err;
    }
  };

  const updateMealPlan = async (newPlan, userId) => {
    setMealPlan(newPlan);
    try {
      await saveMealPlan(newPlan, userId);
    } catch (err) {
      console.error("Failed to save updated meal plan:", err);
    }
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
    session,
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
