// src/pages/UploadPage.jsx
import React, { useState } from 'react'; // useState needed for local upload message
import ImageUpload from '../components/ImageUpload.jsx';
import { useTheme } from '../context/useTheme.js'; 
import { useAssetContext } from '../context/AssetContext.jsx'; // <-- IMPORT ASSET CONTEXT

const UploadPage = () => {
    const [uploadMessage, setUploadMessage] = useState('');
    const { theme } = useTheme(); 
    const { triggerRefresh } = useAssetContext(); // <-- Get the global refresh trigger

    // Function called by ImageUpload on success
    const handleUploadSuccess = () => {
        setUploadMessage('Upload Complete! Image available on the Dashboard.');
        // 1. Trigger global refresh
        triggerRefresh();
        // 2. Clear local message after delay
        setTimeout(() => setUploadMessage(''), 5000); 
    };

    const containerStyle = {
        padding: '20px', 
        backgroundColor: theme.cardBackground, 
        borderRadius: '12px', 
        boxShadow: theme.themeMode === 'light' ? '0 4px 10px rgba(0,0,0,0.1)' : '0 4px 10px rgba(255,255,255,0.05)',
        color: theme.text
    };

    return (
        <div style={{ color: theme.text }}>
            <h1 style={{ marginBottom: '30px', color: theme.text, fontWeight: 700 }}>Upload & Define Crop</h1>
            <p style={{ marginBottom: '30px', color: theme.text }}>Select your source image to crop and apply initial resizing.</p>
            
            <section style={containerStyle}>
                {/* Pass the updated handleUploadSuccess function */}
                <ImageUpload onUploadSuccess={handleUploadSuccess} />
                {uploadMessage && <p style={{ marginTop: '15px', color: theme.primary, fontWeight: 'bold' }}>{uploadMessage}</p>}
            </section>
        </div>
    );
};

export default UploadPage;