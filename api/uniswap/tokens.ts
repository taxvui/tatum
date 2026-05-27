export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Curated high-fidelity tokens compatible with Uniswap protocols across chains
  const defaultTokens = [
    {
      chainId: 1, // Ethereum Mainnet
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png",
      basePriceUsd: 3750.85
    },
    {
      chainId: 1,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      basePriceUsd: 1.00
    },
    {
      chainId: 1,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      basePriceUsd: 1.00
    },
    {
      chainId: 1,
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      symbol: "WBTC",
      name: "Wrapped BTC",
      decimals: 8,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
      basePriceUsd: 68450.25
    },
    {
      chainId: 1,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
      basePriceUsd: 1.00
    },
    {
      chainId: 1,
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
      basePriceUsd: 9.42
    },
    {
      chainId: 1,
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
      basePriceUsd: 17.15
    },
    {
      chainId: 137, // Polygon
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      symbol: "WMATIC",
      name: "Wrapped MATIC",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
      basePriceUsd: 0.685
    },
    {
      chainId: 137,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      symbol: "USDC",
      name: "USD Coin (PoS)",
      decimals: 6,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      basePriceUsd: 1.00
    },
    {
      chainId: 56, // BNB Smart Chain
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      symbol: "WBNB",
      name: "Wrapped BNB",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
      basePriceUsd: 590.42
    },
    {
      chainId: 42161, // Arbitrum One
      address: "0x82aF49447D8a07e3bd95BD0d56f352415231aa11",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png",
      basePriceUsd: 3750.85
    },
    {
      chainId: 42161,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      basePriceUsd: 1.00
    }
  ];

  try {
    // Attempt to enrich or bring latest IPFS official standard lists if online, otherwise use local high-fidelity list
    // Uniswap default list is fetched via dynamic gateway IPFS to prevent server crashes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout to keep serverless fast

    try {
      const ipfsResponse = await fetch("https://gateway.ipfs.io/ipns/tokens.uniswap.org", {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      clearTimeout(timeoutId);

      if (ipfsResponse.ok) {
        console.log("UNISWAP IPFS STATUS:", ipfsResponse.status);
        const raw = await ipfsResponse.text();
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tokens)) {
          // Filter popular chains (Chain 1: Ethereum, 137: Polygon, 42161: Arbitrum) and mix with base rates
          const ipfsTokens = parsed.tokens
            .filter((t: any) => [1, 137, 42161, 10, 8453].includes(t.chainId))
            .slice(0, 80) // Limit to top 80 tokens to ensure excellent performance
            .map((t: any) => {
              // Guess or inject a basePriceUsd for common swapping visual feedback
              let basePrice = 1.0;
              const sym = t.symbol.toUpperCase();
              if (sym === "WETH" || sym === "ETH") basePrice = 3750.85;
              else if (sym === "WBTC" || sym === "BTC") basePrice = 68450.25;
              else if (sym === "UNI") basePrice = 9.42;
              else if (sym === "LINK") basePrice = 17.15;
              else if (sym === "WMATIC" || sym === "MATIC") basePrice = 0.685;
              else if (sym === "WBNB" || sym === "BNB") basePrice = 590.42;

              return {
                ...t,
                basePriceUsd: basePrice
              };
            });
          
          // Merge lists carefully preventing duplicates by chainId + address
          const merged: Record<string, any> = {};
          defaultTokens.forEach(t => {
            merged[`${t.chainId}-${t.address.toLowerCase()}`] = t;
          });
          ipfsTokens.forEach((t: any) => {
            const key = `${t.chainId}-${t.address.toLowerCase()}`;
            if (!merged[key]) {
              merged[key] = t;
            }
          });

          return res.status(200).json({
            success: true,
            source: "Uniswap IPFS & Local Cache",
            tokens: Object.values(merged)
          });
        }
      }
    } catch (ipfsError) {
      console.warn("[UNISWAP IPFS FETCH FAILED] Falling back to local token list:", ipfsError);
    }

    // Default return of local cached list
    return res.status(200).json({
      success: true,
      source: "Local High-Fidelity Uniswap Token Cache",
      tokens: defaultTokens
    });
  } catch (error: any) {
    console.error("[UNISWAP TOKENS EXCEPTION]:", error);
    return res.status(200).json({
      success: true,
      source: "Local Secure Cache Fallback",
      tokens: defaultTokens,
      errorMsg: error.message
    });
  }
}
