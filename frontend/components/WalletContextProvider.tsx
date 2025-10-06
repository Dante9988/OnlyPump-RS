'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  CloverWalletAdapter,
  AlphaWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC endpoint from environment variables if available
    const customRpcUrl = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    if (customRpcUrl) return customRpcUrl;

    // Use environment variable for RPC endpoint
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=270884b0-cb80-4b6d-8a2f-372de3c6774e';
  }, []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // so that only the wallets you configure are included in your bundle
  const wallets = useMemo(() => {
    // Only create wallets on client side to avoid SSR issues
    if (typeof window === 'undefined') {
      return [];
    }

    const walletList = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new CloverWalletAdapter(),
      new AlphaWalletAdapter(),
    ].filter((wallet, index, self) => index === self.findIndex((w) => w.name === wallet.name));

    console.log(
      'Available wallets:',
      walletList.map((w) => w.name)
    );
    return walletList;
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={false}
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
        localStorageKey="wallet-adapter"
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
