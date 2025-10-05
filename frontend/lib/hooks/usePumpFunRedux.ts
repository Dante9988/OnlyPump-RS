// Pump.fun Redux Hook - Fully Decentralized DApp with Redux State Management

// Wallet adapter for latest-pumpfun-sdk
interface PumpFunWallet {
  signTransaction(tx: any): Promise<any>;
  signAllTransactions(txs: any[]): Promise<any[]>;
  get publicKey(): any;
}

// Helper function to create provider for Pump.fun SDK
const createProvider = (connection: Connection, signTransaction: (tx: any) => Promise<any>, signAllTransactions: (txs: any[]) => Promise<any[]>, publicKey: PublicKey) => {
  return {
    connection,
    signTransaction,
    signAllTransactions,
    get publicKey() { return publicKey; }
  };
};

import { useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  Connection
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import BN from 'bn.js';
import bs58 from 'bs58';
import { useCallback, useMemo } from 'react';
import { PumpSdk, OnlinePumpSdk, getBuyTokenAmountFromSolAmount, getSellSolAmountFromTokenAmount } from '@pump-fun/pump-sdk';
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  initializeConnection, 
  loadPumpAddresses, 
  getNextPumpAddress,
  fetchDeployedTokens,
  fetchTransactionHistory,
  setCreatedTokenMint,
  setLoading,
  clearError,
  addCreatedToken,
  type CreateTokenRequest,
  type BuyTokenRequest,
  type SellTokenRequest,
  type TransactionResponse,
  type VanityKeypair,
  type CreatedToken,
  type DeployedToken
} from '@/lib/store/slices/pumpFunSlice';

// Export types
export type { CreateTokenRequest, BuyTokenRequest, SellTokenRequest, TransactionResponse, CreatedToken, DeployedToken };

// Pump.fun Program Constants (Mainnet)
const PUMP_FUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
const PUMPSWAP_PROGRAM_ID = new PublicKey('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA');
const PUMP_FUN_RAYDIUM_MIGRATION = new PublicKey('39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg');
const JITO_TIP_PROGRAM_ID = new PublicKey('4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2T3');
const JITO_TIP_ACCOUNT = new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhArj8T');
const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
const EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
const RENT_SYSVAR_ID = new PublicKey('SysvarRent111111111111111111111111111111111');
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// PDA Seeds
const GLOBAL_SEED = Buffer.from('global');
const BONDING_CURVE_SEED = Buffer.from('bonding-curve');
const MINT_AUTHORITY_SEED = Buffer.from('mint-authority');

// Helper function to find PDA
function findPDA(seeds: (Buffer | Uint8Array)[], programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(seeds, programId);
}

// Helper function to create wallet adapter for SDK
const createWalletAdapter = (signTransaction: (tx: any) => Promise<any>, signAllTransactions: (txs: any[]) => Promise<any[]>, publicKey: PublicKey): PumpFunWallet => {
  return {
    signTransaction,
    signAllTransactions,
    get publicKey() { return publicKey; }
  };
};


// Helper function to retry RPC calls
async function retryRpcCall<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      // Check if it's a rate limit error
      if (error.message?.includes('403') || error.message?.includes('Access forbidden')) {
        console.warn(`RPC rate limited, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

export function usePumpFunRedux() {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const dispatch = useAppDispatch();
  
  // Redux state
  const {
    connectionEndpoint,
    pumpAddresses,
    pumpAddressStats,
    isLoading,
    isLoadingPumpAddresses,
    createdTokenMint,
    lastTransaction,
    createdTokens,
    deployedTokens,
    isLoadingDeployedTokens,
    transactionHistory,
    isLoadingTransactionHistory,
    error
  } = useAppSelector((state) => state.pumpFun);

  // Create connection locally to avoid serialization issues
  const connection = useMemo(() => {
    if (!connectionEndpoint) return null;
    return new Connection(connectionEndpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }, [connectionEndpoint]);

  // Initialize connection on mount
  const initConnection = useCallback(async () => {
    if (!connection) {
      console.log('🔄 Initializing Solana connection...');
      try {
        await dispatch(initializeConnection());
        console.log('✅ Solana connection initialized');
      } catch (error) {
        console.error('❌ Failed to initialize connection:', error);
        throw error;
      }
    } else {
      console.log('✅ Solana connection already initialized');
    }
  }, [connection, dispatch]);

  // Load pump addresses
  const loadPumpAddressesAction = useCallback(async () => {
    await dispatch(loadPumpAddresses());
  }, [dispatch]);

  // Helper function to convert base58 to Uint8Array
  const base58ToUint8Array = useCallback((base58: string): Uint8Array => {
    try {
      return new Uint8Array(bs58.decode(base58));
    } catch (error) {
      throw new Error(`Invalid base58 private key: ${error}`);
    }
  }, []);

  // Create metadata URI
  const createMetadataUri = useCallback((request: CreateTokenRequest): string => {
    const metadata = {
      name: request.name,
      symbol: request.symbol,
      description: request.description,
      image: request.image_path || '',
      attributes: [],
      properties: {
        files: [],
        category: 'image'
      }
    };

    const metadataJson = JSON.stringify(metadata);
    const base64Metadata = Buffer.from(metadataJson).toString('base64');
    return `data:application/json;base64,${base64Metadata}`;
  }, []);

  // Create token using latest-pumpfun-sdk (create-only)
  const createToken = useCallback(async (request: CreateTokenRequest): Promise<TransactionResponse> => {
    console.log('🔍 Create token debug:', {
      connected,
      publicKey: publicKey?.toString(),
      hasSignTransaction: !!signTransaction,
      hasSendTransaction: !!sendTransaction,
      hasConnection: !!connection
    });

    if (!connected) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }
    
    if (!publicKey) {
      throw new Error('Wallet public key not available.');
    }
    
    if (!signTransaction) {
      throw new Error('Wallet does not support transaction signing.');
    }
    
    if (!sendTransaction) {
      throw new Error('Wallet does not support transaction sending.');
    }
    
    if (!connection) {
      console.log('🔄 Connection not initialized, initializing now...');
      try {
        await initConnection();
        // Re-check connection after initialization
        if (!connection) {
          throw new Error('Failed to initialize Solana connection. Please refresh the page and try again.');
        }
      } catch (error) {
        console.error('❌ Connection initialization failed:', error);
        throw new Error('Failed to initialize Solana connection. Please refresh the page and try again.');
      }
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      // Get a pump address from our pre-loaded pool
      const pumpAddressResult = await dispatch(getNextPumpAddress());
      if (getNextPumpAddress.rejected.match(pumpAddressResult)) {
        throw new Error('No pump addresses available. Please refresh the page to reload addresses.');
      }

      const pumpAddress = pumpAddressResult.payload as { public_key: string; private_key: string };

      // Convert pump private key to keypair
      const privateKeyBytes = base58ToUint8Array(pumpAddress.private_key);
      const mintKeypair = Keypair.fromSecretKey(privateKeyBytes);
      const mintPubkey = mintKeypair.publicKey;

      // Using vanity address as mint

      // Create metadata URI
      const metadataUri = createMetadataUri(request);

      // Create provider for Pump.fun SDK
      const provider = createProvider(connection, signTransaction, async (txs) => {
        return Promise.all(txs.map(tx => signTransaction(tx)));
      }, publicKey);
      
      // Use official Pump.fun SDK
      const sdk = new PumpSdk();

      const createInstruction = await sdk.createInstruction({
        mint: mintPubkey,
        name: request.name,
        symbol: request.symbol,
        uri: metadataUri,
        creator: provider.publicKey,
        user: provider.publicKey,
      });

      const createRes = { success: true, data: createInstruction };

      // Handle response
      let signature: string;
      if (createRes.data) {
        const transaction = new Transaction();
        transaction.add(createRes.data);

        // Transaction prepared for sending

        // Set recent blockhash with retry logic
        const blockhashResult = await retryRpcCall(() => connection.getLatestBlockhash());
        transaction.recentBlockhash = blockhashResult.blockhash;
        transaction.feePayer = publicKey;

        // Partial-sign mint and then wallet signs and sends
        
        transaction.partialSign(mintKeypair);
        
        // Transaction partially signed
        
        const signedTransaction = await signTransaction(transaction);
        signature = await retryRpcCall(() => sendTransaction(signedTransaction, connection));
      } else {
        throw new Error('Invalid response from SDK - expected instruction');
      }

      // Token created successfully
      
      const result = {
        signature: signature,
        mint: mintPubkey.toString()
      };

      // Update Redux state
      dispatch(setCreatedTokenMint(result.mint));
      
      // Add to created tokens list
      const createdToken: CreatedToken = {
        mint: result.mint,
        name: request.name,
        symbol: request.symbol,
        createdAt: Date.now(),
        creator: publicKey.toString(),
        signature: result.signature
      };
      dispatch(addCreatedToken(createdToken));
      
      return result;

    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [connected, publicKey, signTransaction, sendTransaction, connection, dispatch, base58ToUint8Array, createMetadataUri]);

  // Create and immediately buy in a single transaction using latest-pumpfun-sdk
  const createAndBuy = useCallback(
    async (request: CreateTokenRequest, buyAmountSol: number): Promise<TransactionResponse> => {
      if (!connected || !publicKey || !signTransaction || !sendTransaction) {
        throw new Error('Wallet not connected or does not support signing');
      }
      if (buyAmountSol <= 0) {
        // Fallback to create only
        return await createToken(request);
      }

      if (!connection) {
        await initConnection();
        if (!connection) throw new Error('Failed to initialize Solana connection. Please retry.');
      }

      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        // Get vanity pump address as mint
        const pumpAddressResult = await dispatch(getNextPumpAddress());
        if (getNextPumpAddress.rejected.match(pumpAddressResult)) {
          throw new Error('No pump addresses available. Please refresh to reload addresses.');
        }
        const pumpAddress: { public_key: string; private_key: string } = pumpAddressResult.payload as any;
        const mintKeypair = Keypair.fromSecretKey(base58ToUint8Array(pumpAddress.private_key));
        const mintPubkey = mintKeypair.publicKey;

        // Build metadata URI
        const metadataUri = createMetadataUri(request);

        // Create provider for Pump.fun SDK
        const provider = createProvider(connection, signTransaction, async (txs) => {
          return Promise.all(txs.map(tx => signTransaction(tx)));
        }, publicKey);
        
        // Use official Pump.fun SDK
        const onlineSdk = new OnlinePumpSdk(connection);
        const sdk = new PumpSdk();

        // Fetch global data first
        const global = await onlineSdk.fetchGlobal();
        const solAmount = new BN(Math.floor(buyAmountSol * LAMPORTS_PER_SOL));

        // Use the SDK's createAndBuyInstructions method
        const instructions = await sdk.createAndBuyInstructions({
          global,
          mint: mintPubkey,
          name: request.name,
          symbol: request.symbol,
          uri: metadataUri,
          creator: provider.publicKey,
          user: provider.publicKey,
          solAmount,
          amount: getBuyTokenAmountFromSolAmount({
            global,
            feeConfig: null,
            mintSupply: null,
            bondingCurve: null,
            amount: solAmount,
          }),
        });

        const allInstructions = instructions;

        // Handle response
        let signature: string;
        if (allInstructions && Array.isArray(allInstructions)) {
          const transaction = new Transaction();
          allInstructions.forEach(ix => transaction.add(ix));

          const { blockhash } = await retryRpcCall(() => connection.getLatestBlockhash());
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;

          // Partial sign with the mint keypair, then wallet signs and sends
          transaction.partialSign(mintKeypair);
          const signed = await signTransaction(transaction);
          signature = await retryRpcCall(() => sendTransaction(signed, connection));
        } else {
          throw new Error('Invalid response from SDK - expected instructions');
        }

        const result = { signature, mint: mintPubkey.toString() };
        dispatch(setCreatedTokenMint(result.mint));
        
        // Add to created tokens list
        const createdToken: CreatedToken = {
          mint: result.mint,
          name: request.name,
          symbol: request.symbol,
          createdAt: Date.now(),
          creator: publicKey.toString(),
          signature: result.signature
        };
        dispatch(addCreatedToken(createdToken));
        
        return result;
      } catch (error) {
        console.error('Error in createAndBuy:', error);
        throw error as Error;
      } finally {
        dispatch(setLoading(false));
      }
    }, [connected, publicKey, signTransaction, sendTransaction, connection, initConnection, dispatch, base58ToUint8Array, createMetadataUri, createToken]
  );

  // Buy token using latest-pumpfun-sdk
  const buyToken = useCallback(async (request: BuyTokenRequest): Promise<TransactionResponse> => {
    if (!connected || !publicKey || !signTransaction || !sendTransaction || !connection) {
      throw new Error('Wallet not connected or connection not initialized');
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const mintPubkey = new PublicKey(request.mint);
      
      // Create provider for Pump.fun SDK
      const provider = createProvider(connection, signTransaction, async (txs) => {
        return Promise.all(txs.map(tx => signTransaction(tx)));
      }, publicKey);
      
      // Use official Pump.fun SDK
      const onlineSdk = new OnlinePumpSdk(connection);
      const sdk = new PumpSdk();

      // Fetch required data
      const global = await onlineSdk.fetchGlobal();
      const { bondingCurveAccountInfo, bondingCurve, associatedUserAccountInfo } = await onlineSdk.fetchBuyState(mintPubkey, provider.publicKey);
      const solAmount = new BN(Math.floor(request.amount_sol * LAMPORTS_PER_SOL));

      const buyInstructions = await sdk.buyInstructions({
        global,
        bondingCurveAccountInfo,
        bondingCurve,
        associatedUserAccountInfo,
        mint: mintPubkey,
        user: provider.publicKey,
        solAmount,
        amount: getBuyTokenAmountFromSolAmount({
          global,
          feeConfig: null,
          mintSupply: global.tokenTotalSupply,
          bondingCurve,
          amount: solAmount,
        }),
        slippage: 1,
      });

      // Handle response
      const transaction = new Transaction();
      buyInstructions.forEach(ix => transaction.add(ix));

        // Set recent blockhash with retry logic
        const blockhashResult = await retryRpcCall(() => connection.getLatestBlockhash());
        transaction.recentBlockhash = blockhashResult.blockhash;
        transaction.feePayer = publicKey;

        // Sign and send the transaction with retry logic
        const signedTransaction = await signTransaction(transaction);
        const signature = await retryRpcCall(() => sendTransaction(signedTransaction, connection));

        const result = {
          signature: signature,
          mint: request.mint
        };

        return result;

    } catch (error) {
      console.error('Error buying token:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [connected, publicKey, signTransaction, sendTransaction, connection, dispatch]);

  // Sell token using latest-pumpfun-sdk
  const sellToken = useCallback(async (request: SellTokenRequest): Promise<TransactionResponse> => {
    if (!connected || !publicKey || !signTransaction || !sendTransaction || !connection) {
      throw new Error('Wallet not connected or connection not initialized');
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const mintPubkey = new PublicKey(request.mint);
      
      // Create provider for Pump.fun SDK
      const provider = createProvider(connection, signTransaction, async (txs) => {
        return Promise.all(txs.map(tx => signTransaction(tx)));
      }, publicKey);
      
      // Use official Pump.fun SDK
      const onlineSdk = new OnlinePumpSdk(connection);
      const sdk = new PumpSdk();

      // Fetch required data
      const global = await onlineSdk.fetchGlobal();
      const { bondingCurveAccountInfo, bondingCurve } = await onlineSdk.fetchSellState(mintPubkey, provider.publicKey);

      let amountBN: BN;
      if (request.sell_all || !request.amount_tokens) {
        amountBN = new BN(0); // 0 = sell all
      } else {
        // Pump.fun tokens are 6 decimals
        amountBN = new BN(Math.floor(request.amount_tokens * 1_000_000));
      }

      const sellInstructions = await sdk.sellInstructions({
        global,
        bondingCurveAccountInfo,
        bondingCurve,
        mint: mintPubkey,
        user: provider.publicKey,
        amount: amountBN,
        solAmount: getSellSolAmountFromTokenAmount({
          global,
          feeConfig: null,
          mintSupply: global.tokenTotalSupply,
          bondingCurve,
          amount: amountBN,
        }),
        slippage: 1,
      });

      // Handle response
      const transaction = new Transaction();
      sellInstructions.forEach(ix => transaction.add(ix));

        // Set recent blockhash with retry logic
        const blockhashResult = await retryRpcCall(() => connection.getLatestBlockhash());
        transaction.recentBlockhash = blockhashResult.blockhash;
        transaction.feePayer = publicKey;

        // Sign and send the transaction with retry logic
        const signedTransaction = await signTransaction(transaction);
        const signature = await retryRpcCall(() => sendTransaction(signedTransaction, connection));

        const result = {
          signature: signature,
          mint: request.mint
        };

        return result;

    } catch (error) {
      console.error('Error selling token:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [connected, publicKey, signTransaction, sendTransaction, connection, dispatch]);

  // Fetch token balance
  const fetchTokenBalance = useCallback(async (mintAddress: string): Promise<number> => {
    if (!connected || !publicKey || !connection) {
      return 0;
    }

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const tokenAccount = getAssociatedTokenAddressSync(mintPubkey, publicKey, true);
      
      const accountInfo = await getAccount(connection, tokenAccount);
      return Number(accountInfo.amount) / Math.pow(10, 6); // Pump.fun tokens are 6 decimals
    } catch (error) {
      console.log('Token account not found or error:', error);
      return 0;
    }
  }, [connected, publicKey, connection]);

  // Fetch SOL balance
  const fetchSolBalance = useCallback(async (): Promise<number> => {
    if (!connected || !publicKey || !connection) {
      return 0;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }, [connected, publicKey, connection]);

  // Claim creator fees
  const claimFees = useCallback(async (mintAddress: string): Promise<TransactionResponse> => {
    if (!connected || !publicKey || !signTransaction || !sendTransaction || !connection) {
      throw new Error('Wallet not connected or connection not initialized');
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const mintPubkey = new PublicKey(mintAddress);
      
      // Create provider for Pump.fun SDK
      const provider = createProvider(connection, signTransaction, async (txs) => {
        return Promise.all(txs.map(tx => signTransaction(tx)));
      }, publicKey);
      
      // Use official Pump.fun SDK
      const onlineSdk = new OnlinePumpSdk(connection);
      const sdk = new PumpSdk();

      // Create claim instruction using OnlinePumpSdk
      const claimInstructions = await onlineSdk.collectCoinCreatorFeeInstructions(provider.publicKey);

      // Handle response
      const transaction = new Transaction();
      claimInstructions.forEach(ix => transaction.add(ix));

      // Set recent blockhash with retry logic
      const blockhashResult = await retryRpcCall(() => connection.getLatestBlockhash());
      transaction.recentBlockhash = blockhashResult.blockhash;
      transaction.feePayer = publicKey;

      // Sign and send the transaction with retry logic
      const signedTransaction = await signTransaction(transaction);
      const signature = await retryRpcCall(() => sendTransaction(signedTransaction, connection));

      const result = {
        signature: signature,
        mint: mintAddress
      };

      return result;

    } catch (error) {
      console.error('Error claiming fees:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [connected, publicKey, signTransaction, sendTransaction, connection, dispatch]);

  // Set selected token mint
  const setSelectedTokenMint = useCallback((mint: string | null) => {
    dispatch(setCreatedTokenMint(mint));
  }, [dispatch]);

  // Fetch deployed tokens action
  const fetchDeployedTokensAction = useCallback(async () => {
    if (!connected || !publicKey) {
      return;
    }
    
    try {
      await dispatch(fetchDeployedTokens(publicKey.toString()));
    } catch (error) {
      console.error('Error fetching deployed tokens:', error);
    }
  }, [connected, publicKey, dispatch]);

  // Fetch transaction history action
  const fetchTransactionHistoryAction = useCallback(async () => {
    if (!connected || !publicKey) {
      return;
    }
    
    try {
      // Fetching transaction history
      await dispatch(fetchTransactionHistory(publicKey.toString()));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }, [connected, publicKey, dispatch]);

  // Filter pump addresses to exclude used ones
  const availablePumpAddresses = useMemo(() => {
    if (!deployedTokens.length) {
      return pumpAddresses;
    }
    
    const usedAddresses = new Set(deployedTokens.map(token => token.pumpAddress));
    return pumpAddresses.filter(addr => !usedAddresses.has(addr.public_key));
  }, [pumpAddresses, deployedTokens]);

  // Updated pump address stats
  const updatedPumpAddressStats = useMemo(() => ({
    ...pumpAddressStats,
    pool_size: availablePumpAddresses.length,
    used_addresses: pumpAddresses.length - availablePumpAddresses.length
  }), [pumpAddressStats, availablePumpAddresses, pumpAddresses.length]);

  return {
    // State
    connection,
    pumpAddresses: availablePumpAddresses,
    pumpAddressStats: updatedPumpAddressStats,
    isLoading,
    isLoadingPumpAddresses,
    createdTokenMint,
    lastTransaction,
    createdTokens,
    deployedTokens,
    isLoadingDeployedTokens,
    transactionHistory,
    isLoadingTransactionHistory,
    error,
    connected,
    publicKey,
    
    // Actions
    initConnection,
    loadPumpAddresses: loadPumpAddressesAction,
    createToken,
    createAndBuy,
    buyToken,
    sellToken,
    fetchTokenBalance,
    fetchSolBalance,
    claimFees,
    setSelectedTokenMint,
    fetchDeployedTokens: fetchDeployedTokensAction,
    fetchTransactionHistory: fetchTransactionHistoryAction,
    clearError: () => dispatch(clearError()),
  };
}
