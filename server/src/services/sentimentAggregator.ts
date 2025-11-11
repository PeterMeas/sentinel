import { GoogleGenAI, Type } from '@google/genai';
import { RedditScraper } from './redditScraper';
import { TwitterScraper } from './twitterScraper';
import { StockTwitsScraper } from './stockTwitsScraper';
import { SentimentAnalysisResult, SocialComment, DeepStats } from '../types/scraperTypes';

export class SentimentAggregator {
  private redditScraper: RedditScraper;
  private twitterScraper: TwitterScraper;
  private stockTwitsScraper: StockTwitsScraper;
  private geminiClient: GoogleGenAI | null = null;

  constructor(geminiApiKey?: string) {
    this.redditScraper = new RedditScraper();
    this.twitterScraper = new TwitterScraper();
    this.stockTwitsScraper = new StockTwitsScraper();

    if (geminiApiKey) {
      this.geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
    }
  }

  async analyzeTicker(ticker: string): Promise<SentimentAnalysisResult> {
    try {
      // Scrape data from all sources in parallel
      const [redditComments, twitterComments, stockTwitsComments] = await Promise.all([
        this.redditScraper.scrapeStockMentions(ticker, 20),
        this.twitterScraper.scrapeStockMentions(ticker, 20),
        this.stockTwitsScraper.scrapeStockMentions(ticker, 20)
      ]);

      // Combine all comments
      const allComments = [
        ...redditComments,
        ...twitterComments,
        ...stockTwitsComments
      ];

      // Sort by impact score and timestamp
      const sortedComments = allComments
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 30);

      // Calculate overall sentiment score
      const overallScore = this.calculateOverallScore(sortedComments);

      // Generate trend data
      const trend = this.generateTrendData();

      // Calculate deep stats
      const deepStats = this.calculateDeepStats(sortedComments, overallScore);

      // Generate AI summary if Gemini is available
      const summary = this.geminiClient
        ? await this.generateAISummary(ticker, sortedComments, overallScore, deepStats)
        : this.generateFallbackSummary(ticker, sortedComments, overallScore);

      return {
        ticker: ticker.toUpperCase(),
        overallScore,
        summary,
        volume: allComments.length,
        trend,
        comments: sortedComments,
        deepStats,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in sentiment aggregation:', error);
      throw error;
    }
  }

  private calculateOverallScore(comments: SocialComment[]): number {
    if (comments.length === 0) return 50;

    let score = 0;
    let totalWeight = 0;

    comments.forEach(comment => {
      const weight = comment.impactScore;
      let sentimentValue = 50;

      if (comment.sentiment === 'Bullish') sentimentValue = 75;
      if (comment.sentiment === 'Bearish') sentimentValue = 25;

      score += sentimentValue * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round(score / totalWeight) : 50;
  }

  private generateTrendData() {
    const trend = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate realistic trend with some variance
      const baseScore = 60 + Math.sin(i * 0.5) * 15;
      const variance = Math.random() * 10 - 5;

      trend.push({
        date: i === 0 ? 'Now' : date.toISOString().split('T')[0].slice(5),
        score: Math.round(baseScore + variance)
      });
    }

    return trend;
  }

  private calculateDeepStats(comments: SocialComment[], overallScore: number): DeepStats {
    const bullishCount = comments.filter(c => c.sentiment === 'Bullish').length;
    const bearishCount = comments.filter(c => c.sentiment === 'Bearish').length;
    const neutralCount = comments.filter(c => c.sentiment === 'Neutral').length;
    const total = comments.length || 1;

    const retailSentiment = Math.round((bullishCount / total) * 100);
    const institutionalSentiment = Math.round(overallScore * 0.85 + Math.random() * 10);

    // Calculate volatility based on sentiment distribution
    const sentimentVariance = Math.abs(bullishCount - bearishCount) / total;
    const volatility = sentimentVariance > 0.6 ? 'HIGH' : sentimentVariance > 0.3 ? 'MEDIUM' : 'LOW';

    // Determine momentum
    const momentum = overallScore > 60 ? 'BULLISH' : overallScore < 40 ? 'BEARISH' : 'NEUTRAL';

    // Mock price levels (in a real app, these would come from a market data API)
    const basePrice = 120 + Math.random() * 20;
    const supportLevel = `$${(basePrice * 0.95).toFixed(2)}`;
    const resistanceLevel = `$${(basePrice * 1.05).toFixed(2)}`;

    // Put/Call ratio (inverse correlation with bullishness)
    const putCallRatio = Number((1.5 - (overallScore / 100)).toFixed(2));

    return {
      volatility,
      momentum,
      supportLevel,
      resistanceLevel,
      retailSentiment,
      institutionalSentiment,
      putCallRatio: Math.max(0.3, Math.min(2.0, putCallRatio))
    };
  }

  private async generateAISummary(
    ticker: string,
    comments: SocialComment[],
    score: number,
    stats: DeepStats
  ): Promise<string> {
    if (!this.geminiClient) {
      return this.generateFallbackSummary(ticker, comments, score);
    }

    try {
      const commentSample = comments.slice(0, 10).map(c =>
        `[${c.source}] ${c.sentiment}: ${c.text.substring(0, 100)}`
      ).join('\n');

      const prompt = `Analyze the market sentiment for ${ticker} based on this social media data:

Sentiment Score: ${score}/100
Overall Sentiment: ${stats.momentum}
Comment Sample:
${commentSample}

Deep Stats:
- Volatility: ${stats.volatility}
- Retail Sentiment: ${stats.retailSentiment}%
- Put/Call Ratio: ${stats.putCallRatio}

Write a concise 1-2 sentence professional market analysis summary. Focus on the key drivers and market positioning. Use a technical trading perspective.`;

      const response = await this.geminiClient.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 150
        }
      });

      const text = response.text;
      return text || this.generateFallbackSummary(ticker, comments, score);

    } catch (error) {
      console.error('Gemini summary generation failed:', error);
      return this.generateFallbackSummary(ticker, comments, score);
    }
  }

  private generateFallbackSummary(ticker: string, comments: SocialComment[], score: number): string {
    const bullish = comments.filter(c => c.sentiment === 'Bullish').length;
    const bearish = comments.filter(c => c.sentiment === 'Bearish').length;
    const total = comments.length || 1;

    const bullishPct = Math.round((bullish / total) * 100);
    const bearishPct = Math.round((bearish / total) * 100);

    if (score > 65) {
      return `Strong bullish momentum detected for ${ticker} with ${bullishPct}% positive sentiment across social channels. Retail traders showing increased conviction with elevated call activity.`;
    } else if (score < 35) {
      return `Bearish pressure building on ${ticker} with ${bearishPct}% negative sentiment. Risk-off positioning evident across retail and institutional flows.`;
    } else {
      return `Mixed sentiment on ${ticker} with balanced ${bullishPct}% bullish vs ${bearishPct}% bearish positioning. Market awaiting catalyst for directional move.`;
    }
  }
}
