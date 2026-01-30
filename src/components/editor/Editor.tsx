'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { TitleInput } from './TitleInput';
import { CategorySelector } from './CategorySelector';
import { DifficultySelector } from './DifficultySelector';
import { ContentEditor } from './ContentEditor';
import type { Post, CreatePostInput, UpdatePostInput, Category, Difficulty } from '@/lib/types';

interface EditorProps {
  post: Post | null;
  onSave: (data: CreatePostInput | UpdatePostInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
}

export function Editor({ post, onSave, onDelete, isLoading }: EditorProps) {
  const [title, setTitle] = React.useState(post?.title ?? '');
  const [content, setContent] = React.useState(post?.content ?? '');
  const [category, setCategory] = React.useState<Category>(post?.category ?? 'blog');
  const [difficulty, setDifficulty] = React.useState<Difficulty>(post?.difficulty ?? 'beginner');

  // Update form when post changes
  React.useEffect(() => {
    setTitle(post?.title ?? '');
    setContent(post?.content ?? '');
    setCategory(post?.category ?? 'blog');
    setDifficulty(post?.difficulty ?? 'beginner');
  }, [post]);

  const handleSave = async () => {
    if (post) {
      // Update existing post
      const updates: UpdatePostInput = {};
      if (title !== post.title) updates.title = title;
      if (content !== post.content) updates.content = content;
      if (category !== post.category) updates.category = category;
      if (difficulty !== post.difficulty) updates.difficulty = difficulty;
      await onSave(updates);
    } else {
      // Create new post
      const newPost: CreatePostInput = {
        title,
        content,
        category,
        difficulty,
      };
      await onSave(newPost);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header with title */}
      <div className="border-b border-border px-6 py-4">
        <TitleInput value={title} onChange={setTitle} />
      </div>

      {/* Metadata selectors */}
      <div className="flex items-center gap-4 border-b border-border px-6 py-3">
        <CategorySelector value={category} onChange={setCategory} />
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <ContentEditor value={content} onChange={setContent} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <div>
          {post && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Saving...' : post ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
