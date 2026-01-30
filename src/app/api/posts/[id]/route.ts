import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/storage';
import { UpdatePostInput, Category, Difficulty } from '@/lib/types';

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
  try {
    const { id } = await params;
    const body = await request.json() as UpdatePostInput;

    // Validate category if provided
    if (body.category) {
      const validCategories: Category[] = ['blog', 'report', 'note'];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: 'Invalid category. Must be one of: blog, report, note' },
          { status: 400 }
        );
      }
    }

    // Validate difficulty if provided
    if (body.difficulty) {
      const validDifficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(body.difficulty)) {
        return NextResponse.json(
          { error: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced' },
          { status: 400 }
        );
      }
    }

    const post = await updatePost(id, body);

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
