# OnlyPump - Solana Token Creation Platform

A full-stack application for creating and trading meme tokens on Solana using Pump.fun, featuring vanity addresses ending in "pump".

## 🚀 Features

- **Vanity Address Generation**: Pre-generated Solana keypairs ending in "pump"
- **Token Creation**: Deploy tokens on Pump.fun with custom metadata
- **Trading Interface**: Buy/sell tokens directly from the creation page
- **Wallet Integration**: Connect with Solana wallets (Phantom, Solflare, etc.)
- **Real-time Stats**: Track vanity address pool and token performance
- **Transaction History**: View all token creation and trading activity

## 🏗️ Architecture

### Backend (Rust + Axum)
- **API Server**: RESTful API for token operations
- **Vanity Service**: Manages pre-generated vanity addresses
- **Pump.fun Integration**: Uses Pump.fun SDK for token operations
- **Wallet Verification**: Secure signature verification for transactions

### Frontend (Next.js + TypeScript)
- **React Components**: Modern UI with Tailwind CSS
- **Redux Store**: State management for wallet and token data
- **Wallet Integration**: Solana wallet connection and signing
- **Real-time Updates**: Live data from backend API

## 📁 Project Structure

```
backend-rs/
├── src/
│   ├── main.rs              # Main API server
│   ├── vanity.rs            # Vanity address service
│   └── generate_pump.rs      # Vanity address generator
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Home page
│   │   ├── create-seamless/ # Token creation page
│   │   └── tokens/          # Token management
│   ├── components/           # React components
│   ├── lib/                 # Utilities and hooks
│   └── public/
│       └── test_pump.json   # Pre-generated vanity addresses (215 addresses)
├── consolidate-addresses.js # Utility to consolidate address batches
├── start_backend.sh         # Backend startup script
└── README.md
```

## 🔧 How It Works

### 1. Vanity Address System

The platform uses pre-generated Solana keypairs ending in "pump" for memorable token addresses:

```json
{
  "suffix": "pump",
  "count": 2,
  "keypairs": [
    {
      "public_key": "8eVjPHYirFhbeT5jwV9fydxFmpqeeKWbu7U2N2cMpump",
      "private_key": "461ukFycU7EdhUhnbhHCLZXVLZcS2YNwAHECZBbamv2zvQeZXwmsc1Ciy9ViEspWkRNAZcUQgSKZ3w4QkatsiUfY"
    }
  ]
}
```

**Generation Process:**
- Uses `generate_pump.rs` to create vanity addresses
- Parallel keypair generation with `rayon` for speed
- Filters addresses ending with "pump" suffix
- Stores in JSON format for easy access

**Address Tracking:**
- Frontend loads addresses from `frontend/public/test_pump.json`
- Used addresses are automatically tracked via `deployedTokens`
- System filters out previously used addresses
- Stats show: `available = total - used`
- Each token creation consumes one address from the pool

**Generating More Addresses:**
```bash
# Generate 1000 new addresses in batches of 5
cargo run --bin generate_pump 1000 5 new_addresses.json

# Consolidate into the format used by frontend
node consolidate-addresses.js new_addresses.json frontend/public/test_pump.json
```

**Expected Performance:**
- **4-char suffix**: ~113,000 attempts per address (~1-2 seconds per address)
- **1000 addresses**: ~30-60 minutes on modern CPU
- Uses all CPU cores for maximum speed

### 2. Token Creation Flow

1. **Frontend**: User connects wallet and fills token details
2. **Address Selection**: System selects next available vanity address
3. **Metadata Creation**: Token name, symbol, description, social links
4. **Pump.fun Deployment**: Creates token with bonding curve
5. **Confirmation**: Returns transaction signature and mint address

### 3. Trading Integration

- **Buy Tokens**: Purchase tokens with SOL
- **Sell Tokens**: Sell tokens back to bonding curve
- **Real-time Pricing**: Live price updates from Pump.fun
- **Balance Tracking**: Monitor SOL and token balances

## 🚀 Getting Started

### Prerequisites

- Rust 1.70+
- Node.js 18+
- Solana CLI (for vanity generation)
- Phantom or other Solana wallet

### Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend-rs
   cargo build
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Generate Vanity Addresses** (optional):
   ```bash
   # Generate 1000 addresses in batches of 5
   cargo run --bin generate_pump 1000 5 live_pump_addresses.json
   
   # Consolidate into frontend format
   node consolidate-addresses.js live_pump_addresses.json frontend/public/test_pump.json
   ```
   
   **Note**: The project comes with 215 pre-generated pump addresses in `frontend/public/test_pump.json`

4. **Start Backend**:
   ```bash
   ./start_backend.sh
   ```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 🔌 API Endpoints

### Core Endpoints

- `GET /health` - Health check
- `GET /wallet/connect` - Get wallet connection message
- `POST /tx/create` - Create new token
- `POST /tx/create-and-buy` - Create token and buy initial amount
- `POST /tx/buy` - Buy tokens
- `POST /tx/sell` - Sell tokens
- `GET /token/:mint/curve` - Get bonding curve data
- `GET /vanity/stats` - Get vanity address pool stats

### Request/Response Examples

**Create Token**:
```json
POST /tx/create
{
  "name": "MyToken",
  "symbol": "MTK",
  "description": "My awesome token",
  "image_path": "https://example.com/image.png",
  "twitter": "https://twitter.com/mytoken",
  "telegram": "https://t.me/mytoken",
  "website": "https://mytoken.com",
  "wallet_address": "8eVjPHYirFhbeT5jwV9fydxFmpqeeKWbu7U2N2cMpump",
  "signature": "base58_signature",
  "message": "Connect to OnlyPump",
  "use_vanity": true
}
```

**Response**:
```json
{
  "signature": "transaction_signature",
  "mint": "8eVjPHYirFhbeT5jwV9fydxFmpqeeKWbu7U2N2cMpump"
}
```

## 🔒 Security Features

- **Wallet Signature Verification**: All transactions require valid wallet signatures
- **Message Signing**: Users sign a specific message to authenticate
- **Private Key Protection**: Vanity private keys are securely managed
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🛠️ Development

### Adding New Features

1. **Backend**: Add new handlers in `src/main.rs`
2. **Frontend**: Create components in `frontend/components/`
3. **State Management**: Update Redux slices in `frontend/lib/store/`
4. **API Integration**: Add API calls in `frontend/lib/hooks/`

### Vanity Address Management

- **Generate New Addresses**: Run `cargo run --bin generate_pump`
- **Update Pool**: Modify `test_pump.json` files
- **Monitor Usage**: Check `/vanity/stats` endpoint

### Testing

- **Backend**: `cargo test`
- **Frontend**: `npm test`
- **Integration**: Test wallet connection and token creation

## 📊 Monitoring

- **Logs**: Backend logs all operations with `tracing`
- **Metrics**: Track vanity address usage and token creation
- **Health Checks**: Monitor API availability
- **Error Handling**: Comprehensive error responses

## 🔧 Configuration

### Environment Variables

Create `.env` files for configuration:

**Backend (`/backend-rs/.env`)**:
```env
# Solana Configuration
SOLANA_CLUSTER=mainnet
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY_HERE

# Priority Fees (optional)
PRIORITY_UNIT_LIMIT=100000

# Server Configuration
HOST=0.0.0.0
PORT=3001

# Vanity Configuration
VANITY_SUFFIX=pump
VANITY_POOL_SIZE=120
VANITY_FILE=test_pump.json
```

**Frontend (`/frontend/.env.local`)**:
```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Solana RPC Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY_HERE

# Helius API Configuration (for transaction history)
NEXT_PUBLIC_HELIUS_API_KEY=YOUR_HELIUS_API_KEY_HERE
```

**Important Security Notes**:
- Never commit `.env` files to version control
- Use `.env.example` files as templates
- Replace `YOUR_HELIUS_API_KEY_HERE` with your actual Helius API key
- Keep API keys secure and rotate them regularly

### Vanity Configuration

- **Suffix**: Currently set to "pump"
- **Pool Size**: Number of pre-generated addresses
- **Generation**: Parallel processing for speed

## 🚨 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**:
   - Check wallet is installed and unlocked
   - Verify network connection
   - Ensure correct cluster setting

2. **Token Creation Failed**:
   - Verify vanity address is available
   - Check SOL balance for fees
   - Ensure metadata is valid

3. **Backend Won't Start**:
   - Check Rust and dependencies
   - Verify port 3001 is available
   - Check environment variables

### Debug Mode

- **Backend**: Set `RUST_LOG=debug`
- **Frontend**: Use browser dev tools
- **Network**: Check API requests/responses

## 📈 Performance

- **Vanity Generation**: Parallel processing with `rayon`
- **API Response**: Optimized for sub-second responses
- **Frontend**: Code splitting and lazy loading
- **Caching**: Redux state management for efficiency

## 🔮 Future Enhancements

- **More Vanity Suffixes**: Support for different endings
- **Advanced Trading**: Limit orders, stop losses
- **Analytics Dashboard**: Token performance metrics
- **Mobile App**: React Native implementation
- **Multi-chain Support**: Ethereum, BSC integration

## 🛠️ Utility Scripts

### Consolidate Pump Addresses

The `consolidate-addresses.js` script merges batch-generated vanity addresses into a single array format compatible with the frontend:

```bash
# Usage
node consolidate-addresses.js <input_file> <output_file>

# Example: Consolidate new addresses
node consolidate-addresses.js live_pump_addresses.json frontend/public/test_pump.json
```

**What it does:**
- Reads the batch-separated JSON file (with `---` separators)
- Extracts all keypairs from each batch
- Combines them into a single array
- Formats output matching `test_pump.json` structure
- Updates the count and timestamp

**Input Format** (batch-separated):
```json
{
  "suffix": "pump",
  "count": 5,
  "keypairs": [...]
}
---
{
  "suffix": "pump",
  "count": 5,
  "keypairs": [...]
}
```

**Output Format** (single array):
```json
{
  "suffix": "pump",
  "count": 215,
  "generated_at": "2025-10-05T19:27:10.445Z",
  "keypairs": [...]
}
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for the Solana ecosystem**