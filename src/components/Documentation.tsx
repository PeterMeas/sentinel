import React from 'react';
import { Book, Server, Code, Database, Zap, Lock } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-4">SENTINEL TERMINAL</h1>
        <p className="text-lg text-gray-600 font-mono">Real-Time Stock Sentiment Analysis Platform</p>
        <div className="mt-6 inline-block px-4 py-2 bg-black text-white font-mono text-xs">
          VERSION 1.0.0 // DOCUMENTATION
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Book className="w-8 h-8" />
          Overview
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Sentinel Terminal is an advanced stock sentiment analysis platform that aggregates real-time data from multiple social media sources
          including Reddit, Twitter/X, and StockTwits. It uses AI-powered analysis to provide traders with actionable market intelligence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-50 border border-gray-200">
            <div className="font-bold text-sm mb-2">REAL-TIME DATA</div>
            <div className="text-xs text-gray-600">Live scraping from social platforms with sub-minute updates</div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200">
            <div className="font-bold text-sm mb-2">AI ANALYSIS</div>
            <div className="text-xs text-gray-600">Google Gemini AI for intelligent sentiment summarization</div>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200">
            <div className="font-bold text-sm mb-2">CACHED RESPONSES</div>
            <div className="text-xs text-gray-600">3-minute caching for optimal performance and rate limiting</div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Server className="w-8 h-8" />
          Architecture
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3 font-mono">Frontend (React + TypeScript + Vite)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><code className="bg-gray-100 px-2 py-1 text-sm">src/components/</code> - React UI components</li>
              <li><code className="bg-gray-100 px-2 py-1 text-sm">src/services/</code> - API service layer</li>
              <li><code className="bg-gray-100 px-2 py-1 text-sm">src/types/</code> - TypeScript type definitions</li>
              <li>TailwindCSS for responsive styling</li>
              <li>TradingView widget integration for live charts</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 font-mono">Backend (Node.js + Express + TypeScript)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><code className="bg-gray-100 px-2 py-1 text-sm">server/src/services/</code> - Data scraping services</li>
              <li><code className="bg-gray-100 px-2 py-1 text-sm">server/src/utils/</code> - Caching and utilities</li>
              <li>Reddit API integration (public JSON endpoints)</li>
              <li>StockTwits API integration</li>
              <li>Twitter/X mock data (requires API keys for production)</li>
              <li>In-memory caching with automatic cleanup</li>
            </ul>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Code className="w-8 h-8" />
          API Endpoints
        </h2>
        <div className="space-y-6">
          <div className="border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold">GET</span>
              <code className="font-mono text-sm">/api/sentiment/:ticker</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Fetch sentiment analysis for a stock ticker</p>
            <div className="bg-gray-50 p-3 rounded font-mono text-xs overflow-x-auto">
              <div className="text-gray-500">// Response</div>
              <pre>{`{
  "ticker": "NVDA",
  "overallScore": 72,
  "summary": "Strong bullish momentum...",
  "volume": 156,
  "trend": [...],
  "comments": [...],
  "deepStats": {...},
  "lastUpdated": "2025-11-19T...",
  "cached": false
}`}</pre>
            </div>
          </div>

          <div className="border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold">GET</span>
              <code className="font-mono text-sm">/api/health</code>
            </div>
            <p className="text-sm text-gray-600">Check backend server status and cache statistics</p>
          </div>

          <div className="border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-500 text-white px-2 py-1 text-xs font-bold">POST</span>
              <code className="font-mono text-sm">/api/cache/clear</code>
            </div>
            <p className="text-sm text-gray-600">Clear all cached sentiment data</p>
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Zap className="w-8 h-8" />
          Setup & Configuration
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2 font-mono">1. Install Dependencies</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
              <div># Install frontend dependencies</div>
              <div>npm install</div>
              <div className="mt-2"># Install backend dependencies</div>
              <div>npm run server:install</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 font-mono">2. Configure Environment Variables</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm mb-2">Edit <code className="bg-white px-2 py-1">.env.local</code>:</p>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                VITE_GEMINI_API_KEY=your_gemini_api_key_here<br/>
                VITE_API_URL=http://localhost:3001/api
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 font-mono">3. Run the Application</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
              <div># Run frontend and backend simultaneously</div>
              <div>npm run dev:all</div>
              <div className="mt-3 text-gray-400"># Or run separately:</div>
              <div>npm run dev          # Frontend on port 3000</div>
              <div>npm run server:dev   # Backend on port 3001</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Database className="w-8 h-8" />
          Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-4">
            <h3 className="font-bold mb-2">Reddit</h3>
            <p className="text-sm text-gray-600 mb-2">Subreddits monitored:</p>
            <ul className="text-xs space-y-1">
              <li>• r/wallstreetbets</li>
              <li>• r/stocks</li>
              <li>• r/investing</li>
              <li>• r/StockMarket</li>
            </ul>
          </div>
          <div className="border border-gray-200 p-4">
            <h3 className="font-bold mb-2">StockTwits</h3>
            <p className="text-sm text-gray-600 mb-2">Real-time ticker streams with native sentiment tags</p>
            <div className="text-xs bg-gray-50 p-2 rounded mt-2">
              API: stocktwits.com/api
            </div>
          </div>
          <div className="border border-gray-200 p-4">
            <h3 className="font-bold mb-2">Twitter/X</h3>
            <p className="text-sm text-gray-600 mb-2">Currently using mock data. Requires API v2 access for production.</p>
            <div className="text-xs bg-yellow-50 p-2 rounded mt-2 border border-yellow-200">
              ⚠️ Needs API keys
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mb-12 p-8 border-2 border-black bg-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Lock className="w-8 h-8" />
          Security & Best Practices
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>API keys stored in <code className="bg-gray-100 px-2 py-1">.env.local</code> (never committed to git)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>CORS enabled for cross-origin requests</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Rate limiting through caching layer (3-minute TTL)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span>Error handling with graceful fallbacks</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 font-bold">!</span>
            <span>For production: Implement proper authentication and rate limiting on backend</span>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 font-mono mt-12 pt-8 border-t border-gray-200">
        SENTINEL TERMINAL v1.0.0 // Built with React, TypeScript, Express & Gemini AI
      </div>
    </div>
  );
};

export default Documentation;
