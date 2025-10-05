import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Connection, PublicKey } from '@solana/web3.js';

export interface VanityKeypair {
  public_key: string;
  private_key: string;
}

export interface CreateTokenRequest {
  name: string;
  symbol: string;
  description: string;
  image_path?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface BuyTokenRequest {
  mint: string;
  amount_sol: number;
}

export interface SellTokenRequest {
  mint: string;
  amount_tokens?: number;
  sell_all?: boolean;
}

export interface TransactionResponse {
  signature: string;
  mint?: string;
}

export interface CreatedToken {
  mint: string;
  name: string;
  symbol: string;
  createdAt: number;
  creator: string;
  signature: string;
}

export interface DeployedToken {
  mint: string;
  name: string;
  symbol: string;
  createdAt: number;
  creator: string;
  pumpAddress: string; // The pump address that was used
  description?: string;
  image?: string;
  twitter?: string;
  website?: string;
  signature?: string; // Transaction signature
  slot?: number;
  fee?: number;
  feePayer?: string;
}

interface PumpFunState {
  // Connection state
  connectionEndpoint: string | null;
  
  // Pump addresses
  pumpAddresses: VanityKeypair[];
  pumpAddressStats: {
    pool_size: number;
    suffix: string;
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingPumpAddresses: boolean;
  
  // Transaction states
  createdTokenMint: string | null;
  lastTransaction: TransactionResponse | null;
  
  // Creator tokens tracking
  createdTokens: CreatedToken[];
  deployedTokens: DeployedToken[];
  isLoadingDeployedTokens: boolean;
  
  // Transaction history
  transactionHistory: any[];
  isLoadingTransactionHistory: boolean;
  
  // Error state
  error: string | null;
}

const initialState: PumpFunState = {
  connectionEndpoint: null,
  pumpAddresses: [],
  pumpAddressStats: {
    pool_size: 0,
    suffix: 'pump'
  },
  isLoading: false,
  isLoadingPumpAddresses: false,
  createdTokenMint: null,
  lastTransaction: null,
  createdTokens: [],
  deployedTokens: [],
  isLoadingDeployedTokens: false,
  transactionHistory: [],
  isLoadingTransactionHistory: false,
  error: null,
};

// Initialize connection
export const initializeConnection = createAsyncThunk(
  'pumpFun/initializeConnection',
  async (rpcUrl?: string) => {
    // List of reliable RPC endpoints - using your Helius endpoints
    const rpcEndpoints = [
      rpcUrl,
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      'https://api.mainnet-beta.solana.com' // Fallback
    ].filter(Boolean);

    // Try each endpoint until one works
    for (const endpoint of rpcEndpoints) {
      try {
        const connection = new Connection(endpoint as string, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 60000,
        });
        
        // Test the connection
        await connection.getLatestBlockhash();
        console.log('✅ Connected to RPC:', endpoint);
        return endpoint as string;
      } catch (error) {
        console.warn('❌ Failed to connect to RPC:', endpoint, error);
        continue;
      }
    }
    
    throw new Error('Failed to connect to any Solana RPC endpoint');
  }
);

// Load pump addresses
export const loadPumpAddresses = createAsyncThunk(
  'pumpFun/loadPumpAddresses',
  async () => {
    const response = await fetch('/test_pump.json');
    if (!response.ok) {
      throw new Error('Failed to load pump addresses');
    }
    const data = await response.json();
    return data.keypairs || [];
  }
);

// Get next pump address
export const getNextPumpAddress = createAsyncThunk(
  'pumpFun/getNextPumpAddress',
  async (_, { getState }) => {
    const state = getState() as { pumpFun: PumpFunState };
    const addresses = state.pumpFun.pumpAddresses;
    
    if (addresses.length === 0) {
      throw new Error('No pump addresses available');
    }
    
    return addresses[addresses.length - 1];
  }
);

// Fetch deployed tokens from Pump.fun
export const fetchDeployedTokens = createAsyncThunk(
  'pumpFun/fetchDeployedTokens',
  async (creatorPublicKey: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://frontend-api.pump.fun/coins?order=recent&limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch deployed tokens');
      }
      
      const data = await response.json();
      
      // Filter tokens created by the current wallet
      const userTokens = data.filter((token: any) => 
        token.creator === creatorPublicKey
      );
      
      return userTokens.map((token: any) => ({
        mint: token.mint,
        name: token.name,
        symbol: token.symbol,
        createdAt: new Date(token.created_timestamp).getTime(),
        creator: token.creator,
        pumpAddress: token.mint // In Pump.fun, the mint IS the pump address
      }));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Fetch transaction history from Helius API to detect Pump.fun interactions
export const fetchTransactionHistory = createAsyncThunk(
  'pumpFun/fetchTransactionHistory',
  async (userPublicKey: string, { rejectWithValue }) => {
    try {
      const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
      if (!heliusApiKey) {
        throw new Error('Helius API key not configured');
      }
      
      const response = await fetch(
        `https://api.helius.xyz/v0/addresses/${userPublicKey}/transactions/?api-key=${heliusApiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data = await response.json();
      
      // Pump.fun program ID
      const PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
      
      // Filter transactions to extract only create events from Pump.fun
      const createTransactions = data.filter((tx: any) => {
        // Check if transaction involves Pump.fun program
        const hasPumpFunProgram = tx.instructions?.some((instruction: any) => 
          instruction.programId === PUMP_FUN_PROGRAM_ID
        );
        
        if (!hasPumpFunProgram) return false;
        
        // Check transaction description for create patterns
        const hasCreateDescription = tx.description?.toLowerCase().includes('create') ||
          tx.description?.toLowerCase().includes('token') ||
          tx.description?.toLowerCase().includes('mint');
        
        // Check transaction type for create patterns
        const hasCreateType = tx.type?.toLowerCase().includes('create') ||
          tx.type?.toLowerCase().includes('mint');
        
        // Look for create instruction patterns in instruction data
        const hasCreateInstruction = tx.instructions?.some((instruction: any) => 
          instruction.programId === PUMP_FUN_PROGRAM_ID && (
            // Check instruction data for create patterns
            instruction.data?.includes('create') ||
            // Check inner instructions for create patterns
            instruction.innerInstructions?.some((inner: any) => 
              inner.instructions?.some((innerInst: any) => 
                innerInst.programId === PUMP_FUN_PROGRAM_ID && 
                innerInst.data?.includes('create')
              )
            )
          )
        );
        
        // Check for token creation in tokenTransfers (new token mint)
        const hasTokenCreation = tx.tokenTransfers?.some((transfer: any) => 
          transfer.fromUserAccount === null || transfer.fromUserAccount === undefined ||
          transfer.fromTokenAccount === null || transfer.fromTokenAccount === undefined
        );
        
        // Check for account data changes indicating token creation
        const hasTokenCreationInAccountData = tx.accountData?.some((account: any) => 
          account.tokenBalanceChanges?.some((change: any) => 
            change.rawTokenAmount?.tokenAmount && 
            change.rawTokenAmount?.tokenAmount !== "0"
          )
        );
        
        return hasCreateDescription || hasCreateType || hasCreateInstruction || hasTokenCreation || hasTokenCreationInAccountData;
      });
      
      // Extract token creation transactions
      const createdTokens: DeployedToken[] = [];
      
      createTransactions.forEach((tx: any) => {
        // Extract token information from transaction
        const tokenInfo = extractTokenInfoFromTransaction(tx, userPublicKey);
        if (tokenInfo) {
          createdTokens.push(tokenInfo);
        }
      });
      
      return {
        transactions: createTransactions,
        createdTokens: createdTokens
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Helper function to extract token info from transaction
function extractTokenInfoFromTransaction(tx: any, userPublicKey: string): DeployedToken | null {
  try {
    // Extract mint address from tokenTransfers
    let mintAccount = null;
    
    if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
      // Find the mint from token transfers
      mintAccount = tx.tokenTransfers[0].mint;
    }
    
    // If not found in tokenTransfers, try to extract from accountData
    if (!mintAccount && tx.accountData) {
      const tokenBalanceChange = tx.accountData.find((account: any) => 
        account.tokenBalanceChanges && account.tokenBalanceChanges.length > 0
      );
      
      if (tokenBalanceChange && tokenBalanceChange.tokenBalanceChanges[0]) {
        mintAccount = tokenBalanceChange.tokenBalanceChanges[0].mint;
      }
    }
    
    // If still not found, try to extract from instructions
    if (!mintAccount && tx.instructions) {
      const accounts = tx.instructions.flatMap((ix: any) => ix.accounts || []);
      mintAccount = accounts.find((account: any) => 
        account !== userPublicKey && 
        account !== '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
      );
    }
    
    if (!mintAccount) return null;
    
    // Extract token name and symbol from description or use defaults
    const name = extractTokenNameFromDescription(tx.description) || `Token ${mintAccount.slice(0, 8)}`;
    const symbol = extractTokenSymbolFromDescription(tx.description) || mintAccount.slice(0, 4).toUpperCase();
    
    return {
      mint: mintAccount,
      name,
      symbol,
      createdAt: new Date(tx.timestamp * 1000).getTime(),
      creator: userPublicKey,
      pumpAddress: mintAccount,
      description: tx.description,
      signature: tx.signature,
      slot: tx.slot,
      fee: tx.fee,
      feePayer: tx.feePayer
    };
  } catch (error) {
    console.error('Error extracting token info:', error);
    return null;
  }
}

// Helper functions to extract token metadata from description
function extractTokenNameFromDescription(description: string): string | null {
  if (!description) return null;
  
  // Look for patterns like "Create token: TOKEN_NAME" or "Token: TOKEN_NAME"
  const patterns = [
    /create\s+token[:\s]+([^,\n]+)/i,
    /token[:\s]+([^,\n]+)/i,
    /name[:\s]+([^,\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractTokenSymbolFromDescription(description: string): string | null {
  if (!description) return null;
  
  // Look for patterns like "Symbol: SYMBOL" or extract from token name
  const symbolMatch = description.match(/symbol[:\s]+([^,\n]+)/i);
  if (symbolMatch) {
    return symbolMatch[1].trim();
  }
  
  // Try to extract symbol from token name (first word or acronym)
  const name = extractTokenNameFromDescription(description);
  if (name) {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].slice(0, 4).toUpperCase();
    } else {
      return words.map(word => word[0]).join('').slice(0, 4).toUpperCase();
    }
  }
  
  return null;
}

const pumpFunSlice = createSlice({
  name: 'pumpFun',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set created token mint
    setCreatedTokenMint: (state, action: PayloadAction<string | null>) => {
      state.createdTokenMint = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Update pump address stats
    updatePumpAddressStats: (state) => {
      state.pumpAddressStats = {
        pool_size: state.pumpAddresses.length,
        suffix: 'pump'
      };
    },
    
    // Remove used pump address
    removeUsedPumpAddress: (state) => {
      if (state.pumpAddresses.length > 0) {
        state.pumpAddresses.pop();
        state.pumpAddressStats.pool_size = state.pumpAddresses.length;
      }
    },
    
    // Reset state
    resetState: () => initialState,
    
    // Add created token
    addCreatedToken: (state, action: PayloadAction<CreatedToken>) => {
      state.createdTokens.unshift(action.payload); // Add to beginning
    },
    
    // Clear created tokens
    clearCreatedTokens: (state) => {
      state.createdTokens = [];
    },
    
    // Set deployed tokens
    setDeployedTokens: (state, action: PayloadAction<DeployedToken[]>) => {
      state.deployedTokens = action.payload;
    },
    
    // Set loading state for deployed tokens
    setLoadingDeployedTokens: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDeployedTokens = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Initialize connection
    builder
      .addCase(initializeConnection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeConnection.fulfilled, (state, action) => {
        state.connectionEndpoint = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeConnection.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to initialize connection';
        state.isLoading = false;
      });
    
    // Load pump addresses
    builder
      .addCase(loadPumpAddresses.pending, (state) => {
        state.isLoadingPumpAddresses = true;
        state.error = null;
      })
      .addCase(loadPumpAddresses.fulfilled, (state, action) => {
        state.pumpAddresses = action.payload;
        state.pumpAddressStats = {
          pool_size: action.payload.length,
          suffix: 'pump'
        };
        state.isLoadingPumpAddresses = false;
      })
      .addCase(loadPumpAddresses.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load pump addresses';
        state.isLoadingPumpAddresses = false;
      });
    
    // Get next pump address
    builder
      .addCase(getNextPumpAddress.fulfilled, (state, action) => {
        // Remove the used address
        state.pumpAddresses = state.pumpAddresses.slice(0, -1);
        state.pumpAddressStats.pool_size = state.pumpAddresses.length;
      })
      .addCase(getNextPumpAddress.rejected, (state, action) => {
        state.error = action.error.message || 'No pump addresses available';
      });
    
    // Fetch deployed tokens
    builder
      .addCase(fetchDeployedTokens.pending, (state) => {
        state.isLoadingDeployedTokens = true;
        state.error = null;
      })
      .addCase(fetchDeployedTokens.fulfilled, (state, action) => {
        state.deployedTokens = action.payload;
        state.isLoadingDeployedTokens = false;
      })
      .addCase(fetchDeployedTokens.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch deployed tokens';
        state.isLoadingDeployedTokens = false;
      });
    
    // Fetch transaction history
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.isLoadingTransactionHistory = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.transactionHistory = action.payload.transactions;
        // Merge discovered tokens with existing deployed tokens
        const newTokens = action.payload.createdTokens.filter((newToken: DeployedToken) => 
          !state.deployedTokens.find(existing => existing.mint === newToken.mint)
        );
        state.deployedTokens = [...state.deployedTokens, ...newTokens];
        state.isLoadingTransactionHistory = false;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch transaction history';
        state.isLoadingTransactionHistory = false;
      });
  },
});

export const {
  clearError,
  setCreatedTokenMint,
  setLoading,
  updatePumpAddressStats,
  removeUsedPumpAddress,
  resetState,
  addCreatedToken,
  clearCreatedTokens,
  setDeployedTokens,
  setLoadingDeployedTokens,
} = pumpFunSlice.actions;

export default pumpFunSlice.reducer;
