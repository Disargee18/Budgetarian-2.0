import React from 'react';
import { useUser } from '../context/UserContext';
import { Camera, Edit3, Target, Activity, Flame, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, breathe, cardFloat } from '../lib/animations';

const Overview = () => {
  const { profile, metrics, budget, isLoading } = useUser();

  if (isLoading || !profile || !metrics) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#639922]/20 border-t-[#639922]" />
          <p className="font-body text-clay-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const calculateBMI = () => {
    if (!metrics.height || !metrics.weight) return null;
    const heightInMeters = parseFloat(metrics.height) / 100;
    const weightInKg = parseFloat(metrics.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMIGradient = (bmi) => {
    if (!bmi) return "from-[#97C459] to-[#27500A]";
    if (bmi < 18.5) return "from-[#EF9F27] to-[#BA7517]";
    if (bmi < 25) return "from-[#97C459] to-[#27500A]";
    if (bmi < 30) return "from-[#EF9F27] to-[#BA7517]";
    return "from-[#D32F2F] to-[#851D1D]";
  };

  const bmi = calculateBMI();

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-clay-fg tracking-tight">
          Your Profile
        </h2>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {/* Hero Profile Card */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <div className="rounded-clayLg bg-white/65 p-8 md:p-10 shadow-clayCard backdrop-blur-xl h-full flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#97C459]/10 blur-2xl"></div>
            
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-[#639922]/20 shadow-clayButton bg-gradient-to-br from-[#639922] to-[#27500A] text-white">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="font-heading text-4xl font-black">{profile.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h3 className="font-heading text-3xl font-black text-clay-fg">{profile.name}</h3>
                <motion.button whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 rounded-full bg-[#EFEBF5] px-4 py-2 font-body text-sm font-medium text-clay-muted shadow-clayPressed hover:bg-white transition-colors self-center md:self-auto">
                  <Edit3 size={16} /> Edit
                </motion.button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="rounded-full bg-gradient-to-br from-[#EF9F27] to-[#BA7517] px-4 py-1.5 font-body text-sm font-bold text-white shadow-clayButton flex items-center gap-2">
                  <Target size={16} /> {metrics.goal}
                </span>
                <span className="rounded-full bg-white/80 px-4 py-1.5 font-body text-sm font-medium text-clay-muted shadow-clayCard">
                  {profile.age} years old
                </span>
                <span className="rounded-full bg-white/80 px-4 py-1.5 font-body text-sm font-medium text-clay-muted shadow-clayCard">
                  {profile.gender}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-body text-xs text-clay-muted mb-1">Height</p>
                  <p className="font-heading text-xl font-bold text-clay-fg">{metrics.height} cm</p>
                </div>
                <div>
                  <p className="font-body text-xs text-clay-muted mb-1">Weight</p>
                  <p className="font-heading text-xl font-bold text-clay-fg">{metrics.weight} kg</p>
                </div>
                <div>
                  <p className="font-body text-xs text-clay-muted mb-1">Budget</p>
                  <p className="font-heading text-xl font-bold text-clay-fg">{budget.currency}{budget.weekly}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BMI Orb Card */}
        <motion.div variants={fadeUp} className="md:col-span-1">
          <div className="rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl h-full flex flex-col items-center justify-center text-center">
            <h3 className="font-heading text-xl font-bold text-clay-fg mb-6">Body Mass Index</h3>
            {bmi && (
              <motion.div
                variants={breathe}
                animate="animate"
                className={`flex h-40 w-40 flex-col items-center justify-center rounded-full bg-gradient-to-br ${getBMIGradient(bmi)} shadow-clayButton mb-6`}
              >
                <span className="font-heading text-4xl font-black text-white">{bmi}</span>
                <span className="font-body text-sm font-medium text-white/80">BMI</span>
              </motion.div>
            )}
            <p className="font-body text-sm text-clay-muted">Your BMI is currently in the <strong className="text-clay-fg">{bmi < 25 ? 'Healthy' : 'Overweight'}</strong> range.</p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        {[
          { label: 'Activity Level', value: metrics.activity, icon: Activity, color: 'text-[#27500A]', bg: 'bg-[#639922]/15' },
          { label: 'Weekly Meals', value: '21 scheduled', icon: Flame, color: 'text-[#BA7517]', bg: 'bg-[#EF9F27]/15' },
          { label: 'Dietary Prefs', value: 'Vegetarian', icon: Lightbulb, color: 'text-[#27500A]', bg: 'bg-[#639922]/15' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <motion.div 
              variants={cardFloat} 
              initial="rest" 
              whileHover="hover"
              className="rounded-clay bg-white/65 p-6 shadow-clayCard backdrop-blur-xl flex items-center gap-4"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="font-body text-sm text-clay-muted mb-1">{stat.label}</p>
                <p className="font-heading text-lg font-bold text-clay-fg">{stat.value}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}

      </motion.div>
    </div>
  );
};

export default Overview;
