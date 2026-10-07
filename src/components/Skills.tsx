import React, { useState } from 'react';
import { portfolioData, SkillItem } from '../data/portfolioData';
import { Globe, Zap, Bot, Cpu, Layers, Terminal, Database, Workflow, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Skills: React.FC = () => {
  const { skillsNonTech, skillsTech } = portfolioData;
  const [filterMode, setFilterMode] = useState<'all' | 'business' | 'tech'>('all');

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-brand-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-brand-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-brand-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-brand-400" />;
      default:
        return <Layers className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-[#070A10] border-t border-[#1E2A3C]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-brand-400 mb-2">Capabilities &amp; stack</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Skills &amp; Capabilities
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Genuinely divided into real business outcomes for clients and deep architectural tools for engineers.
            </p>
          </div>

          {/* Audience Filter Tabs */}
          <div className="flex items-center bg-[#0D131D] border border-[#1E2A3C] p-1 rounded-xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-brand-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Show Both Parts
            </button>
            <button
              onClick={() => setFilterMode('business')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'business'
                  ? 'bg-brand-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Business Owners
            </button>
            <button
              onClick={() => setFilterMode('tech')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'tech'
                  ? 'bg-brand-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Tech / Engineers
            </button>
          </div>
        </div>

        <div className="space-y-16">
          {/* Non-tech skills */}
          {(filterMode === 'all' || filterMode === 'business') && (
            <div className="bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold px-2.5 py-1 rounded bg-brand-500/10 border border-brand-500/20">
                  If you&apos;re a non-tech person
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-3">
                  If you&apos;re not from a tech background, read this for a clearer understanding of my skills
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  You don&apos;t need to care what programming framework is used under the hood. Here is what my technical skills actually do for your business, your brand, and your bank account:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                {skillsNonTech.map((skill: SkillItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#131B28]/70 hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 rounded-xl p-5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0D131D] border border-[#1E2A3C] group-hover:border-brand-500/40 flex items-center justify-center shrink-0">
                        {getIcon(skill.iconName)}
                      </div>
                      {skill.tag && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {skill.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-base text-white mt-3 group-hover:text-brand-300 transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech skills */}
          {(filterMode === 'all' || filterMode === 'tech') && (
            <div className="bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold px-2.5 py-1 rounded bg-brand-500/10 border border-brand-500/20">
                  If you&apos;re a tech person
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-3">
                  Technical Stack &amp; Deep Systems Orchestration
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  For software architects, CTOs, and developers looking for exact system competencies, multi-agent frameworks, and vector retrieval pipelines:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {skillsTech.map((cat, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#131B28]/70 border border-[#1E2A3C] rounded-xl p-5 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-brand-400" />
                      <h4 className="font-heading font-semibold text-sm text-white tracking-wide">
                        {cat.category}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md bg-[#070A10] border border-[#1E2A3C] hover:border-brand-500/40 text-slate-300 hover:text-brand-300 text-xs font-mono transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Systems Guarantees */}
              <div className="mt-8 pt-6 border-t border-[#1E2A3C] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Strict schema validation with Pydantic v2</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Sub-second vector retrieval with dense embeddings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Resilient fallback chains for zero API downtime</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
