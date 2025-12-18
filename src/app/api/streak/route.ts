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
                streak: true,
                lastCheckIn: true,
                streakLogs: {
                    orderBy: { date: 'desc' },
                    take: 30,
                },
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
    }
}

export async function POST() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastCheckIn = user.lastCheckIn ? new Date(user.lastCheckIn) : null;
        if (lastCheckIn) {
            lastCheckIn.setHours(0, 0, 0, 0);
        }

        // Check if already checked in today
        if (lastCheckIn && lastCheckIn.getTime() === today.getTime()) {
            return NextResponse.json({ message: 'Already checked in today' }, { status: 400 });
        }

        let newStreak = 1;
        if (lastCheckIn) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastCheckIn.getTime() === yesterday.getTime()) {
                newStreak = user.streak + 1;
            }
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                streak: newStreak,
                lastCheckIn: today,
                streakLogs: {
                    create: {
                        date: today,
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Check-in successful!',
            streak: updatedUser.streak,
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
    }
}
