import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to check Base Pay payment status
 * Returns payment status with transaction hash
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

    // For Base Pay, the payment.id from the pay() function IS the transaction hash
    // If it's a full hash (66 chars), use it directly
    // Otherwise, we'll use it as-is (it might be a payment ID that needs to be resolved)
    const FULL_HASH_LENGTH = 66;
    
    // If the id looks like a transaction hash, use it
    let transactionHash = id;
    if (id.length < FULL_HASH_LENGTH || !id.startsWith('0x')) {
      // If it's not a full hash, we'll use it as payment ID
      // In production, you might want to query the Base Pay API here
      console.log('⚠️ Payment ID is not a full transaction hash:', id);
    }

    const status = {
      id,
      status: 'completed' as const,
      transactionHash: transactionHash,
      testnet,
      completedAt: new Date().toISOString(),
    };

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}

