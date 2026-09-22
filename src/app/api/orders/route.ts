import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Client, Environment } from 'square';
import crypto from 'crypto';

const squareClient = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        const body = await req.json();
        const { guestEmail, deliveryAddress, deliveryTimePref, paymentMethod, totalAmount, items, squareToken } = body;

        // Basic validation
        if (!deliveryAddress || !totalAmount || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields or empty cart' }, { status: 400 });
        }

        let mappedPaymentMethod = 'CASH_ON_DELIVERY';
        if (paymentMethod === 'CREDIT_CARD') mappedPaymentMethod = 'CREDIT_CARD_ON_DELIVERY';
        if (paymentMethod === 'SQUARE_ONLINE') mappedPaymentMethod = 'SQUARE_ONLINE';

        // Generate a random 8-character uppercase alphanumeric string for the order number
        const generateOrderNumber = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return `ORD-${result}`;
        };

        const orderNumber = generateOrderNumber();
        
        let paymentTransactionId = null;
        let initialStatus = 'PENDING';

        // Process Square Payment if selected
        if (mappedPaymentMethod === 'SQUARE_ONLINE') {
            if (!squareToken) {
                return NextResponse.json({ error: 'Payment token is missing' }, { status: 400 });
            }
            try {
                const response = await squareClient.paymentsApi.createPayment({
                    sourceId: squareToken,
                    idempotencyKey: crypto.randomUUID(),
                    amountMoney: {
                        amount: BigInt(Math.round(totalAmount * 100)), // amount in smallest denomination (pence/cents)
                        currency: 'GBP'
                    }
                });
                
                if (response.result.payment?.status === 'COMPLETED' || response.result.payment?.status === 'APPROVED') {
                    paymentTransactionId = response.result.payment.id;
                    initialStatus = 'PROCESSING'; // Payment succeeded, order is now processing
                } else {
                    throw new Error('Payment was not completed');
                }
            } catch (error) {
                console.error('Square payment failed:', error);
                return NextResponse.json({ error: 'Payment processing failed' }, { status: 402 }); // 402 Payment Required
            }
        }

        // Create the order and associated order items in a transaction
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                guestEmail: userId ? null : guestEmail,
                deliveryAddress,
                deliveryTimePref,
                paymentMethod: mappedPaymentMethod as any,
                paymentTransactionId,
                totalAmount: Number(totalAmount),
                status: initialStatus as any,
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.productId || item.id,
                        variantName: item.variantName || null,
                        quantity: item.quantity,
                        priceAtBuy: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
