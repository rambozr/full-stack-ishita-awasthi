// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/useTheme.js'; 
import LogoIcon from '../../assets/logo_icon.png'; // ✅ Importing the custom logo asset

const navItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Upload & Crop', path: '/upload', icon: '⬆️' },
    { name: 'MinIO Browser', path: '/minio', icon: '🗄️' },
    { name: 'MongoDB Items', path: '/db-items', icon: '📝' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar = () => {
    const { theme } = useTheme();
    const location = useLocation();

    // Base style for all links
    const baseStyle = {
        padding: '10px 15px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: theme.text,
        textDecoration: 'none',
        transition: 'background-color 0.2s, color 0.2s',
        marginBottom: '5px'
    };

    return (
        <div style={{
            width: '250px',
            backgroundColor: theme.sidebarBackground, 
            height: '100vh',
            padding: '20px 0',
            boxShadow: theme.themeMode === 'light' ? '2px 0 8px rgba(0,0,0,0.1)' : '2px 0 8px rgba(0,0,0,0.4)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 10,
        }}>
            {/* Title Section (Now uses the imported image) */}
            <div style={{ 
                margin: '0 20px 30px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                borderBottom: `1px solid ${theme.cardBackground}`,
                paddingBottom: '20px'
            }}>
                {/* ✅ LOGO IMAGE REPLACEMENT */}
                <img 
                    src={LogoIcon} 
                    alt="Generator Logo" 
                    style={{ width: '32px', height: '32px' }} 
                />
                
                <h1 style={{ margin: 0, fontSize: '1.4em', color: theme.text, fontWeight: 700 }}>
                    Thumbnail Generator
                </h1>
            </div>
            
            <nav style={{ padding: '0 15px' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    const activeStyle = {
                        backgroundColor: isActive ? theme.primary : 'transparent',
                        color: isActive ? theme.cardBackground : theme.text, 
                        fontWeight: isActive ? 'bold' : 'normal',
                    };
                    
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            style={{ ...baseStyle, ...activeStyle }}
                        >
                            <span style={{ fontSize: '1.2em' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;