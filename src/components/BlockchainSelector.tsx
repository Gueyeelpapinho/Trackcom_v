import { useBlockchain } from '@/contexts/BlockchainContext';
import { SUPPORTED_BLOCKCHAINS } from '@/lib/blockchain/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const BlockchainSelector = () => {
  const { selectedBlockchain, setSelectedBlockchain } = useBlockchain();

  return (
    <Select value={selectedBlockchain} onValueChange={(value: any) => setSelectedBlockchain(value)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
          <SelectItem key={blockchain.type} value={blockchain.type}>
            <div className="flex items-center gap-2">
              <span>{blockchain.icon}</span>
              <span>{blockchain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
