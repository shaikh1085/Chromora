import React, { useState } from 'react';
import { usePalette } from '../../context/PaletteContext';
import { Mail, Check, ArrowRight } from 'lucide-react';

export const Footer: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const { showToast } = usePalette();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Chromora Digest', 'You will receive monthly color palettes & design trends', 'success');
  };

  const coreColorTools = [
    { label: 'Color Picker & Explorer', route: '/color-picker' },
    { label: 'Interactive Color Wheel', route: '/color-wheel' },
    { label: 'Color Palette Generator', route: '/color-palette-generator' },
    { label: 'AI Palette Generator', route: '/ai-palette-generator' },
    { label: 'CSS Gradient Studio', route: '/gradient-generator' },
    { label: 'Shades & Tints Generator', route: '/color-shades-generator' },
    { label: 'Color Mixer Online', route: '/color-mixer' },
    { label: 'Random Color Generator', route: '/random-color-generator' },
  ];

  const conversionAndCodeTools = [
    { label: 'Design Preview Studio', route: '/design-preview' },
    { label: 'Image Color Extractor', route: '/image-color-palette' },
    { label: 'WCAG Contrast Checker', route: '/contrast-checker' },
    { label: 'Multi-Way Color Converter', route: '/color-converter' },
    { label: 'Color Blindness Simulator', route: '/color-blindness-simulator' },
    { label: 'Pantone & RAL Converter', route: '/pantone-color-converter' },
    { label: 'Favicon & App Icon Maker', route: '/favicon-generator' },
    { label: 'Color Search & Directory', route: '/colors' },
  ];

  const colorFamilies = [
    { label: 'Red Colors', route: '/colors?family=red' },
    { label: 'Blue Colors', route: '/colors?family=blue' },
    { label: 'Green Colors', route: '/colors?family=green' },
    { label: 'Yellow Colors', route: '/colors?family=yellow' },
    { label: 'Purple Colors', route: '/colors?family=purple' },
    { label: 'Orange Colors', route: '/colors?family=orange' },
    { label: 'Pink Colors', route: '/colors?family=pink' },
    { label: 'Earthy Tones', route: '/colors?family=brown' },
  ];

  const legalLinks = [
    { label: 'About Chromora', route: '/about' },
    { label: 'Saved Palettes Studio', route: '/saved-palettes' },
    { label: 'HEX to RGB Converter', route: '/hex-to-rgb' },
    { label: 'RGB to HEX Converter', route: '/rgb-to-hex' },
    { label: 'HEX to HSL Converter', route: '/hex-to-hsl' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Service', route: '/terms' },
  ];

  return (
    <footer
      id="main-footer"
      className="border-t border-[var(--border-glass)] bg-[var(--surface-glass)] text-[var(--text-secondary)] text-sm transition-colors backdrop-blur-xl"
    >
      {/* Top Newsletter & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg p-0.5 flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, var(--accent), #f0abfc, #38bdf8)`,
                  boxShadow: `0 0 16px var(--accent-glow)`,
                }}
              >
                <div className="w-full h-full bg-[var(--bg-page)] rounded-[6px] flex items-center justify-center">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Chromora
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Turn any color into a complete design system. Chromora empowers designers to discover accessible palettes, preview live designs, and generate theme tokens.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Local & Private Processing
              </span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <span
                className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full inline-block mb-2"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                }}
              >
                Color Intelligence
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                Chromora Design System Digest
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
                Get monthly curated color harmonies, accessible design system tokens, and design trend breakdowns straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="designer@company.com"
                  disabled={subscribed}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60 font-mono"
                  aria-label="Email address for color newsletter"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="px-6 py-3 rounded-xl btn-accent font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Join Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-[var(--border-glass-subtle)]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Core Color Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              {coreColorTools.map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.route);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Conversions & Code
            </h4>
            <ul className="space-y-2.5 text-xs">
              {conversionAndCodeTools.map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.route);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Color Families
            </h4>
            <ul className="space-y-2.5 text-xs">
              {colorFamilies.map((fam) => (
                <li key={fam.route}>
                  <a
                    href={fam.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(fam.route);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-block"
                  >
                    {fam.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              {legalLinks.map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.route);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[var(--border-glass-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Chromora Labs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                navigate('/privacy');
              }}
              className="hover:text-[var(--text-secondary)]"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigate('/terms');
              }}
              className="hover:text-[var(--text-secondary)]"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
