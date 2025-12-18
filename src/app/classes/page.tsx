"use client";

import { useState, useEffect } from 'react';

interface ClassType {
    id: string;
    name: string;
    time: string;
    duration: number;
    trainer: string;
    intensity: 'LOW' | 'MEDIUM' | 'HIGH';
    capacity: number;
    bookings: any[];
}

export default function Classes() {
    const [classes, setClasses] = useState<ClassType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch('/api/classes');
                if (res.ok) {
                    const data = await res.json();
                    setClasses(data);
                }
            } catch (error) {
                console.error('Failed to fetch classes', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const handleBook = async (classId: string) => {
        // Mock user ID for now (would come from auth session)
        const userId = "user_123";

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, classId }),
            });

            if (res.ok) {
                alert('Class booked successfully!');
                // Refresh classes to update capacity
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to book class');
            }
        } catch (error) {
            console.error('Booking failed', error);
            alert('Something went wrong');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading schedule...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black mb-4">CLASS SCHEDULE</h1>
                <p className="text-xl text-gray-400">Book your spot and find your rhythm.</p>
            </div>

            <div className="grid gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between group hover:border-[var(--brand-red)] transition-all">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="text-center min-w-[80px]">
                                <p className="text-lg font-bold text-white">
                                    {new Date(cls.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm text-gray-500">{cls.duration} min</p>
                            </div>
                            <div className="h-12 w-1 bg-white/10 rounded-full hidden md:block"></div>
                            <div>
                                <h3 className="text-2xl font-bold group-hover:text-[var(--brand-red)] transition-colors">{cls.name}</h3>
                                <p className="text-gray-400">with {cls.trainer} • <span className={cls.intensity === 'HIGH' ? 'text-red-400' : 'text-green-400'}>{cls.intensity} Intensity</span></p>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-between md:justify-end gap-6">
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Available Spots</p>
                                <p className={`text-xl font-bold ${cls.capacity === 0 ? 'text-red-500' : 'text-white'}`}>
                                    {cls.capacity === 0 ? 'FULL' : cls.capacity}
                                </p>
                            </div>
                            <button
                                onClick={() => handleBook(cls.id)}
                                disabled={cls.capacity === 0}
                                className={`px-8 py-3 rounded-full font-bold transition-all ${cls.capacity === 0
                                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-[var(--brand-red)] hover:text-white hover:scale-105'
                                    }`}
                            >
                                {cls.capacity === 0 ? 'Waitlist' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
