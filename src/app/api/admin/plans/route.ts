import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const plans = await prisma.gymPlan.findMany({
            orderBy: { price: 'asc' },
        });
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, price, features, duration } = body;

        const plan = await prisma.gymPlan.create({
            data: {
                name,
                price: parseFloat(price),
                features,
                duration: parseInt(duration),
            },
        });

        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, price, features, duration, active } = body;

        const plan = await prisma.gymPlan.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                features,
                duration: parseInt(duration),
                active,
            },
        });

        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
        }

        await prisma.gymPlan.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
