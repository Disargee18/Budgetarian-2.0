import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { fadeUp } from '../lib/animations';

const PremiumInput = (props) => (
  <input
    className="h-12 w-full glass-input px-4 font-body text-sm placeholder:text-premium-text-muted transition-all"
    {...props}
  />
);

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
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-premium-amber', 'bg-lime-500', 'bg-premium-emerald'];

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
    <div className="min-h-screen flex items-center justify-center bg-premium-bg p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-premium-emerald/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-premium-amber/10 blur-[120px] rounded-full" />
      </div>
      
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-premium-emerald/10 border border-premium-emerald shadow-xl mb-4">
             <ShieldCheck className="text-premium-emerald" size={32} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-xs text-premium-text-secondary uppercase tracking-widest font-medium">Join Budgetarian</p>
        </div>

        <div className="glass-card p-8 rounded-premium-lg">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center text-[10px] font-bold text-red-400 uppercase tracking-widest">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-premium-emerald/10 border border-premium-emerald/20 text-center text-[10px] font-bold text-premium-emerald uppercase tracking-widest">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <PremiumInput type="text" placeholder="Alex Henderson" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Email</label>
              <PremiumInput type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Password</label>
              <PremiumInput type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {password.length > 0 && (
                <div className="pt-2 px-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-bold text-premium-text-muted uppercase tracking-widest">Strength: {strengthLabels[strength]}</span>
                  </div>
                  <div className="flex gap-1 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-full flex-1 transition-all ${i < strength ? strengthColors[strength] : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Confirm Password</label>
              <PremiumInput type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 bg-premium-emerald text-premium-bg rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg mt-4">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-premium-text-secondary">
              Already a member?{' '}
              <Link to="/login" className="font-bold text-premium-emerald hover:text-white transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] text-premium-text-muted font-bold uppercase tracking-[0.3em]">Secure Access Point</p>
      </motion.div>
    </div>
  );
};

export default Signup;
