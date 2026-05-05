import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { clayButton, slideUp } from '../lib/animations';

const ClayInput = (props) => (
  <input
    className="h-14 w-full rounded-claySm bg-[#EFEBF5] px-6 font-body text-base text-clay-fg shadow-clayPressed placeholder:text-clay-muted transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#639922]/20"
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
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('Signup successful! Please proceed.');
    setTimeout(() => {
      navigate('/register');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5FA] p-4 py-8">
      <motion.div 
        variants={slideUp} 
        initial="hidden" 
        animate="visible"
        className="w-full max-w-md rounded-clay bg-white/65 p-8 shadow-clayCard backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-clay-fg mb-2">Create Account</h1>
          <p className="font-body text-clay-muted">Join Budgetarian today</p>
        </div>

        {error && (
          <div className="mb-6 rounded-claySm bg-red-100 p-4 text-center font-body text-sm text-red-600">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 rounded-claySm bg-green-100 p-4 text-center font-body text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block font-body text-sm font-medium text-clay-muted mb-2">Full Name</label>
            <ClayInput 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-body text-clay-muted">Password strength:</span>
                  <span className={`text-xs font-bold ${strengthColors[strength].replace('bg-', 'text-')}`}>
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full flex-1 transition-all ${i < strength ? strengthColors[strength] : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-clay-muted mb-2">Confirm Password</label>
            <ClayInput 
              type="password" 
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            variants={clayButton} 
            initial="rest" 
            whileHover="hover" 
            whileTap="tap" 
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-4 rounded-claySm bg-gradient-to-br from-[#639922] to-[#27500A] px-6 font-heading font-bold tracking-wide text-white shadow-clayButton disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-8 text-center font-body text-sm text-clay-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#639922] hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
