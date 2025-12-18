"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StreakCheckIn() {
    const [streak, setStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);

    const fetchStreak = async () => {
        try {
            const res = await fetch('/api/streak');
            if (res.ok) {
                const data = await res.json();
                setStreak(data.streak);
                setLastCheckIn(data.lastCheckIn);
            }
        } catch (error) {
            console.error('Failed to fetch streak', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreak();
    }, []);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            const res = await fetch('/api/streak', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setStreak(data.streak);
                setLastCheckIn(new Date().toISOString());
                alert('Checked in! Keep the fire burning! 🔥');
            } else {
                alert(data.message || data.error);
            }
        } catch (error) {
            console.error('Check-in failed', error);
        } finally {
            setCheckingIn(false);
        }
    };

    const isToday = (dateString: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    if (loading) return <div className="animate-pulse h-24 bg-white/5 rounded-2xl"></div>;

    const checkedInToday = isToday(lastCheckIn);

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-[var(--brand-red)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.26-3.59-.39-5.19-2.42 1.14-3.91 4.1-3.25 6.83.02.1.04.2.04.3 0 1.17-.93 2.1-2.1 2.1-.17 0-.34-.03-.49-.08.84 2.24 2.96 3.82 5.44 3.82 3.31 0 6-2.69 6-6 0-.59-.09-1.15-.25-1.68.22.33.41.69.57 1.07.27.64.38 1.32.33 2.02-.05.65-.25 1.27-.57 1.83-.32.55-.77 1.02-1.31 1.35-.54.33-1.16.53-1.8.58-.64.05-1.28-.05-1.87-.29-.59-.24-1.11-.61-1.52-1.08-.41-.47-.7-1.03-.84-1.64-.14-.61-.14-1.25 0-1.86.14-.61.43-1.17.84-1.64.41-.47.93-.84 1.52-1.08.59-.24 1.23-.34 1.87-.29.64.05 1.26.25 1.8.58.54.33.99.8 1.31 1.35.32.56.52 1.18.57 1.83.05.7-.06 1.38-.33 2.02-.16.38-.35.74-.57 1.07.16.53.25 1.09.25 1.68 0 3.31-2.69 6-6 6-2.48 0-4.6-1.58-5.44-3.82.15.05.32.08.49.08 1.17 0 2.1-.93 2.1-2.1 0-.1-.02-.2-.04-.3-.66-2.73.83-5.69 3.25-6.83-.87 1.6-.71 3.76.39 5.19.05.07.09.12.15.17.17.16.41.22.64.12.2-.08.35-.28.35-.5 0-.13-.04-.23-.08-.33-1.22-3.15-.2-6.82 2.39-8.9.71-.57 1.54-1.09 2.49-1.32-.95 1.85-.62 4.26.87 5.72.64.63 1.4 1.06 2.07 1.66.26.26.54.52.77.82.26.34.45.71.57 1.1.12.39.18.8.18 1.22 0 .42-.06.83-.18 1.22-.12.39-.31.76-.57 1.1z" />
                </svg>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">GYM STREAK</h3>
                    <p className="text-gray-400 text-sm">Don't break the chain!</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-black text-[var(--brand-red)] neon-text">{streak}</span>
                    <span className="text-xs text-gray-500 block">DAYS</span>
                </div>
            </div>

            <button
                onClick={handleCheckIn}
                disabled={checkedInToday || checkingIn}
                className={`w-full py-3 rounded-xl font-bold transition-all ${checkedInToday
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30 cursor-default'
                        : 'bg-[var(--brand-red)] text-white hover:bg-red-700 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:scale-[1.02]'
                    } disabled:opacity-70`}
            >
                {checkingIn ? 'CHECKING IN...' : checkedInToday ? 'CHECKED IN TODAY' : 'CHECK IN NOW'}
            </button>

            {streak > 0 && (
                <div className="mt-4 flex gap-1">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${i < (streak % 7 || 7) ? 'bg-[var(--brand-red)]' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
