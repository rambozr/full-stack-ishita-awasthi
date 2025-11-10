// src/components/ImageUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactCrop from 'react-image-crop'; 
import 'react-image-crop/dist/ReactCrop.css'; 
import { useTheme } from '../context/useTheme.js'; 

// Define the predefined sizes
const PREDEFINED_SIZES = [
    { label: 'Original Size', width: 0, height: 0 },
    { label: 'Thumbnail (200x200)', width: 200, height: 200 },
    { label: 'Small (640x480)', width: 640, height: 480 },
    { label: 'Medium (1280x720)', width: 1280, height: 720 },
];

function ImageUpload({ onUploadSuccess }) { 
  const [fileToCrop, setFileToCrop] = useState(null); 
  const [crop, setCrop] = useState(); 
  const imgRef = useRef(null); 
  const [message, setMessage] = useState('');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0); 
  const [isUploading, setIsUploading] = useState(false); 
  const { theme } = useTheme(); 

  // --- Step 1: File Selection ---
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setMessage('');
        const reader = new FileReader();
        reader.addEventListener('load', () => setFileToCrop(reader.result));
        reader.readAsDataURL(file);
    }
  };

  // --- Utility: Get Pixels from Cropped Area ---
  const getCroppedImageBlob = useCallback((image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      // Send as JPEG to the backend
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg'); 
    });
  }, []);

  // --- Step 3: Upload Logic ---
  const onUpload = async () => {
    if (!crop?.width || !crop?.height || !imgRef.current) {
        setMessage('Please define a crop area.');
        return;
    }

    setMessage('Cropping and uploading...');
    setIsUploading(true); 

    try {
      const croppedBlob = await getCroppedImageBlob(imgRef.current, crop);
      const { width, height } = PREDEFINED_SIZES[selectedSizeIndex];
      
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped_image.jpeg'); 
      formData.append('width', width);
      formData.append('height', height);
      formData.append('isCropped', 'true'); 

      await axios.post('http://localhost:8000/api/v1/upload', formData);
      
      setMessage(`Success! Image cropped and uploaded.`);
      setFileToCrop(null); 
      setCrop(null);
      
      if (onUploadSuccess) {
          onUploadSuccess();
      }

    } catch (error) {
        console.error('Error uploading file:', error);
        setMessage(`Error: ${error.response?.data?.message || 'Server error'}`);
    } finally {
        setIsUploading(false); 
    }
  };
  
  const handleCancelCrop = () => {
    setFileToCrop(null);
    setCrop(null);
    setMessage('');
  };
  
  // --- Styles ---
  const uploadButtonStyle = (color) => ({
      padding: '10px 20px', 
      borderRadius: '6px', 
      fontWeight: 'bold', 
      border: 'none', 
      cursor: 'pointer', 
      transition: 'background-color 0.2s',
      backgroundColor: color, 
      color: theme.cardBackground,
      opacity: isUploading ? 0.8 : 1,
      minWidth: '150px'
  });
  
  const cropperContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      border: `1px dashed ${theme.primary}`, 
      borderRadius: '12px',
      backgroundColor: theme.cardBackground,
      marginTop: '20px'
  };
  // -------------

  return (
    <div>
      {/* 1. FILE INPUT AND SETTINGS */}
      {!fileToCrop && (
        <form style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="file" accept="image/*" onChange={onFileChange} style={{border: 'none'}} /> 
            
            <select 
                value={selectedSizeIndex}
                onChange={(e) => setSelectedSizeIndex(e.target.value)}
                style={{ padding: '8px', borderRadius: '6px', border: `1px solid ${theme.text}` }}
            >
                {PREDEFINED_SIZES.map((size, index) => (
                    <option key={index} value={index}>
                        {size.label}
                    </option>
                ))}
            </select>
        </form>
      )}

      {/* 2. CROPPER UI */}
      {fileToCrop && (
        <div style={cropperContainerStyle}>
            <div style={{ maxWidth: '600px', width: '100%', marginBottom: '20px' }}>
                <ReactCrop 
                    crop={crop}
                    onChange={c => setCrop(c)}
                    aspect={0}
                >
                    <img 
                        ref={imgRef}
                        alt="Source"
                        src={fileToCrop}
                        style={{ maxHeight: '400px', maxWidth: '100%', display: 'block' }}
                        onLoad={(e) => { 
                            const { width, height } = e.currentTarget;
                            setCrop({
                                unit: 'px', x: 0, y: 0, width: width > 300 ? 300 : width * 0.5, height: height > 300 ? 300 : height * 0.5,
                            });
                        }}
                    />
                </ReactCrop>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                    onClick={onUpload}
                    disabled={isUploading || !crop?.width || !crop?.height} 
                    style={uploadButtonStyle(theme.primary)}
                >
                    {isUploading ? 'Uploading...' : 'Crop & Upload'}
                </button>
                <button 
                    onClick={handleCancelCrop}
                    disabled={isUploading}
                    style={uploadButtonStyle('#6c757d')} 
                >
                    Cancel
                </button>
            </div>
        </div>
      )}

      {message && <p style={{ marginTop: '10px', color: theme.text }}>{message}</p>}
    </div>
  );
}

export default ImageUpload;