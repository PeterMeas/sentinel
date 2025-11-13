#!/bin/bash

# Quick backend health check script

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "🔍 Checking Sentinel Terminal Backend..."
echo ""

# Check if port 3001 is listening
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${GREEN}✓${NC} Backend server is running on port 3001"

    # Test health endpoint
    response=$(curl -s -w "%{http_code}" http://localhost:3001/api/health -o /tmp/health_check.json)

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC} Health endpoint responding (200 OK)"

        # Show cache stats
        active=$(cat /tmp/health_check.json | grep -o '"active":[0-9]*' | cut -d':' -f2)
        echo -e "${GREEN}✓${NC} Cache active entries: $active"

        echo ""
        echo -e "${GREEN}✅ Backend is running correctly!${NC}"
        echo ""
        echo "📊 Try these endpoints:"
        echo "   • http://localhost:3001/api/health"
        echo "   • http://localhost:3001/api/sentiment/NVDA"
        echo "   • http://localhost:3001/api/cache/stats"
        echo ""

    else
        echo -e "${RED}✗${NC} Health endpoint not responding correctly"
        echo -e "${YELLOW}Response code: $response${NC}"
    fi

else
    echo -e "${RED}✗${NC} Backend server is NOT running"
    echo ""
    echo "💡 Start the backend with:"
    echo "   npm run server:dev"
    echo ""
    echo "   Or run both frontend and backend:"
    echo "   npm run dev:all"
    echo ""
fi

rm -f /tmp/health_check.json 2>/dev/null
