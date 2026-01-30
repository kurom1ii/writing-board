'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ContentEditor({ value, onChange, className }: ContentEditorProps) {
  return (
    <div className="relative h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your thoughts..."
        className={cn(
          'w-full h-full resize-none',
          'rounded-lg border border-border/50',
          'bg-muted/30 dark:bg-slate-900/50',
          'px-4 py-3',
          'font-mono text-base leading-relaxed',
          'placeholder:text-muted-foreground/40',
          'text-foreground',
          'min-h-[300px]',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50',
          'hover:border-border',
          className
        )}
      />
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50">
        {value.length > 0 && `${value.split(/\s+/).filter(Boolean).length} words`}
      </div>
    </div>
  );
}
