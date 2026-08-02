import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "video-call-backend",
    time: new Date().toISOString(),
  });
});

// Thêm các route thật của bạn ở đây, ví dụ:
// router.get("/rooms", listRooms);
// router.post("/rooms", createRoom);

export default router;
