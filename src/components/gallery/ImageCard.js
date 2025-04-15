// src/components/gallery/ImageCard.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaHeart, FaRegHeart, FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const ImageCard = ({ photo, onDelete, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(photo.isFavorite || false);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(photo.id, !isFavorite);
    }
  };
  
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDelete(photo.id);
    }
  };
  
  const formattedDate = photo.uploadDate 
    ? format(new Date(photo.uploadDate), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <div 
      className="image-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/photo/${photo.id}`}>
        <div className="image-container">
          <Image
            src={photo.filepath || `/uploaded/${photo.filename}`}
            alt={photo.title}
            width={300}
            height={200}
            layout="responsive"
            objectFit="cover"
            className="image"
            unoptimized={true} // For dynamic images
          />
          
          {isHovering && (
            <div className="overlay">
              <div className="action-buttons">
                <button className="action-button view-button">
                  <FaEye />
                </button>
                <button className="action-button edit-button">
                  <FaEdit />
                </button>
                {onDelete && (
                  <button 
                    className="action-button delete-button"
                    onClick={handleDeleteClick}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="content">
          <div className="header">
            <h3 className="title">{photo.title}</h3>
            <button 
              className="favorite-button"
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
                <FaHeart className="favorite-icon active" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </button>
          </div>
          
          <p className="date">{formattedDate}</p>
          
          {photo.tags && photo.tags.length > 0 && (
            <div className="tags">
              {photo.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      
      <style jsx>{`
        .image-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          background-color: white;
        }
        
        .image-card:hover {
          transform: translateY(-5px);
        }
        
        .image-container {
          position: relative;
          aspect-ratio: 3/2;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-card:hover .overlay {
          opacity: 1;
        }
        
        .content {
          padding: 15px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }
        
        .tag {
          background-color: #f1f1f1;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default ImageCard;