#!/bin/bash

echo "🚀 Starting OnlyPump Full Stack Application..."
echo "================================================"

# Check if test_pump.json exists
if [ ! -f "test_pump.json" ]; then
    echo "❌ Error: test_pump.json not found!"
    echo "Please generate vanity addresses first by running:"
    echo "cargo run --bin generate_pump -- 3 test_pump.json"
    exit 1
fi

echo "✅ Found vanity addresses file: test_pump.json"

# Start backend in background
echo "🔧 Starting Rust Backend..."
./start_backend.sh &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend
./start_frontend.sh &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

echo "✅ Both services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait
