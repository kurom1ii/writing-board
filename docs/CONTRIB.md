# Hướng Dẫn Đóng Góp

> Tự động tạo từ package.json ngày 2026-01-31

## Yêu Cầu Hệ Thống

- Node.js 20+
- npm 10+

## Bắt Đầu Nhanh

```bash
# Clone và cài đặt
git clone <repository-url>
cd board
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

---

## Các Lệnh Có Sẵn

| Lệnh | Command | Mô Tả |
|------|---------|-------|
| `dev` | `next dev` | Chạy server development với hot reload |
| `build` | `next build` | Tạo bản build production tối ưu |
| `start` | `next start` | Chạy server production |
| `lint` | `eslint` | Kiểm tra chất lượng code với ESLint |
| `mcp` | `npx tsx src/mcp/server.ts` | Chạy MCP server cho AI assistant |

### Ví Dụ Sử Dụng

```bash
# Development (có hot reload)
npm run dev

# Build và chạy production
npm run build
npm start

# Kiểm tra code
npm run lint

# Chạy MCP server (cho Claude/AI)
npm run mcp
```

---

## Cấu Trúc Dự Án

```
board/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/posts/          # REST API endpoints
│   │   │   ├── route.ts        # GET /api/posts, POST /api/posts
│   │   │   └── [id]/route.ts   # GET/PATCH/DELETE /api/posts/:id
│   │   ├── layout.tsx          # Layout gốc với fonts
│   │   └── page.tsx            # Trang chính (WritingBoard)
│   ├── components/
│   │   ├── ui/                 # Các component shadcn/ui
│   │   ├── editor/             # Các component editor bài viết
│   │   ├── app-sidebar.tsx     # Sidebar điều hướng chính
│   │   └── writing-board.tsx   # Shell ứng dụng chính
│   ├── hooks/
│   │   └── use-mobile.ts       # Hook phát hiện mobile
│   ├── lib/
│   │   ├── storage.ts          # Các thao tác CRUD file JSON
│   │   ├── types.ts            # Định nghĩa TypeScript
│   │   └── utils.ts            # Hàm tiện ích (cn)
│   └── mcp/
│       └── server.ts           # MCP server cho AI tools
├── data/
│   └── posts.json              # Lưu trữ bài viết local
├── docs/                       # Tài liệu
├── .reports/                   # Báo cáo phân tích
└── package.json
```

---

## Quy Trình Phát Triển

### 1. Tạo Feature Branch

```bash
git checkout -b feature/ten-feature
```

### 2. Thực Hiện Thay Đổi

- Chỉnh sửa components trong `src/components/`
- Thêm UI components qua shadcn: `npx shadcn@latest add <component>`
- API routes đặt trong `src/app/api/`

### 3. Test Trên Local

```bash
npm run dev     # Test giao diện
npm run lint    # Kiểm tra chất lượng code
npm run build   # Đảm bảo build production hoạt động
```

### 4. Commit và Push

```bash
git add .
git commit -m "feat: mô tả feature của bạn"
git push origin feature/ten-feature
```

---

## Thêm UI Components

Dự án này sử dụng [shadcn/ui](https://ui.shadcn.com/). Để thêm components mới:

```bash
# Thêm một component
npx shadcn@latest add button

# Thêm nhiều components
npx shadcn@latest add card dialog tooltip
```

Components được cài vào `src/components/ui/`.

---

## API Endpoints

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/posts` | Lấy danh sách tất cả bài viết |
| POST | `/api/posts` | Tạo bài viết mới |
| GET | `/api/posts/:id` | Lấy một bài viết |
| PATCH | `/api/posts/:id` | Cập nhật bài viết |
| DELETE | `/api/posts/:id` | Xóa bài viết |

---

## Tích Hợp MCP

MCP server cung cấp tích hợp với AI assistant. Các tools có sẵn:

| Tool | Mô Tả |
|------|-------|
| `list_posts` | Lấy tất cả bài viết với bộ lọc tùy chọn |
| `get_post` | Lấy một bài viết theo ID |
| `create_post` | Tạo bài viết mới |
| `update_post` | Cập nhật bài viết hiện có |
| `delete_post` | Xóa bài viết |
| `list_categories` | Lấy các danh mục có sẵn |

Để sử dụng với Claude Code, thêm vào MCP config:

```json
{
  "mcpServers": {
    "writing-board": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/duong-dan-toi/board"
    }
  }
}
```

---

## Công Nghệ Sử Dụng

| Loại | Công Nghệ | Phiên Bản |
|------|-----------|-----------|
| Framework | Next.js | 16.1.6 |
| Ngôn ngữ | TypeScript | 5.x |
| Thư viện UI | shadcn/ui + Radix UI | Mới nhất |
| Styling | Tailwind CSS | 4.x |
| Icons | Lucide React, HugeIcons | Mới nhất |
| MCP SDK | @modelcontextprotocol/sdk | 1.25.3 |
| Validation | Zod | 4.3.6 |

---

## Biến Môi Trường

Dự án này hiện không yêu cầu biến môi trường. Nó sử dụng lưu trữ file JSON local.

Nếu bạn cần thêm biến môi trường:

1. Tạo `.env.local` (không commit)
2. Thêm vào `.env.example` (template cho người khác)
3. Ghi tài liệu trong file này

---

## Quy Chuẩn Code

- TypeScript strict mode được bật
- ESLint với config Next.js
- Prettier để format (nếu được cấu hình)
- Sử dụng hàm `cn()` cho conditional classNames

---

## Xử Lý Sự Cố

### Build thất bại với lỗi type

```bash
# Kiểm tra lỗi TypeScript
npx tsc --noEmit
```

### Port 3000 đã được sử dụng

```bash
# Dùng port khác
npm run dev -- -p 3001
```

### Vấn đề với shadcn component

```bash
# Cài lại component
npx shadcn@latest add <component> --overwrite
```
