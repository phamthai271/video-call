# video-call — Deploy nhiều app trên cùng 1 VPS với Nginx

Kiến trúc mẫu để deploy **nhiều project** (React/Vite + Node/Express + Socket.IO)
trên **cùng một VPS Ubuntu / cùng một IP / cùng một domain**, mỗi project nằm dưới
một sub-path riêng (vd: `/video-call`, `/chat-app`, `/crm`, ...) và được Nginx
reverse-proxy tới đúng backend/port tương ứng.

```
project/
├── frontend/     # React + Vite, build ra static files, base = "/video-call/"
├── backend/      # Node + Express + Socket.IO, PORT lấy từ env
├── nginx/        # Nginx site config mẫu cho sub-path /video-call
└── README.md
```

## Nguyên tắc cốt lõi

1. **Không hardcode domain/IP/localhost** ở bất kỳ đâu trong code production.
2. Frontend gọi API và Socket.IO qua **đường dẫn tương đối** (`/video-call/api`,
   `/video-call/socket.io`) — trình duyệt tự ghép với domain hiện tại.
3. Backend chỉ biết `/api` và `/socket.io` (không biết gì về `/video-call`).
   Việc strip prefix `/video-call` do **Nginx** đảm nhiệm.
4. Mỗi project chạy một Node process riêng, lắng nghe một `PORT` riêng
   (quản lý bằng PM2), Nginx map:
   - `/video-call` → static files (frontend build)
   - `/video-call/api` → `http://127.0.0.1:<PORT>/api`
   - `/video-call/socket.io` → `http://127.0.0.1:<PORT>/socket.io`

Nhờ vậy bạn có thể chạy `video-call`, `chat-app`, `shop-app`... trên cùng 1 VPS,
cùng 1 domain, mỗi app một sub-path, không đụng port/IP của nhau.

## Quy trình deploy 1 project mới trên VPS

1. Clone code vào `/var/www/video-call` (ví dụ).
2. `cd backend && npm ci --production` → tạo `.env` từ `.env.example`, set `PORT`
   (mỗi app 1 port khác nhau, vd 4001, 4002, ...).
3. Chạy backend bằng PM2:
   ```bash
   pm2 start src/server.js --name video-call-api
   pm2 save
   ```
4. `cd frontend && npm ci && npm run build` → ra thư mục `dist/`.
5. Copy nội dung `dist/` vào nơi Nginx sẽ serve, vd `/var/www/video-call/frontend/dist`.
6. Thêm block Nginx (xem `nginx/video-call.conf`) vào file server chính (thường
   là `/etc/nginx/sites-available/<domain>`), rồi:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```
7. Truy cập `http://domain/video-call` — xong.

Để thêm project thứ 2 (`chat-app` chẳng hạn): lặp lại các bước trên với
`VITE_API_BASE=/chat-app/api`, `base: "/chat-app/"`, backend path `/socket.io`
(không đổi), Nginx thêm 3 location mới `/chat-app`, `/chat-app/api`,
`/chat-app/socket.io` trỏ vào port khác (vd 4002). Không cần đổi gì trong code
backend/frontend — toàn bộ logic sub-path đã là biến số qua env + Nginx.

Xem thêm `frontend/README.md` và `backend/README.md` (nếu có ghi chú riêng)
và comment trong từng file cấu hình.
