export interface WalletData {
  id: string;
  chain: string;
  network: "mainnet" | "testnet";
  mnemonic?: string;
  xpub?: string;
  address?: string; // Solana directly
  privateKey?: string; // Solana directly
  createdAt: string;
  note?: string;
  isSimulated?: boolean;
}

export interface DerivedKeypair {
  index: number;
  address: string;
  privateKey?: string;
  isSimulated?: boolean;
}

export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  color: string;
  bgGrad: string;
  hasXpub: boolean;
  testnetSupport: boolean;
  path: string;
  desc: string;
  category?: "EVM" | "UTXO" | "L2" | "Non-EVM" | "Meme/Alt";
  isCoreSupported?: boolean; // True for chains with active direct wallet generation endpoints in our backend proxy.
  explorers?: {
    mainnet: string; // Url with {address} placeholder
    testnet: string; // Url with {address} placeholder
  };
  faucets?: string[]; // Array of faucet url links
}

export interface CmcCryptoQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface CmcCryptoAsset {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  cmc_rank: number;
  last_updated: string;
  quote: {
    [currency: string]: CmcCryptoQuote;
  };
}

export interface CmcGlobalMetrics {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  eth_dominance: number;
  btc_dominance: number;
  eth_dominance_yesterday: number;
  btc_dominance_yesterday: number;
  quote: {
    [currency: string]: {
      total_market_cap: number;
      total_market_cap_yesterday: number;
      total_market_cap_yesterday_percentage_change: number;
      total_volume_24h: number;
      total_volume_24h_yesterday: number;
      total_volume_24h_yesterday_percentage_change: number;
      last_updated: string;
    }
  };
}

