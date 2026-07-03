import React from 'react';
import { FolderKanban } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card/10 py-6 text-center text-xs text-muted-foreground/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold tracking-tight text-foreground/80">DevFlow</span>
          <span>— SDLC Progress Monitor</span>
        </div>

        <div>
          <span>© {new Date().getFullYear()} DevFlow. Dibuat dengan React, TypeScript, dan Tailwind CSS.</span>
        </div>

        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline transition-colors"
          >
            GitHub Repo
          </a>
          <span>•</span>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Deploy status
          </a>
        </div>
      </div>
    </footer>
  );
};
