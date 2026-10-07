import React, { useState } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, Cpu, Layers, ExternalLink } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects } = portfolioData;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 relative bg-[#070A10] border-t border-[#1E2A3C]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-brand-400 mb-2">Featured systems</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Engineered for real-world impact. Each card combines the practical human benefit with the technical architecture under the hood.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-[#0D131D] border border-[#1E2A3C] px-3 py-1.5 rounded-lg self-start md:self-auto">
            <span>4 Production Case Studies</span>
          </div>
        </div>

        {/* Asymmetrical 2-Column Responsive Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project: Project, index: number) => (
            <div
              key={project.id}
              className="group bg-[#0D131D] border border-[#1E2A3C] hover:border-brand-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-brand-500/5"
            >
              {/* Image Preview & Badge */}
              <div
                className="relative aspect-[16/9] w-full overflow-hidden bg-[#070A10] cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D131D] via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#0D131D]/90 backdrop-blur-md border border-brand-500/30 text-brand-400 font-semibold shadow-xs">
                    {project.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1 shadow-md">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-heading font-bold text-xl sm:text-2xl text-white group-hover:text-brand-300 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">0{index + 1}</span>
                </div>

                <p className="text-xs font-mono text-brand-400 mt-1">
                  {project.subtitle}
                </p>

                {/* Two Clear Boxes: Benefit vs Tech */}
                <div className="mt-5 space-y-3 flex-1">
                  <div className="bg-[#131B28]/60 border border-[#1E2A3C] p-3 rounded-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Business Outcome:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.nonTechBenefit}
                    </p>
                  </div>

                  <div className="bg-[#131B28]/40 border border-[#1E2A3C] p-3 rounded-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold block mb-1">
                      Technical Architecture:
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {project.techDeepDive}
                    </p>
                  </div>
                </div>

                {/* Measurable Metric */}
                <div className="mt-4 pt-3 border-t border-[#1E2A3C] text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                  <span className="text-slate-300">{project.metrics}</span>
                </div>

                {/* Tags & Action CTA */}
                <div className="mt-5 pt-4 border-t border-[#1E2A3C] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131B28] border border-[#1E2A3C] text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Deep Dive Architecture */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
