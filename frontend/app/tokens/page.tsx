'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import toast from 'react-hot-toast';
import { usePumpFunRedux } from '@/lib/hooks/usePumpFunRedux';
import type { DeployedToken } from '@/lib/store/slices/pumpFunSlice';
import Link from 'next/link';

export default function TokensPage() {
  const { connected, publicKey } = useWallet();
  const { 
    deployedTokens,
    isLoadingDeployedTokens,
    fetchDeployedTokens,
    fetchTransactionHistory,
    transactionHistory,
    isLoadingTransactionHistory
  } = usePumpFunRedux();
  
  const [selectedToken, setSelectedToken] = useState<DeployedToken | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'symbol'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent'>('all');

  // Fetch deployed tokens when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchDeployedTokens(publicKey.toString());
      fetchTransactionHistory(publicKey.toString());
    }
  }, [connected, publicKey, fetchDeployedTokens, fetchTransactionHistory]);

  // Sort tokens based on selected criteria
  const sortedTokens = [...deployedTokens].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'date':
      default:
        return b.createdAt - a.createdAt;
    }
  });

  // Filter tokens
  const filteredTokens = sortedTokens.filter(token => {
    if (filterBy === 'recent') {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      return token.createdAt > thirtyDaysAgo;
    }
    return true;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!connected) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">My Tokens</h1>
            <p className="text-lg mb-8">Connect your wallet to view your deployed tokens</p>
            <WalletMultiButton />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Tokens</h1>
              <p className="text-lg opacity-70">
                Manage and view your deployed tokens on Pump.fun
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/create-seamless" className="btn btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Token
              </Link>
              <WalletMultiButton />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Total Tokens</h3>
                <div className="text-3xl font-bold text-primary">
                  {deployedTokens.length}
                </div>
                <p className="text-sm opacity-70">Deployed on Pump.fun</p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Recent Activity</h3>
                <div className="text-3xl font-bold text-secondary">
                  {filteredTokens.length}
                </div>
                <p className="text-sm opacity-70">Last 30 days</p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Total Transactions</h3>
                <div className="text-3xl font-bold text-accent">
                  {transactionHistory.length}
                </div>
                <p className="text-sm opacity-70">Pump.fun interactions</p>
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="card bg-base-200 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sort by:</span>
                  <select 
                    className="select select-bordered select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'symbol')}
                  >
                    <option value="date">Date Created</option>
                    <option value="name">Name</option>
                    <option value="symbol">Symbol</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Filter:</span>
                  <select 
                    className="select select-bordered select-sm"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'recent')}
                  >
                    <option value="all">All Tokens</option>
                    <option value="recent">Last 30 Days</option>
                  </select>
                </div>
                
                {isLoadingDeployedTokens && (
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="text-sm">Loading tokens...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tokens Grid */}
          {filteredTokens.length === 0 ? (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center py-16">
                <div className="text-base-content/50 mb-4">
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">No Tokens Found</h3>
                  <p className="text-lg mb-4">
                    {filterBy === 'recent' 
                      ? "You haven't created any tokens in the last 30 days"
                      : "You haven't deployed any tokens yet"
                    }
                  </p>
                  <Link href="/create-seamless" className="btn btn-primary">
                    Create Your First Token
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <div 
                  key={token.mint}
                  className={`card bg-base-200 shadow-xl cursor-pointer transition-all hover:shadow-2xl ${
                    selectedToken?.mint === token.mint ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="card-body">
                    {/* Token Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="card-title text-lg mb-1">{token.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-primary font-mono">{token.symbol}</span>
                          <span className="text-sm opacity-70">Token</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-70">Created</div>
                        <div className="text-sm font-medium">{formatDate(token.createdAt)}</div>
                      </div>
                    </div>

                    {/* Token Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-70">Mint Address:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(token.mint);
                          }}
                          className="text-sm font-mono hover:text-primary transition-colors"
                        >
                          {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-70">Pump Address:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(token.pumpAddress);
                          }}
                          className="text-sm font-mono hover:text-primary transition-colors"
                        >
                          {token.pumpAddress.slice(0, 8)}...{token.pumpAddress.slice(-8)}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-70">Creator:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(token.creator);
                          }}
                          className="text-sm font-mono hover:text-primary transition-colors"
                        >
                          {token.creator.slice(0, 8)}...{token.creator.slice(-8)}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://solscan.io/token/${token.mint}`, '_blank');
                        }}
                        className="btn btn-sm btn-outline"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Solscan
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://pump.fun/${token.mint}`, '_blank');
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Trade on Pump.fun
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Token Details Modal */}
          {selectedToken && (
            <div className="modal modal-open">
              <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-4">{selectedToken.name}</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Symbol</span>
                      </label>
                      <div className="badge badge-primary badge-lg font-mono">{selectedToken.symbol}</div>
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Created</span>
                      </label>
                      <div className="text-sm">{formatDate(selectedToken.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Mint Address</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-base-300 rounded text-sm font-mono">
                        {selectedToken.mint}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedToken.mint)}
                        className="btn btn-sm btn-outline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Pump Address</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-base-300 rounded text-sm font-mono">
                        {selectedToken.pumpAddress}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedToken.pumpAddress)}
                        className="btn btn-sm btn-outline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Creator</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-base-300 rounded text-sm font-mono">
                        {selectedToken.creator}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedToken.creator)}
                        className="btn btn-sm btn-outline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="modal-action">
                  <button
                    onClick={() => setSelectedToken(null)}
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.open(`https://pump.fun/${selectedToken.mint}`, '_blank')}
                    className="btn btn-primary"
                  >
                    Trade on Pump.fun
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
