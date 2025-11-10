// src/pages/MinioPage.jsx
import React from 'react';
import { useTheme } from '../context/useTheme.js';

const MinioPage = () => {
    const { theme } = useTheme();

    const containerStyle = {
        padding: '20px', 
        backgroundColor: theme.cardBackground, 
        borderRadius: '12px', 
        boxShadow: theme.themeMode === 'light' ? '0 4px 10px rgba(0,0,0,0.1)' : '0 4px 10px rgba(255,255,255,0.05)',
        color: theme.text
    };

    return (
        <div style={{ color: theme.text }}>
            <h1 style={{ marginBottom: '30px', color: theme.text, fontWeight: 700 }}>MinIO Browser</h1>
            <section style={containerStyle}>
                <p>This page would typically display the contents of your MinIO bucket via an API call.</p>
                <p>You can access the dedicated MinIO console directly at: 
                    <a href="http://localhost:9001" target="_blank" style={{ color: theme.primary, marginLeft: '10px' }}>http://localhost:9001</a>
                </p>
            </section>
        </div>
    );
};

export default MinioPage;