import { SocialComment } from '../types/scraperTypes';

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    author: string;
    created_utc: number;
    score: number;
    url: string;
    subreddit: string;
  };
}

export class RedditScraper {
  private readonly BASE_URL = 'https://www.reddit.com';

  async scrapeStockMentions(ticker: string, limit: number = 50): Promise<SocialComment[]> {
    const comments: SocialComment[] = [];

    try {
      // Search across multiple stock-related subreddits
      const subreddits = ['wallstreetbets', 'stocks', 'investing', 'StockMarket'];

      for (const subreddit of subreddits) {
        const posts = await this.fetchSubredditPosts(subreddit, ticker, limit / subreddits.length);
        comments.push(...posts);
      }

      return comments.slice(0, limit);
    } catch (error) {
      console.error('Reddit scraping error:', error);
      return [];
    }
  }

  private async fetchSubredditPosts(subreddit: string, ticker: string, limit: number): Promise<SocialComment[]> {
    try {
      // Using Reddit's JSON API (no auth required for public data)
      const searchUrl = `${this.BASE_URL}/r/${subreddit}/search.json?q=${ticker}&restrict_sr=1&sort=new&limit=${limit}`;

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SentimentBot/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data: any = await response.json();
      const posts = data.data?.children || [];

      return posts.map((post: RedditPost, index: number) => ({
        id: `reddit-${Date.now()}-${index}`,
        source: 'Reddit' as const,
        user: post.data.author,
        text: post.data.title + (post.data.selftext ? `: ${post.data.selftext.substring(0, 200)}` : ''),
        sentiment: this.detectSentiment(post.data.title + ' ' + post.data.selftext),
        timestamp: this.formatTimestamp(post.data.created_utc),
        impactScore: this.calculateImpactScore(post.data.score)
      }));
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
      return [];
    }
  }

  private detectSentiment(text: string): 'Bullish' | 'Bearish' | 'Neutral' {
    const lowerText = text.toLowerCase();

    const bullishKeywords = ['moon', 'buy', 'calls', 'bullish', 'up', 'gain', 'long', 'rocket', 'pump', 'breakout', 'surge'];
    const bearishKeywords = ['puts', 'bearish', 'down', 'loss', 'short', 'crash', 'dump', 'fall', 'tank', 'drop'];

    let bullishScore = 0;
    let bearishScore = 0;

    bullishKeywords.forEach(word => {
      if (lowerText.includes(word)) bullishScore++;
    });

    bearishKeywords.forEach(word => {
      if (lowerText.includes(word)) bearishScore++;
    });

    if (bullishScore > bearishScore && bullishScore > 0) return 'Bullish';
    if (bearishScore > bullishScore && bearishScore > 0) return 'Bearish';
    return 'Neutral';
  }

  private calculateImpactScore(score: number): number {
    // Convert Reddit score to 0-10 scale
    const normalized = Math.log10(Math.max(score, 1) + 1);
    return Math.min(normalized * 2, 10);
  }

  private formatTimestamp(utc: number): string {
    const date = new Date(utc * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}
