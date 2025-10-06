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
  // DexScreener data
  priceUsd?: string;
  liquidity?: number;
  volume24h?: number;
  priceChange24h?: number;
  marketCap?: number;
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
    suffix: 'pump',
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
      'https://mainnet.helius-rpc.com/?api-key=270884b0-cb80-4b6d-8a2f-372de3c6774e', // Helius fallback
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
export const loadPumpAddresses = createAsyncThunk('pumpFun/loadPumpAddresses', async () => {
  const response = await fetch('/test_pump.json');
  if (!response.ok) {
    throw new Error('Failed to load pump addresses');
  }
  const data = await response.json();
  return data.keypairs || [];
});

// Get next pump address (with on-chain verification)
export const getNextPumpAddress = createAsyncThunk(
  'pumpFun/getNextPumpAddress',
  async (_, { getState }) => {
    const state = getState() as { pumpFun: PumpFunState };
    let addresses = [...state.pumpFun.pumpAddresses]; // Create a copy
    
    if (addresses.length === 0) {
      throw new Error('No pump addresses available');
    }
    
    // Check if the next address has already been used on-chain
    const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'f7c74abc-20d1-450d-b655-64f460fd5856';
    const maxAttempts = 10; // Try up to 10 addresses before giving up
    const skippedAddresses: string[] = [];
    
    for (let attempt = 0; attempt < maxAttempts && addresses.length > 0; attempt++) {
      const candidateAddress = addresses[addresses.length - 1];
      
      try {
        // Query Helius to check if this address has been used as a mint
        const response = await fetch(
          `https://api.helius.xyz/v0/addresses/${candidateAddress.public_key}/transactions?api-key=${heliusApiKey}&limit=10`
        );
        
        if (response.ok) {
          const transactions = await response.json();
          console.log(`🔍 Checking address ${candidateAddress.public_key.slice(0, 8)}... - Found ${transactions.length} transactions`);
          
          // Check if any transactions involve Pump.fun program (token creation)
          const hasPumpFunActivity = transactions.some((tx: any) => 
            tx.accountData?.some((acc: any) => acc.account === '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
          );
          
          if (hasPumpFunActivity) {
            console.log(`⚠️ Address ${candidateAddress.public_key.slice(0, 8)} already used on-chain, skipping...`);
            // Track skipped address and try the next one
            skippedAddresses.push(candidateAddress.public_key);
            addresses = addresses.slice(0, -1);
            continue;
          } else {
            console.log(`✅ Address ${candidateAddress.public_key.slice(0, 8)} is available!`);
            return {
              address: candidateAddress,
              skippedAddresses
            };
          }
        } else {
          // If API call fails, assume address is available (fallback)
          console.log(`⚠️ Could not verify address ${candidateAddress.public_key.slice(0, 8)}, using anyway`);
          return {
            address: candidateAddress,
            skippedAddresses
          };
        }
      } catch (error) {
        console.error('Error checking address:', error);
        // On error, use the address anyway (fallback)
        return {
          address: candidateAddress,
          skippedAddresses
        };
      }
    }
    
    // If we've checked all addresses and they're all used, throw error
    throw new Error('No unused pump addresses available. All addresses in pool have been used.');
  }
);

// Helper function to fetch on-chain token metadata
async function fetchOnChainMetadata(connection: Connection, mintAddress: string) {
  try {
    const mintPubkey = new PublicKey(mintAddress);

    // Try to fetch metadata from Metaplex standard
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

    // Derive metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      METADATA_PROGRAM_ID
    );

    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (!accountInfo) return null;

    // Simple metadata parsing (name and symbol are at fixed offsets)
    const data = accountInfo.data;
    let offset = 1 + 32 + 32; // Skip key, update authority, mint

    // Read name (u32 length + string)
    const nameLength = data.readUInt32LE(offset);
    offset += 4;
    const name = data
      .slice(offset, offset + nameLength)
      .toString('utf8')
      .replace(/\0/g, '')
      .trim();
    offset += nameLength;

    // Read symbol (u32 length + string)
    const symbolLength = data.readUInt32LE(offset);
    offset += 4;
    const symbol = data
      .slice(offset, offset + symbolLength)
      .toString('utf8')
      .replace(/\0/g, '')
      .trim();

    return { name, symbol };
  } catch (error) {
    console.error('Error fetching on-chain metadata:', error);
    return null;
  }
}

// Fetch deployed tokens from local storage (created tokens)
export const fetchDeployedTokens = createAsyncThunk(
  'pumpFun/fetchDeployedTokens',
  async (creatorPublicKey: string, { getState, rejectWithValue }) => {
    try {
      // Use locally stored created tokens instead of external API
      const state = getState() as { pumpFun: PumpFunState };
      const createdTokens = state.pumpFun.createdTokens;

      // Filter tokens created by the current wallet
      const userTokens = createdTokens.filter(
        (token: CreatedToken) => token.creator === creatorPublicKey
      );

      // Deduplicate by mint address
      const uniqueTokens = Array.from(
        new Map(userTokens.map((token) => [token.mint, token])).values()
      );

      // Get connection from state
      const connectionEndpoint = state.pumpFun.connectionEndpoint;
      if (!connectionEndpoint) {
        // Return tokens without metadata enrichment
        return uniqueTokens.map((token: CreatedToken) => ({
          mint: token.mint,
          name: token.name,
          symbol: token.symbol,
          createdAt: token.createdAt,
          creator: token.creator,
          pumpAddress: token.mint,
        }));
      }

      const connection = new Connection(connectionEndpoint);

      // Fetch on-chain metadata for each token
      const tokensWithMetadata = await Promise.all(
        uniqueTokens.map(async (token: CreatedToken) => {
          const metadata = await fetchOnChainMetadata(connection, token.mint);

          return {
            mint: token.mint,
            name: metadata?.name || token.name,
            symbol: metadata?.symbol || token.symbol,
            createdAt: token.createdAt,
            creator: token.creator,
            pumpAddress: token.mint,
          };
        })
      );

      // Fetch DexScreener data for all tokens using correct API
      try {
        const tokenAddresses = tokensWithMetadata.map((t) => t.mint).join(',');
        // Correct endpoint: v1 API with chainId 'solana'
        const response = await fetch(
          `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('DexScreener response:', data);

          // Merge DexScreener data - v1 API returns array of pairs
          return tokensWithMetadata.map((token) => {
            // Find the pair where baseToken.address matches our token mint
            const dexPair = data?.find((item: any) => item.baseToken?.address === token.mint);

            return {
              ...token,
              // Use actual token name/symbol from DexScreener if available
              name: dexPair?.baseToken?.name || token.name,
              symbol: dexPair?.baseToken?.symbol || token.symbol,
              priceUsd: dexPair?.priceUsd,
              liquidity: dexPair?.liquidity?.usd,
              volume24h: dexPair?.volume?.h24,
              priceChange24h: dexPair?.priceChange?.h24,
              marketCap: dexPair?.marketCap || dexPair?.fdv,
            };
          });
        } else {
          console.error('DexScreener API error:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching DexScreener data:', error);
      }

      return tokensWithMetadata;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Refresh token metadata from DexScreener (only when user clicks refresh)
export const refreshTokenMetadata = createAsyncThunk(
  'pumpFun/refreshTokenMetadata',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pumpFun: PumpFunState };
      const deployedTokens = state.pumpFun.deployedTokens;

      if (deployedTokens.length === 0) {
        return [];
      }

      const tokenAddresses = deployedTokens.map((t) => t.mint).join(',');

      // Use correct DexScreener v1 API endpoint
      const response = await fetch(
        `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DexScreener API error:', response.status, errorText);
        throw new Error('Failed to fetch from DexScreener');
      }

      const data = await response.json();
      console.log('DexScreener refresh response:', data);

      // Merge DexScreener data with existing tokens - v1 API returns array of pairs
      return deployedTokens.map((token: DeployedToken) => {
        // Find the pair where baseToken.address matches our token mint
        const dexPair = data?.find((item: any) => item.baseToken?.address === token.mint);

        return {
          ...token,
          // Use actual token name/symbol from DexScreener if available
          name: dexPair?.baseToken?.name || token.name,
          symbol: dexPair?.baseToken?.symbol || token.symbol,
          priceUsd: dexPair?.priceUsd,
          liquidity: dexPair?.liquidity?.usd,
          volume24h: dexPair?.volume?.h24,
          priceChange24h: dexPair?.priceChange?.h24,
          marketCap: dexPair?.marketCap || dexPair?.fdv,
        };
      });
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
          },
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
        const hasPumpFunProgram = tx.instructions?.some(
          (instruction: any) => instruction.programId === PUMP_FUN_PROGRAM_ID
        );

        if (!hasPumpFunProgram) return false;

        // Check transaction description for create patterns
        const hasCreateDescription =
          tx.description?.toLowerCase().includes('create') ||
          tx.description?.toLowerCase().includes('token') ||
          tx.description?.toLowerCase().includes('mint');

        // Check transaction type for create patterns
        const hasCreateType =
          tx.type?.toLowerCase().includes('create') || tx.type?.toLowerCase().includes('mint');

        // Look for create instruction patterns in instruction data
        const hasCreateInstruction = tx.instructions?.some(
          (instruction: any) =>
            instruction.programId === PUMP_FUN_PROGRAM_ID &&
            // Check instruction data for create patterns
            (instruction.data?.includes('create') ||
              // Check inner instructions for create patterns
              instruction.innerInstructions?.some((inner: any) =>
                inner.instructions?.some(
                  (innerInst: any) =>
                    innerInst.programId === PUMP_FUN_PROGRAM_ID &&
                    innerInst.data?.includes('create')
                )
              ))
        );

        // Check for token creation in tokenTransfers (new token mint)
        const hasTokenCreation = tx.tokenTransfers?.some(
          (transfer: any) =>
            transfer.fromUserAccount === null ||
            transfer.fromUserAccount === undefined ||
            transfer.fromTokenAccount === null ||
            transfer.fromTokenAccount === undefined
        );

        // Check for account data changes indicating token creation
        const hasTokenCreationInAccountData = tx.accountData?.some((account: any) =>
          account.tokenBalanceChanges?.some(
            (change: any) =>
              change.rawTokenAmount?.tokenAmount && change.rawTokenAmount?.tokenAmount !== '0'
          )
        );

        return (
          hasCreateDescription ||
          hasCreateType ||
          hasCreateInstruction ||
          hasTokenCreation ||
          hasTokenCreationInAccountData
        );
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
        createdTokens: createdTokens,
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
      const tokenBalanceChange = tx.accountData.find(
        (account: any) => account.tokenBalanceChanges && account.tokenBalanceChanges.length > 0
      );

      if (tokenBalanceChange && tokenBalanceChange.tokenBalanceChanges[0]) {
        mintAccount = tokenBalanceChange.tokenBalanceChanges[0].mint;
      }
    }

    // If still not found, try to extract from instructions
    if (!mintAccount && tx.instructions) {
      const accounts = tx.instructions.flatMap((ix: any) => ix.accounts || []);
      mintAccount = accounts.find(
        (account: any) =>
          account !== userPublicKey && account !== '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
      );
    }

    if (!mintAccount) return null;

    // Extract token name and symbol from description or use defaults
    const name =
      extractTokenNameFromDescription(tx.description) || `Token ${mintAccount.slice(0, 8)}`;
    const symbol =
      extractTokenSymbolFromDescription(tx.description) || mintAccount.slice(0, 4).toUpperCase();

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
      feePayer: tx.feePayer,
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
    /name[:\s]+([^,\n]+)/i,
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
      return words
        .map((word) => word[0])
        .join('')
        .slice(0, 4)
        .toUpperCase();
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
        suffix: 'pump',
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

    // Add created token (with deduplication)
    addCreatedToken: (state, action: PayloadAction<CreatedToken>) => {
      // Check if token already exists
      const exists = state.createdTokens.find((t) => t.mint === action.payload.mint);
      if (!exists) {
        state.createdTokens.unshift(action.payload); // Add to beginning
      }
    },

    // Clear created tokens
    clearCreatedTokens: (state) => {
      state.createdTokens = [];
    },

    // Deduplicate existing tokens (run on app init to clean up persisted state)
    deduplicateTokens: (state) => {
      // Deduplicate createdTokens
      state.createdTokens = Array.from(
        new Map(state.createdTokens.map((token) => [token.mint, token])).values()
      );
      // Deduplicate deployedTokens
      state.deployedTokens = Array.from(
        new Map(state.deployedTokens.map((token) => [token.mint, token])).values()
      );
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
          suffix: 'pump',
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
        // Remove the used address and any skipped addresses
        const { address, skippedAddresses } = action.payload;
        const addressesToRemove = new Set([address.public_key, ...skippedAddresses]);
        
        state.pumpAddresses = state.pumpAddresses.filter(addr => !addressesToRemove.has(addr.public_key));
        state.pumpAddressStats.pool_size = state.pumpAddresses.length;
        
        if (skippedAddresses.length > 0) {
          console.log(`⚠️ Removed ${skippedAddresses.length} already-used addresses from pool`);
        }
        console.log(`✅ Using address ${address.public_key.slice(0, 8)}, ${state.pumpAddresses.length} addresses remaining`);
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
        // Deduplicate tokens by mint address
        const uniqueTokens = Array.from(
          new Map(action.payload.map((token: DeployedToken) => [token.mint, token])).values()
        );
        state.deployedTokens = uniqueTokens;
        state.isLoadingDeployedTokens = false;
      })
      .addCase(fetchDeployedTokens.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch deployed tokens';
        state.isLoadingDeployedTokens = false;
      });

    // Refresh token metadata
    builder.addCase(refreshTokenMetadata.fulfilled, (state, action) => {
      state.deployedTokens = action.payload;
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
        const newTokens = action.payload.createdTokens.filter(
          (newToken: DeployedToken) =>
            !state.deployedTokens.find((existing) => existing.mint === newToken.mint)
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
  deduplicateTokens,
  setDeployedTokens,
  setLoadingDeployedTokens,
} = pumpFunSlice.actions;

export default pumpFunSlice.reducer;
