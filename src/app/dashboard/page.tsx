"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StreakCheckIn from "@/components/StreakCheckIn";

interface DashboardData {
    user: {
        name: string;
        email: string;
        phone: string;
        address: string;
        goals: string;
        membership: string;
        status: string;
        renewalDate: string;
        daysRemaining: number;
        streak: number;
        weight: number | null;
        height: number | null;
    };
    upcomingClasses: {
        id: string;
        name: string;
        time: string;
        trainer: string;
    }[];
}

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    createdAt: string;
}

interface GymPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    duration: number;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    // Profile State
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "",
        phone: "",
        address: "",
        goals: "",
        weight: "",
        height: "",
    });

    // Billing State
    const [payments, setPayments] = useState<Payment[]>([]);
    const [plans, setPlans] = useState<GymPlan[]>([]);
    const [billingLoading, setBillingLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    // Feedback State
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            fetchDashboardData();

            // Handle tab from URL
            const params = new URLSearchParams(window.location.search);
            const tab = params.get("tab");
            if (tab && ["overview", "profile", "billing", "feedback"].includes(tab)) {
                setActiveTab(tab);
            }
        }
    }, [status, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/dashboard");
            if (res.ok) {
                const dashboardData = await res.json();
                setData(dashboardData);
                setProfileForm({
                    name: dashboardData.user.name || "",
                    phone: dashboardData.user.phone || "",
                    address: dashboardData.user.address || "",
                    goals: dashboardData.user.goals || "",
                    weight: dashboardData.user.weight?.toString() || "",
                    height: dashboardData.user.height?.toString() || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBillingData = async () => {
        setBillingLoading(true);
        try {
            const [payRes, planRes] = await Promise.all([
                fetch("/api/billing"),
                fetch("/api/plans")
            ]);
            if (payRes.ok) setPayments(await payRes.json());
            if (planRes.ok) setPlans(await planRes.json());
        } catch (error) {
            console.error("Failed to fetch billing data", error);
        } finally {
            setBillingLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "billing") {
            fetchBillingData();
        }
    }, [activeTab]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileForm),
            });
            if (res.ok) {
                alert("Profile updated successfully!");
                fetchDashboardData();
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setProfileSaving(false);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackLoading(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: feedbackMessage }),
            });
            if (res.ok) {
                alert("Feedback submitted successfully!");
                setFeedbackMessage("");
            }
        } catch (error) {
            console.error("Feedback failed", error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading dashboard...</div>;
    }

    if (!data) return null;

    const tabs = [
        { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        { id: "billing", label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
        { id: "feedback", label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Welcome back, {data.user.name || 'Member'}</h1>
                    <p className="text-gray-400">Ready to crush your goals today?</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        href="/classes"
                        className="bg-[var(--brand-red)] text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                    >
                        Book a Class
                    </Link>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-xl mb-8 max-w-2xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab.id
                            ? "bg-[var(--brand-red)] text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Membership Card */}
                            <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                                </div>
                                <h2 className="text-xl font-bold mb-4 text-gray-300">Membership Status</h2>
                                <div className="mb-2">
                                    <span className="text-3xl font-black text-white">{data.user.membership}</span>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${data.user.status === 'ACTIVE'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {data.user.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-6">Renews on {data.user.renewalDate}</p>

                                <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                                    <div className="bg-[var(--brand-red)] h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-500">{data.user.daysRemaining} days remaining</p>

                                <button onClick={() => setActiveTab("billing")} className="block w-full mt-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-sm text-center">
                                    Manage Subscription
                                </button>
                            </div>

                            {/* Streak Card */}
                            <div className="md:col-span-1">
                                <StreakCheckIn />
                            </div>

                            {/* Upcoming Classes */}
                            <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6 text-gray-300">Upcoming Classes</h2>
                                <div className="space-y-4">
                                    {data.upcomingClasses.map((cls) => (
                                        <div key={cls.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-[var(--brand-red)]/20 rounded-lg flex items-center justify-center text-[var(--brand-red)]">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{cls.name}</h3>
                                                    <p className="text-sm text-gray-400">{cls.time} • with {cls.trainer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {data.upcomingClasses.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">No upcoming classes booked.</p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Workouts</p>
                                    <p className="text-2xl font-black">12</p>
                                </div>
                                <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Calories</p>
                                    <p className="text-2xl font-black">4,250</p>
                                </div>
                                <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Streak</p>
                                    <p className="text-2xl font-black text-[var(--brand-red)]">{data.user.streak} Days</p>
                                </div>
                                <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Weight</p>
                                    <p className="text-2xl font-black">{data.user.weight || '--'}kg</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-4xl">
                            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email (Read Only)</label>
                                        <input
                                            type="email"
                                            value={data.user.email}
                                            disabled
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={profileForm.weight}
                                            onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={profileForm.height}
                                            onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Goals</label>
                                    <textarea
                                        value={profileForm.goals}
                                        onChange={(e) => setProfileForm({ ...profileForm, goals: e.target.value })}
                                        rows={4}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={profileSaving}
                                        className="bg-[var(--brand-red)] text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        {profileSaving ? "SAVING..." : "SAVE CHANGES"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div className="space-y-8">
                            {/* Plan Selection */}
                            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Upgrade or Renew Plan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`p-6 rounded-xl border-2 transition-all cursor-pointer relative ${selectedPlan === plan.id
                                                ? "border-[var(--brand-red)] bg-[var(--brand-red)]/5"
                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            {selectedPlan === plan.id && (
                                                <div className="absolute top-4 right-4 text-[var(--brand-red)]">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                            <p className="text-3xl font-black mb-4">₦{plan.price.toLocaleString()}</p>
                                            <ul className="space-y-2 mb-6">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Duration: {plan.duration} Month(s)</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedPlan && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-8 pt-8 border-t border-white/10"
                                    >
                                        <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                    </div>
                                                    <span className="font-bold">Paystack (Card/Transfer)</span>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <span className="font-bold">Bank Transfer</span>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Payment History */}
                            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6">Payment History</h2>
                                {billingLoading ? (
                                    <div className="text-center py-8 text-gray-400">Loading history...</div>
                                ) : payments.length === 0 ? (
                                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-gray-400">No payment history found.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                                    <th className="pb-4">Date</th>
                                                    <th className="pb-4">Reference</th>
                                                    <th className="pb-4">Amount</th>
                                                    <th className="pb-4 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {payments.map((payment) => (
                                                    <tr key={payment.id} className="group hover:bg-white/5 transition-colors">
                                                        <td className="py-4 text-white font-medium">
                                                            {new Date(payment.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 text-gray-400 font-mono text-xs">
                                                            {payment.reference}
                                                        </td>
                                                        <td className="py-4 text-white font-bold">
                                                            {payment.currency} {payment.amount.toLocaleString()}
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                                }`}>
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "feedback" && (
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-2xl">
                            <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>
                            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                                    <textarea
                                        value={feedbackMessage}
                                        onChange={(e) => setFeedbackMessage(e.target.value)}
                                        rows={6}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)]"
                                        placeholder="Tell us what you think..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={feedbackLoading}
                                    className="w-full bg-[var(--brand-red)] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {feedbackLoading ? "SENDING..." : "SUBMIT FEEDBACK"}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
