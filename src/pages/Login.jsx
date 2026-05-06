import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserContext';
import { Utensils, Check } from 'lucide-react';
import { fadeUp } from '../lib/animations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isRegistered } = useUser();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (isRegistered) navigate('/dashboard');
    else navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-bg p-4 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-premium-emerald/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-premium-amber/10 blur-[120px] rounded-full" />
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-premium-emerald to-premium-emerald-dark shadow-xl mb-4">
            <Utensils className="h-8 w-8 text-premium-bg" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Budgetarian</h1>
          <p className="text-xs text-premium-text-secondary uppercase tracking-widest font-medium">Culinary Intelligence</p>
        </div>

        <div className="glass-card p-8 rounded-premium-lg">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
            <p className="text-xs text-premium-text-muted">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center text-[10px] font-bold text-red-400 uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest ml-1">Email</label>
              <input type="email" placeholder="name@email.com" className="h-12 w-full glass-input px-4 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[10px] text-premium-emerald font-bold uppercase tracking-widest hover:text-white transition-colors">Forgot?</Link>
              </div>
              <input type="password" placeholder="••••••••" className="h-12 w-full glass-input px-4 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="flex items-center gap-2 py-2">
              <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2 group">
                <div className={`h-4 w-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-premium-emerald border-premium-emerald' : 'bg-white/5 border-white/20'}`}>
                  {rememberMe && <Check size={10} className="text-premium-bg" strokeWidth={4} />}
                </div>
                <span className="text-xs text-premium-text-secondary group-hover:text-white transition-colors">Remember me</span>
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 bg-premium-emerald text-premium-bg rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-premium-text-secondary">
              New here?{' '}
              <Link to="/signup" className="font-bold text-premium-emerald hover:text-white transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-premium-text-muted font-bold uppercase tracking-[0.3em]">Version 2.0</p>
      </motion.div>
    </div>
  );
};

export default Login;
