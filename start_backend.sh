#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default environment variables for the Rust backend
export SOLANA_CLUSTER=${SOLANA_CLUSTER:-mainnet}
export RPC_URL=${RPC_URL:-https://api.mainnet-beta.solana.com}
export VANITY_SUFFIX=${VANITY_SUFFIX:-pump}
export VANITY_POOL_SIZE=${VANITY_POOL_SIZE:-120}
export VANITY_FILE=${VANITY_FILE:-test_pump.json}
export HOST=0.0.0.0
export PORT=3001
export RUST_LOG=info

echo "🚀 Starting OnlyPump Backend..."
echo "📁 Using vanity file: $VANITY_FILE"
echo "🌐 Server will run on: $HOST:$PORT"

# Start the backend
cargo run --bin onlypump-backend
