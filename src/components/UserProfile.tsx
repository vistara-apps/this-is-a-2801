import React from 'react';
import { User, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface UserProfileProps {
  variant?: 'compact' | 'full';
}

const UserProfile: React.FC<UserProfileProps> = ({ variant = 'full' }) => {
  const { user, isAuthenticated, logout, isWalletConnected, walletAddress } = useAuth();

  if (!isAuthenticated || !user) {
    return <ConnectButton />;
  }

  // Compact variant for mobile or space-constrained areas
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-white text-sm font-medium truncate max-w-[100px]">
          {user.username}
        </div>
      </div>
    );
  }

  // Full variant with more details and actions
  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">
            {user.username}
          </h3>
          
          <div className="flex items-center mt-1">
            {isWalletConnected ? (
              <div className="flex items-center text-white/70 text-xs">
                <Wallet className="w-3 h-3 mr-1 text-green-400" />
                <span className="truncate max-w-[120px]">
                  {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
                </span>
              </div>
            ) : (
              <div className="text-white/50 text-xs">
                No wallet connected
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={logout}
          className="p-2 text-white/60 hover:text-white/80 rounded-full hover:bg-white/10 transition-colors duration-200"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      
      {!isWalletConnected && (
        <div className="mt-3">
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default UserProfile;

