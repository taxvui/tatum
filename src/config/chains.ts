export interface ExplorerPaths {
  address: string;
  tx: string;
  token: string;
  block: string;
}

export interface NetworkConfig {
  id: string; // e.g., "ETH", "BASE", "SOL"
  name: string;
  shortName: string;
  symbol: string;
  color: string;
  bgGrad: string;
  hasXpub: boolean;
  testnetSupport: boolean;
  path: string;
  desc: string;
  category: "EVM" | "UTXO" | "L2" | "Non-EVM" | "Meme/Alt";
  isCoreSupported?: boolean;
  chainId?: {
    mainnet: number;
    testnet: number;
  };
  rpcUrls?: {
    mainnet: string[];
    testnet: string[];
  };
  explorers: {
    mainnet: ExplorerPaths;
    testnet: ExplorerPaths;
  };
  faucets?: string[];
}

const safeEnv = (key: string, backup: string): string => {
  try {
    return (import.meta as any).env?.[key] || backup;
  } catch {
    return backup;
  }
};

export const CHAINS_METADATA: NetworkConfig[] = [
  {
    id: "ETH",
    name: "Ethereum",
    shortName: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    bgGrad: "from-[#627EEA]/10 to-[#627EEA]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Nền tảng hợp đồng thông minh hàng đầu. Sử dụng chuẩn derive m/44'/60'/0'/0 cho địa chỉ.",
    category: "EVM",
    isCoreSupported: true,
    chainId: {
      mainnet: 1,
      testnet: 11155111
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_ETH_RPC", "https://cloudflare-eth.com"),
        "https://eth.llamarpc.com",
        "https://rpc.ankr.com/eth"
      ],
      testnet: [
        safeEnv("VITE_ETH_SEPOLIA_RPC", "https://rpc.ankr.com/eth_sepolia"),
        "https://ethereum-sepolia-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://etherscan.io/address/{address}",
        tx: "https://etherscan.io/tx/{tx}",
        token: "https://etherscan.io/token/{token}",
        block: "https://etherscan.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia.etherscan.io/address/{address}",
        tx: "https://sepolia.etherscan.io/tx/{tx}",
        token: "https://sepolia.etherscan.io/token/{token}",
        block: "https://sepolia.etherscan.io/block/{block}"
      }
    },
    faucets: [
      "https://sepoliafaucet.com",
      "https://faucet.quicknode.com/ethereum/sepolia",
      "https://infura.io/faucet/sepolia"
    ]
  },
  {
    id: "BASE",
    name: "Base",
    shortName: "Base",
    symbol: "ETH",
    color: "#0052FF",
    bgGrad: "from-[#0052FF]/10 to-[#0052FF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới Layer 2 siêu nhanh, an toàn do Coinbase phát triển trên nền tảng của OP Stack.",
    category: "L2",
    isCoreSupported: true,
    chainId: {
      mainnet: 8453,
      testnet: 84532
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_BASE_RPC", "https://mainnet.base.org"),
        "https://base.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_BASE_SEPOLIA_RPC", "https://sepolia.base.org"),
        "https://base-sepolia-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://basescan.org/address/{address}",
        tx: "https://basescan.org/tx/{tx}",
        token: "https://basescan.org/token/{token}",
        block: "https://basescan.org/block/{block}"
      },
      testnet: {
        address: "https://sepolia.basescan.org/address/{address}",
        tx: "https://sepolia.basescan.org/tx/{tx}",
        token: "https://sepolia.basescan.org/token/{token}",
        block: "https://sepolia.basescan.org/block/{block}"
      }
    },
    faucets: [
      "https://faucet.quicknode.com/base/sepolia",
      "https://sepoliafaucet.com"
    ]
  },
  {
    id: "ARBITRUM",
    name: "Arbitrum One",
    shortName: "Arbitrum",
    symbol: "ARB",
    color: "#28A0F0",
    bgGrad: "from-[#28A0F0]/10 to-[#28A0F0]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Giải pháp mở rộng rollup của L2 hàng đầu giúp hạ phí gas cực sâu trên Ethereum.",
    category: "L2",
    isCoreSupported: false,
    chainId: {
      mainnet: 42161,
      testnet: 421614
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_ARB_RPC", "https://arb1.arbitrum.io/rpc"),
        "https://arbitrum.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_ARB_SEPOLIA_RPC", "https://sepolia-rollup.arbitrum.io/rpc"),
        "https://arbitrum-sepolia-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://arbiscan.io/address/{address}",
        tx: "https://arbiscan.io/tx/{tx}",
        token: "https://arbiscan.io/token/{token}",
        block: "https://arbiscan.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia.arbiscan.io/address/{address}",
        tx: "https://sepolia.arbiscan.io/tx/{tx}",
        token: "https://sepolia.arbiscan.io/token/{token}",
        block: "https://sepolia.arbiscan.io/block/{block}"
      }
    },
    faucets: [
      "https://faucet.quicknode.com/arbitrum/sepolia",
      "https://sepoliafaucet.com"
    ]
  },
  {
    id: "OPTIMISM",
    name: "Optimism",
    shortName: "Optimism",
    symbol: "OP",
    color: "#FF0420",
    bgGrad: "from-[#FF0420]/10 to-[#FF0420]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Optimistic Rollup L2 hiệu suất cao, cơ kết cấu OP Stack phi tập trung vững mạnh.",
    category: "L2",
    isCoreSupported: false,
    chainId: {
      mainnet: 10,
      testnet: 11155420
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_OP_RPC", "https://mainnet.optimism.io"),
        "https://optimism.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_OP_SEPOLIA_RPC", "https://sepolia.optimism.io"),
        "https://optimism-sepolia-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://optimistic.etherscan.io/address/{address}",
        tx: "https://optimistic.etherscan.io/tx/{tx}",
        token: "https://optimistic.etherscan.io/token/{token}",
        block: "https://optimistic.etherscan.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia-optimism.etherscan.io/address/{address}",
        tx: "https://sepolia-optimism.etherscan.io/tx/{tx}",
        token: "https://sepolia-optimism.etherscan.io/token/{token}",
        block: "https://sepolia-optimism.etherscan.io/block/{block}"
      }
    },
    faucets: [
      "https://faucet.quicknode.com/optimism/sepolia",
      "https://sepoliafaucet.com"
    ]
  },
  {
    id: "POLYGON",
    name: "Polygon MATIC",
    shortName: "Polygon",
    symbol: "MATIC",
    color: "#8247E5",
    bgGrad: "from-[#8247E5]/10 to-[#8247E5]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Giải pháp Layer-2 mở rộng danh tiếng cho Ethereum tương thích hoàn toàn EVM.",
    category: "L2",
    isCoreSupported: true,
    chainId: {
      mainnet: 137,
      testnet: 80002
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_POLYGON_RPC", "https://polygon-rpc.com"),
        "https://polygon.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_POLYGON_AMOY_RPC", "https://rpc-amoy.polygon.technology"),
        "https://polygon-amoy-bor-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://polygonscan.com/address/{address}",
        tx: "https://polygonscan.com/tx/{tx}",
        token: "https://polygonscan.com/token/{token}",
        block: "https://polygonscan.com/block/{block}"
      },
      testnet: {
        address: "https://amoy.polygonscan.com/address/{address}",
        tx: "https://amoy.polygonscan.com/tx/{tx}",
        token: "https://amoy.polygonscan.com/token/{token}",
        block: "https://amoy.polygonscan.com/block/{block}"
      }
    },
    faucets: [
      "https://faucet.polygon.technology",
      "https://faucet.quicknode.com/polygon/amoy"
    ]
  },
  {
    id: "BSC",
    name: "BNB Smart Chain",
    shortName: "BSC",
    symbol: "BNB",
    color: "#F3BA2F",
    bgGrad: "from-[#F3BA2F]/10 to-[#F3BA2F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới phí gas rẻ tương thích EVM của Binance. Định dạng giống Ethereum.",
    category: "EVM",
    isCoreSupported: true,
    chainId: {
      mainnet: 56,
      testnet: 97
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_BSC_RPC", "https://bsc-dataseed.binance.org"),
        "https://binance.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_BSC_TESTNET_RPC", "https://data-seed-prebsc-1-s1.binance.org:8545"),
        "https://bsc-testnet-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://bscscan.com/address/{address}",
        tx: "https://bscscan.com/tx/{tx}",
        token: "https://bscscan.com/token/{token}",
        block: "https://bscscan.com/block/{block}"
      },
      testnet: {
        address: "https://testnet.bscscan.com/address/{address}",
        tx: "https://testnet.bscscan.com/tx/{tx}",
        token: "https://testnet.bscscan.com/token/{token}",
        block: "https://testnet.bscscan.com/block/{block}"
      }
    },
    faucets: [
      "https://testnet.bnbchain.org/faucet-smart",
      "https://faucet.quicknode.com/binance-smart-chain/bnbs-testnet"
    ]
  },
  {
    id: "AVAX",
    name: "Avalanche C-Chain",
    shortName: "Avalanche",
    symbol: "AVAX",
    color: "#E84142",
    bgGrad: "from-[#E84142]/10 to-[#E84142]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Phân mảnh C-Chain tương thích hoàn hảo EVM với cơ chế đồng thuận Avalanche hiệu suất cao.",
    category: "EVM",
    isCoreSupported: false,
    chainId: {
      mainnet: 43114,
      testnet: 43113
    },
    rpcUrls: {
      mainnet: [
        safeEnv("VITE_AVAX_RPC", "https://api.avax.network/ext/bc/C/rpc"),
        "https://avalanche.llamarpc.com"
      ],
      testnet: [
        safeEnv("VITE_AVAX_FUJI_RPC", "https://api.avax-test.network/ext/bc/C/rpc"),
        "https://avalanche-fuji-c-chain-rpc.publicnode.com"
      ]
    },
    explorers: {
      mainnet: {
        address: "https://snowtrace.io/address/{address}",
        tx: "https://snowtrace.io/tx/{tx}",
        token: "https://snowtrace.io/token/{token}",
        block: "https://snowtrace.io/block/{block}"
      },
      testnet: {
        address: "https://testnet.snowtrace.io/address/{address}",
        tx: "https://testnet.snowtrace.io/tx/{tx}",
        token: "https://testnet.snowtrace.io/token/{token}",
        block: "https://testnet.snowtrace.io/block/{block}"
      }
    },
    faucets: [
      "https://faucet.avax.network",
      "https://core.app/tools/testnet-faucet"
    ]
  },
  {
    id: "LINEA",
    name: "Linea",
    shortName: "Linea",
    symbol: "ETH",
    color: "#60D9FA",
    bgGrad: "from-[#60D9FA]/10 to-slate-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "L2 zkEVM đôn đốc bảo mật bởi ConsenSys cho trải nghiệm Ethereum không giới hạn.",
    category: "L2",
    chainId: {
      mainnet: 59144,
      testnet: 59141
    },
    rpcUrls: {
      mainnet: ["https://rpc.linea.build"],
      testnet: ["https://rpc.sepolia.linea.build"]
    },
    explorers: {
      mainnet: {
        address: "https://lineascan.build/address/{address}",
        tx: "https://lineascan.build/tx/{tx}",
        token: "https://lineascan.build/token/{token}",
        block: "https://lineascan.build/block/{block}"
      },
      testnet: {
        address: "https://sepolia.lineascan.build/address/{address}",
        tx: "https://sepolia.lineascan.build/tx/{tx}",
        token: "https://sepolia.lineascan.build/token/{token}",
        block: "https://sepolia.lineascan.build/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/linea/sepolia"]
  },
  {
    id: "ZKSYNC",
    name: "zkSync Era",
    shortName: "zkSync",
    symbol: "ETH",
    color: "#3F8CFF",
    bgGrad: "from-[#3F8CFF]/10 to-[#3F8CFF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "zk-Rollup tin cậy hỗ trợ mở rộng Ethereum với vận tốc cực nhanh và bảo mật tuyệt đối.",
    category: "L2",
    chainId: {
      mainnet: 324,
      testnet: 300
    },
    rpcUrls: {
      mainnet: ["https://mainnet.era.zksync.io"],
      testnet: ["https://sepolia.era.zksync.dev"]
    },
    explorers: {
      mainnet: {
        address: "https://explorer.zksync.io/address/{address}",
        tx: "https://explorer.zksync.io/tx/{tx}",
        token: "https://explorer.zksync.io/token/{token}",
        block: "https://explorer.zksync.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia.explorer.zksync.io/address/{address}",
        tx: "https://sepolia.explorer.zksync.io/tx/{tx}",
        token: "https://sepolia.explorer.zksync.io/token/{token}",
        block: "https://sepolia.explorer.zksync.io/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/zksync/sepolia"]
  },
  {
    id: "SCROLL",
    name: "Scroll",
    shortName: "Scroll",
    symbol: "ETH",
    color: "#F2F0EB",
    bgGrad: "from-slate-700/10 to-slate-800/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Giải pháp zkEVM tương đương EVM cấp độ byte-code toàn diện cho Ethereum.",
    category: "L2",
    chainId: {
      mainnet: 534352,
      testnet: 534351
    },
    rpcUrls: {
      mainnet: ["https://rpc.scroll.io"],
      testnet: ["https://sepolia-rpc.scroll.io"]
    },
    explorers: {
      mainnet: {
        address: "https://scrollscan.com/address/{address}",
        tx: "https://scrollscan.com/tx/{tx}",
        token: "https://scrollscan.com/token/{token}",
        block: "https://scrollscan.com/block/{block}"
      },
      testnet: {
        address: "https://sepolia.scrollscan.com/address/{address}",
        tx: "https://sepolia.scrollscan.com/tx/{tx}",
        token: "https://sepolia.scrollscan.com/token/{token}",
        block: "https://sepolia.scrollscan.com/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/scroll/sepolia"]
  },
  {
    id: "BLAST",
    name: "Blast",
    shortName: "Blast",
    symbol: "ETH",
    color: "#FCFC03",
    bgGrad: "from-[#FCFC03]/10 to-[#FCFC03]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới L2 duy nhất tích hợp sẵn lợi suất tự động cho cả ETH và stablecoins.",
    category: "L2",
    chainId: {
      mainnet: 81457,
      testnet: 168587773
    },
    rpcUrls: {
      mainnet: ["https://rpc.blast.io"],
      testnet: ["https://sepolia.blast.io"]
    },
    explorers: {
      mainnet: {
        address: "https://blastscan.io/address/{address}",
        tx: "https://blastscan.io/tx/{tx}",
        token: "https://blastscan.io/token/{token}",
        block: "https://blastscan.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia.blastscan.io/address/{address}",
        tx: "https://sepolia.blastscan.io/tx/{tx}",
        token: "https://sepolia.blastscan.io/token/{token}",
        block: "https://sepolia.blastscan.io/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/blast/sepolia"]
  },
  {
    id: "MANTLE",
    name: "Mantle",
    shortName: "Mantle",
    symbol: "MNT",
    color: "#000000",
    bgGrad: "from-amber-600/10 to-teal-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "L2 hiệu quả tối ưu nhờ cấu khống mô-đun hóa với lớp khả dụng dữ liệu EigenDA.",
    category: "L2",
    chainId: {
      mainnet: 5000,
      testnet: 5003
    },
    rpcUrls: {
      mainnet: ["https://rpc.mantle.xyz"],
      testnet: ["https://rpc.sepolia.mantle.xyz"]
    },
    explorers: {
      mainnet: {
        address: "https://mantlescan.info/address/{address}",
        tx: "https://mantlescan.info/tx/{tx}",
        token: "https://mantlescan.info/token/{token}",
        block: "https://mantlescan.info/block/{block}"
      },
      testnet: {
        address: "https://explorer.sepolia.mantle.xyz/address/{address}",
        tx: "https://explorer.sepolia.mantle.xyz/tx/{tx}",
        token: "https://explorer.sepolia.mantle.xyz/token/{token}",
        block: "https://explorer.sepolia.mantle.xyz/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/mantle/sepolia"]
  },
  {
    id: "MODE",
    name: "Mode",
    shortName: "Mode",
    symbol: "ETH",
    color: "#DFFE00",
    bgGrad: "from-[#DFFE00]/10 to-slate-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới L2 thiết kế chuyên biệt cho DeFi cộng tác phát triển thông qua phân phối động doanh thu.",
    category: "L2",
    chainId: {
      mainnet: 34443,
      testnet: 919
    },
    rpcUrls: {
      mainnet: ["https://mainnet.mode.network"],
      testnet: ["https://sepolia.mode.network"]
    },
    explorers: {
      mainnet: {
        address: "https://modescan.io/address/{address}",
        tx: "https://modescan.io/tx/{tx}",
        token: "https://modescan.io/token/{token}",
        block: "https://modescan.io/block/{block}"
      },
      testnet: {
        address: "https://sepolia.modescan.io/address/{address}",
        tx: "https://sepolia.modescan.io/tx/{tx}",
        token: "https://sepolia.modescan.io/token/{token}",
        block: "https://sepolia.modescan.io/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/mode/sepolia"]
  },
  {
    id: "OPBNB",
    name: "opBNB",
    shortName: "opBNB",
    symbol: "BNB",
    color: "#F3BA2F",
    bgGrad: "from-[#F3BA2F]/15 to-amber-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng L2 dựa trên OP Stack tối ưu tuyệt đối cho BNB và phát triển game quy mô lớn.",
    category: "L2",
    chainId: {
      mainnet: 204,
      testnet: 5611
    },
    rpcUrls: {
      mainnet: ["https://opbnb-mainnet-rpc.bnbchain.org"],
      testnet: ["https://opbnb-testnet-rpc.bnbchain.org"]
    },
    explorers: {
      mainnet: {
        address: "https://opbnbscan.com/address/{address}",
        tx: "https://opbnbscan.com/tx/{tx}",
        token: "https://opbnbscan.com/token/{token}",
        block: "https://opbnbscan.com/block/{block}"
      },
      testnet: {
        address: "https://opbnb-testnet.bscscan.com/address/{address}",
        tx: "https://opbnb-testnet.bscscan.com/tx/{tx}",
        token: "https://opbnb-testnet.bscscan.com/token/{token}",
        block: "https://opbnb-testnet.bscscan.com/block/{block}"
      }
    },
    faucets: ["https://testnet.bnbchain.org/faucet-smart"]
  },
  {
    id: "BERACHAIN",
    name: "Berachain",
    shortName: "Berachain",
    symbol: "BERA",
    color: "#904d00",
    bgGrad: "from-amber-850/10 to-[#904d00]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockchain L1 tiên phong cơ chế đồng thuận Proof of Liquidity đồng tương đương EVM.",
    category: "EVM",
    chainId: {
      mainnet: 80094,
      testnet: 80084
    },
    rpcUrls: {
      mainnet: ["https://rpc.berachain.com"],
      testnet: ["https://bartio.rpc.berachain.com"]
    },
    explorers: {
      mainnet: {
        address: "https://berascan.com/address/{address}",
        tx: "https://berascan.com/tx/{tx}",
        token: "https://berascan.com/token/{token}",
        block: "https://berascan.com/block/{block}"
      },
      testnet: {
        address: "https://bartio.beratrail.io/address/{address}",
        tx: "https://bartio.beratrail.io/tx/{tx}",
        token: "https://bartio.beratrail.io/token/{token}",
        block: "https://bartio.beratrail.io/block/{block}"
      }
    },
    faucets: ["https://bartio.faucet.berachain.com"]
  },
  {
    id: "SONIC",
    name: "Sonic",
    shortName: "Sonic",
    symbol: "S",
    color: "#1A56DB",
    bgGrad: "from-blue-600/10 to-[#1A56DB]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới EVM tiên tiến có khối lượng giao dịch cực cao, cải tiến kế thừa từ Fantom.",
    category: "EVM",
    chainId: {
      mainnet: 146,
      testnet: 57054
    },
    rpcUrls: {
      mainnet: ["https://rpc.soniclabs.com"],
      testnet: ["https://rpc.blaze.soniclabs.com"]
    },
    explorers: {
      mainnet: {
        address: "https://sonicscan.org/address/{address}",
        tx: "https://sonicscan.org/tx/{tx}",
        token: "https://sonicscan.org/token/{token}",
        block: "https://sonicscan.org/block/{block}"
      },
      testnet: {
        address: "https://testnet.sonicscan.org/address/{address}",
        tx: "https://testnet.sonicscan.org/tx/{tx}",
        token: "https://testnet.sonicscan.org/token/{token}",
        block: "https://testnet.sonicscan.org/block/{block}"
      }
    },
    faucets: ["https://faucet.soniclabs.com"]
  },
  {
    id: "UNICHAIN",
    name: "Unichain",
    shortName: "Unichain",
    symbol: "UNI",
    color: "#FF007A",
    bgGrad: "from-[#FF007A]/10 to-pink-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockshain L2 tối ưu tập trung dành riêng cho DeFi phát triển bởi dự án Uniswap Labs.",
    category: "L2",
    chainId: {
      mainnet: 130,
      testnet: 1301
    },
    rpcUrls: {
      mainnet: ["https://mainnet.unichain.org"],
      testnet: ["https://sepolia.unichain.org"]
    },
    explorers: {
      mainnet: {
        address: "https://uniscan.xyz/address/{address}",
        tx: "https://uniscan.xyz/tx/{tx}",
        token: "https://uniscan.xyz/token/{token}",
        block: "https://uniscan.xyz/block/{block}"
      },
      testnet: {
        address: "https://sepolia.uniscan.xyz/address/{address}",
        tx: "https://sepolia.uniscan.xyz/tx/{tx}",
        token: "https://sepolia.uniscan.xyz/token/{token}",
        block: "https://sepolia.uniscan.xyz/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/unichain/sepolia"]
  },
  {
    id: "WORLD",
    name: "World Chain",
    shortName: "World Chain",
    symbol: "WLD",
    color: "#000000",
    bgGrad: "from-slate-800/15 to-slate-900/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới L2 thiết lập danh tính hữu nhân số, đồng kiến tạo bởi World Protocol.",
    category: "L2",
    chainId: {
      mainnet: 480,
      testnet: 4801
    },
    rpcUrls: {
      mainnet: ["https://worldchain-mainnet.g.allacronyms.com"], // Generic backup
      testnet: ["https://sepolia.worldchain.dev"]
    },
    explorers: {
      mainnet: {
        address: "https://worldscan.org/address/{address}",
        tx: "https://worldscan.org/tx/{tx}",
        token: "https://worldscan.org/token/{token}",
        block: "https://worldscan.org/block/{block}"
      },
      testnet: {
        address: "https://sepolia.worldscan.org/address/{address}",
        tx: "https://sepolia.worldscan.org/tx/{tx}",
        token: "https://sepolia.worldscan.org/token/{token}",
        block: "https://sepolia.worldscan.org/block/{block}"
      }
    },
    faucets: ["https://faucet.quicknode.com/worldchain/sepolia"]
  },
  // Supporting ALL previously listed UTXO, Meme, Alt or non-EVM chains ensuring fully intact operations
  {
    id: "BTC",
    name: "Bitcoin",
    shortName: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    bgGrad: "from-[#F7931A]/10 to-[#F7931A]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/0'/0'/0",
    desc: "Đồng tiền điện tử đầu tiên trên thế giới. Sử dụng định dạng địa chỉ SegWit hoặc kế thừa.",
    category: "UTXO",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://blockstream.info/address/{address}",
        tx: "https://blockstream.info/tx/{tx}",
        token: "https://blockstream.info/address/{address}",
        block: "https://blockstream.info/block/{block}"
      },
      testnet: {
        address: "https://blockstream.info/testnet/address/{address}",
        tx: "https://blockstream.info/testnet/tx/{tx}",
        token: "https://blockstream.info/testnet/address/{address}",
        block: "https://blockstream.info/testnet/block/{block}"
      }
    },
    faucets: [
      "https://bitcoinfaucet.uo1.net",
      "https://coinfaucet.eu/en/btc-testnet",
      "https://testnet-faucet.mempool.co"
    ]
  },
  {
    id: "TRX",
    name: "TRON",
    shortName: "TRON",
    symbol: "TRX",
    color: "#FF000F",
    bgGrad: "from-[#FF000F]/10 to-[#FF000F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/195'/0'/0",
    desc: "Mạng lưới tốc độ cao, phí thấp cho giao dịch USDT (TRC-20).",
    category: "Non-EVM",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://tronscan.org/#/address/{address}",
        tx: "https://tronscan.org/#/transaction/{tx}",
        token: "https://tronscan.org/#/token/{token}",
        block: "https://tronscan.org/#/block/{block}"
      },
      testnet: {
        address: "https://shasta.tronscan.org/#/address/{address}",
        tx: "https://shasta.tronscan.org/#/transaction/{tx}",
        token: "https://shasta.tronscan.org/#/token/{token}",
        block: "https://shasta.tronscan.org/#/block/{block}"
      }
    },
    faucets: [
      "https://shasta.tronex.io",
      "https://faucet.trongrid.io"
    ]
  },
  {
    id: "SOL",
    name: "Solana",
    shortName: "Solana",
    symbol: "SOL",
    color: "#14F195",
    bgGrad: "from-[#14F195]/10 to-[#9945FF]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "Standard Ed25519",
    desc: "Blockchain siêu tốc độ cao. Tạo trực tiếp 1 địa chỉ duy nhất cùng mã khóa riêng kèm theo.",
    category: "Non-EVM",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://solscan.io/account/{address}",
        tx: "https://solscan.io/tx/{tx}",
        token: "https://solscan.io/token/{token}",
        block: "https://solscan.io/block/{block}"
      },
      testnet: {
        address: "https://solscan.io/account/{address}?cluster=devnet",
        tx: "https://solscan.io/tx/{tx}?cluster=devnet",
        token: "https://solscan.io/token/{token}?cluster=devnet",
        block: "https://solscan.io/block/{block}?cluster=devnet"
      }
    },
    faucets: [
      "https://faucet.solana.com",
      "https://solfaucet.com"
    ]
  },
  {
    id: "ADA",
    name: "Cardano",
    shortName: "Cardano",
    symbol: "ADA",
    color: "#0033AD",
    bgGrad: "from-[#0033AD]/10 to-[#0033AD]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/1852'/1815'/0'",
    desc: "Blockchain thế hệ thứ 3 bảo mật cao sử dụng mô hình UTxO cải tiến.",
    category: "UTXO",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://cardanoscan.io/address/{address}",
        tx: "https://cardanoscan.io/transaction/{tx}",
        token: "https://cardanoscan.io/token/{token}",
        block: "https://cardanoscan.io/block/{block}"
      },
      testnet: {
        address: "https://preprod.cardanoscan.io/address/{address}",
        tx: "https://preprod.cardanoscan.io/transaction/{tx}",
        token: "https://preprod.cardanoscan.io/token/{token}",
        block: "https://preprod.cardanoscan.io/block/{block}"
      }
    },
    faucets: [
      "https://docs.cardano.org/cardano-testnet/tools/faucet",
      "https://faucet.pkada.net"
    ]
  },
  {
    id: "DOGE",
    name: "Dogecoin",
    shortName: "Dogecoin",
    symbol: "DOGE",
    color: "#C2A633",
    bgGrad: "from-[#C2A633]/10 to-[#C2A633]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/3'/0'/0",
    desc: "Đồng tiền meme nổi tiếng toàn cầu dựa trên công nghệ Litecoin.",
    category: "Meme/Alt",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://blockchair.com/dogecoin/address/{address}",
        tx: "https://blockchair.com/dogecoin/transaction/{tx}",
        token: "https://blockchair.com/dogecoin/address/{address}",
        block: "https://blockchair.com/dogecoin/block/{block}"
      },
      testnet: {
        address: "https://blockchair.com/dogecoin/testnet/address/{address}",
        tx: "https://blockchair.com/dogecoin/testnet/transaction/{tx}",
        token: "https://blockchair.com/dogecoin/testnet/address/{address}",
        block: "https://blockchair.com/dogecoin/testnet/block/{block}"
      }
    },
    faucets: [
      "https://shibibeer.github.io/doge/",
      "https://testnet-faucet.com/doge"
    ]
  },
  {
    id: "LTC",
    name: "Litecoin",
    shortName: "Litecoin",
    symbol: "LTC",
    color: "#345C9C",
    bgGrad: "from-[#345C9C]/10 to-[#345C9C]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/2'/0'/0",
    desc: "Bản sao hoàn hảo của Bitcoin với tốc độ khối nhanh gấp 4 lần.",
    category: "UTXO",
    isCoreSupported: true,
    explorers: {
      mainnet: {
        address: "https://blockchair.com/litecoin/address/{address}",
        tx: "https://blockchair.com/litecoin/transaction/{tx}",
        token: "https://blockchair.com/litecoin/address/{address}",
        block: "https://blockchair.com/litecoin/block/{block}"
      },
      testnet: {
        address: "https://blockchair.com/litecoin/testnet/address/{address}",
        tx: "https://blockchair.com/litecoin/testnet/transaction/{tx}",
        token: "https://blockchair.com/litecoin/testnet/address/{address}",
        block: "https://blockchair.com/litecoin/testnet/block/{block}"
      }
    },
    faucets: [
      "https://faucet.egbdf.dev/ltc",
      "https://testnet-faucet.com/ltc"
    ]
  },
  {
    id: "XRP",
    name: "Ripple",
    shortName: "Ripple",
    symbol: "XRP",
    color: "#23292F",
    bgGrad: "from-[#23292F]/10 to-[#23292F]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/144'/0'/0'",
    desc: "Sổ cái phân tán tốc độ cao cho thanh toán ngân hàng quốc tế, hỗ trợ Destination Tag.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://xrpscan.com/account/{address}",
        tx: "https://xrpscan.com/tx/{tx}",
        token: "https://xrpscan.com/account/{address}",
        block: "https://xrpscan.com/block/{block}"
      },
      testnet: {
        address: "https://testnet.xrpscan.com/account/{address}",
        tx: "https://testnet.xrpscan.com/tx/{tx}",
        token: "https://testnet.xrpscan.com/account/{address}",
        block: "https://testnet.xrpscan.com/block/{block}"
      }
    },
    faucets: [
      "https://xrpl.org/xrp-testnet-faucet.html",
      "https://faucet.bithomp.com"
    ]
  },
  {
    id: "FTM",
    name: "Fantom",
    shortName: "Fantom",
    symbol: "FTM",
    color: "#1969FF",
    bgGrad: "from-[#1969FF]/10 to-[#1969FF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng có tốc độ đồng thuận aBFT nhanh nhất, tương thích EVM tuyệt đối.",
    category: "EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://ftmscan.com/address/{address}",
        tx: "https://ftmscan.com/tx/{tx}",
        token: "https://ftmscan.com/token/{token}",
        block: "https://ftmscan.com/block/{block}"
      },
      testnet: {
        address: "https://testnet.ftmscan.com/address/{address}",
        tx: "https://testnet.ftmscan.com/tx/{tx}",
        token: "https://testnet.ftmscan.com/token/{token}",
        block: "https://testnet.ftmscan.com/block/{block}"
      }
    },
    faucets: [
      "https://faucet.fantom.network"
    ]
  },
  {
    id: "ALGO",
    name: "Algorand",
    shortName: "Algorand",
    symbol: "ALGO",
    color: "#000000",
    bgGrad: "from-slate-800/10 to-slate-900/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/283'/0'/0'",
    desc: "Giao thức Pure Proof of Stake do giáo sỹ Silvio Micali của MIT sáng lập.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://explorer.perowallet.app/address/{address}",
        tx: "https://explorer.perowallet.app/tx/{tx}",
        token: "https://explorer.perowallet.app/address/{address}",
        block: "https://explorer.perowallet.app/block/{block}"
      },
      testnet: {
        address: "https://testnet.explorer.perowallet.app/address/{address}",
        tx: "https://testnet.explorer.perowallet.app/tx/{tx}",
        token: "https://testnet.explorer.perowallet.app/address/{address}",
        block: "https://testnet.explorer.perowallet.app/block/{block}"
      }
    },
    faucets: [
      "https://bank.testnet.algorand.network"
    ]
  },
  {
    id: "NEAR",
    name: "Near Protocol",
    shortName: "NEAR",
    symbol: "NEAR",
    color: "#000000",
    bgGrad: "from-slate-600/10 to-slate-550/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/397'/0'",
    desc: "Nền tảng Cloud Sharding thân thiện với nhà phát triển sử ngôn ngữ Rust.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://nearblocks.io/address/{address}",
        tx: "https://nearblocks.io/tx/{tx}",
        token: "https://nearblocks.io/token/{token}",
        block: "https://nearblocks.io/block/{block}"
      },
      testnet: {
        address: "https://testnet.nearblocks.io/address/{address}",
        tx: "https://testnet.nearblocks.io/tx/{tx}",
        token: "https://testnet.nearblocks.io/token/{token}",
        block: "https://testnet.nearblocks.io/block/{block}"
      }
    },
    faucets: [
      "https://near-faucet.io"
    ]
  },
  {
    id: "CELO",
    name: "Celo",
    shortName: "Celo",
    symbol: "CELO",
    color: "#35D07F",
    bgGrad: "from-[#35D07F]/10 to-[#35D07F]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/52752'/0'/0",
    desc: "Hệ sinh thái EVM thân thiện với di động, tập trung vào thanh toán ngang hàng toàn cầu.",
    category: "EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://celoscan.io/address/{address}",
        tx: "https://celoscan.io/tx/{tx}",
        token: "https://celoscan.io/token/{token}",
        block: "https://celoscan.io/block/{block}"
      },
      testnet: {
        address: "https://alfajores.celoscan.io/address/{address}",
        tx: "https://alfajores.celoscan.io/tx/{tx}",
        token: "https://alfajores.celoscan.io/token/{token}",
        block: "https://alfajores.celoscan.io/block/{block}"
      }
    },
    faucets: [
      "https://faucet.celo.org"
    ]
  },
  {
    id: "XLM",
    name: "Stellar",
    shortName: "Stellar",
    symbol: "XLM",
    color: "#000000",
    bgGrad: "from-slate-500/10 to-slate-400/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/148'/0'",
    desc: "Mạng lưới phi tập trung toàn cầu hỗ trợ trao đổi lưu trữ giá trị tiền tệ.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://stellar.expert/explorer/public/account/{address}",
        tx: "https://stellar.expert/explorer/public/tx/{tx}",
        token: "https://stellar.expert/explorer/public/asset/{token}",
        block: "https://stellar.expert/explorer/public/ledger/{block}"
      },
      testnet: {
        address: "https://stellar.expert/explorer/testnet/account/{address}",
        tx: "https://stellar.expert/explorer/testnet/tx/{tx}",
        token: "https://stellar.expert/explorer/testnet/asset/{token}",
        block: "https://stellar.expert/explorer/testnet/ledger/{block}"
      }
    },
    faucets: [
      "https://laboratory.stellar.org/#friendbot"
    ]
  },
  {
    id: "EGLD",
    name: "MultiversX (Elrond)",
    shortName: "MultiversX",
    symbol: "EGLD",
    color: "#1B47FF",
    bgGrad: "from-[#1B47FF]/10 to-[#1B47FF]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/508'/0'/0'",
    desc: "Kiến trúc State Sharding mở rộng vượt trội gấp 1000 lần blockchain cơ sở.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://explorer.multiversx.com/accounts/{address}",
        tx: "https://explorer.multiversx.com/transactions/{tx}",
        token: "https://explorer.multiversx.com/tokens/{token}",
        block: "https://explorer.multiversx.com/blocks/{block}"
      },
      testnet: {
        address: "https://testnet-explorer.multiversx.com/accounts/{address}",
        tx: "https://testnet-explorer.multiversx.com/transactions/{tx}",
        token: "https://testnet-explorer.multiversx.com/tokens/{token}",
        block: "https://testnet-explorer.multiversx.com/blocks/{block}"
      }
    },
    faucets: [
      "https://faucet.multiversx.com"
    ]
  },
  {
    id: "DOT",
    name: "Polkadot",
    shortName: "Polkadot",
    symbol: "DOT",
    color: "#E6007A",
    bgGrad: "from-[#E6007A]/10 to-[#E6007A]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/354'/0'/0'",
    desc: "Kiến trúc Multi-chain phân mảng hỗ trợ kết nối bảo mật chéo Parachain.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://polkadot.subscan.io/account/{address}",
        tx: "https://polkadot.subscan.io/extrinsic/{tx}",
        token: "https://polkadot.subscan.io/token/{token}",
        block: "https://polkadot.subscan.io/block/{block}"
      },
      testnet: {
        address: "https://westend.subscan.io/account/{address}",
        tx: "https://westend.subscan.io/extrinsic/{tx}",
        token: "https://westend.subscan.io/token/{token}",
        block: "https://westend.subscan.io/block/{block}"
      }
    }
  },
  {
    id: "FLOW",
    name: "Flow",
    shortName: "Flow",
    symbol: "FLOW",
    color: "#00EF8B",
    bgGrad: "from-[#00EF8B]/10 to-[#00EF8B]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/539'/0'/0'",
    desc: "Giao thức hiệu suất cao thân thiện với NFT và dApps thương mại tiêu dùng thế hệ mới.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://flowscan.io/account/{address}",
        tx: "https://flowscan.io/tx/{tx}",
        token: "https://flowscan.io/token/{token}",
        block: "https://flowscan.io/block/{block}"
      },
      testnet: {
        address: "https://testnet.flowscan.io/account/{address}",
        tx: "https://testnet.flowscan.io/tx/{tx}",
        token: "https://testnet.flowscan.io/token/{token}",
        block: "https://testnet.flowscan.io/block/{block}"
      }
    }
  },
  {
    id: "KLAY",
    name: "Klaytn (Kaia)",
    shortName: "Kaia",
    symbol: "KLAY",
    color: "#E27B13",
    bgGrad: "from-[#E27B13]/10 to-[#E27B13]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockchain định hướng doanh nghiệp hàng đầu Hàn Quốc phối hợp cùng Kakao.",
    category: "EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://kaiascan.io/address/{address}",
        tx: "https://kaiascan.io/tx/{tx}",
        token: "https://kaiascan.io/token/{token}",
        block: "https://kaiascan.io/block/{block}"
      },
      testnet: {
        address: "https://kairos.kaiascan.io/address/{address}",
        tx: "https://kairos.kaiascan.io/tx/{tx}",
        token: "https://kairos.kaiascan.io/token/{token}",
        block: "https://kairos.kaiascan.io/block/{block}"
      }
    }
  },
  {
    id: "CRONOS",
    name: "Cronos",
    shortName: "Cronos",
    symbol: "CRO",
    color: "#121B34",
    bgGrad: "from-[#121B34]/10 to-[#121B34]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Mạng lưới Cosmos SDK tương thích EVM đầu tiên phục vụ cho hệ sinh thái Crypto.com.",
    category: "EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://cronoscan.com/address/{address}",
        tx: "https://cronoscan.com/tx/{tx}",
        token: "https://cronoscan.com/token/{token}",
        block: "https://cronoscan.com/block/{block}"
      },
      testnet: {
        address: "https://explorer.cronos.org/testnet/address/{address}",
        tx: "https://explorer.cronos.org/testnet/tx/{tx}",
        token: "https://explorer.cronos.org/testnet/token/{token}",
        block: "https://explorer.cronos.org/testnet/block/{block}"
      }
    }
  },
  {
    id: "EOS",
    name: "EOS",
    shortName: "EOS",
    symbol: "EOS",
    color: "#000000",
    bgGrad: "from-slate-400/10 to-slate-200/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/194'/0'/0'",
    desc: "Hệ thống Delegated Proof of Stake cung cấp phí giao dịch bằng không.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://bloks.io/account/{address}",
        tx: "https://bloks.io/transaction/{tx}",
        token: "https://bloks.io/account/{address}",
        block: "https://bloks.io/block/{block}"
      },
      testnet: {
        address: "https://testnet.bloks.io/account/{address}",
        tx: "https://testnet.bloks.io/transaction/{tx}",
        token: "https://testnet.bloks.io/account/{address}",
        block: "https://testnet.bloks.io/block/{block}"
      }
    }
  },
  {
    id: "CHZ",
    name: "Chiliz",
    shortName: "Chiliz",
    symbol: "CHZ",
    color: "#CD0124",
    bgGrad: "from-[#CD0124]/10 to-[#CD0124]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/60'/0'/0",
    desc: "Blockchain tương thích EVM dành riêng cho thể thao, giải trí và fan token.",
    category: "EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://chiliscan.com/address/{address}",
        tx: "https://chiliscan.com/tx/{tx}",
        token: "https://chiliscan.com/token/{token}",
        block: "https://chiliscan.com/block/{block}"
      },
      testnet: {
        address: "https://testnet.chiliscan.com/address/{address}",
        tx: "https://testnet.chiliscan.com/tx/{tx}",
        token: "https://testnet.chiliscan.com/token/{token}",
        block: "https://testnet.chiliscan.com/block/{block}"
      }
    }
  },
  {
    id: "VET",
    name: "VeChain",
    shortName: "VeChain",
    symbol: "VET",
    color: "#15BDFF",
    bgGrad: "from-[#15BDFF]/10 to-[#15BDFF]/5",
    hasXpub: true,
    testnetSupport: true,
    path: "m/44'/818'/0'/0",
    desc: "Hệ thống quản lý chuỗi cung ứng minh bạch sử dụng cơ chế đồng thuận Proof of Authority.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://explore.vechain.org/accounts/{address}",
        tx: "https://explore.vechain.org/transactions/{tx}",
        token: "https://explore.vechain.org/accounts/{address}",
        block: "https://explore.vechain.org/blocks/{block}"
      },
      testnet: {
        address: "https://explore-testnet.vechain.org/accounts/{address}",
        tx: "https://explore-testnet.vechain.org/transactions/{tx}",
        token: "https://explore-testnet.vechain.org/accounts/{address}",
        block: "https://explore-testnet.vechain.org/blocks/{block}"
      }
    }
  },
  {
    id: "TEZOS",
    name: "Tezos",
    shortName: "Tezos",
    symbol: "XTZ",
    color: "#2B79FD",
    bgGrad: "from-[#2B79FD]/10 to-[#2B79FD]/5",
    hasXpub: false,
    testnetSupport: true,
    path: "m/44'/1729'/0'/0'",
    desc: "Nền tảng tự sửa đổi quy trình không cần hardfork, sử dụng ngôn ngữ Michelson siêu bảo mật.",
    category: "Non-EVM",
    isCoreSupported: false,
    explorers: {
      mainnet: {
        address: "https://tzkt.io/{address}",
        tx: "https://tzkt.io/{tx}",
        token: "https://tzkt.io/{token}",
        block: "https://tzkt.io/{block}"
      },
      testnet: {
        address: "https://ghostnet.tzkt.io/{address}",
        tx: "https://ghostnet.tzkt.io/{tx}",
        token: "https://ghostnet.tzkt.io/{token}",
        block: "https://ghostnet.tzkt.io/{block}"
      }
    },
    faucets: [
      "https://faucet.marigold.dev",
      "https://faucet.ghostnet.teztnets.com"
    ]
  }
];
