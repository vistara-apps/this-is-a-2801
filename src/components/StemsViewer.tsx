import React, { useState } from 'react';
import { Download, Mic, Music, Layers, Play, Pause } from 'lucide-react';
import { AudioStem } from '../types';
import AudioPlayer from './AudioPlayer';

interface StemsViewerProps {
  stems: AudioStem[];
  variant?: 'preview' | 'download';
}

const StemsViewer: React.FC<StemsViewerProps> = ({
  stems,
  variant = 'preview',
}) => {
  const [activeStems, setActiveStems] = useState<Record<string, boolean>>(
    stems.reduce((acc, stem) => ({ ...acc, [stem.id]: true }), {} as Record<string, boolean>)
  );
  const [playingStems, setPlayingStems] = useState<Record<string, boolean>>(
    stems.reduce((acc, stem) => ({ ...acc, [stem.id]: false }), {} as Record<string, boolean>)
  );

  const toggleStem = (stemId: string) => {
    setActiveStems(prev => ({
      ...prev,
      [stemId]: !prev[stemId],
    }));
  };

  const togglePlayStem = (stemId: string) => {
    setPlayingStems(prev => {
      // Pause all other stems
      const newState = Object.keys(prev).reduce(
        (acc, id) => ({ ...acc, [id]: false }),
        {} as Record<string, boolean>
      );
      // Toggle the current stem
      newState[stemId] = !prev[stemId];
      return newState;
    });
  };

  const downloadStem = (stem: AudioStem) => {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = stem.url;
    a.download = `${stem.name}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get stem icon based on type
  const getStemIcon = (type: string) => {
    switch (type) {
      case 'vocals':
        return <Mic className="w-5 h-5" />;
      case 'drums':
        // Using Music icon instead of Drum which is not available in lucide-react
        return <Music className="w-5 h-5" />;
      case 'bass':
        return <Music className="w-5 h-5" />;
      case 'other':
        return <Layers className="w-5 h-5" />;
      default:
        return <Music className="w-5 h-5" />;
    }
  };

  // Get stem color based on type
  const getStemColor = (type: string) => {
    switch (type) {
      case 'vocals':
        return 'from-purple-500 to-blue-500';
      case 'drums':
        return 'from-red-500 to-orange-500';
      case 'bass':
        return 'from-green-500 to-emerald-500';
      case 'other':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Separated Stems</h3>
        <span className="text-white/60 text-sm">{stems.length} stems</span>
      </div>
      
      <div className="space-y-3">
        {stems.map(stem => (
          <div
            key={stem.id}
            className={`rounded-lg p-4 transition-colors duration-200 ${
              activeStems[stem.id]
                ? 'bg-white/10'
                : 'bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getStemColor(stem.type)} flex items-center justify-center flex-shrink-0`}>
                {getStemIcon(stem.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium">{stem.name}</h4>
                <p className="text-white/60 text-sm">
                  {Math.floor(stem.duration / 60)}:{String(Math.floor(stem.duration % 60)).padStart(2, '0')}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {variant === 'preview' ? (
                  <button
                    onClick={() => togglePlayStem(stem.id)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  >
                    {playingStems[stem.id] ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => downloadStem(stem)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                )}
                
                <button
                  onClick={() => toggleStem(stem.id)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    activeStems[stem.id]
                      ? 'bg-primary-500 justify-end'
                      : 'bg-white/20 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white m-1" />
                </button>
              </div>
            </div>
            
            {playingStems[stem.id] && variant === 'preview' && (
              <div className="mt-3">
                <AudioPlayer
                  audioUrl={stem.url}
                  variant="minimal"
                  onPause={() => setPlayingStems(prev => ({ ...prev, [stem.id]: false }))}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {variant === 'download' && (
        <div className="pt-2">
          <button
            onClick={() => stems.forEach(stem => downloadStem(stem))}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download All Stems</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StemsViewer;

