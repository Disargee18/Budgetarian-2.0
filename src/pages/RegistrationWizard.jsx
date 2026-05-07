import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import { generateDailyMealPlanAI } from '../lib/openrouterClient';
import { Camera, Check, Activity, Target, Zap, Heart, Scale, Flame, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { PRESET_AVATARS } from '../lib/avatars';
import { ClayCard, ClayButton, ClayInput, ClayBadge } from '../components/ClayComponents';

const STEPS = [
  'Identity',
  'Basics',
  'Metrics',
  'Activity',
  'Goal',
  'Dietary',
  'Budget'
];

const SelectionCard = ({ selected, title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-5 rounded-clay-sm p-5 transition-all duration-300 border-2 ${
      selected
        ? "bg-white shadow-clayButton border-clay-accent text-clay-foreground -translate-y-1"
        : "bg-[#EFEBF5] border-transparent text-clay-muted shadow-clayPressed hover:bg-white"
    }`}
  >
    <span className={`flex items-center justify-center text-xl h-12 w-12 rounded-[14px] transition-colors ${selected ? 'bg-clay-accent text-white shadow-clayButton' : 'bg-white shadow-clayCard text-clay-accent'}`}>{icon}</span>
    <div className="text-left flex-1">
      <p className="text-sm font-black uppercase tracking-wide">{title}</p>
      {description && <p className="text-[10px] text-clay-muted mt-1 font-medium">{description}</p>}
    </div>
    {selected && (
      <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-clay-accent text-white shadow-clayButton animate-clay-breathe">
        <Check size={14} strokeWidth={4} />
      </div>
    )}
  </button>
);

const RegistrationWizard = () => {
  const { completeRegistration, updateMealPlan } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    dob: '',
    gender: '',
    height: '',
    weight: '',
    activity: '',
    goal: '',
    diet: [],
    allergies: '',
    healthConditions: '',
    budget: '',
    currency: '₱'
  });

  const validateStep = () => {
    switch (currentStep) {
      case 0: if (!formData.name.trim()) return 'Enter your name.'; break;
      case 1: if (!formData.dob || !formData.gender) return 'Complete all fields.'; break;
      case 2: if (!formData.height || !formData.weight) return 'Complete all fields.'; break;
      case 3: if (!formData.activity) return 'Select activity level.'; break;
      case 4: if (!formData.goal) return 'Select a goal.'; break;
      case 6: if (!formData.budget) return 'Set your budget.'; break;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) { setValidationError(error); return; }
    setValidationError('');
    if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
    else finishRegistration();
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const finishRegistration = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const userData = {
        profile: { name: formData.name, age, gender: formData.gender, photo: formData.photo },
        metrics: { height: parseFloat(formData.height), weight: parseFloat(formData.weight), activity: formData.activity, goal: formData.goal },
        budget: { weekly: parseFloat(formData.budget), currency: formData.currency },
        preferences: formData.diet,
        allergies: formData.allergies,
        healthConditions: formData.healthConditions
      };
      const userId = await completeRegistration(userData);
      try {
        const plan = await generateDailyMealPlanAI(userData, 'Monday'); // Initial generation
        await updateMealPlan({ 'Monday': plan }, userId);
      } catch (e) {
        const { plan } = generateWeeklyPlan(userData);
        await updateMealPlan(plan, userId);
      }
      navigate('/dashboard');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black text-clay-foreground mb-1">Create Profile</h2>
              <p className="text-[10px] text-clay-muted uppercase tracking-[0.2em] font-black">Initial Setup</p>
            </div>
            <div className="flex flex-col items-center gap-6">
               <div className="relative h-32 w-32 rounded-clay-md border-4 border-white bg-clay-canvas overflow-hidden flex items-center justify-center shadow-clayCard transition-all hover:scale-105">
                 {formData.photo ? <img src={formData.photo} className="h-full w-full object-cover" /> : <Camera size={32} className="text-clay-muted/20" />}
               </div>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                 {PRESET_AVATARS.slice(0, 8).map(avatar => (
                   <button key={avatar.id} onClick={() => setFormData({...formData, photo: avatar.src})} className={`p-1 rounded-clay-sm border-2 transition-all duration-300 ${formData.photo === avatar.src ? 'border-clay-accent bg-white shadow-clayButton -translate-y-1' : 'border-transparent hover:border-clay-border'}`}>
                     <img src={avatar.src} className="h-10 w-10 rounded-[12px] object-cover" />
                   </button>
                 ))}
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Full Name</label>
              <ClayInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Alex Henderson" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-clay-foreground">Basic Info</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Birthdate</label>
                <ClayInput type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} onClick={() => setFormData({...formData, gender: g})} className={`flex-1 h-14 rounded-clay-sm border-2 font-black text-xs uppercase tracking-widest transition-all duration-300 ${formData.gender === g ? 'bg-white shadow-clayButton border-clay-accent text-clay-accent -translate-y-1' : 'bg-[#EFEBF5] border-transparent text-clay-muted shadow-clayPressed hover:bg-white'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-clay-foreground">Biometrics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Height (cm)</label>
                <ClayInput type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="180" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Weight (kg)</label>
                <ClayInput type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="75" />
              </div>
            </div>
          </div>
        );
      case 3:
        const activities = [
          { level: 'Sedentary', icon: <User />, desc: 'Low movement' },
          { level: 'Light', icon: <Heart />, desc: '1-2 times/week' },
          { level: 'Moderate', icon: <Activity />, desc: '3-5 times/week' },
          { level: 'Athletic', icon: <Flame />, desc: 'Daily intense' },
          { level: 'Elite', icon: <Zap />, desc: 'Professional' },
        ];
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-clay-foreground mb-4">Activity</h2>
            {activities.map(act => (
              <SelectionCard key={act.level} selected={formData.activity === act.level} onClick={() => setFormData({...formData, activity: act.level})} title={act.level} description={act.desc} icon={act.icon} />
            ))}
          </div>
        );
      case 4:
        const goals = [
          { goal: 'Shred Fat', icon: <Flame /> },
          { goal: 'Bulk Up', icon: <Zap /> },
          { goal: 'Maintain', icon: <Target /> },
          { goal: 'Performance', icon: <Scale /> },
        ];
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-clay-foreground mb-4">Goal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map(g => (
                <SelectionCard key={g.goal} selected={formData.goal === g.goal} onClick={() => setFormData({...formData, goal: g.goal})} title={g.goal} icon={g.icon} />
              ))}
            </div>
          </div>
        );
      case 5:
        const diets = ['Vegan', 'Keto', 'Asian', 'Low Carb', 'Halal'];
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-clay-foreground">Preferences</h2>
            <div className="flex flex-wrap gap-3">
              {diets.map(diet => (
                <button key={diet} onClick={() => {
                  const newDiet = formData.diet.includes(diet) ? formData.diet.filter(d => d !== diet) : [...formData.diet, diet];
                  setFormData({...formData, diet: newDiet});
                }} className={`px-6 py-2.5 rounded-full border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${formData.diet.includes(diet) ? 'bg-clay-accent/10 border-clay-accent text-clay-accent' : 'bg-[#EFEBF5] border-transparent text-clay-muted shadow-clayPressed'}`}>{diet}</button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-clay-muted uppercase tracking-widest ml-2">Restrictions</label>
              <ClayInput value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-clay-foreground">Budget</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <select 
                   className="h-16 w-24 rounded-clay-sm bg-white border border-clay-border shadow-clayCard font-black text-2xl text-clay-accent text-center appearance-none focus:outline-none focus:ring-4 focus:ring-clay-accent/20" 
                   value={formData.currency} 
                   onChange={e => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="₱">₱</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                </select>
              </div>
              <input 
                type="number" 
                className="h-16 flex-1 rounded-clay-sm bg-[#EFEBF5] shadow-clayPressed border-0 px-8 font-black text-4xl text-clay-foreground text-center focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay-accent/20 transition-all" 
                value={formData.budget} 
                onChange={e => setFormData({...formData, budget: e.target.value})} 
                placeholder="0000" 
              />
            </div>
            {formData.budget && (
              <ClayCard className="p-8 text-center bg-white/50">
                <p className="text-[10px] font-black text-clay-muted uppercase tracking-widest mb-2">Daily Limit Estimate</p>
                <p className="text-4xl font-black text-clay-green">{formData.currency}{(parseFloat(formData.budget) / 7).toFixed(0)}</p>
              </ClayCard>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-clay-canvas flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#22C55E]/10 blur-3xl animate-clay-float" />
        <div className="absolute -right-[10%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-[#84CC16]/10 blur-3xl animate-clay-float-delayed" />
        <div className="absolute bottom-[5%] left-[30%] h-[40vh] w-[40vh] rounded-full bg-[#10B981]/10 blur-3xl animate-clay-float-slow" />
      </div>

      <div className="w-full max-w-xl z-10">
        <ClayCard className="p-8 sm:p-12 bg-white/90 backdrop-blur-xl">
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <p className="text-[11px] font-black text-clay-accent uppercase tracking-[0.3em]">{STEPS[currentStep]}</p>
              <span className="text-[11px] font-black text-clay-muted uppercase tracking-widest">{currentStep + 1} / {STEPS.length}</span>
            </div>
            <div className="h-2 w-full bg-[#EFEBF5] shadow-clayPressed rounded-full overflow-hidden">
              <motion.div animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} className="h-full bg-gradient-clay shadow-clayButton" />
            </div>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {validationError && (
             <div className="mt-6 p-4 rounded-clay-sm bg-clay-red/5 border border-clay-red/10 text-center text-[10px] font-black text-clay-red uppercase tracking-widest">
               {validationError}
             </div>
          )}

          <div className="mt-12 flex gap-4">
            {currentStep > 0 && (
              <ClayButton onClick={handleBack} variant="ghost" className="h-14 w-14">
                <ChevronLeft size={24} />
              </ClayButton>
            )}
            <ClayButton onClick={handleNext} disabled={isSubmitting} variant="primary" className="flex-1 h-14 text-sm">
              {currentStep === STEPS.length - 1 ? (isSubmitting ? 'Finalizing...' : 'Complete Registration') : 'Continue'}
            </ClayButton>
          </div>
        </ClayCard>
        <p className="mt-10 text-center text-[10px] text-clay-muted font-black uppercase tracking-[0.4em]">Personalization Protocol</p>
      </div>
    </div>
  );
};

export default RegistrationWizard;
