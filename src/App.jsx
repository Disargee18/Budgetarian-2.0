import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useUser } from './context/UserContext';
import Layout from './components/Layout';
import RegistrationWizard from './pages/RegistrationWizard';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { clayButton, slideUp, fadeUp } from './lib/animations';

const ProtectedRoute = ({ children }) => {
  const { isRegistered } = useUser();
  if (!isRegistered) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', content: 'Hi there! I am NutriPlan AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', content: 'I am a demo AI. In the real version, I would help you with that!' }]);
    }, 1000);
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
                  {msg.content}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-[#639922]/10 p-3">
              <input
                className="h-12 flex-1 rounded-claySm bg-[#EFEBF5] px-4 font-body text-sm text-clay-fg shadow-clayPressed placeholder:text-clay-muted focus:outline-none focus:ring-2 focus:ring-[#639922]/20"
                placeholder="Ask about your meals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleSend}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#EF9F27] to-[#BA7517] shadow-clayButton"
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
