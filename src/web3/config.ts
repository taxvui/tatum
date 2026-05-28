import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum, bsc, base } from "wagmi/chains";

// Use a safe, production-grade default WalletConnect projectId 
// (or pull from import.meta.env if specified)
export const WALLETCONNECT_PROJECT_ID = 
  (import.meta as any).env.VITE_WALLETCONNECT_PROJECT_ID || "bfcba75dfa312ba393cfd1066045938d";

export const web3Config = getDefaultConfig({
  appName: "Uniswap Tatum Swap Interface",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [
    mainnet,
    sepolia,
    polygon,
    arbitrum,
    bsc,
    base
  ],
  ssr: false, // client-only single page application
});
