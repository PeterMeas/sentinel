import React from 'react';

interface SentimentGaugeProps {
  score: number;
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score }) => {
  let status = "NEUTRAL";
  let color = "text-gray-500";
  let barColor = "bg-gray-300";
  
  if (score >= 60) {
    status = "BULLISH";
    color = "text-emerald-600";
    barColor = "bg-emerald-500";
  } else if (score <= 40) {
    status = "BEARISH";
    color = "text-rose-600";
    barColor = "bg-rose-500";
  }

  // SVG Arc calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score / 100) * circumference) / 2; // Half circle logic approx

  return (
    <div className="h-full border border-gray-200 bg-white p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Aggregate Sentiment</h3>
        <div className={`w-2 h-2 rounded-full ${score >= 60 ? 'bg-emerald-500' : score <= 40 ? 'bg-rose-500' : 'bg-yellow-400'}`}></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative">
        {/* Meter Graphic */}
        <div className="relative w-48 h-24 overflow-hidden mb-4">
           <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-gray-100"></div>
           <div 
             className={`absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-transparent border-t-${score > 50 ? 'emerald' : 'rose'}-500 transition-transform duration-1000 ease-out origin-center`}
             style={{ transform: `rotate(${(score / 100) * 180 - 135}deg)` }}
           ></div>
        </div>

        <div className="text-center z-10 -mt-8">
          <div className="text-5xl font-bold font-mono tracking-tighter">{score}</div>
          <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${color}`}>{status}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
            <div className="text-[10px] uppercase text-gray-400 mb-1">Signal Strength</div>
            <div className="font-mono font-bold text-sm">HIGH</div>
        </div>
        <div className="text-center border-l border-gray-100">
            <div className="text-[10px] uppercase text-gray-400 mb-1">Confidence</div>
            <div className="font-mono font-bold text-sm">88.4%</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;