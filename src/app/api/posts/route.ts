import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/storage';
import type { Category, Difficulty } from '@/lib/types';
import {
  isValidCategory,
  isValidDifficulty,
  validateTitle,
  validateContent,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category');
    const difficultyParam = searchParams.get('difficulty');

    // Validate query params before using
    const category = isValidCategory(categoryParam) ? categoryParam : null;
    const difficulty = isValidDifficulty(difficultyParam) ? difficultyParam : null;

    let posts = await getPosts();

    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    if (difficulty) {
      posts = posts.filter((post) => post.difficulty === difficulty);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    // Validate title
    const titleResult = validateTitle(body.title);
    if (!titleResult.valid) {
      return NextResponse.json({ error: titleResult.error }, { status: 400 });
    }

    // Validate content
    const contentResult = validateContent(body.content);
    if (!contentResult.valid) {
      return NextResponse.json({ error: contentResult.error }, { status: 400 });
    }

    // Validate category
    if (!isValidCategory(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: blog, report, note' },
        { status: 400 }
      );
    }

    // Validate difficulty
    if (!isValidDifficulty(body.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced' },
        { status: 400 }
      );
    }

    const post = await createPost({
      title: body.title as string,
      content: body.content as string,
      category: body.category as Category,
      difficulty: body.difficulty as Difficulty,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
