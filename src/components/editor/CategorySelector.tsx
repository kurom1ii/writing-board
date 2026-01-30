'use client';

import * as React from 'react';
import { BookOpen, FileText, StickyNote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/lib/types';

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

const categories: { value: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'blog', label: 'Blog', icon: <BookOpen className="size-4" />, color: 'text-violet-400' },
  { value: 'report', label: 'Report', icon: <FileText className="size-4" />, color: 'text-amber-400' },
  { value: 'note', label: 'Note', icon: <StickyNote className="size-4" />, color: 'text-emerald-400' },
];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const selectedCategory = categories.find((c) => c.value === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as Category)}>
      <SelectTrigger className="w-[140px] bg-muted/30 border-border/50 hover:border-border transition-colors">
        <SelectValue placeholder="Category">
          <span className="flex items-center gap-2">
            <span className={selectedCategory?.color}>{selectedCategory?.icon}</span>
            {selectedCategory?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            <span className="flex items-center gap-2">
              <span className={category.color}>{category.icon}</span>
              {category.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
