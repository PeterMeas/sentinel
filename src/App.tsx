import React, { useState, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import TradingViewWidget from './components/TradingViewWidget';
import SentimentGauge from './components/SentimentGauge';
import SentimentChart from './components/SentimentChart';
import CommentFeed from './components/CommentFeed';
import StatsGrid from './components/StatsGrid';
import Documentation from './components/Documentation';
import { analyzeSentiment } from './services/backendApiService';
import { SentimentAnalysisResult } from './types/types';

const App = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'docs'>('landing');
  const [ticker, setTicker] = useState<string>('NVDA');
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Generate default data dynamically
  const defaultData: SentimentAnalysisResult = useMemo(() => {
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
      ticker: "NVDA",
      overallScore: 72,
      summary: "Strong bullish momentum detected driven by renewed AI infrastructure spending guidance. Retail sentiment is approaching euphoric levels while institutional flows remain steady.",
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
  }, []);

  const [data, setData] = useState<SentimentAnalysisResult>(defaultData);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    
    const targetTicker = searchInput.toUpperCase();
    setLoading(true);
    setTicker(targetTicker);
    
    try {
      const result = await analyzeSentiment(targetTicker);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('dashboard')} onDocsClick={() => setView('docs')} />;
  }

  if (view === 'docs') {
    return (
      <Layout
        onHomeClick={() => setView('landing')}
        onDocsClick={() => setView('dashboard')}
        showDocsButton={false}
      >
        <Documentation />
      </Layout>
    );
  }

  return (
    <Layout
      onHomeClick={() => setView('landing')}
      onDocsClick={() => setView('docs')}
      showDocsButton={true}
    >
      <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-12">

        {/* SEARCH BAR - Top of page for prominence */}
        <section className="bg-white border-2 border-black shadow-lg">
           <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-baseline gap-4">
                 <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{ticker}</h2>
                 <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Live Analysis</span>
              </div>

              <form onSubmit={handleSearch} className="flex w-full md:w-auto border-2 border-gray-200 hover:border-black transition-colors">
                 <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ENTER TICKER..."
                    className="bg-transparent px-4 py-2 font-mono text-sm text-black focus:outline-none w-full md:w-64 placeholder:text-gray-400 uppercase"
                 />
                 <button
                   type="submit"
                   disabled={loading}
                   className="bg-black text-white px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-gray-900 transition-colors disabled:opacity-50"
                 >
                   {loading ? '...' : 'ANALYZE'}
                 </button>
              </form>
           </div>
        </section>

        {/* SENTIMENT OVERVIEW - Main metrics at a glance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Gauge */}
          <div className="h-[300px]">
             <SentimentGauge score={data.overallScore} />
          </div>

          {/* Trend Chart */}
          <div className="h-[300px]">
             <SentimentChart data={data.trend} />
          </div>

          {/* AI Summary Box */}
          <div className="h-[300px] p-6 bg-gray-50 border-2 border-gray-200 flex flex-col justify-center">
            <div className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">AI Analysis</div>
            <div className="text-sm font-mono text-gray-700 leading-relaxed">
              <span className="font-bold text-black">&gt;&gt;</span> {loading ? 'Processing market signals...' : data.summary}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs font-mono text-gray-500">
              <span>Volume: {data.volume}</span>
              <span>{data.lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* DETAILED STATISTICS */}
        <section>
          <div className="mb-4">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">Deep Market Statistics</h3>
          </div>
          <StatsGrid data={data} />
        </section>

        {/* TRADINGVIEW CHART */}
        <section className="border-2 border-gray-200 bg-white">
           <div className="p-4 bg-gray-50 border-b-2 border-gray-200">
             <h3 className="font-mono font-bold text-sm uppercase tracking-wider">Live Price Action</h3>
           </div>
           <div className="w-full h-[500px] bg-gray-50 relative">
              <TradingViewWidget ticker={ticker} />
           </div>
        </section>

        {/* COMMENT FEED */}
        <section>
          <div className="mb-4">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">Social Sentiment Stream</h3>
            <p className="text-xs text-gray-500 font-mono mt-1">Real-time comments from Reddit, Twitter/X, and StockTwits</p>
          </div>
          <div className="h-[450px]">
            <CommentFeed comments={data.comments} />
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default App;