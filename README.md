<div align="center">

# 📊 Sentinel Terminal

**Real-Time Stock Sentiment Analysis Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

[Documentation](./CHECK-BACKEND.md) • [Backend Docs](./BACKEND.md)

</div>

---

## 🚀 About

Sentinel Terminal aggregates real-time sentiment data from Reddit, StockTwits, and Twitter/X to provide traders with actionable market intelligence. Built with AI-powered analysis using Google Gemini, it offers live scraping, sentiment scoring, and interactive visualizations.

**Created by:** [Peter Meas](https://github.com/peterMeas)

> **Note:** This project was developed with the assistance of AI tools (Claude Code) to accelerate development and implement best practices in TypeScript, React, and Node.js architecture.

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   - Open [.env.local](.env.local)
   - Replace `PLACEHOLDER_API_KEY` with your actual Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## ✅ Verifying Backend is Running

### Quick Test (Browser)
Open http://localhost:3001/api/health in your browser. You should see:
```json
{"status":"ok","timestamp":"...","cache":{...}}
```

### Quick Test (Command Line)
```bash
curl http://localhost:3001/api/health
```

### Run Full Test Suite
```bash
./test-backend.sh
```

### What Success Looks Like
When you start the backend (`npm run server:dev`), you should see:
```
╔════════════════════════════════════════════════════════╗
║   SENTINEL TERMINAL BACKEND SERVER                    ║
║   Running on http://localhost:3001                    ║
╚════════════════════════════════════════════════════════╝
```

**📖 For detailed troubleshooting, see [CHECK-BACKEND.md](CHECK-BACKEND.md)**

## Project Structure

```
sentinel-terminal/
├── src/
│   ├── components/        # React components
│   │   ├── CommentFeed.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Layout.tsx
│   │   ├── SentimentChart.tsx
│   │   ├── SentimentGauge.tsx
│   │   ├── StatsGrid.tsx
│   │   └── TradingViewWidget.tsx
│   ├── services/          # API services
│   │   └── geminiService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── types.ts
│   ├── App.tsx            # Main application component
│   ├── index.tsx          # Application entry point
│   └── vite-env.d.ts      # Vite environment types
├── .env.local             # Environment variables
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Features

- **Real-time Data Scraping**: Live data from Reddit, StockTwits, and Twitter/X
- **AI-Powered Analysis**: Google Gemini AI for intelligent sentiment summarization
- **Interactive Charts**: Integrated TradingView widgets for live market data
- **Sentiment Metrics**: Overall score, trend analysis, deep market statistics
- **Caching Layer**: 3-minute cache for optimal performance
- **RESTful API**: Express backend with organized service architecture
- **Documentation**: Built-in docs tab with complete API reference

## Backend Architecture

The project now includes a full-featured Express backend with:

### Data Scraping Services
- **Reddit Scraper**: Monitors r/wallstreetbets, r/stocks, r/investing, r/StockMarket
- **StockTwits Scraper**: Real-time API integration with native sentiment tags
- **Twitter/X Scraper**: Mock data (requires API v2 keys for production)

### Features
- **Sentiment Aggregation**: Combines data from multiple sources with weighted scoring
- **In-Memory Caching**: 3-minute TTL with automatic cleanup
- **AI Summary Generation**: Google Gemini integration for narrative analysis
- **Deep Statistics**: Volatility, momentum, support/resistance, put/call ratios

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sentiment/:ticker` | Get sentiment analysis for a ticker |
| GET | `/api/health` | Check server status and cache stats |
| GET | `/api/cache/stats` | View cache statistics |
| POST | `/api/cache/clear` | Clear all cached data |
