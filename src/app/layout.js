import './globals.css';
import LogoutLink from '@/components/shared/LogoutLink';

export const metadata = {
  title: 'Personal Photo Album Manager',
  description: 'A web application to manage your personal photo collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Logout link positioned at bottom right */}
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          padding: '5px'
        }}>
          <LogoutLink />
        </div>
        
        {children}
      </body>
    </html>
  );
}