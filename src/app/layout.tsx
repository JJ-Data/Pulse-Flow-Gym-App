import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse & Flow Gym | Akure",
  description: "Premium fitness experience in Akure. Join the movement.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-black text-white pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
