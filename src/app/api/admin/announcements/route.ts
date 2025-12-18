import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content } = body;

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
            },
        });

        return NextResponse.json(announcement);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to post announcement' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return NextResponse.json(announcements);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }
}
