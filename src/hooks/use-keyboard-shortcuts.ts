'use client';

import * as React from 'react';

export interface KeyboardShortcut {
  /** Key to listen for (e.g., 's', 'n', 'Escape') */
  key: string;
  /** Require Ctrl (Windows/Linux) or Cmd (Mac) modifier */
  ctrlOrCmd?: boolean;
  /** Require Shift modifier */
  shift?: boolean;
  /** Require Alt modifier */
  alt?: boolean;
  /** Handler function */
  handler: () => void;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  /** Array of shortcuts to register */
  shortcuts: KeyboardShortcut[];
  /** Enable/disable shortcuts (default: true) */
  enabled?: boolean;
}

/**
 * Detects if the user is on a Mac
 */
function isMac(): boolean {
  if (typeof window === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Gets the display string for a keyboard shortcut
 */
export function getShortcutDisplay(shortcut: Pick<KeyboardShortcut, 'key' | 'ctrlOrCmd' | 'shift' | 'alt'>): string {
  const parts: string[] = [];
  const mac = isMac();

  if (shortcut.ctrlOrCmd) {
    parts.push(mac ? '\u2318' : 'Ctrl');
  }
  if (shortcut.alt) {
    parts.push(mac ? '\u2325' : 'Alt');
  }
  if (shortcut.shift) {
    parts.push(mac ? '\u21E7' : 'Shift');
  }

  // Format the key display
  let keyDisplay = shortcut.key.toUpperCase();
  if (shortcut.key === 'Escape') {
    keyDisplay = 'Esc';
  }
  parts.push(keyDisplay);

  return mac ? parts.join('') : parts.join('+');
}

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions): void {
  // Store shortcuts in a ref to avoid stale closures
  const shortcutsRef = React.useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields (unless it's Escape)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcutsRef.current) {
        // Check if the key matches (case-insensitive)
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        if (!keyMatches) continue;

        // Check modifier keys
        const mac = isMac();
        const ctrlOrCmdPressed = mac ? event.metaKey : event.ctrlKey;

        if (shortcut.ctrlOrCmd && !ctrlOrCmdPressed) continue;
        if (!shortcut.ctrlOrCmd && ctrlOrCmdPressed) continue;
        if (shortcut.shift && !event.shiftKey) continue;
        if (!shortcut.shift && event.shiftKey) continue;
        if (shortcut.alt && !event.altKey) continue;
        if (!shortcut.alt && event.altKey) continue;

        // Skip if in input field (except for Escape or Ctrl/Cmd shortcuts)
        if (isInputField && shortcut.key !== 'Escape' && !shortcut.ctrlOrCmd) {
          continue;
        }

        // Prevent default if specified
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }

        // Execute handler
        shortcut.handler();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
