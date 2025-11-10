// src/components/ImageGallery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/useTheme.js'; 
import { useAssetContext } from '../context/AssetContext.jsx'; 

function ImageGallery() { 
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  const [error, setError] = useState(null);
  const [customResize, setCustomResize] = useState({ id: null, width: '', height: '' }); 
  const { theme } = useTheme(); 
  const { refreshKey, triggerRefresh } = useAssetContext(); 

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/upload');
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching image list:", err);
      setError('Failed to load images from the server.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (filename, operation, width, height) => {
    setProcessingId(filename); 
    const isResize = operation === 'resize';

    try {
        const payload = { filename, operation, width: isResize ? width : undefined, height: isResize ? height : undefined };
        await axios.post('http://localhost:8000/api/v1/process', payload);
        triggerRefresh(); 
    } catch (err) {
        console.error(`Error processing ${operation}:`, err);
        alert(`Failed to process: ${err.response?.data?.message || 'Server error'}`);
    } finally {
        setProcessingId(null);
        setCustomResize({ id: null, width: '', height: '' }); 
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image and record?')) return;
    setProcessingId(id); 
    try {
        await axios.delete(`http://localhost:8000/api/v1/upload/${id}`);
        triggerRefresh(); 
    } catch (err) {
        console.error('Error deleting image:', err);
        alert('Failed to delete image. See console for details.');
    } finally {
        setProcessingId(null);
    }
  };
  
  const handleDownload = async (filename) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/v1/upload/download/${filename}`);
        const downloadUrl = response.data.downloadUrl;
        window.open(downloadUrl, '_blank');
    } catch (err) {
        console.error('Download failed:', err);
        alert('Could not generate download link. File may not exist.');
    }
  };

  useEffect(() => {
    setLoading(true); 
    fetchImages();
  }, [refreshKey]); 

  // --- STYLES FOR THE TABLE VIEW ---
  const tableStyle = {
    width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: '20px', fontSize: '0.95em',
    boxShadow: theme.themeMode === 'light' ? '0 4px 8px rgba(0,0,0,0.1)' : '0 4px 10px rgba(255,255,255,0.08)',
    borderRadius: '8px', overflow: 'hidden', 
  };
  const cellStyle = {
      padding: '12px 15px', borderBottom: `1px solid ${theme.cardBackground}`, textAlign: 'left',
      color: theme.text, backgroundColor: theme.cardBackground, transition: 'background-color 0.2s',
  };
  const headerCellStyle = {
      ...cellStyle, backgroundColor: theme.headerBackground, color: theme.text, fontWeight: 'bold',
      borderBottom: `2px solid ${theme.primary}`,
  };
  const buttonStyle = (isDelete) => ({
      backgroundColor: isDelete ? '#dc3545' : theme.primary, color: theme.cardBackground, 
      border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', 
      fontSize: '0.85em', transition: 'background-color 0.2s', fontWeight: 'bold', height: '32px'
  });
  const inputStyle = { width: '40px', padding: '5px', borderRadius: '4px', border: `1px solid ${theme.text}`, textAlign: 'center', backgroundColor: theme.cardBackground, color: theme.text };
  // ------------------------------------

  if (loading) return <p style={{ color: theme.text }}>Loading assets...</p>;
  if (error) return <p style={{ color: theme.primary }}>Error: {error}</p>;

  return (
    <div style={{ color: theme.text }}>
        
        {/* --- DUMMY DRAG & DROP AREA (Visual Feature) ---
        <div style={{ 
            border: `2px dashed ${theme.primary}`, borderRadius: '12px', padding: '40px 20px', 
            textAlign: 'center', marginBottom: '40px', backgroundColor: theme.cardBackground, opacity: 0.8
        }}>
            <h3 style={{ margin: '0 0 10px', color: theme.primary }}>Drop images here or click to browse</h3>
            <p style={{ margin: 0, fontSize: '0.9em', color: theme.text }}>
                (Functionality integrated on the Upload & Crop link)
            </p>
        </div> */}
        
        {images.length === 0 ? (
            <p style={{ color: theme.text, textAlign: 'center' }}>No processed assets found. Upload one now!</p>
        ) : (
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={headerCellStyle}>Thumbnail</th>
                        <th style={headerCellStyle}>Filename</th>
                        <th style={headerCellStyle}>Upload Date</th>
                        <th style={headerCellStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((image) => {
                        const isDeleting = processingId === image._id; 
                        const isProcessing = processingId === image.thumbnailFilename;
                        const isResizing = customResize.id === image._id;
                        const actionDisabled = isDeleting || isProcessing;

                        return (
                            <tr key={image._id} style={{ transition: 'background-color 0.2s', opacity: actionDisabled ? 0.6 : 1 }}>
                                <td style={cellStyle}>
                                    <img 
                                        src={image.thumbnailUrl} 
                                        alt={`Thumbnail ${image._id}`} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td style={cellStyle}>
                                    {image.thumbnailFilename}
                                </td>
                                <td style={cellStyle}>
                                    {new Date(image.createdAt).toLocaleDateString()}
                                </td>
                                
                                {/* ACTIONS CELL */}
                                <td style={cellStyle}>
                                    {isResizing ? (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input type="number" placeholder="W" value={customResize.width}
                                                onChange={(e) => setCustomResize(prev => ({ ...prev, width: e.target.value }))} style={inputStyle} />
                                            <input type="number" placeholder="H" value={customResize.height}
                                                onChange={(e) => setCustomResize(prev => ({ ...prev, height: e.target.value }))} style={inputStyle} />
                                            <button onClick={() => handleProcess(image.thumbnailFilename, 'resize', customResize.width, customResize.height)}
                                                style={{...buttonStyle(false), backgroundColor: theme.primary}}
                                                disabled={actionDisabled || !customResize.width || !customResize.height || customResize.width <= 0 || customResize.height <= 0}
                                            >
                                                Apply
                                            </button>
                                            <button onClick={() => setCustomResize({ id: null, width: '', height: '' })}
                                                style={{...buttonStyle(true), backgroundColor: '#6c757d'}}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleProcess(image.thumbnailFilename, 'grayscale')}
                                                style={{...buttonStyle(false), backgroundColor: '#007bff'}} disabled={actionDisabled}>
                                                {isProcessing ? '⚙️' : 'Gray'}
                                            </button>
                                            <button onClick={() => setCustomResize({ id: image._id, width: '', height: '' })}
                                                style={{...buttonStyle(false), backgroundColor: '#ffc107', color: '#1f1f1f'}} disabled={actionDisabled}>
                                                Size
                                            </button>
                                            <button onClick={() => handleDownload(image.thumbnailFilename)}
                                                style={{...buttonStyle(false), backgroundColor: '#17a2b8'}} disabled={actionDisabled}>
                                                ⬇️
                                            </button>
                                            <button onClick={() => handleDelete(image._id)}
                                                style={buttonStyle(true)} disabled={actionDisabled}>
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
    </div>
  );
}

export default ImageGallery;