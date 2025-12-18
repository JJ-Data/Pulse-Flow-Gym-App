"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/dashboard?tab=feedback");
    }, [router]);
    return null;
}
