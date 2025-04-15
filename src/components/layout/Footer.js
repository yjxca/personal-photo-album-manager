'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaGithub, FaLinkedin, FaCopyright, FaSignOutAlt } from 'react-icons/fa';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Add debug logging
    console.log("Footer: Checking login status");
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    console.log("Footer: User from localStorage:", user);
    
    // This approach will be more reliable
    setIsLoggedIn(user !== null);
    
    // Use setInterval to update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  const handleLogout = () => {
    console.log("Footer: Logout clicked");
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };
  
  // Force logout link to always show during debugging
  const alwaysShowLogout = true;
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>PhotoAlbum</h3>
          <p>A simple and elegant solution for organizing your personal photos.</p>
          <p className="copyright">
            <FaCopyright /> {currentTime.getFullYear()} Jiaxue Yang
          </p>
          <p className="time">Current time: {currentTime.toLocaleTimeString()}</p>
          <p style={{color: 'blue'}}>Debug - Login Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/albums">Albums</Link></li>
            <li><Link href="/upload">Upload</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            
            {/* Always show logout during debugging */}
            <li style={{
              backgroundColor: '#f0f0f0',
              padding: '5px 10px',
              borderRadius: '4px',
              marginTop: '10px'
            }}>
              <button 
                onClick={handleLogout} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                <FaSignOutAlt style={{marginRight: '8px'}} /> Logout
              </button>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="mailto:contact@photoalbum.com" aria-label="Email">
              <FaEnvelope />
            </a>
            <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: #f5f5f5;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .footer-container {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-section {
          flex: 1;
          padding: 0 1rem;
        }
        
        .footer-section h3 {
          color: #4285f4;
          margin-bottom: 1rem;
        }
        
        .time {
          font-size: 0.9rem;
          color: #666;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          font-size: 1.5rem;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
        }
        
        .footer-links li {
          margin-bottom: 0.5rem;
        }
        
        .footer-links a {
          color: inherit;
          text-decoration: none;
        }
        
        .footer-links a:hover {
          color: #4285f4;
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
          }
          
          .footer-section {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;