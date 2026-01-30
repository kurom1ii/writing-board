import type { Category, Difficulty } from './types';

export const VALID_CATEGORIES: Category[] = ['blog', 'report', 'note'];
export const VALID_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export const MAX_TITLE_LENGTH = 200;
export const MAX_CONTENT_LENGTH = 100000; // 100KB

export function isValidCategory(value: unknown): value is Category {
  return typeof value === 'string' && VALID_CATEGORIES.includes(value as Category);
}

export function isValidDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && VALID_DIFFICULTIES.includes(value as Difficulty);
}

export function validateTitle(title: unknown): { valid: boolean; error?: string } {
  if (typeof title !== 'string' || !title.trim()) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters` };
  }
  return { valid: true };
}

export function validateContent(content: unknown): { valid: boolean; error?: string } {
  if (typeof content !== 'string' || !content.trim()) {
    return { valid: false, error: 'Content is required' };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` };
  }
  return { valid: true };
}
