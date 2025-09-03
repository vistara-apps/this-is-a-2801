// API response types for external services

// Eleven Labs API
export interface ElevenLabsModel {
  model_id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface ElevenLabsModelsResponse {
  models: ElevenLabsModel[];
}

export interface ElevenLabsGenerationRequest {
  model_id: string;
  input: {
    genre: string;
    tempo: number;
    key: string;
    complexity: string;
    duration?: number;
  };
  output_format?: string;
}

export interface ElevenLabsGenerationResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  audio_url?: string;
  duration?: number;
  error?: string;
}

export interface ElevenLabsTaskStatusResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  audio_url?: string;
  error?: string;
}

// OpenAI API
export interface OpenAITranscriptionRequest {
  file: File;
  model: string;
  response_format?: string;
  temperature?: number;
}

export interface OpenAITranscriptionResponse {
  text: string;
  task: string;
  language: string;
  duration: number;
}

export interface OpenAIAudioGenerationRequest {
  model: string;
  input: string;
  voice: string;
  response_format?: string;
  speed?: number;
}

// Pinata API
export interface PinataMetadata {
  name: string;
  keyvalues: Record<string, string>;
}

export interface PinataOptions {
  cidVersion: number;
  wrapWithDirectory: boolean;
}

export interface PinataPinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface PinataPinListResponse {
  count: number;
  rows: {
    id: string;
    ipfs_pin_hash: string;
    size: number;
    user_id: string;
    date_pinned: string;
    date_unpinned: string | null;
    metadata: PinataMetadata;
  }[];
}

// Payment API
export interface PaymentSessionRequest {
  amount: string;
  description: string;
  walletAddress: string;
}

export interface PaymentSessionResponse {
  sessionId: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  paymentUrl?: string;
}

export interface PaymentTransactionRequest {
  recipientId: string;
  amount: string;
  remixId: string;
  senderAddress: string;
}

export interface PaymentTransactionResponse {
  transactionId: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  txHash?: string;
}

// Internal API
export interface StemSeparationRequest {
  audioFile: File;
  userId?: string;
}

export interface StemSeparationResponse {
  stems: {
    id: string;
    name: string;
    type: 'vocals' | 'drums' | 'bass' | 'other';
    url: string;
    duration: number;
  }[];
  originalFileName: string;
}

export interface BeatGenerationRequest {
  genre: string;
  tempo: number;
  key: string;
  complexity: 'simple' | 'medium' | 'complex';
  userId?: string;
}

export interface BeatGenerationResponse {
  beatUrl: string;
  duration: number;
  genre: string;
  tempo: number;
}

export interface RemixUploadRequest {
  audioFile: File;
  title: string;
  description: string;
  stemsInfo: string[];
  userId: string;
  username: string;
}

export interface RemixUploadResponse {
  remixId: string;
  userId: string;
  title: string;
  description: string;
  audioUrl: string;
  stemsInfo: string[];
  createdAt: string;
  communityTips: number;
  username: string;
}

export interface RemixListResponse {
  remixes: {
    remixId: string;
    userId: string;
    title: string;
    description: string;
    audioUrl: string;
    stemsInfo: string[];
    createdAt: string;
    communityTips: number;
    username: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}

