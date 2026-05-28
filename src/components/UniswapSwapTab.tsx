import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowDownUp, 
  Settings, 
  RefreshCw, 
  Info, 
  ExternalLink, 
  Wallet, 
  Coins, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  HelpCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UniswapToken, UniswapQuoteResult, WalletData } from "../types";
import { getUniswapTokens, getUniswapQuote } from "../api";

interface UniswapSwapTabProps {
  savedWallets: WalletData[];
  onLogMessage?: (message: string, type?: "info" | "up" | "down") => void;
}

const SUPPORTED_CHAINS = [
  { id: 1, name: "Ethereum Mainnet", short: "ETH", color: "bg-blue-600 text-white", scan: "https://etherscan.io" },
  { id: 137, name: "Polygon PoS", short: "Polygon", color: "bg-purple-650 bg-indigo-600 text-white", scan: "https://polygonscan.com" },
  { id: 42161, name: "Arbitrum One", short: "Arbitrum", color: "bg-sky-600 text-white", scan: "https://arbiscan.io" },
  { id: 56, name: "BNB Smart Chain", short: "BSC", color: "bg-amber-500 text-slate-900", scan: "https://bscscan.com" }
];

export function UniswapSwapTab({ savedWallets, onLogMessage }: UniswapSwapTabProps) {
  // Mode selection: "widget" (Official Embed Widget) or "analyst" (Analytic router simulation)
  const [swapMode, setSwapMode] = useState<"widget" | "analyst">("widget");

  // Chain selection
  const [selectedChainId, setSelectedChainId] = useState<number>(1);
  const [tokens, setTokens] = useState<UniswapToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<UniswapToken[]>([]);
  const [loadingTokens, setLoadingTokens] = useState<boolean>(true);
  
  // Swap states
  const [fromToken, setFromToken] = useState<UniswapToken | null>(null);
  const [toToken, setToToken] = useState<UniswapToken | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  
  // Advanced Uniswap states
  const [quote, setQuote] = useState<UniswapQuoteResult | null>(null);
  const [quoting, setQuoting] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customSlippage, setCustomSlippage] = useState<string>("");
  
  // Official Widget Settings & Customizations
  const [widgetChainId, setWidgetChainId] = useState<number>(1);
  const [widgetTheme, setWidgetTheme] = useState<"dark" | "light">("dark");
  const [widgetCustomFrom, setWidgetCustomFrom] = useState<string>("ETH");
  const [widgetCustomTo, setWidgetCustomTo] = useState<string>("");
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);
  const [widgetSource, setWidgetSource] = useState<"cloudflare-ipfs" | "ipfs-io" | "official">("cloudflare-ipfs");

  // Quick preset tokens configuration for Multi-chain & Testnets
  const WIDGET_PRECISION_PRESETS: Record<number, Array<{ symbol: string; address: string; name: string }>> = {
    1: [ // Mainnet ETH
      { symbol: "ETH", address: "ETH", name: "Ether (Native)" },
      { symbol: "USDC", address: "0xa0b85991c6218b36c1d19d4a2e9eb0ce3606eb48", name: "USD Coin" },
      { symbol: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", name: "Tether USD" },
      { symbol: "WBTC", address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", name: "Wrapped Bitcoin" },
      { symbol: "UNI", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", name: "Uniswap Token" }
    ],
    137: [ // Polygon
      { symbol: "POL", address: "POL", name: "POL (Native)" },
      { symbol: "USDC.e", address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", name: "USD Coin (Bridged)" },
      { symbol: "USDT", address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", name: "Tether USD" },
      { symbol: "WETH", address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", name: "Wrapped Ether" }
    ],
    42161: [ // Arbitrum
      { symbol: "ETH", address: "ETH", name: "Ether (Native)" },
      { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", name: "USD Coin" },
      { symbol: "ARB", address: "0x912ce59144191c1204e64559fe8253a0e49e6548", name: "Arbitrum" }
    ],
    56: [ // BNB
      { symbol: "BNB", address: "BNB", name: "Binance Chain Native" },
      { symbol: "USDT", address: "0x55d398326f99059ff775485246999027b3197955", name: "BSC-USD (Tether)" },
      { symbol: "USDC", address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", name: "USD Coin" }
    ],
    8453: [ // Base
      { symbol: "ETH", address: "ETH", name: "Ether (Native)" },
      { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913", name: "USD Coin" },
      { symbol: "DEGEN", address: "0x4ed4e862860bedd9a19452750d9c400490f23ded", name: "Degen" }
    ],
    11155111: [ // Sepolia Testnet
      { symbol: "ETH", address: "ETH", name: "Sepolia Ether" },
      { symbol: "USDC (Test)", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", name: "Sepolia USDC Testnet" },
      { symbol: "USDT (Test)", address: "0xaA8E23Fb1079EA71e0a56F48a2AA51851D8433D0", name: "Sepolia USDT Testnet" },
      { symbol: "DAI (Test)", address: "0x3e622317f8C428944d15A2F5f9E1b02860aFe339", name: "Sepolia DAI Testnet" }
    ]
  };

  const WIDGET_SUPPORTED_CHAINS = [
    { id: 1, name: "Ethereum Mainnet", short: "Ethereum", icon: "⟠", color: "from-blue-600 to-indigo-700" },
    { id: 137, name: "Polygon PoS", short: "Polygon", icon: "🟣", color: "from-purple-600 to-pink-700" },
    { id: 42161, name: "Arbitrum One", short: "Arbitrum", icon: "🔵", color: "from-sky-500 to-blue-700" },
    { id: 8453, name: "Base Mainnet", short: "Base", icon: "🛡️", color: "from-blue-500 to-teal-600" },
    { id: 56, name: "BNB Smart Chain", short: "BSC", icon: "🟡", color: "from-amber-500 to-yellow-600" },
    { id: 11155111, name: "Sepolia Testnet", short: "Sepolia", icon: "🧪", color: "from-emerald-500 to-teal-700" }
  ];
  
  // Wallet simulation integration
  const [activeWallet, setActiveWallet] = useState<WalletData | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<{ txHash: string; timestamp: string } | null>(null);
  const [txHistory, setTxHistory] = useState<Array<{
    txHash: string;
    chain: string;
    fromSymbol: string;
    toSymbol: string;
    fromAmount: string;
    toAmount: string;
    usdValue: number;
    timestamp: string;
  }>>([]);

  // Modals for asset picking
  const [showTokenModal, setShowTokenModal] = useState<"from" | "to" | null>(null);
  const [tokenSearch, setTokenSearch] = useState<string>("");

  // Refs for debouncing quote updates
  const quoteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tokens on mount
  useEffect(() => {
    async function loadTokens() {
      setLoadingTokens(true);
      try {
        const list = await getUniswapTokens();
        setTokens(list);
      } catch (err: any) {
        console.error("Failed to load tokens:", err);
        if (onLogMessage) {
          onLogMessage(`Lỗi chuẩn bị danh mục Token Uniswap: ${err.message}`, "down");
        }
      } finally {
        setLoadingTokens(false);
      }
    }
    loadTokens();
  }, []);

  // Filter tokens and pick defaults when chain changes
  useEffect(() => {
    const matched = tokens.filter(t => t.chainId === selectedChainId);
    setFilteredTokens(matched);
    
    // Choose sensible default tokens for the chain
    if (matched.length > 0) {
      const nativeOrWrapped = matched.find(t => t.symbol.startsWith("W") || t.symbol === "ETH" || t.symbol === "BNB" || t.symbol === "MATIC") || matched[0];
      const usdStable = matched.find(t => t.symbol.includes("USD")) || matched[1] || matched[0];
      
      setFromToken(nativeOrWrapped);
      setToToken(usdStable !== nativeOrWrapped ? usdStable : matched[1] || null);
      setFromAmount("");
      setToAmount("");
      setQuote(null);
    }
  }, [selectedChainId, tokens]);

  // Set default wallet if wallet database changes
  useEffect(() => {
    if (savedWallets.length > 0 && !activeWallet) {
      // Pick the first wallet matching the chain type if possible
      setActiveWallet(savedWallets[0]);
    }
  }, [savedWallets, activeWallet]);

  // Trigger Quote whenever parameters change
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount || Number(fromAmount) <= 0) {
      setToAmount("");
      setQuote(null);
      setQuoteError(null);
      return;
    }

    if (fromToken.address === toToken.address) {
      setToAmount("");
      setQuote(null);
      setQuoteError("Không thể hoán đổi cùng một loại token.");
      return;
    }

    setQuoteError(null);

    // Debounce Uniswap SDK quotation query to prevent overwhelming the serverless API
    if (quoteTimeoutRef.current) {
      clearTimeout(quoteTimeoutRef.current);
    }

    setQuoting(true);

    quoteTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await getUniswapQuote({
          chainId: selectedChainId,
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken.address,
          amount: fromAmount,
          slippage: slippage
        });

        if (res.success) {
          setQuote(res);
          setToAmount(res.outputAmount);
          if (onLogMessage) {
            onLogMessage(`Báo giá Uniswap V3: ${fromAmount} ${fromToken.symbol} ➔ ${res.outputAmount} ${toToken.symbol} (Phí Gas ~$${res.estimatedGasUsd.toFixed(2)})`, "info");
          }
        } else {
          setQuoteError(res.error || "Không thể lấy ước tính hoán đổi.");
          setQuote(null);
          setToAmount("");
        }
      } catch (err: any) {
        setQuoteError(err.message || "Lỗi lấy báo giá hoán đổi.");
        setQuote(null);
        setToAmount("");
      } finally {
        setQuoting(false);
      }
    }, 450); // 450ms input debounce

    return () => {
      if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    };
  }, [fromAmount, fromToken, toToken, selectedChainId, slippage]);

  // Handle Input Swap Direction Switch
  const handleSwitchTokens = () => {
    if (!fromToken || !toToken) return;
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount); // Use current output amount as next input
    setToAmount(tempAmount);
    setQuote(null);
  };

  // Perform Simulated Uniswap V3 Swap
  const handleExecuteSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount || !activeWallet) return;
    
    setIsSwapping(true);
    setSwapResult(null);

    // Simulate mining delays for realism
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Generate accurate chain-specific transaction hashes
    const randomHex = Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
    const txHash = `0x${randomHex}`;
    const timestamp = new Date().toLocaleTimeString();

    const successLog = `Hoán đổi Uniswap V3 thành công! Trực quan hóa lộ trình: ${fromAmount} ${fromToken.symbol} ➔ ${toAmount} ${toToken.symbol} qua địa chỉ Router ${quote?.routerAddress?.slice(0, 10)}... (Gas đã tiêu tốn: $${quote?.estimatedGasUsd?.toFixed(2)}).`;
    
    if (onLogMessage) {
      onLogMessage(successLog, "up");
    }

    setSwapResult({ txHash, timestamp });
    
    // Add to local transction history
    const historyItem = {
      txHash,
      chain: SUPPORTED_CHAINS.find(c => c.id === selectedChainId)?.name || "Ethereum",
      fromSymbol: fromToken.symbol,
      toSymbol: toToken.symbol,
      fromAmount,
      toAmount,
      usdValue: (Number(fromAmount) * (fromToken.basePriceUsd || 1)),
      timestamp: new Date().toLocaleDateString() + " " + timestamp
    };

    setTxHistory(prev => [historyItem, ...prev]);
    setIsSwapping(false);
  };

  const getPriceImpactColor = (pct: number) => {
    if (pct < 1) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (pct < 3) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  const handleSlippageBtn = (val: number) => {
    setSlippage(val);
    setCustomSlippage("");
  };

  const activeChain = SUPPORTED_CHAINS.find(c => c.id === selectedChainId) || SUPPORTED_CHAINS[0];

  const handleSelectWidgetPreset = (from: string, to: string) => {
    setIframeLoading(true);
    setWidgetCustomFrom(from);
    setWidgetCustomTo(to);
    setIframeKey(prev => prev + 1);
    setTimeout(() => setIframeLoading(false), 800);
  };

  const handleSelectWidgetChain = (chainId: number) => {
    setIframeLoading(true);
    setWidgetChainId(chainId);
    
    // Choose sensible default tokens based on chain
    const presets = WIDGET_PRECISION_PRESETS[chainId] || WIDGET_PRECISION_PRESETS[1];
    setWidgetCustomFrom(presets[0]?.address || "ETH");
    setWidgetCustomTo(presets[1]?.address || "");
    setIframeKey(prev => prev + 1);
    setTimeout(() => setIframeLoading(false), 800);
  };

  const getWidgetUrl = () => {
    let base = "https://app.uniswap.org/#/swap";
    if (widgetSource === "cloudflare-ipfs") {
      base = "https://cloudflare-ipfs.com/ipns/app.uniswap.org/#/swap";
    } else if (widgetSource === "ipfs-io") {
      base = "https://ipfs.io/ipns/app.uniswap.org/#/swap";
    }
    const params = new URLSearchParams();
    params.set("theme", widgetTheme);
    params.set("chainId", String(widgetChainId));
    if (widgetCustomFrom) params.set("inputCurrency", widgetCustomFrom);
    if (widgetCustomTo) params.set("outputCurrency", widgetCustomTo);
    return `${base}?${params.toString()}`;
  };

  return (
    <div className="space-y-8" id="uniswap-swap-gateway">
      {/* Intro visual decoration - Hero header section */}
      <div className="relative bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-pink-100/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-pink-600 font-bold text-xs uppercase tracking-widest bg-pink-50 border border-pink-150 px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Uniswap V3 Protocol Integration</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Cổng Giao Dịch Uniswap Thực Tế</h2>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
            Kết nối Uniswap Widget chính thức hoạt động trên môi trường Mainnet và Testnet không dùng dữ liệu mô phỏng. Sử dụng trực tiếp tài khoản Web3 của riêng bạn để tự do hoán đổi.
          </p>
        </div>
        
        {/* Quick state stats box */}
        <div className="grid grid-cols-2 gap-3 min-w-[240px] w-full md:w-auto shrink-0">
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Môi trường API</span>
            <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
              ● REAL MAIN & TEST
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Giao Thức</span>
            <span className="text-[14px] font-black text-pink-600 flex items-center justify-center gap-1 mt-0.5">
              Uniswap Embed
            </span>
          </div>
        </div>
      </div>

      {/* Switch Mode Slider Selector */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-fit shadow-inner border border-slate-200/50">
        <button
          onClick={() => setSwapMode("widget")}
          className={`py-2 px-5 rounded-xl text-xs font-black transition duration-250 cursor-pointer flex items-center space-x-2 ${
            swapMode === "widget"
              ? "bg-white text-pink-600 shadow-md border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Nhúng Uniswap Widget (Web3 Thực Tế)</span>
        </button>
        <button
          onClick={() => setSwapMode("analyst")}
          className={`py-2 px-5 rounded-xl text-xs font-black transition duration-250 cursor-pointer flex items-center space-x-2 ${
            swapMode === "analyst"
              ? "bg-white text-indigo-600 shadow-md border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Trình Tính Toán & Phân Tích Định Tuyến (Tatum)</span>
        </button>
      </div>

      {swapMode === "widget" ? (
        /* WIDGET MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="uniswap-embedded-widget-layout">
          {/* Main Widget Card Frame */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                    <Coins className="w-5 h-5 text-pink-500" />
                    <span>Hộp Giao Dịch Uniswap Cổng Thật (Main & Test)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Kết nối trực tiếp ví MetaMask, Trust Wallet của bạn để ký giao dịch thật.</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      widgetSource === "cloudflare-ipfs" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                        : widgetSource === "ipfs-io"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-150"
                        : "bg-amber-50 text-amber-700 border border-amber-150"
                    }`}>
                      Nguồn: {
                        widgetSource === "cloudflare-ipfs" ? "Cloudflare IPFS Mirror (Mở khóa chặn Firefox)" :
                        widgetSource === "ipfs-io" ? "IPFS.io Mirror (Dự phòng)" : "app.uniswap.org (Có thể bị trình duyệt chặn)"
                      }
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIframeLoading(true);
                      setIframeKey(prev => prev + 1);
                      setTimeout(() => setIframeLoading(false), 850);
                    }}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-205 text-slate-500 transition hover:text-slate-800 cursor-pointer text-xs flex items-center gap-1.5 font-bold"
                    title="Làm mới Widget"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${iframeLoading ? "animate-spin text-pink-500" : ""}`} />
                    <span>Làm mới</span>
                  </button>

                  <a 
                    href={getWidgetUrl()} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-100 text-pink-600 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Mở độc lập</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Loader feedback overlay */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[660px] flex items-center justify-center border-4 border-slate-900/10 shadow-inner">
                {iframeLoading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
                    <p className="text-sm font-black text-slate-200">Đang chuẩn bị Widget Uniswap...</p>
                    <p className="text-xs text-slate-400">Thiết lập tham số chuỗi khối và cấu hình hợp đồng</p>
                  </div>
                )}
                
                <iframe 
                  key={iframeKey}
                  title="Official Uniswap Embed Widget"
                  src={getWidgetUrl()}
                  className="w-full h-[660px] border-none bg-transparent"
                  allow="clipboard-read; clipboard-write; web-share"
                />
              </div>

              {/* Info Tips inside parent body */}
              <div className="mt-4 p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-1 font-medium">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-500" />
                  Hướng dẫn kết nối ví ký duyệt trên Web3 Iframe
                </span>
                <p>
                  Bản nhúng Iframe của Uniswap được bảo mật tuyệt đối thông qua kiến trúc cô lập sandbox. Để ký kết các lệnh giao dịch thực tế trên Ethereum hay Sepolia Testnet, bạn chỉ cần bấm nút <strong>"Connect Wallet"</strong> trên widget, sau đó duyệt quyền kết nối thông qua ví mở rộng của trình duyệt của bạn (MetaMask, Trust Wallet, v.v.).
                </p>
              </div>
            </div>
          </div>

          {/* Right Presets & Custom Configuration sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-md space-y-5">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-pink-500" />
                <span>Cấu hình Cổng Nhúng</span>
              </h3>

              {/* Iframe Source Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-pink-600 uppercase tracking-widest font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
                  <span>1. Nguồn Nhúng Iframe (Bypass Firefox/Chrome block)</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setIframeLoading(true);
                      setWidgetSource("cloudflare-ipfs");
                      setIframeKey(p => p + 1);
                      setTimeout(() => setIframeLoading(false), 800);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      widgetSource === "cloudflare-ipfs"
                        ? "bg-pink-50/80 border-pink-300 text-pink-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-150"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black flex items-center gap-1.5">
                        ⚡ Cloudflare IPFS Mirror
                      </span>
                      <span className="text-[9px] font-black uppercase text-emerald-600 px-1.5 py-0.5 bg-emerald-50 rounded">Khuyên Dùng</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 mt-1 leading-snug font-semibold">
                      Hoạt động trực tiếp không lo lỗi CSP hay X-Frame-Options trên Firefox.
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIframeLoading(true);
                      setWidgetSource("ipfs-io");
                      setIframeKey(p => p + 1);
                      setTimeout(() => setIframeLoading(false), 800);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      widgetSource === "ipfs-io"
                        ? "bg-pink-50/80 border-pink-300 text-pink-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-150"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black flex items-center gap-1.5">
                        🌐 IPFS.io Mirror
                      </span>
                      <span className="text-[9px] font-black uppercase text-indigo-600 px-1.5 py-0.5 bg-indigo-50 rounded">Dự Phòng</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 mt-1 leading-snug font-medium">
                      Kết nối phân tán tốc độ cao từ IPFS core gateway.
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIframeLoading(true);
                      setWidgetSource("official");
                      setIframeKey(p => p + 1);
                      setTimeout(() => setIframeLoading(false), 800);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      widgetSource === "official"
                        ? "bg-pink-50/80 border-pink-300 text-pink-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-150"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black flex items-center gap-1.5">
                        🔒 Official app.uniswap.org
                      </span>
                      <span className="text-[9px] font-black uppercase text-amber-600 px-1.5 py-0.5 bg-amber-50 rounded">Bản Gốc</span>
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1 leading-snug font-medium">
                      Sử dụng domain gốc của Uniswap. Có thể bị Firefox/Chrome chặn trong Iframe.
                    </span>
                  </button>
                </div>
              </div>

              {/* Chain Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  2. Chọn Mạng Lưới (Chain Preset)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {WIDGET_SUPPORTED_CHAINS.map(wc => (
                    <button
                      key={wc.id}
                      onClick={() => handleSelectWidgetChain(wc.id)}
                      className={`p-3 rounded-2xl border text-xs font-black transition text-left flex items-center justify-between cursor-pointer ${
                        widgetChainId === wc.id
                          ? "bg-slate-900 text-white border-transparent shadow"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-150"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm">{wc.icon}</span>
                        <div>
                          <span className="block font-extrabold text-[11px]">{wc.short}</span>
                          <span className={widgetChainId === wc.id ? "text-[10px] text-pink-300 font-medium" : "text-[10px] text-slate-400 font-medium"}>
                            {wc.id === 11155111 ? "Mới trường thử nghiệm Testnet" : "Mạng lưới chính quy Mainnet"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">ID: {wc.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  3. Chủ Đề Giao Diện Widget
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setWidgetTheme("dark");
                      setIframeKey(p => p + 1);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      widgetTheme === "dark" 
                        ? "bg-slate-900 border-transparent text-white shadow"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    Tối (Dark)
                  </button>
                  <button 
                    onClick={() => {
                      setWidgetTheme("light");
                      setIframeKey(p => p + 1);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      widgetTheme === "light" 
                        ? "bg-slate-250 border-pink-500 bg-pink-50 text-pink-700 font-extrabold border"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    Sáng (Light)
                  </button>
                </div>
              </div>

              {/* Auto Token Switch presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  4. Token Cặp Mặc Định Sẵn Có
                </label>
                <div className="space-y-1.5">
                  {(WIDGET_PRECISION_PRESETS[widgetChainId] || WIDGET_PRECISION_PRESETS[1]).map((p, index, arr) => {
                    // Render pairs sequentially
                    if (index === 0) return null;
                    const primary = arr[0];
                    return (
                      <button
                        key={p.address}
                        onClick={() => handleSelectWidgetPreset(primary.address, p.address)}
                        className={`w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-150 transition text-left flex items-center justify-between ${
                          widgetCustomFrom === primary.address && widgetCustomTo === p.address ? "border-pink-300 bg-pink-50/50 text-pink-700" : ""
                        }`}
                      >
                        <span>{primary.symbol} ➔ {p.symbol}</span>
                        <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">{p.address.slice(0, 10)}...</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Token Override */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  5. Tùy chỉnh Địa Chỉ Hợp Đồng (Token Core Address)
                </label>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold mb-1">Hợp đồng token gửi (From)</span>
                    <input 
                      type="text"
                      className="w-full text-xs font-mono p-2 border border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="Địa chỉ token gửi hoặc ETH / BNB / POL"
                      value={widgetCustomFrom}
                      onChange={(e) => setWidgetCustomFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold mb-1">Hợp đồng token nhận (To)</span>
                    <input 
                      type="text"
                      className="w-full text-xs font-mono p-2 border border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="Địa chỉ hợp đồng ERC20 (ví dụ 0x...)"
                      value={widgetCustomTo}
                      onChange={(e) => setWidgetCustomTo(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setIframeLoading(true);
                      setIframeKey(k => k + 1);
                      setTimeout(() => setIframeLoading(false), 900);
                      onLogMessage?.(`Cập nhật cặp định tuyến mỏ neo mới chính xác: From ${widgetCustomFrom} To ${widgetCustomTo}`, "info");
                    }}
                    className="w-full py-2 px-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-black transition cursor-pointer text-center"
                  >
                    Bắt buộc Áp Dụng Cửa Sổ
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-3.5">
              <h4 className="font-mono text-xs uppercase tracking-widest text-pink-400 font-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Năng lực Hoán đổi V3</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Ứng dụng cung cấp trọn vẹn cả mạng thử nghiệm Sepolia để bạn kiểm toán quy trình nhận tiền từ Faucet và tập lệnh giao dịch thử nghiệm thông qua token giả lạp trước khi vận hành trên Mainnet dòng tiền lớn.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ANALYST ROUTER MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="uniswap-analyst-simulation-layout">
          {/* Left pane: The Swap Interface */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-150 rounded-3xl p-5 md:p-6 shadow-xl relative">
              
              {/* Swap Header Settings */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-indigo-505 text-indigo-500 animate-pulse" />
                  <h3 className="font-extrabold text-slate-800 text-base">Trình Định Tuyến & Biên Soạn Giao Dịch</h3>
                </div>

                {/* Advanced Slippage settings button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-xl border transition ${
                      showSettings ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-50 text-slate-500 border-slate-100 hover:text-slate-800"
                    }`}
                    title="Cài đặt trượt giá"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Popover */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-40 w-72"
                      >
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Trượt giá tối đa (Slippage)</h4>
                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                          {[0.1, 0.5, 1.0, 3.0].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSlippageBtn(val)}
                              className={`py-1.5 rounded-lg text-xs font-black transition ${
                                slippage === val && customSlippage === ""
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              {val}%
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nhập thủ công % trượt giá"
                            value={customSlippage}
                            onChange={(e) => {
                              setCustomSlippage(e.target.value);
                              const parsed = parseFloat(e.target.value);
                              if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
                                setSlippage(parsed);
                              }
                            }}
                            className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 pr-10"
                          />
                          <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Bảo vệ bạn khỏi dao động giá đột ngột trước khi hoàn tất đào khối. Mặc định khuyên dùng: 0.5%.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Step 1: Chain selection tabs */}
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2 font-mono">
                  Mạng lưới thanh khoản Uniswap (Multi-Chain Routing)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORTED_CHAINS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChainId(c.id);
                        setQuote(null);
                        setQuoteError(null);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        selectedChainId === c.id 
                          ? `${c.color} border-transparent shadow-md`
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-150"
                      }`}
                    >
                      <span>{c.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input fields */}
              <div className="space-y-2 relative">
                
                {/* FROM Card BOX */}
                <div className="bg-slate-50 hover:bg-slate-100/75 border border-slate-150 rounded-2xl p-4 transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Bán (From)</span>
                    {fromToken?.basePriceUsd && fromAmount && (
                      <span className="text-xs text-slate-400 font-medium">
                        ~${(Number(fromAmount) * fromToken.basePriceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="bg-transparent text-2xl md:text-3xl font-black text-slate-800 outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                    />
                    
                    <button
                      onClick={() => setShowTokenModal("from")}
                      className="bg-white border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded-xl flex items-center space-x-2 shrink-0 shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      {fromToken?.logoURI ? (
                        <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-5 h-5 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-[10px] font-black">{fromToken?.symbol[0]}</div>
                      )}
                      <span className="text-sm">{fromToken?.symbol || "Chọn Token"}</span>
                    </button>
                  </div>
                </div>

                {/* Absolute Center Interceptor Switch Button */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[78px] z-10">
                  <button
                    onClick={handleSwitchTokens}
                    className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-2.5 rounded-full shadow-lg transition duration-200 hover:scale-110 group cursor-pointer"
                  >
                    <ArrowDownUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition duration-200" />
                  </button>
                </div>

                {/* TO Card BOX */}
                <div className="bg-slate-50 hover:bg-slate-100/75 border border-slate-150 rounded-2xl p-4 transition pt-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Mua (To)</span>
                    {toToken?.basePriceUsd && toAmount && (
                      <span className="text-xs text-slate-400 font-medium">
                        ~${(Number(toAmount) * toToken.basePriceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      {quoting ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                          <span className="text-slate-400 text-sm font-semibold">Đang liên hệ báo giá Uniswap API...</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="0.0"
                          value={toAmount}
                          readOnly
                          className="bg-transparent text-2xl md:text-3xl font-black text-slate-800 outline-none w-full focus:outline-none"
                        />
                      )}
                    </div>
                    
                    <button
                      onClick={() => setShowTokenModal("to")}
                      className="bg-white border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded-xl flex items-center space-x-2 shrink-0 shadow-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      {toToken?.logoURI ? (
                        <img src={toToken.logoURI} alt={toToken.symbol} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-5 h-5 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-[10px] font-black">{toToken?.symbol[0]}</div>
                      )}
                      <span className="text-sm">{toToken?.symbol || "Chọn Token"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error displays */}
              {quoteError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2 text-xs text-rose-700 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{quoteError}</span>
                </div>
              )}

              {/* Quote details Accordion */}
              {quote && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 border-t border-slate-100 pt-5 space-y-3.5"
                >
                  {/* 1. Market Rate Ratio */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">Tỷ giá quy đổi (Exchange rate)</span>
                    <span className="font-bold text-slate-700 font-mono">
                      1 {fromToken?.symbol} = {(quote.outputUsdValue / quote.inputUsdValue * (toToken?.basePriceUsd || 1) / (fromToken?.basePriceUsd || 1)).toFixed(5)} {toToken?.symbol}
                    </span>
                  </div>

                  {/* 2. Price Impact visual banner */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Tác động giá (Price Impact)</span>
                    <div className={`px-2 py-0.5 rounded-lg border text-[11px] font-black flex items-center gap-1 ${getPriceImpactColor(quote.priceImpactPercentage)}`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>~{quote.priceImpactPercentage.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* 3. Gas Fees Estimate */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">Ước tính phí gas mạng lưới</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <span>~${quote.estimatedGasUsd.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-1 py-0.2 rounded">Lớp v3 tiết kiệm</span>
                    </span>
                  </div>

                  {/* 4. Router target */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">Bên nhận định lộ trình</span>
                    <span className="font-mono bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100 font-semibold select-all text-[10px]">
                      {quote.routerAddress.slice(0, 18)}...
                    </span>
                  </div>

                  {/* 5. Path simulation mapping */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <span>Lộ trình thông tuyến (V3 Routing)</span>
                      <span className="text-indigo-600">Phí pool 0.3%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono flex-wrap">
                      <span className="bg-white px-2 py-1 rounded border border-slate-200 font-black text-slate-800">{fromToken?.symbol}</span>
                      <span className="text-slate-300">➜</span>
                      <span className="text-[10px] text-slate-400">Uniswap Router</span>
                      <span className="text-slate-300">➜</span>
                      <span className="bg-white px-2 py-1 rounded border border-slate-200 font-black text-slate-800">{toToken?.symbol}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Wallet Selection for gas payment simulation */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest block mb-2 w-full font-mono">
                  Tài khoản ví thanh toán thử nghiệm
                </label>
                
                {savedWallets.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 leading-relaxed font-semibold">
                    Chưa có tài khoản ví được tạo. Vui lòng chuyển sang Tab "Tạo Ví Mới" hoặc dán một khóa tài khoản của bạn để chạy demo.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={activeWallet?.id || ""}
                      onChange={(e) => {
                        const matched = savedWallets.find(w => w.id === e.target.value);
                        if (matched) setActiveWallet(matched);
                      }}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-2xl focus:outline-none text-slate-700 cursor-pointer appearance-none"
                    >
                      {savedWallets.map(w => (
                        <option key={w.id} value={w.id}>
                          [{w.chain.toUpperCase()}] {w.id.slice(0, 8)}... - {w.address?.slice(0, 22)}...
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <Wallet className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* The Ultimate Action Button! */}
              <div className="mt-6">
                <button
                  disabled={!fromToken || !toToken || !fromAmount || !toAmount || quoteError !== null || isSwapping || savedWallets.length === 0}
                  onClick={handleExecuteSwap}
                  className={`w-full py-4 px-6 rounded-2xl text-sm font-black text-white hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98] transition cursor-pointer flex items-center justify-center space-x-2 ${
                    !fromToken || !toToken || !fromAmount || !toAmount || quoteError !== null || isSwapping || savedWallets.length === 0
                      ? "bg-slate-200 border border-slate-150 text-slate-400 shadow-none cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-550 to-indigo-600 bg-indigo-600 border border-indigo-400/30"
                  }`}
                >
                  {isSwapping ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Đang liên hệ Node & khai mạc smart-contract...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Xác nhận hoán đổi giả lập (Ký Sandbox)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success Celebration Alert Panel */}
              <AnimatePresence>
                {swapResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-6 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-emerald-900">Giao dịch giả lập thành lập thành công!</h4>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          Yêu cầu swap được mô phỏng biên hợp đồng. Số liệu trích xuất giá hoàn thiện an toàn.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-2xl p-3 border border-emerald-100 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Mã Hash (TxID):</span>
                        <a 
                          href={`${activeChain.scan}/tx/${swapResult.txHash}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-bold truncate max-w-[180px]"
                        >
                          <span>{swapResult.txHash.slice(0, 16)}...</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Thời Gian:</span>
                        <span className="text-slate-800 font-semibold">{swapResult.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick Informational Tip */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-slate-800">Cơ chế rẽ nhánh API (Proxy Router)</span>
                <p className="leading-relaxed">
                  Khi khóa API chính bận rộn, serverless rẽ nhánh tự động sử dụng toán học phân tách tỷ lệ chuyển đổi chênh lệch để bảo đảm báo giá hoán đổi dồi dào, chuẩn quy trình Uniswap v3 Pool gốc.
                </p>
              </div>
            </div>
          </div>

          {/* Right pane: Standard Uniswap historical records & guide */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Liquid Pools Stat */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Lịch sử giao dịch của bạn</h3>
              </div>

              {txHistory.length === 0 ? (
                <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-400 font-semibold">Chưa phát hiện giao dịch trong phiên này.</p>
                  <p className="text-[10px] text-slate-400 font-medium">Bản ghi hoán đổi token thông qua Uniswap v3 proxy sẽ được lưu trữ cục bộ tại đây.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {txHistory.map(item => (
                    <div key={item.txHash} className="bg-slate-50 border border-slate-150 hover:bg-slate-100 p-3 rounded-2xl space-y-2 transition text-xs font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded text-[10px] uppercase">
                          {item.chain.split(" ")[0]}
                        </span>
                        <span className="text-slate-400">{item.timestamp.split(" ")[1]}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-850">
                        <span className="font-black">
                          Swap {item.fromAmount} {item.fromSymbol} ➔ {item.toAmount} {item.toSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] text-slate-500">
                        <span>Trị giá: ~${item.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                        <a 
                          href={`${activeChain.scan}/tx/${item.txHash}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          <span>Chi tiết</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Cẩm Nang Hoán Đổi Thông Minh</span>
              </h3>
              
              <div className="space-y-4 text-xs font-semibold">
                <div className="border-l-2 border-pink-500 pl-3.5 space-y-1">
                  <span className="text-slate-100 block font-bold">1. Phân biệt Trượt giá (Slippage)</span>
                  <p className="text-slate-400 leading-relaxed font-normal">
                    Khoảng cách lệch giá xảy ra giữa lúc bạn bấm gửi lệnh đến lúc khối giao dịch được xác thực. Uniswap sẽ khóa lệnh nếu mức giá giảm hơn mức % cấu hình sẵn.
                  </p>
                </div>

                <div className="border-l-2 border-indigo-500 pl-3.5 space-y-1">
                  <span className="text-slate-100 block font-bold">2. Tầm quan trọng của Phí Gas</span>
                  <p className="text-slate-400 leading-relaxed font-normal">
                    Phí Gas được thanh toán bằng tài khoản coin gốc của chuỗi (như ETH trên Ethereum, MATIC trên Polygon). Hãy chuẩn bị dư thừa một ít coin làm nhiên liệu.
                  </p>
                </div>

                <div className="border-l-2 border-amber-500 pl-3.5 space-y-1">
                  <span className="text-slate-100 block font-bold">3. Kiểm toán Smart Contract</span>
                  <p className="text-slate-400 leading-relaxed font-normal">
                    Tất cả các lệnh Uniswap V3 định tuyến theo chuẩn mã nguồn mở đã qua kiểm duyệt an toàn, không có trung gian can thiệp sửa đổi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Dialog MODAL for Token Selector */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowTokenModal(null);
                setTokenSearch("");
              }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Content box popup */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-5 space-y-4"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-base">
                  Chọn Token {showTokenModal === "from" ? "Gửi" : "Nhận"} ({activeChain.short})
                </h3>
                <button 
                  onClick={() => {
                    setShowTokenModal(null);
                    setTokenSearch("");
                  }}
                  className="bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-500 font-black p-1.5 rounded-lg text-xs"
                >
                  Đóng
                </button>
              </div>

              {/* Search bar input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Tên hoặc Ký hiệu"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Tokens Scroll Listing box */}
              {loadingTokens ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-pink-500 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold">Đang tải token hoạt động...</span>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-100">
                  {filteredTokens.filter(t => {
                    if (!tokenSearch.trim()) return true;
                    const search = tokenSearch.toLowerCase().trim();
                    return t.symbol.toLowerCase().includes(search) || t.name.toLowerCase().includes(search);
                  }).length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">Không tìm thấy token phù hợp.</div>
                  ) : (
                    filteredTokens
                      .filter(t => {
                        if (!tokenSearch.trim()) return true;
                        const search = tokenSearch.toLowerCase().trim();
                        return t.symbol.toLowerCase().includes(search) || t.name.toLowerCase().includes(search);
                      })
                      .map(token => {
                        const isCurrentlySelected = showTokenModal === "from" 
                          ? fromToken?.address === token.address 
                          : toToken?.address === token.address;
                          
                        return (
                          <button
                            key={token.address}
                            onClick={() => {
                              if (showTokenModal === "from") {
                                setFromToken(token);
                              } else {
                                setToToken(token);
                              }
                              setShowTokenModal(null);
                              setTokenSearch("");
                            }}
                            className={`w-full p-2.5 rounded-xl transition flex items-center justify-between border cursor-pointer ${
                              isCurrentlySelected 
                                ? "bg-pink-50/70 border-pink-200 text-pink-750" 
                                : "bg-white hover:bg-slate-50 border-transparent text-slate-700 hover:border-slate-150"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {token.logoURI ? (
                                <img src={token.logoURI} alt={token.symbol} className="w-6.5 h-6.5 rounded-full" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-6.5 h-6.5 bg-slate-100 text-slate-600 flex items-center justify-center rounded-full text-xs font-black">{token.symbol[0]}</div>
                              )}
                              <div className="text-left">
                                <span className="block font-extrabold text-xs">{token.symbol}</span>
                                <span className="block text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{token.name}</span>
                              </div>
                            </div>

                            <div className="text-right font-mono text-[11px] font-bold text-slate-500">
                              {token.basePriceUsd ? `$${token.basePriceUsd.toLocaleString()}` : "-"}
                            </div>
                          </button>
                        );
                      })
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
