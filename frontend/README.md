# OnlyPump Frontend

A simplified Next.js frontend for the OnlyPump token creation platform.

## Features

- **Wallet Connection**: Connect with Solana wallets (Phantom, Solflare, etc.)
- **Token Creation**: Create tokens with vanity addresses ending in "pump"
- **Buy/Sell Integration**: Buy and sell tokens directly from the creation page
- **Vanity Address Pool**: Shows available vanity addresses in real-time

## Pages

- **Home (`/`)**: Landing page with wallet connection and vanity stats
- **Create (`/create`)**: Token creation and trading interface

## API Integration

The frontend integrates with the Rust backend API:

- `GET /wallet/connect` - Get connection message for wallet signing
- `GET /vanity/stats` - Get vanity address pool statistics
- `POST /tx/create` - Create a new token
- `POST /tx/buy` - Buy tokens
- `POST /tx/sell` - Sell tokens

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. Make sure the Rust backend is running on `http://localhost:3001`

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **Solana Wallet Adapter** - Wallet integration
- **React Hot Toast** - Notifications

## Simplified Architecture

The frontend has been simplified to focus on core functionality:

- Removed complex trading pages
- Integrated buy/sell into the create page
- Streamlined API integration with Rust backend
- Clean, minimal UI focused on token creation
