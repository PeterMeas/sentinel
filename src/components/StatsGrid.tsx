import React from 'react';
import { SentimentAnalysisResult } from '../types/types';

interface StatsGridProps {
  data: SentimentAnalysisResult;
}

const StatItem = ({ label, value, trend }: { label: string, value: string | number, trend?: 'up' | 'down' | 'neutral' }) => (
  <div className="p-4 border border-gray-200 bg-white hover:border-black transition-colors group">
    <div className="text-[10px] font-mono uppercase text-gray-400 mb-2 flex justify-between">
      {label}
      {trend && (
        <span className={`${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-300'}`}>
          ●
        </span>
      )}
    </div>
    <div className="text-xl font-bold font-mono tracking-tight group-hover:text-blue-600 transition-colors">
      {value}
    </div>
  </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const stats = data.deepStats || {
    volatility: "---",
    momentum: "---",
    supportLevel: "---",
    resistanceLevel: "---",
    retailSentiment: 0,
    institutionalSentiment: 0,
    putCallRatio: 0
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem label="Est. Volatility" value={stats.volatility} trend={stats.volatility === 'HIGH' ? 'down' : 'neutral'} />
      <StatItem label="Put/Call Ratio" value={stats.putCallRatio} trend={stats.putCallRatio > 1 ? 'down' : 'up'} />
      <StatItem label="Key Support" value={stats.supportLevel} />
      <StatItem label="Key Resistance" value={stats.resistanceLevel} />
      <StatItem label="Retail Sentiment" value={`${stats.retailSentiment}%`} trend={stats.retailSentiment > 50 ? 'up' : 'down'} />
      <StatItem label="Inst. Sentiment" value={`${stats.institutionalSentiment}%`} trend={stats.institutionalSentiment > 50 ? 'up' : 'down'} />
      <StatItem label="Volume (Mentions)" value={data.volume} />
      <StatItem label="Momentum" value={stats.momentum} trend={stats.momentum === 'BULLISH' ? 'up' : 'down'} />
    </div>
  );
};

export default StatsGrid;