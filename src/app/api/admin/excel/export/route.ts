import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { categoryRef: true },
            orderBy: { storeOrder: 'asc' }
        });

        const data = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            brand: p.brand || '',
            categoryName: p.categoryRef ? p.categoryRef.name : p.category,
            categoryId: p.categoryId || '',
            imageUrl: p.imageUrl || '',
            stockOut: p.stockOut ? 'YES' : 'NO',
            storeOrder: p.storeOrder
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Products");

        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="products_export.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to export excel' }, { status: 500 });
    }
}
