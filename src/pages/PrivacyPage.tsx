import React from 'react';
import { Lock } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PrivacyPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen py-8">
      <SEO
        config={{
          title: 'Privacy Policy — Chromora',
          description:
            'Chromora values your privacy: 100% client-side local calculations, zero server storage of uploaded images, and zero third-party telemetry.',
          canonicalUrl: 'https://chromoraflow.vercel.app/privacy',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Privacy Policy', url: '/privacy', isCurrent: true }]}
          onNavigate={navigate}
        />

        <div className="my-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Data Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--text-muted)]">Last updated: January 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed py-6 border-t border-[var(--border-glass)]">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              1. Local-First Processing
            </h2>
            <p>
              Chromora is built from the ground up to operate client-side in your web browser. All color conversions, mathematical transformations, palette generation, and WCAG contrast evaluations execute entirely within your local browser runtime.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              2. Image Processing & Photos
            </h2>
            <p>
              When you use the Image to Color Palette Extractor, your photos are loaded directly into an HTML5 Canvas on your computer. Your images are never uploaded, transmitted, or stored on any remote server.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              3. Local Storage Persistence
            </h2>
            <p>
              Your saved palettes, custom collections, and theme preferences (Dark / Light mode) are saved exclusively to your browser's local storage (<code className="font-mono text-xs bg-[var(--surface-glass-card)] border border-[var(--border-glass-subtle)] text-[var(--text-primary)] px-1.5 py-0.5 rounded">localStorage</code>). You retain full control to export or delete this data at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              4. Contact & Security Inquiries
            </h2>
            <p>
              For privacy or security inquiries regarding Chromora, reach out to contact@chromoraflow.vercel.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
