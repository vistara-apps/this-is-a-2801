# Beat Weaver Internal API Documentation

## Overview

This document describes the internal API structure of the Beat Weaver application, including service interfaces, data models, and component interactions.

## Data Models

### User

Represents a user of the application.

```typescript
interface User {
  userId: string;
  username: string;
  walletAddress?: string;
  createdAt: Date;
}
```

### Remix

Represents a music remix created by a user.

```typescript
interface Remix {
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
```

### StemUpload

Represents a stem separation upload.

```typescript
interface StemUpload {
  stemUploadId: string;
  userId: string;
  originalFileUrl: string;
  separatedStems: string[];
  uploadTimestamp: Date;
}
```

### AudioStem

Represents an individual audio stem.

```typescript
interface AudioStem {
  id: string;
  name: string;
  type: 'vocals' | 'drums' | 'bass' | 'other';
  url: string;
  duration: number;
}
```

### BeatParams

Parameters for generating a beat.

```typescript
interface BeatParams {
  genre: string;
  tempo: number;
  key: string;
  complexity: 'simple' | 'medium' | 'complex';
}
```

## Service Interfaces

### Audio Service

Handles audio processing, including stem separation and beat generation.

```typescript
// Separate stems from an audio file
function separateStems(audioFile: File): Promise<AudioStem[]>;

// Generate a beat based on parameters
function generateBeat(params: BeatParams): Promise<string>;

// Upload stems to storage
function uploadStems(originalFile: File, stems: AudioStem[], userId: string): Promise<StemUpload>;

// Upload a remix to storage
function uploadRemix(audioFile: File, remixData: Partial<Remix>): Promise<Remix>;

// Get community remixes
function getCommunityRemixes(): Promise<Remix[]>;

// Get a remix by ID
function getRemixById(remixId: string): Promise<Remix | null>;
```

### Payment Service

Handles payment processing and tipping.

```typescript
// Create a payment session
function createPaymentSession(amount: string, description: string, walletClient: any): Promise<PaymentSessionResponse>;

// Send a tip to a creator
function sendTip(recipientId: string, amount: string, remixId: string, walletClient: any): Promise<PaymentTransactionResponse>;

// Get transaction history for a user
function getTransactionHistory(userId: string, walletClient: any): Promise<PaymentTransactionResponse[]>;
```

### Pinata Service

Handles decentralized storage using IPFS via Pinata.

```typescript
// Upload a file to IPFS
function uploadFileToPinata(file: File, metadata?: Record<string, any>): Promise<string>;

// Upload a remix to IPFS
function uploadRemixToPinata(audioFile: File, remixData: Partial<Remix>): Promise<string>;

// Upload stems to IPFS
function uploadStemsToPinata(originalFile: File, stemFiles: File[], userId: string): Promise<string>;

// Get the gateway URL for an IPFS hash
function getIpfsGatewayUrl(ipfsHash: string): string;
```

## Context Providers

### UserContext

Manages user authentication and profile data.

```typescript
interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}
```

### ErrorContext

Manages application-wide error handling.

```typescript
interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}
```

## Custom Hooks

### useAuth

Provides authentication functionality.

```typescript
function useAuth() {
  // User authentication state and methods
  return {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string) => Promise<boolean>;
    logout: () => void;
    connectWallet: () => Promise<void>;
    authModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    walletAddress: string | undefined;
    isWalletConnected: boolean;
  };
}
```

### usePaymentContext

Provides payment functionality.

```typescript
function usePaymentContext() {
  // Payment state and methods
  return {
    createSession: (amount: string, description?: string) => Promise<PaymentSessionResponse>;
    sendTipToCreator: (recipientId: string, amount: string, remixId: string) => Promise<PaymentTransactionResponse>;
    lastPaymentSession: PaymentSessionResponse | null;
    lastTransaction: PaymentTransactionResponse | null;
    isProcessing: boolean;
    error: string | null;
    isWalletConnected: boolean;
    walletAddress: string | undefined;
  };
}
```

### useAudioProcessing

Provides audio processing functionality.

```typescript
function useAudioProcessing() {
  // Audio processing state and methods
  return {
    isProcessingStems: boolean;
    isGeneratingBeat: boolean;
    stems: AudioStem[];
    generatedBeat: string | null;
    error: string | null;
    progress: number;
    processStemSeparation: (audioFile: File) => Promise<AudioStem[] | null>;
    processBeatGeneration: (params: BeatParams) => Promise<string | null>;
    clearStems: () => void;
    clearGeneratedBeat: () => void;
  };
}
```

### useCommunity

Provides community functionality.

```typescript
function useCommunity() {
  // Community state and methods
  return {
    remixes: Remix[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: 'newest' | 'popular' | 'tips';
    setSortBy: (sort: 'newest' | 'popular' | 'tips') => void;
    loadRemixes: () => Promise<void>;
    getRemix: (remixId: string) => Promise<Remix | null>;
    shareRemix: (audioFile: File, title: string, description: string, stemsInfo: string[]) => Promise<Remix>;
    updateRemix: (updatedRemix: Remix) => void;
  };
}
```

### useErrorHandler

Provides error handling functionality.

```typescript
function useErrorHandler() {
  // Error handling methods
  return {
    handleError: (error: unknown) => void;
    handleApiError: (error: unknown, fallbackMessage?: string) => void;
    clearError: () => void;
  };
}
```

## Component Interfaces

### AudioUploader

```typescript
interface AudioUploaderProps {
  onStemsGenerated: (stems: AudioStem[]) => void;
  variant?: 'basic' | 'withProgress';
}
```

### StemsViewer

```typescript
interface StemsViewerProps {
  stems: AudioStem[];
  variant?: 'preview' | 'download';
}
```

### BeatGeneratorForm

```typescript
interface BeatGeneratorFormProps {
  onBeatGenerated: (beatUrl: string) => void;
  variant?: 'genreSelector' | 'parameterControls';
}
```

### RemixCard

```typescript
interface RemixCardProps {
  remix: Remix;
  variant?: 'withPlay' | 'withTipButton';
}
```

### TipButton

```typescript
interface TipButtonProps {
  recipientId: string;
  remixId: string;
  amount: string;
  variant?: 'small' | 'medium' | 'large';
  onSuccess?: () => void;
}
```

### AudioPlayer

```typescript
interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  variant?: 'minimal' | 'standard' | 'waveform';
  onPlay?: () => void;
  onPause?: () => void;
}
```

## API Flow Examples

### Stem Separation Flow

1. User uploads an audio file via `AudioUploader`
2. `useAudioProcessing.processStemSeparation` is called
3. `audioService.separateStems` processes the file using OpenAI API
4. Separated stems are returned and displayed in `StemsViewer`
5. If user is authenticated, stems are uploaded to IPFS via `pinataService.uploadStemsToPinata`

### Beat Generation Flow

1. User configures beat parameters in `BeatGeneratorForm`
2. User pays for the service via `usePaymentContext.createSession`
3. `useAudioProcessing.processBeatGeneration` is called
4. `audioService.generateBeat` generates a beat using Eleven Labs API
5. Generated beat is returned and played in `AudioPlayer`

### Remix Sharing Flow

1. User creates a remix using separated stems and generated beat
2. User provides title, description, and other metadata
3. `useCommunity.shareRemix` is called
4. Remix is uploaded to IPFS via `pinataService.uploadRemixToPinata`
5. Remix is added to the community hub and displayed in `CommunityHub`

### Tipping Flow

1. User views a remix in `CommunityHub`
2. User clicks a tip button on `RemixCard`
3. `TipButton` component calls `usePaymentContext.sendTipToCreator`
4. Tip transaction is processed on the Base blockchain
5. Remix's `communityTips` value is updated

