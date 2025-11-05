/**
 * Helper functions for interacting with Base network using ethers
 */

import { ethers } from 'ethers';

/**
 * Get RPC URL for Base network (testnet or mainnet)
 */
function getBaseRpcUrl(testnet: boolean): string {
  if (testnet) {
    return 'https://sepolia.base.org';
  }
  return 'https://mainnet.base.org';
}

/**
 * Wait for transaction confirmation and return the full transaction hash
 * @param txHashOrId - Transaction hash or payment ID from Base Pay
 * @param testnet - Whether to use testnet
 * @param timeout - Maximum time to wait in milliseconds (default: 60 seconds)
 * @returns Full transaction hash (66 characters)
 */
export async function waitForTransactionHash(
  txHashOrId: string,
  testnet: boolean = true,
  timeout: number = 60000
): Promise<string> {
  try {
    const rpcUrl = getBaseRpcUrl(testnet);
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    console.log('🔍 Waiting for transaction confirmation:', {
      txHashOrId,
      rpcUrl,
      testnet,
    });

    // If it's already a full hash (66 chars), return it directly
    if (txHashOrId.length === 66 && txHashOrId.startsWith('0x')) {
      console.log('✅ Already a full transaction hash:', txHashOrId);
      
      // Verify it exists on-chain
      try {
        const tx = await provider.getTransaction(txHashOrId);
        if (tx) {
          console.log('✅ Transaction found on-chain:', txHashOrId);
          return txHashOrId;
        }
      } catch (e) {
        console.warn('⚠️ Transaction not found on-chain yet, waiting...');
      }
    }

    // Wait for transaction confirmation
    // Base Pay payment.id might be the transaction hash, so try it first
    let receipt = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max
    const pollInterval = 2000; // 2 seconds

    while (attempts < maxAttempts && !receipt) {
      try {
        // Try to get transaction receipt
        receipt = await provider.getTransactionReceipt(txHashOrId);
        
        if (receipt) {
          console.log('✅ Transaction confirmed:', {
            hash: receipt.hash,
            blockNumber: receipt.blockNumber,
            confirmations: receipt.confirmations || 0,
          });
          return receipt.hash;
        }
      } catch (error: any) {
        // Transaction not found yet, continue polling
        if (error.code !== 'CALL_EXCEPTION') {
          console.warn(`⚠️ Attempt ${attempts + 1}: Error checking transaction:`, error.message);
        }
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    // If we still don't have a receipt, try using waitForTransaction
    if (!receipt) {
      console.log('⏳ Using waitForTransaction...');
      try {
        const receiptFromWait = await provider.waitForTransaction(txHashOrId, 1, timeout);
        if (receiptFromWait && receiptFromWait.hash) {
          console.log('✅ Transaction confirmed via waitForTransaction:', receiptFromWait.hash);
          return receiptFromWait.hash;
        }
      } catch (waitError: any) {
        console.error('❌ Error waiting for transaction:', waitError.message);
      }
    }

    // Fallback: return the original hash/ID if we couldn't get confirmation
    console.warn('⚠️ Could not get transaction receipt, using original hash/ID:', txHashOrId);
    return txHashOrId;
  } catch (error: any) {
    console.error('❌ Error in waitForTransactionHash:', error);
    // Return original hash/ID as fallback
    return txHashOrId;
  }
}

/**
 * Get transaction details from Base network
 */
export async function getTransactionDetails(
  txHash: string,
  testnet: boolean = true
): Promise<ethers.TransactionResponse | null> {
  try {
    const rpcUrl = getBaseRpcUrl(testnet);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const tx = await provider.getTransaction(txHash);
    return tx;
  } catch (error) {
    console.error('❌ Error getting transaction details:', error);
    return null;
  }
}

