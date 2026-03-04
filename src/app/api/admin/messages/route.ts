import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, isRead } = await req.json();
        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { isRead }
        });
        return NextResponse.json(updatedMessage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}
