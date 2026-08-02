import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Base path lấy từ biến môi trường VITE_BASE_PATH (mặc định "/video-call/")
// để có thể tái sử dụng file này cho các project khác chỉ bằng cách đổi .env,
// không phải sửa code.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_PATH || "/video-call/";

  return {
    plugins: [react()],
    base: basePath,
    server: {
      // Dev server vẫn chạy ở "/", chỉ ảnh hưởng khi build production
      port: 5173,
      // Proxy CHỈ dùng cho môi trường dev, để /video-call/api và
      // /video-call/socket.io trỏ về backend cục bộ mà không cần Nginx.
      // Địa chỉ backend lấy từ biến môi trường (không hardcode localhost
      // trong code — chỉ hardcode trong .env.development, là file cấu hình
      // dev-only, không dùng cho production).
      proxy: env.VITE_DEV_BACKEND_ORIGIN
        ? {
            [env.VITE_API_BASE || "/video-call/api"]: {
              target: env.VITE_DEV_BACKEND_ORIGIN,
              changeOrigin: true,
            },
            [env.VITE_SOCKET_PATH || "/video-call/socket.io"]: {
              target: env.VITE_DEV_BACKEND_ORIGIN,
              ws: true,
              changeOrigin: true,
            },
          }
        : undefined,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
