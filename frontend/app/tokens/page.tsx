'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Token DTO for display
interface TokenDTO {
  mint: string;
  name: string;
  symbol: string;
  createdAt: number;
  creator: string;
  // DexScreener data
  priceUsd?: string;
  priceNative?: string;
  liquidity?: number;
  volume24h?: number;
  priceChange24h?: number;
  marketCap?: number;
  fdv?: number;
  imageUrl?: string;
  pairAddress?: string;
  dexUrl?: string;
}

export default function TokensPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  const [tokens, setTokens] = useState<TokenDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenDTO | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'symbol' | 'price'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent'>('all');

  // Function to fetch IPFS image and convert to base64
  const fetchIpfsImage = async (metadataUri?: string): Promise<string | undefined> => {
    if (!metadataUri) return undefined;

    try {
      // Convert IPFS URI to HTTP gateway
      const ipfsGateway = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

      // Fetch metadata
      const metadataResponse = await fetch(ipfsGateway);
      if (!metadataResponse.ok) return undefined;

      const metadata = await metadataResponse.json();
      if (!metadata.image) return undefined;

      // Fetch image
      const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) return undefined;

      const blob = await imageResponse.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching IPFS image:', error);
      return undefined;
    }
  };

  // Fetch all tokens: from storage + blockchain transactions
  const fetchAllTokens = async () => {
    if (!connected || !publicKey) return;

    setIsLoading(true);
    try {
      const walletAddress = publicKey.toString();

      // Step 1: Get tokens from persisted storage
      const persistedTokensJson = localStorage.getItem('persist:pumpfun');
      let persistedMints: string[] = [];

      if (persistedTokensJson) {
        try {
          const persistedData = JSON.parse(persistedTokensJson);
          const createdTokensStr = persistedData.createdTokens || '[]';
          const createdTokens = JSON.parse(createdTokensStr);
          persistedMints = createdTokens.map((t: any) => t.mint);
          console.log('Persisted tokens:', persistedMints.length);
        } catch (e) {
          console.error('Error parsing persisted tokens:', e);
        }
      }

      // Step 2: Fetch transactions from Helius to find all Pump.fun token interactions
      const heliusApiKey =
        process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'f7c74abc-20d1-450d-b655-64f460fd5856';

      let transactionMints: string[] = [];
      try {
        const response = await fetch(
          `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${heliusApiKey}&limit=100`
        );

        if (response.ok) {
          const transactions = await response.json();
          console.log(`Fetched ${transactions.length} transactions from Helius`);

          // Extract mint addresses from Pump.fun transactions
          for (const tx of transactions) {
            // Check if it's a Pump.fun interaction (look for the program ID)
            const isPumpFun =
              tx.accountData?.some(
                (acc: any) => acc.account === '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
              ) || tx.description?.toLowerCase().includes('pump');

            if (isPumpFun && tx.tokenTransfers && tx.tokenTransfers.length > 0) {
              // Get all mint addresses from token transfers
              tx.tokenTransfers.forEach((transfer: any) => {
                if (
                  transfer.mint &&
                  transfer.mint !== 'So11111111111111111111111111111111111111112'
                ) {
                  transactionMints.push(transfer.mint);
                }
              });
            }
          }
          console.log('Pump.fun tokens found in transactions:', transactionMints.length);
        } else {
          console.warn('Failed to fetch transactions from Helius');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }

      // Step 3: Combine and deduplicate mint addresses
      const allMints = Array.from(new Set([...persistedMints, ...transactionMints]));
      console.log('Total unique mints:', allMints.length);

      if (allMints.length === 0) {
        setTokens([]);
        setIsLoading(false);
        return;
      }

      // Step 4: Fetch token data from DexScreener
      const tokensData = await fetchFromDexScreener(allMints, walletAddress);
      setTokens(tokensData);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch token data from DexScreener API
  const fetchFromDexScreener = async (mints: string[], creator: string): Promise<TokenDTO[]> => {
    try {
      // DexScreener supports up to 30 tokens per request
      const chunks = [];
      for (let i = 0; i < mints.length; i += 30) {
        chunks.push(mints.slice(i, i + 30));
      }

      const allTokens: TokenDTO[] = [];

      for (const chunk of chunks) {
        const mintAddresses = chunk.join(',');
        console.log(`Fetching DexScreener data for ${chunk.length} tokens...`);

        const response = await fetch(
          `https://api.dexscreener.com/tokens/v1/solana/${mintAddresses}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error('DexScreener API error:', response.status);
          continue;
        }

        const data = await response.json();
        console.log('DexScreener response:', data);

        // Process each mint in this chunk
        const tokenPromises = chunk.map(async (mint) => {
          // Find the pair for this mint
          const pair = data?.find((item: any) => item.baseToken?.address === mint);

          if (pair) {
            // Token found on DexScreener - try to get IPFS image if no image URL
            let imageUrl = pair.info?.imageUrl;

            // If no image from DexScreener, try IPFS
            if (!imageUrl && pair.info?.metadataUri) {
              try {
                imageUrl = await fetchIpfsImage(pair.info.metadataUri);
              } catch (e) {
                console.error('Failed to fetch IPFS image:', e);
              }
            }

            return {
              mint,
              name: pair.baseToken?.name || `Token ${mint.slice(0, 8)}`,
              symbol: pair.baseToken?.symbol || mint.slice(0, 4).toUpperCase(),
              createdAt: pair.pairCreatedAt || Date.now(),
              creator,
              priceUsd: pair.priceUsd,
              priceNative: pair.priceNative,
              liquidity: pair.liquidity?.usd,
              volume24h: pair.volume?.h24,
              priceChange24h: pair.priceChange?.h24,
              marketCap: pair.marketCap,
              fdv: pair.fdv,
              imageUrl,
              pairAddress: pair.pairAddress,
              dexUrl: pair.url,
            };
          } else {
            // Token not on DexScreener yet, add basic info
            return {
              mint,
              name: `Token ${mint.slice(0, 8)}`,
              symbol: mint.slice(0, 4).toUpperCase(),
              createdAt: Date.now(),
              creator,
            };
          }
        });

        const chunkTokens = await Promise.all(tokenPromises);
        allTokens.push(...chunkTokens);

        // Rate limiting - wait between chunks
        if (chunks.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return allTokens;
    } catch (error) {
      console.error('Error fetching from DexScreener:', error);
      return [];
    }
  };

  // Fetch tokens on wallet connect
  useEffect(() => {
    if (connected && publicKey) {
      fetchAllTokens();
    }
  }, [connected, publicKey]);

  // Manual refresh
  const handleRefresh = () => {
    toast.loading('Refreshing tokens...');
    fetchAllTokens().then(() => {
      toast.dismiss();
      toast.success('Tokens refreshed!');
    });
  };

  // Sort tokens - prioritize tokens with DexScreener data
  const sortedTokens = [...tokens].sort((a, b) => {
    // First, separate tokens with and without DexScreener data
    const aHasData = !!a.priceUsd;
    const bHasData = !!b.priceUsd;

    // Tokens with data come before tokens without data
    if (aHasData && !bHasData) return -1;
    if (!aHasData && bHasData) return 1;

    // Within each group, apply the selected sort
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'price':
        return parseFloat(b.priceUsd || '0') - parseFloat(a.priceUsd || '0');
      case 'date':
      default:
        // Sort by creation time (newest first)
        return b.createdAt - a.createdAt;
    }
  });

  // Filter tokens
  const filteredTokens = sortedTokens.filter((token) => {
    if (filterBy === 'recent') {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
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
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Handle token click - navigate to trading page
  const handleTokenClick = (token: TokenDTO) => {
    // Store the selected token mint in localStorage for trade page
    localStorage.setItem('selectedTokenMint', token.mint);
    toast.success(`Opening ${token.symbol} trading page...`);
    router.push('/trade');
  };

  const formatPrice = (price?: string) => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    if (numPrice < 0.0001) return numPrice.toExponential(2);
    return `$${numPrice.toFixed(6)}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume < 1000) return `$${volume.toFixed(2)}`;
    if (volume < 1000000) return `$${(volume / 1000).toFixed(2)}K`;
    return `$${(volume / 1000000).toFixed(2)}M`;
  };

  if (!connected) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">My Tokens</h1>
            <p className="text-lg mb-8">Connect your wallet to view your tokens</p>
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
              <p className="text-lg opacity-70">Tokens from your Pump.fun interactions</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleRefresh} className="btn btn-outline" disabled={isLoading}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <Link href="/create-seamless" className="btn btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
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
                <div className="text-3xl font-bold text-primary">{tokens.length}</div>
                <p className="text-sm opacity-70">Your Pump.fun tokens</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">On DexScreener</h3>
                <div className="text-3xl font-bold text-secondary">
                  {tokens.filter((t) => t.priceUsd).length}
                </div>
                <p className="text-sm opacity-70">Listed & tradeable</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Total Volume</h3>
                <div className="text-3xl font-bold text-accent">
                  {formatVolume(tokens.reduce((sum, t) => sum + (t.volume24h || 0), 0))}
                </div>
                <p className="text-sm opacity-70">24h trading volume</p>
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
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="date">Date Created</option>
                    <option value="name">Name</option>
                    <option value="symbol">Symbol</option>
                    <option value="price">Price</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Filter:</span>
                  <select
                    className="select select-bordered select-sm"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                  >
                    <option value="all">All Tokens</option>
                    <option value="recent">Last 30 Days</option>
                  </select>
                </div>

                {isLoading && (
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
                  <svg
                    className="w-24 h-24 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">No Tokens Found</h3>
                  <p className="text-lg mb-4">
                    {filterBy === 'recent'
                      ? "You haven't interacted with any tokens in the last 30 days"
                      : 'No Pump.fun tokens found for this wallet'}
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
                  onClick={() => handleTokenClick(token)}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="card-body">
                    {/* Token Header with Image */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        {token.imageUrl ? (
                          <img
                            src={token.imageUrl}
                            alt={token.symbol}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {token.symbol.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{token.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="badge badge-primary font-mono">{token.symbol}</div>
                            {!token.priceUsd && (
                              <div className="badge badge-warning badge-sm">Pending</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Info */}
                    {token.priceUsd && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm opacity-70">Price:</span>
                          <span className="font-bold">{formatPrice(token.priceUsd)}</span>
                        </div>
                        {token.marketCap && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">Market Cap:</span>
                            <span className="font-medium">{formatVolume(token.marketCap)}</span>
                          </div>
                        )}
                        {token.volume24h !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">24h Volume:</span>
                            <span className="font-medium">{formatVolume(token.volume24h)}</span>
                          </div>
                        )}
                        {token.priceChange24h !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">24h Change:</span>
                            <span
                              className={`font-bold ${token.priceChange24h >= 0 ? 'text-success' : 'text-error'}`}
                            >
                              {token.priceChange24h >= 0 ? '+' : ''}
                              {token.priceChange24h?.toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mint Address */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-70">Mint:</span>
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
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Solscan
                      </button>

                      {token.dexUrl ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(token.dexUrl, '_blank');
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          Trade
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://pump.fun/${token.mint}`, '_blank');
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          Pump.fun
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
