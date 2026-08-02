// Quản lý process bằng PM2:
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup   (để tự chạy lại sau khi reboot VPS)
//
// Mỗi project trên VPS nên có 1 entry riêng trong ecosystem của mình
// (hoặc gộp nhiều app vào 1 file ecosystem chung nếu muốn quản lý tập
// trung — chỉ cần đảm bảo mỗi app dùng PORT khác nhau qua file .env).
module.exports = {
  apps: [
    {
      name: "video-call-api",
      script: "src/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      // PORT được đọc từ file .env (qua dotenv) trong code, không cần
      // khai báo lại ở đây trừ khi bạn muốn override.
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
