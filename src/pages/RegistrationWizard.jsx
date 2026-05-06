import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import { generateMealPlanAI } from '../lib/openrouterClient';
import { fadeUp } from '../lib/animations';
import { Camera, Check, Activity, Target, Zap, Heart, Scale, Flame, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { PRESET_AVATARS } from '../lib/avatars';

const STEPS = [
  'Identity',
  'Basics',
  'Metrics',
  'Activity',
  'Goal',
  'Dietary',
  'Budget'
];

const PremiumInput = (props) => (
  <input
    className="h-12 w-full glass-input px-4 font-body text-sm placeholder:text-premium-text-muted transition-all"
    {...props}
  />
);

const SelectionCard = ({ selected, title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-premium p-4 transition-all duration-300 border-2 ${
      selected
        ? "bg-premium-emerald/10 border-premium-emerald text-white"
        : "bg-white/5 border-white/5 text-premium-text-secondary hover:border-white/10"
    }`}
  >
    <span className={`flex items-center justify-center text-xl h-10 w-10 rounded-lg transition-colors ${selected ? 'bg-premium-emerald text-premium-bg' : 'bg-white/5 text-premium-emerald'}`}>{icon}</span>
    <div className="text-left flex-1">
      <p className="font-heading text-sm font-bold">{title}</p>
      {description && <p className="text-[10px] text-premium-text-muted mt-0.5">{description}</p>}
    </div>
    {selected && (
      <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-premium-emerald text-premium-bg shadow-lg">
        <Check size={12} strokeWidth={3} />
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
        const plan = await generateMealPlanAI(userData);
        await updateMealPlan(plan, userId);
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
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="font-heading text-2xl font-bold text-white mb-1">Create Profile</h2>
              <p className="text-xs text-premium-text-secondary uppercase tracking-widest">Initial Authentication</p>
            </div>
            <div className="flex flex-col items-center gap-4">
               <div className="relative h-28 w-28 rounded-premium border-2 border-premium-emerald/30 bg-premium-bg overflow-hidden flex items-center justify-center shadow-lg">
                 {formData.photo ? <img src={formData.photo} className="h-full w-full object-cover" /> : <Camera size={24} className="text-premium-emerald/30" />}
               </div>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                 {PRESET_AVATARS.slice(0, 8).map(avatar => (
                   <button key={avatar.id} onClick={() => setFormData({...formData, photo: avatar.src})} className={`p-1 rounded-lg border-2 transition-all ${formData.photo === avatar.src ? 'border-premium-emerald' : 'border-transparent'}`}>
                     <img src={avatar.src} className="h-8 w-8 rounded-md object-cover" />
                   </button>
                 ))}
               </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <PremiumInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Alex Henderson" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Basics</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Birthdate</label>
                <PremiumInput type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Gender</label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} onClick={() => setFormData({...formData, gender: g})} className={`flex-1 py-3 rounded-lg border-2 font-bold text-xs transition-all ${formData.gender === g ? 'bg-premium-emerald text-premium-bg border-premium-emerald' : 'bg-white/5 border-white/5 text-premium-text-secondary'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Biometrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Height (cm)</label>
                <PremiumInput type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="180" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Weight (kg)</label>
                <PremiumInput type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="75" />
              </div>
            </div>
          </div>
        );
      case 3:
        const activities = [
          { level: 'Sedentary', icon: <User /> },
          { level: 'Light', icon: <Heart /> },
          { level: 'Moderate', icon: <Activity /> },
          { level: 'Athletic', icon: <Flame /> },
          { level: 'Elite', icon: <Zap /> },
        ];
        return (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Activity</h2>
            {activities.map(act => (
              <SelectionCard key={act.level} selected={formData.activity === act.level} onClick={() => setFormData({...formData, activity: act.level})} title={act.level} icon={act.icon} />
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
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Objective</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map(g => (
                <SelectionCard key={g.goal} selected={formData.goal === g.goal} onClick={() => setFormData({...formData, goal: g.goal})} title={g.goal} icon={g.icon} />
              ))}
            </div>
          </div>
        );
      case 5:
        const diets = ['Vegan', 'Keto', 'Asian', 'Low Carb', 'Halal'];
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Dietary</h2>
            <div className="flex flex-wrap gap-2">
              {diets.map(diet => (
                <button key={diet} onClick={() => {
                  const newDiet = formData.diet.includes(diet) ? formData.diet.filter(d => d !== diet) : [...formData.diet, diet];
                  setFormData({...formData, diet: newDiet});
                }} className={`px-4 py-2 rounded-full border-2 font-bold text-xs transition-all ${formData.diet.includes(diet) ? 'bg-premium-emerald/20 border-premium-emerald text-premium-emerald' : 'bg-white/5 border-white/5 text-premium-text-secondary'}`}>{diet}</button>
              ))}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Restrictions</label>
              <PremiumInput value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Budget</h2>
            <div className="flex items-center gap-4">
              <select className="h-16 w-20 glass-input font-heading text-2xl font-bold text-premium-emerald text-center appearance-none" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                <option value="₱">₱</option>
                <option value="$">$</option>
                <option value="€">€</option>
              </select>
              <input type="number" className="h-16 flex-1 glass-input font-heading text-4xl font-bold text-white text-center" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="0000" />
            </div>
            {formData.budget && (
              <div className="glass-card p-6 text-center border-premium-emerald/20">
                <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest mb-1">Daily Limit</p>
                <p className="text-3xl font-bold text-premium-emerald">{formData.currency}{(parseFloat(formData.budget) / 7).toFixed(0)}</p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-premium-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card p-8 sm:p-12 rounded-premium-lg">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <p className="text-[10px] font-bold text-premium-emerald uppercase tracking-[0.2em]">{STEPS[currentStep]}</p>
              <span className="text-[10px] font-bold text-premium-text-muted">Step {currentStep + 1} / {STEPS.length}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} className="h-full bg-premium-emerald shadow-lg" />
            </div>
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {validationError && <p className="mt-4 text-center text-[10px] font-bold text-red-400 uppercase tracking-widest">{validationError}</p>}

          <div className="mt-12 flex gap-4">
            {currentStep > 0 && (
              <button onClick={handleBack} className="h-12 w-12 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 text-white">
                <ChevronLeft size={20} />
              </button>
            )}
            <button onClick={handleNext} disabled={isSubmitting} className="flex-1 h-12 bg-premium-emerald text-premium-bg rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
              {currentStep === STEPS.length - 1 ? (isSubmitting ? 'Finalizing...' : 'Complete') : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationWizard;
