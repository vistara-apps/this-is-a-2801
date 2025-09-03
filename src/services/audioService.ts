import { AudioStem, BeatParams } from '../types';

// Mock service for AI stem separation
export const separateStems = async (audioFile: File): Promise<AudioStem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock separated stems
  return [
    {
      id: '1',
      name: 'Vocals',
      type: 'vocals',
      url: URL.createObjectURL(audioFile),
      duration: 180
    },
    {
      id: '2',
      name: 'Drums',
      type: 'drums',
      url: URL.createObjectURL(audioFile),
      duration: 180
    },
    {
      id: '3',
      name: 'Bass',
      type: 'bass',
      url: URL.createObjectURL(audioFile),
      duration: 180
    },
    {
      id: '4',
      name: 'Other',
      type: 'other',
      url: URL.createObjectURL(audioFile),
      duration: 180
    }
  ];
};

// Mock service for AI beat generation
export const generateBeat = async (params: BeatParams): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock audio URL
  return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBzuM0vTVfC0FEAAA';
};

// Mock community remixes
export const getCommunityRemixes = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      remixId: '1',
      userId: 'user1',
      title: 'Summer Vibes Remix',
      description: 'A chill electronic remix perfect for summer',
      audioUrl: 'mock-audio-url-1',
      stemsInfo: ['vocals', 'drums', 'synth'],
      createdAt: new Date(),
      communityTips: 5.2,
      username: 'BeatMaster'
    },
    {
      remixId: '2',
      userId: 'user2',
      title: 'Hip-Hop Fusion',
      description: 'Modern hip-hop with classic soul samples',
      audioUrl: 'mock-audio-url-2',
      stemsInfo: ['vocals', 'bass', 'drums'],
      createdAt: new Date(),
      communityTips: 12.8,
      username: 'SoulSampler'
    },
    {
      remixId: '3',
      userId: 'user3',
      title: 'Ambient Dreams',
      description: 'Ethereal ambient soundscape with vocal textures',
      audioUrl: 'mock-audio-url-3',
      stemsInfo: ['vocals', 'pad', 'ambient'],
      createdAt: new Date(),
      communityTips: 8.3,
      username: 'DreamWeaver'
    }
  ];
};