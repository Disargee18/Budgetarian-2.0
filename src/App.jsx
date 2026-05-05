import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useUser } from './context/UserContext';
import Layout from './components/Layout';
import RegistrationWizard from './pages/RegistrationWizard';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { supabase } from './lib/supabaseClient';
import { sendChatMessage } from './lib/openrouterClient';
import ReactMarkdown from 'react-markdown';
import { clayButton, slideUp, fadeUp } from './lib/animations';

const ProtectedRoute = ({ children }) => {
  const { isRegistered } = useUser();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isRegistered) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (session === undefined) return null;

  if (session) return <Navigate to="/dashboard" replace />;

  return children;
};

const Chatbot = () => {
  const { profile, budget, metrics, preferences, allergies, healthConditions, mealPlan, isRegistered, setProfile, saveProfile } = useUser();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! I\'m your meal planning assistant. Ask me about budget-friendly meals, recipes, or nutrition advice!', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Don't render chatbot if not logged in
  if (!isRegistered) return null;

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));

      const userContext = { profile, budget, metrics, preferences, allergies, healthConditions, mealPlan };
      const aiResponse = await sendChatMessage(apiMessages, userContext);
      let finalContent = aiResponse;
      
      // Parse Actions
      const actionRegex = /\[ACTION:(.*?):(.*?)\]/g;
      let match;
      while ((match = actionRegex.exec(aiResponse)) !== null) {
        const actionType = match[1];
        const actionValue = match[2];
        
        if (actionType === 'NAVIGATE') {
          navigate(actionValue);
        } else if (actionType === 'UPDATE_AVATAR') {
          const newProfile = { ...profile, photo: actionValue };
          setProfile(newProfile);
          saveProfile({ profile: newProfile, metrics, budget, preferences, allergies, healthConditions });
        }
      }
      
      // Clean up response text for display
      finalContent = aiResponse.replace(actionRegex, '').trim();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: finalContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        variants={clayButton}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#639922] to-[#27500A] shadow-clayButton focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#639922]/30"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-80 flex-col overflow-hidden rounded-clay rounded-br-[8px] bg-white/80 shadow-clayCard backdrop-blur-xl"
          >
            <div className="bg-gradient-to-r from-[#3B6D11] to-[#27500A] p-4">
              <p className="font-heading font-bold text-white">NutriPlan AI</p>
              <p className="font-body text-xs text-white/70">Your meal planning assistant</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className={`max-w-[80%] px-4 py-3 font-body text-sm ${msg.role === "user" ? "ml-auto rounded-[20px] rounded-br-[4px] bg-gradient-to-br from-[#639922] to-[#27500A] text-white" : "rounded-[20px] rounded-bl-[4px] bg-white shadow-clayCard text-clay-fg"}`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        code: ({ children }) => <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs">{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="max-w-[80%] px-4 py-3 font-body text-sm rounded-[20px] rounded-bl-[4px] bg-white shadow-clayCard text-clay-fg"
                >
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              {error && (
                <div className="mb-2 rounded-claySm bg-red-100 p-3 text-center font-body text-xs text-red-600">
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="mt-1 font-bold hover:underline">Dismiss</button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 border-t border-[#639922]/10 p-3">
              <input
                className="h-12 flex-1 rounded-claySm bg-[#EFEBF5] px-4 font-body text-sm text-clay-fg shadow-clayPressed placeholder:text-clay-muted focus:outline-none focus:ring-2 focus:ring-[#639922]/20 disabled:opacity-50"
                placeholder="Ask about your meals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleSendMessage}
                disabled={isLoading}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#EF9F27] to-[#BA7517] shadow-clayButton disabled:opacity-50"
              >
                <Send className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AppRoutes = () => {
  const { isRegistered } = useUser();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route 
          path="/register" 
          element={isRegistered ? <Navigate to="/dashboard" replace /> : <RegistrationWizard />} 
        />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
