"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    weight?: number;
    height?: number;
    streak: number;
    createdAt: string;
    subscription?: {
        plan: { name: string };
        status: string;
    };
}

interface GymPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    duration: number;
    active: boolean;
}

interface Feedback {
    id: string;
    userId: string;
    user: { name: string; email: string };
    message: string;
    createdAt: string;
}

interface Stats {
    label: string;
    value: string;
    change: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'members' | 'plans' | 'feedback'>('members');
    const [users, setUsers] = useState<User[]>([]);
    const [plans, setPlans] = useState<GymPlan[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [stats, setStats] = useState<Stats[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcement, setAnnouncement] = useState({ title: '', content: '' });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            if (session?.user?.role !== 'ADMIN') {
                router.push("/dashboard");
                return;
            }
            fetchData();
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes, plansRes, feedbackRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/dashboard'),
                fetch('/api/admin/plans'),
                fetch('/api/feedback')
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (plansRes.ok) setPlans(await plansRes.json());
            if (feedbackRes.ok) setFeedbacks(await feedbackRes.json());
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) setUsers(users.filter(u => u.id !== id));
        } catch (error) { console.error('Delete failed', error); }
    };

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcement),
            });
            if (res.ok) {
                alert('Announcement posted successfully!');
                setShowAnnouncementModal(false);
                setAnnouncement({ title: '', content: '' });
            }
        } catch (error) { console.error('Post failed', error); }
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading admin portal...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">ADMIN PORTAL</h1>
                    <p className="text-gray-400">Manage your gym, members, and flow.</p>
                </div>
                <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="bg-[var(--brand-red)] text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                >
                    + New Announcement
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-black">{stat.value}</p>
                            <span className="text-green-400 text-sm font-bold">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                {(['members', 'plans', 'feedback'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {activeTab === 'members' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6">Member Management</h2>
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[var(--brand-red)] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">
                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user.name || 'Unnamed'}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-black bg-[var(--brand-red)]/20 text-[var(--brand-red)] border border-[var(--brand-red)]/30">
                                                    {user.subscription?.plan?.name || 'NO PLAN'}
                                                </span>
                                                <p className="text-[10px] text-gray-500 mt-1">STREAK: {user.streak} DAYS</p>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} className="text-red-500 hover:text-red-400 p-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'plans' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Subscription Plans</h2>
                                <button className="text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all">+ Add Plan</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="p-6 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold">{plan.name}</h3>
                                            <span className="text-[var(--brand-red)] font-black">₦{plan.price.toLocaleString()}</span>
                                        </div>
                                        <ul className="text-xs text-gray-400 space-y-2 mb-6">
                                            {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
                                        </ul>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 text-xs bg-white/5 rounded-lg hover:bg-white/10">Edit</button>
                                            <button className="flex-1 py-2 text-xs bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">Disable</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6">Member Feedback</h2>
                            <div className="space-y-4">
                                {feedbacks.map((f) => (
                                    <div key={f.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-sm">{f.user.name}</span>
                                            <span className="text-[10px] text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 italic">"{f.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Member Details */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10 h-fit">
                    <h2 className="text-xl font-bold mb-6">Member Insights</h2>
                    {selectedUser ? (
                        <div className="space-y-6">
                            <div className="text-center pb-6 border-b border-white/10">
                                <div className="h-20 w-20 bg-[var(--brand-red)] rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black">
                                    {selectedUser.name?.[0] || 'U'}
                                </div>
                                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-xl text-center">
                                    <p className="text-[10px] text-gray-500 uppercase">Weight</p>
                                    <p className="font-bold">{selectedUser.weight || '--'} kg</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl text-center">
                                    <p className="text-[10px] text-gray-500 uppercase">Height</p>
                                    <p className="font-bold">{selectedUser.height || '--'} cm</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl text-center col-span-2">
                                    <p className="text-[10px] text-gray-500 uppercase">Current Streak</p>
                                    <p className="text-2xl font-black text-[var(--brand-red)]">{selectedUser.streak} DAYS 🔥</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all text-sm">
                                View Full History
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-12 italic">Select a member to view their progress and stats.</p>
                    )}
                </div>
            </div>

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">New Announcement</h2>
                        <form onSubmit={handlePostAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={announcement.title}
                                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                                <textarea
                                    value={announcement.content}
                                    onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="flex-1 py-3 rounded-lg font-bold border border-white/20 hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-[var(--brand-red)] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
