'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For demonstration, either use the API or accept any login
      const useSimpleLogin = true;
      
      if (useSimpleLogin) {
        // Simple login that always succeeds with demo_user
        setTimeout(() => {
          localStorage.setItem('user', JSON.stringify({
            id: 1,
            username: 'demo_user',
            email: formData.email || 'demo@example.com'
          }));
          router.push('/gallery');
          setIsLoading(false);
        }, 1000);
      } else {
        // API-based login
        const response = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(formData.email)}`);
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const users = await response.json();
        const user = users[0];
        
        if (user && user.password === formData.password) {
          const { password, ...userToStore } = user;
          localStorage.setItem('user', JSON.stringify(userToStore));
          router.push('/gallery');
        } else {
          setError('Invalid email or password');
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-side">
          <div className="form-container">
            <h1 className="form-title">Login to PhotoAlbum</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FaUser className="form-icon" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FaLock className="form-icon" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : (
                  <>
                    <FaSignInAlt className="btn-icon" /> Login
                  </>
                )}
              </button>
            </form>
            
            <p className="form-footer">
              Don't have an account? <Link href="/signup" className="form-link">Sign up</Link>
            </p>
            
            <div className="demo-notice">
              <p>For demonstration purposes, you can log in with any email and password.</p>
            </div>
          </div>
        </div>
        
        <div className="auth-info-side">
          <div className="info-content">
            <h2>Welcome to PhotoAlbum</h2>
            <p>Your personal space for organizing and sharing memories.</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          padding: 2rem;
        }
        
        .auth-container {
          display: flex;
          max-width: 1000px;
          width: 100%;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .auth-form-side {
          flex: 1;
          padding: 2rem;
        }
        
        .auth-info-side {
          flex: 1;
          background-color: #4285f4;
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .info-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .info-content p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .form-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #4285f4;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .form-icon {
          margin-right: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .error-message {
          background-color: rgba(211, 47, 47, 0.1);
          color: #d32f2f;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #d32f2f;
        }
        
        .form-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-icon {
          margin-right: 0.5rem;
        }
        
        .form-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .form-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        
        .form-link {
          color: #4285f4;
          text-decoration: none;
          font-weight: 500;
        }
        
        .form-link:hover {
          text-decoration: underline;
        }
        
        .demo-notice {
          margin-top: 2rem;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }
          
          .auth-info-side {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;