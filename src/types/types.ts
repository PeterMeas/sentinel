export interface SentimentTrendPoint {
  date: string;
  score: number;
  price?: number; // Simulated price for correlation
}

export interface SocialComment {
  id: string;
  source: 'Reddit' | 'X (Twitter)' | 'StockTwits' | 'Institutional';
  user: string;
  text: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  timestamp: string;
  impactScore: number; // 0-10
}

export interface DeepStats {
  volatility: string;
  momentum: string;
  supportLevel: string;
  resistanceLevel: string;
  retailSentiment: number;
  institutionalSentiment: number;
  putCallRatio: number;
}

export interface SentimentAnalysisResult {
  ticker: string;
  overallScore: number; // 0 to 100
  summary: string;
  volume: number; 
  trend: SentimentTrendPoint[];
  comments: SocialComment[];
  deepStats: DeepStats;
  lastUpdated: string;
}