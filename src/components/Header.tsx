import { WalletConnect } from './WalletConnect';
import { Satellite } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-2 rounded-lg bg-gradient-mission group-hover:animate-pulse-glow">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ISS Component Tracker
              </h1>
              <p className="text-xs text-muted-foreground">
                Hedera Blockchain Integration
              </p>
            </div>
          </div>

          <WalletConnect />
        </div>
      </div>
    </header>
  );
};
