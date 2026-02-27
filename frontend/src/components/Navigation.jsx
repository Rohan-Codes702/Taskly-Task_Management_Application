import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = React.useContext(AuthContext);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) return null;

  return (
    <>
      
      <nav className="mobile-nav dark:bg-dark-card dark:border-dark-border">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </Link>
        
        <button 
          className="nav-item"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        
        <button className="nav-item logout-btn-mobile" onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </nav>

      {/* Desktop Top Navigation - Compact Horizontal */}
      <nav className="desktop-nav dark:bg-dark-card dark:border-dark-border shadow-dark-lg">
        <div className="nav-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#brand-gradient)" strokeWidth="2.5">
              <defs>
                <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? "#3b82f6" : "#1E90FF"}/>
                  <stop offset="100%" stopColor={isDark ? "#60a5fa" : "#4FA0FF"}/>
                </linearGradient>
              </defs>
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <span className="dark:text-dark-text text-lg font-semibold">Taskly</span>
        </div>
        
        <div className="nav-actions-horizontal">
          <div className="nav-stats-horizontal">
            <div className="stat-item-horizontal">
              <span className="stat-value-sm dark:text-dark-text">{taskStats.total}</span>
              <span className="stat-label-sm dark:text-dark-text-secondary">Total</span>
            </div>
            <div className="stat-item-horizontal">
              <span className="stat-value-sm text-green-500">{taskStats.completed}</span>
              <span className="stat-label-sm dark:text-dark-text-secondary">Done</span>
            </div>
            <div className="stat-item-horizontal">
              <span className="stat-value-sm text-yellow-500">{taskStats.pending}</span>
              <span className="stat-label-sm dark:text-dark-text-secondary">Pending</span>
            </div>
          </div>
          
          <button 
            className="theme-toggle-btn-sm"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          
          <button className="logout-btn-sm" onClick={logout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
