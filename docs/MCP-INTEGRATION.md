# Tích Hợp MCP Server

> Tài liệu hướng dẫn tích hợp Writing Board MCP Server vào hệ thống AI Agent

## Tổng Quan

Writing Board cung cấp MCP (Model Context Protocol) server cho phép AI agents tương tác với hệ thống quản lý bài viết. MCP server chạy qua stdio transport và cung cấp 6 tools để quản lý posts.

### Thông Tin Server

| Thuộc Tính | Giá Trị |
|------------|---------|
| Tên | `writing-board` |
| Phiên bản | `1.0.0` |
| Transport | stdio |
| SDK | `@modelcontextprotocol/sdk` v1.25.3 |
| Validation | Zod |

---

## Cấu Hình

### Claude Code

Thêm vào file `~/.claude.json` hoặc `.mcp.json` trong thư mục dự án:

```json
{
  "mcpServers": {
    "writing-board": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/duong-dan-tuyet-doi-toi/board"
    }
  }
}
```

### Claude Desktop

Thêm vào file cấu hình Claude Desktop:

```json
{
  "mcpServers": {
    "writing-board": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "cwd": "/duong-dan-tuyet-doi-toi/board"
    }
  }
}
```

### VS Code với Continue.dev

```json
{
  "mcpServers": {
    "writing-board": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/duong-dan-tuyet-doi-toi/board"
    }
  }
}
```

---

## Các Tools Có Sẵn

### 1. `list_posts`

Lấy danh sách tất cả bài viết với bộ lọc tùy chọn.

**Tham số:**

| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `category` | enum | Không | Lọc theo danh mục: `blog`, `report`, `note` |
| `difficulty` | enum | Không | Lọc theo độ khó: `beginner`, `intermediate`, `advanced` |

**Ví dụ gọi:**

```json
{
  "tool": "list_posts",
  "arguments": {
    "category": "blog",
    "difficulty": "beginner"
  }
}
```

**Response mẫu:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Bài viết đầu tiên",
    "content": "Nội dung bài viết...",
    "category": "blog",
    "difficulty": "beginner",
    "createdAt": "2026-01-31T10:00:00.000Z",
    "updatedAt": "2026-01-31T10:00:00.000Z"
  }
]
```

---

### 2. `get_post`

Lấy một bài viết cụ thể theo ID.

**Tham số:**

| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `id` | string | Có | UUID của bài viết |

**Ví dụ gọi:**

```json
{
  "tool": "get_post",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response mẫu:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Bài viết đầu tiên",
  "content": "Nội dung bài viết...",
  "category": "blog",
  "difficulty": "beginner",
  "createdAt": "2026-01-31T10:00:00.000Z",
  "updatedAt": "2026-01-31T10:00:00.000Z"
}
```

**Lỗi có thể xảy ra:**
- `Post with ID "..." not found` - Không tìm thấy bài viết

---

### 3. `create_post`

Tạo bài viết mới.

**Tham số:**

| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `title` | string | Có | Tiêu đề bài viết |
| `content` | string | Có | Nội dung bài viết (hỗ trợ Markdown) |
| `category` | enum | Có | Danh mục: `blog`, `report`, `note` |
| `difficulty` | enum | Có | Độ khó: `beginner`, `intermediate`, `advanced` |

**Ví dụ gọi:**

```json
{
  "tool": "create_post",
  "arguments": {
    "title": "Hướng dẫn TypeScript",
    "content": "# TypeScript Basics\n\nTypeScript là...",
    "category": "blog",
    "difficulty": "beginner"
  }
}
```

**Response mẫu:**

```json
{
  "id": "generated-uuid-here",
  "title": "Hướng dẫn TypeScript",
  "content": "# TypeScript Basics\n\nTypeScript là...",
  "category": "blog",
  "difficulty": "beginner",
  "createdAt": "2026-01-31T10:00:00.000Z",
  "updatedAt": "2026-01-31T10:00:00.000Z"
}
```

---

### 4. `update_post`

Cập nhật bài viết hiện có. Chỉ các trường được cung cấp sẽ được cập nhật.

**Tham số:**

| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `id` | string | Có | UUID của bài viết cần cập nhật |
| `title` | string | Không | Tiêu đề mới |
| `content` | string | Không | Nội dung mới |
| `category` | enum | Không | Danh mục mới |
| `difficulty` | enum | Không | Độ khó mới |

**Ví dụ gọi:**

```json
{
  "tool": "update_post",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tiêu đề đã cập nhật",
    "difficulty": "intermediate"
  }
}
```

**Lỗi có thể xảy ra:**
- `Post with ID "..." not found` - Không tìm thấy bài viết
- `No fields provided to update` - Không có trường nào để cập nhật

---

### 5. `delete_post`

Xóa bài viết theo ID.

**Tham số:**

| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `id` | string | Có | UUID của bài viết cần xóa |

**Ví dụ gọi:**

```json
{
  "tool": "delete_post",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response thành công:**

```
Post with ID "550e8400-e29b-41d4-a716-446655440000" successfully deleted
```

**Lỗi có thể xảy ra:**
- `Post with ID "..." not found` - Không tìm thấy bài viết

---

### 6. `list_categories`

Lấy danh sách các danh mục và mức độ khó có sẵn.

**Tham số:** Không có

**Ví dụ gọi:**

```json
{
  "tool": "list_categories",
  "arguments": {}
}
```

**Response:**

```json
{
  "categories": ["blog", "report", "note"],
  "difficulties": ["beginner", "intermediate", "advanced"]
}
```

---

## Cấu Trúc Dữ Liệu

### Post Object

```typescript
interface Post {
  id: string;           // UUID tự động tạo
  title: string;        // Tiêu đề bài viết
  content: string;      // Nội dung (hỗ trợ Markdown)
  category: Category;   // 'blog' | 'report' | 'note'
  difficulty: Difficulty; // 'beginner' | 'intermediate' | 'advanced'
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}
```

### Category Values

| Giá trị | Mô tả |
|---------|-------|
| `blog` | Bài viết blog thông thường |
| `report` | Báo cáo, tài liệu chính thức |
| `note` | Ghi chú nhanh, ý tưởng |

### Difficulty Values

| Giá trị | Mô tả |
|---------|-------|
| `beginner` | Nội dung cơ bản, dễ hiểu |
| `intermediate` | Nội dung trung bình |
| `advanced` | Nội dung nâng cao, chuyên sâu |

---

## Lưu Trữ Dữ Liệu

### Vị Trí File

```
data/posts.json
```

### Cơ Chế An Toàn

- **File Locking**: Sử dụng file lock để tránh race conditions
- **Atomic Writes**: Ghi vào file tạm trước, sau đó rename
- **Auto-create**: Tự động tạo file và thư mục nếu chưa tồn tại
- **Lock Timeout**: 5 giây timeout cho file lock
- **Stale Lock Detection**: Tự động xóa lock cũ quá 5 giây

---

## Xử Lý Lỗi

Tất cả các tools trả về response với cấu trúc:

**Thành công:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "..."
    }
  ]
}
```

**Lỗi:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error message here"
    }
  ],
  "isError": true
}
```

---

## Ví Dụ Sử Dụng Với Agent

### Tạo Bài Viết Blog

```
Agent: Tôi sẽ tạo một bài viết blog về TypeScript.

[Gọi create_post với:
  title: "Giới thiệu TypeScript cho người mới"
  content: "# TypeScript\n\n## Type System\n..."
  category: "blog"
  difficulty: "beginner"
]

Kết quả: Đã tạo bài viết với ID abc-123...
```

### Liệt Kê Và Lọc

```
Agent: Tôi sẽ tìm tất cả các bài report nâng cao.

[Gọi list_posts với:
  category: "report"
  difficulty: "advanced"
]

Kết quả: Tìm thấy 3 bài viết...
```

### Cập Nhật Nội Dung

```
Agent: Tôi sẽ cập nhật độ khó của bài viết.

[Gọi update_post với:
  id: "abc-123"
  difficulty: "intermediate"
]

Kết quả: Đã cập nhật bài viết thành công.
```

---

## Chạy và Debug

### Chạy MCP Server

```bash
# Qua npm script
npm run mcp

# Hoặc trực tiếp
npx tsx src/mcp/server.ts
```

### Debug Logs

Server ghi logs ra stderr:

```bash
npm run mcp 2>mcp.log
```

### Kiểm Tra Kết Nối

```bash
# Server sẽ in message khi khởi động thành công
# "Writing Board MCP Server running on stdio"
```

---

## Tích Hợp Vào Agent System

### Agent Prompt Mẫu

```markdown
Bạn có quyền truy cập vào Writing Board thông qua MCP tools:

- `list_posts`: Liệt kê bài viết (có thể lọc theo category/difficulty)
- `get_post`: Lấy nội dung một bài viết
- `create_post`: Tạo bài viết mới
- `update_post`: Cập nhật bài viết
- `delete_post`: Xóa bài viết
- `list_categories`: Xem danh sách categories và difficulties

Khi người dùng yêu cầu quản lý bài viết, hãy sử dụng các tools này.
```

### Workflow Mẫu

1. **Tạo nội dung**: User yêu cầu → Agent tạo content → `create_post`
2. **Tìm kiếm**: User hỏi → `list_posts` với filter → Trả về kết quả
3. **Chỉnh sửa**: User yêu cầu sửa → `get_post` → Sửa → `update_post`
4. **Dọn dẹp**: User yêu cầu xóa → `delete_post`

---

## Giới Hạn Hiện Tại

| Giới Hạn | Mô Tả |
|----------|-------|
| Không có search full-text | Chỉ lọc theo category/difficulty |
| Không phân trang | Trả về tất cả posts |
| Không có auth | Ai có quyền chạy server đều có full access |
| Categories cố định | Chưa hỗ trợ tạo category mới |
| Single file storage | Không phù hợp cho dữ liệu lớn |

---

## Phiên Bản và Cập Nhật

| Phiên bản | Ngày | Thay đổi |
|-----------|------|----------|
| 1.0.0 | 2026-01-31 | Phiên bản đầu tiên với 6 tools cơ bản |
