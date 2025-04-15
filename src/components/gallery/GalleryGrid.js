// src/components/gallery/GalleryGrid.js
'use client';

import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';

const GalleryGrid = ({ photos, onDeletePhoto }) => {
  const [columns, setColumns] = useState(4);
  
  // Adjust columns based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 768) {
        setColumns(2);
      } else if (window.innerWidth < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };
    
    // Set initial columns
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!photos || photos.length === 0) {
    return (
      <div className="empty-gallery">
        <p>No photos found. Upload some photos to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="gallery-grid">
      <Masonry
        breakpointCols={columns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="masonry-item">
            <ImageCard 
              photo={photo} 
              onDelete={onDeletePhoto}
            />
          </div>
        ))}
      </Masonry>
      
      <style jsx>{`
        .gallery-grid {
          padding: 1rem 0;
        }
        
        :global(.masonry-grid) {
          display: flex;
          width: 100%;
          margin-left: -16px;
        }
        
        :global(.masonry-grid-column) {
          padding-left: 16px;
          background-clip: padding-box;
        }
        
        .masonry-item {
          margin-bottom: 16px;
        }
        
        .empty-gallery {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default GalleryGrid;