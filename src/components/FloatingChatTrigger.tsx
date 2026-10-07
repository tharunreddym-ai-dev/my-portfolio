import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { getChatUsage } from '../utils/deviceSession';

interface FloatingChatTriggerProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const FloatingChatTrigger: React.FC<FloatingChatTriggerProps> = ({ onOpen, isOpen }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [remaining, setRemaining] = useState(15);

  useEffect(() => {
    const usage = getChatUsage();
    setRemaining(usage.remaining);

    // Auto-minimize tooltip after 10 seconds if not hovered
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      {/* Desktop Speech Bubble Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#0D131D]/95 border border-brand-500/40 text-slate-200 text-xs py-2 px-3.5 rounded-xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-300">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping"></span>
            <span className="text-brand-300 font-semibold">Have questions?</span>
            <span className="text-slate-300">Chat with Tharun AI</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
            aria-label="Dismiss hint"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Circular Action Trigger */}
      <button
        onClick={onOpen}
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white p-0.5 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <div className="w-full h-full rounded-[14px] bg-[#070A10] group-hover:bg-[#0D131D] flex items-center justify-center transition-colors">
          <Bot className="w-6 h-6 text-brand-400 group-hover:text-brand-300 transition-colors animate-pulse" />
        </div>

        {/* Small remaining counter pill */}
        <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
          {remaining > 9 ? 'AI' : remaining}
        </span>
      </button>
    </div>
  );
};
