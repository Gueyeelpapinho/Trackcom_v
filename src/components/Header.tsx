import { WalletConnect } from './WalletConnect';
import { useNavigate } from 'react-router-dom';
import trackcomLogo from '@/assets/trackcom-logo.jpg';

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
            <div className="rounded-lg overflow-hidden group-hover:animate-pulse-glow">
              <img src={trackcomLogo} alt="TrackCom Logo" className="h-12 w-12 object-contain" />
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
