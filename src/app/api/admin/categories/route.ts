import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { storeOrder: 'asc' },
            include: { children: true }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, slug, parentId, storeOrder } = await req.json();
        const newCategory = await prisma.category.create({
            data: {
                name,
                slug,
                parentId: parentId || null,
                storeOrder: storeOrder || 0
            }
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, name, slug, parentId, storeOrder } = await req.json();
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                parentId: parentId || null,
                storeOrder: storeOrder !== undefined ? storeOrder : undefined
            }
        });
        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
