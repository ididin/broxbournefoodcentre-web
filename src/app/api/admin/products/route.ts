import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { storeOrder: 'asc' },
            include: { categoryRef: true }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, price, imageUrl, category, categoryId, brand, stockOut, storeOrder } = body;
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                imageUrl,
                category,
                categoryId,
                brand,
                stockOut: stockOut || false,
                storeOrder: storeOrder || 0
            }
        });
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, description, price, imageUrl, category, categoryId, brand, stockOut, storeOrder } = body;
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: Number(price),
                imageUrl,
                category,
                categoryId,
                brand,
                stockOut: stockOut !== undefined ? stockOut : undefined,
                storeOrder: storeOrder !== undefined ? storeOrder : undefined
            }
        });
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
