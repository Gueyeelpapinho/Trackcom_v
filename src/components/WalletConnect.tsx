import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const WalletConnect = () => {
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.info('Wallet disconnected');
  };

  if (walletConnected && walletAddress) {
    const shortAddress = `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`;
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <div className="flex flex-col">
            <p className="text-xs font-medium text-muted-foreground">Connected</p>
            <p className="text-sm font-mono font-semibold text-foreground" title={walletAddress}>
              {shortAddress}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2 bg-gradient-mission hover:opacity-90"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
