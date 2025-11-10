// src/context/AssetContext.jsx
// ✅ Ensure createContext and useContext are imported here!
import React, { createContext, useContext, useState, useCallback } from 'react';

// 1. Create the context object
const AssetContext = createContext();

// 2. Custom hook to use the asset state (NAMED EXPORT)
export const useAssetContext = () => useContext(AssetContext);

// 3. Provider Component (NAMED EXPORT)
export const AssetProvider = ({ children }) => {
    // State to hold the counter that forces the gallery to re-fetch data
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    // Public function to signal a successful operation (upload, delete, process)
    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // The shared value bundle
    const value = {
        refreshKey: refreshTrigger, 
        triggerRefresh, 
    };

    return (
        <AssetContext.Provider value={value}>
            {children}
        </AssetContext.Provider>
    );
};