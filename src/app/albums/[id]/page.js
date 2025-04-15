'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaArrowLeft, FaEdit, FaTrash, FaShareAlt, FaPlus } from 'react-icons/fa';

const AlbumDetailPage = ({ params }) => {
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    
    // Fetch album details
    const fetchAlbumData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch album details
        const albumResponse = await fetch(`/api/albums/${params.id}`);
        
        if (!albumResponse.ok) {
          throw new Error('Failed to fetch album details');
        }
        
        const albumData = await albumResponse.json();
        setAlbum(albumData);
        
        // Fetch photos in this album
        const photosResponse = await fetch(`/api/photos?albumId=${params.id}`);
        
        if (!photosResponse.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const photosData = await photosResponse.json();
        setPhotos(photosData);
      } catch (err) {
        console.error('Error fetching album data:', err);
        setError(err.message || 'Failed to load album');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlbumData();
  }, [params.id, router]);
  
  const handleDeleteAlbum = async () => {
    if (!window.confirm('Are you sure you want to delete this album? The photos will still be available in your gallery.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/albums/${params.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      
      router.push('/albums');
    } catch (err) {
      console.error('Error deleting album:', err);
      alert('Failed to delete album: ' + err.message);
    }
  };
  
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to remove this photo from the album?')) {
      return;
    }
    
    try {
      // Update album's photoIds
      const updatedPhotoIds = album.photoIds.filter(id => id !== photoId);
      
      const response = await fetch(`/api/albums/${album.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...album,
          photoIds: updatedPhotoIds
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update album');
      }
      
      // Update state
      setAlbum({
        ...album,
        photoIds: updatedPhotoIds
      });
      
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (err) {
      console.error('Error removing photo from album:', err);
      alert('Failed to remove photo: ' + err.message);
    }
  };
  
  const handleShareAlbum = () => {
    const shareUrl = `${window.location.origin}/share/${album.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading album...</p>
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="error-container">
        <p>Error: {error || 'Album not found'}</p>
        <Link href="/albums" className="back-link">
          <FaArrowLeft /> Return to Albums
        </Link>
      </div>
    );
  }
  
  return (
    <div className="album-detail-page">
      <div className="navigation-bar">
        <Link href="/albums" className="back-button">
          <FaArrowLeft /> Back to Albums
        </Link>
      </div>
      
      <div className="album-header">
        <div className="album-info">
          <h1 className="album-title">{album.title}</h1>
          
          {album.description && (
            <p className="album-description">{album.description}</p>
          )}
          
          <div className="album-metadata">
            <span className="photo-count">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </span>
            <span className="separator">•</span>
            <span className="created-date">
              Created {album.createdAt ? format(new Date(album.createdAt), 'MMMM d, yyyy') : 'recently'}
            </span>
          </div>
        </div>
        
        <div className="album-actions">
          <button 
            className="action-button share-button"
            onClick={handleShareAlbum}
          >
            <FaShareAlt className="action-icon" /> Share Album
          </button>
          
          <Link 
            href={`/albums/${album.id}/edit`} 
            className="action-button edit-button"
          >
            <FaEdit className="action-icon" /> Edit Album
          </Link>
          
          <button 
            className="action-button delete-button"
            onClick={handleDeleteAlbum}
          >
            <FaTrash className="action-icon" /> Delete Album
          </button>
        </div>
      </div>
      
      {photos.length === 0 ? (
        <div className="empty-album">
          <p>This album is empty.</p>
          <Link href={`/albums/${album.id}/edit`} className="add-photos-button">
            <FaPlus className="button-icon" /> Add Photos
          </Link>
        </div>
      ) : (
        <div className="photos-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-card">
              <Link href={`/photo/${photo.id}`} className="photo-link">
                <div className="photo-wrapper">
                  <Image
                    src={photo.filepath || `/uploaded/${photo.filename}`}
                    alt={photo.title}
                    width={300}
                    height={200}
                    objectFit="cover"
                    className="photo-image"
                    unoptimized={true}
                  />
                  
                  <div className="photo-overlay">
                    <div className="overlay-content">
                      <h3 className="overlay-title">{photo.title}</h3>
                      
                      {photo.uploadDate && (
                        <p className="overlay-date">
                          {format(new Date(photo.uploadDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      className="remove-photo-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      title="Remove from album"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .album-detail-page {
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
        
        .album-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 2rem;
        }
        
        .album-title {
          font-size: 2rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        
        .album-description {
          color: #666;
          margin-bottom: 1rem;
          max-width: 600px;
        }
        
        .album-metadata {
          color: #777;
          font-size: 0.9rem;
        }
        
        .separator {
          margin: 0 0.5rem;
        }
        
        .album-actions {
          display: flex;
          gap: 1rem;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .action-icon {
          margin-right: 0.5rem;
        }
        
        .share-button {
          background-color: rgba(52, 168, 83, 0.1);
          color: var(--secondary-color);
        }
        
        .edit-button {
          background-color: rgba(66, 133, 244, 0.1);
          color: var(--primary-color);
        }
        
        .delete-button {
          background-color: rgba(217, 48, 37, 0.1);
          color: var(--error-color);
        }
        
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .photo-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .photo-card:hover {
          transform: translateY(-5px);
        }
        
        .photo-wrapper {
          position: relative;
          aspect-ratio: 3/2;
        }
        
        .photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          color: white;
        }
        
        .photo-card:hover .photo-overlay {
          opacity: 1;
        }
        
        .overlay-title {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }
        
        .overlay-date {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .remove-photo-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
          color: var(--error-color);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .remove-photo-button:hover {
          background-color: white;
        }
        
        .empty-album {
          text-align: center;
          padding: 4rem 2rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .empty-album p {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .add-photos-button {
          display: inline-flex;
          align-items: center;
          background-color: var(--primary-color);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          text-decoration: none;
        }
        
        .button-icon {
          margin-right: 0.5rem;
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
        
        @media (max-width: 768px) {
          .album-header {
            flex-direction: column;
          }
          
          .album-actions {
            margin-top: 1.5rem;
            width: 100%;
            justify-content: flex-start;
          }
          
          .photos-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default AlbumDetailPage;