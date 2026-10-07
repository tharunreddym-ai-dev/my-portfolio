import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Socials } from './components/Socials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ChatbotModal } from './components/ChatbotModal';
import { FloatingChatTrigger } from './components/FloatingChatTrigger';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070A10] text-[#E5ECF6] selection:bg-brand-500/30 selection:text-brand-300 font-sans antialiased relative">
      {/* Fixed Navigation */}
      <Navbar onOpenChat={() => setChatOpen(true)} />

      {/* Main Single-Page Sections */}
      <main>
        <Hero onOpenChat={() => setChatOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Socials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenChat={() => setChatOpen(true)} />

      {/* Floating Chat Trigger (Phone Corner & Desktop) */}
      <FloatingChatTrigger
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
      />

      {/* AI Portfolio Assistant Modal */}
      <ChatbotModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
