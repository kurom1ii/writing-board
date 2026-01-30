import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/storage';
import type { Category, Difficulty } from '@/lib/types';
import {
  isValidCategory,
  isValidDifficulty,
  validateTitle,
  validateContent,
  MAX_TITLE_LENGTH,
  MAX_CONTENT_LENGTH,
} from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

async function handleUpdate(
  request: NextRequest,
  { params }: RouteParams
) {
  // Parse JSON body with error handling
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  try {
    const { id } = await params;

    // Validate title if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      if (body.title.length > MAX_TITLE_LENGTH) {
        return NextResponse.json(
          { error: `Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // Validate content if provided
    if (body.content !== undefined) {
      if (typeof body.content !== 'string') {
        return NextResponse.json({ error: 'Content must be a string' }, { status: 400 });
      }
      if (body.content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json(
          { error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (body.category !== undefined && !isValidCategory(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: blog, report, note' },
        { status: 400 }
      );
    }

    // Validate difficulty if provided
    if (body.difficulty !== undefined && !isValidDifficulty(body.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced' },
        { status: 400 }
      );
    }

    const updateData: { title?: string; content?: string; category?: Category; difficulty?: Difficulty } = {};
    if (body.title !== undefined) updateData.title = body.title as string;
    if (body.content !== undefined) updateData.content = body.content as string;
    if (body.category !== undefined) updateData.category = body.category as Category;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty as Difficulty;

    const post = await updatePost(id, updateData);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export const PUT = handleUpdate;
export const PATCH = handleUpdate;

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
