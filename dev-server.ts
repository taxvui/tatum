import app from "./server";
import { createServer as createViteServer } from "vite";

async function startDevServer() {
  const PORT = 3000;
  
  console.log("[DEV-SERVER] Khởi động Vite Development Server...");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  
  app.use(vite.middlewares);
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DEV-SERVER] Máy chủ đang phản hồi tại http://localhost:${PORT}`);
  });
}

startDevServer();
