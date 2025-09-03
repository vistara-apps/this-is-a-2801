import React, { useState } from 'react';
import { X, CreditCard, Wallet, Check, Loader } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useAuth } from '../hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  serviceName: string;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  serviceName,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createSession, isWalletConnected } = usePaymentContext();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!isWalletConnected) {
      setError('Please connect your wallet to make a payment');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await createSession(amount, `Beat Weaver - ${serviceName}`);
      setIsComplete(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          disabled={isProcessing}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {isComplete ? (
              <Check className="w-6 h-6 text-white" />
            ) : (
              <CreditCard className="w-6 h-6 text-white" />
            )}
          </div>
          
          <h2 className="text-xl font-bold text-white">
            {isComplete ? 'Payment Complete' : 'Payment Required'}
          </h2>
          
          <p className="text-white/70 text-sm mt-1">
            {isComplete 
              ? `Thank you for your payment of ${amount}` 
              : `${serviceName} requires a payment of ${amount}`}
          </p>
        </div>
        
        {!isComplete && (
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{serviceName}</p>
                <p className="text-white/60 text-sm">One-time payment</p>
              </div>
              <p className="text-white font-bold">{amount}</p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Pay with Wallet</span>
                </>
              )}
            </button>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <p className="text-white/50 text-xs text-center">
              Payments are processed securely on the Base blockchain
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

