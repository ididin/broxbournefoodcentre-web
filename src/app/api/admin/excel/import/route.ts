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
            const { id, name, description, price, sellType, variants, brand, barcode, categoryName, categoryId, imageUrl, stockOut, storeOrder } = row;

            let parsedVariants: any[] = [];
            if (variants && typeof variants === 'string') {
                const parts = variants.split('|');
                parsedVariants = parts.map((part, index) => {
                    const [label, priceStr] = part.split(':');
                    return { weightLabel: label.trim(), price: Number(priceStr), sortOrder: index };
                }).filter(v => v.weightLabel && !isNaN(v.price));
            }

            const productData: any = {
                name: String(name),
                description: description ? String(description) : null,
                price: Number(price),
                sellType: sellType === 'WEIGHT' ? 'WEIGHT' : 'PIECE',
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
                    // Update the product first without variants
                    await prisma.product.update({
                        where: { id: String(id) },
                        data: productData
                    });

                    // Manage variants
                    if (productData.sellType === 'WEIGHT') {
                        // delete existing variants
                        await prisma.productVariant.deleteMany({
                            where: { productId: String(id) }
                        });
                        // create new ones
                        if (parsedVariants.length > 0) {
                            await prisma.productVariant.createMany({
                                data: parsedVariants.map(v => ({
                                    ...v,
                                    productId: String(id)
                                }))
                            });
                        }
                    } else {
                        // if piece, ensure no variants
                        await prisma.productVariant.deleteMany({
                            where: { productId: String(id) }
                        });
                    }
                    updatedCount++;
                } catch (e) {
                    console.error(`Failed to update product ${id}`, e);
                }
            } else {
                // Create new
                const createdProduct = await prisma.product.create({ data: productData });
                if (productData.sellType === 'WEIGHT' && parsedVariants.length > 0) {
                    await prisma.productVariant.createMany({
                        data: parsedVariants.map(v => ({
                            ...v,
                            productId: createdProduct.id
                        }))
                    });
                }
                createdCount++;
            }
        }

        return NextResponse.json({ success: true, updatedCount, createdCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to import excel' }, { status: 500 });
    }
}
