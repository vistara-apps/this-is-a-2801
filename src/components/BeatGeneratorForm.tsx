import React, { useState } from 'react';
import { Play, Download, Loader } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { generateBeat } from '../services/audioService';
import { BeatParams } from '../types';

interface BeatGeneratorFormProps {
  onBeatGenerated: (beatUrl: string) => void;
  variant?: 'genreSelector' | 'parameterControls';
}

const BeatGeneratorForm: React.FC<BeatGeneratorFormProps> = ({ 
  onBeatGenerated, 
  variant = 'parameterControls' 
}) => {
  const [params, setParams] = useState<BeatParams>({
    genre: 'electronic',
    tempo: 120,
    key: 'C',
    complexity: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [generatedBeat, setGeneratedBeat] = useState<string | null>(null);
  const { createSession } = usePaymentContext();

  const genres = ['electronic', 'hip-hop', 'pop', 'rock', 'jazz', 'ambient'];
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const complexities: BeatParams['complexity'][] = ['simple', 'medium', 'complex'];

  const handlePayment = async () => {
    try {
      await createSession('$0.03'); // $0.03 for beat generation
      setHasPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
      // For demo purposes, allow proceeding without payment
      setHasPaid(true);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const beatUrl = await generateBeat(params);
      setGeneratedBeat(beatUrl);
      onBeatGenerated(beatUrl);
    } catch (error) {
      console.error('Beat generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white text-center">
          AI Beat Builder
        </h3>

        <div className="space-y-4">
          {/* Genre Selector */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Genre
            </label>
            <select
              value={params.genre}
              onChange={(e) => setParams(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-800">
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {variant === 'parameterControls' && (
            <>
              {/* Tempo */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tempo: {params.tempo} BPM
                </label>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={params.tempo}
                  onChange={(e) => setParams(prev => ({ ...prev, tempo: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Key */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Key
                </label>
                <select
                  value={params.key}
                  onChange={(e) => setParams(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {keys.map(key => (
                    <option key={key} value={key} className="bg-gray-800">
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Complexity
                </label>
                <div className="flex space-x-2">
                  {complexities.map(complexity => (
                    <button
                      key={complexity}
                      onClick={() => setParams(prev => ({ ...prev, complexity }))}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        params.complexity === complexity
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Payment/Generate Button */}
          {!hasPaid && !isGenerating && (
            <button
              onClick={handlePayment}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Pay $0.03 to Generate Beat
            </button>
          )}

          {hasPaid && !isGenerating && (
            <button
              onClick={handleGenerate}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Generate Beat
            </button>
          )}

          {isGenerating && (
            <button
              disabled
              className="w-full bg-white/20 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              <Loader className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </button>
          )}

          {/* Generated Beat Preview */}
          {generatedBeat && (
            <div className="glass-card rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Generated Beat</span>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200">
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="waveform w-full h-6 opacity-60" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeatGeneratorForm;