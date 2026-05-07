import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { BudgetarianLogo } from '../components/BudgetarianLogo';
import { ClayCard, ClayButton, ClayInput } from '../components/ClayComponents';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Secure'];
  const strengthColors = ['bg-clay-red', 'bg-clay-amber', 'bg-clay-sky', 'bg-clay-green', 'bg-clay-accent'];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    setSuccess('Registration successful.');
    setTimeout(() => navigate('/register'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay-canvas p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#22C55E]/10 blur-3xl animate-clay-float" />
        <div className="absolute -right-[10%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-[#84CC16]/10 blur-3xl animate-clay-float-delayed" />
        <div className="absolute bottom-[5%] left-[30%] h-[30vh] w-[30vh] rounded-full bg-[#10B981]/10 blur-3xl animate-clay-float-slow" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-clayCard border border-clay-border mb-5 animate-clay-breathe">
             <ShieldCheck className="text-clay-accent" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-clay-foreground mb-1">
            Register 
          </h1>
          <p className="text-[9px] sm:text-[10px] text-clay-green uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black mt-1 whitespace-nowrap">Smart Meal Planning</p>
        </div>

        <ClayCard className="p-8 bg-white/80">
          {error && (
            <div className="mb-6 p-4 rounded-clay-sm bg-clay-red/5 border border-clay-red/10 text-center text-[9px] font-black text-clay-red uppercase tracking-widest">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-clay-sm bg-clay-green/5 border border-clay-green/10 text-center text-[9px] font-black text-clay-green uppercase tracking-widest">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest ml-1.5">Full Name</label>
              <ClayInput type="text" placeholder="Alex Henderson" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest ml-1.5">Email Address</label>
              <ClayInput type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest ml-1.5">Password</label>
              <ClayInput type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {password.length > 0 && (
                <div className="pt-2 px-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black text-clay-muted uppercase tracking-widest">Strength: {strengthLabels[strength]}</span>
                  </div>
                  <div className="flex gap-1 h-1 w-full bg-[#EFEBF5] shadow-clayPressed rounded-full overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-full flex-1 transition-all duration-500 ${i < strength ? strengthColors[strength] : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest ml-1.5">Confirm Password</label>
              <ClayInput type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <ClayButton 
              type="submit" 
              disabled={loading} 
              variant="success"
              className="w-full h-12 mt-4"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </ClayButton>
          </form>

          <div className="mt-8 pt-6 border-t border-clay-border text-center">
            <p className="text-xs text-clay-muted font-medium">
              Member?{' '}
              <Link to="/login" className="font-black text-clay-accent hover:text-clay-accent-alt transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </ClayCard>
      </motion.div>
    </div>
  );
};

export default Signup;
