"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Notifications from './Notifications';

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="relative h-12 w-48 block">
                            <Image
                                src="/logo.png"
                                alt="Pulse & Flow Fitness"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link href="/classes" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Classes
                            </Link>

                            {session ? (
                                <>
                                    {session.user?.role === 'MEMBER' && (
                                        <>
                                            <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                                Dashboard
                                            </Link>
                                            <Notifications />
                                        </>
                                    )}
                                    {session.user?.role === 'ADMIN' && (
                                        <Link href="/admin" className="text-[var(--brand-red)] hover:text-red-400 px-3 py-2 rounded-md text-sm font-bold transition-colors">
                                            Admin Portal
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/20 transition-all"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="bg-[var(--brand-red)] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                                    Member Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass-panel border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link href="/classes" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Classes</Link>
                        {session ? (
                            <>
                                {session.user?.role === 'MEMBER' && (
                                    <>
                                        <Link href="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                    </>
                                )}
                                {session.user?.role === 'ADMIN' && (
                                    <Link href="/admin" className="text-[var(--brand-red)] hover:text-red-400 block px-3 py-2 rounded-md text-base font-bold">Admin Portal</Link>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="text-[var(--brand-red)] font-bold block px-3 py-2 rounded-md text-base">Member Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
