export interface TatumChainInfo {
  id: string;
  name: string;
  symbol: string;
  category: "EVM" | "L2" | "UTXO" | "Non-EVM" | "Cosmos" | "Testnet" | "Enterprise/Smart";
  type: string;
  isMainnet: boolean;
  desc: string;
  features: string[];
}

export const TATUM_130_CHAINS: TatumChainInfo[] = [
  // --- EVM Mainnets ---
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    category: "EVM",
    type: "Layer 1 Smart Contract",
    isMainnet: true,
    desc: "Mạng lưới blockchain hợp đồng thông minh phổ biến nhất thế giới.",
    features: ["RPC Nodes", "Smart Contracts", "NFTs", "Fungible Tokens", "KMS"]
  },
  {
    id: "BSC",
    name: "BNB Smart Chain",
    symbol: "BNB",
    category: "EVM",
    type: "Layer 1 Smart Contract",
    isMainnet: true,
    desc: "Hệ sinh thái EVM hiệu suất cao của Binance với phí giao dịch cực kỳ rẻ.",
    features: ["RPC Nodes", "NFT Express", "Smart Contracts", "KMS"]
  },
  {
    id: "POLYGON",
    name: "Polygon PoS",
    symbol: "POL",
    category: "EVM",
    type: "Layer 1/L2 Sidechain",
    isMainnet: true,
    desc: "Giải pháp mở rộng quy mô EVM hàng đầu với hàng triệu người dùng hoạt động.",
    features: ["RPC Nodes", "NFT Express", "Smart Contracts", "KMS"]
  },
  {
    id: "AVAX",
    name: "Avalanche C-Chain",
    symbol: "AVAX",
    category: "EVM",
    type: "Layer 1 Smart Contract",
    isMainnet: true,
    desc: "Cơ chế đồng thuận Avalanche vượt trội kết hợp khả năng tương thích EVM.",
    features: ["RPC Nodes", "Smart Contracts", "Fungible Tokens"]
  },
  {
    id: "FTM",
    name: "Fantom Opera",
    symbol: "FTM",
    category: "EVM",
    type: "Layer 1 Smart Contract",
    isMainnet: true,
    desc: "Mạng lưới hiệu suất cao sử dụng công nghệ đồng thuận Lachesis aBFT.",
    features: ["RPC Nodes", "Fungible Tokens", "Smart Contracts"]
  },
  {
    id: "CELO",
    name: "Celo",
    symbol: "CELO",
    category: "EVM",
    type: "Layer 1 Mobile-First",
    isMainnet: true,
    desc: "Nền tảng EVM tối ưu hóa cho di động và thanh toán tài chính phi tập trung.",
    features: ["RPC Nodes", "Phone Mapping", "Stablecoins", "KMS"]
  },
  {
    id: "CRONOS",
    name: "Cronos Chain",
    symbol: "CRO",
    category: "EVM",
    type: "Layer 1 Cosmos EVM",
    isMainnet: true,
    desc: "Mạng lưới tương thích EVM được hậu thuẫn bởi hệ sinh thái Crypto.com.",
    features: ["RPC Nodes", "Fungible Tokens", "NFTs"]
  },
  {
    id: "CHZ",
    name: "Chiliz Chain 2.0",
    symbol: "CHZ",
    category: "EVM",
    type: "Layer 1 Sport-Focused",
    isMainnet: true,
    desc: "Blockchain tương thích EVM dành riêng cho mảng fan token thể thao toàn cầu.",
    features: ["Fan Tokens", "NFTs", "RPC Nodes"]
  },
  {
    id: "KLAY",
    name: "Kaia (formerly Klaytn)",
    symbol: "KAIA",
    category: "EVM",
    type: "Layer 1 Enterprise",
    isMainnet: true,
    desc: "Sự sáp nhập giữa Klaytn của Kakao và Finschia nhằm tạo ra EVM lớn tốt nhất châu Á.",
    features: ["RPC Nodes", "Business dApps", "Fungible Tokens"]
  },
  {
    id: "GNOSIS",
    name: "Gnosis Chain",
    symbol: "GNO",
    category: "EVM",
    type: "Layer 1 Community-Led",
    isMainnet: true,
    desc: "Hệ thống EVM phi tập trung định hình cho các giao diện quản trị an toàn (DAO).",
    features: ["RPC Nodes", "xDAI Stablecoin", "Smart Contracts"]
  },
  {
    id: "KAVA",
    name: "Kava EVM",
    symbol: "KAVA",
    category: "EVM",
    type: "Co-Chain Cosmos/EVM",
    isMainnet: true,
    desc: "Kiến trúc đồng sở hữu độc đáo kết hợp tốc độ Cosmos với sức mạnh hợp đồng EVM.",
    features: ["Co-chain Bridge", "Minting SDK", "RPC Nodes"]
  },
  {
    id: "EVMOS",
    name: "Evmos",
    symbol: "EVMOS",
    category: "EVM",
    type: "Cosmos EVM Hub",
    isMainnet: true,
    desc: "Cổng giao tiếp EVM hàng đầu kết nối với mạng lưới liên kết Cosmos IBC.",
    features: ["Interchain Transactions", "EVM Engine", "RPC Nodes"]
  },
  {
    id: "HARMONY",
    name: "Harmony One",
    symbol: "ONE",
    category: "EVM",
    type: "Sharded Layer 1",
    isMainnet: true,
    desc: "Mạng phân mảnh sharding tương thích EVM hỗ trợ giao dịch siêu tốc 2 giây.",
    features: ["Sharded RPC", "Fungible Tokens", "Fast Blocks"]
  },
  {
    id: "MOONBEAM",
    name: "Moonbeam",
    symbol: "GLMR",
    category: "EVM",
    type: "Polkadot Parachain EVM",
    isMainnet: true,
    desc: "Cung cấp nền tảng phát triển Ethereum toàn diện trên mạng lưới Polkadot.",
    features: ["Cross-chain Connected", "Unified Accounts", "RPC Nodes"]
  },
  {
    id: "MOONRIVER",
    name: "Moonriver",
    symbol: "MOVR",
    category: "EVM",
    type: "Kusama Parachain EVM",
    isMainnet: true,
    desc: "Mạng lưới thử nghiệm thực tế của Moonbeam trên Kusama.",
    features: ["RPC Nodes", "Early Deployments", "Smart Contracts"]
  },
  {
    id: "ASTAR",
    name: "Astar Network",
    symbol: "ASTR",
    category: "EVM",
    type: "Multi-VM Layer 1",
    isMainnet: true,
    desc: "Hỗ trợ cả Ethereum EVM và WebAssembly (WASM) trên hệ sinh thái Polkadot.",
    features: ["dApp Staking", "Multi-VM", "RPC Nodes"]
  },
  {
    id: "AURORA",
    name: "Aurora",
    symbol: "AURORA",
    category: "EVM",
    type: "Near EVM Engine",
    isMainnet: true,
    desc: "Trình giả lập EVM hiệu suất cao chạy trực tiếp trên NEAR Protocol.",
    features: ["Near Consensus", "Meta Transactions", "Zero Gas Protocol"]
  },
  {
    id: "BOBA",
    name: "Boba Network",
    symbol: "BOBA",
    category: "EVM",
    type: "Hybrid L2 Rollup",
    isMainnet: true,
    desc: "Giải pháp mở rộng Optimistic Rollup đa chuỗi hỗ trợ tính toán off-chain thông minh.",
    features: ["Hybrid Compute", "L2 Rollup", "Instant Exit"]
  },
  {
    id: "METIS",
    name: "Metis",
    symbol: "METIS",
    category: "EVM",
    type: "L2 Smart Rollup",
    isMainnet: true,
    desc: "Giải pháp Layer-2 tập trung nâng hiệu quả và chi phí giao dịch siêu nhỏ.",
    features: ["Decentralized Sequencer", "L2 RPC", "KMS"]
  },
  {
    id: "CORE",
    name: "Core DAO",
    symbol: "CORE",
    category: "EVM",
    type: "Layer 1 Web3",
    isMainnet: true,
    desc: "Vận hành bởi cơ chế đồng thuận Satoshi Plus kết hợp sức mạnh BTC và EVM.",
    features: ["Satoshi Plus", "Staking Contracts", "RPC"]
  },
  {
    id: "FLARE",
    name: "Flare Network",
    symbol: "FLR",
    category: "EVM",
    type: "Data-focused L1",
    isMainnet: true,
    desc: "Tích hợp các Oracle phi tập trung để cung cấp nguồn dữ liệu bên ngoài an toàn cho dApps.",
    features: ["FTSO Oracle", "State Connector", "RPC Nodes"]
  },
  {
    id: "SONGBIRD",
    name: "Songbird",
    symbol: "SGB",
    category: "EVM",
    type: "Canary Network",
    isMainnet: true,
    desc: "Mạng lưới chim hoàng yến của Flare dùng để kiểm nghiệm các Oracle trực tiếp.",
    features: ["Experimental Oracle", "EVM", "Fast Speed"]
  },
  {
    id: "HECO",
    name: "Huobi ECO Chain",
    symbol: "HT",
    category: "EVM",
    type: "Exchange Chain",
    isMainnet: true,
    desc: "Sữa cái hiệu năng cao tương thích EVM được bảo trợ bởi sàn Huobi.",
    features: ["HPOS Consensus", "Low Fees"]
  },
  {
    id: "OASIS_EMERALD",
    name: "Oasis Emerald EVM",
    symbol: "ROSE",
    category: "EVM",
    type: "ParaTime Layer",
    isMainnet: true,
    desc: "Phân mảnh ParaTime tương thích hoàn toàn EVM của mạng lưới Oasis.",
    features: ["ParaTime RPC", "DeFi Ecosystem", "Privacy Features"]
  },
  {
    id: "OASIS_SAPPHIRE",
    name: "Oasis Sapphire",
    symbol: "ROSE",
    category: "EVM",
    type: "Confidential EVM",
    isMainnet: true,
    desc: "EVM bảo mật đầu tiên trên thế giới hỗ trợ mã hóa trạng thái hợp đồng thông minh.",
    features: ["Confidential State", "End-to-End Encryption", "RPC Nodes"]
  },
  {
    id: "OKX",
    name: "OKCN (OKX Chain)",
    symbol: "OKT",
    category: "EVM",
    type: "Cosmos SDK EVM",
    isMainnet: true,
    desc: "Mạng giao dịch mở rộng xây dựng bởi OKX dựa trên Cosmos SDK hỗ trợ EVM.",
    features: ["RPC API", "Cross-chain Trade", "DEX Engines"]
  },
  {
    id: "NEON",
    name: "Neon EVM",
    symbol: "NEON",
    category: "EVM",
    type: "Solana L2 EVM",
    isMainnet: true,
    desc: "Trình biên dịch EVM chạy như một smart contract trực tiếp trên Solana.",
    features: ["Solana Parallel Execution", "Neon Pass", "SOL for Gas"]
  },
  {
    id: "XDC",
    name: "XDC Network",
    symbol: "XDC",
    category: "EVM",
    type: "Enterprise Hybrid",
    isMainnet: true,
    desc: "Mạng EVM lai hóa tối ưu hóa cho ngành thương mại và tài chính toàn cầu.",
    features: ["XDPoS Consensus", "ISO20022 Messaging", "RPC Nodes"]
  },
  {
    id: "VELAS",
    name: "Velas",
    symbol: "VLX",
    category: "EVM",
    type: "Solana Fork EVM",
    isMainnet: true,
    desc: "Sự kết hợp giữa công nghệ lõi tốc độ của Solana và công cụ EVM thông minh.",
    features: ["Solana Speeds", "EVM support", "Fast API"]
  },
  {
    id: "RONIN",
    name: "Ronin Network",
    symbol: "RON",
    category: "EVM",
    type: "Gaming Appchain",
    isMainnet: true,
    desc: "Mạng EVM do Sky Mavis xây dựng phục vụ chuyên sâu cho tựa game Axie Infinity.",
    features: ["Gaming Node Support", "NFT Marketplace APIs", "High Throughput"]
  },
  {
    id: "WEMIX",
    name: "WEMIX 3.0",
    symbol: "WEMIX",
    category: "EVM",
    type: "Gaming Platform L1",
    isMainnet: true,
    desc: "Nền tảng blockchain trò chơi thế hệ mới tương thích EVM từ Hàn Quốc.",
    features: ["Game dApps", "Stablecoin WEMIX$", "RPC Service"]
  },
  {
    id: "HORIZEN_EON",
    name: "Horizen EON",
    symbol: "ZEN",
    category: "EVM",
    type: "Sidechain platform",
    isMainnet: true,
    desc: "Mạng ứng dụng thông minh EVM chạy như sidechain có bảo mật cao kết nối Horizen.",
    features: ["Cross-Chain Integration", "SDK Toolkit", "Mock Engine"]
  },
  {
    id: "SHIDEN",
    name: "Shiden Network",
    symbol: "SDN",
    category: "EVM",
    type: "Kusama dApp Hub",
    isMainnet: true,
    desc: "Hệ dApp đa chuỗi chạy như một parachain tương thích EVM trên mạng Kusama.",
    features: ["Multi-Lockdrops", "Kusama Bridge"]
  },
  {
    id: "KCC",
    name: "KuCoin Community Chain",
    symbol: "KCC",
    category: "EVM",
    type: "Exchange Chain",
    isMainnet: true,
    desc: "Được tạo sinh và duy trì bởi cộng đồng thành viên sàn KuCoin.",
    features: ["KCS Gas Token", "DeFi Hub"]
  },
  {
    id: "GATECHAIN",
    name: "GateChain",
    symbol: "GT",
    category: "EVM",
    type: "Exchange Chain",
    isMainnet: true,
    desc: "Blockchain thế hệ mới đảm bảo tính an toàn giao dịch tài sản và tương thích EVM.",
    features: ["RPC integration", "GateBridge"]
  },
  {
    id: "THUNDERCORE",
    name: "ThunderCore",
    symbol: "TT",
    category: "EVM",
    type: "High-Speed L1",
    isMainnet: true,
    desc: "Blockchain tương thích EVM đạt tốc độ giao dịch tức thì và sinh lợi tốt.",
    features: ["PaLa Consensus", "DApps API", "Low Fee"]
  },
  {
    id: "VICTION",
    name: "Viction (formerly TomoChain)",
    symbol: "VIC",
    category: "EVM",
    type: "Zero-Gas EVM",
    isMainnet: true,
    desc: "Blockchain EVM danh tiếng gốc Việt nổi tiếng với phí gas bằng 0 cho người dùng cuối.",
    features: ["Zero-gas Protocol", "TRC21 Token", "RPC Nodes"]
  },
  {
    id: "EWT",
    name: "Energy Web Chain",
    symbol: "EWT",
    category: "EVM",
    type: "Utility & Energy",
    isMainnet: true,
    desc: "Mạng blockchain doanh nghiệp dành riêng cho vận hành năng lượng sạch.",
    features: ["Decarbonization Registry", "EVM Custom Nodes"]
  },
  {
    id: "PALM",
    name: "Palm Network",
    symbol: "PALM",
    category: "EVM",
    type: "Creator L1 Node",
    isMainnet: true,
    desc: "Hệ sinh thái EVM thân thiện với môi trường chuyên cho các tác phẩm nghệ thuật NFT.",
    features: ["Enterprise NFTs", "EVM Bridge"]
  },
  {
    id: "TELOS",
    name: "Telos EVM",
    symbol: "TLOS",
    category: "EVM",
    type: "Ultra-fast EVM L1",
    isMainnet: true,
    desc: "Mạng nội bộ chạy hệ hợp đồng EVM có tốc độ nhanh bậc nhất và cấu trúc chống front-run.",
    features: ["No Front-running", "Airdrop Contract", "Fast Microseconds Block"]
  },

  // --- Layer-2 (Cũng tương thích EVM) ---
  {
    id: "ARBITRUM",
    name: "Arbitrum One",
    symbol: "ARB",
    category: "L2",
    type: "Optimistic Rollup",
    isMainnet: true,
    desc: "Hệ sinh thái Layer-2 bùng nổ nhất của Ethereum với thanh khoản tối ưu.",
    features: ["RPC Nodes", "Fungible Tokens", "L2 Solutions", "KMS"]
  },
  {
    id: "OPTIMISM",
    name: "Optimism Mainnet",
    symbol: "OP",
    category: "L2",
    type: "Optimistic Rollup",
    isMainnet: true,
    desc: "Được hỗ trợ bởi OP Stack, thúc đẩy khả năng mở rộng tối đa và liên chuỗi.",
    features: ["OP Stack RPC", "NFTs", "Fast Bridge"]
  },
  {
    id: "BASE",
    name: "Base",
    symbol: "BASE",
    category: "L2",
    type: "Optimistic Rollup L2",
    isMainnet: true,
    desc: "Mạng lưới Layer-2 do Coinbase ươm mầm trực tiếp dựa trên bộ khung OP Stack.",
    features: ["Coinbase Ecosystem", "RPC Nodes", "Ultra Low Gas"]
  },
  {
    id: "ZKSYNC",
    name: "zkSync Era",
    symbol: "ZK",
    category: "L2",
    type: "ZK Rollup L2",
    isMainnet: true,
    desc: "Mạng mở rộng Layer 2 đầu tiên áp dụng công nghệ ZK-Rollups bảo mật tuyệt mật.",
    features: ["ZK Proofs", "Account Abstraction", "RPC Service"]
  },
  {
    id: "SCROLL",
    name: "Scroll",
    symbol: "SCR",
    category: "L2",
    type: "zkEVM Rollup",
    isMainnet: true,
    desc: "zkEVM Rollup cấp độ byte-code kế thừa trực tiếp tính đồng thuận gốc của Ethereum.",
    features: ["zkEVM", "Equivalent Opcode", "Speed Block"]
  },
  {
    id: "LINEA",
    name: "Linea Network",
    symbol: "LINEA",
    category: "L2",
    type: "zkEVM Rollup L2",
    isMainnet: true,
    desc: "Sản phẩm Layer-2 zkEVM do hãng ConsenSys (Metamask) phát triển tích hợp sâu rộng.",
    features: ["Consensys Connect", "Metamask native", "High TPS"]
  },
  {
    id: "STARKNET",
    name: "Starknet",
    symbol: "STRK",
    category: "L2",
    type: "Validity Rollup (Cairo)",
    isMainnet: true,
    desc: "Vận hành bằng mật mã STARK không phụ thuộc EVM, mang lại hiệu suất đỉnh cao.",
    features: ["Cairo VM", "Fast Proof", "Unified Wallet Support"]
  },
  {
    id: "MANTLE",
    name: "Mantle Network",
    symbol: "MNT",
    category: "L2",
    type: "Modular Ethereum Rollup",
    isMainnet: true,
    desc: "Kiến trúc Rollup dạng modular tối ưu chi phí dữ liệu thông qua đối tác EigenDA.",
    features: ["Modular Architecture", "EigenDA Data Storage", "RPC Nodes"]
  },
  {
    id: "POLYGON_ZKEVM",
    name: "Polygon zkEVM",
    symbol: "zkEVM",
    category: "L2",
    type: "ZK Rollup L2",
    isMainnet: true,
    desc: "Trình mở rộng ZK Rollup trực hệ tương thích hoàn toàn máy ảo EVM của Polygon.",
    features: ["Zero Knowledge Rollups", "RPC nodes"]
  },
  {
    id: "LISK_L2",
    name: "Lisk L2",
    symbol: "LSK",
    category: "L2",
    type: "OP Stack Rollup",
    isMainnet: true,
    desc: "Chuyển giao từ L1 sang L2 OP Stack tập trung vào dApps xã hội và kinh tế thực tế.",
    features: ["OP Stack Core", "Social dApps SDK"]
  },

  // --- UTXO ---
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    category: "UTXO",
    type: "Layer 1 Peer-to-Peer",
    isMainnet: true,
    desc: "Cha đẻ tiền mã hóa, sổ cái bền bỉ nhất dựa trên cơ chế Proof of Work.",
    features: ["Mnemonic Wallets", "Local Address generation", "Xpubs & BIPs", "KMS"]
  },
  {
    id: "LTC",
    name: "Litecoin",
    symbol: "LTC",
    category: "UTXO",
    type: "Layer 1 Proof of Work",
    isMainnet: true,
    desc: "Phiên bản khối mượt mà hơn của Bitcoin có chu lập khối nhanh 2.5 phút.",
    features: ["Fast UTXO TX", "KMS Support", "Address derivation"]
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    category: "UTXO",
    type: "Layer 1 Meme Currency",
    isMainnet: true,
    desc: "Kênh lưu truyền meme tài chính nổi danh nhất, dựa trên lõi mã độc lập Litecoin.",
    features: ["Meme Transfers", "BIP44 Mnemonic", "Scrypt Pow RPC"]
  },
  {
    id: "ADA",
    name: "Cardano",
    symbol: "ADA",
    category: "UTXO",
    type: "Layer 1 Proof of Stake",
    isMainnet: true,
    desc: "Vận hành phiên bản eUTXO cấu trúc phân tán do IOHK nghiên cứu học thuật.",
    features: ["eUTXO support", "Cardano Signer Tools", "Byron/Shelley formats"]
  },
  {
    id: "BCH",
    name: "Bitcoin Cash",
    symbol: "BCH",
    category: "UTXO",
    type: "L1 Payment Fork",
    isMainnet: true,
    desc: "Bản phân tách trực truyền từ Bitcoin tập trung hoàn toàn vào thanh toán tức thời.",
    features: ["Big Block RPC", "Simple Token Protocol"]
  },
  {
    id: "QTUM",
    name: "Qtum Network",
    symbol: "QTUM",
    category: "UTXO",
    type: "Hybrid UTXO/VM",
    isMainnet: true,
    desc: "Cơ chế lai độc đáo kết hợp mô hình bảo mật UTXO của BTC và máy ảo hợp đồng EVM.",
    features: ["UTXO-EVM State", "AAL Layer"]
  },
  {
    id: "RAVEN",
    name: "Ravencoin",
    symbol: "RVN",
    category: "UTXO",
    type: "Asset Creation L1",
    isMainnet: true,
    desc: "Phân bón mã nguồn Bitcoin cấu tạo chuyên hóa cho tạo tác và chuyển nhượng tài sản ảo.",
    features: ["Sub-asset creation", "IPFS metadata mapping"]
  },

  // --- Non-EVM ---
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    category: "Non-EVM",
    type: "Layer 1 Proof of History",
    isMainnet: true,
    desc: "Blockchain khối nén siêu tốc độ xử lý song song vượt quá 50,000 TPS.",
    features: ["SOL Node API", "SPL Tokens", "Compressed NFTs", "Websockets"]
  },
  {
    id: "TRX",
    name: "TRON",
    symbol: "TRX",
    category: "Non-EVM",
    type: "Layer 1 DPoS",
    isMainnet: true,
    desc: "Mạng lưới phân phối USDT (TRC-20) có quy mô khối lượng giao dịch lớn nhất thế giới.",
    features: ["TRC-25 Tokens", "TRC20 Wallet API", "High Bandwidth/Energy", "KMS"]
  },
  {
    id: "XRP",
    name: "Ripple Ledger",
    symbol: "XRP",
    category: "Non-EVM",
    type: "Federated Consensus",
    isMainnet: true,
    desc: "Sổ cái tốc độ cao xử lý thanh toán xuyên biên giới của Ripple.",
    features: ["XRP Ledger RPC", "Trustlines", "Escrows", "Destination Tag"]
  },
  {
    id: "XLM",
    name: "Stellar Horizon",
    symbol: "XLM",
    category: "Non-EVM",
    type: "Stellar Consensus",
    isMainnet: true,
    desc: "Cấu hình sổ cái nhanh dành cho thanh toán cá nhân và phát hành tiền pháp định.",
    features: ["Horizon API", "Assets Tokenization", "Anchor Integrations"]
  },
  {
    id: "NEAR",
    name: "Near Protocol",
    symbol: "NEAR",
    category: "Non-EVM",
    type: "Sharded Cloud L1",
    isMainnet: true,
    desc: "Nền tảng Web3 Sharding với cấu trúc địa chỉ dạng chuỗi ký tự dễ đọc ví dụ: 'tatum.near'.",
    features: ["Human-readable accounts", "Nightshade Sharding", "Access Keys API"]
  },
  {
    id: "SUI",
    name: "Sui Network",
    symbol: "SUI",
    category: "Non-EVM",
    type: "Object-centric L1",
    isMainnet: true,
    desc: "Blockchain ngôn ngữ Sui-Move xử lý song song và tổ chức tài sản như các Object.",
    features: ["Sui Move contracts", "Object-centric Storage", "RPC Endpoints"]
  },
  {
    id: "APT",
    name: "Aptos",
    symbol: "APT",
    category: "Non-EVM",
    type: "Layer 1 Move Lang",
    isMainnet: true,
    desc: "Vận hành công cụ Aptos-Move an toàn thiết kế bởi cựu kỹ sư Meta.",
    features: ["Move Modules", "High concurrency TPS", "Tatum Aptos APIs"]
  },
  {
    id: "ALGO",
    name: "Algorand",
    symbol: "ALGO",
    category: "Non-EVM",
    type: "Pure Proof of Stake",
    isMainnet: true,
    desc: "Cam kết không fork mạng lưới của nhà toán học Silvio Micali.",
    features: ["ASAs (Algorand Assets)", "TEAL Smart Contracts", "Atomic Transfers"]
  },
  {
    id: "EGLD",
    name: "MultiversX",
    symbol: "EGLD",
    category: "Non-EVM",
    type: "Adaptive State Sharding",
    isMainnet: true,
    desc: "Mở rộng 3 phân mảnh giao dịch đồng thời mang lại tốc độ vượt bậc tít mù.",
    features: ["Smart Accounts", "ESDT Tokens", "Sharded VM Nodes"]
  },
  {
    id: "TEZOS",
    name: "Tezos",
    symbol: "XTZ",
    category: "Non-EVM",
    type: "Liquid Proof of Stake",
    isMainnet: true,
    desc: "Hệ quản trị on-chain tự động điều chỉnh mà không phát sinh chia rẽ mạng hardfork.",
    features: ["Michelson Contracts", "On-chain Governance", "FA1.2 / FA2 Token standards"]
  },
  {
    id: "FLOW",
    name: "Flow Blockchain",
    symbol: "FLOW",
    category: "Non-EVM",
    type: "Separated Architecture L1",
    isMainnet: true,
    desc: "Phân chia chức năng thu thập, thực thi, xác minh đem lại tốc độ siêu tốc cho dApps.",
    features: ["Cadence Contracts", "Resource-oriented programmed", "NFT APIs"]
  },
  {
    id: "VET",
    name: "VeChainThor",
    symbol: "VET",
    category: "Non-EVM",
    type: "Supply-chain Focused",
    isMainnet: true,
    desc: "Mạng lưới cấu trúc 2 token (VET và VTHO) thiết kế cho việc lưu vết logistic công ty.",
    features: ["VTHO Energy system", "Multi-task transactions", "ToolChain API"]
  },
  {
    id: "EOS",
    name: "EOS Network",
    symbol: "EOS",
    category: "Non-EVM",
    type: "C++ WebAssembly L1",
    isMainnet: true,
    desc: "Vận hành máy ảo EOS VM đạt tốc độ siêu nhanh với tài nguyên RAM/CPU phân bổ nội bộ.",
    features: ["WASM contracts", "Resource staking", "Zero-fee transactions"]
  },
  {
    id: "HBAR",
    name: "Hedera Hashgraph",
    symbol: "HBAR",
    category: "Non-EVM",
    type: "Hashgraph Consensus Enterprise",
    isMainnet: true,
    desc: "Công nghệ sổ cái dựa trên đồ thị có hướng DAG, được các nghiệp đoàn khổng lồ thế giới bảo trợ.",
    features: ["Hedera Consensus Service", "Token Service (HTS)", "EVM ParaTime equivalent"]
  },
  {
    id: "FIL",
    name: "Filecoin",
    symbol: "FIL",
    category: "Non-EVM",
    type: "Decentralized Storage L1",
    isMainnet: true,
    desc: "Mở rộng dịch vụ lưu trữ dữ liệu phi tập trung, tích hợp FVM (Filecoin Virtual Machine).",
    features: ["FVM Smart Contracts", "Sector Proof storage", "DeFi Storage Rentals"]
  },

  // --- Cosmos ---
  {
    id: "ATOM",
    name: "Cosmos Hub",
    symbol: "ATOM",
    category: "Cosmos",
    type: "IBC Gateway",
    isMainnet: true,
    desc: "Mạng trung tâm điều phối và kết nối thông suốt vạn vạn tinh cầu blockchain qua chuẩn IBC.",
    features: ["Interchain Security", "IBC Protocols", "Cosmos SDK API"]
  },
  {
    id: "OSMO",
    name: "Osmosis",
    symbol: "OSMO",
    category: "Cosmos",
    type: "Appchain AMM DEX",
    isMainnet: true,
    desc: "Hồ thanh khoản và trung tâm giao dịch chéo IBC sầm uất bậc nhất hệ Cosmos.",
    features: ["Superfluid Staking", "CosmWasm Engine", "IBC Swap APIs"]
  },
  {
    id: "INJ",
    name: "Injective",
    symbol: "INJ",
    category: "Cosmos",
    type: "Fintech Appchain L1",
    isMainnet: true,
    desc: "Blockchain tốc độ cao tối ưu riêng cho mảng tài chính Web3, hỗ trợ hợp đồng CosmWasm tự chạy.",
    features: ["Frequent Batch Auctions", "CosmWasm Smart Contracts", "EVM Bridge"]
  },
  {
    id: "SEI",
    name: "Sei Network",
    symbol: "SEI",
    category: "Cosmos",
    type: "Trading Appchain",
    isMainnet: true,
    desc: "Sản phẩm Layer 1 nhanh nhất ngành công nghiệp Web3 tối ưu hóa sâu dưới tầng mạng cho giao dịch.",
    features: ["Twin-Turbo Consensus", "Parallel EVM (Sei V2)", "Central Orderbook Engine"]
  },
  {
    id: "TIA",
    name: "Celestia",
    symbol: "TIA",
    category: "Cosmos",
    type: "Modular Data Availability",
    isMainnet: true,
    desc: "Mạng phân bổ dữ liệu dạng Modular đầu tiên hỗ trợ khởi tạo Appchains thần tốc.",
    features: ["Data Availability Sampling (DAS)", "Namespaced Merkle Trees", "RPC Services"]
  },
  {
    id: "RUNE",
    name: "THORChain",
    symbol: "RUNE",
    category: "Cosmos",
    type: "Decentralized Liquidity",
    isMainnet: true,
    desc: "Thanh khoản liên chuỗi gốc cho phép hoán đổi BTC, ETH, LTC trực tiếp không cần bọc (wrap).",
    features: ["Cross-chain native Pools", "Asgard MPC Wallets", "C-Chain API"]
  },

  // --- Multichain Polkadot / Kusama ---
  {
    id: "DOT",
    name: "Polkadot Relay Chain",
    symbol: "DOT",
    category: "Enterprise/Smart",
    type: "Relay Security Chain",
    isMainnet: true,
    desc: "Trọng tâm bảo vệ an ninh và luân chuyển tài liệu mật giữa các Parachain.",
    features: ["Substrate Nodes API", "Parachain Auctions", "NPoS Consensus Model"]
  },
  {
    id: "KSM",
    name: "Kusama Canary",
    symbol: "KSM",
    category: "Enterprise/Smart",
    type: "Canary Network",
    isMainnet: true,
    desc: "Sân chơi hoang dã kiểm nghiệm hợp đồng và cơ chế Polkadot trước khi phát hành.",
    features: ["Rapid Upgrade Logic", "Parachain connectivity"]
  },

  // --- Enterprise / Special Appchains ---
  {
    id: "IMX",
    name: "Immutable X",
    symbol: "IMX",
    category: "Enterprise/Smart",
    type: "StarkEx Validium L2",
    isMainnet: true,
    desc: "Mạng giao dịch NFT cho trò chơi quy mô lớn không tốn phí gas do StarkWare kiểm định.",
    features: ["Zero-gas NFT Minting", "StarkEx Validium Rolls", "Instant Trading API"]
  },
  {
    id: "SHARDEUM",
    name: "Shardeum",
    symbol: "SHM",
    category: "Enterprise/Smart",
    type: "Dynamic Sharding",
    isMainnet: true,
    desc: "EVM mở rộng tuyến tính dựa trên phân chia phân mảnh động tự điều phối lưu lượng cực thông minh.",
    features: ["Dynamic Compute Sharding", "Linear scalability", "Auto-load-balancing"]
  },
  {
    id: "CSPR",
    name: "Casper Network",
    symbol: "CSPR",
    category: "Enterprise/Smart",
    type: "Proof of Stake (CBC-Casper)",
    isMainnet: true,
    desc: "Định dạng hợp đồng có thể nâng cấp mượt mà cho doanh nghiệp lớn.",
    features: ["Upgradable Smart Contracts", "WebAssembly VM", "Multi-sig standard accounts"]
  },
  {
    id: "ZIL",
    name: "Zilliqa",
    symbol: "ZIL",
    category: "Enterprise/Smart",
    type: "Sharded Smart Chain",
    isMainnet: true,
    desc: "Hệ thống đầu tiên áp dụng Sharding thương mại sử dụng ngôn ngữ Scilla bảo mật.",
    features: ["Scilla smart contracts", "Network Sharding Nodes"]
  },
  {
    id: "XRD",
    name: "Radix Network",
    symbol: "XRD",
    category: "Enterprise/Smart",
    type: "Asset-Oriented DeFi Platform",
    isMainnet: true,
    desc: "Cấu hình Scrypto lập trình hướng tài sản loại bỏ hoàn toàn các lỗ hổng hack thông dụng.",
    features: ["Scrypto smart language", "Cerberus Consensus", "Radix Engine"]
  },

  // --- Populated EVM Testnets ---
  {
    id: "SEPOLIA",
    name: "Ethereum Sepolia Testnet",
    symbol: "ETH-Sepolia",
    category: "Testnet",
    type: "EVM Testnet Network",
    isMainnet: false,
    desc: "Mạng lưới thử nghiệm mặc định chuẩn hóa hiện hành của máy chủ Ethereum.",
    features: ["Testnet RPC Nodes", "Faucet support", "Proof of Work Faucet compatibility"]
  },
  {
    id: "HOLESKY",
    name: "Ethereum Holesky Testnet",
    symbol: "ETH-Holesky",
    category: "Testnet",
    type: "EVM Testnet Network",
    isMainnet: false,
    desc: "Thay thế Goerli phục vụ kiểm nghiệm cơ chế Staking, cơ sở tầng và Validator chịu lực cao.",
    features: ["Staking Testnet RPC", "Large Alloc Faucets"]
  },
  {
    id: "AMOY",
    name: "Polygon Amoy Testnet",
    symbol: "POL-Amoy",
    category: "Testnet",
    type: "EVM L2/Sidechain Testnet",
    isMainnet: false,
    desc: "Mạng rễ nhánh thử nghiệm chính thức của Polygon thay thế cho Mumbai PoS cũ kỹ.",
    features: ["Amoy Faucet", "Smart Contract deployment", "Gas rates testing"]
  },
  {
    id: "BSC_TEST",
    name: "BNB Smart Chain Testnet",
    symbol: "BNB-Test",
    category: "Testnet",
    type: "EVM Testnet Network",
    isMainnet: false,
    desc: "Chạy giả lập hoàn chỉnh môi trường BSC cho kiểm tra ứng dụng DApp.",
    features: ["BNB Faucet link", "RPC integration test"]
  },
  {
    id: "SOL_DEVNET",
    name: "Solana Devnet / Testnet",
    symbol: "SOL-Dev",
    category: "Testnet",
    type: "Non-EVM Devnet",
    isMainnet: false,
    desc: "Bản thử nghiệm song song cập nhật liên chuyển mã khóa SPL Solana.",
    features: ["Airdrop command line support", "RPC Explorer devs"]
  },
  {
    id: "TRX_SHASTA",
    name: "TRON Shasta Testnet",
    symbol: "TRX-Shasta",
    category: "Testnet",
    type: "Non-EVM Testnet",
    isMainnet: false,
    desc: "Khu vực thử nghiệm nứt nẻ phí băng thông và giao dịch USDT TRC20 vô song.",
    features: ["Shasta Faucet API", "TRC20 Deployment tests"]
  },
  {
    id: "XRP_TEST",
    name: "XRP Ledger Testnet",
    symbol: "XRP-Test",
    category: "Testnet",
    type: "Non-EVM Testnet",
    isMainnet: false,
    desc: "Bản phân dực cấp phát 1000 Test-XRP ngay tức thời từ cổng faucet.",
    features: ["Mock ledger resets", "Bithomp tester", "Destination tags simulation"]
  },
  {
    id: "SUI_TESTNET",
    name: "Sui Testnet",
    symbol: "SUI-Test",
    category: "Testnet",
    type: "Non-EVM Testnet",
    isMainnet: false,
    desc: "Đường truyền thử nghiệm đối tượng Move và tải hiệu quả giao dịch song song.",
    features: ["Sui Move module verification", "Testnet faucet request"]
  },
  {
    id: "APTOS_TESTNET",
    name: "Aptos Testnet",
    symbol: "APT-Test",
    category: "Testnet",
    type: "Non-EVM Testnet",
    isMainnet: false,
    desc: "Cho phép nạp mã Move modules và thử nghiệm tốc độ khối cực hạn.",
    features: ["Faucet integration", "RPC node debugger"]
  },
  {
    id: "NEAR_TESTNET",
    name: "Near Testnet",
    symbol: "NEAR-Test",
    category: "Testnet",
    type: "Non-EVM Testnet",
    isMainnet: false,
    desc: "Môi trường phân bổ Sandbox an toàn cho kiểm toán tài khoản chữ dễ đọc.",
    features: ["Near CLI helper support", "Near Blocks Dev Explorer"]
  },
  {
    id: "CELO_ALFAJORES",
    name: "Celo Alfajores Testnet",
    symbol: "CELO-Alfa",
    category: "Testnet",
    type: "EVM Mobile-First Testnet",
    isMainnet: false,
    desc: "Thử nghiệm cơ chế định địa chỉ mạng qua số điện thoại cục bộ trực quan.",
    features: ["Phone map verification", "Test cUSD stablecoin"]
  },
  {
    id: "AVAX_FUJI",
    name: "Avalanche Fuji Testnet",
    symbol: "AVAX-Fuji",
    category: "Testnet",
    type: "EVM Testnet Network",
    isMainnet: false,
    desc: "Cung cấp phân mảnh C-Chain thử nghiệm liên kết các dApps tài chính của Avalanche.",
    features: ["Fuji faucet", "Core Bridge testing"]
  }
];
