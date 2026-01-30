# Sổ Tay Vận Hành

> Tự động tạo từ package.json ngày 2026-01-31

## Tổng Quan

Writing Board là ứng dụng local-first để tạo và tổ chức bài viết. Nó sử dụng lưu trữ file JSON và không cần database hoặc dịch vụ bên ngoài.

---

## Triển Khai

### Phát Triển Local

```bash
npm install
npm run dev
```

Truy cập tại: http://localhost:3000

### Build Production

```bash
npm run build
npm start
```

### Export Tĩnh (Tùy Chọn)

Để host tĩnh, thêm vào `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
}
```

Sau đó build:

```bash
npm run build
# Output trong thư mục ./out
```

---

## Kiến Trúc

```
┌─────────────────┐     ┌─────────────────┐
│   Trình duyệt   │────▶│  Ứng dụng       │
│   (React UI)    │     │  Next.js        │
│                 │     │  (localhost:3000)│
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐           ┌───────▼───────┐
              │ API Routes│           │  Trang tĩnh   │
              │ /api/posts│           │  / (app chính)│
              └─────┬─────┘           └───────────────┘
                    │
              ┌─────▼─────┐
              │  storage  │
              │   .ts     │
              └─────┬─────┘
                    │
              ┌─────▼─────┐
              │ posts.json│
              │ (data/)   │
              └───────────┘

┌─────────────────┐     ┌─────────────────┐
│  AI Assistant   │────▶│   MCP Server    │
│  (Claude, v.v.) │     │  (stdio)        │
└─────────────────┘     └────────┬────────┘
                                 │
                          ┌──────▼──────┐
                          │  storage.ts │
                          └─────────────┘
```

---

## Kiểm Tra Sức Khỏe

### Sức Khỏe Ứng Dụng

```bash
# Kiểm tra app đang chạy
curl -I http://localhost:3000

# Kiểm tra API endpoint
curl http://localhost:3000/api/posts
```

### Tính Toàn Vẹn Dữ Liệu

```bash
# Validate cấu trúc JSON
cat data/posts.json | jq .

# Kiểm tra quyền file
ls -la data/posts.json
```

---

## Các Vấn Đề Thường Gặp và Cách Khắc Phục

### Vấn đề: "ENOENT: no such file or directory" cho posts.json

**Nguyên nhân**: File dữ liệu không tồn tại khi chạy lần đầu.

**Khắc phục**: Tầng storage tự động tạo file. Nếu vẫn gặp vấn đề:

```bash
mkdir -p data
echo '[]' > data/posts.json
```

### Vấn đề: Port 3000 đã được sử dụng

**Nguyên nhân**: Tiến trình khác đang dùng port.

**Khắc phục**:

```bash
# Tìm tiến trình
lsof -i :3000

# Kill nó hoặc dùng port khác
npm run dev -- -p 3001
```

### Vấn đề: MCP server không kết nối được

**Nguyên nhân**: Vấn đề về đường dẫn hoặc cấu hình.

**Khắc phục**: Kiểm tra MCP config trỏ đúng đường dẫn:

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

### Vấn đề: Build thất bại với lỗi module

**Nguyên nhân**: Node modules không đồng bộ.

**Khắc phục**:

```bash
rm -rf node_modules .next
npm install
npm run build
```

### Vấn đề: Lỗi TypeScript trong build production

**Nguyên nhân**: Type không khớp, không được phát hiện khi development.

**Khắc phục**:

```bash
# Kiểm tra tất cả lỗi type
npx tsc --noEmit

# Sửa lỗi, sau đó rebuild
npm run build
```

---

## Quản Lý Dữ Liệu

### Sao Lưu

```bash
# Sao lưu posts
cp data/posts.json data/posts.backup.$(date +%Y%m%d).json
```

### Khôi Phục

```bash
# Khôi phục từ backup
cp data/posts.backup.YYYYMMDD.json data/posts.json
```

### Reset (Xóa Tất Cả Bài Viết)

```bash
echo '[]' > data/posts.json
```

### Export Bài Viết

```bash
# In đẹp tất cả bài viết
cat data/posts.json | jq .

# Export ra file
cat data/posts.json | jq . > export.json
```

---

## Logs

### Logs Server Development

Next.js xuất logs ra stdout khi chạy `npm run dev`.

### Logs Production

```bash
# Chạy với logging
npm start 2>&1 | tee app.log
```

### Logs MCP Server

MCP sử dụng stdio, logs đi vào stderr:

```bash
npm run mcp 2>mcp.log
```

---

## Hiệu Năng

### Tối Ưu Build

Build hiện tại được tối ưu với Turbopack. Thời gian build điển hình:

- Cold build: ~2-3 giây
- Hot reload: <100ms

### Kích Thước Bundle

Kiểm tra kích thước bundle sau khi build:

```bash
npm run build
# Kiểm tra .next/static để xem kích thước bundle
```

---

## Quy Trình Rollback

### Rollback Code

```bash
# Tìm commit hoạt động trước đó
git log --oneline

# Rollback về commit cụ thể
git checkout <commit-hash>

# Hoặc reset (phá hủy)
git reset --hard <commit-hash>
```

### Rollback Dữ Liệu

```bash
# Khôi phục từ backup
cp data/posts.backup.YYYYMMDD.json data/posts.json
```

### Rollback Dependencies

Nếu cập nhật package làm hỏng app:

```bash
# Khôi phục package-lock.json từ git
git checkout HEAD~1 -- package-lock.json

# Cài lại
rm -rf node_modules
npm install
```

---

## Cân Nhắc Bảo Mật

### Lưu Trữ Dữ Liệu

- Bài viết được lưu dạng JSON thuần
- Không mã hóa (thiết kế local-first)
- Giữ quyền thư mục `data/` bị hạn chế

### API Routes

- Không có xác thực (chỉ dùng local)
- Nếu expose ra mạng, thêm auth middleware

### MCP Server

- Chạy local qua stdio
- Mặc định không expose ra mạng

---

## Giám Sát (Tương Lai)

Cho triển khai production, cân nhắc thêm:

- Theo dõi lỗi (Sentry)
- Analytics (Vercel Analytics, Plausible)
- Giám sát uptime (UptimeRobot)

---

## Liên Hệ

- **Linear Project**: https://linear.app/kuromichan/project/writing-board-1f9022bfb2b5
- **Repository**: (thêm git remote URL)
