import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserContext';
import { Utensils } from 'lucide-react';
import { clayButton, slideUp, fadeUp, blobFloat, blobFloatAlt, blobFloatSlow } from '../lib/animations';

const ClayInput = (props) => (
  <input
    className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
    {...props}
  />
);

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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (isRegistered) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-clay-canvas p-4 overflow-hidden">
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

      <motion.div 
        variants={slideUp} 
        initial="hidden" 
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#97C459] to-[#27500A] shadow-clayButton mb-4">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight text-clay-primary">Budgetarian</h1>
          <p className="font-body text-clay-muted mt-1">Smart meal planning on a budget</p>
        </div>

        {/* Card */}
        <div className="rounded-clayLg bg-white/65 p-8 md:p-10 shadow-clayCard backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-clay-fg mb-1">Welcome Back</h2>
            <p className="font-body text-sm text-clay-muted">Log in to continue your meal plan</p>
          </div>

          {error && (
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible"
              className="mb-6 rounded-claySm bg-red-100 p-4 text-center font-body text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Email</label>
              <ClayInput 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-clay-muted mb-2">Password</label>
              <ClayInput 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#639922] focus:ring-[#639922]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="font-body text-sm text-clay-muted">Remember me</span>
              </label>
              <a href="#" className="font-body text-sm text-[#639922] hover:underline">Forgot password?</a>
            </div>

            <motion.button 
              variants={clayButton} 
              initial="rest" 
              whileHover="hover" 
              whileTap="tap" 
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton transition-shadow duration-200 hover:shadow-clayButtonHover disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </motion.button>
          </form>

          <p className="mt-8 text-center font-body text-sm text-clay-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#639922] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
