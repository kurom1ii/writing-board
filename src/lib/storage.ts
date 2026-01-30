import { promises as fs } from 'fs';
import path from 'path';
import { Post, CreatePostInput, UpdatePostInput } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');
const LOCK_FILE = DATA_FILE + '.lock';
const LOCK_TIMEOUT = 5000; // 5 seconds
const LOCK_RETRY_DELAY = 50; // 50ms

async function acquireLock(): Promise<void> {
  const startTime = Date.now();

  while (true) {
    try {
      // Try to create lock file exclusively
      await fs.writeFile(LOCK_FILE, String(process.pid), { flag: 'wx' });
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        // Lock exists, check if it's stale
        try {
          const stat = await fs.stat(LOCK_FILE);
          const lockAge = Date.now() - stat.mtimeMs;
          if (lockAge > LOCK_TIMEOUT) {
            // Stale lock, remove it
            await fs.unlink(LOCK_FILE);
            continue;
          }
        } catch {
          // Lock file disappeared, try again
          continue;
        }

        // Check timeout
        if (Date.now() - startTime > LOCK_TIMEOUT) {
          throw new Error('Failed to acquire file lock: timeout');
        }

        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, LOCK_RETRY_DELAY));
      } else {
        throw error;
      }
    }
  }
}

async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_FILE);
  } catch {
    // Ignore errors when releasing lock
  }
}

async function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  await acquireLock();
  try {
    return await fn();
  } finally {
    await releaseLock();
  }
}

async function readPostsFile(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error reading posts file:', error);
    return [];
  }
}

async function writePostsFile(posts: Post[]): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });

  // Write to temp file first, then rename (atomic operation)
  const tempFile = DATA_FILE + '.tmp';
  await fs.writeFile(tempFile, JSON.stringify(posts, null, 2), 'utf-8');
  await fs.rename(tempFile, DATA_FILE);
}

export async function getPosts(): Promise<Post[]> {
  return readPostsFile();
}

export async function getPost(id: string): Promise<Post | null> {
  const posts = await readPostsFile();
  return posts.find((post) => post.id === id) || null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  return withFileLock(async () => {
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
  });
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  return withFileLock(async () => {
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
  });
}

export async function deletePost(id: string): Promise<boolean> {
  return withFileLock(async () => {
    const posts = await readPostsFile();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
      return false;
    }

    posts.splice(index, 1);
    await writePostsFile(posts);

    return true;
  });
}
