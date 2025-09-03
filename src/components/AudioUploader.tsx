import React, { useState, useCallback } from 'react';
import { Upload, File, Loader } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { separateStems } from '../services/audioService';
import { AudioStem } from '../types';

interface AudioUploaderProps {
  onStemsGenerated: (stems: AudioStem[]) => void;
  variant?: 'basic' | 'withProgress';
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  onStemsGenerated, 
  variant = 'basic' 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);
  const { createSession } = usePaymentContext();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  }, []);

  const handlePayment = async () => {
    try {
      await createSession('$0.05'); // $0.05 for stem separation
      setHasPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
      // For demo purposes, allow proceeding without payment
      setHasPaid(true);
    }
  };

  const handleProcessStems = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const stems = await separateStems(file);
      setProgress(100);
      
      setTimeout(() => {
        onStemsGenerated(stems);
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Stem separation failed:', error);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white text-center">
          AI Stem Separator
        </h3>
        
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-white/70" />
              <p className="text-sm text-white/70">
                Upload your audio file
              </p>
              <p className="text-xs text-white/50">
                MP3, WAV, or M4A
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
              <File className="w-5 h-5 text-white/70" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium truncate">
                  {file.name}
                </p>
                <p className="text-xs text-white/60">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {variant === 'withProgress' && isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!hasPaid && !isProcessing && (
              <button
                onClick={handlePayment}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Pay $0.05 to Separate Stems
              </button>
            )}

            {hasPaid && !isProcessing && (
              <button
                onClick={handleProcessStems}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Separate Stems
              </button>
            )}

            {isProcessing && (
              <button
                disabled
                className="w-full bg-white/20 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;