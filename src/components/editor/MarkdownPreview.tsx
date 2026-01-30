'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'px-4 py-3 overflow-auto',
        // Headings
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-h1:text-2xl prose-h1:border-b prose-h1:border-border prose-h1:pb-2 prose-h1:mb-4',
        'prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3',
        'prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2',
        'prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2',
        // Paragraphs and text
        'prose-p:leading-relaxed prose-p:text-foreground/90',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-em:text-foreground/80',
        // Links
        'prose-a:text-primary prose-a:underline prose-a:underline-offset-2',
        'prose-a:hover:text-primary/80 prose-a:transition-colors',
        // Lists
        'prose-ul:my-4 prose-ol:my-4',
        'prose-li:text-foreground/90 prose-li:my-1',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-border',
        'prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4',
        'prose-blockquote:text-muted-foreground prose-blockquote:italic',
        'prose-blockquote:rounded-r-md',
        // Code
        'prose-code:text-sm prose-code:font-mono',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-code:before:content-none prose-code:after:content-none',
        // Code blocks
        'prose-pre:bg-muted/50 dark:prose-pre:bg-slate-900/50',
        'prose-pre:border prose-pre:border-border/50',
        'prose-pre:rounded-lg prose-pre:p-4',
        'prose-pre:overflow-x-auto',
        // Tables
        'prose-table:border-collapse prose-table:w-full',
        'prose-th:border prose-th:border-border prose-th:bg-muted/50',
        'prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold',
        'prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2',
        // Horizontal rules
        'prose-hr:border-border prose-hr:my-6',
        // Images
        'prose-img:rounded-lg prose-img:border prose-img:border-border',
        className
      )}
    >
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <p className="text-muted-foreground/50 italic">
          Start writing to see the preview...
        </p>
      )}
    </div>
  );
}
