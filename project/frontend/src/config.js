// Tất cả đường dẫn API / Socket.IO đều đọc từ biến môi trường Vite
// (VITE_*), KHÔNG hardcode domain, IP hay localhost ở đây.
//
// Vì đây là đường dẫn TƯƠNG ĐỐI (bắt đầu bằng "/"), khi fetch/socket.io
// dùng chúng, trình duyệt sẽ tự động ghép với origin hiện tại
// (protocol + domain + port mà người dùng đang truy cập), nên code này
// chạy đúng bất kể deploy ở domain nào hay IP nào.

export const API_BASE = import.meta.env.VITE_API_BASE || "/video-call/api";
export const SOCKET_PATH =
  import.meta.env.VITE_SOCKET_PATH || "/video-call/socket.io";
