import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  // CORS chỉ áp dụng nếu có khai báo CORS_ORIGINS trong .env.
  // Khi chạy sau Nginx trên cùng domain (same-origin) thì phần này
  // thường không cần thiết, nhưng để sẵn cho trường hợp dev tách rời.
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (origins.length > 0) {
    app.use(cors({ origin: origins, credentials: true }));
  }

  // Toàn bộ API nằm dưới prefix "/api". KHÔNG biết gì về "/video-call" —
  // Nginx sẽ strip prefix "/video-call" trước khi forward request tới
  // đây, nên backend luôn chỉ thấy /api/...
  app.use("/api", apiRouter);

  // 404 handler cho API
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
