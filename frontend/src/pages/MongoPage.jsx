// src/pages/MongoPage.jsx
import React from 'react';
import { useTheme } from '../context/useTheme.js';

const MongoPage = () => {
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
            <h1 style={{ marginBottom: '30px', color: theme.text, fontWeight: 700 }}>MongoDB Items</h1>
            <section style={containerStyle}>
                <p>This page could display a detailed table of all records (metadata, processing status) stored in your remote MongoDB collection (`imagerecords`).</p>
                <p>Status: **Connected** to BytexlDB.</p>
            </section>
        </div>
    );
};

export default MongoPage;