/**
 * Base Pay Integration
 * API wrapper for Base Account payments using USDC
 * @see https://docs.base.org/base-account/guides/accept-payments
 */

export interface PaymentRequest {
  amount: string;
  to: string;
  testnet?: boolean;
  customerId?: string;
  items?: any[];
  amountCop?: number;
  payerInfo?: {
    requests: Array<{
      type: string;
      optional?: boolean;
    }>;
    callbackURL?: string;
  };
}

export interface PaymentResponse {
  id: string;
  orderId?: string;
  status: string;
  payerInfoResponses?: {
    email?: string;
    phoneNumber?: {
      number: string;
      country: string;
    };
    physicalAddress?: any;
  };
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
}

/**
 * Initiate a payment through Base Pay
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // In production, this would call the Base Account SDK
    // For now, we'll simulate the API call
    const response = await fetch('/api/base-pay/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Payment failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
}

/**
 * Check payment status
 */
export async function getPaymentStatus(
  id: string,
  testnet: boolean = false
): Promise<PaymentStatus> {
  try {
    const response = await fetch(`/api/base-pay/status/${id}?testnet=${testnet}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}

/**
 * Poll payment status until completion
 */
export async function pollPaymentStatus(
  id: string,
  testnet: boolean = false,
  interval: number = 2000,
  maxAttempts: number = 30
): Promise<PaymentStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getPaymentStatus(id, testnet);

    if (status.status === 'completed') {
      return status;
    }

    if (status.status === 'failed') {
      throw new Error('Payment failed');
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Payment timeout - max attempts reached');
}

/**
 * Format amount for USDC (in USD dollars)
 */
export function formatUSDCAmount(amount: number): string {
  return amount.toFixed(2);
}

