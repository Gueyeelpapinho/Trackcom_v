import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { config } from './lib/blockchain/wagmi-config';
import App from "./App.tsx";
import "./index.css";
import { AppProvider } from "./contexts/AppContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <BrowserRouter>
          <BlockchainProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </BlockchainProvider>
        </BrowserRouter>
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>
);
