"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                alert("Invalid credentials");
            } else {
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-0" />

            <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2">MEMBER LOGIN</h1>
                    <p className="text-gray-400">Welcome back to the flow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-400 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded bg-black border-white/20 text-[var(--brand-red)] focus:ring-0" />
                            Remember me
                        </label>
                        <Link href="#" className="text-[var(--brand-red)] hover:text-red-400">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--brand-red)] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)] disabled:opacity-50"
                    >
                        {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-white font-bold hover:text-[var(--brand-red)] transition-colors">
                        Join Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
