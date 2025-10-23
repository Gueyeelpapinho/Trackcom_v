import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useHashConnect } from '@/hooks/useHashConnect';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { BlockchainType } from '@/lib/blockchain/types';

interface BlockchainContextType {
  selectedBlockchain: BlockchainType;
  setSelectedBlockchain: (type: BlockchainType) => void;
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>('hedera');

  // Hedera hooks
  const hedera = useHashConnect();
  
  // EVM hooks
  const evm = useEVMWallet();

  // Select the active blockchain's state
  const activeWallet = selectedBlockchain === 'hedera' ? hedera : evm;

  const connectWallet = async () => {
    if (selectedBlockchain === 'hedera') {
      await hedera.connectWallet();
    } else {
      await evm.connectWallet();
    }
  };

  const disconnectWallet = () => {
    if (selectedBlockchain === 'hedera') {
      hedera.disconnectWallet();
    } else {
      evm.disconnectWallet();
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        selectedBlockchain,
        setSelectedBlockchain,
        isConnected: activeWallet.isConnected,
        walletAddress: selectedBlockchain === 'hedera' ? hedera.accountId : evm.address,
        connectWallet,
        disconnectWallet,
        isLoading: activeWallet.isLoading,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
