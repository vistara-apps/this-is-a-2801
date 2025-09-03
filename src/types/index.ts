// User model
export interface User {
  userId: string;
  username: string;
  walletAddress?: string;
  createdAt: Date;
}

// Remix model
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

// StemUpload model
export interface StemUpload {
  stemUploadId: string;
  userId: string;
  originalFileUrl: string;
  separatedStems: string[];
  uploadTimestamp: Date;
}

// AudioStem model
export interface AudioStem {
  id: string;
  name: string;
  type: 'vocals' | 'drums' | 'bass' | 'other';
  url: string;
  duration: number;
}

// BeatParams model
export interface BeatParams {
  genre: string;
  tempo: number;
  key: string;
  complexity: 'simple' | 'medium' | 'complex';
}

// Comment model
export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
  remixId: string;
}

// Payment models
export interface PaymentSession {
  sessionId: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface PaymentTransaction {
  transactionId: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  txHash?: string;
}

// Theme types
export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
export type ThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ThemeVariant = 'solid' | 'outline' | 'ghost' | 'link';

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  className?: string;
  onClick?: () => void;
}

export interface InputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

