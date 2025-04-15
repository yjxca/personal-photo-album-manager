'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaArrowLeft, FaEdit, FaTrash, FaShareAlt, FaHeart, FaRegHeart } from 'react-icons/fa';

const PhotoDetailPage = () => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams(); // Use the useParams hook
  
  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Fetch photo details
    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        
        // Access the id safely from params
        const photoId = params.id;
        
        const response = await fetch(`/api/photos/${photoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch photo details');
        }
        
        const data = await response.json();
        setPhoto(data);
        setIsFavorite(data.isFavorite || false);
      } catch (err) {
        console.error('Error fetching photo:', err);
        setError(err.message || 'Failed to load photo details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      fetchPhoto();
    }
  }, [params.id, router]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/photos/${params.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
      
      router.push('/gallery');
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo: ' + err.message);
    }
  };
  
  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    
    try {
      const response = await fetch(`/api/photos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...photo,
          isFavorite: !isFavorite
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      
      const updatedPhoto = await response.json();
      setPhoto(updatedPhoto);
    } catch (err) {
      console.error('Error updating favorite status:', err);
      // Revert UI state if API call fails
      setIsFavorite(isFavorite);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderLeftColor: '#4285f4',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p>Loading photo details...</p>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error || !photo) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fff3f3',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '3rem auto'
      }}>
        <p style={{ marginBottom: '1rem', color: '#d32f2f' }}>
          Error: {error || 'Photo not found'}
        </p>
        <Link href="/gallery" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#4285f4',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Return to Gallery
        </Link>
      </div>
    );
  }
  
  const formattedDate = photo.uploadDate 
    ? format(new Date(photo.uploadDate), 'MMMM d, yyyy')
    : 'Unknown date';
  
  return (
    <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/gallery" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#4285f4',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Back to Gallery
        </Link>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          borderRight: '1px solid #eee',
          padding: '2rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={toggleFavorite}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                color: '#4285f4',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              {isFavorite ? (
                <>
                  <FaHeart style={{ marginRight: '0.5rem', color: '#e74c3c' }} /> Favorited
                </>
              ) : (
                <>
                  <FaRegHeart style={{ marginRight: '0.5rem' }} /> Add to Favorites
                </>
              )}
            </button>
            
            <Link 
              href={`/photo/${params.id}/edit`}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                color: '#34a853',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                marginBottom: '1rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <FaEdit style={{ marginRight: '0.5rem' }} /> Edit Photo
            </Link>
            
            <button 
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(217, 48, 37, 0.1)',
                color: '#d93025',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <FaTrash style={{ marginRight: '0.5rem' }} /> Delete Photo
            </button>
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Photo Details</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>
                Uploaded on
              </span>
              <span style={{ fontWeight: '500' }}>{formattedDate}</span>
            </div>
            
            {photo.filename && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>
                  Filename
                </span>
                <span style={{ fontWeight: '500' }}>{photo.filename}</span>
              </div>
            )}
            
            {photo.albumIds && photo.albumIds.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>
                  Albums
                </span>
                <div>
                  <p>This photo is in {photo.albumIds.length} album(s)</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            marginBottom: '2rem',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <img
              src={photo.filepath || `/uploaded/${photo.filename}`}
              alt={photo.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{photo.title}</h1>
            
            {photo.description && (
              <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {photo.description}
              </p>
            )}
            
            {photo.tags && photo.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {photo.tags.map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f1f1f1',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '16px',
                    fontSize: '0.85rem',
                    color: '#555'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;