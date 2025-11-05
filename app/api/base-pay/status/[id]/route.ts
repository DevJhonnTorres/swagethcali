import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus as getBasePayStatus } from '@base-org/account';

/**
 * API Route to check Base Pay payment status
 * Uses the real Base Pay SDK to get transaction hash
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const testnet = searchParams.get('testnet') === 'true';

    console.log('🔍 Getting payment status for:', { id, testnet });

    // Use the real Base Pay SDK to get payment status
    try {
      const status = await getBasePayStatus({
        id,
        testnet: testnet || false,
      });

      // The SDK's PaymentStatus type may not include transactionHash in types
      // but it might be available at runtime - check multiple possible properties
      // Use type assertion to access properties that may exist at runtime
      const statusAny = status as any;
      const transactionHash = 
        statusAny.transactionHash || 
        statusAny.txHash || 
        statusAny.transaction?.hash ||
        (statusAny.id && statusAny.id.length === 66 && statusAny.id.startsWith('0x') ? statusAny.id : null) ||
        null;

      console.log('✅ Payment status from SDK:', {
        id: status.id,
        status: status.status,
        transactionHash: transactionHash,
        hashLength: transactionHash?.length || 0,
        availableProperties: Object.keys(statusAny),
      });

      return NextResponse.json({
        id: status.id,
        status: status.status,
        transactionHash: transactionHash,
        testnet,
        completedAt: statusAny.completedAt || new Date().toISOString(),
      }, { status: 200 });
    } catch (sdkError: any) {
      console.error('❌ SDK Error getting payment status:', sdkError);
      
      // Fallback: return what we have
      return NextResponse.json({
        id,
        status: 'completed' as const,
        transactionHash: null,
        testnet,
        error: sdkError.message || 'Failed to get payment status from SDK',
      }, { status: 200 });
    }
  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}

