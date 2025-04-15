// src/components/gallery/SearchBar.js
'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tags: '',
    startDate: '',
    endDate: '',
  });
  const [activeTags, setActiveTags] = useState([]);
  
  useEffect(() => {
    // Debounce search to avoid too many queries while typing
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTags, filters.startDate, filters.endDate]);
  
  const performSearch = () => {
    onSearch({
      searchTerm,
      tags: activeTags,
      startDate: filters.startDate ? new Date(filters.startDate) : null,
      endDate: filters.endDate ? new Date(filters.endDate) : null,
    });
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const addTag = (tag) => {
    if (!activeTags.includes(tag) && tag.trim() !== '') {
      setActiveTags([...activeTags, tag]);
      setFilters({
        ...filters,
        tags: ''
      });
    }
  };
  
  const removeTag = (tag) => {
    setActiveTags(activeTags.filter(t => t !== tag));
  };
  
  const clearAll = () => {
    setSearchTerm('');
    setFilters({
      tags: '',
      startDate: '',
      endDate: '',
    });
    setActiveTags([]);
    onSearch({ searchTerm: '', tags: [], startDate: null, endDate: null });
  };
  
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search photos by title or description..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {(searchTerm || activeTags.length > 0 || filters.startDate || filters.endDate) && (
          <button className="clear-button" onClick={clearAll}>
            <FaTimes />
          </button>
        )}
        <button 
          className={`filter-button ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          <span>Filters</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="filters-dropdown">
          <div className="filter-section">
            <label className="filter-label">Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                className="tag-input"
                placeholder="Add tags..."
                value={filters.tags}
                onChange={(e) => setFilters({...filters, tags: e.target.value})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filters.tags.trim()) {
                    e.preventDefault();
                    addTag(filters.tags.trim().toLowerCase());
                  }
                }}
              />
              {filters.tags && (
                <button 
                  className="add-tag-button"
                  onClick={() => addTag(filters.tags.trim().toLowerCase())}
                >
                  Add
                </button>
              )}
            </div>
            
            {activeTags.length > 0 && (
              <div className="active-tags">
                {activeTags.map(tag => (
                  <span key={tag} className="active-tag">
                    #{tag}
                    <button 
                      className="remove-tag-button"
                      onClick={() => removeTag(tag)}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <label className="filter-label">Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                name="startDate"
                className="date-input"
                value={filters.startDate}
                onChange={handleFilterChange}
                placeholder="Start date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                name="endDate"
                className="date-input"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="End date"
              />
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .search-bar-container {
          position: relative;
          margin-bottom: 2rem;
        }
        
        .search-input-wrapper {
          display: flex;
          align-items: center;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .search-icon {
          padding: 0 15px;
          color: #777;
        }
        
        .search-input {
          flex: 1;
          padding: 12px 0;
          border: none;
          outline: none;
          font-size: 1rem;
        }
        
        .filter-button {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 15px;
          height: 100%;
          background-color: #f1f1f1;
          border: none;
          border-left: 1px solid #e0e0e0;
          cursor: pointer;
        }
        
        .filters-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 1.5rem;
          z-index: 100;
        }
        
        .active-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .active-tag {
          display: flex;
          align-items: center;
          background-color: #e3f2fd;
          color: var(--primary-color);
          padding: 5px 10px;
          border-radius: 16px;
          font-size: 0.85rem;
        }
        
        .date-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;