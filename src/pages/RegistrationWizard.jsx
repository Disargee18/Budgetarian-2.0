import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import { pageTransition, fadeUp, slideUp, breathe, blobFloat, blobFloatAlt, blobFloatSlow, clayButton, scaleIn } from '../lib/animations';
import { Camera, Check, Activity, Target, Utensils, Zap, Heart, Scale, Flame, Salad } from 'lucide-react';

const STEPS = [
  'Profile',
  'Personal Info',
  'Body Metrics',
  'Activity Level',
  'Health Goal',
  'Dietary & Health',
  'Weekly Budget'
];

// Reusable Clay Input
const ClayInput = (props) => (
  <input
    className="h-16 w-full rounded-claySm bg-[#EFEBF5] px-6 py-4 font-body text-lg text-clay-fg shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
    {...props}
  />
);

const SelectionCard = ({ selected, title, description, icon, onClick }) => (
  <motion.button
    variants={clayButton}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-clayMd p-5 shadow-clayCard transition-all duration-300 ${
      selected
        ? "bg-gradient-to-br from-[#97C459] to-[#27500A] text-white shadow-clayButton"
        : "bg-white/65 backdrop-blur-xl text-clay-fg"
    }`}
  >
    <span className="flex items-center justify-center text-2xl h-10 w-10">{icon}</span>
    <div className="text-left flex-1">
      <p className="font-heading font-bold">{title}</p>
      {description && (
        <p className={`font-body text-sm ${selected ? "text-white/80" : "text-clay-muted"}`}>
          {description}
        </p>
      )}
    </div>
    <AnimatePresence>
      {selected && (
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/30"
        >
          <Check className="h-4 w-4 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const RegistrationWizard = () => {
  const { completeRegistration, updateMealPlan } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      finishRegistration();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return null;
    const heightInMeters = parseFloat(formData.height) / 100;
    const weightInKg = parseFloat(formData.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMIGradient = (bmi) => {
    if (!bmi) return "from-[#97C459] to-[#27500A]";
    if (bmi < 18.5) return "from-[#EF9F27] to-[#BA7517]"; // Underweight
    if (bmi < 25) return "from-[#97C459] to-[#27500A]"; // Normal
    if (bmi < 30) return "from-[#EF9F27] to-[#BA7517]"; // Overweight
    return "from-[#D32F2F] to-[#851D1D]"; // Obese
  };

  const finishRegistration = () => {
    const today = new Date();
    const birthDate = new Date(formData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const userData = {
      profile: { name: formData.name, age, gender: formData.gender, photo: formData.photo },
      metrics: { height: parseFloat(formData.height), weight: parseFloat(formData.weight), activity: formData.activity, goal: formData.goal },
      budget: { weekly: parseFloat(formData.budget), currency: formData.currency },
      preferences: formData.diet,
      allergies: formData.allergies,
      healthConditions: formData.healthConditions
    };

    completeRegistration(userData);
    const { plan } = generateWeeklyPlan(userData);
    updateMealPlan(plan);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Create your Profile</h2>
            
            <div className="flex flex-col items-center justify-center gap-4 py-4">
               <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#639922]/20 shadow-clayButton bg-gradient-to-br from-[#639922] to-[#27500A] text-white">
                 <Camera size={40} className="opacity-70" />
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               </div>
               <span className="font-body text-sm font-medium text-clay-muted">Upload Photo (Optional)</span>
            </div>

            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-clay-muted">What should we call you?</label>
              <ClayInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your full name" />
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Personal Info</h2>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-clay-muted">Date of Birth</label>
              <ClayInput type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-clay-muted">Gender</label>
              <div className="flex flex-wrap gap-3">
                {['Male', 'Female', 'Prefer not to say'].map(gender => (
                  <motion.button
                    key={gender}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({...formData, gender})}
                    className={`rounded-full px-6 py-3 font-heading font-bold transition-all duration-300 ${
                      formData.gender === gender 
                        ? "bg-gradient-to-br from-[#639922] to-[#27500A] text-white shadow-clayButton" 
                        : "bg-white/65 text-clay-fg shadow-clayCard hover:bg-white"
                    }`}
                  >
                    {gender}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        const bmi = calculateBMI();
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Body Metrics</h2>
            
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="font-body text-sm font-medium text-clay-muted">Height (cm)</label>
                <ClayInput type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="175" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="font-body text-sm font-medium text-clay-muted">Weight (kg)</label>
                <ClayInput type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="70" />
              </div>
            </div>

            {bmi && (
              <div className="flex justify-center pt-6">
                <motion.div
                  variants={breathe}
                  animate="animate"
                  className={`flex h-40 w-40 flex-col items-center justify-center rounded-full bg-gradient-to-br ${getBMIGradient(bmi)} shadow-clayButton`}
                >
                  <span className="font-heading text-4xl font-black text-white">{bmi}</span>
                  <span className="font-body text-sm font-medium text-white/80">BMI</span>
                </motion.div>
              </div>
            )}
          </motion.div>
        );
      case 3:
        const activities = [
          { level: 'Sedentary', desc: 'Little to no exercise', icon: <User /> },
          { level: 'Lightly Active', desc: 'Light exercise 1-3 days/week', icon: <Heart /> },
          { level: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', icon: <Activity /> },
          { level: 'Very Active', desc: 'Hard exercise 6-7 days/week', icon: <Flame /> },
          { level: 'Extra Active', desc: 'Very hard exercise & physical job', icon: <Zap /> },
        ];
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Activity Level</h2>
            <div className="space-y-3">
              {activities.map(act => (
                <SelectionCard
                  key={act.level}
                  selected={formData.activity === act.level}
                  onClick={() => setFormData({...formData, activity: act.level})}
                  title={act.level}
                  description={act.desc}
                  icon={act.icon}
                />
              ))}
            </div>
          </motion.div>
        );
      case 4:
        const goals = [
          { goal: 'Lose Weight', icon: <Scale /> },
          { goal: 'Gain Weight', icon: <Scale className="rotate-180" /> },
          { goal: 'Maintain', icon: <Target /> },
          { goal: 'Build Muscle', icon: <Activity /> },
          { goal: 'Improve Endurance', icon: <Heart /> },
          { goal: 'Get Fit', icon: <Zap /> },
          { goal: 'Improve Nutrition', icon: <Salad /> },
          { goal: 'Manage Condition', icon: <Heart /> },
          { goal: 'Better Energy', icon: <Zap /> },
        ];
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Health Goal</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {goals.map(g => (
                <SelectionCard
                  key={g.goal}
                  selected={formData.goal === g.goal}
                  onClick={() => setFormData({...formData, goal: g.goal})}
                  title={g.goal}
                  icon={g.icon}
                />
              ))}
            </div>
          </motion.div>
        );
      case 5:
        const diets = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Asian', 'Mediterranean'];
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Dietary & Health Info</h2>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-clay-muted">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {diets.map(diet => (
                  <motion.button
                    key={diet}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newDiet = formData.diet.includes(diet) 
                        ? formData.diet.filter(d => d !== diet)
                        : [...formData.diet, diet];
                      setFormData({...formData, diet: newDiet});
                    }}
                    className={`rounded-full px-4 py-2 font-body font-medium transition-all duration-300 ${
                      formData.diet.includes(diet)
                        ? "bg-gradient-to-br from-[#97C459] to-[#27500A] text-white shadow-clayButton"
                        : "bg-white/65 text-clay-fg shadow-clayCard hover:bg-white"
                    }`}
                  >
                    {diet}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="font-body text-sm font-medium text-clay-muted">Food Allergies (Optional)</label>
              <ClayInput value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts, Shellfish" />
            </div>
            
            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-clay-muted">Health Conditions (Optional)</label>
              <ClayInput value={formData.healthConditions} onChange={e => setFormData({...formData, healthConditions: e.target.value})} placeholder="e.g. Diabetes, Hypertension" />
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl font-extrabold text-clay-fg">Weekly Budget</h2>
            <p className="font-body text-clay-muted">We'll tailor your meal plan to fit your financial goals.</p>
            
            <div className="flex items-center gap-4 pt-6">
              <select 
                className="h-20 w-24 rounded-claySm bg-[#EFEBF5] px-4 font-heading text-2xl font-black text-clay-fg shadow-clayPressed focus:outline-none focus:ring-4 focus:ring-[#639922]/20 text-center"
                value={formData.currency} 
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <option value="₱">₱</option>
                <option value="$">$</option>
                <option value="€">€</option>
              </select>
              
              <input 
                type="number" 
                className="h-20 flex-1 rounded-claySm bg-[#EFEBF5] px-6 font-heading text-4xl font-black text-clay-fg shadow-clayPressed placeholder:text-clay-muted/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20 text-center"
                value={formData.budget} 
                onChange={e => setFormData({...formData, budget: e.target.value})} 
                placeholder="1500" 
              />
            </div>
            
            {formData.budget && (
              <motion.div variants={fadeUp} className="mt-8 rounded-clayMd bg-[#639922]/10 p-6 text-center">
                <p className="font-body text-sm text-clay-muted mb-2">Estimated daily budget</p>
                <p className="font-heading text-3xl font-black text-clay-primary">
                  {formData.currency} {(parseFloat(formData.budget) / 7).toFixed(2)}
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative min-h-screen bg-clay-canvas flex items-center justify-center p-4 md:p-8"
    >
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          variants={blobFloat}
          animate="animate"
          className="absolute -left-[10%] -top-[10%] h-[60vh] w-[60vh] rounded-full bg-[#3B6D11]/10 blur-3xl"
        />
        <motion.div
          variants={blobFloatAlt}
          animate="animate"
          className="absolute -right-[10%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-[#EF9F27]/10 blur-3xl"
        />
        <motion.div
          variants={blobFloatSlow}
          animate="animate"
          className="absolute bottom-[5%] left-[10%] h-[45vh] w-[45vh] rounded-full bg-[#639922]/8 blur-3xl"
        />
      </div>

      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-clay-primary mb-2">NutriPlan AI</h1>
          <p className="font-body text-lg text-clay-muted">Let's build your personalized meal plan.</p>
        </div>

        <motion.div
          layout
          className="rounded-clayLg bg-white/65 p-8 md:p-12 shadow-clayCard backdrop-blur-xl"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between font-body text-sm font-bold text-clay-muted mb-2">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{STEPS[currentStep]}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEBF5] shadow-clayPressed">
              <motion.div
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#639922] to-[#27500A]"
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between">
            <motion.button
              variants={clayButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`inline-flex h-14 items-center justify-center rounded-claySm border-2 border-[#639922]/20 bg-transparent px-8 font-heading font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#639922]/30 ${
                currentStep === 0 
                  ? "opacity-50 cursor-not-allowed text-clay-muted" 
                  : "text-clay-primary hover:border-[#639922] hover:bg-[#639922]/5"
              }`}
            >
              Back
            </motion.button>
            <motion.button
              variants={clayButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleNext}
              className="inline-flex h-14 items-center justify-center rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-8 font-heading font-bold tracking-wide text-white shadow-clayButton transition-shadow duration-200 hover:shadow-clayButtonHover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#639922]/30"
            >
              {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegistrationWizard;
