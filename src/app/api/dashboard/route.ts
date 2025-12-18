import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: {
          include: {
            plan: true, // ← ADD THIS LINE
          },
        },
        bookings: {
          where: {
            status: "CONFIRMED",
            class: {
              time: {
                gte: new Date(),
              },
            },
          },
          include: {
            class: true,
          },
          orderBy: {
            class: {
              time: "asc",
            },
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate days remaining
    let daysRemaining = 0;
    if (user.subscription?.endDate) {
      const end = new Date(user.subscription.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    const dashboardData = {
      user: {
        name: user.name,
        membership: user.subscription?.plan?.name || "No Plan", // ← UPDATED
        status: user.subscription?.status || "INACTIVE",
        renewalDate: user.subscription?.endDate
          ? new Date(user.subscription.endDate).toLocaleDateString()
          : "N/A",
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        streak: user.streak,
        weight: user.weight,
        height: user.height,
        lastCheckIn: user.lastCheckIn,
      },
      upcomingClasses: user.bookings.map((booking) => ({
        id: booking.class.id,
        name: booking.class.name,
        time: new Date(booking.class.time).toLocaleString([], {
          dateStyle: "short",
          timeStyle: "short",
        }),
        trainer: booking.class.trainer,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
