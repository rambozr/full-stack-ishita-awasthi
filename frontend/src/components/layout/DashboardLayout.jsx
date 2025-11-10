// src/components/layout/DashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar.jsx'; 
import { useTheme } from '../../context/useTheme.js'; 

const headerStyle = (theme) => ({
  display: 'flex',
  justifyContent: 'flex-end', 
  alignItems: 'center',
  height: '60px',
  padding: '0 30px',
  backgroundColor: theme.headerBackground,
  borderBottom: `1px solid ${theme.cardBackground}`,
  color: theme.text,
});

const bodyStyle = (theme) => ({
  backgroundColor: theme.background,
  color: theme.text,
  minHeight: '100vh',
  paddingLeft: '250px', // Offset for the fixed sidebar
  transition: 'background-color 0.3s, color 0.3s',
});

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '5px',
};


const DashboardLayout = ({ children }) => {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <div style={bodyStyle(theme)}>
      <Sidebar /> 
      
      {/* Main Content Wrapper */}
      <div style={{ flexGrow: 1 }}>
        <header style={headerStyle(theme)}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            style={{ ...toggleButtonStyle, color: theme.text }}
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {themeMode === 'light' ? '🌙' : '☀️'}
          </button>
        </header>
        
        {/* Main Content Area */}
        <main style={{ padding: '30px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;