/**
 * Solid utility to convert IPFS paths, URIs and unstable CID gateway endpoints
 * into reliable public gateways for production Vercel + React 19 builds.
 */

// Stable public IPFS gateways (ordered by speed and reliability in 2026)
export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://w3s.link/ipfs/"
];

/**
 * Converts any IPFS URI (e.g., ipfs://CID/path), IPNS URI, or broken legacy cloudflare-ipfs
 * link into a clean, stable public gateway URL.
 * 
 * @param url The input string or URI
 * @returns Cleaned HTTPS URL or original if no transformation is applicable or valid.
 */
export function convertIpfsUri(url: string | null | undefined): string {
  if (!url) return "";
  
  let trimmed = url.trim();
  if (!trimmed) return "";

  // 1. If it's already a gateway using the deprecated, unstable cloudflare-ipfs, swap it out
  if (trimmed.includes("cloudflare-ipfs.com/ipfs/")) {
    trimmed = trimmed.replace("cloudflare-ipfs.com/ipfs/", "ipfs.io/ipfs/");
  } else if (trimmed.includes("cloudflare-ipfs.com/ipns/")) {
    trimmed = trimmed.replace("cloudflare-ipfs.com/ipns/", "ipfs.io/ipns/");
  }

  // 2. Handle native "ipfs://" URIs
  if (trimmed.startsWith("ipfs://")) {
    const rawHash = trimmed.substring(7); // strip "ipfs://"
    // Verify that the hash doesn't start with "ipfs/" itself
    const cleanHash = rawHash.startsWith("ipfs/") ? rawHash.substring(5) : rawHash;
    return `https://ipfs.io/ipfs/${cleanHash}`;
  }

  // 3. Handle native "ipns://" URIs
  if (trimmed.startsWith("ipns://")) {
    const rawHash = trimmed.substring(7);
    const cleanHash = rawHash.startsWith("ipns/") ? rawHash.substring(5) : rawHash;
    return `https://ipfs.io/ipns/${cleanHash}`;
  }

  // 4. Handle naked IPFS CID matching (either v0 Qm... or v1 bafy...)
  const isCidV0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?$/.test(trimmed);
  const isCidV1 = /^bafy[a-z0-9]{55}(\/.*)?$/.test(trimmed);
  if (isCidV0 || isCidV1) {
    return `https://ipfs.io/ipfs/${trimmed}`;
  }

  // 5. If it looks like a generic URL already, return it
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Return original as safe fallback
  return trimmed;
}

/**
 * High-performance fallback image helper for tokens, coins, and NFTs.
 * If the image fails to load, returns a placeholder with standard visual branding.
 */
export const TOKEN_LOGO_FALLBACK = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png";
export const GENERAL_COIN_FALLBACK = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png";
