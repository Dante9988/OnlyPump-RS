#!/bin/bash

echo "🔧 Building WASM vanity module..."

# Install wasm-pack if not already installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Build the WASM module
wasm-pack build --target web --out-dir pkg

echo "✅ WASM module built successfully!"
echo "📁 Output: wasm-vanity/pkg/"
echo "🚀 You can now use this in your frontend!"
