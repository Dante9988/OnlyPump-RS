#!/bin/bash

echo "🚀 Building WASM vanity module for seamless frontend integration..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
    source ~/.cargo/env
fi

# Build WASM module
echo "📦 Building WASM module..."
cd wasm-vanity
wasm-pack build --target web --out-dir pkg --dev

# Copy WASM files to frontend
echo "📁 Copying WASM files to frontend..."
cp -r pkg/* ../frontend/lib/wasm-vanity/

echo "✅ WASM module built and integrated successfully!"
echo "🎯 You can now use the seamless create page at /create-seamless"
echo "💡 The frontend will generate vanity addresses locally using WASM!"
