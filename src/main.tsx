import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { web3Config } from "./web3/config";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App.tsx";

// Import CSS styled templates for Web3 Wallets & Connect modals
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

// Configure react-query client with automatic garbage collection and safety parameters
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={web3Config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider 
            theme={darkTheme({
              accentColor: "#db2777", // pink-600 to match Uniswap theme
              borderRadius: "medium",
            })}
          >
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </StrictMode>
);
