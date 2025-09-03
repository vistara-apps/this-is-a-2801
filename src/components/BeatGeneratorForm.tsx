import React, { useState } from 'react';
import { Sparkles, Music, Loader, Sliders } from 'lucide-react';
import { BeatParams } from '../types';
import { useAuth } from '../hooks/useAuth';
import PaymentModal from './PaymentModal';

interface BeatGeneratorFormProps {
  onBeatGenerated: (params: BeatParams) => Promise<string | null>;
  variant?: 'genreSelector' | 'parameterControls';
}

const BeatGeneratorForm: React.FC<BeatGeneratorFormProps> = ({
  onBeatGenerated,
  variant = 'parameterControls',
}) => {
  const [genre, setGenre] = useState('electronic');
  const [tempo, setTempo] = useState(120);
  const [key, setKey] = useState('C');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setIsGenerating(true);
    setError(null);
    
    try {
      const params: BeatParams = {
        genre,
        tempo,
        key,
        complexity,
      };
      
      await onBeatGenerated(params);
    } catch (err) {
      setError('Failed to generate beat');
    } finally {
      setIsGenerating(false);
    }
  };

  // Genre selector variant (simplified UI)
  if (variant === 'genreSelector') {
    const genres = [
      { id: 'electronic', name: 'Electronic', icon: '🎛️' },
      { id: 'hip-hop', name: 'Hip Hop', icon: '🎤' },
      { id: 'pop', name: 'Pop', icon: '🎵' },
      { id: 'rock', name: 'Rock', icon: '🎸' },
      { id: 'jazz', name: 'Jazz', icon: '🎷' },
      { id: 'ambient', name: 'Ambient', icon: '🌊' },
    ];

    return (
      <div className="glass-card rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">Generate a Beat</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id)}
              className={`p-4 rounded-lg text-center transition-colors duration-200 ${
                genre === g.id
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : 'bg-white/10 border border-white/10 hover:bg-white/15'
              }`}
            >
              <div className="text-2xl mb-1">{g.icon}</div>
              <div className="text-white font-medium">{g.name}</div>
            </button>
          ))}
        </div>
        
        <div className="space-y-2">
          <label className="block text-white/80 text-sm font-medium">
            Tempo: {tempo} BPM
          </label>
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Beat</span>
            </>
          )}
        </button>
        
        <p className="text-white/50 text-xs text-center">
          Beat generation requires a one-time payment of 3 USDC
        </p>
      </div>
    );
  }

  // Parameter controls variant (full UI)
  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">AI Beat Builder</h3>
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Sliders className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="electronic">Electronic</option>
            <option value="hip-hop">Hip Hop</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="ambient">Ambient</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-white/80 text-sm font-medium">
            Tempo: {tempo} BPM
          </label>
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-white/50 text-xs">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">
            Key
          </label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="C">C</option>
            <option value="C#">C#</option>
            <option value="D">D</option>
            <option value="D#">D#</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="F#">F#</option>
            <option value="G">G</option>
            <option value="G#">G#</option>
            <option value="A">A</option>
            <option value="A#">A#</option>
            <option value="B">B</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">
            Complexity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['simple', 'medium', 'complex'].map((c) => (
              <button
                key={c}
                onClick={() => setComplexity(c as 'simple' | 'medium' | 'complex')}
                className={`py-2 px-3 rounded-lg text-center transition-colors duration-200 ${
                  complexity === c
                    ? 'bg-primary-500/20 border border-primary-500/50 text-white'
                    : 'bg-white/10 border border-white/10 hover:bg-white/15 text-white/70'
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Beat</span>
          </>
        )}
      </button>
      
      <p className="text-white/50 text-xs text-center">
        Beat generation requires a one-time payment of 3 USDC
      </p>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount="3 USDC"
        serviceName="AI Beat Generation"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BeatGeneratorForm;

