import { useState, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWalletClient } from 'wagmi';

export function useAuth() {
  const { currentUser, isAuthenticated, login, logout, updateProfile, isLoading, error } = useUser();
  const { data: walletClient } = useWalletClient();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const handleLogin = useCallback(async (username: string) => {
    try {
      await login(username);
      closeAuthModal();
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  }, [login, closeAuthModal]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const connectWallet = useCallback(async () => {
    if (!walletClient) {
      throw new Error('Wallet client not available');
    }
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    if (currentUser && !currentUser.walletAddress && walletClient.account) {
      await updateProfile({
        walletAddress: walletClient.account.address,
      });
    }
  }, [walletClient, isAuthenticated, currentUser, updateProfile, openAuthModal]);

  return {
    user: currentUser,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    connectWallet,
    authModalOpen,
    openAuthModal,
    closeAuthModal,
    walletAddress: walletClient?.account?.address,
    isWalletConnected: !!walletClient?.account,
  };
}

