import React from 'react';
import { SocialComment } from '../types/types';

interface CommentFeedProps {
  comments: SocialComment[];
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments }) => {
  return (
    <div className="border border-gray-200 bg-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Raw Data Stream</h3>
        <div className="px-2 py-1 bg-gray-100 text-[10px] font-mono uppercase text-gray-600 rounded">
           Messages: {comments.length}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 font-mono text-[10px] uppercase text-gray-400 font-normal">Time</th>
              <th className="p-3 font-mono text-[10px] uppercase text-gray-400 font-normal">Source</th>
              <th className="p-3 font-mono text-[10px] uppercase text-gray-400 font-normal w-1/2">Content</th>
              <th className="p-3 font-mono text-[10px] uppercase text-gray-400 font-normal text-right">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-3 font-mono text-[10px] text-gray-500 whitespace-nowrap align-top">
                  {comment.timestamp}
                </td>
                <td className="p-3 align-top">
                  <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-[10px] font-bold font-mono rounded-sm text-gray-700">
                    {comment.source}
                  </span>
                </td>
                <td className="p-3 align-top">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase ${
                      comment.sentiment === 'Bullish' ? 'text-emerald-600' : 
                      comment.sentiment === 'Bearish' ? 'text-rose-600' : 'text-gray-500'
                    }`}>
                      {comment.sentiment}
                    </span>
                    <span className="text-[10px] text-gray-400">@{comment.user}</span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                    {comment.text}
                  </p>
                </td>
                <td className="p-3 text-right align-top">
                  <span className="font-mono text-xs font-bold">{comment.impactScore.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentFeed;