import React from 'react';
import { Calculator, ExternalLink } from 'lucide-react';

/** The user's other site — PayWise UK, free UK salary & take-home pay calculators. */
export const PAYWISE_URL = 'https://paywiseuk.vercel.app/';

export const PAYWISE_LABEL = 'PayWise UK — Free UK salary & take-home pay calculators';

/**
 * Standalone banner for Chromora's homepage. It is deliberately styled as
 * "our other site" (green PayWise accent, not Chromora indigo) so visitors
 * do not mistake it for a Chromora tool.
 */
export const PayWiseCard: React.FC = () => (
  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
        <Calculator className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Also from the maker of Chromora
        </p>
        <p className="text-base font-bold text-[var(--text-primary)] truncate">{PAYWISE_LABEL}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Check your UK pay after Income Tax, National Insurance, pension and student loan — free calculators.
        </p>
      </div>
    </div>
    <a
      href={PAYWISE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
    >
      <span>Visit PayWise UK</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  </div>
);
