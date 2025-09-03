import { useState, useEffect, useCallback } from 'react';
import { Remix } from '../types';
import { getCommunityRemixes, getRemixById, uploadRemix } from '../services/audioService';
import { useUser } from '../contexts/UserContext';

export function useCommunity() {
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'tips'>('popular');
  const { currentUser } = useUser();

  // Load remixes on mount
  useEffect(() => {
    loadRemixes();
  }, []);

  // Load remixes from API
  const loadRemixes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCommunityRemixes();
      setRemixes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load remixes';
      setError(errorMessage);
      console.error('Failed to load remixes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a remix by ID
  const getRemix = useCallback(async (remixId: string) => {
    try {
      return await getRemixById(remixId);
    } catch (err) {
      console.error('Failed to get remix:', err);
      return null;
    }
  }, []);

  // Upload a new remix
  const shareRemix = useCallback(async (
    audioFile: File,
    title: string,
    description: string,
    stemsInfo: string[]
  ) => {
    if (!currentUser) {
      throw new Error('You must be logged in to share a remix');
    }

    setIsLoading(true);
    setError(null);

    try {
      const remix = await uploadRemix(audioFile, {
        userId: currentUser.userId,
        title,
        description,
        stemsInfo,
        username: currentUser.username,
        communityTips: 0,
      });

      // Add the new remix to the list
      setRemixes(prev => [remix, ...prev]);
      return remix;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share remix';
      setError(errorMessage);
      console.error('Failed to share remix:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Filter and sort remixes
  const filteredRemixes = remixes
    .filter(remix => 
      remix.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remix.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'tips':
          return b.communityTips - a.communityTips;
        case 'popular':
        default:
          return b.communityTips - a.communityTips; // Same as tips for now
      }
    });

  // Update a remix (e.g., after tipping)
  const updateRemix = useCallback((updatedRemix: Remix) => {
    setRemixes(prev => 
      prev.map(remix => 
        remix.remixId === updatedRemix.remixId ? updatedRemix : remix
      )
    );
  }, []);

  return {
    remixes: filteredRemixes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loadRemixes,
    getRemix,
    shareRemix,
    updateRemix,
  };
}

