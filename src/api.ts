import { WalletData, DerivedKeypair, CmcCryptoAsset, CmcGlobalMetrics } from "./types";

export async function generateWallet(
  chain: string,
  network: "mainnet" | "testnet",
  customApiKey?: string
): Promise<WalletData> {
  const response = await fetch("/api/tatum/wallet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chain, network, customApiKey })
  });

  const textResponse = await response.text();
  let result;
  try {
    result = JSON.parse(textResponse);
  } catch (err) {
    throw new Error(`Phản hồi lỗi định dạng JSON từ hệ thống (Mã lỗi ${response.status}). Vui lòng nhập lại API Key Tatum hợp lệ.`);
  }

  if (!response.ok) {
    throw new Error(result.error || `Lỗi tạo ví: Status ${response.status}`);
  }

  return {
    id: `${chain}-${network}-${Date.now()}`,
    chain,
    network,
    mnemonic: result.mnemonic,
    xpub: result.xpub,
    address: result.address, // for Solana
    privateKey: result.privateKey, // for Solana
    createdAt: new Date().toISOString()
  };
}

export async function deriveAddress(
  chain: string,
  network: "mainnet" | "testnet",
  xpub: string,
  index: number,
  customApiKey?: string
): Promise<string> {
  const response = await fetch("/api/tatum/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chain, network, xpub, index, customApiKey })
  });

  const textResponse = await response.text();
  let result;
  try {
    result = JSON.parse(textResponse);
  } catch (err) {
    throw new Error(`Phản hồi lỗi định dạng JSON từ hệ thống khi xuất địa chỉ (Mã lỗi ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(result.error || `Lỗi xuất địa chỉ: Status ${response.status}`);
  }

  return result.address;
}

export async function derivePrivateKey(
  chain: string,
  network: "mainnet" | "testnet",
  mnemonic: string,
  index: number,
  customApiKey?: string
): Promise<string> {
  const response = await fetch("/api/tatum/private-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chain, network, mnemonic, index, customApiKey })
  });

  const textResponse = await response.text();
  let result;
  try {
    result = JSON.parse(textResponse);
  } catch (err) {
    throw new Error(`Phản hồi lỗi định dạng JSON từ hệ thống khi xuất khóa riêng (Mã lỗi ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(result.error || `Lỗi xuất khóa riêng: Status ${response.status}`);
  }

  return result.key;
}

export async function testApiKey(
  network: "mainnet" | "testnet",
  customApiKey?: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const response = await fetch("/api/tatum/test-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ network, customApiKey })
    });

    const textResponse = await response.text();
    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (err) {
      return { 
        success: false, 
        message: "Kiểm tra thất bại", 
        error: `Phản hồi lỗi định dạng từ máy chủ (Mã trạng thái ${response.status}). API Key có thể đã bị chặn, không tồn tại hoặc không chính xác.` 
      };
    }

    if (!response.ok) {
      return { success: false, message: "Kiểm tra thất bại", error: result.error || `Trạng thái: ${response.status}` };
    }
    return { success: true, message: result.message };
  } catch (error: any) {
    return { success: false, message: "Lỗi kết nối", error: error.message };
  }
}

export async function getCmcListings(params: {
  start?: number;
  limit?: number;
  convert?: string;
  sort?: string;
  sort_dir?: string;
} = {}): Promise<CmcCryptoAsset[]> {
  const query = new URLSearchParams();
  if (params.start !== undefined) query.append("start", String(params.start));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.convert !== undefined) query.append("convert", params.convert);
  if (params.sort !== undefined) query.append("sort", params.sort);
  if (params.sort_dir !== undefined) query.append("sort_dir", params.sort_dir);

  const response = await fetch(`/api/cmc/listings?${query.toString()}`);
  const textResponse = await response.text();
  
  let result;
  try {
    result = JSON.parse(textResponse);
  } catch (err) {
    throw new Error("Không thể đồng bộ dữ liệu thị trường (Phản hồi không phải định dạng JSON). Hệ thống đang chuyển sang chế độ dự phòng.");
  }

  if (!response.ok) {
    throw new Error(result.error || "Không thể tải danh sách tài sản từ CoinMarketCap API");
  }

  return result.data;
}

export async function getCmcGlobal(convert: string = "USD"): Promise<CmcGlobalMetrics> {
  const response = await fetch(`/api/cmc/global?convert=${convert}`);
  const textResponse = await response.text();

  let result;
  try {
    result = JSON.parse(textResponse);
  } catch (err) {
    throw new Error("Không thể đồng bộ chỉ số thị trường (Phản hồi không phải định dạng JSON).");
  }

  if (!response.ok) {
    throw new Error(result.error || "Không thể tải chỉ số toàn cầu từ CoinMarketCap API");
  }

  return result.data;
}

