"use client";

import { useState } from "react";

export default function Checkout() {
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        // Mock Paystack initialization
        setTimeout(() => {
            alert("Redirecting to Paystack...");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg glass-panel p-8 rounded-2xl border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2">SECURE CHECKOUT</h1>
                    <p className="text-gray-400">Complete your subscription to Pulse & Flow.</p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/5 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300">Plan</span>
                        <span className="font-bold text-xl">Monthly Access</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300">Duration</span>
                        <span className="font-bold">30 Days</span>
                    </div>
                    <div className="border-t border-white/10 my-4"></div>
                    <div className="flex justify-between items-center text-[var(--brand-red)]">
                        <span className="font-bold">Total</span>
                        <span className="font-black text-2xl">₦15,000</span>
                    </div>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Card Details</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] transition-all"
                                placeholder="0000 0000 0000 0000"
                            />
                            <svg className="w-6 h-6 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] transition-all"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] transition-all"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-[#3BB75E] text-white py-4 rounded-lg font-bold hover:bg-[#32a852] transition-all shadow-[0_0_20px_rgba(59,183,94,0.4)] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                PAY ₦15,000
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Secured by <span className="font-bold text-white">Paystack</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
