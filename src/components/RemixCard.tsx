import React, { useState } from 'react';
import { Play, Pause, Heart, DollarSign, User, Calendar } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { Remix } from '../types';

interface RemixCardProps {
  remix: Remix;
  variant?: 'withPlay' | 'withTipButton';
}

const RemixCard: React.FC<RemixCardProps> = ({ remix, variant = 'withTipButton' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createSession } = usePaymentContext();

  const handleTip = async (amount: string) => {
    setIsLoading(true);
    try {
      await createSession(amount);
      console.log(`Tipped ${amount} to ${remix.username}`);
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="glass-card rounded-lg p-4 sm:p-6 space-y-4 hover:bg-white/15 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {remix.title}
          </h3>
          <div className="flex items-center space-x-4 mt-1 text-white/60 text-sm">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{remix.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(remix.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setHasLiked(!hasLiked)}
          className={`p-2 rounded-full transition-colors duration-200 ${
            hasLiked ? 'text-red-400 bg-red-400/20' : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm leading-relaxed">
        {remix.description}
      </p>

      {/* Stems Info */}
      <div className="flex flex-wrap gap-2">
        {remix.stemsInfo.map((stem, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 capitalize"
          >
            {stem}
          </span>
        ))}
      </div>

      {/* Waveform Visualization */}
      <div className="bg-white/10 rounded-lg p-3">
        <div className="waveform w-full h-8 opacity-60" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {variant === 'withPlay' && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        )}

        <div className="flex items-center space-x-2 text-white/70">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">${remix.communityTips.toFixed(1)} tips</span>
        </div>

        {variant === 'withTipButton' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleTip('$0.50')}
              disabled={isLoading}
              className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
            >
              $0.50
            </button>
            <button
              onClick={() => handleTip('$1.00')}
              disabled={isLoading}
              className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
            >
              $1.00
            </button>
            <button
              onClick={() => handleTip('$5.00')}
              disabled={isLoading}
              className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
            >
              $5.00
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemixCard;