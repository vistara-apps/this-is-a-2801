import React, { useState } from 'react';
import { Menu, X, Music } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import UserProfile from './UserProfile';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">Beat Weaver</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfile variant="compact" />
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={openAuthModal}
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <ConnectButton />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white/80 hover:text-white p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/5 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <div className="p-3">
                <UserProfile />
              </div>
            ) : (
              <div className="p-3 space-y-3">
                <button
                  onClick={openAuthModal}
                  className="w-full text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium border border-white/20"
                >
                  Sign In
                </button>
                <div className="pt-2">
                  <ConnectButton />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

