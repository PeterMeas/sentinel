#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

API_URL="http://localhost:3001/api"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║   SENTINEL TERMINAL BACKEND TEST SUITE                 ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[TEST 1]${NC} Health Check Endpoint"
echo -e "GET $API_URL/health"
echo ""
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/health")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $http_code"
    echo "$body"
fi
echo ""
echo "────────────────────────────────────────────────────────"
echo ""

# Test 2: Sentiment Analysis
echo -e "${YELLOW}[TEST 2]${NC} Sentiment Analysis - NVDA"
echo -e "GET $API_URL/sentiment/NVDA"
echo ""
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/sentiment/NVDA")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
    echo "$body" | jq '{ticker, overallScore, volume, cached, summary: (.summary | .[0:100] + "...")}' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $http_code"
    echo "$body"
fi
echo ""
echo "────────────────────────────────────────────────────────"
echo ""

# Test 3: Cache Hit (run same request again)
echo -e "${YELLOW}[TEST 3]${NC} Cache Test - NVDA (should be cached)"
echo -e "GET $API_URL/sentiment/NVDA"
echo ""
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/sentiment/NVDA")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
    cached=$(echo "$body" | jq -r '.cached' 2>/dev/null)
    if [ "$cached" = "true" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code (Cache Hit!)"
        echo "$body" | jq '{ticker, cached, cacheAge}' 2>/dev/null
    else
        echo -e "${YELLOW}⚠ WARNING${NC} - Status: $http_code (Not cached)"
    fi
else
    echo -e "${RED}✗ FAILED${NC} - Status: $http_code"
fi
echo ""
echo "────────────────────────────────────────────────────────"
echo ""

# Test 4: Different Ticker
echo -e "${YELLOW}[TEST 4]${NC} Sentiment Analysis - TSLA"
echo -e "GET $API_URL/sentiment/TSLA"
echo ""
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/sentiment/TSLA")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
    echo "$body" | jq '{ticker, overallScore, volume, "comment_count": (.comments | length)}' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $http_code"
    echo "$body"
fi
echo ""
echo "────────────────────────────────────────────────────────"
echo ""

# Test 5: Cache Stats
echo -e "${YELLOW}[TEST 5]${NC} Cache Statistics"
echo -e "GET $API_URL/cache/stats"
echo ""
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/cache/stats")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $http_code"
fi
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}Tests Complete!${NC}"
echo ""
