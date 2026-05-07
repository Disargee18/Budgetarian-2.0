import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Budgetarian',
      '/login': 'Login',
      '/signup': 'Register',
      '/register': 'Setup',
      '/dashboard': 'Dashboard',
      '/overview': 'Profile',
      '/stats': 'Analytics',
      '/settings': 'Settings',
    };

    document.title = titles[location.pathname] || 'Budgetarian';
  }, [location]);
};
