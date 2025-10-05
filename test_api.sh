#!/bin/bash

echo "🧪 Testing OnlyPump Backend API..."

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3001/health | jq .

echo -e "\n2. Testing vanity stats..."
curl -s http://localhost:3001/vanity/stats | jq .

echo -e "\n3. Testing wallet connect..."
curl -s http://localhost:3001/wallet/connect | jq .

echo -e "\n✅ API tests completed!"
echo "If you see JSON responses above, the backend is working correctly."
echo "The frontend should now be able to create tokens without issues."
