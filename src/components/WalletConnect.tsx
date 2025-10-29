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
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs font-mono text-primary">{walletAddress}</p>
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
