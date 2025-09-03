import { useCallback } from 'react';
import { useError } from '../contexts/ErrorContext';

export function useErrorHandler() {
  const { setError, clearError } = useError();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('An unknown error occurred');
    }
    
    console.error('Error handled:', error);
  }, [setError]);

  const handleApiError = useCallback((error: unknown, fallbackMessage: string = 'API request failed') => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(fallbackMessage);
    }
    
    console.error('API error handled:', error);
  }, [setError]);

  return {
    handleError,
    handleApiError,
    clearError,
  };
}

