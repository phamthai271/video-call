import { io } from "socket.io-client";
import { SOCKET_PATH } from "./config.js";

// io("/") nghĩa là kết nối tới CÙNG origin đang phục vụ trang web hiện tại
// (không hardcode domain/IP). "path" là đường dẫn HTTP mà Nginx sẽ proxy
// tới backend Socket.IO — phải khớp với location /video-call/socket.io
// trong nginx config và với `path` cấu hình ở backend (sau khi Nginx đã
// strip prefix /video-call).
export const socket = io("/", {
  path: SOCKET_PATH,
  transports: ["websocket", "polling"],
  autoConnect: false, // gọi socket.connect() khi cần, tránh connect khi chưa mount
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
