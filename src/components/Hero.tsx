import React from 'react';
import { ArrowRight, Bot, Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroProps {
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  const { personal } = portfolioData;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Subtle Background Ambience (Deep Obsidian with restrained Emerald glow) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-brand-700/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D131D] border border-[#1E2A3C] text-xs font-mono text-slate-300 mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span className="text-brand-400 font-semibold">Bengaluru, IN</span>
        </div>

        {/* Primary Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
              Hello,
              <br />
              I&apos;m <span className="text-white">{personal.name}</span>
              <br />
              <span className="text-white">{personal.role}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
              Bridging the gap between cutting-edge AI architectures and real-world business revenue.
              Whether you need automated lead-capture systems or enterprise multi-agent workflows,
              I build solutions that work without friction.
            </p>

            {/* Dual Audience Value Propositions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: For Small Businesses & Creators (Non-Tech) */}
              <div className="group relative bg-[#0D131D]/90 hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 rounded-xl p-5 transition-all duration-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> If you are a non-tech person
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    Revenue &amp; Leads
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {personal.positioningNonTech}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-brand-400 font-medium">Outcome:</span>
                  <span>Instant Telegram lead alerts &amp; zero missed inquiries.</span>
                </div>
              </div>

              {/* Box 2: For Founders & Engineering Teams (Tech) */}
              <div className="group relative bg-[#0D131D]/90 hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 rounded-xl p-5 transition-all duration-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> If you are a tech person
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    Multi-Agent &amp; RAG
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {personal.positioningTech}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-brand-400 font-medium">Stack:</span>
                  <span>LangChain, CrewAI, n8n, Vector DBs.</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all shadow-md shadow-brand-500/25 flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Top Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="px-5 py-3 rounded-lg bg-[#0D131D] hover:bg-[#131B28] border border-[#1E2A3C] hover:border-slate-600 text-slate-200 text-sm font-medium transition-all"
              >
                Hire / Discuss a Project
              </a>

              <button
                onClick={onOpenChat}
                className="px-4 py-3 rounded-lg bg-[#0D131D] hover:bg-brand-950/40 border border-brand-500/30 text-brand-300 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-brand-400" />
                <span>Ask My AI Twin</span>
              </button>
            </div>
          </div>

          {/* Desktop Robot Callout & Visual Badge */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-start">
            <div className="relative w-full max-w-sm">
              {/* Robot Card */}
              <div className="bg-gradient-to-b from-[#0D131D] to-[#070A10] border border-[#1E2A3C] rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-brand-500/40 transition-all">
                {/* Speech Bubble */}
                <div className="mb-4 bg-brand-950/40 border border-brand-500/30 rounded-xl p-3 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-brand-300">
                      Portfolio AI Twin • Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    &ldquo;Hey! Click below to chat with me about Tharun&apos;s background, lead-gen websites, or AI agent architectures!&rdquo;
                  </p>
                  {/* Bubble pointer */}
                  <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#0D131D] border-b border-r border-brand-500/30 rotate-45" />
                </div>

                {/* Friendly Robot Avatar Illustration */}
                <div className="flex justify-center my-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#131B28] to-[#070A10] border-2 border-brand-500/40 flex items-center justify-center shadow-lg shadow-brand-500/10 group-hover:scale-105 transition-transform">
                      <Bot className="w-12 h-12 text-brand-400 animate-pulse" />
                    </div>
                    {/* Small antenna glow */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-400 shadow-sm shadow-brand-400" />
                  </div>
                </div>

                {/* Robot CTA Button */}
                <button
                  onClick={onOpenChat}
                  className="w-full mt-2 py-2.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/40 hover:border-brand-400 text-brand-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Chat with Tharun AI</span>
                </button>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-slate-500 font-mono">
                    15 free messages/day • Instant answers
                  </span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Zero spam • Direct responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
