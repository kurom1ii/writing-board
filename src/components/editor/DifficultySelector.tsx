'use client';

import * as React from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Difficulty } from '@/lib/types';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

const difficulties: { value: Difficulty; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'beginner', label: 'Beginner', icon: <Sparkles className="size-4" />, color: 'text-emerald-400' },
  { value: 'intermediate', label: 'Intermediate', icon: <Zap className="size-4" />, color: 'text-amber-400' },
  { value: 'advanced', label: 'Advanced', icon: <Flame className="size-4" />, color: 'text-rose-400' },
];

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const selectedDifficulty = difficulties.find((d) => d.value === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as Difficulty)}>
      <SelectTrigger className="w-[160px] bg-muted/30 border-border/50 hover:border-border transition-colors">
        <SelectValue placeholder="Difficulty">
          <span className="flex items-center gap-2">
            <span className={selectedDifficulty?.color}>{selectedDifficulty?.icon}</span>
            {selectedDifficulty?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {difficulties.map((difficulty) => (
          <SelectItem key={difficulty.value} value={difficulty.value}>
            <span className="flex items-center gap-2">
              <span className={difficulty.color}>{difficulty.icon}</span>
              {difficulty.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
