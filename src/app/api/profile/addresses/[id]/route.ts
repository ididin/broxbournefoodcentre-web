import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const address = await prisma.address.findUnique({
            where: { id: params.id }
        });

        if (!address) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        if (address.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.address.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Address deletion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
