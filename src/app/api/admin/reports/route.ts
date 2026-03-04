import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { startDate, endDate, product, brand, category } = await req.json();

        // Base where clause for orders within date range
        const whereClause: any = {
            status: { not: 'CANCELLED' } // Only count valid orders
        };

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.createdAt.lte = end;
            }
        }

        // Fetch valid orders matching date
        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Calculate statistics based on the filters
        let totalRevenue = 0;
        let totalItemsSold = 0;
        let matchingOrdersCount = new Set<string>();

        const itemSales: Record<string, { name: string, quantity: number, revenue: number }> = {};

        orders.forEach((order: any) => {
            let orderHasMatch = false;

            order.orderItems.forEach((item: any) => {
                const p = item.product;

                // Apply filters
                if (product && !p.name.toLowerCase().includes(product.toLowerCase())) return;
                if (brand && p.brand !== brand) return;
                if (category && p.category !== category && p.categoryId !== category) return; // Support both legacy string && new relations

                orderHasMatch = true;

                const itemRevenue = item.quantity * item.priceAtBuy;
                totalRevenue += itemRevenue;
                totalItemsSold += item.quantity;

                if (!itemSales[p.id]) {
                    itemSales[p.id] = { name: p.name, quantity: 0, revenue: 0 };
                }
                itemSales[p.id].quantity += item.quantity;
                itemSales[p.id].revenue += itemRevenue;
            });

            if (orderHasMatch) {
                matchingOrdersCount.add(order.id);
            }
        });

        // Convert grouped items to array and sort by revenue
        const topProducts = Object.values(itemSales).sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            filtersApplied: { startDate, endDate, product, brand, category },
            summary: {
                totalRevenue,
                totalItemsSold,
                totalOrders: matchingOrdersCount.size,
            },
            topProducts: topProducts.slice(0, 50) // Return top 50 matches
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
