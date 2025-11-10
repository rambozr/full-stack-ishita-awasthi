// src/pages/HomePage.jsx
import React from 'react'; 
import ImageGallery from '../components/ImageGallery.jsx'; 
import DashboardUpload from '../components/DashboardUpload.jsx'; // <-- NEW IMPORT
import { useTheme } from '../context/useTheme.js'; 
import { useAssetContext } from '../context/AssetContext.jsx'; 

function HomePage() {
  const { theme } = useTheme(); 
  const { refreshKey } = useAssetContext(); 

  const containerStyle = {
    padding: '0', 
    color: theme.text,
    transition: 'color 0.3s' 
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '5px', color: theme.text, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.9em', color: theme.text }}>
        Upload images. Auto-generate thumbnails. Store and process files via MinIO.
      </p>
      
      {/* 1. FUNCTIONAL DASHBOARD UPLOAD COMPONENT */}
      <DashboardUpload />

      {/* 2. GALLERY CONTENT */}
      <section>
        <h2 style={{ color: theme.primary, marginBottom: '20px', fontSize: '1.2em' }}>Processed Assets</h2>
        <ImageGallery refreshKey={refreshKey} /> 
      </section>
    </div>
  );
}

export default HomePage;