'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaFolder, FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
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
    
    // Fetch albums
    const fetchAlbums = async () => {
      try {
        setIsLoading(true);
        const userId = JSON.parse(storedUser).id;
        
        const response = await fetch(`/api/albums?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        
        const data = await response.json();
        setAlbums(data);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError(err.message || 'Failed to load albums');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlbums();
  }, [router]);
  
  const handleDeleteAlbum = async (albumId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this album? The photos will still be available in your gallery.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      
      // Remove from state
      setAlbums(albums.filter(album => album.id !== albumId));
    } catch (err) {
      console.error('Error deleting album:', err);
      alert('Failed to delete album: ' + err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your albums...</p>
      </div>
    );
  }
  
  return (
    <div className="albums-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaFolder className="title-icon" /> My Albums
          </h1>
          <p className="page-description">
            Organize your photos into collections
          </p>
        </div>
        
        <Link href="/albums/create" className="create-button">
          <FaPlus className="button-icon" /> Create New Album
        </Link>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {albums.length === 0 ? (
        <div className="empty-albums">
          <div className="empty-icon">
            <FaFolder style={{ fontSize: '3rem', opacity: 0.3 }} />
          </div>
          <h3>No Albums Yet</h3>
          <p>Create your first album to organize your photos</p>
          <Link href="/albums/create" className="create-button">
            <FaPlus className="button-icon" /> Create New Album
          </Link>
        </div>
      ) : (
        <div className="albums-grid">
          {albums.map(album => {
            const coverImage = album.coverPhoto 
              ? `/uploaded/${album.coverFilename || 'default.jpg'}`
              : '/images/placeholder-album.jpg';
              
            return (
              <Link href={`/albums/${album.id}`} key={album.id} className="album-card">
                <div className="album-cover">
                  <Image
                    src={coverImage}
                    alt={album.title}
                    width={300}
                    height={200}
                    objectFit="cover"
                    className="cover-image"
                    unoptimized={true}
                  />
                  <div className="album-overlay">
                    <span className="photo-count">
                      {album.photoIds?.length || 0} photos
                    </span>
                  </div>
                </div>
                
                <div className="album-content">
                  <h3 className="album-title">{album.title}</h3>
                  
                  {album.description && (
                    <p className="album-description">{album.description}</p>
                  )}
                  
                  <div className="album-actions">
                    <button 
                      className="action-button edit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/albums/${album.id}/edit`);
                      }}
                      title="Edit album"
                    >
                      <FaEdit />
                    </button>
                    
                    <button 
                      className="action-button share"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${window.location.origin}/share/${album.shareId}`);
                        alert('Share link copied to clipboard!');
                      }}
                      title="Share album"
                    >
                      <FaShareAlt />
                    </button>
                    
                    <button 
                      className="action-button delete"
                      onClick={(e) => handleDeleteAlbum(album.id, e)}
                      title="Delete album"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        .albums-page {
          padding: 2rem 0;
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
          display: flex;
          align-items: center;
        }
        
        .title-icon {
          margin-right: 0.75rem;
        }
        
        .create-button {
          display: flex;
          align-items: center;
          background-color: var(--primary-color);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          transition: background-color 0.3s ease;
          text-decoration: none;
        }
        
        .button-icon {
          margin-right: 0.5rem;
        }
        
        .albums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .album-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .album-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .album-cover {
          position: relative;
          height: 180px;
        }
        
        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .album-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          color: white;
        }
        
        .album-content {
          padding: 1.5rem;
        }
        
        .album-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        .album-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .album-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .action-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background-color: #f5f5f5;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .action-button.edit:hover {
          background-color: var(--primary-color);
          color: white;
        }
        
        .action-button.share:hover {
          background-color: #4CAF50;
          color: white;
        }
        
        .action-button.delete:hover {
          background-color: var(--error-color);
          color: white;
        }
        
        .empty-albums {
          text-align: center;
          padding: 4rem 2rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .empty-icon {
          margin-bottom: 1.5rem;
          color: #ccc;
        }
        
        .empty-albums h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .empty-albums p {
          color: #666;
          margin-bottom: 2rem;
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

export default AlbumsPage;