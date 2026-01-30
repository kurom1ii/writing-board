export type Category = 'blog' | 'report' | 'note';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: Category;
  difficulty: Difficulty;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: Category;
  difficulty?: Difficulty;
}
