/**
 * Utility to get the server URL dynamically.
 * Works for Localhost, Local Network (Phone), and Production.
 */
export const getServerUrl = () => {
  // 1. Check for Environment Variable
  if (import.meta.env.VITE_SERVER_URL) return import.meta.env.VITE_SERVER_URL;

  if (typeof window === 'undefined') return 'http://localhost:5000';
  
  const { hostname, protocol } = window.location;
  
  // 2. Localhost detection
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // 3. Fallback for Local Network (Mobile access)
  // If we are at 192.168.1.5:5173, the server is at 192.168.1.5:5000
  return `${protocol}//${hostname}:5000`;
};

export const SERVER_URL = getServerUrl();
