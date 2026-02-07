/**
 * Auth context - manages token storage and authentication state
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getStoredToken, setStoredToken, clearStoredToken } from '../utils/authStorage';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setStoredToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    clearStoredToken();
  }, []);

  // Sync state when 401 triggers auth-logout from interceptor
  useEffect(() => {
    const handleLogout = () => setToken(null);
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
