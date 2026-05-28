import { ChainConfig } from "./types";
import { CHAINS_METADATA } from "./config/chains";

export const SUPPORTED_CHAINS: ChainConfig[] = CHAINS_METADATA.map((chain) => ({
  id: chain.id,
  name: chain.name,
  symbol: chain.symbol,
  color: chain.color,
  bgGrad: chain.bgGrad,
  hasXpub: chain.hasXpub,
  testnetSupport: chain.testnetSupport,
  path: chain.path,
  desc: chain.desc,
  category: chain.category,
  isCoreSupported: chain.isCoreSupported ?? false,
  explorers: {
    mainnet: chain.explorers.mainnet.address,
    testnet: chain.explorers.testnet.address,
  },
  faucets: chain.faucets || []
}));
