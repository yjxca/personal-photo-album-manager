'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';

const CreateAlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoIds: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Fetch user's photos
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const userId = JSON.parse(storedUser).id;
        
        const response = await fetch(`/api/photos?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err.message || 'Failed to load photos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhotos();
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const togglePhotoSelection = (photoId) => {
    setFormData(prev => {
      const newPhotoIds = prev.photoIds.includes(photoId)
        ? prev.photoIds.filter(id => id !== photoId)
        : [...prev.photoIds, photoId];
        
      return {
        ...prev,
        photoIds: newPhotoIds
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Album title is required');
      return;
    }
    
    if (formData.photoIds.length === 0) {
      setError('Please select at least one photo for the album');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create album object
      const albumData = {
        title: formData.title,
        description: formData.description,
        photoIds: formData.photoIds,
        userId: user.id,
        coverPhoto: formData.photoIds[0] // Use first photo as cover
      };
      
      // Save to API
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create album');
      }
      
      const newAlbum = await response.json();
      
      // Redirect to albums page
      router.push('/albums');
    } catch (err) {
      console.error('Error creating album:', err);
      setError(err.message || 'Failed to create album');
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading photos...</p>
      </div>
    );
  }
  
  return (
    <div className="create-album-page">
      <div className="navigation-bar">
        <Link href="/albums" className="back-button">
          <FaArrowLeft /> Back to Albums
        </Link>
      </div>
      
      <div className="create-album-container">
        <h1 className="page-title">Create New Album</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="album-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Album Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                placeholder="Enter album title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                className="form-input textarea"
                placeholder="Add a description for your album"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className="photo-selection-section">
            <h2 className="section-title">Select Photos for Your Album</h2>
            <p className="section-description">
              Click on photos to add them to your album. Selected photos will be highlighted.
            </p>
            
            <div className="selected-count">
              {formData.photoIds.length} photos selected
            </div>
            
            {photos.length === 0 ? (
              <div className="no-photos">
                <p>You don't have any photos yet. Upload some photos first!</p>
                <Link href="/upload" className="upload-button">
                  Upload Photos
                </Link>
              </div>
            ) : (
              <div className="photos-grid">
                {photos.map(photo => (
                  <div 
                    key={photo.id}
                    className={`photo-item ${formData.photoIds.includes(photo.id) ? 'selected' : ''}`}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <div className="photo-wrapper">
                      <Image
                        src={photo.filepath || `/uploaded/${photo.filename}`}
                        alt={photo.title}
                        width={150}
                        height={150}
                        objectFit="cover"
                        className="photo-thumbnail"
                        unoptimized={true}
                      />
                      <div className="selection-overlay"></div>
                    </div>
                    <p className="photo-title">{photo.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <Link 
              href="/albums"
              className="cancel-button"
            >
              <FaTimes className="button-icon" /> Cancel
            </Link>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSaving || formData.photoIds.length === 0}
            >
              <FaSave className="button-icon" />
              {isSaving ? 'Creating...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .create-album-page {
          padding: 2rem 0;
        }
        
        .navigation-bar {
          margin-bottom: 2rem;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .back-button svg {
          margin-right: 0.5rem;
        }
        
        .create-album-container {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 2rem;
        }
        
        .page-title {
          font-size: 2rem;
          color: var(--text-color);
          margin-bottom: 2rem;
        }
        
        .album-form {
          max-width: 800px;
        }
        
        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        
        .form-input.textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .photo-selection-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        .section-description {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .selected-count {
          margin-bottom: 1rem;
          font-weight: 500;
          color: var(--primary-color);
        }
        
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .photo-item {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .photo-item:hover {
          transform: translateY(-3px);
        }
        
        .photo-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .photo-thumbnail {
          display: block;
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .selection-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(66, 133, 244, 0.3);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .photo-item.selected .selection-overlay {
          opacity: 1;
        }
        
        .photo-item.selected {
          position: relative;
        }
        
        .photo-item.selected:after {
          content: '✓';
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        
        .photo-title {
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .no-photos {
          text-align: center;
          padding: 3rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .no-photos p {
          margin-bottom: 1.5rem;
        }
        
        .upload-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: var(--primary-color);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .cancel-button, .save-button {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .cancel-button {
          background-color: #f1f1f1;
          color: var(--text-color);
          text-decoration: none;
        }
        
        .save-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
        }
        
        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .button-icon {
          margin-right: 0.5rem;
        }
        
        .error-message {
          background-color: rgba(217, 48, 37, 0.1);
          color: var(--error-color);
          padding: 1rem;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--error-color);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-left-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateAlbumPage;