import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FitTrack Pro - Your Personal Workout Manager",
    description: "Track your workouts, monitor progress, and achieve your fitness goals with personalized workout plans.",
    keywords: "fitness, workout, exercise, gym, training, health",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
