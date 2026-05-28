import { useState } from "react";
import { 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useAccount
} from "wagmi";
import { parseUnits, Address } from "viem";
import { ERC20_ABI, UNISWAP_V2_ROUTER, UNISWAP_V2_ROUTER_ABI } from "../swap/constants";

export function useUniswapSwap(
  tokenInAddress?: string,
  tokenOutAddress?: string,
  amountIn?: string,
  decimalsIn: number = 18
) {
  const { address: userAddress } = useAccount();
  const [txError, setTxError] = useState<string | null>(null);

  // Parse token amount to BigInt
  const parsedAmount = amountIn && Number(amountIn) > 0 
    ? parseUnits(amountIn, decimalsIn) 
    : 0n;

  // 1. Read allowance of tokenIn for Uniswap V2 Router
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: tokenInAddress as Address,
    functionName: "allowance",
    args: userAddress && tokenInAddress ? [userAddress, UNISWAP_V2_ROUTER as Address] : undefined,
    query: {
      enabled: !!userAddress && !!tokenInAddress && tokenInAddress !== "ETH",
    }
  });

  // Determines if approval is required
  const isApprovalNeeded = 
    tokenInAddress !== "ETH" && 
    allowance !== undefined && 
    allowance < parsedAmount;

  // 2. Write contract for ERC20 Approval
  const { 
    writeContractAsync: approveContract, 
    data: approveHash,
    isPending: isApprovePending 
  } = useWriteContract();

  // 3. Wait for approval transaction receipt
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
    }
  });

  // 4. Write contract for swapping tokens
  const { 
    writeContractAsync: swapContract,
    data: swapHash,
    isPending: isSwapPending 
  } = useWriteContract();

  // 5. Wait for swap transaction receipt
  const { isLoading: isSwapping, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
    hash: swapHash,
    query: {
      enabled: !!swapHash,
    }
  });

  // Execute Token Approval
  const handleApprove = async () => {
    if (!tokenInAddress || parsedAmount === 0n) return;
    setTxError(null);
    try {
      await approveContract({
        abi: ERC20_ABI,
        address: tokenInAddress as Address,
        functionName: "approve",
        args: [UNISWAP_V2_ROUTER as Address, parsedAmount],
      } as any);
      await refetchAllowance();
    } catch (err: any) {
      console.error("Approve failed:", err);
      setTxError(err.message || "Xác thực tokens thất bại");
    }
  };

  // Execute Uniswap Swap
  const handleSwap = async () => {
    if (!userAddress || !tokenInAddress || !tokenOutAddress || parsedAmount === 0n) return;
    setTxError(null);
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes from now
      const path = [tokenInAddress as Address, tokenOutAddress as Address];

      if (tokenInAddress === "ETH") {
        // Swap native ETH for tokens
        await swapContract({
          abi: UNISWAP_V2_ROUTER_ABI,
          address: UNISWAP_V2_ROUTER as Address,
          functionName: "swapExactETHForTokens",
          args: [0n, path, userAddress, deadline],
          value: parsedAmount,
        } as any);
      } else {
        // Swap standard ERC-20 tokens
        await swapContract({
          abi: UNISWAP_V2_ROUTER_ABI,
          address: UNISWAP_V2_ROUTER as Address,
          functionName: "swapExactTokensForTokens",
          args: [parsedAmount, 0n, path, userAddress, deadline],
        } as any);
      }
    } catch (err: any) {
      console.error("Swap failed:", err);
      setTxError(err.message || "Hoán đổi (swap) thất bại");
    }
  };

  return {
    allowance,
    isApprovalNeeded,
    isApprovePending: isApprovePending || isApproving,
    isSwapPending: isSwapPending || isSwapping,
    isSwapSuccess,
    txError,
    approveHash,
    swapHash,
    handleApprove,
    handleSwap,
    refetchAllowance
  };
}
