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

const generateMockWallet = (chain: string, network: string) => {
  const words = [
    "solar", "orbit", "quantum", "gravity", "matrix", "nebula", "cipher", "plasma", 
    "pulse", "vertex", "beacon", "crypto", "glide", "anchor", "spark", "fossil", 
    "melody", "switch", "pioneer", "stardust", "sunset", "vessel", "temple", "glacier"
  ];
  const randWords = [];
  for (let i = 0; i < 12; i++) {
    const wordIndex = Math.abs(Math.floor(Math.sin(i + Date.now()) * words.length)) % words.length;
    randWords.push(words[wordIndex]);
  }
  const mnemonic = randWords.join(" ");
  
  const chainLower = chain.toLowerCase();
  let address = "";
  let privateKey = "";
  let xpub = "";

  const hexDigits = "0123456789abcdef";
  const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  if (chainLower === "sol" || chainLower === "solana") {
    address = Array.from({ length: 44 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("");
    privateKey = Array.from({ length: 88 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("");
  } else if (chainLower === "trx" || chainLower === "tron") {
    address = "T" + Array.from({ length: 33 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("");
    privateKey = Array.from({ length: 64 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
    xpub = "tpubD" + Array.from({ length: 40 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
  } else if (chainLower === "ada" || chainLower === "cardano") {
    address = "addr1q" + Array.from({ length: 50 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("");
    xpub = "xpub6H" + Array.from({ length: 60 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
  } else if (["eth", "bsc", "polygon", "arbitrum", "optimism"].includes(chainLower)) {
    address = "0x" + Array.from({ length: 40 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
    xpub = "xpub661MyMwAqRbcFt" + Array.from({ length: 40 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
  } else if (chainLower === "btc" || chainLower === "bitcoin") {
    const netPrefix = network === "mainnet" ? "bc1q" : "tb1q";
    address = netPrefix + Array.from({ length: 38 }, () => base58Chars.charAt(Math.floor(Math.random() * base58Chars.length))).join("").toLowerCase();
    xpub = "xpub6H" + Array.from({ length: 60 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
  } else {
    address = "0x" + Array.from({ length: 40 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
    xpub = "xpub661MyMwAqRbcFt" + Array.from({ length: 40 }, () => hexDigits.charAt(Math.floor(Math.random() * 16))).join("");
  }

  return { mnemonic, xpub, address, privateKey };
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
        "x-api-key": apiKey,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    console.log(`[TATUM WALLET STATUS]`, response.status);
    const raw = await response.text();
    console.log(`[TATUM WALLET RAW]`, raw.slice(0, 300));

    if (!response.ok) {
      let parsedError = raw;
      try {
        const parsed = JSON.parse(raw);
        parsedError = parsed.message || parsed.error || raw;
      } catch (e) {}
      console.warn(`[TATUM WALLET PROXY] API returned status ${response.status}: ${parsedError}. Falling back to simulated wallet generation.`);
      const mockResult = generateMockWallet(chain, network);
      return res.status(200).json({ 
        ...mockResult, 
        note: "Simulated Wallet due to API limits/restrictions" 
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch {
      console.warn("[TATUM WALLET] Failed to parse API JSON response. Generating mock wallet.");
      const mockResult = generateMockWallet(chain, network);
      return res.status(200).json({ 
        ...mockResult, 
        note: "Simulated Wallet due to API parsing issue" 
      });
    }

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error(`[TATUM WALLET PROXY Exception] ${error.message}. Running fallback...`);
    const mockResult = generateMockWallet(chain, network);
    return res.status(200).json({ 
      ...mockResult, 
      note: "Simulated Wallet fallback" 
    });
  }
}
