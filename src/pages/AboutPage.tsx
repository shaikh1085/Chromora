import React from 'react';
import { ShieldCheck, Compass, Sparkles, Code2, Users, Heart, Zap } from 'lucide-react';
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design System Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            About Chromora
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Chromora was founded on a simple conviction: digital color should be mathematically precise, universally accessible, and effortless to integrate into modern software codebases.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              100% Zero-Server Privacy
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every color conversion, pixel cluster extraction, and contrast algorithm runs entirely in your browser using HTML5 Canvas and Web APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Color Science & OKLCH
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We leverage perceptual uniform color spaces like OKLCH and CIELAB to guarantee consistent contrast and proportional lightness scales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Developer-First Tokens
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Export straight to Tailwind CSS configs, W3C design tokens JSON, CSS Custom Properties, and SCSS variables in one click.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-zinc-700 dark:text-zinc-300 py-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Why Disjointed Color Tools Fail
          </h2>
          <p>
            Traditional color websites are fragmented: one tool for hex lookups, another for contrast testing, and another for gradient generation. Most rely on outdated sRGB calculations that fail to reflect human optical perception. Chromora provides an end-to-end suite combining color science, WCAG accessibility checks, and modern code generation.
          </p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Accessibility by Design
          </h2>
          <p>
            Color should never be a barrier to information. Chromora enforces WCAG 2.1 AA and AAA standards with live interactive components and one-click contrast auto-tuning so teams can ship accessible digital interfaces by default.
          </p>
        </div>
      </div>
    </div>
  );
};
