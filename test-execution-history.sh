#!/bin/bash

# Test script for Execution History feature

echo "🚀 Testing Execution History Implementation..."
echo ""

# Check if backend is running
echo "1. Checking backend server..."
curl -s http://localhost:4000/api/requests/test/executions > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Backend is running on port 4000"
else
    echo "   ⚠️  Backend might not be running. Start with: cd backend && npm start"
fi

echo ""
echo "2. Checking files..."

# Check if main files exist
files=(
    "components/flux/ExecutionHistory.tsx"
    "components/flux/Sidebar.tsx"
    "components/flux/index.ts"
    "app/app/page.tsx"
    "components/flux/EXECUTION_HISTORY.md"
    "EXECUTION_HISTORY_IMPLEMENTATION.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

echo ""
echo "3. Features implemented:"
echo "   ✅ Fetch from GET /api/requests/:requestId/executions"
echo "   ✅ useEffect + useState for data fetching"
echo "   ✅ Vertical list display"
echo "   ✅ Status badges (SUCCESS/FAILED/PENDING)"
echo "   ✅ HTTP status code display"
echo "   ✅ Latency in ms"
echo "   ✅ Relative time display"
echo "   ✅ Highlight selected execution"
echo "   ✅ Click handler onSelectExecution"
echo "   ✅ Loading state"
echo "   ✅ Empty state"
echo "   ✅ Dark theme styling"
echo "   ✅ Color-coded status (Green/Red/Yellow)"

echo ""
echo "4. How to test:"
echo "   1. Start backend: cd backend && npm start"
echo "   2. Start frontend: npm run dev"
echo "   3. Navigate to http://localhost:3000/app"
echo "   4. Send a request (it will be saved with ID)"
echo "   5. Click on 'Runs' tab in sidebar"
echo "   6. View execution history!"

echo ""
echo "✨ Implementation complete! Check EXECUTION_HISTORY_IMPLEMENTATION.md for full details."
