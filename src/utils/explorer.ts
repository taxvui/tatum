import { CHAINS_METADATA, NetworkConfig } from "../config/chains";

/**
 * Finds the network metadata based on a string ID or EVM numeric chain ID
 */
export function findChainMetadata(chainIdOrId: number | string | undefined): NetworkConfig | undefined {
  if (chainIdOrId === undefined) return undefined;

  const normalized = typeof chainIdOrId === "string" ? chainIdOrId.toUpperCase().trim() : "";

  return CHAINS_METADATA.find((chain) => {
    // 1. Check ID (e.g., "ETH", "BASE")
    if (normalized && chain.id.toUpperCase() === normalized) {
      return true;
    }
    // 2. Check Name or short name (exact or substring)
    if (normalized) {
      const chainNameUpper = chain.name.toUpperCase();
      const chainShortUpper = chain.shortName.toUpperCase();
      if (
        chainNameUpper === normalized ||
        chainShortUpper === normalized ||
        normalized.includes(chainNameUpper) ||
        normalized.includes(chainShortUpper) ||
        chainNameUpper.includes(normalized) ||
        chainShortUpper.includes(normalized)
      ) {
        return true;
      }
    }
    // 3. Check Chain ID for EVM chains
    if (typeof chainIdOrId === "number" && chain.chainId) {
      if (chain.chainId.mainnet === chainIdOrId || chain.chainId.testnet === chainIdOrId) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Normalizes and guards URL paths to prevent double slashes or missing protocols
 */
function cleanUrl(url: string | undefined): string {
  if (!url) return "#";
  try {
    // Support relative placeholder links like "#"
    if (url === "#") return "#";
    // Check if it's missing the protocol
    let validated = url;
    if (!/^https?:\/\//i.test(validated)) {
      validated = "https://" + validated;
    }
    // Ensure trailing duplicates or double slashes inside the path (excluding protocol) are normalized
    const protocolPart = validated.match(/^https?:\/\//i)?.[0] || "";
    const pathPart = validated.substring(protocolPart.length).replace(/\/+/g, "/");
    return protocolPart + pathPart;
  } catch {
    return url || "#";
  }
}

/**
 * Gets the Blockscout API key from env variables
 */
export function getBlockscoutApiKey(): string {
  try {
    return (import.meta as any).env?.VITE_BLOCKSCOUT_API_KEY || "";
  } catch {
    return "";
  }
}

/**
 * Maps standard chain IDs or keys to Blockscout subdomains
 */
export function getBlockscoutSubdomain(
  chainIdOrId: number | string | undefined,
  network: "mainnet" | "testnet" = "mainnet"
): string | undefined {
  if (chainIdOrId === undefined) return undefined;

  const inputUpper = typeof chainIdOrId === "string" ? chainIdOrId.toUpperCase().trim() : "";

  // Mapping of chain tokens or ids to blockscout mainnet/testnet subdomains
  const mappings: Record<string, { mainnet: string; testnet: string }> = {
    ETH: { mainnet: "eth", testnet: "eth-sepolia" },
    BASE: { mainnet: "base", testnet: "base-sepolia" },
    ARBITRUM: { mainnet: "arbitrum", testnet: "arbitrum-sepolia" },
    OPTIMISM: { mainnet: "optimism", testnet: "optimism-sepolia" },
    POLYGON: { mainnet: "polygon", testnet: "polygon-amoy" },
    BSC: { mainnet: "bsc", testnet: "bsc-testnet" },
    AVAX: { mainnet: "avax", testnet: "avax-fuji" },
    LINEA: { mainnet: "linea", testnet: "linea-sepolia" },
    ZKSYNC: { mainnet: "zksync", testnet: "zksync-sepolia" },
    SCROLL: { mainnet: "scroll", testnet: "scroll-sepolia" },
    BLAST: { mainnet: "blast", testnet: "blast-sepolia" },
    MANTLE: { mainnet: "mantle", testnet: "mantle-sepolia" },
    MODE: { mainnet: "mode", testnet: "mode-sepolia" },
    OPBNB: { mainnet: "opbnb", testnet: "opbnb-testnet" },
    BERACHAIN: { mainnet: "berachain", testnet: "berachain-bartio" },
    SONIC: { mainnet: "sonic", testnet: "sonic-testnet" },
    UNICHAIN: { mainnet: "unichain", testnet: "unichain-sepolia" },
    WORLD: { mainnet: "world", testnet: "world-sepolia" },
  };

  if (inputUpper && mappings[inputUpper]) {
    return network === "testnet" ? mappings[inputUpper].testnet : mappings[inputUpper].mainnet;
  }

  // Map by chainId numbers
  const chainIdMappings: Record<number, { mainnet: string; testnet: string }> = {
    1: mappings.ETH,
    11155111: mappings.ETH,
    8453: mappings.BASE,
    84532: mappings.BASE,
    42161: mappings.ARBITRUM,
    421614: mappings.ARBITRUM,
    10: mappings.OPTIMISM,
    11155420: mappings.OPTIMISM,
    137: mappings.POLYGON,
    80002: mappings.POLYGON,
    56: mappings.BSC,
    97: mappings.BSC,
    43114: mappings.AVAX,
    43113: mappings.AVAX,
    59144: mappings.LINEA,
    59141: mappings.LINEA,
    324: mappings.ZKSYNC,
    300: mappings.ZKSYNC,
    534352: mappings.SCROLL,
    534351: mappings.SCROLL,
    81457: mappings.BLAST,
    168587773: mappings.BLAST,
    5000: mappings.MANTLE,
    5003: mappings.MANTLE,
    34443: mappings.MODE,
    919: mappings.MODE,
    204: mappings.OPBNB,
    5611: mappings.OPBNB,
    80002480: mappings.WORLD, // fallback composite check
    80094: mappings.BERACHAIN,
    80084: mappings.BERACHAIN,
    146: mappings.SONIC,
    57054: mappings.SONIC,
    130: mappings.UNICHAIN,
    1301: mappings.UNICHAIN,
    480: mappings.WORLD,
    4801: mappings.WORLD,
  };

  const parsedId = typeof chainIdOrId === "number" ? chainIdOrId : parseInt(String(chainIdOrId), 10);
  if (!isNaN(parsedId) && chainIdMappings[parsedId]) {
    return network === "testnet" ? chainIdMappings[parsedId].testnet : chainIdMappings[parsedId].mainnet;
  }

  return undefined;
}

/**
 * Resolves explorer transaction link matching mainnet or testnet
 */
export function getExplorerTxUrl(
  chainIdOrId: number | string | undefined,
  txHash: string = "",
  network: "mainnet" | "testnet" = "mainnet"
): string {
  const subdomain = getBlockscoutSubdomain(chainIdOrId, network);
  const apiKey = getBlockscoutApiKey();
  const apiKeyQuery = apiKey ? `?apikey=${apiKey}` : "";

  if (subdomain) {
    if (!txHash) {
      return cleanUrl(`https://${subdomain}.blockscout.com${apiKeyQuery}`);
    }
    return cleanUrl(`https://${subdomain}.blockscout.com/tx/${txHash}${apiKeyQuery}`);
  }

  const chain = findChainMetadata(chainIdOrId);
  if (!chain) {
    return cleanUrl(txHash ? `https://blockchair.com/search?q=${txHash}` : "https://blockchair.com");
  }

  const paths = network === "testnet" && chain.testnetSupport ? chain.explorers.testnet : chain.explorers.mainnet;
  const rawUrl = txHash 
    ? paths.tx.replace("{tx}", txHash).replace("{address}", txHash)
    : paths.tx.replace("/tx/{tx}", "").replace("{tx}", "").replace("{address}", "");
  return cleanUrl(rawUrl);
}

/**
 * Resolves explorer address link matching mainnet or testnet
 */
export function getExplorerAddressUrl(
  chainIdOrId: number | string | undefined,
  address: string = "",
  network: "mainnet" | "testnet" = "mainnet"
): string {
  const subdomain = getBlockscoutSubdomain(chainIdOrId, network);
  const apiKey = getBlockscoutApiKey();
  const apiKeyQuery = apiKey ? `?apikey=${apiKey}` : "";

  if (subdomain) {
    if (!address) {
      return cleanUrl(`https://${subdomain}.blockscout.com${apiKeyQuery}`);
    }
    return cleanUrl(`https://${subdomain}.blockscout.com/address/${address}${apiKeyQuery}`);
  }

  const chain = findChainMetadata(chainIdOrId);
  if (!chain) {
    return cleanUrl(address ? `https://blockchair.com/search?q=${address}` : "https://blockchair.com");
  }

  const paths = network === "testnet" && chain.testnetSupport ? chain.explorers.testnet : chain.explorers.mainnet;
  const rawUrl = address 
    ? paths.address.replace("{address}", address)
    : paths.address.replace("/address/{address}", "").replace("{address}", "");
  return cleanUrl(rawUrl);
}

/**
 * Resolves explorer token contract URL
 */
export function getExplorerTokenUrl(
  chainIdOrId: number | string | undefined,
  tokenAddress: string,
  network: "mainnet" | "testnet" = "mainnet"
): string {
  if (!tokenAddress) return "#";
  const subdomain = getBlockscoutSubdomain(chainIdOrId, network);
  const apiKey = getBlockscoutApiKey();
  const apiKeyQuery = apiKey ? `?apikey=${apiKey}` : "";

  if (subdomain) {
    return cleanUrl(`https://${subdomain}.blockscout.com/token/${tokenAddress}${apiKeyQuery}`);
  }

  const chain = findChainMetadata(chainIdOrId);
  if (!chain) {
    return cleanUrl(`https://blockchair.com/search?q=${tokenAddress}`);
  }

  const paths = network === "testnet" && chain.testnetSupport ? chain.explorers.testnet : chain.explorers.mainnet;
  const rawUrl = (paths.token || paths.address).replace("{token}", tokenAddress).replace("{address}", tokenAddress);
  return cleanUrl(rawUrl);
}

/**
 * Resolves explorer block URL
 */
export function getExplorerBlockUrl(
  chainIdOrId: number | string | undefined,
  blockNumber: number | string,
  network: "mainnet" | "testnet" = "mainnet"
): string {
  if (!blockNumber) return "#";
  const subdomain = getBlockscoutSubdomain(chainIdOrId, network);
  const apiKey = getBlockscoutApiKey();
  const apiKeyQuery = apiKey ? `?apikey=${apiKey}` : "";

  if (subdomain) {
    return cleanUrl(`https://${subdomain}.blockscout.com/block/${blockNumber}${apiKeyQuery}`);
  }

  const chain = findChainMetadata(chainIdOrId);
  if (!chain) {
    return "#";
  }

  const paths = network === "testnet" && chain.testnetSupport ? chain.explorers.testnet : chain.explorers.mainnet;
  const rawUrl = (paths.block || paths.address).replace("{block}", String(blockNumber)).replace("{address}", String(blockNumber));
  return cleanUrl(rawUrl);
}
