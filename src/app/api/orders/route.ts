import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SquareClient, SquareEnvironment } from 'square';
import crypto from 'crypto';
import { sendOrderNotification } from '@/lib/email';

const isSandbox = process.env.NEXT_PUBLIC_SQUARE_APP_ID?.startsWith('sandbox') || false;

const squareClient = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: isSandbox ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
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
                const response = await squareClient.payments.create({
                    sourceId: squareToken,
                    idempotencyKey: crypto.randomUUID(),
                    amountMoney: {
                        amount: BigInt(Math.round(totalAmount * 100)), // amount in smallest denomination (pence/cents)
                        currency: 'GBP'
                    }
                });
                
                if (response.payment?.status === 'COMPLETED' || response.payment?.status === 'APPROVED') {
                    paymentTransactionId = response.payment.id;
                    initialStatus = 'PROCESSING'; // Payment succeeded, order is now processing
                } else {
                    throw new Error('Payment was not completed');
                }
            } catch (error: any) {
                console.error('Square payment failed:', error);
                
                let errorMessage = 'Payment processing failed';
                if (error.errors && error.errors.length > 0) {
                    errorMessage = error.errors[0].detail || error.errors[0].code;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                return NextResponse.json({ error: errorMessage }, { status: 402 }); // 402 Payment Required
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

        // E-posta bildirimini asenkron olarak gönderelim (kullanıcıyı bekletmemek için await kullanmıyoruz)
        sendOrderNotification(order, items).catch(e => console.error("Failed to send order email:", e));

        return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
