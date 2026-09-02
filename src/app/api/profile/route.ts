import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                addresses: {
                    orderBy: { createdAt: 'desc' }
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        orderItems: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // We only want to return safe info to client
        const profile = {
            id: user.id,
            name: user.name,
            email: user.email,
            addresses: user.addresses,
            orders: user.orders
        };

        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, addressLine, postalCode, city } = body;

        const newAddress = await prisma.address.create({
            data: {
                userId: session.user.id,
                title: title || 'Other',
                addressLine,
                postalCode,
                city
            }
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        console.error('Address creation error:', error);
        return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
    }
}
