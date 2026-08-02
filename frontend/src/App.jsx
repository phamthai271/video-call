import { useEffect, useState } from "react";
import { API_BASE } from "./config.js";
import { socket, connectSocket, disconnectSocket } from "./socket.js";

export default function App() {
  const [health, setHealth] = useState(null);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [messages, setMessages] = useState([]);

  // Gọi API: dùng đường dẫn tương đối API_BASE, KHÔNG có domain/IP.
  // Trình duyệt tự gửi request tới cùng origin đang mở trang, ví dụ:
  // http://domain/video-call/api/health
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  // Kết nối Socket.IO khi component mount, ngắt khi unmount.
  useEffect(() => {
    connectSocket();

    const onConnect = () => setSocketStatus("connected");
    const onDisconnect = () => setSocketStatus("disconnected");
    const onMessage = (payload) =>
      setMessages((prev) => [...prev, payload]);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("server:message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("server:message", onMessage);
      disconnectSocket();
    };
  }, []);

  const sendPing = () => {
    socket.emit("client:ping", { time: Date.now() });
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Video Call</h1>

      <section>
        <h2>API health check</h2>
        <pre>{health ? JSON.stringify(health, null, 2) : "Đang tải..."}</pre>
      </section>

      <section>
        <h2>Socket.IO</h2>
        <p>Trạng thái: {socketStatus}</p>
        <button onClick={sendPing}>Gửi ping</button>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{JSON.stringify(m)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
