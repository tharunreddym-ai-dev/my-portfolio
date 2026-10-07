import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Clock, AlertTriangle, MessageSquare, RotateCcw, ShieldCheck } from 'lucide-react';
import { getOrCreateDeviceId, getChatUsage, syncChatUsageFromServer, ChatUsageState } from '../utils/deviceSession';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Renders the small subset of markdown the AI uses (**bold** and "- " bullets)
// as real formatting, safely (no HTML injection), so visitors never see raw asterisks.
function renderInline(line: string, keyBase: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={`${keyBase}-${i}`} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyBase}-${i}`}>{part.replace(/\*\*/g, '').replace(/(^|\s)\*([^*\n]+)\*(?=\s|[.,!?]|$)/g, '$1$2').replace(/(^|\s)_([^_\n]+)_(?=\s|[.,!?]|$)/g, '$1$2')}</React.Fragment>
    )
  );
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={key} className="list-disc pl-5 space-y-1">
          {bullets.map((b, i) => (
            <li key={i}>{renderInline(b, `${key}-${i}`)}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flush(`ul-${idx}`);
    if (!line) return;
    const heading = line.replace(/^#{1,6}\s+/, '');
    blocks.push(<p key={`p-${idx}`}>{renderInline(heading, `p-${idx}`)}</p>);
  });
  flush('ul-end');

  return <div className="space-y-2 break-words">{blocks}</div>;
};

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Tharun's AI Portfolio Assistant. I can answer questions about his website & lead-generation packages for small businesses, or his AI agent systems (CrewAI, LangChain, n8n). How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<ChatUsageState>(getChatUsage());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsage(getChatUsage());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickQuestions = [
    "What websites do you build for small businesses?",
    "How does the instant Telegram lead alert work?",
    "Explain your CrewAI 5-agent project",
    "What is your tech stack and experience?",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const deviceId = getOrCreateDeviceId();
      const payload = {
        deviceId,
        messages: [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer from assistant.');
      }

      // Keep the badge in sync with the server's real count.
      if (typeof data.messagesRemaining === 'number') {
        setUsage(syncChatUsageFromServer(data.messagesRemaining, data.resetHours));
      }

      const botMsg: Message = {
        role: 'assistant',
        content: data.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err.message ||
            'Apologies, I encountered a temporary connection glitch. Please check your message or reach out directly to Tharun at tharunreddymofficialg@gmail.com.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Tharun AI Assistant"
    >
      <div
        className="w-full sm:max-w-xl h-[90dvh] sm:h-[min(640px,calc(100dvh-2rem))] bg-[#070A10] border-t sm:border border-[#1E2A3C] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3 bg-[#0D131D] border-b border-[#1E2A3C] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-[#131B28] border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">
                  Tharun AI Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                Ask about skills, lead sites &amp; AI architectures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Daily limit badge */}
            <div
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold border flex items-center gap-1 whitespace-nowrap ${
                usage.isLimitReached
                  ? 'bg-red-500/10 text-red-300 border-red-500/30'
                  : 'bg-brand-500/10 text-brand-300 border-brand-500/30'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>
                {usage.remaining} / 15 <span className="hidden sm:inline">messages </span>left
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#131B28] border border-[#1E2A3C] hover:bg-brand-500 hover:border-brand-500 text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#070A10]">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-500 text-white font-medium rounded-br-xs shadow-md shadow-brand-500/10'
                      : 'bg-[#0D131D] border border-[#1E2A3C] text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <FormattedText text={msg.content} />
                </div>

                {/* Timestamp only (AI provider names are kept private) */}
                {msg.timestamp && (
                  <div className="mt-1 px-1 text-[10px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0D131D] border border-[#1E2A3C] w-fit px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span className="font-mono">Typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (show if under 3 messages) */}
        {messages.length <= 3 && !usage.isLimitReached && (
          <div className="shrink-0 px-4 py-2 bg-[#0D131D]/60 border-t border-[#1E2A3C]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#131B28] hover:bg-[#1E2A3C] border border-[#1E2A3C] text-[11px] text-slate-300 hover:text-brand-300 transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar, with a notice once the daily AI quota is used up */}
        <div className="shrink-0 p-3 bg-[#0D131D] border-t border-[#1E2A3C]">
          {usage.isLimitReached && (
            <div className="mb-2.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
              <div>
                <p className="font-semibold">Daily AI limit reached (15 messages).</p>
                <p className="text-[11px] text-sky-300/80 mt-0.5">
                  Full AI quota resets in ~{usage.hoursRemaining} hour(s). I can still answer quick questions about his projects, skills, or how to get in touch. For anything else, use the{' '}
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="underline text-brand-400 hover:text-brand-300 font-bold"
                  >
                    Contact Form
                  </a>{' '}
                  or DM Tharun on Instagram/LinkedIn!
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                usage.isLimitReached
                  ? "Ask about his projects, skills, or contact info..."
                  : "Ask about Tharun's skills, websites, or AI systems..."
              }
              className="flex-1 bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:bg-brand-700/40 disabled:cursor-not-allowed text-white font-bold transition-colors cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-brand-500" />
              Strict guardrails • Anti-jailbreak enabled
            </span>
            <span>Resets every 24h per device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
