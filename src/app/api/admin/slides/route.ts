import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const slides = await prisma.slide.findMany({
        where: { active: true },
        orderBy: { order: 'asc' }
    });
    return NextResponse.json(slides);
}

export async function POST(req: Request) {
    const data = await req.json();
    const maxOrder = await prisma.slide.aggregate({ _max: { order: true } });
    const slide = await prisma.slide.create({
        data: {
            image: data.image,
            title: data.title,
            subtitle: data.subtitle || '',
            btnText: data.btnText || 'Shop Now',
            href: data.href || '/shop',
            order: (maxOrder._max.order ?? -1) + 1,
        }
    });
    return NextResponse.json(slide);
}

export async function PUT(req: Request) {
    const data = await req.json();
    const slide = await prisma.slide.update({
        where: { id: data.id },
        data: {
            image: data.image,
            title: data.title,
            subtitle: data.subtitle,
            btnText: data.btnText,
            href: data.href,
            order: data.order,
            active: data.active,
        }
    });
    return NextResponse.json(slide);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.slide.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
