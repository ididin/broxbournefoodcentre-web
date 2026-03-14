import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const wb = XLSX.read(buffer, { type: 'buffer' });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        let updatedCount = 0;
        let createdCount = 0;

        for (const row of data) {
            const { id, name, description, price, brand, barcode, categoryName, categoryId, imageUrl, stockOut, storeOrder } = row;

            const productData = {
                name: String(name),
                description: description ? String(description) : null,
                price: Number(price),
                brand: brand ? String(brand) : null,
                barcode: barcode ? String(barcode) : null,
                category: categoryName ? String(categoryName) : 'Uncategorized',
                categoryId: categoryId ? String(categoryId) : null,
                imageUrl: imageUrl ? String(imageUrl) : null,
                stockOut: stockOut === 'YES' || stockOut === true,
                storeOrder: Number(storeOrder) || 0
            };

            if (id) {
                // Update existing
                try {
                    await prisma.product.update({
                        where: { id: String(id) },
                        data: productData
                    });
                    updatedCount++;
                } catch (e) {
                    console.error(`Failed to update product ${id}`, e);
                }
            } else {
                // Create new
                await prisma.product.create({ data: productData });
                createdCount++;
            }
        }

        return NextResponse.json({ success: true, updatedCount, createdCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to import excel' }, { status: 500 });
    }
}
