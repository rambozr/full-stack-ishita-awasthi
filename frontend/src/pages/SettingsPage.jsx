// src/pages/SettingsPage.jsx
import React from 'react';
import { useTheme } from '../context/useTheme.js';

const SettingsPage = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

    const containerStyle = {
        padding: '20px', 
        backgroundColor: theme.cardBackground, 
        borderRadius: '12px', 
        boxShadow: theme.themeMode === 'light' ? '0 4px 10px rgba(0,0,0,0.1)' : '0 4px 10px rgba(255,255,255,0.05)',
        color: theme.text
    };
    
    const buttonStyle = {
        padding: '10px 15px', 
        borderRadius: '6px', 
        fontWeight: 'bold', 
        border: 'none', 
        cursor: 'pointer', 
        backgroundColor: theme.primary, 
        color: theme.cardBackground,
        transition: 'background-color 0.3s'
    };

    return (
        <div style={{ color: theme.text }}>
            <h1 style={{ marginBottom: '30px', color: theme.text, fontWeight: 700 }}>Settings</h1>
            <section style={containerStyle}>
                <h2 style={{ color: theme.primary, marginTop: 0 }}>Application Preferences</h2>
                <p>Current Theme: **{themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}**</p>
                
                <button 
                    onClick={toggleTheme}
                    style={buttonStyle}
                >
                    Switch to {themeMode === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                </button>
                
                <p style={{ marginTop: '20px', fontSize: '0.9em' }}>*Theme toggling is globally managed by the Dashboard Layout.</p>
            </section>
        </div>
    );
};

export default SettingsPage;