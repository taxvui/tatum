import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
  const { network, customApiKey } = req.body;
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
      console.warn(`[TATUM TEST-KEY] Unauthorized/Forbidden (Status ${response.status}): ${parsedError}`);
      return res.status(response.status).json({ success: false, error: `API Key không lệ hoặc đã hết hạn: ${parsedError}` });
    }

    // 2nd attempt: If it returned 404 (maybe bitcoin is disabled or not found), try Ethereum info
    console.log(`[TATUM TEST-KEY] Bitcoin info returned ${response.status}. Trying Ethereum info as fallback...`);
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
    return res.status(ethResponse.status).json({ 
      success: false, 
      error: parsedError || `Không thể kiểm tra API key. Cả Bitcoin (status ${response.status}) và Ethereum (status ${ethResponse.status}) đều thất bại.`
    });

  } catch (error: any) {
    console.error("[TATUM TEST-KEY] Catch block error:", error);
    return res.status(500).json({ success: false, error: error.message || "Unknown error connecting to Tatum" });
  }
});

// Endpoint to generate a new HD Wallet or direct Solana/Cardano wallet
app.post("/api/tatum/wallet", async (req, res) => {
  const { chain, network, customApiKey } = req.body;
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
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const js = JSON.parse(errorText);
        parsedError = js.message || js.error || errorText;
      } catch (e) {}
      return res.status(response.status).json({ error: parsedError || `Tatum API returned status ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`Error generating ${chain} wallet:`, error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Endpoint to derive an address from an xpub
app.post("/api/tatum/address", async (req, res) => {
  const { chain, network, xpub, index, customApiKey } = req.body;
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
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const js = JSON.parse(errorText);
        parsedError = js.message || js.error || errorText;
      } catch (e) {}
      return res.status(response.status).json({ error: parsedError || `Tatum API returned status ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`Error deriving ${chain} address:`, error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Endpoint to derive a private key from client-provided or newly generated mnemonic
app.post("/api/tatum/private-key", async (req, res) => {
  const { chain, network, mnemonic, index, customApiKey } = req.body;
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
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const js = JSON.parse(errorText);
        parsedError = js.message || js.error || errorText;
      } catch (e) {}
      return res.status(response.status).json({ error: parsedError || `Tatum API returned status ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error(`Error deriving private key for ${chain}:`, error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// CoinMarketCap API Configuration
const CMC_API_KEY = process.env.CMC_API_KEY || "99252a262fd44d73ab297c8e8929157c";

// --- START OF DETAILED COINMARKETCAP SIMULATED DATA ENGINE ---
const MOCK_ASSETS_BASE = [
  { id: 1, name: "Bitcoin", symbol: "BTC", slug: "bitcoin", price: 91450.25, change24h: 1.82, change1h: -0.15, change7d: 3.45, mcap: 1801750240900, vol24h: 42180450920, supply: 19702250, max_supply: 21000000, cmc_rank: 1 },
  { id: 1027, name: "Ethereum", symbol: "ETH", slug: "ethereum", price: 3425.80, change24h: -0.85, change1h: 0.22, change7d: 5.12, mcap: 411481236100, vol24h: 19450320140, supply: 120112450, max_supply: null, cmc_rank: 2 },
  { id: 1839, name: "BNB", symbol: "BNB", slug: "bnb", price: 592.40, change24h: 0.45, change1h: -0.05, change7d: -1.22, mcap: 87426451200, vol24h: 1680450910, supply: 147580120, max_supply: 200000000, cmc_rank: 3 },
  { id: 5426, name: "Solana", symbol: "SOL", slug: "solana", price: 174.65, change24h: 4.25, change1h: 0.85, change7d: 12.80, mcap: 78311680200, vol24h: 3840509200, supply: 448392100, max_supply: null, cmc_rank: 4 },
  { id: 825, name: "Tether", symbol: "USDT", slug: "tether", price: 1.0002, change24h: 0.01, change1h: -0.01, change7d: 0.05, mcap: 112473290000, vol24h: 58940509400, supply: 112450800000, max_supply: null, cmc_rank: 5 },
  { id: 52, name: "XRP", symbol: "XRP", slug: "xrp", price: 1.125, change24h: 3.12, change1h: -0.32, change7d: 14.25, mcap: 62348007200, vol24h: 2450910200, supply: 55420450900, max_supply: 100000000000, cmc_rank: 6 },
  { id: 3408, name: "USDC", symbol: "USDC", slug: "usd-coin", price: 1.0001, change24h: 0.01, change1h: 0.00, change7d: 0.02, mcap: 32454135000, vol24h: 6450912400, supply: 32450890000, max_supply: null, cmc_rank: 7 },
  { id: 2011, name: "Cardano", symbol: "ADA", slug: "cardano", price: 0.725, change24h: 2.45, change1h: 0.15, change7d: -3.12, mcap: 25839181900, vol24h: 890450910, supply: 35640250910, max_supply: 45000000000, cmc_rank: 8 },
  { id: 74, name: "Dogecoin", symbol: "DOGE", slug: "dogecoin", price: 0.384, change24h: 5.80, change1h: -0.45, change7d: 22.40, mcap: 55491502000, vol24h: 3120450900, supply: 144509120000, max_supply: null, cmc_rank: 9 },
  { id: 1958, name: "TRON", symbol: "TRX", slug: "tron", price: 0.2045, change24h: 1.15, change1h: 0.12, change7d: 4.80, mcap: 17697616500, vol24h: 420912450, supply: 86540912400, max_supply: null, cmc_rank: 10 },
  { id: 11419, name: "Toncoin", symbol: "TON", slug: "toncoin", price: 5.35, change24h: -1.45, change1h: -0.21, change7d: 2.15, mcap: 13420850200, vol24h: 215408910, supply: 2509124500, max_supply: null, cmc_rank: 11 },
  { id: 5994, name: "Shiba Inu", symbol: "SHIB", slug: "shiba-inu", price: 0.0000245, change24h: 4.82, change1h: -0.80, change7d: 11.20, mcap: 14412950800, vol24h: 890540120, supply: 589270400000000, max_supply: 589730000000000, cmc_rank: 12 },
  { id: 5805, name: "Avalanche", symbol: "AVAX", slug: "avalanche", price: 33.52, change24h: -2.15, change1h: 0.10, change7d: 5.60, mcap: 13245402500, vol24h: 312450890, supply: 395120400, max_supply: 720000000, cmc_rank: 13 },
  { id: 1975, name: "Chainlink", symbol: "LINK", slug: "chainlink", price: 17.22, change24h: 3.14, change1h: 0.45, change7d: 8.90, mcap: 10245091200, vol24h: 425091800, supply: 595120400, max_supply: 1000000000, cmc_rank: 14 },
  { id: 6636, name: "Polkadot", symbol: "DOT", slug: "polkadot-new", price: 5.82, change24h: -0.80, change1h: -0.12, change7d: 1.15, mcap: 8245091200, vol24h: 185091400, supply: 1416450900, max_supply: null, cmc_rank: 15 },
  { id: 28301, name: "Polygon", symbol: "POL", slug: "polygon-ecosystem-token", price: 0.425, change24h: 1.25, change1h: -0.05, change7d: -2.40, mcap: 3410250900, vol24h: 112450900, supply: 8012450900, max_supply: 10000000000, cmc_rank: 16 },
  { id: 6535, name: "Near Protocol", symbol: "NEAR", slug: "near-protocol", price: 5.12, change24h: 4.80, change1h: 0.65, change7d: 15.40, mcap: 5845091200, vol24h: 345091800, supply: 1141245000, max_supply: 1000000000, cmc_rank: 17 },
  { id: 20947, name: "Sui", symbol: "SUI", slug: "sui", price: 3.42, change24h: 8.90, change1h: 1.45, change7d: 28.50, mcap: 9450912400, vol24h: 780450900, supply: 2760450900, max_supply: 10000000000, cmc_rank: 18 },
  { id: 21794, name: "Aptos", symbol: "APT", slug: "aptos", price: 11.55, change24h: 2.15, change1h: 0.05, change7d: 6.45, mcap: 6124502500, vol24h: 215450890, supply: 530412400, max_supply: null, cmc_rank: 19 },
  { id: 7083, name: "Uniswap", symbol: "UNI", slug: "uniswap", price: 9.25, change24h: -1.15, change1h: -0.32, change7d: 4.12, mcap: 5545012400, vol24h: 195408900, supply: 600124500, max_supply: 1000000000, cmc_rank: 20 },
  { id: 2, name: "Litecoin", symbol: "LTC", slug: "litecoin", price: 88.54, change24h: 1.45, change1h: 0.15, change7d: 7.20, mcap: 6625091200, vol24h: 412509800, supply: 74820120, max_supply: 84000000, cmc_rank: 21 },
  { id: 24478, name: "Pepe", symbol: "PEPE", slug: "pepecat", price: 0.0000185, change24h: 14.80, change1h: 2.12, change7d: 45.10, mcap: 7804502500, vol24h: 1250450900, supply: 420690000000000, max_supply: 420690000000000, cmc_rank: 22 },
  { id: 3635, name: "Cronos", symbol: "CRO", slug: "crypto-com-coin", price: 0.165, change24h: 0.85, change1h: -0.10, change7d: 11.45, mcap: 4245089200, vol24h: 88450120, supply: 26504509000, max_supply: 30000000000, cmc_rank: 23 },
  { id: 512, name: "Stellar", symbol: "XLM", slug: "stellar", price: 0.245, change24h: 12.45, change1h: 0.88, change7d: 38.40, mcap: 7245091200, vol24h: 880450910, supply: 29504124000, max_supply: 50001806812, cmc_rank: 24 },
  { id: 3790, name: "Cosmos", symbol: "ATOM", slug: "cosmos", price: 8.32, change24h: -1.22, change1h: -0.15, change7d: -2.15, mcap: 3245412400, vol24h: 145091200, supply: 390450900, max_supply: null, cmc_rank: 25 },
  { id: 1321, name: "Ethereum Classic", symbol: "ETC", slug: "ethereum-classic", price: 26.42, change24h: 0.45, change1h: 0.05, change7d: 3.12, mcap: 3892450800, vol24h: 195408900, supply: 147580120, max_supply: 210700000, cmc_rank: 26 },
  { id: 4642, name: "Hedera", symbol: "HBAR", slug: "hedera", price: 0.145, change24h: 9.80, change1h: 1.15, change7d: 29.50, mcap: 5125409100, vol24h: 312540890, supply: 35450892000, max_supply: 50000000000, cmc_rank: 27 },
  { id: 8916, name: "Internet Computer", symbol: "ICP", slug: "internet-computer", price: 9.55, change24h: -2.15, change1h: -0.12, change7d: 4.88, mcap: 4450912400, vol24h: 112450900, supply: 465409200, max_supply: null, cmc_rank: 28 },
  { id: 5690, name: "Render", symbol: "RENDER", slug: "render-token-new", price: 7.62, change24h: 4.15, change1h: 0.65, change7d: 11.20, mcap: 2954089200, vol24h: 185091240, supply: 388124500, max_supply: 536870912, cmc_rank: 29 },
  { id: 2280, name: "Filecoin", symbol: "FIL", slug: "filecoin", price: 4.25, change24h: -1.88, change1h: -0.05, change7d: 1.12, mcap: 2345091200, vol24h: 88540910, supply: 551240450, max_supply: null, cmc_rank: 30 }
];

function getMockCmcListingsData(limit: number, sortField: string, sortDir: string) {
  const mapped = MOCK_ASSETS_BASE.map(item => ({
    id: item.id,
    name: item.name,
    symbol: item.symbol,
    slug: item.slug,
    num_market_pairs: 240,
    date_added: "2015-08-07T00:00:00.000Z",
    tags: [],
    max_supply: item.max_supply,
    circulating_supply: item.supply,
    total_supply: item.supply,
    cmc_rank: item.cmc_rank,
    last_updated: new Date().toISOString(),
    quote: {
      USD: {
        price: item.price,
        volume_24h: item.vol24h,
        volume_change_24h: 2.5,
        percent_change_1h: item.change1h,
        percent_change_24h: item.change24h,
        percent_change_7d: item.change7d,
        market_cap: item.mcap,
        market_cap_dominance: item.symbol === "BTC" ? 56.8 : item.symbol === "ETH" ? 17.4 : 0.4,
        fully_diluted_market_cap: item.max_supply ? item.max_supply * item.price : item.price * item.supply,
        last_updated: new Date().toISOString()
      }
    }
  }));

  mapped.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === "price") {
      valA = a.quote.USD.price;
      valB = b.quote.USD.price;
    } else if (sortField === "percent_change_24h") {
      valA = a.quote.USD.percent_change_24h;
      valB = b.quote.USD.percent_change_24h;
    } else if (sortField === "name") {
      return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      valA = a.quote.USD.market_cap;
      valB = b.quote.USD.market_cap;
    }
    return sortDir === "asc" ? valA - valB : valB - valA;
  });

  return mapped.slice(0, limit);
}

const MOCK_GLOBAL_METRICS = {
  active_cryptocurrencies: 12543,
  total_cryptocurrencies: 24503,
  active_market_pairs: 84920,
  active_exchanges: 724,
  eth_dominance: 17.4,
  btc_dominance: 56.8,
  eth_dominance_yesterday: 17.3,
  btc_dominance_yesterday: 56.5,
  quote: {
    USD: {
      total_market_cap: 3120450912040,
      total_market_cap_yesterday: 3054012940250,
      total_market_cap_yesterday_percentage_change: 2.17,
      total_volume_24h: 128450912040,
      total_volume_24h_yesterday: 119540850250,
      total_volume_24h_yesterday_percentage_change: 7.45,
      last_updated: new Date().toISOString()
    }
  }
};
// --- END OF DETAILED COINMARKETCAP SIMULATED DATA ENGINE ---

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
      console.warn(`[CMC PROXY] API returned status ${response.status}. Falling back to simulated system listings...`);
      const simulatedListings = getMockCmcListingsData(limitNum, String(sort), String(sort_dir));
      return res.json({ data: simulatedListings, isSimulated: true });
    }

    const errorText = await response.clone().text();
    try {
      const data = JSON.parse(errorText);
      return res.json(data);
    } catch (e) {
      console.warn(`[CMC PROXY] API returned non-JSON/invalid payload. Falling back to simulated listings...`);
      const simulatedListings = getMockCmcListingsData(limitNum, String(sort), String(sort_dir));
      return res.json({ data: simulatedListings, isSimulated: true });
    }
  } catch (error: any) {
    console.warn("[CMC PROXY] Connection error fallback:", error.message);
    const simulatedListings = getMockCmcListingsData(limitNum, String(sort), String(sort_dir));
    return res.json({ data: simulatedListings, isSimulated: true, error: error.message });
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
      console.warn(`[CMC PROXY GLOBAL] API returned status ${response.status}. Falling back to simulated global info...`);
      return res.json({ data: MOCK_GLOBAL_METRICS, isSimulated: true });
    }

    const text = await response.clone().text();
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (e) {
      console.warn(`[CMC PROXY GLOBAL] API returned invalid payload. Falling back to simulated global info...`);
      return res.json({ data: MOCK_GLOBAL_METRICS, isSimulated: true });
    }
  } catch (error: any) {
    console.warn("[CMC PROXY GLOBAL] Connection error fallback:", error.message);
    return res.json({ data: MOCK_GLOBAL_METRICS, isSimulated: true, error: error.message });
  }
});

// Setup development & production server hooks
async function startServer() {
  if (process.env.DISABLE_HMR === "true") {
    console.log("HMR disabled. Standard non-Vite rendering or SSR-friendly serving enabled.");
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
