export type BlockchainType = 'hedera' | 'evm';

export interface BlockchainConfig {
  type: BlockchainType;
  name: string;
  icon: string;
  description: string;
}

export const SUPPORTED_BLOCKCHAINS: BlockchainConfig[] = [
  {
    type: 'hedera',
    name: 'Hedera',
    icon: '🔷',
    description: 'Fast, secure, and sustainable',
  },
  {
    type: 'evm',
    name: 'Ethereum',
    icon: '⟠',
    description: 'EVM-compatible chains',
  },
];
