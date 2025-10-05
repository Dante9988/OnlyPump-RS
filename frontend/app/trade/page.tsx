'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import toast from 'react-hot-toast';
import { usePumpFunRedux } from '@/lib/hooks/usePumpFunRedux';
import Link from 'next/link';

interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  priceUsd?: string;
  priceNative?: string;
  liquidity?: number;
  volume24h?: number;
  priceChange24h?: number;
  marketCap?: number;
  imageUrl?: string;
}

export default function TradePage() {
  const { connected, publicKey, signTransaction, sendTransaction } = useWallet();
  const {
    buyToken,
    sellToken,
    isLoading,
    connection,
    fetchTokenBalance,
    fetchSolBalance,
    calculateSellAmount,
    initConnection,
  } = usePumpFunRedux();

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellPercentage, setSellPercentage] = useState<number>(0);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [tokenMint, setTokenMint] = useState<string>('');

  // Balances
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [expectedSolAmount, setExpectedSolAmount] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize connection on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initConnection();
        console.log('✅ Connection initialized');
      } catch (error) {
        console.error('❌ Failed to initialize connection:', error);
      }
    };

    init();
  }, [initConnection]);

  // Load token from localStorage or URL
  useEffect(() => {
    const loadToken = async () => {
      let mint = localStorage.getItem('selectedTokenMint');
      const params = new URLSearchParams(window.location.search);
      const urlMint = params.get('mint');
      if (urlMint) {
        mint = urlMint;
        localStorage.setItem('selectedTokenMint', mint);
      }

      if (!mint) return;

      setTokenMint(mint);
      await fetchTokenInfo(mint);
    };

    loadToken();
  }, []);

  // Fetch balances when wallet connects or token changes
  useEffect(() => {
    const loadBalances = async () => {
      if (connected && publicKey && connection && tokenMint) {
        await fetchBalances();
      }
    };

    loadBalances();

    // Refresh balances every 10 seconds
    const interval = setInterval(() => {
      if (connected && publicKey && connection && tokenMint) {
        fetchBalances();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [connected, publicKey, connection, tokenMint]);

  // Calculate expected SOL amount when sell percentage changes
  useEffect(() => {
    const calculateExpectedSol = async () => {
      if (!connected || !tokenMint || !tokenBalance || sellPercentage === 0) {
        setExpectedSolAmount(0);
        return;
      }

      setIsCalculating(true);
      try {
        const tokensToSell = (tokenBalance * sellPercentage) / 100;
        const solAmount = await calculateSellAmount(tokenMint, tokensToSell);
        setExpectedSolAmount(solAmount);
      } catch (error) {
        console.error('Error calculating expected SOL amount:', error);
        setExpectedSolAmount(0);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateExpectedSol();
  }, [sellPercentage, tokenBalance, tokenMint, connected, calculateSellAmount]);

  const fetchBalances = async () => {
    if (!connected || !publicKey || !connection) {
      console.log('Cannot fetch balances - not ready:', {
        connected,
        publicKey: !!publicKey,
        connection: !!connection,
      });
      return;
    }

    console.log('Fetching balances for:', publicKey.toString());
    setIsLoadingBalances(true);
    try {
      // Fetch SOL balance
      const solBal = await fetchSolBalance();
      console.log('SOL balance:', solBal);
      setSolBalance(solBal);

      // Fetch token balance if we have a token mint
      if (tokenMint) {
        const tokenBal = await fetchTokenBalance(tokenMint);
        console.log('Token balance:', tokenBal);
        setTokenBalance(tokenBal);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
      toast.error('Failed to fetch balances');
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const fetchTokenInfo = async (mint: string) => {
    setIsLoadingToken(true);
    try {
      const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${mint}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('DexScreener response:', data);

        // API returns array of pairs for the token
        const pair = data?.pairs?.[0] || data?.[0];

        if (pair) {
          setTokenInfo({
            mint,
            name: pair.baseToken?.name || `Token ${mint.slice(0, 8)}`,
            symbol: pair.baseToken?.symbol || mint.slice(0, 4).toUpperCase(),
            priceUsd: pair.priceUsd,
            priceNative: pair.priceNative,
            liquidity: pair.liquidity?.usd,
            volume24h: pair.volume?.h24,
            priceChange24h: pair.priceChange?.h24,
            marketCap: pair.marketCap,
            imageUrl: pair.info?.imageUrl,
          });
        } else {
          console.log('No pair data found, using defaults');
          setTokenInfo({
            mint,
            name: `Token ${mint.slice(0, 8)}`,
            symbol: mint.slice(0, 4).toUpperCase(),
          });
        }
      } else {
        console.log('DexScreener API error:', response.status);
        setTokenInfo({
          mint,
          name: `Token ${mint.slice(0, 8)}`,
          symbol: mint.slice(0, 4).toUpperCase(),
        });
      }
    } catch (error) {
      console.error('Error fetching token info:', error);
    } finally {
      setIsLoadingToken(false);
    }
  };

  const waitForConfirmation = async (signature: string) => {
    if (!connection) return;

    try {
      toast.loading('Confirming...', { id: 'confirmation' });

      const latestBlockhash = await connection.getLatestBlockhash();
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      toast.dismiss('confirmation');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      return true;
    } catch (error) {
      console.error('Error waiting for confirmation:', error);
      toast.dismiss('confirmation');
      return false;
    }
  };

  const handleBuy = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!signTransaction || !sendTransaction) {
      toast.error('Wallet not fully initialized');
      return;
    }

    if (!connection) {
      toast.error('Connection not ready');
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const loadingToast = toast.loading(`Buying ${tokenInfo?.symbol}...`);

    try {
      const result = await buyToken({
        mint: tokenMint,
        amount_sol: parseFloat(buyAmount),
      });

      toast.dismiss(loadingToast);
      toast.success(`Transaction sent!`);

      const confirmed = await waitForConfirmation(result.signature);

      if (confirmed) {
        toast.success(`✅ Buy confirmed!`);
        await fetchBalances();
        await fetchTokenInfo(tokenMint);
        setBuyAmount('');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to buy');
    }
  };

  const handleSell = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!signTransaction || !sendTransaction) {
      toast.error('Wallet not fully initialized');
      return;
    }

    if (!connection) {
      toast.error('Connection not ready');
      return;
    }

    if (sellPercentage === 0) {
      toast.error('Please select an amount to sell');
      return;
    }

    const loadingToast = toast.loading(`Selling ${tokenInfo?.symbol}...`);

    try {
      const result = await sellToken({
        mint: tokenMint,
        sell_all: sellPercentage === 100,
        amount_tokens: sellPercentage === 100 ? undefined : (tokenBalance * sellPercentage) / 100,
      });

      toast.dismiss(loadingToast);
      toast.success(`Transaction sent!`);

      const confirmed = await waitForConfirmation(result.signature);

      if (confirmed) {
        toast.success(`✅ Sell confirmed!`);
        await fetchBalances();
        await fetchTokenInfo(tokenMint);
        setSellPercentage(0);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to sell');
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    if (numPrice < 0.0001) return `$${numPrice.toExponential(4)}`;
    return `$${numPrice.toFixed(6)}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume < 1000) return `$${volume.toFixed(2)}`;
    if (volume < 1000000) return `$${(volume / 1000).toFixed(2)}K`;
    return `$${(volume / 1000000).toFixed(2)}M`;
  };

  if (!tokenMint || !tokenInfo) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-base-300">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-base-content/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">No Token Selected</h1>
            <p className="text-base-content/70 mb-6">
              Please select a token from My Tokens to start trading
            </p>
            <Link href="/tokens" className="btn btn-primary btn-lg">
              Browse Tokens
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-base-300 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/tokens" className="btn btn-ghost gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Link>
            <WalletMultiButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Token Info & Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Header */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {tokenInfo.imageUrl ? (
                        <img
                          src={tokenInfo.imageUrl}
                          alt={tokenInfo.symbol}
                          className="w-16 h-16 rounded-full ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center ring-2 ring-primary/20">
                          <span className="text-white font-bold text-2xl">
                            {tokenInfo.symbol.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h1 className="text-3xl font-bold">{tokenInfo.symbol}</h1>
                        <p className="text-base-content/60">{tokenInfo.name}</p>
                        <p className="text-xs font-mono text-base-content/40 mt-1">
                          {tokenMint.slice(0, 4)}...{tokenMint.slice(-4)}
                        </p>
                      </div>
                    </div>

                    {tokenInfo.priceChange24h !== undefined && (
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${tokenInfo.priceChange24h >= 0 ? 'text-success' : 'text-error'}`}
                        >
                          {tokenInfo.priceChange24h >= 0 ? '+' : ''}
                          {tokenInfo.priceChange24h.toFixed(2)}%
                        </div>
                        <div className="text-sm text-base-content/60">24h Change</div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  {tokenInfo.priceUsd && (
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-300">
                      <div>
                        <div className="text-sm text-base-content/60 mb-1">Market Cap</div>
                        <div className="text-xl font-bold">{formatVolume(tokenInfo.marketCap)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/60 mb-1">24h Volume</div>
                        <div className="text-xl font-bold">{formatVolume(tokenInfo.volume24h)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/60 mb-1">Liquidity</div>
                        <div className="text-xl font-bold">{formatVolume(tokenInfo.liquidity)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="text-lg font-bold mb-4">Price Chart</h3>
                  <div className="h-96 flex items-center justify-center bg-base-200 rounded-lg">
                    <div className="text-center text-base-content/40">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                      <p>Chart coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trading Interface */}
            <div className="space-y-6">
              {/* Trade Card */}
              <div className="card bg-base-100 shadow-xl sticky top-6">
                <div className="card-body p-4">
                  {/* Mode Tabs */}
                  <div className="tabs tabs-boxed bg-base-200 p-1 mb-4">
                    <button
                      className={`tab flex-1 ${tradeMode === 'buy' ? 'tab-active' : ''}`}
                      onClick={() => setTradeMode('buy')}
                    >
                      Buy
                    </button>
                    <button
                      className={`tab flex-1 ${tradeMode === 'sell' ? 'tab-active' : ''}`}
                      onClick={() => setTradeMode('sell')}
                    >
                      Sell
                    </button>
                  </div>

                  {!connected ? (
                    <div className="text-center py-12">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-base-content/20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <p className="mb-4 text-base-content/70">Connect wallet to trade</p>
                      <WalletMultiButton className="btn btn-primary" />
                    </div>
                  ) : (
                    <>
                      {tradeMode === 'buy' ? (
                        /* Buy Interface */
                        <div className="space-y-4">
                          {/* You Pay */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-base-content/60">You pay</span>
                              <span className="text-sm text-base-content/60">
                                Balance: {isLoadingBalances ? '...' : `${solBalance.toFixed(4)}`}
                              </span>
                            </div>
                            <div className="bg-base-200 rounded-xl p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 397.7 311.7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <linearGradient
                                      id="solGradient"
                                      x1="360.879"
                                      y1="351.455"
                                      x2="141.213"
                                      y2="-69.2936"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop offset="0" stopColor="#00FFA3" />
                                      <stop offset="1" stopColor="#DC1FFF" />
                                    </linearGradient>
                                    <path
                                      d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                                      fill="url(#solGradient)"
                                    />
                                    <path
                                      d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                                      fill="url(#solGradient)"
                                    />
                                    <path
                                      d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                                      fill="url(#solGradient)"
                                    />
                                  </svg>
                                  <span className="font-bold text-lg">SOL</span>
                                </div>
                              </div>
                              <input
                                type="number"
                                className="input input-ghost text-3xl font-bold w-full p-0 focus:outline-none bg-transparent"
                                placeholder="0.0"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                step="0.01"
                              />
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => setBuyAmount('0.1')}
                                  className="btn btn-xs btn-ghost"
                                >
                                  0.1
                                </button>
                                <button
                                  onClick={() => setBuyAmount('0.5')}
                                  className="btn btn-xs btn-ghost"
                                >
                                  0.5
                                </button>
                                <button
                                  onClick={() => setBuyAmount('1')}
                                  className="btn btn-xs btn-ghost"
                                >
                                  1
                                </button>
                                <button
                                  onClick={() => setBuyAmount((solBalance * 0.5).toFixed(4))}
                                  className="btn btn-xs btn-ghost"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() =>
                                    setBuyAmount(Math.max(0, solBalance - 0.01).toFixed(4))
                                  }
                                  className="btn btn-xs btn-ghost"
                                >
                                  MAX
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Swap Icon */}
                          <div className="flex justify-center -my-2">
                            <div className="bg-base-100 p-2 rounded-xl border-4 border-base-300">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* You Receive */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-base-content/60">
                                You receive (estimated)
                              </span>
                            </div>
                            <div className="bg-base-200 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-base-content/50">~</div>
                                <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-lg ml-auto">
                                  {tokenInfo.imageUrl ? (
                                    <img
                                      src={tokenInfo.imageUrl}
                                      className="w-6 h-6 rounded-full"
                                      alt={tokenInfo.symbol}
                                    />
                                  ) : (
                                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full" />
                                  )}
                                  <span className="font-bold">{tokenInfo.symbol}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Buy Button */}
                          <button
                            onClick={handleBuy}
                            className="btn btn-success btn-lg w-full text-lg"
                            disabled={isLoading || !buyAmount || parseFloat(buyAmount) <= 0}
                          >
                            {isLoading ? (
                              <>
                                <span className="loading loading-spinner"></span>
                                Processing...
                              </>
                            ) : (
                              `Buy ${tokenInfo.symbol}`
                            )}
                          </button>
                        </div>
                      ) : (
                        /* Sell Interface */
                        <div className="space-y-4">
                          {/* You Sell */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-base-content/60">You sell</span>
                              <span className="text-sm text-base-content/60">
                                Balance:{' '}
                                {isLoadingBalances
                                  ? '...'
                                  : `${tokenBalance.toLocaleString()} ${tokenInfo.symbol}`}
                              </span>
                            </div>
                            <div className="bg-base-200 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="text-3xl font-bold">
                                  {sellPercentage === 0
                                    ? '0'
                                    : ((tokenBalance * sellPercentage) / 100).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-lg ml-auto">
                                  {tokenInfo.imageUrl ? (
                                    <img
                                      src={tokenInfo.imageUrl}
                                      className="w-6 h-6 rounded-full"
                                      alt={tokenInfo.symbol}
                                    />
                                  ) : (
                                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full" />
                                  )}
                                  <span className="font-bold">{tokenInfo.symbol}</span>
                                </div>
                              </div>

                              {/* Percentage Slider */}
                              <div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={sellPercentage}
                                  onChange={(e) => setSellPercentage(parseInt(e.target.value))}
                                  className="range range-sm range-error"
                                  step="1"
                                />
                                <div className="flex justify-between text-xs text-base-content/60 mt-1">
                                  <span>0%</span>
                                  <span className="text-error font-bold">{sellPercentage}%</span>
                                  <span>100%</span>
                                </div>
                              </div>

                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => setSellPercentage(25)}
                                  className="btn btn-xs btn-ghost"
                                >
                                  25%
                                </button>
                                <button
                                  onClick={() => setSellPercentage(50)}
                                  className="btn btn-xs btn-ghost"
                                >
                                  50%
                                </button>
                                <button
                                  onClick={() => setSellPercentage(75)}
                                  className="btn btn-xs btn-ghost"
                                >
                                  75%
                                </button>
                                <button
                                  onClick={() => setSellPercentage(100)}
                                  className="btn btn-xs btn-ghost"
                                >
                                  100%
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Swap Icon */}
                          <div className="flex justify-center -my-2">
                            <div className="bg-base-100 p-2 rounded-xl border-4 border-base-300">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* You Receive */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-base-content/60">You receive</span>
                            </div>
                            <div className="bg-base-200 rounded-xl p-4">
                              <div className="flex items-center gap-3">
                                {isCalculating ? (
                                  <div className="flex items-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span className="text-base-content/50">Calculating...</span>
                                  </div>
                                ) : (
                                  <div className="text-3xl font-bold">
                                    {expectedSolAmount > 0 ? expectedSolAmount.toFixed(6) : '0'}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 397.7 311.7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <linearGradient
                                      id="solGradient2"
                                      x1="360.879"
                                      y1="351.455"
                                      x2="141.213"
                                      y2="-69.2936"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop offset="0" stopColor="#00FFA3" />
                                      <stop offset="1" stopColor="#DC1FFF" />
                                    </linearGradient>
                                    <path
                                      d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                                      fill="url(#solGradient2)"
                                    />
                                    <path
                                      d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                                      fill="url(#solGradient2)"
                                    />
                                    <path
                                      d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                                      fill="url(#solGradient2)"
                                    />
                                  </svg>
                                  <span className="font-bold text-lg">SOL</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sell Button */}
                          <button
                            onClick={handleSell}
                            className="btn btn-error btn-lg w-full text-lg"
                            disabled={isLoading || sellPercentage === 0}
                          >
                            {isLoading ? (
                              <>
                                <span className="loading loading-spinner"></span>
                                Processing...
                              </>
                            ) : sellPercentage === 100 ? (
                              `Sell All ${tokenInfo.symbol}`
                            ) : (
                              `Sell ${sellPercentage}% ${tokenInfo.symbol}`
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  <h3 className="font-bold mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(`https://solscan.io/token/${tokenMint}`, '_blank')}
                      className="btn btn-sm btn-ghost w-full justify-start gap-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      View on Solscan
                    </button>
                    <button
                      onClick={() => window.open(`https://pump.fun/${tokenMint}`, '_blank')}
                      className="btn btn-sm btn-ghost w-full justify-start gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      View on Pump.fun
                    </button>
                    <button
                      onClick={() =>
                        window.open(`https://dexscreener.com/solana/${tokenMint}`, '_blank')
                      }
                      className="btn btn-sm btn-ghost w-full justify-start gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      View on DexScreener
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
