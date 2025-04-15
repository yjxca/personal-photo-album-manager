'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserPlus, FaCamera, FaImages } from 'react-icons/fa';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setTimeout(() => {
        router.push('/gallery');
      }, 1500);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(0, 0, 0, 0.1)', 
            borderRadius: '50%',
            borderLeftColor: '#4285f4',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading...</p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem'
      }}>
        <FaCamera style={{ fontSize: '4rem', color: '#4285f4', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome back to Photo Album Manager</h1>
        <p style={{ marginBottom: '2rem', color: '#555' }}>We're taking you to your photos...</p>
        <Link href="/gallery" style={{
          backgroundColor: '#4285f4',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          <FaImages style={{ marginRight: '0.5rem' }} /> Go to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <FaCamera style={{ fontSize: '4rem', color: '#4285f4', marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Personal Photo Album Manager</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', textAlign: 'center', maxWidth: '600px', color: '#555' }}>
        Organize, manage and share your photos with this simple and elegant photo management solution.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center' 
      }}>
        <Link href="/login" style={{
          backgroundColor: '#4285f4',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <FaUser style={{ marginRight: '0.75rem' }} /> Login
        </Link>
        
        <Link href="/signup" style={{
          backgroundColor: '#34a853',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <FaUserPlus style={{ marginRight: '0.75rem' }} /> Sign Up
        </Link>
      </div>
      
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Key Features</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          maxWidth: '900px'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#4285f4' }}>Photo Gallery</h3>
            <p style={{ color: '#555' }}>Browse your photos in a beautiful responsive grid layout</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#ea4335' }}>Smart Search</h3>
            <p style={{ color: '#555' }}>Find photos quickly with powerful search and filtering</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#fbbc05' }}>Album Organization</h3>
            <p style={{ color: '#555' }}>Group photos into albums for better organization</p>
          </div>
        </div>
      </div>
    </div>
  );
}