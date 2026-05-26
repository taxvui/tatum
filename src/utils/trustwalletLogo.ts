// Mapping for Native Blockchains in Trust Wallet Assets Repository
const NATIVE_CHAINS_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "smartchain",
  SOL: "solana",
  TRX: "tron",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "doge",
  LTC: "litecoin",
  DOT: "polkadot",
  POL: "polygon",
  MATIC: "polygon",
  AVAX: "avalanchec",
  FTM: "fantom",
  CELO: "celo",
  NEAR: "near",
  SUI: "sui",
  APT: "aptos",
  CRO: "cronos",
  ATOM: "cosmos",
  ETC: "classic",
  XTZ: "tezos",
  FLOW: "flow",
  ALGO: "algorand",
  VET: "vechain",
  FIL: "filecoin",
  XLM: "stellar",
  EOS: "eos",
  EGLD: "elrond",
  THETA: "theta",
  STX: "stacks",
  KAVA: "kava",
  EVMOS: "evmos",
  ONE: "harmony",
  GLMR: "moonbeam",
  MOVR: "moonriver",
  ASTR: "astar",
  AURORA: "aurora",
  BOBA: "boba",
  METIS: "metis",
  ZIL: "zilliqa",
  WAVES: "waves",
  ZEC: "zcash",
  XMR: "monero",
  XNO: "nano",
  NANO: "nano",
  DCR: "decred",
  RVN: "ravencoin",
  QTUM: "qtum",
  BCH: "bitcoincash",
};

// Mapping of highly popular ERC-20 / BEP-20 / SPL tokens to their contract paths in Trust Wallet Assets
const POPULAR_TOKENS_MAP: Record<string, string> = {
  USDT: "ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7",
  USDC: "ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  SHIB: "ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  LINK: "ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA",
  UNI: "ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  WBTC: "ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  DAI: "ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F",
  PEPE: "ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  LDO: "ethereum/assets/0x5A98Fc31D643d204c514b82585B10551161F5D18",
  IMX: "ethereum/assets/0xF57eEF011DE5b8303227A2999b48618916A7d15e",
  AAVE: "ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  GRT: "ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
  MKR: "ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  SAND: "ethereum/assets/0x3845badFc2D69B62610c44F137449B27588b0f15",
  MANA: "ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
  QNT: "ethereum/assets/0x4a220E6096B234DB62E5679C81516B2FD7ABDEa5",
  RNDR: "ethereum/assets/0x6De037ef9e8444b7C8598696b7Ad9979b1298d09",
  LRC: "ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD"  ,
  "1INCH": "ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302",
  BAT: "ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
  ENJ: "ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
  CAKE: "smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  BUSD: "smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  JUP: "solana/assets/JUPyiZJSUURACZ92LN2puz6p6997B0 (example)", // Fallback used if wrong
};

/**
 * Returns the Trust Wallet Assets CDN logo link for a cryptocurrency symbol.
 * Defaults to the coin's mainnet folder wrapper if found.
 */
export function getTrustWalletLogoUrl(symbol: string): string | null {
  const cleanSym = symbol.trim().toUpperCase();

  // 1st Check: Native chain info logo
  if (NATIVE_CHAINS_MAP[cleanSym]) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${NATIVE_CHAINS_MAP[cleanSym]}/info/logo.png`;
  }

  // 2nd Check: Popular structured tokens map
  if (POPULAR_TOKENS_MAP[cleanSym]) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${POPULAR_TOKENS_MAP[cleanSym]}/logo.png`;
  }

  return null;
}

/**
 * Get direct blockchain info folder logo
 */
export function getTrustWalletChainLogoUrl(chainSymbolOrId: string): string {
  const norm = chainSymbolOrId.trim().toUpperCase();
  const folder = NATIVE_CHAINS_MAP[norm] || norm.toLowerCase();
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${folder}/info/logo.png`;
}
