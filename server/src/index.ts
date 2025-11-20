import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SentimentAggregator } from './services/sentimentAggregator';
import { sentimentCache } from './utils/cache';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize sentiment aggregator
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const sentimentAggregator = new SentimentAggregator(geminiApiKey);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cache: sentimentCache.getStats()
  });
});

// Main sentiment analysis endpoint
app.get('/api/sentiment/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    // Check cache first
    const cacheKey = `sentiment:${ticker}`;
    const cachedData = sentimentCache.get<any>(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${ticker}`);
      return res.json({
        ...cachedData,
        cached: true,
        cacheAge: cachedData.timestamp ? Math.round((Date.now() - cachedData.timestamp) / 1000) : 0
      });
    }

    // Fetch fresh data
    console.log(`Fetching fresh data for ${ticker}...`);
    const result = await sentimentAggregator.analyzeTicker(ticker);

    // Cache the result
    sentimentCache.set(cacheKey, {
      ...result,
      timestamp: Date.now()
    }, 3); // 3 minute TTL

    res.json({
      ...result,
      cached: false
    });

  } catch (error) {
    console.error('Error in sentiment endpoint:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a validation error (invalid ticker)
    if (errorMessage.includes('Invalid ticker') || errorMessage.includes('No data found')) {
      return res.status(404).json({
        error: 'Invalid ticker',
        message: errorMessage
      });
    }

    // Otherwise it's a server error
    res.status(500).json({
      error: 'Failed to analyze sentiment',
      message: errorMessage
    });
  }
});

// Cache management endpoints
app.post('/api/cache/clear', (req: Request, res: Response) => {
  sentimentCache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

app.get('/api/cache/stats', (req: Request, res: Response) => {
  res.json(sentimentCache.getStats());
});

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  sentimentCache.cleanup();
  console.log('Cache cleanup completed');
}, 5 * 60 * 1000);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   SENTINEL TERMINAL BACKEND SERVER                    ║
║   Running on http://localhost:${PORT}                   ║
║                                                        ║
║   Endpoints:                                           ║
║   - GET  /api/health                                   ║
║   - GET  /api/sentiment/:ticker                        ║
║   - GET  /api/cache/stats                              ║
║   - POST /api/cache/clear                              ║
║                                                        ║
║   Cache TTL: 3 minutes                                 ║
║   Gemini AI: ${geminiApiKey ? 'Enabled' : 'Disabled (using fallback)'}                   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
