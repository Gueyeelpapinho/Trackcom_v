import { useState, useEffect, useCallback } from 'react';
import { HashConnect } from 'hashconnect';
import { LedgerId } from '@hashgraph/sdk';
import { HEDERA_CONFIG } from '@/lib/hedera/config';

interface UseHashConnectReturn {
  isConnected: boolean;
  accountId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
}

let hashconnect: any = null;

export const useHashConnect = (): UseHashConnectReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');

  // Initialize HashConnect
  useEffect(() => {
    const initHashConnect = async () => {
      try {
        if (!hashconnect) {
          const ledgerId = LedgerId.fromString('testnet');
          hashconnect = new HashConnect(
            ledgerId,
            HEDERA_CONFIG.appMetadata.url,
            HEDERA_CONFIG.appMetadata,
            true // multiAccount
          );

          // Set up pairing event listener
          if (hashconnect.pairingEvent) {
            hashconnect.pairingEvent.on((pairingData: any) => {
              console.log('Pairing event:', pairingData);
              if (pairingData.accountIds && pairingData.accountIds.length > 0) {
                setAccountId(pairingData.accountIds[0]);
                setIsConnected(true);
                setError(null);
                localStorage.setItem('hederaAccountId', pairingData.accountIds[0]);
              }
              if (pairingData.topic) {
                setTopic(pairingData.topic);
              }
            });
          }

          // Set up disconnect event listener
          if (hashconnect.disconnectionEvent) {
            hashconnect.disconnectionEvent.on(() => {
              console.log('Disconnected from wallet');
              setIsConnected(false);
              setAccountId(null);
              localStorage.removeItem('hederaAccountId');
            });
          }

          // Check for existing pairing
          const savedAccountId = localStorage.getItem('hederaAccountId');
          if (savedAccountId) {
            setAccountId(savedAccountId);
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error('Failed to initialize HashConnect:', err);
        setError('Failed to initialize wallet connection');
      }
    };

    initHashConnect();

    return () => {
      // Cleanup handled by HashConnect internally
    };
  }, []);

  const connectWallet = useCallback(async () => {
    if (!hashconnect) {
      setError('HashConnect not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialize and pair with wallet
      const initData = await hashconnect.init(
        HEDERA_CONFIG.appMetadata,
        HEDERA_CONFIG.hashConnectNetwork,
        false
      );
      
      setTopic(initData.topic);
      
      // Open pairing modal
      if (hashconnect.openPairingModal) {
        hashconnect.openPairingModal();
      } else if (hashconnect.connectToLocalWallet) {
        await hashconnect.connectToLocalWallet();
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please install HashPack wallet extension.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    if (hashconnect && topic) {
      try {
        hashconnect.disconnect(topic);
      } catch (err) {
        console.error('Failed to disconnect:', err);
      }
    }
    setIsConnected(false);
    setAccountId(null);
    localStorage.removeItem('hederaAccountId');
  }, [topic]);

  return {
    isConnected,
    accountId,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  };
};
