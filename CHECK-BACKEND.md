# How to Verify Backend is Running Correctly

## Quick Check Methods

### Method 1: Check the Terminal Output
When you run `npm run server:dev`, you should see this banner:

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   SENTINEL TERMINAL BACKEND SERVER                    ║
║   Running on http://localhost:3001                    ║
║                                                        ║
║   Endpoints:                                           ║
║   - GET  /api/health                                   ║
║   - GET  /api/sentiment/:ticker                        ║
║   - GET  /api/cache/stats                              ║
║   - POST /api/cache/clear                              ║
║                                                        ║
║   Cache TTL: 3 minutes                                 ║
║   Gemini AI: Enabled (or Disabled)                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### Method 2: Browser Test
Open your browser and visit:
- **http://localhost:3001/api/health**

You should see JSON response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-19T...",
  "cache": {
    "total": 0,
    "active": 0,
    "expired": 0
  }
}
```

### Method 3: Command Line (curl)
```bash
# Health check
curl http://localhost:3001/api/health

# Test sentiment analysis
curl http://localhost:3001/api/sentiment/NVDA

# Check cache stats
curl http://localhost:3001/api/cache/stats
```

### Method 4: Run the Test Script
```bash
./test-backend.sh
```

This runs a comprehensive test suite checking all endpoints.

---

## Step-by-Step: Starting the Backend

### Option A: Run Backend Only
```bash
# From project root
npm run server:dev
```

### Option B: Run Frontend + Backend Together
```bash
# From project root
npm run dev:all
```

You should see TWO servers start:
1. **Vite (Frontend)**: http://localhost:3000
2. **Express (Backend)**: http://localhost:3001

---

## Common Issues & Solutions

### Issue 1: "Port 3001 already in use"
**Problem**: Another process is using port 3001

**Solution**:
```bash
# Find what's using the port
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Or use a different port
PORT=3002 npm run server:dev
```

### Issue 2: Backend starts but no data
**Problem**: API calls return empty or error responses

**Check**:
1. Is Gemini API key set in `.env.local`?
2. Check backend logs for errors
3. Try testing with: `curl http://localhost:3001/api/sentiment/AAPL`

### Issue 3: Cannot connect to backend from frontend
**Problem**: Frontend shows "Using fallback data - Backend server not available"

**Solution**:
1. Verify backend is running on port 3001
2. Check CORS is enabled (should be by default)
3. Verify `VITE_API_URL` in `.env.local` is correct:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

### Issue 4: "Module not found" errors
**Problem**: Backend dependencies not installed

**Solution**:
```bash
cd server
npm install
cd ..
npm run server:dev
```

---

## What "Running Correctly" Looks Like

### 1. Terminal Output
```bash
$ npm run server:dev

> sentinel-terminal-backend@1.0.0 dev
> tsx watch src/index.ts

╔════════════════════════════════════════════════════════╗
║   SENTINEL TERMINAL BACKEND SERVER                    ║
║   Running on http://localhost:3001                    ║
╚════════════════════════════════════════════════════════╝
```

### 2. When you search for a ticker (e.g., NVDA):
```bash
Fetching fresh data for NVDA...
```

### 3. When you search again (cache hit):
```bash
Cache hit for NVDA
```

### 4. Health endpoint returns 200 OK
```bash
curl -i http://localhost:3001/api/health

HTTP/1.1 200 OK
Content-Type: application/json
...

{"status":"ok","timestamp":"...","cache":{...}}
```

---

## Testing Backend Features

### Test 1: Health Check
```bash
curl http://localhost:3001/api/health | jq
```
**Expected**: `{"status":"ok", ...}`

### Test 2: Sentiment Analysis
```bash
curl http://localhost:3001/api/sentiment/NVDA | jq
```
**Expected**: Full sentiment object with comments, scores, trends

### Test 3: Cache Behavior
```bash
# First call (fresh data)
time curl http://localhost:3001/api/sentiment/TSLA > /dev/null

# Second call (cached - should be faster)
time curl http://localhost:3001/api/sentiment/TSLA > /dev/null
```
**Expected**: Second call much faster (~10ms vs 2000ms)

### Test 4: Multiple Tickers
```bash
curl http://localhost:3001/api/sentiment/AAPL | jq '.ticker'
curl http://localhost:3001/api/sentiment/MSFT | jq '.ticker'
curl http://localhost:3001/api/sentiment/GOOGL | jq '.ticker'
```
**Expected**: Each returns correct ticker data

---

## Monitoring Backend

### View Real-Time Logs
The backend logs every request:
- Cache hits/misses
- Scraping activity
- Errors (if any)

### Check Cache Stats
```bash
curl http://localhost:3001/api/cache/stats | jq
```

Returns:
```json
{
  "total": 3,
  "active": 3,
  "expired": 0
}
```

### Clear Cache Manually
```bash
curl -X POST http://localhost:3001/api/cache/clear
```

---

## Integration with Frontend

When frontend is connected to backend correctly:

1. Search for a ticker in the UI
2. Watch backend terminal - you should see:
   ```
   Fetching fresh data for [TICKER]...
   ```
3. Frontend should display real scraped data
4. AI summary should appear (if Gemini key is set)
5. Comments tab shows real Reddit/StockTwits posts

---

## Performance Benchmarks

**Expected Response Times**:
- Health check: < 10ms
- Sentiment (cached): 10-50ms
- Sentiment (fresh): 1-3 seconds

**Memory Usage**: ~50-80MB with 20 cached tickers

**Cache Efficiency**: 70-80% hit rate during active use

---

## Quick Verification Checklist

- [ ] Backend starts without errors
- [ ] Banner displays with correct port (3001)
- [ ] Health endpoint returns 200 OK
- [ ] Sentiment endpoint returns data for any ticker
- [ ] Cache stats endpoint works
- [ ] Frontend can connect to backend
- [ ] Real data appears in UI (not fallback)
- [ ] Console shows "Cache hit" on repeated searches
