import express from "express";
import dotenv from "dotenv";
import path from "path";

// Import atomic serverless handlers
import cmcListings from "./api/cmc/listings";
import cmcGlobal from "./api/cmc/global";
import tatumWallet from "./api/tatum/wallet";
import tatumAddress from "./api/tatum/address";
import tatumPrivateKey from "./api/tatum/private-key";
import tatumTestKey from "./api/tatum/test-key";
import uniswapTokens from "./api/uniswap/tokens";
import uniswapQuote from "./api/uniswap/quote";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable Cross-Origin Resource Sharing (CORS) manually for API durability
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Bind the Serverless handlers directly for local Express compatibility
app.get("/api/cmc/listings", cmcListings);
app.get("/api/cmc/global", cmcGlobal);
app.post("/api/tatum/wallet", tatumWallet);
app.post("/api/tatum/address", tatumAddress);
app.post("/api/tatum/private-key", tatumPrivateKey);
app.post("/api/tatum/test-key", tatumTestKey);
app.get("/api/uniswap/tokens", uniswapTokens);
app.post("/api/uniswap/quote", uniswapQuote);

// Setup static file serving for fallback or standalone production environments (non-Vercel environments)
if (!process.env.VERCEL && process.env.DEV_SERVER !== "true") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Standalone production server running on port ${PORT}`);
  });
}

export default app;
