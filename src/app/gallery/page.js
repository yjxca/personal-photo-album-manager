// src/app/gallery/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/gallery/SearchBar';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { FaUpload } from 'react-icons/fa';

// Function to filter photos based on search criteria
const filterPhotos = (photos, searchCriteria) => {
  if (!searchCriteria || Object.keys(searchCriteria).length === 0) {
    return photos;
  }
  
  return photos.filter(photo => {
    // Search term filtering (title and description)
    if (searchCriteria.searchTerm) {
      const searchLower = searchCriteria.searchTerm.toLowerCase();
      const titleMatch = photo.title && photo.title.toLowerCase().includes(searchLower);
      const descMatch = photo.description && photo.description.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    
    // Tags filtering
    if (searchCriteria.tags && searchCriteria.tags.length > 0) {
      if (!photo.tags || photo.tags.length === 0) {
        return false;
      }
      
      const hasAllTags = searchCriteria.tags.every(tag => 
        photo.tags.some(photoTag => photoTag.toLowerCase() === tag.toLowerCase())
      );
      
      if (!hasAllTags) {
        return false;
      }
    }
    
    // Date range filtering
    if (searchCriteria.startDate) {
      const photoDate = new Date(photo.uploadDate);
      if (photoDate < searchCriteria.startDate) {
        return false;
      }
    }
    
    if (searchCriteria.endDate) {
      const photoDate = new Date(photo.uploadDate);
      if (photoDate > searchCriteria.endDate) {
        return false;
      }
    }
    
    return true;
  });
};

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
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
    
    // Fetch photos
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
        setFilteredPhotos(data);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err.message || 'Failed to load photos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhotos();
  }, [router]);
  
  useEffect(() => {
    // Apply search filters when photos or search criteria change
    if (searchCriteria) {
      const filtered = filterPhotos(photos, searchCriteria);
      setFilteredPhotos(filtered);
    } else {
      setFilteredPhotos(photos);
    }
  }, [photos, searchCriteria]);
  
  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
  };
  
  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
      
      // Remove from state
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo: ' + err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your photos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="gallery-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            My Photo Gallery
          </h1>
          <p className="page-description">
            Browse your personal photo collection
          </p>
        </div>
        
        <Link href="/upload" className="upload-button">
          <FaUpload className="button-icon" /> Upload New Photo
        </Link>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <div className="gallery-stats">
        <p>
          Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
          {searchCriteria && Object.keys(searchCriteria).some(key => 
            searchCriteria[key] && 
            (Array.isArray(searchCriteria[key]) ? searchCriteria[key].length > 0 : true)
          ) && ' (filtered)'}
        </p>
      </div>
      
      <GalleryGrid photos={filteredPhotos} onDeletePhoto={handleDeletePhoto} />
      
      <style jsx>{`
        .gallery-page {
          padding: 1rem 0;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .page-title {
          font-size: 2rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        
        .upload-button {
          display: flex;
          align-items: center;
          background-color: var(--primary-color);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-left-color: var(--primary-color);
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;