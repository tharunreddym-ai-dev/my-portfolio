import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Bot } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface FooterProps {
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChat }) => {
  const [bengaluruTime, setBengaluruTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setBengaluruTime(timeStr);
      } catch {
        setBengaluruTime('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070B] border-t border-[#1E2A3C] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-[#1E2A3C]/60">
          {/* Col 1: Brand */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-white">
                Tharun Reddy M
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                AI &amp; Automation
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Crafting high-converting single-page websites with lead-capture systems for businesses, plus enterprise multi-agent workflows and RAG pipelines for tech founders.
            </p>
          </div>

          {/* Col 2: Bengaluru Clock & Bot trigger */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
            {bengaluruTime && (
              <div className="bg-[#0D131D] border border-[#1E2A3C] px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                <span>Bengaluru Time: {bengaluruTime} IST</span>
              </div>
            )}

            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0D131D] hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 text-xs font-mono text-brand-400 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Twin</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#0D131D] hover:bg-[#131B28] border border-[#1E2A3C] text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>
            © {new Date().getFullYear()} Tharun Reddy M. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Built for high performance, zero fluff &amp; verified outcomes</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
