# OnlyPump Integration Test - MAINNET

## Quick Start

1. **Generate Vanity Addresses** (if not already done):
   ```bash
   cargo run --bin generate_pump -- 3 test_pump.json
   ```

2. **Start Everything**:
   ```bash
   chmod +x start_all.sh
   ./start_all.sh
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Configuration

- **Network**: Solana Mainnet
- **RPC**: Helius RPC (https://mainnet.helius-rpc.com)
- **Vanity Suffix**: "pump"
- **Vanity Pool**: 3 pre-generated addresses from test_pump.json

## Manual Testing

### Backend API Tests

1. **Health Check**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Vanity Stats**:
   ```bash
   curl http://localhost:3001/vanity/stats
   ```

3. **Wallet Connect**:
   ```bash
   curl http://localhost:3001/wallet/connect
   ```

### Frontend Tests

1. Open http://localhost:3000
2. Connect your Solana wallet
3. Go to Create Token page
4. Fill in token details
5. Create token (should use vanity address from test_pump.json)
6. Test buy/sell functionality

## Expected Behavior

- Backend loads 3 vanity addresses from `test_pump.json`
- Frontend connects to backend API
- Token creation uses pre-generated vanity addresses
- Buy/sell functionality works with wallet signatures
- Vanity pool shows available addresses in real-time

## Troubleshooting

- If backend fails to start: Check if `test_pump.json` exists
- If frontend can't connect: Verify backend is running on port 3001
- If wallet connection fails: Check browser console for errors
