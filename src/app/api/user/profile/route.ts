import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                goals: true,
                phone: true,
                address: true,
                weight: true,
                height: true,
                role: true,
                streak: true,
                lastCheckIn: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, goals, phone, address } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                goals,
                phone,
                address,
                weight: body.weight ? parseFloat(body.weight) : undefined,
                height: body.height ? parseFloat(body.height) : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                goals: true,
                phone: true,
                address: true,
                role: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
