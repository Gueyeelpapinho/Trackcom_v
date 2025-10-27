import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export const BlockchainStatus = () => {
  const { walletConnected, walletAddress } = useApp();

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Hedera Blockchain Status
          {walletConnected ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>
          Connection and traceability status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <Badge variant="outline" className="bg-primary/10">
              Hedera Testnet
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Wallet</span>
            {walletConnected ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not connected
              </Badge>
            )}
          </div>

          {walletAddress && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Account address</span>
              <code className="text-xs font-mono bg-muted/50 p-2 rounded border border-border/50 break-all">
                {walletAddress}
              </code>
            </div>
          )}

          <div className="pt-2 border-t border-border/50 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Traceability</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                All components are registered as NFTs
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Every event is recorded on HCS
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Immutable and verifiable history
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
