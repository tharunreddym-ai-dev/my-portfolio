import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Linkedin, Github, Instagram, Youtube, ArrowUpRight, MessageCircle } from 'lucide-react';

export const Socials: React.FC = () => {
  const { socials } = portfolioData;

  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin className="w-6 h-6 text-[#0A66C2]" />;
      case 'Github':
        return <Github className="w-6 h-6 text-white" />;
      case 'Instagram':
        return <Instagram className="w-6 h-6 text-[#E4405F]" />;
      case 'Youtube':
        return <Youtube className="w-6 h-6 text-[#FF0000]" />;
      default:
        return <MessageCircle className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section id="socials" className="py-20 relative bg-[#070A10] border-t border-[#1E2A3C]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-brand-400 mb-2">Connect &amp; follow</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Social Links &amp; Channels
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl">
          Whether you want to inspect open-source agent code, send a quick business DM, or connect professionally:
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socials.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0D131D] hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-brand-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#070A10] border border-[#1E2A3C] group-hover:border-brand-500/40 flex items-center justify-center transition-colors">
                    {renderSocialIcon(social.icon)}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-300 transition-colors">
                  {social.platform}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {social.handle}
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {social.note}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E2A3C] flex items-center text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                <span>Visit {social.platform}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
