import React, { useState } from 'react';
import { Play, Pause, User, MessageSquare, DollarSign, Share2 } from 'lucide-react';
import { Remix } from '../types';
import AudioPlayer from './AudioPlayer';
import TipButton from './TipButton';
import { useAuth } from '../hooks/useAuth';

interface RemixCardProps {
  remix: Remix;
  variant?: 'withPlay' | 'withTipButton';
  onTipSuccess?: () => void;
}

const RemixCard: React.FC<RemixCardProps> = ({
  remix,
  variant = 'withTipButton',
  onTipSuccess,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: remix.title,
        text: `Check out this remix: ${remix.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h3 className="text-white font-medium">{remix.title}</h3>
              <p className="text-white/60 text-sm">
                by {remix.username} • {formatDate(remix.createdAt)}
              </p>
            </div>
          </div>
          
          <button
            onClick={handlePlay}
            className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
        </div>
        
        {remix.description && (
          <p className="text-white/80 text-sm mt-3">
            {remix.description}
          </p>
        )}
        
        {isExpanded && (
          <div className="mt-4">
            <AudioPlayer
              audioUrl={remix.audioUrl}
              title={remix.title}
              variant="standard"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white/70 text-sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>0</span>
            </div>
            
            <div className="flex items-center text-white/70 text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{remix.communityTips}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-white/60 hover:text-white/80 rounded-full hover:bg-white/10 transition-colors duration-200"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            {variant === 'withTipButton' && isAuthenticated && (
              <TipButton
                recipientId={remix.userId}
                remixId={remix.remixId}
                amount="1 USDC"
                variant="small"
                onSuccess={onTipSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixCard;

