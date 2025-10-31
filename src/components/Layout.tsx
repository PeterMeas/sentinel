import React from 'react';
import { Github, Terminal, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick?: () => void;
  onDocsClick?: () => void;
  showDocsButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onDocsClick, showDocsButton = true }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative selection:bg-black selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-black text-white p-1.5">
                <Terminal size={16} />
            </div>
            <div className="flex flex-col">
                <h1 className="font-mono font-bold text-sm tracking-tighter uppercase leading-none text-black">
                SENTINEL
                </h1>
                <span className="font-mono text-[10px] text-gray-400 uppercase leading-none tracking-widest">Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 text-[10px] font-mono uppercase text-gray-500">
            {showDocsButton && onDocsClick && (
              <button
                onClick={onDocsClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-black text-gray-600 hover:text-black transition-all"
              >
                <BookOpen size={14} />
                <span className="hidden sm:inline">Docs</span>
              </button>
            )}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-gray-200 bg-gray-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600">Online</span>
            </div>
            <a
              href="https://github.com/peterMeas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              <Github size={14} />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500 font-mono">
            <span className="font-bold text-black">SENTINEL PROTOCOL</span> <span className="text-gray-300">//</span> OPEN SOURCE INTELLIGENCE
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] text-gray-400">
            <a href="https://github.com/peterMeas" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              Created by Peter Meas
            </a>
            <span className="text-gray-300">|</span>
            <span>BUILD_ID: 2025.11.19.RC1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;