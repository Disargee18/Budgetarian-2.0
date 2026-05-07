import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { BudgetarianLogo } from '../components/BudgetarianLogo';
import { ClayCard, ClayButton, ClayInput } from '../components/ClayComponents';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay-canvas p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#8B5CF6]/10 blur-3xl animate-clay-float" />
        <div className="absolute -right-[10%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-[#EC4899]/10 blur-3xl animate-clay-float-delayed" />
        <div className="absolute bottom-[5%] left-[30%] h-[30vh] w-[30vh] rounded-full bg-[#0EA5E9]/10 blur-3xl animate-clay-float-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[380px] z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-clayCard border border-clay-border mb-5 animate-clay-breathe">
            <BudgetarianLogo size="medium" />
          </div>
          <h1 className="text-3xl font-extrabold text-clay-foreground mb-1">
            Budget<span className="text-clay-green">arian</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-clay-green uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black mt-1 whitespace-nowrap">Smart Meal Planning</p>
        </div>

        <ClayCard className="p-8 bg-white/80">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-xl font-black text-clay-foreground mb-1">Sign In</h2>
            <p className="text-xs text-clay-muted font-medium">Welcome back to your companion.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-clay-sm bg-clay-red/5 border border-clay-red/10 text-center text-[9px] font-black text-clay-red uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest ml-1.5">Email</label>
              <ClayInput type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1.5">
                <label className="text-[9px] font-black text-clay-muted uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[9px] font-black text-clay-accent uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <ClayInput type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <ClayButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full h-12 mt-4"
            >
              {loading ? 'Entering...' : 'Sign In'}
            </ClayButton>
          </form>

          <div className="mt-8 pt-6 border-t border-clay-border text-center">
            <p className="text-xs text-clay-muted font-medium">
              New here?{' '}
              <Link to="/signup" className="font-black text-clay-accent hover:text-clay-accent-alt transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </ClayCard>
      </motion.div>
    </div>
  );
};

export default Login;
