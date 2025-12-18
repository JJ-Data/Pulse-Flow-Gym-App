import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                message,
                user: { connect: { email: session.user.email } },
            },
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }
}

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const feedback = await prisma.feedback.findMany({
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}
