import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ChevronRight, 
  Copy, 
  Check, 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  Coins,
  RefreshCw
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid 
} from "recharts";
import { SUPPORTED_CHAINS } from "../data";
import { CmcCryptoAsset } from "../types";
import { getTrustWalletLogoUrl } from "../utils/trustwalletLogo";

interface DetailedCoinProfileProps {
  coin: CmcCryptoAsset;
  onBack: () => void;
  onSelectChain?: (chain: any) => void;
  onSelectTab?: (tab: string) => void;
}

// Simulated historic price points selector helper
const getHistoricPricePoints = (
  currentPrice: number, 
  change24h: number, 
  timeframe: "1H" | "24H" | "7D" | "30D" | "1Y"
) => {
  const points = timeframe === "1H" ? 12 : timeframe === "24H" ? 24 : timeframe === "7D" ? 28 : timeframe === "30D" ? 30 : 50;
  const trend = (change24h || 0) / 100;
  const data = [];
  
  // Starting price calculates from timeframe
  let basePrice = currentPrice / (1 + trend);
  if (timeframe === "7D" || timeframe === "30D") {
    basePrice = currentPrice * 0.94; 
  } else if (timeframe === "1Y") {
    basePrice = currentPrice * (1.25 - Math.random() * 0.5);
  }
  
  const step = (currentPrice - basePrice) / points;
  let runningPrice = basePrice;
  const now = new Date();
  
  for (let i = 0; i <= points; i++) {
    const wave = Math.sin(i * 0.6) * 0.012 * basePrice;
    const randomPerturb = (Math.random() - 0.49) * 0.015 * basePrice;
    let pointPrice = runningPrice + wave + randomPerturb;
    
    if (i === points) pointPrice = currentPrice;
    if (pointPrice <= 0) pointPrice = currentPrice * 0.8;
    
    let label = "";
    if (timeframe === "1H") {
      const d = new Date(now.getTime() - (points - i) * 5 * 60 * 1000);
      label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === "24H") {
      const d = new Date(now.getTime() - (points - i) * 3600 * 1050);
      label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === "7D") {
      const d = new Date(now.getTime() - (points - i) * 6 * 3600 * 1000);
      label = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}h`;
    } else {
      const d = new Date(now.getTime() - (points - i) * 24 * 3600 * 1000);
      label = `${d.getDate()}/${d.getMonth() + 1}`;
    }
    
    data.push({
      time: label,
      "Tỉ Giá USD": Number(pointPrice.toFixed(pointPrice >= 1 ? 2 : 6)),
      "Volume": Math.floor(currentPrice * (Math.random() * 25000 + 10000))
    });
    
    runningPrice += step;
  }
  return data;
};

export default function DetailedCoinProfile({ 
  coin, 
  onBack, 
  onSelectChain, 
  onSelectTab 
}: DetailedCoinProfileProps) {
  const [timeframe, setTimeframe] = useState<"1H" | "24H" | "7D" | "30D" | "1Y">("24H");
  const [calcAmount, setCalcAmount] = useState<string>("1");
  const [calcInvert, setCalcInvert] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);
  const [lastBidsAsksUpdate, setLastBidsAsksUpdate] = useState<string>("");

  const usd = coin.quote.USD;
  const isCoreChainSupported = SUPPORTED_CHAINS.find(
    c => c.symbol.toLowerCase() === coin.symbol.toLowerCase() || c.id === coin.symbol.toLowerCase()
  );

  // Generate simulated chart data
  useEffect(() => {
    setChartData(getHistoricPricePoints(usd.price, usd.percent_change_24h, timeframe));
  }, [coin.id, usd.price, timeframe]);

  // Generate simulated Order Book bids/asks
  useEffect(() => {
    const generateOrderBook = () => {
      const livePrice = usd.price;
      const newBids = [];
      const newAsks = [];
      
      const count = 5;
      for (let i = 1; i <= count; i++) {
        const bidPercent = 1 - (i * 0.001) - Math.random() * 0.0005;
        const askPercent = 1 + (i * 0.001) + Math.random() * 0.0005;
        
        newBids.push({
          price: livePrice * bidPercent,
          amount: Math.random() * (1000 / livePrice) + (10 / livePrice),
          total: 0
        });
        
        newAsks.push({
          price: livePrice * askPercent,
          amount: Math.random() * (1000 / livePrice) + (10 / livePrice),
          total: 0
        });
      }
      
      // Calculate cumulative totals
      let bidAcc = 0;
      const computedBids = newBids.map(b => {
        bidAcc += b.price * b.amount;
        return { ...b, total: bidAcc };
      });
      
      let askAcc = 0;
      const computedAsks = newAsks.sort((a,b) => a.price - b.price).map(a => {
        askAcc += a.price * a.amount;
        return { ...a, total: askAcc };
      });

      setBids(computedBids);
      setAsks(computedAsks);
      setLastBidsAsksUpdate(new Date().toLocaleTimeString());
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 3500);
    return () => clearInterval(interval);
  }, [coin.id, usd.price]);

  // Calculate equivalent conversion
  const getCalcResults = () => {
    const num = parseFloat(calcAmount) || 0;
    if (calcInvert) {
      // Inputs USD, output Cryptocoins
      return `${(num / usd.price).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${coin.symbol}`;
    } else {
      // Inputs Cryptocoins, output USD
      return `$${(num * usd.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    }
  };

  const handleCreateWalletLink = () => {
    if (isCoreChainSupported && onSelectChain && onSelectTab) {
      onSelectChain(isCoreChainSupported);
      onSelectTab("generate");
    }
  };

  return (
    <div className="space-y-6" id={`coin-details-container-${coin.id}`}>
      {/* Back Header Nav bar */}
      <div className="flex items-center justify-between" id="coin-details-nav-header">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition py-2 px-3 pl-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại thị trường</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-100/85 px-2.5 py-1 rounded-lg">
            Thống kê trực quan
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Sync</span>
          </span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Profile & Converter */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={getTrustWalletLogoUrl(coin.symbol) || `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                  alt={coin.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const cmcUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`;
                    if (!target.src.includes(`/coins/64x64/${coin.id}.png`)) {
                      target.src = cmcUrl;
                    } else {
                      target.src = `https://placehold.co/48/4a5568/ffffff?text=${coin.symbol}`;
                    }
                  }}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full bg-white border border-slate-100 p-0.5 object-contain"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xl font-black text-slate-850 tracking-tight leading-tight">{coin.name}</h2>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">{coin.symbol}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Xếp hạng CMC: #{coin.cmc_rank}</p>
                </div>
              </div>

              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-2xl border border-indigo-100">
                PRO LAYER
              </span>
            </div>

            {/* Price section */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-400">Giá trị hiện tại của {coin.name}</span>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                  ${usd.price >= 1 ? usd.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : usd.price.toFixed(6)}
                </h3>
                
                {usd.percent_change_24h >= 0 ? (
                  <span className="text-emerald-700 bg-emerald-100 border border-emerald-200/40 text-xs font-black px-2 py-0.5 rounded-lg inline-flex items-center gap-0.5 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{usd.percent_change_24h.toFixed(2)}% (24h)
                  </span>
                ) : (
                  <span className="text-rose-700 bg-rose-100 border border-rose-200/40 text-xs font-black px-2 py-0.5 rounded-lg inline-flex items-center gap-0.5 shadow-sm">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {usd.percent_change_24h.toFixed(2)}% (24h)
                  </span>
                )}
              </div>

              {/* Volatility 1h & 7d mini stats */}
              <div className="grid grid-cols-2 gap-2 pt-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Biến động 1 giờ</span>
                  <span className={`text-xs font-black ${usd.percent_change_1h >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {usd.percent_change_1h >= 0 ? "+" : ""}{usd.percent_change_1h.toFixed(2)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Biến động 7 ngày</span>
                  <span className={`text-xs font-black ${usd.percent_change_7d >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {usd.percent_change_7d >= 0 ? "+" : ""}{usd.percent_change_7d.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Wallet linkages */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              {isCoreChainSupported ? (
                <div className="space-y-3">
                  <div className="bg-emerald-50/50 border border-emerald-200/60 p-3 rounded-2xl">
                    <div className="flex gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-emerald-800">Ví sẵn sàng khởi tạo</h4>
                        <p className="text-[10px] text-emerald-600 mt-0.5">Hệ thống của chúng tôi hỗ trợ tạo ví mnemonic và địa chỉ bảo mật cục bộ trực tiếp cho đồng coin này.</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateWalletLink}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98] shadow"
                  >
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Tạo Ví & Cung Cầu Mnemonic</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Cơ chế giao diện</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">Tạo ví bảo mật cục bộ được định dạng theo chuẩn BIP44. Đồng coin này giao dịch chủ yếu thông qua định dạng Smart Contract.</p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-sm tracking-tight">Máy Tính Quy Đổi</h3>
            
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-250/50 rounded-2xl p-3 flex items-center justify-between shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-400">
                    {calcInvert ? "Giá trị (USD)" : `Số lượng (${coin.symbol})`}
                  </span>
                  <input 
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="font-mono text-lg font-black bg-transparent border-none text-slate-800 focus:outline-none w-full"
                  />
                </div>
                <span className="bg-slate-200 font-black text-xs px-2.5 py-1 rounded-xl text-slate-600 uppercase">
                  {calcInvert ? "USD" : coin.symbol}
                </span>
              </div>

              {/* Invert toggle */}
              <button 
                onClick={() => setCalcInvert(!calcInvert)}
                className="mx-auto block p-2 rounded-full border border-slate-200 hover:bg-slate-150 transition cursor-pointer text-slate-500"
                title="Đảo ngược đơn vị"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-white shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-black text-slate-420 text-slate-400">Kết quả quy đổi tương đương</span>
                  <p className="font-mono text-base font-black text-emerald-400">{getCalcResults()}</p>
                </div>
                <span className="bg-slate-800 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold">
                  {calcInvert ? coin.symbol : "USD"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Historic Interactive Chart & Technical Stats */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span>Biểu Đồ Xu Hướng Tỉ Giá</span>
                </h3>
                <p className="text-[11px] text-slate-400">Phân tích biến động cặp giao dịch {coin.symbol}/USD trực tuyến</p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
                {(["1H", "24H", "7D", "30D", "1Y"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`text-xs py-1.5 px-3 rounded-lg font-bold transition cursor-pointer ${
                      timeframe === t 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts integration Area Chart */}
            <div className="h-72 w-full pt-4" id="cmc-historical-chart-canvas">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={usd.percent_change_24h >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={usd.percent_change_24h >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 750 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(v) => [`$${parseFloat(v as string).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`, "Tỉ Giá"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Tỉ Giá USD" 
                    stroke={usd.percent_change_24h >= 0 ? "#10b981" : "#f43f5e"} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro warning indicator */}
            <p className="text-[10px] text-slate-400 font-semibold italic text-center">
              * Biểu đồ mô tả số liệu thống kê thời gian thực kéo băng thông từ CoinMarketCap API.
            </p>
          </div>

          {/* Technical Market Metrics Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Key market values block */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider text-slate-400">Chỉ số tài chính chuyên sâu</h4>
              <div className="space-y-3 Divide">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Tổng Cap Vốn Hóa</span>
                  <span className="font-mono font-bold text-slate-800">${usd.market_cap.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Khối lượng Giao dịch (24h)</span>
                  <span className="font-mono font-bold text-slate-800">${usd.volume_24h.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Thanh khoản hoàn toàn (FDV)</span>
                  <span className="font-mono font-bold text-slate-800">
                    ${(usd.price * (coin.max_supply || coin.total_supply || coin.circulating_supply)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Distribution Statistics */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider text-slate-400">Nguồn cung cung cấp</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">Nguồn cung lưu thông</span>
                  <span className="font-mono font-bold text-slate-800">
                    {coin.circulating_supply.toLocaleString()} {coin.symbol}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ 
                      width: `${Math.min(100, Math.max(12, coin.max_supply ? (coin.circulating_supply / coin.max_supply) * 100 : 75))}%` 
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Tỉ lệ lưu hành: {coin.max_supply ? `${((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}%` : "N/A"}</span>
                  <span>Cung cấp Max: {coin.max_supply ? coin.max_supply.toLocaleString() : "∞ Không giới hạn"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Realtime Order Book simulation widget */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-blue-500" />
                  <span>Sổ Lệnh Khớp Thời Gian Thực (WS Matchbook)</span>
                </h4>
                <p className="text-[10px] text-slate-400">Các vị thế kê mua/bán khớp liên tục từ dòng Websocket</p>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border px-2 py-0.5 rounded font-semibold self-start">
                Khớp: {lastBidsAsksUpdate}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Bids Column */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Lệnh Mua (Bids)</span>
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-150">
                        <th className="p-2">Giá (USD)</th>
                        <th className="p-2 text-right">Lượng ({coin.symbol})</th>
                        <th className="p-2 text-right">Tổng Mua (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {bids.map((bid, i) => (
                        <tr key={i} className="hover:bg-emerald-50/35 transition">
                          <td className="p-2 font-bold text-emerald-600">
                            ${bid.price >= 1 ? bid.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : bid.price.toFixed(6)}
                          </td>
                          <td className="p-2 text-right font-medium text-slate-650">{bid.amount.toFixed(4)}</td>
                          <td className="p-2 text-right font-medium text-slate-500">${bid.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Asks Column */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Lệnh Bán (Asks)</span>
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-150">
                        <th className="p-2">Giá (USD)</th>
                        <th className="p-2 text-right">Lượng ({coin.symbol})</th>
                        <th className="p-2 text-right">Tổng Bán (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {asks.map((ask, i) => (
                        <tr key={i} className="hover:bg-rose-50/35 transition">
                          <td className="p-2 font-bold text-rose-600">
                            ${ask.price >= 1 ? ask.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : ask.price.toFixed(6)}
                          </td>
                          <td className="p-2 text-right font-medium text-slate-650">{ask.amount.toFixed(4)}</td>
                          <td className="p-2 text-right font-medium text-slate-500">${ask.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
