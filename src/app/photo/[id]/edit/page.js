'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaSave, FaTimes, FaTags, FaArrowLeft } from 'react-icons/fa';

const PhotoEditPage = () => {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams(); // Use the useParams hook instead of props
  
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
        // Get the ID from params
        const photoId = params.id;
        
        const response = await fetch(`/api/photos/${photoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch photo details');
        }
        
        const data = await response.json();
        setPhoto(data);
        
        // Set form data from photo
        setFormData({
          title: data.title || '',
          description: data.description || '',
          tags: data.tags ? data.tags.join(', ') : ''
        });
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Process tags (convert comma-separated string to array)
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
        : [];
      
      // Create updated photo object
      const updatedPhoto = {
        ...photo,
        title: formData.title,
        description: formData.description,
        tags: tagsArray
      };
      
      // Save to API
      const photoId = params.id;
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPhoto)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update photo');
      }
      
      // Redirect to photo detail page
      router.push(`/photo/${photoId}`);
    } catch (err) {
      console.error('Error updating photo:', err);
      setError(err.message || 'Failed to update photo');
      setIsSaving(false);
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
  
  if (error && !photo) {
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
          Error: {error}
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
  
  return (
    <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/photo/${params.id}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#4285f4',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Back to Photo
        </Link>
      </div>
      
      <div style={{
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Photo Preview */}
        <div style={{
          width: '400px',
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {photo && (
            <img
              src={photo.filepath || `/uploaded/${photo.filename}`}
              alt={formData.title || 'Photo'}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
        </div>
        
        {/* Edit Form */}
        <div style={{
          flex: 1,
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Edit Photo</h1>
          
          {error && (
            <div style={{
              backgroundColor: 'rgba(217, 48, 37, 0.1)',
              color: '#d93025',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #d93025'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="title" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Give your photo a title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="description" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                placeholder="Add a description for your photo"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="tags" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaTags style={{ marginRight: '0.5rem' }} /> Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Enter tags separated by commas (e.g., nature, sunset, beach)"
                value={formData.tags}
                onChange={handleChange}
              />
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: '#666'
              }}>
                Tags help make your photos easier to find.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <Link 
                href={`/photo/${params.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f1f1f1',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <FaTimes style={{ marginRight: '0.5rem' }} /> Cancel
              </Link>
              <button 
                type="submit" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1
                }}
                disabled={isSaving}
              >
                <FaSave style={{ marginRight: '0.5rem' }} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditPage;