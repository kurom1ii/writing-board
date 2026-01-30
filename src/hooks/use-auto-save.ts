'use client';

import * as React from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

interface UseAutoSaveOptions<T> {
  /** Data to auto-save */
  data: T;
  /** Function to save the data */
  onSave: (data: T) => Promise<void>;
  /** Debounce delay in milliseconds (default: 2000ms) */
  delay?: number;
  /** Enable/disable auto-save (default: true) */
  enabled?: boolean;
  /** Key to identify when data should be considered "new" */
  key?: string;
}

interface UseAutoSaveReturn {
  /** Current save status */
  status: SaveStatus;
  /** Manually trigger save */
  save: () => Promise<void>;
  /** Reset status to idle */
  reset: () => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  key,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = React.useState<SaveStatus>('idle');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const initialDataRef = React.useRef<string>(JSON.stringify(data));
  const isMountedRef = React.useRef(true);

  // Reset initial data when key changes (e.g., switching posts)
  React.useEffect(() => {
    initialDataRef.current = JSON.stringify(data);
    setStatus('idle');
  }, [key]);

  // Cleanup on unmount
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check if data has changed from initial state
  const hasChanges = React.useCallback(() => {
    return JSON.stringify(data) !== initialDataRef.current;
  }, [data]);

  // Manual save function
  const save = React.useCallback(async () => {
    if (!enabled) return;

    try {
      setStatus('saving');
      await onSave(data);
      if (isMountedRef.current) {
        initialDataRef.current = JSON.stringify(data);
        setStatus('saved');
      }
    } catch (error) {
      if (isMountedRef.current) {
        setStatus('unsaved');
      }
      throw error;
    }
  }, [data, onSave, enabled]);

  // Reset status
  const reset = React.useCallback(() => {
    setStatus('idle');
    initialDataRef.current = JSON.stringify(data);
  }, [data]);

  // Auto-save with debounce
  React.useEffect(() => {
    if (!enabled) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if there are changes
    if (!hasChanges()) {
      return;
    }

    // Mark as unsaved immediately when changes detected
    setStatus('unsaved');

    // Set debounced save
    timeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      try {
        setStatus('saving');
        await onSave(data);
        if (isMountedRef.current) {
          initialDataRef.current = JSON.stringify(data);
          setStatus('saved');
        }
      } catch {
        if (isMountedRef.current) {
          setStatus('unsaved');
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled, hasChanges]);

  return { status, save, reset };
}
