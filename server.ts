import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Get the correct Tatum API key, prioritizing custom key if provided by user
const getApiKey = (network: "mainnet" | "testnet", customKey?: string) => {
  if (customKey && customKey.trim() !== "") {
    return customKey.trim();
  }
  return network === "mainnet"
    ? (process.env.TATUM_MAINNET_KEY || "t-6a0404ac3e08a78e0ddc247a-e3593ed6b1d24a1db9b54b09")
    : (process.env.TATUM_TESTNET_KEY || "t-6a0404ac3e08a78e0ddc247a-1cf5ba65fbe3467fb1c039be");
};

// Tatum maps for display or route compatibility
const CHAIN_API_NAMES: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  bsc: "bsc",
  trx: "tron",
  sol: "solana",
  ada: "cardano",
  doge: "dogecoin",
  ltc: "litecoin",
  polygon: "polygon"
};

// Diagnostics Endpoint: Test if an API key is valid using /v3/bitcoin/info (or ethereum/info as fallback)
app.post("/api/tatum/test-key", async (req, res) => {
  const { network, customApiKey } = req.body || {};
  const apiKey = getApiKey(network, customApiKey);

  console.log(`[TATUM TEST-KEY] Testing key on network: ${network}`);
  
  try {
    // 1st attempt: Bitcoin info
    const response = await fetch("https://api.tatum.io/v3/bitcoin/info", {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[TATUM TEST-KEY] Success (Bitcoin info)`);
      return res.json({ success: true, message: "API key is valid and working!", testChain: "Bitcoin", data });
    }

    // If 1st attempt fails, let's look at the error. If it's a 403 or 401, the key is invalid immediately.
    if (response.status === 401 || response.status === 403) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.message || parsed.error || errText;
      } catch (e) {}
      
      // Let's fallback to test ethereum first before throwing an error
      console.log(`[TATUM TEST-KEY] Unauthorized/Forbidden on Bitcoin (status ${response.status}). Trying Ethereum fallback...`);
    }

    // 2nd attempt: If it returned 404/401/403, try Ethereum info
    const ethResponse = await fetch("https://api.tatum.io/v3/ethereum/info", {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    if (ethResponse.ok) {
      const data = await ethResponse.json();
      console.log(`[TATUM TEST-KEY] Success (Ethereum info)`);
      return res.json({ success: true, message: "API key is valid and working!", testChain: "Ethereum", data });
    }

    // If both failed, parse general error response
    const errText = await ethResponse.text();
    let parsedError = errText;
    try {
      const parsed = JSON.parse(errText);
      parsedError = parsed.message || parsed.error || errText;
    } catch (e) {}

    console.warn(`[TATUM TEST-KEY] Fallback failed (Status ${ethResponse.status}): ${parsedError}`);

    return res.status(ethResponse.status || 404).json({ 
      success: false, 
      error: parsedError || `Không thể kiểm tra API key. Cả Bitcoin (status ${response.status}) và Ethereum (status ${ethResponse.status}) đều từ chối kết nối.`
    });

  } catch (error: any) {
    console.error("[TATUM TEST-KEY] Catch block error:", error);
    return res.status(500).json({ success: false, error: error.message || "Unknown error connecting to Tatum" });
  }
});

// Endpoint to generate a new HD Wallet or direct Solana/Cardano wallet
app.post("/api/tatum/wallet", async (req, res) => {
  const { chain, network, customApiKey } = req.body || {};
  if (!chain) {
    return res.status(400).json({ error: "Chain is required" });
  }

  const apiKey = getApiKey(network, customApiKey);
  const internalChain = CHAIN_API_NAMES[chain.toLowerCase()] || chain.toLowerCase();

  try {
    const response = await fetch(`https://api.tatum.io/v3/${internalChain}/wallet`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.message || parsed.error || errText;
      } catch (e) {}
      console.warn(`[TATUM WALLET PROXY] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status).json({ error: parsedError });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`[TATUM WALLET PROXY] Connection error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Unknown error connecting to Tatum" });
  }
});

// Endpoint to derive an address from an xpub
app.post("/api/tatum/address", async (req, res) => {
  const { chain, network, xpub, index, customApiKey } = req.body || {};
  if (!chain || !xpub || index === undefined) {
    return res.status(400).json({ error: "Chain, xpub, and index are required" });
  }

  const apiKey = getApiKey(network, customApiKey);
  const internalChain = CHAIN_API_NAMES[chain.toLowerCase()] || chain.toLowerCase();

  try {
    const url = `https://api.tatum.io/v3/${internalChain}/address/${xpub}/${index}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.message || parsed.error || errText;
      } catch (e) {}
      console.warn(`[TATUM ADDRESS PROXY] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status).json({ error: parsedError });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`[TATUM ADDRESS PROXY] Connection error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Unknown error connecting to Tatum" });
  }
});

// Endpoint to derive a private key from client-provided or newly generated mnemonic
app.post("/api/tatum/private-key", async (req, res) => {
  const { chain, network, mnemonic, index, customApiKey } = req.body || {};
  if (!chain || !mnemonic || index === undefined) {
    return res.status(400).json({ error: "Chain, mnemonic, and index are required" });
  }

  const apiKey = getApiKey(network, customApiKey);
  const internalChain = CHAIN_API_NAMES[chain.toLowerCase()] || chain.toLowerCase();

  try {
    const url = `https://api.tatum.io/v3/${internalChain}/wallet/priv`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({ mnemonic, index: Number(index) })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.message || parsed.error || errText;
      } catch (e) {}
      console.warn(`[TATUM PVKEY PROXY] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status).json({ error: parsedError });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`[TATUM PVKEY PROXY] Connection error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Unknown error connecting to Tatum" });
  }
});

// CoinMarketCap API Configuration
const CMC_API_KEY = process.env.CMC_API_KEY || "99252a262fd44d73ab297c8e8929157c";

// Proxy endpoint for CoinMarketCap Cryptocurrency Listings
app.get("/api/cmc/listings", async (req, res) => {
  const { start = "1", limit = "100", convert = "USD", sort = "market_cap", sort_dir = "desc" } = req.query;
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${limitNum}&convert=${convert}&sort=${sort}&sort_dir=${sort_dir}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.status?.error_message || parsed.error || errText;
      } catch (e) {}
      console.warn(`[CMC PROXY] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status).json({ error: parsedError });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`[CMC PROXY] Error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Unknown error connecting to CoinMarketCap API" });
  }
});

// Proxy endpoint for CoinMarketCap Global Metrics
app.get("/api/cmc/global", async (req, res) => {
  const { convert = "USD" } = req.query;
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=${convert}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.status?.error_message || parsed.error || errText;
      } catch (e) {}
      console.warn(`[CMC PROXY GLOBAL] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status).json({ error: parsedError });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`[CMC PROXY GLOBAL] Error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Unknown error connecting to CoinMarketCap API" });
  }
});

// Setup static file serving for regular production (not Vercel or local Dev Server)
if (!process.env.VERCEL && process.env.DEV_SERVER !== "true") {
  console.log("[SERVER] Khởi động Production Static Server...");
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on port ${PORT}`);
  });
}

export default app;
