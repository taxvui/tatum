import { ChainConfig } from "./types";

const BASE_CHAINS: ChainConfig[] = [
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    bgGrad: "from-[#627EEA]/10 to-[#627EEA]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Nền tảng hợp đồng thông minh hàng đầu. Sử dụng chuẩn derive m/44'/60'/0'/0 cho địa chỉ.",
    category: "EVM",
    isCoreSupported: true
  },
  {
    id: "BSC",
    name: "BNB Smart Chain",
    symbol: "BNB",
    color: "#F3BA2F",
    bgGrad: "from-[#F3BA2F]/10 to-[#F3BA2F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới phí gas rẻ tương thích EVM của Binance. Định dạng giống Ethereum.",
    category: "EVM",
    isCoreSupported: true
  },
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    bgGrad: "from-[#F7931A]/10 to-[#F7931A]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/0'/0'/0",
    desc: "Đồng tiền điện tử đầu tiên trên thế giới. Sử dụng định dạng địa chỉ kế thừa hoặc SegWit.",
    category: "UTXO",
    isCoreSupported: true
  },
  {
    id: "TRX",
    name: "TRON",
    symbol: "TRX",
    color: "#FF000F",
    bgGrad: "from-[#FF000F]/10 to-[#FF000F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/195'/0'/0",
    desc: "Mạng lưới tốc độ cao, phí thấp cho giao dịch USDT (TRC-20).",
    category: "Non-EVM",
    isCoreSupported: true
  },
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    color: "#14F195",
    bgGrad: "from-[#14F195]/10 to-[#9945FF]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "Standard Ed25519",
    desc: "Blockchain siêu tốc độ cao. Tạo trực tiếp 1 địa chỉ duy nhất cùng mã khóa riêng kèm theo.",
    category: "Non-EVM",
    isCoreSupported: true
  },
  {
    id: "POLYGON",
    name: "Polygon MATIC",
    symbol: "MATIC",
    color: "#8247E5",
    bgGrad: "from-[#8247E5]/10 to-[#8247E5]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Giải pháp Layer-2 mở rộng danh tiếng cho Ethereum tương thích hoàn toàn EVM.",
    category: "L2",
    isCoreSupported: true
  },
  {
    id: "ADA",
    name: "Cardano",
    symbol: "ADA",
    color: "#0033AD",
    bgGrad: "from-[#0033AD]/10 to-[#0033AD]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/1852'/1815'/0'",
    desc: "Blockchain thế hệ thứ 3 bảo mật cao sử dụng mô hình UTxO cải tiến.",
    category: "UTXO",
    isCoreSupported: true
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    color: "#C2A633",
    bgGrad: "from-[#C2A633]/10 to-[#C2A633]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/3'/0'/0",
    desc: "Đồng tiền meme nổi tiếng toàn cầu dựa trên công nghệ Litecoin.",
    category: "Meme/Alt",
    isCoreSupported: true
  },
  {
    id: "LTC",
    name: "Litecoin",
    symbol: "LTC",
    color: "#345C9C",
    bgGrad: "from-[#345C9C]/10 to-[#345C9C]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/2'/0'/0",
    desc: "Bản sao hoàn hảo của Bitcoin với tốc độ khối nhanh gấp 4 lần.",
    category: "UTXO",
    isCoreSupported: true
  },
  // Additional blockchains supported by Tatum to satisfy "lấy toàn bộ blockchain hỗ trợ bởi Tatum"
  {
    id: "XRP",
    name: "Ripple",
    symbol: "XRP",
    color: "#23292F",
    bgGrad: "from-[#23292F]/10 to-[#23292F]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/144'/0'/0'",
    desc: "Số cái sổ phân tán tốc độ cao cho thanh toán ngân hàng quốc tế, hỗ trợ Destination Tag.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "AVAX",
    name: "Avalanche C-Chain",
    symbol: "AVAX",
    color: "#E84142",
    bgGrad: "from-[#E84142]/10 to-[#E84142]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Phân mảnh C-Chain tương thích hoàn hảo EVM với cơ chế đồng thuận Avalanche hiệu suất cao.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "FTM",
    name: "Fantom",
    symbol: "FTM",
    color: "#1969FF",
    bgGrad: "from-[#1969FF]/10 to-[#1969FF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng có tốc độ đồng thuận aBFT nhanh nhất, tương thích EVM tuyệt đối.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "ALGO",
    name: "Algorand",
    symbol: "ALGO",
    color: "#000000",
    bgGrad: "from-slate-800/10 to-slate-900/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/283'/0'/0'",
    desc: "Giao thức Pure Proof of Stake do giáo sư Silvio Micali của MIT sáng lập.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "NEAR",
    name: "Near Protocol",
    symbol: "NEAR",
    color: "#000000",
    bgGrad: "from-slate-600/10 to-slate-550/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/397'/0'",
    desc: "Nền tảng Cloud Sharding thân thiện với nhà phát triển sử dụng ngôn ngữ Rust.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "CELO",
    name: "Celo",
    symbol: "CELO",
    color: "#35D07F",
    bgGrad: "from-[#35D07F]/10 to-[#35D07F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/52752'/0'/0",
    desc: "Hệ sinh thái EVM thân thiện với di động, tập trung vào thanh toán ngang hàng toàn cầu.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "XLM",
    name: "Stellar",
    symbol: "XLM",
    color: "#000000",
    bgGrad: "from-slate-500/10 to-slate-400/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/148'/0'",
    desc: "Mạng lưới phi tập trung toàn cầu hỗ trợ trao đổi lưu trữ giá trị tiền tệ.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "ARBITRUM",
    name: "Arbitrum One",
    symbol: "ARB",
    color: "#28A0F0",
    bgGrad: "from-[#28A0F0]/10 to-[#28A0F0]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Giải pháp mở rộng rollup của L2 hàng đầu giúp hạ phí gas cực sâu trên Ethereum.",
    category: "L2",
    isCoreSupported: false
  },
  {
    id: "OPTIMISM",
    name: "Optimism",
    symbol: "OP",
    color: "#FF0420",
    bgGrad: "from-[#FF0420]/10 to-[#FF0420]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Optimistic Rollup L2 hiệu suất cao, cơ kết cấu OP Stack phi tập trung vững mạnh.",
    category: "L2",
    isCoreSupported: false
  },
  {
    id: "EGLD",
    name: "MultiversX (Elrond)",
    symbol: "EGLD",
    color: "#1B47FF",
    bgGrad: "from-[#1B47FF]/10 to-[#1B47FF]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/508'/0'/0'",
    desc: "Kiến trúc State Sharding mở rộng vượt trội gấp 1000 lần blockchain cơ sở.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "DOT",
    name: "Polkadot",
    symbol: "DOT",
    color: "#E6007A",
    bgGrad: "from-[#E6007A]/10 to-[#E6007A]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/354'/0'/0'",
    desc: "Kiến trúc Multi-chain phân mảng hỗ trợ kết nối bảo mật chéo Parachain.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "FLOW",
    name: "Flow",
    symbol: "FLOW",
    color: "#00EF8B",
    bgGrad: "from-[#00EF8B]/10 to-[#00EF8B]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/539'/0'/0'",
    desc: "Giao thức hiệu suất cao thân thiện với NFT và dApps thương mại tiêu dùng thế hệ mới.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "KLAY",
    name: "Klaytn (Kaia)",
    symbol: "KLAY",
    color: "#E27B13",
    bgGrad: "from-[#E27B13]/10 to-[#E27B13]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockchain định hướng doanh nghiệp hàng đầu Hàn Quốc phối hợp cùng Kakao.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "CRONOS",
    name: "Cronos",
    symbol: "CRO",
    color: "#121B34",
    bgGrad: "from-[#121B34]/10 to-[#121B34]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới Cosmos SDK tương thích EVM đầu tiên phục vụ cho hệ sinh thái Crypto.com.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "EOS",
    name: "EOS",
    symbol: "EOS",
    color: "#000000",
    bgGrad: "from-slate-400/10 to-slate-200/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/194'/0'/0'",
    desc: "Hệ thống Delegated Proof of Stake cung cấp phí giao dịch bằng không.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "CHZ",
    name: "Chiliz",
    symbol: "CHZ",
    color: "#CD0124",
    bgGrad: "from-[#CD0124]/10 to-[#CD0124]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockchain tương thích EVM dành riêng cho thể thao, giải trí và fan token.",
    category: "EVM",
    isCoreSupported: false
  },
  {
    id: "VET",
    name: "VeChain",
    symbol: "VET",
    color: "#15BDFF",
    bgGrad: "from-[#15BDFF]/10 to-[#15BDFF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/818'/0'/0",
    desc: "Hệ thống quản lý chuỗi cung ứng minh bạch sử dụng cơ chế đồng thuận Proof of Authority.",
    category: "Non-EVM",
    isCoreSupported: false
  },
  {
    id: "TEZOS",
    name: "Tezos",
    symbol: "XTZ",
    color: "#2B79FD",
    bgGrad: "from-[#2B79FD]/10 to-[#2B79FD]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/1729'/0'/0'",
    desc: "Nền tảng tự sửa đổi quy trình không cần hardfork, sử dụng ngôn ngữ Michelson siêu bảo mật.",
    category: "Non-EVM",
    isCoreSupported: false
  }
];

const EXPLORERS_MAP: Record<string, { mainnet: string; testnet: string }> = {
  ETH: {
    mainnet: "https://etherscan.io/address/{address}",
    testnet: "https://sepolia.etherscan.io/address/{address}"
  },
  BSC: {
    mainnet: "https://bscscan.com/address/{address}",
    testnet: "https://testnet.bscscan.com/address/{address}"
  },
  BTC: {
    mainnet: "https://blockstream.info/address/{address}",
    testnet: "https://blockstream.info/testnet/address/{address}"
  },
  TRX: {
    mainnet: "https://tronscan.org/#/address/{address}",
    testnet: "https://shasta.tronscan.org/#/address/{address}"
  },
  SOL: {
    mainnet: "https://solscan.io/account/{address}",
    testnet: "https://solscan.io/account/{address}?cluster=devnet"
  },
  POLYGON: {
    mainnet: "https://polygonscan.com/address/{address}",
    testnet: "https://amoy.polygonscan.com/address/{address}"
  },
  ADA: {
    mainnet: "https://cardanoscan.io/address/{address}",
    testnet: "https://preprod.cardanoscan.io/address/{address}"
  },
  DOGE: {
    mainnet: "https://blockchair.com/dogecoin/address/{address}",
    testnet: "https://blockchair.com/dogecoin/testnet/address/{address}"
  },
  LTC: {
    mainnet: "https://blockchair.com/litecoin/address/{address}",
    testnet: "https://blockchair.com/litecoin/testnet/address/{address}"
  },
  XRP: {
    mainnet: "https://xrpscan.com/account/{address}",
    testnet: "https://testnet.xrpscan.com/account/{address}"
  },
  AVAX: {
    mainnet: "https://snowtrace.io/address/{address}",
    testnet: "https://testnet.snowtrace.io/address/{address}"
  },
  FTM: {
    mainnet: "https://ftmscan.com/address/{address}",
    testnet: "https://testnet.ftmscan.com/address/{address}"
  },
  ALGO: {
    mainnet: "https://explorer.perowallet.app/address/{address}",
    testnet: "https://testnet.explorer.perowallet.app/address/{address}"
  },
  NEAR: {
    mainnet: "https://nearblocks.io/address/{address}",
    testnet: "https://testnet.nearblocks.io/address/{address}"
  },
  CELO: {
    mainnet: "https://celoscan.io/address/{address}",
    testnet: "https://alfajores.celoscan.io/address/{address}"
  },
  XLM: {
    mainnet: "https://stellar.expert/explorer/public/account/{address}",
    testnet: "https://stellar.expert/explorer/testnet/account/{address}"
  },
  ARBITRUM: {
    mainnet: "https://arbiscan.io/address/{address}",
    testnet: "https://sepolia.arbiscan.io/address/{address}"
  },
  OPTIMISM: {
    mainnet: "https://optimistic.etherscan.io/address/{address}",
    testnet: "https://sepolia-optimism.etherscan.io/address/{address}"
  },
  EGLD: {
    mainnet: "https://explorer.multiversx.com/accounts/{address}",
    testnet: "https://testnet-explorer.multiversx.com/accounts/{address}"
  },
  DOT: {
    mainnet: "https://polkadot.subscan.io/account/{address}",
    testnet: "https://westend.subscan.io/account/{address}"
  },
  FLOW: {
    mainnet: "https://flowscan.org/account/{address}",
    testnet: "https://testnet.flowscan.org/account/{address}"
  },
  KLAY: {
    mainnet: "https://klaytnscope.com/account/{address}",
    testnet: "https://testnet.klaytnscope.com/account/{address}"
  },
  CRONOS: {
    mainnet: "https://cronoscan.com/address/{address}",
    testnet: "https://testnet.cronoscan.com/address/{address}"
  },
  EOS: {
    mainnet: "https://bloks.io/account/{address}",
    testnet: "https://testnet.bloks.io/account/{address}"
  },
  CHZ: {
    mainnet: "https://chiliscan.com/address/{address}",
    testnet: "https://testnet.chiliscan.com/address/{address}"
  },
  VET: {
    mainnet: "https://vechainstats.com/account/{address}",
    testnet: "https://testnet.vechainstats.com/account/{address}"
  },
  TEZOS: {
    mainnet: "https://tzkt.io/{address}",
    testnet: "https://ghostnet.tzkt.io/{address}"
  }
};

const FAUCETS_MAP: Record<string, string[]> = {
  ETH: [
    "https://sepoliafaucet.com",
    "https://faucet.quicknode.com/ethereum/sepolia",
    "https://infura.io/faucet/sepolia"
  ],
  BSC: [
    "https://testnet.bnbchain.org/faucet-smart",
    "https://faucet.quicknode.com/binance-smart-chain/bnbs-testnet"
  ],
  BTC: [
    "https://bitcoinfaucet.uo1.net",
    "https://coinfaucet.eu/en/btc-testnet",
    "https://testnet-faucet.mempool.co"
  ],
  TRX: [
    "https://shasta.tronex.io",
    "https://faucet.trongrid.io"
  ],
  SOL: [
    "https://faucet.solana.com",
    "https://solfaucet.com"
  ],
  POLYGON: [
    "https://faucet.polygon.technology",
    "https://faucet.quicknode.com/polygon/amoy"
  ],
  ADA: [
    "https://docs.cardano.org/cardano-testnet/tools/faucet",
    "https://faucet.pkada.net"
  ],
  DOGE: [
    "https://shibibeer.github.io/doge/",
    "https://testnet-faucet.com/doge"
  ],
  LTC: [
    "https://faucet.egbdf.dev/ltc",
    "https://testnet-faucet.com/ltc"
  ],
  XRP: [
    "https://xrpl.org/xrp-testnet-faucet.html",
    "https://faucet.bithomp.com"
  ],
  AVAX: [
    "https://faucet.avax.network",
    "https://core.app/tools/testnet-faucet"
  ],
  FTM: [
    "https://faucet.fantom.network"
  ],
  ALGO: [
    "https://bank.testnet.algorand.network"
  ],
  NEAR: [
    "https://faucet.ropsten.co"
  ],
  CELO: [
    "https://faucet.celo.org"
  ],
  XLM: [
    "https://laboratory.stellar.org/#friendbot"
  ],
  ARBITRUM: [
    "https://faucet.quicknode.com/arbitrum/sepolia",
    "https://sepoliafaucet.com"
  ],
  OPTIMISM: [
    "https://faucet.quicknode.com/optimism/sepolia",
    "https://sepoliafaucet.com"
  ],
  TEZOS: [
    "https://faucet.marigold.dev",
    "https://faucet.ghostnet.teztnets.com"
  ]
};

export const SUPPORTED_CHAINS: ChainConfig[] = BASE_CHAINS.map(chain => ({
  ...chain,
  explorers: EXPLORERS_MAP[chain.id] || {
    mainnet: "https://blockchair.com/search?q={address}",
    testnet: "https://blockchair.com/search?q={address}"
  },
  faucets: FAUCETS_MAP[chain.id] || [
    "https://faucet.quicknode.com",
    "https://testnet-faucet.com"
  ]
}));
