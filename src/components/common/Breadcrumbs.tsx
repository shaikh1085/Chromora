import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrent?: boolean;
}

export const Breadcrumbs: React.FC<{
  items: BreadcrumbItem[];
  onNavigate: (url: string) => void;
}> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-zinc-400 py-2.5 overflow-x-auto">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
        }}
        className="flex items-center gap-1 hover:text-zinc-200 transition-colors shrink-0"
        aria-label="Back to Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </a>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
          {item.isCurrent ? (
            <span
              aria-current="page"
              className="font-medium text-zinc-200 truncate max-w-[200px]"
            >
              {item.name}
            </span>
          ) : (
            <a
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.url);
              }}
              className="hover:text-zinc-200 transition-colors shrink-0 truncate max-w-[160px]"
            >
              {item.name}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
