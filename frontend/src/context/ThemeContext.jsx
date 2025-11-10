// src/context/ThemeContext.jsx
import React, { createContext, useState, useMemo } from 'react';
// ✅ Import the themes constant from its dedicated file
import { themes } from './themeConstants.js'; 

// 1. Create the context
const ThemeContext = createContext();

// 2. Provider Component (This is the only component exported)
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Use the imported themes constant
  const theme = useMemo(() => themes[themeMode], [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Export the raw context object (as default)
export default ThemeContext;