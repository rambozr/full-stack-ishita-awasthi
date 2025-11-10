// src/context/useTheme.js
import { useContext } from 'react';
import ThemeContext from './ThemeContext.jsx'; 

// Custom hook to use the theme (NAMED EXPORT)
export const useTheme = () => useContext(ThemeContext);