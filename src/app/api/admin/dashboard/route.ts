import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [
            totalProducts,
            totalUsers,
            activeOrders,
            allOrders,
            recentOrders
        ] = await Promise.all([
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.count({
                where: { status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] } }
            }),
            prisma.order.findMany({
                where: { status: { not: 'CANCELLED' } },
                select: { totalAmount: true }
            }),
            prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: true }
            })
        ]);

        const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

        return NextResponse.json({
            stats: [
                { label: 'Total Revenue', value: `£${totalRevenue.toFixed(2)}`, type: 'revenue' },
                { label: 'Active Orders', value: activeOrders.toString(), type: 'orders' },
                { label: 'Total Products', value: totalProducts.toString(), type: 'products' },
                { label: 'Registered Users', value: totalUsers.toString(), type: 'users' },
            ],
            recentActivity: recentOrders.map((order: any) => ({
                id: order.id,
                title: `New Order #${order.id}`,
                subtitle: `Placed on ${new Date(order.createdAt).toLocaleDateString()} by ${order.user ? order.user.name : order.guestEmail}`,
                value: `£${order.totalAmount.toFixed(2)}`
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
