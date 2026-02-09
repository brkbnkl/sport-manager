import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";

import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
});

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});


export const metadata: Metadata = {
    title: "FitTrack Pro",
    description: "Personalized Workout Planner",
    keywords: "fitness, workout, exercise, gym, training, health",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${outfit.variable} ${inter.variable} font-inter antialiased`}>{children}</body>
        </html>
    );
}
