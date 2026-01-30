import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/storage';
import { CreatePostInput, Category, Difficulty } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as Category | null;
    const difficulty = searchParams.get('difficulty') as Difficulty | null;

    let posts = await getPosts();

    // Filter by category if provided
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    // Filter by difficulty if provided
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
  try {
    const body = await request.json() as CreatePostInput;

    // Validate required fields
    if (!body.title || !body.content || !body.category || !body.difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category, difficulty' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories: Category[] = ['blog', 'report', 'note'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: blog, report, note' },
        { status: 400 }
      );
    }

    // Validate difficulty
    const validDifficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(body.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced' },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
