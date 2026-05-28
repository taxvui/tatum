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
 * Resolves explorer transaction link matching mainnet or testnet
 */
export function getExplorerTxUrl(
  chainIdOrId: number | string | undefined,
  txHash: string = "",
  network: "mainnet" | "testnet" = "mainnet"
): string {
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
  const chain = findChainMetadata(chainIdOrId);

  if (!chain) {
    return "#";
  }

  const paths = network === "testnet" && chain.testnetSupport ? chain.explorers.testnet : chain.explorers.mainnet;
  const rawUrl = (paths.block || paths.address).replace("{block}", String(blockNumber)).replace("{address}", String(blockNumber));
  return cleanUrl(rawUrl);
}
