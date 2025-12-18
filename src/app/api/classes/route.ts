import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const classes = await prisma.class.findMany({
            orderBy: {
                time: 'asc',
            },
        });
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, trainer, time, duration, capacity, intensity } = body;

        const newClass = await prisma.class.create({
            data: {
                name,
                trainer,
                time: new Date(time),
                duration: parseInt(duration),
                capacity: parseInt(capacity),
                intensity,
            },
        });

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (data.time) data.time = new Date(data.time);
        if (data.duration) data.duration = parseInt(data.duration);
        if (data.capacity) data.capacity = parseInt(data.capacity);

        const updatedClass = await prisma.class.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedClass);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
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
            return NextResponse.json({ error: 'Class ID required' }, { status: 400 });
        }

        await prisma.class.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
    }
}
