import React, { useMemo, useState } from 'react';
import {
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  Mail,
  Copy,
  Check,
  Link2,
  Share2,
  ExternalLink,
  Calculator,
} from 'lucide-react';
import { SEO } from '../common/SEO';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQSection } from '../common/FAQSection';
import { FAQItem, SEOConfig } from '../../types';
import { PAYWISE_URL, PAYWISE_LABEL } from '../common/PayWiseLink';

const CHROMORA_URL = 'https://chromoraflow.vercel.app/';
const CHROMORA_TITLE = 'Chromora — Free Color Tools for Designers & Developers';

interface ShareLinkDef {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

/** Copy text to the clipboard, with a textarea fallback for older browsers. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

export const ShareLinkGeneratorTool: React.FC<{ navigate: (route: string) => void }> = ({
  navigate,
}) => {
  const [url, setUrl] = useState(CHROMORA_URL);
  const [title, setTitle] = useState(CHROMORA_TITLE);
  const [text, setText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // A URL is valid when it parses and uses http:// or https://.
  const isValid = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }, [url]);

  const cleanUrl = url.trim();
  const shareText = text.trim() || title.trim() || cleanUrl;

  // Share-URL formats match src/components/common/ShareButtons.tsx exactly
  // (encodeURIComponent, same platforms) so both features stay consistent.
  const shareLinks: ShareLinkDef[] = useMemo(() => {
    if (!isValid) return [];
    const encodedUrl = encodeURIComponent(cleanUrl);
    const encodedText = encodeURIComponent(shareText);
    return [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${cleanUrl}`)}`,
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'x',
        name: 'X (Twitter)',
        href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        icon: <Twitter className="w-4 h-4" />,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: <Facebook className="w-4 h-4" />,
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        icon: <Linkedin className="w-4 h-4" />,
      },
      {
        id: 'telegram',
        name: 'Telegram',
        href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        icon: <Send className="w-4 h-4" />,
      },
      {
        id: 'email',
        name: 'Email',
        href: `mailto:?subject=${encodedText}&body=${encodeURIComponent(`${shareText}\n${cleanUrl}`)}`,
        icon: <Mail className="w-4 h-4" />,
      },
    ];
  }, [isValid, cleanUrl, shareText]);

  const handleCopy = async (id: string, value: string) => {
    if (await copyText(value)) {
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    }
  };

  const handleCopyAll = async () => {
    const all = shareLinks.map((link) => `${link.name}: ${link.href}`).join('\n');
    if (await copyText(all)) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const useExample = (exampleUrl: string, exampleTitle: string) => {
    setUrl(exampleUrl);
    setTitle(exampleTitle);
    setText('');
  };

  const generatorFaqs: FAQItem[] = [
    {
      question: 'How do I create share links for my website?',
      answer:
        'Paste your website URL above (it must start with http:// or https://), optionally add a title and a short message, and the generator instantly builds ready-to-use share links for WhatsApp, X, Facebook, LinkedIn, Telegram and Email. Copy any single link or copy them all at once.',
    },
    {
      question: 'Is my website URL sent anywhere or tracked?',
      answer:
        'No. Everything runs in your browser — your URL is never uploaded, stored or tracked. The share links are plain links that open each platform’s own share page.',
    },
    {
      question: 'Why do some share links open a blank or login page?',
      answer:
        'Share links open the platform’s share dialog, and most platforms ask you to sign in before posting. That is normal — the link itself already contains your URL and message, so after signing in the post is pre-filled for you.',
    },
  ];

  const seoConfig: SEOConfig = {
    title: 'Share Link Generator — Create WhatsApp, X, Facebook & LinkedIn Share Links',
    description:
      'Paste any website URL and instantly generate ready share links for WhatsApp, X, Facebook, LinkedIn, Telegram and Email. Free, no sign-up, everything runs in your browser.',
    canonicalUrl: 'https://chromoraflow.vercel.app/share-link-generator',
    keywords: [
      'share link generator',
      'create share links',
      'whatsapp share link generator',
      'social share link maker',
      'share your website',
      'facebook share link generator',
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://chromoraflow.vercel.app/' },
      { name: 'Share Link Generator', url: 'https://chromoraflow.vercel.app/share-link-generator' },
    ],
    faqs: generatorFaqs,
    softwareApp: {
      name: 'Chromora Share Link Generator Tool',
      description: 'Generate ready share links for any website URL for WhatsApp, X, Facebook, LinkedIn, Telegram and Email.',
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO config={seoConfig} />

      <Breadcrumbs
        items={[
          { name: 'Tools', url: '/color-picker' },
          { name: 'Share Link Generator', url: '/share-link-generator', isCurrent: true },
        ]}
        onNavigate={navigate}
      />

      {/* Header */}
      <div className="my-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Your Website · 6 Platforms · No Sign-Up</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Share Link Generator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Paste your website URL and get ready share links for WhatsApp, X, Facebook,
          LinkedIn, Telegram and Email — copy one link or all of them and post anywhere.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl mb-10">
        <label
          htmlFor="share-url"
          className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2"
        >
          Website URL
        </label>
        <div className="relative">
          <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="share-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-website.com/"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl font-mono text-sm sm:text-base font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        {!isValid && (
          <p className="mt-3 text-sm text-red-500">
            Please enter a valid URL starting with http:// or https:// — for example
            https://your-website.com/
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="share-title"
              className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2"
            >
              Title (optional)
            </label>
            <input
              id="share-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your website title"
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label
              htmlFor="share-text"
              className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2"
            >
              Message (optional)
            </label>
            <input
              id="share-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="A short message to share with the link"
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-1.5">
            Try an example:
          </span>
          <button
            type="button"
            onClick={() => useExample(CHROMORA_URL, CHROMORA_TITLE)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors"
          >
            Chromora
          </button>
          <button
            type="button"
            onClick={() => useExample(PAYWISE_URL, PAYWISE_LABEL)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            PayWise UK
          </button>
        </div>
      </div>

      {/* Results */}
      {isValid && (
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Share2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Your share links
            </h2>
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Copied all!' : 'Copy all links'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {shareLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    {link.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[var(--text-primary)]">{link.name}</p>
                    <p className="font-mono text-xs text-[var(--text-secondary)] truncate">
                      {link.href}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(link.id, link.href)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label={`Copy ${link.name} link`}
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedId === link.id ? 'Copied!' : 'Copy'}
                  </button>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Open
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection
        faqs={generatorFaqs}
        title="Share Link Generator FAQ"
        subtitle="How share links work and why your URL stays private."
      />
    </div>
  );
};
