import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail, MapPin, Sparkles } from 'lucide-react';
import { getOrCreateDeviceId, checkContactRateLimit, recordContactSubmission } from '../utils/deviceSession';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side rate check
    const rateCheck = checkContactRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Rate limit reached (3 submissions per hour). Please wait ${rateCheck.waitMinutes} minute(s) before sending another inquiry, or email tharunreddymofficialg@gmail.com directly.`
      );
      return;
    }

    // Client-side field validations
    if (formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setErrorMessage('Please enter a valid phone number (at least 7 digits with country code).');
      return;
    }

    if (formData.business.trim().length < 5) {
      setErrorMessage('Please provide a brief description of you or your business (at least 5 characters).');
      return;
    }

    setLoading(true);

    try {
      const deviceId = getOrCreateDeviceId();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          deviceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      // Record successful submission for rate limit
      recordContactSubmission();
      setSuccessData(data);
      setFormData({
        name: '',
        email: '',
        phone: '',
        business: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please try again or email tharunreddymofficialg@gmail.com.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#070A10] border-t border-[#1E2A3C]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-brand-400 mb-2">Start a conversation</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Me
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl">
          Share your idea, website requirements, or engineering problem. I review every message personally and respond within 24 hours.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Value Commitments */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-7">
              <h3 className="font-heading font-bold text-lg text-white mb-4">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#131B28] border border-[#1E2A3C] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">Primary Email</div>
                    <a
                      href="mailto:tharunreddymofficialg@gmail.com"
                      className="text-sm font-medium text-white hover:text-brand-400 transition-colors"
                    >
                      tharunreddymofficialg@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#131B28] border border-[#1E2A3C] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">Location</div>
                    <span className="text-sm font-medium text-white">
                      Bengaluru, India (IST Timezone)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rate Limit Transparency */}
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Rate limited to 3 submissions per hour per device to protect against bots.</span>
              </div>
            </div>
          </div>

          {/* Right: The Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-8">
              {successData ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-500/15 border-2 border-brand-500 flex items-center justify-center mx-auto text-brand-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {successData.message}
                  </p>

<div className="pt-4">
                    <button
                      onClick={() => setSuccessData(null)}
                      className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Your Name <span className="text-brand-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma or Alex Chen"
                        className="w-full bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Email Address <span className="text-brand-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Phone / WhatsApp <span className="text-brand-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        About You / Your Business <span className="text-brand-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="business"
                        required
                        value={formData.business}
                        onChange={handleChange}
                        placeholder="e.g. Bakery owner, Makeup artist, Founder"
                        className="w-full bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Your Message or Project Details <span className="text-slate-500">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={1000}
                      placeholder="Tell me what you are trying to build, your current bottlenecks, or your timeline..."
                      className="w-full bg-[#131B28] border border-[#1E2A3C] focus:border-brand-500 focus:outline-none rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors resize-none"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                      <span>Max 1000 characters</span>
                      <span>{formData.message.length}/1000</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:bg-brand-700/50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry to Tharun</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    <span>Sent securely over HTTPS and used only to respond to your inquiry.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
