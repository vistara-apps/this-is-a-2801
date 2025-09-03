import React, { useState } from 'react';
import { DollarSign, Loader } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useAuth } from '../hooks/useAuth';

interface TipButtonProps {
  recipientId: string;
  remixId: string;
  amount: string;
  variant?: 'small' | 'medium' | 'large';
  onSuccess?: () => void;
}

const TipButton: React.FC<TipButtonProps> = ({
  recipientId,
  remixId,
  amount,
  variant = 'medium',
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendTipToCreator, isWalletConnected } = usePaymentContext();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleTip = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!isWalletConnected) {
      setError('Please connect your wallet to send tips');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendTipToCreator(recipientId, amount, remixId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Tip failed:', err);
      setError('Failed to send tip');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button size based on variant
  const buttonClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  }[variant];

  return (
    <div>
      <button
        onClick={handleTip}
        disabled={isLoading}
        className={`bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white rounded transition-colors duration-200 flex items-center space-x-1 ${buttonClasses}`}
      >
        {isLoading ? (
          <Loader className="w-3 h-3 animate-spin" />
        ) : (
          <DollarSign className="w-3 h-3" />
        )}
        <span>{amount}</span>
      </button>
      
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default TipButton;

