import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, User, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <h1 className="brand-title">Budgetarian</h1>
        </div>
        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/overview" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <User size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart2 size={20} />
            <span>Stats</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <SettingsIcon size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
