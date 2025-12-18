import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, classId } = body;

        // Check if class exists and has capacity
        const cls = await prisma.class.findUnique({
            where: { id: classId },
            include: { bookings: true },
        });

        if (!cls) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        if (cls.bookings.length >= cls.capacity) {
            return NextResponse.json({ error: 'Class is full' }, { status: 400 });
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                classId,
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
