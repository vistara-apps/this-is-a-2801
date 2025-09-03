import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { 
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient();

// Project ID for WalletConnect
const projectId = '9f4bd472c01ba49282b42e5e1874c2af';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base],
  [publicProvider()]
);

// Set up connectors
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, projectId }),
      metaMaskWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: 'Beat Weaver' }),
      walletConnectWallet({ chains, projectId }),
    ],
  },
]);

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
)

