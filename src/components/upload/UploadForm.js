'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from './DropZone';

const UploadForm = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleFileUpload = (file) => {
    console.log('File data received in form:', file);
    setUploadedFile(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    // Basic validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!uploadedFile) {
      setError('Please upload an image');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      // Prepare the photo data
      const photoData = {
        title: title,
        description: description,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        filename: uploadedFile.filename || uploadedFile.name,
        filepath: uploadedFile.filepath || `/uploaded/${uploadedFile.filename || uploadedFile.name}`,
        uploadDate: new Date().toISOString(),
        userId: 1 // Default user ID
      };
      
      console.log('Saving photo:', photoData);
      
      // Save the photo metadata
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(photoData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save photo');
      }
      
      console.log('Photo saved successfully!');
      
      // Redirect to gallery
      router.push('/gallery');
      
    } catch (err) {
      console.error('Error saving photo:', err);
      setError(err.message || 'An error occurred while saving the photo');
      setIsSaving(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Upload a Photo</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#d32f2f', 
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Select Image</h2>
          <DropZone onFileUpload={handleFileUpload} />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Photo Details</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Enter a title for your photo"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Add a description for your photo"
            ></textarea>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="tags" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Enter tags separated by commas (e.g., nature, sunset, beach)"
            />
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Photo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;