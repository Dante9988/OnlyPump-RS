#!/bin/bash

# Load environment variables from .env.local file if it exists
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Set default environment variables for the frontend
export NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001}
export NEXT_PUBLIC_SOLANA_RPC_URL=${NEXT_PUBLIC_SOLANA_RPC_URL:-https://api.mainnet-beta.solana.com}
export NEXT_PUBLIC_HELIUS_API_KEY=${NEXT_PUBLIC_HELIUS_API_KEY:-}

echo "🚀 Starting OnlyPump Frontend..."
echo "🔗 Backend API: $NEXT_PUBLIC_API_URL"
echo "🌐 RPC Endpoint: $NEXT_PUBLIC_SOLANA_RPC_URL"

# Start the frontend
yarn dev
