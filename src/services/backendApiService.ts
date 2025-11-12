import { SentimentAnalysisResult } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const analyzeSentiment = async (ticker: string): Promise<SentimentAnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sentiment/${ticker}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as SentimentAnalysisResult;

  } catch (error) {
    console.error("Backend API Error:", error);

    // Fallback to mock data if backend is unavailable
    return generateFallbackData(ticker);
  }
};

function generateFallbackData(ticker: string): SentimentAnalysisResult {
  const now = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const trend = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return {
      date: i === 6 ? 'Now' : formatDate(d).slice(5),
      score: 60 + Math.floor(Math.random() * 20)
    };
  });

  const getCommentTime = (minsAgo: number) => {
    const d = new Date(now.getTime() - minsAgo * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    ticker: ticker.toUpperCase(),
    overallScore: 72,
    summary: "⚠️ Using fallback data - Backend server not available. Start backend with 'npm run server:dev'",
    volume: 15420,
    lastUpdated: "Live",
    trend: trend,
    deepStats: {
      volatility: "MEDIUM",
      momentum: "BULLISH",
      supportLevel: "$118.50",
      resistanceLevel: "$135.00",
      retailSentiment: 85,
      institutionalSentiment: 62,
      putCallRatio: 0.65
    },
    comments: [
      {
        id: "1",
        source: "X (Twitter)",
        user: "market_wizard",
        text: "Breaking: NVDA massive dark pool print just hit. Someone knows something.",
        sentiment: "Bullish",
        timestamp: getCommentTime(5),
        impactScore: 8.5
      },
      {
        id: "2",
        source: "Reddit",
        user: "yolo_capital",
        text: "If we break 130 today, gamma squeeze is imminent. Loading calls.",
        sentiment: "Bullish",
        timestamp: getCommentTime(12),
        impactScore: 7.2
      },
      {
        id: "3",
        source: "StockTwits",
        user: "bear_trap",
        text: "Volume drying up at the top. Divergence on the 4H chart.",
        sentiment: "Bearish",
        timestamp: getCommentTime(24),
        impactScore: 4.1
      }
    ]
  };
}
