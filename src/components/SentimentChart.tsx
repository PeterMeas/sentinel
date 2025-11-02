import React, { useMemo, useState } from 'react';
import { SentimentTrendPoint } from '../types/types';

interface SentimentChartProps {
  data: SentimentTrendPoint[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Chart Dimensions
  const width = 100;
  const height = 40;
  const padding = 2;

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { path: '', area: '', points: [] };

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.score / 100) * (height - 2 * padding);
      return { x, y, ...d };
    });

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

    return { path: pathD, area: areaD, points };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-full p-6 border border-gray-200 bg-white flex flex-col items-center justify-center font-mono text-xs text-gray-400 animate-pulse">
        [ WAITING FOR SIGNAL ]
      </div>
    );
  }

  return (
    <div className="h-full p-6 border border-gray-200 bg-white flex flex-col group hover:border-black transition-colors duration-300 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end mb-4 relative z-10">
        <div>
           <h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-black inline-block"></span>
             Trend Analysis
           </h3>
           <div className="text-lg font-bold tracking-tight font-mono">7-DAY MOMENTUM</div>
        </div>
        <div className="text-[10px] font-mono uppercase text-gray-400">
          {hoverIndex !== null ? (
             <span className="text-black font-bold">
               {data[hoverIndex].date}: {data[hoverIndex].score}
             </span>
          ) : (
            <span>LAST: {data[data.length - 1].score}</span>
          )}
        </div>
      </div>
      
      {/* Custom SVG Chart */}
      <div className="flex-grow w-full min-h-0 relative" onMouseLeave={() => setHoverIndex(null)}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible" 
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="#f3f4f6" strokeWidth="0.2" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="#f3f4f6" strokeWidth="0.2" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#f3f4f6" strokeWidth="0.2" />

          {/* Area Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chartData.area} fill="url(#gradient)" />

          {/* Line */}
          <path 
            d={chartData.path} 
            fill="none" 
            stroke="#000" 
            strokeWidth="0.5" 
            vectorEffect="non-scaling-stroke"
          />

          {/* Interactive Overlay */}
          {chartData.points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoverIndex(i)}>
               {/* Invisible hover target */}
               <rect 
                 x={p.x - (width / data.length / 2)} 
                 y="0" 
                 width={width / data.length} 
                 height={height} 
                 fill="transparent" 
                 className="cursor-crosshair"
               />
               {/* Active Point Indicator */}
               {hoverIndex === i && (
                 <>
                   <line x1={p.x} y1="0" x2={p.x} y2={height} stroke="#000" strokeWidth="0.2" strokeDasharray="1 1" />
                   <circle cx={p.x} cy={p.y} r="1.5" fill="white" stroke="black" strokeWidth="0.5" />
                 </>
               )}
            </g>
          ))}
        </svg>

        {/* Tooltip Box (HTML Overlay for crisp text) */}
        {hoverIndex !== null && (
          <div 
            className="absolute pointer-events-none bg-black text-white px-2 py-1 text-[10px] font-mono z-20 shadow-xl transform -translate-x-1/2 -translate-y-full"
            style={{ 
              left: `${(chartData.points[hoverIndex].x / width) * 100}%`, 
              top: `${(chartData.points[hoverIndex].y / height) * 100}%`,
              marginTop: '-10px'
            }}
          >
            SCORE: {data[hoverIndex].score}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentChart;