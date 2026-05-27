const getApiKey = (network: "mainnet" | "testnet", customKey?: string) => {
  if (customKey && customKey.trim() !== "") {
    return customKey.trim();
  }
  return network === "mainnet"
    ? (process.env.TATUM_MAINNET_KEY || "t-6a0404ac3e08a78e0ddc247a-e3593ed6b1d24a1db9b54b09")
    : (process.env.TATUM_TESTNET_KEY || "t-6a0404ac3e08a78e0ddc247a-1cf5ba65fbe3467fb1c039be");
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

    console.log("STATUS:", response.status);
    const raw = await response.text();
    console.log("RAW:", raw.slice(0, 300));

    if (response.ok) {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return res.status(200).json({ success: true, message: "API key is valid, but response payload was non-JSON.", testChain: "Bitcoin" });
      }
      return res.status(200).json({ success: true, message: "API key is valid and working!", testChain: "Bitcoin", data });
    }

    // Try Ethereum fallback if 1st attempt returned non-OK
    console.log(`[TATUM TEST-KEY] Failed on Bitcoin (status ${response.status}). Trying Ethereum fallback...`);

    const ethResponse = await fetch("https://api.tatum.io/v3/ethereum/info", {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    console.log("STATUS ETH:", ethResponse.status);
    const ethRaw = await ethResponse.text();
    console.log("RAW ETH:", ethRaw.slice(0, 300));

    if (ethResponse.ok) {
      let data;
      try {
        data = JSON.parse(ethRaw);
      } catch {
        return res.status(200).json({ success: true, message: "API key is valid (Ethereum fallback), but payload was non-JSON.", testChain: "Ethereum" });
      }
      return res.status(200).json({ success: true, message: "API key is valid and working!", testChain: "Ethereum", data });
    }

    // If both failed, parse general error response
    let parsedError = ethRaw;
    try {
      const parsed = JSON.parse(ethRaw);
      parsedError = parsed.message || parsed.error || ethRaw;
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
}
