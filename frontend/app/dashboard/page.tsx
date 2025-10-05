'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import { usePumpFunRedux } from '@/lib/hooks/usePumpFunRedux';
import { refreshTokenMetadata } from '@/lib/store/slices/pumpFunSlice';
import { useAppDispatch } from '@/lib/store/hooks';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DeployedToken } from '@/lib/store/slices/pumpFunSlice';

export default function CreatorDashboard() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const reduxDispatch = useAppDispatch();
  const {
    deployedTokens,
    createdTokens,
    isLoadingDeployedTokens,
    fetchDeployedTokens,
    claimFees,
    isLoading,
    connection,
    setSelectedTokenMint,
    fetchCreatorFees,
    initConnection
  } = usePumpFunRedux();

  const [selectedToken, setSelectedToken] = useState<DeployedToken | null>(null);
  const [claimingToken, setClaimingToken] = useState<string | null>(null);
  const [feeData, setFeeData] = useState<{claimed: number, unclaimed: number, total: number}>({claimed: 0, unclaimed: 0, total: 0});
  const [isLoadingFees, setIsLoadingFees] = useState<boolean>(false);

  // Load tokens from localStorage like the tokens page does
  const [allTokens, setAllTokens] = useState<any[]>([]);
  
  const loadTokensFromStorage = useCallback(async () => {
    if (!connected || !publicKey) return;
    
    try {
      const walletAddress = publicKey.toString();
      
      // Step 1: Get tokens from persisted storage
      const persistedTokensJson = localStorage.getItem('persist:pumpfun');
      let persistedTokens: any[] = [];
      
      if (persistedTokensJson) {
        try {
          const persistedData = JSON.parse(persistedTokensJson);
          const createdTokensStr = persistedData.createdTokens || '[]';
          const createdTokens = JSON.parse(createdTokensStr);
          persistedTokens = createdTokens.filter((t: any) => t.creator === walletAddress);
          console.log('Dashboard: Found persisted tokens:', persistedTokens.length);
        } catch (e) {
          console.error('Error parsing persisted tokens:', e);
        }
      }
      
      // Step 2: Fetch transactions from Helius to find all Pump.fun token interactions
      const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'f7c74abc-20d1-450d-b655-64f460fd5856';
      
      let transactionTokens: any[] = [];
      try {
        const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${heliusApiKey}&limit=100`);
        
        if (response.ok) {
          const transactions = await response.json();
          console.log(`Dashboard: Fetched ${transactions.length} transactions from Helius`);
          
          // Extract mint addresses from Pump.fun transactions
          const mintSet = new Set();
          for (const tx of transactions) {
            // Check if it's a Pump.fun interaction
            const isPumpFun = tx.accountData?.some((acc: any) => 
              acc.account === '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
            ) || tx.description?.toLowerCase().includes('pump');
            
            if (isPumpFun && tx.tokenTransfers && tx.tokenTransfers.length > 0) {
              tx.tokenTransfers.forEach((transfer: any) => {
                if (transfer.mint && transfer.mint !== 'So11111111111111111111111111111111111111112') {
                  mintSet.add(transfer.mint);
                }
              });
            }
          }
          
          // Convert mints to token objects
          transactionTokens = Array.from(mintSet).map((mint) => ({
            mint: mint as string,
            name: `Token ${(mint as string).slice(0, 8)}`,
            symbol: (mint as string).slice(0, 4).toUpperCase(),
            createdAt: Date.now(),
            creator: walletAddress
          }));
          
          console.log('Dashboard: Found transaction tokens:', transactionTokens.length);
        }
      } catch (error) {
        console.error('Dashboard: Error fetching Helius transactions:', error);
      }
      
      // Merge and deduplicate
      const tokenMap = new Map();
      [...persistedTokens, ...transactionTokens].forEach(token => {
        tokenMap.set(token.mint, token);
      });
      
      const mergedTokens = Array.from(tokenMap.values()).sort((a, b) => b.createdAt - a.createdAt);
      console.log('Dashboard: Total merged tokens:', mergedTokens.length);
      setAllTokens(mergedTokens);
      
    } catch (error) {
      console.error('Dashboard: Error loading tokens:', error);
    }
  }, [connected, publicKey]);
  
  // Debug logging
  useEffect(() => {
    console.log('Dashboard tokens:', { 
      createdTokens: createdTokens.length, 
      deployedTokens: deployedTokens.length,
      allTokens: allTokens.length 
    });
  }, [createdTokens, deployedTokens, allTokens]);

  // Initialize connection and load data when wallet connects
  useEffect(() => {
    const initializeAndLoad = async () => {
      if (!connected || !publicKey) return;
      
      console.log('Dashboard: Initializing connection and loading data for', publicKey.toString());
      
      try {
        // Initialize connection first
        await initConnection();
        console.log('Dashboard: Connection initialized');
        
        // Load tokens from localStorage and Helius (like tokens page)
        await loadTokensFromStorage();
        console.log('Dashboard: Tokens loaded from storage');
        
        // Also fetch deployed tokens from Redux (as backup)
        await fetchDeployedTokens();
        console.log('Dashboard: Deployed tokens fetched');
      } catch (error) {
        console.error('Dashboard: Error initializing:', error);
      }
    };

    initializeAndLoad();
  }, [connected, publicKey, initConnection, fetchDeployedTokens, loadTokensFromStorage]);

  // Fetch total claimable fees from the creator fee account
  useEffect(() => {
      const fetchTotalFees = async () => {
        if (!connected || !publicKey || !connection) {
          console.log('Dashboard: Not ready for fee fetching', { connected, publicKey: !!publicKey, connection: !!connection });
          setFeeData({claimed: 0, unclaimed: 0, total: 0});
          return;
        }

        console.log('Dashboard: Fetching creator fees...');
        setIsLoadingFees(true);
        try {
          const fees = await fetchCreatorFees();
          console.log(`Creator fees data:`, fees);
          setFeeData(fees);
        } catch (error) {
          console.error('Error fetching creator fees:', error);
          setFeeData({claimed: 0, unclaimed: 0, total: 0});
        } finally {
          setIsLoadingFees(false);
        }
      };

    // Wait a bit for connection to be ready
    const timeoutId = setTimeout(fetchTotalFees, 1000);
    
    // Refresh fees every 10 seconds
    const interval = setInterval(fetchTotalFees, 10000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [connected, publicKey, connection, fetchCreatorFees]);

  // Handle claim ALL fees (Pump.fun claims all creator fees at once, not per token)
  const handleClaimFees = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent row click if called from token row
    
    if (!connection) {
      toast.error('Connection not ready. Please wait a moment.');
      return;
    }

    if (feeData.unclaimed === 0) {
      toast.error('No fees available to claim');
      return;
    }

    setClaimingToken('claiming');
    const loadingToast = toast.loading(`Claiming ${feeData.unclaimed.toFixed(4)} SOL in creator fees...`);

    try {
      // Note: claimFees collects ALL creator fees, not per token
      const result = await claimFees();
      toast.dismiss(loadingToast);
      toast.success(`✅ ${feeData.unclaimed.toFixed(4)} SOL claimed! TX: ${result.signature.slice(0, 8)}...`);
      
      // Refresh fees after successful claim
      setTimeout(async () => {
        const fees = await fetchCreatorFees();
        setFeeData(fees);
      }, 2000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to claim fees');
    } finally {
      setClaimingToken(null);
    }
  };

  // Handle token click - set as active and navigate to trading page
  const handleTokenClick = (token: DeployedToken | any) => {
    setSelectedTokenMint(token.mint);
    toast.success(`Selected ${token.symbol} for trading`);
    router.push('/create-seamless');
  };


  // Calculate total tokens created
  const totalTokens = allTokens.length;
  
  // Calculate tokens created in last 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentTokens = allTokens.filter(t => t.createdAt > thirtyDaysAgo).length;

  if (!connected) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="card bg-base-100 shadow-2xl border border-base-300">
              <div className="card-body text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Creator Dashboard</h2>
                <p className="text-base-content/70 mb-8">
                  Connect your wallet to view your earnings and manage your tokens
                </p>
                <WalletMultiButton className="btn btn-primary btn-lg w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-lg text-base-content/70">
                Claim your earnings from token trades
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const loadingToast = toast.loading('Refreshing...');
                  Promise.all([
                    loadTokensFromStorage(),
                    fetchDeployedTokens(),
                    fetchCreatorFees()
                  ]).then(([_, __, fees]) => {
                    setFeeData(fees);
                    toast.dismiss(loadingToast);
                    toast.success('Refreshed!');
                  }).catch((error) => {
                    toast.dismiss(loadingToast);
                    toast.error('Failed to refresh');
                    console.error(error);
                  });
                }}
                className="btn btn-ghost btn-sm"
                disabled={isLoadingDeployedTokens || isLoadingFees}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link href="/create-seamless" className="btn btn-primary btn-sm">
                Create Token
              </Link>
              <WalletMultiButton />
            </div>
          </div>

          {/* Main Earnings Card - Prominent and Simple */}
          <div className="card bg-gradient-to-br from-success/90 to-success text-white shadow-2xl mb-8">
            <div className="card-body p-12 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold opacity-90 mb-3">Creator Fees</h2>
                {isLoadingFees ? (
                  <div className="flex justify-center items-center gap-4 mb-2">
                    <span className="loading loading-spinner loading-lg"></span>
                    <span className="text-xl">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-7xl font-bold mb-3">
                      {feeData.total.toFixed(4)} <span className="text-5xl">SOL</span>
                    </div>
                    <div className="text-3xl opacity-90 mb-4">
                      ≈ ${(feeData.total * 150).toFixed(2)} USD
                    </div>
                    
                    {/* Fee Breakdown */}
                    <div className="grid grid-cols-2 gap-4 text-lg opacity-90">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm opacity-70">Total Earned</div>
                        <div className="font-semibold">{feeData.total.toFixed(4)} SOL</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm opacity-70">Available</div>
                        <div className="font-semibold">{feeData.unclaimed.toFixed(4)} SOL</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={() => handleClaimFees()}
                className="btn btn-lg btn-wide bg-white text-success hover:bg-white/90 hover:scale-105 transition-transform shadow-xl text-xl h-16"
                disabled={isLoading || claimingToken === 'claiming' || feeData.unclaimed === 0 || isLoadingFees}
              >
                {claimingToken === 'claiming' ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                    Claiming...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {feeData.unclaimed === 0 ? 'No Fees to Claim' : 'Claim All Fees'}
                  </>
                )}
              </button>

              {feeData.total === 0 && !isLoadingFees && (
                <p className="text-sm opacity-75 mt-4">
                  Earnings will appear here when people trade your tokens
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">{totalTokens}</div>
                <div className="text-sm text-base-content/70">Total Tokens Created</div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body p-6 text-center">
                <div className="text-4xl font-bold text-secondary mb-2">{recentTokens}</div>
                <div className="text-sm text-base-content/70">Created Last 30 Days</div>
              </div>
            </div>
          </div>

          {/* Your Tokens Section - Simplified */}
          {allTokens.length > 0 && (
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Your Tokens ({totalTokens})</h2>
                  <Link href="/tokens" className="btn btn-sm btn-ghost">
                    View All →
                  </Link>
                </div>

                {isLoadingDeployedTokens ? (
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Token</th>
                          <th>Mint</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTokens.slice(0, 5).map((token) => (
                          <tr key={token.mint} className="hover">
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">{token.symbol.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-semibold">{token.name}</div>
                                  <div className="text-xs opacity-70">{token.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="font-mono text-xs">
                              {token.mint.slice(0, 6)}...{token.mint.slice(-4)}
                            </td>
                            <td className="text-sm">
                              {new Date(token.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td>
                              <button
                                onClick={() => window.open(`https://pump.fun/${token.mint}`, '_blank')}
                                className="btn btn-xs btn-ghost"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalTokens > 5 && (
                      <div className="text-center mt-4">
                        <Link href="/tokens" className="btn btn-sm btn-outline">
                          View All {totalTokens} Tokens
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {allTokens.length === 0 && !isLoadingDeployedTokens && (
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center py-12">
                <h3 className="text-xl font-bold mb-2">No Tokens Yet</h3>
                <p className="text-base-content/70 mb-6">
                  Create your first token to start earning creator fees
                </p>
                <Link href="/create-seamless" className="btn btn-primary">
                  Create Your First Token
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
