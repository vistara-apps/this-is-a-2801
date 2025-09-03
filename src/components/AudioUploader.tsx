import React, { useState, useRef } from 'react';
import { Upload, Music, X, FileAudio, Loader } from 'lucide-react';
import { AudioStem } from '../types';
import { useAuth } from '../hooks/useAuth';
import PaymentModal from './PaymentModal';

interface AudioUploaderProps {
  onStemsGenerated: (audioFile: File) => Promise<AudioStem[] | null>;
  variant?: 'basic' | 'withProgress';
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  onStemsGenerated,
  variant = 'basic',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedFile) return;
    
    setShowPaymentModal(false);
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Process stem separation
      await onStemsGenerated(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setError('Failed to process audio file');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Basic variant (just file upload)
  if (variant === 'basic') {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">Upload Audio</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 ${
              selectedFile ? 'border-primary-500 bg-primary-500/10' : 'border-white/20 hover:border-white/40'
            } transition-colors duration-200`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-8 h-8 text-primary-500" />
                  <div className="text-left">
                    <p className="text-white font-medium truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={clearSelectedFile}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-white/70" />
                </div>
                
                <div>
                  <p className="text-white font-medium">
                    Drag & drop your audio file
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    or click to browse (MP3, WAV, M4A)
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              className="hidden"
              id="audio-upload"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <div>
            {selectedFile ? (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    <span>Separate Stems</span>
                  </>
                )}
              </button>
            ) : (
              <label
                htmlFor="audio-upload"
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select Audio File</span>
              </label>
            )}
          </div>
        </div>
        
        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount="5 USDC"
          serviceName="AI Stem Separation"
          onSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  // WithProgress variant (file upload with progress bar)
  return (
    <div className="glass-card rounded-lg p-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Upload Audio</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 ${
            selectedFile ? 'border-primary-500 bg-primary-500/10' : 'border-white/20 hover:border-white/40'
          } transition-colors duration-200`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-8 h-8 text-primary-500" />
                  <div className="text-left">
                    <p className="text-white font-medium truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={clearSelectedFile}
                  className="text-white/60 hover:text-white"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-sm">
                    {uploadProgress < 100 ? 'Processing...' : 'Complete!'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-white/70" />
              </div>
              
              <div>
                <p className="text-white font-medium">
                  Drag & drop your audio file
                </p>
                <p className="text-white/60 text-sm mt-1">
                  or click to browse (MP3, WAV, M4A)
                </p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
            id="audio-upload-progress"
          />
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <div>
          {selectedFile ? (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
            >
              {isUploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>Separate Stems</span>
                </>
              )}
            </button>
          ) : (
            <label
              htmlFor="audio-upload-progress"
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Select Audio File</span>
            </label>
          )}
        </div>
        
        <p className="text-white/50 text-xs">
          Stem separation requires a one-time payment of 5 USDC
        </p>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount="5 USDC"
        serviceName="AI Stem Separation"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AudioUploader;

