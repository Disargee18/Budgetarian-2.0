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
import Landing from './pages/Landing';
import { supabase } from './lib/supabaseClient';
import { sendChatMessage } from './lib/openrouterClient';
import ReactMarkdown from 'react-markdown';
import { ClayCard, ClayButton, ClayInput } from './components/ClayComponents';
import { BudgetarianLogo } from './components/BudgetarianLogo';
import { useDocumentTitle } from './lib/useDocumentTitle';

const ProtectedRoute = ({ children }) => {
  const { session, isRegistered, isLoading } = useUser();

  if (isLoading) return null;

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
    { id: 1, role: 'assistant', content: 'Budgetarian AI active. How can I help you manage your budget today?', timestamp: new Date() }
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
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-clay text-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-90 transition-all duration-300"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.9, rotate: 2 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-10 z-50 flex h-[480px] sm:h-[520px] max-h-[75vh] w-[calc(100%-2rem)] sm:w-[340px] flex-col bg-white/90 backdrop-blur-2xl rounded-[24px] border border-clay-border shadow-clayDeep overflow-hidden"
          >
            <div className="p-4 border-b border-clay-border bg-white/50 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-[14px] bg-white shadow-clayCard flex items-center justify-center border border-clay-border">
                    <BrainCircuit size={20} className="text-clay-accent" />
                 </div>
                 <div>
                    <h3 className="text-base font-black text-clay-foreground">AI Assistant</h3>
                    <div className="flex items-center gap-1.5">
                       <span className="h-1.5 w-1.5 rounded-full bg-clay-green animate-pulse" />
                       <span className="text-[9px] font-black text-clay-muted uppercase tracking-widest">Active</span>
                    </div>
                 </div>
              </div>
              <button onClick={toggleChat} className="h-8 w-8 flex items-center justify-center rounded-[10px] bg-white shadow-clayButton text-clay-muted hover:text-clay-red transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-clay-canvas/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-[13px] leading-relaxed shadow-clayCard border transition-all hover:-translate-y-0.5 ${
                    msg.role === "user" 
                    ? "bg-gradient-clay text-white font-bold border-clay-accent/20 rounded-br-none" 
                    : "bg-white text-clay-foreground border-clay-border font-medium rounded-bl-none"
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          strong:({ children }) => <strong className="font-black text-clay-foreground">{children}</strong>,
                          em: ({ children }) => <em className="italic text-clay-accent">{children}</em>,
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
                  <div className="bg-white px-4 py-3 rounded-[20px] shadow-clayCard border border-clay-border">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-clay-accent animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-clay-accent animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-clay-accent animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/80 border-t border-clay-border backdrop-blur-md">
              <div className="relative">
                <textarea
                  rows="1"
                  className="w-full min-h-[48px] bg-[#EFEBF5] shadow-clayPressed rounded-[18px] pl-5 pr-12 py-3.5 font-body text-xs text-clay-foreground placeholder:text-clay-muted resize-none focus:bg-white focus:outline-none transition-all duration-300"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1.5 h-9 w-9 flex items-center justify-center rounded-[12px] bg-gradient-clay text-white shadow-clayButton hover:shadow-clayButtonHover active:scale-90 disabled:opacity-30 transition-all"
                >
                  <Send size={16} />
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
  const { isRegistered, session } = useUser();
  const location = useLocation();
  useDocumentTitle();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route 
          path="/register" 
          element={!session ? <Navigate to="/login" replace /> : (isRegistered ? <Navigate to="/dashboard" replace /> : <RegistrationWizard />)} 
        />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
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
