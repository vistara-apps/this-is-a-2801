import React, { useState } from 'react';
import { Download, Play, Pause, Volume2 } from 'lucide-react';
import { AudioStem } from '../types';

interface StemsViewerProps {
  stems: AudioStem[];
  variant?: 'preview' | 'download';
}

const StemsViewer: React.FC<StemsViewerProps> = ({ stems, variant = 'download' }) => {
  const [playingStems, setPlayingStems] = useState<Set<string>>(new Set());

  const togglePlay = (stemId: string) => {
    setPlayingStems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stemId)) {
        newSet.delete(stemId);
      } else {
        newSet.add(stemId);
      }
      return newSet;
    });
  };

  const downloadStem = (stem: AudioStem) => {
    // Mock download functionality
    console.log(`Downloading ${stem.name}...`);
  };

  const getStemColor = (type: AudioStem['type']) => {
    switch (type) {
      case 'vocals': return 'from-pink-500 to-rose-500';
      case 'drums': return 'from-red-500 to-orange-500';
      case 'bass': return 'from-blue-500 to-indigo-500';
      case 'other': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Separated Stems
        </h3>
        
        <div className="space-y-3">
          {stems.map((stem) => (
            <div key={stem.id} className="glass-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getStemColor(stem.type)} flex items-center justify-center`}>
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{stem.name}</h4>
                    <p className="text-white/60 text-sm capitalize">{stem.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {variant === 'preview' && (
                    <button
                      onClick={() => togglePlay(stem.id)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                    >
                      {playingStems.has(stem.id) ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                  )}
                  
                  {variant === 'download' && (
                    <button
                      onClick={() => downloadStem(stem)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Waveform visualization */}
              <div className="mt-3 h-8 bg-white/10 rounded-lg overflow-hidden">
                <div className="waveform w-full h-full opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StemsViewer;