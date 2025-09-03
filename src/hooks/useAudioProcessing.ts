import { useState, useCallback } from 'react';
import { AudioStem, BeatParams } from '../types';
import { separateStems, generateBeat, uploadStems } from '../services/audioService';
import { useUser } from '../contexts/UserContext';

export function useAudioProcessing() {
  const [isProcessingStems, setIsProcessingStems] = useState(false);
  const [isGeneratingBeat, setIsGeneratingBeat] = useState(false);
  const [stems, setStems] = useState<AudioStem[]>([]);
  const [generatedBeat, setGeneratedBeat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useUser();

  const processStemSeparation = useCallback(async (audioFile: File) => {
    if (!audioFile) {
      setError('No audio file provided');
      return null;
    }

    setIsProcessingStems(true);
    setError(null);
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

      // Process stem separation
      const separatedStems = await separateStems(audioFile);
      setProgress(100);
      setStems(separatedStems);

      // Upload stems if user is authenticated
      if (currentUser) {
        await uploadStems(audioFile, separatedStems, currentUser.userId);
      }

      return separatedStems;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to separate stems';
      setError(errorMessage);
      console.error('Stem separation error:', err);
      return null;
    } finally {
      setIsProcessingStems(false);
      setProgress(0);
    }
  }, [currentUser]);

  const processBeatGeneration = useCallback(async (params: BeatParams) => {
    setIsGeneratingBeat(true);
    setError(null);

    try {
      const beatUrl = await generateBeat(params);
      setGeneratedBeat(beatUrl);
      return beatUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate beat';
      setError(errorMessage);
      console.error('Beat generation error:', err);
      return null;
    } finally {
      setIsGeneratingBeat(false);
    }
  }, []);

  const clearStems = useCallback(() => {
    setStems([]);
  }, []);

  const clearGeneratedBeat = useCallback(() => {
    setGeneratedBeat(null);
  }, []);

  return {
    isProcessingStems,
    isGeneratingBeat,
    stems,
    generatedBeat,
    error,
    progress,
    processStemSeparation,
    processBeatGeneration,
    clearStems,
    clearGeneratedBeat,
  };
}

