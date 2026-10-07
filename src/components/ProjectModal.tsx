import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, ArrowRight } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0D131D] border border-[#1E2A3C] rounded-2xl p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#131B28] border border-[#1E2A3C] text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
            {project.badge}
          </span>
          <span className="text-xs text-slate-500 font-mono">• Architecture Deep Dive</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm font-mono text-brand-400 mt-1">
          {project.subtitle}
        </p>

        {/* Project Image / Visual Diagram */}
        <div className="mt-6 rounded-xl overflow-hidden border border-[#1E2A3C] bg-[#070A10]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[380px] object-contain bg-[#070A10]"
          />
        </div>

        {/* Dual Explanation in Modal */}
        <div className="mt-6 space-y-4">
          <div className="bg-[#131B28]/80 border border-[#1E2A3C] p-4 rounded-xl">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1.5">
              The Real-World Business Benefit
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.nonTechBenefit}
            </p>
          </div>

          <div className="bg-[#131B28]/80 border border-[#1E2A3C] p-4 rounded-xl">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1.5">
              Technical Architecture &amp; System Design
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {project.techDeepDive}
            </p>
          </div>
        </div>

        {/* Key Metrics Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/30 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white">Performance Metric:</strong> {project.metrics}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-2.5 py-1 rounded bg-[#070A10] border border-[#1E2A3C] text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-[#1E2A3C] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#131B28] hover:bg-[#1E2A3C] border border-[#1E2A3C] text-slate-200 text-xs font-medium transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <span>Request a Custom Solution Like This</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
