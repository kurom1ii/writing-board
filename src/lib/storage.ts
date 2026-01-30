import { promises as fs } from 'fs';
import path from 'path';
import { Post, CreatePostInput, UpdatePostInput } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

async function readPostsFile(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writePostsFile([]);
      return [];
    }
    console.error('Error reading posts file:', error);
    return [];
  }
}

async function writePostsFile(posts: Post[]): Promise<void> {
  try {
    // Ensure directory exists
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing posts file:', error);
    throw new Error('Failed to save posts');
  }
}

export async function getPosts(): Promise<Post[]> {
  return readPostsFile();
}

export async function getPost(id: string): Promise<Post | null> {
  const posts = await readPostsFile();
  return posts.find((post) => post.id === id) || null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const posts = await readPostsFile();

  const now = new Date().toISOString();
  const newPost: Post = {
    id: crypto.randomUUID(),
    title: input.title,
    content: input.content,
    category: input.category,
    difficulty: input.difficulty,
    createdAt: now,
    updatedAt: now,
  };

  posts.push(newPost);
  await writePostsFile(posts);

  return newPost;
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  const posts = await readPostsFile();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  const updatedPost: Post = {
    ...posts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updatedPost;
  await writePostsFile(posts);

  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await readPostsFile();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return false;
  }

  posts.splice(index, 1);
  await writePostsFile(posts);

  return true;
}
