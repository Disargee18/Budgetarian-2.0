import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Layout from './components/Layout';
import RegistrationWizard from './pages/RegistrationWizard';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { isRegistered } = useUser();
  if (!isRegistered) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { isRegistered } = useUser();

  return (
    <Routes>
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
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
