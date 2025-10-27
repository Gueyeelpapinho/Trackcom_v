// Hedera Network Configuration
export const HEDERA_CONFIG = {
  // Use testnet for development
  network: 'testnet' as const,
  
  // Mirror node URLs
  mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
  
  // HashConnect metadata
  appMetadata: {
    name: 'ISS Component Tracker',
    description: 'Secure tracking system for ISS critical components using Hedera NFTs',
    projectId: 'iss-component-tracker',
    icon: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://iss-sts.lovable.app/favicon.ico',
    icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://iss-sts.lovable.app/favicon.ico'],
    url: typeof window !== 'undefined' ? window.location.origin : 'https://iss-sts.lovable.app',
  },
  
  // Network for HashConnect
  hashConnectNetwork: 'testnet',
  
  // Smart contract ID (to be configured after deployment)
  contractId: import.meta.env.VITE_HEDERA_CONTRACT_ID || '',
};

export type HederaNetwork = typeof HEDERA_CONFIG.network;
