"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function Notifications() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch('/api/admin/announcements');
                if (res.ok) {
                    const data = await res.json();
                    setAnnouncements(data);
                    // For simplicity, we'll just count all as unread if the dropdown hasn't been opened
                    setUnreadCount(data.length);
                }
            } catch (error) {
                console.error('Failed to fetch announcements', error);
            }
        };

        fetchAnnouncements();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setUnreadCount(0);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white flex items-center justify-center border-2 border-black">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-white">Announcements</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {announcements.length > 0 ? (
                                    announcements.map((ann) => (
                                        <div key={ann.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <h4 className="font-bold text-sm text-[var(--brand-red)] mb-1">{ann.title}</h4>
                                            <p className="text-xs text-gray-400 line-clamp-2">{ann.content}</p>
                                            <span className="text-[10px] text-gray-600 mt-2 block">
                                                {new Date(ann.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm italic">
                                        No new announcements.
                                    </div>
                                )}
                            </div>
                            <div className="p-3 text-center bg-white/5">
                                <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest">
                                    View All
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
