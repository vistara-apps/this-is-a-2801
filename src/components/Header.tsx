import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Music, Waves } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Beat Weaver</h1>
              <p className="text-xs text-white/70 hidden sm:block">AI Music Remix Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-white/80 hover:text-white transition-colors duration-200">
              Home
            </a>
            <a href="#create" className="text-white/80 hover:text-white transition-colors duration-200">
              Create
            </a>
            <a href="#community" className="text-white/80 hover:text-white transition-colors duration-200">
              Community
            </a>
          </nav>
          
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;