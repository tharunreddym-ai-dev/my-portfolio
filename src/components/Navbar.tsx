import React, { useState, useEffect } from 'react';
import { Menu, X, Bot, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'socials', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About Me', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Social Links', href: '#socials', id: 'socials' },
    { label: 'Contact ME', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070A10]/90 backdrop-blur-md border-b border-[#1E2A3C]/80 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo / Monogram */}
          <a
            href="#home"
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0D131D] border border-[#1E2A3C] group-hover:border-brand-500/50 flex items-center justify-center transition-colors">
              <span className="font-heading font-bold text-lg text-brand-400 group-hover:text-brand-300">
                TR
              </span>
            </div>
            <div>
              <div className="font-heading font-bold text-base tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Tharun Reddy M
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                <span>Bengaluru • Available for work</span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#0D131D]/80 border border-[#1E2A3C] px-3 py-1.5 rounded-full shadow-inner shadow-black/50">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Chat trigger & Contact CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D131D] hover:bg-[#131B28] border border-[#1E2A3C] hover:border-brand-500/40 text-xs font-medium text-slate-200 hover:text-brand-300 transition-all cursor-pointer shadow-xs"
              title="Open Tharun AI Assistant"
            >
              <Bot className="w-4 h-4 text-brand-400" />
              <span>Ask AI Bot</span>
            </button>

            <a
              href="#contact"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 hover:shadow-brand-500/30"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenChat}
              className="p-2 rounded-lg bg-[#0D131D] border border-[#1E2A3C] text-brand-400"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0D131D] border border-[#1E2A3C] text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A10]/98 border-b border-[#1E2A3C] px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                activeSection === link.id
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-slate-300 hover:bg-[#131B28]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#1E2A3C] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#131B28] border border-[#1E2A3C] text-sm text-brand-400 font-medium"
            >
              <Bot className="w-4 h-4" />
              <span>Chat with Tharun AI</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-brand-500 text-white font-bold text-sm"
            >
              Contact Tharun
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
