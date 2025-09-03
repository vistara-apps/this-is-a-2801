import { useWalletClient } from "wagmi";
import { useCallback, useState } from "react";
import { createPaymentSession, sendTip } from "../services/paymentService";
import { PaymentSessionResponse, PaymentTransactionResponse } from "../types/api";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [lastPaymentSession, setLastPaymentSession] = useState<PaymentSessionResponse | null>(null);
  const [lastTransaction, setLastTransaction] = useState<PaymentTransactionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (amount: string, description: string = "Beat Weaver service") => {
    if (!walletClient || !walletClient.account) throw new Error("Please connect your wallet");
    if (isError) throw new Error("Wallet not connected");
    if (isLoading) throw new Error("Wallet is loading");
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const session = await createPaymentSession(amount, description, walletClient);
      setLastPaymentSession(session);
      setIsProcessing(false);
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      setIsProcessing(false);
      throw err;
    }
  }, [walletClient, isError, isLoading]);

  const sendTipToCreator = useCallback(async (
    recipientId: string,
    amount: string,
    remixId: string
  ) => {
    if (!walletClient || !walletClient.account) throw new Error("Please connect your wallet");
    if (isError) throw new Error("Wallet not connected");
    if (isLoading) throw new Error("Wallet is loading");
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const transaction = await sendTip(recipientId, amount, remixId, walletClient);
      setLastTransaction(transaction);
      setIsProcessing(false);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Tip failed";
      setError(errorMessage);
      setIsProcessing(false);
      throw err;
    }
  }, [walletClient, isError, isLoading]);

  return { 
    createSession,
    sendTipToCreator,
    lastPaymentSession,
    lastTransaction,
    isProcessing,
    error,
    isWalletConnected: !!walletClient && !!walletClient.account,
    walletAddress: walletClient?.account?.address
  };
}

