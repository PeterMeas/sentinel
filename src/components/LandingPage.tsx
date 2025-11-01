import React, { useEffect, useState } from 'react';
import { Github, ArrowRight, Terminal, Activity, Cpu, Globe, Zap, Lock, BarChart3, Database, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  onDocsClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onDocsClick }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden flex flex-col">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onEnter}>
          <div className="w-4 h-4 bg-black"></div>
          <span className="font-mono font-bold tracking-tighter text-lg">SENTINEL</span>
        </div>
        <div className="flex gap-6 md:gap-8 font-mono text-xs uppercase tracking-widest">
          {onDocsClick && (
            <button onClick={onDocsClick} className="hover:underline decoration-2 underline-offset-4 flex items-center gap-2">
              <BookOpen size={14} /> <span className="hidden sm:inline">Docs</span>
            </button>
          )}
          <a href="https://github.com/peterMeas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
            <Github size={14} /> <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20 pb-20 border-b border-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[20%] left-[5%] font-mono text-[10px] text-gray-200 leading-none">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i}>SYS.INIT_SEQUENCE_0{i} // OK</div>
              ))}
           </div>
        </div>

        <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-center max-w-5xl relative z-10`}>
          <div className="inline-flex items-center gap-3 px-3 py-1 border border-gray-200 rounded-full bg-gray-50 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">System Online // v3.0.1</span>
          </div>

          {/* Main Title */}
          <div className="relative mb-8">
            <h1 className="text-7xl md:text-[9rem] lg:text-[11rem] font-black tracking-tighter leading-none select-none text-black">
              SENTINEL
            </h1>
            <div className="h-1 w-24 md:w-48 bg-black mx-auto mt-2"></div>
          </div>

          <p className="font-mono text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            The open-source standard for <span className="font-bold text-black">AI-driven financial sentiment analysis</span>.
            Synthesizing social signals into actionable market intelligence.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={onEnter}
              className="bg-black text-white px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 group border border-black"
            >
              Launch Terminal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://github.com/peterMeas" target="_blank" rel="noopener noreferrer" className="px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] border border-gray-200 hover:border-black transition-colors flex items-center gap-3 bg-white text-gray-600 hover:text-black">
              <Github size={14} /> View on GitHub
            </a>
          </div>

          <div className="mt-12 text-xs text-gray-400 font-mono">
            Created by <a href="https://github.com/peterMeas" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Peter Meas</a>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div id="features" className="max-w-[1600px] mx-auto px-6 py-24 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="group">
            <Activity className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">Real-Time Data</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Live scraping from Reddit, Twitter/X, and StockTwits with sub-minute updates and intelligent aggregation.
            </p>
          </div>

          <div className="group">
            <Cpu className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">AI-Powered</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Google Gemini integration for sophisticated sentiment analysis and narrative generation.
            </p>
          </div>

          <div className="group">
            <Database className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">Smart Caching</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Intelligent 3-minute cache with automatic cleanup for optimal performance and rate limiting.
            </p>
          </div>

          <div className="group">
            <Globe className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">Multi-Source</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aggregates signals from multiple platforms with weighted scoring and impact analysis.
            </p>
          </div>

          <div className="group">
            <BarChart3 className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">Deep Analytics</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced metrics including volatility estimates, support/resistance, and put/call ratios.
            </p>
          </div>

          <div className="group">
            <Lock className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">Open Source</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              MIT licensed, full documentation, production-ready TypeScript codebase with comprehensive API.
            </p>
          </div>

        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-[1600px] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-8">Built With Modern Stack</h2>
          <div className="flex flex-wrap justify-center gap-3 font-mono text-xs">
            <div className="px-4 py-2 bg-white border border-gray-200">React 18</div>
            <div className="px-4 py-2 bg-white border border-gray-200">TypeScript</div>
            <div className="px-4 py-2 bg-white border border-gray-200">Node.js + Express</div>
            <div className="px-4 py-2 bg-white border border-gray-200">Google Gemini AI</div>
            <div className="px-4 py-2 bg-white border border-gray-200">TailwindCSS</div>
            <div className="px-4 py-2 bg-white border border-gray-200">Vite</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Start Building Today</h2>
        <p className="text-gray-600 font-mono text-sm mb-8 max-w-2xl mx-auto">
          Clone the repository, install dependencies, and launch in minutes.<br />
          Full documentation and backend setup included.
        </p>
        <button
          onClick={onEnter}
          className="bg-black text-white px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all hover:shadow-xl inline-flex items-center gap-3"
        >
          <Terminal className="w-4 h-4" />
          Launch Terminal
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500 font-mono">
            <span className="font-bold text-black">SENTINEL PROTOCOL</span> // OPEN SOURCE INTELLIGENCE
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] text-gray-400">
            <a href="https://github.com/peterMeas" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              Created by Peter Meas
            </a>
            <span>|</span>
            <span>MIT Licensed</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
