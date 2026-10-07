import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { MapPin, GraduationCap, CheckCircle2, Code2, Sparkles, Building, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  const { personal } = portfolioData;
  const [photoError, setPhotoError] = useState(false);

  return (
    <section id="about" className="py-24 relative bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-brand-400 mb-3">Background &amp; philosophy</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Me
        </h2>

        {/* Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Portrait Photo Frame */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Outer decorative card */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-500/20 to-brand-500/10 blur-md group-hover:blur-lg transition-all opacity-70"></div>
              
              <div className="relative rounded-2xl bg-[#0D131D] border border-[#1E2A3C] p-3 overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#131B28] relative flex items-center justify-center">
                  <img
                    src={photoError ? '/images/tharun-photo.svg' : personal.photoUrl}
                    onError={() => setPhotoError(true)}
                    alt="Tharun Reddy M"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A10]/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Pill on image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0D131D]/90 backdrop-blur-md border border-[#1E2A3C] p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-heading font-bold text-white">Tharun Reddy M</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-mono border border-brand-500/20">
                      Bengaluru
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Details Chips */}
            <div className="mt-6 grid grid-cols-1 gap-3">

              <div className="bg-[#0D131D] border border-[#1E2A3C] p-3.5 rounded-xl flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-slate-400 font-mono uppercase">Base Location</div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5">Bengaluru, Karnataka</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dual-Audience Story & Core Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-8">
              <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                <span>Engineering Real-World Utility, Not AI Hype</span>
              </h3>
              
              <div className="mt-4 space-y-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                <p><strong className="text-white font-medium">For businesses,</strong> I build portfolio websites, lead-capture systems, auto-reply systems, chatbots and workflow automations.</p>
                <p><strong className="text-white font-medium">For developers and founders,</strong> I build agentic systems, LLM applications, RAG systems, multi-agent workflows and n8n automations.</p>
                <p>I learn by building, and every project here is something I built to understand how it really works.</p>
              </div>

              {/* What I Deliver for Both Worlds */}
              <div className="mt-8 pt-6 border-t border-[#1E2A3C] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-brand-400">
                    <Building className="w-3.5 h-3.5" /> For Small Businesses
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>Single-page portfolio websites that convert visitors</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>Automates the boring, repetitive tasks so you don&apos;t have to</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>24/7 custom AI assistants that answer pricing FAQs</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-brand-400">
                    <Rocket className="w-3.5 h-3.5" /> For Tech Teams &amp; Founders
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>Multi-agent autonomous systems (CrewAI &amp; LangChain)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>RAG pipelines with vector databases (Pinecone, ChromaDB)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>Robust n8n workflow orchestrations &amp; API integrations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0D131D] border border-[#1E2A3C] p-4 rounded-xl text-center">
                <span className="text-brand-400 font-heading font-bold text-xl">100%</span>
                <p className="text-xs text-slate-400 mt-1">Direct communication with me</p>
              </div>
              <div className="bg-[#0D131D] border border-[#1E2A3C] p-4 rounded-xl text-center">
                <span className="text-brand-400 font-heading font-bold text-xl">&lt; 24h</span>
                <p className="text-xs text-slate-400 mt-1">Response time on inquiries</p>
              </div>
              <div className="bg-[#0D131D] border border-[#1E2A3C] p-4 rounded-xl text-center">
                <span className="text-brand-400 font-heading font-bold text-xl">Zero Fluff</span>
                <p className="text-xs text-slate-400 mt-1">Clean code &amp; clear outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
