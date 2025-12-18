import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Create Classes
    const classes = [
        {
            name: 'Morning Flow',
            description: 'Start your day with a calming yoga flow.',
            trainer: 'Sarah',
            time: new Date('2025-01-20T06:00:00Z'),
            duration: 60,
            capacity: 20,
            intensity: 'LOW' as const,
        },
        {
            name: 'HIIT Pulse',
            description: 'High intensity interval training to get your heart pumping.',
            trainer: 'Mike',
            time: new Date('2025-01-20T07:30:00Z'),
            duration: 45,
            capacity: 15,
            intensity: 'HIGH' as const,
        },
        {
            name: 'Power Lift',
            description: 'Strength training focusing on compound movements.',
            trainer: 'John',
            time: new Date('2025-01-20T17:00:00Z'),
            duration: 60,
            capacity: 12,
            intensity: 'HIGH' as const,
        },
        {
            name: 'Evening Yoga',
            description: 'Unwind and stretch after a long day.',
            trainer: 'Sarah',
            time: new Date('2025-01-20T19:00:00Z'),
            duration: 60,
            capacity: 20,
            intensity: 'LOW' as const,
        },
    ]

    for (const cls of classes) {
        const createdClass = await prisma.class.create({
            data: cls,
        })
        console.log(`Created class with id: ${createdClass.id}`)
    }

    // Create Gym Plans
    const plans = [
        {
            name: 'Basic',
            price: 15000,
            features: ['Gym Access', 'Locker Room'],
            duration: 1,
        },
        {
            name: 'Pro',
            price: 35000,
            features: ['Gym Access', 'Locker Room', 'All Classes'],
            duration: 3,
        },
        {
            name: 'Elite',
            price: 120000,
            features: ['Gym Access', 'Locker Room', 'All Classes', 'Personal Trainer (2 sessions/mo)', 'Spa Access'],
            duration: 12,
        },
    ]

    for (const plan of plans) {
        await prisma.gymPlan.upsert({
            where: { id: plan.name.toLowerCase() }, // Using name as ID for simplicity in seed
            update: plan,
            create: {
                id: plan.name.toLowerCase(),
                ...plan
            },
        })
    }
    console.log('Gym plans seeded.');

    // Create Admin User
    const adminPassword = await hash('Admin123$', 10);
    await prisma.user.upsert({
        where: { email: 'admin@pulseflowgym.com' },
        update: {},
        create: {
            email: 'admin@pulseflowgym.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('Admin user seeded.');

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
