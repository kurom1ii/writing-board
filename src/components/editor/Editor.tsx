'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TitleInput } from './TitleInput';
import { CategorySelector } from './CategorySelector';
import { DifficultySelector } from './DifficultySelector';
import { ContentEditor } from './ContentEditor';
import { useAutoSave, type SaveStatus } from '@/hooks/use-auto-save';
import type { Post, CreatePostInput, UpdatePostInput, Category, Difficulty } from '@/lib/types';

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  const statusConfig = {
    idle: { text: '', className: '' },
    saving: { text: 'Saving...', className: 'text-muted-foreground' },
    saved: { text: 'Saved', className: 'text-green-600 dark:text-green-500' },
    unsaved: { text: 'Unsaved changes', className: 'text-amber-600 dark:text-amber-500' },
  };

  const config = statusConfig[status];
  if (!config.text) return null;

  return (
    <span className={`text-sm ${config.className}`}>
      {config.text}
    </span>
  );
}

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel autoFocus>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
