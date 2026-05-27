const FALLBACK_CMC_GLOBAL = {
  active_cryptocurrencies: 12450,
  total_market_cap: 2510230450000,
  total_volume_24h: 84520120350,
  btc_dominance: 53.4,
  eth_dominance: 17.2,
  active_exchanges: 720,
  active_market_pairs: 84120,
  market_cap_percentage: {
    btc: 53.4,
    eth: 17.2
  },
  market_cap_change_24h: 1.65,
  quote: {
    USD: {
      total_market_cap: 2510230450000,
      total_market_cap_yesterday: 2470120350000,
      total_market_cap_yesterday_percentage_change: 1.65,
      total_volume_24h: 84520120350,
      total_volume_24h_yesterday: 81203450200,
      total_volume_24h_yesterday_percentage_change: 4.12,
      market_cap_change_24h: 1.65
    }
  }
};

export default async function handler(req: any, res: any) {
  // Manual CORS settings
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CMC_PRO_API_KEY");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { convert = "USD" } = req.query || {};

  const CMC_API_KEY = process.env.CMC_API_KEY || "99252a262fd44d73ab297c8e8929157c";

  console.log("CMC KEY EXISTS:", !!process.env.CMC_API_KEY);

  try {
    const url = `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=${convert}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    console.log("STATUS:", response.status);
    const raw = await response.text();
    console.log("RAW:", raw.slice(0, 300));

    if (!response.ok) {
      let parsedError = raw;
      try {
        const parsed = JSON.parse(raw);
        parsedError = parsed.status?.error_message || parsed.error || raw;
      } catch (e) {}
      console.warn(`[CMC PROXY global failed] CMC returned status ${response.status}: ${parsedError.slice(0, 300)}. Returning fallback data.`);
      return res.status(200).json({ data: FALLBACK_CMC_GLOBAL, simulated: true, errorMsg: parsedError.slice(0, 100) });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.warn("[CMC PROXY global parse failed] Response is not JSON. Returning fallback.");
      return res.status(200).json({
        data: FALLBACK_CMC_GLOBAL,
        simulated: true,
        errorMsg: "Response was not valid JSON"
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[CMC PROXY GLOBAL Exception]:", error.message);
    return res.status(200).json({ data: FALLBACK_CMC_GLOBAL, simulated: true, errorMsg: error.message });
  }
}
