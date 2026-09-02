import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { guestEmail, deliveryAddress, deliveryTimePref, paymentMethod, totalAmount, items } = body;

        // Basic validation
        if (!deliveryAddress || !totalAmount || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields or empty cart' }, { status: 400 });
        }

        // Map PaymentMethod string to Enum
        const mappedPaymentMethod = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD_ON_DELIVERY' : 'CASH_ON_DELIVERY';

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

        // Create the order and associated order items in a transaction
        const order = await prisma.order.create({
            data: {
                orderNumber,
                guestEmail,
                deliveryAddress,
                deliveryTimePref,
                paymentMethod: mappedPaymentMethod,
                totalAmount: Number(totalAmount),
                status: 'PENDING',
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
