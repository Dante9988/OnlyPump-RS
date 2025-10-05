'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { usePumpFunRedux } from '@/lib/hooks/usePumpFunRedux';

export default function Home() {
  const { connected, publicKey } = useWallet();
  const { pumpAddressStats, initConnection, loadPumpAddresses } = usePumpFunRedux();

  // Initialize Redux state
  useEffect(() => {
    const loadData = async () => {
      try {
        await initConnection();
        await loadPumpAddresses();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [initConnection, loadPumpAddresses]);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero section */}
        <div className="py-12 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            OnlyPump
          </h1>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Create, trade, and discover meme coins on Solana with vanity addresses ending in "pump"
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!connected ? (
              <WalletMultiButton className="btn btn-primary btn-lg" />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create" className="btn btn-primary btn-lg">
                  Create Token
                </Link>
                <div className="text-sm text-base-content/70">
                  Connected: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vanity Stats */}
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-4">Vanity Address Pool</h2>
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Available Addresses</div>
                <div className="stat-value text-primary">{pumpAddressStats.pool_size}</div>
                <div className="stat-desc">ending with "{pumpAddressStats.suffix}"</div>
              </div>
              <div className="stat">
                <div className="stat-title">Suffix</div>
                <div className="stat-value text-secondary">{pumpAddressStats.suffix}</div>
                <div className="stat-desc">vanity addresses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="card-title justify-center">Create Tokens</h3>
              <p className="text-sm opacity-70">
                Launch your own token with vanity addresses ending in "pump" in minutes
              </p>
              <div className="card-actions justify-center mt-4">
                <Link href="/create" className="btn btn-primary">
                  Create Now
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="card-title justify-center">Buy & Sell</h3>
              <p className="text-sm opacity-70">
                Trade tokens directly with integrated buy/sell functionality
              </p>
              <div className="card-actions justify-center mt-4">
                <Link href="/create" className="btn btn-outline">
                  Start Trading
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="card-title justify-center">Fast & Secure</h3>
              <p className="text-sm opacity-70">
                Built on Solana for fast transactions and low fees
              </p>
              <div className="card-actions justify-center mt-4">
                <span className="text-xs opacity-50">Powered by Solana</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-base-content/70 text-center">
                Connect your Solana wallet to get started
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Token</h3>
              <p className="text-base-content/70 text-center">
                Fill in token details and get a vanity address ending in "pump"
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade</h3>
              <p className="text-base-content/70 text-center">
                Buy your own tokens or trade with others
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}