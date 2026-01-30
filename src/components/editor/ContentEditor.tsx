'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MarkdownPreview } from './MarkdownPreview';

type ViewMode = 'edit' | 'preview';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ContentEditor({ value, onChange, className }: ContentEditorProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('edit');

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toggle buttons */}
      <div className="flex items-center gap-1 mb-3 px-1">
        <div className="flex items-center bg-muted/50 rounded-md p-0.5">
          <Button
            variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('edit')}
            className="rounded-sm"
          >
            <EditIcon className="size-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('preview')}
            className="rounded-sm"
          >
            <PreviewIcon className="size-3.5 mr-1" />
            Preview
          </Button>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground/50">
          {value.length > 0 && `${value.split(/\s+/).filter(Boolean).length} words`}
        </span>
      </div>

      {/* Editor or Preview panel */}
      <div className="flex-1 min-h-0">
        {viewMode === 'edit' ? (
          <div className="relative h-full">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing your thoughts in Markdown..."
              className={cn(
                'w-full h-full resize-none',
                'rounded-lg border border-border/50',
                'bg-muted/30 dark:bg-slate-900/50',
                'px-4 py-3',
                'font-mono text-sm leading-relaxed',
                'placeholder:text-muted-foreground/40',
                'text-foreground',
                'min-h-[300px]',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
                'hover:border-border'
              )}
            />
          </div>
        ) : (
          <div className={cn(
            'h-full overflow-hidden',
            'rounded-lg border border-border/50',
            'bg-card/50 dark:bg-slate-900/30',
            'min-h-[300px]'
          )}>
            <MarkdownPreview content={value} className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple inline icons
function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function PreviewIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
