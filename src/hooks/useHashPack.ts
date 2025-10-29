import { useState, useEffect, useCallback } from 'react';

// HashPack extension interface
interface HashPackExtension {
  connectToLocalWallet: () => Promise<{ accountIds: string[] }>;
  disconnect: () => void;
  isExtensionActive: () => boolean;
}

declare global {
  interface Window {
    hashpack?: HashPackExtension;
  }
}

export const useHashPack = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if HashPack extension is available
    const checkHashPack = () => {
      if (window.hashpack?.isExtensionActive()) {
        setIsAvailable(true);
      }
    };

    checkHashPack();
    
    // Check again after a delay in case extension is loading
    const timer = setTimeout(checkHashPack, 1000);

    // Check for existing connection
    const savedAccountId = localStorage.getItem('hederaAccountId');
    if (savedAccountId) {
      setAccountId(savedAccountId);
      setIsConnected(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const connect = useCallback(async () => {
    if (!window.hashpack) {
      throw new Error('HashPack extension not found. Please install HashPack wallet.');
    }

    try {
      const result = await window.hashpack.connectToLocalWallet();
      
      if (result.accountIds && result.accountIds.length > 0) {
        const connectedAccountId = result.accountIds[0];
        setAccountId(connectedAccountId);
        setIsConnected(true);
        localStorage.setItem('hederaAccountId', connectedAccountId);
      }
    } catch (error) {
      console.error('Failed to connect to HashPack:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (window.hashpack) {
      window.hashpack.disconnect();
    }
    setAccountId(null);
    setIsConnected(false);
    localStorage.removeItem('hederaAccountId');
  }, []);

  return {
    isConnected,
    accountId,
    connect,
    disconnect,
    isAvailable,
  };
};
