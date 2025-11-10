// src/components/DashboardUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/useTheme.js';
import { useAssetContext } from '../context/AssetContext.jsx'; 

function DashboardUpload() {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { theme } = useTheme(); 
  const { triggerRefresh } = useAssetContext(); 

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image')) {
        setMessage('Please select a valid image file (JPG, PNG).');
        return;
    }

    setMessage(`Uploading ${file.name}...`);
    setIsUploading(true);

    const formData = new FormData();
    // Use default 'Original Size' (0,0) for quick uploads
    formData.append('image', file, file.name); 
    formData.append('width', 0);
    formData.append('height', 0);

    try {
      await axios.post('http://localhost:8000/api/v1/upload', formData);
      
      setMessage(`Success! ${file.name} uploaded.`);
      triggerRefresh(); // Refresh global gallery

    } catch (error) {
        console.error('Error uploading file:', error);
        setMessage(`Error during upload: ${error.response?.data?.message || 'Server error'}`);
    } finally {
        setIsUploading(false);
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
    e.currentTarget.style.borderColor = theme.primary; // Reset visual cue
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#28a745'; // Green cue for drop
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = theme.primary; // Reset cue
  };
  
  const handleFileInput = (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
  };
  
  // --- Styles ---
  const dropZoneStyle = {
      border: isUploading ? `2px solid ${theme.primary}` : `2px dashed ${theme.primary}`, 
      borderRadius: '12px', 
      padding: '40px 20px', 
      textAlign: 'center', 
      marginBottom: '40px',
      backgroundColor: theme.cardBackground,
      cursor: 'pointer',
      transition: 'border-color 0.3s',
      color: theme.text,
  };
  
  const spinnerStyle = { fontSize: '1.2em', color: theme.primary, marginBottom: '10px' };

  return (
    <div>
        <label>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} disabled={isUploading} />
            
            <div 
                style={dropZoneStyle}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                // Click handler targets the hidden input
                onClick={() => document.querySelector('input[type="file"]').click()}
            >
                {isUploading ? (
                    <div style={spinnerStyle}>⚙️ Uploading...</div>
                ) : (
                    <>
                        <h3 style={{ margin: '0 0 10px', color: theme.primary }}>
                            Drop images here or click to browse
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9em' }}>
                            Supported: JPG, PNG. (Uploads original size without cropping.)
                        </p>
                    </>
                )}
            </div>
        </label>
        {/* Adjusted spacing for the message */}
        {message && <p style={{ marginTop: '-30px', marginBottom: '20px', color: theme.primary, fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default DashboardUpload;