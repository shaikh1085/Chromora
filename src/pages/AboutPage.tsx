import React from 'react';
import { ShieldCheck, Sparkles, Code2, Zap } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'About Chromora — Create Colors That Work Beautifully',
          description:
            'Discover the mission behind Chromora: zero-server private color science, WCAG 2.1 accessibility auditing, and unified design tokens.',
          canonicalUrl: 'https://chromoraflow.vercel.app/about',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'About Chromora', url: '/about', isCurrent: true }]}
          onNavigate={navigate}
        />

        <div className="my-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design System Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            About Chromora
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Chromora was founded on a simple conviction: digital color should be mathematically precise, universally accessible, and effortless to integrate into modern software codebases.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              100% Zero-Server Privacy
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every color conversion, pixel cluster extraction, and contrast algorithm runs entirely in your browser using HTML5 Canvas and Web APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Color Science & OKLCH
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We leverage perceptual uniform color spaces like OKLCH and CIELAB to guarantee consistent contrast and proportional lightness scales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-glass-card)] border border-[var(--border-glass)] shadow-sm space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Developer-First Tokens
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Export straight to Tailwind CSS configs, W3C design tokens JSON, CSS Custom Properties, and SCSS variables in one click.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="max-w-none text-sm leading-relaxed space-y-6 text-[var(--text-secondary)] py-6 border-t border-[var(--border-glass)]">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Why Disjointed Color Tools Fail
            </h2>
            <p>
              Traditional color websites are fragmented: one tool for hex lookups, another for contrast testing, and another for gradient generation. Most rely on outdated sRGB calculations that fail to reflect human optical perception. Chromora provides an end-to-end suite combining color science, WCAG accessibility checks, and modern code generation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Accessibility by Design
            </h2>
            <p>
              Color should never be a barrier to information. Chromora enforces WCAG 2.1 AA and AAA standards with live interactive components and one-click contrast auto-tuning so teams can ship accessible digital interfaces by default.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
