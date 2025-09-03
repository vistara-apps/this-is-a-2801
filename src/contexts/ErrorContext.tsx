import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const value = {
    error,
    setError,
    clearError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="glass-card bg-red-500/20 border border-red-500/30 rounded-lg p-4 mx-4 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            
            <div className="ml-3 flex-1">
              <p className="text-white text-sm font-medium">Error</p>
              <p className="text-white/80 text-sm">{error}</p>
            </div>
            
            <button
              onClick={clearError}
              className="text-white/70 hover:text-white ml-4 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
};

