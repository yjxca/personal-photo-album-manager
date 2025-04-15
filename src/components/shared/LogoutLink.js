'use client';

import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutLink = ({ className, style }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to home page
    router.push('/');
  };

  return (
    <button 
      onClick={handleLogout} 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        color: '#d32f2f',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '1rem',
        ...style
      }}
    >
      <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
    </button>
  );
};

export default LogoutLink;