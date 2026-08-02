import { Server } from "socket.io";

export function attachSocket(httpServer) {
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const io = new Server(httpServer, {
    // Path mặc định của Socket.IO là "/socket.io". Giữ nguyên giá trị
    // này (KHÔNG thêm "/video-call") vì Nginx đã strip prefix trước khi
    // forward, nên backend chỉ cần biết "/socket.io".
    path: "/socket.io",
    cors: origins.length > 0 ? { origin: origins, credentials: true } : undefined,
  });

  io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on("client:ping", (payload) => {
      socket.emit("server:message", {
        echo: payload,
        receivedAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket] client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}
