import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  // Determine size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }[size];

  // Full screen loading overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="glass-card rounded-lg p-6 text-center space-y-4">
          <Loader className={`${sizeClasses} text-primary-500 animate-spin mx-auto`} />
          
          {message && (
            <p className="text-white font-medium">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Inline loading indicator
  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <Loader className={`${sizeClasses} text-primary-500 animate-spin`} />
      
      {message && (
        <span className="text-white/70">{message}</span>
      )}
    </div>
  );
};

export default LoadingIndicator;

