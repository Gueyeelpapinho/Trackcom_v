import { useState, useEffect, useCallback } from 'react';
import { HashConnect, SessionData } from 'hashconnect';
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

let hashconnect: HashConnect | null = null;

export const useHashConnect = (): UseHashConnectReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pairingString, setPairingString] = useState<string>('');

  // Initialize HashConnect
  useEffect(() => {
    const initHashConnect = async () => {
      try {
        if (!hashconnect) {
          console.log('Initializing HashConnect...');
          
          hashconnect = new HashConnect(
            LedgerId.TESTNET,
            HEDERA_CONFIG.appMetadata.projectId || 'iss-tracker',
            HEDERA_CONFIG.appMetadata,
            true
          );

          // Initialize connection
          await hashconnect.init();
          console.log('HashConnect initialized successfully');

          // Get pairing string for connection
          const pairing = hashconnect.pairingString;
          setPairingString(pairing);
          console.log('Pairing string ready:', pairing);

          // Set up pairing event listener
          hashconnect.pairingEvent.on((data: SessionData) => {
            console.log('Pairing event received:', data);
            const accountIds = data.accountIds;
            if (accountIds && accountIds.length > 0) {
              const account = accountIds[0];
              console.log('Connected to account:', account);
              setAccountId(account);
              setIsConnected(true);
              setError(null);
              setIsLoading(false);
              localStorage.setItem('hederaAccountId', account);
            }
          });

          // Set up disconnect event listener
          hashconnect.disconnectionEvent.on(() => {
            console.log('Wallet disconnected');
            setIsConnected(false);
            setAccountId(null);
            setIsLoading(false);
            localStorage.removeItem('hederaAccountId');
          });

          // Check for existing connection
          const savedAccountId = localStorage.getItem('hederaAccountId');
          if (savedAccountId) {
            console.log('Found saved account, will reconnect if still valid:', savedAccountId);
            setAccountId(savedAccountId);
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error('Failed to initialize HashConnect:', err);
        setError('Failed to initialize wallet connection. Please refresh the page.');
      }
    };

    initHashConnect();
  }, []);

  const connectWallet = useCallback(async () => {
    if (!hashconnect) {
      setError('HashConnect not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Opening HashPack pairing modal...');
      hashconnect.openPairingModal();
    } catch (err: any) {
      console.error('Failed to open pairing modal:', err);
      setError(err.message || 'Failed to connect wallet. Please install HashPack extension.');
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    if (hashconnect) {
      try {
        console.log('Disconnecting wallet...');
        hashconnect.disconnect();
        setIsConnected(false);
        setAccountId(null);
        localStorage.removeItem('hederaAccountId');
      } catch (err) {
        console.error('Failed to disconnect:', err);
      }
    }
  }, []);

  return {
    isConnected,
    accountId,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  };
};
