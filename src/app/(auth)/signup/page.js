'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user data for API
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      // Call API directly rather than using a service
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const newUser = await response.json();
      
      // Store user in localStorage (excluding password)
      const { password, ...userToStore } = newUser;
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      // Redirect to gallery
      router.push('/gallery');
    } catch (err) {
      console.error('Signup error:', err);
      setErrors({ ...errors, form: err.message || 'Registration failed. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-side">
          <div className="form-container">
            <h1 className="form-title">Create an Account</h1>
            
            {errors.form && <div className="error-message">{errors.form}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <FaUser className="form-icon" /> Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input ${errors.username ? 'input-error' : ''}`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="form-icon" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FaLock className="form-icon" /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <FaLock className="form-icon" /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>
              
              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : (
                  <>
                    <FaUserPlus className="btn-icon" /> Sign Up
                  </>
                )}
              </button>
            </form>
            
            <p className="form-footer">
              Already have an account? <Link href="/login" className="form-link">Login</Link>
            </p>
          </div>
        </div>
        
        <div className="auth-info-side">
          <div className="info-content">
            <h2>Join PhotoAlbum</h2>
            <p>Create your account to start organizing and sharing your photo memories.</p>
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
          background-color: #34a853;
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
        
        .input-error {
          border-color: #d32f2f !important;
        }
        
        .error-text {
          color: #d32f2f;
          font-size: 0.9rem;
          margin-top: 0.5rem;
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
        
        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column-reverse;
          }
          
          .auth-info-side {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;