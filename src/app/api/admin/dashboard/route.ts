import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const totalMembers = await prisma.user.count({
            where: { role: 'MEMBER' },
        });

        const activeMembers = await prisma.subscription.count({
            where: { status: 'ACTIVE' },
        });

        // Calculate revenue (mock logic based on plan types for now as we don't have full payment history seeded)
        // In a real app, this would sum up the Payment model
        const payments = await prisma.payment.findMany();
        const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        const newSignups = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
                },
                role: 'MEMBER',
            },
        });

        const stats = [
            { label: "Total Members", value: totalMembers.toLocaleString(), change: "N/A" },
            { label: "Active Subscriptions", value: activeMembers.toLocaleString(), change: "N/A" },
            { label: "Total Revenue", value: `₦${revenue.toLocaleString()}`, change: "N/A" },
            { label: "New Signups (7d)", value: newSignups.toLocaleString(), change: "N/A" },
        ];

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
    }
}
