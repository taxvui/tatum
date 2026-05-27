const FALLBACK_CMC_DATA = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    slug: "bitcoin",
    num_market_pairs: 11012,
    date_added: "2013-04-28T00:00:00.000Z",
    tags: ["mineable", "pow", "sha-256", "store-of-value"],
    max_supply: 21000000,
    circulating_supply: 19650000,
    total_supply: 19650000,
    infinite_supply: false,
    last_updated: new Date().toISOString(),
    quote: {
      USD: {
        price: 68450.25,
        volume_24h: 28450120150,
        volume_change_24h: 3.45,
        percent_change_1h: 0.12,
        percent_change_24h: 1.85,
        percent_change_7d: 5.42,
        percent_change_30d: 12.4,
        market_cap: 1342501002000,
        market_cap_dominance: 53.4,
        fully_diluted_market_cap: 1437455000000,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 1027,
    name: "Ethereum",
    symbol: "ETH",
    slug: "ethereum",
    num_market_pairs: 8900,
    max_supply: null,
    circulating_supply: 120100000,
    total_supply: 120100000,
    quote: {
      USD: {
        price: 3750.85,
        volume_24h: 14250890120,
        percent_change_1h: -0.05,
        percent_change_24h: 2.15,
        percent_change_7d: 1.22,
        percent_change_30d: 8.52,
        market_cap: 450112450000,
        market_cap_dominance: 17.2,
        fully_diluted_market_cap: 450112450000,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 1839,
    name: "BNB",
    symbol: "BNB",
    slug: "bnb",
    quote: {
      USD: {
        price: 590.42,
        volume_24h: 1201450000,
        percent_change_1h: 0.25,
        percent_change_24h: -0.45,
        percent_change_7d: 3.12,
        market_cap: 87521000000,
        market_cap_dominance: 3.4,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 5426,
    name: "Solana",
    symbol: "SOL",
    slug: "solana",
    quote: {
      USD: {
        price: 168.35,
        volume_24h: 3125000400,
        percent_change_1h: 0.45,
        percent_change_24h: 4.82,
        percent_change_7d: -2.15,
        market_cap: 75450201000,
        market_cap_dominance: 2.9,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 52,
    name: "XRP",
    symbol: "XRP",
    slug: "xrp",
    quote: {
      USD: {
        price: 0.528,
        volume_24h: 890450000,
        percent_change_1h: -0.12,
        percent_change_24h: 0.35,
        percent_change_7d: -1.12,
        market_cap: 29500000000,
        market_cap_dominance: 1.1,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 2010,
    name: "Cardano",
    symbol: "ADA",
    slug: "cardano",
    quote: {
      USD: {
        price: 0.455,
        volume_24h: 350120000,
        percent_change_1h: 0.05,
        percent_change_24h: -1.25,
        percent_change_7d: 0.85,
        market_cap: 16210000000,
        market_cap_dominance: 0.6,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 74,
    name: "Dogecoin",
    symbol: "DOGE",
    slug: "dogecoin",
    quote: {
      USD: {
        price: 0.162,
        volume_24h: 1890120000,
        percent_change_1h: 0.85,
        percent_change_24h: 6.72,
        percent_change_7d: 15.4,
        market_cap: 23412000000,
        market_cap_dominance: 0.9,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 11419,
    name: "Toncoin",
    symbol: "TON",
    slug: "toncoin",
    quote: {
      USD: {
        price: 6.42,
        volume_24h: 412500000,
        percent_change_1h: -0.22,
        percent_change_24h: 2.85,
        percent_change_7d: 9.12,
        market_cap: 22450000000,
        market_cap_dominance: 0.8,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 1958,
    name: "TRON",
    symbol: "TRX",
    slug: "tron",
    quote: {
      USD: {
        price: 0.118,
        volume_24h: 280120000,
        percent_change_1h: 0.02,
        percent_change_24h: 0.15,
        percent_change_7d: 1.45,
        market_cap: 10450000000,
        market_cap_dominance: 0.4,
        last_updated: new Date().toISOString()
      }
    }
  },
  {
    id: 3890,
    name: "Polygon",
    symbol: "POL",
    slug: "polygon",
    quote: {
      USD: {
        price: 0.685,
        volume_24h: 210450000,
        percent_change_1h: -0.15,
        percent_change_24h: -1.05,
        percent_change_7d: -4.32,
        market_cap: 6850000000,
        market_cap_dominance: 0.25,
        last_updated: new Date().toISOString()
      }
    }
  }
];

export default async function handler(req: any, res: any) {
  // Manual CORS settings
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CMC_PRO_API_KEY");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { start = "1", limit = "100", convert = "USD", sort = "market_cap", sort_dir = "desc" } = req.query || {};
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const CMC_API_KEY = process.env.CMC_API_KEY || "99252a262fd44d73ab297c8e8929157c";

  console.log("CMC KEY EXISTS:", !!process.env.CMC_API_KEY);

  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${limitNum}&convert=${convert}&sort=${sort}&sort_dir=${sort_dir}`;
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
      console.warn(`[CMC SERVERLESS listings failed] CMC returned status ${response.status}: ${parsedError.slice(0, 300)}. Returning high-fidelity fallback.`);
      return res.status(200).json({ data: FALLBACK_CMC_DATA, simulated: true, errorMsg: parsedError.slice(0, 100) });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.warn("[CMC SERVERLESS listings parse failed] Response is not JSON. Returning fallback.");
      return res.status(200).json({
        data: FALLBACK_CMC_DATA,
        simulated: true,
        errorMsg: "Response from CoinMarketCap was not valid JSON."
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[CMC SERVERLESS listings error]:", error.message);
    return res.status(200).json({
      data: FALLBACK_CMC_DATA,
      simulated: true,
      errorMsg: error.message
    });
  }
}
