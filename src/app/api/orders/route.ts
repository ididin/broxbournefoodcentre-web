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

        // Create the order and associated order items in a transaction
        const order = await prisma.order.create({
            data: {
                guestEmail,
                deliveryAddress,
                deliveryTimePref,
                paymentMethod: mappedPaymentMethod,
                totalAmount: Number(totalAmount),
                status: 'PENDING',
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceAtBuy: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
