import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getPosts, getPost, createPost, updatePost, deletePost } from '../lib/storage.js';
import type { Category, Difficulty } from '../lib/types.js';

const server = new McpServer({
  name: "writing-board",
  version: "1.0.0",
});

// Categories and difficulties for validation and listing
const CATEGORIES: Category[] = ['blog', 'report', 'note'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

// Tool: list_posts - Get all posts with optional category/difficulty filter
server.tool(
  "list_posts",
  "Get all posts with optional category and difficulty filters",
  {
    category: z.enum(['blog', 'report', 'note']).optional().describe("Filter by category"),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("Filter by difficulty level"),
  },
  async ({ category, difficulty }) => {
    try {
      let posts = await getPosts();

      if (category) {
        posts = posts.filter(post => post.category === category);
      }

      if (difficulty) {
        posts = posts.filter(post => post.difficulty === difficulty);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(posts, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: get_post - Get a post by ID
server.tool(
  "get_post",
  "Get a specific post by its ID",
  {
    id: z.string().describe("The unique identifier of the post"),
  },
  async ({ id }) => {
    try {
      const post = await getPost(id);

      if (!post) {
        return {
          content: [
            {
              type: "text",
              text: `Post with ID "${id}" not found`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(post, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting post: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: create_post - Create a new post
server.tool(
  "create_post",
  "Create a new post with title, content, category, and difficulty",
  {
    title: z.string().describe("The title of the post"),
    content: z.string().describe("The content/body of the post"),
    category: z.enum(['blog', 'report', 'note']).describe("The category of the post"),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe("The difficulty level of the post"),
  },
  async ({ title, content, category, difficulty }) => {
    try {
      const newPost = await createPost({
        title,
        content,
        category,
        difficulty,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(newPost, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating post: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: update_post - Update an existing post
server.tool(
  "update_post",
  "Update an existing post by ID. Only provided fields will be updated.",
  {
    id: z.string().describe("The unique identifier of the post to update"),
    title: z.string().optional().describe("New title for the post"),
    content: z.string().optional().describe("New content for the post"),
    category: z.enum(['blog', 'report', 'note']).optional().describe("New category for the post"),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("New difficulty level for the post"),
  },
  async ({ id, title, content, category, difficulty }) => {
    try {
      const updateData: { title?: string; content?: string; category?: Category; difficulty?: Difficulty } = {};

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (category !== undefined) updateData.category = category;
      if (difficulty !== undefined) updateData.difficulty = difficulty;

      if (Object.keys(updateData).length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No fields provided to update",
            },
          ],
          isError: true,
        };
      }

      const updatedPost = await updatePost(id, updateData);

      if (!updatedPost) {
        return {
          content: [
            {
              type: "text",
              text: `Post with ID "${id}" not found`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(updatedPost, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating post: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: delete_post - Delete a post
server.tool(
  "delete_post",
  "Delete a post by its ID",
  {
    id: z.string().describe("The unique identifier of the post to delete"),
  },
  async ({ id }) => {
    try {
      const deleted = await deletePost(id);

      if (!deleted) {
        return {
          content: [
            {
              type: "text",
              text: `Post with ID "${id}" not found`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Post with ID "${id}" successfully deleted`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting post: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: list_categories - Return available categories
server.tool(
  "list_categories",
  "Get all available categories and difficulty levels",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            categories: CATEGORIES,
            difficulties: DIFFICULTIES,
          }, null, 2),
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Writing Board MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
