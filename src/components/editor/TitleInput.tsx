'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TitleInput({ value, onChange, className }: TitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter title..."
      className={cn(
        'w-full bg-transparent text-2xl font-semibold outline-none border-none',
        'placeholder:text-muted-foreground/50',
        'focus:outline-none focus:ring-0',
        'text-foreground',
        className
      )}
    />
  );
}
