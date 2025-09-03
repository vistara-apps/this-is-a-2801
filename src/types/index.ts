export interface User {
  userId: string;
  username: string;
  walletAddress?: string;
  createdAt: Date;
}

export interface Remix {
  remixId: string;
  userId: string;
  title: string;
  description: string;
  audioUrl: string;
  stemsInfo: string[];
  createdAt: Date;
  communityTips: number;
  username: string;
}

export interface StemUpload {
  stemUploadId: string;
  userId: string;
  originalFileUrl: string;
  separatedStems: string[];
  uploadTimestamp: Date;
}

export interface AudioStem {
  id: string;
  name: string;
  type: 'vocals' | 'drums' | 'bass' | 'other';
  url: string;
  duration: number;
}

export interface BeatParams {
  genre: string;
  tempo: number;
  key: string;
  complexity: 'simple' | 'medium' | 'complex';
}