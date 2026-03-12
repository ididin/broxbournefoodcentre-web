import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    let banner = await prisma.promoBanner.findFirst();
    if (!banner) {
        // Return default if not seeded yet
        banner = await prisma.promoBanner.create({
            data: {
                heading: 'Fast Delivery in Broxbourne',
                subtext: 'We deliver your favorite groceries and house essentials within 24 hours right to your doorstep. Guaranteed freshness.',
                btnText: 'Start Shopping Now',
                btnHref: '/shop',
                image: '/delivery-banner.png',
            }
        });
    }
    return NextResponse.json(banner);
}

export async function PUT(req: Request) {
    const data = await req.json();
    const existing = await prisma.promoBanner.findFirst();
    
    let banner;
    if (existing) {
        banner = await prisma.promoBanner.update({
            where: { id: existing.id },
            data: {
                heading: data.heading,
                subtext: data.subtext,
                btnText: data.btnText,
                btnHref: data.btnHref,
                image: data.image,
            }
        });
    } else {
        banner = await prisma.promoBanner.create({ data });
    }
    return NextResponse.json(banner);
}
