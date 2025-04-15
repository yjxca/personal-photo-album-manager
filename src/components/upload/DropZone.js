'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FaCloudUploadAlt, FaCheck, FaTimes, FaImage } from 'react-icons/fa';

const DropZone = ({ onFileUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  
  // When component mounts, make sure parent component knows if we have files
  useEffect(() => {
    if (uploadedFiles.length > 0 && uploadedFiles[0].success) {
      onFileUpload(uploadedFiles[0]);
    }
  }, [uploadedFiles, onFileUpload]);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("Files dropped:", acceptedFiles);
    if (acceptedFiles.length === 0) return;
    
    // Process each file
    const file = acceptedFiles[0]; // Just take the first file
    const fileId = `file-${Date.now()}`;
    
    // Create a preview and add to state
    const fileObj = {
      file,
      id: fileId,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    };
    
    setUploadedFiles([fileObj]);
    
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('file', file);
      
      // Show progress starting
      setUploadProgress({ [fileId]: 10 });
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress < 90) {
            return { ...prev, [fileId]: currentProgress + 10 };
          }
          return prev;
        });
      }, 200);
      
      // Send to API
      console.log("Uploading to API...");
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(interval);
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Upload success:", result);
      
      // Complete progress
      setUploadProgress({ [fileId]: 100 });
      
      // Update file object with server response
      const updatedFile = {
        ...fileObj,
        ...result,
        success: true
      };
      
      setUploadedFiles([updatedFile]);
      
      // Notify parent component
      onFileUpload(updatedFile);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadErrors({ [fileId]: error.message });
      setUploadProgress({ [fileId]: -1 });
      
      // Still provide file data for debugging
      onFileUpload({
        ...fileObj,
        error: error.message,
        success: false
      });
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });
  
  return (
    <div>
      <div 
        {...getRootProps()} 
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f9ff' : '#f9f9f9'
        }}
      >
        <input {...getInputProps()} />
        
        <div>
          <FaCloudUploadAlt style={{ fontSize: '3rem', color: '#4285f4', marginBottom: '1rem' }} />
          <p>
            {isDragActive 
              ? 'Drop the files here...' 
              : 'Drag & drop photos here, or click to select'}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
          </p>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Uploaded File</h3>
          {uploadedFiles.map((fileObj) => (
            <div 
              key={fileObj.id} 
              style={{
                display: 'flex',
                padding: '0.75rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '0.5rem'
              }}
            >
              <div style={{ width: '80px', height: '80px', marginRight: '1rem' }}>
                {fileObj.preview ? (
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#f1f1f1', borderRadius: '4px' }}>
                    <FaImage style={{ fontSize: '2rem', color: '#aaa' }} />
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div>{fileObj.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{Math.round(fileObj.size / 1024)} KB</div>
                
                {uploadErrors[fileObj.id] ? (
                  <div style={{ color: '#d93025', marginTop: '0.5rem' }}>{uploadErrors[fileObj.id]}</div>
                ) : (
                  <div style={{ marginTop: '0.5rem', height: '6px', backgroundColor: '#eee', borderRadius: '3px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${uploadProgress[fileObj.id] || 0}%`,
                        backgroundColor: '#4285f4',
                        borderRadius: '3px'
                      }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                {uploadProgress[fileObj.id] === 100 ? (
                  <FaCheck style={{ color: '#0f9d58' }} />
                ) : uploadErrors[fileObj.id] ? (
                  <FaTimes style={{ color: '#d93025' }} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropZone;