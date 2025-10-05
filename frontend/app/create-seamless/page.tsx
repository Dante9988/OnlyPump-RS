'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PageLayout from '@/components/PageLayout';
import WalletDebug from '@/components/WalletDebug';
import toast from 'react-hot-toast';
import { usePumpFunRedux } from '@/lib/hooks/usePumpFunRedux';
import type { CreateTokenRequest, BuyTokenRequest, SellTokenRequest } from '@/lib/store/slices/pumpFunSlice';
import { ReduxStateDebug } from '@/components/ReduxStateDebug';
import TransactionHistory from '@/components/TransactionHistory';
import Link from 'next/link';

export default function CreateTokenSeamless() {
  const { connected, publicKey, signMessage, connecting, disconnecting, wallet, connect, disconnect } = useWallet();
  const { 
    connection,
    pumpAddresses, 
    pumpAddressStats,
    isLoading, 
    isLoadingPumpAddresses,
    createdTokenMint,
    error,
    initConnection,
    loadPumpAddresses, 
    createToken, 
    createAndBuy,
    buyToken, 
    sellToken,
    fetchTokenBalance,
    fetchSolBalance,
    transactionHistory,
    isLoadingTransactionHistory,
    claimFees,
    setSelectedTokenMint,
    fetchDeployedTokens,
    fetchTransactionHistory,
    clearError
  } = usePumpFunRedux();
  
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  
  // Form state
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  
  // Buy/Sell state
  const [showBuyInput, setShowBuyInput] = useState(true);
  const [buyAmount, setBuyAmount] = useState('0.1');
  const [sellAmount, setSellAmount] = useState('');
  
  // Balance state
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  

  // Debug wallet connection
  useEffect(() => {
    console.log('Wallet state:', { connected, connecting, disconnecting, wallet: wallet?.adapter?.name, publicKey: publicKey?.toString() });
  }, [connected, connecting, disconnecting, wallet, publicKey]);

  // Initialize connection and load pump addresses
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize connection
        await initConnection();
        // Load pre-generated pump addresses
        await loadPumpAddresses();
        toast.success('Loaded pre-generated pump addresses!');
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load pump addresses');
      }
    };
      
    loadData();
  }, [initConnection, loadPumpAddresses]);

  // Load balances when wallet connects or token changes
  useEffect(() => {
    const loadBalances = async () => {
      if (!connected || !publicKey) return;
      
      setIsLoadingBalances(true);
      try {
        const solBal = await fetchSolBalance();
        setSolBalance(solBal);
        
        if (createdTokenMint) {
          const tokenBal = await fetchTokenBalance(createdTokenMint);
          setTokenBalance(tokenBal);
        }
      } catch (error) {
        console.error('Error loading balances:', error);
      } finally {
        setIsLoadingBalances(false);
      }
    };

    loadBalances();
  }, [connected, publicKey, createdTokenMint, fetchSolBalance, fetchTokenBalance]);

  // Load deployed tokens and transaction history when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchDeployedTokens();
      fetchTransactionHistory();
    }
  }, [connected, publicKey, fetchDeployedTokens, fetchTransactionHistory]);


  // Handle claim fees
  const handleClaimFees = async () => {
    if (isLoading) {
      console.log('Already processing, ignoring duplicate request');
      return;
    }

    if (!createdTokenMint) {
      toast.error('No token selected');
      return;
    }

    const loadingToast = toast.loading('Claiming fees...');
    try {
      const result = await claimFees(createdTokenMint);
      toast.dismiss(loadingToast);
      toast.success(`Fees claimed successfully! TX: ${result.signature}`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to claim fees');
    }
  };

  // Manual connect function
  const handleConnect = async () => {
    try {
      if (!wallet) {
        toast.error('No wallet selected');
        return;
      }
      await connect();
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  // Manual connection initialization
  const handleInitConnection = async () => {
    try {
      await initConnection();
      toast.success('Solana connection initialized!');
    } catch (error) {
      console.error('Connection init error:', error);
      toast.error('Failed to initialize connection');
    }
  };


  // Sign message with wallet (for authentication only)
  const signWithWallet = async (message: string) => {
    if (!signMessage || !publicKey) {
      throw new Error('Wallet not connected');
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);
    
    return {
      signature: Buffer.from(signature).toString('base64'),
      publicKey: publicKey.toString()
    };
  };

  // Create token using Pump.fun directly (or create+buy in 1 tx if buyAmount > 0)
  const handleCreateToken = async () => {
    if (isLoading) {
      console.log('Already processing, ignoring duplicate request');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!name || !symbol) {
      toast.error('Name and symbol are required');
      return;
    }

    const loadingToast = toast.loading(parseFloat(buyAmount) > 0 ? 'Creating and buying in one transaction...' : 'Creating token with pump address...');

    try {
      const requestData: CreateTokenRequest = {
        name,
        symbol,
        description,
        image_path: imagePreview || undefined,
        twitter: twitter || undefined,
        telegram: telegram || undefined,
        website: website || undefined
      };

      let result;
      if (showBuyInput && parseFloat(buyAmount) > 0) {
        result = await createAndBuy(requestData, parseFloat(buyAmount));
      } else {
        result = await createToken(requestData);
      }
      
      toast.dismiss(loadingToast);
      toast.success(`Token created successfully! Mint: ${result.mint}`);
      
      // If create+buy was done, no need to buy again
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to create token');
    }
  };

  // Buy token
  const handleBuyToken = async (mint: string) => {
    if (isLoading) {
      console.log('Already processing, ignoring duplicate request');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid SOL amount');
      return;
    }

    const loadingToast = toast.loading(`Buying ${amount} SOL worth of tokens...`);

    try {
      const requestData: BuyTokenRequest = {
        mint,
        amount_sol: amount
      };

      const result = await buyToken(requestData);
      
      toast.dismiss(loadingToast);
      toast.success(`Successfully bought tokens! TX: ${result.signature}`);
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to buy token');
    }
  };

  // Sell token
  const handleSellToken = async () => {
    if (isLoading) {
      console.log('Already processing, ignoring duplicate request');
      return;
    }

    if (!connected || !publicKey || !createdTokenMint) {
      toast.error('Please create a token first');
      return;
    }

    const loadingToast = toast.loading('Selling tokens...');

    try {
      const requestData: SellTokenRequest = {
        mint: createdTokenMint,
        amount_tokens: sellAmount ? parseInt(sellAmount) : undefined,
        sell_all: !sellAmount
      };

      const result = await sellToken(requestData);
      
      toast.dismiss(loadingToast);
      toast.success(`Successfully sold tokens! TX: ${result.signature}`);
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to sell token');
    }
  };

  return (
    <PageLayout>
      <WalletDebug />
      <ReduxStateDebug />
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Your Token
              </h1>
            </div>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Launch your token on Pump.fun with vanity addresses ending in "pump" - 
              fully decentralized and lightning fast
            </p>
          </div>
        
                {!connected ? (
                  <div className="max-w-md mx-auto">
                    <div className="card bg-base-100 shadow-2xl border border-base-300">
                      <div className="card-body text-center p-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                        <p className="text-base-content/70 mb-8">Connect your Solana wallet to start creating tokens</p>
                        
                        <div className="space-y-4">
                          <WalletMultiButton className="btn btn-primary btn-lg w-full" />
                          
                          <div className="divider text-xs">OR</div>
                          
                          <div className="space-y-2">
                            {wallet && !connecting && (
                              <button 
                                onClick={handleConnect}
                                className="btn btn-outline btn-sm w-full"
                              >
                                Manual Connect
                              </button>
                            )}
                            <button 
                              onClick={handleInitConnection}
                              className="btn btn-outline btn-sm w-full"
                              disabled={!!connection}
                            >
                              {connection ? 'Connection Ready' : 'Init Connection'}
                            </button>
                          </div>
                          
                          <div className="text-xs text-base-content/50 mt-4">
                            <p>Status: {connecting ? 'Connecting...' : disconnecting ? 'Disconnecting...' : 'Not connected'}</p>
                            {wallet && <p>Selected: {wallet.adapter.name}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="card bg-gradient-to-r from-success/20 to-success/10 border border-success/30 shadow-xl">
                        <div className="card-body p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Wallet Connected!</h3>
                                <div className="text-sm text-base-content/70">
                                  <div className="font-mono">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</div>
                                  <div className="text-xs">via {wallet?.adapter.name}</div>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={disconnect}
                              className="btn btn-sm btn-outline btn-error"
                              disabled={disconnecting}
                            >
                              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{pumpAddressStats.pool_size}</div>
                              <div className="text-sm text-base-content/70">Pump Addresses</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{solBalance.toFixed(4)}</div>
                              <div className="text-sm text-base-content/70">SOL Balance</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{tokenBalance.toFixed(2)}</div>
                              <div className="text-sm text-base-content/70">Token Balance</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Create Token Form */}
                      <div className="card bg-base-100 shadow-2xl border border-base-300">
                        <div className="card-body p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <h2 className="text-2xl font-bold">Token Details</h2>
                          </div>
                          
                          <div className="alert alert-info mb-6 border border-info/30">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                              <div className="font-semibold">Vanity Address Pool Ready</div>
                              <div className="text-sm mt-1">
                                {pumpAddressStats.pool_size} addresses ending in "pump" available. Fully decentralized with direct Pump.fun integration.
                              </div>
                            </div>
                          </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Token Name</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full focus:input-primary" 
                    placeholder="My Awesome Token"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Symbol</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full focus:input-primary" 
                    placeholder="MAT"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                    maxLength={10}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Description</span>
                    <span className="label-text-alt text-base-content/60">(Optional)</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-24 focus:textarea-primary" 
                    placeholder="Describe your token..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Token Image</span>
                    <span className="label-text-alt text-base-content/60">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full focus:file-input-primary"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-3 p-3 bg-base-200 rounded-lg">
                      <div className="text-sm text-base-content/70 mb-2">Preview:</div>
                      <img 
                        src={imagePreview} 
                        alt="Token preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-base-300"
                      />
                    </div>
                  )}
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Twitter</span>
                    <span className="label-text-alt text-base-content/60">(Optional)</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-300 px-3 py-2 text-base-content/70">@</span>
                    <input 
                      type="text" 
                      className="input input-bordered w-full focus:input-primary" 
                      placeholder="username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Website</span>
                    <span className="label-text-alt text-base-content/60">(Optional)</span>
                  </label>
                  <input 
                    type="url" 
                    className="input input-bordered w-full focus:input-primary" 
                    placeholder="https://mytoken.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Initial Buy Amount</span>
                    <span className="label-text-alt text-base-content/60">(Optional)</span>
                  </label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="input input-bordered w-full focus:input-primary" 
                      placeholder="0.1"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                    <span className="bg-base-300 px-3 py-2 text-base-content/70">SOL</span>
                  </div>
                  <div className="label">
                    <span className="label-text-alt text-base-content/60">Buy tokens immediately after creation</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  <button 
                    onClick={handleCreateToken}
                    className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !connected || !name || !symbol}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating Token...
                      </>
                    ) : parseFloat(buyAmount) > 0 ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create & Buy Token
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Token
                      </>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <div className="badge badge-outline">
                      {pumpAddressStats.pool_size} pump addresses available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Interface */}
            <div className="card bg-base-100 shadow-2xl border border-base-300">
              <div className="card-body p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Trading Interface</h2>
                </div>
                
                {/* Balance Display */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-base-content/70">SOL Balance</div>
                          <div className="text-lg font-bold">
                            {isLoadingBalances ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              `${solBalance.toFixed(4)} SOL`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-base-content/70">Token Balance</div>
                          <div className="text-lg font-bold">
                            {isLoadingBalances ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              `${tokenBalance.toFixed(2)} ${symbol || 'TOKENS'}`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!createdTokenMint ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Trade</h3>
                    <p className="text-base-content/70">Create your token first to start trading</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="card bg-gradient-to-r from-success/20 to-success/10 border border-success/30">
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-success">Token Created Successfully!</div>
                            <div className="text-xs text-base-content/70 font-mono">
                              {createdTokenMint?.slice(0, 8)}...{createdTokenMint?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buy Section */}
                    <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <div className="card-body p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Buy Tokens
                          </h3>
                          <div className="text-sm text-base-content/70">
                            Balance: {solBalance.toFixed(4)} SOL
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="input input-bordered w-full text-lg pr-16" 
                            placeholder="0.0"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            step="0.01"
                            min="0"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className="text-sm font-medium">SOL</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setBuyAmount((solBalance * 0.25).toFixed(4))}
                          >
                            25%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setBuyAmount((solBalance * 0.5).toFixed(4))}
                          >
                            50%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setBuyAmount((solBalance * 0.75).toFixed(4))}
                          >
                            75%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setBuyAmount(solBalance.toFixed(4))}
                          >
                            MAX
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleBuyToken(createdTokenMint)}
                          className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                          disabled={isLoading || !buyAmount || parseFloat(buyAmount) <= 0}
                        >
                          {isLoading ? 'Buying...' : 'Buy Tokens'}
                        </button>
                        </div>
                      </div>
                    </div>

                    {/* Sell Section - Raydium Style */}
                    <div className="bg-base-300 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Sell</h3>
                        <div className="text-sm text-base-content/70">
                          Balance: {tokenBalance.toFixed(2)} {symbol || 'TOKENS'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="input input-bordered w-full text-lg pr-20" 
                            placeholder="0.0"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            min="0"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className="text-sm font-medium">{symbol || 'TOKENS'}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setSellAmount((tokenBalance * 0.25).toFixed(2))}
                          >
                            25%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setSellAmount((tokenBalance * 0.5).toFixed(2))}
                          >
                            50%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setSellAmount((tokenBalance * 0.75).toFixed(2))}
                          >
                            75%
                          </button>
                          <button 
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => setSellAmount(tokenBalance.toFixed(2))}
                          >
                            MAX
                          </button>
                        </div>
                        
                        <button 
                          onClick={handleSellToken}
                          className={`btn btn-secondary w-full ${isLoading ? 'loading' : ''}`}
                          disabled={isLoading || (!sellAmount && tokenBalance <= 0)}
                        >
                          {isLoading ? 'Selling...' : 'Sell Tokens'}
                        </button>
                        
                        <div className="text-center">
                          <button 
                            onClick={() => setSellAmount('')}
                            className="btn btn-ghost btn-sm"
                          >
                            Sell All Tokens
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Claim Fees Section */}
                    <div className="bg-base-300 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Creator Fees</h3>
                        <div className="text-sm text-base-content/70">
                          Earn from trading volume
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="alert alert-info">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <div className="text-sm">As the token creator, you earn fees from all trading activity.</div>
                            <div className="text-xs opacity-70">Claim your accumulated fees anytime.</div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleClaimFees}
                          className={`btn btn-accent w-full ${isLoading ? 'loading' : ''}`}
                          disabled={isLoading || !createdTokenMint}
                        >
                          {isLoading ? 'Claiming...' : 'Claim Fees'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
                    
                    {/* Quick Access to Tokens */}
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body text-center p-8">
                          <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold mb-4">Manage Your Tokens</h2>
                          <p className="text-base-content/70 mb-6">
                            View and manage all your deployed tokens in one place
                          </p>
                          <Link href="/tokens" className="btn btn-primary btn-lg">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            View All Tokens
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction History */}
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <h2 className="text-2xl font-bold">Transaction History</h2>
                          </div>
                          <TransactionHistory 
                            transactions={transactionHistory}
                            isLoading={isLoadingTransactionHistory}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
        </div>
      </div>
    </PageLayout>
  );
}
