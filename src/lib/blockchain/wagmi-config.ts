import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, polygon, arbitrum, base, sepolia } from 'wagmi/chains';

// Get projectId from environment or use a default for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const metadata = {
  name: 'ISS Component Tracker',
  description: 'Secure tracking system for ISS critical components',
  url: window.location.origin,
  icons: ['https://iss-sts.lovable.app/favicon.ico'],
};

const chains = [mainnet, polygon, arbitrum, base, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});
