import React, { useState } from 'react';
import { FAQItem } from '../../types';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC<{
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}> = ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Understand the color science, conversion algorithms, accessibility thresholds, and workflow shortcuts.',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-12 border-t border-[var(--border-glass)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-glass-input)] text-[var(--text-secondary)] mb-3 border border-[var(--border-glass-subtle)]">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Knowledge Base & Color Science</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] overflow-hidden transition-colors backdrop-blur-md"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-[var(--text-primary)] hover:text-indigo-500 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-500' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-glass-subtle)]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
