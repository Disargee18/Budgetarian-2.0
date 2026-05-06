import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, BrainCircuit } from 'lucide-react';
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
import { premiumCard, premiumButton, slideUp, fadeUp } from './lib/animations';

const ProtectedRoute = ({ children }) => {
  const { session, isRegistered, isLoading } = useUser();

  if (isLoading) {
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
  const { session, isLoading } = useUser();

  if (isLoading) return null;

  if (session) return <Navigate to="/dashboard" replace />;

  return children;
};

const Chatbot = () => {
  const { profile, budget, metrics, preferences, allergies, healthConditions, mealPlan, isRegistered, setProfile, saveProfile } = useUser();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'NutriPlan AI active. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      
      finalContent = aiResponse.replace(actionRegex, '').trim();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: finalContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Communication error. Link unstable.');
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-premium-emerald text-premium-bg shadow-xl hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 sm:bottom-10 right-4 sm:right-8 lg:right-12 z-50 flex h-[500px] sm:h-[600px] w-[calc(100%-2rem)] sm:w-[380px] flex-col glass-card rounded-premium-lg border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-premium-emerald/10 flex items-center justify-center">
                    <BrainCircuit size={20} className="text-premium-emerald" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-white">NutriPlan AI</h3>
                    <div className="flex items-center gap-1.5">
                       <span className="h-1.5 w-1.5 rounded-full bg-premium-emerald animate-pulse" />
                       <span className="text-[8px] font-bold text-premium-text-muted uppercase tracking-widest">Online</span>
                    </div>
                 </div>
              </div>
              <button onClick={toggleChat} className="p-2 text-premium-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user" 
                    ? "bg-premium-emerald text-premium-bg font-medium" 
                    : "bg-white/5 border border-white/10 text-premium-text-secondary"
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong:({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic text-premium-emerald">{children}</em>,
                          ul: ({ children }) => <ul className="ml-4 list-disc space-y-1 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1 mb-2">{children}</ol>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="h-1 w-1 rounded-full bg-premium-emerald animate-bounce" />
                      <span className="h-1 w-1 rounded-full bg-premium-emerald animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1 w-1 rounded-full bg-premium-emerald animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <textarea
                  rows="1"
                  className="w-full h-12 glass-input pl-4 pr-12 pt-3.5 font-body text-xs resize-none"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="absolute right-2 top-2 h-8 w-8 flex items-center justify-center rounded-lg bg-premium-emerald text-premium-bg disabled:opacity-30"
                >
                  <Send size={14} />
                </button>
              </div>
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
