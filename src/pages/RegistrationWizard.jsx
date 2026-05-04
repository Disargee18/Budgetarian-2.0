import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { generateWeeklyPlan } from '../lib/mealGenerator';
import './RegistrationWizard.css';

const STEPS = [
  'Profile',
  'Personal Info',
  'Body Metrics',
  'Activity Level',
  'Health Goal',
  'Dietary & Health',
  'Weekly Budget'
];

const RegistrationWizard = () => {
  const { completeRegistration, updateMealPlan } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
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
    
    // Generate initial meal plan
    const { plan } = generateWeeklyPlan(userData);
    updateMealPlan(plan);

    navigate('/dashboard');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="wizard-step">
            <h2>Step 1: Create your Profile</h2>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label className="input-label">Profile Photo (Optional)</label>
              <input type="file" className="input-field" accept="image/*" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="wizard-step">
            <h2>Step 2: Personal Info</h2>
            <div className="input-group">
              <label className="input-label">Date of Birth</label>
              <input type="date" className="input-field" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Gender</label>
              <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-step">
            <h2>Step 3: Body Metrics</h2>
            <div className="input-group">
              <label className="input-label">Height (cm)</label>
              <input type="number" className="input-field" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="175" />
            </div>
            <div className="input-group">
              <label className="input-label">Weight (kg)</label>
              <input type="number" className="input-field" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="70" />
            </div>
            {formData.height && formData.weight && (
              <div className="bmi-display">
                <span>Calculated BMI: {calculateBMI()}</span>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="wizard-step">
            <h2>Step 4: Activity Level</h2>
            <div className="options-grid">
              {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'].map(level => (
                <div 
                  key={level} 
                  className={`option-card ${formData.activity === level ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, activity: level})}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="wizard-step">
            <h2>Step 5: Health Goal</h2>
            <div className="options-grid">
              {['Lose Weight', 'Gain Weight', 'Maintain Weight', 'Build Muscle', 'Improve Endurance', 'Get Fit', 'Improve Nutrition', 'Manage Condition', 'Better Energy'].map(goal => (
                <div 
                  key={goal} 
                  className={`option-card ${formData.goal === goal ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, goal})}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="wizard-step">
            <h2>Step 6: Dietary & Health Info</h2>
            <div className="input-group">
              <label className="input-label">Dietary Preferences</label>
              <div className="tags-grid">
                {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Asian', 'Mediterranean'].map(diet => (
                  <span 
                    key={diet} 
                    className={`tag ${formData.diet.includes(diet) ? 'selected' : ''}`}
                    onClick={() => {
                      const newDiet = formData.diet.includes(diet) 
                        ? formData.diet.filter(d => d !== diet)
                        : [...formData.diet, diet];
                      setFormData({...formData, diet: newDiet});
                    }}
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Food Allergies (Optional)</label>
              <input type="text" className="input-field" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts, Shellfish" />
            </div>
            <div className="input-group">
              <label className="input-label">Health Conditions (Optional)</label>
              <input type="text" className="input-field" value={formData.healthConditions} onChange={e => setFormData({...formData, healthConditions: e.target.value})} placeholder="e.g. Diabetes, Hypertension" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="wizard-step">
            <h2>Step 7: Weekly Budget</h2>
            <p className="text-muted text-sm mb-4">We'll suggest meals within this range.</p>
            <div className="input-group">
              <label className="input-label">Budget amount</label>
              <div className="flex items-center gap-sm">
                <select className="input-field" style={{width: '80px'}} value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                  <option value="₱">₱</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                </select>
                <input type="number" className="input-field" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="1500" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="bento-card wizard-card">
        <div className="wizard-header">
          <h1 className="text-2xl">Welcome to Budgetarian</h1>
          <p className="text-muted">Let's build your personalized plan.</p>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}></div>
        </div>
        
        <div className="wizard-body">
          {renderStep()}
        </div>
        
        <div className="wizard-footer flex justify-between">
          <button className="btn btn-outline" onClick={handleBack} disabled={currentStep === 0}>Back</button>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationWizard;
