import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCallback } from 'react';

interface UseEVMWalletReturn {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  chainId: number | undefined;
}

export const useEVMWallet = (): UseEVMWalletReturn => {
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = useCallback(async () => {
    try {
      // The Web3Modal will handle the connection UI
      // This is triggered by the w3m-button component
      console.log('EVM wallet connection initiated');
    } catch (error) {
      console.error('Failed to connect EVM wallet:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return {
    isConnected,
    address: address || null,
    connectWallet,
    disconnectWallet,
    isLoading: isPending,
    chainId,
  };
};
