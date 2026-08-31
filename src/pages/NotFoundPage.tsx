import React from 'react';
import { Compass, Palette, Home, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <SEO
        config={{
          title: '404 - Page Not Found — Chromora',
          description: 'The requested color or tool could not be found.',
        }}
      />

      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            404
          </h1>
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            Color or Page Not Found
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            The color code, palette link, or path you entered does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </a>

          <a
            href="/color-picker"
            onClick={(e) => {
              e.preventDefault();
              navigate('/color-picker');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-500" />
            <span>Explore Color Tools</span>
          </a>
        </div>
      </div>
    </div>
  );
};
