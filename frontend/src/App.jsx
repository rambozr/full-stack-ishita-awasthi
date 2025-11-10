// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AssetProvider } from './context/AssetContext.jsx' // <-- ESSENTIAL FOR GLOBAL REFRESH
import DashboardLayout from './components/layout/DashboardLayout.jsx' 
import HomePage from './pages/HomePage.jsx'
import UploadPage from './pages/UploadPage.jsx' 
import MinioPage from './pages/MinioPage.jsx'   
import MongoPage from './pages/MongoPage.jsx'   
import SettingsPage from './pages/SettingsPage.jsx' 
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <ThemeProvider>
      {/* The AssetProvider wraps the entire dashboard so that UploadPage 
        can talk to the HomePage/Dashboard Gallery via global state.
      */}
      <AssetProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} /> 
            <Route path="/minio" element={<MinioPage />} />
            <Route path="/db-items" element={<MongoPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DashboardLayout>
      </AssetProvider>
    </ThemeProvider>
  )
}

export default App