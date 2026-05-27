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

const getApiKey = (network: "mainnet" | "testnet", customKey?: string) => {
  if (customKey && customKey.trim() !== "") {
    return customKey.trim();
  }
  return network === "mainnet"
    ? (process.env.TATUM_MAINNET_KEY || "t-6a0404ac3e08a78e0ddc247a-e3593ed6b1d24a1db9b54b09")
    : (process.env.TATUM_TESTNET_KEY || "t-6a0404ac3e08a78e0ddc247a-1cf5ba65fbe3467fb1c039be");
};

const generateMockDerivedAddress = (chain: string, xpub: string, index: number) => {
  const chainLower = chain.toLowerCase();
  const hex = "0123456789abcdef";
  const indexHash = index.toString(16).padStart(4, "0");
  const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  
  if (chainLower === "btc" || chainLower === "bitcoin") {
    return "bc1q" + Array.from({ length: 34 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("").toLowerCase() + indexHash;
  } else if (["eth", "bsc", "polygon", "arbitrum", "optimism"].includes(chainLower)) {
    return "0x" + Array.from({ length: 36 }, () => hex.charAt(Math.floor(Math.random() * 16))).join("") + indexHash;
  } else if (chainLower === "trx" || chainLower === "tron") {
    return "T" + Array.from({ length: 30 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("") + indexHash;
  } else {
    return "0x" + Array.from({ length: 36 }, () => hex.charAt(Math.floor(Math.random() * 16))).join("") + indexHash;
  }
};

export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

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
        "x-api-key": apiKey,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    console.log(`[TATUM ADDRESS STATUS]`, response.status);
    const raw = await response.text();
    console.log(`[TATUM ADDRESS RAW]`, raw.slice(0, 300));

    if (!response.ok) {
      let parsedError = raw;
      try {
        const parsed = JSON.parse(raw);
        parsedError = parsed.message || parsed.error || raw;
      } catch (e) {}
      console.warn(`[TATUM ADDRESS PROXY] API returned status ${response.status}: ${parsedError}`);
      return res.status(response.status || 450).json({ 
        error: `Lỗi kết nối từ hệ thống Tatum API (Mã phản hồi ${response.status}): ${parsedError}`
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch {
      console.warn("[TATUM ADDRESS] Failed to parse API JSON response.");
      return res.status(502).json({ 
        error: "Không thể xử lý dữ liệu phản hồi (JSON) từ Tatum API khi trích xuất địa chỉ ví." 
      });
    }

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error(`[TATUM ADDRESS PROXY Exception] ${error.message}`);
    return res.status(500).json({ 
      error: `Lỗi ngoại lệ khi kết nối để lấy địa chỉ từ Tatum API: ${error.message}`
    });
  }
}
