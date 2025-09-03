import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWalletClient } from 'wagmi';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Check local storage for user data
        const storedUser = localStorage.getItem('beat_weaver_user');
        
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking user session:', err);
        setError('Failed to restore user session');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Update user when wallet changes
  useEffect(() => {
    if (walletClient && walletClient.account && currentUser) {
      // Update user with wallet address
      const updatedUser = {
        ...currentUser,
        walletAddress: walletClient.account.address,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('beat_weaver_user', JSON.stringify(updatedUser));
    }
  }, [walletClient, currentUser]);

  // Login function - simplified for demo
  const login = async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would validate credentials with a backend
      // For now, we'll create a mock user
      const newUser: User = {
        userId: `user_${Math.random().toString(36).substring(2, 11)}`,
        username,
        walletAddress: walletClient?.account?.address,
        createdAt: new Date(),
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('beat_weaver_user', JSON.stringify(newUser));
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('beat_weaver_user');
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would send updates to a backend
      // For now, we'll just update the local state
      const updatedUser = {
        ...currentUser,
        ...updates,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('beat_weaver_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

