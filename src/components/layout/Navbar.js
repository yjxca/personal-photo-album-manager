// src/components/layout/Navbar.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaCamera, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    // Fetch weather data from an external API
    const fetchWeather = async () => {
      try {
        // In a real app, you would use a real API key
        // Simulate API response for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeatherData({
          location: { name: 'Toronto' },
          current: { 
            temp_c: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
            condition: { text: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)] }
          }
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();

    // Refresh weather data every 5 minutes
    const weatherInterval = setInterval(() => {
      console.log('Refreshing weather data...');
      fetchWeather();
    }, 300000); // 5 minutes

    return () => clearInterval(weatherInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="logo">
          <FaCamera className="logo-icon" />
          <span>PhotoAlbum</span>
        </Link>

        {weatherData && (
          <div className="weather-widget">
            <span>{weatherData.location.name}: </span>
            <span>{weatherData.current.temp_c}°C, </span>
            <span>{weatherData.current.condition.text}</span>
          </div>
        )}

        <ul className="nav-links">
          <li>
            <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/albums" className={pathname === '/albums' ? 'active' : ''}>
              Albums
            </Link>
          </li>
          <li>
            <Link href="/upload" className={pathname === '/upload' ? 'active' : ''}>
              Upload
            </Link>
          </li>
          {isLoggedIn ? (
            <li className="user-menu">
              <FaUserCircle className="user-icon" />
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      <style jsx>{`
        .navbar {
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          align-items: center;
          gap: 1.5rem;
        }
        
        .nav-links a {
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .nav-links a.active {
          color: var(--primary-color);
          background-color: rgba(66, 133, 244, 0.1);
        }
        
        .weather-widget {
          padding: 0.5rem 1rem;
          background-color: #f5f5f5;
          border-radius: 16px;
          font-size: 0.9rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;