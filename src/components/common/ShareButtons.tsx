import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, MessageCircle, Link2, Check, Share2 } from 'lucide-react';

export type ShareNetwork = 'whatsapp' | 'x' | 'facebook' | 'linkedin' | 'copy' | 'native';

interface ShareButtonsProps {
  /** Full URL to share (e.g. a palette URL or the current page URL). */
  url: string;
  /** Title/text used as the shared message. */
  title: string;
  /** Optional label shown before the buttons, e.g. "Share". */
  label?: string;
  /** Networks to hide (useful when a page already offers one of them). */
  exclude?: ShareNetwork[];
  /** Extra classes for the wrapper. */
  className?: string;
}

/**
 * Reusable share buttons: WhatsApp, X, Facebook, LinkedIn, Copy link and
 * the native Web Share API where the browser supports it.
 * No new dependencies, no tracking, no external scripts — every share link
 * is a plain anchor opening in a new tab.
 */
export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  label,
  exclude = [],
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const shareLinks: { id: ShareNetwork; href: string; label: string; hoverClass: string; icon: React.ReactNode }[] = [
    {
      id: 'whatsapp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
      label: 'Share on WhatsApp',
      hoverClass: 'hover:text-emerald-500 hover:border-emerald-500/50',
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      id: 'x',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      label: 'Share on X',
      hoverClass: 'hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400',
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      id: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Share on Facebook',
      hoverClass: 'hover:text-blue-600 hover:border-blue-500/50',
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      id: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: 'Share on LinkedIn',
      hoverClass: 'hover:text-sky-600 hover:border-sky-500/50',
      icon: <Linkedin className="w-4 h-4" />,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without async clipboard access.
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        // Copy unsupported; the user can still copy the URL from the address bar.
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // User dismissed the share sheet or sharing failed — nothing to do.
    }
  };

  const buttonClass =
    'w-9 h-9 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--text-secondary)] flex items-center justify-center transition-colors shrink-0';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label="Share this page">
      {label && (
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1">{label}</span>
      )}
      {shareLinks
        .filter((link) => !exclude.includes(link.id))
        .map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className={`${buttonClass} ${link.hoverClass}`}
          >
            {link.icon}
          </a>
        ))}
      {!exclude.includes('copy') && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          title="Copy link"
          className={`${buttonClass} hover:text-[var(--accent)] hover:border-[var(--accent-border)]`}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
        </button>
      )}
      {!exclude.includes('native') && canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Share via device"
          title="Share via device"
          className={`${buttonClass} hover:text-[var(--accent)] hover:border-[var(--accent-border)]`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
      {copied && <span className="text-xs font-semibold text-emerald-500">Copied</span>}
    </div>
  );
};
