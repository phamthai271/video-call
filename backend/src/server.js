import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { attachSocket } from "./socket.js";

const app = createApp();
const httpServer = http.createServer(app);

// Socket.IO và Express dùng CHUNG một HTTP server, để cả /api và
// /socket.io cùng lắng nghe trên một PORT — thuận tiện cho Nginx chỉ
// cần proxy tới một port duy nhất.
attachSocket(httpServer);

const PORT = process.env.PORT || 4000;

// KHÔNG bind cứng vào "127.0.0.1" hay "localhost" trong code — để
// Node lắng nghe trên mọi interface nội bộ theo mặc định; Nginx (chạy
// trên cùng máy) sẽ proxy vào PORT này qua 127.0.0.1.
httpServer.listen(PORT, () => {
  console.log(`video-call backend listening on port ${PORT}`);
});
